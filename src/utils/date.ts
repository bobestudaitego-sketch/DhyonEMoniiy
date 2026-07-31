// Helper utilities for date and time calculations in Portuguese (pt-BR)

export function getTodayDateString(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getCurrentTimeString(d: Date = new Date(), showSeconds: boolean = false): string {
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  if (showSeconds) {
    const seconds = String(d.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }
  return `${hours}:${minutes}`;
}

export function formatPortugueseDate(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  
  return date.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

export function formatShortPortugueseDate(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  
  return date.toLocaleDateString('pt-BR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  });
}

export function timeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

export function isItemActiveNow(startTime: string, endTime?: string, currentTimeStr: string = getCurrentTimeString()): boolean {
  if (!startTime) return false;
  const nowMin = timeToMinutes(currentTimeStr);
  const startMin = timeToMinutes(startTime);
  
  if (endTime) {
    const endMin = timeToMinutes(endTime);
    return nowMin >= startMin && nowMin < endMin;
  }
  
  // If no end time, active for 30 mins window
  return nowMin >= startMin && nowMin < startMin + 30;
}

export function isItemOverdue(
  itemDate: string,
  startTime: string,
  endTime?: string,
  todayStr: string = getTodayDateString(),
  currentTimeStr: string = getCurrentTimeString()
): boolean {
  if (!itemDate || !startTime) return false;

  if (itemDate < todayStr) {
    return true;
  }

  if (itemDate > todayStr) {
    return false;
  }

  const nowMin = timeToMinutes(currentTimeStr);
  const startMin = timeToMinutes(startTime);

  if (endTime) {
    const endMin = timeToMinutes(endTime);
    return nowMin >= endMin;
  }

  return nowMin >= startMin + 30;
}

export function getMinutesUntil(timeStr: string, currentTimeStr: string = getCurrentTimeString()): number {
  const nowMin = timeToMinutes(currentTimeStr);
  const targetMin = timeToMinutes(timeStr);
  return targetMin - nowMin;
}

export function formatTimeDifference(minutes: number): string {
  if (minutes === 0) return 'Agora mesmo!';
  if (minutes < 0) return `Há ${Math.abs(minutes)} min`;
  if (minutes < 60) return `Em ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) return `Em ${hours}h`;
  return `Em ${hours}h ${mins}min`;
}
