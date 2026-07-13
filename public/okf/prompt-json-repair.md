---
type: "prompt-spec"
title: "Prompt de reparo de JSON"
description: "Política controlada para reconstruir uma saída estruturada que falhou no parsing."
tags: ["okf", "prompt", "json", "reparo", "validacao"]
timestamp: "2026-07-13T00:00:00-03:00"
stage: "json-repair"
status: "current-contract"
---

# Prompt de reparo de JSON

## Responsabilidade

Reconstruir uma saída JSON malformada ou truncada sem alterar a tarefa original. O reparo é uma etapa técnica; não pode ser usado para contornar validação pedagógica ou inventar conteúdo ausente sem indicação.

No runtime atual, `FrameworkLlamaTextInference#json` tenta analisar a resposta. Em caso de erro, chama uma nova inferência com o prompt original, a resposta quebrada e o erro do parser, e tenta analisar novamente.

## Entradas

| Entrada | Função |
| --- | --- |
| `original_prompt` | preserva tarefa, contexto e schema original |
| `broken_response` | oferece o material recuperável |
| `parser_error.class` | identifica tipo de falha |
| `parser_error.message` | localiza sintoma estrutural |

Antes de compor a solicitação, o runtime normaliza UTF-8, remove BOM e substitui caracteres de controle incompatíveis.

## Ordem do contexto

1. declaração de que a resposta deveria ser JSON;
2. erro do parser;
3. prompt original completo;
4. resposta quebrada ou truncada;
5. tarefa de reconstrução;
6. regras estritas de saída.

## Regras de saída

- Retornar somente JSON válido.
- Não usar Markdown ou bloco cercado.
- Não escrever comentário ou explicação.
- Escapar quebras de linha dentro de strings.
- Fechar objetos e arrays.
- Manter o schema solicitado no prompt original.
- Preservar identificadores, texto-base e quantidade quando recuperáveis.

## Validação após reparo

Parsing bem-sucedido não basta. A saída reparada deve passar novamente por:

1. validação de schema;
2. checagem de campos obrigatórios;
3. invariantes específicas do estágio;
4. comparação de artefatos imutáveis;
5. revisão humana se o reparo adicionou conteúdo substantivo.

## Classificação de falhas

| Falha | Reparo permitido | Conduta |
| --- | --- | --- |
| cerca Markdown em torno do JSON | sim | extrair e validar |
| vírgula/chave ausente | sim | reconstruir e validar |
| string com quebra não escapada | sim | escapar e validar |
| objeto truncado com padrão claro | condicional | completar e marcar reparo |
| campos pedagógicos inteiros ausentes | não automaticamente | regenerar estágio ou exigir revisão |
| identidade BNCC divergente | não | rejeitar |
| texto-base alterado | não | rejeitar |
| conteúdo inseguro | não | rejeitar e revisar |

## Limites de tentativa

Uma implementação de produção deve limitar tentativas e impedir loop recursivo. Recomendação v0.1:

- uma tentativa de reparo automático;
- se falhar, preservar erro e saída bruta em ambiente controlado;
- solicitar nova geração ou intervenção humana;
- nunca promover resposta parcial silenciosamente.

## Registro

Registrar:

- template e versão originais;
- tipo de erro;
- hash ou referência segura da resposta quebrada;
- tentativa efetuada;
- resultado das validações;
- decisão final.

Não registrar segredo nem conteúdo pessoal além do necessário. Consulte [Motor de prompts](./prompt-engine.md) e [Segurança](./security-governance.md).
