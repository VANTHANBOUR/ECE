import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LessonPlan, UserAccount, UserRole, Classroom, SchoolLevel } from '../types';
import { StaffManagementModal } from './StaffManagementModal';
import { ClassroomModal } from './ClassroomModal';
import { ClassroomsAndLevelsTab } from './ClassroomsAndLevelsTab';
import { 
  ShieldCheck, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Filter, 
  Search, 
  CheckSquare, 
  Square, 
  Eye, 
  Download, 
  Users, 
  Sparkles, 
  TrendingUp, 
  FileText,
  FileSpreadsheet,
  Layers,
  Award,
  Edit3,
  Trash2,
  Briefcase,
  UserPlus,
  School,
  Plus,
  Building2,
  Table
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AdminDashboardProps {
  onSelectPlan: (plan: LessonPlan) => void;
  onOpenNewTeacher: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onSelectPlan,
  onOpenNewTeacher,
}) => {
  const { 
    currentUser, 
    lessonPlans, 
    allAccounts, 
    classrooms, 
    addClassroom,
    updateClassroom,
    deleteClassroom,
    batchApprovePlans, 
    getWeeklyCompliance, 
    showToast,
    updateAccount,
    deleteAccount,
    openSignUpModal,
    openProfileModal,
    levels,
    addLevel,
    updateLevel,
    deleteLevel,
    selectedCampusId
  } = useApp();

  // Filters
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('all');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedWeek, setSelectedWeek] = useState<number>(12);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Batch selection
  const [selectedPlanIds, setSelectedPlanIds] = useState<string[]>([]);
  const [activeAdminSubTab, setActiveAdminSubTab] = useState<'submissions' | 'compliance_matrix' | 'staff' | 'classrooms_levels'>('submissions');
  const [editingStaffUser, setEditingStaffUser] = useState<UserAccount | null>(null);
  const [userToDelete, setUserToDelete] = useState<UserAccount | null>(null);
  const [staffRoleFilter, setStaffRoleFilter] = useState<string>('all');
  const [staffSearchQuery, setStaffSearchQuery] = useState<string>('');
  const [isClassroomModalOpen, setIsClassroomModalOpen] = useState(false);
  const [selectedClassroomToEdit, setSelectedClassroomToEdit] = useState<Classroom | null>(null);

  const teachers = allAccounts.filter(a => {
    if (a.role !== 'teacher') return false;
    if (!selectedCampusId || selectedCampusId === 'ALL') return true;
    return a.campusId === selectedCampusId;
  });

  const campusClassrooms = classrooms.filter(c => {
    if (!selectedCampusId || selectedCampusId === 'ALL') return true;
    return c.campusId === selectedCampusId;
  });

  const weeklyCompliance = getWeeklyCompliance(selectedWeek);

  // Filtered master submissions list
  const filteredPlans = lessonPlans.filter((plan) => {
    if (selectedCampusId && selectedCampusId !== 'ALL') {
      const cls = classrooms.find(c => c.id === plan.classId);
      if (plan.campusId && plan.campusId !== selectedCampusId) return false;
      if (!plan.campusId && cls && cls.campusId !== selectedCampusId) return false;
    }
    if (selectedTeacherId !== 'all' && plan.teacherId !== selectedTeacherId) return false;
    if (selectedAgeGroup !== 'all' && plan.ageGroup !== selectedAgeGroup) return false;
    if (selectedStatus !== 'all' && plan.status !== selectedStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTheme = plan.themeTitle.toLowerCase().includes(q);
      const matchTeacher = plan.teacherName.toLowerCase().includes(q);
      const matchClass = plan.className.toLowerCase().includes(q);
      if (!matchTheme && !matchTeacher && !matchClass) return false;
    }
    return true;
  });

  // KPIs based on campus filtering
  const campusPlans = lessonPlans.filter(plan => {
    if (!selectedCampusId || selectedCampusId === 'ALL') return true;
    const cls = classrooms.find(c => c.id === plan.classId);
    return plan.campusId === selectedCampusId || (cls && cls.campusId === selectedCampusId);
  });
  const totalSubmissions = campusPlans.length;
  const pendingReview = campusPlans.filter(p => p.status === 'submitted' || p.status === 'under_review').length;
  const approvedCount = campusPlans.filter(p => p.status === 'approved').length;
  const revisionsCount = campusPlans.filter(p => p.status === 'revision_requested').length;
  const complianceRate = Math.round((approvedCount / (totalSubmissions || 1)) * 100);

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
    if (selectedPlanIds.length === 0) {
      showToast('Select at least one submitted lesson plan to approve.', 'warning');
      return;
    }
    batchApprovePlans(selectedPlanIds);
    setSelectedPlanIds([]);
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#007A43', '#F59E0B', '#10B981'],
    });
  };

  const exportSummaryReport = () => {
    showToast('Exporting Dewey Childcare House Weekly Curriculum Binder...', 'info');
    setTimeout(() => {
      showToast('DCH_Weekly_Curriculum_Binder_Week12.pdf generated and ready!', 'success');
    }, 1000);
  };

  const getStatusBadge = (status: LessonPlan['status']) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-full text-[11px] font-extrabold">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Approved
          </span>
        );
      case 'revision_requested':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 rounded-full text-[11px] font-extrabold">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            Needs Revision
          </span>
        );
      case 'submitted':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-blue-100 text-blue-800 border border-blue-200 rounded-full text-[11px] font-bold">
            <Clock className="w-3 h-3 text-blue-600" />
            Pending Review
          </span>
        );
      case 'under_review':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-purple-100 text-purple-800 border border-purple-200 rounded-full text-[11px] font-bold">
            <Clock className="w-3 h-3 text-purple-600" />
            Under Review
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-slate-100 text-slate-600 border border-slate-200 rounded-full text-[11px] font-bold">
            Draft
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Admin Executive Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-[#005B30] rounded-3xl p-6 sm:p-8 text-white shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full bg-amber-400 text-amber-950">
                Principal & Academic Supervision
              </span>
              <span className="text-xs text-emerald-300 font-semibold">
                Centralized Submission Registry
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-['Outfit']">
              School-Wide Lesson Plan Oversight Hub
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 max-w-2xl">
              Confidential administrative portal. Review early childhood weekly lesson plans across all grade levels (Toddlers to K2), trilingual curricula, sensory stations, and provide feedback.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {currentUser.role === 'admin' && (
              <button
                onClick={openProfileModal}
                className="flex items-center gap-2 px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold text-xs rounded-2xl shadow-sm transition-all active:scale-95"
                title="Update School Profile, Contact Info, and Replace App Logo"
              >
                <Building2 className="w-4 h-4 text-amber-900" />
                <span>Profile & Logo</span>
              </button>
            )}
            <button
              onClick={exportSummaryReport}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-2xl backdrop-blur-xs border border-white/20 transition-colors shadow-2xs"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-300" />
              <span>Export Weekly Binder</span>
            </button>
            <button
              onClick={() => setIsClassroomModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-2xl shadow-sm transition-all active:scale-95 border border-emerald-400/30"
            >
              <Plus className="w-4 h-4 text-amber-300" />
              <span>Add Classroom</span>
            </button>
            <button
              onClick={onOpenNewTeacher}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#007A43] hover:bg-[#006338] text-white font-bold text-xs rounded-2xl shadow-sm transition-all active:scale-95"
            >
              <Users className="w-4 h-4 text-amber-300" />
              <span>Manage Faculty</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Overview Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">All Submissions</span>
            <div className="p-2 bg-emerald-50 text-[#007A43] rounded-xl">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">{totalSubmissions}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Across 5 Classrooms</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-blue-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-800">Pending Review</span>
            <div className="p-2 bg-blue-50 text-blue-700 rounded-xl">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-blue-700 mt-2">{pendingReview}</p>
          <p className="text-[10px] text-blue-600 font-medium mt-0.5">Require Principal evaluation</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-emerald-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800">Approved Plans</span>
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-700 mt-2">{approvedCount}</p>
          <p className="text-[10px] text-emerald-600 font-medium mt-0.5">Ready for classroom use</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-amber-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800">Revisions Requested</span>
            <div className="p-2 bg-amber-50 text-amber-700 rounded-xl">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-amber-700 mt-2">{revisionsCount}</p>
          <p className="text-[10px] text-amber-600 font-medium mt-0.5">Feedback sent to teachers</p>
        </div>
      </div>

      {/* Sub-Tabs: Submissions Hub vs Compliance Matrix vs Staff Roles */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveAdminSubTab('submissions')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap ${
            activeAdminSubTab === 'submissions'
              ? 'bg-[#007A43] text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>All Teacher Submissions ({lessonPlans.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminSubTab('compliance_matrix')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap ${
            activeAdminSubTab === 'compliance_matrix'
              ? 'bg-[#007A43] text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Weekly Compliance Matrix (Week {selectedWeek})</span>
        </button>

        {currentUser?.role === 'admin' && (
          <button
            onClick={() => setActiveAdminSubTab('staff')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap ${
              activeAdminSubTab === 'staff'
                ? 'bg-amber-400 text-amber-950 shadow-2xs'
                : 'text-amber-800 bg-amber-50 hover:bg-amber-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Staff Positions & Roles ({allAccounts.length})</span>
          </button>
        )}

        {currentUser?.role === 'admin' && (
          <button
            onClick={() => setActiveAdminSubTab('classrooms_levels')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap ${
              activeAdminSubTab === 'classrooms_levels'
                ? 'bg-emerald-800 text-white shadow-2xs'
                : 'text-emerald-800 bg-emerald-50 hover:bg-emerald-100'
            }`}
          >
            <School className="w-4 h-4 text-[#D97706]" />
            <span>Classrooms & Levels ({classrooms.length} Cls / {levels?.length || 0} Lvl)</span>
          </button>
        )}
      </div>

      {activeAdminSubTab === 'staff' ? (
        /* Staff & Faculty Position / Role Management View */
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden space-y-4">
          <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={staffSearchQuery}
                onChange={(e) => setStaffSearchQuery(e.target.value)}
                placeholder="Search staff by name, position, or class..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-emerald-600"
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Role:</label>
                <select
                  value={staffRoleFilter}
                  onChange={(e) => setStaffRoleFilter(e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
                >
                  <option value="all">All Roles ({allAccounts.length})</option>
                  <option value="admin">Administrators</option>
                  <option value="academic_officer">Academic Officers</option>
                  <option value="teacher">Lead Teachers</option>
                </select>
              </div>

              <button
                onClick={openSignUpModal}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#007A43] hover:bg-[#006338] text-white font-bold text-xs rounded-xl shadow-xs transition-all active:scale-95"
              >
                <UserPlus className="w-3.5 h-3.5 text-amber-300" />
                <span>Add Staff</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Staff Member</th>
                  <th className="py-3 px-4">Assigned Position</th>
                  <th className="py-3 px-4">Institutional Role (RBAC)</th>
                  <th className="py-3 px-4">Classroom Allocation</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {allAccounts
                  .filter(u => {
                    if (staffRoleFilter !== 'all' && u.role !== staffRoleFilter) return false;
                    if (staffSearchQuery.trim()) {
                      const q = staffSearchQuery.toLowerCase();
                      return (
                        u.name.toLowerCase().includes(q) ||
                        u.email.toLowerCase().includes(q) ||
                        u.title.toLowerCase().includes(q) ||
                        (u.assignedClassName && u.assignedClassName.toLowerCase().includes(q))
                      );
                    }
                    return true;
                  })
                  .map((user) => (
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
                              {user.id === currentUser?.id && (
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

                      {/* Position Title */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 text-[11px] font-bold">
                            <Briefcase className="w-3 h-3 text-slate-500 shrink-0" />
                            <span className="truncate max-w-[160px]">{user.title}</span>
                          </span>
                          <button
                            onClick={() => setEditingStaffUser(user)}
                            className="p-1 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-md transition-colors"
                            title="Edit Position"
                          >
                            <Edit3 className="w-3 h-3" />
                          </button>
                        </div>
                      </td>

                      {/* Role Selector */}
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

                      {/* Class */}
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
                            <option value="Toddlers">Toddlers</option>
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
                            disabled={user.id === currentUser?.id}
                            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 border ${
                              user.id === currentUser?.id
                                ? 'text-slate-300 border-slate-100 cursor-not-allowed bg-slate-50'
                                : 'text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 border-rose-200'
                            }`}
                            title={user.id === currentUser?.id ? 'Cannot remove current active admin' : 'Remove Staff Member'}
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
      ) : activeAdminSubTab === 'compliance_matrix' ? (
        /* Weekly Compliance Grid */
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Weekly Faculty Submission Status
              </h2>
              <p className="text-xs text-slate-500">
                Track on-time curriculum readiness before Monday morning circle time.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-slate-600">Select Week:</label>
              <select
                value={selectedWeek}
                onChange={(e) => setSelectedWeek(parseInt(e.target.value))}
                className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
              >
                {[11, 12, 13, 14, 15].map(w => (
                  <option key={w} value={w}>Week {w} (Term 1 - 2026)</option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-3">Lead Teacher</th>
                  <th className="py-3 px-3">Assigned Class</th>
                  <th className="py-3 px-3">Submission Status</th>
                  <th className="py-3 px-3">Submitted Timestamp</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {weeklyCompliance.map((rec) => (
                  <tr key={rec.teacherId} className="hover:bg-slate-50">
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={rec.avatar}
                          alt={rec.teacherName}
                          className="w-8 h-8 rounded-lg object-cover"
                        />
                        <span className="font-bold text-slate-900">{rec.teacherName}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-emerald-800">
                      {rec.className}
                    </td>
                    <td className="py-3.5 px-3">
                      {rec.status === 'missing' ? (
                        <span className="px-2.5 py-0.5 bg-rose-100 text-rose-800 rounded-full text-[10px] font-bold">
                          ⚠️ Not Submitted
                        </span>
                      ) : (
                        getStatusBadge(rec.status as any)
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-slate-500">
                      {rec.submissionDate || '—'}
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      {rec.lessonPlanId ? (
                        <button
                          onClick={() => {
                            const found = lessonPlans.find(p => p.id === rec.lessonPlanId);
                            if (found) onSelectPlan(found);
                          }}
                          className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-[#007A43] font-bold rounded-lg border border-emerald-200"
                        >
                          Evaluate Plan
                        </button>
                      ) : (
                        <button
                          onClick={() => showToast(`Sent reminder alert to ${rec.teacherName}`, 'info')}
                          className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg"
                        >
                          Send Reminder
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : activeAdminSubTab === 'classrooms_levels' ? (
        <ClassroomsAndLevelsTab
          classrooms={classrooms}
          levels={levels}
          allAccounts={allAccounts}
          addClassroom={addClassroom}
          updateClassroom={updateClassroom}
          deleteClassroom={deleteClassroom}
          addLevel={addLevel}
          updateLevel={updateLevel}
          deleteLevel={deleteLevel}
          onEditClassroom={(cls) => {
            setSelectedClassroomToEdit(cls);
            setIsClassroomModalOpen(true);
          }}
          onAddClassroom={() => {
            setSelectedClassroomToEdit(null);
            setIsClassroomModalOpen(true);
          }}
        />
      ) : (
        /* Master Submissions List & Filters */
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden space-y-4">
          {/* Multi-Filter Toolbar */}
          <div className="p-4 sm:p-6 border-b border-slate-100 space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by theme, teacher name, or classroom..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-emerald-600 focus:bg-white"
                />
              </div>

              {/* Batch Action Bar */}
              <div className="flex items-center gap-2">
                <button
                  onClick={selectAllPending}
                  className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
                >
                  <CheckSquare className="w-3.5 h-3.5" />
                  <span>Select Pending ({filteredPlans.filter(p => p.status === 'submitted').length})</span>
                </button>

                {selectedPlanIds.length > 0 && (
                  <button
                    onClick={handleBatchApprove}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#007A43] hover:bg-[#006338] text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-95 animate-in fade-in"
                  >
                    <CheckCircle2 className="w-4 h-4 text-amber-300" />
                    <span>Approve Selected ({selectedPlanIds.length})</span>
                  </button>
                )}
              </div>
            </div>

            {/* Filter Dropdowns Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
                  Filter by Teacher
                </label>
                <select
                  value={selectedTeacherId}
                  onChange={(e) => setSelectedTeacherId(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
                >
                  <option value="all">All Educators ({teachers.length})</option>
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.assignedClassName})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
                  Filter by Classroom Level
                </label>
                <select
                  value={selectedAgeGroup}
                  onChange={(e) => setSelectedAgeGroup(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
                >
                  <option value="all">All Levels</option>
                  <option value="Toddlers">Toddlers</option>
                  <option value="Nursery">Nursery</option>
                  <option value="Pre-School">Pre-School</option>
                  <option value="Kindergarten">Kindergarten</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
                  Filter by Review Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
                >
                  <option value="all">All Statuses</option>
                  <option value="submitted">Pending Review (Submitted)</option>
                  <option value="approved">Approved</option>
                  <option value="revision_requested">Revision Requested</option>
                  <option value="draft">Drafts</option>
                </select>
              </div>
            </div>
          </div>

          {/* Submissions List Table */}
          {filteredPlans.length === 0 ? (
            <div className="p-12 text-center space-y-2">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-700">No submissions matching criteria.</p>
              <p className="text-xs text-slate-400">Try changing teacher or status filters.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredPlans.map((plan) => {
                const isSelected = selectedPlanIds.includes(plan.id);
                return (
                  <div
                    key={plan.id}
                    className={`p-4 sm:p-5 hover:bg-slate-50/70 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                      isSelected ? 'bg-emerald-50/40' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3.5 flex-1 min-w-0">
                      {/* Checkbox for batch actions */}
                      <button
                        onClick={() => toggleSelectPlan(plan.id)}
                        className="mt-1 text-slate-400 hover:text-emerald-700 transition-colors"
                      >
                        {isSelected ? (
                          <CheckSquare className="w-5 h-5 text-[#007A43]" />
                        ) : (
                          <Square className="w-5 h-5 text-slate-300" />
                        )}
                      </button>

                      {/* Teacher Avatar */}
                      <img
                        src={plan.teacherAvatar}
                        alt={plan.teacherName}
                        className="w-11 h-11 rounded-xl object-cover ring-2 ring-emerald-500/20 shrink-0"
                      />

                      {/* Submission Info */}
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-xs text-slate-900">{plan.teacherName}</span>
                          <span className="text-slate-300">·</span>
                          <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.2 rounded">
                            {plan.className}
                          </span>
                          <span className="text-slate-300">·</span>
                          <span className="text-xs text-slate-500 font-medium">
                            Week {plan.weekNumber} ({plan.startDate})
                          </span>
                          {getStatusBadge(plan.status)}
                        </div>

                        <h3 
                          onClick={() => onSelectPlan(plan)}
                          className="text-sm sm:text-base font-extrabold text-slate-900 hover:text-[#007A43] cursor-pointer transition-colors"
                        >
                          {plan.themeTitle}
                        </h3>

                        {/* Badges & Meta */}
                        <div className="flex flex-wrap items-center gap-2 pt-0.5 text-[11px] text-slate-500">
                          {plan.attachments && plan.attachments.length > 0 && (
                            <span className="flex items-center gap-1 text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                              <FileText className="w-3 h-3 text-emerald-700" />
                              {plan.attachments.length} attachment(s)
                            </span>
                          )}
                          {plan.trilingualFocus && (
                            <span className="text-emerald-700 font-semibold">
                              🇬🇧 🇰🇭 🇨🇳 Trilingual Vocab included
                            </span>
                          )}
                          {plan.feedbackHistory && plan.feedbackHistory.length > 0 && (
                            <span className="text-amber-800 font-medium">
                              💬 {plan.feedbackHistory.length} review comment(s)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex items-center gap-2 shrink-0 pl-8 md:pl-0">
                      <button
                        onClick={() => onSelectPlan(plan)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-[#007A43] hover:bg-[#006338] text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-95"
                      >
                        <ShieldCheck className="w-4 h-4 text-amber-300" />
                        <span>Review & Evaluate</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Staff User Deletion Modal */}
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
              Are you sure you want to remove <strong className="text-slate-900">{userToDelete.name}</strong> from Dewey Childcare House? Their credentials and access to the portal will be terminated immediately.
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
                onClick={() => {
                  deleteAccount(userToDelete.id);
                  setUserToDelete(null);
                }}
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

      {/* Add Classroom Modal */}
      {isClassroomModalOpen && (
        <ClassroomModal
          classroomToEdit={selectedClassroomToEdit}
          onClose={() => {
            setIsClassroomModalOpen(false);
            setSelectedClassroomToEdit(null);
          }}
        />
      )}
    </div>
  );
};
