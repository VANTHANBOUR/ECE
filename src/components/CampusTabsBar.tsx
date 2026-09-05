import React, { useState } from 'react';
import { CampusId, CAMPUS_LIST, CampusInfo, isCentralHQUser } from '../types';
import { Building2, School, Check, Lock, ShieldAlert, UserCheck, X, Eye } from 'lucide-react';
import { useApp } from '../context/AppContext';

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
  const { currentUser, updateAccount, showToast } = useApp();
  const [modalCampus, setModalCampus] = useState<CampusInfo | null>(null);

  const isTeacher = currentUser?.role === 'teacher';
  
  // Central HQ Staff cross-campus monitor authorization
  const isCentralRole = React.useMemo(() => {
    if (!currentUser) return true; // Before login: users can select target campus gate freely
    return isCentralHQUser(currentUser);
  }, [currentUser]);

  // Teacher's registered campuses list
  const teacherRegisteredIds: CampusId[] = React.useMemo(() => {
    if (!currentUser || !isTeacher) return [];
    const list = currentUser.registeredCampusIds || (currentUser.campusId ? [currentUser.campusId] : ['DCH_SYW']);
    return list;
  }, [currentUser, isTeacher]);

  const checkIsRegistered = (campusId: CampusId): boolean => {
    if (isCentralRole) return true; // Central HQ Staff can monitor all campuses without restriction
    if (!isTeacher) return true; // Admins, officers, guests are allowed
    if (campusId === 'ALL') return false; // Teachers need specific campus registration
    return teacherRegisteredIds.includes(campusId);
  };

  const handleCampusClick = (campus: CampusInfo) => {
    // Central HQ Staff has full authority to monitor any campus branch or Central HQ
    if (isCentralRole) {
      onSelectCampus(campus.id);
      return;
    }

    // Campus Security Enforcement: Restrict branch-specific users from switching to unauthorized campuses
    if (currentUser && !isCentralRole) {
      const userCampusId = currentUser.campusId;
      if (userCampusId && userCampusId !== 'ALL' && campus.id !== userCampusId) {
        // Allow teachers if they registered for multiple campuses
        if (isTeacher && currentUser.registeredCampusIds?.includes(campus.id)) {
          onSelectCampus(campus.id);
          return;
        }

        const assignedCampus = CAMPUS_LIST.find(c => c.id === userCampusId);
        showToast(
          `Access Restricted: Your account (${currentUser.role === 'teacher' ? 'Lead Teacher' : 'Campus Staff'}) is assigned to ${assignedCampus?.shortName || 'your local campus'}. Central HQ Staff can monitor all campuses.`,
          'warning'
        );
        return;
      }
    }

    const registered = checkIsRegistered(campus.id);
    if (registered) {
      onSelectCampus(campus.id);
    } else {
      // Teacher trying to access an unregistered campus -> Require Registration first!
      setModalCampus(campus);
    }
  };

  const handleRegisterConfirm = (campus: CampusInfo) => {
    if (!currentUser) return;
    
    const updatedCampusList = Array.from(new Set([...teacherRegisteredIds, campus.id]));
    
    updateAccount(currentUser.id, {
      campusId: campus.id,
      campusName: campus.shortName,
      registeredCampusIds: updatedCampusList as CampusId[],
    });

    showToast(`Registered successfully to ${campus.shortName}! Campus unlocked.`, 'success');
    onSelectCampus(campus.id);
    setModalCampus(null);
  };

  const visibleCampuses = showAllOption 
    ? CAMPUS_LIST 
    : CAMPUS_LIST.filter(c => c.id !== 'ALL');

  if (variant === 'cards') {
    return (
      <>
        <div className={`grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 ${className}`}>
          {visibleCampuses.map((campus) => {
            const isSelected = selectedCampusId === campus.id;
            const isRegistered = checkIsRegistered(campus.id);

            return (
              <button
                key={campus.id}
                type="button"
                onClick={() => handleCampusClick(campus)}
                className={`flex flex-col items-center justify-between p-3 rounded-2xl border text-left transition-all relative overflow-hidden active:scale-95 ${
                  isSelected
                    ? 'bg-gradient-to-br from-[#007A43] to-emerald-800 text-white border-emerald-500 shadow-md ring-2 ring-emerald-400/50'
                    : isTeacher && !isRegistered
                    ? 'bg-slate-800/40 text-slate-400 border-slate-700/60 opacity-80 hover:opacity-100'
                    : 'bg-white/10 backdrop-blur-md hover:bg-white/20 text-slate-200 border-white/15'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                )}
                {isTeacher && !isRegistered && (
                  <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-slate-700 text-amber-400 flex items-center justify-center border border-amber-500/30">
                    <Lock className="w-2.5 h-2.5" />
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

        {/* Registration Modal Popup */}
        {modalCampus && (
          <CampusRegistrationModal
            campus={modalCampus}
            onClose={() => setModalCampus(null)}
            onConfirm={() => handleRegisterConfirm(modalCampus)}
          />
        )}
      </>
    );
  }

  return (
    <>
      <div className={`overflow-x-auto no-scrollbar py-0.5 flex justify-center ${className}`}>
        <div className="flex items-center justify-center gap-1 min-w-max bg-slate-100/90 p-1 rounded-2xl border border-slate-200/90 shadow-2xs">
          {visibleCampuses.map((campus) => {
            const isSelected = selectedCampusId === campus.id;
            const isRegistered = checkIsRegistered(campus.id);

            return (
              <button
                key={campus.id}
                type="button"
                onClick={() => handleCampusClick(campus)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all active:scale-95 ${
                  isSelected
                    ? 'bg-[#007A43] text-white shadow-xs border border-emerald-600'
                    : isTeacher && !isRegistered
                    ? 'text-slate-500 hover:text-slate-800 bg-slate-200/60 hover:bg-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                }`}
                title={isTeacher && !isRegistered ? `Registration required for ${campus.shortName}` : campus.nameEnglish}
              >
                {campus.id === 'ALL' ? (
                  <Building2 className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-300' : 'text-emerald-700'}`} />
                ) : (
                  <School className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-300' : 'text-emerald-600'}`} />
                )}
                
                <span>{campus.shortName}</span>

                {isTeacher && !isRegistered ? (
                  <Lock className="w-3 h-3 text-amber-600 ml-0.5" />
                ) : isSelected ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      {/* Registration Modal Popup */}
      {modalCampus && (
        <CampusRegistrationModal
          campus={modalCampus}
          onClose={() => setModalCampus(null)}
          onConfirm={() => handleRegisterConfirm(modalCampus)}
        />
      )}
    </>
  );
};

interface CampusRegistrationModalProps {
  campus: CampusInfo;
  onClose: () => void;
  onConfirm: () => void;
}

const CampusRegistrationModal: React.FC<CampusRegistrationModalProps> = ({ campus, onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 overflow-hidden relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mb-4 shadow-xs">
            <Lock className="w-7 h-7" />
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-2">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
            Campus Registration Required
          </span>

          <h3 className="text-lg font-black text-slate-900 mb-1">
            Access Restricted to {campus.shortName}
          </h3>

          <p className="text-xs text-slate-500 mb-4 font-semibold">
            {campus.nameKhmer || campus.nameEnglish}
          </p>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left w-full mb-6 text-xs text-slate-600 space-y-2">
            <p className="leading-relaxed">
              As a <strong>Lead Educator</strong>, you must register for <strong>{campus.shortName}</strong> before switching tabs to view or submit lesson plans for this campus.
            </p>
            <div className="flex items-center gap-2 pt-1 text-slate-500">
              <Building2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="truncate">{campus.location}</span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 w-full">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors flex-1"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-5 py-2.5 rounded-xl bg-[#007A43] hover:bg-emerald-800 text-white text-xs font-black shadow-md transition-all flex items-center justify-center gap-2 flex-1"
            >
              <UserCheck className="w-4 h-4 text-amber-300" />
              <span>Register & Access</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
