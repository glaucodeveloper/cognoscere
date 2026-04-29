import { writeFile } from "node:fs/promises";
import path from "node:path";

import { buildReferenceManifest, generateReferenceDocuments } from "./reference-pipeline.js";
import { ensureDataDirs, uiDir } from "./paths.js";

const FILE_NAME = "cognoscere-campus.html";

type Manifest = ReturnType<typeof buildReferenceManifest>;

type TrackLevel = {
  id: string;
  title: string;
  summary: string;
  mastery: string;
  badge: string;
  xpReward: number;
  materialIds: string[];
};

type PortalTrack = {
  id: string;
  title: string;
  area: string;
  competency: string;
  stageBucket: string;
  audience: string;
  summary: string;
  mentor: string;
  weeklyChallenge: string;
  color: string;
  students: number;
  completionRate: number;
  skillTags: string[];
  levels: TrackLevel[];
};

type PortalMaterial = {
  id: string;
  trackId: string;
  levelId: string;
  title: string;
  competency: string;
  kind: string;
  format: string;
  duration: string;
  summary: string;
  progress: number;
  status: string;
  xp: number;
  tags: string[];
  path?: string;
};

type StudentAttribute = {
  id: string;
  label: string;
  value: number;
};

type ProfileTheme = {
  id: string;
  label: string;
  accent: string;
  preview: string;
  background: string;
  surface: string;
};

type AvatarOption = {
  id: string;
  label: string;
  glyph: string;
  accent: string;
};

type SocialPost = {
  id: string;
  author: string;
  role: string;
  competency: string;
  trackId: string;
  tag: string;
  text: string;
  likes: number;
  comments: number;
};

type SocialCircle = {
  title: string;
  focus: string;
  members: number;
  nextMeet: string;
};

type SocialChallenge = {
  title: string;
  competency: string;
  reward: string;
  brief: string;
};

type SocialEvent = {
  title: string;
  date: string;
  format: string;
  focus: string;
};

type PortalModel = {
  generatedAt: string;
  hero: {
    eyebrow: string;
    title: string;
    summary: string;
    stats: Array<{ label: string; value: string }>;
  };
  quickActions: Array<{ title: string; description: string; cta: string; targetView: string }>;
  student: {
    name: string;
    handle: string;
    school: string;
    city: string;
    stageLabel: string;
    gradeValue: string;
    streak: number;
    xp: number;
    level: number;
    completedCourses: number;
    communityRank: string;
    bio: string;
    focus: string;
    nextGoal: string;
    attributes: StudentAttribute[];
  };
  profileThemes: ProfileTheme[];
  avatars: AvatarOption[];
  chartModes: Array<{ id: string; label: string }>;
  tracks: PortalTrack[];
  materials: PortalMaterial[];
  achievements: Array<{
    title: string;
    description: string;
    rarity: string;
    xp: number;
    unlocked: boolean;
  }>;
  roadmap: Array<{
    grade: string;
    label: string;
    emphasis: string;
    path: string;
  }>;
  weeklyPlan: Array<{ day: string; title: string; type: string; duration: string }>;
  feed: SocialPost[];
  circles: SocialCircle[];
  challenges: SocialChallenge[];
  events: SocialEvent[];
  leaderboard: Array<{ name: string; xp: number; badge: string }>;
};

