import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { EarlyChildhoodAgeGroup, CampusId, CAMPUS_LIST, getCampusClassroomOptions } from '../types';
import { X, UserPlus, GraduationCap, Check } from 'lucide-react';

interface NewTeacherModalProps {
  onClose: () => void;
}

export const NewTeacherModal: React.FC<NewTeacherModalProps> = ({ onClose }) => {
  const { registerTeacher, classrooms, showToast } = useApp();

  const [name, setName] = useState('');
  const [campusId, setCampusId] = useState<CampusId>('DCH_SYW');
  const [email, setEmail] = useState('');
  const [title, setTitle] = useState('Early Childhood Lead Educator');
  const [assignedLevel, setAssignedLevel] = useState<string>('Pre-Nursery AM');
  const [phone, setPhone] = useState('+855 (0) 12 ');
  const [roomNumber, setRoomNumber] = useState('');
  const [bio, setBio] = useState('Passionate about early childhood sensory development, inquiry-based play, and trilingual literacy.');

  useEffect(() => {
    const options = getCampusClassroomOptions(campusId);
    if (!options.some(o => o.id === assignedLevel)) {
      setAssignedLevel(options[0].id);
    }
  }, [campusId]);

  const AVATARS = [
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1580894732488-b22306f6e5ae?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  ];

  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Please enter the educator full name', 'warning');
      return;
    }

    const campusObj = CAMPUS_LIST.find(c => c.id === campusId);

    registerTeacher({
      name: name.trim(),
      campusId,
      campusName: campusObj?.shortName || campusObj?.nameEnglish || 'DCH SYW',
      registeredCampusIds: [campusId],
      email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '.')}@deweychildcare.edu.kh`,
      avatar: selectedAvatar,
      title: title.trim(),
      assignedClassId: assignedLevel,
      assignedClassName: assignedLevel,
      ageGroup: assignedLevel,
      phone: phone.trim(),
      roomNumber: roomNumber.trim(),
      bio: bio.trim(),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-emerald-100 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#006338] to-[#007A43] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/15 rounded-xl">
              <UserPlus className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-base font-bold">Register Educator Account</h2>
              <p className="text-xs text-emerald-100 font-medium">
                Faculty & Educator Provisioning
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-emerald-200 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Avatar selector */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-2">
              Select Profile Photo:
            </label>
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {AVATARS.map((av, idx) => (
                <img
                  key={idx}
                  src={av}
                  alt={`Avatar option ${idx}`}
                  onClick={() => setSelectedAvatar(av)}
                  className={`w-11 h-11 rounded-xl object-cover cursor-pointer ring-2 transition-all shrink-0 ${
                    selectedAvatar === av
                      ? 'ring-[#007A43] scale-105 shadow-xs'
                      : 'ring-slate-200 hover:ring-emerald-300 opacity-70 hover:opacity-100'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Full Name (English) *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Teacher Sarah Chen"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-emerald-600"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Campus Branch *
              </label>
              <select
                value={campusId}
                onChange={(e) => setCampusId(e.target.value as CampusId)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-emerald-600"
              >
                {CAMPUS_LIST.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.id === 'ALL' ? '🏢 Central HQ - Monitors All Campuses' : `${c.shortName} - ${c.nameEnglish}`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Institutional Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="teacher.name@deweychildcare.edu.kh"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-emerald-600"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Assigned Classroom
              </label>
              <select
                value={assignedLevel}
                onChange={(e) => setAssignedLevel(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-emerald-600"
              >
                {getCampusClassroomOptions(campusId).map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Faculty Title / Specialization
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Lead Teacher"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-emerald-600"
              />
            </div>
            
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Room Number (Optional)
              </label>
              <input
                type="text"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                placeholder="e.g. Room A12"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-emerald-600"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 bg-[#007A43] hover:bg-[#006338] text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-95"
            >
              <Check className="w-4 h-4 text-amber-300" />
              <span>Create Faculty Profile</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
