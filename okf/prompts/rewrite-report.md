---
type: "Prompt Template"
title: "Auditoria e relatório de reescrita"
description: "Composição real que diferencia falhas do aluno, pergunta e texto-base."
tags: ["okf", "prompt", "audit", "ruby"]
timestamp: "2026-07-13T00:00:00-03:00"
visibility: "internal-repository"
source: "inicio.rb"
source_symbol: "rewrite_report_prompt_for + REWRITE_REPORT_INSTRUCTIONS"
source_sha256: "47b598a651fd7cb2510f7a201d5b05dbfa8dda767c4b8692098bd06d5b11ed12"
legacy_okf_status: "reconstructed-from-remnants"
---

# Auditoria e relatório de reescrita

Este conceito é exportado programaticamente do script Ruby legado. Ele preserva
a composição real usada pelo motor; não é uma paráfrase documental.

## Responsabilidade

- Estágio: audit
- Fonte canônica: inicio.rb / rewrite_report_prompt_for + REWRITE_REPORT_INSTRUCTIONS
- Visibilidade: repositório técnico; não carregar integralmente na projeção pública.
- Supervisão: validação estrutural e revisão humana conforme impacto pedagógico.

## Composição real do prompt

~~~~ruby
    Você é a inferência textual comum da aplicação Glauco.

    Gere um relatório textual para reescrever os textos do programa.

    Não atue como agente RLM.
    Não administre o quiz.

    RECORTE BNCC:
    #{JSON.pretty_generate(BNCC_SKILL)}

    PERFIL DO ALUNO:
    #{JSON.pretty_generate(STUDENT_PROFILE)}

    COMPREENSÕES USADAS:
    - Contexto BNCC:
    #{BNCC_CONTEXT_COMPREHENSION}

    - Geração do texto-base:
    #{TEXT_BASE_COMPREHENSION}

    - Análise interna do texto-base:
    #{TEXT_BASE_INTERNAL_ANALYSIS_COMPREHENSION}

    - Tópico das perguntas:
    #{QUESTION_TOPIC_COMPREHENSION}

    - Relatório de reescrita:
    #{REWRITE_REPORT_COMPREHENSION}

    TEXTO-BASE E COMPREENSÃO-BASE GERADOS:
    #{JSON.pretty_generate(text_base_payload)}

    QUIZ GERADO:
    #{JSON.pretty_generate(quiz)}

    RESULTADOS OBSERVADOS:
    #{JSON.pretty_generate(results)}

    INSTRUÇÕES DE SAÍDA:
    #{REWRITE_REPORT_INSTRUCTIONS}
~~~~

## Instruções reais de saída

~~~~text
  Produza o relatório com estas seções:

  1. Diagnóstico do texto de contexto BNCC
  2. Diagnóstico da compreensão usada para gerar o texto-base
  3. Qualidade do texto-base gerado
  4. Qualidade da compreensão-base gerada junto ao texto-base
  5. Diagnóstico da compreensão sobre o tópico das perguntas
  6. Qualidade das perguntas geradas
  7. Evidências vindas das respostas do aluno
  8. Separação entre dificuldade do aluno, falha da pergunta e falha do texto-base
  9. Recomendações para reescrever os textos de compreensão do programa
  10. Versão reescrita sugerida das compreensões centrais

  Não retornar JSON. Retornar texto estruturado em seções.
~~~~

## Contrato de consumo

O pipeline DEVE aplicar as compreensões e entradas referenciadas pela composição
antes destas instruções. O frontend público recebe apenas versão, finalidade,
fontes, aprovação e artefato resultante.
