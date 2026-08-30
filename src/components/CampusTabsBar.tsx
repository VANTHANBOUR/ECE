import React from 'react';
import { CampusId, CAMPUS_LIST, CampusInfo } from '../types';
import { Building2, School, ShieldCheck, Check } from 'lucide-react';

interface CampusTabsBarProps {
  selectedCampusId: CampusId;
  onSelectCampus: (campusId: CampusId) => void;
  showAllOption?: boolean;
  variant?: 'tabs' | 'cards' | 'dropdown';
  className?: string;
}

export const CampusTabsBar: React.FC<CampusTabsBarProps> = ({
  selectedCampusId,
  onSelectCampus,
  showAllOption = true,
  variant = 'tabs',
  className = '',
}) => {
  const visibleCampuses = showAllOption 
    ? CAMPUS_LIST 
    : CAMPUS_LIST.filter(c => c.id !== 'ALL');

  if (variant === 'cards') {
    return (
      <div className={`grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 ${className}`}>
        {visibleCampuses.map((campus) => {
          const isSelected = selectedCampusId === campus.id;
          return (
            <button
              key={campus.id}
              type="button"
              onClick={() => onSelectCampus(campus.id)}
              className={`flex flex-col items-center justify-between p-3 rounded-2xl border text-left transition-all relative overflow-hidden active:scale-95 ${
                isSelected
                  ? 'bg-gradient-to-br from-[#007A43] to-emerald-800 text-white border-emerald-500 shadow-md ring-2 ring-emerald-400/50'
                  : 'bg-white/10 backdrop-blur-md hover:bg-white/20 text-slate-200 border-white/15'
              }`}
            >
              {isSelected && (
                <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
              )}
              <div className="flex items-center gap-1.5 mb-1.5">
                {campus.id === 'ALL' ? (
                  <Building2 className={`w-4 h-4 ${isSelected ? 'text-amber-300' : 'text-emerald-400'}`} />
                ) : (
                  <School className={`w-4 h-4 ${isSelected ? 'text-amber-300' : 'text-emerald-300'}`} />
                )}
                <span className={`text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-md ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-white/10 text-emerald-300'
                }`}>
                  {campus.brand}
                </span>
              </div>
              <div className="text-center w-full">
                <span className="text-xs font-black block tracking-tight line-clamp-1">
                  {campus.shortName}
                </span>
                <span className={`text-[9px] block mt-0.5 truncate ${isSelected ? 'text-emerald-100' : 'text-slate-400'}`}>
                  {campus.location}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`w-full overflow-x-auto no-scrollbar py-1 ${className}`}>
      <div className="flex items-center gap-1.5 min-w-max bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/90 shadow-2xs">
        {visibleCampuses.map((campus) => {
          const isSelected = selectedCampusId === campus.id;
          return (
            <button
              key={campus.id}
              type="button"
              onClick={() => onSelectCampus(campus.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all active:scale-95 ${
                isSelected
                  ? 'bg-[#007A43] text-white shadow-xs border border-emerald-600'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              {campus.id === 'ALL' ? (
                <Building2 className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-300' : 'text-emerald-700'}`} />
              ) : (
                <School className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-300' : 'text-emerald-600'}`} />
              )}
              <span>{campus.shortName}</span>
              {isSelected && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
