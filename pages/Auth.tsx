
import React, { useState } from 'react';
import { db } from '../db';
import { Role, User } from '../types';

interface AuthProps {
  type: 'login' | 'signup';
  onAuthSuccess: (user: User) => void;
  onSwitchType: () => void;
}

const Auth: React.FC<AuthProps> = ({ type: initialType, onAuthSuccess, onSwitchType }) => {
  const [view, setView] = useState<'login' | 'signup' | 'forgot'> (initialType);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<Role>('student');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  React.useEffect(() => {
    setView(initialType);
  }, [initialType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (view === 'login') {
        const user = await db.findUserByEmail(email);
        if (user && user.password === password) {
          const { password: _, ...userSafe } = user;
          onAuthSuccess(userSafe as User);
        } else {
          setError('Incorrect credentials. Access denied.');
        }
      } else if (view === 'signup') {
        const existing = await db.findUserByEmail(email);
        if (existing) {
          setError('Email already registered in our system.');
        } else {
          const newUser: User = {
            id: Math.random().toString(36).substr(2, 9),
            name,
            email,
            password,
            role
          };
          await db.saveUser(newUser);
          const { password: _, ...userSafe } = newUser;
          onAuthSuccess(userSafe as User);
        }
      } else if (view === 'forgot') {
        const user = await db.findUserByEmail(email);
        if (user) setResetSent(true);
        else setError('Email not found in our directory.');
      }
    } catch (err: any) {
      setError(err?.message || 'Database connection error. Check Supabase keys.');
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full px-6 py-4 rounded-2xl bg-white/10 border border-white/10 focus:bg-white/15 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-bold text-white placeholder-gray-500 caret-indigo-500";

  if (view === 'forgot' && resetSent) {
    return (
      <div className="min-h-[calc(100vh-100px)] flex items-center justify-center p-6">
        <div className="w-full max-w-xl text-center">
          <div className="glass rounded-[3rem] p-12 border border-white/10 shadow-2xl">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-emerald-500 text-white mb-8">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>
            </div>
            <h2 className="text-4xl font-black text-white mb-4 tracking-tighter">Check Your Inbox</h2>
            <button onClick={() => setView('login')} className="w-full bg-white/5 text-white py-5 rounded-2xl font-black uppercase tracking-widest border border-white/10">Back to Sign In</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-100px)] flex items-center justify-center p-6">
      <div className="w-full max-w-xl">
        <div className="glass rounded-[3rem] overflow-hidden border border-white/10">
          <div className="p-12">
            <h2 className="text-4xl font-black text-white tracking-tighter mb-8 text-center">
              {view === 'login' ? 'Welcome Back' : view === 'signup' ? 'Join the Wave' : 'Password Recovery'}
            </h2>

            {error && <div className="mb-8 p-4 bg-red-500/20 text-red-400 rounded-2xl text-[11px] font-black uppercase border border-red-500/30">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
              {view === 'signup' && <input required type="text" value={name} onChange={e => setName(e.target.value)} className={inputClasses} placeholder="Full Name" />}
              <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className={inputClasses} placeholder="name@college.edu" />
              {view !== 'forgot' && <input required type="password" value={password} onChange={e => setPassword(e.target.value)} className={inputClasses} placeholder="Password" />}
              {view === 'signup' && (
                <div className="grid grid-cols-2 gap-4">
                  <button type="button" onClick={() => setRole('student')} className={`py-4 rounded-xl font-black ${role === 'student' ? 'bg-white text-black' : 'bg-white/5 text-gray-400'}`}>Student</button>
                  <button type="button" onClick={() => setRole('admin')} className={`py-4 rounded-xl font-black ${role === 'admin' ? 'bg-white text-black' : 'bg-white/5 text-gray-400'}`}>Admin</button>
                </div>
              )}
              <button disabled={loading} className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl">
                {loading ? 'Processing...' : (view === 'login' ? 'Login' : 'Signup')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
