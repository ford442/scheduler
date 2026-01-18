export type RepeatType = 'none' | 'daily' | 'weekly' | 'monthly';

export interface CalendarEvent {
  id: number;
  title: string;
  date: string;
  time: string;
  repeat?: RepeatType;
}
