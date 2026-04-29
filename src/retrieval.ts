import { readFile } from "node:fs/promises";
import path from "node:path";

import { textDir } from "./paths.js";
import { SOURCES } from "./sources.js";
import { selectRelevantChunks } from "./chunking.js";

type RetrievalOptions = {
  limitPerSource?: number;
  maxExcerpts?: number;
  minimumScore?: number;
};

export async function buildRelevantExcerpts(question: string, options: RetrievalOptions = {}): Promise<string[]> {
  const limitPerSource = options.limitPerSource ?? 4;
  const maxExcerpts = options.maxExcerpts ?? 12;
  const minimumScore = options.minimumScore ?? 0.5;
  const excerpts: Array<{ text: string; score: number }> = [];

  for (const source of SOURCES) {
    const textFilename = source.kind === "pdf" ? source.filename.replace(/\.pdf$/i, ".txt") : source.filename;
    const textPath = path.join(textDir, textFilename);
    const text = await readFile(textPath, "utf8");
    const chunks = selectRelevantChunks({
      question,
      source,
      text,
      limit: limitPerSource
    });

    for (const chunk of chunks) {
      if (chunk.score < minimumScore) {
        continue;
      }

      const heading = chunk.heading ? ` | Secao ${chunk.heading}` : "";
      const matchedTerms = chunk.matchedTerms.length ? ` | Termos ${chunk.matchedTerms.join(", ")}` : "";
      excerpts.push({
        score: chunk.score,
        text:
          `[Fonte: ${chunk.documentTitle}${heading} | Trecho ${chunk.chunkIndex + 1} | Score ${chunk.score.toFixed(2)}${matchedTerms}]\n` +
          chunk.content
      });
    }
  }

  return excerpts
    .sort((a, b) => b.score - a.score)
    .slice(0, maxExcerpts)
    .map((item) => item.text);
}
