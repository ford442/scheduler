// src/components/Calendar.tsx
import { useState, useEffect } from 'react';
import { 
  format, 
  addMonths,
  subMonths,
  addDays,
  subDays,
  addYears,
  subYears,
  getHours,
  getMinutes,
  getDate,
  getDay
} from 'date-fns';
import type { CalendarEvent, RepeatType } from '../types';
import { getEvents, createEvent, type SongResponse } from '../services/api';
import MonthView from './views/MonthView';
import DayView from './views/DayView';
import YearView from './views/YearView';
import ViewSwitcher from './ViewSwitcher';

type CalendarViewType = 'day' | 'month' | 'year';

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarViewType>('day');
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);

  // Updated state to include repeat
  const [newEvent, setNewEvent] = useState<{title: string, time: string, repeat: RepeatType}>({
    title: '',
    time: '09:00',
    repeat: 'none'
  });

  // Load events from API
  useEffect(() => {
    const loadEvents = async () => {
      const fetchedEvents = await getEvents();
      const calendarEvents: CalendarEvent[] = fetchedEvents.map((song: SongResponse) => ({
        id: song.id,
        title: song.data.title,
        date: song.data.date,
        time: song.data.time,
        repeat: song.data.repeat || 'none' // Load repeat setting
      }));
      setEvents(calendarEvents);
    };

    loadEvents();
  }, []);

  // Reminder system: check every 60s for events
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const currentHour = getHours(now);
      const currentMinute = getMinutes(now);
      const currentDateStr = format(now, 'yyyy-MM-dd');
      const currentDayOfWeek = getDay(now); // 0-6 (Sun-Sat)
      const currentDayOfMonth = getDate(now); // 1-31

      events.forEach(event => {
        const [eventHour, eventMinute] = event.time.split(':').map(Number);

        // Basic time check first
        if (eventHour !== currentHour || eventMinute !== currentMinute) {
          return;
        }

        let shouldTrigger = false;

        // Check date/repeat logic
        if (event.repeat === 'daily') {
          shouldTrigger = true;
        } else if (event.repeat === 'weekly') {
          // Check if same day of week (e.g., both are Monday)
          const eventDate = new Date(event.date);
          if (getDay(eventDate) === currentDayOfWeek) {
            shouldTrigger = true;
          }
        } else if (event.repeat === 'monthly') {
          // Check if same day of month (e.g., both are the 15th)
          const eventDate = new Date(event.date);
          if (getDate(eventDate) === currentDayOfMonth) {
            shouldTrigger = true;
          }
        } else {
          // No repeat, match exact date
          if (event.date === currentDateStr) {
            shouldTrigger = true;
          }
        }

        if (shouldTrigger) {
          // Use Notification API if available, fallback to alert
          if (Notification.permission === 'granted') {
            new Notification(`Reminder: ${event.title}`, {
              body: `Scheduled for ${event.time}`
            });
          } else if (Notification.permission !== 'denied') {
             Notification.requestPermission().then(permission => {
               if (permission === 'granted') {
                 new Notification(`Reminder: ${event.title}`, {
                    body: `Scheduled for ${event.time}`
                 });
               }
             });
          } else {
             alert(`Reminder: ${event.title} is scheduled for ${event.time}`);
          }
        }
      });
    };

    // Request permission on mount
    if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }

    checkReminders();
    const interval = setInterval(checkReminders, 60000);

    return () => clearInterval(interval);
  }, [events]);

  const handleAddEvent = async () => {
    if (!selectedDate || !newEvent.title.trim()) return;

    const eventData = {
      date: format(selectedDate, 'yyyy-MM-dd'),
      time: newEvent.time,
      title: newEvent.title,
      repeat: newEvent.repeat
    };

    const createdEvent = await createEvent(eventData);
    
    if (createdEvent) {
      setEvents([...events, {
        id: createdEvent.id,
        title: createdEvent.data.title,
        date: createdEvent.data.date,
        time: createdEvent.data.time,
        repeat: createdEvent.data.repeat
      }]);
    }

    setShowEventModal(false);
    setNewEvent({ title: '', time: '09:00', repeat: 'none' });
    setSelectedDate(null);
  };

  const handlePrevDay = () => setCurrentDate(subDays(currentDate, 1));
  const handleNextDay = () => setCurrentDate(addDays(currentDate, 1));
  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const handlePrevYear = () => setCurrentDate(subYears(currentDate, 1));
  const handleNextYear = () => setCurrentDate(addYears(currentDate, 1));
  const handleMonthClick = (date: Date) => { setCurrentDate(date); setView('month'); };
  const handleDateClick = (date: Date) => { setCurrentDate(date); setView('day'); };

  const handleAddEventFromDayView = (time: string) => {
    setSelectedDate(currentDate);
    setNewEvent({ ...newEvent, time });
    setShowEventModal(true);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 pb-24">
      {view === 'day' && (
        <DayView
          currentDate={currentDate}
          events={events}
          onPrevDay={handlePrevDay}
          onNextDay={handleNextDay}
          onAddEvent={handleAddEventFromDayView}
        />
      )}

      {view === 'month' && (
        <MonthView
          currentMonth={currentDate}
          events={events}
          onDateClick={handleDateClick}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
        />
      )}

      {view === 'year' && (
        <YearView
          currentDate={currentDate}
          onMonthClick={handleMonthClick}
          onPrevYear={handlePrevYear}
          onNextYear={handleNextYear}
        />
      )}

      <ViewSwitcher currentView={view} onChangeView={setView} />

      {/* Event Modal */}
      {showEventModal && selectedDate && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
            <h3 className="text-xl font-bold mb-4 text-indigo-600">
              Add Event for {format(selectedDate, 'MMMM d, yyyy')}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                  placeholder="Event title"
                  autoFocus
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                  />
                </div>

                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Repeat
                  </label>
                  <select
                    value={newEvent.repeat}
                    onChange={(e) => setNewEvent({ ...newEvent, repeat: e.target.value as RepeatType })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow bg-white"
                  >
                    <option value="none">None</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  onClick={handleAddEvent}
                  className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  Add Event
                </button>
                <button
                  onClick={() => {
                    setShowEventModal(false);
                    setNewEvent({ title: '', time: '09:00', repeat: 'none' });
                    setSelectedDate(null);
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
