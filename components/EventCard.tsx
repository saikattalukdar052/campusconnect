
import React from 'react';
import { Event } from '../types';

interface EventCardProps {
  event: Event;
  onClick: (id: string) => void;
  isRegistered?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({ event, onClick, isRegistered }) => {
  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Fest': return 'from-pink-500 to-rose-500';
      case 'DJ Night': return 'from-purple-600 to-indigo-600';
      case 'Theatrix': return 'from-amber-400 to-orange-500';
      case 'Sports': return 'from-emerald-400 to-teal-500';
      default: return 'from-blue-500 to-indigo-500';
    }
  };

  return (
    <div 
      onClick={() => onClick(event.id)}
      className="group relative bg-white/5 backdrop-blur-md rounded-[2rem] border border-white/10 overflow-hidden hover:border-white/20 transition-all duration-500 cursor-pointer shadow-2xl"
    >
      {/* Glow Effect */}
      <div className={`absolute -inset-1 bg-gradient-to-r ${getCategoryColor(event.category)} rounded-[2rem] blur opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>
      
      <div className="relative h-60 overflow-hidden">
        <img 
          src={event.imageUrl} 
          alt={event.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent opacity-60"></div>
        
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <span className={`bg-gradient-to-r ${getCategoryColor(event.category)} text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl`}>
            {event.category}
          </span>
          <span className="bg-white/10 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10">
            {event.price === 0 ? 'FREE' : `₹${event.price}`}
          </span>
        </div>
        
        {isRegistered && (
          <div className="absolute top-4 right-4">
            <span className="bg-emerald-500 text-white px-4 py-1.5 rounded-full text-[10px] font-black shadow-lg flex items-center gap-2 uppercase tracking-tighter">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Registered
            </span>
          </div>
        )}
      </div>
      
      <div className="p-8">
        <div className="flex items-center text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mb-3">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
        </div>
        
        <h3 className="text-2xl font-black text-white mb-3 group-hover:text-indigo-400 transition-colors leading-tight line-clamp-1 tracking-tighter">
          {event.title}
        </h3>
        
        <p className="text-gray-400 text-sm font-medium line-clamp-2 mb-8 leading-relaxed">
          {event.description}
        </p>
        
        <div className="flex items-center justify-between pt-6 border-t border-white/5">
          <div className="flex items-center text-gray-500 text-xs font-bold uppercase tracking-widest">
            <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            {event.venue}
          </div>
          <div className="text-white bg-white/5 p-2 rounded-lg group-hover:bg-indigo-600 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
