import { Package } from '../types';

export const mockPackages: Package[] = [
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

export const PRICELIST_TERMS = [
  'DP minimal Rp 2.500.000,- untuk lock tanggal',
  'Pelunasan maksimal 2 minggu sebelum hari H',
  'No downpayment refund cancelation (jika pembatalan dari pihak client)',
  'Harga di luar Pulau Jawa dapat dikonsultasikan dengan admin'
];

export const formatRupiah = (number: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(number);
};
