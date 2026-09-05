export type UserRole = 'admin' | 'academic_officer' | 'teacher';

export type EarlyChildhoodAgeGroup = 'Pre-Nursery' | 'Nursery' | 'Pre-School' | 'Kindergarten';

export interface SchoolLevel {
  id: string;
  name: string;
  displayName: string;
  khmerName?: string;
  description?: string;
}

export type EarlyChildhoodDomain = 
  | 'Language & Early Literacy'
  | 'Mathematics & Logic'
  | 'Sensory & Discovery Science'
  | 'Creative Arts & Music'
  | 'Physical & Motor Skills'
  | 'Social-Emotional Learning'
  | 'Khmer Language & Culture'
  | 'Mandarin Language Immersion';

export type LessonPlanStatus = 
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'approved'
  | 'revision_requested';

export type CampusId = 
  | 'ALL'
  | 'DCH_SYW'
  | 'DCH_SESSOR'
  | 'DCH_BMC'
  | 'DK_ROMCHEK_4'
  | 'DK_BOREY_ROMCHEK'
  | 'DK_OCHAR'
  | 'DK_BMC';

export interface CampusInfo {
  id: CampusId;
  code: string;
  nameEnglish: string;
  nameKhmer: string;
  shortName: string;
  brand: 'DCH' | 'DK' | 'CENTRAL';
  location: string;
  colorTheme: string;
}

export const CAMPUS_LIST: CampusInfo[] = [
  {
    id: 'ALL',
    code: 'CENTRAL',
    nameEnglish: 'DEWEY EARLY CHILDHOOD EDUCATION CENTRAL OFFICE',
    nameKhmer: 'ការិយាល័យកណ្តាលអប់រំកុមារតូច ឌូវី',
    shortName: 'Central HQ',
    brand: 'CENTRAL',
    location: 'Central Headquarters',
    colorTheme: 'emerald'
  },
  {
    id: 'DCH_SYW',
    code: 'DCH SYW',
    nameEnglish: 'Dewey Childcare House - Soun Yuwan',
    nameKhmer: 'ឌូវី ឆាល់ឃែរ៍ ហោស៍ (សាខាសួនយុវ័ន)',
    shortName: 'DCH SYW',
    brand: 'DCH',
    location: 'Soun Yuwan Campus',
    colorTheme: 'emerald'
  },
  {
    id: 'DCH_SESSOR',
    code: 'DCH SESSOR',
    nameEnglish: 'Dewey Childcare House - Sessor',
    nameKhmer: 'ឌូវី ឆាល់ឃែរ៍ ហោស៍ (សាខាសេះស)',
    shortName: 'DCH SESSOR',
    brand: 'DCH',
    location: 'Sessor Campus',
    colorTheme: 'amber'
  },
  {
    id: 'DCH_BMC',
    code: 'DCH BMC',
    nameEnglish: 'Dewey Childcare House - BMC',
    nameKhmer: 'ឌូវី ឆាល់ឃែរ៍ ហោស៍ (សាខាបន្ទាយមានជ័យ)',
    shortName: 'DCH BMC',
    brand: 'DCH',
    location: 'Banteay Meanchey Campus',
    colorTheme: 'blue'
  },
  {
    id: 'DK_ROMCHEK_4',
    code: 'DK ROMCHEK 4',
    nameEnglish: 'Dewey Kindergarten - Romchek 4',
    nameKhmer: 'សាលាមត្តេយ្យ ឌូវី (សាខារំចេក ៤)',
    shortName: 'DK ROMCHEK 4',
    brand: 'DK',
    location: 'Romchek 4 Campus',
    colorTheme: 'purple'
  },
  {
    id: 'DK_BOREY_ROMCHEK',
    code: 'DK BOREY ROMCHEK',
    nameEnglish: 'Dewey Kindergarten - Borey Romchek',
    nameKhmer: 'សាលាមត្តេយ្យ ឌូវី (សាខាបុរីរំចេក)',
    shortName: 'DK BOREY ROMCHEK',
    brand: 'DK',
    location: 'Borey Romchek Campus',
    colorTheme: 'teal'
  },
  {
    id: 'DK_OCHAR',
    code: 'DK OCHAR',
    nameEnglish: 'Dewey Kindergarten - Ochar',
    nameKhmer: 'សាលាមត្តេយ្យ ឌូវី (សាខាអូរចារ)',
    shortName: 'DK OCHAR',
    brand: 'DK',
    location: 'Ochar Campus',
    colorTheme: 'rose'
  },
  {
    id: 'DK_BMC',
    code: 'DK BMC',
    nameEnglish: 'Dewey Kindergarten - BMC',
    nameKhmer: 'សាលាមត្តេយ្យ ឌូវី (សាខាបន្ទាយមានជ័យ)',
    shortName: 'DK BMC',
    brand: 'DK',
    location: 'BMC Campus',
    colorTheme: 'indigo'
  }
];

export const getCampusClassroomOptions = (campusId?: CampusId): { id: string; name: string }[] => {
  const campus = CAMPUS_LIST.find(c => c.id === campusId);
  const isDK = campus?.brand === 'DK' || (campusId && (campusId as string).startsWith('DK_'));

  if (isDK) {
    return [
      { id: 'K1 - AM', name: 'K1 - AM' },
      { id: 'K1 - PM', name: 'K1 - PM' },
      { id: 'K2 - AM', name: 'K2 - AM' },
      { id: 'K2 - PM', name: 'K2 - PM' },
      { id: 'K3 - AM', name: 'K3 - AM' },
      { id: 'K3 - PM', name: 'K3 - PM' },
    ];
  }

  return [
    { id: 'Pre-Nursery - AM', name: 'Pre-Nursery - AM' },
    { id: 'Pre-Nursery - PM', name: 'Pre-Nursery - PM' },
    { id: 'Nursery - AM', name: 'Nursery - AM' },
    { id: 'Nursery - PM', name: 'Nursery - PM' },
    { id: 'Pre-School - AM', name: 'Pre-School - AM' },
    { id: 'Pre-School - PM', name: 'Pre-School - PM' },
    { id: 'Kindergarten - AM', name: 'Kindergarten - AM' },
    { id: 'Kindergarten - PM', name: 'Kindergarten - PM' },
  ];
};

