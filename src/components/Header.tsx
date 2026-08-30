import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BrandLogo } from './BrandLogo';
import { UserProfileModal } from './UserProfileModal';
import { CampusTabsBar } from './CampusTabsBar';
import { 
  Users, 
  ShieldCheck, 
  GraduationCap, 
  ChevronDown, 
  UserPlus, 
  Menu, 
  X, 
  BookOpen, 
  Layers, 
  Sparkles,
  Award,
  CheckCircle2,
  Calendar,
  LogOut,
  LogIn,
  School,
  Activity,
  KeyRound,
  Building2,
  Table,
  FileCheck2,
  Camera,
  User
} from 'lucide-react';

interface HeaderProps {
  onOpenNewPlan: () => void;
  onOpenNewTeacher: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenNewPlan,
  onOpenNewTeacher,
}) => {
  const { 
    currentUser, 
    allAccounts, 
    switchUser, 
    activeTab, 
    setActiveTab,
    lessonPlans,
    userLessonPlans,
    openSignInModal,
    openSignUpModal,
    signOut,
    openProfileModal,
    selectedCampusId,
    setSelectedCampusId,
  } = useApp();

  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isUserProfileEditorOpen, setIsUserProfileEditorOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!currentUser) {
    return null;
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return (
          <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300">
            👑 Admin
          </span>
        );
      case 'academic_officer':
        return (
          <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-100 text-blue-900 border border-blue-300">
            🎓 Academic Officer
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 border border-emerald-300">
            👩‍🏫 Teacher
          </span>
        );
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xs">
      {/* Top Banner Accent Line */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#006838] via-[#008A4B] to-[#F59E0B]" />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20">
          {/* Brand Logo & Title */}
          <div 
            className="cursor-pointer transition-transform active:scale-98"
            onClick={() => setActiveTab('dashboard')}
          >
            <BrandLogo size="md" />
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1.5 bg-slate-50/80 p-1 rounded-2xl border border-slate-200">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-white text-[#007A43] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              Overview
            </button>

            <button
              onClick={() => setActiveTab('lesson_plans')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'lesson_plans'
                  ? 'bg-white text-[#007A43] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              {currentUser.role === 'admin' || currentUser.role === 'academic_officer'
                ? `All Lesson Plans (${lessonPlans.length})`
                : `My Lesson Plans (${userLessonPlans.length})`}
            </button>

            <button
              onClick={() => setActiveTab('classrooms')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'classrooms'
                  ? 'bg-white text-[#007A43] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              Classrooms
            </button>

            <button
              onClick={() => setActiveTab('weekly_schedule')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'weekly_schedule'
                  ? 'bg-white text-[#007A43] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              Daily Routine
            </button>

            {currentUser.role === 'admin' && (
              <button
                onClick={() => setActiveTab('admin_console')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'admin_console'
                    ? 'bg-amber-400 text-amber-950 shadow-xs font-black'
                    : 'text-amber-800 hover:bg-amber-100/50'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Console</span>
              </button>
            )}
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Quick Upload Button for Teacher */}
            {currentUser.role === 'teacher' && (
              <button
                onClick={onOpenNewPlan}
                className="flex items-center gap-2 px-3.5 py-2 bg-[#007A43] hover:bg-[#006338] text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-95"
              >
                <BookOpen className="w-4 h-4 text-amber-300" />
                <span>Upload Lesson Plan</span>
              </button>
            )}

            {/* School Profile & Logo Button for Admin */}
            {currentUser.role === 'admin' && (
              <button
                onClick={openProfileModal}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-amber-950 hover:text-amber-950 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-xl transition-all"
                title="Update Web App Profile & Replace School Logo"
              >
                <Building2 className="w-3.5 h-3.5 text-amber-700" />
                <span>Profile & Logo</span>
              </button>
            )}

            {/* Role / Account Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 pr-3 rounded-2xl border border-slate-200 hover:border-emerald-300 bg-slate-50/80 hover:bg-white transition-all shadow-2xs group"
              >
                <div className="relative">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-10 h-10 rounded-xl object-cover ring-2 ring-emerald-500/20"
                  />
                  <div 
                    className={`absolute -bottom-1 -right-1 p-0.5 rounded-full ring-2 ring-white ${
                      currentUser.role === 'admin' 
                        ? 'bg-amber-500 text-white' 
                        : currentUser.role === 'academic_officer'
                        ? 'bg-blue-600 text-white'
                        : 'bg-emerald-600 text-white'
                    }`}
                  >
                    {currentUser.role === 'admin' ? (
                      <ShieldCheck className="w-3 h-3" />
                    ) : currentUser.role === 'academic_officer' ? (
                      <Award className="w-3 h-3" />
                    ) : (
                      <GraduationCap className="w-3 h-3" />
                    )}
                  </div>
                </div>

                <div className="text-left leading-tight hidden sm:block">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                      {currentUser.name}
                    </span>
                    {getRoleBadge(currentUser.role)}
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium truncate max-w-[150px] block">
                    {currentUser.title}
                  </span>
                </div>

                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* User Selection Dropdown Menu */}
              {isUserDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-20"
                    onClick={() => setIsUserDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-84 bg-white rounded-3xl shadow-2xl border border-emerald-100/90 p-3 z-30 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3 py-2 border-b border-slate-100 mb-2">
                      <div className="flex items-center justify-between">
                        <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                          Active Account Session
                        </p>
                        <button
                          onClick={() => {
                            setIsUserDropdownOpen(false);
                            signOut();
                          }}
                          className="text-[11px] text-rose-600 hover:text-rose-800 font-bold flex items-center gap-1"
                        >
                          <LogOut className="w-3 h-3" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                      <p className="text-xs text-slate-700 font-semibold mt-1">
                        Signed in as: <span className="text-[#007A43] font-bold">{currentUser.name}</span>
                      </p>
                      <p className="text-[11px] text-slate-400">{currentUser.email}</p>
                    </div>

                    <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Quick Account Switcher (Demo):
                    </p>

                    <div className="max-h-64 overflow-y-auto space-y-1 pr-1">
                      {allAccounts.map((account) => {
                        const isSelected = account.id === currentUser.id;
                        return (
                          <button
                            key={account.id}
                            onClick={() => {
                              switchUser(account.id);
                              setIsUserDropdownOpen(false);
                            }}
                            className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left transition-all ${
                              isSelected
                                ? 'bg-emerald-50 text-emerald-900 ring-1 ring-emerald-300 font-medium'
                                : 'hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            <img
                              src={account.avatar}
                              alt={account.name}
                              className="w-8 h-8 rounded-lg object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="text-xs font-bold truncate">{account.name}</p>
                                <span 
                                  className={`text-[8px] font-extrabold uppercase px-1.5 py-0.2 rounded ${
                                    account.role === 'admin' 
                                      ? 'bg-amber-100 text-amber-800' 
                                      : account.role === 'academic_officer'
                                      ? 'bg-blue-100 text-blue-800'
                                      : 'bg-emerald-100 text-emerald-800'
                                  }`}
                                >
                                  {account.role}
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-500 truncate">
                                {account.title}
                              </p>
                            </div>
                            {isSelected && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-100 space-y-1.5">
                      <button
                        onClick={() => {
                          setIsUserDropdownOpen(false);
                          setIsUserProfileEditorOpen(true);
                        }}
                        className="w-full flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold text-emerald-950 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 rounded-xl transition-colors"
                      >
                        <Camera className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Edit Profile & Picture</span>
                      </button>

                      {currentUser.role === 'admin' && (
                        <button
                          onClick={() => {
                            setIsUserDropdownOpen(false);
                            openProfileModal();
                          }}
                          className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-amber-950 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl transition-colors"
                        >
                          <Building2 className="w-3.5 h-3.5 text-amber-700" />
                          <span>Update School Profile & Logo</span>
                        </button>
                      )}

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => {
                            setIsUserDropdownOpen(false);
                            openSignInModal();
                          }}
                          className="flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                        >
                          <LogIn className="w-3.5 h-3.5 text-slate-500" />
                          <span>Sign In Form</span>
                        </button>

                        <button
                          onClick={() => {
                            setIsUserDropdownOpen(false);
                            openSignUpModal();
                          }}
                          className="flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-[#007A43] hover:bg-emerald-50 rounded-xl transition-colors"
                        >
                          <UserPlus className="w-3.5 h-3.5 text-[#007A43]" />
                          <span>Sign Up Staff</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            {currentUser.role === 'teacher' && (
              <button
                onClick={onOpenNewPlan}
                className="p-2 bg-[#007A43] text-white rounded-xl shadow-xs"
                title="Upload Lesson Plan"
              >
                <BookOpen className="w-4 h-4 text-amber-300" />
              </button>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Sub-strip Campus Tabs Bar */}
      <div className="bg-slate-50/90 border-t border-slate-200/80 px-3 sm:px-6 lg:px-8 py-1.5 flex items-center justify-center overflow-x-auto no-scrollbar">
        <div className="flex items-center justify-center gap-2 shrink-0">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 font-bold shrink-0 px-1">
            <Building2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Campus:</span>
          </div>
          <CampusTabsBar 
            selectedCampusId={selectedCampusId}
            onSelectCampus={setSelectedCampusId}
            variant="tabs"
            className="w-auto"
          />
        </div>
      </div>

      {/* Mobile Drawer / Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-emerald-100 bg-white px-4 py-4 space-y-4 shadow-lg animate-in slide-in-from-top duration-200">
          {/* Current User Card */}
          <div className="flex items-center justify-between p-3 bg-emerald-50/70 border border-emerald-200/70 rounded-2xl">
            <div className="flex items-center gap-3">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-11 h-11 rounded-xl object-cover ring-2 ring-emerald-500/20"
              />
              <div>
                <p className="text-sm font-bold text-slate-900">{currentUser.name}</p>
                <p className="text-xs text-emerald-800 font-medium">{currentUser.title}</p>
              </div>
            </div>
            {getRoleBadge(currentUser.role)}
          </div>

          {/* Mobile Nav Links */}
          <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
            <button
              onClick={() => {
                setActiveTab('dashboard');
                setIsMobileMenuOpen(false);
              }}
              className={`p-3 rounded-xl text-left border transition-all ${
                activeTab === 'dashboard' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              📊 Overview
            </button>
            <button
              onClick={() => {
                setActiveTab('lesson_plans');
                setIsMobileMenuOpen(false);
              }}
              className={`p-3 rounded-xl text-left border transition-all ${
                activeTab === 'lesson_plans' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              📚 {currentUser.role === 'admin' || currentUser.role === 'academic_officer' ? `All Plans (${lessonPlans.length})` : `My Plans (${userLessonPlans.length})`}
            </button>
            <button
              onClick={() => {
                setActiveTab('classrooms');
                setIsMobileMenuOpen(false);
              }}
              className={`p-3 rounded-xl text-left border transition-all ${
                activeTab === 'classrooms' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              🏫 Classrooms
            </button>
            <button
              onClick={() => {
                setActiveTab('weekly_schedule');
                setIsMobileMenuOpen(false);
              }}
              className={`p-3 rounded-xl text-left border transition-all ${
                activeTab === 'weekly_schedule' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              ⏰ Daily Routine
            </button>

            {currentUser.role === 'admin' && (
              <button
                onClick={() => {
                  setActiveTab('admin_console');
                  setIsMobileMenuOpen(false);
                }}
                className={`p-3 rounded-xl text-left border col-span-2 transition-all ${
                  activeTab === 'admin_console' ? 'bg-amber-400 text-amber-950 border-amber-400 font-black' : 'bg-amber-50 border-amber-200 text-amber-900'
                }`}
              >
                👑 Master Admin Console
              </button>
            )}
          </div>

          {/* Account Switcher on Mobile */}
          <div className="pt-2 border-t border-slate-100">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Switch User Account:
            </label>
            <select
              value={currentUser.id}
              onChange={(e) => {
                switchUser(e.target.value);
                setIsMobileMenuOpen(false);
              }}
              aria-label="Select User Account"
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-emerald-500"
            >
              {allAccounts.map(a => (
                <option key={a.id} value={a.id}>
                  {a.role === 'admin' ? '👑 [ADMIN] ' : a.role === 'academic_officer' ? '🎓 [OFFICER] ' : '👩‍🏫 [TEACHER] '} {a.name} - {a.title}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                openSignInModal();
              }}
              className="py-2.5 text-center text-xs font-bold text-slate-700 bg-slate-100 rounded-xl"
            >
              🔐 Sign In
            </button>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                openSignUpModal();
              }}
              className="py-2.5 text-center text-xs font-bold text-white bg-[#007A43] rounded-xl"
            >
              ➕ Register Staff
            </button>
          </div>
        </div>
      )}

      {isUserProfileEditorOpen && (
        <UserProfileModal onClose={() => setIsUserProfileEditorOpen(false)} />
      )}
    </header>
  );
};
