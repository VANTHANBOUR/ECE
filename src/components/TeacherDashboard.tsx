import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LessonPlan } from '../types';
import { UserProfileModal } from './UserProfileModal';
import { 
  BookOpen, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  FileText, 
  Eye, 
  Edit3, 
  Send, 
  Sparkles, 
  Calendar, 
  Layers, 
  Download,
  AlertCircle,
  HelpCircle,
  School,
  Table,
  Camera,
  User
} from 'lucide-react';

interface TeacherDashboardProps {
  onOpenNewPlan: () => void;
  onSelectPlan: (plan: LessonPlan) => void;
  onEditPlan: (plan: LessonPlan) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  onOpenNewPlan,
  onSelectPlan,
  onEditPlan,
}) => {
  const { currentUser, userLessonPlans, submitLessonPlan, classrooms, showToast } = useApp();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const myClass = classrooms.find(c => c.id === currentUser.assignedClassId) || classrooms[0];

  const approvedCount = userLessonPlans.filter(p => p.status === 'approved').length;
  const submittedCount = userLessonPlans.filter(p => p.status === 'submitted' || p.status === 'under_review').length;
  const revisionCount = userLessonPlans.filter(p => p.status === 'revision_requested').length;
  const draftCount = userLessonPlans.filter(p => p.status === 'draft').length;

  const filteredPlans = userLessonPlans.filter(p => {
    if (statusFilter === 'all') return true;
    return p.status === statusFilter;
  });

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
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 rounded-full text-[11px] font-extrabold animate-pulse">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            Action Needed · Revision
          </span>
        );
      case 'submitted':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-blue-100 text-blue-800 border border-blue-200 rounded-full text-[11px] font-bold">
            <Clock className="w-3 h-3 text-blue-600" />
            Under Principal Review
          </span>
        );
      case 'under_review':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-purple-100 text-purple-800 border border-purple-200 rounded-full text-[11px] font-bold">
            <Clock className="w-3 h-3 text-purple-600" />
            In Review
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-slate-100 text-slate-700 border border-slate-200 rounded-full text-[11px] font-bold">
            Draft · Not Submitted
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Teacher Profile & Classroom Banner */}
      <div className="bg-gradient-to-r from-[#006838] via-[#007A43] to-emerald-800 rounded-3xl p-6 sm:p-8 text-white shadow-sm relative overflow-hidden">
        {/* Subtle decorative background ring */}
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute right-24 bottom-0 translate-y-16 w-48 h-48 bg-amber-400/20 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4 sm:gap-5">
            <div 
              className="relative group cursor-pointer shrink-0" 
              onClick={() => setIsProfileModalOpen(true)}
              title="Click to update profile picture & details"
            >
              <img
                src={currentUser.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'}
                alt={currentUser.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-white/30 shadow-md transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 p-1 bg-amber-400 text-amber-950 rounded-lg shadow-xs hover:bg-amber-300">
                <Camera className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-400/90 text-amber-950">
                  Educator Portal
                </span>
                <span className="text-xs text-emerald-100 font-medium">
                  {currentUser.joinedYear ? `Faculty Member since ${currentUser.joinedYear}` : 'Early Childhood Faculty'}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white">
                {currentUser.name} {currentUser.khmerName && <span className="text-emerald-200 font-['Battambang'] font-normal text-lg">({currentUser.khmerName})</span>}
              </h1>
              <p className="text-xs sm:text-sm text-emerald-100 font-medium flex items-center gap-2">
                <School className="w-4 h-4 text-amber-300" />
                <span>
                  {currentUser.assignedClassName || myClass.name} · {currentUser.ageGroup || myClass.ageGroup} · {currentUser.roomNumber || myClass.room}
                </span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/15 hover:bg-white/25 text-white font-bold text-xs rounded-2xl border border-white/25 backdrop-blur-xs transition-all active:scale-95"
            >
              <User className="w-4 h-4 text-amber-300" />
              <span>Update Profile & Photo</span>
            </button>
            <button
              onClick={onOpenNewPlan}
              className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-amber-950 font-extrabold text-xs sm:text-sm rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-95"
            >
              <Plus className="w-5 h-5 stroke-[2.5]" />
              <span>Create / Upload Lesson Plan</span>
            </button>
          </div>
        </div>
      </div>

      {/* Revision Alert Notice (If Principal asked for changes) */}
      {revisionCount > 0 && (
        <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-2xl flex items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500 text-white rounded-xl">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-950">
                Action Required: {revisionCount} Lesson Plan(s) Need Revision
              </p>
              <p className="text-[11px] text-amber-800">
                Principal Madam Sopheak has requested minor curriculum or safety updates. Review the feedback and resubmit.
              </p>
            </div>
          </div>
          <button
            onClick={() => setStatusFilter('revision_requested')}
            className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shrink-0"
          >
            View Revisions
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div 
          onClick={() => setStatusFilter('all')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === 'all' ? 'bg-emerald-50/80 border-emerald-300 ring-2 ring-emerald-500/20' : 'bg-white border-slate-200/80 hover:border-emerald-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">My Total Plans</span>
            <div className="p-2 bg-emerald-100/60 text-[#007A43] rounded-xl">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">{userLessonPlans.length}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Across Term 1</p>
        </div>

        <div 
          onClick={() => setStatusFilter('approved')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === 'approved' ? 'bg-emerald-50/80 border-emerald-300 ring-2 ring-emerald-500/20' : 'bg-white border-slate-200/80 hover:border-emerald-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Approved</span>
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-700 mt-2">{approvedCount}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Ready for classroom teaching</p>
        </div>

        <div 
          onClick={() => setStatusFilter('submitted')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === 'submitted' ? 'bg-blue-50/80 border-blue-300 ring-2 ring-blue-500/20' : 'bg-white border-slate-200/80 hover:border-blue-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Pending Review</span>
            <div className="p-2 bg-blue-100 text-blue-700 rounded-xl">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-blue-700 mt-2">{submittedCount}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Under Principal review</p>
        </div>

        <div 
          onClick={() => setStatusFilter('draft')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === 'draft' ? 'bg-amber-50/80 border-amber-300 ring-2 ring-amber-500/20' : 'bg-white border-slate-200/80 hover:border-amber-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Drafts / In Progress</span>
            <div className="p-2 bg-amber-100 text-amber-700 rounded-xl">
              <Edit3 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-amber-700 mt-2">{draftCount}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Need submission</p>
        </div>
      </div>

      {/* Lesson Plan Submissions List */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
        {/* Section Header with Filter Tabs */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">
              My Uploaded Lesson Plans & Submissions
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Only you and the School Principal can view submissions associated with your account.
            </p>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {['all', 'approved', 'submitted', 'revision_requested', 'draft'].map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all whitespace-nowrap ${
                  statusFilter === tab
                    ? 'bg-[#007A43] text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* List Content */}
        {filteredPlans.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-50 text-[#007A43] rounded-2xl flex items-center justify-center mx-auto">
              <BookOpen className="w-7 h-7" />
            </div>
            <p className="text-sm font-bold text-slate-800">No lesson plans found in this filter.</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Create a new early childhood lesson plan for your classroom or switch filters to view previous weeks.
            </p>
            <button
              onClick={onOpenNewPlan}
              className="mt-2 px-4 py-2 bg-[#007A43] hover:bg-[#006338] text-white text-xs font-bold rounded-xl transition-colors"
            >
              + Create First Plan
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredPlans.map((plan) => (
              <div
                key={plan.id}
                className="p-4 sm:p-6 hover:bg-slate-50/60 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-emerald-50 text-[#007A43] border border-emerald-200 rounded-lg text-xs font-bold">
                      Week {plan.weekNumber}
                    </span>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs font-semibold text-slate-600">
                      {plan.startDate} to {plan.endDate}
                    </span>
                    {getStatusBadge(plan.status)}
                  </div>

                  <div>
                    <h3 
                      onClick={() => onSelectPlan(plan)}
                      className="text-base font-bold text-slate-900 hover:text-[#007A43] cursor-pointer transition-colors"
                    >
                      {plan.themeTitle}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-1 mt-0.5">
                      {plan.themeDescription || 'Structured trilingual early childhood weekly plan.'}
                    </p>
                  </div>

                  {/* Badges row */}
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-500">
                    <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                      {plan.className} ({plan.ageGroup})
                    </span>
                    {plan.attachments && plan.attachments.length > 0 && (
                      <span className="flex items-center gap-1 text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                        <FileText className="w-3 h-3 text-emerald-700" />
                        {plan.attachments.length} file(s) attached
                      </span>
                    )}
                    {plan.feedbackHistory && plan.feedbackHistory.length > 0 && (
                      <span className="text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded font-bold">
                        💬 {plan.feedbackHistory.length} Feedback note(s) from Principal
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <button
                    onClick={() => onSelectPlan(plan)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Plan</span>
                  </button>

                  <button
                    onClick={() => onEditPlan(plan)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-colors shadow-2xs"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-amber-600" />
                    <span>Edit</span>
                  </button>

                  {plan.status === 'draft' && (
                    <button
                      onClick={() => submitLessonPlan(plan.id)}
                      className="flex items-center gap-1 px-3.5 py-1.5 bg-[#007A43] hover:bg-[#006338] text-white text-xs font-bold rounded-xl shadow-2xs transition-all active:scale-95"
                    >
                      <Send className="w-3.5 h-3.5 text-amber-300" />
                      <span>Submit</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Staff Profile Quick Actions & Classroom Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#007A43] flex items-center justify-center shrink-0 border border-emerald-200/80">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">
              Personalized Educator Account Profile
            </h3>
            <p className="text-xs text-slate-500">
              Keep your profile portrait, contact number, and Khmer name updated for official printed lesson plans.
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsProfileModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#007A43] hover:bg-[#006838] text-white text-xs font-bold rounded-2xl shadow-2xs transition-all active:scale-95 shrink-0"
        >
          <Camera className="w-4 h-4 text-amber-300" />
          <span>Update Photo & Profile Details</span>
        </button>
      </div>

      {/* User Profile Settings Modal */}
      {isProfileModalOpen && (
        <UserProfileModal onClose={() => setIsProfileModalOpen(false)} />
      )}
    </div>
  );
};
