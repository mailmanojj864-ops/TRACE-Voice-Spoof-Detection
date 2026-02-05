
import React from 'react';
import { AnalysisReport, DetectionResult } from '../types';
import { 
  Activity,
  ShieldCheck,
  ClipboardList,
  Radar,
  PieChart as PieChartIcon,
  TrendingUp,
  Target,
  Zap,
  ShieldAlert,
  Info,
  Waves,
  Fingerprint
} from 'lucide-react';

interface ResultViewProps {
  report: AnalysisReport;
  onReset: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({ report, onReset }) => {
  const isBonafide = report.decision === DetectionResult.BONAFIDE;
  
  // Probabilities
  const humanPct = report.provenance.human_probability * 100;
  const synthPct = report.provenance.synthetic_probability * 100;
  
  // SVG Donut properties
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const humanOffset = circumference - (humanPct / 100) * circumference;
  const synthOffset = circumference - (synthPct / 100) * circumference;

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-20">
      
      {/* Top Status Header - Tactical HUD Style */}
      <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 p-10 bg-black/60 border border-white/10 rounded-[2.5rem] backdrop-blur-3xl shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#4aa3b8]/30 to-transparent" />
        
        <div className="flex flex-col gap-4 text-center md:text-left relative z-10">
          <div className="flex items-center justify-center md:justify-start gap-4">
            <div className={`p-4 rounded-2xl ${isBonafide ? 'bg-cyan-500/10 border-cyan-500/30' : 'bg-orange-500/10 border-orange-500/30'} border shadow-lg`}>
              {isBonafide ? <ShieldCheck className="w-10 h-10 text-cyan-400" /> : <ShieldAlert className="w-10 h-10 text-orange-500" />}
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500 mono mb-1">Final Verdict</p>
              <h2 className={`text-5xl font-black italic tracking-tighter uppercase ${isBonafide ? 'text-cyan-400' : 'text-orange-500'}`}>
                {report.decision}
              </h2>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center md:items-end gap-2 text-right relative z-10">
           <div className="flex items-center gap-3 bg-white/5 px-6 py-2 rounded-full border border-white/10">
              <Fingerprint className="w-4 h-4 text-slate-500" />
              <span className="text-[10px] font-black text-slate-300 mono uppercase tracking-widest">SIG_ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
           </div>
           <p className="text-[9px] text-slate-600 font-bold uppercase tracking-[0.3em] mono mt-2">Certified by AASIST Core V2.5.1</p>
        </div>
      </div>

      {/* Main Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Probability Chart - Donut HUD */}
        <div className="lg:col-span-5 bg-black/40 border border-white/5 rounded-[3rem] p-10 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-4 left-6 flex items-center gap-3">
             <PieChartIcon className="w-4 h-4 text-[#4aa3b8]" />
             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mono">Provenance Balance</span>
          </div>

          <div className="relative w-80 h-80 flex items-center justify-center mt-4">
            {/* Background Glows */}
            <div className={`absolute w-40 h-40 rounded-full blur-[80px] opacity-20 -z-10 ${isBonafide ? 'bg-cyan-500' : 'bg-orange-500'}`} />
            
            {/* SVG HUD Chart */}
            <svg className="w-full h-full transform -rotate-90">
              {/* Outer Decorative Ring */}
              <circle cx="50%" cy="50%" r="48" fill="transparent" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" className="transform scale-[3.2] origin-center" />
              
              {/* Base Ring */}
              <circle cx="50%" cy="50%" r={radius} fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="8" className="transform scale-[3.2] origin-center" />
              
              {/* Human Arc */}
              <circle
                cx="50%" cy="50%" r={radius}
                fill="transparent"
                stroke="#4aa3b8"
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={humanOffset}
                strokeLinecap="round"
                className="transform scale-[3.2] origin-center transition-all duration-[1.5s] ease-[cubic-bezier(0.23,1,0.32,1)]"
                style={{ filter: 'drop-shadow(0 0 12px rgba(74,163,184,0.5))' }}
              />

              {/* Synthetic Arc (Offset by human arc) */}
              <circle
                cx="50%" cy="50%" r={radius}
                fill="transparent"
                stroke="#ff7a18"
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={synthOffset}
                strokeLinecap="round"
                className="transform scale-[3.2] origin-center transition-all duration-[1.5s] ease-[cubic-bezier(0.23,1,0.32,1)]"
                style={{ 
                  transform: `scale(3.2) rotate(${(humanPct/100)*360}deg)`,
                  filter: 'drop-shadow(0 0 12px rgba(255,122,24,0.5))'
                }}
              />
            </svg>

            {/* Inner HUD Info */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mono mb-1">Authenticity</span>
                <span className="text-4xl font-black italic mono text-white tracking-tighter">
                  {humanPct.toFixed(0)}%
                </span>
              </div>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-10 w-full px-4">
             <div className="flex flex-col items-center gap-2 border-r border-white/5">
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(74,163,184,1)]" />
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mono">Human</span>
                </div>
                <span className="text-xl font-bold text-white mono">{humanPct.toFixed(1)}%</span>
             </div>
             <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(255,122,24,1)]" />
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mono">Synthetic</span>
                </div>
                <span className="text-xl font-bold text-white mono">{synthPct.toFixed(1)}%</span>
             </div>
          </div>
        </div>

