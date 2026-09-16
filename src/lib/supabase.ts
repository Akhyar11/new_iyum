import { createClient } from '@supabase/supabase-js';
import { Package } from '../types';
import { mockPackages } from '../data/mockPackages';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export interface GetPackagesFilter {
  search?: string;
  category?: string;
  includeInactive?: boolean;
}

/**
 * Service untuk mengakses dan mengelola data paket di Supabase / Database / API
 */
export const packageService = {
  /**
   * Mengambil daftar paket aktif dengan filter pencarian dan kategori
   */
  async getPackages(filter: GetPackagesFilter = {}): Promise<Package[]> {
    const { search = '', category = '', includeInactive = false } = filter;
    const q = search.trim().toLowerCase();

    if (!supabase) {
      // Fallback ke data mock dengan filter pencarian lokal
      let list = includeInactive 
        ? [...mockPackages] 
        : mockPackages.filter(p => p.status === 'active');

      if (category && category !== 'all') {
        list = list.filter(p => p.category?.toLowerCase() === category.toLowerCase());
      }

      if (q) {
        list = list.filter(p => {
          const inName = p.name.toLowerCase().includes(q);
          const inDesc = p.description.toLowerCase().includes(q);
          const inCode = p.code.toLowerCase().includes(q);
          const inCat = p.category ? p.category.toLowerCase().includes(q) : false;
          const inFacilities = p.facilities.some(f => f.toLowerCase().includes(q));
          return inName || inDesc || inCode || inCat || inFacilities;
        });
      }

      return list;
    }

    try {
      let query = supabase
        .from('packages')
        .select('*')
        .order('price', { ascending: true });

      if (!includeInactive) {
        query = query.eq('status', 'active');
      }

      if (category && category !== 'all') {
        query = query.eq('category', category);
      }

      if (q) {
        query = query.or(`name.ilike.%${q}%,description.ilike.%${q}%,code.ilike.%${q}%`);
      }

      const { data, error } = await query;
      if (error) {
        throw error;
      }

      return (data || []).map((row) => ({
        id: row.id,
        code: row.code,
        name: row.name,
        price: Number(row.price),
        description: row.description,
        photo_url: row.photo_url || '',
        facilities: Array.isArray(row.facilities) ? row.facilities : [],
        status: row.status as 'active' | 'inactive',
        category: row.category || 'Paket Make Up',
        created_at: row.created_at,
        updated_at: row.updated_at
      }));
    } catch (err: any) {
      console.warn('Gagal mengambil paket dari database Supabase, beralih ke mock:', err.message);
      return mockPackages.filter(p => p.status === 'active');
    }
  },

  /**
   * Mengambil paket berdasarkan ID
   */
  async getPackageById(id: string): Promise<Package | null> {
    if (!supabase) {
      const found = mockPackages.find(p => p.id === id || p.code === id);
      return found || null;
    }

    try {
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        const found = mockPackages.find(p => p.id === id || p.code === id);
        return found || null;
      }

      return {
        id: data.id,
        code: data.code,
        name: data.name,
        price: Number(data.price),
        description: data.description,
        photo_url: data.photo_url || '',
        facilities: Array.isArray(data.facilities) ? data.facilities : [],
        status: data.status as 'active' | 'inactive',
        category: data.category || 'Paket Make Up',
        created_at: data.created_at,
        updated_at: data.updated_at
      };
    } catch {
      const found = mockPackages.find(p => p.id === id || p.code === id);
      return found || null;
    }
  }
};

/**
 * Service untuk mengakses pertanyaan dan opsi jawaban
 */
export const questionService = {
  async getQuestions() {
    if (!supabase) {
      return (await import('../data/mockQuestions')).mockQuestions;
    }

    try {
      const { data, error } = await supabase
        .from('questions')
        .select(`
          id,
          text,
          subtitle,
          order_index,
          criteria:criteria_id (id, name, weight),
          options (id, text, description, order_index)
        `)
        .order('order_index', { ascending: true });

      if (error || !data || data.length === 0) {
        return (await import('../data/mockQuestions')).mockQuestions;
      }

      return data.map((q: any) => ({
        id: q.id,
        criteriaId: q.criteria?.id,
        criteriaName: q.criteria?.name,
        weight: Number(q.criteria?.weight || 10),
        orderIndex: q.order_index,
        text: q.text,
        subtitle: q.subtitle,
        options: (q.options || []).sort((a: any, b: any) => a.order_index - b.order_index)
      }));
    } catch {
      return (await import('../data/mockQuestions')).mockQuestions;
    }
  }
};

/**
 * Service untuk menyimpan dan mengambil riwayat rekomendasi
 */
export const recommendationService = {
  async saveRecommendation(
    userLabel: string,
    topPackageId: string,
    topScore: number,
    answers: Record<string, string>,
    rankedResults: Array<{ packageId: string; finalScore: number; rank: number }>
  ) {
    if (!supabase) {
      // Simpan di local storage jika offline / mock mode
      try {
        const history = JSON.parse(localStorage.getItem('griya_rias_history') || '[]');
        history.unshift({
          id: 'rec-' + Date.now(),
          user_label: userLabel,
          top_package_id: topPackageId,
          top_score: topScore,
          created_at: new Date().toISOString()
        });
        localStorage.setItem('griya_rias_history', JSON.stringify(history.slice(0, 50)));
      } catch {
        // ignore
      }
      return { success: true };
    }

    try {
      const { data: rec, error: recError } = await supabase
        .from('recommendations')
        .insert({
          user_label: userLabel,
          top_package_id: topPackageId,
          top_score: topScore
        })
        .select()
        .single();

      if (recError || !rec) throw recError;

      const recId = rec.id;

      // Insert answers
      const answerRows = Object.entries(answers).map(([questionId, optionId]) => ({
        recommendation_id: recId,
        question_id: questionId,
        option_id: optionId
      }));
      await supabase.from('recommendation_answers').insert(answerRows);

      // Insert results
      const resultRows = rankedResults.map(r => ({
        recommendation_id: recId,
        package_id: r.packageId,
        final_score: r.finalScore,
        rank: r.rank
      }));
      await supabase.from('recommendation_results').insert(resultRows);

      return { success: true, id: recId };
    } catch (err: any) {
      console.warn('Gagal menyimpan riwayat rekomendasi ke Supabase:', err.message);
      return { success: false, error: err.message };
    }
  },

  async getHistory() {
    if (!supabase) {
      try {
        return JSON.parse(localStorage.getItem('griya_rias_history') || '[]');
      } catch {
        return [];
      }
    }

    const { data } = await supabase
      .from('recommendations')
      .select(`
        id,
        user_label,
        top_score,
        created_at,
        top_package:top_package_id (name, price)
      `)
      .order('created_at', { ascending: false })
      .limit(50);

    return data || [];
  }
};
