#!/usr/bin/env python3
from __future__ import annotations

import json
import re
import hashlib
import shutil
import zipfile
import unicodedata
from pathlib import Path
from datetime import datetime, timezone
from collections import defaultdict, Counter

OUT_ROOT = Path('/mnt/data')
PREV_INDEX = Path('/mnt/data/bncc_okf_bundle_20260617_162703/index/habilidades_bncc_all.json')
PDF_PATH = Path('/mnt/data/BNCC_EI_EF_110518_versaofinal_site.pdf')
LP_JSON_PATH = Path('/mnt/data/bncc_linguagens_lingua_portuguesa.json')
EF69_TEMPLATE_PATH = Path('/mnt/data/ef69lp01.md')
BUNDLE_VERSION = 'bncc-okf-bundle/semantic-intrinsic-v2'

COMPONENTS_EF = {
    'LP': ('Linguagens', 'Língua Portuguesa'),
    'AR': ('Linguagens', 'Arte'),
    'EF': ('Linguagens', 'Educação Física'),
    'LI': ('Linguagens', 'Língua Inglesa'),
    'MA': ('Matemática', 'Matemática'),
    'CI': ('Ciências da Natureza', 'Ciências'),
    'GE': ('Ciências Humanas', 'Geografia'),
    'HI': ('Ciências Humanas', 'História'),
    'ER': ('Ensino Religioso', 'Ensino Religioso'),
}
COMPONENTS_EM = {
    'LGG': ('Linguagens e suas Tecnologias', 'Linguagens e suas Tecnologias'),
    'LP': ('Linguagens e suas Tecnologias', 'Língua Portuguesa'),
    'MAT': ('Matemática e suas Tecnologias', 'Matemática'),
    'CNT': ('Ciências da Natureza e suas Tecnologias', 'Ciências da Natureza e suas Tecnologias'),
    'CHS': ('Ciências Humanas e Sociais Aplicadas', 'Ciências Humanas e Sociais Aplicadas'),
}
EI_FIELDS = {
    'EO': 'O eu, o outro e o nós',
    'CG': 'Corpo, gestos e movimentos',
    'TS': 'Traços, sons, cores e formas',
    'EF': 'Escuta, fala, pensamento e imaginação',
    'ET': 'Espaços, tempos, quantidades, relações e transformações',
}
EI_AGE = {
    '01': 'Bebês (zero a 1 ano e 6 meses)',
    '02': 'Crianças bem pequenas (1 ano e 7 meses a 3 anos e 11 meses)',
    '03': 'Crianças pequenas (4 anos a 5 anos e 11 meses)',
}

# A semantic inventory used only to interpret the words of the skill statement,
# not to import external facts. Each class maps a verb to the kind of evidence an
# answer must show.
VERB_SEMANTICS = {
    'identificar': ('reconhecimento situado', 'apontar o elemento pedido e distingui-lo de elementos próximos'),
    'reconhecer': ('reconhecimento situado', 'mostrar que percebe a presença, função ou valor do elemento no material'),
    'localizar': ('localização textual/material', 'encontrar evidência explícita no material e indicá-la'),
    'ler': ('leitura compreensiva', 'reconstruir sentido, informação ou relação a partir do material lido'),
    'observar': ('atenção analítica', 'descrever traços percebidos sem substituir observação por opinião'),
    'perceber': ('atenção analítica', 'notar relação, diferença ou efeito que está no material'),
    'diferenciar': ('discriminação criterial', 'separar dois termos por critério observável e justificar a fronteira'),
    'comparar': ('comparação criterial', 'estabelecer semelhanças/diferenças com base em critérios explícitos'),
    'relacionar': ('relação semântica/causal/funcional', 'ligar elementos e explicar a natureza da ligação'),
    'associar': ('relação semântica/causal/funcional', 'aproximar elementos por traço compartilhado justificável'),
    'classificar': ('categorização', 'aplicar critérios de classe e justificar a inclusão/exclusão'),
    'ordenar': ('ordenação criterial', 'colocar elementos em sequência segundo critério explicitável'),
    'selecionar': ('seleção criterial', 'escolher elementos adequados a um critério ou finalidade'),
    'organizar': ('organização estruturante', 'dispor elementos em estrutura coerente com critério/finalidade'),
    'analisar': ('análise decompositiva', 'decompor o objeto em partes, relações, procedimentos ou efeitos'),
    'interpretar': ('interpretação inferencial', 'construir sentido a partir de pistas e justificar a inferência'),
    'inferir': ('inferência controlada por evidência', 'derivar conclusão não explícita a partir de indícios'),
    'explicar': ('explicação causal/procedimental', 'mostrar como ou por que algo ocorre usando relações do material'),
    'avaliar': ('julgamento criterial', 'emitir juízo com critérios, evidências e limites'),
    'argumentar': ('argumentação justificada', 'defender posição com razões e evidências pertinentes'),
    'opinar': ('posição justificada', 'formular ponto de vista com justificativa situada'),
    'defender': ('posição justificada', 'sustentar ponto de vista contra alternativas possíveis'),
    'produzir': ('produção autoral situada', 'criar produto adequado a finalidade, gênero, situação e critérios'),
    'criar': ('produção autoral situada', 'inventar solução/obra/forma coerente com restrições'),
    'elaborar': ('construção planejada', 'organizar elementos em produto/procedimento coerente'),
    'planejar': ('antecipação estruturada', 'definir etapas, finalidade, recursos, destinatário e critérios antes da execução'),
    'escrever': ('produção escrita situada', 'redigir texto adequado a finalidade, gênero, leitor e organização'),
    'registrar': ('registro organizado', 'representar informação, processo ou observação de modo recuperável'),
    'revisar': ('melhoria criterial', 'retomar produção e ajustar por critérios identificáveis'),
    'editar': ('adequação final de produção', 'preparar versão final com forma, legibilidade e acabamento'),
    'experimentar': ('experimentação prática', 'realizar prática e observar efeitos da ação'),
    'explorar': ('investigação prática', 'variar ações/possibilidades para descobrir propriedades e relações'),
    'utilizar': ('uso funcional', 'empregar recurso/procedimento de modo adequado a um fim'),
    'usar': ('uso funcional', 'empregar recurso/procedimento de modo adequado a um fim'),
    'aplicar': ('aplicação transferida', 'usar conceito/procedimento em caso específico'),
    'resolver': ('resolução de problema', 'transformar dados e condições em solução verificável'),
    'calcular': ('procedimento matemático', 'executar operação e interpretar o resultado'),
    'estimar': ('aproximação controlada', 'produzir valor ou julgamento aproximado com critério e verificação de plausibilidade'),
    'representar': ('representação semiótica/procedimental', 'converter ou expressar objeto em registro adequado sem perder sua relação essencial'),
    'determinar': ('determinação criterial', 'chegar a resultado específico por critérios, dados ou procedimento verificável'),
    'medir': ('mensuração', 'comparar grandeza com unidade e registrar resultado pertinente'),
    'investigar': ('investigação orientada', 'formular percurso de busca, observar dados e justificar conclusão'),
    'formular': ('formulação conceitual/problematizadora', 'criar pergunta, hipótese, regra ou explicação coerente'),
    'testar': ('verificação empírica/procedimental', 'submeter hipótese/procedimento a dados ou condições'),
    'propor': ('proposição interventiva', 'apresentar encaminhamento coerente com problema, critérios e consequências'),
    'participar': ('participação situada', 'atuar em interação respeitando regras, papéis e finalidade'),
    'fruir': ('fruição sensível/reflexiva', 'experienciar manifestação e expressar percepção fundamentada'),
    'apreciar': ('apreciação valorativa', 'perceber qualidades/efeitos e justificar apreciação'),
    'compreender': ('compreensão relacional', 'reconstruir o sentido do objeto e suas relações internas'),
    'descrever': ('descrição criterial', 'apresentar características observáveis organizadas'),
}

