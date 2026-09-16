import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Check, 
  HelpCircle, 
  Layers, 
  Percent, 
  Plus,
  Trash2
} from 'lucide-react';
import { QuestionMock, OptionMock } from '../../data/mockQuestions';

interface QuestionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (question: QuestionMock) => void;
  initialData?: QuestionMock | null;
  totalWeightExcludingCurrent?: number;
}

const DEFAULT_OPTIONS: OptionMock[] = [
  {
    id: 'opt-1',
    text: 'Pilihan A - Sangat Sesuai untuk Akad',
    description: 'Rincian preferensi opsi A',
    scores: { 'pkg-1': 4, 'pkg-2': 1, 'pkg-3': 2, 'pkg-4': 1 }
  },
  {
    id: 'opt-2',
    text: 'Pilihan B - Sangat Sesuai untuk Resepsi',
    description: 'Rincian preferensi opsi B',
    scores: { 'pkg-1': 1, 'pkg-2': 4, 'pkg-3': 3, 'pkg-4': 1 }
  },
  {
    id: 'opt-3',
    text: 'Pilihan C - Sangat Sesuai untuk Akad & Resepsi',
    description: 'Rincian preferensi opsi C',
    scores: { 'pkg-1': 2, 'pkg-2': 3, 'pkg-3': 4, 'pkg-4': 1 }
  },
  {
    id: 'opt-4',
    text: 'Pilihan D - Sangat Sesuai untuk Siraman Adat',
    description: 'Rincian preferensi opsi D',
    scores: { 'pkg-1': 1, 'pkg-2': 1, 'pkg-3': 2, 'pkg-4': 4 }
  }
];

