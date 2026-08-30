import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { UserAccount, UserRole, CampusId, CAMPUS_LIST } from '../types';
import { 
  X, 
  ShieldCheck, 
  Award, 
  GraduationCap, 
  User, 
  Mail, 
  Phone, 
  Building2, 
  CheckCircle2, 
  Trash2, 
  AlertTriangle,
  Briefcase,
  Layers,
  School,
  Sparkles,
  Lock,
  Camera,
  Upload
} from 'lucide-react';

interface StaffManagementModalProps {
  user: UserAccount | null;
  onClose: () => void;
}

const COMMON_POSITIONS = [
  'School Principal & Director',
  'Vice Principal & Early Years Head',
  'Academic Quality & Review Officer',
  'Early Childhood Lead Educator',
  'Co-Teacher & Kindergarten Assistant',
  'Khmer Language & Cultural Specialist (ភាសាខ្មែរ)',
  'Chinese Language Specialist (中文)',
  'Nursery & Toddler Care Coordinator',
  'Sensory & Motor Skills Specialist',
  'Special Needs & Inclusion Support Educator',
];

const AVATAR_OPTIONS = [
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580894732488-b22306f6e5ae?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
];

export const StaffManagementModal: React.FC<StaffManagementModalProps> = ({ user, onClose }) => {
  const { 
    currentUser, 
    updateAccount, 
    deleteAccount, 
    classrooms, 
    lessonPlans,
    showToast 
  } = useApp();

  if (!user) return null;

  const [name, setName] = useState(user.name);
  const [khmerName, setKhmerName] = useState(user.khmerName || '');
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState<UserRole>(user.role);
  const [title, setTitle] = useState(user.title);
  const [assignedClassId, setAssignedClassId] = useState(user.assignedClassId || 'Toddlers');
  const [campusId, setCampusId] = useState<CampusId>(user.campusId || 'DCH_SYW');
  const [phone, setPhone] = useState(user.phone || '');
  const [roomNumber, setRoomNumber] = useState(user.roomNumber || '');
  const [status, setStatus] = useState<'active' | 'suspended'>(user.status || 'active');
  const [bio, setBio] = useState(user.bio || '');
  const [avatar, setAvatar] = useState(user.avatar);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('File must be an image', 'error');
      return;
    }
    if (file.size > 2.5 * 1024 * 1024) {
      showToast('Image file too large (max 2.5MB)', 'warning');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAvatar(reader.result);
        showToast('Successfully processed custom picture', 'success');
      }
    };
    reader.onerror = () => {
      showToast('Failed to read image file', 'error');
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  useEffect(() => {
    setName(user.name);
    setKhmerName(user.khmerName || '');
    setEmail(user.email);
    setRole(user.role);
    setTitle(user.title);
    setAssignedClassId(user.assignedClassId || 'Toddlers');
    setCampusId(user.campusId || 'DCH_SYW');
    setPhone(user.phone || '');
    setRoomNumber(user.roomNumber || '');
    setStatus(user.status || 'active');
    setBio(user.bio || '');
    setAvatar(user.avatar);
    setIsConfirmingDelete(false);
  }, [user]);

  const userPlansCount = lessonPlans.filter(p => p.teacherId === user.id).length;
  const isSelf = currentUser?.id === user.id;

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    // Suggest appropriate default title if current title matches standard ones
    if (newRole === 'admin' && (title === 'Early Childhood Lead Educator' || title === 'Academic Review Officer')) {
      setTitle('School Administrator / Principal');
    } else if (newRole === 'academic_officer' && (title === 'Early Childhood Lead Educator' || title === 'School Administrator / Principal')) {
      setTitle('Academic Quality & Review Officer');
    } else if (newRole === 'teacher' && (title === 'School Administrator / Principal' || title === 'Academic Quality & Review Officer')) {
      setTitle('Early Childhood Lead Educator');
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Staff name cannot be empty', 'warning');
      return;
    }

    const selectedClass = classrooms.find(c => c.id === assignedClassId);

    updateAccount(user.id, {
      name: name.trim(),
      khmerName: khmerName.trim(),
      email: email.trim(),
      role,
      title: title.trim(),
      campusId,
      registeredCampusIds: Array.from(new Set([...(user.registeredCampusIds || []), campusId])) as CampusId[],
      assignedClassId: role === 'teacher' ? assignedClassId : undefined,
      assignedClassName: role === 'teacher' ? assignedClassId : undefined,
      ageGroup: role === 'teacher' ? assignedClassId : undefined,
      phone: phone.trim(),
      roomNumber: role === 'teacher' ? roomNumber.trim() : '',
      status,
      bio: bio.trim(),
      avatar,
    });

    showToast(`Staff profile for ${name} successfully updated.`, 'success');
    onClose();
  };

  const handleDelete = () => {
    if (isSelf) {
      showToast('You cannot remove your own active admin account session.', 'warning');
      return;
    }
    deleteAccount(user.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-emerald-950 to-[#006838] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-2xl border border-white/10">
              <Briefcase className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-white">Staff Management & Role Assignment</h2>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-400 text-amber-950">
                  Admin Authority
                </span>
              </div>
              <p className="text-xs text-emerald-200 font-medium">
                Assign institutional position, RBAC permissions, and classroom allocations
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

        {/* Delete Confirmation Warning (if triggered) */}
        {isConfirmingDelete ? (
          <div className="p-6 bg-rose-50 border-b border-rose-200 space-y-4 animate-in fade-in">
            <div className="flex items-start gap-3 text-rose-700">
              <div className="p-2.5 bg-rose-100 rounded-xl shrink-0">
                <AlertTriangle className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <h3 className="text-sm font-black text-rose-950">Confirm Permanent Removal of Staff</h3>
                <p className="text-xs text-rose-800 mt-1 leading-relaxed">
                  You are about to remove <strong className="text-rose-950">{user.name}</strong> ({user.title}) from the Dewey Childcare House directory.
                  {userPlansCount > 0 && (
                    <span className="block mt-1 font-semibold text-rose-900">
                      ⚠️ Note: This staff member has authored {userPlansCount} lesson plan(s) in the system.
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsConfirmingDelete(false)}
                className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl"
              >
                Keep Account
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
        ) : null}

        {/* Main Edit Form */}
        <form onSubmit={handleSave} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {/* Avatar & Basic Info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="relative group shrink-0">
              <img 
                src={avatar} 
                alt={name} 
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-600/30" 
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-sm border border-slate-200 text-emerald-700 hover:text-emerald-900 transition-colors"
                title="Upload custom image"
              >
                <Camera className="w-3 h-3" />
              </button>
            </div>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleFileChange}
            />

            <div className="flex-1 space-y-1.5 w-full overflow-hidden">
              <p className="text-xs font-bold text-slate-700 flex justify-between items-center">
                <span>Change Profile Avatar:</span>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-[10px] text-emerald-600 hover:text-emerald-800 flex items-center gap-1"
                >
                  <Upload className="w-3 h-3" /> Upload Custom
                </button>
              </p>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {AVATAR_OPTIONS.map((av, idx) => (
                  <img
                    key={idx}
                    src={av}
                    alt={`Avatar ${idx}`}
                    onClick={() => setAvatar(av)}
                    className={`w-9 h-9 rounded-xl object-cover cursor-pointer ring-2 transition-all shrink-0 ${
                      avatar === av ? 'ring-[#007A43] scale-105 shadow-2xs' : 'ring-transparent opacity-60 hover:opacity-100'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            {/* Status Selector */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 block">Account Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'active' | 'suspended')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                  status === 'active' 
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-300' 
                    : 'bg-rose-50 text-rose-900 border-rose-300'
                }`}
              >
                <option value="active">🟢 Active</option>
                <option value="suspended">🔴 Suspended</option>
              </select>
            </div>
          </div>

          {/* 1. ROLE ASSIGNMENT (RBAC) */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center justify-between">
              <span>1. Assign Institutional Role (RBAC)</span>
              <span className="text-[11px] text-emerald-700 font-semibold lowercase">Controls access level</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              
              {/* Lead Teacher Role Card */}
              <div
                onClick={() => handleRoleChange('teacher')}
                className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                  role === 'teacher'
                    ? 'bg-emerald-50/80 border-[#007A43] shadow-xs ring-2 ring-emerald-500/20'
                    : 'bg-white border-slate-200 hover:border-emerald-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="p-1.5 bg-emerald-100 text-[#007A43] rounded-xl">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  {role === 'teacher' && <CheckCircle2 className="w-4 h-4 text-[#007A43]" />}
                </div>
                <h4 className="text-xs font-black text-slate-900">Lead Teacher</h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                  Can create & submit weekly lesson plans and view their assigned classroom.
                </p>
              </div>

              {/* Academic Officer Role Card */}
              <div
                onClick={() => handleRoleChange('academic_officer')}
                className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                  role === 'academic_officer'
                    ? 'bg-blue-50/80 border-blue-600 shadow-xs ring-2 ring-blue-500/20'
                    : 'bg-white border-slate-200 hover:border-blue-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="p-1.5 bg-blue-100 text-blue-700 rounded-xl">
                    <Award className="w-4 h-4" />
                  </div>
                  {role === 'academic_officer' && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                </div>
                <h4 className="text-xs font-black text-slate-900">Academic Officer</h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                  Reviews, approves, grades rubrics, and evaluates curriculum quality school-wide.
                </p>
              </div>

              {/* Administrator Role Card */}
              <div
                onClick={() => handleRoleChange('admin')}
                className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                  role === 'admin'
                    ? 'bg-amber-50/80 border-amber-500 shadow-xs ring-2 ring-amber-500/20'
                    : 'bg-white border-slate-200 hover:border-amber-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="p-1.5 bg-amber-100 text-amber-800 rounded-xl">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  {role === 'admin' && <CheckCircle2 className="w-4 h-4 text-amber-600" />}
                </div>
                <h4 className="text-xs font-black text-slate-900">Administrator</h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                  Full institutional control: manage faculty, purge data, audit logs & settings.
                </p>
              </div>
            </div>
          </div>

          {/* 2. POSITION & JOB TITLE ASSIGNMENT */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center justify-between">
              <span>2. Assign Position Title</span>
              <span className="text-[11px] text-slate-500">Official Institutional Designation</span>
            </label>

            {/* Quick Position Select Presets */}
            <div className="space-y-1.5">
              <div className="relative">
                <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Early Childhood Lead Educator"
                  className="w-full pl-10 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              {/* Suggestions chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="text-[10px] font-bold text-slate-400 self-center mr-1">Presets:</span>
                {COMMON_POSITIONS.slice(0, 5).map((pos) => (
                  <button
                    key={pos}
                    type="button"
                    onClick={() => setTitle(pos)}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-colors ${
                      title === pos
                        ? 'bg-emerald-700 text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {pos}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 3. CAMPUS & CLASSROOM ASSIGNMENT */}
          <div className="space-y-3">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center justify-between">
                <span>3. Campus & Classroom Allocation</span>
                <span className="text-[11px] text-slate-500">Location Settings</span>
              </label>
              
              <div className={`grid grid-cols-1 ${role === 'teacher' ? 'sm:grid-cols-3' : 'sm:grid-cols-2'} gap-3`}>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-emerald-600" /> Target Campus Location
                  </label>
                  <select
                    value={campusId}
                    onChange={(e) => setCampusId(e.target.value as CampusId)}
                    className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
                  >
                    {CAMPUS_LIST.filter(c => c.id !== 'ALL').map(c => (
                      <option key={c.id} value={c.id}>{c.shortName} - {c.location}</option>
                    ))}
                  </select>
                </div>
                
                {role === 'teacher' ? (
                  <>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                        <School className="w-3 h-3 text-emerald-600" /> Assigned Kindergarten Classroom & Level
                      </label>
                      <select
                        value={assignedClassId}
                        onChange={(e) => setAssignedClassId(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
                      >
                        <option value="Toddlers">Toddlers</option>
                        <option value="Nursery">Nursery</option>
                        <option value="Pre-School">Pre-School</option>
                        <option value="Kindergarten">Kindergarten</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                        Room Number (Optional)
                      </label>
                      <input
                        type="text"
                        value={roomNumber}
                        onChange={(e) => setRoomNumber(e.target.value)}
                        placeholder="e.g. Room A12"
                        className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
                      />
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-3 p-2 bg-slate-50 border border-slate-200 rounded-xl h-full">
                    <Layers className="w-4 h-4 text-slate-500" />
                    <div>
                      <p className="text-[11px] font-bold text-slate-800">Supervisory Level</p>
                      <p className="text-[10px] text-slate-500">Oversees all rooms</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 4. NAME & CONTACT DETAILS */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-slate-700">
              4. Contact & Identity Information
            </label>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600">Full Name (English)</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-emerald-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600">Khmer Name (Optional)</label>
                <input
                  type="text"
                  value={khmerName}
                  onChange={(e) => setKhmerName(e.target.value)}
                  placeholder="e.g. អ្នកគ្រូ លីម សុភា"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-emerald-600 font-['Battambang']"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600">School Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-emerald-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+855 (0) 12 345 678"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-emerald-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600">Room / Office Location</label>
                <input
                  type="text"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  placeholder="e.g. Room 204 or Admin Wing"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-emerald-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600">Professional Bio & Focus</label>
                <input
                  type="text"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="e.g. Sensory play & trilingual literacy specialist"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-emerald-600"
                />
              </div>
            </div>
          </div>

          {/* Modal Actions Footer */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              {!isSelf && (
                <button
                  type="button"
                  onClick={() => setIsConfirmingDelete(true)}
                  className="px-3 py-2 text-rose-700 hover:text-rose-900 hover:bg-rose-50 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors border border-rose-200"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Remove Staff Member</span>
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
                <span>Save Position & Role Changes</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