CONNECTOR_PATTERNS = [
    ('finalidade', r'\b(?:para|a fim de|de forma a|com vistas a|visando|visando ao|visando à)\b'),
    ('meio_procedimento', r'\b(?:por meio de|utilizando|usando|mediante|com o uso de|recorrendo a|a partir de)\b'),
    ('condicao_contexto', r'\b(?:considerando|quando|em situações de|em contextos de|no contexto de|nas práticas de|em diferentes|em diversos|em variadas)\b'),
    ('criterio_limite', r'\b(?:adequado|adequada|respeitando|sem|com base em|segundo|de acordo com|observando)\b'),
    ('objeto_fonte', r'\b(?:em textos|em notícias|em mapas|em gráficos|em tabelas|em obras|em fontes|em documentos|em situações|em práticas|em problemas)\b'),
]

STOP_SPLIT = r'\b(?:para|a fim de|de forma a|com vistas a|visando|considerando|utilizando|usando|por meio de|a partir de|com base em|segundo|de acordo com|quando|em que|nos quais|nas quais|sem|incluindo|respeitando)\b'


def normalize_spaces(text: str) -> str:
    text = text.replace('\u00ad', '').replace('￾', '').replace('\ufffd', '')
    return re.sub(r'\s+', ' ', text).strip()


def slug(s: str) -> str:
    s = unicodedata.normalize('NFKD', s or '').encode('ascii', 'ignore').decode('ascii')
    s = re.sub(r'[^a-zA-Z0-9]+', '-', s).strip('-').lower()
    return s or 'item'


def grade_label(g: str) -> str:
    return f'{int(g)}º ano'


def grade_span_label(gs: str) -> str:
    if len(gs) == 2 and gs.startswith('0'):
        return grade_label(gs)
    if len(gs) == 2:
        return f'{int(gs[0])}º ao {int(gs[1])}º ano'
    if len(gs) == 4:
        return f'{int(gs[:2])}º ao {int(gs[2:])}º ano'
    return gs


def infer_meta(code: str, rec: dict | None = None) -> dict:
    rec = rec or {}
    if code.startswith('EI'):
        age_group = code[2:4]
        field = code[4:6]
        return {
            'etapa': rec.get('stage') or 'Educação Infantil',
            'segmento': rec.get('segment') or 'Educação Infantil',
            'ano_ou_bloco': rec.get('year_or_block') or EI_AGE.get(age_group, age_group),
            'area': rec.get('area') or 'Educação Infantil',
            'componente': rec.get('component') or 'Educação Infantil',
            'campo_ou_unidade': rec.get('field_or_unit') or EI_FIELDS.get(field, field),
            'codigo_area_componente': field,
            'ordem_interna': code[-2:],
        }
    m_ef = re.match(r'^EF(?P<grades>\d{2,4})(?P<comp>[A-Z]{2})(?P<num>\d{2})$', code)
    if m_ef:
        grades = m_ef.group('grades')
        comp = m_ef.group('comp')
        area, componente = COMPONENTS_EF.get(comp, ('Ensino Fundamental', comp))
        if len(grades) == 2 and grades.startswith('0'):
            n = int(grades)
            segmento = 'Anos Iniciais' if n <= 5 else 'Anos Finais'
        elif len(grades) == 2:
            start, end = int(grades[0]), int(grades[1])
            segmento = 'Anos Iniciais' if end <= 5 else ('Anos Finais' if start >= 6 else 'Ensino Fundamental')
        else:
            start, end = int(grades[:2]), int(grades[2:])
            segmento = 'Anos Iniciais' if end <= 5 else ('Anos Finais' if start >= 6 else 'Ensino Fundamental')
        return {
            'etapa': rec.get('stage') or 'Ensino Fundamental',
            'segmento': rec.get('segment') or segmento,
            'ano_ou_bloco': rec.get('year_or_block') or grade_span_label(grades),
            'area': rec.get('area') or area,
            'componente': rec.get('component') or componente,
            'campo_ou_unidade': rec.get('field_or_unit'),
            'codigo_area_componente': comp,
            'ordem_interna': m_ef.group('num'),
        }
    m_em = re.match(r'^EM(?P<series>\d{2})(?P<comp>LGG|LP|MAT|CNT|CHS)(?P<num>\d{2,3})$', code)
    if m_em:
        comp = m_em.group('comp')
        area, componente = COMPONENTS_EM[comp]
        num = m_em.group('num')
        return {
            'etapa': rec.get('stage') or 'Ensino Médio',
            'segmento': rec.get('segment') or 'Ensino Médio',
            'ano_ou_bloco': rec.get('year_or_block') or '1ª à 3ª série do Ensino Médio',
            'area': rec.get('area') or area,
            'componente': rec.get('component') or componente,
            'campo_ou_unidade': rec.get('field_or_unit'),
            'codigo_area_componente': comp,
            'competencia_relacionada': num[0] if len(num) == 3 else None,
            'ordem_interna': num,
        }
    return {
        'etapa': rec.get('stage') or 'BNCC',
        'segmento': rec.get('segment'),
        'ano_ou_bloco': rec.get('year_or_block'),
        'area': rec.get('area'),
        'componente': rec.get('component'),
        'campo_ou_unidade': rec.get('field_or_unit'),
        'codigo_area_componente': None,
        'ordem_interna': None,
    }


