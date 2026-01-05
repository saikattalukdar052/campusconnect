
export type Role = 'student' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  password?: string;
}

export type EventCategory = 'Workshop' | 'Seminar' | 'Fest' | 'Sports' | 'Technical' | 'DJ Night' | 'Theatrix';

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  organizer: string;
  category: EventCategory;
  imageUrl: string;
  capacity: number;
  price: number; // Price in Rupees (0 for free)
}

export interface Registration {
  id: string;
  userId: string;
  eventId: string;
  registrationDate: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
}
