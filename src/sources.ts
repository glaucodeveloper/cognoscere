import type { SourceDocument } from "./types.js";

export const PROJECT_NAME = "BNCC + Playbooks de nivelamento e sessoes particulares";

export const SOURCES: SourceDocument[] = [
  {
    id: "bncc-ef-2017",
    kind: "pdf",
    title: "BNCC da Educacao Infantil e Ensino Fundamental",
    url: "https://basenacionalcomum.mec.gov.br/images/BNCC_EI_EF_110518_versaofinal_site.pdf",
    filename: "bncc-educacao-infantil-ensino-fundamental.pdf",
    tags: ["bncc", "competencias", "habilidades", "ensino fundamental"],
    sourceWeight: 1.1
  },
  {
    id: "bncc-em-2018",
    kind: "pdf",
    title: "BNCC do Ensino Medio",
    url: "https://basenacionalcomum.mec.gov.br/images/BNCC_20dez_site.pdf",
    filename: "bncc-ensino-medio.pdf",
    tags: ["bncc", "competencias", "habilidades", "ensino medio"],
    sourceWeight: 1.1
  },
  {
    id: "vectorless-rag-private-sessions-playbook",
    kind: "localText",
    title: "Playbook PT-BR de Vectorless RAG para nivelamento e sessoes particulares",
    filename: "vectorless-rag-private-sessions-playbook.txt",
    description:
      "Reconstrucao em portugues derivada da transcricao automatica do video https://www.youtube.com/watch?v=f3zHina9MTo, com foco em page index, recuperacao sem vetores, perguntas de fase e sondagem de matricula.",
    tags: [
      "vectorless rag",
      "page index",
      "retrieval",
      "sondagem",
      "nivelamento",
      "sessoes particulares",
      "competencia"
    ],
    sourceWeight: 1.3
  }
];
