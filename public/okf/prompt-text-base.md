---
type: "prompt-spec"
title: "Prompt de geração de texto-base"
description: "Contrato para gerar abstrações narrativas, texto-base e compreensão-base dedicados a uma habilidade."
tags: ["okf", "prompt", "texto-base", "compreensao", "bncc"]
timestamp: "2026-07-13T00:00:00-03:00"
stage: "text-base-generation"
status: "current-contract"
---

# Prompt de geração de texto-base

## Responsabilidade

Gerar somente o texto-base de uma sondagem e sua compreensão-base dedicada. O estágio prepara evidências e pistas para perguntas posteriores, mas não gera perguntas, gabarito ou avaliação.

O contrato vigente está em [`inicio.rb`](https://github.com/glaucodeveloper/cognoscere/blob/main/inicio.rb), alimentado pelas compreensões de [`habilidades/ef69lp01.md`](https://github.com/glaucodeveloper/cognoscere/blob/main/habilidades/ef69lp01.md).

## Entradas

| Entrada | Origem | Uso |
| --- | --- | --- |
| tema da sondagem | operador | situa a atividade |
| observação humana inicial | operador autorizado | informa necessidade pedagógica sem determinar resposta |
| recorte BNCC | `recorte_bncc` | identidade normativa |
| perfil pedagógico necessário | configuração/runtime | adequação à série e necessidades |
| compreensão de contexto BNCC | habilidade Markdown | interpretação pedagógica do recorte |
| compreensão de texto-base | habilidade Markdown | função da situação-problema |
| compreensão de análise interna | habilidade Markdown | pistas, erros e evidências a mapear |
| instruções de geração | código versionado | schema, extensão e invariantes |

Dados identificáveis não são necessários para gerar um texto-base. Em produção, o perfil deve ser minimizado para etapa, necessidades e acessibilidade relevantes.

## Ordem do contexto

1. papel de inferência textual comum;
2. tarefa restrita ao texto-base e à compreensão-base;
3. proibição de administrar o quiz ou gerar perguntas;
4. tema e observação humana inicial;
5. recorte BNCC;
6. perfil pedagógico;
7. compreensão do contexto BNCC;
8. compreensão de geração do texto-base;
9. compreensão de análise interna;
10. schema e regras de saída.

## Schema de saída

### Identificação

- `bncc_codigo`
- `disciplina`
- `etapa`
- `serie`
- `campo`
- `tema`

Esses campos devem permanecer coerentes com o recorte fornecido.

### `abstracoes_narrativas`

| Campo | Função |
| --- | --- |
| `situacao_concreta` | cenário social plausível |
| `antecedentes[]` | fatos anteriores necessários |
| `participantes[]` | nome funcional, papel, interesse e modo de falar |
| `fatos_em_ordem[]` | sequência causal |
| `tensao_central` | conflito cognitivo |
| `tese_de_abertura` | ponto de partida argumentativo |
| `problema_argumentativo` | questão em disputa |
| `pistas_textuais_planejadas[]` | marcas que permitirão justificar respostas |
| `falas_planejadas[]` | fala ligada a personagem e intenção |
| `retomada_da_tese_no_fechamento` | fechamento coerente |
| `consequencia_pedagogica` | operação esperada do estudante |

### `texto_base`

- `genero`;
- `titulo`;
- `estrutura.inicio`;
- `estrutura.conteudo_central.paragrafos[]`;
- `estrutura.conteudo_central.falas[]` com `personagem` e `fala`;
- `estrutura.fechamento`;
- `conteudo` em texto corrido.

### `compreensao_base`

- `situacao_comunicativa`;
- `finalidade_do_texto`;
- `estrutura_narrativa` com funções de início, conteúdo central, falas e fechamento;
- `trecho_opiniao_legitima`;
- `trecho_discurso_de_odio`;
- `pistas_textuais[]`;
- `limite_interpretativo`;
- `erro_provavel_do_aluno`;
- `operacoes_para_avaliar[]`;
- `evidencias_de_dominio[]`.

Os dois campos de trecho são específicos da demonstração EF69LP01. Para outras habilidades, um schema futuro deve generalizar esses nomes sem apagar o tipo de contraste pedagógico necessário.

## Invariantes de conteúdo

- O texto deve tornar a habilidade necessária, e não usá-la como decoração.
- O texto-base deve equivaler a uma lauda, com referência de 550 a 750 palavras.
- Não aceitar sinopse, cena apressada ou falas soltas.
- As abstrações devem preceder conceitualmente a redação final.
- Participantes precisam de interesses próprios e falas naturais.
- O início abre tese, problema ou ponto de vista; o fechamento o retoma.
- Parágrafos narrativos e falas permanecem separados na estrutura.
- `conteudo` reúne o material como texto natural, não como lista técnica.
- A situação deve ser plausível para a série e evitar violência explícita pesada.
- As pistas precisam sustentar perguntas e justificativas futuras.
- Para EF69LP01, preservar a diferença entre crítica legítima e ataque discriminatório.
- Não gerar perguntas nem gabarito.

## Outputs

O runtime atual grava um JSON de texto-base antes de prosseguir. O exemplo disponível é [`data/quiz_6ano_ef69lp01_separated_textbase.json`](https://github.com/glaucodeveloper/cognoscere/blob/main/data/quiz_6ano_ef69lp01_separated_textbase.json). Ele é demonstração de texto-base, não quiz completo.

## Validação

O código atual verifica a existência de `texto_base`, `compreensao_base` e um objeto `abstracoes_narrativas`. O contrato OKF recomenda validação adicional:

- identidade BNCC invariável;
- extensão compatível;
- início, conteúdo central e fechamento presentes;
- falas referenciadas na compreensão-base;
- pistas concretas localizáveis no conteúdo;
- adequação etária e proteção contra conteúdo danoso;
- revisão humana antes de uso com estudante.

## Limites e humano no circuito

O modelo pode criar uma situação plausível, mas não conhece o contexto real da turma. Professor ou designer curricular deve revisar naturalidade, segurança, vieses, adequação cultural e suficiência das pistas. O texto não deve descrever pessoa real sem autorização.

Depois de aprovado, o artefato alimenta [Geração de perguntas](./prompt-question-generation.md) e a [página de curso](./course-integration.md).
