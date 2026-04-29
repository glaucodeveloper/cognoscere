import { mkdir } from "node:fs/promises";
import path from "node:path";

const rootDir = process.cwd();

export const dataDir = path.join(rootDir, "data");
export const pdfDir = path.join(dataDir, "pdf");
export const textDir = path.join(dataDir, "text");
export const sessionsDir = path.join(dataDir, "sessions");
export const uiDir = path.join(dataDir, "ui");

export async function ensureDataDirs(): Promise<void> {
  await mkdir(pdfDir, { recursive: true });
  await mkdir(textDir, { recursive: true });
  await mkdir(sessionsDir, { recursive: true });
  await mkdir(uiDir, { recursive: true });
}
