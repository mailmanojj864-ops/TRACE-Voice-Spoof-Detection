
import React, { useState } from 'react';
import { Terminal, Copy, FileCode, PlayCircle, Cpu, Layout as LayoutIcon } from 'lucide-react';

const MODEL_CODE = `import random
from typing import Union
import numpy as np
import torch
import torch.nn as nn
import torch.nn.functional as F
from torch import Tensor

class GraphAttentionLayer(nn.Module):
    def __init__(self, in_dim, out_dim, **kwargs):
        super().__init__()
        # attention map
        self.att_proj = nn.Linear(in_dim, out_dim)
        self.att_weight = self._init_new_params(out_dim, 1)
        # project
        self.proj_with_att = nn.Linear(in_dim, out_dim)
        self.proj_without_att = nn.Linear(in_dim, out_dim)
        # ... (rest of implementation)`;

const GRADIO_UI_CODE = `import gradio as gr
import requests
import base64
import json

CUSTOM_CSS = """
body { background: radial-gradient(circle at top, #0f0f0f, #000000); }
#trace-title { font-size: 3rem; color: #f97316; }
"""

def analyze_voice(audio_path):
    with open(audio_path, "rb") as f:
        audio_bytes = f.read()
    payload = {"audio_base64": base64.b64encode(audio_bytes).decode("utf-8")}
    
    response = requests.post(BACKEND_URL, json=payload, timeout=20)
    data = response.json()
    
    return data.get("decision"), data.get("explanation"), data.get("provenance")

with gr.Blocks(css=CUSTOM_CSS, title="TRACE") as app:
    gr.HTML("<div id='trace-title'>TRACE</div>")
    audio = gr.Audio(type="filepath")
    btn = gr.Button("Run Trace Analysis")
    btn.click(fn=analyze_voice, inputs=audio, outputs=[...])`;

const MAIN_CODE = `import torch
import librosa
import numpy as np
import time

from AASIST import Model

d_args = {
    "architecture": "AASIST",
    "nb_samp": 64600,
    "first_conv": 128,
    "filts": [[1, 70], [70, 32], [32, 32], [32, 64], [64, 64]],
    "gat_dims": [64, 32],
    "pool_ratios": [0.5, 0.5, 0.5, 0.5],
    "temperatures": [2.0, 2.0, 100.0, 100.0]
}

model = Model(d_args).to(DEVICE)
model.eval()
state = torch.load(WEIGHTS_PATH, map_location=DEVICE)
model.load_state_dict(state)

wav = load_audio(AUDIO_PATH).to(DEVICE)

with torch.no_grad():
    out = model(wav)

prob = torch.softmax(out, dim=1)[0]
p_real = prob[0].item()
p_fake = prob[1].item()`;

export const CodeViewer: React.FC = () => {
  const [activeFile, setActiveFile] = useState<'model' | 'ui' | 'main'>('model');

  const copyToClipboard = () => {
    const codeMap = {
      model: MODEL_CODE,
      ui: GRADIO_UI_CODE,
      main: MAIN_CODE
    };
    navigator.clipboard.writeText(codeMap[activeFile]);
  };

  return (
    <div className="w-full bg-black/40 border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
      <div className="flex items-center justify-between px-6 py-4 bg-white/5 border-b border-white/5 flex-wrap gap-4">
        <div className="flex items-center gap-2 md:gap-4 overflow-x-auto pb-2 md:pb-0">
          <FileTab 
            active={activeFile === 'model'} 
            onClick={() => setActiveFile('model')} 
            icon={<FileCode className="w-4 h-4" />} 
            label="model.py" 
          />
          <FileTab 
            active={activeFile === 'ui'} 
            onClick={() => setActiveFile('ui')} 
            icon={<LayoutIcon className="w-4 h-4" />} 
            label="gradio_app.py" 
          />
          <FileTab 
            active={activeFile === 'main'} 
            onClick={() => setActiveFile('main')} 
            icon={<Cpu className="w-4 h-4" />} 
            label="inference.py" 
          />
        </div>
        <div className="flex items-center gap-3">
          <Terminal className="w-4 h-4 text-slate-600" />
          <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest hidden sm:inline">Research Source</span>
          <button 
            onClick={copyToClipboard}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-500"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="p-8 overflow-x-auto max-h-[600px] scrollbar-thin scrollbar-thumb-white/10">
        <pre className="text-xs md:text-sm mono text-blue-300 leading-relaxed">
          <code>
            {activeFile === 'model' ? MODEL_CODE : activeFile === 'ui' ? GRADIO_UI_CODE : MAIN_CODE}
          </code>
        </pre>
      </div>
    </div>
  );
};

const FileTab: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${active ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20' : 'text-slate-500 hover:text-slate-300'}`}
  >
    {icon}
    {label}
  </button>
);
