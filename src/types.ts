export type SourceKind = "pdf" | "localText";

export type SourceDocument = {
  id: string;
  title: string;
  kind: SourceKind;
  filename: string;
  url?: string;
  description?: string;
  tags?: string[];
  sourceWeight?: number;
};

export type StoredDocument = SourceDocument & {
  path: string;
  textPath: string;
};

export type TextChunk = {
  documentId: string;
  documentTitle: string;
  chunkIndex: number;
  content: string;
  score: number;
  heading: string | undefined;
  matchedTerms: string[];
};

export type ProductionModuleRequest = {
  title: string;
  stage: string;
  area: string;
  theme: string;
  audience?: string;
  moduleType?: string;
  duration?: string;
};

export type ProductionModuleArtifact = {
  slug: string;
  markdownPath: string;
  jsonPath: string;
  sourcesPath: string;
  content: string;
};

export type PrivateSessionRequest = {
  title: string;
  stage: string;
  area: string;
  learnerProfile: string;
  focus: string;
  objectives?: string;
  constraints?: string;
};

export type PrivateSessionArtifact = {
  slug: string;
  markdownPath: string;
  jsonPath: string;
  sourcesPath: string;
  content: string;
};
