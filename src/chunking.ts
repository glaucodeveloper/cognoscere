import type { SourceDocument, TextChunk } from "./types.js";

const STOPWORDS = new Set([
  "a",
  "ao",
  "aos",
  "as",
  "com",
  "como",
  "da",
  "das",
  "de",
  "do",
  "dos",
  "e",
  "em",
  "entre",
  "na",
  "nas",
  "no",
  "nos",
  "o",
  "os",
  "ou",
  "para",
  "por",
  "que",
  "se",
  "sem",
  "um",
  "uma",
  "the"
]);

type StructuredParagraph = {
  heading: string | undefined;
  content: string;
};

function withHeading<T extends { content: string }>(content: T["content"], heading: string | undefined): {
  heading: string | undefined;
  content: T["content"];
} {
  return { heading, content };
}

function isHeading(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed) {
    return false;
  }

  if (/^#{1,6}\s/.test(trimmed)) {
    return true;
  }

  if (trimmed.length <= 80 && /^[A-Z0-9\s:.-]+$/.test(trimmed)) {
    return true;
  }

  return /^\d+(\.\d+)*\s+/.test(trimmed);
}

function splitIntoParagraphs(text: string): StructuredParagraph[] {
  const lines = text.replace(/\r/g, "").split("\n");
  const paragraphs: StructuredParagraph[] = [];
  let currentHeading: string | undefined;
  let buffer: string[] = [];

  const flush = () => {
    const content = buffer.join("\n").trim();
    if (content) {
      paragraphs.push(withHeading(content, currentHeading));
    }
    buffer = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      flush();
      continue;
    }

    if (isHeading(line)) {
      flush();
      currentHeading = line.replace(/^#{1,6}\s*/, "").trim();
      continue;
    }

    buffer.push(line);
  }

  flush();
  return paragraphs;
}

function buildChunkBuffer(paragraphs: StructuredParagraph[], maxChars: number): StructuredParagraph[] {
  const chunks: StructuredParagraph[] = [];
  let current = "";
  let currentHeading: string | undefined;

  for (const paragraph of paragraphs) {
    const candidate = current ? `${current}\n\n${paragraph.content}` : paragraph.content;
    if (candidate.length <= maxChars) {
      current = candidate;
      currentHeading ??= paragraph.heading;
      continue;
    }

    if (current) {
      chunks.push(withHeading(current, currentHeading));
    }

    if (paragraph.content.length <= maxChars) {
      current = paragraph.content;
      currentHeading = paragraph.heading;
      continue;
    }

    for (let start = 0; start < paragraph.content.length; start += maxChars) {
      chunks.push({
        heading: paragraph.heading,
        content: paragraph.content.slice(start, start + maxChars)
      });
    }

    current = "";
    currentHeading = undefined;
  }

  if (current) {
    chunks.push(withHeading(current, currentHeading));
  }

  return chunks;
}

function tokenize(input: string): string[] {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length >= 3 && !STOPWORDS.has(token));
}

function bm25Score(termFrequency: number, docLength: number, averageDocLength: number, inverseDocumentFrequency: number): number {
  const k1 = 1.2;
  const b = 0.75;
  const normalization = 1 - b + b * (docLength / Math.max(averageDocLength, 1));
  return inverseDocumentFrequency * ((termFrequency * (k1 + 1)) / (termFrequency + k1 * normalization));
}

export function selectRelevantChunks(params: {
  question: string;
  source: SourceDocument;
  text: string;
  limit?: number;
}): TextChunk[] {
  const limit = params.limit ?? 6;
  const keywords = Array.from(new Set(tokenize(params.question)));
  const rawChunks = buildChunkBuffer(splitIntoParagraphs(params.text), 2400);
  const chunkTokens = rawChunks.map((chunk) => tokenize(chunk.content));
  const averageDocLength =
    chunkTokens.reduce((total, tokens) => total + tokens.length, 0) / Math.max(chunkTokens.length, 1);
  const documentFrequency = new Map<string, number>();

  for (const tokens of chunkTokens) {
    for (const token of new Set(tokens)) {
      documentFrequency.set(token, (documentFrequency.get(token) ?? 0) + 1);
    }
  }

  const metadataTokens = tokenize(
    [params.source.title, params.source.description ?? "", ...(params.source.tags ?? [])].join(" ")
  );

  return rawChunks
    .map((chunk, chunkIndex) => {
      const haystack = chunkTokens[chunkIndex] ?? [];
      const frequencies = new Map<string, number>();

      for (const token of haystack) {
        frequencies.set(token, (frequencies.get(token) ?? 0) + 1);
      }

      const matchedTerms = keywords.filter((keyword) => frequencies.has(keyword));
      const lexicalScore = keywords.reduce((total, keyword) => {
        const tf = frequencies.get(keyword) ?? 0;
        if (!tf) {
          return total;
        }

        const df = documentFrequency.get(keyword) ?? 0;
        const idf = Math.log(1 + (rawChunks.length - df + 0.5) / (df + 0.5));
        return total + bm25Score(tf, haystack.length, averageDocLength, idf);
      }, 0);

      const coverageScore = keywords.length > 0 ? matchedTerms.length / keywords.length : 0;
      const headingScore = chunk.heading && tokenize(chunk.heading).some((token) => keywords.includes(token)) ? 0.8 : 0;
      const metadataMatches = metadataTokens.filter((token) => keywords.includes(token)).length;
      const metadataScore = metadataMatches > 0 ? 0.35 * metadataMatches : 0;
      const exactPhraseScore =
        params.question.length >= 12 && chunk.content.toLowerCase().includes(params.question.toLowerCase()) ? 1.2 : 0;
      const score =
        (lexicalScore + coverageScore * 2 + headingScore + metadataScore + exactPhraseScore) *
        (params.source.sourceWeight ?? 1);

      return {
        documentId: params.source.id,
        documentTitle: params.source.title,
        chunkIndex,
        content: chunk.content,
        score,
        heading: chunk.heading,
        matchedTerms
      };
    })
    .filter((chunk) => chunk.score > 0 && chunk.matchedTerms.length > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
