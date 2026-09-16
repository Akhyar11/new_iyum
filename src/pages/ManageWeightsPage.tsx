import React, { useState, useMemo, useEffect } from 'react';
import { 
  Sliders, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Save, 
  Table, 
  Percent, 
  Check, 
  PackageOpen, 
  ArrowRight, 
  Info,
  Search,
  X
} from 'lucide-react';
import { QuestionMock } from '../data/mockQuestions';
import { 
  getStoredQuestions, 
  saveStoredQuestions, 
  resetStoredQuestions 
} from '../lib/questionStore';
import { getStoredPackages } from '../lib/packageStore';
import { Package } from '../types';

interface ManageWeightsPageProps {
  onNavigateToDashboard?: () => void;
  onNavigateToQuestions?: () => void;
}

export const ManageWeightsPage: React.FC<ManageWeightsPageProps> = ({
  onNavigateToDashboard,
  onNavigateToQuestions,
}) => {
  const [questions, setQuestions] = useState<QuestionMock[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [activeTab, setActiveTab] = useState<'weights' | 'matrix' | 'info'>('weights');
  const [notification, setNotification] = useState<{ type: 'success' | 'warning' | 'info'; message: string } | null>(null);

  // Local draft state for weights and option scores
  const [weightsMap, setWeightsMap] = useState<Record<string, number>>({});
  const [selectedCriteriaFilter, setSelectedCriteriaFilter] = useState<string>('all');
  const [matrixSearchQuery, setMatrixSearchQuery] = useState<string>('');
  const [isDirty, setIsDirty] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);

  const loadData = () => {
    const qs = getStoredQuestions();
    const pkgs = getStoredPackages();
    setQuestions(qs);
    setPackages(pkgs);

    const initialWeights: Record<string, number> = {};
    qs.forEach((q) => {
      initialWeights[q.id] = q.weight;
    });
    setWeightsMap(initialWeights);
    setIsDirty(false);
  };

  useEffect(() => {
    loadData();

    const handleUpdate = () => {
      loadData();
    };

    window.addEventListener('questions_updated', handleUpdate);
    window.addEventListener('packages_updated', handleUpdate);
    return () => {
      window.removeEventListener('questions_updated', handleUpdate);
      window.removeEventListener('packages_updated', handleUpdate);
    };
  }, []);

  const showToast = (message: string, type: 'success' | 'warning' | 'info' = 'success') => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // Calculate total weight in real-time
  const totalWeight = useMemo(() => {
    return Object.values(weightsMap).reduce((acc, w) => acc + (Number(w) || 0), 0);
  }, [weightsMap]);

  const isWeightValid = totalWeight === 100;

  // Dynamic packages list for matrix columns
  const displayPackages = useMemo(() => {
    if (packages.length > 0) return packages;
    return [
      { id: 'pkg-1', name: 'Paket Akad Nikah', code: 'AKAD', price: 6500000 },
      { id: 'pkg-2', name: 'Paket Resepsi Standar', code: 'RESEPSI', price: 12000000 },
      { id: 'pkg-3', name: 'Paket Akad & Resepsi Lengkap', code: 'FULL', price: 17500000 },
      { id: 'pkg-4', name: 'Siraman & Pengajian Package', code: 'SIRAMAN', price: 8000000 },
    ] as Package[];
  }, [packages]);

  // Filtered questions and options for matrix view
  const filteredMatrixQuestions = useMemo(() => {
    return questions.filter((q) => {
      const matchCriteria = selectedCriteriaFilter === 'all' || q.id === selectedCriteriaFilter;
      const matchSearch = !matrixSearchQuery.trim() || 
        q.criteriaName.toLowerCase().includes(matrixSearchQuery.toLowerCase()) ||
        q.text.toLowerCase().includes(matrixSearchQuery.toLowerCase()) ||
        q.options.some((opt) => opt.text.toLowerCase().includes(matrixSearchQuery.toLowerCase()));
      return matchCriteria && matchSearch;
    });
  }, [questions, selectedCriteriaFilter, matrixSearchQuery]);

  // Handle individual weight change
  const handleWeightChange = (questionId: string, val: number) => {
    setWeightsMap((prev) => ({
      ...prev,
      [questionId]: val,
    }));
    setIsDirty(true);
  };

  // Handle option score change in matrix
  const handleScoreChange = (
    questionId: string,
    optionId: string,
    pkgId: string,
    newScore: number
  ) => {
    setQuestions((prev) => {
      return prev.map((q) => {
        if (q.id !== questionId) return q;
        const newOptions = q.options.map((opt) => {
          if (opt.id !== optionId) return opt;
          return {
            ...opt,
            scores: {
              ...opt.scores,
              [pkgId]: newScore,
            },
          };
        });
        return { ...q, options: newOptions };
      });
    });
    setIsDirty(true);
  };

  // Open save confirmation modal
  const handleOpenSaveModal = () => {
    if (!isWeightValid) {
      showToast(
        `Total bobot saat ini ${totalWeight}%. Harus tepat 100% untuk metode SAW. Silakan sesuaikan bobot sebelum menyimpan.`,
        'warning'
      );
      return;
    }
    setShowSaveModal(true);
  };

  // Perform actual save after user confirms
  const handleConfirmSave = () => {
    const updatedQuestions = questions.map((q) => ({
      ...q,
      weight: weightsMap[q.id] ?? q.weight,
    }));

    saveStoredQuestions(updatedQuestions);
    setQuestions(updatedQuestions);
    setIsDirty(false);
    setShowSaveModal(false);
    const nowStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLastSavedTime(nowStr);
    showToast('Konfigurasi bobot kriteria dan matriks nilai SAW berhasil disimpan!', 'success');
  };

  // Open reset confirmation modal
  const handleOpenResetModal = () => {
    setShowResetModal(true);
  };

  // Perform reset after user confirms
  const handleConfirmReset = () => {
    const resetQs = resetStoredQuestions();
    setQuestions(resetQs);
    const initW: Record<string, number> = {};
    resetQs.forEach((q) => {
      initW[q.id] = q.weight;
    });
    setWeightsMap(initW);
    setIsDirty(false);
    setShowResetModal(false);
    showToast('Konfigurasi bobot dan matriks SAW berhasil dikembalikan ke standar awal.', 'success');
  };

  // Auto-normalize weights to 100% helper
  const handleAutoNormalizeWeights = () => {
    const keys = Object.keys(weightsMap);
    if (keys.length === 0 || totalWeight === 0) return;

    const normalized: Record<string, number> = {};
    let accumulated = 0;

    keys.forEach((key, idx) => {
      if (idx === keys.length - 1) {
        normalized[key] = Math.max(1, 100 - accumulated);
      } else {
        const share = Math.round((weightsMap[key] / totalWeight) * 100);
        normalized[key] = share;
        accumulated += share;
      }
    });

    setWeightsMap(normalized);
    setIsDirty(true);
    showToast('Bobot kriteria telah dinormalisasi otomatis agar total 100%.', 'info');
  };

  // Apply default SAW weights
  const handleApplyStandardSAWPreset = () => {
    const defaultWeights: Record<string, number> = {
      q1: 20, // Jenis Acara
      q2: 10, // Waktu Pelaksanaan
      q3: 15, // Kebutuhan Makeup
      q4: 10, // Kebutuhan Busana
      q5: 10, // Gaya Riasan
      q6: 5,  // Jumlah Ibu Mempelai
      q7: 5,  // Jumlah Jaga Kado
      q8: 15, // Kebutuhan Siraman
      q9: 5,  // Tambahan Makeup
      q10: 5, // Anggaran
    };
    const standardByOrder = [20, 10, 15, 10, 10, 5, 5, 15, 5, 5];
    const newWeights: Record<string, number> = {};
    questions.forEach((q, idx) => {
      newWeights[q.id] = defaultWeights[q.id] ?? (standardByOrder[idx] || 10);
    });
    setWeightsMap(newWeights);
    setIsDirty(true);
    showToast('Preset standar bobot SAW berhasil diterapkan (Total 100%).', 'info');
  };

  // Apply equal weights (10% each)
  const handleApplyEqualPreset = () => {
    const newWeights: Record<string, number> = {};
    const n = questions.length || 10;
    const base = Math.floor(100 / n);
    let rem = 100 - base * n;
    questions.forEach((q) => {
      const extra = rem > 0 ? 1 : 0;
      if (rem > 0) rem--;
      newWeights[q.id] = base + extra;
    });
    setWeightsMap(newWeights);
    setIsDirty(true);
    showToast('Preset bobot merata telah diterapkan.', 'info');
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed top-24 right-6 z-50 flex items-center gap-3 text-white px-5 py-3 rounded-2xl shadow-xl border animate-slideDown ${
          notification.type === 'warning'
            ? 'bg-amber-900 border-amber-700'
            : notification.type === 'info'
            ? 'bg-stone-900 border-stone-700'
            : 'bg-emerald-900 border-emerald-700'
        }`}>
          {notification.type === 'warning' ? (
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          )}
          <p className="text-xs sm:text-sm font-medium">{notification.message}</p>
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
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200">
              Konfigurasi SAW Dinamis
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 flex items-center gap-3">
            <Sliders className="w-8 h-8 text-purple-600" />
            <span>Atur Bobot & Nilai SAW</span>
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm max-w-2xl leading-relaxed">
            Atur persentase bobot ke-10 kriteria rekomendasi dan matriks nilai kesesuaian jawaban per paket secara dinamis tanpa mengubah baris kode program.
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {lastSavedTime && (
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Tersimpan {lastSavedTime}</span>
            </span>
          )}

          <button
            type="button"
            onClick={handleOpenResetModal}
            title="Kembalikan ke bobot bawaan sistem"
            className="px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
          >
            <RotateCcw className="w-4 h-4 text-stone-500" />
            <span>Reset Bawaan</span>
          </button>

          <button
            type="button"
            onClick={handleOpenSaveModal}
            disabled={!isWeightValid}
            className={`px-5 py-2.5 rounded-xl text-white text-xs sm:text-sm font-semibold shadow-md transition-all flex items-center gap-2 cursor-pointer ${
              !isWeightValid
                ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                : isDirty
                ? 'bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-700 hover:to-rose-700 animate-pulse shadow-purple-600/30'
                : 'bg-stone-900 hover:bg-stone-800 shadow-stone-900/20'
            }`}
          >
            <Save className="w-4 h-4" />
            <span>Simpan Perubahan</span>
          </button>
        </div>
      </div>

      {/* KPI Cards & 100% Weight Status */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Akumulasi Bobot */}
        <div className={`rounded-2xl p-5 border shadow-xs flex items-center justify-between transition-all ${
          isWeightValid
            ? 'bg-emerald-50/50 border-emerald-200 text-emerald-950'
            : 'bg-red-50/60 border-red-300 text-red-950'
        }`}>
          <div>
            <p className="text-xs font-semibold text-stone-500">Total Akumulasi Bobot</p>
            <p className={`text-2xl sm:text-3xl font-serif font-bold mt-1 ${
              isWeightValid ? 'text-emerald-700' : 'text-red-600'
            }`}>
              {totalWeight}%
            </p>
            <p className={`text-[11px] font-medium mt-0.5 ${
              isWeightValid ? 'text-emerald-700' : 'text-red-600'
            }`}>
              {isWeightValid ? '✓ Sesuai (Tepat 100%)' : `Selisih: ${100 - totalWeight > 0 ? `+${100 - totalWeight}` : 100 - totalWeight}%`}
            </p>
          </div>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            isWeightValid ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
          }`}>
            <Percent className="w-6 h-6" />
          </div>
        </div>

        {/* Jumlah Kriteria */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-stone-500">Jumlah Kriteria</p>
            <p className="text-2xl font-serif font-bold text-stone-900 mt-1">{questions.length} Kriteria</p>
            <p className="text-[11px] text-stone-400 mt-0.5">Penentu rekomendasi</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Sliders className="w-6 h-6" />
          </div>
        </div>

        {/* Kandidat Paket */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-stone-500">Kandidat Paket</p>
            <p className="text-2xl font-serif font-bold text-stone-900 mt-1">{packages.length} Paket</p>
            <p className="text-[11px] text-stone-400 mt-0.5">Target perangkingan</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <PackageOpen className="w-6 h-6" />
          </div>
        </div>

        {/* Skala Nilai Opsi */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-stone-500">Skala Penilaian</p>
            <p className="text-2xl font-serif font-bold text-stone-900 mt-1">1 - 4</p>
            <p className="text-[11px] text-stone-400 mt-0.5">Tingkat kecocokan SAW</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Weight Validation Banner */}
      {isWeightValid ? (
        <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50 border border-emerald-300 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-emerald-900">
                Validasi Bobot SAW Terpenuhi: Tepat 100%
              </h4>
              <p className="text-xs text-emerald-800 mt-0.5 leading-relaxed">
                Total akumulasi ke-10 kriteria bernilai tepat 100%. Metode Simple Additive Weighting siap melakukan normalisasi dan perankingan secara valid.
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0">
            ✓ Formula SAW Valid
          </span>
        </div>
      ) : (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-300 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-shake">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-amber-900">
                Peringatan: Total Bobot Tidak 100%
              </h4>
              <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                Metode Simple Additive Weighting (SAW) mewajibkan total akumulasi bobot kriteria tepat 100%. Saat ini total bobot adalah <strong>{totalWeight}%</strong> ({totalWeight > 100 ? `Kelebihan ${totalWeight - 100}%` : `Kurang ${100 - totalWeight}%`}).
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleAutoNormalizeWeights}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs transition-all shrink-0 cursor-pointer"
          >
            Normalisasi Otomatis ke 100%
          </button>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="bg-white rounded-3xl p-2 border border-stone-200 shadow-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setActiveTab('weights')}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'weights'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
            }`}
          >
            <Percent className="w-4 h-4" />
            <span>Editor Bobot 10 Kriteria</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('matrix')}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'matrix'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
            }`}
          >
            <Table className="w-4 h-4" />
            <span>Matriks Nilai Jawaban per Paket</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('info')}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'info'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
            }`}
          >
            <Info className="w-4 h-4" />
            <span>Panduan Rumus SAW</span>
          </button>
        </div>

        {onNavigateToQuestions && (
          <button
            type="button"
            onClick={onNavigateToQuestions}
            className="px-3.5 py-2 text-xs font-semibold text-stone-600 hover:text-rose-600 flex items-center gap-1.5 cursor-pointer mr-2"
          >
            <span>Kelola Daftar Pertanyaan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Tab 1: Editor Bobot 10 Kriteria */}
      {activeTab === 'weights' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
            <div>
              <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900">
                Pengaturan Bobot Persentase 10 Kriteria
              </h3>
              <p className="text-xs text-stone-500">
                Tentukan tingkat prioritas setiap kriteria (total seluruh kriteria harus tepat 100% untuk SAW)
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                isWeightValid
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-red-50 text-red-700 border-red-200'
              }`}>
                Total: {totalWeight}% / 100%
              </span>
            </div>
          </div>

          {/* Quick Preset Buttons Bar */}
          <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-stone-600">Pilihan Cepat Preset:</span>
              <button
                type="button"
                onClick={handleApplyStandardSAWPreset}
                className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-semibold transition-all cursor-pointer"
                title="Acara 20%, Waktu 10%, Makeup 15%, Busana 10%, Gaya 10%, Ibu 5%, Kado 5%, Siraman 15%, Tambahan 5%, Anggaran 5%"
              >
                Standar SAW (100%)
              </button>
              <button
                type="button"
                onClick={handleApplyEqualPreset}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 text-xs font-semibold transition-all cursor-pointer"
                title="Rata 10% untuk masing-masing kriteria"
              >
                Bobot Merata (10% Rata)
              </button>
            </div>

            <button
              type="button"
              onClick={handleAutoNormalizeWeights}
              className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-semibold transition-all cursor-pointer"
            >
              Normalisasi Proporsional ke 100%
            </button>
          </div>

          {/* Criteria Sliders & Inputs List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {questions.map((q, idx) => {
              const currentW = weightsMap[q.id] ?? q.weight;
              const standardWeights = [20, 10, 15, 10, 10, 5, 5, 15, 5, 5];
              const defaultW = standardWeights[idx] ?? 10;
              const isDiffFromStandard = currentW !== defaultW;

              return (
                <div
                  key={q.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all space-y-3 ${
                    isDiffFromStandard
                      ? 'bg-purple-50/40 border-purple-200'
                      : 'bg-stone-50/70 border-stone-200 hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-stone-200 text-stone-800 text-xs font-mono font-bold flex items-center justify-center">
                        #{q.orderIndex}
                      </span>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-stone-900">
                          {q.criteriaName}
                        </h4>
                        <span className="text-[10px] text-stone-500 font-medium">
                          Standar SAW: {defaultW}%
                        </span>
                      </div>
                    </div>

                    {/* Numeric Input & Quick Increment/Decrement Buttons */}
                    <div className="flex items-center gap-1.5">
                      <div className="flex items-center gap-0.5">
                        <button
                          type="button"
                          onClick={() => handleWeightChange(q.id, Math.max(0, currentW - 5))}
                          className="px-1.5 py-0.5 rounded-md bg-stone-200 hover:bg-stone-300 text-stone-700 text-[10px] font-bold"
                          title="Kurangi 5%"
                        >
                          -5
                        </button>
                        <button
                          type="button"
                          onClick={() => handleWeightChange(q.id, Math.max(0, currentW - 1))}
                          className="px-1.5 py-0.5 rounded-md bg-stone-200 hover:bg-stone-300 text-stone-700 text-[10px] font-bold"
                          title="Kurangi 1%"
                        >
                          -1
                        </button>
                      </div>

                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={currentW}
                          onChange={(e) => handleWeightChange(q.id, Math.max(0, Math.min(100, Number(e.target.value) || 0)))}
                          className="w-16 px-2 py-1 rounded-lg border border-stone-300 bg-white font-serif font-bold text-sm text-right text-purple-700 focus:border-purple-500 focus:outline-hidden"
                        />
                        <span className="text-xs font-bold text-stone-500">%</span>
                      </div>

                      <div className="flex items-center gap-0.5">
                        <button
                          type="button"
                          onClick={() => handleWeightChange(q.id, Math.min(100, currentW + 1))}
                          className="px-1.5 py-0.5 rounded-md bg-stone-200 hover:bg-stone-300 text-stone-700 text-[10px] font-bold"
                          title="Tambah 1%"
                        >
                          +1
                        </button>
                        <button
                          type="button"
                          onClick={() => handleWeightChange(q.id, Math.min(100, currentW + 5))}
                          className="px-1.5 py-0.5 rounded-md bg-stone-200 hover:bg-stone-300 text-stone-700 text-[10px] font-bold"
                          title="Tambah 5%"
                        >
                          +5
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Range Slider */}
                  <div className="space-y-1">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={currentW}
                      onChange={(e) => handleWeightChange(q.id, Number(e.target.value))}
                      className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                    />
                    <div className="flex justify-between text-[10px] text-stone-400 font-mono">
                      <span>0%</span>
                      <span>25%</span>
                      <span>50%</span>
                      <span>75%</span>
                      <span>100%</span>
                    </div>
                  </div>

                  {/* Visual percentage meter */}
                  <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-purple-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, currentW)}%` }}
                    />
                  </div>

                  <p className="text-[11px] text-stone-500 line-clamp-1 italic">
                    "{q.text}"
                  </p>
                </div>
              );
            })}
          </div>

          {/* Bottom actions */}
          <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-stone-500">
              Perubahan bobot akan langsung mempengaruhi formula perhitungan peringkat rekomendasi paket bagi calon pengantin.
            </span>
            <button
              type="button"
              onClick={handleOpenSaveModal}
              disabled={!isWeightValid}
              className={`px-6 py-2.5 rounded-xl text-white text-xs sm:text-sm font-semibold shadow-md transition-all flex items-center gap-2 cursor-pointer ${
                isWeightValid
                  ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-600/20'
                  : 'bg-stone-300 cursor-not-allowed text-stone-500'
              }`}
            >
              <Save className="w-4 h-4" />
              <span>Simpan Bobot SAW (100%)</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Matriks Nilai Jawaban per Paket */}
      {activeTab === 'matrix' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-100 pb-4">
            <div>
              <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900">
                Tabel Matriks Nilai Jawaban per Paket
              </h3>
              <p className="text-xs text-stone-500">
                Nilai kesesuaian setiap pilihan jawaban kuesioner terhadap paket pernikahan (skala 1 = kurang sesuai hingga 4 = sangat sesuai)
              </p>
            </div>

            {/* Filter criteria and search input */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari kriteria atau opsi..."
                  value={matrixSearchQuery}
                  onChange={(e) => setMatrixSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-xl border border-stone-200 text-xs bg-white text-stone-800 placeholder-stone-400 focus:border-purple-500 focus:outline-hidden w-48 sm:w-56"
                />
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-xs text-stone-500 font-medium">Filter:</span>
                <select
                  value={selectedCriteriaFilter}
                  onChange={(e) => setSelectedCriteriaFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-stone-200 text-xs bg-white text-stone-800 focus:border-purple-500 cursor-pointer"
                >
                  <option value="all">Semua Kriteria ({questions.length})</option>
                  {questions.map((q) => (
                    <option key={q.id} value={q.id}>{q.orderIndex}. {q.criteriaName}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Scale Legend */}
          <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="font-semibold text-stone-600">Panduan Skala Nilai Kesesuaian (1 - 4):</span>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-[11px]">
                4 = Sangat Sesuai
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-blue-100 text-blue-800 border border-blue-300 font-bold text-[11px]">
                3 = Sesuai
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-100 text-amber-800 border border-amber-300 font-bold text-[11px]">
                2 = Cukup Sesuai
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-stone-100 text-stone-700 border border-stone-300 font-bold text-[11px]">
                1 = Kurang Sesuai
              </span>
            </div>
          </div>

          {/* Matrix table */}
          {filteredMatrixQuestions.length === 0 ? (
            <div className="p-8 text-center bg-stone-50 rounded-2xl border border-dashed border-stone-300">
              <p className="text-xs text-stone-500">Tidak ada kriteria atau opsi yang cocok dengan pencarian "{matrixSearchQuery}".</p>
              <button
                type="button"
                onClick={() => { setMatrixSearchQuery(''); setSelectedCriteriaFilter('all'); }}
                className="mt-2 text-xs font-semibold text-purple-600 hover:underline cursor-pointer"
              >
                Reset Filter
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto border border-stone-200 rounded-2xl shadow-2xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider font-semibold">
                    <th className="py-3 px-4 w-44">Kriteria & Bobot</th>
                    <th className="py-3 px-4 min-w-[240px]">Opsi Pilihan Jawaban</th>
                    {displayPackages.map((pkg, pIdx) => {
                      const badgeColors = [
                        'text-rose-700 bg-rose-50 border-rose-200',
                        'text-blue-700 bg-blue-50 border-blue-200',
                        'text-purple-700 bg-purple-50 border-purple-200',
                        'text-emerald-700 bg-emerald-50 border-emerald-200',
                        'text-amber-700 bg-amber-50 border-amber-200'
                      ];
                      const colorClass = badgeColors[pIdx % badgeColors.length];
                      return (
                        <th key={pkg.id} className="py-3 px-3 text-center min-w-[120px]">
                          <div className="flex flex-col items-center">
                            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-lg border ${colorClass}`}>
                              {pkg.name}
                            </span>
                            <span className="text-[10px] text-stone-400 font-mono mt-0.5">
                              {pkg.code || pkg.id}
                            </span>
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredMatrixQuestions.map((q) => (
                    <React.Fragment key={q.id}>
                      {q.options.map((opt, optIdx) => (
                        <tr key={opt.id} className="hover:bg-purple-50/20 transition-colors">
                          {/* Criteria Name (rowspan-like effect) */}
                          {optIdx === 0 ? (
                            <td 
                              rowSpan={q.options.length} 
                              className="py-3.5 px-4 align-top border-r border-stone-200 bg-stone-50/50"
                            >
                              <div className="space-y-1">
                                <span className="text-[10px] font-mono font-bold text-stone-400">
                                  #{q.orderIndex}
                                </span>
                                <p className="font-bold text-stone-900 text-xs">{q.criteriaName}</p>
                                <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-purple-100 text-purple-800 border border-purple-200">
                                  Bobot: {weightsMap[q.id] ?? q.weight}%
                                </span>
                              </div>
                            </td>
                          ) : null}

                          {/* Option text */}
                          <td className="py-3 px-4 border-r border-stone-100">
                            <div className="flex items-start gap-2.5">
                              <span className="w-5 h-5 rounded-full bg-stone-200 text-stone-700 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                                {String.fromCharCode(65 + optIdx)}
                              </span>
                              <div>
                                <p className="font-semibold text-stone-800 leading-snug">{opt.text}</p>
                                {opt.description && (
                                  <p className="text-[11px] text-stone-400 mt-0.5 line-clamp-1">
                                    {opt.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Dynamic Package Score Columns */}
                          {displayPackages.map((pkg) => {
                            const score = opt.scores[pkg.id as keyof typeof opt.scores] ?? 1;
                            const scoreStyle =
                              score === 4
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : score === 3
                                ? 'bg-blue-50 text-blue-800 border-blue-300'
                                : score === 2
                                ? 'bg-amber-50 text-amber-800 border-amber-300'
                                : 'bg-stone-50 text-stone-700 border-stone-300';

                            return (
                              <td key={pkg.id} className="py-3 px-2 text-center border-r border-stone-100 last:border-r-0">
                                <div className="inline-flex items-center justify-center">
                                  <select
                                    value={score}
                                    onChange={(e) => handleScoreChange(q.id, opt.id, pkg.id, Number(e.target.value))}
                                    className={`px-2 py-1 rounded-xl border font-bold text-xs cursor-pointer transition-all shadow-2xs focus:outline-hidden ${scoreStyle}`}
                                    title={`Ubah nilai kesesuaian untuk ${pkg.name}`}
                                  >
                                    <option value={4}>4 - Sangat Sesuai</option>
                                    <option value={3}>3 - Sesuai</option>
                                    <option value={2}>2 - Cukup Sesuai</option>
                                    <option value={1}>1 - Kurang Sesuai</option>
                                  </select>
                                </div>
                              </td>
                            );
                          })}

                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-stone-500">
              Skor 1-4 menentukan nilai elemen matriks X_ij sebelum dinormalisasi dengan formula benefit SAW (R_ij = X_ij / 4).
            </span>
            <button
              type="button"
              onClick={handleOpenSaveModal}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-purple-600/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Simpan Perubahan Matriks</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab 3: Panduan Rumus SAW */}
      {activeTab === 'info' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
          <div className="border-b border-stone-100 pb-4">
            <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900">
              Panduan Algoritma Simple Additive Weighting (SAW)
            </h3>
            <p className="text-xs text-stone-500">
              Prinsip perhitungan pembobotan penjumlahan terbobot pada Sistem Rekomendasi Paket Rias
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
              <span className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 font-serif font-bold text-sm flex items-center justify-center">
                1
              </span>
              <h4 className="text-xs font-bold text-stone-900">Input Jawaban & Penilaian</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Calon pengantin memilih 1 jawaban pada tiap 10 kriteria. Pilihan tersebut memiliki nilai kecocokan 1 sampai 4 untuk masing-masing kandidat paket rias.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
              <span className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 font-serif font-bold text-sm flex items-center justify-center">
                2
              </span>
              <h4 className="text-xs font-bold text-stone-900">Normalisasi Matriks Keputusan</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Kriteria merupakan atribut benefit (keuntungan), sehingga dinormalisasi dengan membagi nilai dengan nilai maksimum skala: R_ij = X_ij / max(X_j) = X_ij / 4.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
              <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 font-serif font-bold text-sm flex items-center justify-center">
                3
              </span>
              <h4 className="text-xs font-bold text-stone-900">Pembobotan & Perangkingan</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Nilai preferensi akhir dihitung dari penjumlahan perkalian bobot kriteria dengan nilai ternormalisasi: V_i = ∑ (W_j × R_ij). Paket dengan nilai V_i tertinggi menjadi rekomendasi utama.
              </p>
            </div>
          </div>

          {/* 10 Standard Criteria Breakdown */}
          <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
              10 Kriteria Penentu Standar Sistem:
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-white border border-stone-200 text-stone-800">
                <span className="text-[10px] text-purple-700 font-bold block">1. Acara (20%)</span>
                Akad / Resepsi / Siraman
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-stone-200 text-stone-800">
                <span className="text-[10px] text-purple-700 font-bold block">2. Waktu (10%)</span>
                Pagi / Siang / Malam / Full
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-stone-200 text-stone-800">
                <span className="text-[10px] text-purple-700 font-bold block">3. Makeup (15%)</span>
                Mempelai / Ibu / Jaga Kado
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-stone-200 text-stone-800">
                <span className="text-[10px] text-purple-700 font-bold block">4. Busana (10%)</span>
                Tradisional / Nasional
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-stone-200 text-stone-800">
                <span className="text-[10px] text-purple-700 font-bold block">5. Gaya Rias (10%)</span>
                Solo / Sunda / Basahan / Paes
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-stone-200 text-stone-800">
                <span className="text-[10px] text-purple-700 font-bold block">6. Rias Ibu (5%)</span>
                Jumlah ibu yang dirias
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-stone-200 text-stone-800">
                <span className="text-[10px] text-purple-700 font-bold block">7. Jaga Kado (5%)</span>
                Kebutuhan pagar ayu
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-stone-200 text-stone-800">
                <span className="text-[10px] text-purple-700 font-bold block">8. Siraman (15%)</span>
                Kebutuhan prosesi adat
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-stone-200 text-stone-800">
                <span className="text-[10px] text-purple-700 font-bold block">9. Tambahan (5%)</span>
                Hairdo / Beskap / Jas
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-stone-200 text-stone-800">
                <span className="text-[10px] text-purple-700 font-bold block">10. Anggaran (5%)</span>
                Budget preferensi klien
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Floating Action Bar for Live Weight Status */}
      {isDirty && (
        <aside
          aria-label="Status Penyimpanan dan Validasi Bobot"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-2xl w-[92%] bg-stone-900/95 backdrop-blur-md text-white p-4 rounded-2xl shadow-2xl border border-stone-700 flex items-center justify-between gap-4 animate-slideUp"
        >
          <div className="flex items-center gap-3">
            <div className={`w-3.5 h-3.5 rounded-full shrink-0 ${
              isWeightValid ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400 animate-ping'
            }`} />
            <div>
              <p className="text-xs font-bold text-white">
                {isWeightValid ? 'Total Bobot SAW: 100% (Valid ✓)' : `Total Bobot: ${totalWeight}% (Belum 100%)`}
              </p>
              <p className="text-[11px] text-stone-400">
                {isWeightValid
                  ? 'Perubahan siap disimpan ke dalam konfigurasi SAW'
                  : `Wajib tepat 100% (Selisih: ${totalWeight > 100 ? `-${totalWeight - 100}%` : `+${100 - totalWeight}%`})`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {!isWeightValid && (
              <button
                type="button"
                onClick={handleAutoNormalizeWeights}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-semibold text-xs transition-colors cursor-pointer"
              >
                Normalisasi 100%
              </button>
            )}
            <button
              type="button"
              onClick={handleOpenSaveModal}
              disabled={!isWeightValid}
              className={`px-4 py-1.5 rounded-xl font-semibold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                isWeightValid
                  ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-md'
                  : 'bg-stone-700 text-stone-400 cursor-not-allowed'
              }`}
            >
              <Save className="w-3.5 h-3.5" />
              <span>Simpan</span>
            </button>
          </div>
        </aside>
      )}

      {/* Save Confirmation Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div 
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative animate-scaleUp space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowSaveModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <Save className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-stone-900">
                  Konfirmasi Simpan Konfigurasi SAW
                </h3>
                <p className="text-xs text-stone-500">
                  Terapkan bobot kriteria dan matriks nilai ke sistem rekomendasi
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2.5 text-xs text-stone-700">
              <div className="flex justify-between items-center py-1 border-b border-stone-200/60">
                <span className="text-stone-500">Total Akumulasi Bobot:</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  {totalWeight}% (Tepat 100%)
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-stone-200/60">
                <span className="text-stone-500">Jumlah Kriteria Dikonfigurasi:</span>
                <span className="font-bold text-stone-900">{questions.length} Kriteria</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-stone-200/60">
                <span className="text-stone-500">Kandidat Paket Terhubung:</span>
                <span className="font-bold text-stone-900">{packages.length || 4} Paket</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-stone-500">Validasi Matematis SAW:</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Valid (ΣW = 100%)
                </span>
              </div>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Apakah Anda yakin ingin menyimpan seluruh konfigurasi bobot kriteria dan pembaharuan nilai matriks ini? Perubahan akan langsung berdampak pada perhitungan peringkat rekomendasi paket bagi calon pengantin.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowSaveModal(false)}
                className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmSave}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-purple-600/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Ya, Simpan Konfigurasi</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div 
            className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative animate-scaleUp space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowResetModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-serif font-bold text-stone-900">
              Konfirmasi Reset Konfigurasi
            </h3>

            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              Apakah Anda yakin ingin mengembalikan seluruh bobot ke standar bawaan SAW (Acara 20%, Waktu 10%, Makeup 15%, Busana 10%, Gaya 10%, Ibu 5%, Kado 5%, Siraman 15%, Tambahan 5%, Anggaran 5%) serta mereset seluruh matriks skor jawaban?
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-amber-600/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Ya, Reset ke Bawaan</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

