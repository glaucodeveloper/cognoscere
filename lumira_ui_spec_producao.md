# Especificação UI de Produção — Lumira

## Plataforma de Educação por Competências Cognitivas, Áreas BNCC, Eventos e Postagens de Mentores

---

# 1. Objetivo da UI

Esta especificação define a camada de interface da plataforma Lumira para produção.

A UI deve apresentar a Lumira como uma plataforma educacional onde:

- áreas do conhecimento organizam cursos;
- cursos exercitam competências cognitivas;
- eventos aceleram progressão;
- perfis mostram evolução por competências;
- mentores publicam posts, desafios e curadorias;
- habilidades BNCC alimentam questões, segmentos e trilhas.

A UI não deve parecer uma plataforma escolar tradicional de aulas lineares. Ela deve parecer um ambiente vivo de evolução, prática e comunidade.

---

# 2. Princípios de Interface

## 2.1 Prática antes da teoria

Toda tela deve priorizar ação:

- entrar em curso;
- responder questão;
- participar de evento;
- publicar evidência;
- receber feedback;
- evoluir competência.

## 2.2 Competências como atributos

Competências devem aparecer como atributos visuais do usuário:

- barras;
- radar;
- chips;
- níveis;
- XP;
- histórico;
- evidências.

## 2.3 Cursos como campos de exercício

Cursos devem ser exibidos como jornadas práticas por área de conhecimento, não apenas como playlists de aulas.

## 2.4 Eventos como motor social

Eventos devem ter destaque na navegação principal.

## 2.5 Mentores como curadores vivos

Postagens de mentores devem aparecer no dashboard, nos cursos, nos eventos e em página própria.

---

# 3. Navegação Principal

## 3.1 Rotas de produção

```txt
/
 /dashboard
 /areas
 /areas/:areaId
 /courses
 /courses/:courseId
 /courses/:courseId/segments/:segmentId
 /events
 /events/:eventId
 /mentor-posts
 /mentor-posts/:postId
 /mentors
 /mentors/:mentorId
 /profile/:userId
 /scoreboard
 /cms
 /cms/areas
 /cms/skills
 /cms/competencies
 /cms/courses
 /cms/segments
 /cms/events
 /cms/mentor-posts
```

---

# 4. Layout Global

## 4.1 Estrutura desktop

```txt
┌──────────────────────────────────────────────┐
│ Topbar: Logo | Busca | Eventos | Perfil      │
├───────────────┬──────────────────────────────┤
│ Sidebar       │ Conteúdo principal            │
│ - Dashboard   │                              │
│ - Áreas       │                              │
│ - Cursos      │                              │
│ - Eventos     │                              │
│ - Mentores    │                              │
│ - Scoreboard  │                              │
└───────────────┴──────────────────────────────┘
```

## 4.2 Estrutura mobile

```txt
┌──────────────────────┐
│ Topbar compacta      │
├──────────────────────┤
│ Conteúdo             │
├──────────────────────┤
│ Bottom navigation    │
│ Home Cursos Eventos  │
│ Mentores Perfil      │
└──────────────────────┘
```

---

# 5. Design System

## 5.1 Tokens

```ts
export const lumiraTokens = {
  colors: {
    background: "#F7F8FB",
    surface: "#FFFFFF",
    surfaceAlt: "#EEF2F7",
    primary: "#5B6CFF",
    primaryDark: "#303FBA",
    secondary: "#8E56FF",
    success: "#28A66A",
    warning: "#F5A623",
    danger: "#E5484D",
    text: "#172033",
    muted: "#687187",
    border: "#D9DEE8"
  },

  radius: {
    sm: "8px",
    md: "14px",
    lg: "22px",
    xl: "32px"
  },

  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
    xxl: "48px"
  }
};
```

## 5.2 Tipografia

```txt
H1: 40–56px / peso 700
H2: 32–40px / peso 700
H3: 24–28px / peso 600
Body: 16px / peso 400
Small: 13px / peso 400
Label: 12px / peso 600 / uppercase opcional
```

---

# 6. Componentes Base

## 6.1 AppShell

Responsável por:

- topbar;
- sidebar;
- bottom navigation mobile;
- área de conteúdo;
- estado de autenticação;
- atalhos globais.

Props:

