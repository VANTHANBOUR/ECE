import React from 'react';
import { useApp } from '../context/AppContext';
import { CAMPUS_LIST, CampusId } from '../types';
import { DCHShield, DKShield } from './BrandLogo';
import { 
  X, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Building2, 
  Sparkles,
  Lock,
  Globe
} from 'lucide-react';

interface SignUpControlModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SignUpControlModal: React.FC<SignUpControlModalProps> = ({ isOpen, onClose }) => {
  const { 
    schoolProfile, 
    toggleGlobalSignUp, 
    toggleCampusSignUp 
  } = useApp();

  if (!isOpen) return null;

  const isGlobalDisabled = !!schoolProfile.globalSignUpDisabled;
  const disabledMap = schoolProfile.disabledSignUpCampuses || {};

  const dchCampuses = CAMPUS_LIST.filter(c => c.brand === 'DCH' && c.id !== 'ALL');
  const dkCampuses = CAMPUS_LIST.filter(c => c.brand === 'DK' && c.id !== 'ALL');

  const handleEnableAll = async () => {
    if (isGlobalDisabled) {
      await toggleGlobalSignUp(false);
    }
    // Enable each individual campus as well
    for (const campus of CAMPUS_LIST) {
      if (campus.id !== 'ALL' && disabledMap[campus.id]) {
        await toggleCampusSignUp(campus.id, false);
      }
    }
  };

  const handleDisableAll = async () => {
    await toggleGlobalSignUp(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white flex items-center justify-between border-b border-emerald-900/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/30">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-emerald-400 text-slate-950 rounded-full">
                  Campus Sign-Up Visibility
                </span>
              </div>
              <h2 className="text-lg font-black tracking-tight text-white mt-0.5 font-['Outfit']">
                Sign-Up Controls (Hide / Display)
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">

          {/* Master Switch Panel */}
          <div className={`p-4 rounded-2xl border transition-all ${
            isGlobalDisabled 
              ? 'bg-rose-50/80 border-rose-200' 
              : 'bg-emerald-50/80 border-emerald-200'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className={`p-2.5 rounded-xl shrink-0 ${
                  isGlobalDisabled ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {isGlobalDisabled ? <Lock className="w-5 h-5" /> : <Globe className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className={`text-sm font-bold ${
                    isGlobalDisabled ? 'text-rose-950' : 'text-emerald-950'
                  }`}>
                    {isGlobalDisabled 
                      ? 'Sign-Up Hidden for ALL Campuses' 
                      : 'Sign-Up Displayed (Custom Campus Settings)'
                    }
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {isGlobalDisabled 
                      ? 'Self-service account registration is currently hidden across the entire portal.' 
                      : 'Self-service sign-up is visible on the login page according to per-campus rules below.'
                    }
                  </p>
                </div>
              </div>

              {/* Master Actions */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                {isGlobalDisabled ? (
                  <button
                    onClick={handleEnableAll}
                    className="px-3.5 py-2 bg-[#007A43] hover:bg-[#006338] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                  >
                    <Eye className="w-4 h-4 text-amber-300" />
                    <span>Display for All</span>
                  </button>
                ) : (
                  <button
                    onClick={handleDisableAll}
                    className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                  >
                    <EyeOff className="w-4 h-4" />
                    <span>Hide for All</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Quick Batch Actions */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs font-black text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-[#007A43]" />
              <span>Campus Branch Access Controls</span>
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleEnableAll}
                className="px-2.5 py-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-all"
              >
                Display All Campuses
              </button>
              <button
                onClick={handleDisableAll}
                className="px-2.5 py-1 text-xs font-semibold text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-all"
              >
                Hide All Campuses
              </button>
            </div>
          </div>

          {/* DCH Campuses */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-extrabold text-amber-900 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200/80">
              <DCHShield className="w-4 h-4 text-amber-800" />
              <span>Dewey Childcare House (DCH Branches)</span>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-1">
              {dchCampuses.map(campus => {
                const isCampusDisabled = isGlobalDisabled || !!disabledMap[campus.id];
                return (
                  <div 
                    key={campus.id}
                    className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                      isCampusDisabled 
                        ? 'bg-slate-50/80 border-slate-200' 
                        : 'bg-white border-emerald-200/80 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${
                        isCampusDisabled ? 'bg-slate-200 text-slate-500' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-slate-900">{campus.shortName}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                            {campus.location}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">{campus.nameKhmer}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold flex items-center gap-1.5 ${
                        isCampusDisabled 
                          ? 'bg-rose-100 text-rose-800 border border-rose-200' 
                          : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                      }`}>
                        {isCampusDisabled ? (
                          <>
                            <EyeOff className="w-3 h-3 text-rose-600" />
                            <span>Hidden</span>
                          </>
                        ) : (
                          <>
                            <Eye className="w-3 h-3 text-emerald-600" />
                            <span>Displayed</span>
                          </>
                        )}
                      </span>

                      <button
                        onClick={() => toggleCampusSignUp(campus.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          isCampusDisabled
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs'
                            : 'bg-slate-200 hover:bg-rose-100 hover:text-rose-800 text-slate-700'
                        }`}
                      >
                        {isCampusDisabled ? 'Display Sign Up' : 'Hide Sign Up'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* DK Campuses */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-900 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200/80">
              <DKShield className="w-4 h-4 text-emerald-800" />
              <span>Dewey Kindergarten (DK Branches)</span>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {dkCampuses.map(campus => {
                const isCampusDisabled = isGlobalDisabled || !!disabledMap[campus.id];
                return (
                  <div 
                    key={campus.id}
                    className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                      isCampusDisabled 
                        ? 'bg-slate-50/80 border-slate-200' 
                        : 'bg-white border-emerald-200/80 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${
                        isCampusDisabled ? 'bg-slate-200 text-slate-500' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-slate-900">{campus.shortName}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                            {campus.location}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">{campus.nameKhmer}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold flex items-center gap-1.5 ${
                        isCampusDisabled 
                          ? 'bg-rose-100 text-rose-800 border border-rose-200' 
                          : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                      }`}>
                        {isCampusDisabled ? (
                          <>
                            <EyeOff className="w-3 h-3 text-rose-600" />
                            <span>Hidden</span>
                          </>
                        ) : (
                          <>
                            <Eye className="w-3 h-3 text-emerald-600" />
                            <span>Displayed</span>
                          </>
                        )}
                      </span>

                      <button
                        onClick={() => toggleCampusSignUp(campus.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          isCampusDisabled
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs'
                            : 'bg-slate-200 hover:bg-rose-100 hover:text-rose-800 text-slate-700'
                        }`}
                      >
                        {isCampusDisabled ? 'Display Sign Up' : 'Hide Sign Up'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-3.5 bg-slate-100 rounded-2xl border border-slate-200/80 text-xs text-slate-600 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-slate-900">Administrator Note:</strong> Hiding sign-up only restricts self-registration on the public login gate. School administrators can always provision staff credentials directly via <span className="font-bold text-emerald-800">"Create New Staff Account"</span> in this Admin Control Center.
            </p>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs"
          >
            Done & Save
          </button>
        </div>
      </div>
    </div>
  );
};
