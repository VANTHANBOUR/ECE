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
              activeTab={activeTab}
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
            <span className="font-bold text-[#007A43]">Dewey Kindergarten</span>
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
