import { createClient } from '@supabase/supabase-js';

const FALLBACK_PACKAGES = [
  {
    id: 'pkg-1',
    code: 'PKG-AKAD',
    name: 'Paket Akad',
    price: 3500000,
    description: 'Paket riasan sakral khusus prosesi akad nikah dengan sentuhan natural elegan dan tahan lama hingga acara selesai.',
    photo_url: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&w=800&q=80',
    facilities: [
      'Makeup & Hairdo/Hijabdo Pengantin Wanita untuk Akad',
      'Rias & Busana Pengantin Pria (Beskap/Jas)',
      'Aksesoris Pengantin & Ronce Melati Asli',
      'Retouch makeup 1 kali saat acara berlangsung',
      'Makeup & Busana untuk 2 Ibu Mempelai',
      'Free softlens & kuku palsu (fake nails)'
    ],
    status: 'active',
    category: 'Akad Nikah'
  },
  {
    id: 'pkg-2',
    code: 'PKG-RESEPSI',
    name: 'Paket Resepsi',
    price: 5000000,
    description: 'Paket tata rias megah dan glamor untuk acara pesta resepsi pernikahan, dirancang memikat di bawah sorot lampu panggung.',
    photo_url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
    facilities: [
      'Makeup & Hairdo/Hijabdo Pengantin Resepsi Glamour',
      'Busana Lengkap Pengantin Wanita & Pria Resepsi',
      'Aksesoris Mewah (Mahkota / Siger / Cunduk Mentul)',
      'Makeup & Kain/Kebaya untuk 2 Ibu Mempelai',
      'Busana Beskap untuk 2 Bapak Mempelai',
      'Makeup & Busana untuk 4 Pagar Ayu / Jaga Kado',
      'Standby MUA & Asisten selama acara'
    ],
    status: 'active',
    category: 'Resepsi'
  },
  {
    id: 'pkg-3',
    code: 'PKG-ALL-IN',
    name: 'Paket Akad + Resepsi',
    price: 7500000,
    description: 'Solusi lengkap menyeluruh untuk seluruh rangkaian pernikahan hari H mulai dari akad pagi hingga resepsi malam hari.',
    photo_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    facilities: [
      'Makeup & Busana Akad Nikah (Ganti Busana & Look)',
      'Makeup & Busana Resepsi Pengantin (Full Retouch)',
      '2 Set Busana Pengantin (Tradisional / Modern)',
      'Aksesoris Lengkap & 2 Set Ronce Melati Segar',
      'Makeup & Busana untuk 2 Ibu Akad & Resepsi',
      'Busana Beskap untuk 2 Bapak Pengantin',
      'Makeup & Busana untuk 4 Orang Jaga Kado / Pagar Ayu',
      'Free Test Makeup / Touch Up Kit Eksklusif'
    ],
    status: 'active',
    category: 'Full Wedding'
  },
  {
    id: 'pkg-4',
    code: 'PKG-SIRAMAN',
    name: 'Siraman Package',
    price: 2500000,
    description: 'Paket khusus prosesi adat pra-nikah Siraman & Midodareni dengan riasan tradisional sakral yang segar dan natural.',
    photo_url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    facilities: [
      'Makeup Tipis Natural Tahan Air untuk Calon Pengantin',
      'Hairdo Tradisional / Sanggul / Hijabdo Khusus Adat',
      'Ronce Melati Basahan Dada & Bando Melati Asli',
      'Penyewaan Kain Jarik Batik Tradisional & Kemben',
      'Makeup & Hairdo Sederhana untuk 2 Ibu',
      'Bimbingan tata cara paes & busana adat siraman'
    ],
    status: 'active',
    category: 'Prosesi Adat'
  }
];

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { id } = req.query || {};

  if (!id) {
    return res.status(400).json({
      success: false,
      message: 'Parameter id paket diperlukan.'
    });
  }

  // PUT / PATCH: Ubah data paket
  if (req.method === 'PUT' || req.method === 'PATCH') {
    try {
      const body = req.body || {};
      const { name, price, description, photo_url, facilities, category, status, code } = body;

      const updates: any = {
        updated_at: new Date().toISOString()
      };

      if (name !== undefined) {
        if (typeof name !== 'string' || !name.trim()) {
          return res.status(400).json({ success: false, message: 'Nama paket tidak boleh kosong.' });
        }
        updates.name = name.trim();
      }

      if (price !== undefined) {
        const parsedPrice = Number(price);
        if (isNaN(parsedPrice) || parsedPrice < 0) {
          return res.status(400).json({ success: false, message: 'Harga paket harus berupa angka positif atau nol.' });
        }
        updates.price = parsedPrice;
      }

      if (description !== undefined) {
        if (typeof description !== 'string' || !description.trim()) {
          return res.status(400).json({ success: false, message: 'Deskripsi paket tidak boleh kosong.' });
        }
        updates.description = description.trim();
      }

      if (photo_url !== undefined) {
        updates.photo_url = typeof photo_url === 'string' ? photo_url.trim() : '';
      }

      if (facilities !== undefined) {
        updates.facilities = Array.isArray(facilities)
          ? facilities.filter(f => typeof f === 'string' && f.trim()).map(f => f.trim())
          : typeof facilities === 'string' && facilities.trim()
          ? facilities.split(',').map(f => f.trim()).filter(Boolean)
          : [];
      }

      if (category !== undefined) {
        updates.category = typeof category === 'string' ? category.trim() : 'Umum';
      }

      if (status !== undefined) {
        if (!['active', 'inactive'].includes(status)) {
          return res.status(400).json({ success: false, message: 'Status paket harus "active" atau "inactive".' });
        }
        updates.status = status;
      }

      if (code !== undefined && typeof code === 'string' && code.trim()) {
        updates.code = code.trim().toUpperCase();
      }

      const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
      const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

      if (supabaseUrl && supabaseAnonKey) {
        const supabase = createClient(supabaseUrl, supabaseAnonKey);

        const { data, error } = await supabase
          .from('packages')
          .update(updates)
          .or(`id.eq.${id},code.eq.${id}`)
          .select()
          .single();

        if (error || !data) {
          return res.status(404).json({
            success: false,
            message: `Paket dengan ID "${id}" tidak ditemukan atau gagal diperbarui.`
          });
        }

        return res.status(200).json({
          success: true,
          message: 'Data paket berhasil diperbarui.',
          data
        });
      }

      // Fallback in-memory update
      const index = FALLBACK_PACKAGES.findIndex(p => p.id === id || p.code.toLowerCase() === id.toLowerCase());
      if (index === -1) {
        return res.status(404).json({
          success: false,
          message: `Paket dengan ID "${id}" tidak ditemukan.`
        });
      }

      FALLBACK_PACKAGES[index] = {
        ...FALLBACK_PACKAGES[index],
        ...updates
      };

      return res.status(200).json({
        success: true,
        message: 'Data paket berhasil diperbarui.',
        data: FALLBACK_PACKAGES[index]
      });

    } catch (err: any) {
      return res.status(500).json({
        success: false,
        message: 'Gagal memperbarui data paket.',
        error: err.message || String(err)
      });
    }
  }

  // GET: Lihat detail paket
  if (req.method === 'GET') {
    try {
      const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
      const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

      if (supabaseUrl && supabaseAnonKey) {
        const supabase = createClient(supabaseUrl, supabaseAnonKey);
        
        // Cari berdasarkan UUID id atau kode paket
        const { data, error } = await supabase
          .from('packages')
          .select('*')
          .or(`id.eq.${id},code.eq.${id}`)
          .single();

        if (error || !data) {
          return res.status(404).json({
            success: false,
            message: `Paket dengan ID "${id}" tidak ditemukan.`
          });
        }

        return res.status(200).json({
          success: true,
          data
        });
      }

      // Fallback data
      const found = FALLBACK_PACKAGES.find(p => p.id === id || p.code.toLowerCase() === id.toLowerCase());

      if (!found) {
        return res.status(404).json({
          success: false,
          message: `Paket dengan ID "${id}" tidak ditemukan.`
        });
      }

      return res.status(200).json({
        success: true,
        data: found
      });

    } catch (err: any) {
      return res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan saat memproses detail paket.',
        error: err.message || String(err)
      });
    }
  }

  // DELETE: Hapus paket
  if (req.method === 'DELETE') {
    try {
      const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
      const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

      if (supabaseUrl && supabaseAnonKey) {
        const supabase = createClient(supabaseUrl, supabaseAnonKey);

        const { data, error } = await supabase
          .from('packages')
          .delete()
          .or(`id.eq.${id},code.eq.${id}`)
          .select()
          .single();

        if (error || !data) {
          return res.status(404).json({
            success: false,
            message: `Paket dengan ID "${id}" tidak ditemukan atau gagal dihapus.`
          });
        }

        return res.status(200).json({
          success: true,
          message: `Paket "${data.name}" berhasil dihapus.`,
          data
        });
      }

      // Fallback mode in-memory
      const index = FALLBACK_PACKAGES.findIndex(p => p.id === id || p.code.toLowerCase() === id.toLowerCase());
      if (index === -1) {
        return res.status(404).json({
          success: false,
          message: `Paket dengan ID "${id}" tidak ditemukan.`
        });
      }

      const [deleted] = FALLBACK_PACKAGES.splice(index, 1);

      return res.status(200).json({
        success: true,
        message: `Paket "${deleted.name}" berhasil dihapus.`,
        data: deleted
      });

    } catch (err: any) {
      return res.status(500).json({
        success: false,
        message: 'Gagal menghapus data paket.',
        error: err.message || String(err)
      });
    }
  }

  return res.status(405).json({
    success: false,
    message: 'Method Not Allowed. Gunakan GET untuk detail, PUT/PATCH untuk mengubah, atau DELETE untuk menghapus paket.'
  });
}