export interface UserAccount {
  id: string;
  firebaseUid?: string;
  name: string;
  khmerName?: string;
  email: string;
  password?: string;
  avatar: string;
  role: UserRole;
  title: string;
  campusId?: CampusId;
  campusName?: string;
  registeredCampusIds?: CampusId[];
  assignedClassId?: string;
  assignedClassName?: string;
  ageGroup?: EarlyChildhoodAgeGroup;
  phone?: string;
  roomNumber?: string;
  joinedYear?: string;
  bio?: string;
  status?: 'active' | 'suspended';
}

export interface SystemAuditLog {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  action: 'CREATE_PLAN' | 'UPDATE_PLAN' | 'SUBMIT_PLAN' | 'APPROVE_PLAN' | 'REVISE_PLAN' | 'DELETE_PLAN' | 'USER_SIGNUP' | 'USER_LOGIN' | 'ROLE_CHANGE' | 'DELETE_USER' | 'ADD_CLASSROOM' | 'UPDATE_CLASSROOM' | 'DELETE_CLASSROOM' | 'UPDATE_SCHOOL_PROFILE' | 'UPDATE_LOGO' | 'RESET_LOGO' | 'FORCE_SYNC' | 'PUSH_LIVE_UPDATE' | 'PASSWORD_RESET_REQUEST';
  details: string;
  targetId?: string;
}

export interface SchoolProfile {
  schoolNameKhmer: string;
  schoolNameEnglish: string;
  schoolAbbreviation: string;
  taglineKhmer: string;
  taglineEnglish: string;
  portalBadgeText: string;
  customLogoUrl: string | null;
  campus?: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  academicYear: string;
  currentTerm: string;
  websiteUrl?: string;
  updatedAt?: string;
  updatedBy?: string;
  globalSignUpDisabled?: boolean;
  disabledSignUpCampuses?: Record<string, boolean>;
}

export interface Classroom {
  id: string;
  name: string;
  khmerName: string;
  code: string;
  campusId?: CampusId;
  ageGroup: EarlyChildhoodAgeGroup;
  leadTeacherId: string;
  leadTeacherName: string;
  assistantTeacherName: string;
  enrolledStudents: number;
  capacity: number;
  room: string;
  colorTheme: string;
  currentTheme: string;
}

export interface PlanAttachment {
  id: string;
  name: string;
  size: string;
  type: 'pdf' | 'docx' | 'image' | 'xlsx' | 'pptx';
  url?: string;
  uploadedAt: string;
}

export interface LearningCenterItem {
  id: string;
  centerName: string;
  activityDescription: string;
  materials: string;
}

export interface TrilingualFocus {
  englishVocab: string[];
  khmerVocab: string[];
  chineseVocab: string[];
  songOrRhyme: string;
  storyBook: string;
}

export interface AdminReviewFeedback {
  id: string;
  reviewerId: string;
  reviewerName: string;
  reviewerRole: string;
  date: string;
  comment: string;
  actionTaken: 'approved' | 'revision_requested' | 'comment_only';
  rubricScores?: {
    curriculumAlignment: number; // 1-5
    trilingualIntegration: number; // 1-5
    sensorySafety: number; // 1-5
    differentiation: number; // 1-5
  };
}

export interface SessionActivityRow {
  id: string;
  topicActivity: string;
  objectives: string;
  materialsSources: string;
  durationMins: number | string;
}

export interface OfficialSessionPlan {
  subject: string;
  activities: SessionActivityRow[];
  classId?: string;
  className?: string;
}

export interface LessonPlan {
  id: string;
  teacherId: string;
  teacherName: string;
  teacherAvatar: string;
  teacherEmail: string;
  campusId?: CampusId;
  classId: string;
  className: string;
  ageGroup: EarlyChildhoodAgeGroup;
  weekNumber: number;
  term: string; // e.g., 'Term 1 - 2026'
  startDate: string;
  endDate: string;
  themeTitle: string;
  themeDescription: string;
  domains: EarlyChildhoodDomain[];
  learningObjectives: string[];
  circleTimeActivities: string;
  learningCenters: LearningCenterItem[];
  outdoorSensoryPlay: string;
  trilingualFocus: TrilingualFocus;
  assessmentMethods: string;
  materialsAndSupplies: string[];
  attachments: PlanAttachment[];
  status: LessonPlanStatus;
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
  reviewedAt?: string;
  feedbackHistory: AdminReviewFeedback[];

  // Official Dewey Childcare House Format Template Fields
  planDate?: string;
  timeStart?: string;
  timeEnd?: string;
  warmUpCircleTime?: string;
  firstSession?: OfficialSessionPlan;
  secondSession?: OfficialSessionPlan;
  closing?: string;
}

export interface WeeklyComplianceRecord {
  teacherId: string;
  teacherName: string;
  className: string;
  avatar: string;
  status: 'submitted' | 'approved' | 'revision_requested' | 'missing' | 'draft';
  lessonPlanId?: string;
  submissionDate?: string;
}
