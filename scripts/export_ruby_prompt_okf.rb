# frozen_string_literal: true

require "digest"
require "fileutils"
require "json"

ROOT = File.expand_path("..", __dir__)
SOURCE_PATH = File.join(ROOT, "inicio.rb")
SKILL_PATH = File.join(ROOT, "habilidades", "ef69lp01.md")
OUTPUT_ROOT = File.join(ROOT, "okf")
PROMPT_DIR = File.join(OUTPUT_ROOT, "prompts")
TIMESTAMP = ENV.fetch("OKF_TIMESTAMP", "2026-07-13T00:00:00-03:00")

def extract_heredoc_after(lines, start_index, marker_pattern)
  marker_index = (start_index...lines.length).find { |index| lines[index].match?(marker_pattern) }
  raise "Heredoc não encontrado depois da linha #{start_index + 1}" unless marker_index

  delimiter = lines[marker_index].match(marker_pattern)&.captures&.first
  raise "Delimitador ausente na linha #{marker_index + 1}" unless delimiter

  end_index = ((marker_index + 1)...lines.length).find { |index| lines[index].strip == delimiter }
  raise "Fim do heredoc #{delimiter} não encontrado" unless end_index

  lines[(marker_index + 1)...end_index].join
end

def extract_constant_heredoc(source, name)
  lines = source.lines
  pattern = /^#{Regexp.escape(name)}\s*=\s*<<~([A-Z_]+)\.freeze\s*$/
  index = lines.index { |line| line.match?(pattern) }
  raise "Constante #{name} não encontrada" unless index

  extract_heredoc_after(lines, index, pattern)
end

def extract_method_heredoc(source, method_name)
  lines = source.lines
  method_index = lines.index { |line| line.match?(/^\s*def\s+#{Regexp.escape(method_name)}(?:\(|\s|$)/) }
  raise "Método #{method_name} não encontrado" unless method_index

  extract_heredoc_after(lines, method_index, /<<~([A-Z_]+)/)
end

def parse_markdown_sections(markdown)
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

  sections.transform_values(&:strip)
end

def frontmatter(type:, title:, description:, tags:, source:, source_symbol:, sha256:)
  <<~YAML
    ---
    type: "#{type}"
    title: "#{title}"
    description: "#{description}"
    tags: [#{tags.map { |tag| %("#{tag}") }.join(", ")}]
    timestamp: "#{TIMESTAMP}"
    visibility: "internal-repository"
    source: "#{source}"
    source_symbol: "#{source_symbol}"
    source_sha256: "#{sha256}"
    legacy_okf_status: "reconstructed-from-remnants"
    ---
  YAML
end

def prompt_document(template)
  composition = template.fetch(:composition)
  instructions = template[:instructions]
  content_hash = Digest::SHA256.hexdigest([composition, instructions].compact.join("\n---\n"))

  body = <<~MD
    #{frontmatter(
      type: "Prompt Template",
      title: template.fetch(:title),
      description: template.fetch(:description),
      tags: ["okf", "prompt", template.fetch(:stage), "ruby"],
      source: "inicio.rb",
      source_symbol: template.fetch(:source_symbol),
      sha256: content_hash
    )}
    # #{template.fetch(:title)}

    Este conceito é exportado programaticamente do script Ruby legado. Ele preserva
    a composição real usada pelo motor; não é uma paráfrase documental.

    ## Responsabilidade

    - Estágio: #{template.fetch(:stage)}
    - Fonte canônica: inicio.rb / #{template.fetch(:source_symbol)}
    - Visibilidade: repositório técnico; não carregar integralmente na projeção pública.
    - Supervisão: validação estrutural e revisão humana conforme impacto pedagógico.

    ## Composição real do prompt

    ~~~~ruby
    #{composition.rstrip}
    ~~~~

  MD

  if instructions
    body << <<~MD
      ## Instruções reais de saída

      ~~~~text
      #{instructions.rstrip}
      ~~~~

    MD
  end

  body << <<~MD
    ## Contrato de consumo

    O pipeline DEVE aplicar as compreensões e entradas referenciadas pela composição
    antes destas instruções. O frontend público recebe apenas versão, finalidade,
    fontes, aprovação e artefato resultante.
  MD

  [body, content_hash]
end

source = File.read(SOURCE_PATH, encoding: "UTF-8")
skill_markdown = File.read(SKILL_PATH, encoding: "UTF-8")
skill_sections = parse_markdown_sections(skill_markdown)

templates = [
  {
    id: "text-base-generation",
    title: "Geração de texto-base",
    description: "Composição real para gerar abstrações, texto-base e compreensão-base.",
    stage: "generation",
    source_symbol: "text_base_generation_prompt_for + TEXT_BASE_GENERATION_INSTRUCTIONS",
    composition: extract_method_heredoc(source, "text_base_generation_prompt_for"),
    instructions: extract_constant_heredoc(source, "TEXT_BASE_GENERATION_INSTRUCTIONS")
  },
  {
    id: "question-generation",
    title: "Geração de perguntas diagnósticas",
    description: "Composição real para gerar perguntas abertas sobre texto-base fixado.",
    stage: "generation",
    source_symbol: "question_generation_prompt_for + QUESTION_GENERATION_INSTRUCTIONS",
    composition: extract_method_heredoc(source, "question_generation_prompt_for"),
    instructions: extract_constant_heredoc(source, "QUESTION_GENERATION_INSTRUCTIONS")
  },
  {
    id: "rewrite-report",
    title: "Auditoria e relatório de reescrita",
    description: "Composição real que diferencia falhas do aluno, pergunta e texto-base.",
    stage: "audit",
    source_symbol: "rewrite_report_prompt_for + REWRITE_REPORT_INSTRUCTIONS",
    composition: extract_method_heredoc(source, "rewrite_report_prompt_for"),
    instructions: extract_constant_heredoc(source, "REWRITE_REPORT_INSTRUCTIONS")
  },
  {
    id: "json-repair",
    title: "Reparo controlado de JSON",
    description: "Prompt real de recuperação de saída JSON quebrada ou truncada.",
    stage: "recovery",
    source_symbol: "FrameworkLlamaTextInference#repair_json_response",
    composition: extract_method_heredoc(source, "repair_json_response"),
    instructions: nil
  },
  {
    id: "admin-step",
    title: "Registro administrativo RLM",
    description: "Prompt real usado pelo agente administrador para registrar etapas sem gerar conteúdo pedagógico.",
    stage: "administration",
    source_symbol: "run_admin_step!",
    composition: extract_method_heredoc(source, "run_admin_step!"),
    instructions: nil
  }
]

required_comprehensions = %w[
  bncc_context_comprehension
  text_base_comprehension
  text_base_internal_analysis_comprehension
  question_topic_comprehension
  rewrite_report_comprehension
]
missing = required_comprehensions.reject { |name| skill_sections[name]&.length&.positive? }
raise "Compreensões ausentes: #{missing.join(', ')}" unless missing.empty?

FileUtils.mkdir_p(PROMPT_DIR)

registry_entries = templates.map do |template|
  document, content_hash = prompt_document(template)
  relative_path = File.join("prompts", "#{template.fetch(:id)}.md")
  File.write(File.join(OUTPUT_ROOT, relative_path), document, encoding: "UTF-8")
  {
    id: template.fetch(:id),
    stage: template.fetch(:stage),
    path: relative_path.tr("\\", "/"),
    source_symbol: template.fetch(:source_symbol),
    sha256: content_hash
  }
end

comprehension_hash = Digest::SHA256.hexdigest(
  required_comprehensions.map { |name| skill_sections.fetch(name) }.join("\n---\n")
)
comprehension_body = <<~MD
  #{frontmatter(
    type: "Pedagogical Comprehension Set",
    title: "Compreensões EF69LP01 carregadas pelo Ruby",
    description: "Cinco camadas semânticas carregadas antes da composição dos prompts.",
    tags: ["okf", "bncc", "ef69lp01", "comprehension"],
    source: "habilidades/ef69lp01.md",
    source_symbol: "SkillMarkdownConfig.load",
    sha256: comprehension_hash
  )}
  # Compreensões EF69LP01 carregadas pelo Ruby

  SkillMarkdownConfig.load lê estas seções de habilidades/ef69lp01.md. Elas
  descrevem o sentido pedagógico e são injetadas antes das instruções de formato.

  #{required_comprehensions.map { |name| "## #{name}\n\n#{skill_sections.fetch(name)}" }.join("\n\n")}
