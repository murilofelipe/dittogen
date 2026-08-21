export interface CandidateName {
  value: string;
  normalized: string;
  score?: number;
  scores?: ScoreBreakdown;
  metadata?: CandidateMetadata;
}

export interface ScoreBreakdown {
  pronunciation: number;
  memorability: number;
  spelling: number;
  internationalization?: number;
  identity?: number;
  brandPotential?: number;
  visual?: number;
  verbPotential?: number;
  scalability?: number;
  originality?: number;
  [key: string]: number | undefined;
}

export interface CandidateMetadata {
  roots?: string[];
  suffixes?: string[];
  language?: string;
  isDictionaryWord?: boolean;
}