        {/* Detailed Metrics Panel */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MetricCard 
              label="Confidence Level" 
              value={`${(report.scores.confidence * 100).toFixed(2)}%`}
              icon={<Target className="w-5 h-5 text-emerald-400" />}
              barColor="bg-emerald-400"
              progress={report.scores.confidence}
            />
            <MetricCard 
              label="Raw Authenticity" 
              value={report.scores.authenticity_score.toFixed(4)}
              icon={<TrendingUp className="w-5 h-5 text-cyan-400" />}
              barColor="bg-cyan-400"
              progress={report.scores.authenticity_score}
            />
          </div>

          {/* Forensic Summary Block */}
          <div className="flex-1 bg-black/40 border border-white/5 rounded-[2.5rem] p-10 flex flex-col gap-6 relative group overflow-hidden">
            <div className="absolute bottom-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
               <ShieldCheck className="w-32 h-32 text-white" />
            </div>
            <div className="flex items-center gap-4">
              <ClipboardList className="w-5 h-5 text-orange-500" />
              <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 mono">Forensic Analyst Summary</h3>
            </div>
            <p className="text-2xl text-slate-200 font-medium leading-relaxed italic tracking-tight">
              "{report.explanation.split('\n')[0].replace(/^[-\*\d\.]+\s*/, '') || report.summary}"
            </p>
            <div className="h-[1px] w-full bg-gradient-to-r from-white/10 via-transparent to-transparent" />
            <div className="flex items-center gap-3">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mono">Case evidence verified by team STRATAGEM</span>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Evidence Matrix */}
      <section className="space-y-8">
        <div className="flex items-center gap-4">
           <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-white/10" />
           <h3 className="text-[12px] font-black text-slate-500 uppercase tracking-[0.6em] mono">Technical Insight Matrix</h3>
           <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-white/10" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <EvidenceCard 
            title="Spectral Analysis" 
            items={report.technicalDetails.spectralAnomalies} 
            icon={<Waves className="w-5 h-5 text-cyan-400" />}
            color="border-cyan-500/20"
          />
          <EvidenceCard 
            title="Temporal Consistency" 
            items={report.technicalDetails.temporalInconsistencies} 
            icon={<Activity className="w-5 h-5 text-emerald-400" />}
            color="border-emerald-500/20"
          />
          <EvidenceCard 
            title="Synthetic Artifacts" 
            items={report.technicalDetails.syntheticArtifacts} 
            icon={<Zap className="w-5 h-5 text-orange-400" />}
            color="border-orange-500/20"
          />
        </div>
      </section>

      {/* Report Footer / Actions */}
      <div className="pt-12 flex flex-col items-center gap-8 border-t border-white/5">
        <button 
          onClick={onReset}
          className="group relative flex items-center gap-8 px-20 py-8 bg-black border border-white/10 hover:border-orange-500/50 rounded-2xl text-slate-400 hover:text-white transition-all shadow-2xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-orange-600 opacity-0 group-hover:opacity-10 transition-opacity" />
          <div className="flex items-center gap-4">
             <Radar className="w-5 h-5 group-hover:animate-spin" />
             <span className="text-[12px] font-black uppercase tracking-[0.5em] mono italic">New Forensic Investigation</span>
          </div>
        </button>
        
        <div className="flex items-center gap-6 opacity-30">
          <div className="h-[1px] w-20 bg-white/50" />
          <p className="text-[9px] mono font-bold text-slate-400 uppercase tracking-[0.4em]">Proprietary Intelligence Asset of STRATAGEM</p>
          <div className="h-[1px] w-20 bg-white/50" />
        </div>
      </div>
    </div>
  );
};

const MetricCard: React.FC<{ label: string; value: string; icon: React.ReactNode; barColor: string; progress: number }> = ({ label, value, icon, barColor, progress }) => (
  <div className="bg-black/40 border border-white/5 p-8 rounded-[2rem] hover:bg-black/60 transition-all group">
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
         {icon}
         <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mono">{label}</span>
      </div>
      <span className="text-xl font-black text-white italic mono">{value}</span>
    </div>
    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
      <div 
        className={`${barColor} h-full transition-all duration-[2s] ease-out shadow-[0_0_10px_rgba(255,255,255,0.2)]`} 
        style={{ width: `${progress * 100}%` }} 
      />
    </div>
  </div>
);

const EvidenceCard: React.FC<{ title: string; items: string[]; icon: React.ReactNode; color: string }> = ({ title, items, icon, color }) => (
  <div className={`bg-black/30 border ${color} p-8 rounded-[2.5rem] space-y-6 group transition-all hover:-translate-y-2`}>
    <div className="flex items-center gap-4 border-b border-white/5 pb-4">
      <div className="p-2 bg-white/5 rounded-xl">{icon}</div>
      <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-slate-200">{title}</h4>
    </div>
    <div className="space-y-4">
      {items.length > 0 ? items.slice(0, 3).map((item, i) => (
        <div key={i} className="flex gap-4 items-start">
           <div className="w-1.5 h-1.5 rounded-full bg-orange-500/40 mt-1.5 shrink-0" />
           <p className="text-[11px] text-slate-500 leading-relaxed font-medium mono italic group-hover:text-slate-400">
             {item}
           </p>
        </div>
      )) : (
        <div className="flex items-center gap-3 text-slate-600 italic mono text-[10px]">
          <Info className="w-3 h-3" /> No specific artifacts detected
        </div>
      )}
    </div>
  </div>
);
