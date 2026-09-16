import React from 'react';
import { Heart, MapPin, Phone, Instagram } from 'lucide-react';
import { BUSINESS_INFO } from '../lib/businessInfo';
import { BrandLogo } from './BrandLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="mb-4">
              <div className="bg-[#fbf8f3] p-2 rounded-xl inline-block border border-amber-200/40 shadow-sm mb-3">
                <img 
                  src="/iyum-makeover-logo.png" 
                  alt="IYUM MakeOver" 
                  className="h-9 w-auto object-contain"
                />
              </div>
              <BrandLogo theme="dark" size="sm" />
            </div>
            <p className="text-stone-400 text-sm leading-relaxed mb-6">
              {BUSINESS_INFO.description}
            </p>
          </div>

          <div>
            <h4 className="text-white font-serif font-semibold text-lg mb-4">Metode Rekomendasi</h4>
            <p className="text-stone-400 text-sm leading-relaxed mb-3">
              Sistem menggunakan metode <strong>Simple Additive Weighting (SAW)</strong> dengan 10 kriteria objektif untuk menentukan paket yang paling akurat sesuai preferensi hari bahagia Anda.
            </p>
            <div className="inline-flex items-center gap-2 text-xs font-medium text-rose-400 bg-rose-950/60 border border-rose-800/60 px-3 py-1.5 rounded-full">
              <Heart className="w-3.5 h-3.5 fill-rose-400" />
              100% Terukur & Objektif
            </div>
          </div>

          <div>
            <h4 className="text-white font-serif font-semibold text-lg mb-4">Kontak & Lokasi Usaha</h4>
            <ul className="space-y-3 text-sm text-stone-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-rose-400 mt-1 flex-shrink-0" />
                <span>{BUSINESS_INFO.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <a 
                  href={BUSINESS_INFO.whatsappUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  WhatsApp: <span className="font-semibold text-stone-200">{BUSINESS_INFO.phone}</span>
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Instagram className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <a 
                  href={BUSINESS_INFO.instagramUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Instagram: <span className="font-semibold text-stone-200">{BUSINESS_INFO.instagram}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-stone-800 text-center text-xs text-stone-500">
          <p>© {new Date().getFullYear()} {BUSINESS_INFO.fullName}. Hak cipta dilindungi.</p>
        </div>
      </div>
    </footer>
  );
};
