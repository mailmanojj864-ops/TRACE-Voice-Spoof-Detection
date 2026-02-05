
import React, { useState, useEffect } from 'react';
import { Activity, Shield, Cpu, Terminal, Zap, Radar, Database } from 'lucide-react';

export const ProcessingView: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  const forensicLogs = [
    "INITIALIZING AASIST PIPELINE...",
    "ESTABLISHING SECURE BUFFER LINK...",
    "EXTRACTING MFCC SPECTRAL NODES...",
    "MAPPING TEMPORAL GRAPH EDGES...",
    "CALIBRATING HETEROGENEOUS ATTENTION...",
    "EXECUTING HtrgGAT KERNEL...",
    "COMPUTING SOFTMAX TEMPERATURE GRADIENTS...",
    "ANALYZING SPECTRAL ANOMALIES...",
    "CHECKING FOR VOCODER ARTIFACTS...",
    "VALIDATING SIGNAL PROVENANCE...",
    "GENERATING FORENSIC REPORT..."
  ];

  useEffect(() => {
    let currentLogIndex = 0;
    const logInterval = setInterval(() => {
      if (currentLogIndex < forensicLogs.length) {
        setLogs(prev => [...prev, forensicLogs[currentLogIndex]]);
        currentLogIndex++;
      }
    }, 400);

    const progressInterval = setInterval(() => {
      setProgress(prev => (prev < 99 ? prev + Math.random() * 2 : 99));
    }, 100);

    return () => {
      clearInterval(logInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-16 animate-in fade-in zoom-in duration-700">
      <div className="relative group">
        {/* Intense Central Spinner */}
        <div className="w-64 h-64 rounded-full border-4 border-[#4aa3b8]/10 flex items-center justify-center relative">
          <div className="absolute inset-0 rounded-full border-t-4 border-[#4aa3b8] animate-spin shadow-[0_0_30px_rgba(74,163,184,0.4)]" />
          <div className="absolute inset-4 rounded-full border-b-4 border-orange-500/30 animate-[spin_3s_linear_infinite_reverse]" />
          <div className="flex flex-col items-center gap-4">
             <Radar className="w-12 h-12 text-[#4aa3b8] animate-pulse" />
             <span className="text-3xl font-black mono text-white">{Math.floor(progress)}%</span>
          </div>
        </div>
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Terminal Logs */}
        <div className="bg-black/60 border border-white/5 rounded-3xl p-8 backdrop-blur-3xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#4aa3b8] to-transparent animate-pulse" />
          <div className="flex items-center gap-3 mb-6">
            <Terminal className="w-4 h-4 text-[#4aa3b8]" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mono">Execution Log // Node_X</span>
          </div>
          <div className="h-48 overflow-y-auto space-y-2 pr-4 scrollbar-hide">
            {logs.map((log, i) => (
              <div key={i} className="flex gap-4 animate-in slide-in-from-left duration-300">
                <span className="text-orange-500 font-bold mono text-[10px] opacity-40">[{Math.floor(Math.random()*9000)+1000}]</span>
                <span className="text-slate-300 mono text-[11px] font-bold uppercase tracking-tight">{log}</span>
              </div>
            ))}
            <div className="w-2 h-4 bg-[#4aa3b8] animate-pulse" />
          </div>
        </div>

        {/* System Vitals */}
        <div className="flex flex-col justify-center space-y-8">
           <div className="space-y-4">
              <div className="flex justify-between items-center px-2">
                 <span className="text-[10px] font-black text-[#4aa3b8] uppercase tracking-[0.3em] mono">AASIST Engine Load</span>
                 <span className="text-[10px] font-black text-slate-500 mono">{(progress * 0.85).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#4aa3b8] to-emerald-400" style={{ width: `${progress}%` }} />
              </div>
           </div>
           
           <div className="grid grid-cols-2 gap-4">
              <div className="p-6 bg-black/40 border border-white/5 rounded-2xl flex flex-col gap-2">
                 <Cpu className="w-4 h-4 text-orange-500" />
                 <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest mono">Entropy Map</span>
                 <span className="text-xl font-black text-white italic mono">LOCK</span>
              </div>
              <div className="p-6 bg-black/40 border border-white/5 rounded-2xl flex flex-col gap-2">
                 <Database className="w-4 h-4 text-emerald-500" />
                 <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest mono">Graph Pool</span>
                 <span className="text-xl font-black text-white italic mono">VIRT_S</span>
              </div>
           </div>
        </div>
      </div>

      <div className="flex flex-col items-center">
        <p className="text-[#4aa3b8] font-black tracking-[0.8em] uppercase text-[12px] animate-pulse italic">Crunched by Team STRATAGEM</p>
        <div className="mt-4 flex gap-2">
           {[...Array(8)].map((_, i) => (
             <div key={i} className="w-1.5 h-1.5 bg-[#4aa3b8]/20 rounded-full animate-ping" style={{ animationDelay: `${i * 0.2}s` }} />
           ))}
        </div>
      </div>
    </div>
  );
};
