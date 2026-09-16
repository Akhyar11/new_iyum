import React, { useState, useMemo, useEffect } from 'react';
import { 
  PackageOpen, 
  Plus, 
  Search, 
  X, 
  Eye, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  ArrowUpDown, 
  LayoutGrid, 
  List, 
  RotateCcw, 
  Layers, 
  DollarSign, 
  AlertCircle,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { Package } from '../types';
import { 
  getStoredPackages, 
  resetStoredPackages, 
  togglePackageStatus, 
  deleteStoredPackage,
  upsertStoredPackage
} from '../lib/packageStore';
import { PackageFormModal } from '../components/admin/PackageFormModal';
import { formatRupiah } from '../utils/formatters';

interface ManagePackagesPageProps {
  onNavigateToDashboard?: () => void;
  onOpenAddModal?: () => void;
  onOpenEditModal?: (pkg: Package) => void;
}

export const ManagePackagesPage: React.FC<ManagePackagesPageProps> = ({
  onNavigateToDashboard,
  onOpenAddModal,
  onOpenEditModal
}) => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name_asc' | 'name_desc' | 'price_asc' | 'price_desc' | 'code'>('price_asc');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  
  // Modals & previews
  const [selectedPreviewPackage, setSelectedPreviewPackage] = useState<Package | null>(null);
  const [packageToDelete, setPackageToDelete] = useState<Package | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'info'; message: string } | null>(null);

  // Form modal handlers
  const handleOpenAdd = () => {
    if (onOpenAddModal) {
      onOpenAddModal();
    } else {
      setEditingPackage(null);
      setIsFormModalOpen(true);
    }
  };

  const handleOpenEdit = (pkg: Package) => {
    if (onOpenEditModal) {
      onOpenEditModal(pkg);
    } else {
      setEditingPackage(pkg);
      setIsFormModalOpen(true);
    }
  };

  const handleSavePackage = (savedPkg: Package) => {
    const updated = upsertStoredPackage(savedPkg);
    setPackages(updated);
    setIsFormModalOpen(false);
    showToast(
      editingPackage
        ? `Perubahan paket "${savedPkg.name}" berhasil disimpan.`
        : `Paket baru "${savedPkg.name}" berhasil ditambahkan ke katalog.`
    );
  };

  // Load packages
  const loadData = () => {
    const data = getStoredPackages();
    setPackages(data);
  };

  useEffect(() => {
    loadData();

    const handleUpdate = () => {
      loadData();
    };

    window.addEventListener('packages_updated', handleUpdate);
    return () => {
      window.removeEventListener('packages_updated', handleUpdate);
    };
  }, []);

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Categories extraction
  const categories = useMemo(() => {
    const set = new Set<string>();
    packages.forEach((pkg) => {
      if (pkg.category) set.add(pkg.category);
    });
    return ['all', ...Array.from(set)];
  }, [packages]);

  // Calculations for quick metrics
  const stats = useMemo(() => {
    const total = packages.length;
    const active = packages.filter(p => p.status === 'active').length;
    const inactive = packages.filter(p => p.status === 'inactive').length;
    const prices = packages.map(p => p.price);
    const minPrice = prices.length ? Math.min(...prices) : 0;
    const maxPrice = prices.length ? Math.max(...prices) : 0;
    const avgPrice = prices.length ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 0;

    return { total, active, inactive, minPrice, maxPrice, avgPrice };
  }, [packages]);

  // Filtered and sorted packages
  const filteredPackages = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const filtered = packages.filter((pkg) => {
      // Status filter
      if (statusFilter !== 'all' && pkg.status !== statusFilter) {
        return false;
      }
      // Category filter
      if (categoryFilter !== 'all' && pkg.category !== categoryFilter) {
        return false;
      }
      // Search query
      if (!q) return true;

      const inName = pkg.name.toLowerCase().includes(q);
      const inCode = pkg.code.toLowerCase().includes(q);
      const inDesc = pkg.description.toLowerCase().includes(q);
      const inCategory = pkg.category?.toLowerCase().includes(q);
      const inFacilities = pkg.facilities.some(f => f.toLowerCase().includes(q));

      return inName || inCode || inDesc || inCategory || inFacilities;
    });

    // Sort
    return [...filtered].sort((a, b) => {
      if (sortBy === 'name_asc') return a.name.localeCompare(b.name);
      if (sortBy === 'name_desc') return b.name.localeCompare(a.name);
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'code') return a.code.localeCompare(b.code);
      return 0;
    });
  }, [packages, searchQuery, statusFilter, categoryFilter, sortBy]);

  // Status toggle handler
  const handleToggleStatus = (id: string, name: string, currentStatus: 'active' | 'inactive') => {
    const updated = togglePackageStatus(id);
    setPackages(updated);
    const newStatus = currentStatus === 'active' ? 'nonaktif' : 'aktif';
    showToast(`Status paket "${name}" berhasil diubah menjadi ${newStatus}.`);
  };

  // Delete handler
  const handleConfirmDelete = () => {
    if (!packageToDelete) return;
    const updated = deleteStoredPackage(packageToDelete.id);
    setPackages(updated);
    showToast(`Paket "${packageToDelete.name}" berhasil dihapus.`);
    setPackageToDelete(null);
  };

  // Reset handler
  const handleResetData = () => {
    if (window.confirm('Kembalikan daftar paket ke data bawaan awal (4 paket utama)?')) {
      const initial = resetStoredPackages();
      setPackages(initial);
      showToast('Daftar paket berhasil dikembalikan ke data awal bawaan sistem.');
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-24 right-6 z-50 flex items-center gap-3 bg-stone-900 text-white px-5 py-3 rounded-2xl shadow-xl border border-stone-700 animate-slideDown">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <p className="text-xs sm:text-sm font-medium">{notification.message}</p>
          <button 
            type="button" 
            onClick={() => setNotification(null)}
            className="text-stone-400 hover:text-white ml-2 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            {onNavigateToDashboard && (
              <>
                <button
                  type="button"
                  onClick={onNavigateToDashboard}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer"
                >
                  Dashboard
                </button>
                <span className="text-stone-300">/</span>
              </>
            )}
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">
              Katalog & Layanan
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 flex items-center gap-3">
            <PackageOpen className="w-8 h-8 text-rose-600" />
            <span>Kelola Paket Rias & Busana</span>
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm max-w-2xl leading-relaxed">
            Kelola seluruh opsi paket pernikahan (ID, kode, nama, harga, fasilitas, foto representasi, dan status aktif) yang digunakan dalam perhitungan rekomendasi SAW.
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleResetData}
            title="Reset ke paket bawaan awal"
            className="px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
          >
            <RotateCcw className="w-4 h-4 text-stone-500" />
            <span>Reset Bawaan</span>
          </button>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white text-xs sm:text-sm font-semibold shadow-md shadow-rose-600/20 hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Paket Baru</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Paket */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-stone-500">Total Paket</p>
            <p className="text-2xl font-serif font-bold text-stone-900 mt-1">{stats.total}</p>
            <p className="text-[11px] text-stone-400 mt-0.5">Tercatat di sistem</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center">
            <PackageOpen className="w-6 h-6" />
          </div>
        </div>

        {/* Paket Aktif */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-stone-500">Paket Aktif</p>
            <p className="text-2xl font-serif font-bold text-emerald-600 mt-1">{stats.active}</p>
            <p className="text-[11px] text-emerald-600/80 mt-0.5">Siap direkomendasikan</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Paket Nonaktif */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-stone-500">Paket Nonaktif</p>
            <p className="text-2xl font-serif font-bold text-stone-500 mt-1">{stats.inactive}</p>
            <p className="text-[11px] text-stone-400 mt-0.5">Tidak tampil di SAW</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-stone-100 text-stone-400 flex items-center justify-center">
            <XCircle className="w-6 h-6" />
          </div>
        </div>

        {/* Rata-rata Harga */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-stone-500">Rata-rata Harga</p>
            <p className="text-lg sm:text-xl font-serif font-bold text-rose-700 mt-1">
              {formatRupiah(stats.avgPrice)}
            </p>
            <p className="text-[11px] text-stone-400 mt-0.5">
              Rentang: {formatRupiah(stats.minPrice)} - {formatRupiah(stats.maxPrice)}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter, Search, and View Controls */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama paket, kode (PKG-...), fasilitas..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Status Pills */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-stone-100 border border-stone-200 text-xs shrink-0">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                statusFilter === 'all'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Semua ({packages.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('active')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                statusFilter === 'active'
                  ? 'bg-white text-emerald-700 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Aktif ({stats.active})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('inactive')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                statusFilter === 'inactive'
                  ? 'bg-white text-stone-800 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Nonaktif ({stats.inactive})
            </button>
          </div>
        </div>

        {/* Secondary filters row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-100 text-xs">
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Category Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-stone-500 font-medium">Kategori:</span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-stone-200 bg-white text-stone-800 focus:outline-hidden focus:border-rose-500"
              >
                <option value="all">Semua Kategori</option>
                {categories.filter(c => c !== 'all').map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-stone-500 font-medium flex items-center gap-1">
                <ArrowUpDown className="w-3.5 h-3.5" />
                Urutkan:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-2.5 py-1.5 rounded-lg border border-stone-200 bg-white text-stone-800 focus:outline-hidden focus:border-rose-500"
              >
                <option value="price_asc">Harga: Terendah ke Tertinggi</option>
                <option value="price_desc">Harga: Tertinggi ke Terendah</option>
                <option value="name_asc">Nama Paket (A - Z)</option>
                <option value="name_desc">Nama Paket (Z - A)</option>
                <option value="code">Kode Paket (A - Z)</option>
              </select>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-lg border border-stone-200">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              title="Tampilan Tabel"
              className={`p-1.5 rounded-md transition-all ${
                viewMode === 'table'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              title="Tampilan Kartu"
              className={`p-1.5 rounded-md transition-all ${
                viewMode === 'cards'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* Main Content Area: Table or Cards */}
      {filteredPackages.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 shadow-xs space-y-4">
          <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
            <PackageOpen className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900">
              Paket Tidak Ditemukan
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto mt-1">
              Tidak ada paket pernikahan yang cocok dengan kata kunci atau filter yang Anda pilih.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('all');
              setCategoryFilter('all');
            }}
            className="px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-all inline-flex items-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filter & Pencarian</span>
          </button>
        </div>
      ) : viewMode === 'table' ? (
        /* Table Mode */
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-stone-50/80 border-b border-stone-200 text-stone-500 uppercase tracking-wider font-semibold">
                  <th className="py-3.5 px-4 w-12 text-center">No</th>
                  <th className="py-3.5 px-4 min-w-[200px]">Paket & Kode</th>
                  <th className="py-3.5 px-4 min-w-[120px]">Kategori</th>
                  <th className="py-3.5 px-4 min-w-[130px]">Harga</th>
                  <th className="py-3.5 px-4 min-w-[260px]">Fasilitas Utama</th>
                  <th className="py-3.5 px-4 text-center min-w-[100px]">Status</th>
                  <th className="py-3.5 px-4 text-right min-w-[140px]">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredPackages.map((pkg, idx) => {
                  const isActive = pkg.status === 'active';
                  return (
                    <tr 
                      key={pkg.id} 
                      className="hover:bg-stone-50/60 transition-colors group"
                    >
                      {/* No */}
                      <td className="py-4 px-4 text-center text-stone-400 font-mono">
                        {idx + 1}
                      </td>

                      {/* Paket & Kode */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={pkg.photo_url}
                            alt={pkg.name}
                            className="w-12 h-12 rounded-xl object-cover border border-stone-200 shadow-2xs shrink-0 group-hover:scale-105 transition-transform"
                          />
                          <div>
                            <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-stone-100 text-stone-700 border border-stone-200 mb-1">
                              {pkg.code}
                            </span>
                            <p className="font-bold text-stone-900 text-sm">{pkg.name}</p>
                            <p className="text-[11px] text-stone-500 line-clamp-1 max-w-[240px]">
                              {pkg.description}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Kategori */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-rose-50 text-rose-700 border border-rose-200">
                          <Layers className="w-3 h-3 text-rose-500" />
                          {pkg.category || 'Pernikahan'}
                        </span>
                      </td>

                      {/* Harga */}
                      <td className="py-4 px-4 whitespace-nowrap font-serif font-bold text-stone-900 text-sm">
                        {formatRupiah(pkg.price)}
                      </td>

                      {/* Fasilitas */}
                      <td className="py-4 px-4">
                        <div className="space-y-1 max-w-[280px]">
                          {pkg.facilities.slice(0, 2).map((fac, fIdx) => (
                            <div key={fIdx} className="flex items-center gap-1.5 text-stone-600 text-[11px]">
                              <span className="w-1 h-1 rounded-full bg-rose-500 shrink-0" />
                              <span className="truncate">{fac}</span>
                            </div>
                          ))}
                          {pkg.facilities.length > 2 && (
                            <button
                              type="button"
                              onClick={() => setSelectedPreviewPackage(pkg)}
                              className="text-[10px] font-medium text-rose-600 hover:text-rose-700 hover:underline cursor-pointer"
                            >
                              +{pkg.facilities.length - 2} fasilitas lainnya...
                            </button>
                          )}
                        </div>
                      </td>

                      {/* Status Toggle Badge */}
                      <td className="py-4 px-4 text-center whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(pkg.id, pkg.name, pkg.status)}
                          title={`Klik untuk mengubah status menjadi ${isActive ? 'Nonaktif' : 'Aktif'}`}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                            isActive
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                              : 'bg-stone-100 text-stone-500 border border-stone-200 hover:bg-stone-200'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-stone-400'}`} />
                          <span>{isActive ? 'Aktif' : 'Nonaktif'}</span>
                        </button>
                      </td>

                      {/* Aksi Buttons */}
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Preview Detail */}
                          <button
                            type="button"
                            onClick={() => setSelectedPreviewPackage(pkg)}
                            title="Lihat Detail & Fasilitas"
                            className="p-1.5 rounded-lg border border-stone-200 hover:border-rose-300 hover:bg-rose-50 text-stone-600 hover:text-rose-700 transition-all cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Toggle Status Quick Action */}
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(pkg.id, pkg.name, pkg.status)}
                            title={isActive ? 'Ubah ke Nonaktif' : 'Aktifkan Paket'}
                            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                              isActive 
                                ? 'border-stone-200 hover:border-amber-300 hover:bg-amber-50 text-emerald-600 hover:text-amber-700' 
                                : 'border-stone-200 hover:border-emerald-300 hover:bg-emerald-50 text-stone-400 hover:text-emerald-700'
                            }`}
                          >
                            {isActive ? (
                              <ToggleRight className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <ToggleLeft className="w-3.5 h-3.5 text-stone-400" />
                            )}
                          </button>

                          {/* Edit */}
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(pkg)}
                            title="Ubah Data Paket"
                            className="p-1.5 rounded-lg border border-stone-200 hover:border-blue-300 hover:bg-blue-50 text-stone-600 hover:text-blue-700 transition-all cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => setPackageToDelete(pkg)}
                            title="Hapus Paket"
                            className="p-1.5 rounded-lg border border-stone-200 hover:border-red-300 hover:bg-red-50 text-stone-600 hover:text-red-700 transition-all cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Table Footer info */}
          <div className="py-3 px-5 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
            <span>Menampilkan {filteredPackages.length} dari {packages.length} total paket rias</span>
            <span className="font-mono text-[11px] text-stone-400">Pembaruan Tersinkronisasi</span>
          </div>
        </div>
      ) : (
        /* Cards Mode */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPackages.map((pkg) => {
            const isActive = pkg.status === 'active';
            return (
              <div 
                key={pkg.id} 
                className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden flex flex-col hover:shadow-md transition-all group"
              >
                {/* Card Top Image & Badges */}
                <div className="relative h-44 overflow-hidden bg-stone-100">
                  <img
                    src={pkg.photo_url}
                    alt={pkg.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                  
                  {/* Top badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-md font-mono text-[11px] font-bold bg-white/90 text-stone-900 shadow-xs backdrop-blur-sm">
                      {pkg.code}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(pkg.id, pkg.name, pkg.status)}
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold shadow-xs cursor-pointer ${
                        isActive
                          ? 'bg-emerald-500 text-white'
                          : 'bg-stone-500 text-white'
                      }`}
                    >
                      {isActive ? 'Aktif' : 'Nonaktif'}
                    </button>
                  </div>

                  {/* Price on Image Bottom */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
                    <div>
                      <p className="text-[10px] text-stone-300 uppercase tracking-wider">Harga Paket</p>
                      <p className="text-lg font-serif font-bold text-white drop-shadow-sm">
                        {formatRupiah(pkg.price)}
                      </p>
                    </div>
                    {pkg.category && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-black/40 border border-white/20 text-white backdrop-blur-sm">
                        {pkg.category}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-serif font-bold text-base text-stone-900">
                      {pkg.name}
                    </h3>
                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                      {pkg.description}
                    </p>

                    {/* Facilities Preview */}
                    <div className="pt-2 border-t border-stone-100 space-y-1.5">
                      <p className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                        Fasilitas ({pkg.facilities.length}):
                      </p>
                      {pkg.facilities.slice(0, 3).map((f, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-xs text-stone-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                          <span className="truncate">{f}</span>
                        </div>
                      ))}
                      {pkg.facilities.length > 3 && (
                        <p className="text-[11px] text-rose-600 font-medium">
                          +{pkg.facilities.length - 3} fasilitas lainnya
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedPreviewPackage(pkg)}
                      className="px-3 py-1.5 rounded-xl border border-stone-200 hover:border-rose-300 hover:bg-rose-50 text-stone-700 hover:text-rose-700 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Detail</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(pkg.id, pkg.name, pkg.status)}
                        className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
                          isActive
                            ? 'border-stone-200 hover:border-amber-300 hover:bg-amber-50 text-emerald-600 hover:text-amber-700'
                            : 'border-stone-200 hover:border-emerald-300 hover:bg-emerald-50 text-stone-400 hover:text-emerald-700'
                        }`}
                        title={isActive ? 'Nonaktifkan Paket' : 'Aktifkan Paket'}
                      >
                        {isActive ? (
                          <ToggleRight className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <ToggleLeft className="w-4 h-4 text-stone-400" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenEdit(pkg)}
                        className="p-1.5 rounded-xl border border-stone-200 hover:border-blue-300 hover:bg-blue-50 text-stone-700 hover:text-blue-700 transition-all cursor-pointer"
                        title="Ubah Paket"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setPackageToDelete(pkg)}
                        className="p-1.5 rounded-xl border border-stone-200 hover:border-red-300 hover:bg-red-50 text-stone-700 hover:text-red-700 transition-all cursor-pointer"
                        title="Hapus Paket"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Package Detail Preview Modal */}
      {selectedPreviewPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 animate-scaleUp">
            
            {/* Modal Image Header */}
            <div className="relative h-56 w-full bg-stone-100">
              <img
                src={selectedPreviewPackage.photo_url}
                alt={selectedPreviewPackage.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <button
                type="button"
                onClick={() => setSelectedPreviewPackage(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/75 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-6 right-6 text-white">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded font-mono text-xs font-bold bg-white text-stone-900">
                    {selectedPreviewPackage.code}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    selectedPreviewPackage.status === 'active' ? 'bg-emerald-500 text-white' : 'bg-stone-500 text-white'
                  }`}>
                    {selectedPreviewPackage.status === 'active' ? 'Aktif' : 'Nonaktif'}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
                  {selectedPreviewPackage.name}
                </h2>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6">
              
              {/* Price & Category info */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-200">
                <div>
                  <p className="text-xs text-stone-500">Harga Paket Resmi</p>
                  <p className="text-xl font-serif font-bold text-rose-700">
                    {formatRupiah(selectedPreviewPackage.price)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-stone-500">Kategori Acara</p>
                  <p className="text-sm font-semibold text-stone-800">
                    {selectedPreviewPackage.category || 'Pernikahan Standar'}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  Deskripsi Paket
                </h4>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                  {selectedPreviewPackage.description}
                </p>
              </div>

              {/* Facilities List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  Rincian Fasilitas & Layanan ({selectedPreviewPackage.facilities.length})
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedPreviewPackage.facilities.map((facility, index) => (
                    <div 
                      key={index}
                      className="p-3 rounded-xl bg-rose-50/50 border border-rose-100 text-xs text-stone-800 flex items-start gap-2.5"
                    >
                      <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <span className="leading-snug">{facility}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => {
                    handleToggleStatus(selectedPreviewPackage.id, selectedPreviewPackage.name, selectedPreviewPackage.status);
                    setSelectedPreviewPackage({
                      ...selectedPreviewPackage,
                      status: selectedPreviewPackage.status === 'active' ? 'inactive' : 'active'
                    });
                  }}
                  className={`px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                    selectedPreviewPackage.status === 'active'
                      ? 'border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100'
                      : 'border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                  }`}
                >
                  {selectedPreviewPackage.status === 'active' ? (
                    <>
                      <ToggleLeft className="w-4 h-4" />
                      <span>Nonaktifkan Paket</span>
                    </>
                  ) : (
                    <>
                      <ToggleRight className="w-4 h-4" />
                      <span>Aktifkan Paket</span>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const pkg = selectedPreviewPackage;
                      setSelectedPreviewPackage(null);
                      setPackageToDelete(pkg);
                    }}
                    className="px-3.5 py-2.5 rounded-xl border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                    title="Hapus Paket Ini"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedPreviewPackage(null)}
                    className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-700 text-xs font-semibold hover:bg-stone-50 transition-all cursor-pointer"
                  >
                    Tutup
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const pkg = selectedPreviewPackage;
                      setSelectedPreviewPackage(null);
                      handleOpenEdit(pkg);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Ubah Data Paket</span>
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {packageToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-stone-200 space-y-5 animate-scaleUp">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto border border-red-100">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-lg font-serif font-bold text-stone-900">
                Konfirmasi Hapus Paket
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Apakah Anda yakin ingin menghapus paket pernikahan ini secara permanen?
              </p>
            </div>

            {/* Target Package Preview Summary */}
            <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 flex items-center gap-3">
              <img
                src={packageToDelete.photo_url}
                alt={packageToDelete.name}
                className="w-12 h-12 rounded-xl object-cover border border-stone-200 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <span className="inline-block px-1.5 py-0.2 rounded text-[10px] font-mono font-semibold bg-white border border-stone-200 text-stone-700 mb-0.5">
                  {packageToDelete.code}
                </span>
                <p className="text-xs font-bold text-stone-900 truncate">
                  {packageToDelete.name}
                </p>
                <p className="text-[11px] font-serif font-semibold text-rose-700">
                  {formatRupiah(packageToDelete.price)}
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>Perhatian: Paket yang dihapus tidak akan lagi tersedia dalam katalog pengguna maupun perhitungan skor SAW.</span>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setPackageToDelete(null)}
                className="flex-1 py-2.5 rounded-xl border border-stone-200 text-stone-700 text-xs font-semibold hover:bg-stone-50 transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-md shadow-red-600/20 transition-all cursor-pointer"
              >
                Ya, Hapus Paket
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Package Form Modal (Add / Edit) */}
      <PackageFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSavePackage}
        initialData={editingPackage}
      />

    </div>
  );
};
