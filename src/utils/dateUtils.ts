/**
 * Centralized Date Formatting Utilities
 * Standardizes all date representations across the application to DD-MM-YYYY format.
 */

/**
 * Formats a date string (YYYY-MM-DD, ISO string, etc.) or Date object to DD-MM-YYYY.
 * e.g., "2026-09-08" -> "08-09-2026"
 */
export function formatDateDDMMYYYY(dateInput?: string | Date | null): string {
  if (!dateInput) return '';

  if (typeof dateInput === 'string') {
    const trimmed = dateInput.trim();
    if (!trimmed) return '';

    // Already in DD-MM-YYYY format
    if (/^\d{2}-\d{2}-\d{4}$/.test(trimmed)) {
      return trimmed;
    }

    // In DD/MM/YYYY format -> replace slashes with hyphens
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(trimmed)) {
      return trimmed.replace(/\//g, '-');
    }

    // Match YYYY-MM-DD or YYYY/MM/DD
    const ymdMatch = trimmed.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
    if (ymdMatch) {
      const year = ymdMatch[1];
      const month = ymdMatch[2].padStart(2, '0');
      const day = ymdMatch[3].padStart(2, '0');
      return `${day}-${month}-${year}`;
    }

    // Check if it's a range string like "2026-09-01 ~ 2026-09-05" or "2026-09-01 to 2026-09-05"
    if (trimmed.includes(' ~ ')) {
      const [start, end] = trimmed.split(' ~ ');
      return `${formatDateDDMMYYYY(start)} ~ ${formatDateDDMMYYYY(end)}`;
    }
    if (trimmed.includes(' to ')) {
      const [start, end] = trimmed.split(' to ');
      return `${formatDateDDMMYYYY(start)} to ${formatDateDDMMYYYY(end)}`;
    }

    // Attempt Date object parse
    const parsed = new Date(trimmed);
    if (!isNaN(parsed.getTime())) {
      const day = String(parsed.getDate()).padStart(2, '0');
      const month = String(parsed.getMonth() + 1).padStart(2, '0');
      const year = parsed.getFullYear();
      return `${day}-${month}-${year}`;
    }

    return trimmed;
  }

  if (dateInput instanceof Date && !isNaN(dateInput.getTime())) {
    const day = String(dateInput.getDate()).padStart(2, '0');
    const month = String(dateInput.getMonth() + 1).padStart(2, '0');
    const year = dateInput.getFullYear();
    return `${day}-${month}-${year}`;
  }

  return '';
}

/**
 * Formats a date range into "DD-MM-YYYY ~ DD-MM-YYYY" or "DD-MM-YYYY to DD-MM-YYYY"
 */
export function formatDateRange(
  start?: string | Date | null,
  end?: string | Date | null,
  separator: ' ~ ' | ' to ' | ' - ' = ' ~ '
): string {
  const formattedStart = formatDateDDMMYYYY(start);
  const formattedEnd = formatDateDDMMYYYY(end);
  if (formattedStart && formattedEnd) {
    return `${formattedStart}${separator}${formattedEnd}`;
  }
  return formattedStart || formattedEnd || '';
}

/**
 * Formats a timestamp into DD-MM-YYYY HH:mm
 * e.g., "2026-08-26 09:40" -> "26-08-2026 09:40"
 */
export function formatDateTimeDDMMYYYY(dateInput?: string | Date | null): string {
  if (!dateInput) return '';

  if (typeof dateInput === 'string') {
    const trimmed = dateInput.trim();
    if (!trimmed) return '';

    // Match YYYY-MM-DD HH:mm(:ss)?
    const ymdTimeMatch = trimmed.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})[T\s]+(\d{1,2}:\d{2}(?::\d{2})?)/);
    if (ymdTimeMatch) {
      const year = ymdTimeMatch[1];
      const month = ymdTimeMatch[2].padStart(2, '0');
      const day = ymdTimeMatch[3].padStart(2, '0');
      const time = ymdTimeMatch[4].substring(0, 5); // Take HH:mm
      return `${day}-${month}-${year} ${time}`;
    }

    // If already in DD-MM-YYYY HH:mm
    if (/^\d{2}-\d{2}-\d{4}\s+\d{1,2}:\d{2}/.test(trimmed)) {
      return trimmed;
    }

    // Try parsing as standard Date
    const d = new Date(trimmed);
    if (!isNaN(d.getTime())) {
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      return `${day}-${month}-${year} ${hours}:${minutes}`;
    }

    return formatDateDDMMYYYY(trimmed);
  }

  if (dateInput instanceof Date && !isNaN(dateInput.getTime())) {
    const day = String(dateInput.getDate()).padStart(2, '0');
    const month = String(dateInput.getMonth() + 1).padStart(2, '0');
    const year = dateInput.getFullYear();
    const hours = String(dateInput.getHours()).padStart(2, '0');
    const minutes = String(dateInput.getMinutes()).padStart(2, '0');
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  }

  return '';
}

/**
 * Converts a DD-MM-YYYY string back to YYYY-MM-DD for standard HTML input[type="date"]
 */
export function toHtmlDateValue(dateInput?: string | null): string {
  if (!dateInput) return '';
  const trimmed = dateInput.trim();
  const dmyMatch = trimmed.match(/^(\d{2})[-/](\d{2})[-/](\d{4})$/);
  if (dmyMatch) {
    return `${dmyMatch[3]}-${dmyMatch[2]}-${dmyMatch[1]}`;
  }
  // If already YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return trimmed;
  }
  return trimmed;
}
