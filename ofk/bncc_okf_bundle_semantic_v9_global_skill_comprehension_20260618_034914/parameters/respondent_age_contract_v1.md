# Parâmetro global — respondent_age

Este bundle espera um parâmetro de execução chamado `respondent_age`, representando a idade real do respondente/aluno em anos completos.

Esse parâmetro fica no alto da hierarquia metodológica porque não pertence a uma habilidade isolada. Ele é parte do contrato global de contextualização e sondagem para todas as disciplinas.

## Regra central

A habilidade define o alvo curricular e a operação semântica. A idade do respondente calibra o modo de linguagem usado para apresentar a atividade e interpretar a resposta.

Assim, a geração deve combinar:

1. `respondent_age`: nível de palavras, extensão frasal, concretude, familiaridade lexical, quantidade de abstração e tipo de conflito narrativo;
2. metodologia global: ludicidade, narrativa, lauda, personagens, desenvolvimento frasal e avaliação formativa;
3. OKF individual: verbo, objeto, conectores, compromissos semânticos e modelo de avaliação da habilidade.

## Expectativa de entrada

Todo gerador que use o bundle deve aceitar o parâmetro:

```text
respondent_age: integer
```

Faixa operacional recomendada:

```text
3..99
```

Para uso escolar regular, a idade esperada normalmente se concentra entre 4 e 18 anos, mas o parâmetro continua explícito para permitir sondagens, defasagem idade-série, EJA ou simulações de perfil.

## Prioridade de ajuste

Quando `respondent_age` e série/bloco sugerirem níveis diferentes:

- a habilidade e o OKF continuam definindo **o que** será avaliado;
- `respondent_age` define **como** a linguagem será ajustada;
- a série/bloco define a referência curricular esperada;
- o gerador deve registrar qualquer tensão entre idade e bloco, sem trocar a habilidade.

## Ajustes por idade

- `3–5`: linguagem oral mediada, palavras concretas, frases curtas, ação corporal, imagem, repetição significativa e resposta por gesto/fala simples.
- `6–8`: palavras familiares, frases curtas a médias, situação concreta, personagens claros, pistas explícitas e pergunta simples.
- `9–10`: vocabulário simples com alguns termos escolares contextualizados, frases médias, comparação concreta e justificativa curta.
- `11–12`: linguagem acessível de pré-adolescente, frases médias desenvolvidas, termos abstratos explicados pela cena, conflito claro e pistas orientadoras.
- `13–14`: linguagem adolescente acessível, frases desenvolvidas mas legíveis, investigação, comparação, tomada de posição, pistas explícitas e inferências controladas.
- `15–17`: linguagem mais abstrata e argumentativa, nuance, relações conceituais, dados, critérios e posicionamento, mantendo cena lúdica.
- `18+`: linguagem pode ser mais densa, mas deve permanecer didática, situada, lúdica e alinhada ao nível curricular da habilidade.

## Efeito na geração

O parâmetro deve ajustar:

- escolha de palavras;
- tamanho e arquitetura das frases;
- nível de abstração;
- quantidade de termos técnicos;
- modo de explicar termos difíceis;
- tipo de personagem e conflito;
- proximidade cultural da cena;
- complexidade da pergunta;
- expectativa de resposta.

## Efeito na avaliação

A avaliação deve considerar a idade do respondente ao interpretar vocabulário simples, informalidade, resposta curta, exemplos concretos ou formulações incompletas.

O avaliador não deve confundir linguagem pouco adulta com falta de compreensão quando a resposta demonstrar a operação semântica da habilidade por pista, comparação, limite percebido, regra aplicada, exemplo, relação entre informação e conclusão ou justificativa compatível com a idade.

A pontuação continua dependente da compreensão da habilidade; a idade ajusta a leitura do modo de expressão.
