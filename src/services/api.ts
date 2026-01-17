// API service for connecting to FastAPI backend

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export interface EventData {
  date: string;
  time: string;
  title: string;
}

export interface Song {
  id?: number;
  name: string;
  author: string;
  type: string;
  data: EventData;
}

export interface SongResponse {
  id: number;
  name: string;
  author: string;
  type: string;
  data: EventData;
}

// GET: /api/songs?type=event for list
export async function getEvents(): Promise<SongResponse[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/songs?type=event`);
    if (!response.ok) {
      throw new Error(`Failed to fetch events: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
}

// GET: /api/songs/{id} for details
export async function getEventById(id: number): Promise<SongResponse | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/songs/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch event ${id}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching event ${id}:`, error);
    return null;
  }
}

// POST: /api/songs payload: {"name": title, "author": "user", "type": "event", "data": {date, time, title}}
export async function createEvent(eventData: EventData): Promise<SongResponse | null> {
  try {
    const payload: Song = {
      name: eventData.title,
      author: "user",
      type: "event",
      data: eventData
    };

    const response = await fetch(`${API_BASE_URL}/api/songs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Failed to create event: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating event:', error);
    return null;
  }
}
