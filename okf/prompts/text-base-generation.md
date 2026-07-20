---
type: "Prompt Template"
title: "Geração de texto-base"
description: "Composição real para gerar abstrações, texto-base e compreensão-base."
tags: ["okf", "prompt", "generation", "ruby"]
timestamp: "2026-07-13T00:00:00-03:00"
visibility: "internal-repository"
source: "inicio.rb"
source_symbol: "text_base_generation_prompt_for + TEXT_BASE_GENERATION_INSTRUCTIONS"
source_sha256: "00174c84115493a30a719f498be49fef8ffe219f773458bdddeb02ee99b3355e"
legacy_okf_status: "reconstructed-from-remnants"
---

# Geração de texto-base

Este conceito é exportado programaticamente do script Ruby legado. Ele preserva
a composição real usada pelo motor; não é uma paráfrase documental.

## Responsabilidade

- Estágio: generation
- Fonte canônica: inicio.rb / text_base_generation_prompt_for + TEXT_BASE_GENERATION_INSTRUCTIONS
- Visibilidade: repositório técnico; não carregar integralmente na projeção pública.
- Supervisão: validação estrutural e revisão humana conforme impacto pedagógico.

## Composição real do prompt

~~~~ruby
    VocÃª Ã© a inferÃªncia textual comum da aplicaÃ§Ã£o Glauco.

    Gere apenas o texto-base e sua compreensÃ£o-base dedicada para uma sondagem
    diagnÃ³stica de #{BNCC_SKILL[:componente]}, #{BNCC_SKILL[:serie_base]},
    habilidade #{BNCC_SKILL[:codigo]}.

    NÃ£o atue como agente RLM.
    NÃ£o administre o quiz.
    NÃ£o gere perguntas nesta etapa.

    Tema da sondagem: #{tema}
    ObservaÃ§Ã£o humana inicial: #{observacao_geral}

    RECORTE BNCC:
    #{JSON.pretty_generate(BNCC_SKILL)}

    PERFIL DO ALUNO:
    #{JSON.pretty_generate(STUDENT_PROFILE)}

    COMPREENSÃƒO 1 â€” CONTEXTO BNCC:
    #{BNCC_CONTEXT_COMPREHENSION}

    COMPREENSÃƒO 2 â€” GERAÃ‡ÃƒO DO TEXTO-BASE:
    #{TEXT_BASE_COMPREHENSION}

    COMPREENSÃƒO 3 â€” ANÃLISE INTERNA DO TEXTO-BASE:
    #{TEXT_BASE_INTERNAL_ANALYSIS_COMPREHENSION}

    INSTRUÃ‡Ã•ES DE SAÃDA:
    #{TEXT_BASE_GENERATION_INSTRUCTIONS}
~~~~

## Instruções reais de saída

