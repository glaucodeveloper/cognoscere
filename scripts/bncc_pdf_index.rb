# frozen_string_literal: true

require "json"
require "fileutils"
require "optparse"
require "pdf/reader"
require "time"

DEFAULT_PDF = File.expand_path("../BNCC_EI_EF_110518_versaofinal_site.pdf", __dir__)
DEFAULT_OUT = File.expand_path("../data/bncc_skill_index.json", __dir__)
KNOWN_COMPONENT_CONTEXTS = [
  ["Linguagens", "Língua Portuguesa"],
  ["Linguagens", "Arte"],
  ["Linguagens", "Educação Física"],
  ["Linguagens", "Língua Inglesa"],
  ["Matemática", "Matemática"],
  ["Ciências da Natureza", "Ciências"],
  ["Ciências Humanas", "Geografia"],
  ["Ciências Humanas", "História"],
  ["Ensino Religioso", "Ensino Religioso"]
].freeze

options = {
  pdf: DEFAULT_PDF,
  out: DEFAULT_OUT,
  area: nil,
  component: nil,
  skill: nil,
  write_md: nil,
  list: false
}

OptionParser.new do |parser|
  parser.banner = "Uso: ruby scripts/bncc_pdf_index.rb [opcoes]"
  parser.on("--pdf PATH", "Caminho do PDF da BNCC") { |value| options[:pdf] = value }
  parser.on("--out PATH", "Arquivo JSON de saida") { |value| options[:out] = value }
  parser.on("--area NAME", "Filtra por area, ex: Linguagens") { |value| options[:area] = value }
  parser.on("--component NAME", "Filtra por componente/disciplina, ex: Língua Portuguesa") { |value| options[:component] = value }
  parser.on("--skill CODE", "Seleciona uma habilidade, ex: EF69LP01") { |value| options[:skill] = value }
  parser.on("--write-md DIR", "Gera markdown de configuracao da habilidade no diretorio informado") { |value| options[:write_md] = value }
  parser.on("--list", "Mostra areas e componentes encontrados") { options[:list] = true }
end.parse!

def clean_text(value)
  value.to_s.dup.force_encoding(Encoding::UTF_8)
    .scrub("")
    .encode("UTF-8", invalid: :replace, undef: :replace, replace: "")
    .gsub(/\u00A0/, " ")
end

def normalize_space(value)
  clean_text(value).gsub(/[ \t]+/, " ").gsub(/\n{3,}/, "\n\n").strip
end

def normalize_key(value)
  clean_text(value)
    .unicode_normalize(:nfkd)
    .gsub(/\p{Mn}/, "")
    .downcase
    .gsub(/[^a-z0-9]+/, " ")
    .strip
end

def titleize_heading(value)
  clean_text(value)
    .split(/\s+/)
    .map { |part| part.length <= 3 ? part.downcase : part[0].upcase + part[1..].downcase }
    .join(" ")
    .gsub(/\bLingua\b/, "Língua")
    .gsub(/\bEducacao\b/, "Educação")
    .gsub(/\bFisica\b/, "Física")
    .gsub(/\bCiencias\b/, "Ciências")
    .gsub(/\bMatematica\b/, "Matemática")
    .gsub(/\bGeografia\b/, "Geografia")
    .gsub(/\bHistoria\b/, "História")
end

def infer_area_component(page_text)
  lines = clean_text(page_text).lines.map(&:strip).reject(&:empty?)
  candidates = lines.first(12).select do |line|
    line.match?(/\A[A-ZÁÉÍÓÚÂÊÔÃÕÇ0-9\s–-]+\z/) &&
      !line.match?(/\A(HABILIDADES|ENSINO FUNDAMENTAL|\d+)\z/)
  end

  heading = candidates.find { |line| line.include?("–") } || candidates.first
  return ["Sem area", "Sem componente"] unless heading

  parts = heading.split(/\s+[–-]\s+/, 2).map { |part| titleize_heading(part) }
  if parts.size == 2
    parts
  elsif parts.first == "Ciências da Natureza"
    ["Ciências da Natureza", "Ciências"]
  else
    [parts.first, parts.first]
  end
end

