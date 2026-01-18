type CalendarViewType = 'day' | 'month' | 'year';

interface ViewSwitcherProps {
  currentView: CalendarViewType;
  onChangeView: (view: CalendarViewType) => void;
}

export default function ViewSwitcher({ currentView, onChangeView }: ViewSwitcherProps) {
  const views: { id: CalendarViewType; label: string }[] = [
    { id: 'day', label: 'Day' },
    { id: 'month', label: 'Month' },
    { id: 'year', label: 'Year' },
  ];

  return (
    <div
      className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white shadow-lg rounded-full p-1.5 flex space-x-1 z-40 border border-gray-200"
      style={{ position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', zIndex: 40 }}
    >
      {views.map((view) => (
        <button
          key={view.id}
          onClick={() => onChangeView(view.id)}
          className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
            currentView === view.id
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-gray-500 hover:bg-gray-100 hover:text-indigo-600'
          }`}
        >
          {view.label}
        </button>
      ))}
    </div>
  );
}
