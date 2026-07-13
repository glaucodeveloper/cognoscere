# Registro do bundle OKF

`log.md` é reservado ao histórico do bundle. Novos registros devem ser acrescentados sem apagar decisões anteriores. Correções podem indicar que substituem uma entrada, mas não devem reescrever silenciosamente o passado.

## 2026-07-13

Criação do contrato documental v0.1:

- Registrado que uma base OKF legada existiu localmente, sem versionamento recuperável; o bundle v0.1 é uma reconstrução verificável pelos remanescentes, não cópia literal do conteúdo perdido.
- Criado o [índice canônico](./index.md) com `okf_version: "0.1"`.
- Documentada a [arquitetura](./architecture.md) de leitura pública e execução privada.
- Registrada a [proveniência](./provenance.md) baseada no estado atual e no commit histórico `40e135d`.
- Descrito o [motor de prompts](./prompt-engine.md) e seus seis estágios especializados.
- Formalizados os [contratos público e privado](./contracts.md).
- Formalizadas regras de [segurança e governança](./security-governance.md).
- Reconciliadas as taxonomias de [progressão](./progression-taxonomy.md).
- Definida a [integração dos documentos OKF com as páginas de curso](./course-integration.md).
- Nenhuma cadeia de pensamento foi incluída. A documentação limita-se a contratos, contexto, regras, schemas, resultados observáveis e decisões humanas.

## Política de registro

Cada entrada futura deve informar:

1. data ISO no fuso do projeto;
2. versão afetada;
3. documentos alterados;
4. motivo da mudança;
5. impacto em compatibilidade;
6. necessidade de migração ou nova revisão humana.
