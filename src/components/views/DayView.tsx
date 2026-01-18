import { useRef, useEffect } from 'react';
import { format, getHours, getMinutes } from 'date-fns';
import type { CalendarEvent } from '../../types';

interface DayViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onPrevDay: () => void;
  onNextDay: () => void;
  onAddEvent: (time: string) => void;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const HOUR_WIDTH = 100; // pixels per hour
const TOTAL_WIDTH = HOURS.length * HOUR_WIDTH;

export default function DayView({
  currentDate,
  events,
  onPrevDay,
  onNextDay,
  onAddEvent
}: DayViewProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Filter events for the current day
  const dayEvents = events.filter(
    event => event.date === format(currentDate, 'yyyy-MM-dd')
  ).sort((a, b) => a.time.localeCompare(b.time));

  // Scroll to current time on mount
  useEffect(() => {
    if (scrollRef.current) {
      const now = new Date();
      const minutes = getHours(now) * 60 + getMinutes(now);
      const pixels = (minutes / 60) * HOUR_WIDTH;
      // Center the view on current time
      scrollRef.current.scrollLeft = pixels - scrollRef.current.clientWidth / 2 + HOUR_WIDTH;
    }
  }, []);

  const getEventStyle = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    const left = (h + m / 60) * HOUR_WIDTH;
    return {
      left: `${left}px`,
      width: `${HOUR_WIDTH}px`, // Default 1 hour duration
    };
  };

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrollRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left + scrollRef.current.scrollLeft;
    const totalMinutes = (x / HOUR_WIDTH) * 60;
    const h = Math.floor(totalMinutes / 60);
    const m = Math.floor(totalMinutes % 60);
    const timeStr = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    onAddEvent(timeStr);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg flex flex-col h-[600px]">
      {/* Header */}
      <div className="bg-indigo-600 text-white p-4 rounded-t-lg flex-none">
        <div className="flex items-center justify-between">
          <button
            onClick={onPrevDay}
            className="px-4 py-2 bg-indigo-700 hover:bg-indigo-800 rounded transition-colors"
          >
            ←
          </button>
          <div className="text-center">
            <h2 className="text-2xl font-bold">{format(currentDate, 'MMMM d, yyyy')}</h2>
            <p className="text-indigo-200">{format(currentDate, 'EEEE')}</p>
          </div>
          <button
            onClick={onNextDay}
            className="px-4 py-2 bg-indigo-700 hover:bg-indigo-800 rounded transition-colors"
          >
            →
          </button>
        </div>
      </div>

      {/* Timeline Container */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-x-auto overflow-y-hidden relative custom-scrollbar"
        style={{ scrollBehavior: 'smooth' }}
      >
        <div
          className="relative h-full"
          style={{ width: `${TOTAL_WIDTH}px` }}
        >
          {/* Time Header */}
          <div className="flex border-b border-gray-200 h-10 sticky top-0 bg-white z-10">
            {HOURS.map(hour => (
              <div
                key={hour}
                className="flex-none border-r border-gray-100 text-xs text-gray-500 font-medium p-2"
                style={{ width: `${HOUR_WIDTH}px` }}
              >
                {format(new Date().setHours(hour, 0), 'h aa')}
              </div>
            ))}
          </div>

          {/* Grid Lines */}
          <div className="absolute inset-0 top-10 pointer-events-none">
            {HOURS.map(hour => (
              <div
                key={hour}
                className="absolute top-0 bottom-0 border-r border-gray-100 border-dashed"
                style={{ left: `${(hour + 1) * HOUR_WIDTH}px` }}
              />
            ))}
          </div>

          {/* Events Area */}
          <div
            className="relative p-4 space-y-4"
            onClick={handleTimelineClick}
          >
             {/* Current Time Indicator */}
            {format(currentDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') && (
              <div
                className="absolute top-0 bottom-0 border-l-2 border-red-500 z-20 pointer-events-none"
                style={{
                  left: `${(getHours(new Date()) + getMinutes(new Date()) / 60) * HOUR_WIDTH}px`
                }}
              >
                <div className="absolute -top-1 -left-1.5 w-3 h-3 bg-red-500 rounded-full" />
              </div>
            )}

            {dayEvents.length === 0 ? (
              <div className="text-gray-400 italic p-4 text-center sticky left-0 right-0">
                No events scheduled for today
              </div>
            ) : (
              dayEvents.map(event => (
                <div
                  key={event.id}
                  className="relative h-12 rounded-lg bg-indigo-100 border border-indigo-200 shadow-sm hover:shadow-md transition-shadow group overflow-hidden"
                  style={getEventStyle(event.time)}
                >
                  <div className="h-full w-2 bg-indigo-500 absolute left-0 top-0 bottom-0" />
                  <div className="p-2 pl-4 flex flex-col justify-center h-full">
                    <span className="font-semibold text-indigo-900 text-sm truncate">
                      {event.title}
                    </span>
                    <span className="text-xs text-indigo-700">
                      {event.time}
                    </span>
                  </div>
                  {/* Tooltip */}
                  <div className="absolute opacity-0 group-hover:opacity-100 bg-gray-900 text-white text-xs rounded py-1 px-2 -top-8 left-0 transition-opacity z-30 whitespace-nowrap pointer-events-none">
                    {event.time} - {event.title}
                  </div>
                </div>
              ))
            )}

            {/* Clickable background area for adding events */}
            <div className="absolute inset-0 -z-10" />
          </div>
        </div>
      </div>
    </div>
  );
}
