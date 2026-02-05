import os
import base64
import json
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from google import genai
from google.genai import types

app = FastAPI(title="TRACE Forensic Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalysisRequest(BaseModel):
    audio: str
    mime: str

@app.get("/")
def home():
    return {"status": "online", "engine": "TRACE-AASIST-V2"}

@app.post("/analyze")
async def analyze_signal(request: AnalysisRequest):
    api_key = os.environ.get("API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="API_KEY not found in environment.")

    try:
        client = genai.Client(api_key=api_key)
        
        prompt = """
        Analyze this audio for synthetic speech artifacts (AASIST methodology).
        Return a valid JSON object with:
        decision (BONAFIDE/SPOOF),
        explanation (string),
        summary (string),
        scores { authenticity_score (0-1), confidence (0-1) },
        provenance { human_probability (0-1), synthetic_probability (0-1) },
        technicalDetails { spectralAnomalies (list), temporalInconsistencies (list), syntheticArtifacts (list) }
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
        
        # Parse text to ensure it's valid JSON before returning
        result_text = response.text
        if not result_text:
            raise ValueError("Empty response from AI engine")
            
        return json.loads(result_text)
        
    except Exception as e:
        print(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 8000)))