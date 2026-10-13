#!/usr/bin/env node
/**
 * `npm run setup` — checks whether the app is ready to run.
 *
 * Reads .env.local the same way Next.js does, so what it reports is what the
 * app will actually see. Exits non-zero when something required is missing, so
 * it also works as a CI/Vercel build gate.
 */

import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function loadEnvFile(file) {
  if (!existsSync(file)) return {};
  const out = {};
  for (const rawLine of readFileSync(file, "utf8").split("\n")) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    out[key] = value;
  }
  return out;
}

const fileEnv = {
  ...loadEnvFile(join(root, ".env.local")),
  ...loadEnvFile(join(root, ".env")),
};

// Process env wins, matching Next.js precedence.
const env = { ...fileEnv, ...process.env };

const REQUIRED = [
  ["NEXT_PUBLIC_SUPABASE_URL", "Project URL", "Settings -> Data API -> Project URL"],
  ["NEXT_PUBLIC_SUPABASE_ANON_KEY", "Anon key", "Settings -> API Keys -> anon public"],
];

const OPTIONAL = [
  ["SUPABASE_SERVICE_ROLE_KEY", "Needed for the admin chip grants only"],
];

let problems = 0;

console.log("\n  BetchaPokah — setup check\n");

for (const [key, label, where] of REQUIRED) {
  const value = env[key];
  if (value && !value.includes("your-project-ref") && !value.includes("sb_publishable_xxx")) {
    console.log(`  ok    ${key}`);
  } else {
    problems++;
    console.log(`  MISSING  ${key}  (${label})`);
    console.log(`          -> ${where}`);
  }
}

for (const [key, why] of OPTIONAL) {
  const value = env[key];
  if (value && !value.includes("sb_secret_xxx")) {
    console.log(`  ok    ${key}`);
  } else {
    console.log(`  skip  ${key}  (${why})`);
  }
}

if (!existsSync(join(root, ".env.local")) && !env.NEXT_PUBLIC_SUPABASE_URL) {
  console.log("\n  No .env.local found. Copy .env.example to .env.local to get started.");
}

if (problems > 0) {
  console.log(`\n  ${problems} required value(s) missing. See .env.example for the full list.\n`);
  process.exit(1);
}

console.log("\n  Ready. Run `npm run dev`.\n");
console.log("  First run: make yourself admin in the Supabase SQL editor:");
console.log("    update public.profiles set role = 'admin' where email = 'you@example.com';\n");