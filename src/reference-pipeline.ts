import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

type GradeDef = {
  value: string;
  label: string;
  short: string;
  minAge: number;
  maxAge: number;
  stage: string;
};

type CategoryDef = {
  id: string;
  title: string;
  description: string;
};

type ScoredOption = {
  label: string;
  score: number;
  categoryWeights: Record<string, number>;
};

type LevelDef = {
  level: number;
  label: string;
  anchor: {
    title: string;
    prompt: string;
    passHint: string;
    categoryWeights: Record<string, number>;
  };
  refinements: Array<{
    title: string;
    prompt: string;
    options: ScoredOption[];
  }>;
};

type CompetencyManifest = {
  id: string;
  title: string;
  area: string;
  categories: CategoryDef[];
  levels: LevelDef[];
  gradeExpectations: Array<{
    gradeValue: string;
    targetBand: number;
    categoryRanges: Record<string, [number, number]>;
  }>;
};

export type ReferenceManifest = {
  generatedAt: string;
  grades: GradeDef[];
  competencies: CompetencyManifest[];
};

export function buildReferenceManifest(): ReferenceManifest {
  const range = (start: number, end: number): [number, number] => [start, end];

  const grades: GradeDef[] = [
    { value: "6-ano-ef", label: "6 ano do Ensino Fundamental", short: "6 ano EF", minAge: 11, maxAge: 12, stage: "Ensino Fundamental Anos Finais" },
    { value: "7-ano-ef", label: "7 ano do Ensino Fundamental", short: "7 ano EF", minAge: 12, maxAge: 13, stage: "Ensino Fundamental Anos Finais" },
    { value: "8-ano-ef", label: "8 ano do Ensino Fundamental", short: "8 ano EF", minAge: 13, maxAge: 14, stage: "Ensino Fundamental Anos Finais" },
    { value: "9-ano-ef", label: "9 ano do Ensino Fundamental", short: "9 ano EF", minAge: 14, maxAge: 15, stage: "Ensino Fundamental Anos Finais" },
    { value: "1-serie-em", label: "1 serie do Ensino Medio", short: "1 serie EM", minAge: 15, maxAge: 16, stage: "Ensino Medio" },
    { value: "2-serie-em", label: "2 serie do Ensino Medio", short: "2 serie EM", minAge: 16, maxAge: 17, stage: "Ensino Medio" },
    { value: "3-serie-em", label: "3 serie do Ensino Medio", short: "3 serie EM", minAge: 17, maxAge: 18, stage: "Ensino Medio" }
  ];

  const categories: CategoryDef[] = [
    { id: "tese", title: "Tese e foco", description: "Mantem ponto central claro e evita deriva de assunto." },
    { id: "evidencia", title: "Evidencia", description: "Relaciona exemplo, dado ou caso ao argumento defendido." },
    { id: "revisao", title: "Revisao", description: "Reescreve e corrige o proprio caminho quando percebe fragilidade." },
    { id: "transferencia", title: "Transferencia", description: "Leva o criterio para outro contexto sem perder coerencia." }
  ];

  const levels: LevelDef[] = [
    {
      level: 1,
      label: "Exploratorio",
      anchor: {
        title: "Ancora 1 | Reconhecer e justificar",
        prompt:
          "Uma colega publica um paragrafo defendendo uma regra nova na escola, mas mistura opiniao com um unico exemplo. Como voce mostraria o que esta fraco no texto e o que precisaria melhorar para virar argumento?",
        passHint: "Percebe fragilidade de foco, evidencia ou criterio.",
        categoryWeights: { tese: 2, evidencia: 1, revisao: 1, transferencia: 1 }
      },
      refinements: [
        {
          title: "Refino 1A | Identificacao do problema",
          prompt: "Ele identifica um problema central do texto com algum criterio?",
          options: [
            { label: "Sim, com criterio", score: 2, categoryWeights: { tese: 1, evidencia: 1, revisao: 0, transferencia: 0 } },
            { label: "Parcialmente", score: 1, categoryWeights: { tese: 1, evidencia: 0, revisao: 0, transferencia: 0 } },
            { label: "Nao", score: 0, categoryWeights: { tese: 0, evidencia: 0, revisao: 0, transferencia: 0 } }
          ]
        },
        {
          title: "Refino 1B | Primeira justificativa",
          prompt: "Ao sugerir revisao, ele oferece um caminho justificavel?",
          options: [
            { label: "Sim, com orientacao clara", score: 3, categoryWeights: { tese: 1, evidencia: 1, revisao: 1, transferencia: 0 } },
            { label: "Parcialmente", score: 1, categoryWeights: { tese: 0, evidencia: 1, revisao: 0, transferencia: 0 } },
            { label: "Nao", score: 0, categoryWeights: { tese: 0, evidencia: 0, revisao: 0, transferencia: 0 } }
          ]
        }
      ]
    },
    {
      level: 2,
      label: "Emergente",
      anchor: {
        title: "Ancora 2 | Revisar o primeiro impulso",
        prompt:
          "Depois de responder rapidamente, o estudante percebe que so repetiu a tese. Como ele revisaria o texto para incluir criterio, exemplo e relacao entre os dois?",
        passHint: "Revisa estrutura e explicita a sustentacao.",
        categoryWeights: { tese: 1, evidencia: 2, revisao: 2, transferencia: 0 }
      },
      refinements: [
        {
          title: "Refino 2A | Revisao estrutural",
          prompt: "Ele reorganiza a resposta para nao ficar apenas na tese inicial?",
          options: [
            { label: "Sim, reorganiza com clareza", score: 2, categoryWeights: { tese: 1, evidencia: 0, revisao: 1, transferencia: 0 } },
            { label: "Parcialmente", score: 1, categoryWeights: { tese: 0, evidencia: 0, revisao: 1, transferencia: 0 } },
            { label: "Nao", score: 0, categoryWeights: { tese: 0, evidencia: 0, revisao: 0, transferencia: 0 } }
          ]
        },
        {
          title: "Refino 2B | Sustentacao do criterio",
          prompt: "Ele explica por que o exemplo sustenta o argumento?",
          options: [
            { label: "Sim, conecta exemplo e criterio", score: 3, categoryWeights: { tese: 0, evidencia: 2, revisao: 1, transferencia: 0 } },
            { label: "Parcialmente", score: 1, categoryWeights: { tese: 0, evidencia: 1, revisao: 0, transferencia: 0 } },
            { label: "Nao", score: 0, categoryWeights: { tese: 0, evidencia: 0, revisao: 0, transferencia: 0 } }
          ]
        }
      ]
    },
    {
      level: 3,
      label: "Operacional",
      anchor: {
        title: "Ancora 3 | Comparar caminhos",
        prompt:
          "Dois textos defendem a mesma ideia: um emociona, o outro apresenta dados e ressalvas. Como o estudante compararia os caminhos e justificaria a decisao sobre qual publicar?",
        passHint: "Compara estrategias e escolhe com criterio explicito.",
        categoryWeights: { tese: 1, evidencia: 2, revisao: 1, transferencia: 1 }
      },
      refinements: [
        {
          title: "Refino 3A | Leitura comparativa",
          prompt: "Ele compara os dois caminhos sem reduzir tudo a gosto pessoal?",
          options: [
            { label: "Sim, compara por criterio", score: 2, categoryWeights: { tese: 1, evidencia: 1, revisao: 0, transferencia: 0 } },
            { label: "Parcialmente", score: 1, categoryWeights: { tese: 1, evidencia: 0, revisao: 0, transferencia: 0 } },
            { label: "Nao", score: 0, categoryWeights: { tese: 0, evidencia: 0, revisao: 0, transferencia: 0 } }
          ]
        },
        {
          title: "Refino 3B | Decisao sustentada",
          prompt: "A decisao final vem acompanhada de justificativa consistente?",
          options: [
            { label: "Sim, com foco no efeito do texto", score: 3, categoryWeights: { tese: 0, evidencia: 1, revisao: 1, transferencia: 1 } },
            { label: "Parcialmente", score: 1, categoryWeights: { tese: 0, evidencia: 1, revisao: 0, transferencia: 0 } },
            { label: "Nao", score: 0, categoryWeights: { tese: 0, evidencia: 0, revisao: 0, transferencia: 0 } }
          ]
        }
      ]
    },
    {
      level: 4,
      label: "Consistente",
      anchor: {
        title: "Ancora 4 | Contra-argumentar e preservar criterio",
        prompt:
          "Um leitor contesta a proposta com um contra-exemplo forte. Como o estudante revisaria o texto para responder a objecao sem abandonar a tese?",
        passHint: "Integra objecao real e reforca o criterio.",
        categoryWeights: { tese: 1, evidencia: 1, revisao: 2, transferencia: 1 }
      },
      refinements: [
        {
          title: "Refino 4A | Tratamento da objecao",
          prompt: "Ele trata a objecao como parte real do problema?",
          options: [
            { label: "Sim, incorpora seriamente", score: 2, categoryWeights: { tese: 0, evidencia: 0, revisao: 2, transferencia: 0 } },
            { label: "Parcialmente", score: 1, categoryWeights: { tese: 0, evidencia: 0, revisao: 1, transferencia: 0 } },
            { label: "Nao", score: 0, categoryWeights: { tese: 0, evidencia: 0, revisao: 0, transferencia: 0 } }
          ]
        },
        {
          title: "Refino 4B | Revisao da tese",
          prompt: "Ele preserva a tese com ajuste de criterio e nao apenas repeticao?",
          options: [
            { label: "Sim, revisa com ganho de precisao", score: 3, categoryWeights: { tese: 1, evidencia: 1, revisao: 1, transferencia: 0 } },
            { label: "Parcialmente", score: 1, categoryWeights: { tese: 1, evidencia: 0, revisao: 0, transferencia: 0 } },
            { label: "Nao", score: 0, categoryWeights: { tese: 0, evidencia: 0, revisao: 0, transferencia: 0 } }
          ]
        }
      ]
    },
    {
      level: 5,
      label: "Transferente",
      anchor: {
        title: "Ancora 5 | Transferir a competencia",
        prompt:
          "Depois de sustentar um argumento sobre a escola, o estudante precisa defender ponto semelhante em outro contexto publico e com publico diferente. Como adaptaria estrategia, tom e evidencia sem perder coerencia?",
        passHint: "Transfere criterio, adapta linguagem e recalibra evidencia.",
        categoryWeights: { tese: 1, evidencia: 1, revisao: 1, transferencia: 2 }
      },
      refinements: [
        {
          title: "Refino 5A | Adaptacao de contexto",
          prompt: "Ele adapta o argumento ao novo publico sem simplificar demais?",
          options: [
            { label: "Sim, ajusta tom e estrategia", score: 2, categoryWeights: { tese: 0, evidencia: 0, revisao: 0, transferencia: 2 } },
            { label: "Parcialmente", score: 1, categoryWeights: { tese: 0, evidencia: 0, revisao: 0, transferencia: 1 } },
            { label: "Nao", score: 0, categoryWeights: { tese: 0, evidencia: 0, revisao: 0, transferencia: 0 } }
          ]
        },
        {
          title: "Refino 5B | Transferencia de criterio",
          prompt: "Ele mantem o criterio central mesmo mudando o contexto?",
          options: [
            { label: "Sim, transfere com consistencia", score: 3, categoryWeights: { tese: 1, evidencia: 1, revisao: 0, transferencia: 1 } },
            { label: "Parcialmente", score: 1, categoryWeights: { tese: 0, evidencia: 0, revisao: 0, transferencia: 1 } },
            { label: "Nao", score: 0, categoryWeights: { tese: 0, evidencia: 0, revisao: 0, transferencia: 0 } }
          ]
        }
      ]
    }
  ];

  const gradeExpectations = grades.map((grade, index) => {
    const targetBand = Math.min(5, Math.max(1, index < 2 ? 2 : index < 4 ? 3 : 4));
    return {
      gradeValue: grade.value,
      targetBand,
      categoryRanges: {
        tese: range(Math.max(1, targetBand - 1), targetBand),
        evidencia: range(Math.max(1, targetBand - 1), targetBand),
        revisao: range(Math.max(1, targetBand - 1), targetBand),
        transferencia: range(Math.max(1, targetBand - 2), targetBand)
      }
    };
  });

  return {
    generatedAt: new Date().toISOString(),
    grades,
    competencies: [
      {
        id: "argumentacao_escrita",
        title: "Argumentacao escrita",
        area: "Linguagens",
        categories,
        levels,
        gradeExpectations
      }
    ]
  };
}