def load_records() -> list[dict]:
    if not PREV_INDEX.exists():
        raise FileNotFoundError(f'Expected previous extracted index at {PREV_INDEX}')
    payload = json.loads(PREV_INDEX.read_text(encoding='utf-8'))
    records = []
    for r in payload['skills']:
        code = r['code']
        statement = normalize_spaces(r.get('statement') or '')
        if not statement:
            continue
        rec = {
            'code': code,
            'page': r.get('page'),
            'statement': statement,
            'statement_source': r.get('statement_source') or 'prior_pdf_or_json_extraction',
            'meta': infer_meta(code, r),
        }
        records.append(rec)
    def sort_key(rec):
        stage_order = {'Educação Infantil': 0, 'Ensino Fundamental': 1, 'Ensino Médio': 2}
        return (stage_order.get(rec['meta'].get('etapa'), 9), rec.get('page') or 9999, rec['code'])
    return sorted(records, key=sort_key)


def first_sentence_fragment(text: str, max_len: int = 180) -> str:
    text = normalize_spaces(text)
    if len(text) <= max_len:
        return text
    cut = text[:max_len]
    p = max(cut.rfind(';'), cut.rfind(','), cut.rfind('.'))
    if p > 60:
        return cut[:p].strip()
    return cut.strip() + '...'


def split_clauses(statement: str) -> list[str]:
    # Keep clauses meaningful; commas in BNCC statements often mark semantic commitments.
    parts = re.split(r';|(?<!\d),(?!\d)|\.\s+', statement)
    out = []
    for p in parts:
        p = normalize_spaces(p.strip(' .;,'))
        if len(p) > 3:
            out.append(p)
    return out[:12]



def detect_gerund_actions(statement: str) -> list[dict]:
    s = normalize_spaces(statement)
    out = []
    # BNCC often encodes required downstream behavior with gerunds:
    # "posicionando-se", "vislumbrando", "considerando", etc. Each
    # gerund is treated as its own semantic demand, even when chained.
    matches = [m for m in re.finditer(r'\b([A-Za-zÁÉÍÓÚÂÊÔÃÕÇáéíóúâêãõç]+ndo(?:-se)?)\b', s, flags=re.I) if m.group(1).lower() not in {'quando'}]
    for idx, m in enumerate(matches):
        action = normalize_spaces(m.group(1))
        next_start = matches[idx + 1].start() if idx + 1 < len(matches) else len(s)
        punct = re.search(r'[,.;]', s[m.start():next_start])
        end = m.start() + punct.start() if punct else next_start
        # Extend to useful local clause for final gerund until punctuation.
        if idx + 1 == len(matches):
            punct2 = re.search(r'[,.;]', s[m.start():])
            end = m.start() + punct2.start() if punct2 else len(s)
        clause = normalize_spaces(re.sub(r'\s+e$', '', s[m.start():end].strip(' ,.;'), flags=re.I))
        if action.lower() in {'considerando', 'utilizando', 'usando', 'incluindo', 'respeitando'}:
            kind = 'restrição de modo/critério'
        elif action.lower().startswith('posicionando'):
            kind = 'posicionamento decorrente da compreensão'
        elif action.lower().startswith('vislumbrando'):
            kind = 'antecipação de encaminhamento possível'
        else:
            kind = 'ação decorrente ou procedimento interno'
        if clause and not any(x['action'].lower() == action.lower() and x['clause'].lower() == clause.lower() for x in out):
            out.append({'action': action, 'clause': clause, 'semantic_role': kind})
    return out[:8]


def extract_relational_terms(statement: str, verbs: list[str]) -> dict:
    s = normalize_spaces(statement)
    low = s.lower()
    rest = s
    for v in verbs[:2]:
        m = re.search(r'\b' + re.escape(v) + r'\b', rest, flags=re.I)
        if m and m.start() < 30:
            rest = rest[m.end():].strip(' ,.;:')
    core = cut_object_core(rest)
    result = {'relation_type': None, 'terms': [], 'relation_expression': None}
    if not core:
        return result
    first = verbs[0].lower() if verbs else ''
    if first in {'diferenciar', 'comparar', 'relacionar', 'associar'}:
        # Special case: "liberdade de expressão de discursos de ódio" contains "de" inside both terms.
        m = re.match(r'(?i)liberdade de expressão\s+de\s+(discursos? de ódio.*)$', core)
        if m:
            terms = ['liberdade de expressão', normalize_spaces(m.group(1))]
        elif ' de ' in core and first == 'diferenciar':
            parts = re.split(r'\s+de\s+', core, maxsplit=1)
            terms = [parts[0].strip(), parts[1].strip()] if len(parts) == 2 else [core]
        elif re.search(r'\s+e\s+', core):
            terms = [x.strip() for x in re.split(r'\s+e\s+', core) if x.strip()]
        else:
            terms = [core]
        if len(terms) >= 2:
            result['relation_type'] = 'fronteira/comparação entre termos'
            result['terms'] = terms[:4]
            result['relation_expression'] = ' ↔ '.join(terms[:4])
        else:
            result['terms'] = terms
    return result

def detect_verbs(statement: str) -> list[str]:
    low = statement.lower()
    # Search the opening semantic zone, then sort by occurrence. This preserves
    # chains like "Escrever, ler e ordenar" and "Analisar e comparar".
    opening = low[:260]
    positions = []
    for v in VERB_SEMANTICS:
        m = re.search(r'\b' + re.escape(v) + r'\b', opening)
        if m:
            positions.append((m.start(), v))
    positions.sort()
    found = []
    for _, v in positions:
        if v not in found:
            found.append(v)
    # Prefer verbs in the first clause. If none, look in full statement.
    if not found:
        for v in VERB_SEMANTICS:
            m = re.search(r'\b' + re.escape(v) + r'\b', low)
            if m:
                positions.append((m.start(), v))
        for _, v in sorted(positions):
            if v not in found:
                found.append(v)
    if not found:
        m = re.match(r'^([A-Za-zÁÉÍÓÚÂÊÔÃÕÇáéíóúâêôãõç]+(?:ar|er|ir|or))\b', low)
        if m:
            found.append(m.group(1))
    return found[:6] or ['mobilizar']


def verb_semantics(verbs: list[str]) -> list[dict]:
    out = []
    for v in verbs:
        family, evidence = VERB_SEMANTICS.get(v, ('mobilização semântica', 'mostrar na resposta a operação exigida pelo enunciado'))
        out.append({'verb': v, 'semantic_operation': family, 'answer_evidence': evidence})
    return out