function buildPortalModel(manifest: Manifest): PortalModel {
  const competency = manifest.competencies[0]!;
  const studentGrade = manifest.grades[2] ?? manifest.grades[0]!;

  const roadmap = manifest.grades.slice(0, 5).map((grade, index) => ({
    grade: grade.short,
    label: grade.label,
    emphasis:
      index <= 1
        ? "base, repertorio e clareza de tese"
        : index <= 3
          ? "evidencia, revisao e debate publico"
          : "transferencia, autoria e defesa de criterio",
    path: `./references/${competency.id}/${grade.value}/level-${Math.min(5, index + 1)}.md`
  }));

  const languageLevels: TrackLevel[] = competency.levels.map((level, index) => ({
    id: `ling-level-${level.level}`,
    title: level.label,
    summary: level.anchor.passHint,
    mastery: level.anchor.title,
    badge: `nivel ${level.level}`,
    xpReward: 110 + index * 35,
    materialIds: [`ling-doc-${level.level}`, `ling-practice-${level.level}`]
  }));

  const tracks: PortalTrack[] = [
    {
      id: "linguagens-autoria",
      title: "Curso de Autoria e Argumentacao",
      area: "Linguagens",
      competency: competency.title,
      stageBucket: "Fundamental II e Medio",
      audience: "6 ano EF a 3 serie EM",
      summary:
        "Percurso de competencias para leitura critica, autoria, defesa de criterio, revisao e publicacao social com referencias da BNCC.",
      mentor: "Ana Maris | autoria e revisao",
      weeklyChallenge: "Publicar uma resenha com tese, evidencia e resposta a uma objecao real.",
      color: "amber",
      students: 248,
      completionRate: 72,
      skillTags: ["tese", "evidencia", "revisao", "transferencia"],
      levels: languageLevels
    },
    {
      id: "matematica-estrategias",
      title: "Curso de Estrategias Matematicas",
      area: "Matematica",
      competency: "Resolucao de problemas e justificativa",
      stageBucket: "Fundamental II",
      audience: "6 ano EF a 9 ano EF",
      summary:
        "Curso por niveis para leitura de problema, comparacao de metodos, modelagem e defesa de procedimento com materiais progressivos.",
      mentor: "Miguel Araujo | oficina de estrategia",
      weeklyChallenge: "Resolver o mesmo problema com duas abordagens e defender qual gera mais clareza.",
      color: "teal",
      students: 186,
      completionRate: 64,
      skillTags: ["estrategia", "estimativa", "registro", "explicacao"],
      levels: [
        {
          id: "mat-level-1",
          title: "Leitura de problema",
          summary: "Quebra o enunciado e identifica variaveis relevantes.",
          mastery: "decompor, localizar e decidir primeiro passo",
          badge: "nivel 1",
          xpReward: 90,
          materialIds: ["mat-doc-1", "mat-practice-1"]
        },
        {
          id: "mat-level-2",
          title: "Comparar estrategias",
          summary: "Confronta dois caminhos e justifica escolha.",
          mastery: "explicar porque um metodo serve melhor",
          badge: "nivel 2",
          xpReward: 130,
          materialIds: ["mat-video-2", "mat-practice-2"]
        },
        {
          id: "mat-level-3",
          title: "Modelagem e dados",
          summary: "Transforma situacao real em tabela, grafico e regra.",
          mastery: "formular modelo simples e interpretar resultado",
          badge: "nivel 3",
          xpReward: 170,
          materialIds: ["mat-doc-3", "mat-practice-3"]
        }
      ]
    },
    {
      id: "ciencias-investigacao",
      title: "Curso de Investigacao Cientifica",
      area: "Ciencias da Natureza",
      competency: "Investigacao, evidencia e comunicacao",
      stageBucket: "Fundamental II e Medio",
      audience: "7 ano EF a 2 serie EM",
      summary:
        "Curso de competencias para formular perguntas, observar, registrar e comunicar investigacoes em contexto social.",
      mentor: "Lia Prado | laboratorio aberto",
      weeklyChallenge: "Registrar um microestudo do territorio e apresentar limites das conclusoes.",
      color: "coral",
      students: 154,
      completionRate: 59,
      skillTags: ["pergunta", "evidencia", "registro", "comunicacao"],
      levels: [
        {
          id: "sci-level-1",
          title: "Pergunta investigavel",
          summary: "Transforma curiosidade ampla em pergunta testavel.",
          mastery: "delimitar observacao e criterio de coleta",
          badge: "nivel 1",
          xpReward: 95,
          materialIds: ["sci-doc-1", "sci-practice-1"]
        },
        {
          id: "sci-level-2",
          title: "Registro e protocolo",
          summary: "Cria um protocolo simples e coleta dados com consistencia.",
          mastery: "registrar, revisar e comparar observacoes",
          badge: "nivel 2",
          xpReward: 135,
          materialIds: ["sci-video-2", "sci-practice-2"]
        },
        {
          id: "sci-level-3",
          title: "Divulgacao de descoberta",
          summary: "Converte os achados em painel ou fala publica.",
          mastery: "comunicar com clareza e limite metodologico",
          badge: "nivel 3",
          xpReward: 180,
          materialIds: ["sci-doc-3", "sci-practice-3"]
        }
      ]
    },
    {
      id: "projeto-de-vida",
      title: "Curso de Projeto de Vida",
      area: "Projeto de Vida",
      competency: "Autonomia, repertorio e portfolio",
      stageBucket: "Medio",
      audience: "1 serie EM a 3 serie EM",
      summary:
        "Curso para construir portfolio, rotina de evidencias, metas e comunicacao de percurso com apoio social e mentoria.",
      mentor: "Rita Avelar | orientacao e portfolio",
      weeklyChallenge: "Atualizar o portfolio com uma evidencia nova e pedir feedback de dois colegas.",
      color: "sage",
      students: 132,
      completionRate: 77,
      skillTags: ["autoconhecimento", "planejamento", "comunicacao", "portfolio"],
      levels: [
        {
          id: "life-level-1",
          title: "Mapa de energia",
          summary: "Identifica interesses, ritmo e evidencias iniciais.",
          mastery: "nomear preferencias e oportunidades de crescimento",
          badge: "nivel 1",
          xpReward: 100,
          materialIds: ["life-doc-1", "life-practice-1"]
        },
        {
          id: "life-level-2",
          title: "Portfolio vivo",
          summary: "Organiza evidencias e feedbacks em um unico lugar.",
          mastery: "conectar experiencia, reflexao e meta",
          badge: "nivel 2",
          xpReward: 145,
          materialIds: ["life-template-2", "life-practice-2"]
        },
        {
          id: "life-level-3",
          title: "Sprint de protagonismo",
          summary: "Executa uma iniciativa curta com impacto observavel.",
          mastery: "planejar, executar e comunicar resultado",
          badge: "nivel 3",
          xpReward: 190,
          materialIds: ["life-doc-3", "life-practice-3"]
        }
      ]
    }
  ];

  const materials: PortalMaterial[] = [
    {
      id: "ling-doc-1",
      trackId: "linguagens-autoria",
      levelId: "ling-level-1",
      title: "Documento BNCC | entrada por tese",
      competency: competency.title,
      kind: "doc",
      format: "markdown",
      duration: "18 min",
      summary: "Referencia de base para organizar tese, foco e indicadores esperados por serie.",
      progress: 100,
      status: "Concluido",
      xp: 40,
      tags: ["bncc", "tese", "serie"],
      path: roadmap[0]!.path
    },
    {
      id: "ling-practice-1",
      trackId: "linguagens-autoria",
      levelId: "ling-level-1",
      title: "Laboratorio de tese clara",
      competency: competency.title,
      kind: "atividade",
      format: "roteiro",
      duration: "32 min",
      summary: "Exercicio guiado para sustentar uma posicao com foco e evitar deriva do argumento.",
      progress: 90,
      status: "Em andamento",
      xp: 55,
      tags: ["atividade", "escrita", "clareza"]
    },
    {
      id: "ling-doc-2",
      trackId: "linguagens-autoria",
      levelId: "ling-level-2",
      title: "Documento BNCC | evidencia e repertorio",
      competency: competency.title,
      kind: "doc",
      format: "markdown",
      duration: "16 min",
      summary: "Faixas esperadas para uso de evidencia, repertorio e exemplos relevantes.",
      progress: 86,
      status: "Em andamento",
      xp: 45,
      tags: ["bncc", "evidencia", "repertorio"],
      path: roadmap[1]!.path
    },
    {
      id: "ling-practice-2",
      trackId: "linguagens-autoria",
      levelId: "ling-level-2",
      title: "Oficina de repertorio e evidencia",
      competency: competency.title,
      kind: "atividade",
      format: "worksheet",
      duration: "40 min",
      summary: "Seleciona evidencias de melhor peso e justifica a escolha em pequenos grupos.",
      progress: 62,
      status: "Em andamento",
      xp: 60,
      tags: ["atividade", "grupo", "evidencia"]
    },
    {
      id: "ling-doc-3",
      trackId: "linguagens-autoria",
      levelId: "ling-level-3",
      title: "Documento BNCC | revisao e objecao",
      competency: competency.title,
      kind: "doc",
      format: "markdown",
      duration: "17 min",
      summary: "Referencia para revisar tese, ajustar criterio e incorporar objecoes sem perder coerencia.",
      progress: 40,
      status: "Liberado",
      xp: 50,
      tags: ["bncc", "revisao", "objecao"],
      path: roadmap[2]!.path
    },
    {
      id: "ling-practice-3",
      trackId: "linguagens-autoria",
      levelId: "ling-level-3",
      title: "Clinica de contra-argumento",
      competency: competency.title,
      kind: "social",
      format: "sessao ao vivo",
      duration: "45 min",
      summary: "Encontro social para reescrever trechos depois de uma objecao forte de colegas.",
      progress: 28,
      status: "Liberado",
      xp: 80,
      tags: ["social", "feedback", "revisao"]
    },
    {
      id: "ling-doc-4",
      trackId: "linguagens-autoria",
      levelId: "ling-level-4",
      title: "Documento BNCC | transferencia de criterio",
      competency: competency.title,
      kind: "doc",
      format: "markdown",
      duration: "18 min",
      summary: "Mostra como a competencia migra entre contextos, genero textual e publico.",
      progress: 12,
      status: "Bloqueado",
      xp: 55,
      tags: ["bncc", "transferencia", "publico"],
      path: roadmap[3]!.path
    },
    {
      id: "ling-practice-4",
      trackId: "linguagens-autoria",
      levelId: "ling-level-4",
      title: "Missao de publicacao publica",
      competency: competency.title,
      kind: "projeto",
      format: "desafio",
      duration: "2 encontros",
      summary: "Adapta o mesmo argumento para um mural, um post curto e uma carta aberta.",
      progress: 0,
      status: "Bloqueado",
      xp: 95,
      tags: ["projeto", "publicacao", "adaptacao"]
    },
    {
      id: "ling-doc-5",
      trackId: "linguagens-autoria",
      levelId: "ling-level-5",
      title: "Documento BNCC | autoria avancada",
      competency: competency.title,
      kind: "doc",
      format: "markdown",
      duration: "20 min",
      summary: "Referencia para autoria transferente, criterio proprio e repertorio sofisticado.",
      progress: 0,
      status: "Bloqueado",
      xp: 60,
      tags: ["bncc", "autoria", "avancado"],
      path: roadmap[4]!.path
    },
    {
      id: "ling-practice-5",
      trackId: "linguagens-autoria",
      levelId: "ling-level-5",
      title: "Dossie final de autoria",
      competency: competency.title,
      kind: "portfolio",
      format: "template",
      duration: "60 min",
      summary: "Organiza versoes, feedbacks, revisoes e evidencia final do percurso em um dossie publico.",
      progress: 0,
      status: "Bloqueado",
      xp: 120,
      tags: ["portfolio", "sintese", "apresentacao"]
    },
    {
      id: "mat-doc-1",
      trackId: "matematica-estrategias",
      levelId: "mat-level-1",
      title: "Mapa de leitura de problema",
      competency: "Resolucao de problemas e justificativa",
      kind: "doc",
      format: "guia",
      duration: "12 min",
      summary: "Checklist para separar dados, objetivo, restricoes e sinais do enunciado.",
      progress: 100,
      status: "Concluido",
      xp: 35,
      tags: ["matematica", "doc", "estrategia"]
    },
    {
      id: "mat-practice-1",
      trackId: "matematica-estrategias",
      levelId: "mat-level-1",
      title: "Caderno de decomposicao",
      competency: "Resolucao de problemas e justificativa",
      kind: "atividade",
      format: "worksheet",
      duration: "28 min",
      summary: "Treino de decompor problemas em etapas curtas e nomear o primeiro movimento.",
      progress: 88,
      status: "Em andamento",
      xp: 50,
      tags: ["matematica", "atividade", "caderno"]
    },
    {
      id: "mat-video-2",
      trackId: "matematica-estrategias",
      levelId: "mat-level-2",
      title: "Video | duas estrategias, uma escolha",
      competency: "Resolucao de problemas e justificativa",
      kind: "video",
      format: "video",
      duration: "14 min",
      summary: "Mostra dois caminhos possiveis e quando cada um oferece melhor visibilidade do raciocinio.",
      progress: 54,
      status: "Em andamento",
      xp: 35,
      tags: ["matematica", "video", "comparacao"]
    },
    {
      id: "mat-practice-2",
      trackId: "matematica-estrategias",
      levelId: "mat-level-2",
      title: "Duelo de procedimentos",
      competency: "Resolucao de problemas e justificativa",
      kind: "social",
      format: "debate guiado",
      duration: "35 min",
      summary: "Argumenta em dupla sobre qual procedimento e mais robusto para um problema aberto.",
      progress: 30,
      status: "Liberado",
      xp: 65,
      tags: ["social", "debate", "justificativa"]
    },
    {
      id: "mat-doc-3",
      trackId: "matematica-estrategias",
      levelId: "mat-level-3",
      title: "Guia de modelagem com dados",
      competency: "Resolucao de problemas e justificativa",
      kind: "doc",
      format: "guia",
      duration: "15 min",
      summary: "Transforma uma situacao real em dados comparaveis para tomada de decisao.",
      progress: 0,
      status: "Bloqueado",
      xp: 45,
      tags: ["doc", "modelagem", "dados"]
    },
    {
      id: "mat-practice-3",
      trackId: "matematica-estrategias",
      levelId: "mat-level-3",
      title: "Projeto de grafico narrado",
      competency: "Resolucao de problemas e justificativa",
      kind: "projeto",
      format: "atividade",
      duration: "50 min",
      summary: "Constroi um grafico e grava uma explicacao curta defendendo a leitura dos dados.",
      progress: 0,
      status: "Bloqueado",
      xp: 85,
      tags: ["projeto", "grafico", "explicacao"]
    },
    {
      id: "sci-doc-1",
      trackId: "ciencias-investigacao",
      levelId: "sci-level-1",
      title: "Guia de pergunta investigavel",
      competency: "Investigacao, evidencia e comunicacao",
      kind: "doc",
      format: "guia",
      duration: "11 min",
      summary: "Ajuda a separar pergunta ampla de pergunta observavel e registravel.",
      progress: 100,
      status: "Concluido",
      xp: 30,
      tags: ["ciencias", "doc", "pergunta"]
    },
    {
      id: "sci-practice-1",
      trackId: "ciencias-investigacao",
      levelId: "sci-level-1",
      title: "Ficha de hipotese e coleta",
      competency: "Investigacao, evidencia e comunicacao",
      kind: "atividade",
      format: "template",
      duration: "26 min",
      summary: "Preenche hipotese, variavel observada e criterio minimo de coleta.",
      progress: 74,
      status: "Em andamento",
      xp: 45,
      tags: ["atividade", "hipotese", "coleta"]
    },
    {
      id: "sci-video-2",
      trackId: "ciencias-investigacao",
      levelId: "sci-level-2",
      title: "Video | protocolo simples de campo",
      competency: "Investigacao, evidencia e comunicacao",
      kind: "video",
      format: "video",
      duration: "13 min",
      summary: "Mostra como montar uma rotina curta de observacao com baixa variacao de registro.",
      progress: 34,
      status: "Liberado",
      xp: 35,
      tags: ["video", "protocolo", "registro"]
    },
    {
      id: "sci-practice-2",
      trackId: "ciencias-investigacao",
      levelId: "sci-level-2",
      title: "Painel de comparacao de dados",
      competency: "Investigacao, evidencia e comunicacao",
      kind: "atividade",
      format: "worksheet",
      duration: "33 min",
      summary: "Organiza duas rodadas de coleta e aponta diferencas sem forcar conclusao.",
      progress: 18,
      status: "Liberado",
      xp: 55,
      tags: ["atividade", "dados", "comparacao"]
    },
    {
      id: "sci-doc-3",
      trackId: "ciencias-investigacao",
      levelId: "sci-level-3",
      title: "Kit de divulgacao cientifica local",
      competency: "Investigacao, evidencia e comunicacao",
      kind: "doc",
      format: "kit",
      duration: "22 min",
      summary: "Template para apresentar descoberta, limite metodologico e pergunta seguinte em linguagem publica.",
      progress: 0,
      status: "Bloqueado",
      xp: 50,
      tags: ["doc", "divulgacao", "territorio"]
    },
    {
      id: "sci-practice-3",
      trackId: "ciencias-investigacao",
      levelId: "sci-level-3",
      title: "Mostra cientifica social",
      competency: "Investigacao, evidencia e comunicacao",
      kind: "social",
      format: "evento",
      duration: "1 encontro",
      summary: "Apresenta o microestudo a colegas e recebe perguntas criticas da comunidade.",
      progress: 0,
      status: "Bloqueado",
      xp: 90,
      tags: ["social", "evento", "apresentacao"]
    },
    {
      id: "life-doc-1",
      trackId: "projeto-de-vida",
      levelId: "life-level-1",
      title: "Guia de foco e energia",
      competency: "Autonomia, repertorio e portfolio",
      kind: "doc",
      format: "guia",
      duration: "10 min",
      summary: "Ajuda a localizar interesses, energia e sinais de motivacao recorrentes.",
      progress: 100,
      status: "Concluido",
      xp: 30,
      tags: ["projeto de vida", "doc", "foco"]
    },
    {
      id: "life-practice-1",
      trackId: "projeto-de-vida",
      levelId: "life-level-1",
      title: "Mapa de repertorio pessoal",
      competency: "Autonomia, repertorio e portfolio",
      kind: "atividade",
      format: "worksheet",
      duration: "24 min",
      summary: "Relaciona experiencias, referencias e pessoas que ajudam a expandir o repertorio.",
      progress: 92,
      status: "Em andamento",
      xp: 45,
      tags: ["atividade", "repertorio", "autoconhecimento"]
    },
    {
      id: "life-template-2",
      trackId: "projeto-de-vida",
      levelId: "life-level-2",
      title: "Template de portfolio vivo",
      competency: "Autonomia, repertorio e portfolio",
      kind: "portfolio",
      format: "template",
      duration: "18 min",
      summary: "Modelo para evidencias, reflexoes e proximos passos em uma pagina unica.",
      progress: 76,
      status: "Em andamento",
      xp: 40,
      tags: ["portfolio", "template", "reflexao"]
    },
    {
      id: "life-practice-2",
      trackId: "projeto-de-vida",
      levelId: "life-level-2",
      title: "Clinica de feedback de perfil",
      competency: "Autonomia, repertorio e portfolio",
      kind: "social",
      format: "roda",
      duration: "30 min",
      summary: "Troca feedback sobre narrativa do perfil, atributos e evidencias em pequenos grupos.",
      progress: 58,
      status: "Em andamento",
      xp: 65,
      tags: ["social", "feedback", "perfil"]
    },
    {
      id: "life-doc-3",
      trackId: "projeto-de-vida",
      levelId: "life-level-3",
      title: "Roteiro de sprint de protagonismo",
      competency: "Autonomia, repertorio e portfolio",
      kind: "doc",
      format: "roteiro",
      duration: "19 min",
      summary: "Planeja uma iniciativa curta com meta, indicador de impacto e reflexao final.",
      progress: 24,
      status: "Liberado",
      xp: 50,
      tags: ["doc", "protagonismo", "impacto"]
    },
    {
      id: "life-practice-3",
      trackId: "projeto-de-vida",
      levelId: "life-level-3",
      title: "Sprint de impacto e relato final",
      competency: "Autonomia, repertorio e portfolio",
      kind: "projeto",
      format: "desafio",
      duration: "2 encontros",
      summary: "Executa a iniciativa e publica relato com metricas, falhas e proximo passo.",
      progress: 0,
      status: "Bloqueado",
      xp: 95,
      tags: ["projeto", "impacto", "relato"]
    }
  ];

  return {
    generatedAt: manifest.generatedAt,
    hero: {
      eyebrow: "campus BNCC por competencias",
      title: "Cognoscere organiza cursos, materiais, perfil e comunidade em um fluxo unico de progresso.",
      summary:
        "O portal agora separa a modelagem do trabalho em cursos por niveis, biblioteca de materiais tagueados por competencia, perfil customizavel do aluno e uma camada social para feedback e circulacao de evidencias.",
      stats: [
        { label: "cursos ativos", value: String(tracks.length) },
        { label: "materiais indexados", value: String(materials.length) },
        { label: "circulos sociais", value: "3" },
        { label: "docs BNCC", value: String(roadmap.length) }
      ]
    },
    quickActions: [
      {
        title: "Abrir cursos por competencia",
        description: "Navegue por niveis, materiais e desafios de cada curso com progresso vivo.",
        cta: "Ver cursos",
        targetView: "courses"
      },
      {
        title: "Consultar docs e materiais",
        description: "Filtre tudo por competencia, tipo de material e tags de estudo.",
        cta: "Abrir materiais",
        targetView: "materials"
      },
      {
        title: "Customizar perfil do aluno",
        description: "Troque grafico, fundo, avatar e atributos para montar uma pagina de progresso mais expressiva.",
        cta: "Editar perfil",
        targetView: "profile"
      },
      {
        title: "Mover pela area social",
        description: "Acompanhe desafios, clinicas de mentoria e publicacoes da comunidade.",
        cta: "Entrar na area social",
        targetView: "community"
      }
    ],
    student: {
      name: "Lina Costa",
      handle: "@lina.cognoscere",
      school: "Escola Parque Horizonte",
      city: "Salvador, BA",
      stageLabel: studentGrade.label,
      gradeValue: studentGrade.value,
      streak: 18,
      xp: 2840,
      level: 7,
      completedCourses: 5,
      communityRank: "Top 8%",
      bio: "Gosta de literatura, ciencia cidada e desafios de autoria em grupo.",
      focus: "Fortalecer argumentacao escrita, qualificar revisao e tornar o portfolio mais publico.",
      nextGoal: "Liberar a conquista Curadora de Evidencias",
      attributes: [
        { id: "autoria", label: "Autoria", value: 78 },
        { id: "evidencia", label: "Evidencia", value: 72 },
        { id: "colaboracao", label: "Colaboracao", value: 81 },
        { id: "autonomia", label: "Autonomia", value: 69 },
        { id: "transferencia", label: "Transferencia", value: 64 }
      ]
    },
    profileThemes: [
      {
        id: "aurora",
        label: "Aurora",
        accent: "#c36b1f",
        preview: "argila + luz",
        background: "linear-gradient(145deg,#fff6e9 0%,#f7e2c8 52%,#dfeae2 100%)",
        surface: "rgba(255,250,243,0.88)"
      },
      {
        id: "oceano",
        label: "Oceano",
        accent: "#1f6d63",
        preview: "teal + nevoa",
        background: "linear-gradient(145deg,#e7f4f1 0%,#d2ebe8 45%,#f6efe3 100%)",
        surface: "rgba(244,251,249,0.9)"
      },
      {
        id: "atelier",
        label: "Atelier",
        accent: "#8b4d36",
        preview: "papel + cobre",
        background: "linear-gradient(145deg,#f7efe6 0%,#ead5c4 56%,#fdf6ed 100%)",
        surface: "rgba(255,248,241,0.92)"
      }
    ],
    avatars: [
      { id: "atlas", label: "Atlas", glyph: "AT", accent: "#c36b1f" },
      { id: "brisa", label: "Brisa", glyph: "BR", accent: "#1f6d63" },
      { id: "coda", label: "Coda", glyph: "CD", accent: "#c65a4d" },
      { id: "lumen", label: "Lumen", glyph: "LM", accent: "#60785d" }
    ],
    chartModes: [
      { id: "radar", label: "Radar" },
      { id: "bars", label: "Barras" },
      { id: "rings", label: "Aneis" }
    ],
    tracks,
    materials,
    achievements: [
      {
        title: "Cartografa de Tese",
        description: "Sustentou foco claro em tres materiais seguidos da trilha de autoria.",
        rarity: "Comum",
        xp: 180,
        unlocked: true
      },
      {
        title: "Curadora de Evidencias",
        description: "Selecionou fontes com criterio e justificou escolhas em contexto social.",
        rarity: "Rara",
        xp: 260,
        unlocked: false
      },
      {
        title: "Mentora de Circulo",
        description: "Apoiou dois colegas na revisao de portfolio e participou de clinica ao vivo.",
        rarity: "Epica",
        xp: 320,
        unlocked: true
      },
      {
        title: "Sprint Social",
        description: "Publicou uma iniciativa com retorno da comunidade e relato de impacto.",
        rarity: "Lendaria",
        xp: 410,
        unlocked: false
      }
    ],
    roadmap,
    weeklyPlan: [
      { day: "Seg", title: "Sprint de leitura e tese", type: "curso", duration: "35 min" },
      { day: "Ter", title: "Clinica de mentoria", type: "social", duration: "50 min" },
      { day: "Qua", title: "Explorar docs por competencia", type: "materiais", duration: "20 min" },
      { day: "Qui", title: "Atualizar portfolio e grafico", type: "perfil", duration: "25 min" },
      { day: "Sex", title: "Publicar desafio da semana", type: "comunidade", duration: "30 min" }
    ],
    feed: [
      {
        id: "post-1",
        author: "Lina Costa",
        role: "aluna",
        competency: competency.title,
        trackId: "linguagens-autoria",
        tag: "evidencia",
        text: "Troquei duas citacoes por um contra-exemplo mais forte e a defesa da tese ficou mais limpa.",
        likes: 18,
        comments: 6
      },
      {
        id: "post-2",
        author: "Miguel Araujo",
        role: "mentor",
        competency: "Resolucao de problemas e justificativa",
        trackId: "matematica-estrategias",
        tag: "desafio",
        text: "Novo desafio aberto: resolver o mesmo problema com desenho, tabela e argumento curto.",
        likes: 24,
        comments: 11
      },
      {
        id: "post-3",
        author: "Laboratorio da Rua",
        role: "circulo",
        competency: "Investigacao, evidencia e comunicacao",
        trackId: "ciencias-investigacao",
        tag: "convite",
        text: "Abrimos uma rodada para microestudos sobre agua, sombra e ruido no entorno da escola.",
        likes: 31,
        comments: 8
      },
      {
        id: "post-4",
        author: "Rita Avelar",
        role: "mentora",
        competency: "Autonomia, repertorio e portfolio",
        trackId: "projeto-de-vida",
        tag: "portfolio",
        text: "Se o seu perfil ainda parece curriculo, tente contar o que mudou em voce depois de cada evidencia.",
        likes: 17,
        comments: 4
      }
    ],
    circles: [
      {
        title: "Circulo de Argumentacao",
        focus: "Feedback entre alunos que estao reescrevendo textos e respostas a objecoes.",
        members: 42,
        nextMeet: "quarta, 19h"
      },
      {
        title: "Liga dos Problemas Abertos",
        focus: "Comparacao de estrategias matematicas com defesa de criterio.",
        members: 28,
        nextMeet: "quinta, 18h"
      },
      {
        title: "Laboratorio da Rua",
        focus: "Projetos de ciencia cidada e observacao do territorio local.",
        members: 35,
        nextMeet: "sabado, 10h"
      }
    ],
    challenges: [
      {
        title: "Desafio da objecao honesta",
        competency: competency.title,
        reward: "+120 XP",
        brief: "Revisar um texto proprio depois de uma objecao real vinda de dois colegas."
      },
      {
        title: "Duelo de estrategias",
        competency: "Resolucao de problemas e justificativa",
        reward: "+95 XP",
        brief: "Comparar dois procedimentos e justificar qual comunica melhor o raciocinio."
      },
      {
        title: "Mini mostra do territorio",
        competency: "Investigacao, evidencia e comunicacao",
        reward: "+110 XP",
        brief: "Publicar um painel com pergunta, coleta, limite metodologico e proximo passo."
      }
    ],
    events: [
      {
        title: "Clinica de feedback de portfolio",
        date: "terca, 18h30",
        format: "ao vivo",
        focus: "ajustar narrativa, evidencias e leitura do perfil"
      },
      {
        title: "Mesa de docs BNCC",
        date: "quarta, 17h",
        format: "sala aberta",
        focus: "comparar niveis, ranges e documentos por competencia"
      },
      {
        title: "Plantao de projeto final",
        date: "sexta, 19h",
        format: "mentoria",
        focus: "desenhar fechamento de sprint e publicacao"
      }
    ],
    leaderboard: [
      { name: "Lina Costa", xp: 2840, badge: "Autoria" },
      { name: "Joao Teles", xp: 2710, badge: "Estrategia" },
      { name: "Maya Reis", xp: 2595, badge: "Investigacao" },
      { name: "Caio Luz", xp: 2440, badge: "Portfolio" }
    ]
  };
}

