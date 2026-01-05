
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Event } from '../types';

interface AIAssistantProps {
  events: Event[];
}

const AIAssistant: React.FC<AIAssistantProps> = ({ events }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const askAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || loading) return;

    const userMsg = query;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setQuery('');
    setLoading(true);

    try {
      // Corrected: Initializing GoogleGenAI using process.env.API_KEY directly as required by guidelines
      const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });
      // Corrected: Fixed syntax error in template literal (removed "มาร" and balanced parentheses/braces)
      const context = `You are a helpful campus assistant for the CampusConnect app. 
      The current available events are: ${JSON.stringify(events.map(e => ({ title: e.title, category: e.category, date: e.date, description: e.description })))}. 
      Based on this list, help the student find an event. Keep responses concise and exciting.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMsg,
        config: {
          systemInstruction: context,
        },
      });

      // Corrected: Accessing response.text as a property as per guidelines
      setMessages(prev => [...prev, { role: 'ai', text: response.text || "I couldn't process that. Try asking about a specific vibe!" }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: "The campus signal is weak. Try again in a bit!" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 z-[150] w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full shadow-2xl shadow-indigo-500/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all group"
      >
        <div className="absolute inset-0 rounded-full bg-indigo-400 animate-ping opacity-20 group-hover:opacity-40"></div>
        <svg className="w-8 h-8 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </button>

      {/* Chat Interface */}
      {isOpen && (
        <div className="fixed bottom-28 right-8 z-[150] w-[90vw] max-w-[400px] h-[500px] glass rounded-[2.5rem] border border-white/10 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 duration-300">
          <div className="p-6 bg-white/5 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest">Campus AI Guide</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-10">
                <p className="text-gray-400 text-sm font-medium">Ask me anything about the events!</p>
                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                  {['What\'s new?', 'Free events?', 'I love sports'].map(chip => (
                    <button 
                      key={chip} 
                      onClick={() => {setQuery(chip); }}
                      className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-gray-500 hover:text-white transition-colors"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm font-medium ${
                  msg.role === 'user' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-white/10 text-gray-200'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white/10 px-4 py-3 rounded-2xl flex gap-1">
                  <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={askAI} className="p-6 bg-white/5 border-t border-white/10">
            <div className="relative">
              <input 
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Ask your assistant..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-white pr-12"
              />
              <button disabled={loading} className="absolute right-2 top-2 p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors disabled:opacity-50">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" strokeWidth="3"/></svg>
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default AIAssistant;
