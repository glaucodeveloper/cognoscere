import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { getClient, getModel } from "./gemini-client.js";
import { buildRelevantExcerpts } from "./retrieval.js";
import { slugify } from "./utils.js";
import type { ProductionModuleArtifact, ProductionModuleRequest } from "./types.js";

const modulesDir = path.join(process.cwd(), "data", "modules");

function buildSearchQuery(request: ProductionModuleRequest): string {
  return [
    request.stage,
    request.area,
    request.theme,
    request.audience ?? "",
    request.moduleType ?? "",
    request.duration ?? "",
    request.title,
    "competencias habilidades praticas avaliacao projeto producao"
  ]
    .filter(Boolean)
    .join(" ");
}

function buildPrompt(request: ProductionModuleRequest, excerpts: string): string {
  return `
Voce vai criar um modulo de producao educacional inspirado na filosofia do projeto Lumira:
- aprendizagem orientada por competencia;
- pratica antes da teoria abstrata;
- producao concreta;
- progressao por niveis;
- eventos, desafios, peer review e avaliacao assistida por IA.
- IA como mediadora de entendimento publico: transformar textos e evidencias em orientacao clara, verificavel e util para bom uso pela populacao.

Use somente os trechos da BNCC fornecidos como base normativa.
Se alguma parte nao estiver explicita na BNCC, deixe isso claro sem inventar codigo de habilidade.
Ao propor uso de IA, explicite limites, criterios de verificacao humana, rastreabilidade das fontes e cuidados para evitar dependencia, desinformacao ou exclusao.

Dados do modulo:
- titulo: ${request.title}
- etapa: ${request.stage}
- area/componente: ${request.area}
- tema: ${request.theme}
- publico: ${request.audience ?? "nao informado"}
- tipo de modulo: ${request.moduleType ?? "modulo de producao"}
- duracao sugerida: ${request.duration ?? "nao informada"}

Trechos da BNCC:
${excerpts}

Entregue a resposta em JSON valido com esta estrutura:
{
  "module_title": "string",
  "stage": "string",
  "area": "string",
  "theme": "string",
  "module_type": "string",
  "duration": "string",
  "bncc_alignment": [
    {
      "source_document": "string",
      "skill_or_axis": "string",
      "justification": "string"
    }
  ],
  "competency_focus": [
    "string"
  ],
  "competency_pipeline": [
    {
      "competency_name": "string",
      "competency_purpose": "string",
      "bncc_connection": "string",
      "levels": [
        {
          "level": "Novato|Capacidade intuitiva|Capacidade plena|Ja aprendeu na escola|Dominante",
          "student_readiness": "string",
          "challenge_scope": "string",
          "expected_evidence": "string"
        }
      ]
    }
  ],
  "production_challenge": {
    "driving_question": "string",
    "final_deliverable": "string",
    "real_world_context": "string"
  },
  "lumira_progression": [
    {
      "level": "Novato|Capacidade intuitiva|Capacidade plena|Ja aprendeu na escola|Dominante",
      "expected_behavior": "string"
    }
  ],
  "assessment": {
    "peer_review": ["string"],
    "ai_support": ["string"],
    "teacher_observation": ["string"]
  },
  "responsible_ai_public_use": {
    "purpose": "string",
    "population_benefit": ["string"],
    "human_verification": ["string"],
    "limits_and_cautions": ["string"]
  },
  "module_outputs": [
    "string"
  ],
  "implementation_notes": [
    "string"
  ]
}
`.trim();
}

function excerptsToMarkdown(request: ProductionModuleRequest, excerpts: string[]): string {
  return `# Rastreamento BNCC

- Titulo: ${request.title}
- Etapa: ${request.stage}
- Area: ${request.area}
- Tema: ${request.theme}
- Publico: ${request.audience ?? "nao informado"}
- Tipo de modulo: ${request.moduleType ?? "modulo de producao"}
- Duracao: ${request.duration ?? "nao informada"}

## Trechos Selecionados

${excerpts.join("\n\n---\n\n")}
`;
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

  throw new Error("O modelo nao retornou um JSON valido para o modulo.");
}