def cut_object_core(rest: str) -> str:
    # Cut at semantic connectors, semicolon/period, or a comma that starts a
    # dependent action/criterion. Do not cut at ordinary commas inside lists or
    # examples, because many BNCC objects include enumerations.
    candidates = []
    m = re.search(STOP_SPLIT, rest, flags=re.I)
    if m and m.start() > 8:
        candidates.append(m.start())
    m = re.search(r'[;.]', rest)
    if m and m.start() > 8:
        candidates.append(m.start())
    m = re.search(r',\s*(?:posicionando|vislumbrando|considerando|utilizando|usando|respeitando|observando|incluindo|de forma|com vistas|para)\b', rest, flags=re.I)
    if m and m.start() > 8:
        candidates.append(m.start())
    if candidates:
        return rest[:min(candidates)].strip(' ,.;:')
    return rest.strip(' ,.;:')

def extract_object_core(statement: str, verbs: list[str]) -> str:
    s = normalize_spaces(statement)
    low = s.lower()
    start = 0
    # remove leading verb sequence.
    for v in verbs[:3]:
        m = re.search(r'\b' + re.escape(v) + r'\b', low[start:start + 120])
        if m:
            start = start + m.end()
            # consume chained "e <verb>" if close.
            continue
        break
    rest = s[start:].strip(' ,.;:') or s
    rest = cut_object_core(rest)
    # avoid huge cores; keep a semantically readable phrase.
    if len(rest) > 260:
        rest = first_sentence_fragment(rest, 260)
    return rest or first_sentence_fragment(s, 260)


def collect_connectors(statement: str) -> dict[str, list[str]]:
    s = normalize_spaces(statement)
    found = defaultdict(list)
    for label, pat in CONNECTOR_PATTERNS:
        for m in re.finditer(pat, s, flags=re.I):
            start = m.start()
            # collect from connector to next major punctuation/another connector.
            tail = s[start:]
            next_positions = []
            for _, pat2 in CONNECTOR_PATTERNS:
                for m2 in re.finditer(pat2, tail[len(m.group(0)):], flags=re.I):
                    next_positions.append(len(m.group(0)) + m2.start())
                    break
            punct = re.search(r'[.;]', tail)
            if punct:
                next_positions.append(punct.start())
            end = min([p for p in next_positions if p > 8], default=min(len(tail), 260))
            frag = tail[:end].strip(' ,.;')
            if frag and frag not in found[label]:
                found[label].append(frag)
    return {k: v[:5] for k, v in found.items()}


def extract_key_terms(statement: str) -> list[str]:
    s = normalize_spaces(statement)
    # Phrases introduced by prepositions and noun-ish words are important semantic tokens.
    candidates = []
    # quoted phrases
    candidates += re.findall(r'“([^”]{3,80})”|"([^"]{3,80})"', s)
    flat = []
    for item in candidates:
        if isinstance(item, tuple):
            flat += [x for x in item if x]
        else:
            flat.append(item)
    # capitalized terms and noun chunks between connectors
    chunks = re.split(STOP_SPLIT + r'|[,;().]', s, flags=re.I)
    for ch in chunks:
        ch = normalize_spaces(ch)
        # remove leading verbs
        words = ch.split()
        while words and words[0].lower() in VERB_SEMANTICS:
            words = words[1:]
        ch = ' '.join(words).strip(' -')
        if 3 <= len(ch) <= 120 and len(ch.split()) >= 2:
            flat.append(ch)
    # Keep contentful phrases; remove duplicates.
    seen = set()
    out = []
    for x in flat:
        x = normalize_spaces(x.strip(' ,.;:'))
        low = x.lower()
        if low in seen or len(low) < 4 or low in {'for o caso', 'o caso'}:
            continue
        seen.add(low)
        out.append(x)
        if len(out) >= 12:
            break
    return out


def semantic_commitments(statement: str, verbs: list[str], object_core: str, connectors: dict[str, list[str]], key_terms: list[str]) -> list[dict]:
    commits = []
    for i, vs in enumerate(verb_semantics(verbs), 1):
        commits.append({
            'id': f'C{i:02d}',
            'source': f'verbo "{vs["verb"]}"',
            'semantic_commitment': f'A resposta deve realizar {vs["semantic_operation"]}, não apenas mencionar o tema.',
            'evidence_required': vs['answer_evidence'],
        })
    commits.append({
        'id': f'C{len(commits)+1:02d}',
        'source': 'objeto nuclear do enunciado',
        'semantic_commitment': f'O objeto de operação é "{object_core}"; ele precisa aparecer como alvo da análise, produção, comparação ou intervenção.',
        'evidence_required': 'a resposta deve tratar esse objeto diretamente, sem trocar por um tema vizinho ou por opinião genérica',
    })
    for label, fragments in connectors.items():
        for frag in fragments[:3]:
            commits.append({
                'id': f'C{len(commits)+1:02d}',
                'source': label,
                'semantic_commitment': f'O trecho "{frag}" restringe o modo de cumprimento da habilidade.',
                'evidence_required': 'a resposta deve respeitar essa restrição como finalidade, meio, critério, contexto ou limite de interpretação',
            })
            if len(commits) >= 12:
                break
        if len(commits) >= 12:
            break
    for term in key_terms[:4]:
        if len(commits) >= 14:
            break
        commits.append({
            'id': f'C{len(commits)+1:02d}',
            'source': 'termo semântico relevante',
            'semantic_commitment': f'O termo "{term}" deve ser instanciado na situação-base ou retomado na avaliação da resposta.',
            'evidence_required': 'a resposta precisa demonstrar que compreendeu a função desse termo dentro da habilidade, não apenas repetir a palavra',
        })
    return commits


def operation_family(verbs: list[str]) -> str:
    if not verbs:
        return 'mobilização semântica'
    return VERB_SEMANTICS.get(verbs[0], ('mobilização semântica', ''))[0]


def make_semantic_model(rec: dict) -> dict:
    statement = normalize_spaces(rec['statement'])
    verbs = detect_verbs(statement)
    raw_object_core = extract_object_core(statement, verbs)
    relational = extract_relational_terms(statement, verbs)
    object_core = (f"fronteira entre {relational['terms'][0]} e {relational['terms'][1]}"
                   if relational.get('relation_type') and len(relational.get('terms', [])) >= 2 and verbs[0].lower() == 'diferenciar'
                   else raw_object_core)
    connectors = collect_connectors(statement)
    clauses = split_clauses(statement)
    gerunds = detect_gerund_actions(statement)
    key_terms = extract_key_terms(statement)
    if relational.get('relation_type'):
        raw_low = raw_object_core.lower()
        key_terms = [t for t in key_terms if t.lower() != raw_low]
    for term in relational.get('terms') or []:
        if term and term not in key_terms:
            key_terms.insert(0, term)
    commitments = semantic_commitments(statement, verbs, object_core, connectors, key_terms)
    for g in gerunds:
        commitments.append({
            'id': f"C{len(commitments)+1:02d}",
            'source': f"gerúndio/ação decorrente: {g['action']}",
            'semantic_commitment': f"O trecho '{g['clause']}' indica {g['semantic_role']} e deve aparecer como consequência avaliável da compreensão.",
            'evidence_required': 'a resposta deve mostrar essa ação decorrente quando ela for parte do enunciado, não apenas reconhecer o objeto inicial'
        })
    return {
        'normalized_statement': statement,
        'dominant_verbs': verbs,
        'verb_semantics': verb_semantics(verbs),
        'object_core': object_core,
        'raw_object_core': raw_object_core,
        'relational_terms': relational,
        'gerund_actions': gerunds,
        'semantic_clauses': clauses,
        'connector_constraints': connectors,
        'key_terms_from_statement': key_terms,
        'intrinsic_commitments': commitments,
        'operation_family': operation_family(verbs),
    }


