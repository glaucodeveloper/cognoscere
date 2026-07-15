# Metodologia global — contextualização e sondagem lúdica

Este arquivo fica no alto da hierarquia do bundle e se aplica a **todos os OKFs**, de todas as áreas, componentes, etapas e disciplinas.

A metodologia lúdica, a compatibilidade com a idade e a forma narrativa do texto-base são padrões globais de contextualização e sondagem. Elas **não pertencem a uma habilidade específica** e, por isso, não devem ser duplicadas dentro dos arquivos `*.okf.md` ou `*.okf.json`.

## Escopo

- Aplica-se a todos os OKFs em `okfs_md/` e `okfs_json/`.
- Deve ser lida antes do OKF específico.
- O OKF específico define a semântica da habilidade: verbo, objeto, conectores, finalidade, termos nucleares, compromissos e avaliação semântica.
- Este arquivo define a metodologia geral de geração de contexto, texto-base, resposta e avaliação.

## Adjetivo central

**Lúdico** é o adjetivo central de toda geração de contexto, resposta e avaliação de sondagem.

Lúdico não significa infantilizar. Significa transformar a habilidade em uma experiência viva de resolução, investigação, jogo, missão, dilema, conversa, descoberta, simulação ou teatro de papéis.

## Contrato global do texto-base

O texto-base da atividade deve ter **uma lauda de conteúdo**, usando como referência aproximadamente **550 a 750 palavras** quando for apresentado como texto-base completo.

Na Educação Infantil e nos anos iniciais, essa lauda pode funcionar como roteiro narrativo mediado pelo professor, com falas curtas, ações concretas e observações orientadas, mantendo a completude da cena.

Todo texto-base deve conter, como **arquitetura interna de composição**:

1. **Introdução de cenário**: situa espaço, tempo, motivo do desafio, personagens, clima lúdico e problema inicial.
2. **Conteúdo central**: desenvolve ação, conflito, dados, falas, pistas, escolhas, materiais e operação semântica exigida pela habilidade.
3. **Fechamento**: retoma o problema inicial e abre a sondagem por missão, pergunta, decisão, conselho, continuidade, comparação, criação ou justificativa.

Essas três partes orientam o gerador, mas não precisam ser impressas como subtítulos para o estudante. Na atividade final, a narrativa deve aparecer como texto fluido em parágrafos, sem rótulos formais de introdução, conteúdo central e fechamento, salvo pedido explícito.

## Desenvolvimento frasal e densidade de lauda

A lauda não deve ser preenchida por acúmulo de muitas frases curtas, fragmentadas ou repetitivas. O volume do texto-base deve nascer do desenvolvimento interno da cena e da operação semântica da habilidade.

Para gerar uma lauda de conteúdo, o LLM deve preferir **frases mais desenvolvidas**, com progressão interna clara, em vez de aumentar artificialmente o número de frases. Uma frase desenvolvida pode reunir ação, circunstância, motivo, consequência, pista textual, reação de personagem e relação com o problema da sondagem, desde que continue compreensível para a idade/série da habilidade.

Regra central: cada frase relevante deve carregar mais de uma função narrativa ou semântica. Ela pode, por exemplo:

- situar ação e ambiente;
- mostrar intenção ou dúvida de um personagem;
- apresentar uma pista que será útil para a resposta;
- ligar causa e consequência;
- contrastar duas possibilidades;
- introduzir uma informação e já mostrar por que ela importa;
- transformar um dado da habilidade em acontecimento de cena.

Evitar:

- sequência de frases muito curtas usadas apenas para atingir tamanho;
- repetição do mesmo dado com palavras diferentes;
- enumeração seca de acontecimentos sem consequência;
- explicação moral ou conceitual sem encenação;
- parágrafos formados por frases soltas que não desenvolvem tensão, pista, escolha ou operação semântica.

Preferir:

- parágrafos com progressão interna;
- frases com conectores causais, temporais, comparativos e concessivos adequados à idade;
- apostos e complementos que aprofundem personagem, cena e pista;
- falas que revelem personalidade e função semântica;
- descrições que preparem a pergunta final sem entregar a resposta.

