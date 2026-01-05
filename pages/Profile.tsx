
import React, { useState, useEffect } from 'react';
import { db } from '../db';
import { Event, User, Registration } from '../types';

interface ProfileProps {
  user: User;
  onEventClick: (id: string) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onEventClick }) => {
  const [registeredEvents, setRegisteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const regs = await db.getRegistrationsForUser(user.id);
        const eventPromises = regs.map(r => db.getEventById(r.eventId));
        const events = await Promise.all(eventPromises);
        setRegisteredEvents(events.filter((e): e is Event => e !== undefined));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <header className="mb-16">
        <h1 className="text-5xl font-black text-white tracking-tighter mb-4">My Campus Life</h1>
        <p className="text-gray-400 font-medium text-lg">Managing tickets and vibes for <span className="text-white">{user.name}</span></p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* User Stats Card */}
        <div className="md:col-span-1">
          <div className="glass rounded-[3rem] p-10 border border-white/10 sticky top-32">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-4xl font-black text-white mb-8 shadow-2xl shadow-indigo-500/20">
              {user.name.charAt(0)}
            </div>
            <div className="space-y-6">
              <div>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Identity</p>
                <p className="text-xl font-bold text-white tracking-tight">{user.name}</p>
                <p className="text-sm text-gray-400">{user.email}</p>
              </div>
              <div className="pt-6 border-t border-white/5">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Summary</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                    <p className="text-2xl font-black text-indigo-400">{registeredEvents.length}</p>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">Events Joined</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                    <p className="text-2xl font-black text-emerald-400">{user.role.toUpperCase()}</p>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">Account Type</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Registered Events List */}
        <div className="md:col-span-2 space-y-8">
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center">
            <span className="w-1.5 h-8 bg-indigo-600 rounded-full mr-4"></span>
            Upcoming Tickets
          </h2>

          {loading ? (
            <div className="space-y-6">
              {[1, 2].map(i => <div key={i} className="h-40 glass rounded-[2rem] animate-pulse"></div>)}
            </div>
          ) : registeredEvents.length > 0 ? (
            <div className="space-y-6">
              {registeredEvents.map(event => (
                <div 
                  key={event.id}
                  onClick={() => onEventClick(event.id)}
                  className="group glass rounded-[2rem] p-6 border border-white/10 hover:border-indigo-500/30 transition-all cursor-pointer flex flex-col sm:flex-row gap-6 items-center"
                >
                  <img src={event.imageUrl} className="w-full sm:w-32 h-32 rounded-2xl object-cover shadow-xl" />
                  <div className="flex-1 text-center sm:text-left">
                    <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-3">
                      <span className="bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-indigo-500/20">
                        {event.category}
                      </span>
                      <span className="bg-white/5 text-gray-400 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/10">
                        {event.date}
                      </span>
                    </div>
                    <h3 className="text-xl font-black text-white mb-2 group-hover:text-indigo-400 transition-colors tracking-tight">{event.title}</h3>
                    <p className="text-sm text-gray-500 font-medium">{event.venue}</p>
                  </div>
                  <div className="flex flex-col gap-2 w-full sm:w-auto">
                    <div className="bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-xl text-[10px] font-black uppercase text-center border border-emerald-500/20">
                      Confirmed
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 glass rounded-[3rem] border border-dashed border-white/10">
              <p className="text-gray-500 font-bold mb-6">No active registrations found.</p>
              <button 
                onClick={() => window.location.href = '#'} 
                className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-500 transition-all"
              >
                Find an Event
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
