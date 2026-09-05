import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { BrandLogo, DCHShield, DIShield, DKShield } from './BrandLogo';
import { UserRole, CampusId, CAMPUS_LIST, getCampusClassroomOptions } from '../types';
import { CampusTabsBar } from './CampusTabsBar';
import { 
  Mail, 
  Lock, 
  User, 
  ShieldCheck, 
  GraduationCap, 
  Award, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  School,
  Loader2,
  Globe,
  Database,
  Building2,
  BookOpen,
  Calendar,
  Layers,
  KeyRound,
  MapPin,
  EyeOff
} from 'lucide-react';

export const AuthGate: React.FC = () => {
  const { 
    signIn, 
    signUp, 
    signInWithGoogle, 
    allAccounts, 
    classrooms, 
    showToast,
    firebaseConfigInfo,
    isFirebaseConnected,
    selectedCampusId,
    setSelectedCampusId,
    isSignUpAllowedForCampus
  } = useApp();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [isLoading, setIsLoading] = useState(false);

  // Sign In Form State
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('password123');

  // Sign Up Form State
  const [name, setName] = useState('');
  const [khmerName, setKhmerName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('teacher');
  const [title, setTitle] = useState('');
  const [assignedClassId, setAssignedClassId] = useState('Pre-Nursery AM');
  const [roomNumber, setRoomNumber] = useState('');

  const activeCampus = CAMPUS_LIST.find(c => c.id === selectedCampusId) || CAMPUS_LIST[0];

  useEffect(() => {
    const options = getCampusClassroomOptions(selectedCampusId);
    if (!options.some(o => o.id === assignedClassId)) {
      setAssignedClassId(options[0].id);
    }
  }, [selectedCampusId]);

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInEmail.trim()) {
      showToast('Please enter your school email address.', 'warning');
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
      showToast('Please enter your full name and institutional email.', 'warning');
      return;
    }

    const selectedClass = classrooms.find(c => c.id === assignedClassId);
    setIsLoading(true);

    try {
      await signUp({
        name: name.trim(),
        khmerName: khmerName.trim(),
        email: email.trim(),
        password: password || 'password123',
        role,
        campusId: selectedCampusId !== 'ALL' ? selectedCampusId : 'DCH_SYW',
        title: title.trim() || (role === 'admin' ? 'School Administrator' : role === 'academic_officer' ? 'Academic Review Officer' : 'Early Childhood Lead Educator'),
        assignedClassId: role === 'teacher' ? assignedClassId : undefined,
        assignedClassName: role === 'teacher' ? assignedClassId : undefined,
        ageGroup: role === 'teacher' ? assignedClassId : undefined,
        roomNumber: role === 'teacher' ? roomNumber.trim() : undefined,
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

  const handleQuickDemoLogin = async (acc: typeof allAccounts[0]) => {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-950 text-slate-100 flex flex-col justify-between font-['Plus_Jakarta_Sans',sans-serif] selection:bg-[#007A43] selection:text-white">
      {/* Top Brand Banner */}
      <header className="border-b border-white/10 bg-black/40 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <DIShield size={44} />
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-bold text-emerald-400 font-['Battambang',sans-serif] tracking-tight leading-tight">
                ការិយាល័យកណ្តាលអប់រំកុមារតូច ឌូវី
              </span>
              <span className="text-xs sm:text-sm font-black text-white tracking-wide uppercase font-['Outfit',sans-serif] leading-tight">
                DEWEY EARLY CHILDHOOD EDUCATION CENTRAL OFFICE
              </span>
            </div>
          </div>

          {/* Firebase Connection Status */}
          <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-white/10 border border-white/15 text-xs">
            <div className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </div>
            <span className="text-emerald-300 font-bold">Central Auth & Firestore Online</span>
          </div>
        </div>
      </header>

      {/* Main Authentication Card */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 sm:py-10 flex flex-col items-center justify-center space-y-6">
        
        {/* Campus Selection Tabs Header */}
        <div className="w-full bg-white/5 backdrop-blur-md rounded-3xl p-4 sm:p-5 border border-white/10 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-white">
              <Building2 className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm font-black uppercase tracking-wider font-['Outfit']">
                SELECT TARGET CAMPUS PORTAL TAB BEFORE LOGIN:
              </h3>
            </div>
            <span className="text-xs text-emerald-300/80 font-medium">
              Select your authorized campus portal before signing in
            </span>
          </div>

          <CampusTabsBar 
            selectedCampusId={selectedCampusId}
            onSelectCampus={setSelectedCampusId}
            variant="cards"
          />
        </div>

        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: School Presentation & Features */}
          <div className="lg:col-span-5 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-400/10 border border-emerald-400/20 text-emerald-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Institutional Access Verification</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-['Outfit'] leading-tight">
                {activeCampus.id === 'ALL' 
                  ? 'Dewey Early Childhood Portal' 
                  : `${activeCampus.shortName} Portal Gate`}
              </h1>
              <p className="text-sm text-slate-300 leading-relaxed">
                {activeCampus.id === 'ALL'
                  ? 'Sign in to access curriculum management, trilingual lesson planning, and academic quality moderation across all Dewey Early Childhood campuses.'
                  : `Sign in to access ${activeCampus.nameEnglish} (${activeCampus.nameKhmer}) in ${activeCampus.location}.`}
              </p>
            </div>

            {/* Core Capabilities */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 text-left">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-300">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Trilingual Lesson Matrix</h4>
                  <p className="text-[11px] text-slate-300">English, Khmer (ភាសាខ្មែរ), and Chinese (中文) trilingual kindergarten syllabus integration.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 text-left">
                <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center shrink-0 text-blue-300">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Academic Review & Compliance</h4>
                  <p className="text-[11px] text-slate-300">Role-based submission workflows for Lead Teachers, Academic Officers, and School Principals.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 text-left">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-300">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Cloud Firebase Persistence</h4>
                  <p className="text-[11px] text-slate-300">Live synchronization with Google Firebase Firestore, Auth, and audit trails.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Respective Campus Portal Gate Sign In / Sign Up Form Box */}
          <div className="lg:col-span-7 w-full">
            <div className="bg-white text-slate-900 rounded-3xl shadow-2xl border border-emerald-100/50 overflow-hidden">
              
              {/* Respective Campus Portal Banner Header */}
              <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-[#006838] p-5 sm:p-6 text-white space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {activeCampus.id === 'ALL' ? (
                      <div className="shrink-0 flex items-center justify-center rounded-xl bg-white shadow-xs border border-emerald-200/80 p-1">
                        <DIShield size={34} />
                      </div>
                    ) : activeCampus.brand === 'DK' ? (
                      <DKShield size={40} />
                    ) : (
                      <div className="shrink-0 flex items-center justify-center rounded-xl bg-white shadow-xs border border-emerald-200/80 p-0.5">
                        <DCHShield size={38} />
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-base text-white font-['Outfit']">
                          {activeCampus.shortName} Portal Gate
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-400 text-slate-950">
                          {activeCampus.brand}
                        </span>
                      </div>
                      <p className="text-xs text-emerald-200 font-['Battambang'] truncate max-w-xs">
                        {activeCampus.nameKhmer}
                      </p>
                    </div>
                  </div>
                  <div className="text-right hidden sm:block">
                    <span className="text-[10px] font-semibold text-emerald-300 block">
                      Academic Year 2025–2026
                    </span>
                    <span className="text-[11px] font-bold text-slate-300 flex items-center justify-end gap-1">
                      <MapPin className="w-3 h-3 text-amber-400" />
                      {activeCampus.location}
                    </span>
                  </div>
                </div>

                {/* Tab switcher: Sign In vs Sign Up */}
                <div className="flex items-center gap-1.5 bg-black/30 p-1 rounded-2xl border border-white/10">
                  <button
                    type="button"
                    onClick={() => setMode('signin')}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                      mode === 'signin'
                        ? 'bg-white text-[#006838] shadow-md'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    Sign In to {activeCampus.shortName}
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('signup')}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                      mode === 'signup'
                        ? 'bg-white text-[#006838] shadow-md'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    Register / Sign Up
                  </button>
                </div>
              </div>

              {/* Form Content */}
              <div className="p-5 sm:p-6 space-y-5">
                
                {/* Google Sign In Action */}
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={handleGoogleAuth}
                    disabled={isLoading}
                    className="w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold flex items-center justify-center gap-2.5 shadow-2xs transition-all active:scale-98 disabled:opacity-50"
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

                  <div className="relative flex items-center justify-center my-2">
                    <div className="border-t border-slate-200 w-full" />
                    <span className="bg-white px-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold absolute">
                      Or with Institutional Email
                    </span>
                  </div>
                </div>

                {/* 1-Click Instant Demo Login Shortcuts */}
                <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>Instant Demo Credentials ({activeCampus.shortName}):</span>
                    </span>
                    <span className="text-[10px] text-emerald-700 font-semibold">Select to test</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {/* Admin Profile */}
                    {allAccounts.filter(a => a.role === 'admin').slice(0, 1).map(acc => (
                      <button
                        key={acc.id}
                        type="button"
                        onClick={() => handleQuickDemoLogin(acc)}
                        disabled={isLoading}
                        className="flex items-center gap-2 p-2 rounded-xl bg-white border border-amber-300 hover:border-amber-500 hover:bg-amber-50/60 transition-all text-left shadow-2xs group"
                      >
                        <img src={acc.avatar} alt={acc.name} className="w-8 h-8 rounded-lg object-cover ring-1 ring-amber-400" />
                        <div className="min-w-0">
                          <p className="text-[11px] font-bold text-slate-900 truncate">{acc.name}</p>
                          <span className="text-[8px] font-extrabold uppercase px-1.5 py-0.2 bg-amber-100 text-amber-900 rounded inline-block">
                            👑 Admin / Principal
                          </span>
                        </div>
                      </button>
                    ))}

                    {/* Academic Officer Profile */}
                    {allAccounts.filter(a => a.role === 'academic_officer').slice(0, 1).map(acc => (
                      <button
                        key={acc.id}
                        type="button"
                        onClick={() => handleQuickDemoLogin(acc)}
                        disabled={isLoading}
                        className="flex items-center gap-2 p-2 rounded-xl bg-white border border-blue-300 hover:border-blue-500 hover:bg-blue-50/60 transition-all text-left shadow-2xs group"
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

                    {/* Lead Teacher Profile */}
                    {allAccounts.filter(a => a.role === 'teacher').slice(0, 1).map(acc => (
                      <button
                        key={acc.id}
                        type="button"
                        onClick={() => handleQuickDemoLogin(acc)}
                        disabled={isLoading}
                        className="flex items-center gap-2 p-2 rounded-xl bg-white border border-emerald-300 hover:border-emerald-500 hover:bg-emerald-50/60 transition-all text-left shadow-2xs group"
                      >
                        <img src={acc.avatar} alt={acc.name} className="w-8 h-8 rounded-lg object-cover ring-1 ring-emerald-400" />
                        <div className="min-w-0">
                          <p className="text-[11px] font-bold text-slate-900 truncate">{acc.name}</p>
                          <span className="text-[8px] font-extrabold uppercase px-1.5 py-0.2 bg-emerald-100 text-emerald-900 rounded inline-block">
                            👩‍🏫 Lead Teacher
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* SIGN IN FORM */}
                {mode === 'signin' ? (
                  <form onSubmit={handleSignInSubmit} className="space-y-3.5">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">
                        Institutional Email ({activeCampus.shortName})
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          value={signInEmail}
                          onChange={(e) => setSignInEmail(e.target.value)}
                          placeholder="e.g. vanthanbour@diu.edu.kh or teacher@deweychildcare.edu.kh"
                          className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-emerald-600"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-700">
                          Password
                        </label>
                        <span className="text-[11px] text-emerald-700 font-semibold">
                          Demo Password: password123
                        </span>
                      </div>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="password"
                          required
                          value={signInPassword}
                          onChange={(e) => setSignInPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-emerald-600"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 bg-[#007A43] hover:bg-[#006338] text-white text-xs font-extrabold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Connecting to {activeCampus.shortName} Portal...</span>
                        </>
                      ) : (
                        <>
                          <span>Sign In to {activeCampus.shortName} Portal</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  /* SIGN UP FORM */
                  <form onSubmit={handleSignUpSubmit} className="space-y-3.5">
                    
                    {/* Active Target Campus Badge */}
                    <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-950 font-bold">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-emerald-700" />
                        <span>Target Campus Portal (Selected Before Login):</span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-md bg-emerald-700 text-white font-extrabold">
                        {activeCampus.shortName}
                      </span>
                    </div>

                    {/* Role Selection */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">
                        Institutional Role
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => setRole('teacher')}
                          className={`p-2 rounded-xl border text-left transition-all ${
                            role === 'teacher'
                              ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20'
                              : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <GraduationCap className="w-4 h-4 text-emerald-700 mb-0.5" />
                          <p className="text-xs font-bold text-slate-900">Lead Teacher</p>
                          <p className="text-[10px] text-slate-500">Plan & activity matrix</p>
                        </button>

                        <button
                          type="button"
                          onClick={() => setRole('academic_officer')}
                          className={`p-2 rounded-xl border text-left transition-all ${
                            role === 'academic_officer'
                              ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500/20'
                              : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <Award className="w-4 h-4 text-blue-700 mb-0.5" />
                          <p className="text-xs font-bold text-slate-900">Academic Officer</p>
                          <p className="text-[10px] text-slate-500">Review & approvals</p>
                        </button>

                        <button
                          type="button"
                          onClick={() => setRole('admin')}
                          className={`p-2 rounded-xl border text-left transition-all ${
                            role === 'admin'
                              ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-500/20'
                              : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <ShieldCheck className="w-4 h-4 text-amber-700 mb-0.5" />
                          <p className="text-xs font-bold text-slate-900">Administrator</p>
                          <p className="text-[10px] text-slate-500">Full school control</p>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
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
                          value={selectedCampusId}
                          onChange={(e) => setSelectedCampusId(e.target.value as CampusId)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-emerald-600"
                        >
                          {CAMPUS_LIST.filter(c => c.id !== 'ALL').map((c) => {
                            const allowed = isSignUpAllowedForCampus(c.id);
                            return (
                              <option key={c.id} value={c.id}>
                                {c.shortName} - {c.nameEnglish} {!allowed ? ' (Sign-Up Hidden)' : ''}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>

                    {!isSignUpAllowedForCampus(selectedCampusId) ? (
                      <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3">
                        <EyeOff className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-extrabold text-rose-950">Sign-Up Restricted for {activeCampus.shortName}</p>
                          <p className="text-[11px] text-rose-800 mt-0.5">
                            Public self-service registration for <span className="font-bold">{activeCampus.shortName}</span> is currently hidden by the school administrator. Please select another campus or contact your administrator to receive an account.
                          </p>
                        </div>
                      </div>
                    ) : null}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 block">Institutional Email</label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@diu.edu.kh"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-emerald-600"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 block">Password (min 6 chars)</label>
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

                    {/* Classroom Allocation for Teachers */}
                    {role === 'teacher' && (
                      <div className="space-y-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700 block">
                            Assigned Classroom
                          </label>
                          <select
                            value={assignedClassId}
                            onChange={(e) => setAssignedClassId(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-800"
                          >
                            {getCampusClassroomOptions(selectedCampusId).map(opt => (
                              <option key={opt.id} value={opt.id}>
                                {opt.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700 block">
                            Room Number (Optional)
                          </label>
                          <input
                            type="text"
                            value={roomNumber}
                            onChange={(e) => setRoomNumber(e.target.value)}
                            placeholder="e.g. Room A12"
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-emerald-600"
                          />
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isLoading || !isSignUpAllowedForCampus(selectedCampusId)}
                      className="w-full py-3 bg-[#007A43] hover:bg-[#006338] text-white text-xs font-extrabold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Registering Account for {activeCampus.shortName}...</span>
                        </>
                      ) : !isSignUpAllowedForCampus(selectedCampusId) ? (
                        <>
                          <EyeOff className="w-4 h-4 text-white" />
                          <span>Sign-Up Hidden for {activeCampus.shortName}</span>
                        </>
                      ) : (
                        <>
                          <span>Register & Access {activeCampus.shortName} Portal</span>
                          <CheckCircle2 className="w-4 h-4 text-amber-300" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/30 backdrop-blur-sm py-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs">
            © 2026 Dewey International (DI) Education. Trilingual Early Childhood Education. All rights reserved.
          </p>
          <div className="flex items-center gap-3 text-xs">
            <span className="text-emerald-300 font-bold">English · ភាសាខ្មែរ · 中文</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
