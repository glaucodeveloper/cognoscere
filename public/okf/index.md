---
type: "catalog"
title: "Cognoscere — Open Knowledge Format"
description: "Índice canônico da arquitetura pedagógica, inteligência de prompts, contratos e integração dos cursos do Cognoscere."
tags: ["okf", "cognoscere", "bncc", "prompts", "cursos", "governanca"]
okf_version: "0.1"
timestamp: "2026-07-13T00:00:00-03:00"
language: "pt-BR"
status: "documented"
---

# Cognoscere — Open Knowledge Format

Este é o ponto de entrada reservado do bundle Open Knowledge Format (OKF) v0.1 reconstruído do Cognoscere. Havia uma base OKF legada na pasta local do projeto, mas ela não foi versionada e seu conteúdo original não está recuperável no estado atual, reflog ou objetos Git acessíveis. Este bundle padroniza de forma verificável os conceitos preservados semanticamente em `inicio.rb`, nas habilidades e no pipeline histórico do commit `40e135d`.

O bundle descreve, em formato auditável, como fontes curriculares, compreensões pedagógicas, templates de prompt, artefatos gerados, avaliação humana e páginas de curso se relacionam. Ele é uma reconstrução documentada, não uma alegação de reprodução literal da base local indisponível.

O OKF não é um registro de cadeia de pensamento. Ele documenta entradas, ordem de contexto, regras, schemas, evidências, validações, decisões humanas e limitações operacionais. Raciocínio interno não é solicitado, armazenado nem publicado.

## Identidade do bundle

| Campo | Valor |
| --- | --- |
| Formato documental Open Knowledge Format | `0.1` |
| Contrato da projeção JSON pública | `1.0.0` |
| Idioma | `pt-BR` |
| Domínio | Educação por competências alinhada à BNCC |
| Produto consumidor | Plataforma web Cognoscere/Lumira |
| Modo público atual | Bundle estático, somente leitura, publicado com o GitHub Pages |
| Fonte pedagógica principal | BNCC e configurações de habilidade versionadas no repositório |
| Revisão obrigatória | Humana, antes de promover conteúdo gerado para material curricular aprovado |

As duas versões são independentes. `okf_version: "0.1"` governa os conceitos Markdown, o `index.md`, o `log.md` e seus frontmatters. `manifest.json.publicContractVersion: "1.0.0"` é o SemVer do contrato JSON público consumido pela SPA; ele não substitui nem representa uma atualização do formato documental OKF v0.1.

## Mapa de conhecimento

- [Arquitetura do bundle](./architecture.md): camadas, componentes, fluxo de leitura e fronteiras operacionais.
- [Proveniência e rastreabilidade](./provenance.md): fontes atuais e históricas, cadeia de referências e níveis de confiança.
- [Motor de prompts](./prompt-engine.md): composição, ordem de contexto, estágios e invariantes globais.
- [Geração de módulos](./prompt-module-generation.md): contrato histórico para cursos e módulos de produção.
- [Geração de texto-base](./prompt-text-base.md): abstrações narrativas, texto-base e compreensão-base.
- [Geração de perguntas](./prompt-question-generation.md): perguntas diagnósticas abertas, rubricas e evidências.
- [Análise de resposta](./prompt-response-analysis.md): coleta, decisão humana, agregação e progressão do perfil.
- [Auditoria e reescrita](./prompt-audit-rewrite.md): diagnóstico do sistema e melhoria das compreensões.
- [Reparo de JSON](./prompt-json-repair.md): recuperação controlada de saídas malformadas.
- [Contratos público e privado](./contracts.md): o que pode circular no bundle e o que exige ambiente protegido.
- [Segurança e governança](./security-governance.md): proteção de estudantes, aprovação, versionamento e incidentes.
- [Taxonomia de progressão](./progression-taxonomy.md): níveis públicos, taxonomias históricas e regras de mapeamento.
- [Integração com cursos](./course-integration.md): projeção do OKF em curso, eixo, material, quiz e evidência.
- [Registro do bundle](./log.md): mudanças documentais, sempre datadas.

## Fontes canônicas do repositório

O bundle foi derivado exclusivamente de elementos presentes no Cognoscere:

- [`inicio.rb`](https://github.com/glaucodeveloper/cognoscere/blob/main/inicio.rb): pipeline atual de texto-base, perguntas, coleta humana, progressão, auditoria e reparo.
- [`habilidades/ef69lp01.md`](https://github.com/glaucodeveloper/cognoscere/blob/main/habilidades/ef69lp01.md): configuração pedagógica curada da habilidade EF69LP01.
- [`habilidades/geradas/ef69lp01.md`](https://github.com/glaucodeveloper/cognoscere/blob/main/habilidades/geradas/ef69lp01.md): configuração genérica produzida pelo indexador.
- [`scripts/bncc_pdf_index.rb`](https://github.com/glaucodeveloper/cognoscere/blob/main/scripts/bncc_pdf_index.rb): extração e indexação das habilidades da BNCC.
- [`data/bncc_linguagens_lingua_portuguesa.json`](https://github.com/glaucodeveloper/cognoscere/blob/main/data/bncc_linguagens_lingua_portuguesa.json): índice de Língua Portuguesa.
- [`data/quiz_6ano_ef69lp01_separated_textbase.json`](https://github.com/glaucodeveloper/cognoscere/blob/main/data/quiz_6ano_ef69lp01_separated_textbase.json): artefato demonstrativo de texto-base e compreensão-base.
- [`PLATAFORMA.md`](https://github.com/glaucodeveloper/cognoscere/blob/main/PLATAFORMA.md): definição vigente dos domínios e fluxos do produto.
- Commit histórico [`40e135d`](https://github.com/glaucodeveloper/cognoscere/tree/40e135d2179d557cf14f8696defd3cc3340f9e24): pipeline TypeScript de retrieval, módulos, sessões e documentos por competência.

## Princípios operacionais

1. **Fonte antes da geração.** Todo conteúdo curricular deve apontar para uma habilidade ou trecho de referência identificável.
2. **Compreensão antes da instrução.** O significado pedagógico é fornecido antes das regras de formato e saída.
3. **Artefatos separados.** Texto-base, perguntas, resultados, auditoria e perfil não são fundidos em um único documento opaco.
4. **Humano no circuito.** Evidência de domínio, publicação curricular e atualização de perfil exigem decisão humana rastreável.
5. **Progressões independentes.** Competência, reputação social e placar de competição não se alteram mutuamente.
6. **Saída validável.** Estágios estruturados possuem schema, invariantes e política explícita de reparo.
7. **Privacidade por padrão.** Respostas de estudantes e perfis identificáveis não pertencem ao bundle público.
8. **Sem autoridade artificial.** A IA organiza e propõe; fonte normativa, professor e contexto local permanecem superiores.

## Estado de implementação

Esta coleção é a documentação oficial do contrato OKF v0.1. O frontend publicado é estático; por isso, documentos públicos podem ser lidos pela interface, mas geração com modelo, análise de respostas reais e escrita persistente dependem de execução local ou serviço autenticado. Consulte [Contratos](./contracts.md) e [Integração com cursos](./course-integration.md).
