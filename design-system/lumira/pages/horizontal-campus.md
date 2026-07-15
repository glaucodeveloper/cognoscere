# Lumira — variante campus horizontal

Referência recuperada do histórico do Cognoscere: portal educacional por competências com Carbon Design System, dashboard e comunidade em estrutura de campus.

- Desktop: navegação global horizontal escura; barra de busca contextual logo abaixo; conteúdo full-width, com respiros laterais fluidos e sem contêiner central limitante.
- Social: chat em sidebar flutuante à direita, sobre a interface, com estado aberto/fechado e acionador persistente na barra superior. O painel não reduz a largura estrutural da tarefa principal.
- Fundação: preto Carbon `#161616`, azul de ação `#0f62fe`, vermelho de identidade `#da1e28`, superfícies neutras e bordas retas.
- Conteúdo: cartões, tabs, CTAs e barras de progresso com cantos retos e contraste funcional.
- Mobile: mantém a navegação inferior já existente e transforma o chat social em gaveta flutuante quase full-screen, com rótulos acessíveis, fechamento por botão e áreas de toque mínimas de 44 px.

## Comportamento do chat social

- Aberto por padrão no desktop para dar presença à dimensão comunitária da plataforma.
- O botão **Círculo** na barra superior alterna o painel e expõe o estado por `aria-expanded`.
- O painel tem rolagem própria, não bloqueia a página e pode ser fechado pelo botão no cabeçalho ou pela tecla `Esc` quando não há modal aberto.
- Em larguras menores, respeita as barras superior e inferior e evita overflow horizontal.
