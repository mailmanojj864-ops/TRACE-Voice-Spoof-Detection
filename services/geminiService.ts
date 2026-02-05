
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisReport, DetectionResult } from "../types";

// When deployed on Render, VITE_API_URL will point to your FastAPI service
const BACKEND_API_URL = (import.meta as any).env?.VITE_API_URL || "";
const API_KEY = process.env.API_KEY || "";

/**
 * Strategy:
 * 1. If BACKEND_API_URL exists (Production), call your FastAPI AASIST model.
 * 2. Otherwise, fall back to the Gemini Forensic Engine simulation.
 */
export const analyzeAudio = async (base64Data: string, mimeType: string): Promise<AnalysisReport> => {
  
  // CASE A: Custom FastAPI Backend (Industry Standard)
  if (BACKEND_API_URL) {
    try {
      const response = await fetch(`${BACKEND_API_URL}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audio: base64Data, mime: mimeType })
      });
      if (!response.ok) throw new Error("FastAPI Backend Error");
      return await response.json();
    } catch (e) {
      console.warn("FastAPI failed, falling back to Gemini Simulation...");
    }
  }

  // CASE B: Direct Gemini Forensic Analysis (Fallback/Prototype)
  if (!API_KEY) throw new Error("API Key missing. Add it to Render Environment Variables.");

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const prompt = `
    Analyze this audio file for voice spoofing using simulated AASIST methodology.
    Determine if it is BONAFIDE or SPOOF. 
    Provide technical forensic details in JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { mimeType: mimeType, data: base64Data } },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        // The rest of your schema configuration remains the same as before...
      }
    });

    const parsed = JSON.parse(response.text);
    return {
      ...parsed,
      decision: parsed.decision.toUpperCase() === 'BONAFIDE' ? DetectionResult.BONAFIDE : DetectionResult.SPOOF
    };
  } catch (e: any) {
    throw new Error(`AASIST Pipeline Error: ${e.message}`);
  }
};
