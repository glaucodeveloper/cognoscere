import { Command } from "commander";

import { ingestAll } from "./repository.js";
import { askQuestion } from "./qa.js";
import { generateProductionModule } from "./modules.js";
import { generatePrivateSessionKit } from "./sessions.js";
import { refreshVectorlessPlaybook } from "./playbooks.js";
import { generateReferenceDocuments } from "./reference-pipeline.js";
import { uiDir } from "./paths.js";
import { serveTestInterface } from "./server.js";
import { generateTestInterface } from "./ui.js";
import { PROJECT_NAME } from "./sources.js";

const program = new Command();

program
  .name("cognoscere")
  .description(`CLI para consultar ${PROJECT_NAME} com Node + TypeScript + Gemini SDK.`);

program
  .command("ingest")
  .description("Baixa os PDFs e extrai o texto para a pasta data/.")
  .option("-f, --force", "Forca novo download e nova extracao.")
  .action(async (options: { force?: boolean }) => {
    const results = await ingestAll(Boolean(options.force));
    for (const item of results) {
      console.log(`OK ${item.title}`);
      console.log(`PDF: ${item.path}`);
      console.log(`TXT: ${item.textPath}`);
      console.log(`Caracteres extraidos: ${item.characters}`);
      console.log("");
    }
  });

program
  .command("refresh-playbook")
  .description("Transcreve o video-base sobre Vectorless RAG e reconstrui o playbook PT-BR local.")
  .action(async () => {
    const result = await refreshVectorlessPlaybook();
    console.log(`Transcript bruto: ${result.rawPath}`);
    console.log(`Playbook PT-BR: ${result.playbookPath}`);
  });

program
  .command("generate-test-ui")
  .description("Gera o portal-demo HTML do Cognoscere com cursos por competencias, materiais tagueados, perfil customizavel e area social.")
  .action(async () => {
    const result = await generateTestInterface();
    console.log(`Interface gerada: ${result.htmlPath}`);
    console.log(`Manifesto: ${result.manifestPath}`);
    console.log(`Docs: ${result.documentsDir}`);
  });

program
  .command("generate-reference-docs")
  .description("Gera documentos de referencia por competencia, serie e nivel antes da front.")
  .action(async () => {
    const result = await generateReferenceDocuments(uiDir);
    console.log(`Manifesto: ${result.manifestPath}`);
    console.log(`Docs: ${result.documentsDir}`);
  });

program
  .command("serve-test-ui")
  .description("Serve o portal-demo do Cognoscere em uma porta HTTP local.")
  .option("--port <port>", "Porta HTTP local.", "4173")
  .action(async (options: { port: string }) => {
    await serveTestInterface(Number(options.port));
  });

program
  .command("ask")
  .description("Responde uma pergunta usando os textos ja ingeridos.")
  .argument("<question...>", "Pergunta em linguagem natural.")
  .action(async (questionParts: string[]) => {
    const answer = await askQuestion(questionParts.join(" "));
    console.log(answer);
  });

program
  .command("generate-module")
  .description("Gera um modulo de producao inspirado no Lumira e ancorado na BNCC.")
  .requiredOption("--title <title>", "Titulo do modulo.")
  .requiredOption("--stage <stage>", "Etapa, por exemplo: Ensino Fundamental Anos Finais ou Ensino Medio.")
  .requiredOption("--area <area>", "Area ou componente curricular.")
  .requiredOption("--theme <theme>", "Tema ou eixo do modulo.")
  .option("--audience <audience>", "Publico-alvo mais especifico.")
  .option("--module-type <moduleType>", "Tipo de modulo, por exemplo: projeto, evento, missao, oficina.")
  .option("--duration <duration>", "Duracao estimada, por exemplo: 4 semanas ou 8 aulas.")
  .action(
    async (options: {
      title: string;
      stage: string;
      area: string;
      theme: string;
      audience?: string;
      moduleType?: string;
      duration?: string;
    }) => {
      const request = {
        title: options.title,
        stage: options.stage,
        area: options.area,
        theme: options.theme,
        ...(options.audience ? { audience: options.audience } : {}),
        ...(options.moduleType ? { moduleType: options.moduleType } : {}),
        ...(options.duration ? { duration: options.duration } : {})
      };

      const result = await generateProductionModule(request);

      console.log(`Modulo gerado: ${result.slug}`);
      console.log(`Markdown: ${result.markdownPath}`);
      console.log(`JSON: ${result.jsonPath}`);
      console.log(`Fontes BNCC: ${result.sourcesPath}`);
      console.log("");
      console.log(result.content);
    }
  );

program
  .command("generate-session-kit")
  .description("Gera um kit de sessao particular com perguntas de fase e sondagem de matricula.")
  .requiredOption("--title <title>", "Titulo do kit.")
  .requiredOption("--stage <stage>", "Etapa do estudante.")
  .requiredOption("--area <area>", "Area ou componente.")
  .requiredOption("--learner-profile <learnerProfile>", "Perfil resumido do estudante.")
  .requiredOption("--focus <focus>", "Foco principal da sessao.")
  .option("--objectives <objectives>", "Objetivos adicionais.")
  .option("--constraints <constraints>", "Restricoes ou contexto.")
  .action(
    async (options: {
      title: string;
      stage: string;
      area: string;
      learnerProfile: string;
      focus: string;
      objectives?: string;
      constraints?: string;
    }) => {
      const result = await generatePrivateSessionKit({
        title: options.title,
        stage: options.stage,
        area: options.area,
        learnerProfile: options.learnerProfile,
        focus: options.focus,
        ...(options.objectives ? { objectives: options.objectives } : {}),
        ...(options.constraints ? { constraints: options.constraints } : {})
      });

      console.log(`Kit gerado: ${result.slug}`);
      console.log(`Markdown: ${result.markdownPath}`);
      console.log(`JSON: ${result.jsonPath}`);
      console.log(`Fontes: ${result.sourcesPath}`);
      console.log("");
      console.log(result.content);
    }
  );

program.action(() => {
  program.outputHelp();
});

program.parseAsync(process.argv).catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Erro: ${message}`);
  process.exitCode = 1;
});
