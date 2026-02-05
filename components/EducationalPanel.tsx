
import React from 'react';
import { BookOpen, Network, Mic2, ShieldCheck, Cpu, Database, Waves, Share2 } from 'lucide-react';

export const EducationalPanel: React.FC = () => {
  return (
    <div className="mt-12 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 pt-16 border-t border-white/5">
      <div className="space-y-10">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#4aa3b8]/10 rounded-xl border border-[#4aa3b8]/20">
              <BookOpen className="w-6 h-6 text-[#4aa3b8]" />
            </div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">The AASIST Methodology</h2>
          </div>
          <p className="text-slate-400 leading-relaxed text-lg font-medium italic opacity-80 pl-2 border-l-2 border-orange-500/20">
            This implementation specifically leverages the <span className="text-white font-bold">Integrated Spectro-Temporal Graph Attention Network</span> framework. 
            Unlike traditional systems, AASIST treats audio features as nodes in a high-dimensional graph.
          </p>
        </div>
        
        <div className="space-y-8">
          <ConceptItem 
            icon={<Cpu className="w-6 h-6" />} 
            title="Sinc-based Convolution (CONV)"
            description="Processes raw audio waveforms using band-pass filters initialized on the Mel-scale. This allows the model to focus on frequency bands most critical for human speech perception."
            color="text-orange-500"
            bgColor="bg-orange-500/10"
            borderColor="border-orange-500/20"
          />
          <ConceptItem 
            icon={<Network className="w-6 h-6" />} 
            title="Heterogeneous GAT (HtrgGAT)"
            description="Integrates Spectral (S) and Temporal (T) domains. It uses 'master nodes' to summarize information between different feature graphs, ensuring global context."
            color="text-cyan-400"
            bgColor="bg-cyan-400/10"
            borderColor="border-cyan-400/20"
          />
          <ConceptItem 
            icon={<Database className="w-6 h-6" />} 
            title="Attention-Based Graph Pooling"
            description="A GraphPool layer reduces dimensionality by selecting only the most informative nodes, discarding noise while retaining subtle spoofing signatures."
            color="text-emerald-400"
            bgColor="bg-emerald-400/10"
            borderColor="border-emerald-400/20"
          />
        </div>
      </div>

      <div className="bg-black/40 rounded-[3rem] p-10 border border-white/5 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-10 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
          <Share2 className="w-48 h-48 text-white" />
        </div>
        
        <div className="flex items-center justify-between mb-12 border-b border-white/5 pb-6">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.4em] mono">Forensic Detection Strategy</h3>
          <div className="flex gap-1">
             <div className="w-1 h-1 rounded-full bg-orange-500 animate-pulse" />
             <div className="w-1 h-1 rounded-full bg-orange-500 animate-pulse delay-75" />
             <div className="w-1 h-1 rounded-full bg-orange-500 animate-pulse delay-150" />
          </div>
        </div>

        <div className="space-y-10">
          <AttackType 
            name="Text-to-Speech (TTS)"
            desc="AASIST identifies specific 'frozen' spectral centroids and mathematical regularity in glottal pulses during neural vocoding."
            severity="High"
            accent="border-amber-500/40"
          />
          <AttackType 
            name="Voice Conversion (VC)"
            desc="Detected via HtrgGAT by identifying phase mismatches between source spectral envelopes and target temporal cadence."
            severity="Medium"
            accent="border-sky-500/40"
          />
          <AttackType 
            name="Replay & Deepfakes"
            desc="The model identifies unnatural room impulse responses and acoustic echoes layered on synthetic speech."
            severity="Critical"
            accent="border-rose-500/40"
          />
        </div>

        <div className="mt-12 p-8 bg-[#4aa3b8]/5 border border-[#4aa3b8]/20 rounded-3xl flex items-center gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#4aa3b8]/10 blur-3xl rounded-full" />
          <div className="p-4 bg-[#4aa3b8] rounded-2xl shadow-[0_0_20px_rgba(74,163,184,0.4)] relative z-10">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <p className="text-sm text-[#4aa3b8] leading-relaxed font-bold italic relative z-10">
            "By integrating spectral and temporal attention, the model achieves state-of-the-art performance on international ASVspoof benchmarks."
          </p>
        </div>
      </div>
    </div>
  );
};

const ConceptItem: React.FC<{ icon: React.ReactNode; title: string; description: string; color: string; bgColor: string; borderColor: string }> = ({ icon, title, description, color, bgColor, borderColor }) => (
  <div className="flex gap-6 group items-start">
    <div className={`p-4 h-fit ${bgColor} rounded-2xl ${color} transition-all duration-300 border ${borderColor} shadow-lg group-hover:scale-110`}>
      {icon}
    </div>
    <div className="space-y-1">
      <h4 className={`text-lg font-black italic tracking-tight text-white transition-colors group-hover:${color}`}>{title}</h4>
      <p className="text-sm text-slate-500 leading-relaxed font-medium mono">{description}</p>
    </div>
  </div>
);

const AttackType: React.FC<{ name: string; desc: string; severity: string; accent: string }> = ({ name, desc, severity, accent }) => (
  <div className={`pl-8 border-l-2 ${accent} relative group`}>
    <div className="absolute left-[-5px] top-0 w-2 h-2 rounded-full bg-white opacity-20 group-hover:opacity-100 group-hover:bg-orange-500 transition-all" />
    <div className="flex items-center justify-between mb-3">
      <h4 className="text-lg font-black text-slate-200 tracking-tight italic">{name}</h4>
      <span className={`text-[9px] px-3 py-1 rounded-lg font-black uppercase tracking-widest mono border ${
        severity === 'Critical' ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' : 
        severity === 'High' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 
        'bg-sky-500/10 text-sky-400 border-sky-500/30'
      }`}>
        {severity}
      </span>
    </div>
    <p className="text-sm text-slate-500 leading-relaxed font-medium mono italic">{desc}</p>
  </div>
);
