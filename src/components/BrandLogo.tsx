import React from 'react';

interface BrandLogoProps {
  variant?: 'image' | 'text' | 'combined';
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  className?: string;
  theme?: 'light' | 'dark';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'combined',
  size = 'md',
  showSubtitle = true,
  className = '',
  theme = 'light'
}) => {
  const textColor = theme === 'dark' ? 'text-white' : 'text-stone-900';
  const subtitleColor = theme === 'dark' ? 'text-stone-400' : 'text-stone-600';
  const redColor = 'text-red-600';

  if (variant === 'image') {
    const imgHeight = size === 'sm' ? 'h-8' : size === 'lg' ? 'h-14 sm:h-16' : 'h-10 sm:h-11';
    return (
      <div className={`inline-flex items-center ${className}`}>
        <img
          src="/iyum-makeover-logo.png"
          alt="IYUM MakeOver — Makeup & Wedding Gallery"
          className={`${imgHeight} w-auto object-contain rounded-md shadow-xs border border-amber-100/40`}
          onError={(e) => {
            // Fallback to typography if image fails
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
      </div>
    );
  }

  const titleSize = size === 'sm' 
    ? 'text-lg sm:text-xl' 
    : size === 'lg' 
      ? 'text-2xl sm:text-4xl' 
      : 'text-xl sm:text-2xl';

  const subSize = size === 'sm'
    ? 'text-[8px] sm:text-[9px] tracking-[0.2em]'
    : size === 'lg'
      ? 'text-[11px] sm:text-[13px] tracking-[0.28em]'
      : 'text-[9px] sm:text-[10px] tracking-[0.22em]';

  return (
    <div className={`inline-flex flex-col ${className}`}>
      <div className={`font-serif font-extrabold tracking-normal leading-none ${titleSize} ${textColor}`}>
        <span>IYUM MAKE</span>
        <span className={`${redColor} font-black italic`}>O</span>
        <span>VER</span>
      </div>
      {showSubtitle && (
        <span className={`font-serif uppercase font-semibold mt-1 leading-none ${subSize} ${subtitleColor}`}>
          MAKEUP & WEDDING GALLERY
        </span>
      )}
    </div>
  );
};
