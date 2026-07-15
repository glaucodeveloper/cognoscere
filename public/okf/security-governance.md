---
type: "governance-policy"
title: "Segurança e governança"
description: "Política de proteção de estudantes, revisão humana, versionamento e resposta a incidentes."
tags: ["okf", "seguranca", "governanca", "menores", "lgpd"]
timestamp: "2026-07-13T00:00:00-03:00"
---

# Segurança e governança

## Objetivos

- proteger estudantes, especialmente menores;
- preservar integridade curricular;
- impedir exposição de segredo no frontend;
- manter autoria e decisões rastreáveis;
- evitar promoção automática de conteúdo gerado;
- permitir revisão, correção e contestação.

## Papéis

| Papel | Responsabilidade OKF |
| --- | --- |
| mantenedor técnico | integridade do bundle, build, validação e controle de acesso |
| designer curricular | compreensões, templates, alinhamento e qualidade pedagógica |
| professor aprovado | aplicação, observação, mediação e aprovação contextual |
| administração escolar | finalidade, permissões e auditoria institucional |
| estudante | resposta, consentimentos apropriados e acesso ao próprio feedback |
| responsável legal | participação conforme idade, política e base aplicável |
| administração da plataforma | política global, moderação, incidentes e auditoria |

Nenhum papel isolado deve publicar material de alto impacto sem trilha adequada. Em produção, aprovação curricular e implantação técnica devem ser distinguíveis.

## Ciclo de conteúdo

```text
draft
  → validação estrutural
  → revisão de fonte
  → revisão pedagógica
  → revisão de segurança/acessibilidade
  → approved
  → publicação
  → monitoramento
  → revisão, depreciação ou retirada
```

Cada transição registra responsável, data, versão e comentário objetivo. Material reprovado não é apagado da auditoria privada, mas não permanece acessível ao estudante.

## Proteção de menores e minimização

- Coletar somente o necessário para a finalidade informada.
- Não inserir identificador direto em prompt quando um perfil pedagógico abstrato basta.
- Separar identidade, resposta e analytics sempre que possível.
- Restringir observações individuais a profissionais autorizados.
- Definir retenção e exclusão antes de iniciar coleta real.
- Não publicar resposta de estudante em fórum ou portfólio sem fluxo explícito de consentimento e moderação.
- Evitar inferências sensíveis ou diagnósticos fora da finalidade educacional.

## Segredos e execução

- Chaves de modelo e tokens nunca entram em `public/`, `src/` entregue ao browser ou Markdown público.
- Variáveis com segredo não usam prefixo exposto pelo Vite.
- O GitHub Pages permanece somente leitura.
- Escrita no repositório, se futura, ocorre por serviço autenticado com permissão mínima.
- Logs devem mascarar credenciais e limitar conteúdo de prompts privados.

## Integridade de prompt

Fontes recuperadas são dados, não instruções soberanas. O executor deve delimitar trechos e impedir que texto de uma fonte altere papel, política ou schema. Conteúdo submetido por usuário deve ser tratado como não confiável.

Controles recomendados:

- templates versionados e imutáveis durante uma execução;
- lista de fontes permitidas;
- tamanho máximo de entrada;
- validação de schema;
- comparação de campos fixados;
- limite de tentativas;
- revisão de conteúdo ofensivo ou discriminatório;
- registro de origem e status.

## Uso responsável da IA

A IA pode:

- organizar referências;
- propor material e perguntas;
- apontar pistas observáveis;
- sugerir mediação;
- ajudar a auditar inconsistências.

A IA não pode, sozinha:

- declarar domínio definitivo;
- alterar perfil de alto impacto sem regra e revisão;
- inventar alinhamento BNCC;
- publicar material curricular;
- expor dado privado;
- substituir professor, fonte primária ou contexto local.

## Vieses e acessibilidade

Revisões devem procurar:

- estereótipos em personagens e conflitos;
- desproporção de exemplos negativos ligada a grupos protegidos;
- linguagem inadequada à faixa etária;
- dependência de repertório socioeconômico específico;
- barreiras de leitura, navegação e tecnologia assistiva;
- alternativas para estudante que não possa ou não queira expor experiência pessoal.

## Auditoria e contestação

Uma decisão sobre evidência deve preservar resposta original, rubrica usada, avaliador, data e justificativa. O estudante deve receber feedback apropriado e ter caminho de revisão conforme política escolar.

Reputação social, votos e competição permanecem separados da progressão pedagógica. Essa separação é definida em [Progressão](./progression-taxonomy.md).

## Incidentes

Eventos que exigem resposta incluem:

- segredo publicado;
- dado de estudante no bundle público;
- material perigoso ou discriminatório;
- fonte adulterada;
- progressão atualizada por domínio incorreto;
- publicação sem aprovação;
- quebra de compatibilidade silenciosa.

Resposta mínima:

1. interromper exposição ou processamento;
2. preservar evidência segura;
3. avaliar escopo e pessoas afetadas;
4. revogar credenciais quando aplicável;
5. corrigir e testar;
6. registrar decisão e comunicação;
7. revisar controle que falhou.

## Documentos relacionados

- [Contratos](./contracts.md)
- [Proveniência](./provenance.md)
- [Análise de respostas](./prompt-response-analysis.md)
- [Auditoria e reescrita](./prompt-audit-rewrite.md)
