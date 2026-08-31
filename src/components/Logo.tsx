import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  customLogoUrl?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
  customLogoUrl
}) => {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const titleSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };

  const subSizes = {
    sm: 'text-[9px] tracking-widest',
    md: 'text-[11px] tracking-[0.2em]',
    lg: 'text-xs tracking-[0.25em]',
    xl: 'text-sm tracking-[0.3em]'
  };

  if (customLogoUrl) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <img
          src={customLogoUrl}
          alt="IQRA INSTITUTE Logo"
          className={`${iconSizes[size]} object-contain rounded-lg`}
        />
        {showText && (
          <div className="flex flex-col">
            <span className={`font-bold font-['Outfit'] tracking-tight text-slate-900 leading-none ${titleSizes[size]}`}>
              IQRA
            </span>
            <span className={`font-semibold font-['Plus_Jakarta_Sans'] text-amber-700 uppercase ${subSizes[size]}`}>
              INSTITUTE
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Handcrafted precise SVG matching IQRA institute emblem: Open Orange Book + Jumping Cheerful Blue Children */}
      <div className={`relative flex items-center justify-center ${iconSizes[size]} bg-amber-50/80 border border-amber-100/80 rounded-xl p-1 shadow-sm shrink-0`}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Jumping Silhouette Children in Royal Blue (#0284c7 & #1d4ed8) */}
          <g fill="#0284c7">
            {/* Child 1 Left */}
            <circle cx="26" cy="22" r="3.2" />
            <path d="M26 27 C24 29, 21 33, 19 36 M26 27 C28 29, 31 33, 33 36 M26 26 L26 36 M26 36 L22 44 M26 36 L30 43" stroke="#0284c7" strokeWidth="2.2" strokeLinecap="round" />
            
            {/* Child 2 Center-Left */}
            <circle cx="41" cy="18" r="3.5" />
            <path d="M41 23 C37 25, 33 21, 31 28 M41 23 C45 25, 47 21, 49 27 M41 22 L41 33 M41 33 L37 42 M41 33 L45 42" stroke="#0284c7" strokeWidth="2.4" strokeLinecap="round" />
            
            {/* Child 3 Center (Highest Jump) */}
            <circle cx="53" cy="16" r="3.6" />
            <path d="M53 21 C49 23, 46 18, 44 24 M53 21 C57 23, 60 18, 62 25 M53 21 L53 32 M53 32 L49 41 M53 32 L57 41" stroke="#0284c7" strokeWidth="2.5" strokeLinecap="round" />

            {/* Child 4 Center-Right */}
            <circle cx="66" cy="19" r="3.4" />
            <path d="M66 24 C62 26, 59 22, 57 28 M66 24 C70 26, 73 22, 75 28 M66 23 L66 33 M66 33 L62 42 M66 33 L70 41" stroke="#0284c7" strokeWidth="2.3" strokeLinecap="round" />

            {/* Child 5 Right */}
            <circle cx="79" cy="23" r="3.2" />
            <path d="M79 28 C76 30, 73 34, 71 37 M79 28 C82 30, 85 34, 87 37 M79 27 L79 37 M79 37 L75 45 M79 37 L83 44" stroke="#0284c7" strokeWidth="2.2" strokeLinecap="round" />
          </g>

          {/* Open Book Wings in Warm Terracotta / Orange (#f97316 / #ea580c) */}
          <g stroke="#ea580c" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" fill="none">
            {/* Book Spine Center Pivot */}
            <path d="M50 49 L50 78" stroke="#ea580c" strokeWidth="3" />
            
            {/* Left Page Arches */}
            <path d="M50 78 C35 70, 20 72, 8 76 C12 65, 24 53, 49 49" fill="#fff7ed" />
            <path d="M49 56 C34 58, 20 62, 11 72" />
            <path d="M49 63 C36 64, 25 67, 16 74" />
            <path d="M49 70 C38 71, 28 72, 21 76" />

            {/* Right Page Arches */}
            <path d="M50 78 C65 70, 80 72, 92 76 C88 65, 76 53, 51 49" fill="#fff7ed" />
            <path d="M51 56 C66 58, 80 62, 89 72" />
            <path d="M51 63 C64 64, 75 67, 84 74" />
            <path d="M51 70 C62 71, 72 72, 79 76" />
            
            {/* Bottom Book Base Spine curve */}
            <path d="M8 76 C20 83, 38 82, 50 82 C62 82, 80 83, 92 76" stroke="#c2410c" strokeWidth="3.2" />
          </g>
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col select-none">
          <div className="flex items-center gap-1">
            <span className={`font-black font-['Outfit'] tracking-tight text-slate-900 leading-none ${titleSizes[size]}`}>
              IQRA
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mb-1"></span>
          </div>
          <span className={`font-bold font-['Plus_Jakarta_Sans'] text-amber-700 uppercase leading-tight ${subSizes[size]}`}>
            INSTITUTE
          </span>
        </div>
      )}
    </div>
  );
};
