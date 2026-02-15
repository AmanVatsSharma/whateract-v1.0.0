/**
 * File: scripts/check-boundaries.mjs
 * Module: frontend-boundary
 * Purpose: Guard frontend source from backend/framework leakage.
 * Author: BharatERP
 * created: 2026-02-15
 */

import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const SRC_DIR = path.join(ROOT, "src");
const ALLOWED_SERVER_PREFIXES = ["app/api/", "services/bff/"];

const FORBIDDEN_IMPORT_PATTERNS = [
  /from\s+["']@nestjs\//,
  /from\s+["']typeorm["']/,
  /from\s+["']prisma["']/,
  /from\s+["']@prisma\//,
  /from\s+["']sequelize["']/,
  /from\s+["']knex["']/,
  /from\s+["']bull["']/,
];

const FORBIDDEN_RUNTIME_PATTERNS = [
  /process\.env\.BACKEND_API_URL/,
  /http:\/\/localhost:3000/,
];

async function listSourceFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const absolute = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        return listSourceFiles(absolute);
      }
      if (!/\.(ts|tsx|js|jsx|mjs|cjs)$/.test(entry.name)) {
        return [];
      }
      return [absolute];
    })
  );
  return files.flat();
}

function isAllowedServerFile(relativePath) {
  return ALLOWED_SERVER_PREFIXES.some((prefix) => relativePath.startsWith(prefix));
}

async function main() {
  const sourceFiles = await listSourceFiles(SRC_DIR);
  const violations = [];

  for (const filePath of sourceFiles) {
    const relativePath = path.relative(SRC_DIR, filePath).replaceAll("\\", "/");
    const content = await fs.readFile(filePath, "utf8");
    const allowedServerFile = isAllowedServerFile(relativePath);

    for (const pattern of FORBIDDEN_IMPORT_PATTERNS) {
      if (pattern.test(content)) {
        violations.push(
          `${relativePath}: forbidden backend/framework import matches ${pattern}`
        );
      }
    }

    if (!allowedServerFile) {
      for (const pattern of FORBIDDEN_RUNTIME_PATTERNS) {
        if (pattern.test(content)) {
          violations.push(
            `${relativePath}: forbidden backend runtime reference matches ${pattern}`
          );
        }
      }
    }
  }

  if (violations.length > 0) {
    console.error("Frontend boundary check failed:\n");
    for (const violation of violations) {
      console.error(`- ${violation}`);
    }
    process.exit(1);
  }

  console.log(
    `Frontend boundary check passed (${sourceFiles.length} source files scanned).`
  );
}

main().catch((error) => {
  console.error("Boundary check execution failed:", error);
  process.exit(1);
});