function moduleToMarkdown(data: Record<string, unknown>): string {
  const alignment = Array.isArray(data.bncc_alignment)
    ? data.bncc_alignment
        .map((item) => {
          const entry = item as Record<string, string>;
          return [
            `- Fonte: ${entry.source_document ?? ""}`,
            `  Referencia: ${entry.skill_or_axis ?? ""}`,
            `  Justificativa: ${entry.justification ?? ""}`
          ].join("\n");
        })
        .join("\n")
    : "";

  const competencyFocus = Array.isArray(data.competency_focus)
    ? data.competency_focus.map((item) => `- ${String(item)}`).join("\n")
    : "";

  const competencyPipeline = Array.isArray(data.competency_pipeline)
    ? data.competency_pipeline
        .map((item) => {
          const entry = item as Record<string, unknown>;
          const levels = Array.isArray(entry.levels)
            ? entry.levels
                .map((levelItem) => {
                  const level = levelItem as Record<string, string>;
                  return [
                    `#### ${level.level ?? "Nivel"}`,
                    `Prontidao do estudante: ${level.student_readiness ?? ""}`,
                    `Escopo do desafio: ${level.challenge_scope ?? ""}`,
                    `Evidencia esperada: ${level.expected_evidence ?? ""}`
                  ].join("\n");
                })
                .join("\n\n")
            : "";

          return [
            `### ${String(entry.competency_name ?? "Competencia")}`,
            `Proposito: ${String(entry.competency_purpose ?? "")}`,
            `Conexao BNCC: ${String(entry.bncc_connection ?? "")}`,
            "",
            levels
          ].join("\n");
        })
        .join("\n\n")
    : "";

  const progression = Array.isArray(data.lumira_progression)
    ? data.lumira_progression
        .map((item) => {
          const entry = item as Record<string, string>;
          return `- ${entry.level ?? ""}: ${entry.expected_behavior ?? ""}`;
        })
        .join("\n")
    : "";

  const assessment = (data.assessment ?? {}) as Record<string, unknown>;
  const peerReview = Array.isArray(assessment.peer_review)
    ? assessment.peer_review.map((item) => `- ${String(item)}`).join("\n")
    : "";
  const aiSupport = Array.isArray(assessment.ai_support)
    ? assessment.ai_support.map((item) => `- ${String(item)}`).join("\n")
    : "";
  const teacherObservation = Array.isArray(assessment.teacher_observation)
    ? assessment.teacher_observation.map((item) => `- ${String(item)}`).join("\n")
    : "";

  const responsibleAi = (data.responsible_ai_public_use ?? {}) as Record<string, unknown>;
  const populationBenefit = Array.isArray(responsibleAi.population_benefit)
    ? responsibleAi.population_benefit.map((item) => `- ${String(item)}`).join("\n")
    : "";
  const humanVerification = Array.isArray(responsibleAi.human_verification)
    ? responsibleAi.human_verification.map((item) => `- ${String(item)}`).join("\n")
    : "";
  const limitsAndCautions = Array.isArray(responsibleAi.limits_and_cautions)
    ? responsibleAi.limits_and_cautions.map((item) => `- ${String(item)}`).join("\n")
    : "";

  const outputs = Array.isArray(data.module_outputs)
    ? data.module_outputs.map((item) => `- ${String(item)}`).join("\n")
    : "";

  const notes = Array.isArray(data.implementation_notes)
    ? data.implementation_notes.map((item) => `- ${String(item)}`).join("\n")
    : "";

  const challenge = (data.production_challenge ?? {}) as Record<string, string>;

  return `# ${String(data.module_title ?? "Modulo de producao")}

## Identificacao

- Etapa: ${String(data.stage ?? "")}
- Area: ${String(data.area ?? "")}
- Tema: ${String(data.theme ?? "")}
- Tipo de modulo: ${String(data.module_type ?? "")}
- Duracao: ${String(data.duration ?? "")}

## Alinhamento BNCC

${alignment}

## Foco de Competencia

${competencyFocus}

## Desafio de Producao

- Pergunta norteadora: ${challenge.driving_question ?? ""}
- Entrega final: ${challenge.final_deliverable ?? ""}
- Contexto real: ${challenge.real_world_context ?? ""}

## Pipeline de Competencias

${competencyPipeline}

## Progressao Lumira

${progression}

## Avaliacao

### Peer review
${peerReview}

### Apoio de IA
${aiSupport}

### Observacao docente
${teacherObservation}

## IA Para Bom Uso Publico

Proposito: ${String(responsibleAi.purpose ?? "")}

Beneficio para a populacao:
${populationBenefit}

Verificacao humana:
${humanVerification}

Limites e cuidados:
${limitsAndCautions}

## Produtos do Modulo

${outputs}

## Notas de Implementacao

${notes}
`;
}

export async function generateProductionModule(
  request: ProductionModuleRequest
): Promise<ProductionModuleArtifact> {
  await mkdir(modulesDir, { recursive: true });

  const query = buildSearchQuery(request);
  const excerpts = await buildRelevantExcerpts(query, {
    limitPerSource: 5,
    maxExcerpts: 14
  });

  if (excerpts.length === 0) {
    throw new Error("Nenhum trecho relevante da BNCC foi encontrado. Rode 'npm run ingest' e refine os parametros.");
  }

  const client = getClient();
  const response = await client.models.generateContent({
    model: getModel(),
    contents: `Voce e um designer curricular. Produza modulos praticos, objetivos e ancorados na BNCC, com forte orientacao a producao, evidencia e progressao por competencia.

Importante: neste projeto, as sessoes do pipeline sao competencias. Cada competencia deve operar por niveis, e os niveis devem explicitar progressao de prontidao, escopo de desafio e evidencia esperada.
Tambem e obrigatorio tratar a IA como apoio ao entendimento publico: ela deve ajudar estudantes e comunidade a compreender textos, reconhecer limites, checar fontes e aplicar conhecimento com responsabilidade social.

${buildPrompt(request, excerpts.join("\n\n---\n\n"))}`
  });

  const jsonText = extractJsonBlock(response.text || "");
  const parsed = JSON.parse(jsonText) as Record<string, unknown>;
  const slug = slugify(`${request.stage}-${request.area}-${request.theme}-${request.title}`);
  const markdownPath = path.join(modulesDir, `${slug}.md`);
  const jsonPath = path.join(modulesDir, `${slug}.json`);
  const sourcesPath = path.join(modulesDir, `${slug}.sources.md`);
  const markdown = moduleToMarkdown(parsed);
  const sourcesMarkdown = excerptsToMarkdown(request, excerpts);

  await writeFile(jsonPath, JSON.stringify(parsed, null, 2), "utf8");
  await writeFile(markdownPath, markdown, "utf8");
  await writeFile(sourcesPath, sourcesMarkdown, "utf8");

  return {
    slug,
    markdownPath,
    jsonPath,
    sourcesPath,
    content: markdown
  };
}
