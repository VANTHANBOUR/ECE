import { CampusId, Classroom, LessonPlan, UserAccount } from '../types';

/**
 * Checks whether a given lesson plan belongs to the specified campusId.
 * Accounts for explicit plan.campusId, associated classroom's campusId,
 * and teacher's assigned or registered campusIds.
 */
export function isPlanFromCampus(
  plan: LessonPlan,
  campusId: CampusId | string,
  classrooms: Classroom[],
  allAccounts?: UserAccount[]
): boolean {
  if (!campusId || campusId === 'ALL' || campusId === 'all') return true;

  // 1. Direct match on explicit plan.campusId
  if (plan.campusId && plan.campusId !== 'ALL') {
    if (plan.campusId === campusId) return true;
  }

  // 2. Associated classroom's campus
  const cls = classrooms.find(c => c.id === plan.classId);
  if (cls && cls.campusId && cls.campusId !== 'ALL') {
    if (cls.campusId === campusId) return true;
  }

  // 3. Teacher's primary campus or registered branch list
  if (allAccounts && allAccounts.length > 0) {
    const teacher = allAccounts.find(a => a.id === plan.teacherId);
    if (teacher) {
      if (teacher.campusId === campusId) return true;
      if (teacher.registeredCampusIds?.includes(campusId as CampusId)) return true;
    }
  }

  return false;
}
