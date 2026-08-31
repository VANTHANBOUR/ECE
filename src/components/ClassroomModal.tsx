import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Classroom, EarlyChildhoodAgeGroup, CampusId, CAMPUS_LIST } from '../types';
import { 
  X, 
  School, 
  CheckCircle2, 
  Palette, 
  Users, 
  Sparkles, 
  Building2, 
  GraduationCap, 
  Hash, 
  Layers,
  Trash2,
  AlertTriangle
} from 'lucide-react';

interface ClassroomModalProps {
  classroomToEdit?: Classroom | null;
  onClose: () => void;
}

const AGE_GROUPS: EarlyChildhoodAgeGroup[] = [
  'Pre-Nursery',
  'Nursery',
  'Pre-School',
  'Kindergarten',
];

const COLOR_PRESETS = [
  { name: 'Emerald Forest', hex: '#007A43' },
  { name: 'Khmer Amber', hex: '#D97706' },
  { name: 'Sapphire Blue', hex: '#2563EB' },
  { name: 'Royal Violet', hex: '#7C3AED' },
  { name: 'Coral Rose', hex: '#E11D48' },
  { name: 'Ocean Teal', hex: '#0D9488' },
  { name: 'Warm Terracotta', hex: '#EA580C' },
  { name: 'Sky Cyan', hex: '#0284C7' },
];

const NAME_PRESETS = [
  { name: 'Butterflies', khmer: 'ថ្នាក់មេអំបៅ', ageGroup: 'Pre-School' as EarlyChildhoodAgeGroup, code: 'PRE-K A', color: '#007A43' },
  { name: 'Ladybugs', khmer: 'ថ្នាក់កូនសត្វល្អិត', ageGroup: 'Pre-Nursery' as EarlyChildhoodAgeGroup, code: 'PNUR-A', color: '#E11D48' },
  { name: 'Sunflowers', khmer: 'ថ្នាក់ផ្កាឈូករ័ត្ន', ageGroup: 'Kindergarten' as EarlyChildhoodAgeGroup, code: 'K1-A', color: '#D97706' },
  { name: 'Honey Bees', khmer: 'ថ្នាក់កូនឃ្មុំឧស្សាហ៍', ageGroup: 'Nursery' as EarlyChildhoodAgeGroup, code: 'NUR-A', color: '#0D9488' },
  { name: 'Little Pandas', khmer: 'ថ្នាក់ខ្លាឃ្មុំផេនដា', ageGroup: 'Kindergarten' as EarlyChildhoodAgeGroup, code: 'K2-A', color: '#7C3AED' },
  { name: 'Sea Turtles', khmer: 'ថ្នាក់អណ្ដើកសមុទ្រ', ageGroup: 'Kindergarten' as EarlyChildhoodAgeGroup, code: 'K1-B', color: '#0284C7' },
];

