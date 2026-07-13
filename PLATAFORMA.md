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
- Área autenticada: topbar com busca/criação/notificações/perfil; sidebar com Início, Áreas, Cursos, Quizzes, Fórum, Competições, Escola e Perfil; barra social à direita no desktop e drawer/bottom sheet no mobile.
- Cursos: curso → ciclos → eixos → material integrado → quiz → evidência → progressão. Cada eixo é uma página contínua de texto, caso, lacuna, validação/refutação e continuação.
- Fórum: comunidade → tópico → post → comentário → voto; comunidades gerais, de área, competência, curso, escola, turma, competição e grupo.
- Perfil público: visão geral, competências, portfólio, posts, comentários, amigos, escola e conquistas; permite avatar, banner, tema, destaque e módulos sem HTML/CSS/JS arbitrário.
- Conta privada: Perfil, Conta, Segurança, Privacidade, Notificações, Assinatura e Métodos de pagamento.
- Escola: feed, professores, turmas, áreas, competições, entregas e rankings.
- Competição: subfórum com post principal, atualizações, entregas, comentários, avaliação e leaderboard. Aceita formatos de projeto, debate, produção textual, investigação e prototipação.

## MVP e contratos

O MVP inclui autenticação, matrícula, nivelamento, perfil, progressão, fórum, votos, reputação, social, áreas, cursos, escola, competições, entregas, deadlines, leaderboards e CMS BNCC.

Assinatura e pagamento são uma camada operacional simulada: planos, trial, alteração, cancelamento, reativação, método e status visual. Nunca armazenar cartão integral; integrar futuramente via adapter de provedor PCI e `provider_token`.

Serviços previstos: autenticação, matrícula, competências, social, escola e assinatura. Os modelos centrais são `User`, `CompetenceState`, `SocialPost`, `Competition`, `DeliveryItem`, `Subscription` e `PaymentMethod`, conforme o escopo Lumira v6.1.

## Segurança, responsividade e rastreabilidade

Aplicar rate limit e prevenção de brigading em votos, proteção a menores, moderação, logs de professor, trilha de alterações de deadline e auditoria de leaderboard. Dados BNCC devem permanecer rastreáveis até o material, quiz e evidência que os consome.

O layout responde em três modos: três colunas no desktop; sidebar recolhível e social em drawer no tablet; navegação inferior, abas horizontais e formulários de coluna única no mobile.
