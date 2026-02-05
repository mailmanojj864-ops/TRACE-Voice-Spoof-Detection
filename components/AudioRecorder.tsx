
import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Volume2, Timer, AlertCircle, ShieldCheck, Settings } from 'lucide-react';
import { FileData } from '../types';

interface AudioRecorderProps {
  onRecordingComplete: (file: FileData | null) => void;
  isLoading: boolean;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({ onRecordingComplete, isLoading }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [permissionStatus, setPermissionStatus] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    // Attempt to check permission status if supported
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'microphone' as PermissionName })
        .then((result) => {
          setPermissionStatus(result.state as 'prompt' | 'granted' | 'denied');
          result.onchange = () => {
            setPermissionStatus(result.state as 'prompt' | 'granted' | 'denied');
          };
        })
        .catch((err) => {
          console.debug("Permission query not supported or failed:", err);
        });
    }
  }, []);

  const startRecording = async () => {
    setErrorMessage(null);
    
    // Check for Secure Context
    if (!window.isSecureContext) {
      setErrorMessage("Microphone access requires a secure context (HTTPS). Please ensure you are viewing this via a secure connection.");
      return;
    }

    // Check for MediaDevices API
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setErrorMessage("Your browser does not support audio recording. Please try a modern browser like Chrome, Firefox, or Safari.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      setPermissionStatus('granted');
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioCtx();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      analyser.fftSize = 256;
      
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      drawWaveform();

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = (reader.result as string).split(',')[1];
          onRecordingComplete({
            name: `trace-sample-${new Date().getTime()}.wav`,
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
      timerRef.current = window.setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error("Error accessing microphone:", err);
      cleanupStream();
      
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError' || err.message === 'Permission denied') {
        setPermissionStatus('denied');
        setErrorMessage("Microphone access was denied. To use TRACE sensors, please click the lock icon in your browser's address bar and enable Microphone permissions.");
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setErrorMessage("No microphone found. Please connect a recording device and try again.");
      } else {
        setErrorMessage(`Microphone error: ${err.message || 'The system could not initialize the audio stream.'}`);
      }
    }
  };

  const cleanupStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
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

  const drawWaveform = () => {
    if (!canvasRef.current || !analyserRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const renderFrame = () => {
      animationRef.current = requestAnimationFrame(renderFrame);
      analyserRef.current?.getByteFrequencyData(dataArray);

      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = (dataArray[i] / 255) * canvas.height;
        ctx.fillStyle = isRecording ? `rgb(249, 115, 22)` : `rgb(71, 85, 105)`;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
      }
    };
    renderFrame();
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      cleanupStream();
    };
  }, []);

  return (
    <div className="w-full bg-black/40 border border-white/5 rounded-3xl p-8 flex flex-col items-center gap-8">
      {errorMessage && (
        <div className="w-full p-5 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex items-start gap-4 text-orange-400 text-xs leading-relaxed animate-in fade-in zoom-in-95 duration-300">
          <div className="p-2 bg-orange-500/20 rounded-lg shrink-0">
            <AlertCircle className="w-4 h-4" />
          </div>
          <div className="space-y-2">
            <p className="font-bold uppercase tracking-widest text-[10px]">Permission Error Detected</p>
            <p className="text-slate-300">{errorMessage}</p>
            {permissionStatus === 'denied' && (
              <div className="flex items-center gap-2 mt-2 pt-2 border-t border-orange-500/10">
                <Settings className="w-3 h-3" />
                <span className="text-[9px] uppercase font-bold tracking-tighter">Check site settings in your address bar</span>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="relative w-full h-32 bg-black/80 rounded-2xl overflow-hidden border border-white/5 shadow-inner">
        <canvas ref={canvasRef} className="w-full h-full" width={800} height={128} />
        {!isRecording && !duration && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-700 text-[10px] uppercase font-black tracking-[0.2em] gap-3">
            <div className="p-3 bg-white/5 rounded-full animate-pulse">
               <Volume2 className="w-5 h-5 opacity-40" />
            </div>
            Sensor Array Offline
          </div>
        )}
      </div>

      <div className="flex flex-col items-center gap-8 w-full">
        <div className="flex items-center gap-12">
          {!isRecording ? (
            <button
              onClick={startRecording}
              disabled={isLoading}
              className="flex flex-col items-center gap-3 group transition-all active:scale-95 disabled:opacity-30"
            >
              <div className="p-8 bg-orange-600 rounded-full shadow-2xl shadow-orange-600/30 group-hover:bg-orange-500 transition-all border-8 border-black group-hover:border-white/10">
                <Mic className="w-10 h-10 text-white" />
              </div>
              <span className="text-[10px] font-black text-slate-500 group-hover:text-orange-500 uppercase tracking-[0.2em] transition-colors">Start TRACE Stream</span>
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="flex flex-col items-center gap-3 group transition-all active:scale-95"
            >
              <div className="p-8 bg-red-600 rounded-full shadow-2xl shadow-red-500/40 animate-pulse border-8 border-black">
                <Square className="w-10 h-10 text-white" />
              </div>
              <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em]">Capture Data Point</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-6 text-slate-500 w-full max-w-sm">
          <div className="flex-1 flex items-center gap-4 px-6 py-3 bg-black/60 rounded-2xl border border-white/5 shadow-inner">
            <Timer className="w-4 h-4 text-orange-500" />
            <span className="text-2xl font-black mono text-slate-200 tracking-tighter">
              {Math.floor(duration / 60).toString().padStart(2, '0')}:{(duration % 60).toString().padStart(2, '0')}
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            {isRecording && (
              <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span className="text-[9px] font-black text-red-500 uppercase tracking-widest">Recording</span>
              </div>
            )}
            {permissionStatus === 'granted' && !isRecording && (
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Linked</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