def commitment_bullets(commitments: list[dict]) -> str:
    return '\n'.join(f'- {c["id"]} ({c["source"]}): {c["semantic_commitment"]} Evidência: {c["evidence_required"]}.' for c in commitments)


def connector_sentence(connectors: dict[str, list[str]]) -> str:
    if not connectors:
        return 'O enunciado não explicita muitos conectores de finalidade, meio ou condição; por isso a compreensão deve preservar com rigor o verbo e o objeto nuclear, sem inventar exigências externas.'
    parts = []
    labels = {
        'finalidade': 'finalidades',
        'meio_procedimento': 'meios/procedimentos',
        'condicao_contexto': 'condições/contextos',
        'criterio_limite': 'critérios/limites',
        'objeto_fonte': 'fontes/objetos materiais',
    }
    for k, vals in connectors.items():
        parts.append(f'{labels.get(k,k)}: ' + '; '.join(f'"{v}"' for v in vals[:3]))
    return 'O enunciado ainda fixa ' + ' | '.join(parts) + '. Esses trechos não são ornamentos: eles limitam o que conta como cumprimento da habilidade.'


def key_terms_sentence(terms: list[str]) -> str:
    if not terms:
        return 'Os termos nucleares devem ser extraídos diretamente do enunciado e da situação-base gerada.'
    return 'Termos nucleares extraídos da própria frase: ' + '; '.join(f'"{t}"' for t in terms[:8]) + '.'


def make_comprehensions(rec: dict, semantic: dict) -> dict:
    code = rec['code']
    meta = rec['meta']
    statement = semantic['normalized_statement']
    verbs = semantic['dominant_verbs']
    verb_chain = ', '.join(f'"{v}"' for v in verbs)
    object_core = semantic['object_core']
    op_family = semantic['operation_family']
    commitments = semantic['intrinsic_commitments']
    stage = meta.get('etapa') or 'BNCC'
    year = meta.get('ano_ou_bloco') or 'ano/bloco indicado pelo código'

    bncc_context = f"""A compreensão de {code} deve nascer da linguagem do próprio enunciado, antes de qualquer repertório externo. O enunciado diz: “{statement}”. A primeira camada semântica é a cadeia verbal {verb_chain}; ela define que o estudante deve realizar uma operação de {op_family}. Portanto, a habilidade não é o assunto nominal da frase, mas a ação mental, discursiva, corporal, investigativa ou produtiva que a frase manda executar.

O objeto nuclear dessa operação é: “{object_core}”. Esse objeto é o centro de gravidade da habilidade. Um avaliador ou LLM não deve aceitar como compreensão plena uma resposta que fale de tema próximo, conteúdo decorado ou opinião lateral sem operar diretamente sobre esse objeto. A compreensão nasce quando o estudante transforma esse objeto segundo a ação verbal exigida: reconhecer, distinguir, relacionar, analisar, produzir, justificar, resolver ou intervir, conforme o caso.

{connector_sentence(semantic['connector_constraints'])} {key_terms_sentence(semantic['key_terms_from_statement'])}

O conhecimento completo da habilidade é a composição interna desses compromissos semânticos:
{commitment_bullets(commitments)}

Assim, o contexto BNCC aqui não deve ser entendido como pano de fundo genérico da disciplina. Ele é o contrato de sentido formado por verbo, objeto, condições, meios, critérios e finalidade. Para {stage}, {year}, a profundidade esperada não é aumentar conteúdo externo, mas tornar observável se o estudante cumpriu a arquitetura semântica da frase."""

    text_base = f"""O texto-base ou situação-base de {code} deve ser construído como uma encarnação da frase da habilidade. A regra é: cada verbo vira uma ação exigível; o objeto nuclear vira o material sobre o qual o aluno opera; cada conector vira uma restrição de construção; cada termo relevante vira uma entidade, dado, fala, fonte, fenômeno, problema, prática ou produto dentro da cena.

A construção começa pelo objeto “{object_core}”. A situação-base precisa dar existência concreta a esse objeto, com elementos suficientes para que o estudante possa executar {op_family}. Se o objeto for textual, a base deve trazer materialidade textual e pistas de linguagem; se for matemático, deve trazer dados, relações e condições de verificação; se for científico, deve trazer fenômeno, observação, variável ou evidência; se for histórico-geográfico, deve trazer fonte, tempo, espaço, sujeitos, escala ou conflito; se for artístico/corporal, deve trazer prática, forma, materialidade, gesto, composição ou experiência. A escolha dessas formas deve obedecer ao enunciado, não a um tema externo inventado.

A situação-base deve conter uma tensão semântica: algo que impeça a resposta automática. Essa tensão pode ser contraste entre categorias, dado insuficiente que exige inferência controlada, conflito entre pontos de vista, necessidade de escolha de procedimento, adequação a interlocutor, comparação entre fontes, passagem de representação, problema com restrições ou produção com critérios. Sem essa tensão, a pergunta mede reconhecimento superficial, não compreensão da habilidade.

A construção mínima deve gerar, antes da pergunta ao estudante, estes artefatos internos: 1) objeto instanciado; 2) ações exigidas pelos verbos {verb_chain}; 3) pistas explícitas; 4) pistas inferenciais; 5) critérios de sucesso; 6) erro plausível; 7) evidência mínima que uma boa resposta precisa conter; 8) limite do que seria conteúdo externo ou extrapolação. A situação-base não deve explicar a habilidade ao aluno; ela deve oferecer matéria para que a habilidade seja exercida."""

    internal = f"""A análise interna do texto-base de {code} deve funcionar como uma matriz de alinhamento entre linguagem da habilidade, situação gerada e resposta do aluno. O LLM deve primeiro reconstruir a habilidade em unidades semânticas, sem consultar uma resposta ideal externa: verbo(s) {verb_chain}; objeto “{object_core}”; restrições e finalidades registradas nos conectores; termos nucleares; evidências possíveis.

Depois, o LLM deve percorrer o texto-base e marcar onde cada unidade aparece. Para cada compromisso semântico, ele deve responder: há material suficiente no texto-base para o aluno cumprir esse compromisso? A pista é explícita ou inferencial? Há distrator ou ambiguidade produtiva? O texto obriga a realizar a operação verbal ou apenas permite repetir conteúdo? O texto contém excesso que desloca a habilidade para outra competência? Essa análise impede que a avaliação seja baseada em impressão geral.

Para analisar uma resposta do estudante, o LLM deve decompor a resposta em proposições. Cada proposição deve ser ligada a um dos compromissos C01, C02, C03... do modelo semântico. Uma resposta é forte quando: executa o verbo dominante, trata o objeto nuclear, usa evidência da situação-base, respeita condições/finalidades do enunciado, explicita uma relação ou procedimento e não depende de informação externa não dada. Uma resposta é fraca quando apenas repete palavras da habilidade, responde por opinião solta, troca o objeto, ignora o critério, usa moralização genérica, calcula sem interpretar, interpreta sem evidência ou produz algo formalmente correto mas desalinhado ao verbo.

Escala de avaliação semântica para o LLM:
- Nível 0: não responde ao objeto da habilidade ou fala de outro tema.
- Nível 1: reconhece palavras/tema, mas não executa a operação verbal.
- Nível 2: executa parte da operação, com evidência incompleta ou justificativa frágil.
- Nível 3: cumpre verbo + objeto + evidência + critério principal do enunciado.
- Nível 4: cumpre o nível 3 e ainda explicita limites, relações, alternativas ou consequências sem extrapolar o material.

O julgamento final deve informar quais compromissos foram atendidos, quais faltaram, qual trecho da resposta sustenta cada decisão e que reescrita mínima levaria a resposta ao próximo nível."""

    question = f"""As perguntas de {code} devem ser derivadas dos compromissos semânticos, não de uma lista genérica de exercícios. O comando deve fazer o aluno realizar a operação {op_family} sobre “{object_core}”, exigindo que ele mostre o caminho da compreensão. Uma boa pergunta pede evidência, critério, comparação, procedimento, justificativa ou produto, conforme o verbo da habilidade.

O LLM gerador deve criar perguntas que obriguem o estudante a ligar sua resposta a elementos da situação-base. O LLM avaliador deve verificar se a resposta cumpre a cadeia: dado selecionado → operação feita → relação/critério aplicado → conclusão ou produto. Quando a pergunta é aberta, a avaliação não deve procurar uma única frase correta; deve procurar aderência aos compromissos semânticos da habilidade."""

    rewrite = f"""O relatório de reescrita de {code} deve revisar a própria construção OKF. Ele deve perguntar se a compreensão criada a partir da frase foi suficiente para gerar uma situação-base avaliável, uma pergunta alinhada e uma rubrica capaz de analisar respostas. A falha pode estar em quatro lugares: 1) resposta do aluno; 2) pergunta que não acionou o verbo; 3) texto-base sem pistas suficientes; 4) OKF que interpretou mal objeto, conector, finalidade ou critério.

A reescrita deve agir no menor ponto necessário: reforçar o objeto nuclear, tornar uma pista observável, retirar conteúdo externo, explicitar critério, ajustar o nível etário ou trocar uma pergunta de memória por uma pergunta de operação semântica. O objetivo é melhorar a capacidade do sistema de avaliar compreensão, não apenas produzir textos mais longos."""

    return {
        'bncc_context_comprehension': bncc_context,
        'text_base_comprehension': text_base,
        'text_base_internal_analysis_comprehension': internal,
        'question_topic_comprehension': question,
        'rewrite_report_comprehension': rewrite,
    }