def extract_skills(page_text)
  text = normalize_space(page_text)
  matches = text.to_enum(:scan, /\((EF\d{2}[A-Z]{2}\d{2})\)/).map { Regexp.last_match }
  return [] if matches.empty?

  matches.each_with_index.map do |match, index|
    start_pos = match.begin(0)
    end_pos = matches[index + 1]&.begin(0) || text.length
    raw = text[start_pos...end_pos]
    code = match[1]
    statement = raw.sub(/\A\(#{Regexp.escape(code)}\)\s*/, "")
      .gsub(/\s+/, " ")
      .strip

    {
      code: code,
      statement: statement
    }
  end
end

def include_by_filter?(record, options)
  area_filter = options[:area]
  component_filter = options[:component]
  skill_filter = options[:skill]

  return false if area_filter && !normalize_key(record[:area]).include?(normalize_key(area_filter))
  return false if component_filter && !normalize_key(record[:component]).include?(normalize_key(component_filter))
  return false if skill_filter && !record[:code].casecmp?(skill_filter)

  true
end

def school_year_for(code)
  case code
  when /\AEF(\d{2})/
    year = Regexp.last_match(1)
    return "1º ano do Ensino Fundamental" if year == "01"
    return "2º ano do Ensino Fundamental" if year == "02"
    return "3º ano do Ensino Fundamental" if year == "03"
    return "4º ano do Ensino Fundamental" if year == "04"
    return "5º ano do Ensino Fundamental" if year == "05"
    return "6º ano do Ensino Fundamental" if year == "06"
    return "7º ano do Ensino Fundamental" if year == "07"
    return "8º ano do Ensino Fundamental" if year == "08"
    return "9º ano do Ensino Fundamental" if year == "09"
    return "1º ao 2º ano do Ensino Fundamental" if year == "12"
    return "1º ao 5º ano do Ensino Fundamental" if year == "15"
    return "3º ao 5º ano do Ensino Fundamental" if year == "35"
    return "6º ao 7º ano do Ensino Fundamental" if year == "67"
    return "6º ao 9º ano do Ensino Fundamental" if year == "69"
    return "8º ao 9º ano do Ensino Fundamental" if year == "89"
  end

  "Ensino Fundamental"
end

def skill_markdown(record)
  recorte = {
    codigo: record[:code],
    etapa: "Ensino Fundamental",
    serie_base: school_year_for(record[:code]),
    bloco_bncc: school_year_for(record[:code]),
    componente: record[:component],
    area: record[:area],
    campo: "",
    pratica_linguagem: "",
    objeto_conhecimento: "",
    habilidade: record[:statement],
    fonte_pdf_pagina: record[:page]
  }

  <<~MD
    # #{record[:code]} - #{record[:component]}

    ## recorte_bncc
    ```json
    #{JSON.pretty_generate(recorte)}
    ```

    ## bncc_context_comprehension
    A habilidade #{record[:code]} pertence à área #{record[:area]} e ao componente #{record[:component]}.
    Sua formulação curricular é: #{record[:statement]}

    Esta compreensão deve transformar o texto da BNCC em uma leitura pedagógica situada,
    indicando o que o estudante precisa compreender, fazer ou demonstrar, quais conceitos
    ou práticas estão em jogo e que evidências tornam a habilidade observável.

    ## text_base_comprehension
    O texto-base ou situação-problema deve tornar a habilidade #{record[:code]} necessária.
    Ele não deve funcionar como pretexto decorativo, mas como uma situação concreta em que
    o estudante precise mobilizar a habilidade, produzir evidências e justificar seu raciocínio.

    A geração deve explicitar fatos, contexto, participantes, materiais, dados ou acontecimentos
    suficientes para que a atividade pareça completa, natural e pedagogicamente observável.
    O texto-base deve ser equivalente a uma lauda de página, tomando como referência
    550 a 750 palavras, e precisa ter uma moldura argumentativa: a introdução apresenta
    uma tese, problema ou ponto de vista em disputa, e o fechamento retoma essa tese com
    consequência, síntese, impasse ou posicionamento.

    O conteúdo central pode ser livre conforme a necessidade da habilidade: narrativo,
    dialogal, expositivo, investigativo, instrucional ou outro formato pertinente. Ele
    não precisa ser composto por argumentos formais, mas deve sustentar a tese aberta
    na introdução e retomada no fechamento.

    ## text_base_internal_analysis_comprehension
    A compreensão interna deve mapear como o texto-base foi construído: quais fatos sustentam
    a situação, quais pistas permitem observar a habilidade, quais erros prováveis podem ocorrer
    e quais evidências devem aparecer em uma resposta consistente.

    ## question_topic_comprehension
    As perguntas devem partir exclusivamente do texto-base e da habilidade #{record[:code]}.
    Elas devem ser abertas, diagnósticas e permitir análise profunda do raciocínio do aluno,
    exigindo justificativa, evidências e relação explícita com a situação apresentada.

    ## rewrite_report_comprehension
    O relatório de reescrita deve avaliar se a habilidade, o texto-base, as perguntas e as respostas
    produziram evidências suficientes. Deve indicar se faltaram fatos, contexto, pistas, naturalidade
    nas falas, clareza de conflito cognitivo ou critérios de análise.
  MD
end

raise "PDF nao encontrado: #{options[:pdf]}" unless File.exist?(options[:pdf])

reader = PDF::Reader.new(options[:pdf])
records = []

current_area = nil
current_component = nil

reader.pages.each_with_index do |page, index|
  text = page.text
  area, component = infer_area_component(text)

  if KNOWN_COMPONENT_CONTEXTS.any? { |known_area, known_component| area == known_area && component == known_component }
    current_area = area
    current_component = component
  end

  next unless current_area && current_component

  extract_skills(text).each do |skill|
    record = {
      code: skill[:code],
      area: current_area,
      component: current_component,
      page: index + 1,
      statement: skill[:statement]
    }
    records << record if include_by_filter?(record, options)
  end
end

areas = records
  .group_by { |record| record[:area] }
  .transform_values do |area_records|
    area_records
      .group_by { |record| record[:component] }
      .transform_values { |component_records| component_records.map { |record| record[:code] }.uniq.sort }
  end

payload = {
  generated_at: Time.now.iso8601,
  source_pdf: File.expand_path(options[:pdf]),
  filters: {
    area: options[:area],
    component: options[:component]
  },
  total_skills: records.size,
  areas: areas,
  skills: records
}

if options[:list]
  areas.each do |area, components|
    puts area
    components.each do |component, codes|
      puts "  - #{component}: #{codes.size} habilidades"
    end
  end
elsif options[:write_md]
  raise "--write-md requer --skill CODE" unless options[:skill]

  record = records.find { |item| item[:code].casecmp?(options[:skill]) }
  raise "Habilidade nao encontrada com os filtros informados: #{options[:skill]}" unless record

  FileUtils.mkdir_p(options[:write_md])
  filename = "#{record[:code].downcase}.md"
  path = File.join(options[:write_md], filename)
  File.write(path, skill_markdown(record))
  puts "Markdown gerado: #{path}"
else
  FileUtils.mkdir_p(File.dirname(options[:out]))
  File.write(options[:out], JSON.pretty_generate(payload))
  puts "Arquivo gerado: #{options[:out]}"
  puts "Habilidades: #{records.size}"
end
