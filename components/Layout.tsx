
import React, { useEffect, useState } from 'react';
import { Info, Activity, Shield, Fingerprint, Search, Database, Lock, Globe, Radio, Cpu, Wifi } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [timestamp, setTimestamp] = useState(new Date().toISOString());

  useEffect(() => {
    const timer = setInterval(() => setTimestamp(new Date().toISOString()), 100);
    return () => clearInterval(timer);
  }, []);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden selection:bg-cyan-500 selection:text-white">
      {/* Background Atmosphere Layers */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[15%] w-[600px] h-[600px] bg-[#4aa3b8]/10 blur-[140px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] bg-orange-600/5 blur-[120px] rounded-full animate-pulse" style={{ animationDuration: '6s' }} />
        
        <div className="absolute top-0 right-1/4 w-[1px] h-full bg-gradient-to-b from-transparent via-white/[0.03] to-transparent" />
        <div className="absolute top-0 left-1/4 w-[1px] h-full bg-gradient-to-b from-transparent via-white/[0.03] to-transparent" />
      </div>

      <div className="fixed bottom-8 right-8 z-[100] pointer-events-none watermark-seal hidden md:block">
        <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl px-5 py-3 flex items-center gap-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <div className="p-2 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl shadow-[0_0_15px_rgba(234,88,12,0.4)]">
                <Cpu className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col">
                <span className="text-[8px] mono font-black text-slate-500 uppercase tracking-[0.3em] leading-none mb-1">DESIGN_PHASE: STRATAGEM_ALPHA</span>
                <span className="text-[12px] mono font-black text-orange-500 uppercase tracking-[0.2em]">Team STRATAGEM</span>
            </div>
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center p-4 md:p-12">
        <header className="w-full max-w-6xl flex flex-col items-center justify-center mb-24 mt-8 flicker-ui">
          <div className="text-center group cursor-pointer relative" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border border-[#4aa3b8]/15 rounded-full scale-[1.5] -z-10 animate-[spin_30s_linear_infinite]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] border-t border-[#ff7a18]/10 rounded-full scale-[1.3] -z-10 animate-[spin_45s_linear_infinite_reverse]" />

            <div className="flex flex-col items-center gap-4">
              <div className="relative mb-2">
                <Shield className="w-14 h-14 text-orange-500 group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 w-14 h-14 text-orange-500 blur-2xl opacity-40 animate-pulse" />
              </div>
              <h1 id="trace-title" className="text-7xl md:text-[9rem] font-black tracking-[0.45em] text-[#ff7a18] transition-all duration-700 hover:scale-[1.02] italic drop-shadow-[0_0_60px_rgba(255,122,24,0.4)] leading-none">
                TRACE
              </h1>
            </div>
            
            <div className="flex flex-col items-center gap-4 mt-12">
              <div className="flex items-center justify-center gap-8">
                <div className="h-[1px] w-28 bg-gradient-to-r from-transparent via-[#4aa3b8]/80 to-transparent" />
                <p className="text-[#4aa3b8] text-[12px] md:text-sm font-black uppercase tracking-[1em] leading-relaxed mono drop-shadow-[0_0_15px_rgba(74,163,184,0.6)]">
                  SIGNAL INTELLIGENCE UNIT
                </p>
                <div className="h-[1px] w-28 bg-gradient-to-l from-transparent via-[#4aa3b8]/80 to-transparent" />
              </div>
              <div className="px-5 py-2 bg-black/40 backdrop-blur-xl border border-white/5 rounded-full mt-2 shadow-2xl">
                <div className="text-[10px] mono text-slate-400 font-bold uppercase tracking-[0.4em] flex items-center gap-4">
                  <span className="text-orange-500 animate-pulse">●</span>
                  NODE_AUTH: TR-9981 // {timestamp}
                </div>
              </div>
            </div>
          </div>
          
          <nav className="flex items-center gap-16 mt-20 bg-black/60 px-16 py-7 rounded-[2.5rem] border border-white/5 backdrop-blur-3xl shadow-[0_50px_100px_rgba(0,0,0,0.8)] relative group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            
            <NavButton 
                onClick={() => scrollTo('methodology-section')} 
                icon={<Database className="w-4 h-4" />} 
                label="Library" 
                color="hover:text-[#4aa3b8]"
            />
            <div className="w-[1px] h-8 bg-white/10" />
            <NavButton 
                onClick={() => scrollTo('protocols-section')} 
                icon={<Lock className="w-4 h-4" />} 
                label="Protocols" 
                color="hover:text-orange-500"
            />
            <div className="w-[1px] h-8 bg-white/10" />
            <NavButton 
                onClick={() => scrollTo('analysis-lab')} 
                icon={<Search className="w-4 h-4" />} 
                label="Analysis" 
                color="hover:text-emerald-500"
            />
          </nav>
        </header>

        <main className="w-full max-w-6xl relative z-20">
          {children}
        </main>

        <footer className="mt-64 pt-32 text-slate-500 text-[10px] font-black uppercase tracking-[0.7em] text-center pb-32 border-t border-white/10 w-full max-w-6xl mono">
          <div className="flex flex-col md:flex-row items-center justify-center gap-16 md:gap-32 mb-16">
            <div className="flex items-center gap-4 group cursor-help text-[#4aa3b8]/80 hover:text-[#4aa3b8] transition-colors">
                <Search className="w-4 h-4 group-hover:rotate-90 transition-transform duration-500" />
                <span className="font-black">SIG_CHECK: VERIFIED</span>
            </div>
            <div className="flex items-center gap-5 text-orange-500/90 group cursor-default">
                <div className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-ping" />
                <span className="font-black tracking-[0.2em] italic group-hover:text-orange-400 transition-colors">Made by Team STRATAGEM</span>
            </div>
            <div className="flex items-center gap-4 text-emerald-500/80 hover:text-emerald-400 transition-colors">
                <Wifi className="w-5 h-5 animate-pulse" />
                <span className="font-black tracking-widest">AASIST v2.5.1_NODE_ONLINE</span>
            </div>
          </div>
          <div className="mt-4 opacity-30 text-[9px] hover:opacity-100 transition-opacity">
            &copy; 2024 STRATAGEM FORENSICS // CLASSIFIED SIGNAL DATA // AES_GCM_256_STABLE // SHA_SUM_A93F2
          </div>
        </footer>
      </div>
    </div>
  );
};

const NavButton: React.FC<{ onClick: () => void; icon: React.ReactNode; label: string; color: string }> = ({ onClick, icon, label, color }) => (
    <button 
      onClick={onClick}
      className={`flex items-center gap-5 text-slate-400 transition-all text-[13px] font-black uppercase tracking-[0.5em] outline-none group/btn ${color} hover:scale-105 active:scale-95`}
    >
      <div className="transition-transform group-hover/btn:rotate-12 group-hover/btn:scale-125 duration-300">{icon}</div>
      {label}
    </button>
);
