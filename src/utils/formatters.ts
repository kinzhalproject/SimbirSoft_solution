import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import { MatchStatus } from '../types/api';

/**
 * Format UTC date to local date string (DD.MM.YYYY)
 */
export const formatDate = (utcDate: string): string => {
  try {
    const date = parseISO(utcDate);
    return format(date, 'dd.MM.yyyy', { locale: ru });
  } catch {
    return '-';
  }
};

/**
 * Format UTC date to local time string (HH:mm)
 */
export const formatTime = (utcDate: string): string => {
  try {
    const date = parseISO(utcDate);
    return format(date, 'HH:mm', { locale: ru });
  } catch {
    return '-';
  }
};

/**
 * Format date for API request (YYYY-MM-DD)
 */
export const formatDateForApi = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

/**
 * Translate match status to Russian
 */
export const translateStatus = (status: MatchStatus): string => {
  const statusMap: Record<MatchStatus, string> = {
    SCHEDULED: 'Запланирован',
    LIVE: 'В прямом эфире',
    IN_PLAY: 'В игре',
    PAUSED: 'Пауза',
    FINISHED: 'Завершен',
    POSTPONED: 'Отложен',
    SUSPENDED: 'Приостановлен',
    CANCELED: 'Отменен',
  };
  return statusMap[status] || status;
};

/**
 * Get status color for UI
 */
export const getStatusColor = (status: MatchStatus): string => {
  const colorMap: Record<MatchStatus, string> = {
    SCHEDULED: 'blue',
    LIVE: 'red',
    IN_PLAY: 'green',
    PAUSED: 'orange',
    FINISHED: 'default',
    POSTPONED: 'gold',
    SUSPENDED: 'volcano',
    CANCELED: 'default',
  };
  return colorMap[status] || 'default';
};
