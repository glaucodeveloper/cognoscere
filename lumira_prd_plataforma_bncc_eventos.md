# PRD — Lumira

## Plataforma de Educação por Competências Cognitivas, Áreas BNCC, Eventos e Progressão Social

---

# 1. Visão do Produto

## 1.1 Nome

**Lumira**

## 1.2 Definição

Lumira é uma plataforma educacional orientada por competências cognitivas, estruturada a partir das áreas do conhecimento da BNCC, com cursos organizados como áreas de exercício prático para aumento de competências humanas.

A plataforma não trata a educação como simples consumo de conteúdo. Ela organiza o aprendizado como uma jornada de prática, evidência, progressão, participação social e desenvolvimento integral.

Na Lumira, o aluno evolui por meio de:

```txt
Competências cognitivas
→ Segmentos de curso
→ Questões e práticas
→ Eventos
→ Evidências
→ Avaliação
→ Progressão de perfil
```

---

# 2. Princípio Pedagógico Central

## 2.1 Competência como ação cognitiva

Na Lumira, competência é uma ação cognitiva humana.

Ela é representada por verbos como:

- Interpretar
- Calcular
- Argumentar
- Textualizar
- Organizar
- Investigar
- Contextualizar
- Mapear
- Comparar
- Analisar
- Criar
- Programar
- Resolver
- Avaliar
- Explicar

A competência não é a disciplina.

A competência não é o conteúdo.

A competência é a ação mental exercida sobre um objeto de conhecimento.

---

## 2.2 Fórmula operacional

```txt
Competência + Objeto + Evidência = Segmento de Curso
```

Exemplos:

```txt
Interpretar + texto argumentativo + comentário crítico
Calcular + orçamento mensal + planilha
Investigar + fenômeno natural + relatório
Contextualizar + evento histórico + linha do tempo
Mapear + território local + mapa comentado
Criar + peça visual + publicação
Programar + solução digital + protótipo funcional
```

As competências reais são apenas os verbos:

```txt
Interpretar
Calcular
Investigar
Contextualizar
Mapear
Criar
Programar
```

A combinação completa forma um segmento de curso, missão, prática ou questão.

---

# 3. Organização por Áreas do Conhecimento

A Lumira organiza o conhecimento por áreas, não por disciplinas isoladas.

As áreas funcionam como grandes campos de exercício cognitivo.

## 3.1 Áreas BNCC suportadas

### Educação Infantil

Campos de experiência:

- O eu, o outro e o nós
- Corpo, gestos e movimentos
- Traços, sons, cores e formas
- Escuta, fala, pensamento e imaginação
- Espaços, tempos, quantidades, relações e transformações

### Ensino Fundamental

Áreas:

- Linguagens
- Matemática
- Ciências da Natureza
- Ciências Humanas
- Ensino Religioso

### Ensino Médio

Áreas:

- Linguagens e suas Tecnologias
- Matemática e suas Tecnologias
- Ciências da Natureza e suas Tecnologias
- Ciências Humanas e Sociais Aplicadas

---

# 4. Base BNCC Categorizada

## 4.1 Objetivo da base

A base BNCC categorizada serve como motor para:

- geração de questões;
- formação de segmentos de curso;
- recomendação de práticas;
- cálculo de progressão;
- avaliação por competência;
- organização de trilhas;
- criação de eventos;
- personalização da jornada.

---

## 4.2 Estrutura da base

Cada habilidade BNCC deve ser armazenada com:

```ts
type BnccSkill = {
  codigo: string;
  etapa: string;
  area_bncc: string;
  componente_fonte?: string;
  campo_experiencia?: string;
  texto_habilidade: string;
  verbos_bncc: string[];
  competencia_lumira: string;
  objetos_possiveis: string[];
  evidencias_possiveis: string[];
  pagina_pdf?: number;
};
```

---

## 4.3 Distribuição inicial das habilidades

A base inicial extraída possui:

```txt
Total: 1580 habilidades/objetivos
```

Distribuição por área:

```txt
Educação Infantil: 93
Linguagens: 609
Matemática: 247
Ciências da Natureza: 111
Ciências Humanas: 274
Ensino Religioso: 63
Linguagens e suas Tecnologias: 82
Matemática e suas Tecnologias: 43
Ciências da Natureza e suas Tecnologias: 26
Ciências Humanas e Sociais Aplicadas: 32
```

