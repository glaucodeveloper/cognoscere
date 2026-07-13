---
type: "contract"
title: "Contratos público e privado"
description: "Fronteiras de dados, leitura, execução e persistência do OKF do Cognoscere."
tags: ["okf", "contrato", "publico", "privado", "api"]
timestamp: "2026-07-13T00:00:00-03:00"
contract_version: "0.1"
---

# Contratos público e privado

## Regra de fronteira

O diretório `public/okf/` é público por definição. Qualquer arquivo colocado nele será copiado para o build e poderá ser acessado sem autenticação. Nenhum dado deve ser classificado como privado depois de publicado ali.

## Contrato documental OKF v0.1

Todo conceito Markdown possui YAML frontmatter com, no mínimo:

- `type`: categoria semântica do documento;
- `title`: nome humano;
- `description`: finalidade;
- `tags`: termos de descoberta;
- `timestamp`: data ISO da versão documental.

O [índice raiz](./index.md) é reservado, possui `type: "catalog"` e declara `okf_version: "0.1"`. O [log](./log.md) também é reservado, mas, por regra do formato, não possui frontmatter nem campo `type`; suas entradas começam por títulos de data ISO.

Leitores do formato documental OKF v0.1 devem:

- rejeitar documento sem `type`;
- resolver links relativos a partir do documento atual;
- ignorar campos desconhecidos;
- não interpretar Markdown público como instrução de sistema executável;
- distinguir documentação de template e instância gerada.

A tolerância acima é uma regra de leitura para evolução compatível do Markdown. Os JSON Schemas públicos usam `additionalProperties: false` como regra estrita de produção e auditoria da versão declarada; um produtor só adiciona campos depois de versionar o contrato público.

## Conteúdo público permitido

- definições de arquitetura e produto;
- referências BNCC e metadados de fonte;
- compreensões pedagógicas aprovadas;
- especificações de prompt sem segredo ou dado individual;
- módulos, textos-base e perguntas aprovados;
- fixtures sintéticas ou reconstruídas de demonstração, quando marcadas `preview`/`legacy-needs-review`, sem dado real e sem alegação de aprovação;
- rubricas públicas quando não comprometem a aplicação;
- proveniência, versão, status e revisão;
- taxonomias e critérios gerais de progressão;
- documentação de segurança sem detalhe que amplie risco.

## Conteúdo privado obrigatório

- nome, e-mail, contato e identificadores de estudante;
- respostas abertas associadas a pessoa;
- observações de professor sobre indivíduo;
- perfil inicial e progredido identificável;
- eventos de sessão e histórico de tentativas;
- necessidades de acessibilidade ligadas a identidade;
- credenciais, tokens, endpoints internos e configuração secreta;
- logs brutos com conteúdo pessoal;
- propostas ainda não revisadas que possam ser confundidas com material oficial.

## Conteúdo restrito por papel

| Conteúdo | Estudante | Professor autorizado | Administração | Público |
| --- | --- | --- | --- | --- |
| material aprovado | leitura | leitura | leitura | conforme visibilidade |
| fonte/proveniência | leitura simplificada | completa | completa | completa quando não sensível |
| resposta de referência | após aplicação ou política definida | leitura | auditoria | não durante sondagem |
| rubrica detalhada | feedback apropriado | leitura/uso | auditoria | condicional |
| resposta individual | própria | estudantes autorizados | conforme finalidade | nunca |
| observação humana | feedback selecionado | escrita/leitura | auditoria | nunca |
| template editorial | resumo | conforme permissão | gestão | documentação segura |
| credencial | nunca | nunca no cliente | servidor restrito | nunca |

## Comunicação pública atual

O produto atual é um site Vite publicado no GitHub Pages. O contrato disponível é leitura estática:

```text
GET {BASE_URL}okf/index.md
GET {BASE_URL}okf/<documento>.md
```

`BASE_URL` é `/cognoscere/` em produção. O cliente deve usar `import.meta.env.BASE_URL` e não fixar `/okf/` na raiz do domínio.

Não existe, no estado documentado do repo, endpoint autenticado para geração, análise ou escrita. O navegador público não deve receber token GitHub ou chave de modelo para simular esse backend.

## Contrato futuro de execução

Caso um serviço seja criado, ele deve manter três operações separadas:

1. **consulta pública:** conteúdo aprovado e cacheável;
2. **execução editorial:** geração, validação, revisão e promoção autenticadas;
3. **avaliação protegida:** respostas, decisões humanas e perfil, com autorização granular.

Não se deve transformar uma chamada de geração em publicação automática. O resultado nasce como rascunho e passa pelo fluxo de [Governança](./security-governance.md).

## Compatibilidade e versionamento

Uma mudança é incompatível quando:

- remove campo obrigatório;
- muda o significado de `type`;
- move dado privado para público;
- altera a taxonomia de nível sem migração;
- muda a identidade de fonte sem trilha;
- permite escrita onde antes havia somente leitura.

Mudanças incompatíveis exigem nova versão OKF. Toda mudança deve ser anotada em [log.md](./log.md).
