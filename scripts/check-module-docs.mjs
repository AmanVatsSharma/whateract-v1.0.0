/**
 * File: scripts/check-module-docs.mjs
 * Module: governance
 * Purpose: Validate frontend module docs and changelog sections.
 * Author: BharatERP
 * created: 2026-02-15
 */
import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const SRC_DIR = path.join(ROOT, "src");
const FEATURES_DIR = path.join(SRC_DIR, "features");

async function exists(targetPath) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function run() {
  const featureDirectories = (await fs.readdir(FEATURES_DIR, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(FEATURES_DIR, entry.name));

  const missingDocs = [];
  for (const featureDir of featureDirectories) {
    const moduleDocPath = path.join(featureDir, "MODULE_DOC.md");
    if (!(await exists(moduleDocPath))) {
      missingDocs.push(path.relative(ROOT, featureDir));
    }
  }
  if (missingDocs.length > 0) {
    throw new Error(
      `Missing MODULE_DOC.md in feature directories: ${missingDocs.join(", ")}`,
    );
  }

  const moduleDocFiles = await Promise.all(
    featureDirectories.map((dir) => path.join(dir, "MODULE_DOC.md")),
  );
  const withoutChangelog = [];
  for (const filePath of moduleDocFiles) {
    const content = await fs.readFile(filePath, "utf8");
    if (!/change-log\s*:/i.test(content)) {
      withoutChangelog.push(path.relative(ROOT, filePath));
    }
  }
  if (withoutChangelog.length > 0) {
    throw new Error(
      `MODULE_DOC files missing Change-log section: ${withoutChangelog.join(", ")}`,
    );
  }

  console.log(
    [
      "Frontend module doc checks passed.",
      `Feature modules checked: ${featureDirectories.length}`,
    ].join("\n"),
  );
}

run().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
