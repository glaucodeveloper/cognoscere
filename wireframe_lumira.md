# Wireframe Lumira

## Visao geral

Estrutura com duas camadas:

1. Publica
2. Plataforma autenticada

A pagina principal e institucional/marketing. O acesso leva para a plataforma interna.

---

## 1. Landing principal

### Objetivo

Apresentar a proposta da Lumira para redes, escolas e professores, com CTA claro para entrar na plataforma.

### Estrutura

- Topbar fixa
  - Logo Lumira
  - Links de ancora: Plataforma, IA pedagogica, Comunidade
  - Acoes: `Acessar` e `Entrar na plataforma`

- Hero de primeira dobra
  - Imagem realista grande ocupando metade da tela
  - Bloco textual com:
    - eyebrow institucional
    - H1: `Lumira`
    - texto de valor
    - CTA primario para acesso
    - CTA secundario para entender o funcionamento
    - chips com competencias de destaque

- Secao "Proposta institucional"
  - grade com 3 blocos:
    - Perfil do aluno
    - Areas e cursos derivados do perfil
    - IA pedagogica

- Secao "Fluxo de IA"
  - coluna 1:
    - sondagem de matricula
    - geracao de texto-base e questoes
    - avaliacao das respostas
  - coluna 2:
    - areas BNCC ativas como vitrine do produto

- Secao "Cursos sugeridos"
  - lista/cartoes de trilhas por competencia

- Secao "Social"
  - feed principal de eventos, desafios e competicoes

- CTA final
  - reforco para entrar na plataforma
  - opcao de abrir a demo interna

---

## 2. Tela de acesso

### Objetivo

Ser a entrada para a plataforma.

### Estrutura

- Card central
  - eyebrow: acesso a plataforma
  - titulo: `Entrar na Lumira`
  - texto curto explicando o escopo

- Formulario
  - campo email institucional
  - campo senha
  - botao `Entrar`

- Links auxiliares
  - voltar para a landing
  - abrir demo da plataforma

---

## 3. Plataforma interna

### Navegacao principal

- Desktop
  - topbar com marca, busca, atalho para social e perfil
  - sidebar com:
    - Perfil
    - Nivelamento
    - Social

- Mobile
  - bottom nav com 4 abas:
    - Perfil
    - Nivelamento
    - Social

### Regra estrutural

O perfil do aluno e a tela central. Areas/cursos de nivelamento e IA derivam das escolhas feitas em matricula, cadastro e sondagem. Areas/cursos nao ficam como navegacao principal solta: sao acessados a partir do proprio perfil do aluno.

---

## 4. Perfil

### Objetivo

Mostrar quem e o aluno, quais competencias foram priorizadas e quais acessos o sistema liberou.

### Estrutura

- Cabecalho da pagina
  - titulo com nome da pessoa
  - CTA para `Sondagem e nivelamento`

- Coluna principal
  - card com dados gerais do perfil
    - papel
    - segmento
    - progresso
    - chips de nivel, streak e XP

  - card "Competencias escolhidas"
    - lista de competencias
    - prioridade
    - motivo pedagogico
    - barra de cobertura atual

  - card "Cadastro e sondagem"
    - rede
    - escola
    - localidade
    - status da sondagem
    - interesses e etapas atendidas

- Coluna lateral
  - resumo do papel do perfil
  - card "Acessos gerados pelo perfil"
    - areas/cursos liberados para nivelamento
    - social de eventos e competicoes
  - card "Funcoes com IA"
    - matricula e sondagem
    - questionarios de nivelamento

---

## 5. Areas e cursos de nivelamento

### Objetivo

Exibir, a partir do perfil do aluno, as areas BNCC e cursos ativados pelas competencias priorizadas.

### Estrutura

- Cabecalho
  - titulo da pagina
  - botao de volta ao perfil

- Toolbar
  - filtro por area com Carbon dropdown
  - botao limpar filtro

- Grid de areas
  - titulo
  - foco pedagogico
  - descricao
  - competencias relacionadas
  - CTA `Nivelar competencia`

- Painel de detalhe da area selecionada
  - descricao ampliada
  - cobertura
  - total de habilidades
  - total de cursos
  - foco pedagogico

---

## 6. Cursos

### Objetivo

Mostrar trilhas praticas sugeridas a partir das competencias do perfil do aluno, dentro da pagina acessada pelo perfil.

### Estrutura

- Cabecalho
  - titulo da pagina
  - botao de volta ao perfil

- Painel principal do curso selecionado
  - area
  - nome do curso
  - descricao
  - chips de competencias
  - barra de progresso
  - lista de segmentos
    - competencia
    - objeto
    - evidencia
    - habilidade BNCC
    - dificuldade

- Painel lateral
  - resumo estrutural da trilha

- Secao inferior
  - comparacao rapida com todos os cursos disponiveis para o perfil

---

## 7. Social

### Objetivo

Ser a superficie social da plataforma para eventos, competicoes, desafios e encontros da comunidade.

### Estrutura

- Cabecalho
  - titulo da pagina
  - botao de volta ao perfil

- Feed principal no inicio da pagina
  - lista de eventos e competicoes
  - cada item mostra:
    - autor
    - organizador
    - area
    - titulo
    - resumo
    - tipo de atividade
    - competencias relacionadas
    - participantes
    - comentarios
    - ultima atividade

- Painel de detalhe do topico
  - titulo do evento/competicao
  - resumo
  - chips
  - cards de interacao
  - resumo do papel social no produto

---

## 8. IA pedagogica

### Objetivo

Executar somente os fluxos de:

- sondagem da matricula
- questionarios de nivelamento de competencias

### Estrutura

- Cabecalho
  - titulo da pagina
  - botao de volta ao perfil

- Coluna principal
  - configuracao:
    - API key
    - modelo
    - habilidade BNCC
    - tema
    - observacao geral
    - quantidade de perguntas
  - botoes:
    - gerar texto-base
    - gerar quiz
    - avaliar respostas
  - respostas do usuario por pergunta

- Coluna lateral
  - contexto ativo do OFK
  - estado da inferencia
  - leitura operacional

- Secoes inferiores
  - payload do texto-base
  - payload do quiz
  - relatorio textual
  - payload estruturado da avaliacao

### Regra funcional

A IA nao e uma area generica da plataforma. Ela funciona como ferramenta operacional dentro da sondagem e do nivelamento.

---

## 9. Componentes visuais recorrentes

- Topbars
- Sidebar
- Bottom nav mobile
- Cards com borda leve
- Chips de competencias
- Barras de progresso
- Listas de conteudo
- Grid de cards
- Dropdown Carbon para filtro

---

## 10. Fluxo resumido de navegacao

1. Usuario abre a landing
2. Usuario vai para acesso
3. Usuario entra na plataforma
4. Perfil centraliza cadastro, sondagem e competencias
5. A partir do perfil o usuario abre:
   - Areas
   - Cursos
   - Social
   - IA de sondagem/nivelamento
