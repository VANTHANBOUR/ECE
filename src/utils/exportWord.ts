import { LessonPlan, Classroom, SchoolProfile, CAMPUS_LIST } from '../types';
import { formatDateDDMMYYYY, formatDateRange } from './dateUtils';

interface ExportWordOptions {
  classrooms?: Classroom[];
  selectedCampusId?: string | null;
  schoolProfile?: SchoolProfile | null;
}

function escapeHtml(text?: string | null): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

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

const DK_SVG_STRING = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 280" width="320" height="280">
  <rect width="320" height="280" rx="36" fill="#FFFFFF"/>
  <text x="154" y="166" fill="#007A3D" font-family="'Times New Roman', 'Georgia', 'Baskerville', 'Palatino', serif" font-size="172" font-weight="bold" text-anchor="middle" letter-spacing="-3">DK</text>
  <path d="M 28 185 C 68 198 110 211 154 215 C 198 211 240 198 280 185 C 283 187 281 190 277 192 C 238 209 196 221 154 223 C 112 221 70 209 31 192 C 27 190 25 187 28 185 Z" fill="#F58220"/>
  <path d="M 26 197 C 68 211 110 225 154 228 C 198 225 240 211 282 197 C 285 199 283 202 278 205 C 238 222 196 238 154 244 C 112 238 70 222 30 205 C 25 202 23 199 26 197 Z" fill="#007A3D"/>
</svg>`;

const DCH_SVG_STRING = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
  <rect width="500" height="500" rx="36" fill="#FFFFFF"/>
  <defs>
    <path id="dchOuter" d="M 250, 62 C 308, 62 364, 73 410, 85 C 418, 178 421, 264 380, 348 C 346, 404 296, 434 250, 452 C 204, 434 154, 404 120, 348 C 79, 264 82, 178 90, 85 C 136, 73 192, 62 250, 62 Z"/>
    <path id="dchInner" d="M 250, 78 C 304, 78 354, 88 395, 99 C 403, 182 405, 258 368, 335 C 336, 386 290, 416 250, 432 C 210, 416 164, 386 132, 335 C 95, 258 97, 182 105, 99 C 146, 88 196, 78 250, 78 Z"/>
    <clipPath id="dchClip"><use href="#dchInner" /></clipPath>
    <clipPath id="dchRight"><rect x="250" y="0" width="250" height="500" /></clipPath>
  </defs>
  <use href="#dchOuter" fill="#008A4B" />
  <path d="M 250, 71 C 306, 71 359, 81 403, 92 C 411, 180 413, 261 374, 342 C 341, 395 293, 425 250, 442 C 207, 425 159, 395 126, 342 C 87, 261 89, 180 97, 92 C 141, 81 194, 71 250, 71 Z" fill="none" stroke="#FA9E1B" stroke-width="12" stroke-linejoin="round" stroke-linecap="round"/>
  <g clip-path="url(#dchClip)">
    <rect x="0" y="0" width="250" height="500" fill="#008A4B" />
    <rect x="250" y="0" width="250" height="500" fill="#FFFFFF" />
    <path d="M 250, 365 C 290, 342 342, 308 405, 272 L 405, 450 L 250, 450 Z" fill="#008A4B" />
    <path d="M 250, 350 C 290, 327 342, 294 405, 258" stroke="#008A4B" stroke-width="6.5" fill="none" stroke-linecap="round"/>
    <path d="M 250, 335 C 290, 312 342, 280 405, 245" stroke="#008A4B" stroke-width="5" fill="none" stroke-linecap="round"/>
    <line x1="250" y1="78" x2="250" y2="432" stroke="#008A4B" stroke-width="1.5" />
    <text x="176" y="184" fill="#FFFFFF" font-family="'Times New Roman', 'Baskerville', 'Georgia', serif" font-size="94" font-weight="bold" text-anchor="middle">D</text>
    <text x="176" y="272" fill="#FFFFFF" font-family="'Times New Roman', 'Baskerville', 'Georgia', serif" font-size="94" font-weight="bold" text-anchor="middle">C</text>
    <text x="176" y="360" fill="#FFFFFF" font-family="'Times New Roman', 'Baskerville', 'Georgia', serif" font-size="94" font-weight="bold" text-anchor="middle">H</text>
    <g clip-path="url(#dchRight)">
      <polygon points="324,142 376,158 324,174 272,158" fill="#008A4B"/>
      <path d="M 281, 161 C 281, 161 281, 196 324, 202 C 367, 196 367, 161 367, 161 C 352, 178 338, 185 324, 185 C 310, 185 296, 178 281, 161 Z" fill="#008A4B"/>
      <circle cx="324" cy="158" r="3.5" fill="#006838" />
      <path d="M 324, 158 C 302, 156 280, 158 270, 162 L 270, 198" stroke="#008A4B" stroke-width="2.5" stroke-linecap="round" fill="none"/>
      <path d="M 268, 198 L 272, 198 L 273, 206 L 267, 206 Z" fill="#008A4B"/>
      <path d="M 322, 234 C 308, 212 284, 204 256, 218 C 274, 222 300, 224 320, 235 Z" fill="#FA9E1B"/>
      <path d="M 322, 237 C 304, 228 274, 224 254, 228 C 274, 234 300, 237 320, 238 Z" fill="#FA9E1B"/>
      <path d="M 326, 234 C 340, 212 364, 204 392, 218 C 374, 222 348, 224 328, 235 Z" fill="#FA9E1B"/>
      <path d="M 326, 237 C 344, 228 374, 224 394, 228 C 374, 234 348, 237 328, 238 Z" fill="#FA9E1B"/>
    </g>
  </g>
</svg>`;