def make_response_assessment_model(semantic: dict) -> dict:
    commitments = semantic['intrinsic_commitments']
    return {
        'assessment_principle': 'Avaliar compreensão como cumprimento dos compromissos semânticos internos da habilidade, não como semelhança superficial com gabarito.',
        'llm_procedure': [
            'Normalizar a resposta do estudante em proposições curtas.',
            'Associar cada proposição aos compromissos C01...Cn do semantic_model.intrinsic_commitments.',
            'Verificar se a resposta executa o verbo dominante e trata o objeto nuclear.',
            'Exigir evidência da situação-base sempre que a habilidade pede identificar, analisar, comparar, inferir, justificar, resolver ou produzir em contexto.',
            'Penalizar resposta que use apenas opinião, repetição lexical, extrapolação externa ou troca de objeto.',
            'Atribuir nível 0-4 e explicar qual compromisso falta para subir de nível.',
        ],
        'dimensions': [
            {'name': 'operacao_verbal', 'question': 'A resposta realiza a ação exigida pelo verbo da habilidade?', 'weight': 2},
            {'name': 'objeto_nuclear', 'question': 'A resposta opera sobre o objeto correto do enunciado?', 'weight': 2},
            {'name': 'evidencia_situada', 'question': 'A resposta usa dado, pista, fonte, cálculo, forma ou experiência da situação-base?', 'weight': 2},
            {'name': 'criterio_condicao_finalidade', 'question': 'A resposta respeita conectores de finalidade, meio, condição e critério?', 'weight': 2},
            {'name': 'justificativa_metacognitiva', 'question': 'A resposta mostra por que chegou à conclusão/produto, em vez de só afirmar?', 'weight': 1},
            {'name': 'limite_de_extrapolacao', 'question': 'A resposta evita inventar conteúdo externo não sustentado?', 'weight': 1},
        ],
        'levels': {
            '0': 'Desalinhado: não trata o objeto ou responde outro tema.',
            '1': 'Lexical: repete palavras da habilidade ou do texto, mas não opera semanticamente.',
            '2': 'Parcial: executa parte do verbo ou usa evidência insuficiente.',
            '3': 'Adequado: verbo, objeto, evidência e critério principal estão alinhados.',
            '4': 'Avançado: além do adequado, explicita limites, relações alternativas, procedimento ou consequência sem extrapolar.',
        },
        'commitment_checklist': [{'id': c['id'], 'expected': c['semantic_commitment'], 'evidence': c['evidence_required']} for c in commitments],
        'common_failure_modes': [
            'tema_sem_operacao',
            'objeto_trocado',
            'evidencia_ausente',
            'opiniao_solto_moralizacao',
            'procedimento_sem_interpretacao',
            'interpretacao_sem_pista',
            'produto_sem_criterio_de_genero_ou_finalidade',
            'uso_de_conteudo_externo_nao_dado',
        ],
    }


