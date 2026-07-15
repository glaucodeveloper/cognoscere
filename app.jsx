const state = {
  route: routeFromHash(),
  competency: "EF69LP01",
  passage: "texto",
  answer: "",
  result: null,
  forumDraft: "",
  forumStatus: "",
};

const user = {
  name: "Lia Martins",
  role: "Estudante",
  segment: "6o ano",
  school: "EMEF Aurora do Saber",
  progress: 68,
};

const competencies = [
  {
    id: "EF69LP01",
    label: "Leitura critica e argumentacao",
    area: "Linguagens",
    focus: "liberdade de expressao e discurso de odio",
    prompt: "Na situacao apresentada, qual fala ainda e opiniao e qual ultrapassa o limite dos direitos? Justifique com uma pista do texto.",
    textBase: "Em uma escola, estudantes organizaram um mural digital para comentar noticias da comunidade. Alguns textos defendiam opinioes diferentes. Outros passaram a atacar pessoas pela origem, religiao e aparencia. A turma precisou criar uma regra para proteger a liberdade de expressao sem permitir mensagens que humilham ou ameacam direitos.",
    expectedTerms: ["direitos", "criterio", "contexto", "respeito", "violencia"],
  },
  {
    id: "EF08HI03",
    label: "Contexto e evidencias historicas",
    area: "Ciencias Humanas",
    focus: "memoria local e interpretacao de fontes",
    prompt: "Que fonte ajuda mais a entender a mudanca na praca? Explique como o contexto muda a interpretacao do fato.",
    textBase: "Uma fotografia antiga mostra a praca central da cidade antes da construcao de uma avenida. Moradores lembram o espaco como lugar de encontro; documentos oficiais descrevem a obra como modernizacao. A turma deve comparar as fontes para entender como interesses e territorio mudam a leitura do fato.",
    expectedTerms: ["contexto", "evidencia", "fonte", "tempo", "territorio"],
  },
  {
    id: "EF05CI04",
    label: "Observacao e explicacao cientifica",
    area: "Ciencias da Natureza",
    focus: "temperatura, registro e causa provavel",
    prompt: "Qual e a causa mais provavel da diferenca de temperatura? Diga que observacao ajudaria a confirmar sua resposta.",
    textBase: "Dois copos com agua foram deixados em locais diferentes: um perto da janela e outro dentro de uma caixa. Depois de algum tempo, a turma percebeu diferencas de temperatura. Para explicar o fenomeno, os estudantes precisam observar o ambiente, registrar variacoes e comparar evidencias.",
    expectedTerms: ["observacao", "causa", "registro", "variacao", "evidencia"],
  },
];

const courseTracks = [
  {
    area: "Linguagens",
    title: "Ler, decidir e justificar em ambientes digitais",
    competency: "EF69LP01",
    object: "Reconhecer limite, criterio e evidencia em uma situacao de fala publica.",
    evidence: "Usa uma pista do texto para justificar uma decisao.",
  },
  {
    area: "Ciencias Humanas",
    title: "Fontes e memoria do territorio",
    competency: "EF08HI03",
    object: "Comparar relatos, documentos e interesses para interpretar um acontecimento.",
    evidence: "Explica por que duas fontes podem contar o mesmo fato de modos diferentes.",
  },
  {
    area: "Ciencias da Natureza",
    title: "Observar, registrar e explicar causas",
    competency: "EF05CI04",
    object: "Usar registros para defender uma causa provavel.",
    evidence: "Liga observacao, variacao e hipotese verificavel.",
  },
];

const socialFeed = [
  {
    title: "Maratona de leitura critica",
    author: "Equipe Lumira",
    meta: "Evento escolar - inscricoes abertas",
    text: "Equipes resolvem missoes de texto-base, defendem escolhas e somam evidencias por competencia.",
    tags: ["Evento", "Linguagens", "Equipes"],
  },
  {
    title: "Desafio de ciencias: pista, registro e causa",
    author: "Clube de Ciencias",
    meta: "Competicao - 4 dias restantes",
    text: "Analise situacoes experimentais curtas e defenda a causa mais provavel com base nas pistas.",
    tags: ["Competicao", "Ciencias", "Nivelamento"],
  },
  {
    title: "Tutoria entre turmas",
    author: "Coordenacao pedagogica",
    meta: "Social - agenda da semana",
    text: "Estudantes em trilhas parecidas compartilham estrategias, conquistas e proximos desafios.",
    tags: ["Tutoria", "Comunidade", "Evidencias"],
  },
];

