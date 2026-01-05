
import React, { useState, useEffect } from 'react';
import { db } from '../db';
import { Event, User } from '../types';
import EventCard from '../components/EventCard';
import { CATEGORIES } from '../constants';

interface DashboardProps {
  user: User | null;
  onEventClick: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onEventClick }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filter, setFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [userRegistrations, setUserRegistrations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedEvents = await db.getEvents();
        setEvents(fetchedEvents);
        if (user) {
          const regs = await db.getRegistrationsForUser(user.id);
          setUserRegistrations(regs.map(r => r.eventId));
        }
      } catch (err: any) {
        const message = err?.message || String(err);
        console.error("Dashboard Load Error:", message);
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user]);

  const filteredEvents = events.filter(e => {
    const matchesCategory = filter === 'All' || e.category === filter;
    const matchesSearch = e.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          e.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Connection Status Badge */}
      <div className="fixed bottom-8 left-8 z-[100] animate-in slide-in-from-bottom-8 duration-1000">
        <div className={`flex items-center gap-3 px-4 py-2 rounded-2xl glass border ${db.isCloud ? 'border-emerald-500/20' : 'border-amber-500/20'}`}>
          <div className={`w-2 h-2 rounded-full animate-pulse ${db.isCloud ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
          <span className={`text-[10px] font-black uppercase tracking-widest ${db.isCloud ? 'text-emerald-400' : 'text-amber-400'}`}>
            {db.isCloud ? 'Cloud Synced' : 'Local Demo Mode'}
          </span>
        </div>
      </div>

      {/* Hero Header */}
      <header className="mb-20 text-center space-y-6">
        <div className="inline-block px-6 py-2 rounded-full glass border border-white/10 text-indigo-400 text-xs font-black uppercase tracking-[0.4em] animate-pulse">
          What's happening on campus
        </div>
        <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-none max-w-4xl mx-auto">
          Unleash the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">Extraordinary</span>
        </h1>
        <p className="text-gray-400 text-lg md:text-xl font-medium max-w-2xl mx-auto">
          The ultimate hub for college fests, DJ nights, theatrical plays, and elite sports tournaments. Secure your spot in the vibe.
        </p>
      </header>

      {/* Control Bar */}
      <div className="flex flex-col lg:flex-row gap-8 mb-16 items-center justify-between">
        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={() => setFilter('All')}
            className={`px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${
              filter === 'All' 
                ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20' 
                : 'bg-white/5 text-gray-400 hover:text-white border border-white/5'
            }`}
          >
            All Vibes
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${
                filter === cat 
                  ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20' 
                  : 'bg-white/5 text-gray-400 hover:text-white border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full lg:w-96 group">
          <input
            type="text"
            placeholder="Search the experience..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-6 py-4 rounded-[2rem] glass border border-white/10 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-bold text-white placeholder-gray-500"
          />
          <svg className="w-6 h-6 text-indigo-500 absolute left-5 top-4 group-focus-within:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-96 rounded-[2rem] glass animate-pulse"></div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-24 bg-red-500/5 rounded-[3rem] border border-red-500/10">
          <div className="bg-red-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-red-400">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-2xl font-black text-white mb-2 tracking-tight">Sync Connection Error</h3>
          <p className="text-gray-400 font-medium max-w-md mx-auto px-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-8 px-8 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all"
          >
            Retry Connection
          </button>
        </div>
      ) : filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map(event => (
            <EventCard 
              key={event.id} 
              event={event} 
              onClick={onEventClick}
              isRegistered={userRegistrations.includes(event.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-32 rounded-[3rem] border border-dashed border-white/10">
          <div className="bg-white/5 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
             <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-2xl font-black text-white mb-2">The vibe is quiet right now</h3>
          <p className="text-gray-500 font-medium">Try another filter or search term.</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
