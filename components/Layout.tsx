
import React from 'react';
import { Info, Activity } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 md:p-8">
      <header className="w-full max-w-6xl flex flex-col items-center justify-center mb-16 mt-8">
        <div 
          className="text-center group cursor-pointer"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <h1 id="trace-title" className="text-6xl md:text-8xl font-black tracking-[0.2em] text-orange-500 mb-2 transition-all duration-700 hover:scale-105">
            TRACE
          </h1>
          <p className="text-slate-400 text-sm md:text-lg font-medium tracking-[0.1em] uppercase">
            Voice Authenticity & Synthetic Speech Detection
          </p>
        </div>
        
        <nav className="flex items-center gap-8 mt-10">
          <button 
            onClick={() => scrollTo('methodology-section')}
            className="flex items-center gap-2 text-slate-500 hover:text-orange-400 transition-colors text-xs font-bold uppercase tracking-widest outline-none"
          >
            <Activity className="w-4 h-4" />
            Methodology
          </button>
          <button 
            onClick={() => scrollTo('documentation-section')}
            className="flex items-center gap-2 text-slate-500 hover:text-orange-400 transition-colors text-xs font-bold uppercase tracking-widest outline-none"
          >
            <Info className="w-4 h-4" />
            Documentation
          </button>
        </nav>
      </header>

      <main className="w-full max-w-6xl">
        {children}
      </main>

      <footer className="mt-20 pt-12 text-slate-700 text-[10px] font-black uppercase tracking-[0.3em] text-center pb-8 border-t border-white/5 w-full max-w-4xl">
        &copy; 2024 TRACE Labs. Integrated Spectro-Temporal Graph Attention (AASIST)
      </footer>
    </div>
  );
};
