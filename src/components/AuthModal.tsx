import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { BrandLogo, SchoolLogoIcon } from './BrandLogo';
import { UserRole, EarlyChildhoodAgeGroup, CampusId, CAMPUS_LIST, getCampusClassroomOptions } from '../types';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  ShieldCheck, 
  GraduationCap, 
  BookOpen, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  School,
  Award,
  Loader2,
  Database,
  Globe,
  Eye,
  EyeOff
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    authModalMode, 
    setAuthModalMode,
    signIn,
    signUp,
    signInWithGoogle,
    allAccounts,
    switchUser,
    classrooms,
    showToast,
    isFirebaseConnected,
    firebaseConfigInfo,
    selectedCampusId,
    schoolProfile,
    isSignUpAllowedForCampus
  } = useApp();

  const activeCampus = selectedCampusId ? CAMPUS_LIST.find(c => c.id === selectedCampusId) : null;
  const isDKCampus = activeCampus?.brand === 'DK' || selectedCampusId?.startsWith('DK_');
  const institutionEnglish = isDKCampus ? 'Dewey Kindergarten' : (schoolProfile?.schoolNameEnglish || 'Dewey Childcare House');

  const [isLoading, setIsLoading] = useState(false);

  // Sign In Form State
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('password123');
  const [showSignInPassword, setShowSignInPassword] = useState(false);

  // Sign Up Form State
  const [name, setName] = useState('');
  const [khmerName, setKhmerName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('teacher');
  const [title, setTitle] = useState('');
  const [assignedClassId, setAssignedClassId] = useState('Pre-Nursery AM');
  const [signUpCampusId, setSignUpCampusId] = useState<CampusId>('DCH_SYW');

  const demoTeacher = React.useMemo(() => {
    const activeCampusId = selectedCampusId || 'DCH_SYW';
    if (activeCampusId !== 'ALL') {
      const exact = allAccounts.find(a => a.role === 'teacher' && a.campusId === activeCampusId);
      if (exact) return exact;
      const isDK = activeCampusId.startsWith('DK_') || isDKCampus;
      const brandMatch = allAccounts.find(a => a.role === 'teacher' && (
        isDK ? a.campusId?.startsWith('DK_') : !a.campusId?.startsWith('DK_')
      ));
      if (brandMatch) return brandMatch;
    }
    return allAccounts.find(a => a.role === 'teacher');
  }, [allAccounts, selectedCampusId, isDKCampus]);

  useEffect(() => {
    const options = getCampusClassroomOptions(signUpCampusId);
    if (!options.some(o => o.id === assignedClassId)) {
      setAssignedClassId(options[0].id);
    }
  }, [signUpCampusId]);

  if (!isAuthModalOpen) return null;

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInEmail.trim()) {
      showToast('Please enter your email address.', 'warning');
      return;
    }
    setIsLoading(true);
    try {
      await signIn(signInEmail, signInPassword);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      showToast('Please provide your full name and email address.', 'warning');
      return;
    }

    setIsLoading(true);

    try {
      await signUp({
        name: name.trim(),
        khmerName: khmerName.trim(),
        email: email.trim(),
        password: password || 'password123',
        role,
        title: title.trim() || (role === 'admin' ? 'School Administrator' : role === 'academic_officer' ? 'Academic Review Officer' : 'Early Childhood Lead Educator'),
        campusId: signUpCampusId,
        campusName: CAMPUS_LIST.find(c => c.id === signUpCampusId)?.shortName,
        registeredCampusIds: [signUpCampusId],
        assignedClassId: role === 'teacher' ? assignedClassId : undefined,
        assignedClassName: role === 'teacher' ? assignedClassId : undefined,
        ageGroup: role === 'teacher' ? assignedClassId : undefined,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
    } finally {
      setIsLoading(false);
    }
  };

  const fillQuickAccount = async (acc: typeof allAccounts[0]) => {
    setSignInEmail(acc.email);
    setSignInPassword('password123');
    setIsLoading(true);
    try {
      await signIn(acc.email, 'password123');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-emerald-100 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-[#006838] p-6 text-white relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/95 rounded-xl p-1 shadow-sm shrink-0 flex items-center justify-center">
                <SchoolLogoIcon size={38} />
              </div>
              <div>
                <h3 className="text-lg font-black tracking-tight text-white font-['Outfit']">
                  {institutionEnglish}
                </h3>
                <p className="text-xs text-emerald-200 font-medium">
                  Early Childhood School Management & Lesson Plan System
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Firebase Connection Badge */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 p-2 bg-black/25 backdrop-blur-sm rounded-xl border border-white/10 text-[11px]">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold text-emerald-200">
                Firebase Connected: <strong className="text-white">{firebaseConfigInfo.projectId}</strong>
              </span>
            </div>
            <span className="text-[10px] text-slate-300 font-mono">
              {firebaseConfigInfo.authDomain}
            </span>
          </div>

          {/* Mode Switch Tabs */}
          <div className="flex items-center gap-2 mt-4 bg-white/10 p-1 rounded-2xl backdrop-blur-xs max-w-xs">
            <button
              type="button"
              onClick={() => setAuthModalMode('signin')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
                authModalMode === 'signin'
                  ? 'bg-white text-[#006838] shadow-xs'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              Sign In to Account
            </button>
            <button
              type="button"
              onClick={() => setAuthModalMode('signup')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
                authModalMode === 'signup'
                  ? 'bg-white text-[#006838] shadow-xs'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              Register / Sign Up
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Google Sign In Button */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold flex items-center justify-center gap-2.5 shadow-2xs transition-all active:scale-98 disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Continue with Google (Firebase Auth)</span>
            </button>

            <div className="relative flex items-center justify-center my-3">
              <div className="border-t border-slate-200 w-full" />
              <span className="bg-white px-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold absolute">
                Or with Email Credentials
              </span>
            </div>
          </div>

          {/* Quick Demo 1-Click Login Shortcuts */}
          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Instant 1-Click Demo Profiles:</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {/* Admin Button */}
              {allAccounts.filter(a => a.role === 'admin').slice(0, 1).map(acc => (
                <button
                  key={acc.id}
                  type="button"
                  onClick={() => fillQuickAccount(acc)}
                  disabled={isLoading}
                  className="flex items-center gap-2 p-2 rounded-xl bg-white border border-amber-300 hover:border-amber-500 hover:bg-amber-50/50 transition-all text-left shadow-2xs group"
                >
                  <img src={acc.avatar} alt={acc.name} className="w-8 h-8 rounded-lg object-cover ring-1 ring-amber-400" />
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-slate-900 truncate">{acc.name}</p>
                    <span className="text-[8px] font-extrabold uppercase px-1.5 py-0.2 bg-amber-100 text-amber-900 rounded inline-block">
                      👑 Admin
                    </span>
                  </div>
                </button>
              ))}

              {/* Academic Officer Button */}
              {allAccounts.filter(a => a.role === 'academic_officer').slice(0, 1).map(acc => (
                <button
                  key={acc.id}
                  type="button"
                  onClick={() => fillQuickAccount(acc)}
                  disabled={isLoading}
                  className="flex items-center gap-2 p-2 rounded-xl bg-white border border-blue-300 hover:border-blue-500 hover:bg-blue-50/50 transition-all text-left shadow-2xs group"
                >
                  <img src={acc.avatar} alt={acc.name} className="w-8 h-8 rounded-lg object-cover ring-1 ring-blue-400" />
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-slate-900 truncate">{acc.name}</p>
                    <span className="text-[8px] font-extrabold uppercase px-1.5 py-0.2 bg-blue-100 text-blue-900 rounded inline-block">
                      🎓 Academic Officer
                    </span>
                  </div>
                </button>
              ))}

              {/* Lead Teacher Button */}
              {demoTeacher && (
                <button
                  key={demoTeacher.id}
                  type="button"
                  onClick={() => fillQuickAccount(demoTeacher)}
                  disabled={isLoading}
                  className="flex items-center gap-2 p-2 rounded-xl bg-white border border-emerald-300 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all text-left shadow-2xs group"
                >
                  <img src={demoTeacher.avatar} alt={demoTeacher.name} className="w-8 h-8 rounded-lg object-cover ring-1 ring-emerald-400" />
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-slate-900 truncate">{demoTeacher.name}</p>
                    <span className="text-[8px] font-extrabold uppercase px-1.5 py-0.2 bg-emerald-100 text-emerald-900 rounded inline-block">
                      👩‍🏫 Lead Teacher ({demoTeacher.campusName || activeCampus?.shortName || 'Local Campus'})
                    </span>
                  </div>
                </button>
              )}
            </div>
          </div>

          {/* SIGN IN FORM */}
          {authModalMode === 'signin' ? (
            <form onSubmit={handleSignInSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Institutional Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    placeholder="e.g. vanthanbour@diu.edu.kh or teacher.sreymom@deweychildcare.edu.kh"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-emerald-600"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">
                    Account Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowSignInPassword(!showSignInPassword)}
                    className="text-[11px] text-emerald-700 font-semibold hover:underline flex items-center gap-1"
                  >
                    {showSignInPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    <span>{showSignInPassword ? 'Hide Password' : 'Show Password (Demo: password123)'}</span>
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showSignInPassword ? 'text' : 'password'}
                    required
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-emerald-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignInPassword(!showSignInPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showSignInPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-[#007A43] hover:bg-[#006338] text-white text-xs font-extrabold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Connecting to Firebase Auth...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In via Firebase</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <p className="text-xs text-slate-500">
                  Don't have an educator account?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthModalMode('signup')}
                    className="text-[#007A43] font-bold hover:underline"
                  >
                    Register New Account
                  </button>
                </p>
              </div>
            </form>
          ) : (
            /* SIGN UP FORM */
            <form onSubmit={handleSignUpSubmit} className="space-y-4">
              {/* Role Selection Tabs */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Select Institutional Role
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('teacher')}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      role === 'teacher'
                        ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <GraduationCap className="w-4 h-4 text-emerald-700 mb-1" />
                    <p className="text-xs font-bold text-slate-900">Lead Teacher</p>
                    <p className="text-[10px] text-slate-500">Upload & manage own plans</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('academic_officer')}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      role === 'academic_officer'
                        ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500/20'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Award className="w-4 h-4 text-blue-700 mb-1" />
                    <p className="text-xs font-bold text-slate-900">Academic Officer</p>
                    <p className="text-[10px] text-slate-500">Review & approve all plans</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('admin')}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      role === 'admin'
                        ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-500/20'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-700 mb-1" />
                    <p className="text-xs font-bold text-slate-900">Administrator</p>
                    <p className="text-[10px] text-slate-500">Full admin & system console</p>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Full Name (English)</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Teacher Sophea Lim"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-emerald-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Campus Branch</label>
                  <select
                    value={signUpCampusId}
                    onChange={(e) => setSignUpCampusId(e.target.value as CampusId)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-emerald-600"
                  >
                    {CAMPUS_LIST.filter(c => c.id !== 'ALL').map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.shortName} - {c.nameEnglish}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">School Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@deweychildcare.edu.kh"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-emerald-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Password (min 6 characters)</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Set secure password"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-emerald-600"
                  />
                </div>
              </div>

              {/* Campus & Classroom Assignment if Teacher */}
              {role === 'teacher' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">
                      Primary Registered Campus
                    </label>
                    <select
                      value={signUpCampusId}
                      onChange={(e) => setSignUpCampusId(e.target.value as CampusId)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-800"
                    >
                      {CAMPUS_LIST.filter(c => c.id !== 'ALL').map(c => {
                        const allowed = isSignUpAllowedForCampus(c.id);
                        return (
                          <option key={c.id} value={c.id}>
                            {c.shortName} ({c.brand}) {!allowed ? ' (Hidden)' : ''}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">
                      Assigned Classroom
                    </label>
                    <select
                      value={assignedClassId}
                      onChange={(e) => setAssignedClassId(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-800"
                    >
                      {getCampusClassroomOptions(signUpCampusId).map(opt => (
                        <option key={opt.id} value={opt.id}>
                          {opt.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {!isSignUpAllowedForCampus(signUpCampusId) && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5">
                  <EyeOff className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-rose-950">Sign-Up Disabled for Selected Campus</p>
                    <p className="text-[11px] text-rose-800 mt-0.5">
                      Self-service registration for this campus is currently hidden by administrators.
                    </p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || !isSignUpAllowedForCampus(signUpCampusId)}
                className="w-full py-3 bg-[#007A43] hover:bg-[#006338] text-white text-xs font-extrabold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating Firebase Account...</span>
                  </>
                ) : !isSignUpAllowedForCampus(signUpCampusId) ? (
                  <>
                    <EyeOff className="w-4 h-4" />
                    <span>Sign-Up Hidden for Campus</span>
                  </>
                ) : (
                  <>
                    <span>Register Account in Firebase</span>
                    <CheckCircle2 className="w-4 h-4 text-amber-300" />
                  </>
                )}
              </button>

              <div className="text-center pt-1">
                <p className="text-xs text-slate-500">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthModalMode('signin')}
                    className="text-[#007A43] font-bold hover:underline"
                  >
                    Sign In instead
                  </button>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
