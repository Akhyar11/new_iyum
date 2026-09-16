/**
 * Data profil dan identitas bisnis IYUM MakeOver
 * Sesuai dengan data resmi usaha:
 * - Logo: IYUM MAKEOVER (huruf O merah) - Makeup & Wedding Gallery
 * - Instagram: Iyummakeover
 * - WhatsApp: 08564246449
 * - Alamat: Jl. Dewa Ruci No 9 Gentan Sukoharjo
 */

export const BUSINESS_INFO = {
  name: 'IYUM MakeOver',
  fullName: 'IYUM MAKEOVER — Makeup & Wedding Gallery',
  tagline: 'Makeup & Wedding Gallery',
  description: 'Layanan tata rias dan wedding gallery profesional dengan sentuhan memukau untuk hari istimewa Anda. Temukan paket terbaik dengan sistem pendukung keputusan SAW kami.',
  address: 'Jl. Dewa Ruci No 9 Gentan Sukoharjo',
  phone: '08564246449',
  phoneDisplay: '0856-4246-449',
  whatsappNumber: '628564246449',
  whatsappUrl: 'https://wa.me/628564246449',
  instagram: 'Iyummakeover',
  instagramUrl: 'https://instagram.com/Iyummakeover',
  city: 'Gentan, Sukoharjo',
  systemTitle: 'Sistem Rekomendasi Paket Make Up Pengantin'
} as const;

export function getWhatsAppBookingUrl(packageName?: string, matchScore?: number): string {
  let message = `Halo ${BUSINESS_INFO.name}, saya tertarik berkonsultasi mengenai paket rias pengantin`;
  if (packageName) {
    message += `: *${packageName}*`;
  }
  if (matchScore) {
    message += ` (Kesesuaian rekomendasi SAW: ${matchScore}%)`;
  }
  message += `. Apakah tanggal acara saya masih tersedia? Terima kasih.`;

  return `${BUSINESS_INFO.whatsappUrl}?text=${encodeURIComponent(message)}`;
}