```ts
type AppShellProps = {
  user?: UserSummary;
  activeRoute: string;
  children: React.ReactNode;
};
```

---

## 6.2 AreaCard

Card para área do conhecimento.

```ts
type AreaCardProps = {
  id: string;
  title: string;
  description: string;
  skillsCount: number;
  coursesCount: number;
  activeEventsCount: number;
  topCompetencies: string[];
};
```

Estados:

- default;
- hover;
- selected;
- locked;
- loading.

---

## 6.3 CompetenceChip

Chip visual para competência cognitiva.

```ts
type CompetenceChipProps = {
  name: string;
  level?: number;
  xp?: number;
  variant?: "default" | "strong" | "growth" | "target";
};
```

Exemplos:

```txt
Interpretar · N3
Argumentar · +40 XP
Textualizar
Calcular
Investigar
```

---

## 6.4 CompetenceRadar

Visualização do perfil cognitivo.

```ts
type CompetenceRadarProps = {
  items: {
    competence: string;
    value: number;
  }[];
};
```

Deve ter fallback para barra em mobile.

---

## 6.5 CourseCard

```ts
type CourseCardProps = {
  id: string;
  title: string;
  areaName: string;
  description: string;
  competencies: string[];
  progress: number;
  segmentsCount: number;
  activeEventsCount: number;
  mentorPostsCount: number;
};
```

Conteúdo visual:

- título;
- área;
- chips de competências;
- progresso;
- CTA: Continuar / Iniciar;
- indicador de eventos conectados.

---

## 6.6 SegmentCard

```ts
type SegmentCardProps = {
  id: string;
  competence: string;
  object: string;
  evidence: string;
  bnccSkillCode: string;
  difficulty: "inicial" | "intermediario" | "avancado" | "dominante";
  completed: boolean;
  xpReward: number;
};
```

Layout textual:

```txt
Competência: Interpretar
Objeto: texto argumentativo
Evidência: comentário crítico
Habilidade: EF69LP01
XP: +40
```

---

## 6.7 EventCard

```ts
type EventCardProps = {
  id: string;
  title: string;
  type: string;
  area: string;
  startsAt: string;
  endsAt: string;
  participantsCount: number;
  targetCompetencies: string[];
  status: "scheduled" | "active" | "completed";
};
```

CTA por status:

- scheduled: Inscrever-se;
- active: Entrar no evento;
- completed: Ver resultados.

---

## 6.8 MentorPostCard

```ts
type MentorPostCardProps = {
  id: string;
  mentorName: string;
  mentorAvatar?: string;
  title: string;
  excerpt: string;
  postType: "orientacao" | "desafio" | "convite_evento" | "feedback_publico" | "repertorio" | "curadoria_bncc";
  area?: string;
  competencies: string[];
  relatedEventTitle?: string;
  createdAt: string;
  commentsCount: number;
  submissionsEnabled: boolean;
};
```

CTA:

- Ler;
- Responder desafio;
- Salvar;
- Ver evento.

---

## 6.9 ProgressBar

```ts
type ProgressBarProps = {
  value: number;
  label?: string;
  showPercent?: boolean;
};
```

Uso:

- progresso do curso;
- XP de competência;
- evento;
- meta semanal.

---

## 6.10 EvidenceCard

```ts
type EvidenceCardProps = {
  id: string;
  title: string;
  competence: string;
  area: string;
  score: number;
  feedbackSummary?: string;
  createdAt: string;
  sourceType: "question" | "event" | "mentor_post" | "course_segment";
};
```

---

# 7. Telas de Produção

---

# 7.1 Home Pública

## Objetivo

Apresentar Lumira para novos usuários.

## Seções

1. Hero
2. Filosofia
3. Áreas do conhecimento
4. Competências cognitivas
5. Eventos
6. Mentores
7. CTA final

## Wireframe

```txt
┌──────────────────────────────────────────────┐
│ Logo Lumira             Entrar  Começar      │
├──────────────────────────────────────────────┤
│ HERO                                         │
│ "Transforme conhecimento em competência"    │
│ "Cursos, eventos e IA para prática real"    │
│ [Começar jornada] [Ver eventos]              │
├──────────────────────────────────────────────┤
│ Áreas do conhecimento                        │
│ [Linguagens] [Matemática] [Ciências...]      │
├──────────────────────────────────────────────┤
│ Como funciona                                │
│ Competência → Prática → Evidência → Perfil  │
├──────────────────────────────────────────────┤
│ Eventos em destaque                          │
├──────────────────────────────────────────────┤
│ Postagens recentes dos mentores              │
└──────────────────────────────────────────────┘
```