MD
File.write(File.join(PROMPT_DIR, "ef69lp01-comprehensions.md"), comprehension_body, encoding: "UTF-8")

root_index = <<~MD
  ---
  okf_version: "0.1"
  title: "Cognoscere — prompts Ruby sobre a base OKF"
  timestamp: "#{TIMESTAMP}"
  ---
  # Prompts Ruby sobre a base OKF

  Este bundle técnico é gerado diretamente de inicio.rb e habilidades/ef69lp01.md.
  Ele comprova quais templates-fonte de prompt e compreensões o motor realmente carrega. A base OKF
  local anterior não foi versionada; esta exportação preserva os remanescentes
  executáveis sem inventar o conteúdo ausente.

  # Conceitos

  * [Prompts](prompts/) - templates reais exportados do motor Ruby.
  * [Documentação pública](https://github.com/glaucodeveloper/cognoscere/tree/main/public/okf) - projeção segura consumida pelo site.

  # Registro de máquina

  * [registry.json](registry.json) - hashes, símbolos e caminhos exportados.
MD
File.write(File.join(OUTPUT_ROOT, "index.md"), root_index, encoding: "UTF-8")

prompts_index = <<~MD
  # Templates e compreensões

  #{registry_entries.map { |entry| "* [#{entry[:id]}](#{File.basename(entry[:path])}) - fonte #{entry[:source_symbol]}." }.join("\n")}
  * [Compreensões EF69LP01](ef69lp01-comprehensions.md) - base carregada por SkillMarkdownConfig.
MD
File.write(File.join(PROMPT_DIR, "index.md"), prompts_index, encoding: "UTF-8")

log = <<~MD
  # Prompt OKF Update Log

  ## 2026-07-13
  * **Reconstruction**: Exportação programática dos templates-fonte reais de inicio.rb.
  * **Provenance**: A base OKF local anterior não estava versionada e não pôde ser recuperada literalmente.
MD
File.write(File.join(OUTPUT_ROOT, "log.md"), log, encoding: "UTF-8")

registry = {
  format: "cognoscere-ruby-prompt-okf",
  okfVersion: "0.1",
  generatedAt: TIMESTAMP,
  legacyOkfStatus: "reconstructed-from-remnants",
  sources: [
    { path: "inicio.rb", sha256: Digest::SHA256.file(SOURCE_PATH).hexdigest },
    { path: "habilidades/ef69lp01.md", sha256: Digest::SHA256.file(SKILL_PATH).hexdigest }
  ],
  templates: registry_entries,
  comprehensions: {
    path: "prompts/ef69lp01-comprehensions.md",
    sections: required_comprehensions,
    sha256: comprehension_hash
  }
}
File.write(File.join(OUTPUT_ROOT, "registry.json"), JSON.pretty_generate(registry), encoding: "UTF-8")

puts "OKF de prompts exportado: #{registry_entries.length} templates + #{required_comprehensions.length} compreensões."
