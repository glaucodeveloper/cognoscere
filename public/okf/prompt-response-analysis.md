---
type: "analysis-spec"
title: "Análise de respostas e evidências"
description: "Contrato de coleta, decisão humana, agregação e atualização protegida do perfil de competência."
tags: ["okf", "analise", "resposta", "evidencia", "perfil"]
timestamp: "2026-07-13T00:00:00-03:00"
stage: "response-analysis"
status: "current-contract"
---

# Análise de respostas e evidências

## Natureza do estágio

No runtime atual, a decisão decisiva não é delegada ao modelo. [`apply_quiz!`](https://github.com/glaucodeveloper/cognoscere/blob/main/inicio.rb) apresenta pergunta, habilidade, operação, intervenção e pistas; coleta a resposta aberta; e solicita a um humano que confirme se há justificativa textual suficiente.

Isso é human-in-the-loop obrigatório. Uma futura análise assistida pode sugerir classificação, mas não deve remover a confirmação humana em contexto de alto impacto educacional.

## Entradas

- pergunta e identificador;
- habilidade e operação cognitiva;
- resposta aberta do estudante;
- resposta de referência;
- rubrica de análise;
- pistas textuais esperadas;
- erro provável e evidência de domínio;
- observação do mediador;
- decisão humana sobre suficiência da evidência.

## Registro por resposta

| Campo | Visibilidade | Descrição |
| --- | --- | --- |
| `id` | privada/pseudonimizada | identidade da pergunta |
| `tipo_resposta` | pública | `aberta` |
| `pergunta` | pública se aprovada | enunciado |
| `comando_para_o_aluno` | pública | instrução |
| `habilidade_observada` | pública | foco curricular |
| `operacao_cognitiva` | pública | operação avaliada |
| `resposta_aluno` | privada | conteúdo produzido pelo estudante |
| `resposta_referencia` | restrita ao avaliador | parâmetro comparativo |
| `rubrica_analise` | restrita ao avaliador | critérios qualitativos |
| `pistas_textuais_esperadas` | restrita durante aplicação | evidências possíveis |
| `evidencia_textual_suficiente` | privada | decisão humana booleana atual |
| `observacao_humana` | privada | justificativa da decisão |
| `erro_provavel` | privada | hipótese, nunca diagnóstico definitivo |
| `evidencia_dominio` | privada | evidência prevista |
| `atualizacao_perfil` | privada | proposta sujeita à regra de progressão |

## Agregação

O runtime calcula:

- `total`: número de respostas;
- `with_evidence`: respostas marcadas com evidência textual suficiente;
- `evidence_rate`: `with_evidence / total × 100`;
- `by_operation`: total e respostas com evidência por operação cognitiva.

O percentual descreve a sondagem aplicada. Não é nota universal, diagnóstico clínico ou prova isolada de domínio permanente.

## Progressão do perfil

`StudentProfileEntity` preserva:

- perfil inicial;
- registros de quizzes;
- acumulado por tentativas e operação;
- evidências observadas;
- reforços ativos;
- estado atual;
- eventos datados de progressão.

A atualização deve ser idempotente por sessão/pergunta em uma implementação persistente, evitando duplicar uma mesma tentativa após reload ou retry.

## Invariantes

- Nunca alterar a resposta original do estudante.
- Separar observação humana de texto gerado.
- Registrar quem avaliou e quando, em ambiente autenticado.
- Permitir revisão/contestação da decisão.
- Não publicar respostas nem observações no bundle público.
- Não inferir traço permanente a partir de um único item.
- Não usar reputação social ou leaderboard para alterar competência.
- Não penalizar ausência como erro pedagógico.
- Explicar ao estudante que o resultado ajusta o percurso e não funciona como nota punitiva.

## Assistência de IA futura

Se houver análise assistida, a saída deve ser uma recomendação estruturada:

- classificação sugerida na rubrica;
- pistas localizadas na resposta e no texto-base;
- evidências ausentes;
- confiança e limitações;
- pergunta de mediação sugerida;
- decisão humana final separada.

A assistência não deve produzir cadeia de pensamento. Deve oferecer justificativa curta, citável e baseada em evidências observáveis.

## Segurança

Respostas de estudantes podem revelar identidade, crenças ou situação familiar. O processamento deve aplicar minimização, controle de acesso, retenção limitada e proteção reforçada de menores. Veja [Contratos](./contracts.md) e [Segurança](./security-governance.md).

## Relação com outros estágios

- recebe perguntas de [Geração de perguntas](./prompt-question-generation.md);
- alimenta [Auditoria e reescrita](./prompt-audit-rewrite.md) apenas de forma autorizada e preferencialmente anonimizada;
- atualiza a taxonomia definida em [Progressão](./progression-taxonomy.md);
- nunca grava diretamente o conteúdo público descrito em [Integração com cursos](./course-integration.md).
