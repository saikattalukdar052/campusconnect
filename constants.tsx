
import { Event, EventCategory } from './types';

export const CATEGORIES: EventCategory[] = ['Fest', 'DJ Night', 'Workshop', 'Sports', 'Technical', 'Theatrix', 'Seminar'];

export const INITIAL_EVENTS: Event[] = [
  {
    id: '1',
    title: 'Aurora Grand Fest 2024',
    description: 'The biggest annual cultural carnival! Three days of non-stop energy, fashion shows, and star-studded events.',
    date: '2024-11-20',
    time: '10:00',
    venue: 'University Central Grounds',
    organizer: 'Student Council',
    category: 'Fest',
    imageUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=1000&auto=format&fit=crop',
    capacity: 2000,
    price: 1500
  },
  {
    id: '2',
    title: 'Neon Nights: Bass Drop',
    description: 'A pulsating DJ Night featuring top-tier electronic music, laser shows, and neon face painting.',
    date: '2024-10-15',
    time: '20:00',
    venue: 'Indoor Arena',
    organizer: 'Music Club',
    category: 'DJ Night',
    imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1000&auto=format&fit=crop',
    capacity: 800,
    price: 600
  },
  {
    id: '3',
    title: 'The Hamlet Interpretation',
    description: 'A contemporary take on Shakespeare classic "Hamlet" by our award-winning Theatrix society.',
    date: '2024-09-05',
    time: '18:30',
    venue: 'Old Auditorium',
    organizer: 'Drama Society',
    category: 'Theatrix',
    imageUrl: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?q=80&w=1000&auto=format&fit=crop',
    capacity: 300,
    price: 250
  },
  {
    id: '4',
    title: 'Inter-College Cricket Cup',
    description: 'The ultimate T20 showdown. Watch the best 11 fight for the prestigious diamond trophy.',
    date: '2024-08-12',
    time: '09:00',
    venue: 'College Stadium',
    organizer: 'Sports Association',
    category: 'Sports',
    imageUrl: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=1000&auto=format&fit=crop',
    capacity: 500,
    price: 0
  },
  {
    id: '5',
    title: 'Web3.0 & Metaverse Workshop',
    description: 'Hands-on session on building decentralized apps and exploring the future of spatial computing.',
    date: '2024-07-25',
    time: '11:00',
    venue: 'Lab Complex 4',
    organizer: 'Tech Innovators',
    category: 'Technical',
    imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=1000&auto=format&fit=crop',
    capacity: 100,
    price: 450
  }
];
