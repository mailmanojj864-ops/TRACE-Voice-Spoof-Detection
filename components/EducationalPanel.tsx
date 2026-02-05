
import React from 'react';
import { BookOpen, Network, Mic2, ShieldCheck, Cpu, Database } from 'lucide-react';

export const EducationalPanel: React.FC = () => {
  return (
    <div className="mt-12 w-full grid grid-cols-1 md:grid-cols-2 gap-12 pt-12 border-t border-slate-800">
      <div>
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="w-6 h-6 text-blue-400" />
          <h2 className="text-2xl font-bold text-white uppercase tracking-tight">The AASIST Methodology</h2>
        </div>
        <p className="text-slate-400 leading-relaxed mb-8">
          This implementation specifically leverages the **Integrated Spectro-Temporal Graph Attention Network** framework. 
          Unlike traditional systems that view audio as simple 2D spectrograms, AASIST treats audio features as nodes in a high-dimensional graph.
        </p>
        
        <div className="space-y-6">
          <ConceptItem 
            icon={<Cpu className="w-5 h-5" />} 
            title="Sinc-based Convolution (CONV)"
            description="Processes raw audio waveforms using band-pass filters initialized on the Mel-scale. This allows the model to focus on frequency bands most critical for human speech perception."
          />
          <ConceptItem 
            icon={<Network className="w-5 h-5" />} 
            title="Heterogeneous GAT (HtrgGAT)"
            description="Integrates Spectral (S) and Temporal (T) domains. It uses 'master nodes' to summarize and exchange information between different feature graphs, ensuring global context is preserved."
          />
          <ConceptItem 
            icon={<Database className="w-5 h-5" />} 
            title="Attention-Based Graph Pooling"
            description="A GraphPool layer reduces dimensionality by selecting only the most informative nodes in the feature graph, discarding noise while retaining spoofing signatures."
          />
        </div>
      </div>

      <div className="bg-slate-900/50 rounded-[2rem] p-8 border border-slate-800 shadow-inner">
        <h3 className="text-xl font-bold text-white mb-8 border-b border-slate-800 pb-4">Forensic Detection Strategy</h3>
        <div className="space-y-8">
          <AttackType 
            name="Text-to-Speech (TTS)"
            desc="AASIST identifies specific 'frozen' spectral centroids and mathematical regularity in synthetic glottal pulses that occur during neural vocoding."
            severity="High"
          />
          <AttackType 
            name="Voice Conversion (VC)"
            desc="Detected via HtrgGAT by identifying phase mismatches between the source spectral envelope and the target temporal cadence."
            severity="Medium"
          />
          <AttackType 
            name="Replay & Deepfakes"
            desc="The model's Graph Attention mechanism identifies unnatural room impulse responses and acoustic echoes that are often layered on synthetic speech."
            severity="Critical"
          />
        </div>
        <div className="mt-10 p-6 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl flex items-center gap-5">
          <div className="p-3 bg-indigo-600 rounded-xl">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <p className="text-sm text-indigo-300 leading-snug font-medium italic">
            "By integrating both spectral and temporal attention, the model achieves state-of-the-art performance on the ASVspoof 2019 logical access dataset."
          </p>
        </div>
      </div>
    </div>
  );
};

const ConceptItem: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
  <div className="flex gap-4 group">
    <div className="p-3 h-fit bg-slate-800 rounded-xl text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 border border-slate-700">
      {icon}
    </div>
    <div>
      <h4 className="text-base font-bold text-slate-100 mb-1">{title}</h4>
      <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
    </div>
  </div>
);

const AttackType: React.FC<{ name: string; desc: string; severity: string }> = ({ name, desc, severity }) => (
  <div className="pl-6 border-l-2 border-slate-700 relative">
    <div className="absolute left-[-5px] top-0 w-2 h-2 rounded-full bg-slate-500" />
    <div className="flex items-center justify-between mb-2">
      <h4 className="text-base font-bold text-slate-200">{name}</h4>
      <span className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-widest ${
        severity === 'Critical' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 
        severity === 'High' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 
        'bg-sky-500/20 text-sky-400 border border-sky-500/30'
      }`}>
        {severity}
      </span>
    </div>
    <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
  </div>
);
