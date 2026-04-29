import { getClient, getModel } from "./gemini-client.js";
import { SOURCES } from "./sources.js";
import { buildRelevantExcerpts } from "./retrieval.js";

function buildFallbackSource(documentId: string) {
  const source = SOURCES.find((item) => item.id === documentId);
  if (!source) {
    throw new Error(`Documento nao encontrado: ${documentId}`);
  }

  return source;
}

export async function askQuestion(question: string): Promise<string> {
  const excerpts = await buildRelevantExcerpts(question);

  if (excerpts.length === 0) {
    const source = buildFallbackSource(SOURCES[0]?.id ?? "");
    throw new Error(
      `Nenhum trecho relevante foi encontrado. Rode "npm run ingest" e tente uma pergunta mais especifica sobre "${source.title}".`
    );
  }

  const client = getClient();
  const response = await client.models.generateContent({
    model: getModel(),
    contents: `Voce responde apenas com base nos trechos fornecidos. Cite o nome da fonte e deixe claro quando a resposta nao estiver expressamente no texto.

Pergunta: ${question}

Trechos de referencia:

${excerpts.join("\n\n---\n\n")}`
  });

  return response.text?.trim() || "";
}
