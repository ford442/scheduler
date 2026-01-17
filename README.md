# scheduler

A modern calendar web application built with React, Vite, TypeScript, and Tailwind CSS.

## Features

- 📅 **Monthly Calendar View**: 7-column grid layout showing a complete month
- 🎨 **Indigo/White Theme**: Clean, professional design with indigo accents
- ➕ **Event Management**: Add, view, and manage events
- 🔔 **Smart Reminders**: Automatic alerts for upcoming events (checks every 60 seconds)
- 🗓️ **Date Navigation**: Easy navigation between months
- 🚀 **FastAPI Integration**: Ready to connect to a FastAPI backend

## Technologies

- **Frontend**: React 19, TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Date Handling**: date-fns
- **Backend API**: FastAPI (backend not included)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ford442/scheduler.git
cd scheduler
```

2. Install dependencies:
```bash
npm install
```

3. Configure the API endpoint (optional):
```bash
cp .env.example .env
# Edit .env to set your API base URL
```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173/`

### Build

Build for production:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

### Linting

Run ESLint to check code quality:
```bash
npm run lint
```

## API Integration

The application is designed to work with a FastAPI backend. Configure the API base URL in the `.env` file:

```env
VITE_API_BASE_URL=http://localhost:8000
```

### API Endpoints

The application expects the following endpoints:

- **GET** `/api/songs?type=event` - Fetch all events
- **GET** `/api/songs/{id}` - Fetch a specific event by ID
- **POST** `/api/songs` - Create a new event

#### Event Payload Structure

```json
{
  "name": "Event Title",
  "author": "user",
  "type": "event",
  "data": {
    "date": "2026-01-19",
    "time": "14:30",
    "title": "Event Title"
  }
}
```

## Features in Detail

### Calendar Grid

- 7-column layout representing days of the week
- Shows previous and next month's dates for context
- Current day highlighted with indigo ring
- Hover effects for better interactivity

### Event Management

- Click any date to add a new event
- Enter event title and time
- Events are displayed on the calendar with time and title
- Events stored via API calls to the backend

### Reminder System

- Runs every 60 seconds using `useEffect`
- Compares current browser time with event times
- Shows browser alerts when an event time matches the current time
- Works automatically in the background

## Project Structure

```
scheduler/
├── src/
│   ├── components/
│   │   └── Calendar.tsx       # Main calendar component
│   ├── services/
│   │   └── api.ts             # API service layer
│   ├── types.ts               # TypeScript type definitions
│   ├── App.tsx                # Root application component
│   ├── main.tsx               # Application entry point
│   └── index.css              # Global styles with Tailwind
├── public/                    # Static assets
├── .env.example               # Environment variables template
├── tailwind.config.js         # Tailwind CSS configuration
├── postcss.config.js          # PostCSS configuration
├── vite.config.ts             # Vite configuration
└── package.json               # Project dependencies
```

## Screenshots

### Main Calendar View
![Calendar Main View](https://github.com/user-attachments/assets/1db27c65-659a-424a-832e-580ad124dc11)

### Add Event Modal
![Add Event Modal](https://github.com/user-attachments/assets/387eb48f-6208-4de0-9e0c-385dac08083f)

### Event Form Filled
![Event Form](https://github.com/user-attachments/assets/ccee047c-6310-4841-9a47-911e50c2b782)

### Month Navigation
![February View](https://github.com/user-attachments/assets/4ef55571-a5a4-49d1-861b-e1e13fa68ed5)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.
