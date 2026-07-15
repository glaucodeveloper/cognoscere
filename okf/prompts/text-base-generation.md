---
type: "Prompt Template"
title: "Geração de texto-base"
description: "Composição real para gerar abstrações, texto-base e compreensão-base."
tags: ["okf", "prompt", "generation", "ruby"]
timestamp: "2026-07-13T00:00:00-03:00"
visibility: "internal-repository"
source: "inicio.rb"
source_symbol: "text_base_generation_prompt_for + TEXT_BASE_GENERATION_INSTRUCTIONS"
source_sha256: "8486705195472388d9615c53d7f6b94a002533e27a34d4973e531c15f7737d1c"
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
    Você é a inferência textual comum da aplicação Glauco.

    Gere apenas o texto-base e sua compreensão-base dedicada para uma sondagem
    diagnóstica de #{BNCC_SKILL[:componente]}, #{BNCC_SKILL[:serie_base]},
    habilidade #{BNCC_SKILL[:codigo]}.

    Não atue como agente RLM.
    Não administre o quiz.
    Não gere perguntas nesta etapa.

    Tema da sondagem: #{tema}
    Observação humana inicial: #{observacao_geral}

    RECORTE BNCC:
    #{JSON.pretty_generate(BNCC_SKILL)}

    PERFIL DO ALUNO:
    #{JSON.pretty_generate(STUDENT_PROFILE)}

    COMPREENSÃO 1 — CONTEXTO BNCC:
    #{BNCC_CONTEXT_COMPREHENSION}

    COMPREENSÃO 2 — GERAÇÃO DO TEXTO-BASE:
    #{TEXT_BASE_COMPREHENSION}

    COMPREENSÃO 3 — ANÁLISE INTERNA DO TEXTO-BASE:
    #{TEXT_BASE_INTERNAL_ANALYSIS_COMPREHENSION}

    INSTRUÇÕES DE SAÍDA:
    #{TEXT_BASE_GENERATION_INSTRUCTIONS}
~~~~

## Instruções reais de saída

~~~~text
  Gere somente o texto-base e sua compreensão-base dedicada.

  Retorne somente JSON válido, sem markdown, sem comentário e sem bloco de código.

  Estrutura obrigatória:

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
  - não gerar perguntas nesta etapa;
  - não gerar gabarito nesta etapa;
  - gerar texto-base obrigatoriamente equivalente a uma lauda de página de texto;
  - usar como referência uma extensão entre 550 e 750 palavras, com parágrafos
    desenvolvidos e continuidade lógica suficiente para parecer uma página completa;
  - não entregar texto curto, resumo, sinopse, cena apressada ou conjunto de falas
    soltas;
  - antes de escrever o texto_base, gerar abstracoes_narrativas completas;
  - as abstracoes_narrativas devem conter fatos concretos, antecedentes,
    participantes com interesses próprios, sequência causal e consequência;
  - as abstracoes_narrativas devem explicitar tese_de_abertura,
    problema_argumentativo e retomada_da_tese_no_fechamento;
  - o texto-base deve ter caráter argumentativo como moldura: o início apresenta
    uma tese, problema ou ponto de vista em disputa, e o fechamento retoma essa
    tese com consequência, síntese, impasse ou posicionamento;
  - o conteúdo central pode ser narrativo, expositivo, dialogal, investigativo,
    instrucional ou outro formato necessário à habilidade; ele não precisa ser
    composto por argumentos formais, mas deve sustentar a tese aberta no início
    e retomada no fechamento;
  - não usar falas genéricas como "precisamos respeitar"; cada fala deve nascer
    de um interesse, reação, dúvida ou conflito concreto da cena;
  - o texto_base.conteudo deve transformar as abstracoes_narrativas em narrativa
    natural, sem parecer resumo esquemático;
  - organizar o texto-base com início, conteúdo central e fechamento;
  - manter o conteúdo central separado do início e do fechamento;
  - o campo estrutura.conteudo_central.paragrafos deve conter apenas parágrafos
    narrativos do conteúdo central;
  - o campo estrutura.conteudo_central.falas deve conter apenas falas, cada uma
    com personagem e fala;
  - o campo conteudo deve ser texto corrido em parágrafos, incluindo as falas em
    linhas separadas, sem virar lista esquemática;
  - simular situação social plausível para estudante de #{BNCC_SKILL[:serie_base]};
  - evitar violência explícita pesada;
  - preservar clareza entre crítica legítima e ataque discriminatório;
  - deixar pistas textuais suficientes para perguntas posteriores;
  - aplicar a análise detalhada do conteúdo central conforme
    TEXT_BASE_INTERNAL_ANALYSIS_COMPREHENSION.
~~~~

## Contrato de consumo

O pipeline DEVE aplicar as compreensões e entradas referenciadas pela composição
antes destas instruções. O frontend público recebe apenas versão, finalidade,
fontes, aprovação e artefato resultante.