function docToMarkdown(params: {
  grade: GradeDef;
  competency: CompetencyManifest;
  level: LevelDef;
  expectation: { targetBand: number; categoryRanges: Record<string, [number, number]> };
}): string {
  return `# ${params.competency.title} | ${params.grade.label} | Nivel ${params.level.level}

- Area: ${params.competency.area}
- Banda de referencia para a serie: ${params.expectation.targetBand}
- Nivel do documento: ${params.level.label}

## Categorias e ranges esperados

${params.competency.categories
  .map((category) => {
    const range = params.expectation.categoryRanges[category.id];
    return `- ${category.title}: faixa ${range?.[0] ?? 1} a ${range?.[1] ?? 1} | ${category.description}`;
  })
  .join("\n")}

## Pergunta ancora

${params.level.anchor.prompt}

## Indicador de passagem

${params.level.anchor.passHint}

## Refinamentos

${params.level.refinements
  .map(
    (refinement) =>
      `### ${refinement.title}\n${refinement.prompt}\n${refinement.options
        .map((option) => `- ${option.label}: ${option.score} ponto(s)`)
        .join("\n")}`
  )
  .join("\n\n")}
`;
}

export async function generateReferenceDocuments(rootDir: string): Promise<{ manifestPath: string; documentsDir: string }> {
  const manifest = buildReferenceManifest();
  const documentsDir = path.join(rootDir, "references");
  await mkdir(documentsDir, { recursive: true });

  for (const competency of manifest.competencies) {
    const competencyDir = path.join(documentsDir, competency.id);
    await mkdir(competencyDir, { recursive: true });

    for (const grade of manifest.grades) {
      const gradeDir = path.join(competencyDir, grade.value);
      await mkdir(gradeDir, { recursive: true });
      const expectation = competency.gradeExpectations.find((item) => item.gradeValue === grade.value);
      if (!expectation) {
        continue;
      }

      for (const level of competency.levels) {
        const docPayload = {
          generatedAt: manifest.generatedAt,
          grade,
          competency: {
            id: competency.id,
            title: competency.title,
            area: competency.area
          },
          categories: competency.categories,
          expectation,
          level
        };

        const baseName = `level-${level.level}`;
        await writeFile(path.join(gradeDir, `${baseName}.json`), JSON.stringify(docPayload, null, 2), "utf8");
        await writeFile(
          path.join(gradeDir, `${baseName}.md`),
          docToMarkdown({ grade, competency, level, expectation }),
          "utf8"
        );
      }
    }
  }

  const manifestPath = path.join(rootDir, "reference-index.json");
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2), "utf8");

  return { manifestPath, documentsDir };
}