function buildHtml(manifest: Manifest): string {
  const portal = buildPortalModel(manifest);
  const payload = JSON.stringify(portal).replace(/</g, "\\u003c");

  return String.raw`<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Cognoscere | cursos, materiais e progresso</title>
  <style>
    :root{
      --bg:#f4efe6;
      --surface:rgba(255,251,245,0.92);
      --surface-strong:#fffaf2;
      --line:rgba(28,36,33,0.12);
      --ink:#1c2421;
      --muted:#5f6b67;
      --amber:#c36b1f;
      --teal:#1f6d63;
      --coral:#c65a4d;
      --sage:#60785d;
      --shadow:0 24px 64px rgba(53,36,16,0.12);
      --radius:28px;
    }
    *{box-sizing:border-box}
    html{scroll-behavior:smooth}
    body{
      margin:0;
      color:var(--ink);
      background:
        radial-gradient(circle at top left, rgba(255,214,160,0.42), transparent 22%),
        radial-gradient(circle at top right, rgba(83,142,129,0.16), transparent 24%),
        linear-gradient(180deg,#f8f4eb 0%,#efe6d8 100%);
      font-family:"Avenir Next","Trebuchet MS","Segoe UI",sans-serif;
    }
    button,input,select{font:inherit}
    .shell{width:min(1320px,calc(100vw - 26px));margin:16px auto 40px}
    .topbar,.panel,.card,.courseCard,.levelCard,.materialCard,.feedCard,.achievementCard,.miniCard,.circleCard,.eventCard{
      border:1px solid var(--line);
      background:var(--surface);
      box-shadow:var(--shadow);
    }
    .topbar{
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:16px;
      padding:16px 18px;
      border-radius:24px;
      position:sticky;
      top:12px;
      z-index:20;
      backdrop-filter:blur(18px);
    }
    .brand{
      display:flex;
      align-items:center;
      gap:12px;
      font-size:13px;
      font-weight:700;
      letter-spacing:.06em;
      text-transform:uppercase;
    }
    .brandMark{
      width:42px;
      height:42px;
      border-radius:14px;
      display:grid;
      place-items:center;
      background:linear-gradient(135deg,#c36b1f,#eeae5a);
      color:#fffaf2;
      font-family:"Baskerville","Times New Roman",serif;
      font-size:20px;
    }
    .navTabs,.inlineActions,.chipRow,.statsGrid,.quickGrid,.courseGrid,.levelGrid,.materialGrid,.achievementGrid,.roadmapGrid,.planGrid,.feedGrid,.circleGrid,.eventGrid{
      display:grid;
      gap:14px;
    }
    .navTabs{
      grid-auto-flow:column;
      grid-auto-columns:max-content;
      align-items:center;
      gap:10px;
    }
    .navButton,.chipButton,.primaryButton,.ghostButton,.tinyButton,.themeButton,.avatarButton{
      border:none;
      border-radius:999px;
      cursor:pointer;
      transition:transform .16s ease, background .16s ease, color .16s ease;
    }
    .navButton,.chipButton,.ghostButton,.themeButton,.avatarButton{
      padding:11px 15px;
      background:rgba(255,255,255,0.72);
      color:var(--ink);
      border:1px solid var(--line);
    }
    .primaryButton{
      padding:12px 18px;
      background:var(--ink);
      color:#fffaf2;
    }
    .tinyButton{
      padding:9px 12px;
      background:rgba(31,109,99,0.12);
      color:var(--ink);
    }
    .navButton.active,.chipButton.active,.themeButton.active,.avatarButton.active{
      background:var(--ink);
      color:#fffaf2;
    }
    .navButton:hover,.chipButton:hover,.primaryButton:hover,.ghostButton:hover,.tinyButton:hover,.courseCard:hover,.materialCard:hover,.feedCard:hover,.levelCard:hover,.themeButton:hover,.avatarButton:hover{
      transform:translateY(-2px);
    }
    .badge,.tone,.tag{
      display:inline-flex;
      align-items:center;
      gap:8px;
      border-radius:999px;
      padding:8px 12px;
      font-size:12px;
      letter-spacing:.08em;
      text-transform:uppercase;
      border:1px solid var(--line);
    }
    .badge{background:rgba(255,255,255,0.75);color:var(--muted)}
    .tone{color:#fffaf2;font-weight:700}
    .tone.amber{background:linear-gradient(135deg,#c36b1f,#e49b48)}
    .tone.teal{background:linear-gradient(135deg,#1f6d63,#359b8d)}
    .tone.coral{background:linear-gradient(135deg,#c65a4d,#df7b67)}
    .tone.sage{background:linear-gradient(135deg,#60785d,#8da387)}
    .tag{background:rgba(31,109,99,0.09);color:var(--ink)}
    .view{display:none;margin-top:18px}
    .view.active{display:block}
    .hero{
      display:grid;
      grid-template-columns:1.15fr .85fr;
      gap:18px;
    }
    .card,.panel{
      border-radius:var(--radius);
      padding:24px;
    }
    .heroMain{
      background:
        radial-gradient(circle at 82% 22%, rgba(31,109,99,0.16), transparent 24%),
        linear-gradient(145deg, rgba(255,255,255,0.95), rgba(255,246,235,0.9));
    }
    .heroSide{
      color:#fffaf2;
      background:linear-gradient(180deg, rgba(29,36,33,0.96), rgba(50,66,60,0.94));
    }
    h1,h2,h3,h4,p{margin:0}
    h1{
      margin-top:18px;
      max-width:11ch;
      font-family:"Baskerville","Palatino Linotype",serif;
      font-size:clamp(38px,5vw,68px);
      line-height:.95;
    }
    h2{
      font-family:"Baskerville","Palatino Linotype",serif;
      font-size:32px;
      line-height:1;
    }
    h3{
      font-family:"Baskerville","Palatino Linotype",serif;
      font-size:24px;
      line-height:1.06;
    }
    h4{font-size:18px;line-height:1.25}
    p{line-height:1.62;color:var(--muted)}
    .eyebrow{
      font-size:12px;
      font-weight:700;
      letter-spacing:.16em;
      text-transform:uppercase;
      color:var(--amber);
    }
    .heroSummary{margin-top:18px;max-width:60ch}
    .inlineActions{
      grid-auto-flow:column;
      grid-auto-columns:max-content;
      margin-top:22px;
    }
    .statsGrid{
      grid-template-columns:repeat(2,minmax(0,1fr));
      margin-top:18px;
    }
    .statCard{
      padding:14px;
      border-radius:20px;
      background:rgba(255,255,255,0.08);
      border:1px solid rgba(255,255,255,0.1);
    }
    .statCard strong{display:block;font-size:28px;color:#fffaf2}
    .statCard span{font-size:13px;color:rgba(255,248,240,0.72)}
    .quickGrid{
      grid-template-columns:repeat(4,minmax(0,1fr));
      margin-top:18px;
    }
    .miniCard{
      padding:20px;
      border-radius:24px;
      background:linear-gradient(180deg, rgba(255,255,255,0.85), rgba(255,248,240,0.95));
    }
    .miniCard p{margin-top:10px}
    .sectionHead{
      display:flex;
      align-items:flex-end;
      justify-content:space-between;
      gap:18px;
      margin-bottom:14px;
    }
    .sectionHead p{max-width:64ch}
    .spotlight{
      display:grid;
      grid-template-columns:1fr .92fr;
      gap:18px;
    }
    .spotlightBody,.spotlightSide{
      padding:22px;
      border-radius:24px;
      background:rgba(255,255,255,0.76);
      border:1px solid var(--line);
    }
    .spotlightList,.metricList,.profileMetrics,.levelMaterials,.socialHighlights{
      display:grid;
      gap:12px;
    }
    .metricRow,.feedMeta,.leaderRow{
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:12px;
    }
    .courseLayout,.materialsLayout,.profileLayout,.communityLayout{
      display:grid;
      gap:18px;
    }
    .courseLayout{grid-template-columns:1.08fr .92fr}
    .materialsLayout{grid-template-columns:340px minmax(0,1fr)}
    .profileLayout{grid-template-columns:370px minmax(0,1fr)}
    .communityLayout{grid-template-columns:minmax(0,1fr) 340px}
    .courseGrid{
      grid-template-columns:repeat(2,minmax(0,1fr));
    }
    .courseCard,.levelCard,.materialCard,.feedCard,.achievementCard,.circleCard,.eventCard{
      padding:18px;
      border-radius:24px;
    }
    .courseCard.active,.levelCard.active{
      background:rgba(255,250,242,0.98);
      border-color:rgba(28,36,33,0.28);
    }
    .metaRow,.skillRow{
      display:flex;
      flex-wrap:wrap;
      gap:10px;
      margin-top:12px;
    }
    .progressRail{
      width:100%;
      height:12px;
      margin-top:12px;
      border-radius:999px;
      overflow:hidden;
      background:rgba(28,36,33,0.09);
    }
    .progressRail span{
      display:block;
      height:100%;
      border-radius:999px;
      background:linear-gradient(90deg,#c36b1f,#1f6d63);
    }
    .levelGrid{
      grid-template-columns:repeat(2,minmax(0,1fr));
      margin-top:16px;
    }
    .materialGrid{
      grid-template-columns:repeat(2,minmax(0,1fr));
      margin-top:16px;
    }
    .materialCard h4,.feedCard h4,.circleCard h4,.eventCard h4{margin-top:12px}
    .materialActionRow,.feedActions,.controlRow{
      display:flex;
      flex-wrap:wrap;
      gap:10px;
      margin-top:14px;
    }
    .filterPanel,.detailPanel,.profilePreview{
      position:sticky;
      top:96px;
      height:max-content;
    }
    .searchInput,.selectInput,.rangeInput{
      width:100%;
      margin-top:10px;
      padding:12px 14px;
      border-radius:16px;
      border:1px solid var(--line);
      background:rgba(255,255,255,0.76);
      color:var(--ink);
    }
    .filterGroup{margin-top:16px}
    .filterGroup h4{margin-bottom:10px}
    .materialsHero{
      display:grid;
      grid-template-columns:repeat(3,minmax(0,1fr));
      gap:12px;
      margin-top:18px;
    }
    .materialsHero .miniCard{padding:18px}
    .profilePreview{
      padding:0;
      overflow:hidden;
      background:transparent;
      border:none;
      box-shadow:none;
    }
    .profilePreviewCard{
      padding:22px;
      border-radius:32px;
      min-height:440px;
      border:1px solid rgba(28,36,33,0.12);
      box-shadow:var(--shadow);
      color:var(--ink);
    }
    .avatarView{
      width:86px;
      height:86px;
      border-radius:28px;
      display:grid;
      place-items:center;
      font-family:"Baskerville","Palatino Linotype",serif;
      font-size:28px;
      color:#fffaf2;
      background:linear-gradient(135deg,#c36b1f,#efad58);
    }
    .profileMeta{
      display:flex;
      align-items:flex-start;
      justify-content:space-between;
      gap:14px;
      margin-top:16px;
    }
    .profileMetrics{
      grid-template-columns:repeat(2,minmax(0,1fr));
      margin-top:18px;
    }
    .profileMetric{
      padding:14px;
      border-radius:18px;
      background:rgba(255,255,255,0.7);
      border:1px solid rgba(28,36,33,0.1);
    }
    .profileMetric strong{display:block;font-size:24px}
    .chartBox{
      margin-top:18px;
      padding:16px;
      border-radius:22px;
      background:rgba(255,255,255,0.68);
      border:1px solid rgba(28,36,33,0.08);
    }
    .profileCustomPanel .filterGroup:first-child{margin-top:0}
    .achievementGrid{
      grid-template-columns:repeat(2,minmax(0,1fr));
      margin-top:16px;
    }
    .achievementCard.locked{
      opacity:.74;
      background:rgba(255,252,247,0.82);
    }
    .roadmapGrid,.planGrid,.feedGrid,.circleGrid,.eventGrid{
      margin-top:16px;
    }
    .roadItem{
      padding:16px;
      border-radius:22px;
      background:rgba(255,255,255,0.78);
      border:1px solid var(--line);
      box-shadow:var(--shadow);
    }
    .feedActions .tinyButton{
      background:rgba(31,109,99,0.1);
    }
    .leaderboard{
      padding:18px;
      border-radius:28px;
      border:1px solid var(--line);
      background:var(--surface);
      box-shadow:var(--shadow);
      position:sticky;
      top:96px;
    }
    .leaderboardList{display:grid;gap:12px;margin-top:16px}
    .leaderRow{
      padding:14px;
      border-radius:18px;
      background:rgba(255,255,255,0.72);
      border:1px solid var(--line);
    }
    .socialHighlights{
      margin-top:16px;
    }
    .emptyState{
      padding:24px;
      border-radius:24px;
      border:1px dashed rgba(28,36,33,0.22);
      background:rgba(255,255,255,0.6);
    }
    a{color:var(--teal)}
    @media (max-width: 1120px){
      .hero,.spotlight,.courseLayout,.materialsLayout,.profileLayout,.communityLayout{grid-template-columns:1fr}
      .filterPanel,.detailPanel,.profilePreview,.leaderboard{position:static}
      .quickGrid,.courseGrid,.levelGrid,.materialGrid,.achievementGrid,.materialsHero,.circleGrid,.eventGrid{grid-template-columns:1fr}
    }
    @media (max-width: 760px){
      .shell{width:min(100vw - 16px, 1000px);margin:8px auto 26px}
      .topbar{display:grid}
      .navTabs{grid-auto-flow:row}
      .statsGrid,.profileMetrics{grid-template-columns:1fr 1fr}
    }
  </style>
</head>
<body>
  <div class="shell">
    <header class="topbar">
      <div class="brand">
        <div class="brandMark">C</div>
        <div>
          <div>Cognoscere</div>
          <div style="color:var(--muted)">campus por competencias</div>
        </div>
      </div>
      <nav class="navTabs">
        <button class="navButton active" data-view-target="home">Inicio</button>
        <button class="navButton" data-view-target="courses">Cursos</button>
        <button class="navButton" data-view-target="materials">Materiais</button>
        <button class="navButton" data-view-target="profile">Perfil</button>
        <button class="navButton" data-view-target="community">Social</button>
      </nav>
      <div class="badge" id="todayBadge"></div>
    </header>

    <main>
      <section class="view active" data-view="home">
        <div class="hero">
          <section class="card heroMain">
            <span class="eyebrow" id="heroEyebrow"></span>
            <h1 id="heroTitle"></h1>
            <p class="heroSummary" id="heroSummary"></p>
            <div class="inlineActions">
              <button class="primaryButton" data-go-view="courses">Entrar nos cursos</button>
              <button class="ghostButton" data-go-view="materials">Abrir docs e materiais</button>
            </div>
          </section>
          <aside class="card heroSide">
            <span class="badge">estado do portal</span>
            <div class="statsGrid" id="heroStats"></div>
          </aside>
        </div>

        <section class="quickGrid" id="quickActions"></section>

        <section class="panel" style="margin-top:18px">
          <div class="sectionHead">
            <div>
              <span class="eyebrow">Foco operacional</span>
              <h2 style="margin-top:10px">Cursos, docs e area social em um fluxo so</h2>
              <p>O destaque abaixo combina o curso selecionado, o progresso dos materiais, os niveis destravados e a ponte com a comunidade.</p>
            </div>
            <button class="ghostButton" data-go-view="profile">Ajustar perfil</button>
          </div>
          <div class="spotlight">
            <div class="spotlightBody">
              <span class="badge" id="homeTrackBadge"></span>
              <h3 style="margin-top:12px" id="homeTrackTitle"></h3>
              <p style="margin-top:10px" id="homeTrackSummary"></p>
              <div class="metaRow" id="homeTrackMeta"></div>
              <div class="progressRail"><span id="homeTrackProgress"></span></div>
              <div class="spotlightList" id="homeTrackLevels" style="margin-top:16px"></div>
            </div>
            <div class="spotlightSide">
              <span class="badge">Docs e materiais em destaque</span>
              <div class="spotlightList" id="homeMaterialSpotlight" style="margin-top:16px"></div>
            </div>
          </div>
        </section>
      </section>

      <section class="view" data-view="courses">
        <section class="panel">
          <div class="sectionHead">
            <div>
              <span class="eyebrow">Area de cursos</span>
              <h2 style="margin-top:10px">Cursos por competencia com progressao por nivel e por material</h2>
              <p>Cada curso avanca em niveis. O desbloqueio depende do progresso medio dos materiais do nivel anterior.</p>
            </div>
          </div>
        </section>
        <div class="courseLayout" style="margin-top:18px">
          <div>
            <div class="courseGrid" id="courseGrid"></div>
          </div>
          <aside class="panel detailPanel">
            <span class="badge">Curso selecionado</span>
            <h3 style="margin-top:12px" id="courseTitle"></h3>
            <p style="margin-top:10px" id="courseSummary"></p>
            <div class="metaRow" id="courseMeta"></div>
            <div class="progressRail"><span id="courseProgress"></span></div>
            <div class="levelGrid" id="levelGrid"></div>
            <div class="sectionHead" style="margin-top:18px;margin-bottom:0">
              <div>
                <span class="eyebrow">Materiais do nivel</span>
                <h3 style="margin-top:10px" id="levelTitle"></h3>
              </div>
            </div>
            <div class="levelMaterials" id="levelMaterials"></div>
          </aside>
        </div>
      </section>

      <section class="view" data-view="materials">
        <section class="panel">
          <div class="sectionHead">
            <div>
              <span class="eyebrow">Documentacao e biblioteca</span>
              <h2 style="margin-top:10px">Pagina de materiais tagueados por competencia</h2>
              <p>Use filtros por competencia, tipo e busca textual para navegar entre docs BNCC, atividades, projetos, social e portfolio.</p>
            </div>
          </div>
          <div class="materialsHero" id="materialsHero"></div>
        </section>
        <div class="materialsLayout" style="margin-top:18px">
          <aside class="panel filterPanel">
            <span class="badge">Filtros</span>
            <div class="filterGroup">
              <h4>Busca</h4>
              <input class="searchInput" id="materialSearch" type="search" placeholder="Buscar por titulo, tag ou competencia" />
            </div>
            <div class="filterGroup">
              <h4>Competencia</h4>
              <div class="chipRow" id="materialCompetencyFilters"></div>
            </div>
            <div class="filterGroup">
              <h4>Tipo</h4>
              <div class="chipRow" id="materialTypeFilters"></div>
            </div>
          </aside>
          <div>
            <div class="materialGrid" id="materialsGrid"></div>
            <div class="emptyState" id="materialsEmpty" style="display:none;margin-top:16px">
              Nenhum material encontrado para esse recorte.
            </div>
          </div>
        </div>
      </section>

      <section class="view" data-view="profile">
        <div class="profileLayout">
          <aside class="profilePreview">
            <div class="profilePreviewCard" id="profilePreviewCard">
              <div class="avatarView" id="avatarView"></div>
              <div class="profileMeta">
                <div>
                  <span class="eyebrow">Perfil do aluno</span>
                  <h2 style="margin-top:10px" id="studentName"></h2>
                  <p id="studentHandle"></p>
                </div>
                <span class="badge" id="studentRank"></span>
              </div>
              <p style="margin-top:14px" id="studentBio"></p>
              <div class="profileMetrics" id="profileMetrics"></div>
              <div class="chartBox">
                <div class="metricRow">
                  <h4>Grafico customizavel</h4>
                  <span class="badge" id="chartModeBadge"></span>
                </div>
                <div id="profileChart" style="margin-top:16px"></div>
              </div>
            </div>
          </aside>
          <div>
            <section class="panel profileCustomPanel">
              <div class="sectionHead">
                <div>
                  <span class="eyebrow">Customizacao</span>
                  <h2 style="margin-top:10px">Grafico, fundo, atributos e avatar</h2>
                  <p>As mudancas abaixo atualizam a preview do perfil e a leitura visual do progresso.</p>
                </div>
              </div>
              <div class="filterGroup">
                <h4>Modo de grafico</h4>
                <div class="chipRow" id="chartModeFilters"></div>
              </div>
              <div class="filterGroup">
                <h4>Fundo do perfil</h4>
                <div class="chipRow" id="themeFilters"></div>
              </div>
              <div class="filterGroup">
                <h4>Avatar</h4>
                <div class="chipRow" id="avatarFilters"></div>
              </div>
              <div class="filterGroup">
                <h4>Atributos do progresso</h4>
                <div id="attributeSliders"></div>
              </div>
            </section>

            <section class="panel" style="margin-top:18px">
              <div class="sectionHead">
                <div>
                  <span class="eyebrow">Conquistas</span>
                  <h2 style="margin-top:10px">Badges, docs de referencia e rotina</h2>
                </div>
              </div>
              <div class="achievementGrid" id="achievementGrid"></div>
              <div class="roadmapGrid" id="roadmapGrid"></div>
              <div class="planGrid" id="weeklyPlanGrid"></div>
            </section>
          </div>
        </div>
      </section>

      <section class="view" data-view="community">
        <div class="communityLayout">
          <div>
            <section class="panel">
              <div class="sectionHead">
                <div>
                  <span class="eyebrow">Area social</span>
                  <h2 style="margin-top:10px">Desafios, clinicas, circulos e feed por competencia</h2>
                  <p>A camada social foi separada entre desafios da semana, agenda de eventos e feed filtravel por tag.</p>
                </div>
              </div>
              <div class="socialHighlights" id="challengeGrid"></div>
              <div class="eventGrid" id="eventGrid"></div>
            </section>

            <section class="panel" style="margin-top:18px">
              <div class="sectionHead">
                <div>
                  <span class="eyebrow">Feed social</span>
                  <h2 style="margin-top:10px">Publicacoes e feedbacks</h2>
                </div>
              </div>
              <div class="chipRow" id="feedFilters"></div>
              <div class="feedGrid" id="feedGrid"></div>
            </section>

            <section class="panel" style="margin-top:18px">
              <div class="sectionHead">
                <div>
                  <span class="eyebrow">Circulos ativos</span>
                  <h2 style="margin-top:10px">Grupos de colaboracao</h2>
                </div>
              </div>
              <div class="circleGrid" id="circleGrid"></div>
            </section>
          </div>

          <aside class="leaderboard">
            <span class="badge">Ranking semanal</span>
            <h3 style="margin-top:12px">Quem mais avancou</h3>
            <div class="leaderboardList" id="leaderboardList"></div>
          </aside>
        </div>
      </section>
    </main>
  </div>

  <script>
    const data = ${payload};
    const state = {
      view: "home",
      selectedTrackId: data.tracks[0].id,
      selectedLevelId: data.tracks[0].levels[0].id,
      materialCompetency: "Todas",
      materialKind: "Todos",
      materialQuery: "",
      feedFilter: "Todos",
      profileThemeId: data.profileThemes[0].id,
      avatarId: data.avatars[0].id,
      chartMode: data.chartModes[0].id,
      materials: data.materials.map(function(item){ return Object.assign({}, item); }),
      feed: data.feed.map(function(item){ return Object.assign({}, item); }),
      attributes: data.student.attributes.map(function(item){ return Object.assign({}, item); })
    };

    const el = {
      heroEyebrow: document.getElementById("heroEyebrow"),
      heroTitle: document.getElementById("heroTitle"),
      heroSummary: document.getElementById("heroSummary"),
      heroStats: document.getElementById("heroStats"),
      quickActions: document.getElementById("quickActions"),
      homeTrackBadge: document.getElementById("homeTrackBadge"),
      homeTrackTitle: document.getElementById("homeTrackTitle"),
      homeTrackSummary: document.getElementById("homeTrackSummary"),
      homeTrackMeta: document.getElementById("homeTrackMeta"),
      homeTrackProgress: document.getElementById("homeTrackProgress"),
      homeTrackLevels: document.getElementById("homeTrackLevels"),
      homeMaterialSpotlight: document.getElementById("homeMaterialSpotlight"),
      courseGrid: document.getElementById("courseGrid"),
      courseTitle: document.getElementById("courseTitle"),
      courseSummary: document.getElementById("courseSummary"),
      courseMeta: document.getElementById("courseMeta"),
      courseProgress: document.getElementById("courseProgress"),
      levelGrid: document.getElementById("levelGrid"),
      levelTitle: document.getElementById("levelTitle"),
      levelMaterials: document.getElementById("levelMaterials"),
      materialsHero: document.getElementById("materialsHero"),
      materialSearch: document.getElementById("materialSearch"),
      materialCompetencyFilters: document.getElementById("materialCompetencyFilters"),
      materialTypeFilters: document.getElementById("materialTypeFilters"),
      materialsGrid: document.getElementById("materialsGrid"),
      materialsEmpty: document.getElementById("materialsEmpty"),
      profilePreviewCard: document.getElementById("profilePreviewCard"),
      avatarView: document.getElementById("avatarView"),
      studentName: document.getElementById("studentName"),
      studentHandle: document.getElementById("studentHandle"),
      studentRank: document.getElementById("studentRank"),
      studentBio: document.getElementById("studentBio"),
      profileMetrics: document.getElementById("profileMetrics"),
      chartModeBadge: document.getElementById("chartModeBadge"),
      profileChart: document.getElementById("profileChart"),
      chartModeFilters: document.getElementById("chartModeFilters"),
      themeFilters: document.getElementById("themeFilters"),
      avatarFilters: document.getElementById("avatarFilters"),
      attributeSliders: document.getElementById("attributeSliders"),
      achievementGrid: document.getElementById("achievementGrid"),
      roadmapGrid: document.getElementById("roadmapGrid"),
      weeklyPlanGrid: document.getElementById("weeklyPlanGrid"),
      challengeGrid: document.getElementById("challengeGrid"),
      eventGrid: document.getElementById("eventGrid"),
      feedFilters: document.getElementById("feedFilters"),
      feedGrid: document.getElementById("feedGrid"),
      circleGrid: document.getElementById("circleGrid"),
      leaderboardList: document.getElementById("leaderboardList"),
      todayBadge: document.getElementById("todayBadge")
    };

    function average(items) {
      if (!items.length) {
        return 0;
      }
      const total = items.reduce(function(sum, item){ return sum + item.progress; }, 0);
      return Math.round(total / items.length);
    }

    function getTrack(trackId) {
      return data.tracks.find(function(track){ return track.id === trackId; }) || data.tracks[0];
    }

    function getLevel(levelId) {
      const track = getTrack(state.selectedTrackId);
      return track.levels.find(function(level){ return level.id === levelId; }) || track.levels[0];
    }

    function materialsForTrack(trackId) {
      return state.materials.filter(function(material){ return material.trackId === trackId; });
    }

    function materialsForLevel(levelId) {
      return state.materials.filter(function(material){ return material.levelId === levelId; });
    }

    function trackProgress(trackId) {
      return average(materialsForTrack(trackId));
    }

    function levelProgress(levelId) {
      return average(materialsForLevel(levelId));
    }

    function isLevelUnlocked(track, index) {
      if (index === 0) {
        return true;
      }
      const previous = track.levels[index - 1];
      return levelProgress(previous.id) >= 70;
    }

    function completedMaterialsCount() {
      return state.materials.filter(function(material){ return material.progress >= 100; }).length;
    }

    function inProgressMaterialsCount() {
      return state.materials.filter(function(material){ return material.progress > 0 && material.progress < 100; }).length;
    }

    function topDocMaterials(limit) {
      return state.materials
        .filter(function(material){ return material.kind === "doc"; })
        .sort(function(a, b){ return b.progress - a.progress; })
        .slice(0, limit);
    }

    function setView(view) {
      state.view = view;
      document.querySelectorAll(".view").forEach(function(node){
        node.classList.toggle("active", node.getAttribute("data-view") === view);
      });
      document.querySelectorAll(".navButton").forEach(function(node){
        node.classList.toggle("active", node.getAttribute("data-view-target") === view);
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function renderHero() {
      el.heroEyebrow.textContent = data.hero.eyebrow;
      el.heroTitle.textContent = data.hero.title;
      el.heroSummary.textContent = data.hero.summary;
      el.heroStats.innerHTML = data.hero.stats.map(function(stat){
        return "<div class='statCard'><strong>" + stat.value + "</strong><span>" + stat.label + "</span></div>";
      }).join("");
    }

    function renderQuickActions() {
      el.quickActions.innerHTML = data.quickActions.map(function(action){
        return "<article class='miniCard'>" +
          "<span class='badge'>" + action.cta + "</span>" +
          "<h3 style='margin-top:12px'>" + action.title + "</h3>" +
          "<p>" + action.description + "</p>" +
          "<div class='controlRow'><button class='primaryButton' data-go-view='" + action.targetView + "'>" + action.cta + "</button></div>" +
        "</article>";
      }).join("");
    }

    function renderHomeSpotlight() {
      const track = getTrack(state.selectedTrackId);
      const courseMaterials = materialsForTrack(track.id);
      el.homeTrackBadge.textContent = track.area;
      el.homeTrackTitle.textContent = track.title;
      el.homeTrackSummary.textContent = track.summary;
      el.homeTrackMeta.innerHTML = [
        "<span class='tag'>" + track.competency + "</span>",
        "<span class='tag'>" + track.audience + "</span>",
        "<span class='tag'>" + track.mentor + "</span>",
        "<span class='tag'>" + track.weeklyChallenge + "</span>"
      ].join("");
      el.homeTrackProgress.style.width = trackProgress(track.id) + "%";
      el.homeTrackLevels.innerHTML = track.levels.slice(0, 3).map(function(level, index){
        return "<div class='miniCard'>" +
          "<div class='metricRow'><strong>" + level.title + "</strong><span class='badge'>" + (isLevelUnlocked(track, index) ? "liberado" : "bloqueado") + "</span></div>" +
          "<p>" + level.summary + "</p>" +
          "<div class='progressRail'><span style='width:" + levelProgress(level.id) + "%'></span></div>" +
        "</div>";
      }).join("");
      el.homeMaterialSpotlight.innerHTML = topDocMaterials(4).map(function(material){
        return "<div class='miniCard'>" +
          "<div class='metricRow'><strong>" + material.title + "</strong><span class='badge'>" + material.kind + "</span></div>" +
          "<p>" + material.summary + "</p>" +
          "<div class='progressRail'><span style='width:" + material.progress + "%'></span></div>" +
        "</div>";
      }).join("");
    }

    function renderCourseGrid() {
      el.courseGrid.innerHTML = data.tracks.map(function(track){
        const progress = trackProgress(track.id);
        return "<article class='courseCard" + (track.id === state.selectedTrackId ? " active" : "") + "' data-track-id='" + track.id + "'>" +
          "<div class='metricRow'><span class='tone " + track.color + "'>" + track.area + "</span><span class='badge'>" + track.stageBucket + "</span></div>" +
          "<h3 style='margin-top:14px'>" + track.title + "</h3>" +
          "<p>" + track.summary + "</p>" +
          "<div class='metaRow'><span class='tag'>" + track.students + " alunos</span><span class='tag'>" + track.completionRate + "% concluem</span></div>" +
          "<div class='progressRail'><span style='width:" + progress + "%'></span></div>" +
        "</article>";
      }).join("");

      el.courseGrid.querySelectorAll("[data-track-id]").forEach(function(node){
        node.addEventListener("click", function(){
          const trackId = node.getAttribute("data-track-id") || data.tracks[0].id;
          const track = getTrack(trackId);
          state.selectedTrackId = track.id;
          state.selectedLevelId = track.levels[0].id;
          renderCourseGrid();
          renderCourseDetail();
          renderHomeSpotlight();
          renderMaterials();
        });
      });
    }

    function renderCourseDetail() {
      const track = getTrack(state.selectedTrackId);
      const trackMaterials = materialsForTrack(track.id);
      const progress = trackProgress(track.id);
      el.courseTitle.textContent = track.title;
      el.courseSummary.textContent = track.summary;
      el.courseMeta.innerHTML = [
        "<span class='tag'>" + track.competency + "</span>",
        "<span class='tag'>" + track.mentor + "</span>",
        "<span class='tag'>" + track.weeklyChallenge + "</span>",
        "<span class='tag'>" + trackMaterials.length + " materiais</span>"
      ].join("");
      el.courseProgress.style.width = progress + "%";
      el.levelGrid.innerHTML = track.levels.map(function(level, index){
        const unlocked = isLevelUnlocked(track, index);
        const levelIsActive = level.id === state.selectedLevelId;
        return "<article class='levelCard" + (levelIsActive ? " active" : "") + "' data-level-id='" + level.id + "'>" +
          "<div class='metricRow'><strong>" + level.title + "</strong><span class='badge'>" + (unlocked ? level.badge : "bloqueado") + "</span></div>" +
          "<p>" + level.mastery + "</p>" +
          "<div class='progressRail'><span style='width:" + levelProgress(level.id) + "%'></span></div>" +
          "<div class='metaRow'><span class='tag'>" + level.xpReward + " XP</span><span class='tag'>" + level.materialIds.length + " materiais</span></div>" +
        "</article>";
      }).join("");
      el.levelGrid.querySelectorAll("[data-level-id]").forEach(function(node){
        node.addEventListener("click", function(){
          const levelId = node.getAttribute("data-level-id") || track.levels[0].id;
          state.selectedLevelId = levelId;
          renderCourseDetail();
        });
      });

      const level = getLevel(state.selectedLevelId);
      el.levelTitle.textContent = level.title;
      el.levelMaterials.innerHTML = materialsForLevel(level.id).map(function(material){
        const actionLabel = material.progress >= 100 ? "Revisar" : material.progress > 0 ? "Continuar" : "Estudar";
        const link = material.path
          ? "<a href='" + material.path + "' target='_blank' rel='noreferrer'>Abrir doc</a>"
          : "<span class='badge'>" + material.format + "</span>";
        return "<article class='materialCard'>" +
          "<div class='metricRow'><span class='badge'>" + material.kind + "</span><span class='tag'>" + material.duration + "</span></div>" +
          "<h4>" + material.title + "</h4>" +
          "<p>" + material.summary + "</p>" +
          "<div class='metaRow'>" + material.tags.map(function(tag){ return "<span class='tag'>" + tag + "</span>"; }).join("") + "</div>" +
          "<div class='progressRail'><span style='width:" + material.progress + "%'></span></div>" +
          "<div class='materialActionRow'>" +
            "<button class='tinyButton' data-study-id='" + material.id + "'>" + actionLabel + " +" + Math.max(10, Math.round(material.xp / 4)) + "%</button>" +
            link +
          "</div>" +
        "</article>";
      }).join("");
      bindStudyButtons();
    }

    function materialCompetencies() {
      return ["Todas"].concat(Array.from(new Set(state.materials.map(function(material){ return material.competency; }))));
    }

    function materialKinds() {
      return ["Todos"].concat(Array.from(new Set(state.materials.map(function(material){ return material.kind; }))));
    }

    function renderFilterButtons(container, values, activeValue, onClick) {
      container.innerHTML = values.map(function(value){
        return "<button class='chipButton" + (value === activeValue ? " active" : "") + "' data-filter-value='" + value + "'>" + value + "</button>";
      }).join("");
      container.querySelectorAll("[data-filter-value]").forEach(function(node){
        node.addEventListener("click", function(){
          onClick(node.getAttribute("data-filter-value") || "");
        });
      });
    }

    function filteredMaterials() {
      const query = state.materialQuery.trim().toLowerCase();
      return state.materials.filter(function(material){
        const competencyOk = state.materialCompetency === "Todas" || material.competency === state.materialCompetency;
        const kindOk = state.materialKind === "Todos" || material.kind === state.materialKind;
        const haystack = [material.title, material.summary, material.competency].concat(material.tags).join(" ").toLowerCase();
        const queryOk = !query || haystack.includes(query);
        return competencyOk && kindOk && queryOk;
      });
    }

    function renderMaterialsHero() {
      el.materialsHero.innerHTML = [
        "<article class='miniCard'><strong>" + state.materials.filter(function(material){ return material.kind === "doc"; }).length + "</strong><p>docs e referencias por competencia</p></article>",
        "<article class='miniCard'><strong>" + completedMaterialsCount() + "</strong><p>materiais concluidos no percurso do aluno</p></article>",
        "<article class='miniCard'><strong>" + inProgressMaterialsCount() + "</strong><p>materiais em andamento aguardando proximo nivel</p></article>"
      ].join("");
    }

    function renderMaterials() {
      renderMaterialsHero();
      renderFilterButtons(el.materialCompetencyFilters, materialCompetencies(), state.materialCompetency, function(value){
        state.materialCompetency = value;
        renderMaterials();
      });
      renderFilterButtons(el.materialTypeFilters, materialKinds(), state.materialKind, function(value){
        state.materialKind = value;
        renderMaterials();
      });
      const visible = filteredMaterials();
      el.materialsEmpty.style.display = visible.length ? "none" : "block";
      el.materialsGrid.innerHTML = visible.map(function(material){
        const actionLabel = material.progress >= 100 ? "Revisar" : material.progress > 0 ? "Continuar" : "Estudar";
        const link = material.path
          ? "<a href='" + material.path + "' target='_blank' rel='noreferrer'>Abrir referencia</a>"
          : "<span class='badge'>" + material.format + "</span>";
        return "<article class='materialCard'>" +
          "<div class='metricRow'><span class='badge'>" + material.kind + "</span><span class='tone " + (getTrack(material.trackId).color) + "'>" + getTrack(material.trackId).area + "</span></div>" +
          "<h4>" + material.title + "</h4>" +
          "<p>" + material.summary + "</p>" +
          "<div class='metaRow'>" +
            "<span class='tag'>" + material.competency + "</span>" +
            "<span class='tag'>" + material.duration + "</span>" +
            material.tags.map(function(tag){ return "<span class='tag'>" + tag + "</span>"; }).join("") +
          "</div>" +
          "<div class='progressRail'><span style='width:" + material.progress + "%'></span></div>" +
          "<div class='materialActionRow'><button class='tinyButton' data-study-id='" + material.id + "'>" + actionLabel + " material</button>" + link + "</div>" +
        "</article>";
      }).join("");
      bindStudyButtons();
    }

    function currentTheme() {
      return data.profileThemes.find(function(theme){ return theme.id === state.profileThemeId; }) || data.profileThemes[0];
    }

    function currentAvatar() {
      return data.avatars.find(function(avatar){ return avatar.id === state.avatarId; }) || data.avatars[0];
    }

    function attributeAverage() {
      const total = state.attributes.reduce(function(sum, item){ return sum + item.value; }, 0);
      return Math.round(total / state.attributes.length);
    }

    function buildRadarChart() {
      const points = state.attributes.map(function(item, index){
        const angle = (-Math.PI / 2) + (Math.PI * 2 * index / state.attributes.length);
        const radius = 92 * item.value / 100;
        const x = 120 + Math.cos(angle) * radius;
        const y = 120 + Math.sin(angle) * radius;
        return { x: x.toFixed(1), y: y.toFixed(1), label: item.label, value: item.value };
      });
      const polygon = points.map(function(point){ return point.x + "," + point.y; }).join(" ");
      const axes = state.attributes.map(function(item, index){
        const angle = (-Math.PI / 2) + (Math.PI * 2 * index / state.attributes.length);
        const x = 120 + Math.cos(angle) * 100;
        const y = 120 + Math.sin(angle) * 100;
        const lx = 120 + Math.cos(angle) * 114;
        const ly = 120 + Math.sin(angle) * 114;
        return "<line x1='120' y1='120' x2='" + x.toFixed(1) + "' y2='" + y.toFixed(1) + "' stroke='rgba(28,36,33,0.16)' />" +
          "<text x='" + lx.toFixed(1) + "' y='" + ly.toFixed(1) + "' font-size='11' text-anchor='middle' fill='rgba(28,36,33,0.72)'>" + item.label + "</text>";
      }).join("");
      return "<svg viewBox='0 0 240 240' width='100%' height='240' role='img' aria-label='grafico radar'>" +
        "<circle cx='120' cy='120' r='94' fill='none' stroke='rgba(28,36,33,0.12)' />" +
        "<circle cx='120' cy='120' r='64' fill='none' stroke='rgba(28,36,33,0.1)' />" +
        axes +
        "<polygon points='" + polygon + "' fill='rgba(31,109,99,0.24)' stroke='" + currentTheme().accent + "' stroke-width='2' />" +
      "</svg>";
    }

    function buildBarsChart() {
      return "<div>" + state.attributes.map(function(item){
        return "<div style='margin-bottom:12px'>" +
          "<div class='metricRow'><span>" + item.label + "</span><strong>" + item.value + "</strong></div>" +
          "<div class='progressRail'><span style='width:" + item.value + "%;background:linear-gradient(90deg," + currentTheme().accent + ",#1f6d63)'></span></div>" +
        "</div>";
      }).join("") + "</div>";
    }

    function buildRingsChart() {
      return "<div style='display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px'>" + state.attributes.map(function(item){
        const dash = Math.round((item.value / 100) * 245);
        return "<div style='padding:12px;border-radius:18px;background:rgba(255,255,255,0.58);text-align:center'>" +
          "<svg viewBox='0 0 120 120' width='100%' height='120'>" +
            "<circle cx='60' cy='60' r='39' fill='none' stroke='rgba(28,36,33,0.12)' stroke-width='10'></circle>" +
            "<circle cx='60' cy='60' r='39' fill='none' stroke='" + currentTheme().accent + "' stroke-width='10' stroke-linecap='round' stroke-dasharray='" + dash + " 245' transform='rotate(-90 60 60)'></circle>" +
            "<text x='60' y='65' text-anchor='middle' font-size='20' fill='rgba(28,36,33,0.82)'>" + item.value + "</text>" +
          "</svg>" +
          "<div style='font-size:13px;color:var(--muted)'>" + item.label + "</div>" +
        "</div>";
      }).join("") + "</div>";
    }

    function renderProfile() {
      const student = data.student;
      const theme = currentTheme();
      const avatar = currentAvatar();
      const totalXp = student.xp + completedMaterialsCount() * 18;
      const totalCourses = data.tracks.filter(function(track){ return trackProgress(track.id) >= 80; }).length;
      el.profilePreviewCard.style.background = theme.background;
      el.profilePreviewCard.style.boxShadow = "0 24px 64px rgba(53,36,16,0.12)";
      el.profilePreviewCard.style.color = "var(--ink)";
      el.avatarView.textContent = avatar.glyph;
      el.avatarView.style.background = "linear-gradient(135deg," + avatar.accent + "," + theme.accent + ")";
      el.studentName.textContent = student.name;
      el.studentHandle.textContent = student.handle + " | " + student.stageLabel;
      el.studentRank.textContent = student.communityRank;
      el.studentBio.textContent = student.bio + " Estuda em " + student.school + ", " + student.city + ".";
      el.profileMetrics.innerHTML = [
        "<div class='profileMetric'><strong>" + totalXp + "</strong><span>XP acumulado</span></div>",
        "<div class='profileMetric'><strong>Lv " + student.level + "</strong><span>nivel atual</span></div>",
        "<div class='profileMetric'><strong>" + student.streak + "</strong><span>dias de sequencia</span></div>",
        "<div class='profileMetric'><strong>" + totalCourses + "</strong><span>cursos fortes</span></div>",
        "<div class='profileMetric'><strong>" + completedMaterialsCount() + "</strong><span>materiais concluidos</span></div>",
        "<div class='profileMetric'><strong>" + attributeAverage() + "</strong><span>media de atributos</span></div>"
      ].join("");
      el.chartModeBadge.textContent = data.chartModes.find(function(mode){ return mode.id === state.chartMode; }).label;
      if (state.chartMode === "radar") {
        el.profileChart.innerHTML = buildRadarChart();
      } else if (state.chartMode === "bars") {
        el.profileChart.innerHTML = buildBarsChart();
      } else {
        el.profileChart.innerHTML = buildRingsChart();
      }
    }

    function renderProfileControls() {
      renderFilterButtons(el.chartModeFilters, data.chartModes.map(function(mode){ return mode.id; }), state.chartMode, function(value){
        state.chartMode = value;
        renderProfile();
      });
      el.chartModeFilters.querySelectorAll("[data-filter-value]").forEach(function(node){
        const value = node.getAttribute("data-filter-value");
        const mode = data.chartModes.find(function(item){ return item.id === value; });
        if (mode) {
          node.textContent = mode.label;
        }
      });
      renderFilterButtons(el.themeFilters, data.profileThemes.map(function(theme){ return theme.id; }), state.profileThemeId, function(value){
        state.profileThemeId = value;
        renderProfile();
        renderProfileControls();
      });
      el.themeFilters.querySelectorAll("[data-filter-value]").forEach(function(node){
        const theme = data.profileThemes.find(function(item){ return item.id === node.getAttribute("data-filter-value"); });
        if (theme) {
          node.textContent = theme.label + " | " + theme.preview;
        }
      });
      renderFilterButtons(el.avatarFilters, data.avatars.map(function(avatar){ return avatar.id; }), state.avatarId, function(value){
        state.avatarId = value;
        renderProfile();
        renderProfileControls();
      });
      el.avatarFilters.querySelectorAll("[data-filter-value]").forEach(function(node){
        const avatar = data.avatars.find(function(item){ return item.id === node.getAttribute("data-filter-value"); });
        if (avatar) {
          node.textContent = avatar.label + " | " + avatar.glyph;
        }
      });
      el.attributeSliders.innerHTML = state.attributes.map(function(attribute){
        return "<div class='filterGroup'>" +
          "<div class='metricRow'><h4>" + attribute.label + "</h4><strong>" + attribute.value + "</strong></div>" +
          "<input class='rangeInput' type='range' min='35' max='100' value='" + attribute.value + "' data-attribute-id='" + attribute.id + "' />" +
        "</div>";
      }).join("");
      el.attributeSliders.querySelectorAll("[data-attribute-id]").forEach(function(node){
        node.addEventListener("input", function(){
          const id = node.getAttribute("data-attribute-id");
          const attribute = state.attributes.find(function(item){ return item.id === id; });
          if (!attribute) {
            return;
          }
          attribute.value = Number(node.value);
          renderProfile();
          renderProfileControls();
        });
      });
    }

    function renderAchievements() {
      el.achievementGrid.innerHTML = data.achievements.map(function(item){
        return "<article class='achievementCard" + (item.unlocked ? "" : " locked") + "'>" +
          "<div class='metricRow'><span class='badge'>" + item.rarity + "</span><span class='tag'>" + item.xp + " XP</span></div>" +
          "<h4>" + item.title + "</h4>" +
          "<p>" + item.description + "</p>" +
          "<div class='metaRow'><span class='tag'>" + (item.unlocked ? "desbloqueada" : "quase la") + "</span></div>" +
        "</article>";
      }).join("");
      el.roadmapGrid.innerHTML = data.roadmap.map(function(item){
        return "<article class='roadItem'>" +
          "<div class='metricRow'><strong>" + item.grade + "</strong><a href='" + item.path + "' target='_blank' rel='noreferrer'>abrir referencia</a></div>" +
          "<p>" + item.label + "</p>" +
          "<p><strong>Enfase:</strong> " + item.emphasis + "</p>" +
        "</article>";
      }).join("");
      el.weeklyPlanGrid.innerHTML = data.weeklyPlan.map(function(item){
        return "<article class='miniCard'>" +
          "<div class='metricRow'><strong>" + item.day + "</strong><span class='badge'>" + item.type + "</span></div>" +
          "<p>" + item.title + "</p>" +
          "<p><strong>Duracao:</strong> " + item.duration + "</p>" +
        "</article>";
      }).join("");
    }

    function renderCommunity() {
      el.challengeGrid.innerHTML = data.challenges.map(function(item){
        return "<article class='miniCard'>" +
          "<div class='metricRow'><span class='badge'>" + item.reward + "</span><span class='tag'>" + item.competency + "</span></div>" +
          "<h4>" + item.title + "</h4>" +
          "<p>" + item.brief + "</p>" +
        "</article>";
      }).join("");
      el.eventGrid.innerHTML = data.events.map(function(item){
        return "<article class='eventCard'>" +
          "<div class='metricRow'><span class='badge'>" + item.format + "</span><span class='tag'>" + item.date + "</span></div>" +
          "<h4>" + item.title + "</h4>" +
          "<p>" + item.focus + "</p>" +
        "</article>";
      }).join("");
      renderFilterButtons(el.feedFilters, ["Todos"].concat(Array.from(new Set(state.feed.map(function(item){ return item.tag; })))), state.feedFilter, function(value){
        state.feedFilter = value;
        renderCommunity();
      });
      const visibleFeed = state.feed.filter(function(item){
        return state.feedFilter === "Todos" || item.tag === state.feedFilter;
      });
      el.feedGrid.innerHTML = visibleFeed.map(function(item){
        return "<article class='feedCard'>" +
          "<div class='feedMeta'><div><strong>" + item.author + "</strong><p>" + item.role + " | " + item.competency + "</p></div><span class='badge'>" + item.tag + "</span></div>" +
          "<h4>" + getTrack(item.trackId).title + "</h4>" +
          "<p>" + item.text + "</p>" +
          "<div class='feedActions'><button class='tinyButton' data-like-id='" + item.id + "'>Apoiar " + item.likes + "</button><span class='tag'>" + item.comments + " comentarios</span></div>" +
        "</article>";
      }).join("");
      el.feedGrid.querySelectorAll("[data-like-id]").forEach(function(node){
        node.addEventListener("click", function(){
          const id = node.getAttribute("data-like-id");
          const post = state.feed.find(function(item){ return item.id === id; });
          if (!post) {
            return;
          }
          post.likes += 1;
          renderCommunity();
        });
      });
      el.circleGrid.innerHTML = data.circles.map(function(item){
        return "<article class='circleCard'>" +
          "<div class='metricRow'><span class='badge'>" + item.members + " membros</span><span class='tag'>" + item.nextMeet + "</span></div>" +
          "<h4>" + item.title + "</h4>" +
          "<p>" + item.focus + "</p>" +
        "</article>";
      }).join("");
      el.leaderboardList.innerHTML = data.leaderboard.map(function(item, index){
        return "<div class='leaderRow'><div><strong>" + (index + 1) + ". " + item.name + "</strong><p>" + item.badge + "</p></div><span class='tag'>" + item.xp + " XP</span></div>";
      }).join("");
    }

    function bindStudyButtons() {
      document.querySelectorAll("[data-study-id]").forEach(function(node){
        node.addEventListener("click", function(){
          const id = node.getAttribute("data-study-id");
          const material = state.materials.find(function(item){ return item.id === id; });
          if (!material) {
            return;
          }
          material.progress = Math.min(100, material.progress + 25);
          material.status = material.progress >= 100 ? "Concluido" : "Em andamento";
          renderHomeSpotlight();
          renderCourseGrid();
          renderCourseDetail();
          renderMaterials();
          renderProfile();
        });
      });
    }

    function wireNavigation() {
      document.querySelectorAll("[data-view-target]").forEach(function(node){
        node.addEventListener("click", function(){
          setView(node.getAttribute("data-view-target") || "home");
        });
      });
      document.querySelectorAll("[data-go-view]").forEach(function(node){
        node.addEventListener("click", function(){
          setView(node.getAttribute("data-go-view") || "home");
        });
      });
      el.materialSearch.addEventListener("input", function(){
        state.materialQuery = el.materialSearch.value;
        renderMaterials();
      });
    }

    function renderTodayBadge() {
      const date = new Date(data.generatedAt);
      el.todayBadge.textContent = "gerado em " + date.toLocaleDateString("pt-BR");
    }

    function init() {
      renderHero();
      renderQuickActions();
      renderHomeSpotlight();
      renderCourseGrid();
      renderCourseDetail();
      renderMaterials();
      renderProfile();
      renderProfileControls();
      renderAchievements();
      renderCommunity();
      renderTodayBadge();
      wireNavigation();
    }

    init();
  </script>
</body>
</html>`;
}

export async function generateTestInterface(): Promise<{ htmlPath: string; manifestPath: string; documentsDir: string }> {
  await ensureDataDirs();
  const { manifestPath, documentsDir } = await generateReferenceDocuments(uiDir);
  const htmlPath = path.join(uiDir, FILE_NAME);
  await writeFile(htmlPath, buildHtml(buildReferenceManifest()), "utf8");
  return { htmlPath, manifestPath, documentsDir };
}