## Critérios de aceite

- Deve exibir CTA principal acima da dobra.
- Deve exibir pelo menos 4 áreas do conhecimento.
- Deve exibir ao menos 3 eventos ou placeholders.
- Deve exibir ao menos 3 posts de mentores ou placeholders.
- Deve funcionar em mobile sem sidebar.

---

# 7.2 Dashboard do Aluno

## Objetivo

Centralizar a jornada ativa do aluno.

## Blocos

1. Saudação e score geral
2. Próxima prática recomendada
3. Radar de competências
4. Cursos ativos
5. Eventos recomendados
6. Posts de mentores
7. Evidências recentes

## Wireframe

```txt
┌──────────────────────────────────────────────┐
│ Dashboard                                    │
│ Olá, Ícaro. Sua competência em foco:         │
│ Argumentar +120 XP esta semana               │
├───────────────────┬──────────────────────────┤
│ Próxima prática   │ Radar de competências     │
│ [Responder agora] │ Interpretar 72%           │
│                   │ Argumentar 61%            │
├───────────────────┴──────────────────────────┤
│ Cursos ativos                                │
│ [CursoCard] [CourseCard] [CourseCard]        │
├──────────────────────────────────────────────┤
│ Eventos recomendados                         │
│ [EventCard] [EventCard]                      │
├──────────────────────────────────────────────┤
│ Mentores                                     │
│ [MentorPostCard] [MentorPostCard]            │
└──────────────────────────────────────────────┘
```

## Dados necessários

```ts
type DashboardData = {
  user: UserSummary;
  focusCompetence: UserCompetence;
  recommendedPractice: CourseSegment;
  activeCourses: Course[];
  recommendedEvents: Event[];
  mentorPosts: MentorPost[];
  recentEvidences: Evidence[];
};
```

## Critérios de aceite

- Deve exibir a próxima ação recomendada.
- Deve exibir progresso por competência.
- Deve exibir cursos, eventos e posts em uma só visão.
- Deve permitir continuar curso em 1 clique.
- Deve permitir entrar em evento em 1 clique.

---

# 7.3 Página de Áreas

## Objetivo

Listar áreas do conhecimento como campos de exercício.

## Conteúdo

- Cards de áreas;
- total de habilidades BNCC;
- competências mais frequentes;
- cursos vinculados;
- eventos ativos.

## Wireframe

```txt
Áreas do Conhecimento

[Linguagens]
609 habilidades · 12 cursos · 4 eventos
Interpretar · Argumentar · Textualizar

[Matemática]
247 habilidades · 8 cursos · 2 eventos
Calcular · Resolver · Modelar

[Ciências da Natureza]
111 habilidades · 6 cursos · 3 eventos
Investigar · Explicar · Intervir
```

## Critérios de aceite

- Cada área deve mostrar total de habilidades.
- Cada área deve mostrar competências principais.
- Deve filtrar cursos por área ao clicar.

---

# 7.4 Página de Curso

## Objetivo

Mostrar curso como jornada de exercício de competências.

## Header

- título;
- área BNCC;
- descrição;
- progresso;
- competências-alvo;
- eventos conectados;
- mentor responsável.

## Corpo

- segmentos;
- questões;
- evidências;
- posts de mentores relacionados;
- scoreboard do curso.

## Wireframe

```txt
┌──────────────────────────────────────────────┐
│ Interpretação Crítica de Mídias              │
│ Área: Linguagens                             │
│ Competências: Interpretar, Inferir, Avaliar  │
│ Progresso: █████░░░░ 52%                     │
│ [Continuar] [Ver eventos]                    │
├──────────────────────────────────────────────┤
│ Segmentos                                    │
│ [Interpretar + postagem + comentário]        │
│ [Inferir + meme + explicação de humor]       │
│ [Argumentar + discurso + resposta crítica]   │
├──────────────────────────────────────────────┤
│ Posts de mentores                            │
│ [MentorPostCard] [MentorPostCard]            │
└──────────────────────────────────────────────┘
```

