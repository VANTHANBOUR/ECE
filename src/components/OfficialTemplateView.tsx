import React from 'react';
import { LessonPlan, CAMPUS_LIST } from '../types';
import { useApp } from '../context/AppContext';
import { SchoolLogoIcon } from './BrandLogo';
import { formatDateDDMMYYYY, formatDateRange } from '../utils/dateUtils';

interface OfficialTemplateViewProps {
  plan?: LessonPlan | null;
  editable?: boolean;
  onUpdatePlan?: (updates: Partial<LessonPlan>) => void;
  showDottedLinesIfBlank?: boolean;
  className?: string;
  isPrintOnly?: boolean;
}

export const OfficialTemplateView: React.FC<OfficialTemplateViewProps> = ({
  plan,
  editable = false,
  onUpdatePlan,
  showDottedLinesIfBlank = true,
  className = '',
  isPrintOnly = false,
}) => {
  const { classrooms, selectedCampusId, schoolProfile } = useApp();

  const effectiveCampusId = plan?.campusId || selectedCampusId;
  const activeCampus = effectiveCampusId ? CAMPUS_LIST.find(c => c.id === effectiveCampusId) : null;
  const isDKCampus = activeCampus?.brand === 'DK' || 
    effectiveCampusId?.startsWith('DK_') || 
    Boolean(plan?.className && (plan.className.startsWith('K1') || plan.className.startsWith('K2') || plan.className.startsWith('K3'))) ||
    Boolean(plan?.firstSession?.className && (plan.firstSession.className.startsWith('K1') || plan.firstSession.className.startsWith('K2') || plan.firstSession.className.startsWith('K3')));
  
  const khmerTitle = isDKCampus ? (activeCampus?.nameKhmer || 'សាលាមត្តេយ្យ ឌូវី') : (schoolProfile?.schoolNameKhmer || 'ឌូវី ឆាល់ឃែរ៍ ហោស៍');
  const engTitle = isDKCampus ? 'Dewey Kindergarten' : (schoolProfile?.schoolNameEnglish || 'Dewey Childcare House');
  const portalSub = isDKCampus ? 'Dewey Kindergarten Portal' : 'School Management & Lesson Plan Portal';
  const formatLabel = isDKCampus ? 'Official DK Format' : 'Official DCH Format';

  const firstClassLabel = plan?.firstSession?.className;
  const secondClassLabel = plan?.secondSession?.className;

  const assignedClass = classrooms.find(c => c.id === plan?.classId);
  let rawClassName = plan?.className || assignedClass?.name || '.......................................';

  if (firstClassLabel && secondClassLabel && firstClassLabel !== secondClassLabel) {
    const clean1 = firstClassLabel.replace(/\s*\((Pre-Nursery|Nursery|Pre-School|Kindergarten|K1|K2|K3|Toddlers|2-3 Years|3-4 Years|4-5 Years|5-6 Years)\)/gi, '').trim();
    const clean2 = secondClassLabel.replace(/\s*\((Pre-Nursery|Nursery|Pre-School|Kindergarten|K1|K2|K3|Toddlers|2-3 Years|3-4 Years|4-5 Years|5-6 Years)\)/gi, '').trim();
    if (clean1 && clean2 && clean1 !== clean2) {
      rawClassName = `${clean1} & ${clean2}`;
    }
  }

  // Strip any parenthetical age ranges or duplicated age group text if rawClassName contains them
  const classNameDisplay = rawClassName.replace(/\s*\((Pre-Nursery|Nursery|Pre-School|Kindergarten|K1|K2|K3|Toddlers|2-3 Years|3-4 Years|4-5 Years|5-6 Years)\)/gi, '').trim();
  const dateDisplay = plan?.planDate
    ? formatDateDDMMYYYY(plan.planDate)
    : (plan?.startDate ? formatDateRange(plan.startDate, plan.endDate, ' ~ ') : '.......................................');
  
  // Format week, term/quarter, and school year: e.g. "13 - Q: 1 - SY: 2026-2027"
  const formatWeekTermSY = (weekNumber?: number, termStr?: string, startDate?: string): string => {
    const weekNum = weekNumber ?? 13;
    let termNum = '1';
    if (termStr) {
      const termMatch = termStr.match(/(?:Term|Q|Quarter)\s*(\d+)/i) || termStr.match(/(\d+)/);
      if (termMatch && termMatch[1]) {
        termNum = termMatch[1];
      }
    }
    let syStr = '2026-2027';
    if (termStr) {
      const syRangeMatch = termStr.match(/(20\d{2})\s*[-–/]\s*(20\d{2})/);
      if (syRangeMatch) {
        syStr = `${syRangeMatch[1]}-${syRangeMatch[2]}`;
      } else {
        const sySingleMatch = termStr.match(/(20\d{2})/);
        if (sySingleMatch) {
          const startYr = parseInt(sySingleMatch[1], 10);
          syStr = `${startYr}-${startYr + 1}`;
        }
      }
    } else if (startDate) {
      const yrMatch = startDate.match(/(20\d{2})/);
      if (yrMatch) {
        const startYr = parseInt(yrMatch[1], 10);
        syStr = `${startYr}-${startYr + 1}`;
      }
    }
    return `${weekNum} - Q: ${termNum} - SY: ${syStr}`;
  };

  const weekDisplay = plan ? formatWeekTermSY(plan.weekNumber, plan.term, plan.startDate) : '.......................................';
  const timeStartDisplay = plan?.timeStart || '08:30 AM';
  const timeEndDisplay = plan?.timeEnd || '11:30 AM';

  // Fallback to legacy modular data if firstSession / secondSession not explicitly structured
  const warmUpText = plan?.warmUpCircleTime || plan?.circleTimeActivities || '';
  
  const firstSessionSubject = plan?.firstSession?.subject || plan?.domains?.[0] || 'Language & Trilingual Early Literacy';
  const firstSessionActivities = plan?.firstSession?.activities && plan.firstSession.activities.length > 0
    ? plan.firstSession.activities
    : [
        {
          id: 's1_def1',
          topicActivity: plan?.learningCenters?.[0]?.activityDescription || plan?.themeTitle || 'Theme Introduction & Vocabulary Discovery',
          objectives: plan?.learningObjectives?.[0] || 'Identify key theme items and pronounce vocabulary accurately.',
          materialsSources: plan?.learningCenters?.[0]?.materials || plan?.materialsAndSupplies?.[0] || 'Theme picture cards, realia objects',
          durationMins: 25,
        },
        {
          id: 's1_def2',
          topicActivity: plan?.learningCenters?.[1]?.activityDescription || 'Guided Literacy & Fine Motor Tracing',
          objectives: plan?.learningObjectives?.[1] || 'Practice pencil/crayon grip and letter/shape recognition.',
          materialsSources: plan?.learningCenters?.[1]?.materials || 'Tracing worksheets, coloring materials',
          durationMins: 20,
        },
      ];

  const secondSessionSubject = plan?.secondSession?.subject || plan?.domains?.[1] || 'Sensory Discovery Science & Creative Play';
  const secondSessionActivities = plan?.secondSession?.activities && plan.secondSession.activities.length > 0
    ? plan.secondSession.activities
    : [
        {
          id: 's2_def1',
          topicActivity: plan?.learningCenters?.[2]?.activityDescription || plan?.outdoorSensoryPlay || 'Sensory Exploration & Tactile Stations',
          objectives: plan?.learningObjectives?.[2] || 'Observe cause and effect; explore tactile materials safely.',
          materialsSources: plan?.learningCenters?.[2]?.materials || 'Sensory bins, water table, loose parts',
          durationMins: 30,
        },
        {
          id: 's2_def2',
          topicActivity: plan?.learningCenters?.[3]?.activityDescription || 'Creative Arts / Music & Rhythm Circle',
          objectives: plan?.learningObjectives?.[3] || 'Express creativity through song, movement, and crafts.',
          materialsSources: plan?.materialsAndSupplies?.[1] || 'Percussion shakers, craft papers, non-toxic glue',
          durationMins: 25,
        },
      ];

  const closingText = plan?.closing || 'Review session highlights, tidy up learning areas, sing departure songs, and organize belongings for dismissal.';

  return (
    <div
      id="official-dch-lesson-plan-sheet"
      className={`bg-white text-black font-sans max-w-[800px] mx-auto p-6 sm:p-10 border border-slate-300 shadow-sm print:shadow-none print:border-none print:p-0 print:m-0 print:max-w-none print:min-h-0 print:h-auto ${className}`}
      style={{ minHeight: '1050px' }}
    >
      {/* 1. Header: School Logo & Title (Official DCH Letterhead Format) */}
      <div className="flex flex-col sm:flex-row items-center justify-between border-b-2 border-[#006838] pb-4 mb-6 gap-4">
        <div className="flex items-center gap-4">
          <SchoolLogoIcon size={64} className="shrink-0" brand={isDKCampus ? 'DK' : 'DCH'} />
          <div className="text-left">
            <h1 className="text-xs font-bold tracking-normal text-[#006838] font-['Battambang',sans-serif] leading-none mb-1">
              {khmerTitle}
            </h1>
            <h2 
              className="text-xl sm:text-2xl font-extrabold tracking-tight uppercase leading-tight text-[#006838]"
              style={{ fontFamily: 'Georgia, Cambria, "Times New Roman", serif' }}
            >
              {engTitle}
            </h2>
            <p className="text-[11px] font-semibold tracking-wider uppercase text-slate-500 font-['Plus_Jakarta_Sans',sans-serif]">
              {portalSub}
            </p>
          </div>
        </div>
        <div className="text-center sm:text-right flex flex-col justify-center shrink-0">
          <h3 className="text-lg sm:text-xl font-black uppercase tracking-widest text-[#006838]">
            Lesson Plan
          </h3>
          <span className="text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#006838] border border-emerald-200/60 font-bold mt-1">
            {formatLabel}
          </span>
        </div>
      </div>

      {/* 2. Metadata Grid (Date, Week, Class, Time) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8 mb-6 text-[15px]">
        {/* Row 1 */}
        <div className="flex items-baseline">
          <span className="font-bold mr-1.5 shrink-0 text-black">Date:</span>
          {plan ? (
            <span className="font-semibold text-slate-800 border-b border-dotted border-slate-700 grow pb-0.5 px-1">
              {dateDisplay}
            </span>
          ) : (
            <span className="border-b border-dotted border-slate-400 grow h-4 inline-block" />
          )}
        </div>

        <div className="flex items-baseline">
          <span className="font-bold mr-1.5 shrink-0 text-black">Week:</span>
          {plan ? (
            <span className="font-semibold text-slate-800 border-b border-dotted border-slate-700 grow pb-0.5 px-1">
              {weekDisplay}
            </span>
          ) : (
            <span className="border-b border-dotted border-slate-400 grow h-4 inline-block" />
          )}
        </div>

        {/* Row 2 */}
        <div className="flex items-baseline">
          <span className="font-bold mr-1.5 shrink-0 text-black">Class:</span>
          {plan ? (
            <span className="font-semibold text-slate-800 border-b border-dotted border-slate-700 grow pb-0.5 px-1">
              {classNameDisplay}
            </span>
          ) : (
            <span className="border-b border-dotted border-slate-400 grow h-4 inline-block" />
          )}
        </div>

        <div className="flex items-baseline">
          <span className="font-bold mr-1.5 shrink-0 text-black">Time:</span>
          {plan ? (
            <div className="flex items-baseline grow border-b border-dotted border-slate-700 pb-0.5 px-1">
              <span className="font-semibold text-slate-800">{timeStartDisplay}</span>
              <span className="mx-2 text-slate-500 font-normal">to</span>
              <span className="font-semibold text-slate-800">{timeEndDisplay}</span>
            </div>
          ) : (
            <div className="flex items-baseline grow">
              <span className="border-b border-dotted border-slate-400 grow h-4 inline-block" />
              <span className="mx-2 text-black font-normal">to</span>
              <span className="border-b border-dotted border-slate-400 grow h-4 inline-block" />
            </div>
          )}
        </div>
      </div>

      {/* 3. Section I: Warm up / circle time */}
      <div className="mb-6">
        <div className="font-bold text-[16px] text-black mb-2 flex items-center">
          <span className="mr-3">I.</span>
          <span>Warm up/ circle time:</span>
        </div>

        {plan && warmUpText ? (
          <div className="pl-6 text-[14px] text-slate-900 leading-relaxed py-1">
            <p className="whitespace-pre-line">{warmUpText}</p>
          </div>
        ) : (
          <div className="pl-6 space-y-3 pt-1">
            <div className="border-b border-dotted border-slate-400 w-full h-4" />
            <div className="border-b border-dotted border-slate-400 w-full h-4" />
          </div>
        )}
      </div>

      {/* 4. Section II: 1st Session */}
      <div className="mb-6">
        <div className="font-bold text-[16px] text-black mb-2 flex items-center">
          <span className="mr-3">II.</span>
          <span>1<sup>st</sup> Session:</span>
        </div>

        <div className="pl-6 mb-3 flex items-baseline">
          <span className="font-bold text-[14px] text-black mr-2">Subject:</span>
          {plan ? (
            <span className="font-semibold text-slate-800 border-b border-dotted border-slate-700 grow pb-0.5 px-1 text-[14px]">
              {firstSessionSubject}
            </span>
          ) : (
            <span className="border-b border-dotted border-slate-400 grow h-4 inline-block" />
          )}
        </div>

        {/* 1st Session Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border-2 border-black text-left text-[13px]">
            <thead>
              <tr className="border-b-2 border-black bg-slate-50 print:bg-transparent">
                <th className="border-r-2 border-black p-2.5 font-bold text-black w-[30%]">
                  Topic/Activity
                </th>
                <th className="border-r-2 border-black p-2.5 font-bold text-black w-[30%]">
                  Objective(s)
                </th>
                <th className="border-r-2 border-black p-2.5 font-bold text-black w-[28%]">
                  Materials/ sources
                </th>
                <th className="p-2.5 font-bold text-black w-[12%] text-center whitespace-nowrap">
                  Duration <span className="block text-[11px] font-medium text-slate-600">(mns)</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {plan ? (
                firstSessionActivities.map((act, index) => (
                  <tr key={act.id || index} className="border-b border-black">
                    <td className="border-r-2 border-black p-2.5 align-top text-slate-900 font-medium leading-snug">
                      {act.topicActivity}
                    </td>
                    <td className="border-r-2 border-black p-2.5 align-top text-slate-800 leading-snug">
                      {act.objectives}
                    </td>
                    <td className="border-r-2 border-black p-2.5 align-top text-slate-800 leading-snug">
                      {act.materialsSources}
                    </td>
                    <td className="p-2.5 align-top text-center font-bold text-slate-900">
                      {act.durationMins} mns
                    </td>
                  </tr>
                ))
              ) : (
                <>
                  <tr className="border-b border-black h-24">
                    <td className="border-r-2 border-black p-2.5 align-top"></td>
                    <td className="border-r-2 border-black p-2.5 align-top"></td>
                    <td className="border-r-2 border-black p-2.5 align-top"></td>
                    <td className="p-2.5 align-top text-center"></td>
                  </tr>
                  <tr className="border-b border-black h-24">
                    <td className="border-r-2 border-black p-2.5 align-top"></td>
                    <td className="border-r-2 border-black p-2.5 align-top"></td>
                    <td className="border-r-2 border-black p-2.5 align-top"></td>
                    <td className="p-2.5 align-top text-center"></td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Section III: 2nd Session */}
      <div className="mb-6">
        <div className="font-bold text-[16px] text-black mb-2 flex items-center">
          <span className="mr-3">III.</span>
          <span>2<sup>nd</sup> Session:</span>
        </div>

        <div className="pl-6 mb-3 flex items-baseline">
          <span className="font-bold text-[14px] text-black mr-2">Subject:</span>
          {plan ? (
            <span className="font-semibold text-slate-800 border-b border-dotted border-slate-700 grow pb-0.5 px-1 text-[14px]">
              {secondSessionSubject}
            </span>
          ) : (
            <span className="border-b border-dotted border-slate-400 grow h-4 inline-block" />
          )}
        </div>

        {/* 2nd Session Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border-2 border-black text-left text-[13px]">
            <thead>
              <tr className="border-b-2 border-black bg-slate-50 print:bg-transparent">
                <th className="border-r-2 border-black p-2.5 font-bold text-black w-[30%]">
                  Topic/Activity
                </th>
                <th className="border-r-2 border-black p-2.5 font-bold text-black w-[30%]">
                  Objective(s)
                </th>
                <th className="border-r-2 border-black p-2.5 font-bold text-black w-[28%]">
                  Materials/ sources
                </th>
                <th className="p-2.5 font-bold text-black w-[12%] text-center whitespace-nowrap">
                  Duration <span className="block text-[11px] font-medium text-slate-600">(mns)</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {plan ? (
                secondSessionActivities.map((act, index) => (
                  <tr key={act.id || index} className="border-b border-black">
                    <td className="border-r-2 border-black p-2.5 align-top text-slate-900 font-medium leading-snug">
                      {act.topicActivity}
                    </td>
                    <td className="border-r-2 border-black p-2.5 align-top text-slate-800 leading-snug">
                      {act.objectives}
                    </td>
                    <td className="border-r-2 border-black p-2.5 align-top text-slate-800 leading-snug">
                      {act.materialsSources}
                    </td>
                    <td className="p-2.5 align-top text-center font-bold text-slate-900">
                      {act.durationMins} mns
                    </td>
                  </tr>
                ))
              ) : (
                <>
                  <tr className="border-b border-black h-24">
                    <td className="border-r-2 border-black p-2.5 align-top"></td>
                    <td className="border-r-2 border-black p-2.5 align-top"></td>
                    <td className="border-r-2 border-black p-2.5 align-top"></td>
                    <td className="p-2.5 align-top text-center"></td>
                  </tr>
                  <tr className="border-b border-black h-24">
                    <td className="border-r-2 border-black p-2.5 align-top"></td>
                    <td className="border-r-2 border-black p-2.5 align-top"></td>
                    <td className="border-r-2 border-black p-2.5 align-top"></td>
                    <td className="p-2.5 align-top text-center"></td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. Section IV: Closing */}
      <div className="mb-4">
        <div className="font-bold text-[16px] text-black mb-2 flex items-center">
          <span className="mr-3">IV.</span>
          <span>Closing:</span>
        </div>

        {plan && closingText ? (
          <div className="pl-6 text-[14px] text-slate-900 leading-relaxed py-1">
            <p className="whitespace-pre-line">{closingText}</p>
          </div>
        ) : (
          <div className="pl-6 space-y-3 pt-1">
            <div className="border-b border-dotted border-slate-400 w-full h-4" />
            <div className="border-b border-dotted border-slate-400 w-full h-4" />
          </div>
        )}
      </div>

      {/* Footer metadata if present */}
      {plan?.teacherName && (
        <div className="mt-8 pt-4 border-t border-dashed border-slate-300 flex items-center justify-between text-xs text-slate-500 print:text-black">
          <div>
            <span className="font-semibold text-slate-700">Lead Educator: </span>
            <span>{plan.teacherName}</span>
          </div>
          <div>
            <span className="font-semibold text-slate-700">Status: </span>
            <span className="uppercase font-bold">{plan.status}</span>
          </div>
        </div>
      )}
    </div>
  );
};
