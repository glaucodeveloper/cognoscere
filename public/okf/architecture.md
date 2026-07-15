---
type: "architecture"
title: "Arquitetura OKF do Cognoscere"
description: "Camadas, componentes, fluxos e limites do bundle de conhecimento pedagógico."
tags: ["okf", "arquitetura", "pipeline", "github-pages"]
timestamp: "2026-07-13T00:00:00-03:00"
---

# Arquitetura OKF do Cognoscere

## Objetivo

O OKF oferece uma camada de conhecimento versionada entre as fontes do repositório, o motor de prompts e as páginas do curso. Ele evita que a interface dependa de textos hard-coded sem origem e permite que stakeholders inspecionem como um material se conecta à BNCC, a um template de geração, a uma rubrica e a uma decisão humana.

Esta arquitetura não transforma o GitHub Pages em backend. O site publicado consome conteúdo público estático. Operações que envolvem modelo, dados pessoais ou escrita permanecem fora do navegador público.

## Camadas

| Camada | Responsabilidade | Exemplos no repositório | Exposição |
| --- | --- | --- | --- |
| Fonte | Preservar texto normativo e metadados de origem | PDF BNCC, índices `data/bncc_*.json` | Pública quando licenciada e não sensível |
| Configuração pedagógica | Traduzir uma habilidade em compreensões operacionais | `habilidades/ef69lp01.md` | Pública e versionada |
| Template de prompt | Definir entradas, ordem, invariantes e schema | constantes e builders em `inicio.rb`; módulos históricos | Pública como especificação, sem segredos |
| Execução | Combinar contexto, consultar modelo e validar saída | runtime Ruby/local; histórico TypeScript | Privada ou controlada |
| Artefato | Materializar texto-base, módulo, pergunta e relatório | JSON/Markdown/sources do pipeline | Público somente após revisão e anonimização |
| Avaliação | Coletar resposta, evidência e observação | `apply_quiz!`, `StudentProfileEntity` | Privada |
| Projeção de produto | Renderizar curso, eixo, material e quiz | `src/main.js`, `PLATAFORMA.md` | Pública, consumindo apenas campos permitidos |

## Fluxo canônico de conhecimento

```text
Fonte BNCC identificada
  → recorte da habilidade
  → compreensões pedagógicas curadas
  → seleção do template e de sua versão
  → composição ordenada do contexto
  → geração estruturada
  → parsing e validação
  → reparo controlado, se necessário
  → revisão humana
  → artefato público aprovado
  → projeção na página de curso
  → evidência do estudante em ambiente privado
  → auditoria e possível reescrita das compreensões
```

O fluxo é cíclico apenas no nível de melhoria editorial. Resultados individuais não devem ser incorporados ao corpus público.

## Topologia do bundle

O arquivo reservado [index.md](./index.md) é o catálogo raiz. O arquivo reservado [log.md](./log.md) registra mudanças. Os demais documentos são conceitos tipados por frontmatter e podem ser ligados por caminhos relativos.

As páginas consumidoras devem tratar o bundle como somente leitura:

```text
Git repository
  └── public/okf/*.md
        └── Vite build
              └── /cognoscere/okf/*.md
                    └── interface de curso
```

Ao construir URLs no Vite, a integração deve respeitar o `base` do project site. Um consumidor deve partir de `import.meta.env.BASE_URL`; caminhos absolutos iniciados em `/okf/` apontariam para a raiz do domínio e não para `/cognoscere/`.

## Componentes do motor

O [motor de prompts](./prompt-engine.md) é composto por responsabilidades separadas:

- [módulo de produção](./prompt-module-generation.md);
- [texto-base e compreensão-base](./prompt-text-base.md);
- [perguntas diagnósticas](./prompt-question-generation.md);
- [análise de respostas](./prompt-response-analysis.md);
- [auditoria e reescrita](./prompt-audit-rewrite.md);
- [reparo estrutural de JSON](./prompt-json-repair.md).

Separar responsabilidades reduz propagação de erro. A geração de perguntas não pode trocar o texto-base; a análise não pode reescrever retroativamente a resposta do estudante; o reparo não pode alterar a intenção pedagógica.

## Modos de operação

### Leitura pública

- lista cursos e materiais aprovados;
- mostra habilidade, fonte, versão e data de revisão;
- apresenta texto-base e perguntas autorizadas;
- explica critérios observáveis e limites da IA;
- não expõe respostas individuais, perfis, tokens ou prompts com dados pessoais.

### Execução editorial controlada

- executa geração de texto e módulo;
- valida schemas e invariantes;
- registra modelo, versão e fontes;
- encaminha artefato para revisão;
- publica apenas após aprovação.

### Avaliação protegida

- coleta resposta aberta;
- registra decisão humana sobre sustentação textual;
- atualiza perfil de competência em armazenamento apropriado;
- permite auditoria autorizada;
- nunca grava dados de menores no diretório público.

## Disponibilidade e degradação

Se um documento OKF público estiver indisponível, a interface deve:

1. indicar erro de carregamento;
2. preservar navegação geral;
3. não substituir silenciosamente o conteúdo por material possivelmente obsoleto;
4. oferecer nova tentativa;
5. registrar telemetria sem conteúdo pessoal, quando existir infraestrutura apropriada.

## Compatibilidade

Leitores do formato documental OKF v0.1 devem ignorar campos desconhecidos e rejeitar conceitos comuns sem `type`; `index.md` e `log.md` seguem regras reservadas próprias. Mudanças que alterem significado, nome de campo obrigatório ou fronteira público/privado exigem nova versão e registro em [log.md](./log.md).