## Critérios de aceite

- Segmentos devem exibir competência, objeto e evidência.
- Habilidade BNCC deve estar visível como metadado.
- CTA principal deve abrir próximo segmento.
- Posts relacionados devem aparecer abaixo dos segmentos.

---

# 7.5 Página de Segmento / Prática

## Objetivo

Permitir execução de questão, missão ou prática.

## Layout

```txt
┌──────────────────────────────────────────────┐
│ Competência: Argumentar                      │
│ Objeto: discurso público digital             │
│ Habilidade BNCC: EF69LP01                    │
├──────────────────────────────────────────────┤
│ Enunciado                                    │
│ Leia a situação...                           │
├──────────────────────────────────────────────┤
│ Resposta do aluno                            │
│ [textarea / editor / upload]                 │
├──────────────────────────────────────────────┤
│ Evidência esperada                           │
│ Comentário crítico justificado               │
│ [Enviar evidência]                           │
└──────────────────────────────────────────────┘
```

## Componentes

- SkillMetadataHeader
- QuestionPanel
- EvidenceEditor
- RubricPreview
- SubmitEvidenceButton
- FeedbackPanel

## Critérios de aceite

- Deve exibir competência antes do enunciado.
- Deve exibir objeto e evidência esperada.
- Deve permitir resposta textual no MVP.
- Deve salvar submissão como evidência.
- Deve atualizar progresso após avaliação.

---

# 7.6 Página de Eventos

## Objetivo

Listar eventos como oportunidades de progressão social.

## Filtros

- área;
- competência;
- tipo;
- status;
- individual/time;
- mentor.

## Cards

Usar `EventCard`.

## Critérios de aceite

- Deve separar eventos ativos, futuros e finalizados.
- Deve permitir inscrição.
- Deve mostrar competências que serão pontuadas.
- Deve mostrar se há matchmaking.

---

# 7.7 Página de Evento

## Objetivo

Gerenciar participação no evento.

## Seções

1. Header do evento
2. Regras
3. Competências-alvo
4. Habilidades BNCC relacionadas
5. Timeline
6. Participantes/times
7. Submissões
8. Scoreboard
9. Posts de mentores do evento

## Wireframe

```txt
┌──────────────────────────────────────────────┐
│ Arena de Argumentação Digital                │
│ Tipo: Competição · Área: Linguagens          │
│ Competências: Argumentar, Interpretar        │
│ [Inscrever-se]                               │
├──────────────────────────────────────────────┤
│ Regras e entrega                             │
├──────────────────────────────────────────────┤
│ Timeline                                     │
│ Inscrição → Submissão → Avaliação → Ranking  │
├──────────────────────────────────────────────┤
│ Times / Participantes                        │
├──────────────────────────────────────────────┤
│ Scoreboard                                   │
├──────────────────────────────────────────────┤
│ Posts dos mentores                           │
└──────────────────────────────────────────────┘
```

## Critérios de aceite

- Deve mostrar status do evento.
- Deve mostrar CTA correspondente ao status.
- Deve mostrar scoreboard se evento estiver ativo ou finalizado.
- Deve permitir submissão se aluno estiver inscrito.

---

# 7.8 Página de Postagens dos Mentores

## Objetivo

Criar feed central de orientação, desafios e curadoria.

## Layout

```txt
┌──────────────────────────────────────────────┐
│ Postagens dos Mentores                       │
│ [Buscar] [Área] [Competência] [Tipo]         │
├──────────────────────┬───────────────────────┤
│ Feed                 │ Destaques              │
│ [MentorPostCard]     │ Eventos vinculados      │
│ [MentorPostCard]     │ Mentores recomendados   │
│ [MentorPostCard]     │ Competências em foco    │
└──────────────────────┴───────────────────────┘
```

## Tipos de posts

- Orientação
- Desafio
- Convite para evento
- Feedback público
- Repertório
- Curadoria BNCC

## Critérios de aceite

- Deve filtrar por área, competência e tipo.
- Deve exibir mentor, tipo, competências e evento vinculado.
- Posts de desafio devem ter CTA “Responder desafio”.
- Resposta a desafio deve virar evidência.

