# frozen_string_literal: true
# encoding: UTF-8

# quiz_portugues_6ano_ef69lp01_separated_comprehensions.rb
#
# Arquitetura:
#
# 1. O agente RLM administra o quiz:
#    - registra inÃ­cio;
#    - registra geraÃ§Ã£o do texto-base;
#    - registra geraÃ§Ã£o das perguntas;
#    - registra coleta de respostas;
#    - registra encerramento.
#
# 2. A inferÃªncia textual comum do Glauco gera:
#    - texto-base;
#    - compreensÃ£o-base do texto-base;
#    - perguntas;
#    - relatÃ³rio de reescrita.
#
# 3. As compreensÃµes ficam separadas das instruÃ§Ãµes:
#    - primeiro vÃªm os textos de compreensÃ£o;
#    - depois vÃªm as instruÃ§Ãµes de saÃ­da/formato;
#    - os prompts juntam compreensÃ£o + instruÃ§Ã£o apenas no momento da chamada.
#
# Uso:
#   jruby .\quiz_portugues_6ano_ef69lp01_separated_comprehensions.rb
#
# Debug no IronREPL:
#   load "quiz_portugues_6ano_ef69lp01_separated_comprehensions.rb"
#   text_llm.complete("Responda em uma frase.")
#   run_terminal_quiz!(admin_agent: admin_agent, text_llm: text_llm, admin_runtime: admin_runtime)

# %%
system_roots = [
  ENV["GLAUCO_FRAMEWORK_HOME"],
  "C:/glauco-framework",
  "C:/dev/glauco-framework"
].compact

# %%
system_root = system_roots.find { |path| File.directory?(path) } || system_roots.first
llamacpp_root = ENV.fetch("GLAUCO_LLAMACPP_ROOT", File.join(system_root, "runtime", "llama.cpp"))

llama_server_candidates = [
  ENV["GLAUCO_LLAMASERVER_BIN"],
  File.join(llamacpp_root, "b9102-cuda12-x64", "llama-server.exe"),
  File.join(llamacpp_root, "b9102-cpu-x64", "llama-server.exe"),
  File.join(Dir.home, ".docker", "bin", "inference", "llama-server.exe")
].compact

llama_server_bin = llama_server_candidates.find { |path| File.file?(path) } || llama_server_candidates.first

gemma_model_path = ENV.fetch(
  "GLAUCO_LLAMASERVER_MODEL_PATH",
  File.join(
    Dir.home,
    ".lmstudio",
    "models",
    "lmstudio-community",
    "gemma-4-E4B-it-GGUF",
    "gemma-4-E4B-it-Q4_K_M.gguf"
  )
)

ENV["GLAUCO_LLAMASERVER_BIN"] ||= llama_server_bin
ENV["GLAUCO_LLAMASERVER_MODEL_PATH"] ||= gemma_model_path
ENV["GLAUCO_LLM_PROVIDER"] ||= "llama-server"
ENV["GLAUCO_LLAMASERVER_IDENTIFIER"] ||= "google/gemma-4-e4b"
ENV["GLAUCO_LLAMASERVER_CONTEXT_LENGTH"] ||= "131072"
ENV["GLAUCO_LLAMASERVER_GPU"] ||= "max"
ENV["GLAUCO_LLAMASERVER_FIT"] ||= "off"
ENV["GLAUCO_RLM_MAX_TOKENS"] ||= "1024"

ENV["GLAUCO_LLAMASERVER_LOG_TARGET"] ||= "null"
ENV["GLAUCO_LLAMASERVER_DISABLE_LOG"] ||= "1"

# %%
require "bundler/setup"
require "glauco-framework"
require "json"
require "fileutils"
require "time"
require "securerandom"

# %%
def clean_utf8(value)
  case value
  when String
    value.to_s.dup.force_encoding(Encoding::UTF_8)
      .scrub("")
      .encode("UTF-8", invalid: :replace, undef: :replace, replace: "")
  when Hash
    value.each_with_object({}) { |(key, item), out| out[clean_utf8(key)] = clean_utf8(item) }
  when Array
    value.map { |item| clean_utf8(item) }
  else
    value
  end
end

# %%
def json_compatible_text(value)
  clean_utf8(value).to_s
    .delete_prefix("\uFEFF")
    .gsub(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/, " ")
end

# %%
RESULTS_PATH = ENV.fetch("QUIZ_RESULTS_PATH", File.join("data", "quiz_6ano_ef69lp01_separated_results.json"))
TEXT_BASE_PATH = ENV.fetch("TEXT_BASE_PATH", File.join("data", "quiz_6ano_ef69lp01_separated_textbase.json"))
REPORT_PATH = ENV.fetch("QUIZ_REPORT_PATH", File.join("data", "quiz_6ano_ef69lp01_separated_report.txt"))
REWRITE_REPORT_PATH = ENV.fetch("QUIZ_REWRITE_REPORT_PATH", File.join("data", "quiz_6ano_ef69lp01_separated_rewrite_report.txt"))