---

# 5. Cursos como Áreas de Exercício

## 5.1 Definição

Na Lumira, curso não é apenas uma sequência de aulas.

Curso é uma área de exercício para aumentar competências.

Um curso agrupa segmentos práticos que exercitam ações cognitivas em objetos progressivos.

---

## 5.2 Estrutura de curso

```ts
type Course = {
  id: string;
  title: string;
  area_bncc: string;
  description: string;
  target_age_range?: string;
  target_school_stage?: string;
  competencies: string[];
  segments: CourseSegment[];
  events_enabled: boolean;
  mentor_posts_enabled: boolean;
};
```

---

## 5.3 Exemplo de curso

```ts
const cursoInterpretacaoCritica = {
  id: "interpretacao-critica-midias",
  title: "Interpretação Crítica de Mídias",
  area_bncc: "Linguagens",
  competencies: ["Interpretar", "Inferir", "Argumentar", "Avaliar"],
  segments: [
    {
      competence: "Interpretar",
      object: "postagem de rede social",
      evidence: "comentário crítico"
    },
    {
      competence: "Inferir",
      object: "meme ou charge",
      evidence: "explicação do efeito de humor"
    },
    {
      competence: "Argumentar",
      object: "discurso público",
      evidence: "resposta justificada"
    }
  ]
};
```

---

# 6. Segmentos de Curso

## 6.1 Definição

Segmento é a menor unidade pedagógica da Lumira.

Ele conecta:

```txt
Área BNCC
+ Habilidade BNCC
+ Competência Lumira
+ Objeto
+ Evidência
+ Questão/Prática
+ Critério de avaliação
```

---

## 6.2 Estrutura

```ts
type CourseSegment = {
  id: string;
  area_bncc: string;
  habilidade_bncc_codigo: string;
  competencia: string;
  objeto: string;
  evidencia: string;
  difficulty: "inicial" | "intermediario" | "avancado" | "dominante";
  question_template_id?: string;
  event_compatible: boolean;
  mentor_post_compatible: boolean;
};
```

---

## 6.3 Exemplo

```ts
const segmento = {
  id: "interpretar-texto-argumentativo-comentario-critico",
  area_bncc: "Linguagens",
  habilidade_bncc_codigo: "EF69LP01",
  competencia: "Argumentar",
  objeto: "situação discursiva pública",
  evidencia: "comentário crítico justificado",
  difficulty: "intermediario",
  event_compatible: true,
  mentor_post_compatible: true
};
```

---

# 7. Geração de Questões

## 7.1 Objetivo

A geração de questões deve transformar habilidades BNCC em situações avaliativas aplicadas.

A questão não deve cobrar memorização pura. Ela deve testar a competência cognitiva.

---

## 7.2 Pipeline

```txt
1. Selecionar área BNCC
2. Selecionar habilidade BNCC
3. Extrair verbo cognitivo central
4. Mapear competência Lumira
5. Definir objeto de incidência
6. Definir evidência esperada
7. Gerar questão
8. Gerar rubrica de avaliação
9. Atualizar progressão se houver resposta válida
```

---

## 7.3 Estrutura de questão

```ts
type GeneratedQuestion = {
  id: string;
  area_bncc: string;
  habilidade_bncc_codigo: string;
  competencia: string;
  objeto: string;
  enunciado: string;
  tipo: "resposta_aberta" | "multipla_escolha" | "projeto" | "missao" | "evento";
  evidencia_esperada: string;
  criterios_avaliacao: EvaluationCriteria[];
  xp_reward: number;
};
```

---

# 8. Sistema de Competências

## 8.1 Definição

Competências são atributos cognitivos do perfil do aluno.

Cada competência possui:

- nível;
- XP acumulado;
- histórico de evidências;
- habilidades BNCC relacionadas;
- segmentos concluídos;
- eventos participados;
- avaliações recebidas.

---

## 8.2 Estrutura

```ts
type UserCompetence = {
  competence_id: string;
  name: string;
  area_distribution: Record<string, number>;
  level: number;
  xp: number;
  state: CompetenceState;
  evidence_count: number;
  last_activity_at: string;
};
```

---

## 8.3 Estados de competência

Os níveis não devem ser verbos, porque os verbos são as competências.

Estados corretos:

```txt
1. Contato Inicial
2. Intuição Orientada
3. Autonomia Básica
4. Domínio Articulado
5. Maestria Criativa
```

---

## 8.4 Progressão

```txt
Questão respondida
→ Evidência gerada
→ Avaliação por IA, mentor ou comunidade
→ XP distribuído na competência
→ Perfil atualizado
→ Novos segmentos liberados
```

---

# 9. Perfil do Aluno

## 9.1 Objetivo

O perfil é o mapa vivo da evolução do aluno.

Ele mostra como a pessoa está se formando em ações cognitivas, não apenas em notas escolares.

---

## 9.2 Elementos do perfil

- Avatar
- Nome
- Bio
- Série/idade opcional
- Áreas em desenvolvimento
- Competências principais
- Radar de competências
- Histórico de evidências
- Cursos ativos
- Eventos participados
- Badges
- Score geral
- Score por área
- Publicações
- Mentor responsável ou mentores seguidos

---

# 10. Sistema de Eventos

## 10.1 Objetivo

Eventos são o motor social de progressão.

Eles transformam habilidades e competências em situações reais de prática.

---

## 10.2 Tipos de eventos

- Desafio Individual
- Competição
- Colaboração
- Hackathon Educacional
- Arena de Argumentação
- Laboratório de Investigação
- Temporada Lumira

---

## 10.3 Estrutura de evento

```ts
type Event = {
  id: string;
  title: string;
  area_bncc: string;
  type: EventType;
  related_skills: string[];
  target_competencies: string[];
  description: string;
  start_at: string;
  end_at: string;
  participation_mode: "individual" | "team" | "mixed";
  matchmaking_enabled: boolean;
  submissions: Submission[];
  scoreboard_id?: string;
  mentor_posts_enabled: boolean;
};
```

---

## 10.4 Pontuação de evento

Cada evento distribui XP para competências.

Exemplo:

```ts
const eventXpDistribution = {
  "Argumentar": 40,
  "Interpretar": 25,
  "Textualizar": 20,
  "Comunicar": 15
};
```

---

# 11. Matchmaking

## 11.1 Objetivo

Criar times por complementaridade de competências.

O matchmaking considera:

- competências fortes;
- competências em desenvolvimento;
- área do evento;
- objetivo do aluno;
- histórico de colaboração;
- disponibilidade;
- nível de autonomia.

---

# 12. Scoreboard

## 12.1 Objetivo

O scoreboard mostra progressão e desempenho sem reduzir o aluno a uma nota única.

## 12.2 Tipos de ranking

- Ranking geral
- Ranking por área BNCC
- Ranking por competência
- Ranking por evento
- Ranking por evolução
- Ranking de colaboração
- Ranking de mentoria
- Ranking de evidências publicadas

---

# 13. Página de Postagens dos Mentores

## 13.1 Objetivo

Criar uma área pública/social onde mentores publicam orientações, desafios, comentários, repertórios e convites para eventos.

---

## 13.2 Tipos de postagem

- Orientação
- Desafio
- Convite para evento
- Feedback público
- Repertório
- Curadoria BNCC

---

## 13.3 Estrutura de postagem

```ts
type MentorPost = {
  id: string;
  mentor_id: string;
  title: string;
  content: string;
  area_bncc?: string;
  related_skills?: string[];
  related_competencies?: string[];
  related_event_id?: string;
  post_type:
    | "orientacao"
    | "desafio"
    | "convite_evento"
    | "feedback_publico"
    | "repertorio"
    | "curadoria_bncc";
  visibility: "public" | "students" | "course" | "event";
  created_at: string;
  comments_enabled: boolean;
  submissions_enabled: boolean;
};
```

---

# 14. Sistema de Mentores

Mentores atuam como curadores, avaliadores e provocadores de prática.

Eles podem:

- criar posts;
- criar desafios;
- criar eventos;
- avaliar evidências;
- comentar entregas;
- sugerir trilhas;
- vincular habilidades BNCC;
- destacar alunos;
- publicar feedback coletivo.

---

# 15. IA Lumira

## 15.1 Papéis

A IA atua como:

- geradora de questões;
- avaliadora preliminar;
- tutora;
- explicadora de habilidade BNCC;
- recomendadora de próximos passos;
- organizadora de evidências;
- assistente do mentor.

---

# 16. CMS Lumira

## 16.1 Objetivo