Compatibilidade etária continua obrigatória. Frase desenvolvida não significa frase obscura, excessivamente acadêmica ou longa demais para a etapa. Para crianças menores, o desenvolvimento pode aparecer pela combinação de ação concreta, repetição significativa e fala mediada. Para adolescentes, pode aparecer por tensão social, consequência, justificativa, contraste e nuance. Para o Ensino Médio, pode aparecer por relações conceituais mais densas, desde que ainda situadas em cena.

O texto-base deve cumprir a lauda por **densidade narrativa e semântica**, não por inflar a quantidade de sentenças.

## Narrativa e personagens

A atividade deve apresentar-se como narrativa, não como enunciado seco.

Quando houver personagens:

- devem ter nome próprio;
- devem ter personalidade reconhecível;
- a personalidade deve influenciar fala, hipótese, erro, pista, decisão, dúvida ou atitude;
- o personagem não deve ser decoração: ele deve carregar uma função semântica na atividade.

Exemplos de função semântica de personagem:

- personagem curioso levanta hipótese;
- personagem apressado comete erro plausível;
- personagem cuidadoso pede evidência;
- personagem brincalhão transforma problema em jogo;
- personagem tímido revela pista;
- personagem crítico exige razão, prova ou limite.


## Parâmetro global obrigatório: `respondent_age`

Além da série, etapa ou bloco indicado pela habilidade, todo gerador que usa este bundle deve receber o parâmetro de execução `respondent_age`, com a idade real do respondente/aluno em anos completos.

Esse parâmetro é global porque vale para todas as disciplinas e não pertence a um OKF individual. A habilidade define a operação semântica que será sondada; `respondent_age` calibra o nível de palavras, o tamanho e a arquitetura das frases, a concretude dos exemplos, a quantidade de abstração, a proximidade cultural da cena, a complexidade da pergunta e a interpretação da resposta.

Quando idade real e série/bloco indicarem expectativas diferentes, o gerador não deve trocar a habilidade. Ele deve manter o alvo curricular do OKF e ajustar a linguagem pela idade do respondente, registrando a tensão quando necessário.


## Estabelecimento textual da cena e discorrimento dos fatos

O texto-base não deve soar como um relato resumido que apenas informa que havia um grupo, um tema e um conflito. A escrita precisa **estabelecer o texto** para o leitor antes de exigir interpretação, diminuindo lacunas mentais e dando fatores suficientes de apresentação para que a cena exista de modo concreto.

A introdução de cenário, como função interna de composição, deve apresentar fatores de estabelecimento antes de acelerar o conflito:

- onde a situação acontece, com marca concreta de espaço, ambiente, suporte ou material;
- quando acontece ou em que momento da rotina, projeto, jogo, investigação, aula, reunião, missão ou conversa;
- quem participa, com nomes, traços de personalidade e relação com a cena;
- por que aquelas pessoas estão ali e qual é o objetivo comum ou problema compartilhado;
- o que já aconteceu antes da fala principal, da dúvida ou da tensão;
- o que cada personagem quer, teme, supõe, defende ou tenta resolver;
- quais objetos, registros, pistas, mensagens, mapas, tabelas, cartas, imagens, regras ou acontecimentos tornam a situação observável;
- por que o conflito importa dentro da atividade lúdica e dentro da operação semântica da habilidade.

A qualidade do texto-base deve ser medida também pelo **discorrimento de fatos**. Discorrer fatos não é listar acontecimentos. É fazer os fatos avançarem com encadeamento, causalidade, consequência e relevância semântica. Cada acontecimento importante precisa preparar outro acontecimento, revelar uma intenção, criar uma pista, alterar o clima da cena ou aproximar o estudante da operação exigida pela habilidade.

Evitar aberturas genéricas como:

- “o grupo estava agitado naquela tarde” sem mostrar o que produziu a agitação;
- “o tema gerava paixões” sem apresentar o motivo concreto da disputa;
- “a discussão esquentou” sem desenvolver quais falas, ações ou pistas mudaram o rumo da conversa;
- “um personagem percebeu que passou do limite” sem evidenciar o limite por acontecimentos e marcas textuais;
- resumo expositivo que comprime cenário, personagem e conflito em poucas afirmações abstratas.

Preferir abertura estabelecida, na qual o leitor compreende progressivamente:

- a situação concreta que colocou os personagens em contato;
- o objeto visível da discussão ou da missão;
- a primeira ação que inicia o problema;
- a reação específica de outro personagem;
- a pista que torna a habilidade necessária;
- a consequência que faz a pergunta final nascer naturalmente.

