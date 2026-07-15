---
type: "Prompt Template"
title: "Geração de perguntas diagnósticas"
description: "Composição real para gerar perguntas abertas sobre texto-base fixado."
tags: ["okf", "prompt", "generation", "ruby"]
timestamp: "2026-07-13T00:00:00-03:00"
visibility: "internal-repository"
source: "inicio.rb"
source_symbol: "question_generation_prompt_for + QUESTION_GENERATION_INSTRUCTIONS"
source_sha256: "bd3844e04c437039f728bbb2e8a1e84c96b0d1e1cb4094c8e0ba18328d526d01"
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
    Você é a inferência textual comum da aplicação Glauco.

    Gere perguntas diagnósticas de #{BNCC_SKILL[:componente]} para #{BNCC_SKILL[:serie_base]},
    habilidade #{BNCC_SKILL[:codigo]},
    usando exclusivamente o texto-base e a compreensão-base já gerados.

    Não atue como agente RLM.
    Não administre o quiz.
    Não gere novo texto-base.
    Não altere o texto-base.

    Tema da sondagem: #{tema}
    Quantidade de perguntas: #{quantidade}
    Observação humana inicial: #{observacao_geral}

    RECORTE BNCC:
    #{JSON.pretty_generate(BNCC_SKILL)}

    PERFIL DO ALUNO:
    #{JSON.pretty_generate(STUDENT_PROFILE)}

    COMPREENSÃO 1 — CONTEXTO BNCC:
    #{BNCC_CONTEXT_COMPREHENSION}

    COMPREENSÃO 2 — TÓPICO DAS PERGUNTAS:
    #{QUESTION_TOPIC_COMPREHENSION}

    TEXTO-BASE FIXADO:
    #{JSON.pretty_generate(text_base_payload.fetch("texto_base"))}

    COMPREENSÃO-BASE DO TEXTO-BASE:
    #{JSON.pretty_generate(text_base_payload.fetch("compreensao_base"))}

    INSTRUÇÕES DE SAÍDA:
    #{QUESTION_GENERATION_INSTRUCTIONS}

    Gere exatamente #{quantidade} perguntas abertas de sondagem.
    Cada pergunta deve ter enunciado amplo, mas analisável, pedindo justificativa
    com pistas do texto-base. Não gere alternativas, gabarito por letra nem item
    de múltipla escolha.
    A pergunta deve permitir análise profunda da compreensão do aluno, incluindo
    rubrica, resposta de referência, evidências esperadas e erro provável.
    O campo "texto_base" do JSON final deve repetir o mesmo texto_base recebido.
~~~~

## Instruções reais de saída

~~~~text
  Gere perguntas diagnósticas para #{BNCC_SKILL[:componente]}, #{BNCC_SKILL[:serie_base]},
  trabalhando exclusivamente a habilidade #{BNCC_SKILL[:codigo]}.

  Retorne somente JSON válido, sem markdown, sem comentário e sem bloco de código.

  Estrutura obrigatória:

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
  - não gerar novo texto-base;
  - não alterar gênero, título ou conteúdo do texto-base;
  - gerar exatamente a quantidade solicitada de perguntas;
  - gerar somente perguntas de resposta aberta;
  - não gerar alternativas;
  - não gerar resposta correta como letra;
  - cada pergunta deve ter enunciado aberto para sondagem, sem conduzir a resposta;
  - cada pergunta deve exigir justificativa com pistas explícitas do texto-base;
  - cada pergunta deve permitir análise profunda do raciocínio do aluno;
  - cobrir reconhecimento de opinião legítima;
  - cobrir identificação de discurso de ódio;
  - cobrir diferenciação entre crítica e ataque discriminatório;
  - cobrir possibilidade de posicionamento ou denúncia;
  - cobrir justificativa textual;
  - a resposta_referencia deve ser parâmetro de análise, não gabarito único;
  - a rubrica_analise deve diferenciar domínio observado, domínio em formação,
    resposta sem evidência textual, erro de compreensão e necessidade de mediação;
  - não gerar perguntas de alfabetização, fonema, sílaba ou letra.
~~~~

## Contrato de consumo

O pipeline DEVE aplicar as compreensões e entradas referenciadas pela composição
antes destas instruções. O frontend público recebe apenas versão, finalidade,
fontes, aprovação e artefato resultante.
