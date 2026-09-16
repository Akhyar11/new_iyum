import { createClient } from '@supabase/supabase-js';

// Fallback mock packages data jika database belum dikonfigurasi
const FALLBACK_PACKAGES = [
  {
    id: 'pkg-1',
    code: 'PKG-WED-AKAD-RESEPSI',
    name: 'Wedding Akad & Resepsi',
    price: 15000000,
    category: 'Akad & Resepsi',
    photo_url: '/images/packages/wedding-akad-resepsi.jpg',
    description: 'Paket rias dan busana komprehensif untuk prosesi Akad Nikah dan Resepsi pernikahan. Meliputi rias & busana kedua mempelai, sepasang kebaya/gown akad dan resepsi, rias 2 ibu, beskap/jas 2 bapak, rias 4 jaga kado, pemandu adat, melati pengantin, dan bucket bunga.',
    facilities: [
      'Makeup & retouch kedua mempelai pengantin',
      'Sepasang kebaya / gown Akad',
      'Sepasang kebaya / gown Resepsi',
      'Makeup 2 Ibu kedua mempelai (incl Jarik dan Hijab/Hairdo, melati)',
      'Beskap / Basofi / jas 2 Bapak kedua mempelai',
      'Makeup 4 Jaga Kado (hijab/hairdo & busana tanpa selop)',
      'Pemandu Prosesi Adat',
      'Bunga Melati Pengantin',
      'Bucket Bunga'
    ],
    notes: [
      'Konsep riasan solo putri (paes/non paes) & sunda siger penambahan charge 1jt',
      'Basahan Solo dan paes ageng jogja penambahan charge Rp 2jt',
      'PL diatas untuk akad dan resepsi berlangsungan, apabila beda waktu (pagi/malam atau berlainan hari) dikenakan charge 5,5jt',
      'Untuk pemilihan kebaya premium diluar paket dikenakan charge 1jt ++',
      'Penambahan makeup hijabdo / beskap / basofi / jas @250k',
      'Penambahan makeup hairdo @300k'
    ],
    status: 'active'
  },
  {
    id: 'pkg-2',
    code: 'PKG-NGUNDUH-MANTU',
    name: 'Ngunduh Mantu',
    price: 14000000,
    category: 'Ngunduh Mantu',
    photo_url: '/images/packages/ngunduh-mantu.jpg',
    description: 'Paket tata rias dan busana lengkap untuk prosesi adat Ngunduh Mantu. Mencakup makeup kedua mempelai, kebaya/gown resepsi, rias 2 ibu, beskap/jas 2 bapak, rias 4 jaga kado, pemandu prosesi adat, melati pengantin, dan bucket bunga.',
    facilities: [
      'Makeup kedua mempelai',
      'Sepasang kebaya / gown Resepsi',
      'Makeup 2 Ibu kedua mempelai (incl Jarik dan Hijab/Hairdo, melati)',
      'Beskap / Basofi / jas 2 Bapak kedua mempelai',
      'Makeup 4 Jaga Kado (hijab/hairdo & busana tanpa selop)',
      'Pemandu Prosesi Adat',
      'Bunga Melati Pengantin',
      'Bucket Bunga'
    ],
    notes: [
      'Konsep riasan solo putri (paes/non paes) & sunda siger penambahan charge 1jt',
      'Basahan Solo dan paes ageng jogja penambahan charge Rp 2jt',
      'Untuk pemilihan kebaya premium diluar paket dikenakan charge 1jt ++',
      'Penambahan makeup hijabdo / beskap / basofi / jas @250k',
      'Penambahan makeup hairdo @300k'
    ],
    status: 'active'
  },
  {
    id: 'pkg-3',
    code: 'PKG-PENGANTIN-AKAD-RESEPSI',
    name: 'Pengantin Akad Resepsi',
    price: 11500000,
    category: 'Akad & Resepsi',
    photo_url: '/images/packages/pengantin-akad-resepsi.jpg',
    description: 'Paket riasan khusus kedua mempelai untuk sesi Akad Nikah sekaligus Resepsi. Lengkap dengan sepasang kebaya/gown akad series dan sepasang kebaya/gown resepsi.',
    facilities: [
      'Makeup pengantin kedua mempelai (Akad & Resepsi)',
      'Kebaya / gown akad series kedua mempelai',
      'Kebaya / gown resepsi kedua mempelai'
    ],
    notes: [
      'Konsep riasan solo putri (paes/non paes) & sunda siger penambahan charge 1jt',
      'Basahan Solo dan paes ageng jogja penambahan charge Rp 2jt',
      'Pemilihan kebaya premium diluar paket dikenakan charge 1jt ++',
      'Apabila pembatalan sepihak dari pihak klien maka DP hangus'
    ],
    status: 'active'
  },
  {
    id: 'pkg-4',
    code: 'PKG-PENGANTIN-RESEPSI-ONLY',
    name: 'Pengantin Resepsi Only',
    price: 9500000,
    category: 'Resepsi',
    photo_url: '/images/packages/pengantin-resepsi-only.jpg',
    description: 'Paket fokus tata rias dan busana resepsi untuk kedua mempelai pengantin dengan pilihan gaun atau kebaya resepsi mewah.',
    facilities: [
      'Makeup pengantin kedua mempelai',
      'Kebaya / gown resepsi kedua mempelai'
    ],
    notes: [
      'Konsep riasan solo putri (paes/non paes) & sunda siger penambahan charge 1jt',
      'Basahan Solo dan paes ageng jogja penambahan charge Rp 2jt',
      'Pemilihan kebaya premium diluar paket dikenakan charge 1jt ++',
      'Apabila pembatalan sepihak dari pihak klien maka DP hangus'
    ],
    status: 'active'
  },
  {
    id: 'pkg-5',
    code: 'PKG-AKAD-PACKAGE',
    name: 'Akad package',
    price: 7000000,
    category: 'Akad Nikah',
    photo_url: '/images/packages/akad-package.jpg',
    description: 'Paket riasan sakral khusus prosesi Akad Nikah. Dilengkapi kebaya/gown akad series untuk kedua mempelai serta bonus istimewa free makeup untuk 2 ibu mempelai.',
    facilities: [
      'Makeup pengantin kedua mempelai',
      'Kebaya / gown akad series',
      'Free makeup 2 ibu mempelai pengantin'
    ],
    notes: [
      'Konsep riasan solo putri (paes/non paes) & sunda siger penambahan charge 1jt',
      'Basahan Solo dan paes ageng jogja penambahan charge Rp 2jt',
      'Pemilihan kebaya premium diluar paket dikenakan charge 1jt ++',
      'Apabila pembatalan sepihak dari pihak klien maka DP hangus'
    ],
    status: 'active'
  },
  {
    id: 'pkg-6',
    code: 'PKG-SIRAMAN-PACKAGE',
    name: 'Siraman package',
    price: 6500000,
    category: 'Prosesi Adat',
    photo_url: '/images/packages/siraman-package.jpg',
    description: 'Paket lengkap prosesi adat pra-nikah Siraman dan Midodareni. Meliputi makeup capeng wanita, dodot siraman, makeup & komplitan ibu, beskap bapak, pemandu prosesi adat, ronce melati siraman asli, dan retouch midodareni.',
    facilities: [
      'Makeup calon pengantin wanita',
      'Dodot siraman',
      'Makeup dan komplitan ibu capeng wanita',
      'Beskap bapak capeng wanita',
      'Pemandu prosesi siraman',
      'Melati siraman asli',
      'Retouch makeup (midodareni berlangsungan)'
    ],
    notes: [
      'Apabila siraman pagi dan midodareni malam, maka dikenakan charge 1jt',
      'Penambahan siraman pihak calon pengantin laki laki dikenakan charge 2,5jt',
      'Penambahan beskap @250k',
      'Penambahan makeup hijabdo @250k',
      'Penambahan makeup hairdo @300k'
    ],
    status: 'active'
  }
];

