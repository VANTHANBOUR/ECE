import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { SchoolProfile } from '../types';
import { BrandLogo, SchoolLogoIcon, DCHShield } from './BrandLogo';
import { 
  Upload, 
  RotateCcw, 
  CheckCircle2, 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Sparkles, 
  Eye, 
  Palette, 
  FileImage,
  AlertCircle,
  HelpCircle,
  Save,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SchoolProfileSettingsProps {
  onSuccess?: () => void;
  isModal?: boolean;
}

export const SchoolProfileSettings: React.FC<SchoolProfileSettingsProps> = ({ 
  onSuccess,
  isModal = false 
}) => {
  const { 
    schoolProfile, 
    updateSchoolProfile, 
    uploadCustomLogo, 
    resetLogoToDefault, 
    showToast 
  } = useApp();

  const [formData, setFormData] = useState<SchoolProfile>({ ...schoolProfile });
  const [logoPreview, setLogoPreview] = useState<string | null>(schoolProfile.customLogoUrl || null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [activePreviewTab, setActivePreviewTab] = useState<'header' | 'letterhead' | 'compact'>('header');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [urlInput, setUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processFile(file);
    }
    // Reset file input value so user can re-upload same file if desired
    if (e.target) {
      e.target.value = '';
    }
  };

  const processFile = async (file: File) => {
    const validExtensions = ['.png', '.jpg', '.jpeg', '.svg', '.webp', '.gif', '.ico', '.bmp'];
    const fileName = file.name.toLowerCase();
    const isImageExt = validExtensions.some(ext => fileName.endsWith(ext));
    const isImageMime = file.type.startsWith('image/') || file.type === '';

    if (!isImageExt && !isImageMime) {
      showToast('Please select a valid image file (PNG, JPG, SVG, WebP, GIF)', 'error');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showToast('Image size exceeds 10MB limit. Please choose a smaller logo.', 'warning');
      return;
    }

    setIsUploading(true);
    try {
      const dataUrl = await uploadCustomLogo(file);
      setLogoPreview(dataUrl);
      setFormData(prev => ({ ...prev, customLogoUrl: dataUrl }));
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.error('File upload error:', err);
      showToast('Failed to process image logo. Please try another format.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleApplyUrl = async () => {
    if (!urlInput.trim()) {
      showToast('Please enter a valid image URL', 'warning');
      return;
    }
    setIsUploading(true);
    try {
      const trimmedUrl = urlInput.trim();
      await uploadCustomLogo(trimmedUrl);
      setLogoPreview(trimmedUrl);
      setFormData(prev => ({ ...prev, customLogoUrl: trimmedUrl }));
      setShowUrlInput(false);
      setUrlInput('');
      confetti({ particleCount: 35, spread: 50 });
    } catch {
      showToast('Could not load logo from URL', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const handleResetLogo = async () => {
    if (window.confirm('Restore the official master vector Dewey Childcare House shield logo?')) {
      await resetLogoToDefault();
      setLogoPreview(null);
      setFormData(prev => ({ ...prev, customLogoUrl: null }));
    }
  };

  const handleInputChange = (field: keyof SchoolProfile, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateSchoolProfile(formData);
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.5 }
      });
      if (onSuccess) {
        onSuccess();
      }
    } catch {
      showToast('Failed to save profile changes.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-900 to-[#005a2e] text-white p-5 rounded-2xl shadow-sm border border-emerald-700/40 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                  School Profile & Logo Management
                </h2>
                <span className="bg-amber-400 text-emerald-950 font-extrabold text-[10px] uppercase px-2 py-0.5 rounded-full tracking-wider">
                  Admin Master
                </span>
              </div>
              <p className="text-emerald-100 text-xs sm:text-sm mt-0.5">
                Update school identity, contact information, academic year, and upload custom school logos.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end md:self-auto">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-4 py-2 bg-amber-400 hover:bg-amber-300 active:scale-95 text-emerald-950 font-bold rounded-xl shadow-sm transition-all text-xs sm:text-sm cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-emerald-950 border-t-transparent rounded-full animate-spin" />
                  <span>Saving Updates...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save All Changes</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Logo Upload & Live Visual Inspection (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Logo Upload Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <FileImage className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-gray-900 text-sm sm:text-base">App & Portal Logo</h3>
              </div>
              {logoPreview && (
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Custom Logo Active
                </span>
              )}
            </div>

            {/* Drag & Drop Upload Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
                isDragging 
                  ? 'border-emerald-600 bg-emerald-50 scale-[1.01]' 
                  : 'border-emerald-200 hover:border-emerald-500 bg-emerald-50/40 hover:bg-emerald-50/70'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/svg+xml, image/webp"
                onChange={handleFileChange}
                className="hidden"
              />

              {/* Logo Display inside upload zone */}
              <div className="relative">
                {logoPreview ? (
                  <div className="w-24 h-28 bg-white rounded-xl shadow-xs border border-emerald-200 p-2 flex items-center justify-center overflow-hidden">
                    <img 
                      src={logoPreview} 
                      alt="Custom School Logo" 
                      className="w-full h-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ) : (
                  <div className="w-24 h-28 bg-white rounded-xl shadow-xs border border-emerald-200 p-2 flex items-center justify-center">
                    <DCHShield size={68} />
                  </div>
                )}

                {isUploading && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-xs rounded-xl flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-center gap-1.5 text-emerald-800 font-bold text-sm">
                  <Upload className="w-4 h-4 text-emerald-700" />
                  <span>Click to upload or drag & drop</span>
                </div>
                <p className="text-[11px] text-gray-500">
                  PNG, JPG, SVG, or WebP (Transparent background recommended)
                </p>
                <p className="text-[10px] text-emerald-700 font-medium bg-emerald-100/60 inline-block px-2 py-0.5 rounded-md">
                  Recommended size: 512 × 512px or Vector SVG
                </p>
              </div>
            </div>

            {/* Actions for Logo */}
            <div className="mt-4 pt-3 border-t border-gray-100 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="text-xs font-semibold px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-2xs"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Browse Image
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowUrlInput(prev => !prev)}
                    className="text-xs font-medium px-2.5 py-1.5 text-gray-600 hover:text-emerald-800 hover:bg-emerald-50 border border-gray-200 rounded-lg transition-colors"
                  >
                    {showUrlInput ? 'Hide URL' : 'Paste URL'}
                  </button>
                </div>

                {logoPreview && (
                  <button
                    type="button"
                    onClick={handleResetLogo}
                    className="text-xs font-semibold px-3 py-1.5 bg-gray-100 hover:bg-red-50 text-gray-700 hover:text-red-700 border border-gray-200 hover:border-red-200 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Restore Shield
                  </button>
                )}
              </div>

              {showUrlInput && (
                <div className="flex items-center gap-1.5 pt-1">
                  <input
                    type="text"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://example.com/logo.png or data:image/..."
                    className="flex-1 text-xs px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-emerald-600"
                  />
                  <button
                    type="button"
                    onClick={handleApplyUrl}
                    className="text-xs px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg transition-colors shrink-0"
                  >
                    Apply URL
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Live Preview Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-emerald-700" />
                <h3 className="font-bold text-gray-900 text-sm">Live Display Preview</h3>
              </div>
              
              {/* Preview Tabs */}
              <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-lg text-[11px] font-medium">
                <button
                  type="button"
                  onClick={() => setActivePreviewTab('header')}
                  className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                    activePreviewTab === 'header' ? 'bg-white text-emerald-800 font-bold shadow-xs' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Header
                </button>
                <button
                  type="button"
                  onClick={() => setActivePreviewTab('letterhead')}
                  className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                    activePreviewTab === 'letterhead' ? 'bg-white text-emerald-800 font-bold shadow-xs' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Document
                </button>
                <button
                  type="button"
                  onClick={() => setActivePreviewTab('compact')}
                  className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                    activePreviewTab === 'compact' ? 'bg-white text-emerald-800 font-bold shadow-xs' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Compact
                </button>
              </div>
            </div>

            {/* Preview Canvas */}
            <div className="p-4 bg-emerald-50/40 rounded-xl border border-emerald-100/80 flex items-center justify-center min-h-[140px] overflow-x-auto">
              <BrandLogo
                variant={activePreviewTab}
                customLogoUrl={logoPreview}
                schoolNameKhmer={formData.schoolNameKhmer}
                schoolNameEnglish={formData.schoolNameEnglish}
                taglineKhmer={formData.taglineKhmer}
                taglineEnglish={formData.taglineEnglish}
                portalBadgeText={formData.portalBadgeText}
                size="md"
              />
            </div>

            <div className="flex items-start gap-2 bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 text-[11px] text-amber-900">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p>
                Changes made here immediately update the top navigation header, authentication dialogs, classroom headers, printable PDF templates, and weekly compliance matrices across all teachers and staff portals.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Profile Information Form (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-xs space-y-5">
            <div className="border-b border-gray-100 pb-3">
              <h3 className="font-bold text-gray-900 text-base">School Identity & Names</h3>
              <p className="text-xs text-gray-500 mt-0.5">Define official names and trilingual headers used on certificates and lesson plans.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Khmer Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 font-['Battambang',sans-serif]">
                  ឈ្មោះសាលា (Khmer School Name) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.schoolNameKhmer}
                  onChange={(e) => handleInputChange('schoolNameKhmer', e.target.value)}
                  placeholder="ឌូវី ឆាល់ឃែរ៍ ហោស៍"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 focus:border-emerald-600 focus:bg-white rounded-xl text-sm font-['Battambang',sans-serif] outline-none transition-all"
                />
              </div>

              {/* English Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 font-['Outfit',sans-serif]">
                  English School Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.schoolNameEnglish}
                  onChange={(e) => handleInputChange('schoolNameEnglish', e.target.value)}
                  placeholder="Dewey Childcare House"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 focus:border-emerald-600 focus:bg-white rounded-xl text-sm font-semibold outline-none transition-all"
                />
              </div>

              {/* Khmer Tagline */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700">
                  ពាក្យស្លោក/កម្រិតសិក្សា (Khmer Tagline)
                </label>
                <input
                  type="text"
                  value={formData.taglineKhmer}
                  onChange={(e) => handleInputChange('taglineKhmer', e.target.value)}
                  placeholder="មត្តេយ្យសិក្សាអន្តរជាតិ ៣ ភាសា ( អង់គ្លេស-ខ្មែរ-ចិន )"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 focus:border-emerald-600 focus:bg-white rounded-xl text-xs font-['Kantumruy_Pro',sans-serif] outline-none transition-all"
                />
              </div>

              {/* English Tagline */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700">
                  English Tagline / Trilingual Scope
                </label>
                <input
                  type="text"
                  value={formData.taglineEnglish}
                  onChange={(e) => handleInputChange('taglineEnglish', e.target.value)}
                  placeholder="International Trilingual Kindergarten (English · Khmer · Chinese)"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 focus:border-emerald-600 focus:bg-white rounded-xl text-xs outline-none transition-all"
                />
              </div>

              {/* Portal Badge */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700">
                  Portal Header Badge Tag
                </label>
                <input
                  type="text"
                  value={formData.portalBadgeText}
                  onChange={(e) => handleInputChange('portalBadgeText', e.target.value)}
                  placeholder="DCH Portal"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 focus:border-emerald-600 focus:bg-white rounded-xl text-xs font-medium outline-none transition-all"
                />
              </div>

              {/* Academic Year */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                  Academic Year
                </label>
                <input
                  type="text"
                  value={formData.academicYear}
                  onChange={(e) => handleInputChange('academicYear', e.target.value)}
                  placeholder="2025 - 2026"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 focus:border-emerald-600 focus:bg-white rounded-xl text-xs font-semibold outline-none transition-all"
                />
              </div>
            </div>

            {/* Campus & Contact Information */}
            <div className="border-t border-gray-100 pt-4 space-y-4">
              <div>
                <h3 className="font-bold text-gray-900 text-sm sm:text-base">Campus & Contact Details</h3>
                <p className="text-xs text-gray-500 mt-0.5">Displayed on official curriculum reports, exports, and footer notices.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Campus Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-emerald-700" />
                    Campus Branch Name
                  </label>
                  <input
                    type="text"
                    value={formData.campus}
                    onChange={(e) => handleInputChange('campus', e.target.value)}
                    placeholder="Main Campus · Phnom Penh"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 focus:border-emerald-600 focus:bg-white rounded-xl text-xs outline-none transition-all"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-emerald-700" />
                    Official Contact Email
                  </label>
                  <input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                    placeholder="info@deweychildcare.edu.kh"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 focus:border-emerald-600 focus:bg-white rounded-xl text-xs outline-none transition-all"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-emerald-700" />
                    Phone Number(s)
                  </label>
                  <input
                    type="text"
                    value={formData.contactPhone}
                    onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                    placeholder="+855 23 888 999 / +855 12 345 678"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 focus:border-emerald-600 focus:bg-white rounded-xl text-xs outline-none transition-all"
                  />
                </div>

                {/* Website */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-emerald-700" />
                    Official Website URL
                  </label>
                  <input
                    type="text"
                    value={formData.websiteUrl || ''}
                    onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
                    placeholder="https://deweychildcare.edu.kh"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 focus:border-emerald-600 focus:bg-white rounded-xl text-xs outline-none transition-all"
                  />
                </div>
              </div>

              {/* Physical Address */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                  Campus Physical Address
                </label>
                <textarea
                  rows={2}
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Street 271, Sangkat Phsar Doeum Thkov, Khan Chamkarmon, Phnom Penh, Cambodia"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 focus:border-emerald-600 focus:bg-white rounded-xl text-xs outline-none transition-all resize-none"
                />
              </div>
            </div>

            {/* Save Button Bar */}
            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <div className="text-[11px] text-gray-500">
                Last updated: <span className="font-semibold text-gray-700">{formData.updatedAt ? new Date(formData.updatedAt).toLocaleDateString() : 'Initial system defaults'}</span>
                {formData.updatedBy && <span> by <span className="font-semibold text-emerald-800">{formData.updatedBy}</span></span>}
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#008242] hover:bg-[#006e37] active:scale-95 text-white font-bold rounded-xl shadow-xs transition-all text-xs sm:text-sm cursor-pointer disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Save & Apply Updates</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
