
import os
import random
import time
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="TRACE Forensic API")

# Configure CORS
# In production, replace ["*"] with your specific frontend URL for tighter security
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalysisResponse(BaseModel):
    verdict: str
    spoof_probability: float
    human_probability: float
    confidence: float
    processing_time: float

@app.get("/")
async def health_check():
    """Health check endpoint for Render monitoring."""
    return {
        "status": "online",
        "engine": "TRACE_AASIST_V2",
        "timestamp": time.time()
    }

@app.post("/analyze", response_model=AnalysisResponse)
async def analyze_audio(file: UploadFile = File(...)):
    """
    Accepts an audio file and returns a forensic spoof detection report.
    """
    start_time = time.time()

    # Validate file type
    if not file.content_type.startswith("audio/"):
        raise HTTPException(status_code=400, detail="Invalid file type. Audio expected.")

    # Read file content (In a real ML app, you'd pass this to your model)
    # content = await file.read()
    
    # Simulate processing delay (ML inference time)
    time.sleep(1.5)

    # Mock Inference Logic
    # In a real scenario, this would be replaced by: model.predict(audio_data)
    spoof_prob = random.uniform(0, 1)
    human_prob = 1.0 - spoof_prob
    confidence = random.uniform(0.85, 0.99)
    
    verdict = "spoof" if spoof_prob > 0.5 else "bonafide"

    return AnalysisResponse(
        verdict=verdict,
        spoof_probability=round(spoof_prob, 4),
        human_probability=round(human_prob, 4),
        confidence=round(confidence, 4),
        processing_time=round(time.time() - start_time, 2)
    )

if __name__ == "__main__":
    import uvicorn
    # Render provides the PORT environment variable
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
