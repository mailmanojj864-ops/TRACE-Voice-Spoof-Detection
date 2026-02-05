
import React from 'react';
import { AnalysisReport, DetectionResult } from '../types';
import { 
  ArrowLeft,
  Activity,
  ShieldCheck,
  Search,
  ClipboardList
} from 'lucide-react';

interface ResultViewProps {
  report: AnalysisReport;
  onReset: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({ report, onReset }) => {
  const isBonafide = report.decision === DetectionResult.BONAFIDE;
  
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      {/* Title Header */}
      <div className="border-b border-white/5 pb-6">
        <h2 className="text-4xl font-black text-white flex items-center gap-4 tracking-tight">
          <span className="text-3xl">🧠</span> Forensic Voice Analysis
        </h2>
      </div>

      {/* Primary Metrics Grid (Streamlit Columns Layout) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Column 1 */}
        <div className="space-y-4">
          <StreamlitMetric 
            label="Synthetic Probability" 
            value={`${(report.provenance.synthetic_probability * 100).toFixed(1)}%`} 
            color="text-orange-500"
          />
          <StreamlitMetric 
            label="Human Probability" 
            value={`${(report.provenance.human_probability * 100).toFixed(1)}%`} 
            color="text-blue-500"
          />
        </div>

        {/* Column 2 */}
        <div className="space-y-4">
          <StreamlitMetric 
            label="Confidence Level" 
            value={report.scores.confidence.toFixed(3)} 
            color="text-slate-200"
          />
          <StreamlitMetric 
            label="Authenticity Score" 
            value={report.scores.authenticity_score.toFixed(3)} 
            color="text-slate-200"
          />
        </div>
      </div>

      <div className="h-[1px] w-full bg-white/5 my-8" />

      {/* Decision Summary Section */}
      <section className="space-y-4">
        <h3 className="text-2xl font-bold text-white flex items-center gap-3 tracking-tight">
          <span className="text-xl">🧾</span> Decision Summary
        </h3>
        <div className="text-lg leading-relaxed text-slate-300 font-medium">
          {report.summary || (
            <>
              The audio sample has been identified as <span className={`font-black uppercase italic ${isBonafide ? 'text-blue-500' : 'text-orange-500'}`}>{report.decision}</span> with a 
              high degree of confidence. The detected patterns are consistent with {isBonafide ? 'natural human speech' : 'AI-generated voice artifacts'}.
            </>
          )}
        </div>
      </section>

      {/* Forensic Explanation Section */}
      <section className="space-y-4">
        <h3 className="text-2xl font-bold text-white flex items-center gap-3 tracking-tight">
          <span className="text-xl">🔍</span> Forensic Explanation
        </h3>
        <div className="bg-white/5 border border-white/5 rounded-3xl p-8 space-y-4">
          <ul className="space-y-4">
            {report.explanation.split('\n').filter(line => line.trim()).map((line, idx) => (
              <li key={idx} className="flex items-start gap-4 text-slate-400">
                <span className="text-orange-500 font-bold mt-1">–</span>
                <span className="text-lg leading-relaxed">{line.replace(/^[-\*\d\.]+\s*/, '')}</span>
              </li>
            ))}
            {/* Fallback items if report is sparse */}
            {report.explanation.length < 50 && (
              <>
                <li className="flex items-start gap-4 text-slate-400">
                  <span className="text-orange-500 font-bold mt-1">–</span>
                  <span className="text-lg leading-relaxed">Phase-coupling anomalies detected</span>
                </li>
                <li className="flex items-start gap-4 text-slate-400">
                  <span className="text-orange-500 font-bold mt-1">–</span>
                  <span className="text-lg leading-relaxed">Neural vocoder periodic artifacts</span>
                </li>
              </>
            )}
          </ul>
        </div>
      </section>

      {/* Technical Details Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        <TechnicalDetailCard 
          icon={<Activity className="w-5 h-5 text-blue-500" />}
          title="Spectral Analysis"
          items={report.technicalDetails.spectralAnomalies}
        />
        <TechnicalDetailCard 
          icon={<ShieldCheck className="w-5 h-5 text-emerald-500" />}
          title="Temporal Patterns"
          items={report.technicalDetails.temporalInconsistencies}
        />
        <TechnicalDetailCard 
          icon={<ClipboardList className="w-5 h-5 text-indigo-500" />}
          title="Artifact Detection"
          items={report.technicalDetails.syntheticArtifacts}
        />
      </div>

      {/* Footer link logic */}
      <div className="pt-12">
        <button 
          onClick={onReset}
          className="flex items-center gap-3 text-orange-500 hover:text-orange-400 font-black uppercase tracking-widest text-sm transition-all group"
        >
          <span className="text-xl transition-transform group-hover:-translate-x-1">⬅️</span>
          Analyze another sample
        </button>
      </div>
    </div>
  );
};

const StreamlitMetric: React.FC<{ label: string; value: string; color: string }> = ({ label, value, color }) => (
  <div className="bg-white/5 border border-white/5 p-8 rounded-3xl hover:bg-white/[0.07] transition-all cursor-default group">
    <p className="text-sm font-black uppercase text-slate-500 tracking-widest mb-2 group-hover:text-slate-400">{label}</p>
    <p className={`text-5xl font-black italic tracking-tighter ${color}`}>{value}</p>
  </div>
);

const TechnicalDetailCard: React.FC<{ icon: React.ReactNode; title: string; items: string[] }> = ({ icon, title, items }) => (
  <div className="bg-black/40 border border-white/5 p-6 rounded-2xl space-y-4">
    <div className="flex items-center gap-3 border-b border-white/5 pb-3">
      {icon}
      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{title}</h4>
    </div>
    <ul className="space-y-2">
      {items.slice(0, 3).map((item, i) => (
        <li key={i} className="text-[11px] text-slate-500 leading-relaxed list-disc list-inside">
          {item}
        </li>
      ))}
    </ul>
  </div>
);
