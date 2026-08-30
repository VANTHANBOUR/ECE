import React, { useState } from 'react';
import { Classroom, SchoolLevel, UserAccount } from '../types';
import { 
  School, 
  Layers, 
  Plus, 
  Edit3, 
  Trash2, 
  Users, 
  Search, 
  Hash, 
  Calendar, 
  Building2, 
  Sparkles, 
  Globe,
  PlusCircle,
  HelpCircle,
  ChevronRight,
  AlertCircle
} from 'lucide-react';

interface ClassroomsAndLevelsTabProps {
  classrooms: Classroom[];
  levels: SchoolLevel[];
  allAccounts: UserAccount[];
  addClassroom: (classroomData: Omit<Classroom, 'id'>) => Classroom;
  updateClassroom: (id: string, updates: Partial<Classroom>) => void;
  deleteClassroom: (id: string) => void;
  addLevel: (levelData: Omit<SchoolLevel, 'id'>) => SchoolLevel;
  updateLevel: (id: string, updates: Partial<SchoolLevel>) => void;
  deleteLevel: (id: string) => void;
  onEditClassroom: (cls: Classroom) => void;
  onAddClassroom: () => void;
}

export const ClassroomsAndLevelsTab: React.FC<ClassroomsAndLevelsTabProps> = ({
  classrooms,
  levels,
  allAccounts,
  deleteClassroom,
  addLevel,
  updateLevel,
  deleteLevel,
  onEditClassroom,
  onAddClassroom
}) => {
  const [subView, setSubView] = useState<'classrooms' | 'levels'>('classrooms');
  
  // Search state
  const [clsSearchQuery, setClsSearchQuery] = useState('');
  const [lvlSearchQuery, setLvlSearchQuery] = useState('');

  // Level editing states
  const [isLevelModalOpen, setIsLevelModalOpen] = useState(false);
  const [editingLevel, setEditingLevel] = useState<SchoolLevel | null>(null);
  
  // Form values for Level
  const [levelName, setLevelName] = useState('');
  const [levelAgeRange, setLevelAgeRange] = useState('');
  const [levelKhmerName, setLevelKhmerName] = useState('');
  const [levelDescription, setLevelDescription] = useState('');

  const teachers = allAccounts.filter(a => a.role === 'teacher');

  // Filtered Classrooms
  const filteredClassrooms = classrooms.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(clsSearchQuery.toLowerCase()) ||
                        c.code.toLowerCase().includes(clsSearchQuery.toLowerCase()) ||
                        c.khmerName.includes(clsSearchQuery) ||
                        c.leadTeacherName.toLowerCase().includes(clsSearchQuery.toLowerCase());
    return matchSearch;
  });

  // Filtered Levels
  const filteredLevels = (levels || []).filter(l => {
    const matchSearch = l.name.toLowerCase().includes(lvlSearchQuery.toLowerCase()) ||
                        l.displayName.toLowerCase().includes(lvlSearchQuery.toLowerCase()) ||
                        (l.khmerName && l.khmerName.includes(lvlSearchQuery)) ||
                        (l.description && l.description.toLowerCase().includes(lvlSearchQuery.toLowerCase()));
    return matchSearch;
  });

  const handleOpenAddLevel = () => {
    setEditingLevel(null);
    setLevelName('');
    setLevelAgeRange('');
    setLevelKhmerName('');
    setLevelDescription('');
    setIsLevelModalOpen(true);
  };

  const handleOpenEditLevel = (lvl: SchoolLevel) => {
    setEditingLevel(lvl);
    setLevelName(lvl.name);
    setLevelAgeRange(lvl.ageRange);
    setLevelKhmerName(lvl.khmerName || '');
    setLevelDescription(lvl.description || '');
    setIsLevelModalOpen(true);
  };

  const handleSaveLevel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!levelName.trim()) return;

    const ageRangeStr = levelAgeRange.trim() ? ` (${levelAgeRange.trim()})` : '';
    const displayName = `${levelName.trim()}${ageRangeStr}`;

    const levelData = {
      name: levelName.trim(),
      ageRange: levelAgeRange.trim(),
      displayName,
      khmerName: levelKhmerName.trim() || undefined,
      description: levelDescription.trim() || undefined,
    };

    if (editingLevel) {
      updateLevel(editingLevel.id, levelData);
    } else {
      addLevel(levelData);
    }
    setIsLevelModalOpen(false);
  };

  // Check if a level is currently in use by any classrooms
  const isLevelInUse = (lvlDisplayName: string) => {
    return classrooms.some(c => c.ageGroup === lvlDisplayName);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Dynamic Segmented Navigation Header */}
      <div className="bg-slate-50 border border-slate-200 p-1.5 rounded-2xl flex items-center justify-between gap-4 max-w-md">
        <button
          onClick={() => setSubView('classrooms')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-black transition-all ${
            subView === 'classrooms' 
              ? 'bg-white text-emerald-950 shadow-xs border border-slate-100' 
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Building2 className="w-4 h-4 text-emerald-700" />
          <span>Classrooms Directory ({classrooms.length})</span>
        </button>
        <button
          onClick={() => setSubView('levels')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-black transition-all ${
            subView === 'levels' 
              ? 'bg-white text-emerald-950 shadow-xs border border-slate-100' 
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Layers className="w-4 h-4 text-emerald-700" />
          <span>Learning Levels ({levels.length})</span>
        </button>
      </div>

      {subView === 'classrooms' ? (
        /* ================= CLASSROOMS DIRECTORY ================= */
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <h2 className="text-xl font-black text-slate-900 font-['Outfit'] flex items-center gap-2">
                <School className="w-5 h-5 text-emerald-700" />
                <span>Classrooms Administration</span>
              </h2>
              <p className="text-xs text-slate-500">
                Configure physical learning spaces, assign certified lead educators, and adjust age limits.
              </p>
            </div>
            
            <button
              onClick={onAddClassroom}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs rounded-2xl shadow-xs transition-all active:scale-95 whitespace-nowrap"
            >
              <Plus className="w-4 h-4 text-amber-300" />
              <span>Add Classroom</span>
            </button>
          </div>

          {/* Classroom Filters */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={clsSearchQuery}
              onChange={(e) => setClsSearchQuery(e.target.value)}
              placeholder="Search classrooms by name, code, or educator..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-emerald-600"
            />
          </div>

          {/* Classrooms Grid */}
          {filteredClassrooms.length === 0 ? (
            <div className="p-12 text-center border border-dashed border-slate-200 rounded-2xl bg-slate-50/50 space-y-2">
              <Building2 className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-xs font-black text-slate-800">No Classrooms Found</p>
              <p className="text-[11px] text-slate-400">Try refining your classroom search term or add a new classroom space.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredClassrooms.map((cls) => {
                const leadTeacher = teachers.find(t => t.id === cls.leadTeacherId);
                return (
                  <div
                    key={cls.id}
                    className="bg-slate-50/50 border border-slate-200 rounded-2xl p-5 hover:border-emerald-300 transition-all flex flex-col justify-between space-y-4 group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span 
                          className="px-2.5 py-1 rounded-lg text-[10px] font-black text-white"
                          style={{ backgroundColor: cls.colorTheme }}
                        >
                          {cls.code}
                        </span>
                        
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => onEditClassroom(cls)}
                            className="p-1.5 text-slate-600 hover:text-emerald-800 hover:bg-emerald-50 bg-white border border-slate-200 rounded-lg transition-colors shadow-2xs"
                            title="Edit"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to permanently delete classroom "${cls.name}"? This unassigns its teacher.`)) {
                                deleteClassroom(cls.id);
                              }
                            }}
                            className="p-1.5 text-slate-600 hover:text-rose-800 hover:bg-rose-50 bg-white border border-slate-200 rounded-lg transition-colors shadow-2xs"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-base font-black text-slate-900">
                          {cls.name}
                        </h3>
                        <p className="text-xs font-bold text-emerald-800 font-['Battambang']">
                          {cls.khmerName}
                        </p>
                        <div className="mt-2 space-y-1 text-xs text-slate-500 font-semibold">
                          <p className="flex items-center gap-1.5">
                            <Layers className="w-3.5 h-3.5 text-slate-400" />
                            <span>{cls.ageGroup}</span>
                          </p>
                          <p className="flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-slate-400" />
                            <span>{cls.room} · Capacity: {cls.capacity} max</span>
                          </p>
                        </div>
                      </div>

                      {/* Teacher Card inside Classroom info */}
                      <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center gap-2.5">
                        <img
                          src={leadTeacher?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'}
                          alt={cls.leadTeacherName}
                          className="w-8 h-8 rounded-lg object-cover ring-2 ring-emerald-500/10"
                        />
                        <div className="min-w-0">
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                            Lead Educator
                          </p>
                          <p className="text-xs font-extrabold text-slate-800 truncate">
                            {cls.leadTeacherName}
                          </p>
                          <p className="text-[10px] text-slate-500 truncate">
                            Asst: {cls.assistantTeacherName || 'Unassigned'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* ================= LEARNING LEVELS (AGE GROUPS) ================= */
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <h2 className="text-xl font-black text-slate-900 font-['Outfit'] flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-700" />
                <span>Academic & Development Levels</span>
              </h2>
              <p className="text-xs text-slate-500">
                Define the pedagogical age stages (e.g. Nursery, Pre-K, Kindergarten). Customize titles and ages.
              </p>
            </div>
            
            <button
              onClick={handleOpenAddLevel}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs rounded-2xl shadow-xs transition-all active:scale-95 whitespace-nowrap"
            >
              <Plus className="w-4 h-4 text-amber-300" />
              <span>Add Custom Level</span>
            </button>
          </div>

          {/* Level Filters */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={lvlSearchQuery}
              onChange={(e) => setLvlSearchQuery(e.target.value)}
              placeholder="Search academic levels by name, Khmer translation, or age group description..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-emerald-600"
            />
          </div>

          {/* Levels Directory Grid */}
          {filteredLevels.length === 0 ? (
            <div className="p-12 text-center border border-dashed border-slate-200 rounded-2xl bg-slate-50/50 space-y-2">
              <Layers className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-xs font-black text-slate-800">No Learning Levels Found</p>
              <p className="text-[11px] text-slate-400">Try creating a new custom early childhood development level.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredLevels.map((lvl) => {
                const inUse = isLevelInUse(lvl.displayName);
                return (
                  <div
                    key={lvl.id}
                    className="bg-slate-50/50 border border-slate-200 rounded-2xl p-5 hover:border-emerald-300 hover:bg-white hover:shadow-xs transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-1 rounded-lg text-[10px] font-black text-emerald-900 bg-emerald-100/80 border border-emerald-200">
                          {lvl.ageRange || 'All Ages'}
                        </span>
                        
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenEditLevel(lvl)}
                            className="p-1.5 text-slate-600 hover:text-emerald-800 hover:bg-emerald-50 bg-white border border-slate-200 rounded-lg transition-colors shadow-2xs"
                            title="Edit Level"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (inUse) {
                                alert(`Cannot remove "${lvl.name}". This level is currently set on active classroom(s). Please change the classroom levels before deleting.`);
                                return;
                              }
                              if (window.confirm(`Are you sure you want to permanently delete learning level "${lvl.displayName}"?`)) {
                                deleteLevel(lvl.id);
                              }
                            }}
                            className={`p-1.5 border rounded-lg transition-colors shadow-2xs bg-white ${
                              inUse 
                                ? 'text-slate-300 border-slate-100 cursor-not-allowed' 
                                : 'text-slate-600 hover:text-rose-800 hover:bg-rose-50 border-slate-200'
                            }`}
                            title={inUse ? "Level is in use" : "Delete Level"}
                            disabled={inUse}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <h3 className="text-base font-black text-slate-900 flex items-center gap-1.5">
                          <span>{lvl.name}</span>
                        </h3>
                        {lvl.khmerName && (
                          <p className="text-xs font-bold text-emerald-800 font-['Battambang']">
                            {lvl.khmerName}
                          </p>
                        )}
                        <p className="text-xs font-semibold text-slate-500 pt-1">
                          Full Label: <span className="text-slate-800 font-bold">{lvl.displayName}</span>
                        </p>
                      </div>

                      {lvl.description ? (
                        <p className="text-xs text-slate-500 bg-white border border-slate-100 rounded-xl p-2.5 leading-relaxed font-semibold">
                          {lvl.description}
                        </p>
                      ) : (
                        <p className="text-[11px] text-slate-400 italic font-medium">
                          No developmental description has been configured.
                        </p>
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold">
                      <span className="text-slate-400">Assigned Classrooms:</span>
                      <span className="text-emerald-800 font-black">
                        {classrooms.filter(c => c.ageGroup === lvl.displayName).length} Rooms
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Dynamic Level Add & Edit Modal */}
      {isLevelModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveLevel}
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 space-y-4 animate-in fade-in zoom-in-95"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-800" />
                <h3 className="text-lg font-black text-slate-900 font-['Outfit']">
                  {editingLevel ? `Edit Custom Level: ${editingLevel.name}` : 'Add New Academic Level'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsLevelModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-900 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5 text-slate-700">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600 block">Level Name (English) *</label>
                  <input
                    type="text"
                    required
                    value={levelName}
                    onChange={(e) => setLevelName(e.target.value)}
                    placeholder="e.g. Toddlers, Nursery, K1"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-emerald-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600 block">Age Range (Years / Months) *</label>
                  <input
                    type="text"
                    required
                    value={levelAgeRange}
                    onChange={(e) => setLevelAgeRange(e.target.value)}
                    placeholder="e.g. 1.5 - 2.5 yrs or 3.5 - 4.5 yrs"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-emerald-600"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 block">Khmer Translation (ភាសាខ្មែរ)</label>
                <input
                  type="text"
                  value={levelKhmerName}
                  onChange={(e) => setLevelKhmerName(e.target.value)}
                  placeholder="e.g. ថ្នាក់កូនក្មេង"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 font-['Battambang'] focus:bg-white focus:outline-emerald-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 block">Developmental Objectives & Description</label>
                <textarea
                  value={levelDescription}
                  onChange={(e) => setLevelDescription(e.target.value)}
                  placeholder="Describe early language skills, cognitive milestones, sensory activities, or program specifics..."
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-emerald-600"
                />
              </div>

              {levelName.trim() && levelAgeRange.trim() && (
                <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-xl space-y-1">
                  <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Preview Level Format</p>
                  <p className="text-xs font-black text-slate-800">
                    {levelName.trim()} ({levelAgeRange.trim()}) {levelKhmerName.trim() ? ` · ${levelKhmerName.trim()}` : ''}
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsLevelModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                {editingLevel ? 'Save Changes' : 'Create Level'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
