import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Classroom,
  EarlyChildhoodAgeGroup, 
  EarlyChildhoodDomain, 
  LessonPlan, 
  PlanAttachment,
  SessionActivityRow,
  OfficialSessionPlan,
  CAMPUS_LIST
} from '../types';
import { OfficialTemplateView } from './OfficialTemplateView';
import { SchoolLogoIcon } from './BrandLogo';
import { formatDateDDMMYYYY, toHtmlDateValue } from '../utils/dateUtils';
import { 
  X, 
  UploadCloud, 
  FileText, 
  Trash2, 
  Sparkles, 
  Plus, 
  Check, 
  BookOpen, 
  Languages, 
  Layers, 
  Calendar,
  Clock,
  Download, 
  Eye, 
  FileSpreadsheet, 
  FileImage, 
  Loader2,
  Printer,
  Table,
  Sliders,
  FileCheck2
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface LessonPlanEditorProps {
  initialPlan?: LessonPlan | null;
  onClose: () => void;
  onSaved?: () => void;
}

const DOMAIN_OPTIONS: EarlyChildhoodDomain[] = [
  'Language & Early Literacy',
  'Mathematics & Logic',
  'Sensory & Discovery Science',
  'Creative Arts & Music',
  'Physical & Motor Skills',
  'Social-Emotional Learning',
  'Khmer Language & Culture',
  'Mandarin Language Immersion',
];

export const LessonPlanEditor: React.FC<LessonPlanEditorProps> = ({
  initialPlan,
  onClose,
  onSaved,
}) => {
  const { currentUser, classrooms, createLessonPlan, updateLessonPlan, showToast, selectedCampusId, schoolProfile } = useApp();

  const activeCampus = selectedCampusId ? CAMPUS_LIST.find(c => c.id === selectedCampusId) : null;
  const isDKCampus = activeCampus?.brand === 'DK' || selectedCampusId?.startsWith('DK_');
  const institutionKhmer = isDKCampus ? (activeCampus?.nameKhmer || 'សាលាមត្តេយ្យ ឌូវី') : (schoolProfile?.schoolNameKhmer || 'ឌូវី ឆាល់ឃែរ៍ ហោស៍');
  const institutionEnglish = isDKCampus ? 'Dewey Kindergarten' : (schoolProfile?.schoolNameEnglish || 'Dewey Childcare House');

  // Direct Level options for DK and DCH
  const DK_LEVEL_OPTIONS = useMemo<Classroom[]>(() => [
    {
      id: 'dk_opt_k1_am',
      name: 'K1 - AM',
      khmerName: 'មត្តេយ្យកម្រិត ១ (ព្រឹក)',
      code: 'K1-AM',
      campusId: 'DK_ROMCHEK_4',
      ageGroup: 'Kindergarten',
      leadTeacherId: '',
      leadTeacherName: '',
      assistantTeacherName: '',
      enrolledStudents: 20,
      capacity: 25,
      room: 'K1 Room AM',
      colorTheme: '#10B981',
      currentTheme: 'K1 AM Curriculum',
    },
    {
      id: 'dk_opt_k1_pm',
      name: 'K1 - PM',
      khmerName: 'មត្តេយ្យកម្រិត ១ (រសៀល)',
      code: 'K1-PM',
      campusId: 'DK_ROMCHEK_4',
      ageGroup: 'Kindergarten',
      leadTeacherId: '',
      leadTeacherName: '',
      assistantTeacherName: '',
      enrolledStudents: 20,
      capacity: 25,
      room: 'K1 Room PM',
      colorTheme: '#059669',
      currentTheme: 'K1 PM Curriculum',
    },
    {
      id: 'dk_opt_k2_am',
      name: 'K2 - AM',
      khmerName: 'មត្តេយ្យកម្រិត ២ (ព្រឹក)',
      code: 'K2-AM',
      campusId: 'DK_ROMCHEK_4',
      ageGroup: 'Kindergarten',
      leadTeacherId: '',
      leadTeacherName: '',
      assistantTeacherName: '',
      enrolledStudents: 20,
      capacity: 25,
      room: 'K2 Room AM',
      colorTheme: '#3B82F6',
      currentTheme: 'K2 AM Curriculum',
    },
    {
      id: 'dk_opt_k2_pm',
      name: 'K2 - PM',
      khmerName: 'មត្តេយ្យកម្រិត ២ (រសៀល)',
      code: 'K2-PM',
      campusId: 'DK_ROMCHEK_4',
      ageGroup: 'Kindergarten',
      leadTeacherId: '',
      leadTeacherName: '',
      assistantTeacherName: '',
      enrolledStudents: 20,
      capacity: 25,
      room: 'K2 Room PM',
      colorTheme: '#2563EB',
      currentTheme: 'K2 PM Curriculum',
    },
    {
      id: 'dk_opt_k3_am',
      name: 'K3 - AM',
      khmerName: 'មត្តេយ្យកម្រិត ៣ (ព្រឹក)',
      code: 'K3-AM',
      campusId: 'DK_ROMCHEK_4',
      ageGroup: 'Kindergarten',
      leadTeacherId: '',
      leadTeacherName: '',
      assistantTeacherName: '',
      enrolledStudents: 20,
      capacity: 25,
      room: 'K3 Room AM',
      colorTheme: '#8B5CF6',
      currentTheme: 'K3 AM Curriculum',
    },
    {
      id: 'dk_opt_k3_pm',
      name: 'K3 - PM',
      khmerName: 'មត្តេយ្យកម្រិត ៣ (រសៀល)',
      code: 'K3-PM',
      campusId: 'DK_ROMCHEK_4',
      ageGroup: 'Kindergarten',
      leadTeacherId: '',
      leadTeacherName: '',
      assistantTeacherName: '',
      enrolledStudents: 20,
      capacity: 25,
      room: 'K3 Room PM',
      colorTheme: '#7C3AED',
      currentTheme: 'K3 PM Curriculum',
    },
  ], []);

  const DCH_LEVEL_OPTIONS = useMemo<Classroom[]>(() => [
    {
      id: 'dch_opt_prenursery_am',
      name: 'Pre-Nursery - AM',
      khmerName: 'ថ្នាក់មុនមត្តេយ្យ (ព្រឹក)',
      code: 'PNUR-AM',
      campusId: 'DCH_SYW',
      ageGroup: 'Pre-Nursery',
      leadTeacherId: '',
      leadTeacherName: '',
      assistantTeacherName: '',
      enrolledStudents: 15,
      capacity: 18,
      room: 'Pre-Nursery Suite AM',
      colorTheme: '#10B981',
      currentTheme: 'Pre-Nursery AM Curriculum',
    },
    {
      id: 'dch_opt_prenursery_pm',
      name: 'Pre-Nursery - PM',
      khmerName: 'ថ្នាក់មុនមត្តេយ្យ (រសៀល)',
      code: 'PNUR-PM',
      campusId: 'DCH_SYW',
      ageGroup: 'Pre-Nursery',
      leadTeacherId: '',
      leadTeacherName: '',
      assistantTeacherName: '',
      enrolledStudents: 15,
      capacity: 18,
      room: 'Pre-Nursery Suite PM',
      colorTheme: '#059669',
      currentTheme: 'Pre-Nursery PM Curriculum',
    },
    {
      id: 'dch_opt_nursery_am',
      name: 'Nursery - AM',
      khmerName: 'ថ្នាក់មត្តេយ្យទាប (ព្រឹក)',
      code: 'NUR-AM',
      campusId: 'DCH_SYW',
      ageGroup: 'Nursery',
      leadTeacherId: '',
      leadTeacherName: '',
      assistantTeacherName: '',
      enrolledStudents: 18,
      capacity: 20,
      room: 'Nursery Suite AM',
      colorTheme: '#0EA5E9',
      currentTheme: 'Nursery AM Curriculum',
    },
    {
      id: 'dch_opt_nursery_pm',
      name: 'Nursery - PM',
      khmerName: 'ថ្នាក់មត្តេយ្យទាប (រសៀល)',
      code: 'NUR-PM',
      campusId: 'DCH_SYW',
      ageGroup: 'Nursery',
      leadTeacherId: '',
      leadTeacherName: '',
      assistantTeacherName: '',
      enrolledStudents: 18,
      capacity: 20,
      room: 'Nursery Suite PM',
      colorTheme: '#0284C7',
      currentTheme: 'Nursery PM Curriculum',
    },
    {
      id: 'dch_opt_preschool_am',
      name: 'Pre-School - AM',
      khmerName: 'ថ្នាក់ត្រៀមមត្តេយ្យ (ព្រឹក)',
      code: 'PREK-AM',
      campusId: 'DCH_SYW',
      ageGroup: 'Pre-School',
      leadTeacherId: '',
      leadTeacherName: '',
      assistantTeacherName: '',
      enrolledStudents: 20,
      capacity: 22,
      room: 'Pre-School Suite AM',
      colorTheme: '#8B5CF6',
      currentTheme: 'Pre-School AM Curriculum',
    },
    {
      id: 'dch_opt_preschool_pm',
      name: 'Pre-School - PM',
      khmerName: 'ថ្នាក់ត្រៀមមត្តេយ្យ (រសៀល)',
      code: 'PREK-PM',
      campusId: 'DCH_SYW',
      ageGroup: 'Pre-School',
      leadTeacherId: '',
      leadTeacherName: '',
      assistantTeacherName: '',
      enrolledStudents: 20,
      capacity: 22,
      room: 'Pre-School Suite PM',
      colorTheme: '#7C3AED',
      currentTheme: 'Pre-School PM Curriculum',
    },
    {
      id: 'dch_opt_kindergarten_am',
      name: 'Kindergarten - AM',
      khmerName: 'ថ្នាក់មត្តេយ្យ (ព្រឹក)',
      code: 'KIND-AM',
      campusId: 'DCH_SYW',
      ageGroup: 'Kindergarten',
      leadTeacherId: '',
      leadTeacherName: '',
      assistantTeacherName: '',
      enrolledStudents: 22,
      capacity: 25,
      room: 'Kindergarten Suite AM',
      colorTheme: '#EC4899',
      currentTheme: 'Kindergarten AM Curriculum',
    },
    {
      id: 'dch_opt_kindergarten_pm',
      name: 'Kindergarten - PM',
      khmerName: 'ថ្នាក់មត្តេយ្យ (រសៀល)',
      code: 'KIND-PM',
      campusId: 'DCH_SYW',
      ageGroup: 'Kindergarten',
      leadTeacherId: '',
      leadTeacherName: '',
      assistantTeacherName: '',
      enrolledStudents: 22,
      capacity: 25,
      room: 'Kindergarten Suite PM',
      colorTheme: '#DB2777',
      currentTheme: 'Kindergarten PM Curriculum',
    },
  ], []);

  // Filter classrooms according to active DK / DCH template context
  const availableClassrooms = useMemo(() => {
    if (isDKCampus) {
      const dkClassrooms = classrooms.filter(c => 
        (selectedCampusId && selectedCampusId !== 'ALL' ? c.campusId === selectedCampusId : (c.campusId?.startsWith('DK_') || c.code?.includes('K') || ['cls_eagles', 'cls_sunflowers', 'cls_starfish', 'cls_dolphins'].includes(c.id)))
      );
      const existing = dkClassrooms.filter(c => !c.id.startsWith('dk_opt_'));
      return [...DK_LEVEL_OPTIONS, ...existing];
    } else {
      const dchClassrooms = classrooms.filter(c => 
        (selectedCampusId && selectedCampusId !== 'ALL' ? c.campusId === selectedCampusId : (c.campusId?.startsWith('DCH_') || c.campusId === 'CENTRAL' || ['cls_explorers', 'cls_pandas', 'cls_butterflies', 'cls_lotus'].includes(c.id)))
      );
      const existing = dchClassrooms.filter(c => !c.id.startsWith('dch_opt_'));
      return [...DCH_LEVEL_OPTIONS, ...existing];
    }
  }, [classrooms, selectedCampusId, isDKCampus, DK_LEVEL_OPTIONS, DCH_LEVEL_OPTIONS]);

  // Format label for Classroom & Level options
  const getClassroomAndLevelLabel = useCallback((c: Classroom) => {
    if (isDKCampus) {
      if (c.id.startsWith('dk_opt_')) {
        return c.name; // K1 AM, K1 PM, K2 AM, etc.
      }
      let level = 'K1';
      if (c.code?.includes('K3') || c.name.includes('K3') || c.name.toLowerCase().includes('k3') || c.khmerName?.includes('៣')) {
        level = 'K3';
      } else if (c.code?.includes('K2') || c.name.includes('K2') || c.name.toLowerCase().includes('k2') || c.khmerName?.includes('២') || c.ageGroup === 'Pre-School') {
        level = 'K2';
      } else if (c.code?.includes('K1') || c.name.includes('K1') || c.name.toLowerCase().includes('k1') || c.khmerName?.includes('១') || c.ageGroup === 'Kindergarten' || c.ageGroup === 'Nursery') {
        level = 'K1';
      }
      const cleanName = c.name.replace(/\s*\((K1|K2|K3|Kindergarten|Pre-School|Nursery|Pre-Nursery|Prep)\)/gi, '').trim();
      if (cleanName === 'K1' || cleanName === 'K2' || cleanName === 'K3') {
        return cleanName;
      }
      return `${cleanName} (${level})`;
    } else {
      if (c.id.startsWith('dch_opt_')) {
        return c.name;
      }
      let level = (c.ageGroup as string) || 'Pre-School';
      if (level === 'Toddlers') level = 'Pre-Nursery';
      const cleanName = c.name.replace(/\s*\((Pre-School|Nursery|Kindergarten|Pre-Nursery|K1|K2|K3|Prep)\)/gi, '').trim();
      return `${cleanName} (${level})`;
    }
  }, [isDKCampus]);

  // Active Editor View Tab
  const [activeTab, setActiveTab] = useState<'official_format' | 'curriculum_matrix' | 'print_preview'>('official_format');

  // Metadata State
  const [firstSessionClassId, setFirstSessionClassId] = useState<string>(
    initialPlan?.firstSession?.classId || initialPlan?.classId || currentUser.assignedClassId || classrooms[0]?.id || ''
  );
  const [secondSessionClassId, setSecondSessionClassId] = useState<string>(
    initialPlan?.secondSession?.classId || initialPlan?.classId || currentUser.assignedClassId || classrooms[0]?.id || ''
  );
  const [weekNumber, setWeekNumber] = useState<number>(initialPlan?.weekNumber || 13);
  
  const getInitialQuarter = (termStr?: string): number => {
    if (!termStr) return 1;
    const match = termStr.match(/(?:Term|Q|Quarter)\s*(\d+)/i) || termStr.match(/(\d+)/);
    if (match && match[1]) {
      const q = parseInt(match[1], 10);
      if (q >= 1 && q <= 4) return q;
    }
    return 1;
  };
  const [quarter, setQuarter] = useState<number>(() => getInitialQuarter(initialPlan?.term));
  const [startDate, setStartDate] = useState<string>(initialPlan?.startDate || '2026-09-08');
  const [endDate, setEndDate] = useState<string>(initialPlan?.endDate || '2026-09-12');
  const [planDate, setPlanDate] = useState<string>(initialPlan?.planDate || initialPlan?.startDate || '2026-09-08');
  const [timeStart, setTimeStart] = useState<string>(initialPlan?.timeStart || '08:30 AM');
  const [timeEnd, setTimeEnd] = useState<string>(initialPlan?.timeEnd || '11:30 AM');

  // Thematic & Overview
  const [themeTitle, setThemeTitle] = useState<string>(initialPlan?.themeTitle || 'Under the Sea & Water Sensory Science');
  const [themeDescription, setThemeDescription] = useState<string>(initialPlan?.themeDescription || 'A child-led inquiry into marine life, sensory density, and trilingual communication.');
  const [domains, setDomains] = useState<EarlyChildhoodDomain[]>(
    initialPlan?.domains || ['Language & Early Literacy', 'Sensory & Discovery Science', 'Creative Arts & Music']
  );

  // OFFICIAL FORMAT TEMPLATE SECTIONS (Matching Institutional DCH Sheet)
  // Section I: Warm up / Circle Time
  const [warmUpCircleTime, setWarmUpCircleTime] = useState<string>(
    initialPlan?.warmUpCircleTime || initialPlan?.circleTimeActivities || 'Welcome song in English, Khmer & Chinese; greeting round; daily weather and calendar check; mystery sensory sound shaker box.'
  );

  // Section II: 1st Session
  const [firstSessionSubject, setFirstSessionSubject] = useState<string>(
    initialPlan?.firstSession?.subject || 'Language & Trilingual Early Literacy'
  );
  const [firstSessionActivities, setFirstSessionActivities] = useState<SessionActivityRow[]>(
    initialPlan?.firstSession?.activities || [
      {
        id: 's1_act_1',
        topicActivity: 'Marine Animals Vocabulary & Flashcards Matching (Fish, Whale, Crab, Turtle, Octopus)',
        objectives: 'Identify, pronounce, and match 5 sea creatures in English, Khmer, and Mandarin.',
        materialsSources: 'Trilingual flashcards, soft marine figurines, display board',
        durationMins: 25,
      },
      {
        id: 's1_act_2',
        topicActivity: 'Letter "O" for Octopus Sand-Tray Tracing',
        objectives: 'Practice fine-motor pincer grip and letter formation in sensory kinetic sand.',
        materialsSources: 'Fine blue sand trays, wooden stylus sticks',
        durationMins: 20,
      },
    ]
  );

  // Section III: 2nd Session
  const [secondSessionSubject, setSecondSessionSubject] = useState<string>(
    initialPlan?.secondSession?.subject || 'Sensory Discovery Science & Creative Arts'
  );
  const [secondSessionActivities, setSecondSessionActivities] = useState<SessionActivityRow[]>(
    initialPlan?.secondSession?.activities || [
      {
        id: 's2_act_1',
        topicActivity: 'Ocean Density & Floating vs. Sinking Discovery',
        objectives: 'Observe and predict object buoyancy in saline water bottles.',
        materialsSources: 'Water table, seashells, corks, plastic coins, observation tubes',
        durationMins: 30,
      },
      {
        id: 's2_act_2',
        topicActivity: 'Paper Plate Jellyfish Craft with Crepe Ribbon Tentacles',
        objectives: 'Cut and glue sensory streamers; develop bilateral hand coordination.',
        materialsSources: 'Paper plates, ribbon, safe washable glue, non-toxic paints, googly eyes',
        durationMins: 25,
      },
    ]
  );

  // Section IV: Closing
  const [closing, setClosing] = useState<string>(
    initialPlan?.closing || 'Review key vocabulary learned today; tidy up learning stations cooperatively; sing goodbye song "Down by the Bay" and prepare for dismissal.'
  );

  // Objectives
  const [learningObjectives, setLearningObjectives] = useState<string[]>(
    initialPlan?.learningObjectives || [
      'Identify 5 major marine animals in English, Khmer, and Mandarin.',
      'Investigate floating vs. sinking using water density tubes.',
      'Practice pincer grasp using tongs to rescue toy sea animals.',
    ]
  );
  const [newObjectiveInput, setNewObjectiveInput] = useState('');

  // Circle Time & Activities (Modular)
  const [outdoorSensoryPlay, setOutdoorSensoryPlay] = useState<string>(
    initialPlan?.outdoorSensoryPlay || 'Sensory obstacle path, parachute ocean waves game, chalk drawing station, and water basin play.'
  );
  const [assessmentMethods, setAssessmentMethods] = useState<string>(
    initialPlan?.assessmentMethods || 'Anecdotal notes, checklist of 3-language vocabulary recognition during circle time, photo portfolio evidence.'
  );

  // Learning Centers
  const [learningCenters, setLearningCenters] = useState(
    initialPlan?.learningCenters || [
      {
        id: 'lc_1',
        centerName: 'Sensory & Discovery Station',
        activityDescription: 'Water/sand table with theme models and scoop tools.',
        materials: 'Sensory bin, scoops, magnifiers, sorting bowls.',
      },
      {
        id: 'lc_2',
        centerName: 'Creative Arts Table',
        activityDescription: 'Theme craft using non-toxic washable paints and collage materials.',
        materials: 'Paper plates, tempera paints, safe glue, textured paper.',
      },
      {
        id: 'lc_3',
        centerName: 'Trilingual Literacy Nook',
        activityDescription: 'Flashcard matching in English, Khmer, and Chinese.',
        materials: 'Bilingual picture cards, wooden stylus, sand tracing trays.',
      },
    ]
  );

  // Trilingual Focus
  const [englishVocab, setEnglishVocab] = useState<string>(
    initialPlan?.trilingualFocus?.englishVocab?.join(', ') || 'Fish, Ocean, Turtle, Water, Blue'
  );
  const [khmerVocab, setKhmerVocab] = useState<string>(
    initialPlan?.trilingualFocus?.khmerVocab?.join(', ') || 'ត្រី (Trei), សមុទ្រ (Samut), អណ្ដើក (Andeuk), ទឹក (Teuk), ពណ៌ខៀវ (Khaev)'
  );
  const [chineseVocab, setChineseVocab] = useState<string>(
    initialPlan?.trilingualFocus?.chineseVocab?.join(', ') || '鱼 (Yú), 大海 (Dàhǎi), 海龟 (Hǎiguī), 水 (Shuǐ), 蓝色 (Lánsè)'
  );
  const [songOrRhyme, setSongOrRhyme] = useState<string>(
    initialPlan?.trilingualFocus?.songOrRhyme || 'Down by the Bay / ត្រីហែលក្នុងទឹកថ្លា / 小黄鸭游泳'
  );
  const [storyBook, setStoryBook] = useState<string>(
    initialPlan?.trilingualFocus?.storyBook || '"The Rainbow Fish" by Marcus Pfister (Trilingual Edition)'
  );

  // Materials
  const [materials, setMaterials] = useState<string>(
    initialPlan?.materialsAndSupplies?.join('\n') || 'Water basin and non-toxic dye\nAssorted marine plastic models\nKinetic sand and wooden stylus\nPaper plates and crepe streamers\nTrilingual vocabulary flashcards'
  );

  // Attachments
  const [attachments, setAttachments] = useState<PlanAttachment[]>(
    initialPlan?.attachments || [
      {
        id: 'att_init',
        name: 'Weekly_EarlyChildhood_Curriculum_Schedule.pdf',
        size: '1.4 MB',
        type: 'pdf',
        uploadedAt: new Date().toISOString().substring(0, 10),
      },
    ]
  );
  const [isDragging, setIsDragging] = useState(false);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [previewAttachment, setPreviewAttachment] = useState<PlanAttachment | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const firstSessionClassObj = availableClassrooms.find(c => c.id === firstSessionClassId) || availableClassrooms[0] || classrooms[0];
  const secondSessionClassObj = availableClassrooms.find(c => c.id === secondSessionClassId) || availableClassrooms[0] || classrooms[0];

  const firstSessionClassName = firstSessionClassObj ? getClassroomAndLevelLabel(firstSessionClassObj) : '';
  const secondSessionClassName = secondSessionClassObj ? getClassroomAndLevelLabel(secondSessionClassObj) : '';

  let combinedClassName = firstSessionClassName;
  if (firstSessionClassId !== secondSessionClassId && firstSessionClassName && secondSessionClassName && firstSessionClassName !== secondSessionClassName) {
    combinedClassName = `${firstSessionClassName} & ${secondSessionClassName}`;
  }

  const selectedClass = firstSessionClassObj;

  useEffect(() => {
    if (availableClassrooms.length > 0) {
      if (!availableClassrooms.some(c => c.id === firstSessionClassId)) {
        setFirstSessionClassId(availableClassrooms[0].id);
      }
      if (!availableClassrooms.some(c => c.id === secondSessionClassId)) {
        setSecondSessionClassId(availableClassrooms[0].id);
      }
    }
  }, [availableClassrooms, firstSessionClassId, secondSessionClassId]);

  // Helper Row Methods for Session 1 & Session 2
  const addSessionRow = (session: 1 | 2) => {
    const newRow: SessionActivityRow = {
      id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      topicActivity: '',
      objectives: '',
      materialsSources: '',
      durationMins: 20,
    };

    if (session === 1) {
      setFirstSessionActivities(prev => [...prev, newRow]);
    } else {
      setSecondSessionActivities(prev => [...prev, newRow]);
    }
  };

  const updateSessionRow = (session: 1 | 2, index: number, field: keyof SessionActivityRow, value: any) => {
    if (session === 1) {
      setFirstSessionActivities(prev => {
        const next = [...prev];
        next[index] = { ...next[index], [field]: value };
        return next;
      });
    } else {
      setSecondSessionActivities(prev => {
        const next = [...prev];
        next[index] = { ...next[index], [field]: value };
        return next;
      });
    }
  };

  const removeSessionRow = (session: 1 | 2, index: number) => {
    if (session === 1) {
      setFirstSessionActivities(prev => prev.filter((_, i) => i !== index));
    } else {
      setSecondSessionActivities(prev => prev.filter((_, i) => i !== index));
    }
  };

  const calculateTotalDuration = (activities: SessionActivityRow[]) => {
    return activities.reduce((sum, item) => sum + (Number(item.durationMins) || 0), 0);
  };

  const toggleDomain = (domain: EarlyChildhoodDomain) => {
    setDomains(prev =>
      prev.includes(domain) ? prev.filter(d => d !== domain) : [...prev, domain]
    );
  };

  const addObjective = () => {
    if (newObjectiveInput.trim()) {
      setLearningObjectives(prev => [...prev, newObjectiveInput.trim()]);
      setNewObjectiveInput('');
    }
  };

  const removeObjective = (index: number) => {
    setLearningObjectives(prev => prev.filter((_, i) => i !== index));
  };

  const processUploadedFiles = async (fileList: FileList | File[]) => {
    const files = Array.from(fileList);
    if (files.length === 0) return;

    setIsUploadingFile(true);

    try {
      const readPromises = files.map((file, idx) => {
        return new Promise<PlanAttachment>((resolve) => {
          const extension = file.name.split('.').pop()?.toLowerCase() || '';
          let type: PlanAttachment['type'] = 'pdf';
          if (['doc', 'docx'].includes(extension)) type = 'docx';
          else if (['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'].includes(extension)) type = 'image';
          else if (['xls', 'xlsx', 'csv'].includes(extension)) type = 'xlsx';
          else if (['ppt', 'pptx'].includes(extension)) type = 'pptx';

          const sizeStr = file.size > 1024 * 1024 
            ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
            : `${Math.max(1, Math.round(file.size / 1024))} KB`;

          const reader = new FileReader();
          reader.onload = () => {
            resolve({
              id: `att_${Date.now()}_${idx}_${Math.random().toString(36).substring(2, 6)}`,
              name: file.name,
              size: sizeStr,
              type,
              url: reader.result as string,
              uploadedAt: new Date().toISOString().substring(0, 16).replace('T', ' '),
            });
          };
          reader.onerror = () => {
            resolve({
              id: `att_${Date.now()}_${idx}_${Math.random().toString(36).substring(2, 6)}`,
              name: file.name,
              size: sizeStr,
              type,
              uploadedAt: new Date().toISOString().substring(0, 16).replace('T', ' '),
            });
          };
          reader.readAsDataURL(file);
        });
      });

      const newAtts = await Promise.all(readPromises);
      setAttachments(prev => [...prev, ...newAtts]);
      showToast(`Uploaded ${newAtts.length} attachment(s) successfully`, 'success');
    } catch (err) {
      console.error('File upload error:', err);
      showToast('Failed to parse uploaded files', 'error');
    } finally {
      setIsUploadingFile(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processUploadedFiles(e.target.files);
    }
  };

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
      const content = `${institutionEnglish} Lesson Plan Attachment\nTheme: ${themeTitle}\nClass: ${selectedClass.name}\nFile: ${att.name}`;
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

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
  };

  // Load Blank Template
  const handleLoadBlankTemplate = () => {
    setThemeTitle('Weekly Lesson Plan');
    setThemeDescription('Childcare curriculum sessions and learning centers.');
    setWarmUpCircleTime('');
    setFirstSessionSubject('');
    setFirstSessionActivities([
      { id: 's1_b1', topicActivity: '', objectives: '', materialsSources: '', durationMins: '' },
      { id: 's1_b2', topicActivity: '', objectives: '', materialsSources: '', durationMins: '' },
    ]);
    setSecondSessionSubject('');
    setSecondSessionActivities([
      { id: 's2_b1', topicActivity: '', objectives: '', materialsSources: '', durationMins: '' },
      { id: 's2_b2', topicActivity: '', objectives: '', materialsSources: '', durationMins: '' },
    ]);
    setClosing('');
    showToast('Loaded blank official template layout', 'info');
  };

  // AI Early Childhood Curriculum Assistant Generator
  const handleGenerateAiSuggestions = () => {
    setIsAiGenerating(true);
    setTimeout(() => {
      const themes = [
        {
          title: 'Garden Wonders: Flowers, Little Bugs & Soil Discovery',
          description: 'A tactile week of soil textures, observing live earthworms in terrariums, petal symmetry, and trilingual garden songs.',
          eng: 'Flower, Butterfly, Soil, Leaf, Green',
          khm: 'ផ្កា (Pka), មេអំបៅ (Me-Ambau), ដី (Dei), ស្លឹកឈើ (Sloek-Chheu)',
          chi: '花 (Huā), 蝴蝶 (Húdié), 泥土 (Nítǔ), 树叶 (Shùyè)',
          song: '"The Caterpillar Crawls" / របាំមេអំបៅ / 《蝴蝶飞飞》',
          book: '"The Very Hungry Caterpillar" & "Garden Friends"',
          warmUp: 'Garden greetings song with fluttering butterfly silk scarves; morning weather and flower planter check; mystery garden sound box.',
          s1Sub: 'Language & Trilingual Garden Vocabulary',
          s1Acts: [
            {
              id: 'ai_s1_1',
              topicActivity: 'Flower & Bug Flashcard Matching in 3 Languages',
              objectives: 'Name flower, leaf, bug in English, Khmer, and Mandarin.',
              materialsSources: 'Trilingual botany cards, preserved leaf samples',
              durationMins: 25,
            },
            {
              id: 'ai_s1_2',
              topicActivity: 'Letter "L" for Leaf Sand-Tray Tracing',
              objectives: 'Pincer grip letter formation in sensory green sand trays.',
              materialsSources: 'Kinetic green sand, bamboo stylus sticks',
              durationMins: 20,
            },
          ],
          s2Sub: 'Sensory Science & Seed Planting',
          s2Acts: [
            {
              id: 'ai_s2_1',
              topicActivity: 'Biodegradable Pot Seed Planting & Soil Touch',
              objectives: 'Differentiate dry vs moist soil; plant mung beans using small spades.',
              materialsSources: 'Organic potting soil, seed packets, child watering cans',
              durationMins: 30,
            },
            {
              id: 'ai_s2_2',
              topicActivity: 'Petal Printmaking Craft with Washable Inks',
              objectives: 'Stamp natural fresh petals on cardstock paper.',
              materialsSources: 'Fresh fallen petals, washable ink pads, cardstock',
              durationMins: 20,
            },
          ],
          closing: 'Review garden vocabulary; water our newly planted seedling cups; sing goodbye garden song and pack bags.',
          objectives: [
            'Observe soil moisture and plant seeds in biodegradable pots.',
            'Identify 4 garden creatures in English, Khmer, and Mandarin.',
            'Develop sensory regulation through gentle tactile dirt and seed sorting.',
          ],
        },
      ];

      const picked = themes[0];
      setThemeTitle(picked.title);
      setThemeDescription(picked.description);
      setEnglishVocab(picked.eng);
      setKhmerVocab(picked.khm);
      setChineseVocab(picked.chi);
      setSongOrRhyme(picked.song);
      setStoryBook(picked.book);
      setLearningObjectives(picked.objectives);
      setWarmUpCircleTime(picked.warmUp);
      setFirstSessionSubject(picked.s1Sub);
      setFirstSessionActivities(picked.s1Acts);
      setSecondSessionSubject(picked.s2Sub);
      setSecondSessionActivities(picked.s2Acts);
      setClosing(picked.closing);
      setIsAiGenerating(false);
      showToast('AI Early Childhood suggestions loaded into official template!', 'success');
    }, 700);
  };

  const handleSave = (status: 'draft' | 'submitted') => {
    if (!themeTitle.trim()) {
      showToast('Please provide a Title / Theme for this lesson plan', 'warning');
      return;
    }

    const payload: Partial<LessonPlan> = {
      teacherId: initialPlan?.teacherId || currentUser.id,
      teacherName: initialPlan?.teacherName || currentUser.name,
      teacherAvatar: initialPlan?.teacherAvatar || currentUser.avatar,
      teacherEmail: initialPlan?.teacherEmail || currentUser.email,
      classId: firstSessionClassId,
      className: combinedClassName,
      ageGroup: firstSessionClassObj.ageGroup,
      weekNumber: Number(weekNumber),
      term: `Term ${quarter} (Academic Year 2026)`,
      startDate,
      endDate,
      planDate,
      timeStart,
      timeEnd,
      themeTitle: themeTitle.trim(),
      themeDescription: themeDescription.trim(),
      domains,
      learningObjectives,
      circleTimeActivities: warmUpCircleTime,
      learningCenters,
      outdoorSensoryPlay,
      trilingualFocus: {
        englishVocab: englishVocab.split(',').map(s => s.trim()).filter(Boolean),
        khmerVocab: khmerVocab.split(',').map(s => s.trim()).filter(Boolean),
        chineseVocab: chineseVocab.split(',').map(s => s.trim()).filter(Boolean),
        songOrRhyme,
        storyBook,
      },
      assessmentMethods,
      materialsAndSupplies: materials.split('\n').map(s => s.trim()).filter(Boolean),
      attachments,
      status,
      submittedAt: status === 'submitted' ? new Date().toISOString().replace('T', ' ').substring(0, 16) : undefined,

      // Official Dewey Childcare House Template Fields
      warmUpCircleTime,
      firstSession: {
        subject: firstSessionSubject,
        activities: firstSessionActivities,
        classId: firstSessionClassId,
        className: firstSessionClassName,
      },
      secondSession: {
        subject: secondSessionSubject,
        activities: secondSessionActivities,
        classId: secondSessionClassId,
        className: secondSessionClassName,
      },
      closing,
    };

    if (initialPlan) {
      updateLessonPlan(initialPlan.id, payload);
    } else {
      createLessonPlan(payload as any);
    }

    if (status === 'submitted') {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#007A43', '#F59E0B', '#10B981', '#ffffff'],
      });
    }

    if (onSaved) onSaved();
    onClose();
  };

  // Construct current preview plan
  const currentPreviewPlan: LessonPlan = {
    id: initialPlan?.id || 'temp_preview',
    teacherId: initialPlan?.teacherId || currentUser.id,
    teacherName: initialPlan?.teacherName || currentUser.name,
    teacherAvatar: initialPlan?.teacherAvatar || currentUser.avatar,
    teacherEmail: initialPlan?.teacherEmail || currentUser.email,
    classId: firstSessionClassId,
    className: combinedClassName,
    ageGroup: firstSessionClassObj.ageGroup,
    weekNumber: Number(weekNumber),
    term: `Term ${quarter} (Academic Year 2026)`,
    startDate,
    endDate,
    planDate,
    timeStart,
    timeEnd,
    themeTitle,
    themeDescription,
    domains,
    learningObjectives,
    circleTimeActivities: warmUpCircleTime,
    learningCenters,
    outdoorSensoryPlay,
    trilingualFocus: {
      englishVocab: englishVocab.split(',').map(s => s.trim()).filter(Boolean),
      khmerVocab: khmerVocab.split(',').map(s => s.trim()).filter(Boolean),
      chineseVocab: chineseVocab.split(',').map(s => s.trim()).filter(Boolean),
      songOrRhyme,
      storyBook,
    },
    assessmentMethods,
    materialsAndSupplies: materials.split('\n').map(s => s.trim()).filter(Boolean),
    attachments,
    status: initialPlan?.status || 'draft',
    createdAt: initialPlan?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    feedbackHistory: initialPlan?.feedbackHistory || [],
    warmUpCircleTime,
    firstSession: {
      subject: firstSessionSubject,
      activities: firstSessionActivities,
      classId: firstSessionClassId,
      className: firstSessionClassName,
    },
    secondSession: {
      subject: secondSessionSubject,
      activities: secondSessionActivities,
      classId: secondSessionClassId,
      className: secondSessionClassName,
    },
    closing,
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto print:p-0 print:bg-white print:static print:overflow-visible">
      <div className="bg-white rounded-3xl shadow-2xl border border-emerald-100 w-full max-w-5xl max-h-[94vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 print:shadow-none print:border-none print:max-h-none print:rounded-none print:w-full print:max-w-none print:overflow-visible print:p-0 print:m-0">
        
        {/* Modal Header: Custom Institutional Header (DK / DCH) */}
        <div className="px-6 py-3.5 bg-gradient-to-r from-emerald-950 via-[#006838] to-emerald-900 text-white flex items-center justify-between shrink-0 border-b border-white/10 shadow-md print:hidden">
          <div className="flex items-center gap-3.5">
            <div className="bg-white/95 rounded-xl p-1.5 shadow-sm border border-white/20 shrink-0 flex items-center justify-center">
              <SchoolLogoIcon size={44} />
            </div>
            <div className="leading-tight text-left">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-300 font-['Battambang',sans-serif] tracking-normal leading-none">
                  {institutionKhmer}
                </span>
                <span className="text-[9px] font-extrabold uppercase tracking-widest px-1.5 py-0.2 rounded bg-amber-500 text-amber-950">
                  {isDKCampus ? 'DK Template' : 'Official Template'}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black tracking-wide uppercase font-['Outfit',sans-serif] text-white leading-tight mt-0.5">
                {institutionEnglish} — Lesson Plan Editor
              </h2>
              <p className="text-[10px] text-emerald-200/90 font-medium">
                {institutionEnglish} · Early Childhood Division · Warm up, 1st Session, 2nd Session, and Dismissal Blocks
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-emerald-200 hover:text-white hover:bg-white/10 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation Toolbar */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0 print:hidden">
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 shadow-xs">
            <button
              type="button"
              onClick={() => setActiveTab('official_format')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'official_format'
                  ? 'bg-[#007A43] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Official Format Template (I - IV)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('curriculum_matrix')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'curriculum_matrix'
                  ? 'bg-[#007A43] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Languages className="w-3.5 h-3.5" />
              <span>Trilingual & Learning Centers</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('print_preview')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'print_preview'
                  ? 'bg-[#007A43] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>Print Sheet Preview</span>
            </button>
          </div>

          {/* Quick Helper Tools */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleGenerateAiSuggestions}
              disabled={isAiGenerating}
              className="px-3 py-1.5 bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>{isAiGenerating ? 'Generating...' : 'AI Auto-Fill'}</span>
            </button>

            <button
              type="button"
              onClick={handleLoadBlankTemplate}
              className="px-3 py-1.5 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold transition-all shadow-xs"
            >
              Clear to Blank
            </button>
          </div>
        </div>

        {/* Modal Body with Tab Contents */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 print:p-0 print:m-0 print:overflow-visible">

          {/* ============================================================ */}
          {/* TAB 1: OFFICIAL FORMAT TEMPLATE (MATCHING THE PAPER IMAGE) */}
          {/* ============================================================ */}
          {activeTab === 'official_format' && (
            <div className="space-y-6 animate-in fade-in duration-150 print:hidden">
              
              {/* Header Box mimicking the official sheet */}
              <div className="bg-emerald-50/60 p-5 rounded-2xl border border-emerald-200/80 space-y-4">
                <div className="text-center pb-2 border-b border-emerald-200">
                  <h3 
                    className="text-xl font-extrabold tracking-tight uppercase"
                    style={{ color: '#006838', fontFamily: 'Georgia, Cambria, serif' }}
                  >
                    {institutionEnglish}
                  </h3>
                  <h4 className="text-base font-bold underline underline-offset-4 mt-0.5 text-slate-900">
                    Lesson Plan Editor
                  </h4>
                </div>

                {/* Metadata Fields (Date, Week, Quarter, Time) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-1">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-slate-800">
                        Date (DD-MM-YYYY) *
                      </label>
                      {planDate && (
                        <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded">
                          {formatDateDDMMYYYY(planDate)}
                        </span>
                      )}
                    </div>
                    <input
                      type="date"
                      value={toHtmlDateValue(planDate)}
                      onChange={(e) => {
                        setPlanDate(e.target.value);
                        setStartDate(e.target.value);
                      }}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">
                      Week Number *
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="40"
                      value={weekNumber}
                      onChange={(e) => setWeekNumber(parseInt(e.target.value) || 1)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">
                      Quarter *
                    </label>
                    <select
                      value={quarter}
                      onChange={(e) => setQuarter(parseInt(e.target.value) || 1)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    >
                      <option value={1}>1</option>
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                      <option value={4}>4</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">
                      Time Slot (Start to End) *
                    </label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={timeStart}
                        onChange={(e) => setTimeStart(e.target.value)}
                        placeholder="08:30 AM"
                        className="w-1/2 px-2.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-emerald-500"
                      />
                      <span className="text-xs font-medium text-slate-500">to</span>
                      <input
                        type="text"
                        value={timeEnd}
                        onChange={(e) => setTimeEnd(e.target.value)}
                        placeholder="11:30 AM"
                        className="w-1/2 px-2.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-emerald-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION I: Warm up / Circle Time */}
              <div className="p-5 bg-white border-2 border-slate-300 rounded-2xl space-y-2 shadow-xs">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-black flex items-center gap-2">
                    <span className="text-emerald-800 font-extrabold text-base">I.</span>
                    <span>Warm up/ circle time:</span>
                  </label>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Greetings, daily weather, songs & circle games
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={warmUpCircleTime}
                  onChange={(e) => setWarmUpCircleTime(e.target.value)}
                  placeholder="Enter greeting songs in 3 languages, calendar/weather check, circle time games..."
                  className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-slate-300 rounded-xl text-xs text-slate-900 leading-relaxed focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              {/* SECTION II: 1st Session */}
              <div className="p-5 bg-white border-2 border-slate-300 rounded-2xl space-y-4 shadow-xs">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-800 font-extrabold text-base">II.</span>
                    <span className="font-bold text-sm text-black">1<sup>st</sup> Session</span>
                  </div>
                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 grow max-w-2xl justify-end">
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-xs font-bold text-slate-800 shrink-0">Assigned Classroom:</span>
                      <select
                        value={firstSessionClassId}
                        onChange={(e) => setFirstSessionClassId(e.target.value)}
                        className="px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-emerald-500"
                      >
                        {availableClassrooms.map(c => (
                          <option key={c.id} value={c.id}>
                            {getClassroomAndLevelLabel(c)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center gap-1.5 grow max-w-md">
                      <span className="text-xs font-bold text-slate-800 shrink-0">Subject:</span>
                      <input
                        type="text"
                        value={firstSessionSubject}
                        onChange={(e) => setFirstSessionSubject(e.target.value)}
                        placeholder="e.g. Language & Trilingual Early Literacy"
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-emerald-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Table for Session 1 Activities */}
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border-2 border-black text-left text-xs">
                    <thead>
                      <tr className="bg-slate-100 border-b-2 border-black">
                        <th className="border-r-2 border-black p-2.5 font-bold text-black w-[30%]">
                          Topic/Activity *
                        </th>
                        <th className="border-r-2 border-black p-2.5 font-bold text-black w-[30%]">
                          Objective(s) *
                        </th>
                        <th className="border-r-2 border-black p-2.5 font-bold text-black w-[25%]">
                          Materials/ sources *
                        </th>
                        <th className="border-r-2 border-black p-2.5 font-bold text-black w-[10%] text-center whitespace-nowrap">
                          Duration <span className="block text-[10px] font-normal text-slate-600">(mns)</span>
                        </th>
                        <th className="p-2 font-bold text-black w-[5%] text-center">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {firstSessionActivities.map((row, idx) => (
                        <tr key={row.id || idx} className="border-b border-black">
                          <td className="border-r-2 border-black p-2 align-top">
                            <textarea
                              rows={3}
                              value={row.topicActivity}
                              onChange={(e) => updateSessionRow(1, idx, 'topicActivity', e.target.value)}
                              placeholder="Describe activity & task..."
                              className="w-full p-2 bg-transparent rounded border border-transparent hover:border-slate-300 focus:border-emerald-500 focus:bg-white text-xs resize-none focus:outline-hidden font-medium"
                            />
                          </td>
                          <td className="border-r-2 border-black p-2 align-top">
                            <textarea
                              rows={3}
                              value={row.objectives}
                              onChange={(e) => updateSessionRow(1, idx, 'objectives', e.target.value)}
                              placeholder="Key milestones & outcomes..."
                              className="w-full p-2 bg-transparent rounded border border-transparent hover:border-slate-300 focus:border-emerald-500 focus:bg-white text-xs resize-none focus:outline-hidden"
                            />
                          </td>
                          <td className="border-r-2 border-black p-2 align-top">
                            <textarea
                              rows={3}
                              value={row.materialsSources}
                              onChange={(e) => updateSessionRow(1, idx, 'materialsSources', e.target.value)}
                              placeholder="Flashcards, manipulatives, book..."
                              className="w-full p-2 bg-transparent rounded border border-transparent hover:border-slate-300 focus:border-emerald-500 focus:bg-white text-xs resize-none focus:outline-hidden"
                            />
                          </td>
                          <td className="border-r-2 border-black p-2 align-top text-center">
                            <input
                              type="number"
                              min="5"
                              max="120"
                              value={row.durationMins}
                              onChange={(e) => updateSessionRow(1, idx, 'durationMins', e.target.value)}
                              className="w-16 p-1.5 text-center font-bold bg-slate-50 border border-slate-300 rounded text-xs focus:bg-white focus:outline-emerald-500"
                            />
                          </td>
                          <td className="p-2 align-middle text-center">
                            <button
                              type="button"
                              onClick={() => removeSessionRow(1, idx)}
                              disabled={firstSessionActivities.length <= 1}
                              className="p-1 text-slate-400 hover:text-rose-600 disabled:opacity-30 rounded"
                              title="Delete row"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => addSessionRow(1)}
                    className="px-3 py-1.5 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Activity Row</span>
                  </button>

                  <div className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                    Session 1 Total: <span className="text-emerald-800 font-extrabold">{calculateTotalDuration(firstSessionActivities)} mns</span>
                  </div>
                </div>
              </div>

              {/* SECTION III: 2nd Session */}
              <div className="p-5 bg-white border-2 border-slate-300 rounded-2xl space-y-4 shadow-xs">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-800 font-extrabold text-base">III.</span>
                    <span className="font-bold text-sm text-black">2<sup>nd</sup> Session</span>
                  </div>
                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 grow max-w-2xl justify-end">
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-xs font-bold text-slate-800 shrink-0">Assigned Classroom:</span>
                      <select
                        value={secondSessionClassId}
                        onChange={(e) => setSecondSessionClassId(e.target.value)}
                        className="px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-emerald-500"
                      >
                        {availableClassrooms.map(c => (
                          <option key={c.id} value={c.id}>
                            {getClassroomAndLevelLabel(c)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center gap-1.5 grow max-w-md">
                      <span className="text-xs font-bold text-slate-800 shrink-0">Subject:</span>
                      <input
                        type="text"
                        value={secondSessionSubject}
                        onChange={(e) => setSecondSessionSubject(e.target.value)}
                        placeholder="e.g. Sensory Discovery Science & Creative Arts"
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-emerald-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Table for Session 2 Activities */}
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border-2 border-black text-left text-xs">
                    <thead>
                      <tr className="bg-slate-100 border-b-2 border-black">
                        <th className="border-r-2 border-black p-2.5 font-bold text-black w-[30%]">
                          Topic/Activity *
                        </th>
                        <th className="border-r-2 border-black p-2.5 font-bold text-black w-[30%]">
                          Objective(s) *
                        </th>
                        <th className="border-r-2 border-black p-2.5 font-bold text-black w-[25%]">
                          Materials/ sources *
                        </th>
                        <th className="border-r-2 border-black p-2.5 font-bold text-black w-[10%] text-center whitespace-nowrap">
                          Duration <span className="block text-[10px] font-normal text-slate-600">(mns)</span>
                        </th>
                        <th className="p-2 font-bold text-black w-[5%] text-center">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {secondSessionActivities.map((row, idx) => (
                        <tr key={row.id || idx} className="border-b border-black">
                          <td className="border-r-2 border-black p-2 align-top">
                            <textarea
                              rows={3}
                              value={row.topicActivity}
                              onChange={(e) => updateSessionRow(2, idx, 'topicActivity', e.target.value)}
                              placeholder="Describe activity & task..."
                              className="w-full p-2 bg-transparent rounded border border-transparent hover:border-slate-300 focus:border-emerald-500 focus:bg-white text-xs resize-none focus:outline-hidden font-medium"
                            />
                          </td>
                          <td className="border-r-2 border-black p-2 align-top">
                            <textarea
                              rows={3}
                              value={row.objectives}
                              onChange={(e) => updateSessionRow(2, idx, 'objectives', e.target.value)}
                              placeholder="Key milestones & outcomes..."
                              className="w-full p-2 bg-transparent rounded border border-transparent hover:border-slate-300 focus:border-emerald-500 focus:bg-white text-xs resize-none focus:outline-hidden"
                            />
                          </td>
                          <td className="border-r-2 border-black p-2 align-top">
                            <textarea
                              rows={3}
                              value={row.materialsSources}
                              onChange={(e) => updateSessionRow(2, idx, 'materialsSources', e.target.value)}
                              placeholder="Sensory tubs, art paper, brushes..."
                              className="w-full p-2 bg-transparent rounded border border-transparent hover:border-slate-300 focus:border-emerald-500 focus:bg-white text-xs resize-none focus:outline-hidden"
                            />
                          </td>
                          <td className="border-r-2 border-black p-2 align-top text-center">
                            <input
                              type="number"
                              min="5"
                              max="120"
                              value={row.durationMins}
                              onChange={(e) => updateSessionRow(2, idx, 'durationMins', e.target.value)}
                              className="w-16 p-1.5 text-center font-bold bg-slate-50 border border-slate-300 rounded text-xs focus:bg-white focus:outline-emerald-500"
                            />
                          </td>
                          <td className="p-2 align-middle text-center">
                            <button
                              type="button"
                              onClick={() => removeSessionRow(2, idx)}
                              disabled={secondSessionActivities.length <= 1}
                              className="p-1 text-slate-400 hover:text-rose-600 disabled:opacity-30 rounded"
                              title="Delete row"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => addSessionRow(2)}
                    className="px-3 py-1.5 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Activity Row</span>
                  </button>

                  <div className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                    Session 2 Total: <span className="text-emerald-800 font-extrabold">{calculateTotalDuration(secondSessionActivities)} mns</span>
                  </div>
                </div>
              </div>

              {/* SECTION IV: Closing */}
              <div className="p-5 bg-white border-2 border-slate-300 rounded-2xl space-y-2 shadow-xs">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-black flex items-center gap-2">
                    <span className="text-emerald-800 font-extrabold text-base">IV.</span>
                    <span>Closing:</span>
                  </label>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Reflection, station cleanup, goodbye songs & departure
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={closing}
                  onChange={(e) => setClosing(e.target.value)}
                  placeholder="Review session highlights, tidy up learning areas, sing departure songs, and organize belongings for dismissal..."
                  className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-slate-300 rounded-xl text-xs text-slate-900 leading-relaxed focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 2: TRILINGUAL EYFS CURRICULUM MATRIX & LEARNING CENTERS */}
          {/* ============================================================ */}
          {activeTab === 'curriculum_matrix' && (
            <div className="space-y-6 animate-in fade-in duration-150 print:hidden">
              {/* Thematic Unit Title & Description */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-800 flex items-center justify-between mb-1">
                    <span>Thematic Unit Title *</span>
                    <span className="text-[10px] text-slate-400 font-normal">e.g. Under the Sea, Khmer New Year Traditions, Outer Space</span>
                  </label>
                  <input
                    type="text"
                    value={themeTitle}
                    onChange={(e) => setThemeTitle(e.target.value)}
                    placeholder="Enter engaging thematic title..."
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    Weekly Pedagogical Overview & Big Idea
                  </label>
                  <textarea
                    rows={2}
                    value={themeDescription}
                    onChange={(e) => setThemeDescription(e.target.value)}
                    placeholder="Brief summary of inquiry questions, core concept, and child-led play goals..."
                    className="w-full px-4 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Curriculum Domains */}
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-2">
                  Early Childhood Curriculum Domains Covered
                </label>
                <div className="flex flex-wrap gap-2">
                  {DOMAIN_OPTIONS.map((domain) => {
                    const isChecked = domains.includes(domain);
                    return (
                      <button
                        key={domain}
                        type="button"
                        onClick={() => toggleDomain(domain)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                          isChecked
                            ? 'bg-emerald-100 text-emerald-900 border-emerald-400 shadow-2xs'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {isChecked ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Plus className="w-3.5 h-3.5 text-slate-400" />}
                        <span>{domain}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Trilingual Immersion Focus */}
              <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-2xl space-y-3">
                <div className="flex items-center gap-2">
                  <Languages className="w-4 h-4 text-emerald-700" />
                  <h3 className="text-xs font-extrabold text-emerald-900 uppercase tracking-wide">
                    Trilingual Immersion Focus (English · Khmer · Chinese)
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-emerald-900 block mb-1">
                      🇬🇧 English Vocabulary
                    </label>
                    <input
                      type="text"
                      value={englishVocab}
                      onChange={(e) => setEnglishVocab(e.target.value)}
                      placeholder="Fish, Ocean, Wave, Blue"
                      className="w-full px-3 py-2 bg-white border border-emerald-200 rounded-xl text-xs text-slate-800 focus:outline-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-emerald-900 block mb-1">
                      🇰🇭 Khmer Vocabulary (Phonetics)
                    </label>
                    <input
                      type="text"
                      value={khmerVocab}
                      onChange={(e) => setKhmerVocab(e.target.value)}
                      placeholder="ត្រី (Trei), សមុទ្រ (Samut)"
                      className="w-full px-3 py-2 bg-white border border-emerald-200 rounded-xl text-xs text-slate-800 focus:outline-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-emerald-900 block mb-1">
                      🇨🇳 Mandarin Vocabulary (Pinyin)
                    </label>
                    <input
                      type="text"
                      value={chineseVocab}
                      onChange={(e) => setChineseVocab(e.target.value)}
                      placeholder="鱼 (Yú), 大海 (Dàhǎi)"
                      className="w-full px-3 py-2 bg-white border border-emerald-200 rounded-xl text-xs text-slate-800 focus:outline-emerald-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      🎵 Circle Time Songs & Rhymes
                    </label>
                    <input
                      type="text"
                      value={songOrRhyme}
                      onChange={(e) => setSongOrRhyme(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-emerald-200 rounded-xl text-xs text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      📖 Featured Trilingual Storybook
                    </label>
                    <input
                      type="text"
                      value={storyBook}
                      onChange={(e) => setStoryBook(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-emerald-200 rounded-xl text-xs text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* Key Learning Objectives */}
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1.5">
                  Key Learning Milestones & Objectives
                </label>
                <div className="space-y-1.5 mb-2">
                  {learningObjectives.map((obj, idx) => (
                    <div key={idx} className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span className="flex-1">{obj}</span>
                      <button
                        type="button"
                        onClick={() => removeObjective(idx)}
                        className="text-slate-400 hover:text-rose-500 p-1"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newObjectiveInput}
                    onChange={(e) => setNewObjectiveInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addObjective())}
                    placeholder="Type learning objective and press Add..."
                    className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={addObjective}
                    className="px-4 py-2 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-bold text-xs rounded-xl border border-emerald-200"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Outdoor Play & Assessment */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    🏃 Outdoor Play & Gross Motor Activity
                  </label>
                  <textarea
                    rows={3}
                    value={outdoorSensoryPlay}
                    onChange={(e) => setOutdoorSensoryPlay(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    📝 Assessment & Observation Methods
                  </label>
                  <textarea
                    rows={3}
                    value={assessmentMethods}
                    onChange={(e) => setAssessmentMethods(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800"
                  />
                </div>
              </div>

              {/* Materials & Supplies */}
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  📦 Classroom Supplies & Realia Checklist (One per line)
                </label>
                <textarea
                  rows={3}
                  value={materials}
                  onChange={(e) => setMaterials(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 font-mono"
                />
              </div>

              {/* File Attachment Upload Area */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <UploadCloud className="w-4 h-4 text-emerald-700" />
                    <span>Upload Supporting Curriculum Files & Worksheets</span>
                  </label>
                  <span className="text-[11px] text-slate-500">PDF, Word, Excel, PPT, Images</span>
                </div>

                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                      processUploadedFiles(e.dataTransfer.files);
                    }
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2.5 ${
                    isDragging
                      ? 'border-emerald-600 bg-emerald-50 scale-[1.01]'
                      : 'border-slate-300 hover:border-emerald-500 bg-slate-50/70 hover:bg-emerald-50/40'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.csv,.txt,image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />

                  <div className="p-3 bg-emerald-100 text-emerald-800 rounded-2xl">
                    {isUploadingFile ? (
                      <Loader2 className="w-6 h-6 animate-spin text-emerald-700" />
                    ) : (
                      <UploadCloud className="w-6 h-6" />
                    )}
                  </div>
                  
                  <div className="text-xs text-slate-700">
                    <span className="font-bold text-emerald-700 hover:underline">
                      Click to browse files
                    </span>{' '}
                    or drag & drop lesson worksheets or pictures here
                  </div>
                </div>

                {/* Attachments List */}
                {attachments.length > 0 && (
                  <div className="space-y-2 mt-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {attachments.map((file) => (
                        <div
                          key={file.id}
                          className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                        >
                          <div className="flex items-center gap-2 truncate pr-2">
                            <FileText className="w-4 h-4 text-emerald-700 shrink-0" />
                            <span className="text-xs font-semibold text-slate-800 truncate">
                              {file.name}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            {file.url && (
                              <button
                                type="button"
                                onClick={() => setPreviewAttachment(file)}
                                className="p-1 text-slate-500 hover:text-emerald-700 rounded"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleDownloadAttachment(file)}
                              className="p-1 text-slate-500 hover:text-blue-700 rounded"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeAttachment(file.id)}
                              className="p-1 text-slate-400 hover:text-rose-500 rounded"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 3: PRINT SHEET PREVIEW */}
          {/* ============================================================ */}
          {activeTab === 'print_preview' && (
            <div className="p-2 sm:p-4 bg-slate-100 rounded-2xl animate-in fade-in duration-150 print:bg-white print:p-0 print:m-0 print:rounded-none">
              <div className="max-w-3xl mx-auto space-y-4 print:max-w-none print:m-0 print:p-0 print:space-y-0">
                <div className="flex items-center justify-between bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-xs print:hidden">
                  <span className="text-xs font-bold text-slate-700">
                    Live Printable Preview (A4 / Letter Institutional Standard)
                  </span>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-3 py-1.5 bg-emerald-700 text-white rounded-lg text-xs font-bold hover:bg-emerald-800 transition-colors flex items-center gap-1 shadow-xs"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Sheet Preview</span>
                  </button>
                </div>

                <OfficialTemplateView 
                  plan={currentPreviewPlan}
                  showDottedLinesIfBlank={true}
                />
              </div>
            </div>
          )}

          {/* When printing while on other tabs, print ONLY the Print Sheet Preview */}
          {activeTab !== 'print_preview' && (
            <div className="hidden print:block print:m-0 print:p-0">
              <OfficialTemplateView 
                plan={currentPreviewPlan}
                showDottedLinesIfBlank={true}
              />
            </div>
          )}
        </div>

        {/* Attachment Preview Lightbox */}
        {previewAttachment && (
          <div 
            className="fixed inset-0 z-60 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 print:hidden"
            onClick={() => setPreviewAttachment(null)}
          >
            <div 
              className="bg-white rounded-2xl max-w-2xl w-full p-5 space-y-4 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-700" />
                  <h4 className="text-sm font-bold text-slate-900 truncate max-w-md">
                    {previewAttachment.name}
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewAttachment(null)}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="max-h-[60vh] overflow-auto flex items-center justify-center bg-slate-50 rounded-xl p-4">
                {previewAttachment.type === 'image' && previewAttachment.url ? (
                  <img 
                    src={previewAttachment.url} 
                    alt={previewAttachment.name} 
                    className="max-h-[50vh] max-w-full object-contain rounded-lg"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="text-center py-8 space-y-3">
                    <FileText className="w-12 h-12 text-emerald-700 mx-auto" />
                    <p className="text-xs text-slate-600">
                      Document: <strong>{previewAttachment.name}</strong>
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => handleDownloadAttachment(previewAttachment)}
                  className="px-3 py-1.5 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-bold text-xs rounded-xl transition-colors inline-flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewAttachment(null)}
                  className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0 print:hidden">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Cancel
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleSave('draft')}
              className="px-4 py-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold rounded-xl transition-all shadow-2xs"
            >
              Save as Draft
            </button>
            <button
              type="button"
              onClick={() => handleSave('submitted')}
              className="flex items-center gap-2 px-5 py-2 bg-[#007A43] hover:bg-[#006338] text-white text-xs font-bold rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95"
            >
              <Check className="w-4 h-4 text-amber-300" />
              <span>Submit to Academic Office</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
