const jsonCache = new Map();

function candidateRoots() {
  return ["./okf/", "./public/okf/"].map((path) => new URL(path, document.baseURI));
}

function assertSafePath(path) {
  if (!path || path.startsWith("/") || path.includes("..")) {
    throw new Error(`Caminho OKF inválido: ${path || "vazio"}`);
  }
}

async function fetchFromRoot(root, path) {
  const url = new URL(path, root);
  const response = await fetch(url, { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(`HTTP ${response.status} em ${url.pathname}`);
  return response.json();
}

export class StaticOkfRepository {
  constructor(roots = candidateRoots()) {
    this.roots = roots;
    this.activeRoot = null;
  }

  async json(path) {
    assertSafePath(path);
    if (jsonCache.has(path)) return jsonCache.get(path);

    const roots = this.activeRoot
      ? [this.activeRoot, ...this.roots.filter((root) => root.href !== this.activeRoot.href)]
      : this.roots;
    const errors = [];

    for (const root of roots) {
      try {
        const value = await fetchFromRoot(root, path);
        this.activeRoot = root;
        jsonCache.set(path, value);
        return value;
      } catch (error) {
        errors.push(error.message);
      }
    }

    throw new Error(`Bundle OKF indisponível (${errors.join("; ")})`);
  }

  async manifest() {
    const manifest = await this.json("manifest.json");
    if (manifest.format !== "cognoscere-okf-manifest" || !manifest.publicContractVersion) {
      throw new Error("Manifesto OKF não reconhecido pelo Cognoscere");
    }
    return manifest;
  }

  async course(courseId) {
    const manifest = await this.manifest();
    const entry = manifest.courses?.find((item) => item.id === courseId);
    if (!entry?.path) throw new Error(`Curso ${courseId} não encontrado no manifesto OKF`);

    const course = await this.json(entry.path);
    const materialPaths = course.cycles
      ?.flatMap((cycle) => cycle.axes || [])
      .flatMap((axis) => [axis.materialPath, axis.activityPath].filter(Boolean)) || [];
    const documents = await Promise.all(materialPaths.map(async (path) => [path, await this.json(path)]));

    return { manifest, entry, course, documents: Object.fromEntries(documents) };
  }

  clear() {
    jsonCache.clear();
    this.activeRoot = null;
  }
}

export const okfRepository = new StaticOkfRepository();

export function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function safeList(values) {
  return Array.isArray(values) ? values : [];
}
