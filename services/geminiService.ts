
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisReport, DetectionResult } from "../types";

// Vite requires 'import.meta.env' to access environment variables defined in the build.
// Using type assertion to avoid "Property 'env' does not exist" error on ImportMeta.
const BACKEND_API_URL = (import.meta as any).env?.VITE_API_URL || "";

/**
 * Analyzes audio for voice spoofing using a custom backend or Gemini fallback.
 */
export const analyzeAudio = async (base64Data: string, mimeType: string): Promise<AnalysisReport> => {
  
  // CASE A: Custom FastAPI Backend (Production Mode)
  if (BACKEND_API_URL && BACKEND_API_URL !== "undefined") {
    try {
      const baseUrl = BACKEND_API_URL.startsWith('http') ? BACKEND_API_URL : `https://${BACKEND_API_URL}`;
      
      const response = await fetch(`${baseUrl}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audio: base64Data, mime: mimeType })
      });
      
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || "FastAPI Pipeline Error");
      }
      
      const result = await response.json();
      const report = typeof result === 'string' ? JSON.parse(result) : result;

      return {
        ...report,
        decision: report.decision.toUpperCase() === 'BONAFIDE' ? DetectionResult.BONAFIDE : DetectionResult.SPOOF
      };
    } catch (e) {
      console.warn("FastAPI backend unreachable, attempting Gemini fallback...", e);
    }
  }

  // CASE B: Direct Browser-to-AI (Local/Development Fallback)
  // Always initialize with process.env.API_KEY directly as per guidelines
  if (!process.env.API_KEY) {
    throw new Error("API Key missing in environment (process.env.API_KEY).");
  }

  // Initialize client directly before usage
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          { inlineData: { mimeType: mimeType, data: base64Data } },
          { text: "Analyze this audio segment for potential voice spoofing or synthetic generation artifacts. Provide detailed forensic insights." }
        ]
      },
      config: {
        systemInstruction: "You are a world-class forensic audio expert. Analyze audio inputs for synthetic artifacts, vocoder noise, and temporal inconsistencies typical of AI-generated speech. Return your findings in a structured JSON format.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            decision: { type: Type.STRING, description: "Final verdict: BONAFIDE or SPOOF" },
            explanation: { type: Type.STRING, description: "Detailed forensic reasoning" },
            summary: { type: Type.STRING, description: "Executive summary of the analysis" },
            scores: {
              type: Type.OBJECT,
              properties: {
                authenticity_score: { type: Type.NUMBER, description: "Score from 0 to 1 representing human-like qualities" },
                confidence: { type: Type.NUMBER, description: "Model confidence in the decision" }
              },
              required: ["authenticity_score", "confidence"]
            },
            provenance: {
              type: Type.OBJECT,
              properties: {
                human_probability: { type: Type.NUMBER },
                synthetic_probability: { type: Type.NUMBER }
              },
              required: ["human_probability", "synthetic_probability"]
            },
            technicalDetails: {
              type: Type.OBJECT,
              properties: {
                spectralAnomalies: { type: Type.ARRAY, items: { type: Type.STRING } },
                temporalInconsistencies: { type: Type.ARRAY, items: { type: Type.STRING } },
                syntheticArtifacts: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["spectralAnomalies", "temporalInconsistencies", "syntheticArtifacts"]
            }
          },
          required: ["decision", "explanation", "summary", "scores", "provenance", "technicalDetails"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Received empty response from Gemini API");
    
    const parsed = JSON.parse(text);
    return {
      ...parsed,
      decision: parsed.decision.toUpperCase() === 'BONAFIDE' ? DetectionResult.BONAFIDE : DetectionResult.SPOOF
    };
  } catch (e: any) {
    throw new Error(`Forensic Pipeline Error: ${e.message}`);
  }
};
