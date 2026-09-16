import React, { useState, useEffect } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  Sparkles, 
  Check 
} from 'lucide-react';
import { Package } from '../../types';
import { formatRupiah } from '../../utils/formatters';

interface PackageFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (pkg: Package) => void;
  initialData?: Package | null;
}

const DEFAULT_PRESET_PHOTOS = [
  {
    label: 'Wedding Akad & Resepsi',
    url: '/images/packages/wedding-akad-resepsi.jpg',
  },
  {
    label: 'Ngunduh Mantu',
    url: '/images/packages/ngunduh-mantu.jpg',
  },
  {
    label: 'Pengantin Akad Resepsi',
    url: '/images/packages/pengantin-akad-resepsi.jpg',
  },
  {
    label: 'Pengantin Resepsi Only',
    url: '/images/packages/pengantin-resepsi-only.jpg',
  },
  {
    label: 'Akad package',
    url: '/images/packages/akad-package.jpg',
  },
  {
    label: 'Siraman package',
    url: '/images/packages/siraman-package.jpg',
  },
  {
    label: 'Sunda Siger',
    url: '/images/packages/akad-sunda-siger.jpg',
  },
  {
    label: 'Hijab Glam Modern',
    url: '/images/packages/pengantin-hijab-glam.jpg',
  }
];

const SUGGESTED_FACILITIES = [
  'Makeup & Hairdo/Hijabdo Pengantin Wanita',
  'Rias & Busana Pengantin Pria (Beskap/Jas)',
  'Aksesoris & Ronce Melati Asli',
  'Retouch Makeup 1 kali saat acara',
  'Makeup & Busana untuk 2 Ibu Mempelai',
  'Busana Beskap untuk 2 Bapak Mempelai',
  'Makeup & Busana 4 Pagar Ayu / Jaga Kado',
  'Standby MUA & Tim Asisten selama acara',
  'Free softlens & kuku palsu (fake nails)',
  'Prosesi Siraman & Perlengkapan Adat Lengkap'
];

