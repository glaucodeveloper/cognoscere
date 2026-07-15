# bncc_okf_bundle_semantic_v9_global_skill_comprehension_20260618_034914

Bundle OKF BNCC v9. Esta versão realoca instruções comuns de compreensão/avaliação para metodologia global e mantém os OKFs individuais mais limpos e específicos.

Arquivos novos principais:

- `methodology/global_skill_comprehension_contract_v1.md`
- `methodology/global_skill_comprehension_contract_v1.json`

Mudanças centrais:

- `bncc_context_comprehension` deixa de repetir guard phrases globais.
- A regra comum de avaliação de compreensão plena foi movida para a metodologia global.
- Cada habilidade passa a explicar sua própria construção BNCC com operação verbal, objeto, analogia de uso e âncora teórica da área.

---

# bncc_okf_bundle_semantic_v7_global_text_establishment_20260617_184645

Bundle OKF BNCC com separação entre:

1. **OKF individual da habilidade**: semântica intrínseca da habilidade, construída pela linguagem do enunciado.
2. **Metodologia global do bundle**: contextualização lúdica, texto-base narrativo, compatibilidade com idade/série/bloco, desenvolvimento frasal, estabelecimento textual da cena, discorrimento de fatos e avaliação formativa.
3. **Parâmetros globais de execução**: dados externos à habilidade que calibram a geração, especialmente `respondent_age`.

## Regra principal

A metodologia lúdica e o ajuste por idade são padrões de todas as disciplinas e ficam no alto da hierarquia do bundle.

Arquivos globais:

- `METHODOLOGY.md`
- `PARAMETERS.md`
- `methodology/global_contextualizacao_sondagem_ludica_v1.md`
- `methodology/global_contextualizacao_sondagem_ludica_v1.json`
- `parameters/respondent_age_contract_v1.md`
- `parameters/respondent_age_contract_v1.json`
- `index/methodology.json`
- `index/runtime_parameters.json`

Eles **não são duplicados dentro de cada OKF**.

## Parâmetro obrigatório: `respondent_age`

Todo gerador que use o bundle deve aceitar:

```text
respondent_age: integer
```

A habilidade define o alvo curricular e a operação semântica. `respondent_age` calibra o nível de palavras, o tamanho das frases, a concretude da cena, a quantidade de abstração e a interpretação da resposta.

Quando idade e série/bloco divergirem, a habilidade não deve ser trocada. O gerador mantém o OKF e ajusta linguagem/forma da sondagem pela idade real do respondente.

## Como usar

1. Ler `METHODOLOGY.md`.
2. Ler `PARAMETERS.md`, especialmente `respondent_age`.
3. Carregar o OKF específico, por exemplo `okfs_md/ensino-fundamental/linguagens/lingua-portuguesa/EF69LP01.okf.md`.
4. Gerar a atividade combinando:
   - `respondent_age`: nível de palavras, frase, concretude e abstração;
   - metodologia global: lúdico, narrativa, uma lauda, personagens e desenvolvimento frasal;
   - OKF individual: verbo, objeto, conectores, compromissos e avaliação semântica.
5. Avaliar a resposta combinando:
   - `respondent_age`: leitura do modo de expressão do aluno;
   - metodologia global: avaliação lúdica, formativa e abstrativa de critério;
   - OKF individual: `response_assessment_model` e `semantic_model.intrinsic_commitments`.



## Revisão v7 — estabelecimento textual e discorrimento de fatos

A metodologia global agora exige que o texto-base **estabeleça a cena** antes de acelerar o conflito. A abertura deve apresentar fatores concretos de espaço, momento, participantes, objetivo comum, antecedentes, intenções, objetos/pistas observáveis e razão pela qual a situação importa para a habilidade.

A qualidade da escrita passa a considerar a métrica de **discorrimento de fatos**: acontecimentos devem avançar com causalidade, consequência, tensão e função semântica, evitando tom de relato resumido, conflito anunciado sem construção e lacunas que obriguem o leitor a completar mentalmente o contexto essencial.

A arquitetura interna continua sendo introdução de cenário, conteúdo central e fechamento, mas esses rótulos não devem aparecer na atividade final. O estudante recebe um texto contínuo, em parágrafos, seguido da pergunta de sondagem.

## Estrutura

- `METHODOLOGY.md`: alias de leitura rápida da metodologia global.
- `PARAMETERS.md`: alias de leitura rápida dos parâmetros globais.
- `methodology/`: metodologia global em Markdown e JSON.
- `parameters/`: contratos de parâmetros de execução.
- `okfs_md/`: OKFs individuais em Markdown.
- `okfs_json/`: OKFs individuais em JSON.
- `index/`: índices por código, componente, metodologia e parâmetros.
- `samples/`: amostras para inspeção rápida.
- `schema/`: schema dos OKFs individuais limpos.

## Contagens

- Total de OKFs: 1580
- Educação Infantil: 93
- Ensino Fundamental: 1304
- Ensino Médio: 183

## Revisões

- v4: metodologia lúdica movida para o alto da hierarquia do bundle.
- v5: contrato global de desenvolvimento frasal e densidade de lauda.
- v6: contrato global `respondent_age` para calibrar nível de palavras pela idade real do respondente.
- v7: contrato global de estabelecimento textual da cena, discorrimento de fatos e impressão do texto-base sem rótulos formais de introdução/conteúdo/fechamento.


## Atualização v8 — pergunta por hipótese local conectada ao texto-base

A metodologia global agora define que a pergunta de sondagem deve criar uma **hipótese local nova**. A pergunta não deve apenas pedir uma definição ou uma diferença conceitual direta; ela deve propor uma pequena decisão, variação, continuação, troca de elemento, comparação ou caso novo que só possa ser respondido conectando pistas do texto-base.

Aplicação prática: o fechamento da narrativa prepara uma abertura de ação, e a pergunta entra nessa abertura como missão, teste, conselho, escolha, marcação, previsão ou intervenção. A criatividade da pergunta é medida pela transferência local da habilidade, não por enfeite verbal.
