import { createServer } from "node:http";
import { access, readFile } from "node:fs/promises";
import path from "node:path";

import { generateTestInterface } from "./ui.js";

function contentTypeFor(filePath: string): string {
  if (filePath.endsWith(".html")) {
    return "text/html; charset=utf-8";
  }
  if (filePath.endsWith(".js")) {
    return "text/javascript; charset=utf-8";
  }
  if (filePath.endsWith(".css")) {
    return "text/css; charset=utf-8";
  }
  if (filePath.endsWith(".json")) {
    return "application/json; charset=utf-8";
  }
  return "text/plain; charset=utf-8";
}

export async function serveTestInterface(port = 4173): Promise<void> {
  const { htmlPath } = await generateTestInterface();
  const rootDir = path.dirname(htmlPath);

  const server = createServer(async (request, response) => {
    try {
      const requestPath = request.url && request.url !== "/" ? request.url.split("?")[0] || "/" : "/";
      const safePath = requestPath === "/" ? path.basename(htmlPath) : requestPath.replace(/^\/+/, "");
      const filePath = path.join(rootDir, safePath);

      if (!filePath.startsWith(rootDir)) {
        response.writeHead(403, { "content-type": "text/plain; charset=utf-8" });
        response.end("Acesso negado.");
        return;
      }

      await access(filePath);
      const data = await readFile(filePath);
      response.writeHead(200, { "content-type": contentTypeFor(filePath) });
      response.end(data);
    } catch {
      response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
      response.end("Arquivo nao encontrado.");
    }
  });

  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, "0.0.0.0", () => resolve());
  });

  console.log(`Portal Cognoscere servido em http://localhost:${port}/`);
}