export const ClassroomModal: React.FC<ClassroomModalProps> = ({ classroomToEdit, onClose }) => {
  const { 
    allAccounts, 
    addClassroom, 
    updateClassroom, 
    deleteClassroom, 
    showToast, 
    levels,
    addLevel,
    updateLevel,
    signUp,
    updateAccount,
    selectedCampusId
  } = useApp();

  const isEditing = !!classroomToEdit;

  const teachers = allAccounts.filter(a => a.role === 'teacher');

  const [campusId, setCampusId] = useState<CampusId>(
    classroomToEdit?.campusId || (selectedCampusId !== 'ALL' ? selectedCampusId : 'DCH_SYW')
  );
  const [name, setName] = useState(classroomToEdit?.name || '');
  const [khmerName, setKhmerName] = useState(classroomToEdit?.khmerName || '');
  const [code, setCode] = useState(classroomToEdit?.code || 'PRE-K B');
  const [ageGroup, setAgeGroup] = useState<EarlyChildhoodAgeGroup>(classroomToEdit?.ageGroup || 'Pre-School');
  const [leadTeacherId, setLeadTeacherId] = useState(classroomToEdit?.leadTeacherId || (teachers[0]?.id || ''));
  const [assistantTeacherName, setAssistantTeacherName] = useState(classroomToEdit?.assistantTeacherName || 'Ms. Sokha Rath');
  const [enrolledStudents, setEnrolledStudents] = useState<number>(classroomToEdit?.enrolledStudents ?? 12);
  const [capacity, setCapacity] = useState<number>(classroomToEdit?.capacity ?? 18);
  const [room, setRoom] = useState(classroomToEdit?.room || 'Room 105');
  const [colorTheme, setColorTheme] = useState(classroomToEdit?.colorTheme || '#007A43');
  const [currentTheme, setCurrentTheme] = useState(classroomToEdit?.currentTheme || 'Our Trilingual Community & Helping Hands');

  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  // Inline Level state
  const [isLevelFormOpen, setIsLevelFormOpen] = useState(false);
  const [levelFormMode, setLevelFormMode] = useState<'add' | 'edit'>('add');
  const [inlineLevelName, setInlineLevelName] = useState('');
  const [inlineLevelKhmer, setInlineLevelKhmer] = useState('');
  const [inlineLevelDesc, setInlineLevelDesc] = useState('');

  // Inline Teacher state
  const [isTeacherFormOpen, setIsTeacherFormOpen] = useState(false);
  const [teacherFormMode, setTeacherFormMode] = useState<'add' | 'edit'>('add');
  const [inlineTeacherName, setInlineTeacherName] = useState('');
  const [inlineTeacherKhmer, setInlineTeacherKhmer] = useState('');
  const [inlineTeacherEmail, setInlineTeacherEmail] = useState('');
  const [inlineTeacherTitle, setInlineTeacherTitle] = useState('');
  const [inlineTeacherPhone, setInlineTeacherPhone] = useState('');

  useEffect(() => {
    if (classroomToEdit) {
      setName(classroomToEdit.name);
      setKhmerName(classroomToEdit.khmerName);
      setCode(classroomToEdit.code);
      setAgeGroup(classroomToEdit.ageGroup);
      setLeadTeacherId(classroomToEdit.leadTeacherId);
      setAssistantTeacherName(classroomToEdit.assistantTeacherName);
      setEnrolledStudents(classroomToEdit.enrolledStudents);
      setCapacity(classroomToEdit.capacity);
      setRoom(classroomToEdit.room);
      setColorTheme(classroomToEdit.colorTheme);
      setCurrentTheme(classroomToEdit.currentTheme);
    }
  }, [classroomToEdit]);

  // Set default teacher if not assigned and teachers load
  useEffect(() => {
    if (!leadTeacherId && teachers.length > 0) {
      setLeadTeacherId(teachers[0].id);
    }
  }, [teachers, leadTeacherId]);

  const handleInlineAddLevel = () => {
    setInlineLevelName('');
    setInlineLevelKhmer('');
    setInlineLevelDesc('');
    setLevelFormMode('add');
    setIsLevelFormOpen(true);
    setIsTeacherFormOpen(false); // Close teacher form to save screen real-estate
  };

  const handleInlineEditLevel = () => {
    const currentLvl = levels.find(l => l.displayName === ageGroup);
    if (!currentLvl) {
      showToast('Please select a valid level to edit', 'warning');
      return;
    }
    setInlineLevelName(currentLvl.name);
    setInlineLevelKhmer(currentLvl.khmerName || '');
    setInlineLevelDesc(currentLvl.description || '');
    setLevelFormMode('edit');
    setIsLevelFormOpen(true);
    setIsTeacherFormOpen(false);
  };

  const handleInlineSaveLevel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inlineLevelName.trim()) {
      showToast('Level name is required', 'warning');
      return;
    }
    const displayName = inlineLevelName.trim();

    const levelData = {
      name: inlineLevelName.trim(),
      displayName,
      khmerName: inlineLevelKhmer.trim() || undefined,
      description: inlineLevelDesc.trim() || undefined,
    };

    if (levelFormMode === 'edit') {
      const currentLvl = levels.find(l => l.displayName === ageGroup);
      if (currentLvl) {
        updateLevel(currentLvl.id, levelData);
        setAgeGroup(displayName);
        showToast(`Level updated to "${displayName}"`, 'success');
      }
    } else {
      const newLvl = addLevel(levelData);
      setAgeGroup(newLvl.displayName);
    }
    setIsLevelFormOpen(false);
  };

  const handleInlineAddTeacher = () => {
    setInlineTeacherName('');
    setInlineTeacherKhmer('');
    setInlineTeacherEmail('');
    setInlineTeacherTitle('Early Childhood Lead Educator');
    setInlineTeacherPhone('');
    setTeacherFormMode('add');
    setIsTeacherFormOpen(true);
    setIsLevelFormOpen(false); // Close level form to save space
  };

  const handleInlineEditTeacher = () => {
    const activeTeacher = teachers.find(t => t.id === leadTeacherId);
    if (!activeTeacher) {
      showToast('Please select a teacher to edit', 'warning');
      return;
    }
    setInlineTeacherName(activeTeacher.name);
    setInlineTeacherKhmer(activeTeacher.khmerName || '');
    setInlineTeacherEmail(activeTeacher.email || '');
    setInlineTeacherTitle(activeTeacher.title || 'Early Childhood Lead Educator');
    setInlineTeacherPhone(activeTeacher.phone || '');
    setTeacherFormMode('edit');
    setIsTeacherFormOpen(true);
    setIsLevelFormOpen(false);
  };

  const handleInlineSaveTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inlineTeacherName.trim()) {
      showToast('Educator name is required', 'warning');
      return;
    }

    if (teacherFormMode === 'edit') {
      if (leadTeacherId) {
        updateAccount(leadTeacherId, {
          name: inlineTeacherName.trim(),
          khmerName: inlineTeacherKhmer.trim() || undefined,
          title: inlineTeacherTitle.trim() || undefined,
          phone: inlineTeacherPhone.trim() || undefined,
        });
        showToast('Educator record updated successfully', 'success');
      }
    } else {
      const mail = inlineTeacherEmail.trim() || `educator.${Date.now()}@deweychildcare.edu.kh`;
      const registered = await signUp({
        name: inlineTeacherName.trim(),
        khmerName: inlineTeacherKhmer.trim() || 'គ្រូបង្រៀន',
        email: mail,
        role: 'teacher',
        title: inlineTeacherTitle.trim() || 'Early Childhood Lead Educator',
        phone: inlineTeacherPhone.trim() || '+855 (0) 12 345 000',
        status: 'active'
      });
      if (registered) {
        setLeadTeacherId(registered.id);
        showToast(`Registered and assigned new lead educator: ${registered.name}`, 'success');
      }
    }
    setIsTeacherFormOpen(false);
  };

  const handleApplyPreset = (preset: typeof NAME_PRESETS[0]) => {
    setName(preset.name);
    setKhmerName(preset.khmer);
    setAgeGroup(preset.ageGroup);
    setCode(preset.code);
    setColorTheme(preset.color);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      showToast('Classroom name is required', 'warning');
      return;
    }
    if (!code.trim()) {
      showToast('Classroom code (e.g. K1-A) is required', 'warning');
      return;
    }

    const selectedTeacher = allAccounts.find(a => a.id === leadTeacherId);
    const leadTeacherName = selectedTeacher ? selectedTeacher.name : 'Unassigned Lead Teacher';

    if (isEditing && classroomToEdit) {
      updateClassroom(classroomToEdit.id, {
        name: name.trim(),
        khmerName: khmerName.trim(),
        code: code.trim().toUpperCase(),
        campusId,
        ageGroup,
        leadTeacherId,
        leadTeacherName,
        assistantTeacherName: assistantTeacherName.trim(),
        enrolledStudents: Number(enrolledStudents),
        capacity: Number(capacity),
        room: room.trim(),
        colorTheme,
        currentTheme: currentTheme.trim(),
      });
      showToast(`Classroom "${name}" updated successfully.`, 'success');
    } else {
      addClassroom({
        name: name.trim(),
        khmerName: khmerName.trim() || name.trim(),
        code: code.trim().toUpperCase(),
        campusId,
        ageGroup,
        leadTeacherId,
        leadTeacherName,
        assistantTeacherName: assistantTeacherName.trim(),
        enrolledStudents: Number(enrolledStudents),
        capacity: Number(capacity),
        room: room.trim(),
        colorTheme,
        currentTheme: currentTheme.trim(),
      });
    }

    onClose();
  };

  const handleDelete = () => {
    if (classroomToEdit) {
      deleteClassroom(classroomToEdit.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
        
        {/* Header Banner */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-emerald-950 to-[#007A43] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-2xl border border-white/10">
              <School className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-white">
                  {isEditing ? 'Edit Classroom Environment' : 'Add New Kindergarten Classroom'}
                </h2>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-400 text-amber-950">
                  Admin Authority
                </span>
              </div>
              <p className="text-xs text-emerald-200 font-medium">
                Early childhood room & grade allocation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-300 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Delete Confirmation Alert */}
        {isConfirmingDelete && (
          <div className="p-6 bg-rose-50 border-b border-rose-200 space-y-4 animate-in fade-in">
            <div className="flex items-start gap-3 text-rose-700">
              <div className="p-2.5 bg-rose-100 rounded-xl shrink-0">
                <AlertTriangle className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <h3 className="text-sm font-black text-rose-950">Confirm Permanent Removal of Classroom</h3>
                <p className="text-xs text-rose-800 mt-1 leading-relaxed">
                  Are you sure you want to remove <strong className="text-rose-950">{name}</strong> ({code})? Teachers and active lesson plans tied to this classroom will retain their archives.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsConfirmingDelete(false)}
                className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl"
              >
                Keep Classroom
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold rounded-xl shadow-sm flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Confirm Removal</span>
              </button>
            </div>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {/* Quick Preset Badges (for new classroom) */}
          {!isEditing && (
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Quick Presets:</span>
                </span>
                <span className="text-[10px] text-slate-400">Click to autofill room details</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {NAME_PRESETS.map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => handleApplyPreset(p)}
                    className="px-2.5 py-1 bg-white hover:bg-emerald-50 hover:border-emerald-300 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-all flex items-center gap-1.5 shadow-2xs"
                  >
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                    <span>{p.name}</span>
                    <span className="text-[10px] text-slate-400 font-normal font-['Battambang']">({p.khmer})</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 1. CLASSROOM NAME & IDENTIFIERS */}
          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center justify-between">
              <span>1. Campus Assignment & Identity</span>
              <span className="text-[11px] text-emerald-700 font-semibold lowercase">Required</span>
            </label>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Assigned School Campus Tab *</span>
              </label>
              <select
                value={campusId}
                onChange={(e) => setCampusId(e.target.value as CampusId)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
              >
                {CAMPUS_LIST.filter(c => c.id !== 'ALL').map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.shortName} — {c.nameEnglish} ({c.location})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600">English Classroom Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Butterflies or Sunflowers"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600">Khmer Name (ភាសាខ្មែរ)</label>
                <input
                  type="text"
                  value={khmerName}
                  onChange={(e) => setKhmerName(e.target.value)}
                  placeholder="e.g. ថ្នាក់មេអំបៅ"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-emerald-600 font-['Battambang']"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <div className="flex items-center justify-between mb-0.5">
                  <label className="text-[11px] font-bold text-slate-600">Age Group & Stage *</label>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={handleInlineAddLevel}
                      className="text-[10px] font-extrabold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-1.5 py-0.5 rounded-lg border border-emerald-200/50 transition-colors"
                    >
                      + Add Level
                    </button>
                    <button
                      type="button"
                      onClick={handleInlineEditLevel}
                      className="text-[10px] font-extrabold text-amber-700 bg-amber-50 hover:bg-amber-100 px-1.5 py-0.5 rounded-lg border border-amber-200/50 transition-colors"
                    >
                      ✎ Edit Selected
                    </button>
                  </div>
                </div>
                <select
                  value={ageGroup}
                  onChange={(e) => setAgeGroup(e.target.value as EarlyChildhoodAgeGroup)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-emerald-600"
                >
                  {levels.map((lvl) => (
                    <option key={lvl.id} value={lvl.displayName}>
                      {lvl.displayName} {lvl.khmerName ? `(${lvl.khmerName})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 block mb-0.5">Classroom Code *</label>
                <div className="relative">
                  <Hash className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="e.g. PRE-K A or K1-B"
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-extrabold text-slate-900 focus:outline-emerald-600 uppercase"
                  />
                </div>
              </div>
            </div>

            {/* Inline Level Creator/Editor Sub-form */}
            {isLevelFormOpen && (
              <div className="p-4 bg-amber-50/40 border border-amber-200/60 rounded-2xl space-y-3.5 animate-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between border-b border-amber-200/40 pb-2">
                  <p className="text-xs font-black text-amber-950 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-[#D97706]" />
                    <span>{levelFormMode === 'edit' ? `Customize Level: ${ageGroup}` : 'Create Custom Learning Level'}</span>
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsLevelFormOpen(false)}
                    className="text-xs text-amber-700 hover:text-amber-950 font-bold"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-600 block">Level Name (English) *</label>
                    <input
                      type="text"
                      value={inlineLevelName}
                      onChange={(e) => setInlineLevelName(e.target.value)}
                      placeholder="e.g. Pre-Nursery, Nursery"
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:outline-emerald-600"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-600 block">Khmer Title</label>
                    <input
                      type="text"
                      value={inlineLevelKhmer}
                      onChange={(e) => setInlineLevelKhmer(e.target.value)}
                      placeholder="e.g. ថ្នាក់កូនក្មេង"
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 font-['Battambang'] focus:outline-emerald-600"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-600 block">Milestones Description</label>
                  <input
                    type="text"
                    value={inlineLevelDesc}
                    onChange={(e) => setInlineLevelDesc(e.target.value)}
                    placeholder="e.g. Early vocabulary, sensory milestone focus"
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:outline-emerald-600"
                  />
                </div>

                <div className="flex justify-end gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={handleInlineSaveLevel}
                    className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white text-[11px] font-extrabold rounded-lg shadow-2xs"
                  >
                    {levelFormMode === 'edit' ? 'Save Milestones' : 'Create & Apply Level'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 2. FACULTY & TEACHER ASSIGNMENT */}
          <div className="space-y-3 border-t border-slate-100 pt-3">
            <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center justify-between">
              <span>2. Assigned Faculty & Educators</span>
              <span className="text-[11px] text-slate-500">Classroom Personnel</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <div className="flex items-center justify-between mb-0.5">
                  <label className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Lead Educator</span>
                  </label>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={handleInlineAddTeacher}
                      className="text-[10px] font-extrabold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-1.5 py-0.5 rounded-lg border border-emerald-200/50 transition-colors"
                    >
                      + Add Educator
                    </button>
                    {leadTeacherId && (
                      <button
                        type="button"
                        onClick={handleInlineEditTeacher}
                        className="text-[10px] font-extrabold text-amber-700 bg-amber-50 hover:bg-amber-100 px-1.5 py-0.5 rounded-lg border border-amber-200/50 transition-colors"
                      >
                        ✎ Edit Record
                      </button>
                    )}
                  </div>
                </div>
                <select
                  value={leadTeacherId}
                  onChange={(e) => setLeadTeacherId(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-emerald-600"
                >
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.title})
                    </option>
                  ))}
                  {teachers.length === 0 && (
                    <option value="">No teachers available - Add staff first</option>
                  )}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 block mb-0.5">Assistant / Co-Teacher Name</label>
                <input
                  type="text"
                  value={assistantTeacherName}
                  onChange={(e) => setAssistantTeacherName(e.target.value)}
                  placeholder="e.g. Ms. Sokha Rath"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-emerald-600"
                />
              </div>
            </div>

            {/* Inline Teacher Creator/Editor Sub-form */}
            {isTeacherFormOpen && (
              <div className="p-4 bg-emerald-50/30 border border-emerald-200/40 rounded-2xl space-y-3.5 animate-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between border-b border-emerald-200/30 pb-2">
                  <p className="text-xs font-black text-emerald-950 flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-emerald-800" />
                    <span>{teacherFormMode === 'edit' ? 'Edit Lead Educator Record' : 'Register New Lead Educator'}</span>
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsTeacherFormOpen(false)}
                    className="text-xs text-emerald-800 hover:text-emerald-950 font-bold"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-600 block">Full Name (English) *</label>
                    <input
                      type="text"
                      value={inlineTeacherName}
                      onChange={(e) => setInlineTeacherName(e.target.value)}
                      placeholder="e.g. Mrs. Sophy Chhim"
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:outline-emerald-600"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-600 block">Khmer Name (ភាសាខ្មែរ)</label>
                    <input
                      type="text"
                      value={inlineTeacherKhmer}
                      onChange={(e) => setInlineTeacherKhmer(e.target.value)}
                      placeholder="e.g. ឆឹម សុភី"
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 font-['Battambang'] focus:outline-emerald-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-600 block">Professional Title *</label>
                    <input
                      type="text"
                      value={inlineTeacherTitle}
                      onChange={(e) => setInlineTeacherTitle(e.target.value)}
                      placeholder="e.g. Early Childhood Lead Educator"
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:outline-emerald-600"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-600 block">Contact Phone</label>
                    <input
                      type="text"
                      value={inlineTeacherPhone}
                      onChange={(e) => setInlineTeacherPhone(e.target.value)}
                      placeholder="e.g. +855 12 345 678"
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:outline-emerald-600"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-600 block">Email Address {teacherFormMode === 'add' ? '*' : '(Read-only)'}</label>
                    <input
                      type="email"
                      disabled={teacherFormMode === 'edit'}
                      value={inlineTeacherEmail}
                      onChange={(e) => setInlineTeacherEmail(e.target.value)}
                      placeholder="e.g. sophy.chhim@deweychildcare.edu.kh"
                      className="w-full px-2.5 py-1.5 bg-white disabled:bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:outline-emerald-600"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={handleInlineSaveTeacher}
                    className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white text-[11px] font-extrabold rounded-lg shadow-2xs"
                  >
                    {teacherFormMode === 'edit' ? 'Update Educator Record' : 'Register & Assign Educator'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 3. PHYSICAL SPACE & STUDENT CAPACITY */}
          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center justify-between">
              <span>3. Room Location & Student Capacity</span>
              <span className="text-[11px] text-slate-500">Facilities Allocation</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600">Room / Wing</label>
                <input
                  type="text"
                  required
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  placeholder="e.g. Room 102 or Wing B"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-emerald-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600">Enrolled Students</label>
                <input
                  type="number"
                  min="0"
                  max="40"
                  required
                  value={enrolledStudents}
                  onChange={(e) => setEnrolledStudents(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-emerald-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600">Max Capacity</label>
                <input
                  type="number"
                  min="1"
                  max="40"
                  required
                  value={capacity}
                  onChange={(e) => setCapacity(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-emerald-600"
                />
              </div>
            </div>
          </div>

          {/* 4. COLOR THEME & CURRENT WEEKLY THEME */}
          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center justify-between">
              <span>4. Visual Color Theme & Weekly Curriculum Focus</span>
              <span className="text-[11px] text-slate-500">Badge & Theme</span>
            </label>

            {/* Color Presets */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                <Palette className="w-3.5 h-3.5 text-slate-500" />
                <span>Classroom Identity Color</span>
              </label>
              <div className="flex items-center gap-2 flex-wrap">
                {COLOR_PRESETS.map((col) => (
                  <button
                    key={col.hex}
                    type="button"
                    onClick={() => setColorTheme(col.hex)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                      colorTheme === col.hex
                        ? 'ring-2 ring-emerald-500 border-transparent text-slate-900 bg-slate-100 shadow-2xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="w-3.5 h-3.5 rounded-full shadow-2xs" style={{ backgroundColor: col.hex }} />
                    <span>{col.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Initial / Active Weekly Theme Title</span>
              </label>
              <input
                type="text"
                value={currentTheme}
                onChange={(e) => setCurrentTheme(e.target.value)}
                placeholder="e.g. Our Natural World, Plants & Garden Exploration"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-emerald-600"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              {isEditing && (
                <button
                  type="button"
                  onClick={() => setIsConfirmingDelete(true)}
                  className="px-3 py-2 text-rose-700 hover:text-rose-900 hover:bg-rose-50 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors border border-rose-200"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Remove Classroom</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-none px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 sm:flex-none px-5 py-2.5 bg-[#007A43] hover:bg-[#006338] text-white text-xs font-extrabold rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4 text-amber-300" />
                <span>{isEditing ? 'Save Classroom Changes' : 'Create Kindergarten Classroom'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
