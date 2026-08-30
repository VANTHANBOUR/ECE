import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { TeacherDashboard } from './components/TeacherDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminConsole } from './components/AdminConsole';
import { LessonPlanEditor } from './components/LessonPlanEditor';
import { LessonPlanDetailModal } from './components/LessonPlanDetailModal';
import { ClassroomDirectory } from './components/ClassroomDirectory';
import { WeeklyScheduleCalendar } from './components/WeeklyScheduleCalendar';
import { NewTeacherModal } from './components/NewTeacherModal';
import { AuthModal } from './components/AuthModal';
import { AuthGate } from './components/AuthGate';
import { SchoolProfileModal } from './components/SchoolProfileModal';
import { LessonPlan } from './types';
import { 
  LayoutDashboard, 
  BookOpen, 
  School, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  ShieldCheck, 
  GraduationCap, 
  Award, 
  LogOut
} from 'lucide-react';

const MainContent: React.FC = () => {
  const { 
    currentUser, 
    isAuthenticated,
    activeTab, 
    setActiveTab, 
    toastMessage, 
    lessonPlans, 
    userLessonPlans,
    openSignInModal,
    signOut
  } = useApp();

  // Modals state
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<LessonPlan | null>(null);
  const [viewingPlan, setViewingPlan] = useState<LessonPlan | null>(null);
  const [isNewTeacherOpen, setIsNewTeacherOpen] = useState(false);

  // Toast Component Helper
  const renderToast = () => {
    if (!toastMessage) return null;
    return (
      <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-200">
        <div 
          className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border text-xs font-bold ${
            toastMessage.type === 'success'
              ? 'bg-emerald-900 text-white border-emerald-700'
              : toastMessage.type === 'warning'
              ? 'bg-amber-900 text-white border-amber-700'
              : toastMessage.type === 'error'
              ? 'bg-rose-900 text-white border-rose-700'
              : 'bg-slate-900 text-white border-slate-700'
          }`}
        >
          {toastMessage.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
          {toastMessage.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />}
          {toastMessage.type === 'error' && <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />}
          {toastMessage.type === 'info' && <Info className="w-4 h-4 text-blue-400 shrink-0" />}
          <span>{toastMessage.text}</span>
        </div>
      </div>
    );
  };

  // ENFORCE MANDATORY AUTHENTICATION GATE
  // If user is not authenticated or currentUser is null, display AuthGate
  if (!isAuthenticated || !currentUser) {
    return (
      <>
        {renderToast()}
        <AuthGate />
      </>
    );
  }

  const handleOpenNewPlan = () => {
    setEditingPlan(null);
    setIsEditorOpen(true);
  };

  const handleSelectPlan = (plan: LessonPlan) => {
    setViewingPlan(plan);
  };

  const handleEditPlan = (plan: LessonPlan) => {
    setViewingPlan(null);
    setEditingPlan(plan);
    setIsEditorOpen(true);
  };

  const isAcademicAuthority = currentUser.role === 'admin' || currentUser.role === 'academic_officer';

  return (
    <div className="min-h-screen bg-slate-100/60 text-slate-900 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Toast Alert Notification */}
      {renderToast()}

      {/* Header */}
      <Header
        onOpenNewPlan={handleOpenNewPlan}
        onOpenNewTeacher={() => setIsNewTeacherOpen(true)}
      />

      {/* Role Notice & Sub-Navigation Bar */}
      <div className="bg-white border-b border-slate-200/80 shadow-2xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between py-2.5 gap-2">
            
            {/* Navigation Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'dashboard'
                    ? 'bg-[#007A43] text-white shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>
                  {currentUser.role === 'admin'
                    ? 'Administrative Hub'
                    : currentUser.role === 'academic_officer'
                    ? 'Academic Officer Hub'
                    : 'My Educator Dashboard'}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('lesson_plans')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'lesson_plans'
                    ? 'bg-[#007A43] text-white shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>
                  {isAcademicAuthority 
                    ? `Master Lesson Plans (${lessonPlans.length})` 
                    : `My Lesson Plans (${userLessonPlans.length})`}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('classrooms')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'classrooms'
                    ? 'bg-[#007A43] text-white shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <School className="w-3.5 h-3.5" />
                <span>Classrooms & Levels</span>
              </button>

              <button
                onClick={() => setActiveTab('weekly_schedule')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'weekly_schedule'
                    ? 'bg-[#007A43] text-white shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Daily Trilingual Routine</span>
              </button>

              {currentUser.role === 'admin' && (
                <button
                  onClick={() => setActiveTab('admin_console')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap ${
                    activeTab === 'admin_console'
                      ? 'bg-amber-400 text-amber-950 shadow-2xs'
                      : 'text-amber-800 bg-amber-50 hover:bg-amber-100'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin Console</span>
                </button>
              )}
            </div>

            {/* Role Context Indicator & Sign In / Sign Out actions */}
            <div className="flex items-center gap-2 text-xs flex-wrap">
              <div 
                className={`px-3 py-1 rounded-xl font-bold flex items-center gap-1.5 ${
                  currentUser.role === 'admin'
                    ? 'bg-amber-100/80 text-amber-950 border border-amber-300'
                    : currentUser.role === 'academic_officer'
                    ? 'bg-blue-100/80 text-blue-950 border border-blue-300'
                    : 'bg-emerald-100/80 text-emerald-950 border border-emerald-300'
                }`}
              >
                {currentUser.role === 'admin' ? (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                    <span>Role: <strong>Admin / Principal</strong> (Can see all {lessonPlans.length} plans & master console)</span>
                  </>
                ) : currentUser.role === 'academic_officer' ? (
                  <>
                    <Award className="w-3.5 h-3.5 text-blue-700" />
                    <span>Role: <strong>Academic Officer</strong> (Authorized to approve, review & delete all plans)</span>
                  </>
                ) : (
                  <>
                    <GraduationCap className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Role: <strong>Lead Teacher</strong> (Isolated to your {userLessonPlans.length} uploads)</span>
                  </>
                )}
              </div>

              <button
                onClick={openSignInModal}
                className="px-2.5 py-1 text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold transition-colors"
                title="Switch user account"
              >
                Switch Account
              </button>

              <button
                onClick={signOut}
                className="px-2.5 py-1 text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
                title="Sign out of DCH Portal"
              >
                <LogOut className="w-3 h-3" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Page Body Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Render Active View */}
        {activeTab === 'admin_console' && currentUser.role === 'admin' ? (
          <AdminConsole
            onSelectPlan={handleSelectPlan}
            onOpenNewTeacher={() => setIsNewTeacherOpen(true)}
          />
        ) : activeTab === 'dashboard' || activeTab === 'lesson_plans' ? (
          isAcademicAuthority ? (
            <AdminDashboard
              onSelectPlan={handleSelectPlan}
              onOpenNewTeacher={() => setIsNewTeacherOpen(true)}
            />
          ) : (
            <TeacherDashboard
              onOpenNewPlan={handleOpenNewPlan}
              onSelectPlan={handleSelectPlan}
              onEditPlan={handleEditPlan}
            />
          )
        ) : activeTab === 'classrooms' ? (
          <ClassroomDirectory onSelectPlan={handleSelectPlan} />
        ) : (
          <WeeklyScheduleCalendar />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500 space-y-2 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#007A43]">Dewey Childcare House</span>
            <span>·</span>
            <span className="font-['Battambang'] text-emerald-900">ឌូវី ឆាល់ឃែរ៍ ហោស៍</span>
          </div>
          <p className="text-[11px]">
            International Trilingual Kindergarten (English · Khmer · Chinese) · Early Childhood Academic Information System
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={signOut}
              className="text-rose-600 font-bold hover:underline"
            >
              Sign Out
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {isEditorOpen && (
        <LessonPlanEditor
          initialPlan={editingPlan}
          onClose={() => {
            setIsEditorOpen(false);
            setEditingPlan(null);
          }}
          onSaved={() => {
            setIsEditorOpen(false);
            setEditingPlan(null);
          }}
        />
      )}

      {viewingPlan && (
        <LessonPlanDetailModal
          plan={viewingPlan}
          onClose={() => setViewingPlan(null)}
          onEdit={() => handleEditPlan(viewingPlan)}
        />
      )}

      {isNewTeacherOpen && (
        <NewTeacherModal onClose={() => setIsNewTeacherOpen(false)} />
      )}

      <SchoolProfileModal />

      <AuthModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
