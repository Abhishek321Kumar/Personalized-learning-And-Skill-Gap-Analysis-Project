import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const modulesPath = path.join(process.cwd(), "modules.config.json");

let rawConfig = { activeModules: [] };
try {
  rawConfig = JSON.parse(fs.readFileSync(modulesPath, "utf-8"));
} catch (e) {
  console.warn("Could not load modules.config.json. Defaulting to empty.", e.message);
}

export const moduleConfig = rawConfig.activeModules;
export const isModuleEnabled = (code) =>
  moduleConfig.find((module) => module.code === code)?.enabled === true;