# %%
module SkillMarkdownConfig
  module_function

  def load(path)
    raise "Arquivo de habilidade nÃ£o encontrado: #{path}" unless File.exist?(path)

    sections = parse_sections(File.read(path, encoding: "UTF-8"))
    {
      path: path,
      bncc_skill: JSON.parse(extract_fenced(sections.fetch("recorte_bncc")), symbolize_names: true),
      comprehensions: {
        bncc_context: sections.fetch("bncc_context_comprehension").strip,
        text_base: sections.fetch("text_base_comprehension").strip,
        text_base_internal_analysis: sections.fetch("text_base_internal_analysis_comprehension").strip,
        question_topic: sections.fetch("question_topic_comprehension").strip,
        rewrite_report: sections.fetch("rewrite_report_comprehension").strip
      }
    }
  end

  def parse_sections(markdown)
    sections = {}
    current = nil

    markdown.each_line do |line|
      if (match = line.match(/\A##\s+([a-z0-9_]+)\s*\z/i))
        current = match[1]
        sections[current] = +""
      elsif current
        sections[current] << line
      end
    end

    sections
  end

  def extract_fenced(text)
    clean = text.to_s.strip
    return clean unless clean.include?("```")

    clean.gsub(/\A```(?:json)?\s*/i, "").gsub(/```\s*\z/, "").strip
  end
end

SKILL_MARKDOWN_DIR = File.join(__dir__, "habilidades")
DEFAULT_SKILL_MARKDOWN_PATH = Dir.glob(File.join(SKILL_MARKDOWN_DIR, "*.md")).sort.first ||
  File.join(SKILL_MARKDOWN_DIR, "ef69lp01.md")
SKILL_MARKDOWN_PATH = ENV.fetch("GLAUCO_SKILL_MARKDOWN_PATH", DEFAULT_SKILL_MARKDOWN_PATH)
SKILL_CONFIG = SkillMarkdownConfig.load(SKILL_MARKDOWN_PATH).freeze

# ============================================================
# 1. RECORTE BNCC
# ============================================================

# %%
BNCC_SKILL = SKILL_CONFIG.fetch(:bncc_skill).freeze

# ============================================================
# 2. PERFIL DO ALUNO â€” 6Âº ANO EFII
# ============================================================

# %%
STUDENT_PROFILE = {
  id: "aluno_demo_efii_6",
  nome: "Aluno demonstracional EFII",
  etapa: "Ensino Fundamental II",
  serie: "6Âº ano do Ensino Fundamental",
  faixa_etaria: "11 a 12 anos",
  fase: "transiÃ§Ã£o dos anos iniciais para os anos finais",

  funcionamento: [
    "lÃª textos curtos e mÃ©dios com autonomia parcial",
    "precisa aprender a justificar respostas com pistas do texto",
    "consegue reconhecer opiniÃ£o explÃ­cita, mas pode confundir crÃ­tica com ofensa",
    "tende a responder por julgamento pessoal quando a pergunta exige evidÃªncia textual",
    "compreende melhor quando a situaÃ§Ã£o usa gÃªneros prÃ³ximos da vida social e digital"
  ],

  necessidades: [
    "diferenciar crÃ­tica, discordÃ¢ncia, xingamento, ameaÃ§a e discurso discriminatÃ³rio",
    "reconhecer marcas linguÃ­sticas de generalizaÃ§Ã£o, inferiorizaÃ§Ã£o ou ataque a grupo",
    "identificar quando uma fala deixa de ser opiniÃ£o e passa a ferir direitos",
    "posicionar-se contra discurso de Ã³dio com justificativa textual",
    "indicar possibilidade de denÃºncia ou encaminhamento responsÃ¡vel"
  ],

  evidencias_desejadas: [
    "aponta expressÃ£o do texto que caracteriza ataque discriminatÃ³rio",
    "explica a diferenÃ§a entre discordar de uma ideia e atacar uma pessoa ou grupo",
    "reconhece que liberdade de expressÃ£o nÃ£o autoriza humilhaÃ§Ã£o, ameaÃ§a ou discriminaÃ§Ã£o",
    "seleciona uma forma responsÃ¡vel de resposta ou denÃºncia",
    "justifica a resposta com base no texto-base"
  ]
}.freeze

# ============================================================
# 3. COMPREENSÃ•ES DO PROGRAMA
#    Estas camadas descrevem o sentido do trabalho.
#    NÃ£o sÃ£o instruÃ§Ãµes de formato.
# ============================================================

# %%
BNCC_CONTEXT_COMPREHENSION = SKILL_CONFIG.fetch(:comprehensions).fetch(:bncc_context).freeze
TEXT_BASE_COMPREHENSION = SKILL_CONFIG.fetch(:comprehensions).fetch(:text_base).freeze
TEXT_BASE_INTERNAL_ANALYSIS_COMPREHENSION = SKILL_CONFIG.fetch(:comprehensions).fetch(:text_base_internal_analysis).freeze
QUESTION_TOPIC_COMPREHENSION = SKILL_CONFIG.fetch(:comprehensions).fetch(:question_topic).freeze
REWRITE_REPORT_COMPREHENSION = SKILL_CONFIG.fetch(:comprehensions).fetch(:rewrite_report).freeze

# ============================================================
# 4. INSTRUÃ‡Ã•ES DE GERAÃ‡ÃƒO
#    Estas camadas dizem como produzir a saÃ­da.
#    Ficam depois das compreensÃµes e sÃ£o usadas sÃ³ no prompt final.
# ============================================================

# %%
TEXT_BASE_GENERATION_INSTRUCTIONS = <<~TXT.freeze
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
TXT

# %%
QUESTION_GENERATION_INSTRUCTIONS = <<~TXT.freeze
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
TXT

# %%
REWRITE_REPORT_INSTRUCTIONS = <<~TXT.freeze
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
TXT

# ============================================================
# 5. INFERÃŠNCIA TEXTUAL COMUM VIA LLM DO FRAMEWORK
#    Usa o backend llama-server inicializado/configurado pelo Glauco.
#    NÃ£o usa RubyLLM.configure diretamente na aplicaÃ§Ã£o.
#    NÃ£o chama admin_agent.run para gerar texto.
# ============================================================

# %%
class FrameworkLlamaTextInference
  attr_reader :framework_agent

  def initialize(
    endpoint: ENV.fetch("GLAUCO_LLAMASERVER_ENDPOINT", "http://127.0.0.1:1234/v1"),
    model: ENV.fetch("GLAUCO_LLAMASERVER_IDENTIFIER", "google/gemma-4-e4b"),
    llm_provider: "llama-server",
    max_tokens: ENV.fetch("GLAUCO_TEXT_MAX_TOKENS", "8192").to_i,
    temperature: ENV.fetch("GLAUCO_TEXT_TEMPERATURE", "0.2").to_f
  )
    @endpoint = endpoint
    @model = model
    @llm_provider = llm_provider
    @max_tokens = max_tokens
    @temperature = temperature

    @framework_agent = GlaucoBasicPlasticAgent.new(
      endpoint: @endpoint,
      model: @model,
      llm_provider: @llm_provider
    )

    @chat = nil
  end

  def complete(prompt)
    response = framework_chat.ask(clean_utf8(prompt))
    clean_utf8(extract_response_content(response))
  end

  def json(prompt)
    raw = nil
    raw = complete(prompt)
    parse_json_payload(raw)
  rescue StandardError => e
    warn "\n[JSON] parse falhou, recuperando resposta via LLM: #{e.class} - #{e.message}"
    repaired = repair_json_response(
      original_prompt: prompt,
      broken_response: raw,
      parser_error: e
    )
    parse_json_payload(repaired)
  end

  private

  def framework_chat
    @chat ||= build_framework_chat
  end

  def build_framework_chat
    # Caminho preferencial: usar a construÃ§Ã£o de chat do prÃ³prio framework.
    # No core atual, GlaucoBasicPlasticAgent#build_chat configura o RubyLLM
    # com endpoint/model do framework e retorna o chat compatÃ­vel.
    if @framework_agent.respond_to?(:build_chat, true)
      chat = @framework_agent.send(:build_chat)

      if chat.respond_to?(:with_temperature)
        chat = chat.with_temperature(@temperature)
      end

      if chat.respond_to?(:with_params)
        chat = chat.with_params(max_tokens: @max_tokens)
      end

      return chat
    end

    raise "GlaucoBasicPlasticAgent nÃ£o expÃµe build_chat. Adicione um mÃ©todo pÃºblico no framework para inferÃªncia textual comum, por exemplo Glauco::Framework.llm_chat."
  end

  def extract_response_content(response)
    if response.respond_to?(:content)
      clean_utf8(response.content)
    elsif response.respond_to?(:message) && response.message.respond_to?(:content)
      clean_utf8(response.message.content)
    else
      clean_utf8(response)
    end
  end

  def repair_json_response(original_prompt:, broken_response:, parser_error:)
    complete <<~PROMPT
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
    PROMPT
  end
end

# %%
text_llm = FrameworkLlamaTextInference.new

# ============================================================
# 6. AGENTE RLM ADMINISTRATIVO
# ============================================================

# %%
class StudentProfileEntity
  attr_reader :events

  def initialize(data)
    @initial_data = deep_dup(data)
    @current_data = deep_dup(data)
    @events = []

    @current_data[:progressao] ||= {
      quizzes: [],
      acumulado: {
        tentativas: 0,
        respostas_com_evidencia: 0,
        aproveitamento: 0.0,
        por_operacao: {}
      }
    }
  end

  def initial_hash
    deep_dup(@initial_data)
  end

  def to_h
    deep_dup(@current_data)
  end

  def to_json(*args)
    JSON.generate(to_h, *args)
  end

  def apply_quiz_results!(quiz:, results:, bncc_skill:)
    summary = summarize(results)
    quiz_record = build_quiz_record(quiz, results, summary, bncc_skill)

    @current_data[:progressao][:quizzes] << quiz_record
    update_accumulated!(summary)
    update_observed_evidence!(results)
    update_active_reinforcements!(results)

    @current_data[:estado_atual] = state_for(summary[:evidence_rate])
    @current_data[:ultima_atualizacao] = Time.now.iso8601

    event = {
      at: Time.now.iso8601,
      type: "profile_progression",
      summary: summary,
      quiz_record: quiz_record
    }

    @events << event

    {
      summary: summary,
      state: @current_data[:estado_atual],
      profile: to_h
    }
  end

  private

  def deep_dup(value)
    Marshal.load(Marshal.dump(value))
  rescue TypeError
    JSON.parse(JSON.generate(value), symbolize_names: true)
  end

  def value_for(hash, key)
    hash[key.to_s] || hash[key.to_sym]
  end

  def summarize(results)
    total = results.size
    with_evidence = results.count { |r| value_for(r, :evidencia_textual_suficiente) }
    evidence_rate = total.positive? ? ((with_evidence.to_f / total) * 100).round(1) : 0.0

    by_operation = {}

    results.each do |result|
      operation = value_for(result, :operacao_cognitiva) || "Sem operaÃ§Ã£o"
      by_operation[operation] ||= { total: 0, with_evidence: 0, evidence_rate: 0.0 }
      by_operation[operation][:total] += 1
      by_operation[operation][:with_evidence] += 1 if value_for(result, :evidencia_textual_suficiente)
    end

    by_operation.each_value do |data|
      data[:evidence_rate] = data[:total].positive? ? ((data[:with_evidence].to_f / data[:total]) * 100).round(1) : 0.0
    end

    {
      total: total,
      with_evidence: with_evidence,
      evidence_rate: evidence_rate,
      by_operation: by_operation
    }
  end

  def build_quiz_record(quiz, results, summary, bncc_skill)
    {
      at: Time.now.iso8601,
      bncc_codigo: value_for(bncc_skill, :codigo),
      tema: value_for(quiz, :tema),
      texto_base_titulo: value_for(value_for(quiz, :texto_base) || {}, :titulo),
      total: summary[:total],
      respostas_com_evidencia: summary[:with_evidence],
      taxa_sustentacao_textual: summary[:evidence_rate],
      operacoes: summary[:by_operation],
      respostas: results.map do |result|
        {
          id: value_for(result, :id),
          evidencia_textual_suficiente: value_for(result, :evidencia_textual_suficiente),
          operacao_cognitiva: value_for(result, :operacao_cognitiva),
          evidencia_dominio: value_for(result, :evidencia_dominio),
          observacao_humana: value_for(result, :observacao_humana),
          atualizacao_perfil: value_for(result, :atualizacao_perfil)
        }
      end
    }
  end

  def update_accumulated!(summary)
    accumulated = @current_data[:progressao][:acumulado]
    accumulated[:tentativas] += summary[:total]
    accumulated[:respostas_com_evidencia] ||= accumulated.delete(:acertos) || 0
    accumulated[:respostas_com_evidencia] += summary[:with_evidence]
    accumulated[:aproveitamento] = accumulated[:tentativas].positive? ?
      ((accumulated[:respostas_com_evidencia].to_f / accumulated[:tentativas]) * 100).round(1) :
      0.0

    summary[:by_operation].each do |operation, data|
      accumulated[:por_operacao][operation] ||= { total: 0, with_evidence: 0, evidence_rate: 0.0 }
      target = accumulated[:por_operacao][operation]
      target[:total] += data[:total]
      target[:with_evidence] += data[:with_evidence]
      target[:evidence_rate] = target[:total].positive? ? ((target[:with_evidence].to_f / target[:total]) * 100).round(1) : 0.0
    end
  end

  def update_observed_evidence!(results)
    @current_data[:evidencias_observadas] ||= []

    results.each do |result|
      next unless value_for(result, :evidencia_textual_suficiente)

      @current_data[:evidencias_observadas] << {
        at: Time.now.iso8601,
        id: value_for(result, :id),
        operacao_cognitiva: value_for(result, :operacao_cognitiva),
        evidencia: value_for(result, :evidencia_dominio),
        observacao_humana: value_for(result, :observacao_humana)
      }
    end
  end

  def update_active_reinforcements!(results)
    @current_data[:reforcos_ativos] ||= []

    results.each do |result|
      next if value_for(result, :evidencia_textual_suficiente)

      @current_data[:reforcos_ativos] << {
        at: Time.now.iso8601,
        id: value_for(result, :id),
        operacao_cognitiva: value_for(result, :operacao_cognitiva),
        erro_provavel: value_for(result, :erro_provavel),
        observacao_humana: value_for(result, :observacao_humana),
        atualizacao_perfil: value_for(result, :atualizacao_perfil)
      }
    end
  end

  def state_for(evidence_rate)
    case evidence_rate.to_f
    when 0...40
      "necessita reforÃ§o estruturado na habilidade #{BNCC_SKILL[:codigo]}"
    when 40...70
      "domÃ­nio em formaÃ§Ã£o, com necessidade de justificar por pistas textuais"
    when 70...90
      "domÃ­nio funcional observado, com reforÃ§o pontual de argumentaÃ§Ã£o textual"
    else
      "domÃ­nio consistente observado na sondagem aplicada"
    end
  end
end

# %%
class QuizAdminRuntime
  attr_reader :steps, :session_id, :student_profile_entity

  def initialize(student_profile:)
    @session_id = SecureRandom.hex(6)
    @steps = []
    @student_profile_entity = StudentProfileEntity.new(student_profile)
  end

  def student_profile
    JSON.generate(@student_profile_entity.to_h)
  end

  def initial_student_profile
    JSON.generate(@student_profile_entity.initial_hash)
  end

  def progressed_profile
    JSON.generate(@student_profile_entity.to_h)
  end

  def progressed_profile_hash
    @student_profile_entity.to_h
  end

  def progress_student_profile(results, quiz = {}, bncc_skill = {})
    progression = @student_profile_entity.apply_quiz_results!(
      quiz: quiz,
      results: results,
      bncc_skill: bncc_skill
    )

    register_step("perfil_progredido", progression[:summary])
    JSON.generate(progression)
  end

  def register_step(name, payload = {})
    entry = {
      at: Time.now.iso8601,
      name: name.to_s,
      payload: payload
    }

    @steps << entry
    JSON.generate(entry)
  end

  def session_state
    JSON.generate(
      {
        session_id: @session_id,
        steps: @steps,
        initial_profile: @student_profile_entity.initial_hash,
        progressed_profile: @student_profile_entity.to_h
      }
    )
  end

  def final_answer(text)
    text.to_s
  end
end

# %%
admin_runtime = QuizAdminRuntime.new(student_profile: STUDENT_PROFILE)

# %%
admin_agent = GlaucoBasicPlasticAgent.new(
  endpoint: ENV.fetch("GLAUCO_LLAMASERVER_ENDPOINT", "http://127.0.0.1:1234/v1"),
  model: ENV.fetch("GLAUCO_LLAMASERVER_IDENTIFIER", "google/gemma-4-e4b"),
  llm_provider: "llama-server"
)

# %%
admin_agent.build_agent(
  runtime: admin_runtime,
  initial_vars: {
    "papel" => "administrador_do_quiz",
    "recorte_bncc" => BNCC_SKILL,
    "perfil_aluno" => admin_runtime.progressed_profile_hash,
    "regra" => "NÃ£o gerar texto-base, perguntas ou relatÃ³rio textual. Apenas administrar etapas e registrar decisÃµes."
  }
)

# ============================================================
# 7. FUNÃ‡Ã•ES AUXILIARES
# ============================================================

# %%
def ask(label, default: nil)
  suffix = default.nil? ? "" : " [#{default}]"
  print "#{label}#{suffix}: "
  value = STDIN.gets&.strip
  clean_utf8(value.nil? || value.empty? ? default : value)
end

# %%
def extract_json(text)
  raw = json_compatible_text(text).strip

  if raw.include?("```")
    raw = raw.gsub(/\A```(?:json|repl)?\s*/i, "")
    raw = raw.gsub(/```\s*\z/, "")
  end

  first = raw.index("{")
  last = raw.rindex("}")

  raise "Nenhum objeto JSON encontrado na resposta do LLM." unless first && last

  raw[first..last]
end

# %%
def parse_json_payload(llm_text)
  JSON.parse(json_compatible_text(extract_json(llm_text)))
rescue JSON::ParserError => e
  puts "\n=== RESPOSTA BRUTA DO LLM ==="
  puts json_compatible_text(llm_text)
  raise "Falha ao parsear JSON: #{e.message}"
end

# %%
def confirm_correct(auto_correct)
  if auto_correct
    input = ask("Detectado como correto. Confirmar? s/n", default: "s")
    input.downcase.start_with?("s")
  else
    input = ask("Detectado como incorreto. Marcar como correto pela observaÃ§Ã£o humana? s/n", default: "n")
    input.downcase.start_with?("s")
  end
end

# %%
def normalize_result_key(result, key)
  result[key.to_s] || result[key.to_sym]
end

# %%
def summarize_results(results)
  total = results.size
  with_evidence = results.count { |r| normalize_result_key(r, :evidencia_textual_suficiente) }
  evidence_rate = total.positive? ? ((with_evidence.to_f / total) * 100).round(1) : 0.0

  by_operation = {}

  results.each do |result|
    operation = normalize_result_key(result, :operacao_cognitiva) || "Sem operaÃ§Ã£o"
    by_operation[operation] ||= { total: 0, with_evidence: 0 }
    by_operation[operation][:total] += 1
    by_operation[operation][:with_evidence] += 1 if normalize_result_key(result, :evidencia_textual_suficiente)
  end

  {
    total: total,
    with_evidence: with_evidence,
    evidence_rate: evidence_rate,
    by_operation: by_operation
  }
end

# %%
def report_text(results)
  summary = summarize_results(results)
  lines = []

  lines << "=== RELATÃ“RIO DE AVALIAÃ‡ÃƒO â€” #{BNCC_SKILL[:serie_base]} / #{BNCC_SKILL[:codigo]} ==="
  lines << "Habilidade BNCC: #{BNCC_SKILL[:codigo]}"
  lines << "Total de perguntas: #{summary[:total]}"
  lines << "Respostas com evidÃªncia textual suficiente: #{summary[:with_evidence]}"
  lines << "Taxa de sustentaÃ§Ã£o textual: #{summary[:evidence_rate]}%"

  lines << "\n=== POR OPERAÃ‡ÃƒO COGNITIVA ==="
  summary[:by_operation].each do |operation, data|
    rate = ((data[:with_evidence].to_f / data[:total]) * 100).round(1)
    lines << "- #{operation}: #{data[:with_evidence]}/#{data[:total]} com evidÃªncia | #{rate}%"
  end

  lines << "\n=== EVIDÃŠNCIAS OBSERVADAS ==="
  results.each do |r|
    status = normalize_result_key(r, :evidencia_textual_suficiente) ? "DOMÃNIO COM EVIDÃŠNCIA" : "NECESSITA MEDIAÃ‡ÃƒO"
    lines << "\n#{normalize_result_key(r, :id)} â€” #{status}"
    lines << "Pergunta: #{normalize_result_key(r, :pergunta)}"
    lines << "Resposta do aluno: #{normalize_result_key(r, :resposta_aluno)}"
    lines << "Resposta de referÃªncia: #{normalize_result_key(r, :resposta_referencia)}"
    lines << "Rubrica de anÃ¡lise: #{JSON.pretty_generate(normalize_result_key(r, :rubrica_analise))}"
    lines << "ObservaÃ§Ã£o humana: #{normalize_result_key(r, :observacao_humana)}"
    lines << "EvidÃªncia esperada: #{normalize_result_key(r, :evidencia_dominio)}"
    lines << "AtualizaÃ§Ã£o do perfil: #{normalize_result_key(r, :atualizacao_perfil)}"
  end

  lines.join("\n")
end

# %%
def print_report(results)
  puts "\n\n#{report_text(results)}"
end


# %%
def print_text_base_payload(texto_base)
  return if texto_base.nil? || texto_base.empty?

  puts "GÃªnero: #{texto_base["genero"]}" if texto_base["genero"]
  puts "TÃ­tulo: #{texto_base["titulo"]}" if texto_base["titulo"]

  if texto_base["estrutura"]
    estrutura = texto_base["estrutura"]
    central = estrutura["conteudo_central"] || {}

    puts "\n[INÃCIO]"
    puts estrutura["inicio"] if estrutura["inicio"]

    if central["paragrafos"] && !central["paragrafos"].empty?
      puts "\n[CONTEÃšDO CENTRAL â€” PARÃGRAFOS]"
      central["paragrafos"].each_with_index do |paragrafo, index|
        puts "\n#{index + 1}. #{paragrafo}"
      end
    end

    if central["falas"] && !central["falas"].empty?
      puts "\n[CONTEÃšDO CENTRAL â€” FALAS]"
      central["falas"].each do |fala|
        personagem = fala["personagem"] || "Fala"
        texto = fala["fala"] || fala.to_s
        puts "#{personagem}: \"#{texto}\""
      end
    end

    puts "\n[FECHAMENTO]"
    puts estrutura["fechamento"] if estrutura["fechamento"]
  else
    puts texto_base["conteudo"] if texto_base["conteudo"]
  end
end

# %%
def save_outputs!(text_base_payload:, quiz:, results:, rewrite_report:, admin_runtime:)
  FileUtils.mkdir_p(File.dirname(RESULTS_PATH))

  payload = {
    generated_at: Time.now.iso8601,
    skill_markdown_path: SKILL_MARKDOWN_PATH,
    admin_session: JSON.parse(admin_runtime.session_state),
    bncc_skill: BNCC_SKILL,
    initial_profile: admin_runtime.student_profile_entity.initial_hash,
    profile: admin_runtime.progressed_profile_hash,

    comprehensions: {
      bncc_context_comprehension: BNCC_CONTEXT_COMPREHENSION,
      text_base_comprehension: TEXT_BASE_COMPREHENSION,
      text_base_internal_analysis_comprehension: TEXT_BASE_INTERNAL_ANALYSIS_COMPREHENSION,
      question_topic_comprehension: QUESTION_TOPIC_COMPREHENSION,
      rewrite_report_comprehension: REWRITE_REPORT_COMPREHENSION
    },

    instructions: {
      text_base_generation_instructions: TEXT_BASE_GENERATION_INSTRUCTIONS,
      question_generation_instructions: QUESTION_GENERATION_INSTRUCTIONS,
      rewrite_report_instructions: REWRITE_REPORT_INSTRUCTIONS
    },

    text_base_payload: text_base_payload,
    quiz: quiz,
    results: results,
    summary: summarize_results(results),
    rewrite_report: rewrite_report
  }

  File.write(TEXT_BASE_PATH, JSON.pretty_generate(text_base_payload))
  File.write(RESULTS_PATH, JSON.pretty_generate(payload))
  File.write(REPORT_PATH, report_text(results))
  File.write(REWRITE_REPORT_PATH, rewrite_report.to_s)

  puts "\nArquivos gerados:"
  puts "- #{TEXT_BASE_PATH}"
  puts "- #{RESULTS_PATH}"
  puts "- #{REPORT_PATH}"
  puts "- #{REWRITE_REPORT_PATH}"

  payload
end

# ============================================================
# 8. PROMPTS
#    Cada prompt primeiro coloca compreensÃµes; depois instruÃ§Ãµes.
# ============================================================

# %%
def text_base_generation_prompt_for(tema:, observacao_geral:)
  <<~PROMPT
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
  PROMPT
end

# %%
def question_generation_prompt_for(text_base_payload:, tema:, quantidade:, observacao_geral:)
  <<~PROMPT
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
  PROMPT
end

# %%
def rewrite_report_prompt_for(text_base_payload:, quiz:, results:)
  <<~PROMPT
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
  PROMPT
end

# ============================================================
# 9. OPERAÃ‡Ã•ES TEXTUAIS COMUNS
# ============================================================

# %%
def generate_text_base!(text_llm, tema:, observacao_geral:)
  payload = text_llm.json(
    text_base_generation_prompt_for(
      tema: tema,
      observacao_geral: observacao_geral
    )
  )

  unless payload["texto_base"] && payload["compreensao_base"]
    raise "Payload do texto-base precisa conter 'texto_base' e 'compreensao_base'."
  end

  unless payload["abstracoes_narrativas"].is_a?(Hash)
    raise "Payload do texto-base precisa conter 'abstracoes_narrativas'."
  end

  FileUtils.mkdir_p(File.dirname(TEXT_BASE_PATH))
  File.write(TEXT_BASE_PATH, JSON.pretty_generate(payload))

  payload
end

# %%
def generate_questions!(text_llm, text_base_payload:, tema:, quantidade:, observacao_geral:)
  quiz = text_llm.json(
    question_generation_prompt_for(
      text_base_payload: text_base_payload,
      tema: tema,
      quantidade: quantidade,
      observacao_geral: observacao_geral
    )
  )

  unless quiz["questions"].is_a?(Array)
    raise "Quiz precisa conter array 'questions'."
  end

  quiz["texto_base"] ||= text_base_payload["texto_base"]
  quiz
end

# %%
def generate_rewrite_report!(text_llm, text_base_payload:, quiz:, results:)
  text_llm.complete(
    rewrite_report_prompt_for(
      text_base_payload: text_base_payload,
      quiz: quiz,
      results: results
    )
  )
end

# ============================================================
# 10. APLICAÃ‡ÃƒO DO QUIZ
# ============================================================

# %%
def apply_quiz!(quiz)
  results = []
  questions = quiz.fetch("questions")
  texto_base = quiz["texto_base"] || {}

  puts "\n\n=== QUIZ GERADO â€” #{BNCC_SKILL[:serie_base]} / #{BNCC_SKILL[:codigo]} ==="
  puts "Disciplina: #{quiz["disciplina"]}"
  puts "Etapa: #{quiz["etapa"]}"
  puts "SÃ©rie: #{quiz["serie"]}"
  puts "Campo: #{quiz["campo"]}"
  puts "Habilidade: #{quiz["bncc_codigo"]}"
  puts "Tema: #{quiz["tema"]}"

  if texto_base && !texto_base.empty?
    puts "
=== TEXTO BASE ==="
    print_text_base_payload(texto_base)
  end

  questions.each_with_index do |q, index|
    puts "\n\n=== PERGUNTA #{index + 1} ==="
    puts "Habilidade observada: #{q["habilidade_observada"]}"
    puts "OperaÃ§Ã£o cognitiva: #{q["operacao_cognitiva"]}"
    puts "IntervenÃ§Ã£o humana: #{q["intervencao_humana"]}"
    puts "\n#{q["enunciado_aberto"] || q["pergunta"]}"
    puts "\nComando: #{q["comando_para_o_aluno"]}" if q["comando_para_o_aluno"]

    if q["pistas_textuais_esperadas"].is_a?(Array) && !q["pistas_textuais_esperadas"].empty?
      puts "\nPistas textuais esperadas para anÃ¡lise:"
      q["pistas_textuais_esperadas"].each { |pista| puts "- #{pista}" }
    end

    resposta = ask("Resposta aberta do aluno").to_s.strip
    evidencia_suficiente = ask(
      "A resposta apresentou justificativa com pista textual suficiente? s/n",
      default: "n"
    ).downcase.start_with?("s")

    observacao = ask(
      "ObservaÃ§Ã£o humana sobre a resposta",
      default: evidencia_suficiente ? "justificou com pista do texto" : "respondeu sem evidÃªncia suficiente do texto"
    )

    results << {
      id: q["id"],
      tipo_resposta: q["tipo_resposta"] || "aberta",
      pergunta: q["enunciado_aberto"] || q["pergunta"],
      comando_para_o_aluno: q["comando_para_o_aluno"],
      habilidade_observada: q["habilidade_observada"],
      operacao_cognitiva: q["operacao_cognitiva"],
      resposta_aluno: resposta,
      resposta_referencia: q["resposta_referencia"],
      rubrica_analise: q["rubrica_analise"],
      pistas_textuais_esperadas: q["pistas_textuais_esperadas"],
      evidencia_textual_suficiente: evidencia_suficiente,
      observacao_humana: observacao,
      erro_provavel: q["erro_provavel"],
      evidencia_dominio: q["evidencia_dominio"],
      atualizacao_perfil: q["atualizacao_perfil"]
    }
  end

  results
end

# ============================================================
# 11. ADMINISTRAÃ‡ÃƒO RLM
# ============================================================

# %%
def run_admin_step!(admin_agent, step_name, payload = {})
  safe_payload = clean_utf8(payload)
  prompt = <<~PROMPT
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
  PROMPT

  admin_agent.run(prompt)
rescue StandardError => e
  warn "[admin_rlm] falha ao registrar etapa #{step_name}: #{e.class} - #{e.message}"
  nil
end

# %%
def run_terminal_quiz!(admin_agent:, text_llm:, admin_runtime:)
  tema = ask("Tema da sondagem", default: "liberdade de expressÃ£o e discurso de Ã³dio em comentÃ¡rios online")
  quantidade = ask("Quantidade de perguntas", default: "5").to_i
  observacao_geral = ask(
    "ObservaÃ§Ã£o humana inicial sobre o aluno",
    default: "lÃª o texto, mas precisa justificar respostas com pistas explÃ­citas"
  )

  run_admin_step!(
    admin_agent,
    "iniciar_sessao",
    {
      tema: tema,
      quantidade: quantidade,
      habilidade: BNCC_SKILL[:codigo]
    }
  )

  puts "\n=== ETAPA 1: GERANDO TEXTO-BASE COM INFERÃŠNCIA COMUM ==="
  text_base_payload = generate_text_base!(
    text_llm,
    tema: tema,
    observacao_geral: observacao_geral
  )

  run_admin_step!(
    admin_agent,
    "texto_base_gerado",
    {
      genero: text_base_payload.dig("texto_base", "genero"),
      titulo: text_base_payload.dig("texto_base", "titulo")
    }
  )

  texto_base = text_base_payload.fetch("texto_base")
  compreensao_base = text_base_payload.fetch("compreensao_base")

  puts "
=== TEXTO-BASE GERADO ==="
  print_text_base_payload(texto_base)

  puts "\n=== ABSTRAÃ‡Ã•ES NARRATIVAS GERADAS PARA DEBUG ==="
  puts JSON.pretty_generate(text_base_payload.fetch("abstracoes_narrativas"))

  puts "\n=== COMPREENSÃƒO-BASE GERADA PARA DEBUG ==="
  puts JSON.pretty_generate(compreensao_base)

  puts "\n=== ETAPA 2: GERANDO PERGUNTAS COM INFERÃŠNCIA COMUM ==="
  quiz = generate_questions!(
    text_llm,
    text_base_payload: text_base_payload,
    tema: tema,
    quantidade: quantidade,
    observacao_geral: observacao_geral
  )

  run_admin_step!(
    admin_agent,
    "perguntas_geradas",
    {
      quantidade: quiz.fetch("questions").size,
      texto_base_titulo: quiz.dig("texto_base", "titulo")
    }
  )

  puts "\n=== ETAPA 3: APLICANDO QUIZ ==="
  results = apply_quiz!(quiz)

  profile_progression = JSON.parse(
    admin_runtime.progress_student_profile(results, quiz, BNCC_SKILL),
    symbolize_names: true
  )

  run_admin_step!(
    admin_agent,
    "respostas_coletadas",
    {
      total: results.size,
      resumo: summarize_results(results),
      perfil_progredido: profile_progression[:summary]
    }
  )

  puts "\n=== PERFIL PROGREDIDO ==="
  puts JSON.pretty_generate(admin_runtime.progressed_profile_hash)

  puts "\n=== ETAPA 4: RELATÃ“RIO LOCAL ==="
  print_report(results)

  puts "\n=== ETAPA 5: RELATÃ“RIO DE REESCRITA COM INFERÃŠNCIA COMUM ==="
  rewrite_report = generate_rewrite_report!(
    text_llm,
    text_base_payload: text_base_payload,
    quiz: quiz,
    results: results
  )

  puts "\n\n=== RELATÃ“RIO PARA REESCRITA â€” COMPREENSÃ•ES E INSTRUÃ‡Ã•ES ==="
  puts rewrite_report

  run_admin_step!(
    admin_agent,
    "encerrar_sessao",
    {
      arquivos: [TEXT_BASE_PATH, RESULTS_PATH, REPORT_PATH, REWRITE_REPORT_PATH]
    }
  )

  save_outputs!(
    text_base_payload: text_base_payload,
    quiz: quiz,
    results: results,
    rewrite_report: rewrite_report,
    admin_runtime: admin_runtime
  )
end

# %%
if __FILE__ == $PROGRAM_NAME
  run_terminal_quiz!(admin_agent: admin_agent, text_llm: text_llm, admin_runtime: admin_runtime)
end

