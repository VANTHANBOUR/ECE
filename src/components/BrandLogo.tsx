import React from 'react';
import { useApp } from '../context/AppContext';
import { INITIAL_SCHOOL_PROFILE } from '../data/mockData';
import { CAMPUS_LIST } from '../types';

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

export const DCHShield: React.FC<{ size?: number; className?: string; rounded?: boolean }> = ({ 
  size = 48, 
  className = '',
  rounded = true 
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 500 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 select-none ${className}`}
      aria-label="Dewey Childcare House (DCH) Official Shield Logo"
    >
      {/* 0. Solid Crisp White Background matching official branding */}
      <rect width="500" height="500" rx={rounded ? "36" : "0"} fill="#FFFFFF" />

      <defs>
        {/* Outer Shield Boundary Path */}
        <path id="dchOuterPathReact" d="
          M 250, 62
          C 308, 62 364, 73 410, 85
          C 418, 178 421, 264 380, 348
          C 346, 404 296, 434 250, 452
          C 204, 434 154, 404 120, 348
          C 79, 264 82, 178 90, 85
          C 136, 73 192, 62 250, 62 Z
        " />

        {/* Inner Shield Boundary Path (inside orange border) */}
        <path id="dchInnerPathReact" d="
          M 250, 78
          C 304, 78 354, 88 395, 99
          C 403, 182 405, 258 368, 335
          C 336, 386 290, 416 250, 432
          C 210, 416 164, 386 132, 335
          C 95, 258 97, 182 105, 99
          C 146, 88 196, 78 250, 78 Z
        " />

        <clipPath id="dchInnerClipReact">
          <use href="#dchInnerPathReact" />
        </clipPath>

        <clipPath id="dchRightClipReact">
          <rect x="250" y="0" width="250" height="500" />
        </clipPath>
      </defs>

      {/* 1. Outer Green Shield Base */}
      <use href="#dchOuterPathReact" fill="#008A4B" />

      {/* 2. Orange / Amber Inner Accent Border */}
      <path
        d="
          M 250, 71
          C 306, 71 359, 81 403, 92
          C 411, 180 413, 261 374, 342
          C 341, 395 293, 425 250, 442
          C 207, 425 159, 395 126, 342
          C 87, 261 89, 180 97, 92
          C 141, 81 194, 71 250, 71 Z
        "
        fill="none"
        stroke="#FA9E1B"
        strokeWidth="12"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* 3. Inner Shield Content Area (Clipped inside inner shield) */}
      <g clipPath="url(#dchInnerClipReact)">
        {/* Base: Left half is Solid Green, Right half white initially */}
        <rect x="0" y="0" width="250" height="500" fill="#008A4B" />
        <rect x="250" y="0" width="250" height="500" fill="#FFFFFF" />

        {/* RIGHT HALF: Solid Green Bottom below the curved book lines */}
        <path
          d="M 250, 365 C 290, 342 342, 308 405, 272 L 405, 450 L 250, 450 Z"
          fill="#008A4B"
        />

        {/* Two Parallel Green Curved Stripes representing open book pages */}
        {/* Lower green stripe */}
        <path
          d="M 250, 350 C 290, 327 342, 294 405, 258"
          stroke="#008A4B"
          strokeWidth="6.5"
          fill="none"
          strokeLinecap="round"
        />
        {/* Upper green stripe */}
        <path
          d="M 250, 335 C 290, 312 342, 280 405, 245"
          stroke="#008A4B"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
        />

        {/* Vertical Center Divider */}
        <line x1="250" y1="78" x2="250" y2="432" stroke="#008A4B" strokeWidth="1.5" />

        {/* LEFT HALF: Vertical D C H Monogram in Serif White */}
        <text
          x="176"
          y="184"
          fill="#FFFFFF"
          fontFamily="'Times New Roman', 'Baskerville', 'Georgia', serif"
          fontSize="94"
          fontWeight="bold"
          textAnchor="middle"
          letterSpacing="0"
        >
          D
        </text>

        <text
          x="176"
          y="272"
          fill="#FFFFFF"
          fontFamily="'Times New Roman', 'Baskerville', 'Georgia', serif"
          fontSize="94"
          fontWeight="bold"
          textAnchor="middle"
          letterSpacing="0"
        >
          C
        </text>

        <text
          x="176"
          y="360"
          fill="#FFFFFF"
          fontFamily="'Times New Roman', 'Baskerville', 'Georgia', serif"
          fontSize="94"
          fontWeight="bold"
          textAnchor="middle"
          letterSpacing="0"
        >
          H
        </text>

        {/* RIGHT HALF: Academic Cap & Orange Book Pages */}
        <g clipPath="url(#dchRightClipReact)">
          {/* 1. GRADUATION MORTARBOARD */}
          <polygon
            points="324,142 376,158 324,174 272,158"
            fill="#008A4B"
          />
          <path
            d="M 281, 161 C 281, 161 281, 196 324, 202 C 367, 196 367, 161 367, 161 C 352, 178 338, 185 324, 185 C 310, 185 296, 178 281, 161 Z"
            fill="#008A4B"
          />
          <circle cx="324" cy="158" r="3.5" fill="#006838" />

          {/* Tassel: Cord draped to left corner and hanging down */}
          <path
            d="M 324, 158 C 302, 156 280, 158 270, 162 L 270, 198"
            stroke="#008A4B"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 268, 198 L 272, 198 L 273, 206 L 267, 206 Z"
            fill="#008A4B"
          />

          {/* 2. OPEN BOOK: Radiating Orange Leaves/Wings */}
          {/* Left Upper Leaf */}
          <path
            d="M 322, 234 C 308, 212 284, 204 256, 218 C 274, 222 300, 224 320, 235 Z"
            fill="#FA9E1B"
          />
          {/* Left Lower Leaf */}
          <path
            d="M 322, 237 C 304, 228 274, 224 254, 228 C 274, 234 300, 237 320, 238 Z"
            fill="#FA9E1B"
          />

          {/* Right Upper Leaf */}
          <path
            d="M 326, 234 C 340, 212 364, 204 392, 218 C 374, 222 348, 224 328, 235 Z"
            fill="#FA9E1B"
          />
          {/* Right Lower Leaf */}
          <path
            d="M 326, 237 C 344, 228 374, 224 394, 228 C 374, 234 348, 237 328, 238 Z"
            fill="#FA9E1B"
          />
        </g>
      </g>
    </svg>
  );
};

export const DKLogoEmblem: React.FC<{ size?: number; className?: string; rounded?: boolean }> = ({ size = 48, className = '', rounded = true }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 320 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 select-none ${className}`}
      aria-label="Dewey Kindergarten (DK) Official Logo Emblem"
    >
      {/* 0. Solid Crisp White Background */}
      <rect width="320" height="280" rx={rounded ? "36" : "0"} fill="#FFFFFF" />

      {/* 1. "DK" Letters in Official Forest Green */}
      <text
        x="154"
        y="166"
        fill="#007A3D"
        fontFamily="'Times New Roman', 'Georgia', 'Baskerville', 'Palatino', serif"
        fontSize="172"
        fontWeight="bold"
        textAnchor="middle"
        letterSpacing="-3"
      >
        DK
      </text>

      {/* 2. Open Book Ribbon: Upper Orange Wing */}
      <path
        d="M 28 185 C 68 198 110 211 154 215 C 198 211 240 198 280 185 C 283 187 281 190 277 192 C 238 209 196 221 154 223 C 112 221 70 209 31 192 C 27 190 25 187 28 185 Z"
        fill="#F58220"
      />

      {/* 3. Open Book Ribbon: Lower Green Wing with Center Spine V-Point */}
      <path
        d="M 26 197 C 68 211 110 225 154 228 C 198 225 240 211 282 197 C 285 199 283 202 278 205 C 238 222 196 238 154 244 C 112 238 70 222 30 205 C 25 202 23 199 26 197 Z"
        fill="#007A3D"
      />
    </svg>
  );
};

