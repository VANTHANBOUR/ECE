import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LessonPlan, PlanAttachment } from '../types';
import { BrandLogo, DCHShield } from './BrandLogo';
import { OfficialTemplateView } from './OfficialTemplateView';
import { 
  X, 
  Printer, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  FileText, 
  Send, 
  MessageSquare, 
  Languages, 
  Sparkles, 
  Edit3, 
  ShieldCheck,
  Star,
  Check,
  Trash2,
  Award,
  Eye,
  FileSpreadsheet,
  FileImage,
  Table,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface LessonPlanDetailModalProps {
  plan: LessonPlan;
  onClose: () => void;
  onEdit: () => void;
}

export const LessonPlanDetailModal: React.FC<LessonPlanDetailModalProps> = ({
  plan,
  onClose,
  onEdit,
}) => {
  const { currentUser, adminReviewPlan, deleteLessonPlan, showToast } = useApp();

  // Tab switcher: Official Template vs Full Modular Dossier
  const [viewMode, setViewMode] = useState<'official_template' | 'full_dossier'>('official_template');

  // Review Form State
  const [adminComment, setAdminComment] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [rubricScores, setRubricScores] = useState({
    curriculumAlignment: 5,
    trilingualIntegration: 5,
    sensorySafety: 5,
    differentiation: 5,
  });

  const isAcademicAuthority = currentUser.role === 'admin' || currentUser.role === 'academic_officer';
  const isPlanOwner = currentUser.role === 'teacher' && currentUser.id === plan.teacherId;
  const canDelete = isAcademicAuthority || isPlanOwner;

  const getStatusBadge = (status: LessonPlan['status']) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-full text-xs font-extrabold tracking-wide uppercase">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
            Approved
          </span>
        );
      case 'revision_requested':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded-full text-xs font-extrabold tracking-wide uppercase">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
            Revision Requested
          </span>
        );
      case 'submitted':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-900 border border-blue-300 rounded-full text-xs font-extrabold tracking-wide uppercase">
            <Clock className="w-3.5 h-3.5 text-blue-700" />
            Submitted · Pending Review
          </span>
        );
      case 'under_review':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-100 text-purple-900 border border-purple-300 rounded-full text-xs font-extrabold tracking-wide uppercase">
            <Clock className="w-3.5 h-3.5 text-purple-700" />
            Under Review
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 border border-slate-300 rounded-full text-xs font-extrabold tracking-wide uppercase">
            Draft
          </span>
        );
    }
  };

  const handleAdminAction = (action: 'approved' | 'revision_requested' | 'comment_only') => {
    if (action === 'revision_requested' && !adminComment.trim()) {
      showToast('Please provide feedback notes explaining what revisions are needed.', 'warning');
      return;
    }

    const defaultComment = action === 'approved' 
      ? 'Lesson plan reviewed and officially approved for classroom execution.' 
      : adminComment;

    adminReviewPlan(plan.id, action, adminComment.trim() || defaultComment, rubricScores);

    if (action === 'approved') {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#007A43', '#F59E0B', '#10B981'],
      });
    }

    setAdminComment('');
  };

  const handleDeletePlan = () => {
    deleteLessonPlan(plan.id);
    setShowDeleteConfirm(false);
    onClose();
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportWord = () => {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Dewey Childcare House - ${plan.themeTitle}</title>
        <style>
          body { font-family: Calibri, Arial, sans-serif; margin: 40px; color: #000; }
          .header { text-align: center; margin-bottom: 25px; }
          .school-title { color: #006838; font-size: 24pt; font-weight: bold; text-transform: uppercase; margin: 0; font-family: Georgia, serif; }
          .doc-title { font-size: 18pt; font-weight: bold; text-decoration: underline; margin-top: 6px; }
          .meta-table { width: 100%; margin-bottom: 20px; font-size: 12pt; }
          .meta-table td { padding: 6px 0; }
          .section-title { font-weight: bold; font-size: 13pt; margin-top: 18px; margin-bottom: 8px; }
          .section-content { margin-left: 25px; font-size: 11pt; }
          table.session-table { width: 100%; border-collapse: collapse; border: 2px solid #000; margin-top: 8px; font-size: 10.5pt; }
          table.session-table th, table.session-table td { border: 1.5px solid #000; padding: 8px; text-align: left; vertical-align: top; }
          table.session-table th { background-color: #f2f2f2; font-weight: bold; }
          .duration-col { width: 12%; text-align: center; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="school-title">Dewey Childcare House</div>
          <div class="doc-title">Lesson Plan</div>
        </div>

        <table class="meta-table">
          <tr>
            <td width="50%"><strong>Date:</strong> ${plan.planDate || plan.startDate}</td>
            <td width="50%"><strong>Week:</strong> Week ${plan.weekNumber}</td>
          </tr>
          <tr>
            <td><strong>Class:</strong> ${plan.className} (${plan.ageGroup})</td>
            <td><strong>Time:</strong> ${plan.timeStart || '08:30 AM'} to ${plan.timeEnd || '11:30 AM'}</td>
          </tr>
        </table>

        <div class="section-title">I. &nbsp;&nbsp; Warm up/ circle time:</div>
        <div class="section-content">
          <p>${plan.warmUpCircleTime || plan.circleTimeActivities}</p>
        </div>

        <div class="section-title">II. &nbsp;&nbsp; 1<sup>st</sup> Session:</div>
        <div class="section-content">
          <p><strong>Subject:</strong> ${plan.firstSession?.subject || 'Language & Trilingual Early Literacy'}</p>
          <table class="session-table">
            <thead>
              <tr>
                <th width="30%">Topic/Activity</th>
                <th width="30%">Objective(s)</th>
                <th width="28%">Materials/ sources</th>
                <th class="duration-col">Duration (mns)</th>
              </tr>
            </thead>
            <tbody>
              ${plan.firstSession?.activities?.map(a => `
              <tr>
                <td><strong>${a.topicActivity}</strong></td>
                <td>${a.objectives}</td>
                <td>${a.materialsSources}</td>
                <td class="duration-col"><strong>${a.durationMins} mns</strong></td>
              </tr>
              `).join('') || ''}
            </tbody>
          </table>
        </div>

        <div class="section-title">III. &nbsp;&nbsp; 2<sup>nd</sup> Session:</div>
        <div class="section-content">
          <p><strong>Subject:</strong> ${plan.secondSession?.subject || 'Sensory Discovery Science & Creative Play'}</p>
          <table class="session-table">
            <thead>
              <tr>
                <th width="30%">Topic/Activity</th>
                <th width="30%">Objective(s)</th>
                <th width="28%">Materials/ sources</th>
                <th class="duration-col">Duration (mns)</th>
              </tr>
            </thead>
            <tbody>
              ${plan.secondSession?.activities?.map(a => `
              <tr>
                <td><strong>${a.topicActivity}</strong></td>
                <td>${a.objectives}</td>
                <td>${a.materialsSources}</td>
                <td class="duration-col"><strong>${a.durationMins} mns</strong></td>
              </tr>
              `).join('') || ''}
            </tbody>
          </table>
        </div>

        <div class="section-title">IV. &nbsp;&nbsp; Closing:</div>
        <div class="section-content">
          <p>${plan.closing || 'Review session highlights, tidy up learning areas, sing departure songs, and organize belongings for dismissal.'}</p>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', htmlContent], {
      type: 'application/msword;charset=utf-8'
    });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = `Dewey_Childcare_House_${plan.className.replace(/\s+/g, '_')}_Week_${plan.weekNumber}.doc`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(url);

    showToast(`Exported "${plan.themeTitle}" to Word (.doc)`, 'success');
  };

  const [previewAttachment, setPreviewAttachment] = useState<PlanAttachment | null>(null);

  const handleDownloadAttachment = (att: PlanAttachment) => {
    if (att.url) {
      const a = document.createElement('a');
      a.href = att.url;
      a.download = att.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      showToast(`Downloading "${att.name}"`, 'success');
    } else {
      const content = `Dewey Childcare House Lesson Plan Attachment\nTheme: ${plan.themeTitle}\nClass: ${plan.className} (${plan.ageGroup})\nDocument: ${att.name}\nSize: ${att.size}\nDate: ${att.uploadedAt}\n\nOfficial curriculum records for Dewey Childcare House (DCH).`;
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = att.name.endsWith('.txt') ? att.name : `${att.name}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast(`Downloading "${att.name}"`, 'success');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="bg-white rounded-3xl shadow-2xl border border-emerald-100 w-full max-w-4xl max-h-[94vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 print:shadow-none print:border-none print:max-h-none print:rounded-none">
        
        {/* Top Control Bar (Hidden on print) */}
        <div className="px-6 py-3.5 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Lesson Plan Dossier
            </span>
            <span className="text-slate-400">·</span>
            <span className="text-xs text-slate-300 font-medium">
              Week {plan.weekNumber} · {plan.className}
            </span>
          </div>

          {/* View Switcher Tabs in Header */}
          <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => setViewMode('official_template')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'official_template'
                  ? 'bg-[#007A43] text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Official Format Template</span>
            </button>

            <button
              onClick={() => setViewMode('full_dossier')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'full_dossier'
                  ? 'bg-[#007A43] text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Detailed EYFS Dossier</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {isPlanOwner && (
              <button
                onClick={onEdit}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                <span>Edit</span>
              </button>
            )}

            {canDelete && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-900/40 hover:bg-rose-800 text-rose-200 text-xs font-bold rounded-xl transition-colors"
                title="Delete this lesson plan"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                <span>Delete</span>
              </button>
            )}

            <button
              onClick={handleExportWord}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-300 text-xs font-bold rounded-xl transition-colors"
              title="Export to Word Document"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Word</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
              title="Print official letterhead lesson plan"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Document Canvas */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 print:p-6 print:overflow-visible">
          
          {/* VIEW MODE 1: OFFICIAL DCH TEMPLATE VIEW (MATCHING THE PAPER FORMAT) */}
          {viewMode === 'official_template' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <OfficialTemplateView plan={plan} />

              {/* Administrative Review Section if present */}
              {plan.feedbackHistory && plan.feedbackHistory.length > 0 && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 print:hidden">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-emerald-700" />
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                      Academic Office Review History
                    </h4>
                  </div>
                  <div className="space-y-2">
                    {plan.feedbackHistory.map((fb) => (
                      <div key={fb.id} className="p-3 bg-white border border-slate-200 rounded-xl text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">{fb.authorName} ({fb.authorRole})</span>
                          <span className="text-[10px] text-slate-500">{fb.createdAt}</span>
                        </div>
                        <p className="text-slate-700">{fb.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* VIEW MODE 2: FULL DETAILED EYFS DOSSIER */}
          {viewMode === 'full_dossier' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Brand Letterhead Header */}
              <div className="border-b-2 border-[#007A43] pb-4">
                <BrandLogo variant="full-letterhead" />
              </div>

              {/* Document Meta Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200/80">
                <div className="flex items-center gap-3.5">
                  <img
                    src={plan.teacherAvatar}
                    alt={plan.teacherName}
                    className="w-12 h-12 rounded-2xl object-cover ring-2 ring-emerald-500/30"
                  />
                  <div>
                    <p className="text-xs text-emerald-800 font-bold uppercase tracking-wider">
                      Lead Educator Submission
                    </p>
                    <h3 className="text-base font-extrabold text-slate-900">{plan.teacherName}</h3>
                    <p className="text-xs text-slate-600 font-medium">
                      {plan.className} · {plan.ageGroup}
                    </p>
                  </div>
                </div>

                <div className="flex flex-row sm:flex-col items-start sm:items-end justify-between sm:justify-center gap-1">
                  {getStatusBadge(plan.status)}
                  <span className="text-[11px] text-slate-500 font-medium">
                    {plan.term} · Week {plan.weekNumber} ({plan.startDate} to {plan.endDate})
                  </span>
                </div>
              </div>

              {/* Thematic Unit Banner */}
              <div className="p-5 bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#007A43]">
                  Thematic Curriculum Unit
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                  {plan.themeTitle}
                </h2>
                {plan.themeDescription && (
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
                    {plan.themeDescription}
                  </p>
                )}

                {/* Domains */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {plan.domains.map((dom, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 bg-emerald-100/70 text-[#006838] border border-emerald-200 rounded-lg text-[11px] font-bold"
                    >
                      {dom}
                    </span>
                  ))}
                </div>
              </div>

              {/* Trilingual Matrix Card */}
              <div className="p-5 bg-emerald-50/40 border border-emerald-200 rounded-2xl space-y-3">
                <div className="flex items-center gap-2">
                  <Languages className="w-4 h-4 text-emerald-700" />
                  <h4 className="text-xs font-black text-emerald-950 uppercase tracking-wider">
                    Trilingual Early Childhood Focus (English · Khmer · Chinese)
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-white p-3.5 rounded-xl border border-emerald-100 shadow-2xs">
                    <p className="text-[11px] font-extrabold text-blue-700 uppercase mb-1.5">
                      🇬🇧 English Vocabulary
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {plan.trilingualFocus.englishVocab.map((w, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-blue-50 text-blue-900 rounded text-xs font-semibold">
                          {w}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-emerald-100 shadow-2xs">
                    <p className="text-[11px] font-extrabold text-emerald-700 uppercase mb-1.5 font-['Battambang']">
                      🇰🇭 Khmer Vocabulary & Phonics
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {plan.trilingualFocus.khmerVocab.map((w, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-emerald-50 text-emerald-900 rounded text-xs font-semibold font-['Battambang']">
                          {w}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-emerald-100 shadow-2xs">
                    <p className="text-[11px] font-extrabold text-amber-700 uppercase mb-1.5">
                      🇨🇳 Mandarin Vocabulary & Pinyin
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {plan.trilingualFocus.chineseVocab.map((w, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-amber-50 text-amber-900 rounded text-xs font-semibold">
                          {w}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="bg-white p-3 rounded-xl border border-emerald-100 text-xs">
                    <span className="font-bold text-slate-700">🎵 Songs & Rhymes: </span>
                    <span className="text-slate-900 font-medium">{plan.trilingualFocus.songOrRhyme}</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-emerald-100 text-xs">
                    <span className="font-bold text-slate-700">📖 Featured Storybook: </span>
                    <span className="text-slate-900 font-medium">{plan.trilingualFocus.storyBook}</span>
                  </div>
                </div>
              </div>

              {/* Learning Objectives */}
              <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-3">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Targeted Learning Objectives & Milestones
                </h4>
                <ul className="space-y-2">
                  {plan.learningObjectives.map((obj, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-800 font-medium">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <span className="leading-relaxed">{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Daily Structure (Circle Time, Learning Centers, Outdoor Play) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <h4 className="text-xs font-bold text-slate-900">☀️ Circle Time & Morning Greeting</h4>
                  <p className="text-xs text-slate-700 leading-relaxed">{plan.circleTimeActivities}</p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <h4 className="text-xs font-bold text-slate-900">🏃 Outdoor Play & Gross Motor Activity</h4>
                  <p className="text-xs text-slate-700 leading-relaxed">{plan.outdoorSensoryPlay}</p>
                </div>
              </div>

              {/* Learning Centers */}
              <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-3">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Learning Centers & Exploration Stations
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {plan.learningCenters.map((lc) => (
                    <div key={lc.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                      <h5 className="text-xs font-bold text-[#007A43]">{lc.centerName}</h5>
                      <p className="text-[11px] text-slate-700 leading-relaxed">{lc.activityDescription}</p>
                      <p className="text-[10px] text-slate-500 pt-1">
                        <strong>Realia:</strong> {lc.materials}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Attachments Section */}
              {plan.attachments && plan.attachments.length > 0 && (
                <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-3 print:hidden">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-700" />
                    <span>Uploaded Curriculum Files & Documents</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {plan.attachments.map((att) => (
                      <div
                        key={att.id}
                        className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl"
                      >
                        <div className="flex items-center gap-2.5 truncate pr-2">
                          <FileText className="w-4 h-4 text-emerald-700 shrink-0" />
                          <div className="truncate">
                            <p className="text-xs font-bold text-slate-900 truncate">{att.name}</p>
                            <p className="text-[10px] text-slate-500">{att.size}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDownloadAttachment(att)}
                          className="px-2.5 py-1 bg-white hover:bg-slate-100 text-emerald-800 border border-slate-200 rounded-lg text-xs font-bold transition-colors shrink-0 flex items-center gap-1"
                        >
                          <Download className="w-3 h-3" />
                          <span>Download</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ACADEMIC OFFICER & ADMIN ONLY: Evaluation & Approval Panel */}
          {isAcademicAuthority && (
            <div className="p-5 bg-gradient-to-br from-emerald-50/80 to-blue-50/80 border-2 border-emerald-300 rounded-2xl space-y-4 print:hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {currentUser.role === 'admin' ? (
                    <ShieldCheck className="w-5 h-5 text-emerald-800" />
                  ) : (
                    <Award className="w-5 h-5 text-blue-800" />
                  )}
                  <h4 className="text-sm font-black text-emerald-950 uppercase tracking-wide">
                    {currentUser.role === 'admin' ? 'Principal & Academic Review Panel' : 'Academic Officer Quality & Approval Panel'}
                  </h4>
                </div>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                  currentUser.role === 'admin'
                    ? 'text-amber-800 bg-amber-100 border-amber-300'
                    : 'text-blue-800 bg-blue-100 border-blue-300'
                }`}>
                  {currentUser.role === 'admin' ? '👑 Principal Authority' : '🎓 Academic Officer Authority'}
                </span>
              </div>

              {/* Rubric Rating Sliders */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-3.5 rounded-xl border border-emerald-200">
                <div>
                  <label className="text-[10px] font-bold text-slate-600 block mb-1">
                    Curriculum Alignment: {rubricScores.curriculumAlignment}/5
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={rubricScores.curriculumAlignment}
                    onChange={(e) => setRubricScores({ ...rubricScores, curriculumAlignment: parseInt(e.target.value) })}
                    className="w-full accent-emerald-600"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-600 block mb-1">
                    Trilingual Immersion: {rubricScores.trilingualIntegration}/5
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={rubricScores.trilingualIntegration}
                    onChange={(e) => setRubricScores({ ...rubricScores, trilingualIntegration: parseInt(e.target.value) })}
                    className="w-full accent-emerald-600"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-600 block mb-1">
                    Sensory & Play Safety: {rubricScores.sensorySafety}/5
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={rubricScores.sensorySafety}
                    onChange={(e) => setRubricScores({ ...rubricScores, sensorySafety: parseInt(e.target.value) })}
                    className="w-full accent-emerald-600"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-600 block mb-1">
                    Differentiation: {rubricScores.differentiation}/5
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={rubricScores.differentiation}
                    onChange={(e) => setRubricScores({ ...rubricScores, differentiation: parseInt(e.target.value) })}
                    className="w-full accent-emerald-600"
                  />
                </div>
              </div>

              {/* Feedback notes */}
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Written Feedback / Directives to Lead Teacher
                </label>
                <textarea
                  rows={2}
                  value={adminComment}
                  onChange={(e) => setAdminComment(e.target.value)}
                  placeholder="Enter specific commendations, safety adjustments, or required additions..."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-emerald-600"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl border border-rose-200 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Plan</span>
                </button>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleAdminAction('comment_only')}
                    className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-300 transition-colors shadow-2xs"
                  >
                    Post Note Only
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAdminAction('revision_requested')}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-95"
                  >
                    ⚠️ Request Revisions
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAdminAction('approved')}
                    className="flex items-center gap-1.5 px-5 py-2 bg-[#007A43] hover:bg-[#006338] text-white text-xs font-bold rounded-xl shadow-sm transition-all active:scale-95"
                  >
                    <Check className="w-4 h-4 text-amber-300" />
                    <span>Approve Lesson Plan</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Letterhead Footer */}
          <div className="pt-4 border-t border-slate-200 text-center space-y-1">
            <p className="text-[11px] text-slate-500 font-semibold">
              Dewey Childcare House · Early Childhood Trilingual Academic Excellence · Phnom Penh, Cambodia
            </p>
            <p className="text-[10px] text-slate-400">
              Approved records are archived permanently in the DCH Academic Management Information System.
            </p>
          </div>
        </div>

        {/* Modal Bottom Close */}
        <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex justify-end print:hidden">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-300 transition-colors"
          >
            Close Dossier
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-60 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-rose-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-2.5 bg-rose-100 rounded-xl">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Delete Lesson Plan</h3>
                <p className="text-xs text-slate-500">Irreversible Action</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to delete <strong className="text-slate-900">"{plan.themeTitle}"</strong> (Week {plan.weekNumber} · {plan.className})?
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeletePlan}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Delete Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
