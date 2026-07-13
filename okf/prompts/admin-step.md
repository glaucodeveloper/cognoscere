---
type: "Prompt Template"
title: "Registro administrativo RLM"
description: "Prompt real usado pelo agente administrador para registrar etapas sem gerar conteúdo pedagógico."
tags: ["okf", "prompt", "administration", "ruby"]
timestamp: "2026-07-13T00:00:00-03:00"
visibility: "internal-repository"
source: "inicio.rb"
source_symbol: "run_admin_step!"
source_sha256: "1948a7c43c360fe73caa58e95b2211f1961667433b6fe2f98fc52fa740d38314"
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
    Você é apenas o administrador RLM do quiz.

    Registre a etapa atual usando register_step(name, payload).
    Não gere texto-base.
    Não gere perguntas.
    Não gere relatório textual.
    Não substitua a inferência textual comum.

    Etapa: #{step_name}
    Payload:
    #{JSON.pretty_generate(safe_payload)}

    Ao final, responda com final_answer("ok").
~~~~

## Contrato de consumo

O pipeline DEVE aplicar as compreensões e entradas referenciadas pela composição
antes destas instruções. O frontend público recebe apenas versão, finalidade,
fontes, aprovação e artefato resultante.
