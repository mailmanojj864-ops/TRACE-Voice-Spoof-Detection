
export enum DetectionResult {
  BONAFIDE = 'BONAFIDE',
  SPOOF = 'SPOOF'
}

export interface AnalysisReport {
  decision: DetectionResult;
  explanation: string;
  summary: string;
  scores: {
    authenticity_score: number;
    confidence: number;
  };
  provenance: {
    human_probability: number;
    synthetic_probability: number;
  };
  technicalDetails: {
    spectralAnomalies: string[];
    temporalInconsistencies: string[];
    syntheticArtifacts: string[];
  };
}

export interface FileData {
  name: string;
  size: number;
  type: string;
  base64: string;
  previewUrl: string;
}