O CMS deve permitir gestão versionada dos dados vivos da plataforma.

Dados principais:

- habilidades BNCC categorizadas;
- áreas do conhecimento;
- competências;
- cursos;
- segmentos;
- eventos;
- posts de mentores;
- perfis;
- evidências;
- rubricas;
- templates de questões.

---

## 16.2 Entidades editoriais

```txt
areas
skills
competencies
courses
segments
events
mentor_posts
question_templates
rubrics
profiles
submissions
badges
scoreboards
```

---

# 17. Funcionalidades MVP

## 17.1 Aluno

- Criar conta
- Ver perfil
- Ver competências
- Entrar em curso
- Responder questões
- Participar de evento
- Publicar evidência
- Ver evolução
- Ver posts de mentores

## 17.2 Mentor

- Criar postagem
- Criar desafio
- Criar evento
- Avaliar evidência
- Acompanhar alunos
- Recomendar segmentos
- Fazer curadoria de habilidade BNCC

## 17.3 Admin/CMS

- Gerenciar áreas
- Importar habilidades BNCC
- Editar competências
- Criar cursos
- Criar segmentos
- Criar eventos
- Gerenciar posts
- Gerenciar rubricas
- Ver métricas

## 17.4 IA

- Gerar questão
- Gerar rubrica
- Avaliar resposta
- Sugerir próxima prática
- Resumir progresso
- Auxiliar mentor em feedback

---

# 18. Telas Principais

- Home
- Dashboard do aluno
- Página de curso
- Página de evento
- Página de postagens dos mentores
- Perfil do aluno
- CMS/Admin

---

# 19. Fluxos Principais

## 19.1 Fluxo de aprendizagem

```txt
Aluno entra no curso
→ escolhe segmento
→ responde questão/prática
→ gera evidência
→ recebe avaliação
→ ganha XP
→ perfil evolui
```

## 19.2 Fluxo de evento

```txt
Mentor/Admin cria evento
→ vincula área, habilidades e competências
→ alunos entram
→ matchmaking cria times
→ alunos submetem evidências
→ IA/mentor avalia
→ XP é distribuído
→ scoreboard atualiza
→ perfil evolui
```

## 19.3 Fluxo de post de mentor

```txt
Mentor publica post
→ vincula competência e habilidade BNCC
→ aluno lê
→ responde desafio ou comenta
→ resposta vira evidência
→ avaliação gera XP
```

---

# 20. Regras de Progressão

## 20.1 XP por competência

Toda atividade pontua competências específicas.

Exemplo:

```txt
Resposta argumentativa:
Argumentar +40 XP
Interpretar +20 XP
Textualizar +15 XP
Organizar +10 XP
```

## 20.2 Qualidade da evidência

```txt
0 — inválida
1 — insuficiente
2 — básica
3 — adequada
4 — forte
5 — excelente
```

## 20.3 Evolução de nível

```txt
Contato Inicial: 0–99 XP
Intuição Orientada: 100–299 XP
Autonomia Básica: 300–699 XP
Domínio Articulado: 700–1499 XP
Maestria Criativa: 1500+ XP
```

---

# 21. Roadmap

## Fase 1 — Base estrutural

- Importar habilidades BNCC categorizadas
- Criar cadastro de competências
- Criar cursos por área
- Criar segmentos
- Criar perfil básico
- Criar geração simples de questões

## Fase 2 — Progressão

- XP por competência
- Evidências
- Rubricas
- Histórico de evolução
- Radar de competências

## Fase 3 — Social e mentores

- Feed de postagens
- Página de mentores
- Comentários
- Desafios publicados por mentor
- Seguir mentor

## Fase 4 — Eventos

- Criação de eventos
- Inscrição
- Submissões
- Matchmaking
- Scoreboard
- Distribuição de XP

## Fase 5 — IA avançada

- Geração de questões por habilidade BNCC
- Avaliação automática
- Recomendações personalizadas
- Feedback formativo
- Assistente do mentor

---

# 22. Síntese Final

Lumira é uma plataforma onde áreas do conhecimento viram campos de exercício, habilidades BNCC viram fontes de geração de práticas, competências viram verbos cognitivos de evolução, cursos viram percursos de treino e eventos viram situações sociais de comprovação.

O aluno não apenas consome conteúdo.

Ele pratica, evidencia, evolui e constrói um perfil vivo de competências cognitivas.
