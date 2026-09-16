import React, { useState, useMemo, useEffect } from 'react';
import { 
  HelpCircle, 
  Plus, 
  Search, 
  X, 
  Edit3, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  ChevronDown, 
  ChevronUp, 
  Sliders, 
  Layers, 
  Sparkles,
  ListOrdered,
  Percent
} from 'lucide-react';
import { QuestionMock, OptionMock } from '../data/mockQuestions';
import { 
  getStoredQuestions, 
  saveStoredQuestions,
  resetStoredQuestions, 
  deleteStoredQuestion, 
  moveStoredQuestion,
  upsertStoredQuestion,
  addOptionToQuestion,
  updateOptionInQuestion,
  deleteOptionFromQuestion
} from '../lib/questionStore';
import { QuestionFormModal } from '../components/admin/QuestionFormModal';
import { OptionModal } from '../components/admin/OptionModal';
import { ReorderQuestionsModal } from '../components/admin/ReorderQuestionsModal';

interface ManageQuestionsPageProps {
  onNavigateToDashboard?: () => void;
  onNavigateToWeights?: () => void;
}

export const ManageQuestionsPage: React.FC<ManageQuestionsPageProps> = ({
  onNavigateToDashboard,
  onNavigateToWeights
}) => {
  const [questions, setQuestions] = useState<QuestionMock[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [weightFilter, setWeightFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [expandedQuestions, setExpandedQuestions] = useState<Record<string, boolean>>({});
  const [notification, setNotification] = useState<{ type: 'success' | 'info'; message: string } | null>(null);
  
  // Modals
  const [questionToDelete, setQuestionToDelete] = useState<QuestionMock | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<QuestionMock | null>(null);
  const [isReorderModalOpen, setIsReorderModalOpen] = useState(false);

  // Option management modals & states
  const [isOptionModalOpen, setIsOptionModalOpen] = useState(false);
  const [targetQuestionForOption, setTargetQuestionForOption] = useState<QuestionMock | null>(null);
  const [editingOption, setEditingOption] = useState<OptionMock | null>(null);

  const handleOpenAddOption = (question: QuestionMock) => {
    setTargetQuestionForOption(question);
    setEditingOption(null);
    setIsOptionModalOpen(true);
  };

  const handleOpenEditOption = (question: QuestionMock, option: OptionMock) => {
    setTargetQuestionForOption(question);
    setEditingOption(option);
    setIsOptionModalOpen(true);
  };

  const handleDeleteOption = (question: QuestionMock, optionId: string) => {
    if (question.options.length <= 2) {
      alert('Pertanyaan harus memiliki minimal 2 opsi pilihan jawaban!');
      return;
    }
    if (window.confirm('Hapus opsi jawaban ini?')) {
      const updated = deleteOptionFromQuestion(question.id, optionId);
      setQuestions(updated);
      showToast('Opsi jawaban berhasil dihapus.');
    }
  };

  const handleSaveOption = (savedOption: OptionMock) => {
    if (!targetQuestionForOption) return;
    let updated: QuestionMock[];
    if (editingOption) {
      updated = updateOptionInQuestion(targetQuestionForOption.id, savedOption);
      showToast(`Opsi jawaban "${savedOption.text}" berhasil diperbarui.`);
    } else {
      updated = addOptionToQuestion(targetQuestionForOption.id, savedOption);
      showToast('Opsi jawaban baru berhasil ditambahkan.');
    }
    setQuestions(updated);
    setIsOptionModalOpen(false);
  };

  const handleOpenAdd = () => {
    setEditingQuestion(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (q: QuestionMock) => {
    setEditingQuestion(q);
    setIsFormModalOpen(true);
  };

  const handleSaveQuestion = (savedQ: QuestionMock) => {
    const updated = upsertStoredQuestion(savedQ);
    setQuestions(updated);
    setIsFormModalOpen(false);
    showToast(
      editingQuestion
        ? `Perubahan kriteria "${savedQ.criteriaName}" berhasil disimpan.`
        : `Pertanyaan kriteria "${savedQ.criteriaName}" berhasil ditambahkan.`
    );
  };

  const loadData = () => {
    const data = getStoredQuestions();
    setQuestions(data);
    // Initially expand first 2 questions
    const initExp: Record<string, boolean> = {};
    data.forEach((q, idx) => {
      if (idx < 2) initExp[q.id] = true;
    });
    setExpandedQuestions((prev) => (Object.keys(prev).length ? prev : initExp));
  };

  useEffect(() => {
    loadData();

    const handleUpdate = () => {
      loadData();
    };

    window.addEventListener('questions_updated', handleUpdate);
    return () => {
      window.removeEventListener('questions_updated', handleUpdate);
    };
  }, []);

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // Quick stats
  const stats = useMemo(() => {
    const totalQuestions = questions.length;
    const totalOptions = questions.reduce((acc, q) => acc + (q.options?.length || 0), 0);
    const totalWeight = questions.reduce((acc, q) => acc + (q.weight || 0), 0);
    const uniqueCriteria = new Set(questions.map((q) => q.criteriaName)).size;

    return { totalQuestions, totalOptions, totalWeight, uniqueCriteria };
  }, [questions]);

  // Toggle expand per question
  const toggleExpand = (id: string) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleExpandAll = (expand: boolean) => {
    const newExp: Record<string, boolean> = {};
    questions.forEach((q) => {
      newExp[q.id] = expand;
    });
    setExpandedQuestions(newExp);
  };

  // Reordering
  const handleMove = (id: string, direction: 'up' | 'down') => {
    const updated = moveStoredQuestion(id, direction);
    setQuestions(updated);
    showToast(`Urutan pertanyaan berhasil dipindahkan ke ${direction === 'up' ? 'atas' : 'bawah'}.`);
  };

  // Deletion
  const handleConfirmDelete = () => {
    if (!questionToDelete) return;
    const updated = deleteStoredQuestion(questionToDelete.id);
    setQuestions(updated);
    showToast(`Pertanyaan "${questionToDelete.criteriaName}" berhasil dihapus.`);
    setQuestionToDelete(null);
  };

  // Reset
  const handleResetData = () => {
    if (window.confirm('Kembalikan 10 daftar pertanyaan ke konfigurasi kriteria bawaan awal?')) {
      const initial = resetStoredQuestions();
      setQuestions(initial);
      showToast('Daftar pertanyaan berhasil dikembalikan ke data awal sistem.');
    }
  };

  // Filtered questions
  const filteredQuestions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return questions.filter((item) => {
      // Weight filter
      if (weightFilter === 'high' && item.weight < 15) return false;
      if (weightFilter === 'medium' && item.weight !== 10) return false;
      if (weightFilter === 'low' && item.weight > 5) return false;

      // Search query
      if (!q) return true;

      const inText = item.text.toLowerCase().includes(q);
      const inCriteria = item.criteriaName.toLowerCase().includes(q);
      const inSubtitle = item.subtitle?.toLowerCase().includes(q);
      const inOptions = item.options.some(
        (opt) => opt.text.toLowerCase().includes(q) || opt.description?.toLowerCase().includes(q)
      );

      return inText || inCriteria || inSubtitle || inOptions;
    });
  }, [questions, searchQuery, weightFilter]);

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
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
              Kuesioner & Kriteria
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 flex items-center gap-3">
            <HelpCircle className="w-8 h-8 text-amber-600" />
            <span>Kelola Pertanyaan Rekomendasi</span>
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm max-w-2xl leading-relaxed">
            Daftar pertanyaan yang diajukan kepada calon pengantin untuk menggali kebutuhan rias, kriteria acara, dan penilaian bobot Simple Additive Weighting (SAW).
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleResetData}
            title="Reset ke daftar pertanyaan bawaan awal"
            className="px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
          >
            <RotateCcw className="w-4 h-4 text-stone-500" />
            <span>Reset Bawaan</span>
          </button>

          {onNavigateToWeights && (
            <button
              type="button"
              onClick={onNavigateToWeights}
              className="px-4 py-2.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-800 text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
            >
              <Sliders className="w-4 h-4 text-stone-600" />
              <span>Atur Bobot SAW</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsReorderModalOpen(true)}
            className="px-4 py-2.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-800 text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
            title="Ubah nomor urut tampil pertanyaan"
          >
            <ListOrdered className="w-4 h-4 text-amber-600" />
            <span>Atur Urutan</span>
          </button>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white text-xs sm:text-sm font-semibold shadow-md shadow-amber-600/20 hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Pertanyaan</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Pertanyaan */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-stone-500">Total Pertanyaan</p>
            <p className="text-2xl font-serif font-bold text-stone-900 mt-1">{stats.totalQuestions}</p>
            <p className="text-[11px] text-stone-400 mt-0.5">Pertanyaan kuesioner</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <HelpCircle className="w-6 h-6" />
          </div>
        </div>

        {/* Kriteria Terdaftar */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-stone-500">Kriteria Terdaftar</p>
            <p className="text-2xl font-serif font-bold text-stone-900 mt-1">{stats.uniqueCriteria}</p>
            <p className="text-[11px] text-stone-400 mt-0.5">Kategori parameter SAW</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        {/* Total Opsi Jawaban */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-stone-500">Opsi Jawaban</p>
            <p className="text-2xl font-serif font-bold text-stone-900 mt-1">{stats.totalOptions}</p>
            <p className="text-[11px] text-stone-400 mt-0.5">Pilihan preferensi klien</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <ListOrdered className="w-6 h-6" />
          </div>
        </div>

        {/* Akumulasi Bobot Kriteria */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-stone-500">Akumulasi Bobot</p>
            <p className={`text-2xl font-serif font-bold mt-1 ${stats.totalWeight === 100 ? 'text-emerald-600' : 'text-red-600'}`}>
              {stats.totalWeight}%
            </p>
            <p className={`text-[11px] mt-0.5 ${stats.totalWeight === 100 ? 'text-emerald-600' : 'text-red-500 font-semibold'}`}>
              {stats.totalWeight === 100 ? 'Valid: Tepat 100%' : 'Peringatan: Bukan 100%'}
            </p>
          </div>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stats.totalWeight === 100 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
            <Percent className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari pertanyaan, kriteria (mis. Acara, Busana), opsi..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
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

          {/* Weight Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-stone-100 border border-stone-200 text-xs shrink-0">
            <button
              type="button"
              onClick={() => setWeightFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                weightFilter === 'all'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Semua ({questions.length})
            </button>
            <button
              type="button"
              onClick={() => setWeightFilter('high')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                weightFilter === 'high'
                  ? 'bg-white text-amber-800 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Tinggi (≥15%)
            </button>
            <button
              type="button"
              onClick={() => setWeightFilter('medium')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                weightFilter === 'medium'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Sedang (10%)
            </button>
            <button
              type="button"
              onClick={() => setWeightFilter('low')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                weightFilter === 'low'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Pendukung (5%)
            </button>
          </div>
        </div>

        {/* Expansion toolbar */}
        <div className="flex items-center justify-between pt-3 border-t border-stone-100 text-xs text-stone-500">
          <span>Menampilkan {filteredQuestions.length} pertanyaan kriteria rekomendasi</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleExpandAll(true)}
              className="text-stone-600 hover:text-amber-700 hover:underline font-medium cursor-pointer"
            >
              Buka Semua Opsi
            </button>
            <span className="text-stone-300">•</span>
            <button
              type="button"
              onClick={() => handleExpandAll(false)}
              className="text-stone-600 hover:text-amber-700 hover:underline font-medium cursor-pointer"
            >
              Tutup Semua Opsi
            </button>
          </div>
        </div>
      </div>

      {/* Questions List */}
      {filteredQuestions.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 shadow-xs space-y-4">
          <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
            <HelpCircle className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900">
              Pertanyaan Tidak Ditemukan
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto mt-1">
              Tidak ada kriteria pertanyaan yang cocok dengan pencarian atau filter yang dipilih.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setWeightFilter('all');
            }}
            className="px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-all inline-flex items-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filter & Pencarian</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredQuestions.map((q, index) => {
            const isExpanded = !!expandedQuestions[q.id];
            const isFirst = index === 0;
            const isLast = index === filteredQuestions.length - 1;

            return (
              <div 
                key={q.id}
                className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden transition-all hover:border-stone-300"
              >
                {/* Question Header Row */}
                <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    
                    {/* Order Number Badge */}
                    <div className="w-9 h-9 rounded-xl bg-stone-100 text-stone-700 font-serif font-bold flex items-center justify-center shrink-0 border border-stone-200">
                      {q.orderIndex || index + 1}
                    </div>

                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">
                          {q.criteriaName}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          Bobot: {q.weight}%
                        </span>
                        <span className="text-[11px] text-stone-400 font-mono">
                          ID: {q.id}
                        </span>
                      </div>

                      <h3 className="text-sm sm:text-base font-bold text-stone-900 leading-snug">
                        {q.text}
                      </h3>

                      {q.subtitle && (
                        <p className="text-xs text-stone-500 leading-relaxed">
                          {q.subtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions Toolbar */}
                  <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                    
                    {/* Order buttons */}
                    <div className="flex items-center bg-stone-100 rounded-lg p-0.5 border border-stone-200 mr-1">
                      <button
                        type="button"
                        disabled={isFirst}
                        onClick={() => handleMove(q.id, 'up')}
                        className={`p-1.5 rounded-md transition-all ${
                          isFirst 
                            ? 'text-stone-300 cursor-not-allowed' 
                            : 'text-stone-600 hover:text-stone-900 hover:bg-white cursor-pointer'
                        }`}
                        title="Geser Urutan ke Atas"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={isLast}
                        onClick={() => handleMove(q.id, 'down')}
                        className={`p-1.5 rounded-md transition-all ${
                          isLast 
                            ? 'text-stone-300 cursor-not-allowed' 
                            : 'text-stone-600 hover:text-stone-900 hover:bg-white cursor-pointer'
                        }`}
                        title="Geser Urutan ke Bawah"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Edit button */}
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(q)}
                      className="p-2 rounded-xl border border-stone-200 hover:border-blue-300 hover:bg-blue-50 text-stone-600 hover:text-blue-700 transition-all cursor-pointer"
                      title="Ubah Pertanyaan & Opsi"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={() => setQuestionToDelete(q)}
                      className="p-2 rounded-xl border border-stone-200 hover:border-red-300 hover:bg-red-50 text-stone-600 hover:text-red-700 transition-all cursor-pointer"
                      title="Hapus Pertanyaan"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Expand/Collapse Toggle */}
                    <button
                      type="button"
                      onClick={() => toggleExpand(q.id)}
                      className="p-2 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-600 transition-all cursor-pointer flex items-center gap-1 text-xs"
                      title={isExpanded ? 'Tutup Opsi' : 'Buka Opsi'}
                    >
                      <span className="text-[11px] font-medium hidden md:inline">
                        {q.options?.length || 0} Opsi
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>

                  </div>
                </div>

                {/* Collapsible Options Section */}
                {isExpanded && (
                  <div className="bg-stone-50/70 p-5 sm:p-6 border-t border-stone-100 space-y-4 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        <span>Daftar Opsi Jawaban ({q.options?.length || 0}):</span>
                      </h4>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleOpenAddOption(q)}
                          className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] font-semibold transition-all flex items-center gap-1 cursor-pointer border border-indigo-200"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Tambah Opsi</span>
                        </button>
                        <span className="text-[11px] text-stone-400">
                          Skor SAW (1 - 4)
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {q.options?.map((opt, optIdx) => {
                        const letter = String.fromCharCode(65 + optIdx); // A, B, C, D
                        return (
                          <div
                            key={opt.id}
                            className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-2xs space-y-2.5 flex flex-col justify-between group hover:border-indigo-200 transition-colors"
                          >
                            <div className="space-y-1">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex items-start gap-2 flex-1">
                                  <span className="w-5 h-5 rounded-full bg-stone-100 text-stone-800 text-[11px] font-bold flex items-center justify-center shrink-0 border border-stone-200">
                                    {letter}
                                  </span>
                                  <p className="text-xs font-bold text-stone-900 leading-snug">
                                    {opt.text}
                                  </p>
                                </div>

                                {/* Option action buttons */}
                                <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                                  <button
                                    type="button"
                                    onClick={() => handleOpenEditOption(q, opt)}
                                    className="p-1 rounded-md text-stone-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                                    title="Ubah opsi jawaban ini"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteOption(q, opt.id)}
                                    className="p-1 rounded-md text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                                    title="Hapus opsi ini"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>

                              {opt.description && (
                                <p className="text-[11px] text-stone-500 pl-7 leading-relaxed">
                                  {opt.description}
                                </p>
                              )}
                            </div>

                            {/* Scores for candidate packages */}
                            <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center gap-1.5 text-[10px]">
                              <span className="text-stone-400 font-medium">Nilai:</span>
                              <span className="px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 font-semibold">
                                Akad: {opt.scores['pkg-1']}
                              </span>
                              <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-semibold">
                                Resepsi: {opt.scores['pkg-2']}
                              </span>
                              <span className="px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 font-semibold">
                                All-in: {opt.scores['pkg-3']}
                              </span>
                              <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                                Siraman: {opt.scores['pkg-4']}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {questionToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-stone-200 space-y-5 animate-scaleUp">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto border border-red-100">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-lg font-serif font-bold text-stone-900">
                Hapus Pertanyaan Kriteria?
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Apakah Anda yakin ingin menghapus kriteria pertanyaan ini secara permanen dari kuesioner rekomendasi?
              </p>
            </div>

            {/* Question Card Preview Summary */}
            <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-md bg-stone-200 text-stone-800 text-[10px] font-bold">
                  #{questionToDelete.orderIndex} {questionToDelete.criteriaName}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[10px] font-bold">
                  Bobot: {questionToDelete.weight}%
                </span>
              </div>
              <p className="text-xs font-semibold text-stone-900 line-clamp-2">
                {questionToDelete.text}
              </p>
              <p className="text-[11px] text-stone-500">
                {questionToDelete.options?.length || 0} opsi pilihan jawaban terkait akan ikut terhapus.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                Perhatian: Menghapus pertanyaan ini akan menurunkan total akumulasi bobot SAW dari {stats.totalWeight}% menjadi {stats.totalWeight - questionToDelete.weight}%.
              </span>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setQuestionToDelete(null)}
                className="flex-1 py-2.5 rounded-xl border border-stone-200 text-stone-700 text-xs font-semibold hover:bg-stone-50 transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-md shadow-red-600/20 transition-all cursor-pointer"
              >
                Ya, Hapus Pertanyaan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Question Form Modal (Add / Edit) */}
      <QuestionFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveQuestion}
        initialData={editingQuestion}
        totalWeightExcludingCurrent={editingQuestion ? stats.totalWeight - editingQuestion.weight : stats.totalWeight}
      />

      {/* Option Modal (Add / Edit Option) */}
      <OptionModal
        isOpen={isOptionModalOpen}
        onClose={() => setIsOptionModalOpen(false)}
        onSave={handleSaveOption}
        initialData={editingOption}
        questionCriteriaName={targetQuestionForOption?.criteriaName || ''}
      />

      {/* Reorder Questions Modal */}
      <ReorderQuestionsModal
        isOpen={isReorderModalOpen}
        onClose={() => setIsReorderModalOpen(false)}
        questions={questions}
        onSaveOrder={(newOrdered) => {
          saveStoredQuestions(newOrdered);
          setQuestions(newOrdered);
          setIsReorderModalOpen(false);
          showToast('Urutan tampil seluruh pertanyaan kriteria berhasil diperbarui.');
        }}
      />

    </div>
  );
};
