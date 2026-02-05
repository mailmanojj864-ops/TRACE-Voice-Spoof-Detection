
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisReport, DetectionResult } from "../types";

/**
 * Analyzes audio for voice spoofing using the unified TRACE API.
 */
export const analyzeAudio = async (base64Data: string, mimeType: string): Promise<AnalysisReport> => {
  
  // Try the Internal API first (Same origin)
  try {
    const response = await fetch(`/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ audio: base64Data, mime: mimeType })
    });
    
    if (response.ok) {
      const result = await response.json();
      const report = typeof result === 'string' ? JSON.parse(result) : result;

      return {
        ...report,
        decision: report.decision.toUpperCase() === 'BONAFIDE' ? DetectionResult.BONAFIDE : DetectionResult.SPOOF
      };
    }
  } catch (e) {
    console.warn("Unified API call failed, checking fallback...", e);
  }

  // Final Fallback: Direct Browser-to-AI (requires process.env.API_KEY)
  if (!process.env.API_KEY) {
    throw new Error("TRACE Intelligence Link Failure: Unified API unreachable and Local API Key missing.");
  }

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
        systemInstruction: "You are a world-class forensic audio expert. Analyze audio inputs for synthetic artifacts typical of AI-generated speech. Return your findings in a structured JSON format.",
        responseMimeType: "application/json",
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
