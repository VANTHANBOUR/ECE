import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { UserAccount } from '../types';
import { 
  X, 
  Camera, 
  Upload, 
  Image as ImageIcon, 
  User, 
  Phone, 
  MapPin, 
  Briefcase, 
  FileText, 
  Globe,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface UserProfileModalProps {
  onClose: () => void;
}

const PRESET_AVATARS = [
  { url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80', label: 'Admin Professional' },
  { url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', label: 'Educator Female' },
  { url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80', label: 'Teacher Female 1' },
  { url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80', label: 'Teacher Male 1' },
  { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', label: 'Teacher Male 2' },
  { url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80', label: 'Educator Female 2' },
  { url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', label: 'Educator Male 2' },
  { url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', label: 'Teacher Female 2' },
  { url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80', label: 'Principal Male' },
  { url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80', label: 'Educator Female 3' },
  { url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80', label: 'Educator Male 3' },
  { url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80', label: 'Teacher Female 3' },
];

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ onClose }) => {
  const { currentUser, updateAccount, showToast } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!currentUser) return null;

  // Form State
  const [name, setName] = useState(currentUser.name || '');
  const [khmerName, setKhmerName] = useState(currentUser.khmerName || '');
  const [title, setTitle] = useState(currentUser.title || '');
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [roomNumber, setRoomNumber] = useState(currentUser.roomNumber || '');
  const [bio, setBio] = useState(currentUser.bio || '');
  
  // Avatar Editing State
  const [avatar, setAvatar] = useState(currentUser.avatar || '');
  const [avatarInputMode, setAvatarInputMode] = useState<'preset' | 'url' | 'upload'>('upload');
  const [customUrl, setCustomUrl] = useState('');
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Handle Preset Selection
  const handleSelectPreset = (url: string) => {
    setAvatar(url);
    showToast('Selected preset portrait', 'info');
  };

  // Handle URL apply
  const handleApplyUrl = () => {
    if (!customUrl.trim()) {
      showToast('Please enter a valid URL', 'warning');
      return;
    }
    if (!customUrl.startsWith('http://') && !customUrl.startsWith('https://') && !customUrl.startsWith('data:image/')) {
      showToast('URL must start with http:// or https://', 'warning');
      return;
    }
    setAvatar(customUrl.trim());
    showToast('Applied custom image URL', 'success');
  };

  // Process File to Base64
  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setUploadError('File must be an image (PNG, JPG, SVG, WebP)');
      showToast('File must be an image', 'error');
      return;
    }

    if (file.size > 2.5 * 1024 * 1024) {
      setUploadError('Image size exceeds 2.5MB. Please choose a smaller image.');
      showToast('Image file too large (max 2.5MB)', 'warning');
      return;
    }

    setUploadError(null);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAvatar(reader.result);
        showToast('Successfully processed & loaded custom picture', 'success');
      }
    };
    reader.onerror = () => {
      setUploadError('Failed to read image file.');
      showToast('Failed to read image file', 'error');
    };
    reader.readAsDataURL(file);
  };

  // Handle File Input selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  // Drag and drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  // Submit profile updates
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Staff Name is required', 'warning');
      return;
    }

    const updates: Partial<UserAccount> = {
      name: name.trim(),
      khmerName: khmerName.trim(),
      title: title.trim(),
      phone: phone.trim(),
      roomNumber: roomNumber.trim(),
      bio: bio.trim(),
      avatar: avatar
    };

    updateAccount(currentUser.id, updates);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto bg-black/60 backdrop-blur-xs">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Camera className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">
                Edit Personal Staff Profile
              </h2>
              <p className="text-xs text-gray-500">
                Update your account avatar, biography, and Khmer details
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-200/70 hover:bg-gray-300 flex items-center justify-center text-gray-700 hover:text-gray-900 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          
          {/* Top Avatar Layout Section */}
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-gray-100">
            <div className="relative group shrink-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-[#007A43] ring-4 ring-emerald-500/10 shadow-md">
                <img 
                  src={avatar} 
                  alt="Avatar Preview" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-emerald-700 text-white p-1.5 rounded-xl shadow-md border border-white">
                <Camera className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="flex-1 w-full space-y-3">
              <h3 className="text-xs font-black text-gray-800 uppercase tracking-wider">
                Change Profile Picture
              </h3>

              {/* Mode switch button tab */}
              <div className="flex p-0.5 bg-gray-100 rounded-xl border border-gray-200/80 text-xs">
                <button
                  type="button"
                  onClick={() => setAvatarInputMode('preset')}
                  className={`flex-1 py-1.5 px-3 rounded-lg font-bold transition-all ${
                    avatarInputMode === 'preset'
                      ? 'bg-white text-emerald-950 shadow-2xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Portrait Presets
                </button>
                <button
                  type="button"
                  onClick={() => setAvatarInputMode('upload')}
                  className={`flex-1 py-1.5 px-3 rounded-lg font-bold transition-all ${
                    avatarInputMode === 'upload'
                      ? 'bg-white text-emerald-950 shadow-2xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  File Upload
                </button>
                <button
                  type="button"
                  onClick={() => setAvatarInputMode('url')}
                  className={`flex-1 py-1.5 px-3 rounded-lg font-bold transition-all ${
                    avatarInputMode === 'url'
                      ? 'bg-white text-emerald-950 shadow-2xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Image URL
                </button>
              </div>

              {/* URL INPUT MODE */}
              {avatarInputMode === 'url' && (
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                    className="flex-1 px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:bg-white focus:outline-emerald-600"
                  />
                  <button
                    type="button"
                    onClick={handleApplyUrl}
                    className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-colors"
                  >
                    Apply URL
                  </button>
                </div>
              )}

              {/* FILE UPLOAD MODE */}
              {avatarInputMode === 'upload' && (
                <div className="space-y-2">
                  <div 
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    onClick={triggerFileSelect}
                    className={`border-2 border-dashed rounded-xl p-3 text-center cursor-pointer transition-all ${
                      isDragActive 
                        ? 'border-emerald-600 bg-emerald-50/50' 
                        : 'border-gray-300 hover:border-emerald-500 hover:bg-gray-50/50'
                    }`}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <Upload className="w-5 h-5 text-gray-400 mx-auto mb-1.5" />
                    <p className="text-xs font-bold text-gray-700">
                      Drag & drop your picture here, or <span className="text-[#007A43] underline">browse files</span>
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      Supports PNG, JPG, WebP. Maximum size 2.5MB.
                    </p>
                  </div>
                  {uploadError && (
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-rose-600">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{uploadError}</span>
                    </div>
                  )}
                </div>
              )}

              {/* PORTRAIT PRESETS MODE */}
              {avatarInputMode === 'preset' && (
                <p className="text-[10px] text-gray-500 font-medium">
                  Select a stylized professional early childhood educator portrait below:
                </p>
              )}
            </div>
          </div>

          {/* PRESETS GRID (Sits outside header row to breathe) */}
          {avatarInputMode === 'preset' && (
            <div className="p-3 bg-gray-50 border border-gray-200/60 rounded-2xl">
              <div className="grid grid-cols-6 sm:grid-cols-12 gap-2">
                {PRESET_AVATARS.map((p, idx) => {
                  const isSelected = avatar === p.url;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectPreset(p.url)}
                      title={p.label}
                      className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all hover:scale-105 active:scale-95 ${
                        isSelected 
                          ? 'border-[#007A43] ring-4 ring-emerald-500/25 scale-102' 
                          : 'border-gray-200 hover:border-emerald-400'
                      }`}
                    >
                      <img 
                        src={p.url} 
                        alt={p.label} 
                        className="w-full h-full object-cover"
                      />
                      {isSelected && (
                        <div className="absolute inset-0 bg-[#007a43]/20 flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4 text-white drop-shadow-md" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* User Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-gray-700 uppercase tracking-wide flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#007A43]" />
                <span>Full Name (English)</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Teacher Name"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:bg-white focus:outline-emerald-600 font-bold"
              />
            </div>

            {/* Khmer Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-gray-700 uppercase tracking-wide flex items-center gap-1.5 font-['Battambang']">
                <Globe className="w-3.5 h-3.5 text-[#007A43]" />
                <span>Khmer Name (ឈ្មោះជាភាសាខ្មែរ)</span>
              </label>
              <input
                type="text"
                value={khmerName}
                onChange={(e) => setKhmerName(e.target.value)}
                placeholder="ឈ្មោះបុគ្គលិក"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:bg-white focus:outline-emerald-600 font-bold font-['Battambang']"
              />
            </div>

            {/* Job Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-gray-700 uppercase tracking-wide flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-[#007A43]" />
                <span>Professional Title / Role</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Nursery Lead Educator"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:bg-white focus:outline-emerald-600"
              />
            </div>

            {/* Contact Phone */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-gray-700 uppercase tracking-wide flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#007A43]" />
                <span>Contact Phone</span>
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+855 (0) 12 345 678"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:bg-white focus:outline-emerald-600"
              />
            </div>

            {/* Office / Classroom Room Number */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-black text-gray-700 uppercase tracking-wide flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#007A43]" />
                <span>Assigned Office / Classroom Wing</span>
              </label>
              <input
                type="text"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                placeholder="e.g. Preschool Wing, Room 204"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:bg-white focus:outline-emerald-600"
              />
            </div>

            {/* Professional Biography */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-black text-gray-700 uppercase tracking-wide flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#007A43]" />
                <span>Staff Bio & Curriculum Focus</span>
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about your educational philosophy, credentials, or childcare background..."
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:bg-white focus:outline-emerald-600 leading-relaxed"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Cancel Changes
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#007A43] hover:bg-[#006838] text-white text-xs font-extrabold rounded-xl shadow-xs transition-all cursor-pointer"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