~~~~text
  Gere somente o texto-base e sua compreensÃ£o-base dedicada.

  Retorne somente JSON vÃ¡lido, sem markdown, sem comentÃ¡rio e sem bloco de cÃ³digo.

  Estrutura obrigatÃ³ria:

  {
    "bncc_codigo": "#{BNCC_SKILL[:codigo]}",
    "disciplina": "#{BNCC_SKILL[:componente]}",
    "etapa": "#{BNCC_SKILL[:etapa]}",
    "serie": "#{BNCC_SKILL[:serie_base]}",
    "campo": "#{BNCC_SKILL[:campo]}",
    "tema": "...",
    "abstracoes_narrativas": {
      "situacao_concreta": "...",
      "antecedentes": ["...", "..."],
      "participantes": [
        {
          "nome": "...",
          "papel_social": "...",
          "interesse_no_conflito": "...",
          "modo_de_falar": "..."
        }
      ],
      "fatos_em_ordem": ["...", "...", "..."],
      "tensao_central": "...",
      "tese_de_abertura": "...",
      "problema_argumentativo": "...",
      "pistas_textuais_planejadas": ["...", "..."],
      "falas_planejadas": [
        {
          "personagem": "...",
          "intencao": "...",
          "fala_natural": "..."
        }
      ],
      "retomada_da_tese_no_fechamento": "...",
      "consequencia_pedagogica": "..."
    },
    "texto_base": {
      "genero": "...",
      "titulo": "...",
      "estrutura": {
        "inicio": "...",
        "conteudo_central": {
          "paragrafos": ["...", "..."],
          "falas": [
            {
              "personagem": "...",
              "fala": "..."
            }
          ]
        },
        "fechamento": "..."
      },
      "conteudo": "..."
    },
    "compreensao_base": {
      "situacao_comunicativa": "...",
      "finalidade_do_texto": "...",
      "estrutura_narrativa": {
        "inicio": "...",
        "conteudo_central": {
          "funcao_dos_paragrafos": "...",
          "funcao_das_falas": "...",
          "falas_relevantes": [
            {
              "personagem": "...",
              "fala": "...",
              "funcao_interpretativa": "..."
            }
          ]
        },
        "fechamento": "..."
      },
      "trecho_opiniao_legitima": "...",
      "trecho_discurso_de_odio": "...",
      "pistas_textuais": ["...", "..."],
      "limite_interpretativo": "...",
      "erro_provavel_do_aluno": "...",
      "operacoes_para_avaliar": ["...", "..."],
      "evidencias_de_dominio": ["...", "..."]
    }
  }

  Regras:
  - nÃ£o gerar perguntas nesta etapa;
  - nÃ£o gerar gabarito nesta etapa;
  - gerar texto-base obrigatoriamente equivalente a uma lauda de pÃ¡gina de texto;
  - usar como referÃªncia uma extensÃ£o entre 550 e 750 palavras, com parÃ¡grafos
    desenvolvidos e continuidade lÃ³gica suficiente para parecer uma pÃ¡gina completa;
  - nÃ£o entregar texto curto, resumo, sinopse, cena apressada ou conjunto de falas
    soltas;
  - antes de escrever o texto_base, gerar abstracoes_narrativas completas;
  - as abstracoes_narrativas devem conter fatos concretos, antecedentes,
    participantes com interesses prÃ³prios, sequÃªncia causal e consequÃªncia;
  - as abstracoes_narrativas devem explicitar tese_de_abertura,
    problema_argumentativo e retomada_da_tese_no_fechamento;
  - o texto-base deve ter carÃ¡ter argumentativo como moldura: o inÃ­cio apresenta
    uma tese, problema ou ponto de vista em disputa, e o fechamento retoma essa
    tese com consequÃªncia, sÃ­ntese, impasse ou posicionamento;
  - o conteÃºdo central pode ser narrativo, expositivo, dialogal, investigativo,
    instrucional ou outro formato necessÃ¡rio Ã  habilidade; ele nÃ£o precisa ser
    composto por argumentos formais, mas deve sustentar a tese aberta no inÃ­cio
    e retomada no fechamento;
  - nÃ£o usar falas genÃ©ricas como "precisamos respeitar"; cada fala deve nascer
    de um interesse, reaÃ§Ã£o, dÃºvida ou conflito concreto da cena;
  - o texto_base.conteudo deve transformar as abstracoes_narrativas em narrativa
    natural, sem parecer resumo esquemÃ¡tico;
  - organizar o texto-base com inÃ­cio, conteÃºdo central e fechamento;
  - manter o conteÃºdo central separado do inÃ­cio e do fechamento;
  - o campo estrutura.conteudo_central.paragrafos deve conter apenas parÃ¡grafos
    narrativos do conteÃºdo central;
  - o campo estrutura.conteudo_central.falas deve conter apenas falas, cada uma
    com personagem e fala;
  - o campo conteudo deve ser texto corrido em parÃ¡grafos, incluindo as falas em
    linhas separadas, sem virar lista esquemÃ¡tica;
  - simular situaÃ§Ã£o social plausÃ­vel para estudante de #{BNCC_SKILL[:serie_base]};
  - evitar violÃªncia explÃ­cita pesada;
  - preservar clareza entre crÃ­tica legÃ­tima e ataque discriminatÃ³rio;
  - deixar pistas textuais suficientes para perguntas posteriores;
  - aplicar a anÃ¡lise detalhada do conteÃºdo central conforme
    TEXT_BASE_INTERNAL_ANALYSIS_COMPREHENSION.
~~~~

## Contrato de consumo

O pipeline DEVE aplicar as compreensões e entradas referenciadas pela composição
antes destas instruções. O frontend público recebe apenas versão, finalidade,
fontes, aprovação e artefato resultante.
