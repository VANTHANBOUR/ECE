import React from 'react';
import { useApp } from '../context/AppContext';
import { INITIAL_SCHOOL_PROFILE } from '../data/mockData';

export interface BrandLogoProps {
  variant?: 'full-letterhead' | 'header' | 'compact' | 'shield-only' | 'monochrome';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showSubtitle?: boolean;
  customLogoUrl?: string | null;
  forceDefaultShield?: boolean;
  schoolNameKhmer?: string;
  schoolNameEnglish?: string;
  taglineKhmer?: string;
  taglineEnglish?: string;
  portalBadgeText?: string;
}

const useAppSafe = () => {
  try {
    return useApp();
  } catch {
    return {
      schoolProfile: INITIAL_SCHOOL_PROFILE,
    } as any;
  }
};

export const DIOvalLogo: React.FC<{ size?: number; className?: string }> = ({ size = 48, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 500 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 drop-shadow-sm select-none ${className}`}
      aria-label="Dewey International (DI) Official Central Logo"
    >
      <defs>
        {/* Curve Path for "SERVING FOR LIFE" bottom white text */}
        <path
          id="diServingTextArc"
          d="M 90 355 C 150 480, 330 480, 410 355"
          fill="none"
        />
        {/* Outer Orange Dual Gradient */}
        <linearGradient id="diOrangeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF7000" />
          <stop offset="45%" stopColor="#FF4100" />
          <stop offset="100%" stopColor="#E12500" />
        </linearGradient>
        {/* Inner Yellow Gradient */}
        <linearGradient id="diYellowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFE000" />
          <stop offset="100%" stopColor="#FF9E00" />
        </linearGradient>
        {/* Oval Clip Path */}
        <clipPath id="diInnerWhiteOvalClip">
          <ellipse cx="250" cy="235" rx="180" ry="168" transform="rotate(-18 250 235)" />
        </clipPath>
      </defs>

      {/* 1. OUTER SWOOSH RING (Orange & Yellow Orbital Swoosh) */}
      {/* Red/Orange Outer Swoosh */}
      <path
        d="M 235 10 C 380 10 495 100 488,252 C 480,395 345,495 190,488 C 85,482 10,390 18,248 C 25,105 115,18 235,10 Z"
        fill="url(#diOrangeGradient)"
      />

      {/* Inner Golden Yellow Accent Swoosh */}
      <path
        d="M 230 32 C 352 32 452 110 446,242 C 440,362 325,452 182,446 C 88,440 32,358 38,242 C 44,122 125,38 230,32 Z"
        fill="url(#diYellowGradient)"
      />

      {/* 2. WHITE OVAL CANVAS CORE */}
      <ellipse
        cx="250"
        cy="235"
        rx="180"
        ry="168"
        transform="rotate(-18 250 235)"
        fill="#FFFFFF"
      />

      {/* 3. CENTER "DI" GREEN MONOGRAM */}
      <g transform="translate(0, -5)">
        <text
          x="238"
          y="262"
          fill="#00823B"
          fontFamily="'Times New Roman', 'Baskerville', 'Georgia', serif"
          fontSize="205"
          fontWeight="bold"
          fontStyle="italic"
          textAnchor="middle"
          letterSpacing="-3"
        >
          DI
        </text>

        {/* 4. RED KHMER MOTTO BELOW "DI" */}
        <text
          x="248"
          y="310"
          fill="#DC2626"
          fontFamily="'Battambang', 'Kantumruy Pro', 'Khmer OS', sans-serif"
          fontSize="28"
          fontWeight="bold"
          fontStyle="italic"
          textAnchor="middle"
        >
          ធ្វើអោយជីវិតកាន់តែប្រសើរ
        </text>
      </g>

      {/* 5. WHITE "SERVING FOR LIFE" CURVED ALONG BOTTOM SWOOSH */}
      <text fill="#FFFFFF" fontSize="24" fontWeight="900" fontFamily="'Outfit', 'Plus Jakarta Sans', sans-serif" letterSpacing="2.5">
        <textPath href="#diServingTextArc" startOffset="50%" textAnchor="middle">
          SERVING FOR LIFE
        </textPath>
      </text>
    </svg>
  );
};

export const DIShield = DIOvalLogo;
export const DCHShield = DIOvalLogo;

export const SchoolLogoIcon: React.FC<{
  size?: number;
  className?: string;
  customLogoUrl?: string | null;
  forceDefaultShield?: boolean;
}> = ({ size = 48, className = '', customLogoUrl, forceDefaultShield = false }) => {
  const { schoolProfile } = useAppSafe();
  const effectiveLogoUrl = forceDefaultShield 
    ? null 
    : (customLogoUrl !== undefined ? customLogoUrl : schoolProfile?.customLogoUrl);

  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    setHasError(false);
  }, [effectiveLogoUrl]);

  if (effectiveLogoUrl && !hasError) {
    return (
      <div 
        style={{ width: size, height: size }} 
        className={`shrink-0 flex items-center justify-center relative overflow-hidden rounded-xl bg-white shadow-xs border border-emerald-100 p-1 ${className}`}
      >
        <img
          src={effectiveLogoUrl}
          alt={schoolProfile?.schoolNameEnglish || "School Logo"}
          className="w-full h-full object-contain"
          referrerPolicy="no-referrer"
          onError={() => {
            setHasError(true);
          }}
        />
      </div>
    );
  }

  return <DCHShield size={size} className={className} />;
};

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'header',
  className = '',
  size = 'md',
  showSubtitle = true,
  customLogoUrl,
  forceDefaultShield = false,
  schoolNameKhmer,
  schoolNameEnglish,
  taglineKhmer,
  taglineEnglish,
  portalBadgeText,
}) => {
  const { schoolProfile } = useAppSafe();

  const khmerTitle = schoolNameKhmer || schoolProfile?.schoolNameKhmer || INITIAL_SCHOOL_PROFILE.schoolNameKhmer;
  const engTitle = schoolNameEnglish || schoolProfile?.schoolNameEnglish || INITIAL_SCHOOL_PROFILE.schoolNameEnglish;
  const khmerSub = taglineKhmer || schoolProfile?.taglineKhmer || INITIAL_SCHOOL_PROFILE.taglineKhmer;
  const engSub = taglineEnglish || schoolProfile?.taglineEnglish || INITIAL_SCHOOL_PROFILE.taglineEnglish;
  const badgeLabel = portalBadgeText || schoolProfile?.portalBadgeText || INITIAL_SCHOOL_PROFILE.portalBadgeText;

  if (variant === 'shield-only') {
    const shieldSize = size === 'sm' ? 32 : size === 'md' ? 44 : size === 'lg' ? 60 : size === 'xl' ? 76 : 96;
    return (
      <SchoolLogoIcon 
        size={shieldSize} 
        className={className} 
        customLogoUrl={customLogoUrl} 
        forceDefaultShield={forceDefaultShield} 
      />
    );
  }

  if (variant === 'full-letterhead') {
    return (
      <div className={`flex flex-col items-center text-center p-4 bg-white select-none ${className}`}>
        <div className="flex items-center justify-center gap-4 sm:gap-6 w-full max-w-3xl">
          <SchoolLogoIcon 
            size={80} 
            className="shrink-0" 
            customLogoUrl={customLogoUrl} 
            forceDefaultShield={forceDefaultShield} 
          />
          <div className="flex flex-col text-left justify-center">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#008242] font-['Battambang',sans-serif] tracking-wide leading-tight">
              {khmerTitle}
            </h1>
            <h2 className="text-xl sm:text-2xl font-black text-[#008242] font-['Outfit',sans-serif] tracking-wider uppercase leading-none mt-1">
              {engTitle}
            </h2>
          </div>
        </div>

        {/* Divider bar */}
        <div className="w-full max-w-3xl h-[3.5px] bg-[#008242] my-3 rounded-full" />

        {/* Subtitles */}
        <div className="w-full max-w-3xl text-center space-y-1">
          <p className="text-sm sm:text-base font-bold text-[#008242] font-['Kantumruy_Pro',sans-serif]">
            {khmerSub}
          </p>
          <p className="text-xs sm:text-sm font-bold text-[#008242] tracking-wide uppercase font-['Plus_Jakarta_Sans',sans-serif]">
            {engSub}
          </p>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2.5 ${className}`}>
        <SchoolLogoIcon 
          size={36} 
          customLogoUrl={customLogoUrl} 
          forceDefaultShield={forceDefaultShield} 
        />
        <div className="flex flex-col leading-tight">
          <span className="text-xs font-bold text-[#008242] font-['Battambang',sans-serif]">{khmerTitle}</span>
          <span className="text-sm font-black text-[#008242] tracking-tight uppercase font-['Outfit',sans-serif]">{engTitle}</span>
          <span className="text-[10px] text-amber-700 font-semibold tracking-wide">{engSub}</span>
        </div>
      </div>
    );
  }

  // Default 'header' variant
  const shieldSize = size === 'sm' ? 36 : size === 'md' ? 46 : size === 'lg' ? 58 : 72;

  return (
    <div className={`flex items-center gap-3 sm:gap-4 select-none ${className}`}>
      <SchoolLogoIcon 
        size={shieldSize} 
        customLogoUrl={customLogoUrl} 
        forceDefaultShield={forceDefaultShield} 
      />
      <div className="flex flex-col justify-center">
        <div className="flex items-baseline gap-2">
          <span className="text-sm sm:text-base font-bold text-[#008242] font-['Battambang',sans-serif] tracking-normal">
            {khmerTitle}
          </span>
          <span className="hidden md:inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-[#008242] border border-emerald-200">
            {badgeLabel}
          </span>
        </div>
        <span className="text-base sm:text-lg lg:text-xl font-extrabold text-[#008242] tracking-tight uppercase font-['Outfit',sans-serif] leading-none mt-0.5">
          {engTitle}
        </span>
        {showSubtitle && (
          <span className="text-[10px] sm:text-xs font-medium text-emerald-800 tracking-wide mt-0.5">
            {engSub}
          </span>
        )}
      </div>
    </div>
  );
};

