import { describe, it, expect } from 'vitest';
import {
  isValidCalendarDate,
  formatDate,
  isOverdue,
  isDueSoon,
  getDueBadgeText,
} from './dates';

describe('isValidCalendarDate', () => {
  it('accepts valid real calendar dates', () => {
    expect(isValidCalendarDate('2026-03-15')).toBe(true);
    expect(isValidCalendarDate('2026-01-01')).toBe(true);
    expect(isValidCalendarDate('2026-12-31')).toBe(true);
    expect(isValidCalendarDate('2026-02-28')).toBe(true);
  });

  it('correctly handles leap years for February 29th', () => {
    expect(isValidCalendarDate('2024-02-29')).toBe(true); // 2024 is leap year
    expect(isValidCalendarDate('2028-02-29')).toBe(true); // 2028 is leap year
    expect(isValidCalendarDate('2025-02-29')).toBe(false); // 2025 is not leap year
    expect(isValidCalendarDate('2026-02-29')).toBe(false); // 2026 is not leap year
  });

  it('rejects out-of-range months like 2026-13-45 or 2026-00-10', () => {
    expect(isValidCalendarDate('2026-13-45')).toBe(false);
    expect(isValidCalendarDate('2026-13-01')).toBe(false);
    expect(isValidCalendarDate('2026-00-15')).toBe(false);
  });

  it('rejects out-of-range days for 30-day months and February', () => {
    expect(isValidCalendarDate('2026-04-31')).toBe(false); // April has 30 days
    expect(isValidCalendarDate('2026-06-31')).toBe(false); // June has 30 days
    expect(isValidCalendarDate('2026-02-30')).toBe(false); // Feb never has 30 days
    expect(isValidCalendarDate('2026-05-32')).toBe(false); // Day > 31
  });

  it('rejects malformed strings, null, and empty inputs', () => {
    expect(isValidCalendarDate('')).toBe(false);
    expect(isValidCalendarDate(null)).toBe(false);
    expect(isValidCalendarDate(undefined)).toBe(false);
    expect(isValidCalendarDate('invalid-date')).toBe(false);
    expect(isValidCalendarDate('2026/03/15')).toBe(false);
    expect(isValidCalendarDate('26-03-15')).toBe(false);
  });
});

describe('formatDate', () => {
  it('formats valid ISO dates', () => {
    expect(formatDate('2026-03-15')).toBe('Mar 15, 2026');
  });

  it('returns default fallback for missing dates', () => {
    expect(formatDate('')).toBe('No date');
    expect(formatDate(undefined)).toBe('No date');
  });
});

describe('isOverdue and isDueSoon', () => {
  it('marks completed tasks as not overdue and not due soon', () => {
    expect(isOverdue('2020-01-01', 'DONE')).toBe(false);
    expect(isDueSoon('2026-03-15', 'DONE')).toBe(false);
  });

  it('formats due badge text correctly for completed status', () => {
    expect(getDueBadgeText('2026-03-15', 'DONE')).toBe('Completed');
  });
});
