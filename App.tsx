
import React, { useState, useEffect } from 'react';
import { User, Event as CampusEvent } from './types';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Auth from './pages/Auth';
import EventDetails from './pages/EventDetails';
import AdminPanel from './pages/AdminPanel';
import Profile from './pages/Profile';
import AIAssistant from './components/AIAssistant';
import { db } from './db';

type View = 'dashboard' | 'login' | 'signup' | 'details' | 'admin' | 'profile';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [allEvents, setAllEvents] = useState<CampusEvent[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('cc_auth');
    if (saved) {
      setCurrentUser(JSON.parse(saved));
    }

    const fetchEvents = async () => {
      try {
        const events = await db.getEvents();
        setAllEvents(events);
      } catch (e) {
        console.error("Initial load failed", e);
      }
    };
    fetchEvents();
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('cc_auth', JSON.stringify(user));
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('cc_auth');
    setCurrentView('dashboard');
  };

  const handleNavigate = (path: string) => {
    setSelectedEventId(null);
    setCurrentView(path as View);
  };

  const handleEventClick = (id: string) => {
    setSelectedEventId(id);
    setCurrentView('details');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard user={currentUser} onEventClick={handleEventClick} />;
      case 'login':
        return <Auth type="login" onAuthSuccess={handleLogin} onSwitchType={() => setCurrentView('signup')} />;
      case 'signup':
        return <Auth type="signup" onAuthSuccess={handleLogin} onSwitchType={() => setCurrentView('login')} />;
      case 'details':
        return selectedEventId ? (
          <EventDetails eventId={selectedEventId} user={currentUser} onNavigate={handleNavigate} />
        ) : <Dashboard user={currentUser} onEventClick={handleEventClick} />;
      case 'admin':
        return <AdminPanel user={currentUser} onNavigate={handleNavigate} />;
      case 'profile':
        return currentUser ? <Profile user={currentUser} onEventClick={handleEventClick} /> : <Dashboard user={currentUser} onEventClick={handleEventClick} />;
      default:
        return <Dashboard user={currentUser} onEventClick={handleEventClick} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-transparent">
      <Navbar 
        user={currentUser} 
        onLogout={handleLogout} 
        onNavigate={handleNavigate} 
      />
      <main className="flex-grow">
        {renderContent()}
      </main>

      <AIAssistant events={allEvents} />
      
      <footer className="glass border-t border-white/5 py-16 mt-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center mb-8">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2.5 rounded-xl shadow-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <span className="ml-3 text-xl font-black text-white tracking-tighter">CampusConnect</span>
          </div>
          <p className="text-gray-500 text-sm font-medium">© 2024 University Event Hub. Handcrafted for the next generation.</p>
          <div className="flex justify-center space-x-8 mt-8">
            <a href="#" className="text-gray-500 hover:text-indigo-400 text-xs font-black uppercase tracking-widest transition-colors">Privacy</a>
            <a href="#" className="text-gray-500 hover:text-indigo-400 text-xs font-black uppercase tracking-widest transition-colors">Terms</a>
            <a href="#" className="text-gray-500 hover:text-indigo-400 text-xs font-black uppercase tracking-widest transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