function routeFromHash() {
  const value = window.location.hash.replace(/^#\/?/, "");
  if (value === "forum") return "social";
  return ["home", "profile", "courses", "leveling", "social", "pilot"].includes(value) ? value : "home";
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderAttributes(props) {
  return Object.entries(props || {})
    .filter(([key, value]) => key !== "children" && value !== false && value !== null && value !== undefined)
    .map(([key, value]) => {
      const attr = key === "className" ? "class" : key === "htmlFor" ? "for" : key;
      if (attr === "style" && typeof value === "object") {
        const style = Object.entries(value)
          .map(([name, styleValue]) => name.replace(/[A-Z]/g, (char) => "-" + char.toLowerCase()) + ":" + styleValue)
          .join(";");
        return " style=\"" + escapeHtml(style) + "\"";
      }
      if (value === true) return " " + attr;
      return " " + attr + "=\"" + escapeHtml(value) + "\"";
    })
    .join("");
}

function renderToHtml(node) {
  if (Array.isArray(node)) return node.map(renderToHtml).join("");
  if (node === null || node === undefined || node === false) return "";
  if (typeof node === "string" || typeof node === "number") return escapeHtml(node);
  if (!node.type) return "";

  const childValue = node.children ?? node.props?.children ?? [];
  const childNodes = Array.isArray(childValue) ? childValue.flat(Infinity) : [childValue];
  if (typeof node.type === "function") return renderToHtml(node.type({ ...node.props, children: childNodes }));

  const children = childNodes.map(renderToHtml).join("");
  return "<" + node.type + renderAttributes(node.props) + ">" + children + "</" + node.type + ">";
}

function createHtmlIterator(renderNode) {
  return {
    next(message = {}) {
      return {
        done: false,
        value: renderNode(message),
      };
    },
  };
}

function viewValue(iterator, message) {
  return iterator.next(message).value;
}

function getCompetency() {
  return competencies.find((item) => item.id === state.competency) || competencies[0];
}

function setRoute(route) {
  state.route = route;
  window.location.hash = route === "home" ? "" : route;
  render();
}

function setPassage(passage) {
  state.passage = passage;
  state.route = "leveling";
  render();
}

function computeResult() {
  const competency = getCompetency();
  const normalized = state.answer.toLowerCase();
  const found = competency.expectedTerms.filter((term) => normalized.includes(term));
  const score = Math.max(35, Math.min(96, 38 + found.length * 12 + Math.min(state.answer.length / 18, 10)));

  state.result = {
    score: Math.round(score),
    level: score >= 82 ? "Dominio consistente" : score >= 66 ? "Em consolidacao" : "Precisa de mediacao",
    evidence: found.length ? found.join(", ") : "poucas evidencias explicitas",
    nextStep: score >= 82 ? "Avancar para uma trilha com resposta argumentativa mais longa." : "Revisar texto-base e responder uma nova pergunta guiada.",
  };
}

function Topbar({ props = {}, children = [] } = {}) {
  return createHtmlIterator(() => {
    const currentState = props.state ?? state;
    const links = props.links ?? [
      ["Home", "home"],
      ["Perfil", "profile"],
      ["Nivelamento", "leveling"],
      ["Social", "social"],
    ];

    return (
      <header className="topbar">
        <button className="brand" type="button" data-route="home">
          <span className="brand-mark">L</span>
          <span>
            <strong>Lumira</strong>
            <small>perfil do aluno e nivelamento BNCC</small>
          </span>
        </button>
        <nav className="nav">
          {links.map(([label, route]) => (
            <button type="button" data-route={route} aria-current={currentState.route === route ? "page" : "false"}>
              {label}
            </button>
          ))}
        </nav>
        <button className="nav-cta" type="button" data-route="profile">Acessar</button>
        {children}
      </header>
    );
  });
}

function HomeView({ children = [] } = {}) {
  return createHtmlIterator(() => (
    <main className="site-page">
      <section className="home-hero">
        <div className="home-copy">
          <p className="eyebrow">Cognoscere / Lumira</p>
          <h1>Conhecimento em movimento</h1>
          <p>Uma plataforma para transformar sondagem, evidencias BNCC e nivelamento em uma jornada clara para cada aluno.</p>
          <div className="actions">
            <button className="primary-action" type="button" data-route="profile">Entrar na plataforma</button>
            <button className="secondary-action" type="button" data-route="leveling">Ver nivelamento</button>
          </div>
          <div className="hero-proof">
            <span><strong>01 Perfil</strong> mapa vivo de competencias</span>
            <span><strong>02 Sondagem</strong> texto-base e questoes avaliadas</span>
            <span><strong>03 Social</strong> eventos para praticar evidencias</span>
          </div>
        </div>
        <aside className="chapter-rail" aria-label="Capitulos da plataforma">
          <button type="button" data-route="profile"><span>Perfil</span></button>
          <button type="button" data-route="leveling"><span>Nivelamento</span></button>
          <button type="button" data-route="social"><span>Social</span></button>
        </aside>
      </section>
      <section className="value-grid">
        <article><span>Perfil</span><h2>Comece pelo perfil</h2><p>Veja competencias ativas, progresso e caminhos liberados pela sondagem.</p></article>
        <article><span>Nivelamento</span><h2>Nivele com contexto</h2><p>Texto-base, pergunta, analise e resultado aparecem no momento certo da atividade.</p><button type="button" data-route="leveling">Comecar nivelamento</button></article>
        <article><span>Social</span><h2>Pratique em comunidade</h2><p>Eventos e competicoes transformam competencias em desafios visiveis.</p><button type="button" data-route="social">Ver atividades</button></article>
      </section>
      {children}
    </main>
  ));
}

function ProfileView({ props = {}, children = [] } = {}) {
  return createHtmlIterator(() => {
    const profile = props.user ?? user;
    const items = props.competencies ?? competencies;

    return (
      <main className="profile-landing">
        <section className="profile-photo"></section>
        <section className="profile-copy">
          <p className="eyebrow">Perfil do aluno</p>
          <h1>{profile.name}</h1>
          <p>{profile.role} - {profile.segment}. Acompanhe as competencias em foco, as trilhas liberadas e o proximo nivelamento.</p>
          <div className="profile-pills">
            <span>{profile.school}</span>
            <span>{profile.progress}% consolidado</span>
            <span>3 competencias ativas</span>
          </div>
          <div className="profile-meter" aria-label={"Perfil consolidado em " + profile.progress + "%"}>
            <span style={{ width: profile.progress + "%" }}></span>
          </div>
          <div className="profile-actions">
            <button className="primary-action" type="button" data-route="leveling">Continuar nivelamento</button>
            <button className="secondary-action" type="button" data-route="courses">Ver trilhas</button>
            <button className="secondary-action" type="button" data-route="social">Eventos</button>
          </div>
        </section>
        <aside className="profile-panel">
          <h2>Competencias em foco</h2>
          {items.map((item) => (
            <button className="competency-row" type="button" data-competency={item.id}>
              <strong>{item.label}</strong>
              <span>{item.area} - {item.id} - nivelar agora</span>
            </button>
          ))}
          <button className="primary-action profile-panel-action" type="button" data-route="courses">Ver trilhas liberadas</button>
        </aside>
        {children}
      </main>
    );
  });
}

function CoursesView({ props = {}, children = [] } = {}) {
  return createHtmlIterator(() => {
    const selectedCompetency = props.selectedCompetency ?? state.competency;
    const items = props.competencies ?? competencies;
    const tracks = props.courseTracks ?? courseTracks;

    return (
      <main className="courses-page">
        <section className="courses-head">
          <div><p className="eyebrow">Trilhas liberadas pelo perfil</p><h1>Escolha uma trilha para praticar</h1><p>Cada trilha mostra a competencia trabalhada, o que sera praticado e qual evidencia deve aparecer na resposta do aluno.</p></div>
          <button className="secondary-action" type="button" data-route="profile">Voltar para o perfil</button>
        </section>
        <section className="area-band">
          {items.map((item) => (
            <button type="button" data-competency={item.id} aria-current={selectedCompetency === item.id ? "true" : "false"}>
              <strong>{item.area}</strong>
              <span>{item.label}</span>
            </button>
          ))}
        </section>
        <section className="course-grid">
          {tracks.map((track) => (
            <article className="course-card">
              <p className="eyebrow">{track.area}</p>
              <h2>{track.title}</h2>
              <dl>
                <div><dt>Competencia</dt><dd>{track.competency}</dd></div>
                <div><dt>Objeto</dt><dd>{track.object}</dd></div>
                <div><dt>Evidencia</dt><dd>{track.evidence}</dd></div>
              </dl>
              <button className="primary-action" type="button" data-competency={track.competency}>Praticar esta competencia</button>
            </article>
          ))}
        </section>
        {children}
      </main>
    );
  });
}

function LevelingView({ props = {}, children = [] } = {}) {
  return createHtmlIterator(() => {
    const competency = props.competency ?? getCompetency();
    const currentPassage = props.passage ?? state.passage;
    const items = props.competencies ?? competencies;
    const passages = props.passages ?? [["texto", "Texto-base"], ["questao", "Questao"], ["analise", "Analise"], ["resultado", "Resultado"]];

    return (
      <main className="leveling-page">
        <section className="leveling-head">
          <div><p className="eyebrow">Atividade de nivelamento</p><h1>{competency.label}</h1><p>{competency.area} - {competency.id} - {competency.focus}</p></div>
          <button className="secondary-action" type="button" data-route="profile">Voltar para o perfil</button>
        </section>
        <section className="competency-strip" aria-label="Competencias disponiveis">
          {items.map((item) => (
            <button type="button" data-competency={item.id} aria-current={competency.id === item.id ? "true" : "false"}><strong>{item.id}</strong><span>{item.label}</span></button>
          ))}
        </section>
        <section className="passage-shell">
          <nav className="passage-tabs" aria-label="Passagens da questao">
            {passages.map(([id, label]) => <button type="button" data-passage={id} aria-current={currentPassage === id ? "step" : "false"}>{label}</button>)}
          </nav>
          {viewValue(PassageContent({ props: { competency, passage: currentPassage, result: props.result ?? state.result, answer: props.answer ?? state.answer } }))}
        </section>
        {children}
      </main>
    );
  });
}

function PassageContent({ props = {}, children = [] } = {}) {
  return createHtmlIterator(() => {
    const competency = props.competency ?? getCompetency();
    const currentPassage = props.passage ?? state.passage;
    const currentAnswer = props.answer ?? state.answer;

    if (currentPassage === "texto") {
      return <article className="passage-card passage-card--reading"><p className="eyebrow">Texto-base</p><h2>Leia o texto-base</h2><p>{competency.textBase}</p><button className="primary-action" type="button" data-passage="questao">Responder pergunta</button>{children}</article>;
    }

    if (currentPassage === "questao") {
      return (
        <article className="passage-card">
          <p className="eyebrow">Pergunta aberta</p>
          <h2>{competency.prompt}</h2>
          <label className="field"><span>Resposta do aluno</span><textarea id="answer-field" rows="8" placeholder="Digite a resposta usando pistas do texto-base...">{currentAnswer}</textarea></label>
          <button className="primary-action" type="button" data-evaluate="true">Gerar avaliacao</button>
          {children}
        </article>
      );
    }

    if (currentPassage === "analise") {
      return (
        <article className="passage-card">
          <p className="eyebrow">Criterios da avaliacao</p>
          <h2>O que observar na resposta</h2>
          <div className="analysis-grid">
            <div><strong>Criterio</strong><span>Resposta precisa explicitar uma regra de diferenciacao.</span></div>
            <div><strong>Evidencia</strong><span>Deve citar elementos do texto-base ou do contexto.</span></div>
            <div><strong>Competencia</strong><span>A leitura deve sustentar decisao e justificativa.</span></div>
          </div>
          <button className="primary-action" type="button" data-passage="questao">Responder pergunta</button>
          {children}
        </article>
      );
    }

    const result = props.result || { score: 0, level: "Aguardando avaliacao", evidence: "sem resposta avaliada", nextStep: "Responda a questao para gerar resultado." };
    return (
      <article className="passage-card passage-card--result">
        <p className="eyebrow">Resultado</p>
        <div className="score">{result.score}<span>pts</span></div>
        <h2>{result.level}</h2>
        <p>Evidencias: {result.evidence}</p>
        <p>{result.nextStep}</p>
        <div className="actions"><button className="primary-action" type="button" data-route="social">Encontrar desafios</button><button className="secondary-action" type="button" data-passage="questao">Ajustar resposta</button></div>
        {children}
      </article>
    );
  });
}

function SocialView({ props = {}, children = [] } = {}) {
  return createHtmlIterator(() => {
    const feed = props.socialFeed ?? socialFeed;
    const draft = props.forumDraft ?? state.forumDraft;
    const status = props.forumStatus ?? state.forumStatus;

    return (
      <main className="forum-page">
        <section className="forum-head"><div><p className="eyebrow">Social Lumira</p><h1>Eventos para praticar competencias</h1><p>Participe de desafios, competicoes e encontros ligados as trilhas do perfil.</p></div><button className="secondary-action" type="button" data-route="profile">Voltar para o perfil</button></section>
        <section className="forum-layout">
          <aside className="composer">
            <div className="forum-summary"><strong>{feed.length}</strong><span>atividades abertas agora</span></div>
            <label className="field"><span>Nova atividade</span><textarea id="forum-draft" rows="5" placeholder="Descreva um evento, desafio ou competicao...">{draft}</textarea></label>
            <button className="primary-action" type="button" data-forum-post="true">Criar atividade</button>
            {status ? <p className="status">{status}</p> : null}
          </aside>
          <section className="feed">
            {feed.map((thread) => (
              <article className="thread">
                <header><div><h2>{thread.title}</h2><span>{thread.author} - {thread.meta}</span></div></header>
                <p>{thread.text}</p>
                <div className="tags">{thread.tags.map((tag) => <span>{tag}</span>)}</div>
                <footer><button type="button" data-forum-action="like">Participar</button><button type="button" data-forum-action="reply">Comentar</button><button type="button" data-forum-action="save">Salvar</button></footer>
              </article>
            ))}
          </section>
        </section>
        {children}
      </main>
    );
  });
}

function PilotView({ children = [] } = {}) {
  return createHtmlIterator(() => <main className="site-page"><section className="plain-card"><p className="eyebrow">Plano piloto</p><h1>Comece uma rotina de sondagem</h1><p>Escolha uma area BNCC, acompanhe um grupo de estudantes e gere evidencias de progresso.</p><button className="primary-action" type="button" data-route="profile">Voltar para o perfil</button></section>{children}</main>);
}

function MainView({ props = {}, children = [] } = {}) {
  return createHtmlIterator(() => {
    const currentState = props.state ?? state;
    const viewProps = {
      state: currentState,
      user,
      competencies,
      courseTracks,
      socialFeed,
      selectedCompetency: currentState.competency,
      competency: getCompetency(),
      passage: currentState.passage,
      answer: currentState.answer,
      result: currentState.result,
      forumDraft: currentState.forumDraft,
      forumStatus: currentState.forumStatus,
    };

    if (currentState.route === "profile") return viewValue(ProfileView({ props: viewProps, children }));
    if (currentState.route === "courses") return viewValue(CoursesView({ props: viewProps, children }));
    if (currentState.route === "leveling") return viewValue(LevelingView({ props: viewProps, children }));
    if (currentState.route === "social") return viewValue(SocialView({ props: viewProps, children }));
    if (currentState.route === "pilot") return viewValue(PilotView({ props: viewProps, children }));
    return viewValue(HomeView({ props: viewProps, children }));
  });
}

function render() {
  document.getElementById("app").innerHTML = renderToHtml([
    viewValue(Topbar({ props: { state } })),
    viewValue(MainView({ props: { state } })),
  ]);
}

function installHandlers() {
  document.addEventListener("click", (event) => {
    const routeTarget = event.target.closest("[data-route]");
    if (routeTarget) {
      setRoute(routeTarget.getAttribute("data-route"));
      return;
    }

    const competencyTarget = event.target.closest("[data-competency]");
    if (competencyTarget) {
      state.competency = competencyTarget.getAttribute("data-competency");
      state.route = "leveling";
      state.passage = "texto";
      window.location.hash = "leveling";
      render();
      return;
    }

    const passageTarget = event.target.closest("[data-passage]");
    if (passageTarget) {
      setPassage(passageTarget.getAttribute("data-passage"));
      return;
    }

    if (event.target.closest("[data-evaluate]")) {
      const field = document.getElementById("answer-field");
      state.answer = field ? field.value : state.answer;
      computeResult();
      setPassage("resultado");
      return;
    }

    if (event.target.closest("[data-forum-post]")) {
      const field = document.getElementById("forum-draft");
      state.forumDraft = field ? field.value.trim() : "";
      state.forumStatus = state.forumDraft ? "Atividade pronta para revisao." : "Descreva a atividade antes de continuar.";
      render();
      return;
    }

    if (event.target.closest("[data-forum-action]")) {
      state.forumStatus = "Interacao registrada.";
      render();
    }
  });

  document.addEventListener("input", (event) => {
    if (event.target.id === "answer-field") state.answer = event.target.value;
    if (event.target.id === "forum-draft") state.forumDraft = event.target.value;
  });

  window.addEventListener("hashchange", () => {
    state.route = routeFromHash();
    render();
  });
}

render();
installHandlers();