export const QuestionFormModal: React.FC<QuestionFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  totalWeightExcludingCurrent = 0,
}) => {
  const isEditing = !!initialData;

  const [criteriaName, setCriteriaName] = useState('');
  const [weight, setWeight] = useState<number | ''>(10);
  const [text, setText] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [options, setOptions] = useState<OptionMock[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setCriteriaName(initialData.criteriaName);
      setWeight(initialData.weight);
      setText(initialData.text);
      setSubtitle(initialData.subtitle || '');
      setOptions(JSON.parse(JSON.stringify(initialData.options || [])));
    } else {
      // Add mode
      setCriteriaName('');
      setWeight(10);
      setText('');
      setSubtitle('');
      setOptions(JSON.parse(JSON.stringify(DEFAULT_OPTIONS)));
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const numericWeight = typeof weight === 'number' ? weight : 0;
  const simulatedTotalWeight = totalWeightExcludingCurrent + numericWeight;

  const handleOptionTextChange = (index: number, val: string) => {
    setOptions((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], text: val };
      return copy;
    });
  };

  const handleOptionDescChange = (index: number, val: string) => {
    setOptions((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], description: val };
      return copy;
    });
  };

  const handleScoreChange = (optIndex: number, pkgKey: 'pkg-1' | 'pkg-2' | 'pkg-3' | 'pkg-4', scoreVal: number) => {
    setOptions((prev) => {
      const copy = [...prev];
      copy[optIndex] = {
        ...copy[optIndex],
        scores: {
          ...copy[optIndex].scores,
          [pkgKey]: scoreVal,
        },
      };
      return copy;
    });
  };

  const handleAddOption = () => {
    const newIdx = options.length + 1;
    const newOpt: OptionMock = {
      id: `opt-${Date.now()}-${newIdx}`,
      text: `Pilihan Opsi ${String.fromCharCode(64 + newIdx)}`,
      description: 'Deskripsi opsi jawaban',
      scores: { 'pkg-1': 1, 'pkg-2': 1, 'pkg-3': 1, 'pkg-4': 1 },
    };
    setOptions((prev) => [...prev, newOpt]);
  };

  const handleRemoveOption = (index: number) => {
    if (options.length <= 2) {
      alert('Pertanyaan minimal harus memiliki 2 opsi jawaban!');
      return;
    }
    setOptions((prev) => prev.filter((_, i) => i !== index));
  };

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!criteriaName.trim()) {
      errs.criteriaName = 'Nama kriteria wajib diisi (mis. Jenis Acara, Anggaran)';
    }

    if (weight === '' || isNaN(Number(weight)) || Number(weight) <= 0 || Number(weight) > 100) {
      errs.weight = 'Bobot kriteria harus di antara 1% - 100%';
    }

    if (!text.trim()) {
      errs.text = 'Teks pertanyaan wajib diisi';
    } else if (text.trim().length < 5) {
      errs.text = 'Teks pertanyaan minimal 5 karakter';
    }

    if (options.length < 2) {
      errs.options = 'Minimal 2 opsi jawaban';
    } else {
      const emptyOpt = options.some((o) => !o.text.trim());
      if (emptyOpt) {
        errs.options = 'Semua teks opsi jawaban wajib diisi';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload: QuestionMock = {
      id: initialData?.id || `q-${Date.now()}`,
      criteriaId: initialData?.criteriaId || `c-${Date.now()}`,
      criteriaName: criteriaName.trim(),
      weight: Number(weight),
      orderIndex: initialData?.orderIndex || 99,
      text: text.trim(),
      subtitle: subtitle.trim() || undefined,
      options: options,
    };

    onSave(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 animate-scaleUp overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 shadow-2xs">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-serif font-bold text-stone-900">
                {isEditing ? 'Ubah Pertanyaan & Kriteria' : 'Tambah Pertanyaan Kriteria Baru'}
              </h2>
              <p className="text-xs text-stone-500">
                {isEditing 
                  ? 'Perbarui kriteria, bobot SAW, dan daftar opsi jawaban' 
                  : 'Tambahkan kriteria baru untuk kuesioner rekomendasi pengantin'}
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          
          {/* Edit Alert Info */}
          {isEditing && (
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
                <span>
                  Mengedit Kriteria: <strong className="font-semibold">{initialData?.criteriaName}</strong> (Urutan #{initialData?.orderIndex})
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-100 font-mono text-amber-800">
                ID: {initialData?.id}
              </span>
            </div>
          )}

          {/* Section 1: Parameter Kriteria & Bobot */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
              <span>1. Parameter Kriteria & Bobot SAW</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Nama Kriteria */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Nama Kriteria <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Layers className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={criteriaName}
                    onChange={(e) => setCriteriaName(e.target.value)}
                    placeholder="Contoh: Jenis Acara, Kebutuhan Makeup, dll."
                    className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border text-xs transition-all ${
                      errors.criteriaName
                        ? 'border-red-400 bg-red-50/50 text-red-900'
                        : 'border-stone-200 bg-stone-50/40 text-stone-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20'
                    }`}
                  />
                </div>
                {errors.criteriaName && <p className="text-[11px] text-red-600 mt-1">{errors.criteriaName}</p>}
              </div>

              {/* Bobot SAW */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Bobot SAW (%) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Percent className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value ? Number(e.target.value) : '')}
                    placeholder="10"
                    className={`w-full pl-8 pr-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                      errors.weight
                        ? 'border-red-400 bg-red-50/50 text-red-900'
                        : 'border-stone-200 bg-stone-50/40 text-stone-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20'
                    }`}
                  />
                </div>
                {errors.weight && <p className="text-[11px] text-red-600 mt-1">{errors.weight}</p>}
              </div>
            </div>

            {/* Simulated total weight preview */}
            <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between text-xs">
              <span className="text-stone-600">Simulasi Total Akumulasi Bobot Kriteria:</span>
              <span className={`font-serif font-bold px-2.5 py-0.5 rounded-full ${
                simulatedTotalWeight === 100 
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                  : 'bg-amber-50 text-amber-800 border border-amber-200'
              }`}>
                {simulatedTotalWeight}% {simulatedTotalWeight === 100 ? '(Ideal: 100%)' : '(Perlu Penyesuaian)'}
              </span>
            </div>
          </div>

          {/* Section 2: Pertanyaan & Petunjuk */}
          <div className="space-y-4 pt-2 border-t border-stone-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
              <span>2. Teks Pertanyaan & Petunjuk</span>
            </h3>

            {/* Teks Pertanyaan */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Teks Pertanyaan Utama <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={2}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Contoh: Apa jenis acara pernikahan utama yang akan diselenggarakan?"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs transition-all ${
                  errors.text
                    ? 'border-red-400 bg-red-50/50 text-red-900'
                    : 'border-stone-200 bg-stone-50/40 text-stone-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20'
                }`}
              />
              {errors.text && <p className="text-[11px] text-red-600 mt-1">{errors.text}</p>}
            </div>

            {/* Subtitle */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Petunjuk / Keterangan Kriteria (Opsional)
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Contoh: Kriteria ini menentukan alokasi perlengkapan dan riasan busana."
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50/40 text-xs text-stone-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
              />
            </div>
          </div>

          {/* Section 3: Opsi Jawaban & Penilaian SAW */}
          <div className="space-y-3 pt-2 border-t border-stone-100">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>3. Opsi Pilihan Jawaban ({options.length})</span>
              </h3>
              <button
                type="button"
                onClick={handleAddOption}
                className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Opsi</span>
              </button>
            </div>
            {errors.options && <p className="text-[11px] text-red-600">{errors.options}</p>}

            {/* List of options */}
            <div className="space-y-3 max-h-72 overflow-y-auto p-1">
              {options.map((opt, idx) => {
                const letter = String.fromCharCode(65 + idx);
                return (
                  <div 
                    key={opt.id || idx}
                    className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2 flex-1">
                        <span className="w-6 h-6 rounded-full bg-stone-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                          {letter}
                        </span>
                        <input
                          type="text"
                          value={opt.text}
                          onChange={(e) => handleOptionTextChange(idx, e.target.value)}
                          placeholder={`Teks pilihan ${letter}...`}
                          className="flex-1 px-3 py-1.5 rounded-lg border border-stone-200 bg-white text-xs font-semibold text-stone-900 focus:border-amber-500"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveOption(idx)}
                        className="p-1.5 text-stone-400 hover:text-red-600 transition-colors cursor-pointer"
                        title="Hapus opsi ini"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <input
                      type="text"
                      value={opt.description || ''}
                      onChange={(e) => handleOptionDescChange(idx, e.target.value)}
                      placeholder="Keterangan singkat opsi jawaban..."
                      className="w-full px-3 py-1.5 rounded-lg border border-stone-200 bg-white text-[11px] text-stone-600 focus:border-amber-500"
                    />

                    {/* SAW Score Assignment Matrix for this option */}
                    <div className="pt-2 border-t border-stone-200/60 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                      <span className="text-stone-500 font-medium">Skor SAW (1-4):</span>
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Pkg-1 Akad */}
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-stone-500 font-semibold">Akad:</span>
                          <select
                            value={opt.scores['pkg-1']}
                            onChange={(e) => handleScoreChange(idx, 'pkg-1', Number(e.target.value))}
                            className="px-1.5 py-0.5 rounded border border-stone-300 bg-white text-xs font-bold text-rose-700"
                          >
                            {[1, 2, 3, 4].map((n) => (
                              <option key={n} value={n}>{n}</option>
                            ))}
                          </select>
                        </div>

                        {/* Pkg-2 Resepsi */}
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-stone-500 font-semibold">Resepsi:</span>
                          <select
                            value={opt.scores['pkg-2']}
                            onChange={(e) => handleScoreChange(idx, 'pkg-2', Number(e.target.value))}
                            className="px-1.5 py-0.5 rounded border border-stone-300 bg-white text-xs font-bold text-blue-700"
                          >
                            {[1, 2, 3, 4].map((n) => (
                              <option key={n} value={n}>{n}</option>
                            ))}
                          </select>
                        </div>

                        {/* Pkg-3 All-in */}
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-stone-500 font-semibold">All-in:</span>
                          <select
                            value={opt.scores['pkg-3']}
                            onChange={(e) => handleScoreChange(idx, 'pkg-3', Number(e.target.value))}
                            className="px-1.5 py-0.5 rounded border border-stone-300 bg-white text-xs font-bold text-purple-700"
                          >
                            {[1, 2, 3, 4].map((n) => (
                              <option key={n} value={n}>{n}</option>
                            ))}
                          </select>
                        </div>

                        {/* Pkg-4 Siraman */}
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-stone-500 font-semibold">Siraman:</span>
                          <select
                            value={opt.scores['pkg-4']}
                            onChange={(e) => handleScoreChange(idx, 'pkg-4', Number(e.target.value))}
                            className="px-1.5 py-0.5 rounded border border-stone-300 bg-white text-xs font-bold text-emerald-700"
                          >
                            {[1, 2, 3, 4].map((n) => (
                              <option key={n} value={n}>{n}</option>
                            ))}
                          </select>
                        </div>

                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Actions */}
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
              className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-amber-600/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{isEditing ? 'Simpan Perubahan' : 'Simpan Pertanyaan Baru'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
