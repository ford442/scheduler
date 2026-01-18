import {
  format,
  startOfYear,
  addMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth
} from 'date-fns';

interface YearViewProps {
  currentDate: Date;
  onMonthClick: (date: Date) => void;
  onPrevYear: () => void;
  onNextYear: () => void;
}

const MONTHS = Array.from({ length: 12 }, (_, i) => i);
const DAYS_OF_WEEK = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export default function YearView({
  currentDate,
  onMonthClick,
  onPrevYear,
  onNextYear
}: YearViewProps) {
  const yearStart = startOfYear(currentDate);

  const renderMiniMonth = (monthOffset: number) => {
    const monthDate = addMonths(yearStart, monthOffset);
    const monthStart = startOfMonth(monthDate);
    const monthEnd = endOfMonth(monthDate);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days = [];
    let day = startDate;

    // We render 6 weeks to ensure constant height, or just until end date
    // For mini view, just render needed days
    while (day <= endDate) {
      const currentDay = day;
      const isCurrentMonth = isSameMonth(currentDay, monthDate);

      days.push(
        <div
          key={currentDay.toISOString()}
          className={`h-2 w-2 rounded-full mx-auto ${
            isCurrentMonth ? 'bg-indigo-100 text-indigo-900' : 'invisible'
          }`}
        />
      );
      day = addDays(day, 1);
    }

    return (
      <div
        key={monthOffset}
        onClick={() => onMonthClick(monthDate)}
        className="bg-white p-4 rounded-lg border border-gray-100 hover:border-indigo-300 hover:shadow-md cursor-pointer transition-all"
      >
        <h3 className="font-bold text-indigo-900 mb-2">{format(monthDate, 'MMMM')}</h3>
        <div className="grid grid-cols-7 gap-1 text-center">
          {DAYS_OF_WEEK.map(d => (
            <div key={d} className="text-[0.6rem] text-gray-400 font-medium">{d}</div>
          ))}
          {/* Actual days, but just simplified dots or numbers */}
          {/* Let's redo days loop to just be simpler numbers */}
        </div>
        <div className="grid grid-cols-7 gap-y-1 gap-x-0 mt-1">
           {renderDays(startDate, endDate, monthDate)}
        </div>
      </div>
    );
  };

  const renderDays = (startDate: Date, endDate: Date, currentMonth: Date) => {
    const days = [];
    let day = startDate;
    while (day <= endDate) {
       const isCurrentMonth = isSameMonth(day, currentMonth);
       days.push(
         <div
            key={day.toISOString()}
            className={`text-[0.6rem] text-center w-6 h-6 leading-6 rounded-full ${
                !isCurrentMonth ? 'invisible' : 'text-gray-700 hover:bg-indigo-50'
            }`}
         >
             {format(day, 'd')}
         </div>
       );
       day = addDays(day, 1);
    }
    return days;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg">
       {/* Header */}
       <div className="bg-indigo-600 text-white p-4 rounded-t-lg">
        <div className="flex items-center justify-between">
          <button
            onClick={onPrevYear}
            className="px-4 py-2 bg-indigo-700 hover:bg-indigo-800 rounded transition-colors"
          >
            ←
          </button>
          <h2 className="text-2xl font-bold">
            {format(currentDate, 'yyyy')}
          </h2>
          <button
            onClick={onNextYear}
            className="px-4 py-2 bg-indigo-700 hover:bg-indigo-800 rounded transition-colors"
          >
            →
          </button>
        </div>
      </div>

      <div className="p-4 bg-gray-50">
        <div className="grid grid-cols-3 gap-4">
          {MONTHS.map(month => renderMiniMonth(month))}
        </div>
      </div>
    </div>
  );
}