Frases desenvolvidas devem carregar discorrimento de fatos. Uma frase pode ser mais longa quando combina ação, circunstância, motivo e consequência, mas ela não deve apenas alongar uma ideia abstrata. O desenvolvimento frasal precisa acrescentar chão narrativo, relação causal, pista ou tensão interpretativa.

## Estrutura interna sem rótulos visíveis

O texto-base continua tendo, como arquitetura interna obrigatória, **introdução de cenário**, **conteúdo central** e **fechamento**. Porém, esses nomes são funções de composição para o gerador, não subtítulos obrigatórios para o estudante.

Na atividade impressa para o aluno/respondente, o texto-base deve aparecer como texto contínuo, com parágrafos bem organizados, sem os subtítulos formais “Introdução de cenário”, “Conteúdo central” e “Fechamento”, salvo quando o usuário pedir explicitamente esses rótulos.

O gerador deve planejar internamente as três partes, mas imprimir apenas a narrativa, preservando a progressão natural entre apresentação, desenvolvimento e encerramento. A pergunta de sondagem deve vir depois do texto, também sem explicar ao aluno a arquitetura interna usada para gerar a narrativa.


## Contrato global da pergunta de sondagem: hipótese local conectada ao texto-base

A pergunta de sondagem não deve ser apenas uma pergunta conceitual direta, nem apenas pedir que o estudante repita a diferença entre dois termos já explicados no texto. Ela deve criar uma **hipótese local nova**, nascida do fechamento da narrativa, que só possa ser respondida por conexão com as pistas e relações construídas no texto-base.

Hipótese local nova significa uma pequena situação de decisão, continuação, variação, escolha, conselho, intervenção, teste, comparação, troca de elemento, consequência imaginada ou problema prático que ainda não foi resolvido literalmente pelo texto. A pergunta deve fazer o estudante usar o texto-base como ferramenta para decidir esse novo caso.

A pergunta deve operar assim:

1. retomar uma tensão, pista, regra, objeto, fala, dado, imagem, caminho ou conflito já construído no texto-base;
2. propor uma variação local ainda não respondida literalmente;
3. exigir que o estudante conecte essa variação aos fatos do texto-base;
4. pedir uma decisão, hipótese, explicação, conselho, escolha, classificação, justificativa ou previsão;
5. permitir que a resposta revele o critério de compreensão sem exigir a palavra “critério”.

A pergunta deve evitar:

- “Qual é a diferença entre X e Y?” como forma principal, quando isso apenas repete a habilidade;
- “Explique o conceito de X” sem situação nova;
- “De acordo com o texto, o que é...” quando a resposta pode ser copiada;
- pergunta que já entregue o caminho pelo próprio enunciado;
- pergunta sem consequência local, sem decisão e sem transferência;
- pergunta que só peça opinião pessoal sem conexão obrigatória com pistas do texto-base.

A pergunta deve preferir:

- “Se [novo fato local] acontecesse na cena, como o personagem deveria decidir? Use pistas do texto.”
- “Qual escolha mudaria o sentido da situação e por quê?”
- “Que pista do texto ajuda a resolver esse novo caso?”
- “Como você continuaria a missão mantendo a regra descoberta pelos personagens?”
- “Entre duas ações possíveis, qual preserva melhor a relação construída no texto-base?”
- “O que aconteceria se um elemento da cena fosse trocado, e que parte do texto justifica sua hipótese?”

A criatividade da pergunta deve vir dessa transferência local. Ela não precisa ser extravagante, mas precisa fazer a habilidade funcionar em um pequeno problema novo. O estudante deve sentir que está resolvendo um caso, não respondendo uma definição escolar.

### Exemplo de transformação de pergunta pouco criativa

Pergunta fraca:

> Considerando que os hiperlinks não são apenas referências, mas elementos ativos que moldam a leitura, qual é a diferença fundamental entre um link que apenas complementa a informação de uma notícia e um link que transforma a maneira como essa notícia é entendida?

Problema: a pergunta é correta, mas genérica. Ela pede a diferença diretamente e não cria uma hipótese local nova. O estudante pode responder por definição, sem voltar de fato ao percurso de Lia e Gabriel.

