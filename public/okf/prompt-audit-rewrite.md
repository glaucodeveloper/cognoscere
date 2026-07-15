---
type: "prompt-spec"
title: "Prompt de auditoria e reescrita"
description: "Contrato para diagnosticar o pipeline e propor melhoria das compreensões e instruções pedagógicas."
tags: ["okf", "prompt", "auditoria", "reescrita", "qualidade"]
timestamp: "2026-07-13T00:00:00-03:00"
stage: "audit-rewrite"
status: "current-contract"
---

# Prompt de auditoria e reescrita

## Responsabilidade

Examinar o sistema de geração depois de uma aplicação e produzir um relatório para melhorar as compreensões do programa. O objetivo não é apenas comentar o estudante. É separar falhas de contexto, texto-base, pergunta, aplicação e compreensão pedagógica.

O relatório atual é textual, estruturado em seções, e não JSON. Ele não deve ser publicado automaticamente como verdade sobre o estudante.

## Entradas

- recorte BNCC;
- perfil pedagógico utilizado;
- cinco compreensões da habilidade;
- texto-base, abstrações e compreensão-base gerados;
- quiz gerado;
- resultados observados;
- decisões e observações humanas;
- instruções de auditoria.

Dados individuais devem ser anonimizados sempre que o diagnóstico puder ser feito sem identidade. Exemplos de resposta devem ser minimizados e ter finalidade pedagógica clara.

## Ordem do contexto

1. papel restrito de inferência textual comum;
2. objetivo de reescrever os textos do programa;
3. proibição de administrar o quiz;
4. recorte BNCC;
5. perfil pedagógico mínimo;
6. compreensões usadas;
7. texto-base e compreensão-base;
8. quiz;
9. resultados autorizados;
10. estrutura obrigatória do relatório.

## Estrutura do output

O relatório possui dez seções:

1. diagnóstico do texto de contexto BNCC;
2. diagnóstico da compreensão usada para gerar o texto-base;
3. qualidade do texto-base gerado;
4. qualidade da compreensão-base;
5. diagnóstico da compreensão sobre o tópico das perguntas;
6. qualidade das perguntas;
7. evidências vindas das respostas;
8. separação entre dificuldade do estudante, falha da pergunta e falha do texto-base;
9. recomendações de reescrita;
10. versão reescrita sugerida das compreensões centrais.

## Matriz causal

| Possível causa | Evidência necessária | Ação adequada |
| --- | --- | --- |
| Fonte insuficiente | lacuna ou ambiguidade no recorte | consultar fonte primária |
| Compreensão genérica | prompt não define operações/pistas | curar a compreensão |
| Texto-base fraco | falta contexto, pistas ou continuidade | regenerar após revisão do prompt |
| Pergunta fraca | vagueza, indução ou pista ausente | reescrever pergunta/rubrica |
| Aplicação inconsistente | instrução ou mediação variou | revisar protocolo humano |
| Dificuldade observada | resposta não sustenta operação apesar de item válido | planejar mediação e nova evidência |
| Erro de parsing | saída incompleta/malformada | aplicar [reparo controlado](./prompt-json-repair.md) |

O relatório deve evitar atribuir toda falha ao estudante. Também não deve concluir que um único resultado prova defeito sistêmico; padrões exigem amostra e revisão.

## Invariantes

- Preservar distinção entre fonte, compreensão, instrução e artefato.
- Citar exemplos observáveis sem expor identidade desnecessária.
- Identificar incerteza e dados insuficientes.
- Propor texto reescrito explícito, não apenas recomendação vaga.
- Não alterar automaticamente a configuração vigente.
- Não promover recomendação sem revisão humana.
- Não solicitar ou publicar cadeia de pensamento.
- Não usar o relatório para rotular definitivamente um estudante.

## Avaliação do relatório

O mantenedor pedagógico deve verificar:

- se as causas foram realmente separadas;
- se a proposta preserva a habilidade BNCC;
- se a reescrita reduz ambiguidade sem conduzir respostas;
- se as recomendações são executáveis;
- se há risco de viés produzido por uma amostra pequena;
- se uma nova geração/regressão deve ser executada.

## Ciclo de promoção

```text
relatório gerado
  → revisão pedagógica
  → proposta de alteração versionada
  → teste com fixtures não identificáveis
  → comparação com versão anterior
  → aprovação
  → atualização da compreensão/template
  → registro em log
```

O bundle público pode documentar a versão aprovada e um resumo da mudança. Respostas brutas e relatórios individuais permanecem no domínio privado descrito em [Contratos](./contracts.md).