---

# 7.9 Página de Detalhe do Post de Mentor

## Objetivo

Permitir leitura, comentário e resposta prática.

## Estrutura

```txt
Título
Mentor
Tipo
Área
Competências
Habilidades BNCC
Conteúdo
CTA de resposta
Comentários
Posts relacionados
```

## Estados

- post comum;
- post com desafio;
- post vinculado a evento;
- post exclusivo de curso;
- post com submissões encerradas.

## Critérios de aceite

- Deve permitir salvar post.
- Deve permitir comentar se liberado.
- Deve permitir responder se `submissions_enabled = true`.
- Deve transformar resposta em evidência vinculada ao perfil.

---

# 7.10 Perfil do Aluno

## Objetivo

Exibir o mapa vivo de competências do aluno.

## Seções

1. Cabeçalho do perfil
2. Score geral
3. Radar de competências
4. Competências por área
5. Evidências
6. Cursos ativos/finalizados
7. Eventos participados
8. Posts respondidos
9. Badges

## Wireframe

```txt
┌──────────────────────────────────────────────┐
│ Avatar Nome                                  │
│ Score geral: 1820 · Maestria em 2 competências│
├──────────────────────┬───────────────────────┤
│ Radar                │ Competências fortes    │
│                      │ Interpretar, Criar     │
├──────────────────────┴───────────────────────┤
│ Evidências recentes                           │
│ [EvidenceCard] [EvidenceCard]                 │
├──────────────────────────────────────────────┤
│ Eventos e cursos                              │
└──────────────────────────────────────────────┘
```

## Critérios de aceite

- Deve mostrar competências como atributos, não notas.
- Deve listar evidências reais.
- Deve exibir origem da evidência: curso, evento ou post.
- Deve ter versão pública e versão privada.

---

# 7.11 Scoreboard

## Objetivo

Mostrar rankings de evolução.

## Tipos de scoreboard

- Geral
- Por área
- Por competência
- Por evento
- Por evolução semanal
- Por colaboração

## Layout

```txt
Scoreboard
[Tipo] [Área] [Competência] [Período]

1. Ana — +420 XP — Argumentar
2. João — +380 XP — Interpretar
3. Lia — +350 XP — Criar
```

## Critérios de aceite

- Deve destacar evolução, não apenas total acumulado.
- Deve permitir filtro por período.
- Deve abrir perfil do aluno ao clicar.

---

# 7.12 CMS/Admin

## Objetivo

Permitir produção e manutenção dos dados da plataforma.

## Módulos

- Áreas
- Habilidades BNCC
- Competências
- Cursos
- Segmentos
- Eventos
- Posts de mentores
- Templates de questão
- Rubricas
- Perfis
- Submissões

## Layout

```txt
CMS Lumira

Sidebar:
- Áreas
- Habilidades BNCC
- Competências
- Cursos
- Segmentos
- Eventos
- Posts
- Rubricas

Conteúdo:
Tabela + filtros + botão criar/editar
```

## Critérios de aceite

- Deve permitir CRUD de cursos.
- Deve permitir CRUD de segmentos.
- Deve permitir vincular habilidade BNCC.
- Deve permitir criar post de mentor.
- Deve permitir criar evento.
- Deve validar campos obrigatórios.

---

# 8. Estados de Interface

## 8.1 Loading

Usar skeleton cards para:

- cursos;
- eventos;
- posts;
- perfil;
- scoreboard.

## 8.2 Empty states

Exemplos:

```txt
Nenhum curso ativo ainda.
Comece escolhendo uma área do conhecimento.
```

```txt
Nenhuma evidência publicada.
Responda uma prática para iniciar seu perfil de competências.
```

## 8.3 Error states

Exemplo:

```txt
Não foi possível carregar os eventos.
Tentar novamente.
```

## 8.4 Locked states

Segmento bloqueado:

```txt
Complete 2 práticas anteriores para desbloquear.
```

---

# 9. Contratos de Dados para Frontend

## 9.1 Summary do usuário

```ts
type UserSummary = {
  id: string;
  name: string;
  avatarUrl?: string;
  role: "student" | "mentor" | "admin";
  score: number;
};
```

## 9.2 Competência do perfil