/**
 * Converts SVG or custom image URL to a high-res Base64 PNG data URL
 * for offline embedding into Word documents.
 */
async function getLogoDataUrl(isDK: boolean, customLogoUrl?: string | null): Promise<string> {
  const targetSvg = isDK ? DK_SVG_STRING : DCH_SVG_STRING;
  const imageSource = (!isDK && customLogoUrl) ? customLogoUrl : null;

  return new Promise((resolve) => {
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      let objectUrl = '';
      if (!imageSource) {
        const svgBlob = new Blob([targetSvg], { type: 'image/svg+xml;charset=utf-8' });
        objectUrl = URL.createObjectURL(svgBlob);
      }

      const timer = setTimeout(() => {
        if (objectUrl) URL.revokeObjectURL(objectUrl);
        // Fallback to direct SVG data URI if canvas is delayed
        resolve(`data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(targetSvg)))}`);
      }, 600);

      img.onload = () => {
        clearTimeout(timer);
        try {
          const canvas = document.createElement('canvas');
          canvas.width = 180;
          canvas.height = 180;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, 180, 180);
            ctx.drawImage(img, 0, 0, 180, 180);
            const dataUrl = canvas.toDataURL('image/png');
            if (objectUrl) URL.revokeObjectURL(objectUrl);
            resolve(dataUrl);
            return;
          }
        } catch {
          // fallback
        }
        if (objectUrl) URL.revokeObjectURL(objectUrl);
        resolve(`data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(targetSvg)))}`);
      };

      img.onerror = () => {
        clearTimeout(timer);
        if (objectUrl) URL.revokeObjectURL(objectUrl);
        resolve(`data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(targetSvg)))}`);
      };

      img.src = imageSource || objectUrl;
    } catch {
      resolve(`data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(targetSvg)))}`);
    }
  });
}

