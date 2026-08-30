import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Classroom, LessonPlan, CAMPUS_LIST } from '../types';
import { ClassroomModal } from './ClassroomModal';
import { 
  Users, 
  School, 
  Sparkles, 
  BookOpen, 
  Clock, 
  CheckCircle2, 
  Plus, 
  Edit3, 
  Trash2,
  Building2,
  Layers
} from 'lucide-react';

interface ClassroomDirectoryProps {
  onSelectPlan: (plan: LessonPlan) => void;
}

export const ClassroomDirectory: React.FC<ClassroomDirectoryProps> = ({ onSelectPlan }) => {
  const { classrooms, allAccounts, lessonPlans, currentUser, deleteClassroom, selectedCampusId, formatAgeGroup } = useApp();
  const [isClassroomModalOpen, setIsClassroomModalOpen] = useState(false);
  const [selectedClassroomToEdit, setSelectedClassroomToEdit] = useState<Classroom | null>(null);

  const isAdmin = currentUser?.role === 'admin';

  const displayedClassrooms = classrooms.filter(cls => {
    if (!selectedCampusId || selectedCampusId === 'ALL') return true;
    return cls.campusId === selectedCampusId;
  });

  const handleOpenAddModal = () => {
    setSelectedClassroomToEdit(null);
    setIsClassroomModalOpen(true);
  };

  const handleOpenEditModal = (cls: Classroom, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedClassroomToEdit(cls);
    setIsClassroomModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-2xs">
        
        {/* Header with Title and Add Classroom Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="max-w-2xl space-y-1">
            <span className="text-xs font-black uppercase tracking-wider text-[#007A43] flex items-center gap-1.5">
              <School className="w-4 h-4 text-emerald-700" />
              <span>Early Childhood Learning Environments</span>
            </span>
            <h2 className="text-2xl font-black text-slate-900 font-['Outfit']">
              Dewey Childcare House Classrooms & Age Groups
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Trilingual progressive learning environments from {formatAgeGroup('Toddlers')} (1.5 yrs) up to Kindergarten (6.5 yrs).
            </p>
          </div>

          {/* Admin Add Classroom Button */}
          {isAdmin && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleOpenAddModal}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#007A43] hover:bg-[#006338] text-white font-extrabold text-xs rounded-2xl shadow-md transition-all active:scale-95 whitespace-nowrap"
              >
                <Plus className="w-4 h-4 text-amber-300" />
                <span>Add Classroom</span>
              </button>
            </div>
          )}
        </div>

        {/* Classroom Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
          {displayedClassrooms.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
              <School className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-sm font-bold text-slate-700">No classrooms found for the selected campus tab.</p>
              <p className="text-xs text-slate-500">Switch to "All Campuses" or click "+ Add New Classroom" to create one.</p>
            </div>
          ) : (
            displayedClassrooms.map((cls) => {
              const leadTeacher = allAccounts.find(a => a.id === cls.leadTeacherId);
              const activePlan = lessonPlans.find(p => p.classId === cls.id && p.status === 'approved') || 
                                 lessonPlans.find(p => p.classId === cls.id);
              const campusInfo = CAMPUS_LIST.find(c => c.id === cls.campusId);

              return (
                <div
                  key={cls.id}
                  className="bg-slate-50/70 border border-slate-200 rounded-3xl p-5 hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4 group relative"
                >
                  <div className="space-y-3">
                    {/* Top Badges & Campus Label & Admin Quick Edit */}
                    <div className="flex items-center justify-between flex-wrap gap-1">
                      <div className="flex items-center gap-1.5">
                        <span 
                          className="px-3 py-1 rounded-xl text-xs font-extrabold text-white shadow-2xs"
                          style={{ backgroundColor: cls.colorTheme }}
                        >
                          {cls.code}
                        </span>
                        {campusInfo && (
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 border border-emerald-300">
                            {campusInfo.shortName}
                          </span>
                        )}
                      </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-500 mr-1">
                        {cls.enrolledStudents}/{cls.capacity} Children
                      </span>
                      {isAdmin && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => handleOpenEditModal(cls, e)}
                            className="p-1.5 text-slate-500 hover:text-emerald-800 hover:bg-emerald-50 bg-white border border-slate-200 rounded-lg transition-colors shadow-2xs"
                            title="Edit Classroom Settings"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (window.confirm(`Are you sure you want to permanently delete classroom "${cls.name}"? This unassigns its teacher.`)) {
                                deleteClassroom(cls.id);
                              }
                            }}
                            className="p-1.5 text-slate-500 hover:text-rose-700 hover:bg-rose-50 bg-white border border-slate-200 rounded-lg transition-colors shadow-2xs"
                            title="Remove Classroom"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-slate-900 group-hover:text-[#007A43] transition-colors">
                      {cls.name}
                    </h3>
                    <p className="text-xs font-bold text-emerald-800 font-['Battambang'] mt-0.5">
                      {cls.khmerName}
                    </p>
                    <p className="text-xs text-slate-500 font-medium mt-1">
                      {formatAgeGroup(cls.ageGroup, cls.campusId)} · {cls.room}
                    </p>
                  </div>

                  {/* Teacher Card */}
                  <div className="p-3 bg-white border border-slate-200/80 rounded-2xl flex items-center gap-3">
                    <img
                      src={leadTeacher?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'}
                      alt={cls.leadTeacherName}
                      className="w-10 h-10 rounded-xl object-cover ring-2 ring-emerald-500/20"
                    />
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Lead Educator
                      </p>
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {cls.leadTeacherName}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        Asst: {cls.assistantTeacherName}
                      </p>
                    </div>
                  </div>

                  {/* Current Thematic Focus */}
                  <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-2xl space-y-1">
                    <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-emerald-900">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Current Weekly Theme:</span>
                    </div>
                    <p className="text-xs text-emerald-950 font-semibold line-clamp-2">
                      {activePlan?.themeTitle || cls.currentTheme}
                    </p>
                  </div>
                </div>

                {/* Bottom Action */}
                <div>
                  {activePlan ? (
                    <button
                      onClick={() => onSelectPlan(activePlan)}
                      className="w-full flex items-center justify-center gap-1.5 py-2 bg-white hover:bg-emerald-50 border border-emerald-200 text-[#007A43] text-xs font-bold rounded-xl transition-colors"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>View Active Lesson Plan</span>
                    </button>
                  ) : (
                    <div className="text-center py-2 text-[11px] text-slate-400 font-medium">
                      No active plan submitted yet
                    </div>
                  )}
                </div>
              </div>
            );
          }))}
        </div>
      </div>

      {/* Classroom Modal */}
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