```ts
type UserCompetence = {
  id: string;
  name: string;
  xp: number;
  level: number;
  state: "contato_inicial" | "intuicao_orientada" | "autonomia_basica" | "dominio_articulado" | "maestria_criativa";
  progressToNextLevel: number;
};
```

## 9.3 Área

```ts
type KnowledgeArea = {
  id: string;
  name: string;
  bnccName: string;
  skillsCount: number;
  coursesCount: number;
  activeEventsCount: number;
  topCompetencies: string[];
};
```

## 9.4 Curso

```ts
type CourseSummary = {
  id: string;
  title: string;
  areaId: string;
  description: string;
  competencies: string[];
  progress: number;
  segmentsCount: number;
  activeEventsCount: number;
  mentorPostsCount: number;
};
```

## 9.5 Segmento

```ts
type SegmentSummary = {
  id: string;
  courseId: string;
  competence: string;
  object: string;
  evidence: string;
  bnccSkillCode: string;
  difficulty: string;
  completed: boolean;
  xpReward: number;
};
```

## 9.6 Evento

```ts
type EventSummary = {
  id: string;
  title: string;
  type: string;
  areaId: string;
  status: "scheduled" | "active" | "completed";
  startsAt: string;
  endsAt: string;
  participantsCount: number;
  targetCompetencies: string[];
  matchmakingEnabled: boolean;
};
```

## 9.7 Post de mentor

```ts
type MentorPostSummary = {
  id: string;
  mentorId: string;
  mentorName: string;
  mentorAvatar?: string;
  title: string;
  excerpt: string;
  postType: string;
  areaId?: string;
  competencies: string[];
  relatedEventId?: string;
  relatedEventTitle?: string;
  createdAt: string;
  commentsCount: number;
  submissionsEnabled: boolean;
};
```

---

# 10. Requisitos Responsivos

## Desktop

- Sidebar fixa.
- Cards em grid.
- Dashboard em duas colunas.
- Feed de mentores com coluna lateral.

## Tablet

- Sidebar recolhível.
- Cards em duas colunas.
- Dashboard com blocos empilháveis.

## Mobile

- Bottom navigation.
- Cards em uma coluna.
- Radar vira lista de barras.
- Filtros viram bottom sheet.
- Ações primárias fixas no rodapé quando necessário.

---

# 11. Requisitos de Acessibilidade

- Navegação por teclado.
- Contraste mínimo AA.
- Botões com labels claros.
- Estados visuais para foco.
- Textos alternativos em avatares/imagens.
- Feedback de erro textual.
- Evitar depender somente de cor para indicar status.

---

# 12. Priorização MVP UI

## Sprint 1

- AppShell
- Home
- Dashboard
- Cards base
- Página de áreas
- Página de cursos

## Sprint 2

- Página de curso
- Página de segmento/prática
- Submissão textual
- Feedback simples
- Perfil com radar/barras

## Sprint 3

- Eventos
- Página de evento
- Scoreboard
- Inscrição em evento
- Submissão de evento

## Sprint 4

- Postagens dos mentores
- Detalhe do post
- Resposta a desafio
- Posts vinculados a cursos/eventos

## Sprint 5

- CMS/Admin
- CRUD de cursos
- CRUD de segmentos
- CRUD de eventos
- CRUD de posts
- Vinculação de habilidade BNCC

---

# 13. Critérios Globais de Aceite

A UI estará pronta para produção quando:

- aluno conseguir entrar, ver dashboard e continuar curso;
- curso exibir segmentos baseados em competência + objeto + evidência;
- segmento aceitar resposta e gerar evidência;
- perfil exibir XP por competência;
- eventos puderem ser listados, abertos e inscritos;
- posts de mentores puderem ser listados e respondidos;
- CMS permitir criar curso, segmento, evento e post;
- layout funcionar em desktop e mobile;
- componentes estiverem tipados e reutilizáveis;
- estados loading, empty e error estiverem implementados.

---

# 14. Síntese da UI

A UI da Lumira deve mostrar ao aluno que ele não está apenas estudando matérias.

Ele está exercitando ações cognitivas.

Cursos são campos de treino.

Eventos são arenas sociais.

Mentores são guias.

Evidências são provas vivas.

O perfil é o mapa da evolução.
