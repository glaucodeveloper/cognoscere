---
type: "Prompt Template"
title: "Geração de perguntas diagnósticas"
description: "Composição real para gerar perguntas abertas sobre texto-base fixado."
tags: ["okf", "prompt", "generation", "ruby"]
timestamp: "2026-07-13T00:00:00-03:00"
visibility: "internal-repository"
source: "inicio.rb"
source_symbol: "question_generation_prompt_for + QUESTION_GENERATION_INSTRUCTIONS"
source_sha256: "17d56456f608f25f0eaa742ac288bab39ac6d87fedc45c04d6fbf1c7792cadce"
legacy_okf_status: "reconstructed-from-remnants"
---

# Geração de perguntas diagnósticas

Este conceito é exportado programaticamente do script Ruby legado. Ele preserva
a composição real usada pelo motor; não é uma paráfrase documental.

## Responsabilidade

- Estágio: generation
- Fonte canônica: inicio.rb / question_generation_prompt_for + QUESTION_GENERATION_INSTRUCTIONS
- Visibilidade: repositório técnico; não carregar integralmente na projeção pública.
- Supervisão: validação estrutural e revisão humana conforme impacto pedagógico.

## Composição real do prompt

~~~~ruby
    VocÃª Ã© a inferÃªncia textual comum da aplicaÃ§Ã£o Glauco.

    Gere perguntas diagnÃ³sticas de #{BNCC_SKILL[:componente]} para #{BNCC_SKILL[:serie_base]},
    habilidade #{BNCC_SKILL[:codigo]},
    usando exclusivamente o texto-base e a compreensÃ£o-base jÃ¡ gerados.

    NÃ£o atue como agente RLM.
    NÃ£o administre o quiz.
    NÃ£o gere novo texto-base.
    NÃ£o altere o texto-base.

    Tema da sondagem: #{tema}
    Quantidade de perguntas: #{quantidade}
    ObservaÃ§Ã£o humana inicial: #{observacao_geral}

    RECORTE BNCC:
    #{JSON.pretty_generate(BNCC_SKILL)}

    PERFIL DO ALUNO:
    #{JSON.pretty_generate(STUDENT_PROFILE)}

    COMPREENSÃƒO 1 â€” CONTEXTO BNCC:
    #{BNCC_CONTEXT_COMPREHENSION}

    COMPREENSÃƒO 2 â€” TÃ“PICO DAS PERGUNTAS:
    #{QUESTION_TOPIC_COMPREHENSION}

    TEXTO-BASE FIXADO:
    #{JSON.pretty_generate(text_base_payload.fetch("texto_base"))}

    COMPREENSÃƒO-BASE DO TEXTO-BASE:
    #{JSON.pretty_generate(text_base_payload.fetch("compreensao_base"))}

    INSTRUÃ‡Ã•ES DE SAÃDA:
    #{QUESTION_GENERATION_INSTRUCTIONS}

    Gere exatamente #{quantidade} perguntas abertas de sondagem.
    Cada pergunta deve ter enunciado amplo, mas analisÃ¡vel, pedindo justificativa
    com pistas do texto-base. NÃ£o gere alternativas, gabarito por letra nem item
    de mÃºltipla escolha.
    A pergunta deve permitir anÃ¡lise profunda da compreensÃ£o do aluno, incluindo
    rubrica, resposta de referÃªncia, evidÃªncias esperadas e erro provÃ¡vel.
    O campo "texto_base" do JSON final deve repetir o mesmo texto_base recebido.
~~~~

## Instruções reais de saída

~~~~text
  Gere perguntas diagnÃ³sticas para #{BNCC_SKILL[:componente]}, #{BNCC_SKILL[:serie_base]},
  trabalhando exclusivamente a habilidade #{BNCC_SKILL[:codigo]}.

  Retorne somente JSON vÃ¡lido, sem markdown, sem comentÃ¡rio e sem bloco de cÃ³digo.

  Estrutura obrigatÃ³ria:

  {
    "bncc_codigo": "#{BNCC_SKILL[:codigo]}",
    "disciplina": "#{BNCC_SKILL[:componente]}",
    "etapa": "#{BNCC_SKILL[:etapa]}",
    "serie": "#{BNCC_SKILL[:serie_base]}",
    "campo": "#{BNCC_SKILL[:campo]}",
    "pratica_linguagem": "#{BNCC_SKILL[:pratica_linguagem]}",
    "objeto_conhecimento": "#{BNCC_SKILL[:objeto_conhecimento]}",
    "tema": "...",
    "texto_base": {
      "genero": "...",
      "titulo": "...",
      "conteudo": "..."
    },
    "questions": [
      {
        "id": "q1",
        "tipo_resposta": "aberta",
        "habilidade_observada": "...",
        "operacao_cognitiva": "...",
        "pergunta": "...",
        "enunciado_aberto": "...",
        "comando_para_o_aluno": "...",
        "resposta_referencia": "...",
        "rubrica_analise": {
          "dominio_observado": "...",
          "dominio_em_formacao": "...",
          "resposta_sem_evidencia_textual": "...",
          "erro_de_compreensao": "...",
          "necessidade_de_mediacao": "..."
        },
        "pistas_textuais_esperadas": ["...", "..."],
        "intervencao_humana": "...",
        "erro_provavel": "...",
        "evidencia_dominio": "...",
        "atualizacao_perfil": "..."
      }
    ]
  }

  Regras:
  - usar obrigatoriamente o texto-base recebido;
  - nÃ£o gerar novo texto-base;
  - nÃ£o alterar gÃªnero, tÃ­tulo ou conteÃºdo do texto-base;
  - gerar exatamente a quantidade solicitada de perguntas;
  - gerar somente perguntas de resposta aberta;
  - nÃ£o gerar alternativas;
  - nÃ£o gerar resposta correta como letra;
  - cada pergunta deve ter enunciado aberto para sondagem, sem conduzir a resposta;
  - cada pergunta deve exigir justificativa com pistas explÃ­citas do texto-base;
  - cada pergunta deve permitir anÃ¡lise profunda do raciocÃ­nio do aluno;
  - cobrir reconhecimento de opiniÃ£o legÃ­tima;
  - cobrir identificaÃ§Ã£o de discurso de Ã³dio;
  - cobrir diferenciaÃ§Ã£o entre crÃ­tica e ataque discriminatÃ³rio;
  - cobrir possibilidade de posicionamento ou denÃºncia;
  - cobrir justificativa textual;
  - a resposta_referencia deve ser parÃ¢metro de anÃ¡lise, nÃ£o gabarito Ãºnico;
  - a rubrica_analise deve diferenciar domÃ­nio observado, domÃ­nio em formaÃ§Ã£o,
    resposta sem evidÃªncia textual, erro de compreensÃ£o e necessidade de mediaÃ§Ã£o;
  - nÃ£o gerar perguntas de alfabetizaÃ§Ã£o, fonema, sÃ­laba ou letra.
~~~~

## Contrato de consumo

O pipeline DEVE aplicar as compreensões e entradas referenciadas pela composição
antes destas instruções. O frontend público recebe apenas versão, finalidade,
fontes, aprovação e artefato resultante.
