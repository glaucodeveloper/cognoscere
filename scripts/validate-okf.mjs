import { readFile, readdir, stat } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";

const root = path.resolve(process.argv[2] || "public/okf");
const errors = [];
const warnings = [];

async function filesBelow(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map((entry) => {
    const fullPath = path.join(directory, entry.name);
    return entry.isDirectory() ? filesBelow(fullPath) : [fullPath];
  }));
  return nested.flat();
}

function frontmatterOf(content) {
  if (!content.startsWith("---\n")) return null;
  const end = content.indexOf("\n---\n", 4);
  if (end < 0) return null;
  return content.slice(4, end);
}

function field(frontmatter, name) {
  const match = frontmatter?.match(new RegExp(`^${name}:\\s*["']?([^"'\\n]+)`, "m"));
  return match?.[1]?.trim();
}

function sha256(content) {
  return createHash("sha256").update(content).digest("hex");
}

async function validateConcept(file, content) {
  const relative = path.relative(root, file).replaceAll(path.sep, "/");
  const basename = path.basename(file);
  const reserved = basename === "index.md" || basename === "log.md";
  const frontmatter = frontmatterOf(content);

  if (!reserved) {
    if (!frontmatter) errors.push(`${relative}: frontmatter YAML ausente ou não delimitado`);
    if (!field(frontmatter, "type")) errors.push(`${relative}: campo obrigatório type ausente`);
  }

  if (basename === "log.md" && frontmatter) errors.push(`${relative}: log.md não deve ter frontmatter`);
  if (basename === "log.md" && !/^## \d{4}-\d{2}-\d{2}$/m.test(content)) {
    errors.push(`${relative}: log sem seção de data ISO YYYY-MM-DD`);
  }
  if (basename === "index.md" && file !== path.join(root, "index.md") && frontmatter) {
    errors.push(`${relative}: somente o index raiz pode declarar frontmatter`);
  }
  if (file === path.join(root, "index.md") && field(frontmatter, "okf_version")?.replaceAll('"', "") !== "0.1") {
    errors.push(`${relative}: okf_version deve ser 0.1`);
  }

  for (const match of content.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
    const target = match[1].split("#")[0].split("?")[0];
    if (!target || /^(https?:|mailto:)/.test(target)) continue;
    const resolved = target.startsWith("/")
      ? path.join(root, target.slice(1))
      : path.resolve(path.dirname(file), target);
    if (!resolved.startsWith(root)) {
      warnings.push(`${relative}: link sai do bundle (${target})`);
      continue;
    }
    try {
      const targetStat = await stat(resolved);
      if (targetStat.isDirectory()) await stat(path.join(resolved, "index.md"));
    } catch {
      warnings.push(`${relative}: link ainda não resolvido (${target})`);
    }
  }
}

async function validateManifest() {
  const manifestPath = path.join(root, "manifest.json");
  let manifest;
  try {
    manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") return false;
    errors.push(`manifest.json: ${error.message}`);
    return true;
  }

  if (manifest.format !== "cognoscere-okf-manifest") errors.push("manifest.json: format inválido");
  if (!/^\d+\.\d+\.\d+$/.test(manifest.publicContractVersion || "")) {
    errors.push("manifest.json: publicContractVersion SemVer ausente ou inválida");
  }
  if (!Array.isArray(manifest.courses) || !manifest.courses.length) errors.push("manifest.json: courses vazio");

  const entries = [
    ...(manifest.skills || []),
    ...(manifest.promptTemplates || []),
    ...(manifest.courses || [])
  ];
  for (const entry of entries) {
    if (!entry.id || !entry.path) {
      errors.push("manifest.json: entrada sem id/path");
      continue;
    }
    try {
      const document = JSON.parse(await readFile(path.join(root, entry.path), "utf8"));
      if (document.publicContractVersion !== manifest.publicContractVersion) {
        errors.push(`${entry.id}: publicContractVersion diverge do manifesto`);
      }
    } catch (error) {
      errors.push(`${entry.id}: ${error.message}`);
    }
  }

  for (const course of manifest.courses || []) {
    if (!course.id || !course.path) {
      errors.push("manifest.json: entrada de curso sem id/path");
      continue;
    }
    try {
      const coursePath = path.join(root, course.path);
      const courseData = JSON.parse(await readFile(coursePath, "utf8"));
      for (const cycle of courseData.cycles || []) {
        for (const axis of cycle.axes || []) {
          for (const documentPath of [axis.materialPath, axis.activityPath].filter(Boolean)) {
            const artifact = JSON.parse(await readFile(path.join(root, documentPath), "utf8"));
            if (artifact.publicContractVersion !== manifest.publicContractVersion) {
              errors.push(`${documentPath}: publicContractVersion diverge do manifesto`);
            }
          }
        }
      }
    } catch (error) {
      errors.push(`${course.id}: ${error.message}`);
    }
  }
  return true;
}

async function validatePromptRegistry() {
  const registryPath = path.join(root, "registry.json");
  let registry;
  try {
    registry = JSON.parse(await readFile(registryPath, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") return false;
    errors.push(`registry.json: ${error.message}`);
    return true;
  }

  if (registry.format !== "cognoscere-ruby-prompt-okf") errors.push("registry.json: format inválido");
  if (registry.okfVersion !== "0.1") errors.push("registry.json: okfVersion deve ser 0.1");
  if (!Array.isArray(registry.templates) || !registry.templates.length) errors.push("registry.json: templates vazio");
  const expectedTemplates = new Set([
    "text-base-generation",
    "question-generation",
    "rewrite-report",
    "json-repair",
    "admin-step"
  ]);
  for (const id of expectedTemplates) {
    if (!registry.templates?.some((template) => template.id === id)) {
      errors.push(`registry.json: template Ruby obrigatório ausente (${id})`);
    }
  }
  for (const source of registry.sources || []) {
    try {
      const content = await readFile(path.resolve(root, "..", source.path));
      if (sha256(content) !== source.sha256) errors.push(`${source.path}: hash diverge do arquivo-fonte`);
    } catch (error) {
      errors.push(`${source.path}: ${error.message}`);
    }
  }
  for (const template of registry.templates || []) {
    if (!template.id || !template.path || !template.source_symbol || !template.sha256) {
      errors.push("registry.json: template sem id/path/source_symbol/sha256");
      continue;
    }
    try {
      await stat(path.join(root, template.path));
    } catch (error) {
      errors.push(`${template.id}: ${error.message}`);
    }
  }
  return true;
}

const markdownFiles = (await filesBelow(root)).filter((file) => file.endsWith(".md"));
for (const file of markdownFiles) await validateConcept(file, await readFile(file, "utf8"));
const hasManifest = await validateManifest();
const hasRegistry = await validatePromptRegistry();
if (!hasManifest && !hasRegistry) errors.push("bundle sem manifest.json ou registry.json");

for (const warning of warnings) console.warn(`AVISO: ${warning}`);
if (errors.length) {
  for (const error of errors) console.error(`ERRO: ${error}`);
  process.exitCode = 1;
} else {
  console.log(`OKF válido em ${path.relative(process.cwd(), root)}: ${markdownFiles.length} documentos, ${warnings.length} aviso(s).`);
}
