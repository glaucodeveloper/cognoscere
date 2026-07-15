# Contrato global de compreensão de habilidades BNCC — v1

Este contrato fica no alto da hierarquia do bundle e se aplica a todos os OKFs. Ele reúne instruções comuns que antes eram repetidas dentro de `bncc_context_comprehension` e de outras seções dos módulos individuais.

## Escopo de aplicação

Aplica-se às seções:

- `bncc_context_comprehension`
- `text_base_comprehension`
- `text_base_internal_analysis_comprehension`
- `question_topic_comprehension`
- `rewrite_report_comprehension`
- `response_assessment_model`

O OKF individual deve guardar a leitura específica da habilidade. A metodologia global deve guardar as regras comuns de leitura, geração e avaliação.

## Princípio de leitura da habilidade

Toda compreensão de habilidade parte da construção textual do enunciado da BNCC: verbo, objeto, conectores, condições, meios, finalidade, termos nucleares e ações decorrentes. Esse princípio não precisa ser repetido dentro de cada OKF.

A habilidade não deve ser tratada como assunto nominal. Ela deve ser tratada como ação semântica observável sobre um objeto: reconhecer, distinguir, relacionar, analisar, produzir, justificar, resolver, intervir, selecionar, medir, comparar, criar, classificar ou outra operação indicada pelo verbo.

## Regra comum de avaliação

Um avaliador ou LLM não deve aceitar como compreensão plena uma resposta que fale de tema próximo, conteúdo decorado ou opinião lateral sem operar diretamente sobre o objeto da habilidade. A compreensão se torna avaliável quando o estudante transforma esse objeto segundo a ação verbal exigida: reconhecer, distinguir, relacionar, analisar, produzir, justificar, resolver ou intervir, conforme o caso.

A avaliação deve verificar a cadeia:

1. dado ou pista da situação-base;
2. operação verbal executada;
3. relação, critério, procedimento ou forma usada;
4. conclusão, produto, decisão ou intervenção construída;
5. limite de extrapolação preservado.

## Função de `bncc_context_comprehension`

`bncc_context_comprehension` não deve repetir este contrato. Ela deve explicar a habilidade específica: como a BNCC constrói aquela aprendizagem em texto, quais operações verbais ela aciona, qual objeto é trabalhado, que teoria da área ajuda a compreender a habilidade e que analogias de uso tornam a ação mais inteligível para geração e avaliação.

## Função das demais seções

- `text_base_comprehension`: transforma a habilidade em situação-base avaliável.
- `text_base_internal_analysis_comprehension`: orienta o mapeamento entre texto-base, pergunta e resposta.
- `question_topic_comprehension`: orienta perguntas por hipótese local conectada ao texto-base.
- `rewrite_report_comprehension`: orienta reescrita do próprio OKF quando texto, pergunta ou avaliação não acionam a habilidade.
- `response_assessment_model`: guarda dimensões e níveis de avaliação semântica.
