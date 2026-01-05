
import React, { useState, useEffect } from 'react';
import { db } from '../db';
import { Event, User } from '../types';
import { CATEGORIES } from '../constants';

interface AdminPanelProps {
  user: User | null;
  onNavigate: (path: string) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ user, onNavigate }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [regCounts, setRegCounts] = useState<Record<string, number>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState<Omit<Event, 'id'>>({
    title: '',
    description: '',
    date: '',
    time: '',
    venue: '',
    organizer: '',
    category: 'Technical',
    imageUrl: '',
    capacity: 100,
    price: 0
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const fetchedEvents = await db.getEvents();
      setEvents(fetchedEvents);
      
      const counts: Record<string, number> = {};
      for (const event of fetchedEvents) {
        const regs = await db.getRegistrationsForEvent(event.id);
        counts[event.id] = regs.length;
      }
      setRegCounts(counts);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      onNavigate('dashboard');
      return;
    }
    loadData();
  }, [user]);

  const handleOpenModal = (event?: Event) => {
    if (event) {
      setEditingEvent(event);
      setFormData({
        title: event.title,
        description: event.description,
        date: event.date,
        time: event.time,
        venue: event.venue,
        organizer: event.organizer,
        category: event.category,
        imageUrl: event.imageUrl,
        capacity: event.capacity,
        price: event.price || 0
      });
    } else {
      setEditingEvent(null);
      setFormData({
        title: '',
        description: '',
        date: '',
        time: '',
        venue: '',
        organizer: '',
        category: 'Technical',
        imageUrl: '',
        capacity: 100,
        price: 0
      });
    }
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this event from the cloud? This action cannot be undone.')) {
      await db.deleteEvent(id);
      await loadData();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imageUrl) {
      alert("Please provide a poster image URL.");
      return;
    }
    const event: Event = {
      ...formData,
      id: editingEvent ? editingEvent.id : Math.random().toString(36).substr(2, 9)
    };
    await db.saveEvent(event);
    await loadData();
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
        <div>
          <h1 className="text-5xl font-black text-white tracking-tighter">Command Center</h1>
          <p className="text-gray-400 mt-3 font-medium text-lg tracking-tight">Cloud Synced Admin Console.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-5 rounded-[1.5rem] font-black flex items-center transition-all shadow-xl shadow-indigo-500/20 hover:-translate-y-1 active:scale-95 uppercase tracking-widest text-xs"
        >
          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
          </svg>
          Publish Event
        </button>
      </div>

      <div className="glass rounded-[2.5rem] shadow-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Live Experience</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Niche</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Access Fee</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Engagement</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-medium">
              {loading ? (
                 <tr><td colSpan={5} className="p-20 text-center text-gray-500">Syncing with cloud...</td></tr>
              ) : events.map((event) => {
                const regs = regCounts[event.id] || 0;
                return (
                  <tr key={event.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center">
                        <img src={event.imageUrl} className="w-16 h-16 rounded-2xl object-cover mr-6 shadow-2xl border border-white/10 group-hover:scale-105 transition-transform" />
                        <div>
                          <span className="font-black text-white block text-lg tracking-tight group-hover:text-indigo-400 transition-colors">{event.title}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-4 py-1.5 rounded-full text-[10px] font-black glass border border-white/10 text-indigo-400 uppercase tracking-widest">
                        {event.category}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`text-base font-black ${event.price === 0 ? 'text-emerald-400' : 'text-white'}`}>
                        {event.price === 0 ? 'FREE' : `₹${event.price}`}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between text-[10px] font-black text-gray-500">
                          <span>{regs} / {event.capacity}</span>
                        </div>
                        <div className="w-24 bg-white/5 h-2 rounded-full overflow-hidden">
                          <div className="bg-indigo-600 h-full transition-all" style={{ width: `${Math.min((regs / event.capacity) * 100, 100)}%` }}></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right space-x-3">
                      <button onClick={() => handleOpenModal(event)} className="p-3 bg-white/5 hover:bg-indigo-600 text-gray-500 hover:text-white rounded-xl transition-all">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-5M16.138 2.976a2.121 2.121 0 013.007 3.007L9.75 16.793 5.5 18l1.207-4.25L16.138 2.976z" /></svg>
                      </button>
                      <button onClick={() => handleDelete(event.id)} className="p-3 bg-white/5 hover:bg-red-600 text-gray-500 hover:text-white rounded-xl transition-all">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-gray-950/80 backdrop-blur-xl">
          <div className="glass rounded-[2.5rem] w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="px-8 py-6 border-b border-white/10 flex justify-between items-center">
              <h2 className="text-2xl font-black text-white">{editingEvent ? 'Refine Event' : 'New Creation'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">Close</button>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-8 overflow-y-auto space-y-6">
                <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white" placeholder="Headline" />
                <input required type="url" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} className="w-full px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white" placeholder="Poster URL" />
                <div className="grid grid-cols-2 gap-4">
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as any})} className="w-full px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white">
                    {CATEGORIES.map(cat => <option key={cat} value={cat} className="bg-gray-900">{cat}</option>)}
                  </select>
                  <input required value={formData.organizer} onChange={e => setFormData({...formData, organizer: e.target.value})} className="w-full px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white" placeholder="Organizer" />
                  <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: parseInt(e.target.value)})} className="w-full px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white" placeholder="Price" />
                  <input required type="number" value={formData.capacity} onChange={e => setFormData({...formData, capacity: parseInt(e.target.value)})} className="w-full px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white" placeholder="Capacity" />
                  <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white" />
                  <input required type="time" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className="w-full px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white" />
                </div>
                <input required value={formData.venue} onChange={e => setFormData({...formData, venue: e.target.value})} className="w-full px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white" placeholder="Venue" />
                <textarea required rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white resize-none" placeholder="Description"></textarea>
              </div>
              <div className="px-8 py-6 border-t border-white/10 flex justify-end gap-4">
                <button type="submit" className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-black">Publish to Cloud</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
