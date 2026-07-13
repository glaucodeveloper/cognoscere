import { defineConfig } from 'vite';

export default defineConfig({
  // O deploy de produção é um project site: /cognoscere/.
  // Em desenvolvimento local, mantém os caminhos absolutos na raiz.
  base: process.env.GITHUB_ACTIONS ? '/cognoscere/' : '/',
});
