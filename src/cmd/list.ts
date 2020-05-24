import { colors, fatal } from "@cszatma/node-stdlib";

import * as config from "../config/mod";

function listAvailableFileTypes(configName: string): void {
  const configType = config.getConfigType(configName);
  if (!configType) {
    console.error(colors.red(`Error: ${configName} is not a valid config type!`));
    console.log("Use `config-gen list` to list all available config types.");
    process.exit(1);
  }

  console.log(`Available file types for ${configName}:`);

  for (const f of configType.fileNames.keys()) {
    console.log(` - ${f}`);
  }

  console.log(`Supports package.json: ${configType.packageJsonName ? "yes" : "no"}`);
}

export function listCmd(configName?: string): void {
  const err = config.init();
  if (err !== undefined) {
    fatal.exitErr(err, "Failed to initialize config");
  }

  if (configName) {
    listAvailableFileTypes(configName);
    return;
  }

  console.log("Available configs:");

  for (const [k, v] of Object.entries(config.configs())) {
    console.log(` - ${k} (${v})`);
  }
}
