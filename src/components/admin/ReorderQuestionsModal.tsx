import React, { useState, useEffect } from 'react';
import { X, Check, ArrowUp, ArrowDown, ListOrdered, Sparkles } from 'lucide-react';
import { QuestionMock } from '../../data/mockQuestions';

interface ReorderQuestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: QuestionMock[];
  onSaveOrder: (orderedQuestions: QuestionMock[]) => void;
}

export const ReorderQuestionsModal: React.FC<ReorderQuestionsModalProps> = ({
  isOpen,
  onClose,
  questions,
  onSaveOrder,
}) => {
  const [items, setItems] = useState<QuestionMock[]>([]);

  useEffect(() => {
    // Sort by orderIndex
    const sorted = [...questions].sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
    setItems(sorted);
  }, [questions, isOpen]);

  if (!isOpen) return null;

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const copy = [...items];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;

    setItems(copy);
  };

  const handleSave = () => {
    // Reassign orderIndex 1..N
    const reindexed = items.map((item, idx) => ({
      ...item,
      orderIndex: idx + 1,
    }));
    onSaveOrder(reindexed);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-stone-200 animate-scaleUp overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-stone-200 flex items-center justify-between bg-stone-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 shadow-2xs">
              <ListOrdered className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-serif font-bold text-stone-900">
                Atur Urutan Tampil Pertanyaan
              </h2>
              <p className="text-xs text-stone-500">
                Ubah alur langkah pertanyaan yang akan dijawab oleh calon pengantin
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

        {/* List of reorderable questions */}
        <div className="flex-1 overflow-y-auto p-6 space-y-2.5">
          <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200/80 flex items-center gap-2 text-xs text-amber-900 mb-2">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Gunakan tombol panah untuk menaikkan atau menurunkan posisi pertanyaan kriteria.</span>
          </div>

          {items.map((item, idx) => {
            const isFirst = idx === 0;
            const isLast = idx === items.length - 1;

            return (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-white border border-stone-200 hover:border-amber-300 flex items-center justify-between gap-3 shadow-2xs transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-7 h-7 rounded-xl bg-stone-100 text-stone-800 font-serif font-bold text-xs flex items-center justify-center shrink-0 border border-stone-200">
                    {idx + 1}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-100">
                        {item.criteriaName}
                      </span>
                      <span className="text-[10px] font-medium text-stone-400">
                        Bobot: {item.weight}%
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-stone-900 truncate mt-0.5">
                      {item.text}
                    </p>
                  </div>
                </div>

                {/* Arrow Buttons */}
                <div className="flex items-center gap-1 shrink-0 bg-stone-100 p-1 rounded-xl border border-stone-200">
                  <button
                    type="button"
                    disabled={isFirst}
                    onClick={() => handleMove(idx, 'up')}
                    className={`p-1.5 rounded-lg transition-all ${
                      isFirst
                        ? 'text-stone-300 cursor-not-allowed'
                        : 'text-stone-700 hover:text-stone-900 hover:bg-white cursor-pointer'
                    }`}
                    title="Naikkan urutan"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    disabled={isLast}
                    onClick={() => handleMove(idx, 'down')}
                    className={`p-1.5 rounded-lg transition-all ${
                      isLast
                        ? 'text-stone-300 cursor-not-allowed'
                        : 'text-stone-700 hover:text-stone-900 hover:bg-white cursor-pointer'
                    }`}
                    title="Turunkan urutan"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-stone-200 text-stone-700 text-xs font-semibold hover:bg-stone-100 transition-all cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-md shadow-amber-600/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Simpan Urutan Baru</span>
          </button>
        </div>

      </div>
    </div>
  );
};
