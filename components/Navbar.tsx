
import React from 'react';
import { User } from '../types';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
  onNavigate: (path: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout, onNavigate }) => {
  return (
    <nav className="sticky top-0 z-[100] px-6 py-4">
      <div className="max-w-7xl mx-auto glass rounded-2xl px-6 py-3 flex justify-between items-center shadow-2xl">
        <div 
          className="flex items-center cursor-pointer group space-x-3"
          onClick={() => onNavigate('dashboard')}
        >
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2.5 rounded-xl shadow-lg group-hover:rotate-12 transition-transform duration-300">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <span className="text-2xl font-black bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent tracking-tighter">CampusConnect</span>
        </div>

        <div className="hidden md:flex items-center space-x-8">
          <button 
            onClick={() => onNavigate('dashboard')}
            className="text-gray-300 hover:text-white font-bold text-sm tracking-widest uppercase transition-all flex items-center gap-2"
          >
            <span className="w-1 h-1 rounded-full bg-indigo-500"></span>
            Explore
          </button>
          {user && (
            <button 
              onClick={() => onNavigate('profile')}
              className="text-gray-300 hover:text-white font-bold text-sm tracking-widest uppercase transition-all flex items-center gap-2"
            >
              <span className="w-1 h-1 rounded-full bg-purple-500"></span>
              My Tickets
            </button>
          )}
          {user?.role === 'admin' && (
            <button 
              onClick={() => onNavigate('admin')}
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-xs font-black tracking-widest uppercase transition-all"
            >
              Console
            </button>
          )}
        </div>

        <div className="flex items-center space-x-6">
          {user ? (
            <div className="flex items-center space-x-6">
              <div 
                className="text-right hidden sm:block cursor-pointer"
                onClick={() => onNavigate('profile')}
              >
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{user.role}</p>
                <p className="text-sm font-bold text-white leading-tight hover:text-indigo-400 transition-colors">{user.name.split(' ')[0]}</p>
              </div>
              <button
                onClick={onLogout}
                className="bg-white/5 hover:bg-red-500/20 text-gray-300 hover:text-red-400 px-4 py-2 rounded-xl text-xs font-black transition-all border border-white/10"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <button
                onClick={() => onNavigate('login')}
                className="text-gray-300 hover:text-white font-black text-xs uppercase tracking-widest"
              >
                Sign In
              </button>
              <button
                onClick={() => onNavigate('signup')}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
