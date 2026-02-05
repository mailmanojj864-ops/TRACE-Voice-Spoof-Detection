
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisReport, DetectionResult } from "../types";

const API_KEY = process.env.API_KEY || "";

const TRACE_BACKEND_PROMPT = `
You are the TRACE (Voice Authenticity & Synthetic Speech Detection) forensic engine.
Your analysis is strictly based on the AASIST (Integrated Spectro-Temporal Graph Attention) model.

SYSTEM CONTEXT:
The underlying model utilizes:
- Raw audio input (16kHz).
- Sinc-convolutional layers (128 channels).
- Heterogeneous Graph Attention (HtrgGAT) with Spectral and Temporal nodes.
- Graph Attention Layers with [64, 32] dimensionality.
- Temperatures: [2.0, 2.0, 100.0, 100.0] for the final softmax output.

INPUT: An audio file (base64).

TASK:
1. Simulate an AASIST model forward pass.
2. Determine if the recording is BONAFIDE (Human) or SPOOF (Synthetic/Deepfake/Replay).
3. Provide forensic evidence including spectral anomalies (e.g., high-frequency vocoder artifacts), temporal inconsistencies (e.g., rigid cadence), and synthetic artifacts.

JSON OUTPUT FORMAT:
{
  "decision": "BONAFIDE" | "SPOOF",
  "explanation": "Brief forensic justification.",
  "summary": "Formal TRACE result summary string.",
  "scores": {
    "authenticity_score": 0.0-1.0,
    "confidence": 0.0-1.0
  },
  "provenance": {
    "human_probability": 0.0-1.0,
    "synthetic_probability": 0.0-1.0
  },
  "technicalDetails": {
    "spectralAnomalies": ["evidence 1", ...],
    "temporalInconsistencies": ["evidence 1", ...],
    "syntheticArtifacts": ["evidence 1", ...]
  }
}

Ensure the 'summary' field follows this template:
"TRACE RESULT\n\nDecision: [DECISION]\n\nAuthenticity Score: [SCORE]\nConfidence: [CONFIDENCE]\n\nHuman Probability: [PROB]%\nSynthetic Probability: [PROB]%"
`;

export const analyzeAudio = async (base64Data: string, mimeType: string): Promise<AnalysisReport> => {
  if (!API_KEY) throw new Error("API Key missing");

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data
            }
          },
          {
            text: TRACE_BACKEND_PROMPT
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            decision: { type: Type.STRING },
            explanation: { type: Type.STRING },
            summary: { type: Type.STRING },
            scores: {
              type: Type.OBJECT,
              properties: {
                authenticity_score: { type: Type.NUMBER },
                confidence: { type: Type.NUMBER }
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

    const parsed = JSON.parse(response.text);
    return {
      ...parsed,
      decision: parsed.decision.toUpperCase() === 'BONAFIDE' ? DetectionResult.BONAFIDE : DetectionResult.SPOOF
    };
  } catch (e: any) {
    console.error("Forensic analysis aborted:", e);
    throw new Error(`AASIST Pipeline Error: ${e.message}`);
  }
};
