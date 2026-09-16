import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  RotateCcw, 
  Edit3, 
  Check, 
  AlertCircle, 
  AlertTriangle,
  BookmarkCheck,
  Trash2
} from 'lucide-react';
import { calculateSAWRecommendation, RecommendationCalculationResult } from '../utils/sawEngine';
import { TopRecommendationCard } from '../components/TopRecommendationCard';
import { AlternativePackagesList } from '../components/AlternativePackagesList';
import { Package } from '../types';
import { getStoredQuestions } from '../lib/questionStore';

const STORAGE_KEY = 'griya_rias_saw_answers';

interface RecommendationPageProps {
  onBackToCatalog: () => void;
  onViewPackageDetail: (pkg: Package) => void;
  initialAnswers?: Record<string, string>;
}

export const RecommendationPage: React.FC<RecommendationPageProps> = ({
  onBackToCatalog,
  onViewPackageDetail,
  initialAnswers = {},
}) => {
  // Load saved answers from localStorage if available
  const [answers, setAnswers] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore JSON parse error
    }
    return initialAnswers;
  });

  const [questions, setQuestions] = useState(() => {
    return [...getStoredQuestions()].sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
  });

  useEffect(() => {
    const handleSync = () => {
      setQuestions([...getStoredQuestions()].sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0)));
    };
    window.addEventListener('questions_updated', handleSync);
    return () => window.removeEventListener('questions_updated', handleSync);
  }, []);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [calculationResult, setCalculationResult] = useState<RecommendationCalculationResult | null>(null);
  const [hasRestoredAnswers, setHasRestoredAnswers] = useState(false);

  // Validation state
  const [showValidationError, setShowValidationError] = useState(false);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  const totalQuestions = questions.length;
  const currentQuestion = questions[currentQuestionIndex] || questions[0];
  const selectedOptionId = currentQuestion ? answers[currentQuestion.id] : undefined;

  const answeredQuestionsList = questions.filter(q => !!answers[q.id]);
  const unansweredQuestionsList = questions.filter(q => !answers[q.id]);
  const answeredCount = answeredQuestionsList.length;
  const isAllAnswered = totalQuestions > 0 && answeredCount === totalQuestions;
  const progressPercentage = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;

  // Sync answers to localStorage whenever they change
  useEffect(() => {
    try {
      if (Object.keys(answers).length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
      }
    } catch {
      // ignore
    }
  }, [answers]);

  const handleSelectOption = (optionId: string) => {
    const updated = {
      ...answers,
      [currentQuestion.id]: optionId,
    };
    setAnswers(updated);
    setShowValidationError(false);
  };

  const handleNext = () => {
    if (!selectedOptionId) {
      setShowValidationError(true);
      return;
    }

    setShowValidationError(false);
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      window.scrollTo({ top: 180, behavior: 'smooth' });
    } else {
      handleAttemptSubmit();
    }
  };

  const handlePrev = () => {
    setShowValidationError(false);
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      window.scrollTo({ top: 180, behavior: 'smooth' });
    }
  };

  const handleAttemptSubmit = () => {
    setAttemptedSubmit(true);

    if (!isAllAnswered) {
      setShowValidationError(true);
      // Automatically jump to the first unanswered question
      const firstUnansweredIndex = questions.findIndex(q => !answers[q.id]);
      if (firstUnansweredIndex !== -1) {
        setCurrentQuestionIndex(firstUnansweredIndex);
      }
      return;
    }

    setShowValidationError(false);
    const result = calculateSAWRecommendation(answers);
    setCalculationResult(result);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Simpan ke database / riwayat secara asinkron
    import('../lib/supabase').then(({ recommendationService }) => {
      recommendationService.saveRecommendation(
        'Pengantin ' + new Date().toLocaleDateString('id-ID'),
        result.topPackage.packageId,
        result.topPackage.normalizedScore,
        answers,
        result.allRanked.map(r => ({
          packageId: r.packageId,
          finalScore: r.normalizedScore,
          rank: r.rank
        }))
      );
    });
  };

  // Ulangi rekomendasi DENGAN mempertahankan jawaban tersimpan
  const handleRepeatWithSavedAnswers = () => {
    setCalculationResult(null);
    setCurrentQuestionIndex(0);
    setHasRestoredAnswers(true);
    setShowValidationError(false);
    setAttemptedSubmit(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset bersih (hapus semua jawaban) jika diinginkan pengguna
  const handleClearAndReset = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setCalculationResult(null);
    setAnswers({});
    setCurrentQuestionIndex(0);
    setHasRestoredAnswers(false);
    setShowValidationError(false);
    setAttemptedSubmit(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-stone-50 py-10 sm:py-14">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header Navigation */}
        <div className="flex items-center justify-between mb-8">
          <button
            type="button"
            onClick={onBackToCatalog}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-stone-200 text-stone-700 hover:text-rose-600 hover:border-rose-300 text-sm font-medium shadow-xs transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Katalog
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
              Metode SAW (10 Kriteria)
            </span>
          </div>
        </div>

        {!calculationResult ? (
          /* QUESTIONNAIRE WIZARD FLOW */
          <div className="space-y-8">
            {/* Header intro */}
            <div className="text-center max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-serif font-bold uppercase tracking-wider mb-2">
                <span>IYUM MAKEOVER</span>
                <span className="text-stone-300">•</span>
                <span className="font-sans font-normal text-stone-600">Wedding Gallery</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 leading-tight">
                Kuesioner Kebutuhan Paket Rias
              </h1>
              <p className="mt-2 text-stone-600 text-sm">
                Harap jawab <strong>seluruh 10 pertanyaan kriteria</strong> di bawah ini agar sistem SAW dapat menghitung rekomendasi paket terbaik dan terakurat untuk Anda.
              </p>
            </div>

            {/* Saved answers restored banner */}
            {(hasRestoredAnswers || (answeredCount > 0 && !calculationResult)) && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-2.5 text-xs sm:text-sm">
                  <BookmarkCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <span>
                    Jawaban Anda sebelumnya tersimpan (<strong>{answeredCount} dari 10 terjawab</strong>). Anda dapat mengubah jawaban pada kriteria yang diinginkan.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleClearAndReset}
                  className="text-xs text-stone-500 hover:text-rose-600 flex items-center gap-1 font-medium transition-colors flex-shrink-0 cursor-pointer"
                  title="Hapus semua jawaban tersimpan"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus Semua</span>
                </button>
              </div>
            )}

            {/* Validation Alert Box */}
            {showValidationError && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 shadow-sm flex items-start gap-3 animate-shake">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-xs sm:text-sm font-bold text-amber-900">
                    Wajib Menjawab Semua Pertanyaan
                  </h4>
                  <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
                    {unansweredQuestionsList.length > 0
                      ? `Masih ada ${unansweredQuestionsList.length} pertanyaan yang belum dijawab. Perhitungan SAW memerlukan nilai lengkap dari ke-10 kriteria.`
                      : 'Silakan pilih salah satu opsi jawaban di bawah ini terlebih dahulu sebelum melanjutkan.'}
                  </p>
                  
                  {unansweredQuestionsList.length > 0 && attemptedSubmit && (
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      <span className="text-[11px] text-amber-800 font-medium mr-1 self-center">
                        Belum diisi:
                      </span>
                      {unansweredQuestionsList.map((uq) => (
                        <button
                          key={uq.id}
                          type="button"
                          onClick={() => {
                            const idx = questions.findIndex(q => q.id === uq.id);
                            setCurrentQuestionIndex(idx);
                          }}
                          className="px-2 py-0.5 rounded-md bg-amber-200/80 hover:bg-amber-300 text-amber-900 text-xs font-semibold cursor-pointer transition-colors"
                        >
                          #{uq.orderIndex} {uq.criteriaName}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step Indicators & Progress Bar */}
            <div className="bg-white rounded-2xl p-5 border border-rose-100 shadow-xs space-y-3">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-stone-500">
                  Pertanyaan <strong className="text-rose-600 font-bold">{currentQuestionIndex + 1}</strong> dari {totalQuestions}
                </span>
                <span className={isAllAnswered ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>
                  {progressPercentage}% Selesai ({answeredCount}/{totalQuestions} dijawab)
                </span>
              </div>

              {/* Progress bar line */}
              <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-300 ${
                    isAllAnswered
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                      : 'bg-gradient-to-r from-rose-500 to-pink-600'
                  }`}
                  style={{ width: `${Math.max(progressPercentage, 10)}%` }}
                />
              </div>

              {/* Question Number Pills */}
              <div className="flex items-center justify-between pt-2 overflow-x-auto gap-1">
                {questions.map((q, idx) => {
                  const isAnswered = !!answers[q.id];
                  const isCurrent = idx === currentQuestionIndex;
                  const isMissingAfterSubmit = attemptedSubmit && !isAnswered;

                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => {
                        setCurrentQuestionIndex(idx);
                        setShowValidationError(false);
                      }}
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full text-xs font-semibold flex items-center justify-center transition-all flex-shrink-0 cursor-pointer ${
                        isCurrent
                          ? 'bg-rose-600 text-white ring-2 ring-rose-300 ring-offset-1'
                          : isMissingAfterSubmit
                          ? 'bg-amber-100 text-amber-800 border-2 border-amber-400 animate-pulse'
                          : isAnswered
                          ? 'bg-rose-100 text-rose-700 border border-rose-300'
                          : 'bg-stone-100 text-stone-400 hover:bg-stone-200'
                      }`}
                      title={`${q.criteriaName} (${isAnswered ? 'Sudah dijawab' : 'Wajib dijawab'})`}
                    >
                      {isAnswered && !isCurrent ? (
                        <Check className="w-3.5 h-3.5" />
                      ) : (
                        idx + 1
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Current Question Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-rose-100 shadow-sm space-y-6">
              {/* Question Meta Badge */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rose-50 pb-4">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-100">
                    Kriteria #{currentQuestion.orderIndex}: {currentQuestion.criteriaName}
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
                    Bobot SAW: {currentQuestion.weight}%
                  </span>
                </div>

                <div className="text-xs text-rose-600 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Wajib dijawab (1 pilihan)</span>
                </div>
              </div>

              {/* Question Title & Subtitle */}
              <div>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 leading-snug">
                  {currentQuestion.text}
                </h2>
                {currentQuestion.subtitle && (
                  <p className="mt-1.5 text-stone-500 text-xs sm:text-sm">
                    {currentQuestion.subtitle}
                  </p>
                )}
              </div>

              {/* Options List Cards */}
              <div className="space-y-3 pt-2">
                {currentQuestion.options.map((option) => {
                  const isSelected = selectedOptionId === option.id;

                  return (
                    <div
                      key={option.id}
                      onClick={() => handleSelectOption(option.id)}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 group ${
                        isSelected
                          ? 'border-rose-500 bg-rose-50/60 shadow-sm ring-1 ring-rose-400'
                          : 'border-stone-200 hover:border-rose-300 hover:bg-stone-50/70 bg-white'
                      }`}
                    >
                      {/* Radio indicator */}
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 flex-shrink-0 transition-colors ${
                        isSelected 
                          ? 'border-rose-600 bg-rose-600 text-white' 
                          : 'border-stone-300 group-hover:border-rose-400'
                      }`}>
                        {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>

                      {/* Option Text & Description */}
                      <div className="flex-1">
                        <p className={`text-sm sm:text-base font-semibold leading-snug ${
                          isSelected ? 'text-rose-900' : 'text-stone-800 group-hover:text-stone-900'
                        }`}>
                          {option.text}
                        </p>
                        {option.description && (
                          <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                            {option.description}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Inline helper if question not selected */}
              {!selectedOptionId && (
                <p className="text-xs text-amber-600 font-medium flex items-center gap-1.5 pt-1">
                  <AlertCircle className="w-4 h-4" />
                  Pilih salah satu jawaban di atas untuk lanjut ke pertanyaan berikutnya.
                </p>
              )}

              {/* Questionnaire Navigation Footer */}
              <div className="pt-6 border-t border-stone-100 flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={currentQuestionIndex === 0}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium flex items-center gap-2 transition-colors cursor-pointer ${
                    currentQuestionIndex === 0
                      ? 'text-stone-300 bg-stone-100 cursor-not-allowed'
                      : 'text-stone-700 bg-white border border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Sebelumnya
                </button>

                {currentQuestionIndex < totalQuestions - 1 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className={`px-6 py-2.5 rounded-full text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                      selectedOptionId
                        ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm'
                        : 'bg-stone-200 text-stone-500 hover:bg-stone-300'
                    }`}
                  >
                    Selanjutnya
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleAttemptSubmit}
                    className={`px-7 py-3 rounded-full text-sm font-bold shadow-lg transition-all flex items-center gap-2 cursor-pointer ${
                      isAllAnswered
                        ? 'bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white shadow-rose-300'
                        : 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-200'
                    }`}
                  >
                    <Sparkles className="w-4 h-4" />
                    {isAllAnswered ? 'Hitung Rekomendasi SAW' : `Lengkapi Jawaban (${answeredCount}/10)`}
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* RESULT VIEW: TOP RECOMMENDATION CARD + ALTERNATIVES + REPEAT BUTTONS */
          <div className="space-y-12 animate-fadeIn">
            {/* Top recommendation result card */}
            <TopRecommendationCard
              result={calculationResult.topPackage}
              onViewDetail={onViewPackageDetail}
            />

            {/* Alternative Packages List */}
            <AlternativePackagesList
              alternatives={calculationResult.alternatives}
              topScore={calculationResult.topPackage.normalizedScore}
              onViewDetail={onViewPackageDetail}
            />

            {/* Bottom Actions Bar with "Ulangi Rekomendasi dengan Jawaban Tersimpan" */}
            <div className="p-6 sm:p-8 bg-white rounded-3xl border border-rose-100 shadow-md space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="text-base font-serif font-bold text-stone-900">
                    Ingin Mengubah Salah Satu Kriteria?
                  </h4>
                  <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
                    Jawaban Anda tetap tersimpan sehingga Anda cukup mengganti kriteria yang ingin disesuaikan.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                  {/* Primary Repeat Button: Keeps saved answers */}
                  <button
                    type="button"
                    onClick={handleRepeatWithSavedAnswers}
                    className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-rose-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4" />
                    Ulangi Rekomendasi (Ubah Jawaban Tersimpan)
                  </button>

                  {/* Reset Clean option */}
                  <button
                    type="button"
                    onClick={handleClearAndReset}
                    className="px-4 py-3 rounded-xl border border-stone-200 hover:border-rose-300 text-stone-600 hover:text-rose-600 text-xs sm:text-sm font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    title="Mulai isi kuesioner dari lembar kosong"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset dari Awal
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100 flex justify-end">
                <button
                  type="button"
                  onClick={onBackToCatalog}
                  className="text-xs text-stone-500 hover:text-stone-800 font-medium flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Kembali Menjelajahi Katalog Paket
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
