---
type: "provenance-policy"
title: "Proveniência e rastreabilidade"
description: "Política de origem, confiança, citação e linhagem dos artefatos pedagógicos."
tags: ["okf", "proveniencia", "bncc", "fontes", "auditoria"]
timestamp: "2026-07-13T00:00:00-03:00"
---

# Proveniência e rastreabilidade

## Base legada e reconstrução

O projeto possuía uma base OKF legada em pasta local, porém esse conteúdo não foi incluído nos commits acessíveis e não está recuperável pelo estado atual, reflog ou objetos Git disponíveis. Os conceitos de compreensão, geração, fontes e artefatos sobreviveram semanticamente em `inicio.rb`, nos documentos de habilidade e no primeiro pipeline TypeScript.

O bundle OKF v0.1 é, portanto, uma reconstrução padronizada e verificável a partir desses remanescentes. Nenhuma formulação deste bundle deve ser atribuída literalmente à base local indisponível sem outra evidência.

## Regra central

Uma afirmação curricular publicada deve ser rastreável até uma fonte identificada. Uma proposta pedagógica deve deixar claro quando é interpretação, geração ou decisão humana. O OKF não pode transformar texto produzido por modelo em norma BNCC.

## Inventário de fontes

| Identificador lógico | Fonte | Papel | Estado |
| --- | --- | --- | --- |
| `bncc-ef-pdf` | [`BNCC_EI_EF_110518_versaofinal_site.pdf`](https://github.com/glaucodeveloper/cognoscere/blob/main/BNCC_EI_EF_110518_versaofinal_site.pdf) | Documento normativo primário | Versionado no repo |
| `bncc-lp-index` | [`data/bncc_linguagens_lingua_portuguesa.json`](https://github.com/glaucodeveloper/cognoscere/blob/main/data/bncc_linguagens_lingua_portuguesa.json) | Índice extraído com 391 habilidades | Derivado |
| `bncc-ef69lp01` | [`data/bncc_ef69lp01.json`](https://github.com/glaucodeveloper/cognoscere/blob/main/data/bncc_ef69lp01.json) | Recorte de demonstração | Derivado |
| `skill-ef69lp01-curated` | [`habilidades/ef69lp01.md`](https://github.com/glaucodeveloper/cognoscere/blob/main/habilidades/ef69lp01.md) | Compreensões pedagógicas específicas | Curado |
| `skill-ef69lp01-generated` | [`habilidades/geradas/ef69lp01.md`](https://github.com/glaucodeveloper/cognoscere/blob/main/habilidades/geradas/ef69lp01.md) | Configuração genérica | Gerado, requer revisão |
| `textbase-ef69lp01-demo` | [`data/quiz_6ano_ef69lp01_separated_textbase.json`](https://github.com/glaucodeveloper/cognoscere/blob/main/data/quiz_6ano_ef69lp01_separated_textbase.json) | Texto-base, abstrações e compreensão-base | Artefato de demonstração |
| `pipeline-ruby-current` | [`inicio.rb`](https://github.com/glaucodeveloper/cognoscere/blob/main/inicio.rb) | Contratos atuais de prompt e avaliação | Código vigente |
| `pipeline-ts-historic` | [`40e135d/src`](https://github.com/glaucodeveloper/cognoscere/tree/40e135d2179d557cf14f8696defd3cc3340f9e24/src) | Retrieval, módulos, sessões e referências | Histórico recuperável |

O campo `source_pdf` de alguns índices derivados contém um caminho Windows de geração. Esse caminho é evidência do ambiente em que o arquivo foi criado, não URL portátil. Consumidores devem usar o identificador lógico e o caminho versionado do repositório.

## Classes de afirmação

| Classe | Definição | Rotulagem esperada |
| --- | --- | --- |
| Normativa | Transcrição ou referência fiel ao documento oficial | código, página, documento e trecho |
| Derivada | Resultado determinístico de extração ou agregação | fonte, ferramenta e data |
| Curada | Interpretação pedagógica revisada por humano | autor/revisor e versão |
| Gerada | Proposta de modelo ainda não aprovada | modelo, template, fontes e status `draft` |
| Observada | Evidência produzida em interação real | ambiente privado, responsável e data |
| Inferida | Síntese ou encaminhamento calculado | regra/modelo e nível de confiança |

## Cadeia mínima de linhagem

Para material público, a trilha deve responder:

1. Qual curso, eixo e material estão sendo exibidos?
2. Qual habilidade BNCC sustenta o material?
3. Qual fonte e página contêm a habilidade?
4. Qual configuração de compreensão foi aplicada?
5. Qual template e versão produziram o artefato?
6. Quais trechos foram fornecidos ao modelo?
7. Qual schema foi validado?
8. Quem revisou e aprovou?
9. Quando o conteúdo foi promovido?

## Níveis de confiança editorial

- **Fonte primária:** documento oficial preservado e identificado.
- **Derivado verificável:** extração reproduzível, conferida contra a fonte.
- **Curado:** interpretação humana específica da habilidade.
- **Gerado revisado:** saída de modelo validada estrutural e pedagogicamente.
- **Demonstração:** exemplo útil à interface, sem equivaler a conteúdo curricular aprovado.
- **Rascunho:** nunca deve aparecer como material final para estudante.

## Referências históricas

O commit `40e135d` estabeleceu três ideias preservadas nesta documentação:

- manifesto e documentos por competência/série/nível em [`reference-pipeline.ts`](https://github.com/glaucodeveloper/cognoscere/blob/40e135d2179d557cf14f8696defd3cc3340f9e24/src/reference-pipeline.ts);
- tríade JSON, Markdown e fontes em [`modules.ts`](https://github.com/glaucodeveloper/cognoscere/blob/40e135d2179d557cf14f8696defd3cc3340f9e24/src/modules.ts);
- kits de sessão com artefato e fontes em [`sessions.ts`](https://github.com/glaucodeveloper/cognoscere/blob/40e135d2179d557cf14f8696defd3cc3340f9e24/src/sessions.ts).

A existência histórica de um contrato não o torna automaticamente vigente. Quando houver divergência, o pipeline atual em `inicio.rb` e a definição de produto em `PLATAFORMA.md` prevalecem, e a diferença deve ser registrada.

## Regras de citação na interface

Uma página de curso deve apresentar, no mínimo:

- código da habilidade;
- componente e etapa;
- página ou recorte de origem;
- status do material;
- data da última revisão;
- link para “Como este material foi construído”.

Detalhes sobre a projeção desses campos estão em [Integração com cursos](./course-integration.md). Privacidade e retenção estão em [Segurança e governança](./security-governance.md).
