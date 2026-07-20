---
type: "Prompt Template"
title: "Auditoria e relatório de reescrita"
description: "Composição real que diferencia falhas do aluno, pergunta e texto-base."
tags: ["okf", "prompt", "audit", "ruby"]
timestamp: "2026-07-13T00:00:00-03:00"
visibility: "internal-repository"
source: "inicio.rb"
source_symbol: "rewrite_report_prompt_for + REWRITE_REPORT_INSTRUCTIONS"
source_sha256: "3bbc03af2f0366424cb12ef915dfafdb90c57388695afafc51d459d6e3eef4ff"
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
    VocÃª Ã© a inferÃªncia textual comum da aplicaÃ§Ã£o Glauco.

    Gere um relatÃ³rio textual para reescrever os textos do programa.

    NÃ£o atue como agente RLM.
    NÃ£o administre o quiz.

    RECORTE BNCC:
    #{JSON.pretty_generate(BNCC_SKILL)}

    PERFIL DO ALUNO:
    #{JSON.pretty_generate(STUDENT_PROFILE)}

    COMPREENSÃ•ES USADAS:
    - Contexto BNCC:
    #{BNCC_CONTEXT_COMPREHENSION}

    - GeraÃ§Ã£o do texto-base:
    #{TEXT_BASE_COMPREHENSION}

    - AnÃ¡lise interna do texto-base:
    #{TEXT_BASE_INTERNAL_ANALYSIS_COMPREHENSION}

    - TÃ³pico das perguntas:
    #{QUESTION_TOPIC_COMPREHENSION}

    - RelatÃ³rio de reescrita:
    #{REWRITE_REPORT_COMPREHENSION}

    TEXTO-BASE E COMPREENSÃƒO-BASE GERADOS:
    #{JSON.pretty_generate(text_base_payload)}

    QUIZ GERADO:
    #{JSON.pretty_generate(quiz)}

    RESULTADOS OBSERVADOS:
    #{JSON.pretty_generate(results)}

    INSTRUÃ‡Ã•ES DE SAÃDA:
    #{REWRITE_REPORT_INSTRUCTIONS}
~~~~

## Instruções reais de saída

~~~~text
  Produza o relatÃ³rio com estas seÃ§Ãµes:

  1. DiagnÃ³stico do texto de contexto BNCC
  2. DiagnÃ³stico da compreensÃ£o usada para gerar o texto-base
  3. Qualidade do texto-base gerado
  4. Qualidade da compreensÃ£o-base gerada junto ao texto-base
  5. DiagnÃ³stico da compreensÃ£o sobre o tÃ³pico das perguntas
  6. Qualidade das perguntas geradas
  7. EvidÃªncias vindas das respostas do aluno
  8. SeparaÃ§Ã£o entre dificuldade do aluno, falha da pergunta e falha do texto-base
  9. RecomendaÃ§Ãµes para reescrever os textos de compreensÃ£o do programa
  10. VersÃ£o reescrita sugerida das compreensÃµes centrais

  NÃ£o retornar JSON. Retornar texto estruturado em seÃ§Ãµes.
~~~~

## Contrato de consumo

O pipeline DEVE aplicar as compreensões e entradas referenciadas pela composição
antes destas instruções. O frontend público recebe apenas versão, finalidade,
fontes, aprovação e artefato resultante.
