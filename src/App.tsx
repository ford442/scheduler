import Calendar from './components/Calendar'

function App() {
  return (
    <div className="min-h-screen bg-indigo-50/30 py-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-extrabold text-center mb-6 text-indigo-900 tracking-tight">
          Calendar Scheduler
        </h1>
        <Calendar />
      </div>
    </div>
  )
}

export default App
