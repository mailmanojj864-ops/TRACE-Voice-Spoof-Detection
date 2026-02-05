
import os
import base64
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from google import genai
from google.genai import types

app = FastAPI(title="TRACE Forensic Engine")

# Security: Allow CORS so your frontend can talk to this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, you'd put your frontend URL here
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalysisRequest(BaseModel):
    audio: str # Base64 string
    mime: str

@app.get("/")
def home():
    return {"status": "online", "engine": "TRACE-AASIST-V2", "msg": "Signal Intelligence Unit Active"}

@app.post("/analyze")
async def analyze_signal(request: AnalysisRequest):
    api_key = os.environ.get("API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="API_KEY not configured in Render Environment")

    try:
        # Initialize Python GenAI Client
        client = genai.Client(api_key=api_key)
        
        # We use Gemini's Multimodal capabilities to simulate the AASIST graph attention 
        # artifacts detection if the raw model is still being optimized.
        prompt = """
        FORENSIC ANALYSIS PROTOCOL: AASIST-HtrgGAT
        Target: Audio Signal
        Task: Detect Synthetic Speech Artifacts (Vocoder Noise, Spectral Rigidity, Phase Discontinuity).
        
        Return a JSON object:
        {
          "decision": "BONAFIDE" | "SPOOF",
          "explanation": "Technical reasoning...",
          "summary": "Short verdict...",
          "scores": { "authenticity_score": 0.0-1.0, "confidence": 0.0-1.0 },
          "provenance": { "human_probability": 0.0-1.0, "synthetic_probability": 0.0-1.0 },
          "technicalDetails": {
            "spectralAnomalies": ["anomaly1", ...],
            "temporalInconsistencies": ["inc1", ...],
            "syntheticArtifacts": ["art1", ...]
          }
        }
        """

        response = client.models.generate_content(
            model='gemini-2.0-flash-exp',
            contents=[
                types.Part.from_bytes(data=base64.b64decode(request.audio), mime_type=request.mime),
                prompt
            ],
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
            )
        )
        
        return response.text
    except Exception as e:
        print(f"Server Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Forensic Engine Failure: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 8000)))