export default async function handler(req: any, res: any) {
  // CORS setup
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // POST: Tambah paket baru dengan foto
  if (req.method === 'POST') {
    try {
      const body = req.body || {};
      const { name, price, description, photo_url, facilities = [], category = 'Umum', status = 'active', code } = body;

      // Validasi field wajib
      if (!name || typeof name !== 'string' || !name.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Nama paket wajib diisi.'
        });
      }

      const parsedPrice = Number(price);
      if (isNaN(parsedPrice) || parsedPrice < 0) {
        return res.status(400).json({
          success: false,
          message: 'Harga paket harus berupa angka positif atau nol.'
        });
      }

      if (!description || typeof description !== 'string' || !description.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Deskripsi paket wajib diisi.'
        });
      }

      // Generate kode unik paket jika tidak disediakan
      const packageCode = (code && typeof code === 'string' && code.trim())
        ? code.trim().toUpperCase()
        : `PKG-${name.trim().replace(/\s+/g, '-').toUpperCase().slice(0, 10)}-${Date.now().toString().slice(-4)}`;

      // Penanganan foto paket dengan preset elegan bila kosong
      const DEFAULT_WEDDING_PHOTO = 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&w=800&q=80';
      const finalPhotoUrl = (photo_url && typeof photo_url === 'string' && photo_url.trim())
        ? photo_url.trim()
        : DEFAULT_WEDDING_PHOTO;

      // Normalisasi fasilitas
      const finalFacilities = Array.isArray(facilities)
        ? facilities.filter(f => typeof f === 'string' && f.trim()).map(f => f.trim())
        : typeof facilities === 'string' && facilities.trim()
        ? facilities.split(',').map(f => f.trim()).filter(Boolean)
        : [];

      const newPackage = {
        id: `pkg-${Date.now()}`,
        code: packageCode,
        name: name.trim(),
        price: parsedPrice,
        description: description.trim(),
        photo_url: finalPhotoUrl,
        facilities: finalFacilities,
        category: (category && typeof category === 'string' && category.trim()) ? category.trim() : 'Umum',
        status: status === 'inactive' ? 'inactive' : 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
      const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

      if (supabaseUrl && supabaseAnonKey) {
        const supabase = createClient(supabaseUrl, supabaseAnonKey);
        const { data, error } = await supabase
          .from('packages')
          .insert([newPackage])
          .select()
          .single();

        if (error) {
          console.error('Supabase insert package error:', error);
          if (error.code === '23505') {
            return res.status(409).json({
              success: false,
              message: `Kode paket "${packageCode}" sudah terdaftar. Gunakan kode lain.`
            });
          }
          throw error;
        }

        return res.status(201).json({
          success: true,
          message: 'Paket rias pengantin baru berhasil ditambahkan.',
          data
        });
      }

      // Fallback in-memory persistence
      FALLBACK_PACKAGES.unshift(newPackage);

      return res.status(201).json({
        success: true,
        message: 'Paket rias pengantin baru berhasil ditambahkan.',
        data: newPackage
      });

    } catch (err: any) {
      return res.status(500).json({
        success: false,
        message: 'Gagal menambahkan paket baru.',
        error: err.message || String(err)
      });
    }
  }

  // GET: Ambil daftar paket
  if (req.method === 'GET') {
    try {
      const { search, q, category, status = 'active', sortBy = 'price', order = 'asc' } = req.query || {};
      const queryTerm = (search || q || '').toString().trim().toLowerCase();
      const categoryFilter = (category || '').toString().trim();
      const ascending = order?.toString().toLowerCase() !== 'desc';
      const sortColumn = ['price', 'name', 'created_at', 'code'].includes(sortBy?.toString()) ? sortBy.toString() : 'price';

      const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
      const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

      // Jika Supabase terkonfigurasi, ambil dari database PostgreSQL Supabase
      if (supabaseUrl && supabaseAnonKey) {
        const supabase = createClient(supabaseUrl, supabaseAnonKey);
        let query = supabase.from('packages').select('*');

        // Filter status aktif
        if (status && status !== 'all') {
          query = query.eq('status', status);
        }

        // Filter kategori
        if (categoryFilter && categoryFilter !== 'all') {
          query = query.eq('category', categoryFilter);
        }

        // Filter teks pencarian (search query)
        if (queryTerm) {
          query = query.or(`name.ilike.%${queryTerm}%,description.ilike.%${queryTerm}%,code.ilike.%${queryTerm}%`);
        }

        query = query.order(sortColumn, { ascending });

        const { data, error } = await query;

        if (error) {
          console.error('Supabase query error:', error);
          throw error;
        }

        return res.status(200).json({
          success: true,
          count: data?.length || 0,
          data: data || []
        });
      }

      // Fallback mode menggunakan data in-memory lokal
      let results = [...FALLBACK_PACKAGES];

      if (status && status !== 'all') {
        results = results.filter(p => p.status === status);
      }

      if (categoryFilter && categoryFilter !== 'all') {
        results = results.filter(p => p.category?.toLowerCase() === categoryFilter.toLowerCase());
      }

      if (queryTerm) {
        results = results.filter(p => {
          const inName = p.name.toLowerCase().includes(queryTerm);
          const inDesc = p.description.toLowerCase().includes(queryTerm);
          const inCode = p.code.toLowerCase().includes(queryTerm);
          const inCategory = p.category?.toLowerCase().includes(queryTerm);
          const inFacilities = p.facilities.some(f => f.toLowerCase().includes(queryTerm));
          return inName || inDesc || inCode || inCategory || inFacilities;
        });
      }

      // Urutkan hasil fallback
      results.sort((a: any, b: any) => {
        const valA = a[sortColumn];
        const valB = b[sortColumn];
        if (typeof valA === 'string') {
          return ascending ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
        return ascending ? (valA || 0) - (valB || 0) : (valB || 0) - (valA || 0);
      });

      return res.status(200).json({
        success: true,
        count: results.length,
        data: results
      });

    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Gagal mengambil data paket makeup',
        error: error.message || String(error)
      });
    }
  }

  return res.status(405).json({
    success: false,
    message: 'Method Not Allowed. Gunakan GET untuk melihat daftar atau POST untuk menambah paket.'
  });
}
