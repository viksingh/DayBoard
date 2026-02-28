import { format, parseISO, isToday, isValid, addDays, subDays, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns";

export function todayKey(): string {
  return format(new Date(), "yyyy-MM-dd");
}

export function formatDateKey(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function parseDateKey(key: string): Date {
  return parseISO(key);
}

export function isValidDateKey(key: string): boolean {
  const d = parseISO(key);
  return isValid(d);
}

export function formatDisplay(dateStr: string, fmt: string = "MMM d, yyyy"): string {
  const d = parseISO(dateStr);
  return isValid(d) ? format(d, fmt) : dateStr;
}

export function isTodayKey(key: string): boolean {
  return isToday(parseISO(key));
}

export function getAdjacentDate(dateStr: string, direction: "prev" | "next"): string {
  const d = parseISO(dateStr);
  const result = direction === "next" ? addDays(d, 1) : subDays(d, 1);
  return formatDateKey(result);
}

export function getWeekDays(dateStr: string): string[] {
  const d = parseISO(dateStr);
  const start = startOfWeek(d, { weekStartsOn: 1 });
  const end = endOfWeek(d, { weekStartsOn: 1 });
  return eachDayOfInterval({ start, end }).map(formatDateKey);
}

export function nowISO(): string {
  return new Date().toISOString();
}
