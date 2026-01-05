
import React, { useState, useEffect } from 'react';
import { db } from '../db';
import { Event, User } from '../types';
import PaymentModal from '../components/PaymentModal';

interface EventDetailsProps {
  eventId: string;
  user: User | null;
  onNavigate: (path: string) => void;
}

const EventDetails: React.FC<EventDetailsProps> = ({ eventId, user, onNavigate }) => {
  const [event, setEvent] = useState<Event | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registrationCount, setRegistrationCount] = useState(0);
  const [showPayment, setShowPayment] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Sync internal state with DB
  const refreshState = async () => {
    const foundEvent = await db.getEventById(eventId);
    if (foundEvent) {
      setEvent(foundEvent);
      if (user) {
        const regs = await db.getRegistrationsForUser(user.id);
        const registered = regs.some(r => r.eventId === eventId);
        setIsRegistered(registered);
      }
      const regList = await db.getRegistrationsForEvent(eventId);
      setRegistrationCount(regList.length);
    }
  };

  useEffect(() => {
    refreshState();
  }, [eventId, user]);

  const handleAction = () => {
    if (!user) {
      onNavigate('login');
      return;
    }

    if (isRegistered) {
      handleCancelRegistration();
    } else {
      handleJoinClick();
    }
  };

  const handleJoinClick = () => {
    if (event?.price && event.price > 0) {
      setShowPayment(true);
    } else {
      finalizeRegistration();
    }
  };

  const finalizeRegistration = async () => {
    setProcessing(true);
    try {
      if (user && await db.registerForEvent(user.id, eventId)) {
        await refreshState();
        setShowPayment(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  const handleCancelRegistration = async () => {
    if (confirm('Are you sure you want to cancel your registration? Your spot will be released immediately.')) {
      setProcessing(true);
      try {
        if (user) {
          const removed = await db.unregisterFromEvent(user.id, eventId);
          if (removed) {
            await refreshState();
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setProcessing(false);
      }
    }
  };

  if (!event) return (
    <div className="min-h-screen flex items-center justify-center">
       <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {showPayment && event && (
        <PaymentModal 
          amount={event.price} 
          eventName={event.title} 
          onSuccess={finalizeRegistration} 
          onCancel={() => setShowPayment(false)} 
        />
      )}

      <button 
        onClick={() => onNavigate('dashboard')}
        className="inline-flex items-center text-gray-400 hover:text-white font-bold mb-10 group transition-all"
      >
        <div className="bg-white/5 p-2 rounded-xl border border-white/10 group-hover:bg-white/10 mr-4 transition-all">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </div>
        Back to Dashboard
      </button>

      <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex-grow lg:w-2/3">
          <div className="glass rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl">
            <div className="relative h-[500px]">
              <img 
                src={event.imageUrl} 
                alt={event.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/20 to-transparent"></div>
              
              <div className="absolute top-8 left-8 flex gap-3">
                <span className="bg-indigo-600 text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-xl">
                  {event.category}
                </span>
                <span className={`bg-white/10 backdrop-blur-md text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-white/20`}>
                  {event.price === 0 ? 'FREE ENTRY' : `₹${event.price}`}
                </span>
              </div>

              <div className="absolute bottom-12 left-12 right-12">
                <h1 className="text-5xl md:text-6xl font-black text-white mb-6 leading-none tracking-tighter">
                  {event.title}
                </h1>
                <div className="flex flex-wrap items-center gap-8 text-gray-300 font-bold">
                  <div className="flex items-center">
                    <div className="bg-white/10 p-2 rounded-lg mr-3 border border-white/10">
                      <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    {event.organizer}
                  </div>
                  <div className="flex items-center">
                    <div className="bg-white/10 p-2 rounded-lg mr-3 border border-white/10">
                      <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    {event.time}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-12 md:p-16">
              <section className="mb-16">
                <h2 className="text-2xl font-black text-white mb-8 flex items-center tracking-tight">
                  <span className="w-1.5 h-8 bg-indigo-600 rounded-full mr-5 inline-block"></span>
                  The Full Experience
                </h2>
                <p className="text-gray-400 leading-relaxed text-xl whitespace-pre-line font-medium">
                  {event.description}
                </p>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/5">
                  <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mb-4">Date & Time</p>
                  <p className="text-white font-black text-2xl tracking-tight mb-1">
                    {new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </p>
                  <p className="text-indigo-400 font-bold uppercase tracking-widest text-xs">Starts at {event.time}</p>
                </div>

                <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/5">
                  <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mb-4">Location</p>
                  <p className="text-white font-black text-2xl tracking-tight mb-1">{event.venue}</p>
                  <p className="text-indigo-400 font-bold uppercase tracking-widest text-xs">Campus Grounds</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:w-1/3">
          <div className="glass rounded-[3rem] p-10 sticky top-32 shadow-2xl border border-white/10">
            <div className="mb-10">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Live Occupancy</p>
              <div className="flex items-baseline justify-between mb-4">
                <div className="flex items-baseline gap-2">
                   <span className="text-5xl font-black text-white tracking-tighter">{registrationCount}</span>
                   <span className="text-gray-500 font-bold text-lg">/ {event.capacity}</span>
                </div>
                <div className="bg-indigo-500/10 px-4 py-1.5 rounded-full border border-indigo-500/20">
                  <span className="text-indigo-400 font-black text-xs">{Math.round((registrationCount / event.capacity) * 100)}% FULL</span>
                </div>
              </div>
              <div className="w-full bg-white/5 h-3 rounded-full overflow-hidden border border-white/10">
                <div 
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 h-full rounded-full transition-all duration-1000" 
                  style={{ width: `${Math.min((registrationCount / event.capacity) * 100, 100)}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-4">
              {user?.role === 'admin' ? (
                <div className="bg-white/5 p-6 rounded-2xl border border-dashed border-white/10 text-center">
                  <p className="text-gray-400 font-bold text-sm">Organizer Console View</p>
                </div>
              ) : (
                <>
                  <button
                    onClick={handleAction}
                    disabled={(!isRegistered && registrationCount >= event.capacity) || processing}
                    className={`w-full py-6 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.3em] transition-all transform hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 ${
                      isRegistered 
                        ? 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20' 
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-2xl shadow-indigo-500/20'
                    }`}
                  >
                    {processing ? (
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        {isRegistered ? (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Cancel Registration
                          </>
                        ) : (
                          <>
                            {registrationCount >= event.capacity 
                              ? 'EVENT FULL' 
                              : event.price > 0 
                              ? `PAY ₹${event.price} & JOIN` 
                              : 'SECURE FREE SPOT'}
                          </>
                        )}
                      </>
                    )}
                  </button>

                  {isRegistered && !processing && (
                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/10 rounded-2xl text-center flex items-center justify-center gap-2">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                      <p className="text-emerald-400 font-black text-[10px] uppercase tracking-widest">
                        Status: Registration Active
                      </p>
                    </div>
                  )}
                </>
              )}
              
              {!user && (
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 text-center">
                  <p className="text-sm font-bold text-gray-500 mb-4 tracking-tight">Ready to join the vibe?</p>
                  <button 
                    onClick={() => onNavigate('login')}
                    className="text-indigo-400 font-black text-xs hover:text-white transition-colors uppercase tracking-[0.2em]"
                  >
                    Authenticate to Access
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;