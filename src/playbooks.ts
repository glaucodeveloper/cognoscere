import { writeFile } from "node:fs/promises";
import path from "node:path";

import { YoutubeTranscript } from "youtube-transcript/dist/youtube-transcript.esm.js";

import { getClient, getModel } from "./gemini-client.js";
import { ensureDataDirs, textDir } from "./paths.js";

const VECTORLESS_VIDEO_URL = "https://www.youtube.com/watch?v=f3zHina9MTo";
const RAW_TRANSCRIPT_FILENAME = "vectorless-rag-video-f3zHina9MTo.raw-hi.txt";
const PLAYBOOK_FILENAME = "vectorless-rag-private-sessions-playbook.txt";

function buildTimestamp(offsetMs: number): string {
  const totalSeconds = Math.floor(offsetMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export async function refreshVectorlessPlaybook(): Promise<{ rawPath: string; playbookPath: string }> {
  await ensureDataDirs();

  const transcript = await YoutubeTranscript.fetchTranscript(VECTORLESS_VIDEO_URL);
  const rawPath = path.join(textDir, RAW_TRANSCRIPT_FILENAME);
  const playbookPath = path.join(textDir, PLAYBOOK_FILENAME);
  const rawTranscript = transcript.map((item) => `[${buildTimestamp(item.offset)}] ${item.text}`).join("\n");

  await writeFile(rawPath, rawTranscript, "utf8");

  const client = getClient();
  const response = await client.models.generateContent({
    model: getModel(),
    contents: `Voce vai receber a transcricao automatica de um video do YouTube sobre vectorless RAG.

Tarefa:
- reconstrua o conteudo em portugues do Brasil, de forma fiel e objetiva;
- explique o que muda em relacao ao RAG com vetores;
- detalhe vantagens, limites e trade-offs;
- foque na aplicacao em plataforma educacional com sessoes particulares;
- inclua orientacoes praticas para perguntas de fase (nivel de competencia) e sondagem de matricula;
- preserve qualquer inferencia explicitamente marcada como "Inferencia";
- escreva em markdown simples, com secoes curtas e texto pronto para virar base de conhecimento.

Video: ${VECTORLESS_VIDEO_URL}

Transcricao:
${transcript.map((item) => item.text).join(" ")}`.trim()
  });

  await writeFile(playbookPath, (response.text || "").trim(), "utf8");

  return { rawPath, playbookPath };
}
