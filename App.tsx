
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Uploader } from './components/Uploader';
import { AudioRecorder } from './components/AudioRecorder';
import { ResultView } from './components/ResultView';
import { ProcessingView } from './components/ProcessingView';
import { EducationalPanel } from './components/EducationalPanel';
import { CodeViewer } from './components/CodeViewer';
import { analyzeAudio } from './services/geminiService';
import { AnalysisReport, FileData } from './types';
import { Zap, FileUp, Mic2, Code2, ShieldAlert, Cpu, Activity, Crosshair, BarChart3, Radio } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'upload' | 'record' | 'code'>('upload');
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [systemUptime, setSystemUptime] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [randomVal, setRandomVal] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setSystemUptime(prev => prev + 1), 1000);
    const valInterval = setInterval(() => setRandomVal(Math.floor(Math.random() * 9999)), 500);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      clearInterval(interval);
      clearInterval(valInterval);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleFileSelect = (file: FileData | null) => {
    setFileData(file);
    setReport(null);
    setError(null);
  };

  const handleReset = () => {
    setReport(null);
    setFileData(null);
    setError(null);
    setIsAnalyzing(false);
    document.getElementById('analysis-lab')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAnalyze = async () => {
    if (!fileData) return;
    setIsAnalyzing(true);
    setError(null);
    setReport(null);
    
    document.getElementById('analysis-lab')?.scrollIntoView({ behavior: 'smooth' });

    try {
      const result = await analyzeAudio(fileData.base64, fileData.type);
      setTimeout(() => {
        setReport(result);
        setIsAnalyzing(false);
        setTimeout(() => {
            document.getElementById('analysis-lab')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }, 4000); 
    } catch (err: any) {
      setError(err.message || "Forensic Pipeline Error: Data corruption or timeout.");
      setIsAnalyzing(false);
    }
  };

  return (
    <Layout>
      <div 
        className="fixed w-64 h-64 border border-white/[0.02] rounded-full pointer-events-none z-[50] hidden md:block"
        style={{ 
          left: mousePos.x, 
          top: mousePos.y, 
          transform: 'translate(-50%, -50%)',
          transition: 'transform 0.15s cubic-bezier(0.23, 1, 0.32, 1)'
        }}
      >
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#4aa3b8]/20 to-transparent" />
        <div className="absolute left-1/2 top-0 h-full w-[1px] bg-gradient-to-b from-transparent via-[#4aa3b8]/20 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
            <Crosshair className="w-5 h-5 text-[#4aa3b8]/40" />
            <div className="absolute w-20 h-20 border border-orange-500/10 rounded-sm rotate-45" />
        </div>
      </div>

      <div className="flex flex-col gap-10 md:gap-16 relative z-20">
        
        {/* System Vital Dashboard */}
        <div className="flex flex-col md:flex-row items-stretch justify-between bg-black/80 border border-white/10 rounded-[2rem] backdrop-blur-3xl shadow-[0_0_80px_rgba(0,0,0,0.9)] overflow-hidden">
          <div className="flex flex-col md:flex-row items-center">
             <div className="px-10 py-8 border-b md:border-b-0 md:border-r border-white/10 flex items-center gap-6">
                <div className="relative">
                    <div className="w-4 h-4 rounded-full bg-emerald-500 animate-pulse" />
                    <div className="absolute inset-0 w-4 h-4 rounded-full bg-emerald-400 blur-md opacity-40 animate-ping" />
                </div>
                <div className="flex flex-col">
                    <span className="text-[12px] font-black uppercase text-emerald-500 tracking-[0.3em] mono italic">BIO_LINK: LIVE</span>
                    <span className="text-[8px] text-slate-500 mono font-black">ENCRYPTED_SIGNAL_STREAM</span>
                </div>
             </div>
             <div className="px-10 py-8 flex items-center gap-6 border-b md:border-b-0 md:border-r border-white/10 bg-white/[0.02]">
                <Cpu className="w-5 h-5 text-orange-500" />
                <div className="flex flex-col">
                    <span className="text-[12px] font-black uppercase text-slate-200 tracking-[0.3em] mono italic">ENGINE: AASIST_CORE</span>
                    <span className="text-[8px] text-slate-600 mono font-black">STRATAGEM_CORE</span>
                </div>
             </div>
          </div>
          
          <div className="flex flex-1 items-center justify-between px-10 py-8 bg-black/40">
             <div className="flex items-center gap-12">
                <div className="flex flex-col items-start">
                    <div className="flex items-center gap-2 mb-1">
                        <Activity className="w-4 h-4 text-[#4aa3b8]" />
                        <span className="text-[10px] font-black text-[#4aa3b8] uppercase tracking-widest mono">Kernel Load</span>
                    </div>
                    <div className="flex gap-1 h-1.5 w-32">
                        <div className="flex-1 bg-[#4aa3b8]" />
                        <div className="flex-1 bg-[#4aa3b8]" />
                        <div className="flex-1 bg-[#4aa3b8]/40" />
                    </div>
                </div>
                <div className="flex flex-col items-start">
                    <div className="flex items-center gap-2 mb-1">
                        <BarChart3 className="w-4 h-4 text-orange-500" />
                        <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest mono">Entropy</span>
                    </div>
                    <span className="text-[12px] font-black text-white mono italic">0.{randomVal}</span>
                </div>
             </div>

             <div className="hidden lg:flex flex-col items-end pl-12 border-l border-white/5">
                <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em] mb-1">Session Uptime</span>
                <span className="text-2xl font-black text-orange-500 italic mono tracking-tighter">
                    {Math.floor(systemUptime / 60).toString().padStart(2, '0')}:{(systemUptime % 60).toString().padStart(2, '0')}
                </span>
             </div>
          </div>
        </div>

        {/* Forensic Analysis Lab Section */}
        <section id="analysis-lab" className="forensic-panel rounded-[3rem] p-8 md:p-24 relative overflow-hidden transition-all duration-700 shadow-[0_0_120px_rgba(0,0,0,1)] group scroll-mt-24">
            {!isAnalyzing && !report && (
              <div className="relative z-10 max-w-4xl mx-auto animate-in fade-in slide-in-from-top-4 duration-700">
                <div className="text-center mb-20">
                  <div className="flex flex-col items-center gap-6 mb-12">
                    <div className="px-6 py-2 bg-white/5 border border-white/10 rounded-full flex items-center gap-3">
                      <Radio className="w-3 h-3 text-[#4aa3b8] animate-pulse" />
                      <span className="text-[11px] font-black text-[#4aa3b8] uppercase tracking-[0.5em] mono">Signal Intercept Laboratory</span>
                    </div>
                    <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter italic uppercase flex items-center justify-center gap-6 drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                      Analysis Hub
                    </h2>
                    <div className="h-1.5 w-32 bg-orange-600 shadow-[0_0_40px_rgba(234,88,12,0.6)] rounded-full" />
                  </div>
                  
                  <div className="flex flex-wrap items-center justify-center p-2 bg-black/90 rounded-[3rem] border border-white/10 mb-20 w-fit mx-auto shadow-2xl backdrop-blur-3xl overflow-hidden relative">
                    <TacticalTab 
                      active={activeTab === 'upload'} 
                      onClick={() => setActiveTab('upload')} 
                      icon={<FileUp className="w-4 h-4" />} 
                      label="Import Signal" 
                    />
                    <TacticalTab 
                      active={activeTab === 'record'} 
                      onClick={() => setActiveTab('record')} 
                      icon={<Mic2 className="w-4 h-4" />} 
                      label="Live Capture" 
                    />
                    <TacticalTab 
                      active={activeTab === 'code'} 
                      onClick={() => setActiveTab('code')} 
                      icon={<Code2 className="w-4 h-4" />} 
                      label="System Logic" 
                    />
                  </div>
                </div>

                <div className="flex flex-col items-center gap-20">
                  <div className="w-full">
                    {activeTab === 'upload' && <Uploader onFileSelect={handleFileSelect} isLoading={false} />}
                    {activeTab === 'record' && <AudioRecorder onRecordingComplete={handleFileSelect} isLoading={false} />}
                    {activeTab === 'code' && <CodeViewer />}
                  </div>
                  
                  {activeTab !== 'code' && fileData && (
                    <button 
                      onClick={handleAnalyze}
                      className="group relative flex items-center gap-12 px-24 py-12 bg-black border-2 border-orange-500/50 hover:border-orange-500 text-orange-500 hover:text-white hover:bg-orange-600 rounded-2xl font-black transition-all hover:scale-105 shadow-[0_20px_60px_rgba(234,88,12,0.2)] mono uppercase tracking-[0.4em] italic overflow-hidden"
                    >
                      <Zap className="w-8 h-8 animate-pulse text-orange-500 group-hover:text-white" />
                      <span className="text-2xl">Deploy TRACE Probe</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {isAnalyzing && !report && <ProcessingView />}

            {report && (
              <div className="relative z-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
                <ResultView report={report} onReset={handleReset} />
              </div>
            )}

            {error && !isAnalyzing && (
              <div className="relative z-20 w-full mt-10 p-12 bg-red-950/20 border-2 border-red-500/40 rounded-[2.5rem] text-red-400 flex items-center gap-10">
                <ShieldAlert className="w-10 h-10 text-red-500 animate-pulse" />
                <p className="text-slate-400 leading-relaxed font-medium mono text-sm">{error}</p>
              </div>
            )}
        </section>

        {/* Methodology Content Archive */}
        <section className={`mb-48 transition-all duration-1000 ${isAnalyzing ? 'opacity-20 grayscale pointer-events-none scale-95' : 'opacity-100'}`}>
          <div className="flex flex-col items-center mb-32 flicker-ui">
             <div className="px-6 py-2 bg-white/5 border border-white/10 rounded-full mb-6">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.8em] mono">Research.Intelligence.Archive</span>
             </div>
             <div className="h-[2px] w-40 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </div>
          <EducationalPanel />
        </section>
      </div>
    </Layout>
  );
};

const TacticalTab: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`
      flex items-center gap-6 px-12 py-6 text-[12px] font-black uppercase tracking-[0.4em] transition-all border-b-4 mono rounded-3xl
      ${active ? 'bg-orange-600/10 text-orange-500 border-orange-500 shadow-[0_0_50px_rgba(234,88,12,0.15)] italic' : 'text-slate-600 hover:text-slate-300 border-transparent'}
    `}
  >
    <div className={`${active ? 'animate-pulse' : ''}`}>{icon}</div>
    {label}
  </button>
);

export default App;
