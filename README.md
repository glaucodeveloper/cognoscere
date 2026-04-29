# Cognoscere

Projeto em `Node.js + TypeScript` usando a SDK oficial `@google/genai` para:

- baixar os PDFs oficiais da BNCC do Ensino Fundamental e do Ensino Medio;
- extrair o texto do PDF;
- selecionar os trechos mais relevantes para uma pergunta com retrieval sem vetores;
- reconstruir um playbook PT-BR a partir da transcricao automatica de um video sobre `Vectorless RAG`;
- gerar modulos de producao alinhados a BNCC, no espirito do Lumira.
- gerar kits de sessao particular com perguntas de fase e sondagem de matricula.
- gerar documentos de referencia por competencia, serie e nivel antes da front.
- gerar um portal-demo HTML do `Cognoscere`, com cursos por competencias, materiais tagueados, perfil de aluno customizavel, progresso em niveis e area social.

## Objetivo do projeto

O foco principal nao e apenas consulta textual. Este projeto foi ajustado para gerar modulos de producao educacional com:

- desafio pratico;
- foco por competencia;
- progressao inspirada nos niveis do Lumira;
- pipeline estruturada por competencias;
- cada competencia detalhada por nivel;
- evidencias de aprendizagem;
- criterios de peer review, apoio de IA e observacao docente.
- filosofia de uso da IA voltada ao entendimento publico, com textos transformados em apoio claro, verificavel e util para a populacao.

Agora ele tambem inclui um fluxo orientado a `vectorless RAG` para:

- nivelamento de entrada;
- sessoes particulares;
- perguntas de fase por nivel de competencia;
- sondagem de matricula com evidencia e encaminhamento.
- situacoes hipoteticas multifacetadas, sem respostas diretas.
- uma camada front de campus educacional para apresentar cursos, niveis, materiais, docs por competencia, dashboard do estudante e comunidade.

## Fontes e bases

- MEC:
  `https://basenacionalcomum.mec.gov.br/images/BNCC_EI_EF_110518_versaofinal_site.pdf`
- MEC:
  `https://basenacionalcomum.mec.gov.br/images/BNCC_20dez_site.pdf`
- Video-base para o playbook de vectorless RAG:
  `https://www.youtube.com/watch?v=f3zHina9MTo`

## Requisitos

- Node.js 20+
- uma chave em `GEMINI_API_KEY`

## Como usar

```bash
npm install
cp .env.example .env
```

Preencha `GEMINI_API_KEY` no `.env`. O `.env.example` agora volta a ser apenas modelo, sem segredo real.

Baixe e processe o documento:

```bash
npm run ingest
```

Reconstrua o playbook local a partir da transcricao automatica do video:

```bash
npm run refresh-playbook
```

Pergunte sobre a BNCC:

```bash
npm run ask -- "Quais habilidades a BNCC prioriza em Linguagens no Ensino Medio?"
```

Gere um modulo de producao:

```bash
npm run generate-module -- --title "Podcast de memoria local" --stage "Ensino Medio" --area "Linguagens" --theme "oralidade, pesquisa e autoria" --audience "1a serie" --module-type "projeto autoral" --duration "6 aulas"
```

Gere um kit de sessao particular:

```bash
npm run generate-session-kit -- --title "Leitura argumentativa" --stage "Ensino Fundamental Anos Finais" --area "Linguagens" --learner-profile "Aluno com boa oralidade, mas baixa seguranca na escrita" --focus "diagnosticar repertorio de argumentacao e planejar tutoria inicial"
```

Gere o portal-demo:

```bash
npm run generate-test-ui
```

Gere apenas os documentos de referencia pre-servico:

```bash
npm run generate-reference-docs
```

Sirva o portal em uma porta local:

```bash
npm run serve-test-ui -- --port 4173
```

Os arquivos gerados ficam em:

- `data/modules/` para modulos
- `data/sessions/` para kits de sessao
- `data/text/` para o playbook local e a transcricao bruta do video
- `data/ui/` para o portal HTML gerado
  fluxo atual: inicio institucional -> cursos por competencia -> pagina de materiais e docs -> perfil customizavel -> area social
  assets pre-servico: `reference-index.json` + `references/<competencia>/<serie>/level-<n>.json|md`

No formato atual, as "sessoes" da pipeline sao tratadas como competencias, e cada competencia vem organizada por niveis de progressao.

## Scripts

- `npm run dev`
- `npm run ingest`
- `npm run refresh-playbook`
- `npm run generate-reference-docs`
- `npm run generate-test-ui`
- `npm run serve-test-ui -- --port 4173`
- `npm run ask -- "sua pergunta"`
- `npm run generate-module -- --title "..." --stage "..." --area "..." --theme "..." --module-type "..." --duration "..."`
- `npm run generate-session-kit -- --title "..." --stage "..." --area "..." --learner-profile "..." --focus "..."`
- `npm run build`

## Observacoes

- O projeto usa a SDK oficial `@google/genai` e `ai.models.generateContent(...)`.
- O modelo padrao fica em `.env` com `GEMINI_MODEL=gemini-2.5-flash`.
- O retrieval atual e `vectorless`: combina score lexical, cobertura da pergunta, cabecalhos e metadados, sem embeddings.
- Os modulos e kits sao baseados nos trechos selecionados localmente a partir da BNCC e do playbook operacional.
- A avaliacao pedagogica dos kits privilegia perguntas situacionais, abertas e multifacetadas, desenhadas para observar criterio, repertorio, transferencia, justificativa e autocorrecao.
- A IA deve ser usada como mediadora de entendimento, nao como autoridade final: ela deve tornar textos tecnicos mais compreensiveis, explicitar limites, preservar referencias, incentivar verificacao humana e orientar aplicacoes responsaveis para beneficio da populacao.
- A referencia conceitual de experiencia pratica e progressao foi inspirada no repositorio Lumira: `https://github.com/SemanticFlows/Lumira`
