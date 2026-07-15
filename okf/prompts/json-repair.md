---
type: "Prompt Template"
title: "Reparo controlado de JSON"
description: "Prompt real de recuperação de saída JSON quebrada ou truncada."
tags: ["okf", "prompt", "recovery", "ruby"]
timestamp: "2026-07-13T00:00:00-03:00"
visibility: "internal-repository"
source: "inicio.rb"
source_symbol: "FrameworkLlamaTextInference#repair_json_response"
source_sha256: "7b9189e51e5ac9b829fea6a8e8d8c445dc26cf9fae5ad90eb835f237c66f2649"
legacy_okf_status: "reconstructed-from-remnants"
---

# Reparo controlado de JSON

Este conceito é exportado programaticamente do script Ruby legado. Ele preserva
a composição real usada pelo motor; não é uma paráfrase documental.

## Responsabilidade

- Estágio: recovery
- Fonte canônica: inicio.rb / FrameworkLlamaTextInference#repair_json_response
- Visibilidade: repositório técnico; não carregar integralmente na projeção pública.
- Supervisão: validação estrutural e revisão humana conforme impacto pedagógico.

## Composição real do prompt

~~~~ruby
      A resposta anterior deveria ser JSON valido, mas falhou no parsing.

      ERRO DO PARSER:
      #{json_compatible_text(parser_error.class)} - #{json_compatible_text(parser_error.message)}

      PROMPT ORIGINAL DA TAREFA:
      #{json_compatible_text(original_prompt)}

      RESPOSTA QUEBRADA OU TRUNCADA:
      #{json_compatible_text(broken_response)}

      TAREFA DE RECUPERACAO:
      Reconstrua a resposta final como JSON valido, usando o prompt original e a
      resposta quebrada como fonte. Se a resposta estiver truncada, complete a
      estrutura JSON mantendo o schema solicitado no prompt original.

      REGRAS OBRIGATORIAS:
      - Retorne somente JSON valido.
      - Nao use markdown.
      - Nao use bloco ```json.
      - Nao escreva explicacao.
      - Escape quebras de linha dentro de strings com \\n.
      - Feche corretamente objetos e arrays.
~~~~

## Contrato de consumo

O pipeline DEVE aplicar as compreensões e entradas referenciadas pela composição
antes destas instruções. O frontend público recebe apenas versão, finalidade,
fontes, aprovação e artefato resultante.
