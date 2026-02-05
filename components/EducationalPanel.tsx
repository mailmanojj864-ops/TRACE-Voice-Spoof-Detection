
import React from 'react';
import { 
  BookOpen, 
  Network, 
  Cpu, 
  Database, 
  Waves, 
  ShieldCheck, 
  Fingerprint, 
  Activity,
  Layers,
  ArrowRight,
  Boxes,
  Microscope
} from 'lucide-react';

export const EducationalPanel: React.FC = () => {
  return (
    <div className="space-y-32">
      {/* SECTION 1: ARCHITECTURAL METHODOLOGY */}
      <section id="methodology-section" className="scroll-mt-32">
        <div className="flex flex-col gap-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-600/20 rounded-lg">
                  <Network className="w-5 h-5 text-orange-500" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500 mono">Theoretical Framework</span>
              </div>
              <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase">AASIST Methodology</h2>
            </div>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mono max-w-xs text-right leading-relaxed">
              Integrated Spectro-Temporal Graph Attention Networks for Anti-Spoofing.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-7 space-y-12">
              <p className="text-xl text-slate-300 leading-relaxed font-medium italic border-l-4 border-orange-500/30 pl-8">
                The TRACE engine utilizes the <span className="text-white font-bold">AASIST</span> architecture, which treats raw audio signals as a heterogeneous graph. By modeling the relationships between spectral nodes and temporal edges, the system captures subtle artifacts that traditional CNNs overlook.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FeatureCard 
                  icon={<Waves className="w-6 h-6" />}
                  title="Sinc-Convolution"
                  desc="Processes raw waveforms using learnable band-pass filters, focusing the network on high-frequency vocoder artifacts common in neural TTS."
                  accent="text-cyan-400"
                />
                <FeatureCard 
                  icon={<Boxes className="w-6 h-6" />}
                  title="Graph Construction"
                  desc="Constructs a dual-graph where Spectral (S) and Temporal (T) nodes are interconnected via a heterogeneous connectivity matrix."
                  accent="text-orange-500"
                />
                <FeatureCard 
                  icon={<Layers className="w-6 h-6" />}
                  title="HtrgGAT Layers"
                  desc="Heterogeneous Graph Attention Layers compute dynamic weights for each node based on signal importance across domains."
                  accent="text-emerald-400"
                />
                <FeatureCard 
                  icon={<Database className="w-6 h-6" />}
                  title="Max-Graph Pooling"
                  desc="A custom pooling mechanism that identifies the 'peak signal' indicative of artificiality within the graph structure."
                  accent="text-indigo-400"
                />
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="bg-black/60 border border-white/10 rounded-[3rem] p-10 relative overflow-hidden h-full group">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                {/* Simulated Neural Graph Visual */}
                <div className="relative h-64 w-full mb-10 flex items-center justify-center">
                   <div className="absolute inset-0 border border-white/5 rounded-3xl bg-slate-950/50" />
                   <div className="relative z-10 w-full h-full p-6">
                      <svg className="w-full h-full" viewBox="0 0 400 200">
                        {/* Nodes */}
                        <circle cx="200" cy="100" r="40" className="fill-orange-500/10 stroke-orange-500 stroke-2 animate-pulse" />
                        <circle cx="100" cy="60" r="15" className="fill-cyan-500/10 stroke-cyan-500 stroke-1" />
                        <circle cx="300" cy="140" r="15" className="fill-cyan-500/10 stroke-cyan-500 stroke-1" />
                        <circle cx="120" cy="150" r="10" className="fill-slate-500/20 stroke-slate-500" />
                        <circle cx="280" cy="50" r="10" className="fill-slate-500/20 stroke-slate-500" />
                        
                        {/* Lines */}
                        <line x1="200" y1="100" x2="100" y2="60" className="stroke-orange-500/30 stroke-2" />
                        <line x1="200" y1="100" x2="300" y2="140" className="stroke-orange-500/30 stroke-2" />
                        <line x1="100" y1="60" x2="120" y2="150" className="stroke-cyan-500/20" />
                        <line x1="300" y1="140" x2="280" y2="50" className="stroke-cyan-500/20" />
                      </svg>
                   </div>
                   <div className="absolute bottom-4 right-6 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping" />
                      <span className="text-[8px] mono font-black text-slate-500 uppercase tracking-widest">HtrgGAT_Active</span>
                   </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 mono">Forensic Thresholds</h3>
                  <div className="space-y-4">
                    <ThresholdBar label="Mel-Sinc Bandwidth" value="128-ch" color="bg-cyan-500" />
                    <ThresholdBar label="Graph Density" value="0.74" color="bg-orange-500" />
                    <ThresholdBar label="Softmax Temp" value="100.0" color="bg-emerald-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: FORENSIC PROTOCOLS */}
      <section id="protocols-section" className="scroll-mt-32">
        <div className="bg-white/[0.02] border border-white/5 rounded-[4rem] p-12 md:p-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-20 opacity-[0.03] rotate-12">
            <ShieldCheck className="w-96 h-96 text-white" />
          </div>

          <div className="max-w-4xl space-y-16 relative z-10">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-[1px] w-12 bg-orange-500" />
                <span className="text-[11px] font-black uppercase tracking-[0.5em] text-orange-500 mono">Analysis Protocols</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase leading-none">
                Detection Strategies
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <ProtocolItem 
                title="Spectral Centroid Drift"
                desc="Artificial voices often exhibit static frequency centroids that don't shift with emotional prosody. AASIST detects these as 'rigid' nodes in the spectral graph."
                icon={<Activity className="w-5 h-5" />}
              />
              <ProtocolItem 
                title="Vocoder Micro-Anomalies"
                desc="High-frequency periodic noise is a signature of neural vocoders (like WaveNet or HiFi-GAN). These artifacts are amplified by Sinc-Conv layers."
                icon={<Fingerprint className="w-5 h-5" />}
              />
              <ProtocolItem 
                title="Phase Coupling Lack"
                desc="Human speech has complex phase-amplitude coupling. Synthetic speech often shows linear or disconnected phase relationships across frequency bands."
                icon={<Microscope className="w-5 h-5" />}
              />
              <ProtocolItem 
                title="Temporal Quantization"
                desc="The timing of deepfake speech is often strictly tied to a grid. The HtrgGAT Temporal branch detects these mathematical rhythmic patterns."
                icon={<Cpu className="w-5 h-5" />}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; desc: string; accent: string }> = ({ icon, title, desc, accent }) => (
  <div className="bg-black/20 border border-white/5 p-8 rounded-3xl hover:bg-black/40 transition-all group cursor-default">
    <div className={`mb-6 p-3 bg-white/5 rounded-2xl w-fit ${accent} group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <h4 className="text-lg font-black text-white mb-3 italic tracking-tight">{title}</h4>
    <p className="text-sm text-slate-500 font-medium leading-relaxed mono">{desc}</p>
  </div>
);

const ThresholdBar: React.FC<{ label: string; value: string; color: string }> = ({ label, value, color }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center px-1">
      <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mono">{label}</span>
      <span className="text-[10px] font-black text-white mono italic">{value}</span>
    </div>
    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
      <div className={`h-full ${color} w-2/3 animate-pulse`} />
    </div>
  </div>
);

const ProtocolItem: React.FC<{ title: string; desc: string; icon: React.ReactNode }> = ({ title, desc, icon }) => (
  <div className="space-y-4 group">
    <div className="flex items-center gap-4">
      <div className="p-2 bg-white/5 rounded-lg text-orange-500 group-hover:scale-125 transition-transform duration-500">
        {icon}
      </div>
      <h4 className="text-xl font-black text-slate-200 tracking-tight italic uppercase group-hover:text-white transition-colors">
        {title}
      </h4>
    </div>
    <p className="text-sm text-slate-500 font-medium leading-relaxed italic border-l border-white/10 pl-6 group-hover:border-orange-500/50 transition-colors">
      {desc}
    </p>
  </div>
);