export async function exportLessonPlanToWord(
  plan: LessonPlan,
  options: ExportWordOptions = {}
): Promise<void> {
  const { classrooms = [], selectedCampusId, schoolProfile } = options;

  const effectiveCampusId = plan.campusId || selectedCampusId;
  const activeCampus = effectiveCampusId ? CAMPUS_LIST.find((c) => c.id === effectiveCampusId) : null;
  const isDKCampus = 
    activeCampus?.brand === 'DK' || 
    effectiveCampusId?.startsWith('DK_') || 
    Boolean(plan.className && (plan.className.startsWith('K1') || plan.className.startsWith('K2') || plan.className.startsWith('K3'))) ||
    Boolean(plan.firstSession?.className && (plan.firstSession.className.startsWith('K1') || plan.firstSession.className.startsWith('K2') || plan.firstSession.className.startsWith('K3'))) ||
    false;

  const khmerTitle = isDKCampus
    ? activeCampus?.nameKhmer || 'សាលាមត្តេយ្យ ឌូវី'
    : schoolProfile?.schoolNameKhmer || 'ឌូវី ឆាល់ឃែរ៍ ហោស៍';

  const engTitle = isDKCampus
    ? 'Dewey Kindergarten'
    : schoolProfile?.schoolNameEnglish || 'Dewey Childcare House';

  const portalSub = isDKCampus
    ? 'Dewey Kindergarten Portal'
    : 'School Management & Lesson Plan Portal';

  const formatLabel = isDKCampus ? 'Official DK Format' : 'Official DCH Format';

  // Format Class Name Display
  const firstClassLabel = plan.firstSession?.className;
  const secondClassLabel = plan.secondSession?.className;
  const assignedClass = classrooms.find((c) => c.id === plan.classId);
  let rawClassName = plan.className || assignedClass?.name || '.......................................';

  if (firstClassLabel && secondClassLabel && firstClassLabel !== secondClassLabel) {
    const clean1 = firstClassLabel
      .replace(/\s*\((Pre-Nursery|Nursery|Pre-School|Kindergarten|K1|K2|K3|Toddlers|2-3 Years|3-4 Years|4-5 Years|5-6 Years)\)/gi, '')
      .trim();
    const clean2 = secondClassLabel
      .replace(/\s*\((Pre-Nursery|Nursery|Pre-School|Kindergarten|K1|K2|K3|Toddlers|2-3 Years|3-4 Years|4-5 Years|5-6 Years)\)/gi, '')
      .trim();
    if (clean1 && clean2 && clean1 !== clean2) {
      rawClassName = `${clean1} & ${clean2}`;
    }
  }

  const classNameDisplay = rawClassName
    .replace(/\s*\((Pre-Nursery|Nursery|Pre-School|Kindergarten|K1|K2|K3|Toddlers|2-3 Years|3-4 Years|4-5 Years|5-6 Years)\)/gi, '')
    .trim();

  // Format Date and Week
  const dateDisplay = plan.planDate
    ? formatDateDDMMYYYY(plan.planDate)
    : plan.startDate
    ? formatDateRange(plan.startDate, plan.endDate, ' ~ ')
    : '.......................................';

  const weekDisplay = formatWeekTermSY(plan.weekNumber, plan.term, plan.startDate);
  const timeStartDisplay = plan.timeStart || '08:30 AM';
  const timeEndDisplay = plan.timeEnd || '11:30 AM';

  // Section contents
  const warmUpText = plan.warmUpCircleTime || plan.circleTimeActivities || '';

  const firstSessionSubject =
    plan.firstSession?.subject || plan.domains?.[0] || 'Language & Trilingual Early Literacy';
  const firstSessionActivities =
    plan.firstSession?.activities && plan.firstSession.activities.length > 0
      ? plan.firstSession.activities
      : [
          {
            id: 's1_def1',
            topicActivity:
              plan.learningCenters?.[0]?.activityDescription ||
              plan.themeTitle ||
              'Theme Introduction & Vocabulary Discovery',
            objectives:
              plan.learningObjectives?.[0] ||
              'Identify key theme items and pronounce vocabulary accurately.',
            materialsSources:
              plan.learningCenters?.[0]?.materials ||
              plan.materialsAndSupplies?.[0] ||
              'Theme picture cards, realia objects',
            durationMins: 25,
          },
          {
            id: 's1_def2',
            topicActivity:
              plan.learningCenters?.[1]?.activityDescription ||
              'Guided Literacy & Fine Motor Tracing',
            objectives:
              plan.learningObjectives?.[1] ||
              'Practice pencil/crayon grip and letter/shape recognition.',
            materialsSources:
              plan.learningCenters?.[1]?.materials || 'Tracing worksheets, coloring materials',
            durationMins: 20,
          },
        ];

  const secondSessionSubject =
    plan.secondSession?.subject ||
    plan.domains?.[1] ||
    'Sensory Discovery Science & Creative Play';
  const secondSessionActivities =
    plan.secondSession?.activities && plan.secondSession.activities.length > 0
      ? plan.secondSession.activities
      : [
          {
            id: 's2_def1',
            topicActivity:
              plan.learningCenters?.[2]?.activityDescription ||
              plan.outdoorSensoryPlay ||
              'Sensory Exploration & Tactile Stations',
            objectives:
              plan.learningObjectives?.[2] ||
              'Observe cause and effect; explore tactile materials safely.',
            materialsSources:
              plan.learningCenters?.[2]?.materials || 'Sensory bins, water table, loose parts',
            durationMins: 30,
          },
          {
            id: 's2_def2',
            topicActivity:
              plan.learningCenters?.[3]?.activityDescription ||
              'Creative Arts / Music & Rhythm Circle',
            objectives:
              plan.learningObjectives?.[3] ||
              'Express creativity through song, movement, and crafts.',
            materialsSources:
              plan.materialsAndSupplies?.[1] ||
              'Percussion shakers, craft papers, non-toxic glue',
            durationMins: 25,
          },
        ];

  const closingText =
    plan.closing ||
    'Review session highlights, tidy up learning areas, sing departure songs, and organize belongings for dismissal.';

  // Generate Base64 Logo Data
  const logoDataUrl = await getLogoDataUrl(isDKCampus, schoolProfile?.customLogoUrl);

  const logoCellHtml = logoDataUrl
    ? `<img src="${logoDataUrl}" width="64" height="64" style="width: 64px; height: 64px; display: block; border-radius: 8px;" alt="School Logo" />`
    : `<table style="width: 60px; height: 60px; border: 1.5pt solid #006838; border-radius: 8px; text-align: center; background: #ffffff;"><tr><td style="font-family: Georgia, serif; font-size: 16pt; font-weight: bold; color: #006838;">${isDKCampus ? 'DK' : 'DCH'}</td></tr></table>`;

  const firstSessionRows = firstSessionActivities
    .map(
      (act) => `
    <tr style="border-bottom: 1pt solid #000000;">
      <td style="border-right: 2pt solid #000000; border-bottom: 1pt solid #000000; padding: 6pt 8pt; vertical-align: top; font-weight: 500; color: #0f172a; line-height: 1.35;">
        ${escapeHtml(act.topicActivity)}
      </td>
      <td style="border-right: 2pt solid #000000; border-bottom: 1pt solid #000000; padding: 6pt 8pt; vertical-align: top; color: #1e293b; line-height: 1.35;">
        ${escapeHtml(act.objectives)}
      </td>
      <td style="border-right: 2pt solid #000000; border-bottom: 1pt solid #000000; padding: 6pt 8pt; vertical-align: top; color: #1e293b; line-height: 1.35;">
        ${escapeHtml(act.materialsSources)}
      </td>
      <td style="border-bottom: 1pt solid #000000; padding: 6pt 6pt; vertical-align: top; text-align: center; font-weight: bold; color: #0f172a;">
        ${act.durationMins} mns
      </td>
    </tr>
  `
    )
    .join('');

  const secondSessionRows = secondSessionActivities
    .map(
      (act) => `
    <tr style="border-bottom: 1pt solid #000000;">
      <td style="border-right: 2pt solid #000000; border-bottom: 1pt solid #000000; padding: 6pt 8pt; vertical-align: top; font-weight: 500; color: #0f172a; line-height: 1.35;">
        ${escapeHtml(act.topicActivity)}
      </td>
      <td style="border-right: 2pt solid #000000; border-bottom: 1pt solid #000000; padding: 6pt 8pt; vertical-align: top; color: #1e293b; line-height: 1.35;">
        ${escapeHtml(act.objectives)}
      </td>
      <td style="border-right: 2pt solid #000000; border-bottom: 1pt solid #000000; padding: 6pt 8pt; vertical-align: top; color: #1e293b; line-height: 1.35;">
        ${escapeHtml(act.materialsSources)}
      </td>
      <td style="border-bottom: 1pt solid #000000; padding: 6pt 6pt; vertical-align: top; text-align: center; font-weight: bold; color: #0f172a;">
        ${act.durationMins} mns
      </td>
    </tr>
  `
    )
    .join('');

  const htmlDocument = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset="utf-8">
      <title>${escapeHtml(engTitle)} - Lesson Plan</title>
      <!--[if gte mso 9]>
      <xml>
        <w:WordDocument>
          <w:View>Print</w:View>
          <w:Zoom>100</w:Zoom>
          <w:DoNotOptimizeForBrowser/>
        </w:WordDocument>
      </xml>
      <![endif]-->
      <style>
        @page {
          size: 210mm 297mm; /* A4 standard portrait */
          margin: 15mm 15mm 15mm 15mm;
          mso-header-margin: 20pt;
          mso-footer-margin: 20pt;
          mso-paper-source: 0;
        }
        body {
          font-family: 'Plus Jakarta Sans', Calibri, Arial, sans-serif;
          color: #000000;
          margin: 0;
          padding: 0;
          background-color: #ffffff;
        }
        table {
          mso-displayed-decimal-separator: "\\.";
          mso-displayed-thousand-separator: "\\,";
        }
        .session-table {
          width: 100%;
          border-collapse: collapse;
          border: 2pt solid #000000;
        }
        .session-table th {
          background-color: #f8fafc;
          border-bottom: 2pt solid #000000;
          border-right: 2pt solid #000000;
          padding: 6pt 8pt;
          font-size: 10pt;
          font-weight: bold;
          color: #000000;
          text-align: left;
        }
        .session-table td {
          border-bottom: 1pt solid #000000;
          border-right: 2pt solid #000000;
          padding: 6pt 8pt;
          font-size: 10pt;
          vertical-align: top;
          color: #0f172a;
          line-height: 1.35;
        }
        .session-table th:last-child,
        .session-table td:last-child {
          border-right: none;
        }
      </style>
    </head>
    <body>
      <div style="max-width: 800px; margin: 0 auto;">
        <!-- 1. Header: School Logo, Title & Lesson Plan Label (Exact Match to Print Preview) -->
        <table style="width: 100%; border-collapse: collapse; border-bottom: 2.5pt solid #006838; margin-bottom: 16pt; padding-bottom: 8pt;">
          <tr>
            <td style="vertical-align: middle; width: 68px; padding-right: 12pt; padding-bottom: 6pt;">
              ${logoCellHtml}
            </td>
            <td style="vertical-align: middle; text-align: left; padding-bottom: 6pt;">
              <div style="font-family: 'Battambang', 'Khmer OS', 'Khmer OS Battambang', 'Segoe UI', sans-serif; font-size: 10pt; font-weight: bold; color: #006838; line-height: 1.2; margin-bottom: 2pt;">
                ${escapeHtml(khmerTitle)}
              </div>
              <div style="font-family: 'Georgia', 'Cambria', 'Times New Roman', serif; font-size: 19pt; font-weight: 800; text-transform: uppercase; color: #006838; line-height: 1.1; margin-bottom: 2pt;">
                ${escapeHtml(engTitle)}
              </div>
              <div style="font-family: 'Plus Jakarta Sans', 'Segoe UI', Arial, sans-serif; font-size: 8.5pt; font-weight: bold; text-transform: uppercase; letter-spacing: 0.8pt; color: #64748b;">
                ${escapeHtml(portalSub)}
              </div>
            </td>
            <td style="vertical-align: middle; text-align: right; width: 170px; padding-bottom: 6pt; white-space: nowrap;">
              <div style="font-family: 'Plus Jakarta Sans', 'Segoe UI', Arial, sans-serif; font-size: 15pt; font-weight: 900; text-transform: uppercase; letter-spacing: 1.5pt; color: #006838; margin-bottom: 4pt;">
                LESSON PLAN
              </div>
              <div>
                <span style="font-family: 'Segoe UI', Arial, sans-serif; font-size: 8pt; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5pt; padding: 2pt 8pt; background-color: #ecfdf5; color: #006838; border: 1pt solid #a7f3d0; border-radius: 10pt;">
                  ${escapeHtml(formatLabel)}
                </span>
              </div>
            </td>
          </tr>
        </table>

        <!-- 2. Metadata Grid: Date, Week, Class, Time -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 16pt; font-size: 11pt; font-family: 'Plus Jakarta Sans', Calibri, Arial, sans-serif;">
          <tr>
            <td style="width: 50%; padding: 4pt 16pt 4pt 0; vertical-align: bottom;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="width: 1%; white-space: nowrap; font-weight: bold; color: #000000; padding-right: 6pt;">Date:</td>
                  <td style="border-bottom: 1pt dotted #334155; font-weight: 600; color: #1e293b; padding-left: 4pt; padding-bottom: 1pt;">${escapeHtml(dateDisplay)}</td>
                </tr>
              </table>
            </td>
            <td style="width: 50%; padding: 4pt 0 4pt 16pt; vertical-align: bottom;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="width: 1%; white-space: nowrap; font-weight: bold; color: #000000; padding-right: 6pt;">Week:</td>
                  <td style="border-bottom: 1pt dotted #334155; font-weight: 600; color: #1e293b; padding-left: 4pt; padding-bottom: 1pt;">${escapeHtml(weekDisplay)}</td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="width: 50%; padding: 6pt 16pt 4pt 0; vertical-align: bottom;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="width: 1%; white-space: nowrap; font-weight: bold; color: #000000; padding-right: 6pt;">Class:</td>
                  <td style="border-bottom: 1pt dotted #334155; font-weight: 600; color: #1e293b; padding-left: 4pt; padding-bottom: 1pt;">${escapeHtml(classNameDisplay)}</td>
                </tr>
              </table>
            </td>
            <td style="width: 50%; padding: 6pt 0 4pt 16pt; vertical-align: bottom;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="width: 1%; white-space: nowrap; font-weight: bold; color: #000000; padding-right: 6pt;">Time:</td>
                  <td style="border-bottom: 1pt dotted #334155; font-weight: 600; color: #1e293b; padding-left: 4pt; padding-bottom: 1pt;">
                    ${escapeHtml(timeStartDisplay)} <span style="font-weight: normal; color: #64748b; margin: 0 4pt;">to</span> ${escapeHtml(timeEndDisplay)}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- 3. Section I: Warm up / circle time (Clean text without green vertical bar) -->
        <div style="margin-bottom: 16pt;">
          <div style="font-family: 'Plus Jakarta Sans', Calibri, Arial, sans-serif; font-size: 12pt; font-weight: bold; color: #000000; margin-bottom: 6pt;">
            I. &nbsp;&nbsp; Warm up/ circle time:
          </div>
          <div style="margin-left: 20pt; font-family: 'Plus Jakarta Sans', Calibri, Arial, sans-serif; font-size: 10.5pt; line-height: 1.5; color: #0f172a;">
            <p style="margin: 0; padding: 0; line-height: 1.5;">${escapeHtml(warmUpText).replace(/\r?\n/g, '<br/>')}</p>
          </div>
        </div>

        <!-- 4. Section II: 1st Session -->
        <div style="margin-bottom: 16pt;">
          <div style="font-family: 'Plus Jakarta Sans', Calibri, Arial, sans-serif; font-size: 12pt; font-weight: bold; color: #000000; margin-bottom: 6pt;">
            II. &nbsp;&nbsp; 1<sup>st</sup> Session:
          </div>
          <div style="margin-left: 20pt; margin-bottom: 8pt;">
            <table style="width: 100%; border-collapse: collapse; font-family: 'Plus Jakarta Sans', Calibri, Arial, sans-serif;">
              <tr>
                <td style="width: 1%; white-space: nowrap; font-size: 10.5pt; font-weight: bold; color: #000000; padding-right: 6pt;">Subject:</td>
                <td style="border-bottom: 1pt dotted #334155; font-size: 10.5pt; font-weight: 600; color: #1e293b; padding-left: 4pt; padding-bottom: 1pt;">${escapeHtml(firstSessionSubject)}</td>
              </tr>
            </table>
          </div>
          <table class="session-table">
            <thead>
              <tr>
                <th style="width: 30%;">Topic/Activity</th>
                <th style="width: 30%;">Objective(s)</th>
                <th style="width: 28%;">Materials/ sources</th>
                <th style="width: 12%; text-align: center; white-space: nowrap;">Duration <span style="display: block; font-size: 8.5pt; font-weight: normal; color: #475569;">(mns)</span></th>
              </tr>
            </thead>
            <tbody>
              ${firstSessionRows}
            </tbody>
          </table>
        </div>

        <!-- 5. Section III: 2nd Session -->
        <div style="margin-bottom: 16pt;">
          <div style="font-family: 'Plus Jakarta Sans', Calibri, Arial, sans-serif; font-size: 12pt; font-weight: bold; color: #000000; margin-bottom: 6pt;">
            III. &nbsp;&nbsp; 2<sup>nd</sup> Session:
          </div>
          <div style="margin-left: 20pt; margin-bottom: 8pt;">
            <table style="width: 100%; border-collapse: collapse; font-family: 'Plus Jakarta Sans', Calibri, Arial, sans-serif;">
              <tr>
                <td style="width: 1%; white-space: nowrap; font-size: 10.5pt; font-weight: bold; color: #000000; padding-right: 6pt;">Subject:</td>
                <td style="border-bottom: 1pt dotted #334155; font-size: 10.5pt; font-weight: 600; color: #1e293b; padding-left: 4pt; padding-bottom: 1pt;">${escapeHtml(secondSessionSubject)}</td>
              </tr>
            </table>
          </div>
          <table class="session-table">
            <thead>
              <tr>
                <th style="width: 30%;">Topic/Activity</th>
                <th style="width: 30%;">Objective(s)</th>
                <th style="width: 28%;">Materials/ sources</th>
                <th style="width: 12%; text-align: center; white-space: nowrap;">Duration <span style="display: block; font-size: 8.5pt; font-weight: normal; color: #475569;">(mns)</span></th>
              </tr>
            </thead>
            <tbody>
              ${secondSessionRows}
            </tbody>
          </table>
        </div>

        <!-- 6. Section IV: Closing (Clean text without green vertical bar) -->
        <div style="margin-bottom: 16pt;">
          <div style="font-family: 'Plus Jakarta Sans', Calibri, Arial, sans-serif; font-size: 12pt; font-weight: bold; color: #000000; margin-bottom: 6pt;">
            IV. &nbsp;&nbsp; Closing:
          </div>
          <div style="margin-left: 20pt; font-family: 'Plus Jakarta Sans', Calibri, Arial, sans-serif; font-size: 10.5pt; line-height: 1.5; color: #0f172a;">
            <p style="margin: 0; padding: 0; line-height: 1.5;">${escapeHtml(closingText).replace(/\r?\n/g, '<br/>')}</p>
          </div>
        </div>

        <!-- 7. Document Sign-off / Lead Educator Footer -->
        ${
          plan.teacherName
            ? `
        <table style="width: 100%; border-collapse: collapse; border-top: 1pt dashed #cbd5e1; margin-top: 24pt; padding-top: 8pt; font-family: 'Plus Jakarta Sans', Calibri, Arial, sans-serif; font-size: 9pt; color: #64748b;">
          <tr>
            <td style="text-align: left; padding-top: 6pt;">
              <strong style="color: #334155;">Lead Educator:</strong> ${escapeHtml(plan.teacherName)}
            </td>
            <td style="text-align: right; padding-top: 6pt;">
              <strong style="color: #334155;">Status:</strong> <span style="font-weight: bold; text-transform: uppercase; color: #006838;">${escapeHtml(plan.status)}</span>
            </td>
          </tr>
        </table>
        `
            : ''
        }
      </div>
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff', htmlDocument], {
    type: 'application/msword;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const downloadLink = document.createElement('a');
  downloadLink.href = url;
  const brandPrefix = isDKCampus ? 'Dewey_Kindergarten' : 'Dewey_Childcare_House';
  const cleanClassFile = classNameDisplay.replace(/[^a-zA-Z0-9_-]/g, '_');
  downloadLink.download = `${brandPrefix}_${cleanClassFile}_Week_${plan.weekNumber ?? 13}.doc`;

  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(url);
}