Pergunta melhor:

> No mapa que Gabriel começou a desenhar, Lia quer marcar com um símbolo especial apenas os links que mudam o caminho de leitura da notícia. Se ela encontra um link chamado “Leia também: moradores contestam os dados oficiais”, mas outro link apenas abre a ficha técnica da lei citada, qual dos dois deveria receber o símbolo especial? Explique sua escolha usando o que aconteceu quando os personagens perceberam que alguns links mudavam o ponto de vista da reportagem.

Melhora: a pergunta cria uma hipótese local dentro da missão, exige decisão, conecta com a ação dos personagens, reaproveita a diferença sem pedir a definição nua e permite avaliar se o estudante compreendeu a função do link na construção do sentido.

### Regra final

O fechamento do texto-base deve preparar uma abertura de ação para a pergunta. A pergunta deve entrar nessa abertura como continuação lúdica da cena: uma nova pista para investigar, uma decisão a tomar, uma peça a organizar, uma regra a aplicar, uma hipótese a testar ou um conselho a dar a um personagem.

## Compatibilidade com idade, série e bloco

O vocabulário, o tamanho das frases, a quantidade de termos abstratos, a densidade informacional e o grau de inferência devem acompanhar a idade, a série ou o bloco da habilidade.

Regras gerais:

- usar palavras alcançáveis para a faixa etária antes de nomear conceitos difíceis;
- quando o conceito for abstrato, primeiro mostrar a situação e depois nomear o conceito;
- manter riqueza narrativa sem excesso lexical incompatível com a idade;
- para adolescentes, permitir conflito, nuance, tomada de posição e linguagem social reconhecível;
- para crianças menores, reduzir abstração verbal e aumentar ação, imagem, fala curta, repetição significativa e mediação.

Perfis por etapa:

- **Educação Infantil**: linguagem oral mediada, frases curtas, ação corporal, imaginação, nomeação concreta, repetição e observação de gestos.
- **Ensino Fundamental — anos iniciais**: linguagem simples, narrativa concreta, personagens claros, pistas explícitas e desafio resolvível com apoio do texto/cena.
- **Ensino Fundamental — anos finais**: linguagem adolescente acessível, conflito narrativo, investigação, comparação, justificativa, pistas explícitas e inferenciais controladas.
- **Ensino Médio**: linguagem mais abstrata e argumentativa, sem perder cena; exigir relação entre conceitos, dados, fontes, critérios e posicionamento.

## Avaliação lúdica e abstração de critério

A avaliação feita pelo LLM deve abstrair conceitos como **critério** da resposta do aluno a partir da informação apresentada. O avaliador não deve exigir que o aluno escreva literalmente “critério”, “evidência”, “justificativa” ou “inferência”.

Um critério pode aparecer como:

- razão apresentada;
- pista usada;
- regra aplicada;
- comparação feita;
- prova ou evidência selecionada;
- limite percebido;
- diferença reconhecida;
- relação entre informação e conclusão;
- procedimento usado para decidir;
- exemplo que mostra a operação semântica.

A avaliação deve ser lúdica, investigativa e formativa. O erro deve ser tratado como pista de compreensão. O avaliador precisa separar:

1. falha da resposta do estudante;
2. falha da pergunta;
3. falha do texto-base;
4. falha do OKF ou da leitura semântica da habilidade.

## Relação com os OKFs individuais

Os OKFs individuais continuam responsáveis pela semântica da habilidade: verbo dominante, objeto nuclear, conectores, finalidade, termos nucleares, compromissos e modelo de avaliação.

Esta metodologia global apenas define o modo padrão de contextualizar, narrativizar, ajustar à idade e avaliar ludicamente qualquer habilidade.

## Contrato global de compreensão de habilidades BNCC

As regras comuns de leitura de habilidade, antes repetidas em cada `bncc_context_comprehension`, foram realocadas para `methodology/global_skill_comprehension_contract_v1.md`.

O OKF individual agora deve explicar a habilidade específica: a construção textual feita pela BNCC, a operação verbal, o objeto de trabalho, a analogia de uso e a âncora teórica da área. O contrato global guarda a orientação comum de que a compreensão parte do enunciado, opera verbo + objeto + conectores, e avalia resposta pela transformação do objeto segundo a ação verbal exigida.
