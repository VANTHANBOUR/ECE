import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LessonPlan, UserAccount, UserRole, Classroom, CAMPUS_LIST } from '../types';
import { StaffManagementModal } from './StaffManagementModal';
import { ClassroomModal } from './ClassroomModal';
import { SchoolProfileSettings } from './SchoolProfileSettings';
import { SignUpControlModal } from './SignUpControlModal';
import { 
  ShieldCheck, 
  Users, 
  BookOpen, 
  School, 
  Activity, 
  Search, 
  UserPlus, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Edit3, 
  Lock, 
  FileSpreadsheet, 
  CheckSquare, 
  Square,
  Award,
  GraduationCap,
  Sparkles,
  Eye,
  EyeOff,
  Filter,
  Briefcase,
  Layers,
  Settings,
  Plus,
  Building2,
  Image as ImageIcon
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AdminConsoleProps {
  onSelectPlan: (plan: LessonPlan) => void;
  onOpenNewTeacher: () => void;
}

export const AdminConsole: React.FC<AdminConsoleProps> = ({
  onSelectPlan,
  onOpenNewTeacher,
}) => {
  const { 
    currentUser, 
    allAccounts, 
    lessonPlans, 
    classrooms, 
    updateAccount, 
    deleteAccount, 
    deleteLessonPlan,
    batchApprovePlans,
    updateClassroom,
    auditLogs,
    showToast,
    openSignUpModal,
    schoolProfile,
    formatAgeGroup
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'users' | 'plans' | 'classrooms' | 'logs' | 'profile'>('users');
  const [isSignUpControlOpen, setIsSignUpControlOpen] = useState(false);
  
  // User Management Filters & State
  const [userRoleFilter, setUserRoleFilter] = useState<string>('all');
  const [userSearch, setUserSearch] = useState<string>('');
  const [editingStaffUser, setEditingStaffUser] = useState<UserAccount | null>(null);
  
  // Master Plans Filters & State
  const [planSearch, setPlanSearch] = useState<string>('');
  const [planStatusFilter, setPlanStatusFilter] = useState<string>('all');
  const [selectedPlanIds, setSelectedPlanIds] = useState<string[]>([]);
  
  // Deletion confirmations
  const [planToDelete, setPlanToDelete] = useState<LessonPlan | null>(null);
  const [userToDelete, setUserToDelete] = useState<UserAccount | null>(null);

  // Classroom edit state
  const [editingClass, setEditingClass] = useState<Classroom | null>(null);
  const [isClassroomModalOpen, setIsClassroomModalOpen] = useState(false);

  // Filtered Users
  const filteredUsers = allAccounts.filter((u) => {
    if (userRoleFilter !== 'all' && u.role !== userRoleFilter) return false;
    if (userSearch.trim()) {
      const q = userSearch.toLowerCase();
      return (
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.assignedClassName && u.assignedClassName.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Filtered Plans
  const filteredPlans = lessonPlans.filter((p) => {
    if (planStatusFilter !== 'all' && p.status !== planStatusFilter) return false;
    if (planSearch.trim()) {
      const q = planSearch.toLowerCase();
      return (
        p.themeTitle.toLowerCase().includes(q) ||
        p.teacherName.toLowerCase().includes(q) ||
        p.className.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const toggleSelectPlan = (id: string) => {
    setSelectedPlanIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const selectAllPending = () => {
    const pendingIds = filteredPlans.filter(p => p.status === 'submitted').map(p => p.id);
    if (selectedPlanIds.length === pendingIds.length && pendingIds.length > 0) {
      setSelectedPlanIds([]);
    } else {
      setSelectedPlanIds(pendingIds);
    }
  };

  const handleBatchApprove = () => {
    if (selectedPlanIds.length === 0) return;
    batchApprovePlans(selectedPlanIds);
    setSelectedPlanIds([]);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  const handleBatchDelete = () => {
    if (selectedPlanIds.length === 0) return;
    if (window.confirm(`Are you sure you want to permanently delete ${selectedPlanIds.length} lesson plan(s)?`)) {
      selectedPlanIds.forEach(id => deleteLessonPlan(id));
      setSelectedPlanIds([]);
      showToast(`Purged ${selectedPlanIds.length} lesson plans from database.`, 'info');
    }
  };

  const confirmDeletePlan = () => {
    if (planToDelete) {
      deleteLessonPlan(planToDelete.id);
      setPlanToDelete(null);
    }
  };

  const confirmDeleteUser = () => {
    if (userToDelete) {
      deleteAccount(userToDelete.id);
      setUserToDelete(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Console Top Hero */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-[#005B30] rounded-3xl p-6 sm:p-8 text-white shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full bg-amber-400 text-amber-950 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                Master Admin Console
              </span>
              <span className="text-xs text-emerald-300 font-semibold">
                Centralized Governance & Security
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-['Outfit']">
              School Administrator Control Center
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 max-w-2xl">
              Confidential institutional management. Manage faculty credentials, RBAC permissions, school-wide lesson plan submissions, classroom enrollments, and live system audit trails.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsSignUpControlOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-800/90 hover:bg-emerald-800 text-white font-bold text-xs rounded-2xl shadow-sm border border-emerald-500/40 transition-all active:scale-95"
            >
              {schoolProfile?.globalSignUpDisabled ? (
                <EyeOff className="w-4 h-4 text-rose-300" />
              ) : (
                <Eye className="w-4 h-4 text-emerald-300" />
              )}
              <span>Hide / Display Sign Up</span>
              {schoolProfile?.globalSignUpDisabled ? (
                <span className="px-2 py-0.5 text-[10px] bg-rose-500 text-white rounded-full font-black">
                  Hidden All
                </span>
              ) : (
                <span className="px-2 py-0.5 text-[10px] bg-amber-400 text-slate-950 rounded-full font-black">
                  {Object.values(schoolProfile?.disabledSignUpCampuses || {}).filter(Boolean).length > 0 
                    ? `${Object.values(schoolProfile?.disabledSignUpCampuses || {}).filter(Boolean).length} Hidden` 
                    : 'Active All'}
                </span>
              )}
            </button>

            <button
              onClick={openSignUpModal}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#007A43] hover:bg-[#006338] text-white font-bold text-xs rounded-2xl shadow-sm transition-all active:scale-95"
            >
              <UserPlus className="w-4 h-4 text-amber-300" />
              <span>Create New Staff Account</span>
            </button>
          </div>
        </div>
      </div>

      {/* Admin KPI Ribbon */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Registered Accounts</span>
            <div className="p-2 bg-emerald-50 text-[#007A43] rounded-xl">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">{allAccounts.length}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">
            {allAccounts.filter(a => a.role === 'admin').length} Admins · {allAccounts.filter(a => a.role === 'academic_officer').length} Academic Officers · {allAccounts.filter(a => a.role === 'teacher').length} Teachers
          </p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">All Uploaded Plans</span>
            <div className="p-2 bg-blue-50 text-blue-700 rounded-xl">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-blue-700 mt-2">{lessonPlans.length}</p>
          <p className="text-[10px] text-blue-600 font-medium mt-0.5">
            {lessonPlans.filter(p => p.status === 'approved').length} Approved · {lessonPlans.filter(p => p.status === 'submitted').length} Pending
          </p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Classroom Levels</span>
            <div className="p-2 bg-purple-50 text-purple-700 rounded-xl">
              <School className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-purple-700 mt-2">{classrooms.length}</p>
          <p className="text-[10px] text-purple-600 font-medium mt-0.5">
            {classrooms.reduce((acc, c) => acc + c.enrolledStudents, 0)} Total Enrolled Students
          </p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">System Audit Events</span>
            <div className="p-2 bg-amber-50 text-amber-700 rounded-xl">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-amber-700 mt-2">{auditLogs.length}</p>
          <p className="text-[10px] text-amber-600 font-medium mt-0.5">Recorded Security Logs</p>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('users')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap ${
            activeSubTab === 'users'
              ? 'bg-[#007A43] text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Faculty & Staff Accounts ({allAccounts.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('plans')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap ${
            activeSubTab === 'plans'
              ? 'bg-[#007A43] text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Master Lesson Plan Registry ({lessonPlans.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('classrooms')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap ${
            activeSubTab === 'classrooms'
              ? 'bg-[#007A43] text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <School className="w-4 h-4" />
          <span>Classroom Capacities</span>
        </button>

        <button
          onClick={() => setActiveSubTab('logs')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap ${
            activeSubTab === 'logs'
              ? 'bg-[#007A43] text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>System Audit Trails ({auditLogs.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('profile')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap ${
            activeSubTab === 'profile'
              ? 'bg-[#007A43] text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>School Profile & Logo</span>
          {schoolProfile?.customLogoUrl && (
            <span className="w-2 h-2 rounded-full bg-amber-400" />
          )}
        </button>
      </div>

      {/* 0. SCHOOL PROFILE & LOGO MANAGEMENT */}
      {activeSubTab === 'profile' && (
        <SchoolProfileSettings />
      )}

      {/* 1. USERS & STAFF DIRECTORY */}
      {activeSubTab === 'users' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden space-y-4">
          <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search staff by name, email, or classroom..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-emerald-600"
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Role:</label>
              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
              >
                <option value="all">All Roles ({allAccounts.length})</option>
                <option value="admin">Administrators</option>
                <option value="academic_officer">Academic Officers</option>
                <option value="teacher">Lead Teachers</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Staff Member</th>
                  <th className="py-3 px-4">Campus Location</th>
                  <th className="py-3 px-4">Assigned Position</th>
                  <th className="py-3 px-4">Institutional Role (RBAC)</th>
                  <th className="py-3 px-4">Classroom Allocation</th>
                  <th className="py-3 px-4">Account Status</th>
                  <th className="py-3 px-4 text-right">Administrative Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-10 h-10 rounded-xl object-cover ring-2 ring-emerald-500/20"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="font-extrabold text-slate-900 text-xs">{user.name}</p>
                            {user.id === currentUser.id && (
                              <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-amber-100 text-amber-900">
                                You
                              </span>
                            )}
                          </div>
                          {user.khmerName && (
                            <p className="text-[11px] text-slate-500 font-['Battambang']">{user.khmerName}</p>
                          )}
                          <p className="text-[10px] text-slate-400">{user.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Campus Location */}
                    <td className="py-3.5 px-4">
                      {user.campusId ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200">
                          <Building2 className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span className="truncate max-w-[120px]">{CAMPUS_LIST.find(c => c.id === user.campusId)?.shortName || 'DCH SYW'}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-[11px] font-bold border border-slate-200">
                          <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>DK SYW</span>
                        </span>
                      )}
                    </td>

                    {/* Assigned Position */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 text-[11px] font-bold">
                          <Briefcase className="w-3 h-3 text-slate-500 shrink-0" />
                          <span className="truncate max-w-[160px]">{user.title}</span>
                        </span>
                        <button
                          onClick={() => setEditingStaffUser(user)}
                          className="p-1 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-md transition-colors"
                          title="Change Position"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                      </div>
                      {user.roomNumber && (
                        <p className="text-[10px] text-slate-400 mt-0.5">{user.roomNumber}</p>
                      )}
                    </td>

                    {/* Institutional Role (RBAC) */}
                    <td className="py-3.5 px-4">
                      <select
                        value={user.role}
                        onChange={(e) => updateAccount(user.id, { role: e.target.value as UserRole })}
                        className={`px-2.5 py-1 rounded-xl text-xs font-black border transition-colors cursor-pointer ${
                          user.role === 'admin'
                            ? 'bg-amber-50 text-amber-950 border-amber-300'
                            : user.role === 'academic_officer'
                            ? 'bg-blue-50 text-blue-950 border-blue-300'
                            : 'bg-emerald-50 text-emerald-950 border-emerald-300'
                        }`}
                      >
                        <option value="teacher">👩‍🏫 Lead Teacher</option>
                        <option value="academic_officer">🎓 Academic Officer</option>
                        <option value="admin">👑 Administrator</option>
                      </select>
                    </td>

                    {/* Assigned Classroom */}
                    <td className="py-3.5 px-4">
                      {user.role === 'teacher' ? (
                        <select
                          value={user.assignedClassId || ''}
                          onChange={(e) => {
                            updateAccount(user.id, {
                              assignedClassId: e.target.value,
                              assignedClassName: e.target.value,
                              ageGroup: e.target.value,
                            });
                          }}
                          className="px-2.5 py-1 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-emerald-600"
                        >
                          <option value="Toddlers">{formatAgeGroup('Toddlers', user.campusId)}</option>
                          <option value="Nursery">Nursery</option>
                          <option value="Pre-School">Pre-School</option>
                          <option value="Kindergarten">Kindergarten</option>
                        </select>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 text-[11px] font-semibold">
                          <Layers className="w-3 h-3 text-slate-400" />
                          <span>All Classrooms (Supervisory)</span>
                        </span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => updateAccount(user.id, { status: user.status === 'suspended' ? 'active' : 'suspended' })}
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase transition-colors ${
                          user.status === 'suspended'
                            ? 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                            : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                        }`}
                      >
                        {user.status === 'suspended' ? '🔴 Suspended' : '🟢 Active'}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setEditingStaffUser(user)}
                          className="px-2.5 py-1 text-slate-700 hover:text-emerald-800 bg-slate-100 hover:bg-emerald-50 border border-slate-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
                          title="Assign Position & Role"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Manage</span>
                        </button>

                        <button
                          onClick={() => setUserToDelete(user)}
                          disabled={user.id === currentUser.id}
                          className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 border ${
                            user.id === currentUser.id
                              ? 'text-slate-300 border-slate-100 cursor-not-allowed bg-slate-50'
                              : 'text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 border-rose-200'
                          }`}
                          title={user.id === currentUser.id ? 'Cannot remove current active admin' : 'Remove Staff Member'}
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. MASTER LESSON PLAN REGISTRY & PURGE */}
      {activeSubTab === 'plans' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden space-y-4">
          <div className="p-4 sm:p-6 border-b border-slate-100 space-y-3">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={planSearch}
                  onChange={(e) => setPlanSearch(e.target.value)}
                  placeholder="Search plan by theme, teacher, or class..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-emerald-600"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={selectAllPending}
                  className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
                >
                  <CheckSquare className="w-3.5 h-3.5" />
                  <span>Select Pending ({filteredPlans.filter(p => p.status === 'submitted').length})</span>
                </button>

                {selectedPlanIds.length > 0 && (
                  <>
                    <button
                      onClick={handleBatchApprove}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-[#007A43] hover:bg-[#006338] text-white text-xs font-bold rounded-xl shadow-xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-300" />
                      <span>Approve ({selectedPlanIds.length})</span>
                    </button>
                    <button
                      onClick={handleBatchDelete}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete ({selectedPlanIds.length})</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase">Review Status:</label>
              <select
                value={planStatusFilter}
                onChange={(e) => setPlanStatusFilter(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
              >
                <option value="all">All Submissions ({lessonPlans.length})</option>
                <option value="submitted">Pending Review</option>
                <option value="approved">Approved</option>
                <option value="revision_requested">Revision Requested</option>
                <option value="draft">Drafts</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-3 w-10"></th>
                  <th className="py-3 px-3">Curriculum Theme & Objectives</th>
                  <th className="py-3 px-3">Educator & Classroom</th>
                  <th className="py-3 px-3">Week / Term</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Master Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPlans.map((plan) => {
                  const isSelected = selectedPlanIds.includes(plan.id);
                  return (
                    <tr key={plan.id} className={`hover:bg-slate-50/70 ${isSelected ? 'bg-emerald-50/30' : ''}`}>
                      <td className="py-3.5 px-3">
                        <button
                          onClick={() => toggleSelectPlan(plan.id)}
                          className="text-slate-400 hover:text-emerald-700"
                        >
                          {isSelected ? <CheckSquare className="w-4 h-4 text-emerald-700" /> : <Square className="w-4 h-4 text-slate-300" />}
                        </button>
                      </td>

                      <td className="py-3.5 px-3 max-w-xs">
                        <p 
                          onClick={() => onSelectPlan(plan)}
                          className="font-extrabold text-slate-900 hover:text-[#007A43] cursor-pointer text-xs leading-snug"
                        >
                          {plan.themeTitle}
                        </p>
                        <p className="text-[10px] text-slate-500 truncate mt-0.5">
                          {plan.learningObjectives[0] || 'No objective specified'}
                        </p>
                      </td>

                      <td className="py-3.5 px-3">
                        <p className="font-bold text-slate-900">{plan.teacherName}</p>
                        <p className="text-[11px] text-emerald-800 font-semibold">{plan.className}</p>
                      </td>

                      <td className="py-3.5 px-3 text-slate-600">
                        <p className="font-bold">Week {plan.weekNumber}</p>
                        <p className="text-[10px] text-slate-400">{plan.startDate}</p>
                      </td>

                      <td className="py-3.5 px-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                          plan.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : plan.status === 'revision_requested'
                            ? 'bg-amber-100 text-amber-900'
                            : plan.status === 'submitted'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {plan.status.toUpperCase()}
                        </span>
                      </td>

                      <td className="py-3.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onSelectPlan(plan)}
                            className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-lg border border-emerald-200 transition-colors"
                          >
                            Review / Dossier
                          </button>
                          <button
                            onClick={() => setPlanToDelete(plan)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete Lesson Plan"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. CLASSROOM CAPACITIES */}
      {activeSubTab === 'classrooms' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Kindergarten Levels & Classroom Allocation
              </h2>
              <p className="text-xs text-slate-500">
                Configure student capacities, current weekly theme, and assigned faculty.
              </p>
            </div>

            <button
              onClick={() => {
                setEditingClass(null);
                setIsClassroomModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#007A43] hover:bg-[#006338] text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-95 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4 text-amber-300" />
              <span>Add Classroom</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {classrooms.map((cls) => (
              <div key={cls.id} className="p-4 rounded-2xl border border-slate-200/90 shadow-2xs bg-slate-50/50 space-y-3 relative group">
                <div className="flex items-center justify-between">
                  <span 
                    className="text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded text-white shadow-2xs"
                    style={{ backgroundColor: cls.colorTheme || '#007A43' }}
                  >
                    {cls.code}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500">{cls.room}</span>
                    <button
                      onClick={() => {
                        setEditingClass(cls);
                        setIsClassroomModalOpen(true);
                      }}
                      className="p-1 text-slate-400 hover:text-emerald-800 hover:bg-emerald-50 bg-white border border-slate-200 rounded-md transition-colors shadow-2xs"
                      title="Edit Classroom Details"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-slate-900">{cls.name}</h3>
                  {cls.khmerName && (
                    <p className="text-xs font-bold text-emerald-800 font-['Battambang'] mt-0.5">{cls.khmerName}</p>
                  )}
                  <p className="text-xs text-slate-500 font-medium mt-0.5">{cls.ageGroup}</p>
                </div>

                <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Lead Teacher:</span>
                    <span className="font-bold text-slate-900">{cls.leadTeacherName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Assistant Teacher:</span>
                    <span className="font-bold text-slate-800">{cls.assistantTeacherName}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-100">
                    <span className="text-slate-500 font-medium">Enrollment:</span>
                    <span className="font-extrabold text-[#007A43]">
                      {cls.enrolledStudents} / {cls.capacity} Students ({Math.round((cls.enrolledStudents / cls.capacity) * 100)}%)
                    </span>
                  </div>
                </div>

                <div className="pt-1 flex items-center justify-between">
                  <div className="min-w-0 flex-1 mr-2">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Current Theme:</span>
                    <p className="text-xs text-slate-700 italic truncate">"{cls.currentTheme}"</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingClass(cls);
                      setIsClassroomModalOpen(true);
                    }}
                    className="px-2.5 py-1 text-slate-700 hover:text-emerald-800 bg-slate-100 hover:bg-emerald-50 border border-slate-200 rounded-lg text-xs font-bold transition-colors shrink-0"
                  >
                    Manage
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. SYSTEM AUDIT TRAILS */}
      {activeSubTab === 'logs' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden space-y-4">
          <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Institutional Activity & Compliance Logs
              </h2>
              <p className="text-xs text-slate-500">
                Tamper-evident chronological record of submissions, approvals, deletions, and logins.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Live Feed
            </span>
          </div>

          <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-4 sm:p-5 hover:bg-slate-50/70 transition-colors flex items-start gap-3.5">
                <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                  log.action === 'APPROVE_PLAN'
                    ? 'bg-emerald-100 text-emerald-800'
                    : log.action === 'DELETE_PLAN' || log.action === 'DELETE_USER'
                    ? 'bg-rose-100 text-rose-800'
                    : log.action === 'REVISE_PLAN'
                    ? 'bg-amber-100 text-amber-800'
                    : log.action === 'USER_LOGIN' || log.action === 'USER_SIGNUP'
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {log.action === 'APPROVE_PLAN' && <CheckCircle2 className="w-4 h-4" />}
                  {(log.action === 'DELETE_PLAN' || log.action === 'DELETE_USER') && <Trash2 className="w-4 h-4" />}
                  {log.action === 'REVISE_PLAN' && <AlertTriangle className="w-4 h-4" />}
                  {(log.action === 'USER_LOGIN' || log.action === 'USER_SIGNUP') && <Users className="w-4 h-4" />}
                  {(log.action === 'CREATE_PLAN' || log.action === 'SUBMIT_PLAN' || log.action === 'UPDATE_PLAN' || log.action === 'ROLE_CHANGE') && <BookOpen className="w-4 h-4" />}
                </div>

                <div className="flex-1 min-w-0 space-y-0.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-extrabold text-slate-900">{log.actorName}</span>
                    <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded ${
                      log.actorRole === 'admin'
                        ? 'bg-amber-100 text-amber-900'
                        : log.actorRole === 'academic_officer'
                        ? 'bg-blue-100 text-blue-900'
                        : 'bg-emerald-100 text-emerald-900'
                    }`}>
                      {log.actorRole}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="text-[10px] text-slate-400 font-medium">{log.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-700 font-medium leading-relaxed">{log.details}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Confirmation Dialog for Plan Deletion */}
      {planToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-rose-100 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-2.5 bg-rose-100 rounded-xl">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Confirm Lesson Plan Deletion</h3>
                <p className="text-xs text-slate-500">Administrative Action</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to permanently delete the lesson plan <strong className="text-slate-900">"{planToDelete.themeTitle}"</strong> submitted by <strong className="text-slate-900">{planToDelete.teacherName}</strong>? This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setPlanToDelete(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeletePlan}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Delete Plan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog for User Deletion */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-rose-100 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-2.5 bg-rose-100 rounded-xl">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Confirm Staff Removal</h3>
                <p className="text-xs text-rose-600 font-semibold">Irreversible Administrative Action</p>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3">
              <img
                src={userToDelete.avatar}
                alt={userToDelete.name}
                className="w-11 h-11 rounded-xl object-cover ring-2 ring-rose-500/20"
              />
              <div className="min-w-0">
                <p className="font-extrabold text-xs text-slate-900 truncate">{userToDelete.name}</p>
                <p className="text-[11px] text-slate-600 truncate">{userToDelete.title}</p>
                <p className="text-[10px] text-slate-400 truncate">{userToDelete.email}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to remove <strong className="text-slate-900">{userToDelete.name}</strong> from Dewey Kindergarten? Their credentials and access to the portal will be terminated immediately.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteUser}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove Staff</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Staff Management Modal for Role & Position Assignment */}
      {editingStaffUser && (
        <StaffManagementModal
          user={editingStaffUser}
          onClose={() => setEditingStaffUser(null)}
        />
      )}

      {/* Classroom Add & Edit Modal */}
      {isClassroomModalOpen && (
        <ClassroomModal
          classroomToEdit={editingClass}
          onClose={() => {
            setIsClassroomModalOpen(false);
            setEditingClass(null);
          }}
        />
      )}

      {/* Sign-Up Access Controls Modal */}
      <SignUpControlModal
        isOpen={isSignUpControlOpen}
        onClose={() => setIsSignUpControlOpen(false)}
      />
    </div>
  );
};
