
import React, { useCallback, useState } from 'react';
import { Upload, FileAudio, X, FolderSearch, Fingerprint } from 'lucide-react';
import { FileData } from '../types';

interface UploaderProps {
  onFileSelect: (file: FileData | null) => void;
  isLoading: boolean;
}

export const Uploader: React.FC<UploaderProps> = ({ onFileSelect, isLoading }) => {
  const [selectedFile, setSelectedFile] = useState<FileData | null>(null);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.includes('audio')) {
        alert("CRITICAL ERROR: Invalid MIME type. Expected Audio Segment.");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = (event.target?.result as string).split(',')[1];
        const fileData: FileData = {
          name: file.name,
          size: file.size,
          type: file.type,
          base64: base64,
          previewUrl: URL.createObjectURL(file)
        };
        setSelectedFile(fileData);
        onFileSelect(fileData);
      };
      reader.readAsDataURL(file);
    }
  }, [onFileSelect]);

  const clearFile = () => {
    setSelectedFile(null);
    onFileSelect(null);
  };

  return (
    <div className="w-full">
      {!selectedFile ? (
        <label className={`
          relative flex flex-col items-center justify-center w-full h-80 
          bg-black/40 border-2 border-dashed rounded-3xl cursor-pointer
          transition-all duration-500 group overflow-hidden
          ${isLoading ? 'opacity-30 pointer-events-none' : 'border-[#4aa3b8]/20 hover:border-[#4aa3b8] hover:bg-[#4aa3b8]/5'}
        `}>
          {/* Animated Target Lines */}
          <div className="absolute top-0 left-1/2 w-[1px] h-full bg-[#4aa3b8]/10 group-hover:bg-[#4aa3b8]/30 transition-colors" />
          <div className="absolute left-0 top-1/2 h-[1px] w-full bg-[#4aa3b8]/10 group-hover:bg-[#4aa3b8]/30 transition-colors" />
          
          <div className="relative z-10 flex flex-col items-center justify-center px-10 text-center">
            <div className="mb-6 relative">
              <div className="p-6 bg-slate-900 rounded-2xl border border-white/5 group-hover:border-[#4aa3b8]/50 group-hover:shadow-[0_0_30px_rgba(74,163,184,0.2)] transition-all">
                <FolderSearch className="w-10 h-10 text-slate-500 group-hover:text-[#4aa3b8] transition-colors" />
              </div>
              <Fingerprint className="absolute -bottom-2 -right-2 w-6 h-6 text-orange-500/50 group-hover:text-orange-500 transition-colors" />
            </div>
            
            <p className="mb-2 text-xs text-slate-300 font-bold uppercase tracking-[0.2em] mono">
              Select <span className="text-[#4aa3b8]">Target File</span>
            </p>
            <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest mt-2 mono">
              Acceptable Formats: WAV // MP3 // FLAC
            </p>
          </div>
          <input type="file" className="hidden" accept="audio/*" onChange={handleFileChange} />
        </label>
      ) : (
        <div className="bg-black/60 border border-[#4aa3b8]/30 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-md relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#4aa3b8] opacity-50" />
          
          <div className="flex items-center gap-6">
            <div className="p-4 bg-[#4aa3b8]/10 rounded-2xl border border-[#4aa3b8]/20 group-hover:bg-[#4aa3b8]/20 transition-all">
              <FileAudio className="w-8 h-8 text-[#4aa3b8]" />
            </div>
            <div className="text-left">
              <p className="font-black text-white uppercase tracking-tight mb-1 mono text-lg">{selectedFile.name}</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mono flex items-center gap-3">
                <span>SIZE: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</span>
                <span className="w-1 h-1 bg-slate-700 rounded-full" />
                <span>MIME: {selectedFile.type.toUpperCase()}</span>
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-6 w-full md:w-auto">
            <div className="flex-1 md:w-48">
              <audio controls src={selectedFile.previewUrl} className="w-full h-8 opacity-40 hover:opacity-100 transition-all invert" />
            </div>
            <button 
              onClick={clearFile}
              className="p-3 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-500 rounded-xl border border-red-500/20 transition-all"
              title="Purge Selection"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
