---
type: "prompt-spec"
title: "Prompt de geração de módulo"
description: "Contrato reconstruído do gerador histórico de módulos de produção alinhados à BNCC."
tags: ["okf", "prompt", "modulo", "curso", "bncc"]
timestamp: "2026-07-13T00:00:00-03:00"
stage: "module-generation"
status: "reconstructed"
---

# Prompt de geração de módulo

## Origem e estado

Este contrato é reconstruído do arquivo histórico [`src/modules.ts`](https://github.com/glaucodeveloper/cognoscere/blob/40e135d2179d557cf14f8696defd3cc3340f9e24/src/modules.ts), no commit `40e135d`. Ele não está presente como executor na aplicação Vite atual. Sua especificação permanece relevante porque conecta pedido de curso, retrieval BNCC, progressão por competência e artefatos de curso.

O conteúdo original da base OKF local anterior não foi versionado e não está recuperável. Este documento não pretende reproduzi-lo literalmente; padroniza o comportamento verificável nos remanescentes.

## Responsabilidade

Produzir um módulo educacional prático, orientado por competência e ancorado nos trechos BNCC recuperados. O módulo deve conter produção concreta, progressão, evidências, revisão por pares, apoio de IA, observação docente e cuidados de uso responsável.

O estágio não avalia estudante, não publica automaticamente o resultado e não pode afirmar alinhamento normativo que não esteja sustentado pelas fontes fornecidas.

## Entradas

| Campo | Obrigatório | Descrição |
| --- | --- | --- |
| `title` | sim | Título editorial do módulo |
| `stage` | sim | Etapa educacional |
| `area` | sim | Área ou componente curricular |
| `theme` | sim | Tema ou eixo do módulo |
| `audience` | não | Público mais específico |
| `moduleType` | não | Projeto, missão, oficina ou outro formato |
| `duration` | não | Duração sugerida |
| `excerpts` | sim | Trechos recuperados com fonte, seção, índice e score |

## Recuperação de contexto

A consulta histórica concatenava etapa, área, tema, público, tipo, duração, título e termos pedagógicos como “competências”, “habilidades”, “práticas”, “avaliação”, “projeto” e “produção”. O retrieval vectorless selecionava trechos lexicais relevantes, ponderados por metadados da fonte.

Para geração de módulo, o histórico usava até cinco trechos por fonte e até quatorze trechos no total. Esses números são defaults documentais, não garantia de qualidade. O revisor deve conferir cobertura e duplicação.

## Ordem do contexto

1. papel de designer curricular;
2. filosofia de aprendizagem por competência;
3. regra de uso exclusivo dos trechos BNCC como base normativa;
4. obrigação de explicitar limites e verificação humana;
5. dados do módulo;
6. trechos recuperados;
7. schema de saída.

## Schema de saída

| Campo | Tipo | Invariante |
| --- | --- | --- |
| `module_title` | string | coerente com o pedido |
| `stage` | string | não alterar a etapa informada sem sinalizar |
| `area` | string | área/componente informado |
| `theme` | string | tema do módulo |
| `module_type` | string | formato educacional |
| `duration` | string | duração proposta ou informada |
| `bncc_alignment[]` | array | fonte, habilidade/eixo e justificativa |
| `competency_focus[]` | array | focos observáveis |
| `competency_pipeline[]` | array | competência, propósito, conexão e níveis |
| `production_challenge` | objeto | pergunta norteadora, entrega e contexto real |
| `lumira_progression[]` | array | nível e comportamento esperado |
| `assessment` | objeto | peer review, apoio de IA e observação docente |
| `responsible_ai_public_use` | objeto | propósito, benefício, verificação e cautelas |
| `module_outputs[]` | array | produtos verificáveis |
| `implementation_notes[]` | array | condições para execução |

No contrato histórico, cada item de `competency_pipeline[].levels[]` continha:

- `level`;
- `student_readiness`;
- `challenge_scope`;
- `expected_evidence`.

## Invariantes

- Usar somente as fontes fornecidas para alegações BNCC.
- Não inventar código de habilidade.
- Diferenciar requisito normativo de proposta pedagógica.
- Formular entrega observável, não apenas consumo de conteúdo.
- Relacionar cada progressão a comportamento ou evidência.
- Tratar IA como mediação, nunca como avaliador soberano.
- Incluir verificação humana, rastreabilidade e riscos de desinformação, dependência ou exclusão.
- Não incorporar dado pessoal do estudante ao módulo público.

## Artefatos esperados

O pipeline histórico criava três representações:

1. `<slug>.json`: contrato estruturado;
2. `<slug>.md`: leitura humana do módulo;
3. `<slug>.sources.md`: parâmetros e trechos recuperados.

A tríade deve continuar conceitualmente separada. Um material publicado não substitui suas fontes, e o arquivo de fontes não deve conter dados privados.

## Validação

### Estrutural

- saída JSON analisável;
- arrays e objetos obrigatórios presentes;
- níveis com prontidão, desafio e evidência;
- alinhamentos com referência de fonte.

### Pedagógica

- adequação à etapa e ao público;
- consistência entre desafio, competência e avaliação;
- viabilidade da duração;
- possibilidade real de produção e revisão;
- ausência de afirmação normativa inventada.

### Humana

Um responsável curricular deve classificar o artefato como `draft`, `reviewed` ou `approved`. Somente `approved` pode ser projetado como curso oficial. A trilha de aprovação segue [Proveniência](./provenance.md) e [Governança](./security-governance.md).

## Limitações

- Retrieval lexical pode perder trechos semanticamente relevantes sem termos coincidentes.
- Um score alto indica correspondência, não validade pedagógica.
- A estrutura histórica usa uma taxonomia de níveis diferente da taxonomia pública atual; consulte [Progressão](./progression-taxonomy.md).
- A geração não substitui checagem do PDF oficial nem autoria pedagógica.

## Relações

- Motor: [Motor de prompts](./prompt-engine.md)
- Projeção: [Integração com cursos](./course-integration.md)
- Fonte: [Proveniência](./provenance.md)
- Contrato de publicação: [Contratos](./contracts.md)
