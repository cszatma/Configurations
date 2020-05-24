import path from "path";
import os from "os";
import { Result, env, errors, fs, log } from "@cszatma/node-stdlib";

import { ConfigType, configTypes } from "../util/config_types";
import { readConfigFile } from "../util/file";

export type ConfigRecord = Record<string, string | undefined>;

export interface GlobalConfig {
  configs: ConfigRecord;
}

let rcPath: string;
let configDir: string;

let globalConfig: GlobalConfig;

function resolveConfigTemplate(configName: string): string {
  return `${path.join(configDir, configName)}.json`;
}

export function getConfigType(configName: string): ConfigType | undefined {
  const name = globalConfig.configs[configName];
  return name ? configTypes.get(name) : undefined;
}

function saveGlobalConfig(): error | undefined {
  return fs
    .writeFileSync(rcPath, JSON.stringify(globalConfig, null, 2))
    .mapFailure((e) => {
      const err = errors.fromJSError(e);
      return errors.wrap(err, `failed to save ${rcPath} file`);
    })
    .failure();
}

export function init(): error | undefined {
  log.std.debug("Initializing config");

  let rootDir = env.getEnv("CONFIG_GEN_ROOT_DIR");
  if (rootDir === "") {
    rootDir = os.homedir();
  }

  rcPath = path.join(rootDir, ".configgenrc");
  configDir = path.join(rootDir, ".config-gen");

  if (!fs.fileExistsSync(rcPath)) {
    log.std.debug("No ~/.configgenrc, using default");
    globalConfig = {
      configs: {},
    };

    const err = saveGlobalConfig();
    if (err !== undefined) {
      return errors.wrap(err, "failed create default ~/.configgenrc");
    }
  } else {
    const result = fs.readFileSync(rcPath, "utf-8");
    if (result.isFailure()) {
      const err = errors.fromJSError(result.failure());
      return errors.wrap(err, "failed to read ~/.configgenrc file");
    }

    const parseResult = Result.of(() => JSON.parse(result.success()));
    if (parseResult.isFailure()) {
      const err = errors.fromJSError(parseResult.failure());
      return errors.wrap(err, "failed to parse ~/.configgenrc file");
    }

    globalConfig = parseResult.success();
    log.std.debug("Loaded config");
  }

  log.std.debug("Ensuring config templates directory exists");
  if (!fs.fileExistsSync(configDir)) {
    const mkdirResult = fs.mkdirSync(configDir, { recursive: true });

    if (mkdirResult.isFailure()) {
      const err = errors.fromJSError(mkdirResult.failure());
      return errors.wrap(err, `failed to mkdir ${configDir}`);
    }
  }

  return undefined;
}

export function configs(): ConfigRecord {
  return globalConfig.configs;
}

export function configTemplate(configName: string): Result<unknown, error> {
  log.std.debug(`Getting config template for ${configName}`);
  const destPath = resolveConfigTemplate(configName);

  return readConfigFile(destPath).mapFailure((err) => {
    return errors.wrap(err, `failed to read config template for ${configName}`);
  });
}

export function addConfig(
  configName: string,
  configType: ConfigType,
  configFile: string,
): error | undefined {
  log.std.debug("Creating template from config file");
  const destPath = resolveConfigTemplate(configName);

  const result = readConfigFile(configFile);
  if (result.isFailure()) {
    return errors.wrap(result.failure(), `failed to read config file ${configFile}`);
  }

  const data = JSON.stringify(result.success(), null, 2);
  const err = fs
    .writeFileSync(destPath, data, "utf-8")
    .mapFailure((e) => errors.fromJSError(e))
    .failure();
  if (err !== undefined) {
    return errors.wrap(err, `failed to write config template at ${destPath}`);
  }

  log.std.debug("Adding config entry");
  globalConfig.configs[configName] = configType.name;
  return saveGlobalConfig();
}

export function deleteConfig(configName: string): error | undefined {
  log.std.debug("Deleting config entry");
  delete globalConfig.configs[configName];

  let err = saveGlobalConfig();
  if (err !== undefined) {
    return errors.wrap(err, `failed to delete ${configName} entry`);
  }

  log.std.debug("Deleting config template");
  const templatePath = resolveConfigTemplate(configName);
  err = fs
    .removeSync(templatePath)
    .mapFailure((e) => errors.fromJSError(e))
    .failure();

  return errors.wrap(err, `failed to delete config template for ${configName}`);
}
