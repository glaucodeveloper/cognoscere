---
type: "prompt-spec"
title: "Prompt de geração de perguntas diagnósticas"
description: "Contrato para gerar perguntas abertas, rubricas, pistas esperadas e intervenções a partir de texto fixado."
tags: ["okf", "prompt", "perguntas", "diagnostico", "rubrica"]
timestamp: "2026-07-13T00:00:00-03:00"
stage: "question-generation"
status: "current-contract"
---

# Prompt de geração de perguntas diagnósticas

## Responsabilidade

Gerar exatamente a quantidade solicitada de perguntas abertas usando exclusivamente o texto-base e a compreensão-base já aprovados. O estágio não pode criar novo texto, trocar gênero, alterar conteúdo nem administrar as respostas.

## Entradas

- habilidade e metadados BNCC;
- perfil pedagógico mínimo;
- tema da sondagem;
- quantidade de perguntas;
- observação humana inicial;
- compreensão do contexto BNCC;
- compreensão do tópico das perguntas;
- `texto_base` fixado;
- `compreensao_base` fixada;
- instruções e schema.

## Ordem do contexto

1. papel de inferência textual comum;
2. tarefa restrita às perguntas;
3. proibição de administrar ou regenerar o texto-base;
4. tema, quantidade e observação humana;
5. recorte BNCC;
6. perfil pedagógico;
7. compreensão do contexto BNCC;
8. compreensão do tópico;
9. texto-base fixado;
10. compreensão-base fixada;
11. schema e invariantes;
12. confirmação da quantidade e do formato aberto.

## Schema de saída

O objeto raiz preserva:

- `bncc_codigo`;
- `disciplina`;
- `etapa`;
- `serie`;
- `campo`;
- `pratica_linguagem`;
- `objeto_conhecimento`;
- `tema`;
- `texto_base` idêntico ao recebido;
- `questions[]`.

Cada pergunta possui:

| Campo | Finalidade |
| --- | --- |
| `id` | identidade estável no quiz |
| `tipo_resposta` | deve ser `aberta` |
| `habilidade_observada` | aspecto da habilidade em foco |
| `operacao_cognitiva` | ação observável de leitura/raciocínio |
| `pergunta` | formulação geral |
| `enunciado_aberto` | enunciado apresentado ao estudante |
| `comando_para_o_aluno` | ação solicitada sem conduzir resposta |
| `resposta_referencia` | parâmetro de análise, não resposta única |
| `rubrica_analise` | cinco estados qualitativos |
| `pistas_textuais_esperadas[]` | marcas localizáveis no texto |
| `intervencao_humana` | orientação ao mediador |
| `erro_provavel` | hipótese pedagógica revisável |
| `evidencia_dominio` | comportamento ou justificativa esperados |
| `atualizacao_perfil` | proposta de impacto, sujeita à decisão humana |

### Rubrica obrigatória

`rubrica_analise` diferencia:

- `dominio_observado`;
- `dominio_em_formacao`;
- `resposta_sem_evidencia_textual`;
- `erro_de_compreensao`;
- `necessidade_de_mediacao`.

## Invariantes

- Gerar exatamente a quantidade solicitada.
- Gerar somente respostas abertas.
- Não criar alternativas nem letra correta.
- Repetir o mesmo texto-base recebido.
- Exigir justificativa com pistas explícitas.
- Avaliar o modo de compreensão, não apenas conclusão final.
- Manter enunciado amplo, porém analisável.
- Cobrir operações definidas na compreensão da habilidade.
- Tratar `resposta_referencia` como exemplo de sustentação.
- Prever intervenção humana e erro provável sem rotular permanentemente o estudante.
- Para EF69LP01, cobrir opinião legítima, discurso de ódio, crítica versus ataque, posicionamento/denúncia e justificativa textual.

## Verificação de imutabilidade

Antes de publicar as perguntas, o pipeline deve comparar o texto-base retornado com o artefato de entrada. Diferenças de gênero, título ou conteúdo invalidam a saída. O comportamento atual apenas repõe `texto_base` quando ausente; o contrato OKF exige comparação explícita em uma implementação futura.

## Avaliação humana

Um professor deve revisar:

- clareza e adequação à série;
- existência real das pistas solicitadas;
- abertura sem vagueza;
- ausência de resposta induzida;
- distinção coerente entre os níveis da rubrica;
- segurança e respeito à diversidade;
- viabilidade da intervenção proposta.

## Integração

O quiz avulso atual contém um exemplo hard-coded de múltipla escolha e não representa este contrato. O eixo demonstrativo de curso já carrega uma atividade aberta da projeção OKF. A integração deve privilegiar perguntas abertas e expor rubrica apenas ao papel autorizado. Consulte [Integração com cursos](./course-integration.md), [Análise de resposta](./prompt-response-analysis.md) e [Contratos](./contracts.md).
