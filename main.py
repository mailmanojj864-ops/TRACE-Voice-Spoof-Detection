
import os
import base64
import json
from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from google import genai
from google.genai import types

# Initialize FastAPI
app = FastAPI(title="TRACE Forensic Engine")

# CORS Configuration
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

# ----------------------------------------------------------------
# API ROUTES (Must be defined before static files)
# ----------------------------------------------------------------

@app.get("/api/health")
async def health():
    return {"status": "online", "engine": "TRACE-AASIST-V2", "version": "2.5.1"}

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
        
        if not response.text:
            raise ValueError("AI engine returned an empty response.")
            
        return json.loads(response.text)
        
    except Exception as e:
        print(f"Deployment Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# ----------------------------------------------------------------
# FRONTEND SERVING (The fix for your website not showing)
# ----------------------------------------------------------------

# Define absolute paths to the dist folder
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DIST_DIR = os.path.join(BASE_DIR, "dist")

if os.path.exists(DIST_DIR):
    # Mount the assets folder (JS/CSS)
    app.mount("/assets", StaticFiles(directory=os.path.join(DIST_DIR, "assets")), name="assets")

    @app.get("/")
    async def serve_index():
        return FileResponse(os.path.join(DIST_DIR, "index.html"))

    @app.get("/{rest_of_path:path}")
    async def serve_spa(rest_of_path: str):
        # If the file exists in dist, serve it (e.g. favicon.ico)
        file_path = os.path.join(DIST_DIR, rest_of_path)
        if os.path.isfile(file_path):
            return FileResponse(file_path)
        
        # Otherwise, if it's not an API call, serve index.html for React routing
        if not rest_of_path.startswith("api/"):
            return FileResponse(os.path.join(DIST_DIR, "index.html"))
        
        return JSONResponse(status_code=404, content={"detail": "Not Found"})
else:
    @app.get("/")
    async def welcome():
        return {
            "error": "Frontend build missing",
            "message": "The /dist folder was not found. Ensure 'npm run build' completed successfully.",
            "instructions": "Visit /api/health to check backend status."
        }

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
