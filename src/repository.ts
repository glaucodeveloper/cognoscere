import { ensureDataDirs } from "./paths.js";
import { downloadDocument } from "./download.js";
import { extractText } from "./extract.js";
import { SOURCES } from "./sources.js";

export async function ingestAll(force = false) {
  await ensureDataDirs();

  const results: Array<{
    id: string;
    title: string;
    path: string;
    textPath: string;
    characters: number;
  }> = [];

  for (const source of SOURCES) {
    const stored = await downloadDocument(source, force);
    const text = await extractText(stored, force);

    results.push({
      id: stored.id,
      title: stored.title,
      path: stored.path,
      textPath: stored.textPath,
      characters: text.length
    });
  }

  return results;
}
