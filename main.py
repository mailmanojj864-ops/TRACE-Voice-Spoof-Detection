
import os
import base64
import json
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from google import genai
from google.genai import types

app = FastAPI(title="TRACE Forensic Engine")

# Security: Allow CORS
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

# API Routes must come BEFORE static files
@app.get("/api/health")
def health():
    return {"status": "online", "engine": "TRACE-AASIST-V2"}

@app.post("/api/analyze")
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
        
        result_text = response.text
        if not result_text:
            raise ValueError("Empty response from AI engine")
            
        return json.loads(result_text)
        
    except Exception as e:
        print(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Serve the React Frontend
# 1. Try to serve specific files from 'dist'
# 2. If path doesn't exist (like a React route), serve index.html
if os.path.exists("dist"):
    app.mount("/assets", StaticFiles(directory="dist/assets"), name="assets")
    
    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        # Prevent infinite loops on API calls
        if full_path.startswith("api/"):
            raise HTTPException(status_code=404)
            
        file_path = os.path.join("dist", full_path)
        if full_path != "" and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse("dist/index.html")
else:
    @app.get("/")
    def fallback():
        return {"status": "ready", "msg": "Frontend not built yet. Run 'npm run build'."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 8000)))
