import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { getClient, getModel } from "./gemini-client.js";
import { sessionsDir } from "./paths.js";
import { buildRelevantExcerpts } from "./retrieval.js";
import { slugify } from "./utils.js";
import type { PrivateSessionArtifact, PrivateSessionRequest } from "./types.js";

function buildQuery(request: PrivateSessionRequest): string {
  return [
    request.stage,
    request.area,
    request.learnerProfile,
    request.focus,
    request.objectives ?? "",
    request.constraints ?? "",
    "sessoes particulares perguntas de fase nivel de competencia sondagem matricula nivelamento evidencias situacao hipotetica multifacetada avaliacao pedagogica sem resposta direta"
  ]
    .filter(Boolean)
    .join(" ");
}

function buildPrompt(request: PrivateSessionRequest, excerpts: string): string {
  return `
Voce e um arquiteto pedagogico de uma plataforma de sessoes particulares.
Use somente os trechos fornecidos.

Objetivo:
- desenhar um kit de sessao particular que una BNCC e principios de vectorless RAG;
- criar perguntas de fase para identificar nivel de competencia;
- criar perguntas de sondagem para nivelamento na matricula;
- mostrar por que a estrategia de recuperacao sem vetores ajuda nessa experiencia.
- aplicar a filosofia de IA para entendimento publico: transformar textos de referencia em apoio claro, verificavel e socialmente util para estudantes, familias e comunidade.

Filosofia obrigatoria das perguntas:
- cada pergunta deve ser uma situacao hipotetica de sondagem;
- cada situacao deve ser multifacetada, exigindo observacao de repertorio, estrategia, justificativa, transferencia e autocorrecao;
- evite perguntas que permitam resposta direta, curta, decorada ou binaria;
- prefira casos, dilemas, escolhas com trade-off, interpretacao de erro, comparacao de caminhos e explicacao de criterio;
- as perguntas devem funcionar como estrategia de avaliacao pedagogica, nao como quiz factual.
- quando houver apoio de IA, ela deve explicar, organizar evidencias e sugerir caminhos, mas nao substituir julgamento humano, contexto local ou validacao docente.

Dados:
- titulo: ${request.title}
- etapa: ${request.stage}
- area: ${request.area}
- perfil do estudante: ${request.learnerProfile}
- foco da sessao: ${request.focus}
- objetivos adicionais: ${request.objectives ?? "nao informados"}
- restricoes: ${request.constraints ?? "nao informadas"}

Trechos de referencia:
${excerpts}

Entregue JSON valido com esta estrutura:
{
  "session_title": "string",
  "learner_fit_summary": "string",
  "question_philosophy": {
    "summary": "string",
    "design_principles": ["string"]
  },
  "vectorless_rag_strategy": {
    "why_it_fits": "string",
    "advantages": ["string"],
    "tradeoffs": ["string"]
  },
  "phase_questions": [
    {
      "level_band": "Inicial|Basico|Intermediario|Avancado",
      "goal": "string",
      "questions": ["string"],
      "signals_to_watch": ["string"]
    }
  ],
  "intake_questions": [
    {
      "question": "string",
      "why_it_matters": "string",
      "placement_signal": "string"
    }
  ],
  "evidence_and_routing": {
    "evidence_to_collect": ["string"],
    "how_to_route_next_session": ["string"]
  },
  "responsible_ai_public_use": {
    "purpose": "string",
    "how_ai_supports_understanding": ["string"],
    "human_verification": ["string"],
    "limits_and_cautions": ["string"]
  },
  "session_flow": [
    {
      "step": "string",
      "purpose": "string"
    }
  ]
}
`.trim();
}

function extractJsonBlock(input: string): string {
  const fenced = input.match(/```json\s*([\s\S]*?)```/i);
  if (fenced?.[1]) {
    return fenced[1].trim();
  }

  const start = input.indexOf("{");
  const end = input.lastIndexOf("}");
  if (start >= 0 && end > start) {
    return input.slice(start, end + 1);
  }

  throw new Error("O modelo nao retornou um JSON valido para o kit de sessao.");
}

function toBulletList(input: unknown): string {
  return Array.isArray(input) ? input.map((item) => `- ${String(item)}`).join("\n") : "";
}

