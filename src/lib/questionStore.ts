import { QuestionMock, OptionMock, mockQuestions } from '../data/mockQuestions';

const STORAGE_KEY = 'iyum_makeover_questions_2025';

/**
 * Retrieve questions from localStorage or fallback to mockQuestions
 */
export function getStoredQuestions(): QuestionMock[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Gagal membaca data pertanyaan dari storage:', err);
  }
  return mockQuestions;
}

/**
 * Save questions to localStorage and broadcast change event
 */
export function saveStoredQuestions(questions: QuestionMock[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
    window.dispatchEvent(new CustomEvent('questions_updated', { detail: questions }));
  } catch (err) {
    console.error('Gagal menyimpan data pertanyaan ke storage:', err);
  }
}

/**
 * Reset questions to default mock data
 */
export function resetStoredQuestions(): QuestionMock[] {
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('questions_updated', { detail: mockQuestions }));
  } catch (err) {
    console.error('Gagal mereset data pertanyaan:', err);
  }
  return mockQuestions;
}

/**
 * Delete a question by ID and re-index remaining questions
 */
export function deleteStoredQuestion(id: string): QuestionMock[] {
  const current = getStoredQuestions();
  const updated = current
    .filter((q) => q.id !== id)
    .map((q, idx) => ({ ...q, orderIndex: idx + 1 }));
  saveStoredQuestions(updated);
  return updated;
}

/**
 * Upsert (insert or update) a question
 */
export function upsertStoredQuestion(question: QuestionMock): QuestionMock[] {
  const current = getStoredQuestions();
  const index = current.findIndex((q) => q.id === question.id);
  let updated: QuestionMock[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = question;
  } else {
    updated = [...current, { ...question, orderIndex: current.length + 1 }];
  }
  saveStoredQuestions(updated);
  return updated;
}

/**
 * Reorder questions (e.g. moving question up or down)
 */
export function moveStoredQuestion(id: string, direction: 'up' | 'down'): QuestionMock[] {
  const current = [...getStoredQuestions()];
  const index = current.findIndex((q) => q.id === id);
  if (index < 0) return current;

  const targetIndex = direction === 'up' ? index - 1 : index + 1;
  if (targetIndex < 0 || targetIndex >= current.length) return current;

  // Swap
  const temp = current[index];
  current[index] = current[targetIndex];
  current[targetIndex] = temp;

  // Re-assign orderIndex
  const reindexed = current.map((q, idx) => ({
    ...q,
    orderIndex: idx + 1,
  }));

  saveStoredQuestions(reindexed);
  return reindexed;
}

/**
 * Add an option to a specific question
 */
export function addOptionToQuestion(questionId: string, option: OptionMock): QuestionMock[] {
  const current = getStoredQuestions();
  const updated = current.map((q) => {
    if (q.id === questionId) {
      return {
        ...q,
        options: [...(q.options || []), option],
      };
    }
    return q;
  });
  saveStoredQuestions(updated);
  return updated;
}

/**
 * Update an option in a specific question
 */
export function updateOptionInQuestion(questionId: string, option: OptionMock): QuestionMock[] {
  const current = getStoredQuestions();
  const updated = current.map((q) => {
    if (q.id === questionId) {
      const newOptions = (q.options || []).map((opt) => (opt.id === option.id ? option : opt));
      return { ...q, options: newOptions };
    }
    return q;
  });
  saveStoredQuestions(updated);
  return updated;
}

/**
 * Delete an option from a specific question
 */
export function deleteOptionFromQuestion(questionId: string, optionId: string): QuestionMock[] {
  const current = getStoredQuestions();
  const updated = current.map((q) => {
    if (q.id === questionId) {
      const newOptions = (q.options || []).filter((opt) => opt.id !== optionId);
      return { ...q, options: newOptions };
    }
    return q;
  });
  saveStoredQuestions(updated);
  return updated;
}
