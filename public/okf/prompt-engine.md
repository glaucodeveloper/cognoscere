---
type: "prompt-engine"
title: "Motor de inteligência de prompts"
description: "Orquestração documental dos prompts de análise e geração do Cognoscere."
tags: ["okf", "prompts", "llm", "schemas", "human-in-the-loop"]
timestamp: "2026-07-13T00:00:00-03:00"
---

# Motor de inteligência de prompts

## Escopo

O motor converte fontes curriculares e contexto pedagógico em artefatos verificáveis. “Inteligência” significa aqui composição explícita de contexto, separação de responsabilidades, schemas de saída, validação e revisão. Não significa registrar raciocínio interno do modelo.

## Carregamento canônico do Ruby

Os templates integrais não são copiados manualmente para esta projeção pública. O comando `npm run export:okf-prompts` lê programaticamente `inicio.rb` e `habilidades/ef69lp01.md`, extrai os templates-fonte e instruções literais, ainda com seus placeholders, e gera o bundle técnico [`okf/`](https://github.com/glaucodeveloper/cognoscere/tree/main/okf), com hashes no [`registry.json`](https://github.com/glaucodeveloper/cognoscere/blob/main/okf/registry.json). O registro não armazena invocações interpoladas com dados de execução.

São exportados diretamente:

- `text_base_generation_prompt_for` + `TEXT_BASE_GENERATION_INSTRUCTIONS`;
- `question_generation_prompt_for` + `QUESTION_GENERATION_INSTRUCTIONS`;
- `rewrite_report_prompt_for` + `REWRITE_REPORT_INSTRUCTIONS`;
- `FrameworkLlamaTextInference#repair_json_response`;
- `run_admin_step!`;
- as cinco compreensões carregadas por `SkillMarkdownConfig.load`.

Assim, o Ruby continua sendo a fonte canônica dos prompts. Este documento descreve o contrato e o site recebe somente a projeção segura; divergências são detectáveis pelos hashes exportados.

## Princípio de composição

O pipeline atual estabelece a seguinte precedência:

1. papel restrito do estágio;
2. tarefa e proibições;
3. parâmetros fornecidos pelo operador;
4. recorte BNCC;
5. perfil necessário do estudante, quando autorizado;
6. compreensões pedagógicas relevantes;
7. artefatos fixados de etapas anteriores;
8. instruções de saída e schema;
9. invariantes finais de quantidade, formato e fidelidade.

As compreensões explicam o sentido do trabalho. As instruções determinam como materializar a saída. Misturar essas camadas torna auditoria e reescrita menos precisas.

## Estágios

| Estágio | Documento | Entrada principal | Saída | Revisão |
| --- | --- | --- | --- | --- |
| Módulo | [Geração de módulos](./prompt-module-generation.md) | pedido de curso + trechos BNCC | módulo estruturado | curricular |
| Texto-base | [Texto-base](./prompt-text-base.md) | habilidade + perfil + tema | abstrações, texto e compreensão | editorial/pedagógica |
| Perguntas | [Perguntas](./prompt-question-generation.md) | texto fixado + compreensão | perguntas abertas e rubricas | pedagógica |
| Resposta | [Análise](./prompt-response-analysis.md) | resposta do estudante + rubrica | decisão observável e atualização | humana obrigatória |
| Auditoria | [Reescrita](./prompt-audit-rewrite.md) | pipeline completo + resultados | diagnóstico e proposta de melhoria | mantenedor pedagógico |
| Reparo | [JSON](./prompt-json-repair.md) | prompt original + saída quebrada + erro | JSON reconstruído | validação automática e revisão por impacto |

## Invariantes globais

- Não inventar código de habilidade BNCC.
- Indicar quando uma conclusão não está expressa na fonte.
- Preservar o texto-base entre geração de material e geração de perguntas.
- Manter perguntas diagnósticas abertas quando o contrato pedagógico assim exigir.
- Não confundir resposta de referência com gabarito único.
- Exigir evidência observável, não apenas resposta final.
- Não atualizar competência com reputação social ou placar de competição.
- Não declarar execução externa que não ocorreu.
- Não expor segredo, dado pessoal ou cadeia de pensamento.
- Não publicar saída de modelo sem revisão humana apropriada.

## Contexto mínimo e contexto proibido

O motor deve receber apenas os dados necessários ao estágio. Um prompt de geração curricular pode receber série, área, habilidade e necessidades pedagógicas; não precisa de nome, e-mail ou histórico social do estudante.

São proibidos no contexto público:

- credenciais e tokens;
- endereço, contato ou identificador direto de menor;
- resposta individual associada a identidade pública;
- diagnóstico sensível sem base e autorização;
- histórico integral de conversa quando um resumo suficiente existe;
- instruções para revelar raciocínio interno.

## Validação

Cada estágio estruturado passa por quatro níveis:

1. **Sintaxe:** JSON analisável e texto UTF-8 limpo.
2. **Estrutura:** presença e tipo dos campos obrigatórios.
3. **Invariantes:** quantidade, identidade da habilidade, imutabilidade de artefatos fixados e valores enumerados.
4. **Semântica:** alinhamento à fonte, adequação etária, qualidade pedagógica e segurança, decididos por humano.

O pipeline atual valida apenas parte da estrutura em código. A documentação estabelece o contrato completo para evolução segura.

## Temperatura, tokens e modelo

No runtime Ruby atual, os parâmetros são configuráveis por ambiente, com temperatura padrão baixa (`0.2`) e limite de tokens configurável. Identidade de modelo e endpoint são metadados de execução; não fazem parte da verdade curricular. A troca de modelo exige nova verificação de aderência aos schemas e não promove automaticamente materiais anteriores.

## Resultado observável, não raciocínio oculto

Para auditoria, conservar:

- prompt/template e versão;
- referências de entrada;
- saída bruta quando permitido;
- saída normalizada;
- erros de parsing;
- validações realizadas;
- decisão e observação humanas;
- versão publicada.

Não conservar ou exigir explicações passo a passo de raciocínio interno. Justificativas pedagógicas devem ser curtas, referenciadas e avaliáveis, como “a pergunta exige localizar a expressão X no parágrafo Y”.

## Evolução

Alterações de prompt devem ser versionadas quando mudarem schema, fonte admitida, ordem de contexto, invariante ou critério de avaliação. Ajustes ortográficos sem mudança de significado podem permanecer na mesma versão, mas ainda devem ser anotados em [log.md](./log.md).
