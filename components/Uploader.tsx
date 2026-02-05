
import React, { useCallback, useState } from 'react';
import { Upload, FileAudio, X, Mic } from 'lucide-react';
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
        alert("Please upload an audio file (.wav preferred)");
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
          flex flex-col items-center justify-center w-full h-64 
          border-2 border-dashed rounded-2xl cursor-pointer
          transition-all duration-300 group
          ${isLoading ? 'opacity-50 pointer-events-none' : 'border-slate-700 hover:border-blue-500 hover:bg-blue-500/5'}
        `}>
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <div className="p-4 bg-slate-800 rounded-full mb-4 group-hover:bg-blue-600 transition-colors">
              <Upload className="w-8 h-8 text-slate-400 group-hover:text-white" />
            </div>
            <p className="mb-2 text-sm text-slate-300">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-slate-500 mono">WAV, MP3, or FLAC (max 10MB)</p>
          </div>
          <input type="file" className="hidden" accept="audio/*" onChange={handleFileChange} />
        </label>
      ) : (
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600/20 rounded-xl">
              <FileAudio className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="font-medium text-slate-200">{selectedFile.name}</p>
              <p className="text-xs text-slate-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB • {selectedFile.type}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <audio controls src={selectedFile.previewUrl} className="h-10 opacity-70 hover:opacity-100 transition-opacity" />
            <button 
              onClick={clearFile}
              className="p-2 hover:bg-red-500/20 hover:text-red-400 text-slate-500 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