def make_okf(rec: dict) -> dict:
    semantic = make_semantic_model(rec)
    comp = make_comprehensions(rec, semantic)
    meta = rec['meta']
    code = rec['code']
    rb = {
        'codigo': code,
        'etapa': meta.get('etapa'),
        'segmento': meta.get('segmento'),
        'ano_ou_bloco': meta.get('ano_ou_bloco'),
        'area': meta.get('area'),
        'componente': meta.get('componente'),
        'campo_ou_unidade': meta.get('campo_ou_unidade'),
        'competencia_relacionada': meta.get('competencia_relacionada'),
        'pagina_pdf': rec.get('page'),
        'habilidade': rec['statement'],
    }
    title_verb = semantic['dominant_verbs'][0].capitalize() if semantic['dominant_verbs'] else 'Mobilizar'
    return {
        'okf_version': BUNDLE_VERSION,
        'type': 'bncc_skill_okf_semantic_intrinsic',
        'title': f'{code} - {title_verb}: {first_sentence_fragment(semantic["object_core"], 70)}',
        'recorte_bncc': rb,
        'semantic_model': semantic,
        'comprehensions': comp,
        'response_assessment_model': make_response_assessment_model(semantic),
        'source': {
            'page_pdf': rec.get('page'),
            'statement_source': rec.get('statement_source'),
            'statement_sha256': hashlib.sha256(rec['statement'].encode('utf-8')).hexdigest(),
            'generation_principle': 'intrinsic_semantic_construction_from_skill_statement',
        },
    }


def json_block(obj) -> str:
    return json.dumps(obj, ensure_ascii=False, indent=2)


def make_markdown(okf: dict) -> str:
    comp = okf['comprehensions']
    return f"""# {okf['title']}

## recorte_bncc
```json
{json_block(okf['recorte_bncc'])}
```

## semantic_model
```json
{json_block(okf['semantic_model'])}
```

## bncc_context_comprehension
{comp['bncc_context_comprehension']}

## text_base_comprehension
{comp['text_base_comprehension']}

## text_base_internal_analysis_comprehension
{comp['text_base_internal_analysis_comprehension']}

## question_topic_comprehension
{comp['question_topic_comprehension']}

## response_assessment_model
```json
{json_block(okf['response_assessment_model'])}
```

## rewrite_report_comprehension
{comp['rewrite_report_comprehension']}

## source_trace
```json
{json_block(okf['source'])}
```
"""


def build_area_index(records: list[dict]) -> dict:
    areas: dict[str, dict[str, list[str]]] = defaultdict(lambda: defaultdict(list))
    for r in records:
        meta = r['meta']
        areas[meta.get('area') or 'BNCC'][meta.get('componente') or 'BNCC'].append(r['code'])
    return {area: {component: sorted(codes) for component, codes in comps.items()} for area, comps in sorted(areas.items())}


