
import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Volume2, Timer, AlertCircle, ShieldCheck, Activity, Radio } from 'lucide-react';
import { FileData } from '../types';

interface AudioRecorderProps {
  onRecordingComplete: (file: FileData | null) => void;
  isLoading: boolean;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({ onRecordingComplete, isLoading }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startRecording = async () => {
    setErrorMessage(null);
    if (!navigator.mediaDevices?.getUserMedia) {
      setErrorMessage("I/O ERROR: No audio capture devices detected on local system.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioCtx();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      analyser.fftSize = 1024;
      
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      drawOscilloscope();

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = (reader.result as string).split(',')[1];
          onRecordingComplete({
            name: `TRACE_SIG_${Date.now()}.wav`,
            size: audioBlob.size,
            type: 'audio/wav',
            base64: base64,
            previewUrl: URL.createObjectURL(audioBlob)
          });
        };
        reader.readAsDataURL(audioBlob);
        cleanupStream();
      };

      mediaRecorder.start();
      setIsRecording(true);
      setDuration(0);
      timerRef.current = window.setInterval(() => setDuration(prev => prev + 1), 1000);
    } catch (err: any) {
      cleanupStream();
      setErrorMessage(`HARDWARE_LINK_FAIL: ${err.message}`);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    }
  };

  const cleanupStream = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    audioContextRef.current?.close();
  };

  const drawOscilloscope = () => {
    if (!canvasRef.current || !analyserRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const render = () => {
      animationRef.current = requestAnimationFrame(render);
      analyser.getByteTimeDomainData(dataArray);

      ctx.fillStyle = 'rgba(5, 5, 5, 0.5)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Grid
      ctx.strokeStyle = 'rgba(74, 163, 184, 0.05)';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 40) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += 40) {
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
      }

      ctx.lineWidth = 2;
      ctx.strokeStyle = isRecording ? '#ff7a18' : '#4aa3b8';
      ctx.beginPath();

      const sliceWidth = canvas.width * 1.0 / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = v * canvas.height / 2;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
        x += sliceWidth;
      }

      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();

      // Add glow
      ctx.shadowBlur = 15;
      ctx.shadowColor = isRecording ? 'rgba(255, 122, 24, 0.5)' : 'rgba(74, 163, 184, 0.5)';
    };
    render();
  };

  useEffect(() => () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    cleanupStream();
  }, []);

  return (
    <div className="w-full bg-black/60 border border-[#4aa3b8]/20 rounded-[2rem] p-8 md:p-12 flex flex-col items-center gap-10 backdrop-blur-lg">
      
      {errorMessage && (
        <div className="w-full p-4 bg-orange-950/20 border-l-4 border-orange-500 text-orange-400 text-[10px] font-bold uppercase tracking-widest mono flex items-center gap-4">
          <AlertCircle className="w-5 h-5" />
          {errorMessage}
        </div>
      )}

      {/* Scope Interface */}
      <div className="relative w-full h-48 bg-[#050505] rounded-2xl overflow-hidden border border-white/5 shadow-inner group">
        <div className="absolute top-4 left-6 flex items-center gap-3 z-20">
          <Activity className={`w-4 h-4 ${isRecording ? 'text-orange-500 animate-pulse' : 'text-[#4aa3b8]'}`} />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] mono text-slate-500">Signal Scope // CH_01</span>
        </div>
        
        <canvas ref={canvasRef} className="w-full h-full opacity-80" width={1000} height={200} />
        
        {!isRecording && duration === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-700 text-[10px] uppercase font-black tracking-[0.4em] gap-4">
            <Radio className="w-8 h-8 opacity-20" />
            Sensor Standby
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between w-full gap-8">
        <div className="flex items-center gap-12">
          {!isRecording ? (
            <button
              onClick={startRecording}
              disabled={isLoading}
              className="flex flex-col items-center gap-4 group disabled:opacity-30"
            >
              <div className="p-10 bg-black border-2 border-[#4aa3b8]/30 rounded-full shadow-[0_0_40px_rgba(74,163,184,0.1)] group-hover:border-[#4aa3b8] group-hover:shadow-[0_0_50px_rgba(74,163,184,0.2)] transition-all">
                <Mic className="w-12 h-12 text-[#4aa3b8]" />
              </div>
              <span className="text-[10px] font-black text-slate-500 group-hover:text-[#4aa3b8] uppercase tracking-[0.3em] mono transition-colors">Arm Sensor</span>
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="flex flex-col items-center gap-4 group"
            >
              <div className="p-10 bg-black border-2 border-orange-500 rounded-full shadow-[0_0_40px_rgba(255,122,24,0.2)] animate-pulse">
                <Square className="w-12 h-12 text-orange-500 fill-orange-500" />
              </div>
              <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.3em] mono">Disarm & Sync</span>
            </button>
          )}
        </div>

        <div className="flex flex-col gap-4 w-full md:w-auto">
          <div className="flex items-center gap-4 px-10 py-5 bg-black/80 rounded-2xl border border-white/5 shadow-inner">
            <Timer className="w-5 h-5 text-orange-500" />
            <span className="text-4xl font-black mono text-white tracking-tighter">
              {Math.floor(duration / 60).toString().padStart(2, '0')}:{ (duration % 60).toString().padStart(2, '0') }
            </span>
          </div>
          
          <div className="flex items-center justify-center gap-4">
            {isRecording && (
              <div className="flex items-center gap-3 px-6 py-2 bg-red-500/10 border border-red-500/20 rounded-full">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span className="text-[10px] font-black text-red-500 uppercase tracking-widest mono">Capturing...</span>
              </div>
            )}
            {!isRecording && (
              <div className="flex items-center gap-3 px-6 py-2 bg-[#4aa3b8]/10 border border-[#4aa3b8]/20 rounded-full">
                <ShieldCheck className="w-4 h-4 text-[#4aa3b8]" />
                <span className="text-[10px] font-black text-[#4aa3b8] uppercase tracking-widest mono">Linked</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
