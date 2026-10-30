import { format, parseISO, isBefore, addDays, startOfDay } from 'date-fns';
import { TaskStatus } from '../types/models';

/**
 * Formats an ISO date string (YYYY-MM-DD or full timestamp) for display.
 */
export const formatDate = (dateStr?: string, pattern = 'MMM d, yyyy'): string => {
  if (!dateStr) return 'No date';
  try {
    const parsed = parseISO(dateStr);
    return format(parsed, pattern);
  } catch {
    return dateStr;
  }
};

/**
 * Checks if a task is overdue (due date before start of today, and not completed).
 */
export const isOverdue = (dueDateStr: string, status?: TaskStatus): boolean => {
  if (status === 'DONE') return false;
  try {
    const due = startOfDay(parseISO(dueDateStr));
    const today = startOfDay(new Date());
    return isBefore(due, today);
  } catch {
    return false;
  }
};

/**
 * Checks if a task is due in the next N days (default 7 days) and not completed.
 */
export const isDueSoon = (dueDateStr: string, status?: TaskStatus, daysAhead = 7): boolean => {
  if (status === 'DONE') return false;
  try {
    const due = startOfDay(parseISO(dueDateStr));
    const today = startOfDay(new Date());
    const limit = startOfDay(addDays(new Date(), daysAhead));
    // Due today or between tomorrow and limit
    return !isBefore(due, today) && (isBefore(due, limit) || due.getTime() === limit.getTime());
  } catch {
    return false;
  }
};

/**
 * Returns human-readable relative label like "2 days overdue", "Due tomorrow", "Due in 3 days".
 */
export const getDueBadgeText = (dueDateStr: string, status?: TaskStatus): string => {
  if (status === 'DONE') return 'Completed';
  const overdue = isOverdue(dueDateStr, status);
  if (overdue) {
    return 'Overdue';
  }
  const due = startOfDay(parseISO(dueDateStr));
  const today = startOfDay(new Date());
  const diffDays = Math.round((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Due today';
  if (diffDays === 1) return 'Due tomorrow';
  if (diffDays > 1 && diffDays <= 7) return `Due in ${diffDays} days`;

  return formatDate(dueDateStr, 'MMM d');
};

/**
 * Strictly validates that a string is in YYYY-MM-DD format AND represents an authentic calendar date.
 * Rejects invalid months (e.g. 13), invalid days (e.g. 45 or Feb 30), and accounts for leap years.
 */
export const isValidCalendarDate = (dateStr?: string | null): boolean => {
  if (!dateStr || typeof dateStr !== 'string') return false;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr);
  if (!match) return false;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return false;
  }

  // Verify that month and day did not roll over in the Date constructor
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
};