export const DKLogoFull: React.FC<{ 
  height?: number; 
  className?: string;
  showDivider?: boolean;
  rounded?: boolean;
}> = ({ height = 48, className = '', showDivider = true, rounded = true }) => {
  return (
    <svg
      height={height}
      viewBox="0 0 680 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 select-none ${className}`}
      aria-label="Dewey Kindergarten (DK) Official Full Logo"
    >
      {/* 0. Solid Crisp White Background */}
      <rect width="680" height="260" rx={rounded ? "24" : "0"} fill="#FFFFFF" />

      {/* 1. DK Monogram */}
      <text
        x="145"
        y="160"
        fill="#007A3D"
        fontFamily="'Times New Roman', 'Georgia', 'Baskerville', 'Palatino', serif"
        fontSize="165"
        fontWeight="bold"
        textAnchor="middle"
        letterSpacing="-3"
      >
        DK
      </text>

      {/* 2. Orange Upper Book Swoosh */}
      <path
        d="M 28 178 C 68 191 108 204 145 208 C 182 204 222 191 262 178 C 265 180 263 183 259 185 C 222 202 183 214 145 216 C 107 214 68 202 31 185 C 27 183 25 180 28 178 Z"
        fill="#F58220"
      />

      {/* 3. Green Lower Book Swoosh with Center V-Point */}
      <path
        d="M 26 190 C 66 204 108 218 145 221 C 182 221 224 204 264 190 C 267 192 265 195 260 197 C 224 214 183 230 145 236 C 107 230 66 214 30 197 C 25 195 23 192 26 190 Z"
        fill="#007A3D"
      />

      {showDivider && (
        <line x1="295" y1="36" x2="295" y2="238" stroke="#007A3D" strokeWidth="4" strokeLinecap="round" />
      )}

      {/* 4. DEWEY text */}
      <text
        x="320"
        y="112"
        fill="#007A3D"
        fontFamily="'Times New Roman', 'Georgia', 'Baskerville', serif"
        fontSize="66"
        fontWeight="bold"
        letterSpacing="3"
      >
        DEWEY
      </text>

      {/* 5. KINDERGARTEN text */}
      <text
        x="320"
        y="194"
        fill="#007A3D"
        fontFamily="'Times New Roman', 'Georgia', 'Baskerville', serif"
        fontSize="44"
        fontWeight="bold"
        letterSpacing="2.5"
      >
        KINDERGARTEN
      </text>
    </svg>
  );
};

