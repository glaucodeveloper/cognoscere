---
type: "taxonomy"
title: "Taxonomia de progressão por competência"
description: "Reconciliação das escalas públicas, históricas, diagnósticas e operacionais usadas no Cognoscere."
tags: ["okf", "progressao", "competencia", "niveis", "evidencia"]
timestamp: "2026-07-13T00:00:00-03:00"
---

# Taxonomia de progressão por competência

## Taxonomia pública vigente

[`PLATAFORMA.md`](https://github.com/glaucodeveloper/cognoscere/blob/main/PLATAFORMA.md) define cinco níveis pedagógicos para o produto:

1. **Iniciação**
2. **Apropriação**
3. **Consolidação**
4. **Proficiência**
5. **Domínio**

Essa é a linguagem que deve aparecer de forma consistente na interface pública. Percentuais são estimativas auxiliares; não substituem o nome do nível nem a evidência que o sustenta.

## Regra S5 documentada no produto

A definição da plataforma registra:

- avanço após cinco acertos;
- itens bônus até o primeiro erro;
- recuperação com itens mais simples após zero acertos;
- ausência não é punida.

O OKF registra essa regra como política de produto existente. A implementação precisa especificar futuramente o escopo da janela, critérios de “acerto”, tratamento de perguntas abertas, idempotência e revisão humana antes que S5 seja considerada um motor completo.

## Taxonomias remanescentes

O projeto contém outras escalas, cada uma criada para uma finalidade diferente.

### Módulo histórico de produção

No commit `40e135d`, [`src/modules.ts`](https://github.com/glaucodeveloper/cognoscere/blob/40e135d2179d557cf14f8696defd3cc3340f9e24/src/modules.ts) solicitava:

- Novato;
- Capacidade intuitiva;
- Capacidade plena;
- Já aprendeu na escola;
- Dominante.

Esses nomes pertencem ao schema histórico de geração de módulo e não devem aparecer automaticamente como nível público atual.

### Referências por competência históricas

[`src/reference-pipeline.ts`](https://github.com/glaucodeveloper/cognoscere/blob/40e135d2179d557cf14f8696defd3cc3340f9e24/src/reference-pipeline.ts) usava:

1. Exploratório;
2. Emergente;
3. Operacional;
4. Consistente;
5. Transferente.

Cada nível possuía pergunta âncora, indicador de passagem, refinamentos e pesos nas categorias `tese`, `evidencia`, `revisao` e `transferencia`.

### Kit histórico de sessão

[`src/sessions.ts`](https://github.com/glaucodeveloper/cognoscere/blob/40e135d2179d557cf14f8696defd3cc3340f9e24/src/sessions.ts) usava quatro bandas diagnósticas:

- Inicial;
- Básico;
- Intermediário;
- Avançado.

Essa escala organiza perguntas de fase em uma sessão, não a progressão longitudinal pública.

### Estado operacional atual por evidência

`StudentProfileEntity` em [`inicio.rb`](https://github.com/glaucodeveloper/cognoscere/blob/main/inicio.rb) produz descrições a partir da taxa de respostas com evidência textual:

| Taxa na sondagem | Estado operacional |
| --- | --- |
| abaixo de 40% | necessita reforço estruturado |
| 40% a menos de 70% | domínio em formação, com necessidade de justificar |
| 70% a menos de 90% | domínio funcional observado, com reforço pontual |
| 90% a 100% | domínio consistente observado na sondagem |

Esses estados descrevem o resultado observado naquela aplicação. Eles não devem ser convertidos diretamente em nível público sem regra validada e múltiplas evidências.

## Mapeamento semântico recomendado

O quadro abaixo serve apenas para interoperabilidade editorial; não é conversão automática de resultados:

| Nível público | Referência histórica aproximada | Evidência típica |
| --- | --- | --- |
| Iniciação | Exploratório / Novato | reconhece elementos com mediação |
| Apropriação | Emergente / Capacidade intuitiva | começa a justificar e revisar |
| Consolidação | Operacional / Capacidade plena | aplica critério de forma funcional |
| Proficiência | Consistente / Já aprendeu na escola | integra objeção e preserva coerência |
| Domínio | Transferente / Dominante | transfere critério entre contextos |

“Aproximada” é obrigatório: os schemas históricos medem constructos diferentes e não foram calibrados como equivalentes.

## Unidades independentes

O produto mantém três domínios separados:

| Domínio | Unidade | Fonte | Proibição |
| --- | --- | --- | --- |
| Competência | nível, estimativa e evidências | quizzes e observações | não recebe reputação ou placar |
| Reputação social | reputação por contribuição | votos ponderados | não altera competência |
| Competição | pontuação/leaderboard local | rubrica do desafio | não promove nível diretamente |

Uma entrega de competição pode gerar uma evidência pedagógica apenas depois de avaliação apropriada. O placar em si nunca é evidência de competência.

## Evidência e atualização

Para atualizar uma competência, registrar:

- habilidade e operação cognitiva;
- instrumento e versão;
- resposta ou entrega em ambiente privado;
- rubrica aplicada;
- decisão humana;
- data;
- nível anterior e posterior;
- regra de transição;
- possibilidade de revisão.

Uma única resposta pode acrescentar evidência sem alterar imediatamente o nível. A interface deve distinguir “evidência registrada” de “nível atualizado”.

## Linguagem segura na interface

Preferir:

- “evidência observada nesta atividade”;
- “estimativa atual”;
- “próximo passo sugerido”;
- “você pode revisar ou tentar outra evidência”.

Evitar:

- “você não sabe”;
- “nível definitivo”;
- “a IA provou”;
- comparação pública entre estudantes por competência;
- percentual apresentado como precisão científica.

## Governança da taxonomia

Mudança de nomes, bandas ou regra S5 exige:

1. justificativa pedagógica;
2. análise de impacto nos registros existentes;
3. estratégia de migração;
4. validação com instrumentos abertos;
5. atualização de cursos, perfis e relatórios;
6. registro em [log.md](./log.md).

Veja também [Análise de respostas](./prompt-response-analysis.md), [Integração com cursos](./course-integration.md) e [Governança](./security-governance.md).
