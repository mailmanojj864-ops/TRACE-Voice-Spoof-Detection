
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Uploader } from './components/Uploader';
import { AudioRecorder } from './components/AudioRecorder';
import { ResultView } from './components/ResultView';
import { EducationalPanel } from './components/EducationalPanel';
import { CodeViewer } from './components/CodeViewer';
import { analyzeAudio } from './services/geminiService';
import { AnalysisReport, FileData } from './types';
import { Zap, AudioLines, FileUp, Mic2, Code2, ShieldAlert, Cpu } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'upload' | 'record' | 'code'>('upload');
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [systemUptime, setSystemUptime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setSystemUptime(prev => prev + 1), 1000);
    return () => clearInterval(interval);
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
    // Smooth scroll back to top of analysis lab
    document.getElementById('analysis-lab')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAnalyze = async () => {
    if (!fileData) return;
    setIsAnalyzing(true);
    setError(null);
    try {
      const result = await analyzeAudio(fileData.base64, fileData.type);
      setReport(result);
      // Smooth scroll to results
      setTimeout(() => {
        document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      setError(err.message || "Analysis failed. Please ensure the audio is clear.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col gap-12">
        {/* System Dashboard */}
        <div className="flex items-center justify-between px-6 py-3 bg-black/40 border border-white/5 rounded-2xl shadow-sm">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest">AASIST Core v1.0.4 Online</span>
            </div>
            <div className="h-4 w-[1px] bg-white/5" />
            <div className="flex items-center gap-2">
              <Cpu className="w-3 h-3 text-slate-600" />
              <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest">HtrgGAT Accelerated</span>
            </div>
          </div>
          <div className="text-[9px] font-black uppercase text-slate-700 tracking-widest mono hidden sm:block">
            STREAMS_ACTIVE: 01 // SESSION_TIME: {Math.floor(systemUptime / 60)}m {systemUptime % 60}s
          </div>
        </div>

        {/* Main Interface Section */}
        {!report && (
          <section id="analysis-lab" className="trace-panel rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden transition-all duration-500">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
              <AudioLines className="w-64 h-64 text-orange-500" />
            </div>
            
            <div className="relative z-10 max-w-2xl mx-auto text-center mb-10">
              <h2 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter italic">Forensic Inference Lab</h2>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-10">Select an input stream to begin deep spectral analysis</p>
              
              {/* Tab Navigation */}
              <div id="documentation-section" className="flex items-center justify-center p-1.5 bg-black rounded-2xl border border-white/5 mb-10 w-fit mx-auto shadow-inner">
                <TabButton 
                  active={activeTab === 'upload'} 
                  onClick={() => {setActiveTab('upload'); setReport(null);}} 
                  icon={<FileUp className="w-4 h-4" />} 
                  label="File Analysis" 
                />
                <TabButton 
                  active={activeTab === 'record'} 
                  onClick={() => {setActiveTab('record'); setReport(null);}} 
                  icon={<Mic2 className="w-4 h-4" />} 
                  label="Direct Sensor" 
                />
                <TabButton 
                  active={activeTab === 'code'} 
                  onClick={() => setActiveTab('code')} 
                  icon={<Code2 className="w-4 h-4" />} 
                  label="System Source" 
                />
              </div>
            </div>

            <div className="max-w-3xl mx-auto flex flex-col items-center gap-10">
              {activeTab === 'upload' && (
                <Uploader onFileSelect={handleFileSelect} isLoading={isAnalyzing} />
              )}
              
              {activeTab === 'record' && (
                <AudioRecorder onRecordingComplete={handleFileSelect} isLoading={isAnalyzing} />
              )}

              {activeTab === 'code' && (
                <CodeViewer />
              )}
              
              {activeTab !== 'code' && fileData && !report && !isAnalyzing && (
                <button 
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="group relative inline-flex items-center gap-6 px-16 py-8 bg-orange-600 hover:bg-orange-500 text-white rounded-3xl font-black transition-all hover:scale-105 active:scale-95 shadow-[0_0_50px_rgba(234,88,12,0.3)] disabled:opacity-50"
                >
                  <Zap className="w-7 h-7 fill-current" />
                  <span className="text-xl tracking-tighter italic uppercase">Initiate Trace Analysis</span>
                </button>
              )}

              {isAnalyzing && (
                <div className="flex flex-col items-center gap-8 py-16 animate-pulse">
                  <div className="relative">
                    <div className="w-24 h-24 border-8 border-orange-500/10 rounded-full" />
                    <div className="absolute inset-0 w-24 h-24 border-8 border-t-orange-500 rounded-full animate-spin" />
                    <div className="absolute inset-0 blur-2xl bg-orange-500/30 animate-pulse rounded-full" />
                  </div>
                  <div className="text-center space-y-3">
                    <p className="text-orange-400 font-black tracking-[0.4em] uppercase text-[10px] mb-2">Executing Spectro-Temporal Graph Attention</p>
                    <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest opacity-60">Status: Running Forward Pass...</p>
                  </div>
                </div>
              )}

              {error && (
                <div className="w-full p-8 bg-red-500/5 border border-red-500/20 rounded-3xl text-red-400 text-xs flex items-center gap-6 animate-in shake duration-500 shadow-lg">
                  <div className="p-3 bg-red-500/20 rounded-2xl shadow-inner">
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-black uppercase tracking-[0.2em] text-[10px] mb-2 opacity-80">Trace Inference Interrupted</p>
                    <p className="text-slate-400 leading-relaxed font-medium">{error}</p>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Results Section */}
        {report && (
          <section id="results" className="scroll-mt-12">
            <ResultView report={report} onReset={handleReset} />
          </section>
        )}

        {/* Educational Content */}
        <section id="methodology-section" className={`scroll-mt-12 ${report ? 'opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-700' : ''}`}>
          <EducationalPanel />
        </section>
      </div>
    </Layout>
  );
};

const TabButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`
      flex items-center gap-3 px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all
      ${active ? 'bg-orange-600 text-white shadow-[0_10px_20px_rgba(234,88,12,0.2)] scale-105' : 'text-slate-600 hover:text-slate-300'}
    `}
  >
    {icon}
    {label}
  </button>
);

export default App;
