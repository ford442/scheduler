import Calendar from './components/Calendar'

function App() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-indigo-600">
          Calendar Scheduler
        </h1>
        <Calendar />
      </div>
    </div>
  )
}

export default App
