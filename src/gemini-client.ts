import "dotenv/config";

import { GoogleGenAI } from "@google/genai";

export function getModel(): string {
  return process.env.GEMINI_MODEL || "gemini-2.5-flash";
}

export function getClient(): GoogleGenAI {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Defina GEMINI_API_KEY no arquivo .env antes de consultar o modelo.");
  }

  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
  });
}
