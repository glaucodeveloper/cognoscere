# Proposta Lumira + Base Cognoscere

## Tese da plataforma

A Lumira e uma plataforma BNCC para estudantes, professores e redes que transforma a base Cognoscere/OKF em uma experiencia de perfil do aluno, sondagem, nivelamento por competencias, areas/cursos derivados do perfil e social de eventos/competicoes.

O centro do produto nao e um dashboard generico. O centro e o perfil do aluno: ele registra cadastro, escolhas de competencias, resultados de sondagem, acessos liberados, areas/cursos de nivelamento e proximos passos pedagogicos.

## Papel da base Cognoscere

A base Cognoscere entra como a camada curricular e semantica da plataforma. Ela contem o bundle OKF BNCC com habilidades estruturadas por etapa, area, componente e codigo, alem de metodologia global de geracao e avaliacao.

O bundle atual organiza:

- 1580 OKFs BNCC.
- Educacao Infantil, Ensino Fundamental e Ensino Medio.
- Areas como Linguagens, Matematica, Ciencias da Natureza, Ciencias Humanas e Ensino Religioso.
- OKFs individuais com verbo, objeto nuclear, conectores, termos semanticos, compromissos intrinsecos e rubrica especifica da habilidade.
- Metodologia global separada dos OKFs individuais.

Na Lumira, Cognoscere nao aparece como “banco de arquivos”. Ele aparece como motor de alinhamento pedagogico: seleciona habilidade, contextualiza a sondagem, orienta geracao de texto-base, gera perguntas abertas, avalia respostas e atualiza evidencias do perfil.

## Regra de IA

A IA nao e uma area generica da plataforma. Ela opera somente em fluxos pedagogicos especificos:

- sondagem de matricula;
- questionarios de nivelamento de competencias;
- geracao de texto-base;
- geracao de perguntas abertas;
- avaliacao de respostas;
- relatorio de evidencias e recomendacoes.

Social, perfil, areas/cursos, navegacao institucional, acesso e apresentacao da plataforma nao dependem de IA. Essas partes sao produto, comunidade e organizacao.

## Fluxo de inferencia herdado do script Ruby

O fluxo do `main.rb` deve ser refletido no frontend JavaScript com Gemini no cliente:

1. Escolher habilidade BNCC/OKF e tema da sondagem.
2. Carregar metodologia global do OKF.
3. Carregar o OKF individual da habilidade.
4. Receber parametros do respondente, principalmente idade real.
5. Gerar texto-base com compreensao-base dedicada.
6. Gerar perguntas abertas usando exclusivamente o texto-base fixado.
7. Coletar respostas do estudante.
8. Avaliar resposta por evidencias e compromissos semanticos, nao por gabarito rigido.
9. Separar falha do estudante, falha da pergunta, falha do texto-base e falha do OKF.
10. Atualizar perfil, evidencias e recomendacoes.

## Metodologia pedagogica do OKF

A metodologia global define que toda sondagem deve ser ludica sem infantilizar. Isso significa transformar a habilidade em experiencia viva: investigacao, dilema, missao, conversa, simulacao, decisao ou jogo de papeis.

O texto-base deve:

- ter cena concreta;
- apresentar espaco, tempo, participantes, objetivo e conflito;
- construir pistas observaveis;
- desenvolver fatos com causalidade e consequencia;
- usar linguagem compativel com idade e etapa;
- manter a habilidade como alvo curricular;
- preparar a pergunta sem entregar a resposta.

A pergunta deve:

- nascer do fechamento do texto-base;
- criar uma hipotese local nova;
- exigir conexao com pistas do texto;
- pedir decisao, justificativa, previsao, conselho, classificacao ou explicacao;
- evitar pergunta puramente definicional.

A avaliacao deve:

- identificar criterio mesmo quando o estudante nao usa a palavra “criterio”;
- observar pistas, razoes, provas, limites, comparacoes e justificativas;
- tratar erro como pista de compreensao;
- produzir mediacao pedagogica.

## Partes da plataforma

### Landing institucional

Apresenta a proposta da Lumira para redes, escolas e professores. Explica que a plataforma usa a base Cognoscere para alinhar sondagens e nivelamento a habilidades BNCC. A chamada principal leva para acesso ou demo.

### Acesso

Entrada simples para a plataforma. Pode receber email institucional e senha, ou abrir demo.

### Perfil do aluno

Tela central da plataforma. Mostra o aluno, segmento, escola, competencias priorizadas, progresso, evidencias e acessos liberados.

Do perfil o usuario acessa:

- nivelamento;
- areas/cursos de nivelamento de competencias;
- social de eventos e competicoes;
- historico de sondagem;
- evidencias e recomendacoes.

Areas/cursos nao devem aparecer como navegacao principal solta. Sao uma pagina acessada a partir do proprio perfil do aluno, pois dependem das competencias escolhidas e das evidencias geradas pela sondagem.

### Nivelamento de competencias

Interface principal da IA. A passagem deve existir apenas aqui:

- texto-base;
- questao;
- analise;
- resultado.

Cada competencia usa Cognoscere/OKF para orientar texto, pergunta, avaliacao e relatorio.

### Social

Pagina destinada a eventos, competicoes, desafios e encontros da comunidade. A primeira parte da pagina deve ser um feed central, para que o usuario veja imediatamente atividades abertas, competicoes por competencia, eventos escolares e interacoes sociais.

A IA nao atua como area principal do social.

### Areas e cursos

Areas e cursos fazem parte do fluxo de nivelamento do perfil do aluno. Eles nao substituem o perfil e nao devem ser tratados como paginas independentes da navegacao principal.

Areas organizam conhecimento por area BNCC e foco pedagogico.

Cursos agrupam trilhas praticas por competencia, objeto, evidencia e habilidade.

A pagina de areas/cursos deve permitir voltar ao perfil e entrar diretamente no nivelamento da competencia escolhida.

## Dados essenciais no produto

O produto deve operar sobre:

- perfil do usuario;
- escola/rede/segmento;
- competencias escolhidas;
- habilidades BNCC/OKF;
- metodologia global do bundle;
- idade real do respondente;
- tema da sondagem;
- texto-base gerado;
- perguntas geradas;
- respostas coletadas;
- rubricas e evidencias;
- relatorio de progresso;
- historico de eventos, competicoes e interacoes sociais.

## Proposta de valor

Para professores, a Lumira reduz o trabalho de transformar habilidades BNCC em sondagens avaliaveis, com texto-base, pergunta e criterio de observacao.

Para coordenadores e redes, a Lumira cria rastreabilidade entre competencia, evidencia, perfil e proxima acao pedagogica.

Para estudantes, a experiencia tende a ser menos abstrata: em vez de responder definicoes, o estudante resolve situacoes contextualizadas e mostra criterio por meio de justificativas.

## Implicacao para o frontend atual

O frontend deve evoluir do prototipo visual para uma plataforma guiada por dados:

- carregar amostras reais do OKF;
- permitir escolha de habilidade BNCC;
- exibir metodologia ativa;
- acionar Gemini para gerar texto-base;
- acionar Gemini para gerar perguntas;
- coletar e avaliar respostas;
- registrar resultado no perfil;
- manter o social como feed inicial de eventos e competicoes, independente da IA;
- manter areas/cursos como pagina acessada pelo perfil do aluno, direcionando para nivelamento de competencias.
