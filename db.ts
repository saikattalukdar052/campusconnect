
import { createClient } from '@supabase/supabase-js';
import { User, Event, Registration } from './types';
import { INITIAL_EVENTS } from './constants';

// --- CONFIGURATION ---
// These are your actual credentials for the CampusConnect database.
// Added explicit string type to prevent "no overlap" error during placeholder check.
const SUPABASE_URL: string = 'https://spktkzbpgnwnbhvjiwpt.supabase.co';
const SUPABASE_KEY: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwa3RremJwZ253bmJodmppd3B0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2MjAyOTQsImV4cCI6MjA4MzE5NjI5NH0.Muz9veqvoi7zcyl6zzEoPAJWjS_ljqJJLAZPlyHw_9A';

const isPlaceholder = SUPABASE_URL.includes('YOUR_PROJECT_REF') || SUPABASE_KEY === 'YOUR_ANON_KEY';

// Initialize Supabase Client
const supabase = !isPlaceholder ? createClient(SUPABASE_URL, SUPABASE_KEY) : null;

// --- LOCAL STORAGE HELPERS (FOR FALLBACK MODE) ---
const LOCAL_STORAGE_KEYS = {
  EVENTS: 'cc_local_events',
  PROFILES: 'cc_local_profiles',
  REGISTRATIONS: 'cc_local_regs'
};

const getLocal = <T>(key: string, defaultValue: T): T => {
  const saved = localStorage.getItem(key);
  return saved ? JSON.parse(saved) : defaultValue;
};

const setLocal = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Initialize Local Data if empty (only if cloud is not active)
if (isPlaceholder) {
  if (!localStorage.getItem(LOCAL_STORAGE_KEYS.EVENTS)) {
    setLocal(LOCAL_STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
  }
}

export const db = {
  isCloud: !isPlaceholder,

  // --- USER OPERATIONS ---
  getUsers: async (): Promise<User[]> => {
    if (supabase) {
      const { data, error } = await supabase.from('profiles').select('*');
      if (error) throw new Error(error.message);
      return data as User[];
    }
    return getLocal<User[]>(LOCAL_STORAGE_KEYS.PROFILES, []);
  },
  
  saveUser: async (user: User) => {
    if (supabase) {
      const { error } = await supabase.from('profiles').upsert(user);
      if (error) throw new Error(error.message);
      return;
    }
    const users = await db.getUsers();
    const index = users.findIndex(u => u.id === user.id || u.email === user.email);
    if (index > -1) users[index] = user;
    else users.push(user);
    setLocal(LOCAL_STORAGE_KEYS.PROFILES, users);
  },

  findUserByEmail: async (email: string): Promise<User | undefined> => {
    if (supabase) {
      const { data, error } = await supabase.from('profiles').select('*').eq('email', email).single();
      if (error && error.code !== 'PGRST116') throw new Error(error.message);
      return (data as User) || undefined;
    }
    const users = await db.getUsers();
    return users.find(u => u.email === email);
  },

  // --- EVENT OPERATIONS ---
  getEvents: async (): Promise<Event[]> => {
    if (supabase) {
      const { data, error } = await supabase.from('events').select('*');
      if (error) throw new Error(error.message);
      
      return data.map(e => ({
        id: e.id,
        title: e.title,
        description: e.description,
        date: e.date,
        time: e.time,
        venue: e.venue,
        organizer: e.organizer,
        category: e.category,
        imageUrl: e.image_url || e.imageUrl,
        capacity: e.capacity,
        price: e.price
      })) as Event[];
    }
    return getLocal<Event[]>(LOCAL_STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
  },

  getEventById: async (id: string): Promise<Event | undefined> => {
    if (supabase) {
      const { data, error } = await supabase.from('events').select('*').eq('id', id).single();
      if (error) return undefined;
      return {
        ...data,
        imageUrl: data.image_url || data.imageUrl
      } as any as Event;
    }
    const events = await db.getEvents();
    return events.find(e => e.id === id);
  },

  saveEvent: async (event: Event) => {
    if (supabase) {
      const dbEvent = {
        id: event.id,
        title: event.title,
        description: event.description,
        date: event.date,
        time: event.time,
        venue: event.venue,
        organizer: event.organizer,
        category: event.category,
        image_url: event.imageUrl,
        capacity: event.capacity,
        price: event.price
      };
      const { error } = await supabase.from('events').upsert(dbEvent);
      if (error) throw new Error(error.message);
      return;
    }
    const events = await db.getEvents();
    const index = events.findIndex(e => e.id === event.id);
    if (index > -1) events[index] = event;
    else events.push(event);
    setLocal(LOCAL_STORAGE_KEYS.EVENTS, events);
  },

  deleteEvent: async (id: string) => {
    if (supabase) {
      await supabase.from('registrations').delete().eq('event_id', id);
      const { error } = await supabase.from('events').delete().eq('id', id);
      if (error) throw new Error(error.message);
      return;
    }
    const events = (await db.getEvents()).filter(e => e.id !== id);
    const regs = (await db.getRegistrations()).filter(r => r.eventId !== id);
    setLocal(LOCAL_STORAGE_KEYS.EVENTS, events);
    setLocal(LOCAL_STORAGE_KEYS.REGISTRATIONS, regs);
  },

  // --- REGISTRATION OPERATIONS ---
  getRegistrations: async (): Promise<Registration[]> => {
    if (supabase) {
      const { data, error } = await supabase.from('registrations').select('*');
      if (error) throw new Error(error.message);
      return data.map(r => ({
        id: r.id,
        userId: r.user_id,
        eventId: r.event_id,
        registrationDate: r.registration_date
      })) as Registration[];
    }
    return getLocal<Registration[]>(LOCAL_STORAGE_KEYS.REGISTRATIONS, []);
  },

  registerForEvent: async (userId: string, eventId: string) => {
    if (supabase) {
      const newReg = {
        id: Math.random().toString(36).substr(2, 9),
        user_id: userId,
        event_id: eventId,
      };
      const { error } = await supabase.from('registrations').insert(newReg);
      if (error) throw new Error(error.message);
      return true;
    }
    const regs = await db.getRegistrations();
    regs.push({
      id: Math.random().toString(36).substr(2, 9),
      userId,
      eventId,
      registrationDate: new Date().toISOString()
    });
    setLocal(LOCAL_STORAGE_KEYS.REGISTRATIONS, regs);
    return true;
  },

  unregisterFromEvent: async (userId: string, eventId: string) => {
    if (supabase) {
      const { error } = await supabase.from('registrations').delete().eq('user_id', userId).eq('event_id', eventId);
      if (error) throw new Error(error.message);
      return true;
    }
    const regs = (await db.getRegistrations()).filter(r => !(r.userId === userId && r.eventId === eventId));
    setLocal(LOCAL_STORAGE_KEYS.REGISTRATIONS, regs);
    return true;
  },

  getRegistrationsForUser: async (userId: string) => {
    const regs = await db.getRegistrations();
    return regs.filter(r => r.userId === userId);
  },

  getRegistrationsForEvent: async (eventId: string) => {
    const regs = await db.getRegistrations();
    return regs.filter(r => r.eventId === eventId);
  },

  seedAdmin: async () => {
    try {
      const adminEmail = 'admin@college.edu';
      const existing = await db.findUserByEmail(adminEmail);
      if (!existing) {
        await db.saveUser({
          id: 'admin-id',
          name: 'University Administrator',
          email: adminEmail,
          password: 'password123',
          role: 'admin'
        });
      }
    } catch (e) {
      console.warn("Admin seeding skipped or failed:", e);
    }
  }
};

db.seedAdmin().catch(() => {});