def main() -> None:
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    bundle_name = f'bncc_okf_bundle_semantic_v2_{timestamp}'
    bundle_dir = OUT_ROOT / bundle_name
    if bundle_dir.exists():
        shutil.rmtree(bundle_dir)
    for d in ['okfs_md', 'okfs_json', 'index', 'schema', 'source_references', 'samples']:
        (bundle_dir / d).mkdir(parents=True, exist_ok=True)

    records = load_records()
    okfs = []
    by_code = {}
    by_component = defaultdict(lambda: {'count': 0, 'codes': []})
    by_stage = Counter()
    by_area = Counter()
    source_counts = Counter()

    for rec in records:
        okf = make_okf(rec)
        okfs.append(okf)
        meta = rec['meta']
        rel_dir = Path(slug(meta.get('etapa') or 'bncc')) / slug(meta.get('area') or 'bncc') / slug(meta.get('componente') or 'bncc')
        md_path = bundle_dir / 'okfs_md' / rel_dir / f'{rec["code"]}.okf.md'
        json_path = bundle_dir / 'okfs_json' / rel_dir / f'{rec["code"]}.okf.json'
        md_path.parent.mkdir(parents=True, exist_ok=True)
        json_path.parent.mkdir(parents=True, exist_ok=True)
        md_path.write_text(make_markdown(okf), encoding='utf-8')
        json_path.write_text(json.dumps(okf, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
        by_code[rec['code']] = {
            'code': rec['code'],
            'etapa': meta.get('etapa'),
            'area': meta.get('area'),
            'componente': meta.get('componente'),
            'ano_ou_bloco': meta.get('ano_ou_bloco'),
            'campo_ou_unidade': meta.get('campo_ou_unidade'),
            'page': rec.get('page'),
            'statement': rec['statement'],
            'dominant_verbs': okf['semantic_model']['dominant_verbs'],
            'object_core': okf['semantic_model']['object_core'],
            'md_path': str(md_path.relative_to(bundle_dir)),
            'json_path': str(json_path.relative_to(bundle_dir)),
            'statement_source': rec.get('statement_source'),
        }
        key = f"{meta.get('area')} / {meta.get('componente')}"
        by_component[key]['count'] += 1
        by_component[key]['codes'].append(rec['code'])
        by_stage[meta.get('etapa')] += 1
        by_area[meta.get('area')] += 1
        source_counts[rec.get('statement_source')] += 1

    by_component = {k: {'count': v['count'], 'codes': sorted(v['codes'])} for k, v in sorted(by_component.items())}
    all_skills_payload = {
        'generated_at': datetime.now(timezone.utc).isoformat(),
        'source_pdf': PDF_PATH.name,
        'source_json_reference': LP_JSON_PATH.name,
        'source_template_reference': EF69_TEMPLATE_PATH.name,
        'total_skills': len(records),
        'semantic_generation': 'intrinsic construction from the language of each BNCC statement',
        'areas': build_area_index(records),
        'skills': [by_code[k] for k in sorted(by_code)],
    }

    manifest = {
        'bundle_name': bundle_name,
        'okf_version': BUNDLE_VERSION,
        'generated_at': datetime.now(timezone.utc).isoformat(),
        'description': 'OKF bundle regenerado para carregar compreensão semântica profunda: verbo, objeto, conectores, compromissos intrínsecos da habilidade e modelo de avaliação de resposta por LLM.',
        'source_files': {
            'bncc_pdf': PDF_PATH.name,
            'lingua_portuguesa_json': LP_JSON_PATH.name,
            'ef69lp01_template': EF69_TEMPLATE_PATH.name,
            'prior_extracted_index': str(PREV_INDEX.name),
        },
        'counts': {
            'total_okfs': len(records),
            'by_stage': dict(sorted(by_stage.items())),
            'by_area': dict(sorted(by_area.items())),
            'by_component': {k: v['count'] for k, v in by_component.items()},
            'statement_sources': dict(source_counts),
        },
        'semantic_contract': {
            'principle': 'O conhecimento da habilidade é construído da linguagem da própria frase: verbo + objeto + conectores + critérios + finalidade + termos nucleares.',
            'core_sections': [
                'semantic_model',
                'bncc_context_comprehension',
                'text_base_comprehension',
                'text_base_internal_analysis_comprehension',
                'response_assessment_model',
            ],
            'assessment': 'O LLM avalia resposta por alinhamento aos compromissos semânticos, não por gabarito rígido ou conhecimento externo.',
        },
        'layout': {
            'markdown_okfs': 'okfs_md/<etapa>/<area>/<componente>/<codigo>.okf.md',
            'json_okfs': 'okfs_json/<etapa>/<area>/<componente>/<codigo>.okf.json',
            'indexes': 'index/',
            'samples': 'samples/',
            'schema': 'schema/skill_okf_semantic_v2.schema.json',
        },
        'quality_note': 'Geração programática semanticamente enriquecida. Ainda assim, habilidades extraídas automaticamente do PDF podem carregar ruídos de OCR/extração do documento original.',
    }

    (bundle_dir / 'manifest.okf.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    (bundle_dir / 'index' / 'habilidades_bncc_all.json').write_text(json.dumps(all_skills_payload, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    (bundle_dir / 'index' / 'by_code.json').write_text(json.dumps(by_code, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    (bundle_dir / 'index' / 'by_component.json').write_text(json.dumps(by_component, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    with (bundle_dir / 'index' / 'okfs.jsonl').open('w', encoding='utf-8') as f:
        for okf in okfs:
            f.write(json.dumps(okf, ensure_ascii=False) + '\n')

    schema = {
        '$schema': 'https://json-schema.org/draft/2020-12/schema',
        'title': 'BNCC Skill OKF Semantic Intrinsic V2',
        'type': 'object',
        'required': ['okf_version', 'type', 'title', 'recorte_bncc', 'semantic_model', 'comprehensions', 'response_assessment_model', 'source'],
        'properties': {
            'okf_version': {'const': BUNDLE_VERSION},
            'type': {'const': 'bncc_skill_okf_semantic_intrinsic'},
            'title': {'type': 'string'},
            'recorte_bncc': {'type': 'object'},
            'semantic_model': {
                'type': 'object',
                'required': ['dominant_verbs', 'object_core', 'intrinsic_commitments'],
            },
            'comprehensions': {
                'type': 'object',
                'required': ['bncc_context_comprehension', 'text_base_comprehension', 'text_base_internal_analysis_comprehension', 'question_topic_comprehension', 'rewrite_report_comprehension'],
            },
            'response_assessment_model': {'type': 'object'},
            'source': {'type': 'object'},
        },
    }
    (bundle_dir / 'schema' / 'skill_okf_semantic_v2.schema.json').write_text(json.dumps(schema, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')

    # samples for direct inspection
    for code in ['EF69LP01', 'EF69LP02', 'EF05MA01', 'EF06CI01', 'EF06HI01', 'EM13CHS101']:
        item = by_code.get(code)
        if item:
            src = bundle_dir / item['md_path']
            shutil.copy2(src, bundle_dir / 'samples' / f'{code}.okf.md')

    # source refs and generator
    if EF69_TEMPLATE_PATH.exists():
        shutil.copy2(EF69_TEMPLATE_PATH, bundle_dir / 'source_references' / 'ef69lp01_reference.md')
    if LP_JSON_PATH.exists():
        shutil.copy2(LP_JSON_PATH, bundle_dir / 'source_references' / 'bncc_linguagens_lingua_portuguesa_reference.json')
    (bundle_dir / 'source_references' / 'SOURCE_NOTE.md').write_text(
        'O PDF completo não foi duplicado no bundle para manter o arquivo menor. O manifesto registra o PDF fonte. A extração textual base veio do bundle anterior gerado a partir do PDF e do JSON de Língua Portuguesa.\n',
        encoding='utf-8',
    )
    shutil.copy2(Path(__file__), bundle_dir / 'tools_generate_bncc_okf_bundle_semantic_v2.py')

    readme = f"""# BNCC OKF Bundle — Semantic Intrinsic V2

Este bundle corrige o problema do primeiro pacote: os OKFs agora não são apenas moldes genéricos por componente/verbo. Cada habilidade gera uma compreensão interna a partir da própria linguagem do enunciado.

## Núcleo da geração

Para cada código BNCC, o gerador constrói:

- `semantic_model`: verbo(s) dominante(s), objeto nuclear, cláusulas, conectores, termos nucleares e compromissos intrínsecos.
- `bncc_context_comprehension`: compreensão da habilidade como contrato semântico da frase.
- `text_base_comprehension`: linguagem de construção da situação-base a partir de verbo + objeto + conectores.
- `text_base_internal_analysis_comprehension`: como o LLM deve mapear texto-base, pergunta e resposta do aluno aos compromissos semânticos.
- `response_assessment_model`: procedimento e rubrica 0–4 para avaliação da compreensão da resposta.

## Totais

- Total de OKFs: {len(records)}
- Por etapa: {json.dumps(dict(sorted(by_stage.items())), ensure_ascii=False)}
- Fonte dos enunciados: {json.dumps(dict(source_counts), ensure_ascii=False)}

## Arquivos importantes

- `samples/EF69LP01.okf.md`: amostra direta do formato corrigido.
- `index/okfs.jsonl`: todos os OKFs em JSONL.
- `okfs_md/`: todos os OKFs em Markdown.
- `okfs_json/`: todos os OKFs em JSON estruturado.
"""
    (bundle_dir / 'README.md').write_text(readme, encoding='utf-8')

    md_count = len(list((bundle_dir / 'okfs_md').rglob('*.okf.md')))
    json_count = len(list((bundle_dir / 'okfs_json').rglob('*.okf.json')))
    assert md_count == len(records), (md_count, len(records))
    assert json_count == len(records), (json_count, len(records))

    zip_path = OUT_ROOT / f'{bundle_name}.zip'
    with zipfile.ZipFile(zip_path, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=9) as z:
        for path in sorted(bundle_dir.rglob('*')):
            if path.is_file():
                z.write(path, path.relative_to(bundle_dir.parent))

    print(json.dumps({
        'bundle_dir': str(bundle_dir),
        'zip_path': str(zip_path),
        'total_okfs': len(records),
        'md_count': md_count,
        'json_count': json_count,
        'sample_EF69LP01': str((bundle_dir / 'samples' / 'EF69LP01.okf.md')),
        'zip_size_bytes': zip_path.stat().st_size,
    }, ensure_ascii=False, indent=2))

if __name__ == '__main__':
    main()
