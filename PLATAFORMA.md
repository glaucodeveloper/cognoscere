# Lumira — definição da plataforma

O Cognoscere passa a ter a Lumira como sua camada web social e educacional. O motor e os dados pedagógicos já existentes (BNCC, habilidades e quizzes) continuam sendo a fonte rastreável; a interface não os substitui.

## Domínios independentes

| Domínio | Mostrado ao usuário | Origem | Não afeta |
| --- | --- | --- | --- |
| Progressão por competência | nível, barra e estimativa percentual | quizzes e evidências, com regra S5 | reputação e placar |
| Reputação social | reputação no perfil e por comunidade | votos ponderados em posts e comentários | competências |
| Competição | leaderboard da competição | rubricas e critérios definidos pelo professor | nível de competência diretamente |

Os níveis pedagógicos são: Iniciação, Apropriação, Consolidação, Proficiência e Domínio. A regra S5 avança depois de 5 acertos, oferece itens bônus até o primeiro erro, recupera após 0 acertos com itens mais simples e não pune ausência.

## Pessoas e permissões

- Estudante: matrícula, nivelamento, cursos, quiz, fórum, perfil, amizades, competições e entregas.
- Professor aprovado: tópicos pedagógicos, desafios, entregas, rubricas, times, avaliação, moderação e relatórios BNCC autorizados.
- Administração escolar: professores, turmas, visibilidade de competições, comunidades e relatórios institucionais.
- Administração da plataforma: domínio BNCC, escolas, planos, moderação e auditoria.

## Estrutura do produto

- Entrada pública: hero, explicação da progressão, áreas, cursos, competições, posts, perfis, planos e CTA de matrícula.
- Matrícula: cadastro → série/idade → preferências/acessibilidade/consentimentos → personalização → nivelamento → parecer → perfil.
- Área autenticada: navegação global horizontal no desktop e inferior no mobile; topbar contextual com busca/criação/notificações/perfil; chat social em sidebar flutuante recolhível.
- Cursos: catálogo → curso → ciclos → eixos → material integrado → atividade aberta → evidência → progressão. Cada eixo é uma página contínua de texto, caso, lacuna, validação/refutação e continuação.
- Conhecimento de curso: o frontend resolve um manifesto OKF público e carrega artefatos versionados de curso, habilidade, material, atividade e proveniência. Falhas de comunicação devem ser visíveis e recuperáveis; não há fallback silencioso para conteúdo hardcoded.
- Fórum: comunidade → tópico → post → comentário → voto; comunidades gerais, de área, competência, curso, escola, turma, competição e grupo.
- Perfil público: visão geral, competências, portfólio, posts, comentários, amigos, escola e conquistas; permite avatar, banner, tema, destaque e módulos sem HTML/CSS/JS arbitrário.
- Conta privada: Perfil, Conta, Segurança, Privacidade, Notificações, Assinatura e Métodos de pagamento.
- Escola: feed, professores, turmas, áreas, competições, entregas e rankings.
- Competição: subfórum com post principal, atualizações, entregas, comentários, avaliação e leaderboard. Aceita formatos de projeto, debate, produção textual, investigação e prototipação.

## MVP e contratos

O MVP inclui autenticação, matrícula, nivelamento, perfil, progressão, fórum, votos, reputação, social, áreas, cursos, escola, competições, entregas, deadlines, leaderboards e CMS BNCC.

Assinatura e pagamento são uma camada operacional simulada: planos, trial, alteração, cancelamento, reativação, método e status visual. Nunca armazenar cartão integral; integrar futuramente via adapter de provedor PCI e `provider_token`.

Serviços previstos: autenticação, matrícula, competências, social, escola e assinatura. Os modelos centrais são `User`, `CompetenceState`, `SocialPost`, `Competition`, `DeliveryItem`, `Subscription` e `PaymentMethod`, conforme o escopo Lumira v6.1.

## OKF e inteligência de prompts

O script Ruby histórico [inicio.rb](inicio.rb) é a principal evidência versionada da antiga composição de prompts sobre a base OKF local. A base original não entrou no Git e não está recuperável neste clone; por isso, o bundle atual é uma reconstrução rastreável a partir do script, das habilidades Markdown, dos artefatos JSON e do motor TypeScript do commit `40e135d`.

`npm run export:okf-prompts` lê programaticamente o Ruby sem inicializar o framework, extrai os templates-fonte e instruções reais de geração de texto-base, geração de perguntas, auditoria/reescrita, reparo de JSON e administração RLM, carrega as cinco compreensões de `habilidades/ef69lp01.md` e grava o registro técnico em `okf/` com hashes SHA-256. Portanto, o Ruby legado é a fonte canônica dos templates técnicos; a SPA não usa cópias manuais desses prompts.

O bundle adota o Open Knowledge Format v0.1 como superfície interoperável: conceitos em Markdown com frontmatter YAML, índices para divulgação progressiva, links entre conceitos e log de alterações. Uma projeção JSON pública permite consumo eficiente pela SPA.

A inteligência separa operações e responsabilidades:

1. recuperar fontes e contexto curricular;
2. compor compreensão semântica antes das instruções;
3. gerar módulo, texto-base ou perguntas em etapas distintas;
4. validar schema, extensão, alinhamento, segurança e proveniência;
5. analisar respostas por evidências, sem transformar recomendação de IA em decisão final;
6. confirmar ou corrigir a análise com mediação humana;
7. produzir relatório de auditoria e reescrita da própria configuração.

A projeção pública nunca contém compreensão interna detalhada, resposta de referência, rubrica privada, prompt administrativo, dados identificáveis de estudantes ou credenciais. Geração e análise reais não executam no GitHub Pages; exigem CLI/CI controlado ou API autenticada.

## Segurança, responsividade e rastreabilidade

Aplicar rate limit e prevenção de brigading em votos, proteção a menores, moderação, logs de professor, trilha de alterações de deadline e auditoria de leaderboard. Dados BNCC devem permanecer rastreáveis até o material, quiz e evidência que os consome.

O layout responde em três modos: campus horizontal full-width com social flutuante no desktop; navegação adaptada e social em drawer no tablet; navegação inferior, abas horizontais e formulários de coluna única no mobile.
