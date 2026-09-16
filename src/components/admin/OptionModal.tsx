import React, { useState, useEffect } from 'react';
import { X, Check, Sparkles } from 'lucide-react';
import { OptionMock } from '../../data/mockQuestions';

interface OptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (option: OptionMock) => void;
  initialData?: OptionMock | null;
  questionCriteriaName: string;
}

export const OptionModal: React.FC<OptionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  questionCriteriaName,
}) => {
  const isEditing = !!initialData;

  const [text, setText] = useState('');
  const [description, setDescription] = useState('');
  const [scores, setScores] = useState<Record<string, number>>({
    'pkg-1': 1,
    'pkg-2': 1,
    'pkg-3': 1,
    'pkg-4': 1,
    'pkg-5': 1,
    'pkg-6': 1,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setText(initialData.text);
      setDescription(initialData.description || '');
      setScores({
        'pkg-1': 1,
        'pkg-2': 1,
        'pkg-3': 1,
        'pkg-4': 1,
        'pkg-5': 1,
        'pkg-6': 1,
        ...initialData.scores
      });
    } else {
      setText('');
      setDescription('');
      setScores({
        'pkg-1': 1,
        'pkg-2': 1,
        'pkg-3': 1,
        'pkg-4': 1,
        'pkg-5': 1,
        'pkg-6': 1,
      });
    }
    setError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleScoreChange = (pkgKey: string, val: number) => {
    setScores((prev) => ({ ...prev, [pkgKey]: val }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      setError('Teks opsi jawaban wajib diisi');
      return;
    }

    const payload: OptionMock = {
      id: initialData?.id || `opt-${Date.now()}`,
      text: text.trim(),
      description: description.trim() || undefined,
      scores: scores,
    };

    onSave(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-stone-200 animate-scaleUp overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-stone-200 flex items-center justify-between bg-stone-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 shadow-2xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-serif font-bold text-stone-900">
                {isEditing ? 'Ubah Opsi Jawaban' : 'Tambah Opsi Jawaban Baru'}
              </h2>
              <p className="text-xs text-stone-500">
                Kriteria: <span className="font-semibold text-stone-800">{questionCriteriaName}</span>
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

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-5">
          
          {/* Teks Opsi */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Teks Pilihan Jawaban <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Contoh: Rangkaian Akad & Resepsi Penuh"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                error
                  ? 'border-red-400 bg-red-50/50 text-red-900'
                  : 'border-stone-200 bg-stone-50/40 text-stone-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
              }`}
            />
            {error && <p className="text-[11px] text-red-600 mt-1">{error}</p>}
          </div>

          {/* Deskripsi Opsi */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Penjelasan Singkat Opsi (Opsional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan maksud opsi jawaban ini untuk mempermudah calon pengantin..."
              className="w-full px-3.5 py-2 rounded-xl border border-stone-200 bg-stone-50/40 text-xs text-stone-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          {/* Skor Bobot SAW terhadap 6 Paket Resmi */}
          <div className="space-y-3 pt-2 border-t border-stone-100">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Nilai Kesesuaian SAW (Skala 1 - 4):
              </h4>
              <span className="text-[10px] text-stone-400">1: Rendah · 4: Sangat Cocok</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-60 overflow-y-auto pr-1">
              {[
                { id: 'pkg-1', name: 'Wedding Akad & Resepsi', code: 'PKG-WED-AKAD-RESEPSI', bg: 'bg-rose-50/60 border-rose-100 text-rose-900', sub: 'text-rose-600' },
                { id: 'pkg-2', name: 'Ngunduh Mantu', code: 'PKG-NGUNDUH-MANTU', bg: 'bg-amber-50/60 border-amber-100 text-amber-900', sub: 'text-amber-600' },
                { id: 'pkg-3', name: 'Pengantin Akad Resepsi', code: 'PKG-PENGANTIN-AKAD-RESEPSI', bg: 'bg-pink-50/60 border-pink-100 text-pink-900', sub: 'text-pink-600' },
                { id: 'pkg-4', name: 'Pengantin Resepsi Only', code: 'PKG-PENGANTIN-RESEPSI-ONLY', bg: 'bg-blue-50/60 border-blue-100 text-blue-900', sub: 'text-blue-600' },
                { id: 'pkg-5', name: 'Akad package', code: 'PKG-AKAD-PACKAGE', bg: 'bg-emerald-50/60 border-emerald-100 text-emerald-900', sub: 'text-emerald-600' },
                { id: 'pkg-6', name: 'Siraman package', code: 'PKG-SIRAMAN-PACKAGE', bg: 'bg-purple-50/60 border-purple-100 text-purple-900', sub: 'text-purple-600' },
              ].map((p) => (
                <div key={p.id} className={`p-2.5 rounded-2xl border flex items-center justify-between gap-2 ${p.bg}`}>
                  <div className="min-w-0">
                    <p className="text-xs font-bold truncate">{p.name}</p>
                    <p className={`text-[10px] font-mono ${p.sub}`}>{p.code}</p>
                  </div>
                  <select
                    value={scores[p.id] ?? 1}
                    onChange={(e) => handleScoreChange(p.id, Number(e.target.value))}
                    className="px-2 py-1 rounded-lg border border-stone-200 bg-white font-bold text-xs shadow-2xs"
                  >
                    {[1, 2, 3, 4].map((n) => (
                      <option key={n} value={n}>Nilai {n}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-stone-200 text-stone-700 text-xs font-semibold hover:bg-stone-50 transition-all cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{isEditing ? 'Simpan Opsi' : 'Tambah Opsi'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