export const PackageFormModal: React.FC<PackageFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const isEditing = !!initialData;

  // Form states
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Akad Nikah');
  const [customCategory, setCustomCategory] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [description, setDescription] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [facilities, setFacilities] = useState<string[]>([]);
  const [newFacilityInput, setNewFacilityInput] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Sync form data on open or initialData change
  useEffect(() => {
    if (initialData) {
      setCode(initialData.code);
      setName(initialData.name);
      setPrice(initialData.price);
      setDescription(initialData.description);
      setPhotoUrl(initialData.photo_url);
      setFacilities([...initialData.facilities]);
      setStatus(initialData.status);

      const knownCategories = ['Akad Nikah', 'Resepsi', 'Full Wedding', 'Prosesi Adat'];
      if (initialData.category && !knownCategories.includes(initialData.category)) {
        setCategory('Lainnya');
        setCustomCategory(initialData.category);
      } else {
        setCategory(initialData.category || 'Akad Nikah');
        setCustomCategory('');
      }
    } else {
      // Reset for add mode with dynamic default code
      const randomSuffix = Math.floor(100 + Math.random() * 900);
      setCode(`PKG-BARU-${randomSuffix}`);
      setName('');
      setCategory('Akad Nikah');
      setCustomCategory('');
      setPrice('');
      setDescription('');
      setPhotoUrl(DEFAULT_PRESET_PHOTOS[0].url);
      setFacilities([
        'Makeup & Hairdo/Hijabdo Pengantin Wanita',
        'Rias & Busana Pengantin Pria',
        'Aksesoris & Ronce Melati Asli'
      ]);
      setStatus('active');
    }
    setErrors({});
    setNewFacilityInput('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleAddFacility = () => {
    const trimmed = newFacilityInput.trim();
    if (!trimmed) return;
    if (facilities.includes(trimmed)) {
      setErrors((prev) => ({ ...prev, facility: 'Fasilitas ini sudah ada dalam daftar' }));
      return;
    }
    setFacilities((prev) => [...prev, trimmed]);
    setNewFacilityInput('');
    setErrors((prev) => {
      const next = { ...prev };
      delete next.facility;
      delete next.facilities;
      return next;
    });
  };

  const handleRemoveFacility = (index: number) => {
    setFacilities((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSelectSuggestedFacility = (item: string) => {
    if (!facilities.includes(item)) {
      setFacilities((prev) => [...prev, item]);
      setErrors((prev) => {
        const next = { ...prev };
        delete next.facilities;
        return next;
      });
    }
  };

  const validateForm = () => {
    const errs: Record<string, string> = {};

    if (!code.trim()) {
      errs.code = 'Kode paket wajib diisi';
    }
    if (!name.trim()) {
      errs.name = 'Nama paket wajib diisi';
    } else if (name.trim().length < 3) {
      errs.name = 'Nama paket minimal 3 karakter';
    }

    if (category === 'Lainnya' && !customCategory.trim()) {
      errs.category = 'Kategori kustom wajib diisi';
    }

    if (price === '' || isNaN(Number(price)) || Number(price) <= 0) {
      errs.price = 'Harga paket harus berupa angka positif';
    }

    if (!description.trim()) {
      errs.description = 'Deskripsi paket wajib diisi';
    } else if (description.trim().length < 10) {
      errs.description = 'Deskripsi minimal 10 karakter';
    }

    if (!photoUrl.trim()) {
      errs.photoUrl = 'URL foto representasi wajib diisi';
    }

    if (facilities.length === 0) {
      errs.facilities = 'Minimal harus memiliki 1 fasilitas/layanan';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const finalCategory = category === 'Lainnya' ? customCategory.trim() : category;

    const payload: Package = {
      id: initialData?.id || `pkg-${Date.now()}`,
      code: code.trim().toUpperCase(),
      name: name.trim(),
      category: finalCategory,
      price: Number(price),
      description: description.trim(),
      photo_url: photoUrl.trim(),
      facilities: facilities,
      status: status,
      created_at: initialData?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    onSave(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 animate-scaleUp overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100 shadow-2xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-serif font-bold text-stone-900">
                {isEditing ? 'Ubah Data Paket Rias' : 'Tambah Paket Rias Baru'}
              </h2>
              <p className="text-xs text-stone-500">
                {isEditing 
                  ? 'Perbarui rincian, harga, foto, dan fasilitas paket' 
                  : 'Lengkapi formulir untuk menambahkan paket baru ke katalog'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          
          {isEditing && (
            <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shrink-0" />
                <span>
                  Mode Ubah Data: <strong className="font-semibold">{initialData?.name}</strong> (<span className="font-mono">{initialData?.code}</span>)
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue-100 font-mono text-blue-800">
                ID: {initialData?.id}
              </span>
            </div>
          )}

          {/* Section: Identitas Paket */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
              <span>1. Identitas & Kategori Paket</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Kode Paket */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Kode Paket <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="PKG-AKAD"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-mono uppercase transition-all ${
                    errors.code 
                      ? 'border-red-400 bg-red-50/50 text-red-900 focus:ring-red-400' 
                      : 'border-stone-200 bg-stone-50/40 text-stone-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                  }`}
                />
                {errors.code && <p className="text-[11px] text-red-600 mt-1">{errors.code}</p>}
              </div>

              {/* Nama Paket */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Nama Paket Pernikahan <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Paket Resepsi Glamour"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs transition-all ${
                    errors.name 
                      ? 'border-red-400 bg-red-50/50 text-red-900 focus:ring-red-400' 
                      : 'border-stone-200 bg-stone-50/40 text-stone-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                  }`}
                />
                {errors.name && <p className="text-[11px] text-red-600 mt-1">{errors.name}</p>}
              </div>
            </div>

            {/* Kategori & Harga */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Kategori */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Kategori Acara <span className="text-rose-500">*</span>
                </label>
                <div className="flex gap-2">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="flex-1 px-3 py-2.5 rounded-xl border border-stone-200 bg-stone-50/40 text-xs text-stone-800 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                  >
                    <option value="Akad Nikah">Akad Nikah</option>
                    <option value="Resepsi">Resepsi</option>
                    <option value="Full Wedding">Full Wedding (Akad & Resepsi)</option>
                    <option value="Prosesi Adat">Prosesi Adat (Siraman & Midodareni)</option>
                    <option value="Lainnya">Kategori Lainnya...</option>
                  </select>
                </div>
                {category === 'Lainnya' && (
                  <input
                    type="text"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    placeholder="Ketik kategori kustom..."
                    className="w-full mt-2 px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-900 focus:border-rose-500"
                  />
                )}
                {errors.category && <p className="text-[11px] text-red-600 mt-1">{errors.category}</p>}
              </div>

              {/* Harga Paket */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Harga Paket (IDR) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-400">
                    Rp
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="50000"
                    value={price}
                    onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : '')}
                    placeholder="3500000"
                    className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                      errors.price 
                        ? 'border-red-400 bg-red-50/50 text-red-900 focus:ring-red-400' 
                        : 'border-stone-200 bg-stone-50/40 text-stone-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                    }`}
                  />
                </div>
                {price !== '' && !isNaN(Number(price)) && (
                  <p className="text-[11px] text-emerald-600 font-medium mt-1">
                    Terbaca: {formatRupiah(Number(price))}
                  </p>
                )}
                {errors.price && <p className="text-[11px] text-red-600 mt-1">{errors.price}</p>}
              </div>
            </div>

            {/* Deskripsi Paket */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Deskripsi Paket <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Jelaskan ringkasan paket, look riasan, dan keunggulan utama..."
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs transition-all ${
                  errors.description 
                    ? 'border-red-400 bg-red-50/50 text-red-900 focus:ring-red-400' 
                    : 'border-stone-200 bg-stone-50/40 text-stone-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                }`}
              />
              {errors.description && <p className="text-[11px] text-red-600 mt-1">{errors.description}</p>}
            </div>
          </div>

          {/* Section: Foto Representasi */}
          <div className="space-y-3 pt-2 border-t border-stone-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
              <span>2. Foto Representasi Paket</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                URL Foto (Tautan Gambar) <span className="text-rose-500">*</span>
              </label>
              <input
                type="url"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs transition-all ${
                  errors.photoUrl 
                    ? 'border-red-400 bg-red-50/50 text-red-900 focus:ring-red-400' 
                    : 'border-stone-200 bg-stone-50/40 text-stone-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                }`}
              />
              {errors.photoUrl && <p className="text-[11px] text-red-600 mt-1">{errors.photoUrl}</p>}
            </div>

            {/* Quick Presets & Preview */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-3 rounded-2xl bg-stone-50 border border-stone-200">
              {/* Image thumbnail preview */}
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-stone-200 border border-stone-300 shrink-0 flex items-center justify-center">
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&w=300&q=80';
                    }}
                  />
                ) : (
                  <ImageIcon className="w-6 h-6 text-stone-400" />
                )}
              </div>

              {/* Preset buttons */}
              <div className="space-y-1.5 flex-1">
                <p className="text-[11px] font-semibold text-stone-500">
                  Gunakan Foto Siap Pakai:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {DEFAULT_PRESET_PHOTOS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setPhotoUrl(preset.url)}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-medium bg-white hover:bg-rose-50 hover:text-rose-700 border border-stone-200 transition-all cursor-pointer"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section: Fasilitas & Layanan */}
          <div className="space-y-3 pt-2 border-t border-stone-100">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
                <span>3. Fasilitas & Layanan ({facilities.length})</span>
              </h3>
              <span className="text-[11px] text-stone-400">Minimal 1 fasilitas</span>
            </div>

            {/* Input to add facility */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newFacilityInput}
                onChange={(e) => setNewFacilityInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddFacility();
                  }
                }}
                placeholder="Ketik fasilitas baru (contoh: Rias & Busana Pengantin Wanita)..."
                className="flex-1 px-3.5 py-2 rounded-xl border border-stone-200 bg-stone-50/40 text-xs text-stone-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
              />
              <button
                type="button"
                onClick={handleAddFacility}
                className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah</span>
              </button>
            </div>
            {errors.facility && <p className="text-[11px] text-red-600">{errors.facility}</p>}
            {errors.facilities && <p className="text-[11px] text-red-600">{errors.facilities}</p>}

            {/* Suggested quick chips */}
            <div className="space-y-1.5">
              <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">
                Saran Fasilitas Cepat:
              </p>
              <div className="flex flex-wrap gap-1">
                {SUGGESTED_FACILITIES.slice(0, 5).map((item, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSelectSuggestedFacility(item)}
                    className="px-2 py-0.5 rounded-md text-[10px] bg-stone-100 hover:bg-rose-50 text-stone-600 hover:text-rose-700 transition-colors cursor-pointer"
                  >
                    + {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Facility items list */}
            <div className="space-y-2 max-h-48 overflow-y-auto p-1">
              {facilities.map((fac, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 group"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="leading-snug">{fac}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveFacility(idx)}
                    className="p-1 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer opacity-80 group-hover:opacity-100"
                    title="Hapus fasilitas"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Status Ketersediaan */}
          <div className="space-y-3 pt-2 border-t border-stone-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
              <span>4. Status Ketersediaan Paket</span>
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <label
                className={`p-3 rounded-2xl border cursor-pointer flex items-center gap-3 transition-all ${
                  status === 'active'
                    ? 'border-emerald-500 bg-emerald-50/40 text-emerald-900'
                    : 'border-stone-200 bg-stone-50/40 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <input
                  type="radio"
                  name="status"
                  value="active"
                  checked={status === 'active'}
                  onChange={() => setStatus('active')}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  status === 'active' ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-stone-300'
                }`}>
                  {status === 'active' && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                </div>
                <div>
                  <p className="text-xs font-bold">Status Aktif</p>
                  <p className="text-[10px] text-stone-500">Tampil di katalog & dihitung di SAW</p>
                </div>
              </label>

              <label
                className={`p-3 rounded-2xl border cursor-pointer flex items-center gap-3 transition-all ${
                  status === 'inactive'
                    ? 'border-amber-500 bg-amber-50/40 text-amber-900'
                    : 'border-stone-200 bg-stone-50/40 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <input
                  type="radio"
                  name="status"
                  value="inactive"
                  checked={status === 'inactive'}
                  onChange={() => setStatus('inactive')}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  status === 'inactive' ? 'border-amber-600 bg-amber-600 text-white' : 'border-stone-300'
                }`}>
                  {status === 'inactive' && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                </div>
                <div>
                  <p className="text-xs font-bold">Status Nonaktif</p>
                  <p className="text-[10px] text-stone-500">Disimpan tanpa tampil di rekomendasi</p>
                </div>
              </label>
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-stone-200 text-stone-700 text-xs font-semibold hover:bg-stone-50 transition-all cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-rose-600/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{isEditing ? 'Simpan Perubahan' : 'Simpan Paket Baru'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
