import { readFile, writeFile } from "node:fs/promises";

import { PDFParse } from "pdf-parse";

import type { StoredDocument } from "./types.js";

function normalizeText(input: string): string {
  return input
    .replace(/\r/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

export async function extractText(document: StoredDocument, force = false): Promise<string> {
  if (document.kind === "localText") {
    return await readFile(document.textPath, "utf8");
  }

  if (!force) {
    try {
      return await readFile(document.textPath, "utf8");
    } catch {
      // segue para extrair do PDF
    }
  }

  const parser = new PDFParse({ data: await readFile(document.path) });
  const result = await parser.getText();
  await parser.destroy();

  const text = normalizeText(result.text);
  await writeFile(document.textPath, text, "utf8");
  return text;
}
