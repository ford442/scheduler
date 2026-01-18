import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
} from 'date-fns';
import type { CalendarEvent } from '../../types';

interface MonthViewProps {
  currentMonth: Date;
  events: CalendarEvent[];
  onDateClick: (date: Date) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function MonthView({
  currentMonth,
  events,
  onDateClick,
  onPrevMonth,
  onNextMonth
}: MonthViewProps) {

  const getEventsForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return events.filter(event => event.date === dateStr);
  };

  const renderCalendarDays = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days = [];
    let day = startDate;

    while (day <= endDate) {
      const currentDay = day;
      const dayEvents = getEventsForDate(currentDay);
      const isCurrentMonth = isSameMonth(currentDay, currentMonth);
      const isToday = isSameDay(currentDay, new Date());

      days.push(
        <div
          key={currentDay.toISOString()}
          onClick={() => onDateClick(currentDay)}
          className={`min-h-24 border border-gray-200 p-2 cursor-pointer transition-colors hover:bg-indigo-50 ${
            !isCurrentMonth ? 'bg-gray-50 text-gray-400' : 'bg-white'
          } ${isToday ? 'ring-2 ring-indigo-500' : ''}`}
        >
          <div className={`text-sm font-semibold mb-1 ${isToday ? 'text-indigo-600' : ''}`}>
            {format(currentDay, 'd')}
          </div>
          <div className="space-y-1">
            {dayEvents.map(event => (
              <div
                key={event.id}
                className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded truncate"
                title={`${event.time} - ${event.title}`}
              >
                {event.time} {event.title}
              </div>
            ))}
          </div>
        </div>
      );

      day = addDays(day, 1);
    }

    return days;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="bg-indigo-600 text-white p-4 rounded-t-lg">
        <div className="flex items-center justify-between">
          <button
            onClick={onPrevMonth}
            className="px-4 py-2 bg-indigo-700 hover:bg-indigo-800 rounded transition-colors"
          >
            ←
          </button>
          <h2 className="text-2xl font-bold">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <button
            onClick={onNextMonth}
            className="px-4 py-2 bg-indigo-700 hover:bg-indigo-800 rounded transition-colors"
          >
            →
          </button>
        </div>
      </div>

      {/* Days of week */}
      <div className="grid grid-cols-7 bg-indigo-100">
        {DAYS_OF_WEEK.map(day => (
          <div key={day} className="text-center font-semibold py-2 text-indigo-800">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {renderCalendarDays()}
      </div>
    </div>
  );
}
