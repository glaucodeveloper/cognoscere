import { createWriteStream } from "node:fs";
import { access } from "node:fs/promises";
import { pipeline } from "node:stream/promises";
import path from "node:path";

import { pdfDir, textDir } from "./paths.js";
import type { SourceDocument, StoredDocument } from "./types.js";

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function downloadDocument(source: SourceDocument, force = false): Promise<StoredDocument> {
  const isPdf = source.kind === "pdf";
  const targetPath = path.join(isPdf ? pdfDir : textDir, source.filename);
  const textPath = isPdf ? path.join(textDir, source.filename.replace(/\.pdf$/i, ".txt")) : targetPath;

  if (!force && (await fileExists(targetPath))) {
    return { ...source, path: targetPath, textPath };
  }

  if (source.kind === "localText") {
    if (!(await fileExists(targetPath))) {
      throw new Error(`Fonte local nao encontrada: ${source.title} (${targetPath})`);
    }

    return { ...source, path: targetPath, textPath };
  }

  if (!source.url) {
    throw new Error(`A fonte ${source.title} nao possui URL para download.`);
  }

  const response = await fetch(source.url, {
    headers: {
      "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
      accept: "application/pdf,text/html,application/xhtml+xml"
    }
  });
  if (!response.ok || !response.body) {
    throw new Error(`Falha ao baixar ${source.title}: ${response.status} ${response.statusText}`);
  }

  await pipeline(response.body, createWriteStream(targetPath));

  return { ...source, path: targetPath, textPath };
}
