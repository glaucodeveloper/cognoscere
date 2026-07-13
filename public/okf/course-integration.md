---
type: "integration"
title: "Integração OKF nas páginas de curso"
description: "Contrato de projeção do conhecimento OKF em curso, eixo, material, quiz, evidência e progressão."
tags: ["okf", "curso", "frontend", "material", "quiz"]
timestamp: "2026-07-13T00:00:00-03:00"
---

# Integração OKF nas páginas de curso

## Fluxo de produto

A definição vigente da plataforma estabelece:

```text
curso
  → ciclos
  → eixos
  → material integrado
  → quiz
  → evidência
  → progressão
```

Cada eixo deve funcionar como uma página contínua de texto, caso, lacuna, validação/refutação e continuação. O OKF fornece conteúdo, proveniência e contratos; a interface fornece navegação, estados e controles acessíveis.

## Estado atual e objetivo

No frontend atual, `course()` coordena o carregamento do manifesto e dos artefatos públicos por [`src/okf-client.js`](https://github.com/glaucodeveloper/cognoscere/blob/main/src/okf-client.js). O eixo demonstrativo já recebe material, atividade aberta e proveniência do OKF. O `quiz()` avulso ainda é hard-coded e sua múltipla escolha não representa o contrato diagnóstico aberto definido em [`inicio.rb`](https://github.com/glaucodeveloper/cognoscere/blob/main/inicio.rb).

A integração implementada não usa fallback curricular silencioso: mostra carregamento, erro recuperável e status editorial. A interface não deve fingir que conteúdo demonstrativo foi gerado ou aprovado.

## Modelo de projeção

| Conceito do curso | Origem OKF | Campos visíveis |
| --- | --- | --- |
| curso | módulo aprovado | título, área, etapa, tema, duração, progresso |
| ciclo | agrupamento editorial | objetivo, ordem, status |
| eixo | competência/etapa do módulo | título, propósito, habilidade e evidência esperada |
| material | texto-base ou artefato | gênero, título, conteúdo e fonte |
| compreensão | configuração pedagógica | resumo “por que estudar”, não análise secreta |
| quiz | perguntas aprovadas | enunciado e comando aberto |
| feedback | rubrica + decisão autorizada | evidência observada e próximo passo |
| proveniência | cadeia de fontes | BNCC, página, template, versão e revisão |

## Página de curso

Uma página completa deve conter:

1. **Cabeçalho:** título, área, série, status e progresso estimado.
2. **Objetivo:** competência e pergunta norteadora.
3. **Ciclos/eixos:** ordem, pré-requisitos e evidências esperadas.
4. **Material atual:** texto-base, caso ou produção.
5. **Fonte:** habilidade BNCC, página, versão e status editorial.
6. **Atividade:** comando de produção ou leitura.
7. **Quiz diagnóstico:** pergunta aberta, salvamento e retomada.
8. **Feedback:** observação, evidência e mediação, conforme papel.
9. **Próximo passo:** continuação, revisão ou nova evidência.
10. **Como foi construído:** contexto, regras, schema, fontes, validações e limites — nunca cadeia de pensamento.

## Carregamento no GitHub Pages

O bundle é estático e vive sob o `base` do Vite. O cliente tenta a projeção compilada `./okf/` e, para compatibilidade com a publicação legada da árvore, `./public/okf/`, sempre relativas a `document.baseURI`:

```js
const roots = ["./okf/", "./public/okf/"]
  .map((path) => new URL(path, document.baseURI));
const manifest = await fetch(new URL("manifest.json", roots[0]));
```

O comportamento executável está em `src/okf-client.js`. No build do project site, a projeção parte de `/cognoscere/okf/`.

## Estados de interface

| Estado | Comportamento |
| --- | --- |
| `loading` | skeleton/aviso acessível sem apagar navegação |
| `ready` | material e proveniência renderizados |
| `empty` | informa que ainda não há material aprovado |
| `error` | explica falha, oferece nova tentativa e não exibe conteúdo como oficial |
| `offline` | usa cache previamente validado, com data visível |
| `private` | solicita autenticação sem revelar metadado sensível |
| `draft` | visível apenas a papel editorial autorizado |

## Navegação e seleção

- A rota identifica curso/eixo/material por slug estável.
- A interface resolve referências, não duplica conteúdo curricular.
- Troca de eixo atualiza título da página, foco e histórico do navegador.
- Links internos continuam válidos sob `/cognoscere/`.
- Um material removido mostra depreciação e alternativa, não erro silencioso.

## Quiz aberto

O contrato de [Geração de perguntas](./prompt-question-generation.md) exige perguntas abertas. Na interface do estudante:

- mostrar uma pergunta por vez ou agrupamento pedagogicamente justificado;
- manter texto-base acessível;
- permitir rascunho e revisão;
- indicar que não é prova punitiva;
- não mostrar resposta de referência antes da submissão quando isso comprometer a sondagem;
- não classificar automaticamente sem deixar claro que é sugestão;
- encaminhar decisão final a humano autorizado quando houver impacto de progressão.

## Visibilidade por papel

### Estudante

- material, fonte simplificada, pergunta, próprio feedback e próximo passo.

### Professor

- compreensão completa, rubrica, pistas, resposta de referência, observações e decisão.

### Stakeholder/revisor

- fontes, template, schema, status, histórico de aprovação e evidências agregadas/anônimas.

### Público

- somente material marcado para visibilidade pública, sem dado individual.

## Evidência e progressão

Ao concluir uma atividade, a UI deve diferenciar:

1. entrega recebida;
2. evidência aguardando análise;
3. evidência confirmada;
4. progressão recalculada;
5. nível mantido ou alterado;
6. recomendação de próximo passo.

Não apresentar “evidência registrada” antes de persistência confirmada. Não alterar reputação social ou placar. A semântica está em [Progressão](./progression-taxonomy.md).

## Acessibilidade

- títulos hierárquicos e landmarks;
- foco movido para o conteúdo após navegação;
- estados anunciados com região viva apropriada;
- campos com label persistente;
- erros associados ao campo;
- touch targets adequados;
- sem depender apenas de cor para status;
- texto-base com largura de leitura e opção de adaptação sem perder conteúdo;
- drawer social não deve bloquear atividade ou teclado.

## Cache e atualização

- Cachear por URL e versão do documento.
- Invalidar quando a versão/status mudar.
- Exibir data da última revisão.
- Não misturar artefatos de templates incompatíveis.
- Se a fonte mudar, exigir nova revisão dos materiais dependentes.

## Limites do modo estático

O GitHub Pages permite distribuir conteúdo aprovado, mas não:

- proteger resposta individual;
- guardar progresso real com segurança;
- consultar modelo com segredo;
- publicar material por workflow editorial autenticado;
- oferecer auditoria de ações por usuário.

Essas funções exigem a camada privada descrita em [Contratos](./contracts.md). A separação arquitetural está em [Arquitetura](./architecture.md).
