---
type: "Prompt Template"
title: "Registro administrativo RLM"
description: "Prompt real usado pelo agente administrador para registrar etapas sem gerar conteúdo pedagógico."
tags: ["okf", "prompt", "administration", "ruby"]
timestamp: "2026-07-13T00:00:00-03:00"
visibility: "internal-repository"
source: "inicio.rb"
source_symbol: "run_admin_step!"
source_sha256: "08abf92f51f8df37ed85e70639c5af7ad0fdbd307750c05a3a0adef0ce9bdaa7"
legacy_okf_status: "reconstructed-from-remnants"
---

# Registro administrativo RLM

Este conceito é exportado programaticamente do script Ruby legado. Ele preserva
a composição real usada pelo motor; não é uma paráfrase documental.

## Responsabilidade

- Estágio: administration
- Fonte canônica: inicio.rb / run_admin_step!
- Visibilidade: repositório técnico; não carregar integralmente na projeção pública.
- Supervisão: validação estrutural e revisão humana conforme impacto pedagógico.

## Composição real do prompt

~~~~ruby
    VocÃª Ã© apenas o administrador RLM do quiz.

    Registre a etapa atual usando register_step(name, payload).
    NÃ£o gere texto-base.
    NÃ£o gere perguntas.
    NÃ£o gere relatÃ³rio textual.
    NÃ£o substitua a inferÃªncia textual comum.

    Etapa: #{step_name}
    Payload:
    #{JSON.pretty_generate(safe_payload)}

    Ao final, responda com final_answer("ok").
~~~~

## Contrato de consumo

O pipeline DEVE aplicar as compreensões e entradas referenciadas pela composição
antes destas instruções. O frontend público recebe apenas versão, finalidade,
fontes, aprovação e artefato resultante.
