import { createClient } from '@supabase/supabase-js';

export const FALLBACK_PACKAGES = [
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

export async function handleGetPackages(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { search, q, category, status = 'active', sortBy = 'price', order = 'asc' } = req.query || {};
    const queryTerm = (search || q || '').toString().trim().toLowerCase();
    const categoryFilter = (category || '').toString().trim();
    const ascending = order?.toString().toLowerCase() !== 'desc';
    const sortColumn = ['price', 'name', 'created_at', 'code'].includes(sortBy?.toString()) ? sortBy.toString() : 'price';

    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseAnonKey) {
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      let query = supabase.from('packages').select('*');

      if (status && status !== 'all') {
        query = query.eq('status', status);
      }
      if (categoryFilter && categoryFilter !== 'all') {
        query = query.eq('category', categoryFilter);
      }
      if (queryTerm) {
        query = query.or(`name.ilike.%${queryTerm}%,description.ilike.%${queryTerm}%,code.ilike.%${queryTerm}%`);
      }

      query = query.order(sortColumn, { ascending });
      const { data, error } = await query;
      if (!error && data) {
        return res.status(200).json({ success: true, count: data.length, data });
      }
    }

    // Fallback
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
        const inCat = p.category ? p.category.toLowerCase().includes(queryTerm) : false;
        const inFac = p.facilities.some(f => f.toLowerCase().includes(queryTerm));
        return inName || inDesc || inCode || inCat || inFac;
      });
    }

    results.sort((a, b) => {
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
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function handleGetPackageDetail(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { id } = req.query || {};
  if (!id) {
    return res.status(400).json({ success: false, message: 'ID paket diperlukan' });
  }

  try {
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseAnonKey) {
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .or(`id.eq.${id},code.eq.${id}`)
        .single();

      if (!error && data) {
        return res.status(200).json({ success: true, data });
      }
    }

    const found = FALLBACK_PACKAGES.find(p => p.id === id || p.code.toLowerCase() === id.toLowerCase());
    if (!found) {
      return res.status(404).json({ success: false, message: `Paket ${id} tidak ditemukan.` });
    }

    return res.status(200).json({ success: true, data: found });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function handleCreatePackage(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const body = req.body || {};
    const { name, price, description, photo_url, facilities = [], category = 'Umum', status = 'active', code } = body;

    // Validasi input
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Nama paket wajib diisi.' });
    }

    const parsedPrice = Number(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      return res.status(400).json({ success: false, message: 'Harga paket harus berupa angka positif atau nol.' });
    }

    if (!description || typeof description !== 'string' || !description.trim()) {
      return res.status(400).json({ success: false, message: 'Deskripsi paket wajib diisi.' });
    }

    const packageCode = (code && typeof code === 'string' && code.trim())
      ? code.trim().toUpperCase()
      : `PKG-${name.trim().replace(/\s+/g, '-').toUpperCase().slice(0, 10)}-${Date.now().toString().slice(-4)}`;

    const DEFAULT_WEDDING_PHOTO = 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&w=800&q=80';
    const finalPhotoUrl = (photo_url && typeof photo_url === 'string' && photo_url.trim())
      ? photo_url.trim()
      : DEFAULT_WEDDING_PHOTO;

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
        if (error.code === '23505') {
          return res.status(409).json({ success: false, message: `Kode paket "${packageCode}" sudah ada.` });
        }
        throw error;
      }

      return res.status(201).json({ success: true, message: 'Paket berhasil ditambahkan.', data });
    }

    FALLBACK_PACKAGES.unshift(newPackage);
    return res.status(201).json({ success: true, message: 'Paket berhasil ditambahkan.', data: newPackage });

  } catch (err) {
    return res.status(500).json({ success: false, message: 'Gagal menambah paket: ' + err.message });
  }
}

export async function handleUpdatePackage(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { id } = req.query || {};
  if (!id) {
    return res.status(400).json({ success: false, message: 'ID paket diperlukan.' });
  }

  try {
    const body = req.body || {};
    const { name, price, description, photo_url, facilities, category, status, code } = body;

    const updates = {
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

    // Fallback update in-memory
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

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Gagal memperbarui data paket: ' + err.message
    });
  }
}

export async function handleTogglePackageStatus(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, PATCH, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { id } = req.query || {};
  if (!id) {
    return res.status(400).json({ success: false, message: 'ID paket diperlukan.' });
  }

  try {
    const body = req.body || {};
    let targetStatus = body.status;

    if (targetStatus && !['active', 'inactive'].includes(targetStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Status harus bernilai "active" atau "inactive".'
      });
    }

    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseAnonKey) {
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      
      // Ambil status terkini jika toggle
      if (!targetStatus) {
        const { data: existing, error: findError } = await supabase
          .from('packages')
          .select('status')
          .or(`id.eq.${id},code.eq.${id}`)
          .single();

        if (findError || !existing) {
          return res.status(404).json({
            success: false,
            message: `Paket dengan ID "${id}" tidak ditemukan.`
          });
        }
        targetStatus = existing.status === 'active' ? 'inactive' : 'active';
      }

      const { data, error } = await supabase
        .from('packages')
        .update({
          status: targetStatus,
          updated_at: new Date().toISOString()
        })
        .or(`id.eq.${id},code.eq.${id}`)
        .select()
        .single();

      if (error || !data) {
        return res.status(404).json({
          success: false,
          message: `Gagal memperbarui status paket "${id}".`
        });
      }

      return res.status(200).json({
        success: true,
        message: `Status paket berhasil diubah menjadi "${targetStatus}".`,
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

    if (!targetStatus) {
      targetStatus = FALLBACK_PACKAGES[index].status === 'active' ? 'inactive' : 'active';
    }

    FALLBACK_PACKAGES[index].status = targetStatus;
    FALLBACK_PACKAGES[index].updated_at = new Date().toISOString();

    return res.status(200).json({
      success: true,
      message: `Status paket berhasil diubah menjadi "${targetStatus}".`,
      data: FALLBACK_PACKAGES[index]
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Gagal mengubah status paket: ' + err.message
    });
  }
}

export async function handleDeletePackage(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { id } = req.query || {};
  if (!id) {
    return res.status(400).json({ success: false, message: 'ID paket diperlukan.' });
  }

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

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Gagal menghapus data paket: ' + err.message
    });
  }
}
