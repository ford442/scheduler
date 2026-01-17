import { useState, useEffect } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  addDays, 
  isSameMonth, 
  isSameDay,
  addMonths,
  subMonths,
  getHours,
  getMinutes
} from 'date-fns';
import type { CalendarEvent } from '../types';
import { getEvents, createEvent, type SongResponse } from '../services/api';

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', time: '09:00' });

  const loadEvents = async () => {
    const fetchedEvents = await getEvents();
    const calendarEvents: CalendarEvent[] = fetchedEvents.map((song: SongResponse) => ({
      id: song.id,
      title: song.data.title,
      date: song.data.date,
      time: song.data.time,
    }));
    setEvents(calendarEvents);
  };

  // Load events from API
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadEvents();
  }, []);

  // Reminder system: check every 60s for events
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const currentHour = getHours(now);
      const currentMinute = getMinutes(now);
      const currentDateStr = format(now, 'yyyy-MM-dd');

      events.forEach(event => {
        if (event.date === currentDateStr) {
          const [eventHour, eventMinute] = event.time.split(':').map(Number);
          
          // Check if event time matches current time (within the same minute)
          if (eventHour === currentHour && eventMinute === currentMinute) {
            alert(`Reminder: ${event.title} is scheduled for ${event.time}`);
          }
        }
      });
    };

    // Check immediately and then every 60 seconds
    checkReminders();
    const interval = setInterval(checkReminders, 60000);

    return () => clearInterval(interval);
  }, [events]);

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setShowEventModal(true);
  };

  const handleAddEvent = async () => {
    if (!selectedDate || !newEvent.title.trim()) return;

    const eventData = {
      date: format(selectedDate, 'yyyy-MM-dd'),
      time: newEvent.time,
      title: newEvent.title,
    };

    const createdEvent = await createEvent(eventData);
    
    if (createdEvent) {
      setEvents([...events, {
        id: createdEvent.id,
        title: createdEvent.data.title,
        date: createdEvent.data.date,
        time: createdEvent.data.time,
      }]);
    }

    setShowEventModal(false);
    setNewEvent({ title: '', time: '09:00' });
    setSelectedDate(null);
  };

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
          onClick={() => handleDateClick(currentDay)}
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
    <div className="max-w-6xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="bg-indigo-600 text-white p-4 rounded-t-lg">
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrevMonth}
              className="px-4 py-2 bg-indigo-700 hover:bg-indigo-800 rounded transition-colors"
            >
              ←
            </button>
            <h2 className="text-2xl font-bold">
              {format(currentMonth, 'MMMM yyyy')}
            </h2>
            <button
              onClick={handleNextMonth}
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

      {/* Event Modal */}
      {showEventModal && selectedDate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Event title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time
                </label>
                <input
                  type="time"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleAddEvent}
                  className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Add Event
                </button>
                <button
                  onClick={() => {
                    setShowEventModal(false);
                    setNewEvent({ title: '', time: '09:00' });
                    setSelectedDate(null);
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
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