export const DKShield: React.FC<{ size?: number; className?: string }> = ({ size = 48, className = '' }) => {
  return (
    <div 
      style={{ width: size, height: size }} 
      className={`shrink-0 flex items-center justify-center rounded-xl bg-white shadow-xs border border-emerald-200/80 p-1 ${className}`}
    >
      <DKLogoEmblem size={Math.max(20, size - 4)} />
    </div>
  );
};

export const SchoolLogoIcon: React.FC<{
  size?: number;
  className?: string;
  customLogoUrl?: string | null;
  forceDefaultShield?: boolean;
  brand?: 'DCH' | 'DK' | 'CENTRAL';
}> = ({ size = 48, className = '', customLogoUrl, forceDefaultShield = false, brand }) => {
  const appState = useAppSafe();
  const schoolProfile = appState?.schoolProfile;
  const selectedCampusId = appState && 'selectedCampusId' in appState ? appState.selectedCampusId : null;
  
  // Determine active brand
  const activeCampus = selectedCampusId ? CAMPUS_LIST.find(c => c.id === selectedCampusId) : null;
  const effectiveBrand = brand || (activeCampus?.brand as 'DCH' | 'DK' | 'CENTRAL') || (selectedCampusId?.startsWith('DK_') ? 'DK' : 'DCH');

  const effectiveLogoUrl = forceDefaultShield 
    ? null 
    : (customLogoUrl !== undefined ? customLogoUrl : schoolProfile?.customLogoUrl);

  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    setHasError(false);
  }, [effectiveLogoUrl]);

  // If a custom logo URL is provided (and this isn't DK falling back to a default DCH logo)
  if (effectiveLogoUrl && !hasError && (effectiveBrand !== 'DK' || customLogoUrl)) {
    return (
      <div 
        style={{ width: size, height: size }} 
        className={`shrink-0 flex items-center justify-center relative overflow-hidden rounded-2xl bg-white shadow-xs border border-emerald-200/80 p-1 ${className}`}
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

  if (effectiveBrand === 'CENTRAL') {
    return (
      <div 
        style={{ width: size, height: size }}
        className={`shrink-0 flex items-center justify-center rounded-2xl bg-white shadow-xs border border-emerald-200/80 p-1 ${className}`}
      >
        <DIShield size={Math.max(24, size - 6)} />
      </div>
    );
  }

  if (effectiveBrand === 'DK') {
    return (
      <div 
        style={{ width: size, height: size }} 
        className={`shrink-0 flex items-center justify-center rounded-2xl bg-white shadow-xs border border-emerald-200/80 p-1 ${className}`}
      >
        <DKLogoEmblem size={Math.max(24, size - 6)} />
      </div>
    );
  }

  return (
    <div 
      style={{ width: size, height: size }}
      className={`shrink-0 flex items-center justify-center rounded-2xl bg-white shadow-xs border border-emerald-200/80 p-1 ${className}`}
    >
      <DCHShield size={Math.max(24, size - 6)} />
    </div>
  );
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
  const { schoolProfile, selectedCampusId } = useAppSafe();
  const activeCampus = selectedCampusId ? CAMPUS_LIST.find(c => c.id === selectedCampusId) : null;

  const isDKCampus = activeCampus?.brand === 'DK' || selectedCampusId?.startsWith('DK_');
  const khmerTitle = isDKCampus ? (activeCampus?.nameKhmer || 'សាលាមត្តេយ្យ ឌូវី') : (schoolNameKhmer || schoolProfile?.schoolNameKhmer || INITIAL_SCHOOL_PROFILE.schoolNameKhmer);
  const engTitle = isDKCampus ? 'DEWEY KINDERGARTEN' : (schoolNameEnglish || schoolProfile?.schoolNameEnglish || INITIAL_SCHOOL_PROFILE.schoolNameEnglish);
  
  // Determine if we should override branding
  const displayBrand: 'DCH' | 'DK' | 'CENTRAL' = isDKCampus ? 'DK' : (activeCampus?.brand === 'CENTRAL' ? 'CENTRAL' : 'DCH');

  const khmerSub = taglineKhmer || schoolProfile?.taglineKhmer || INITIAL_SCHOOL_PROFILE.taglineKhmer;
  const engSub = isDKCampus 
    ? 'International Trilingual Kindergarten (English · Khmer · Chinese)' 
    : (taglineEnglish || schoolProfile?.taglineEnglish || INITIAL_SCHOOL_PROFILE.taglineEnglish);
  const badgeLabel = isDKCampus ? 'DK Portal' : (portalBadgeText || schoolProfile?.portalBadgeText || INITIAL_SCHOOL_PROFILE.portalBadgeText);

  if (variant === 'shield-only') {
    const shieldSize = size === 'sm' ? 32 : size === 'md' ? 44 : size === 'lg' ? 60 : size === 'xl' ? 76 : 96;
    return (
      <SchoolLogoIcon 
        size={shieldSize} 
        className={className} 
        customLogoUrl={customLogoUrl} 
        forceDefaultShield={forceDefaultShield}
        brand={displayBrand}
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
            brand={displayBrand}
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
          brand={displayBrand}
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
        brand={displayBrand}
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