function sessionToMarkdown(data: Record<string, unknown>): string {
  const philosophy = (data.question_philosophy ?? {}) as Record<string, unknown>;
  const strategy = (data.vectorless_rag_strategy ?? {}) as Record<string, unknown>;
  const routing = (data.evidence_and_routing ?? {}) as Record<string, unknown>;
  const responsibleAi = (data.responsible_ai_public_use ?? {}) as Record<string, unknown>;
  const phaseQuestions = Array.isArray(data.phase_questions)
    ? data.phase_questions
        .map((item) => {
          const entry = item as Record<string, unknown>;
          return [
            `### ${String(entry.level_band ?? "Faixa")}`,
            `Objetivo: ${String(entry.goal ?? "")}`,
            "",
            "Perguntas:",
            toBulletList(entry.questions),
            "",
            "Sinais de observacao:",
            toBulletList(entry.signals_to_watch)
          ].join("\n");
        })
        .join("\n\n")
    : "";

  const intakeQuestions = Array.isArray(data.intake_questions)
    ? data.intake_questions
        .map((item) => {
          const entry = item as Record<string, unknown>;
          return [
            `- Pergunta: ${String(entry.question ?? "")}`,
            `  Importancia: ${String(entry.why_it_matters ?? "")}`,
            `  Sinal de encaminhamento: ${String(entry.placement_signal ?? "")}`
          ].join("\n");
        })
        .join("\n")
    : "";

  const flow = Array.isArray(data.session_flow)
    ? data.session_flow
        .map((item) => {
          const entry = item as Record<string, unknown>;
          return `- ${String(entry.step ?? "")}: ${String(entry.purpose ?? "")}`;
        })
        .join("\n")
    : "";

  return `# ${String(data.session_title ?? "Kit de sessao particular")}

## Encaixe do estudante

${String(data.learner_fit_summary ?? "")}

## Filosofia das Perguntas

- Sintese: ${String(philosophy.summary ?? "")}
- Principios:
${toBulletList(philosophy.design_principles)}

## Estrategia de Vectorless RAG

- Por que encaixa: ${String(strategy.why_it_fits ?? "")}
- Vantagens:
${toBulletList(strategy.advantages)}
- Trade-offs:
${toBulletList(strategy.tradeoffs)}

## Perguntas de Fase

${phaseQuestions}

## Sondagem de Matricula

${intakeQuestions}

## Evidencias e Encaminhamento

Evidencias a coletar:
${toBulletList(routing.evidence_to_collect)}

Como decidir a proxima sessao:
${toBulletList(routing.how_to_route_next_session)}

## IA Para Bom Uso Publico

Proposito: ${String(responsibleAi.purpose ?? "")}

Como a IA apoia entendimento:
${toBulletList(responsibleAi.how_ai_supports_understanding)}

Verificacao humana:
${toBulletList(responsibleAi.human_verification)}

Limites e cuidados:
${toBulletList(responsibleAi.limits_and_cautions)}

## Fluxo de Sessao

${flow}
`;
}

export async function generatePrivateSessionKit(
  request: PrivateSessionRequest
): Promise<PrivateSessionArtifact> {
  await mkdir(sessionsDir, { recursive: true });

  const excerpts = await buildRelevantExcerpts(buildQuery(request), {
    limitPerSource: 5,
    maxExcerpts: 12
  });

  if (excerpts.length === 0) {
    throw new Error("Nenhum trecho relevante foi encontrado para o kit de sessao.");
  }

  const client = getClient();
  const response = await client.models.generateContent({
    model: getModel(),
    contents: buildPrompt(request, excerpts.join("\n\n---\n\n"))
  });

  const jsonText = extractJsonBlock(response.text || "");
  const parsed = JSON.parse(jsonText) as Record<string, unknown>;
  const slug = slugify(`${request.stage}-${request.area}-${request.focus}-${request.title}`);
  const markdownPath = path.join(sessionsDir, `${slug}.md`);
  const jsonPath = path.join(sessionsDir, `${slug}.json`);
  const sourcesPath = path.join(sessionsDir, `${slug}.sources.md`);
  const markdown = sessionToMarkdown(parsed);

  await writeFile(jsonPath, JSON.stringify(parsed, null, 2), "utf8");
  await writeFile(markdownPath, markdown, "utf8");
  await writeFile(sourcesPath, excerpts.join("\n\n---\n\n"), "utf8");

  return {
    slug,
    markdownPath,
    jsonPath,
    sourcesPath,
    content: markdown
  };
}
