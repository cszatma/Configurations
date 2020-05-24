import path from "path";
import { colors, fatal, fs, log, errors, strconv } from "@cszatma/node-stdlib";

import * as config from "../config/mod";
import { parseFileType } from "../util/config_types";
import { createConfigFile } from "../util/file";

export interface CreateOptions {
  path?: string;
  createDirectories?: boolean;
  type?: string;
  indent?: string;
  packageJson?: boolean;
  force?: boolean;
}

export function createCmd(configName: string, options: CreateOptions): void {
  let err = config.init();
  if (err !== undefined) {
    fatal.exitErr(err, "Failed to initialize config");
  }

  const destDir = options.path ?? ".";

  // If a custom path was specified make sure it exists
  if (options.path !== undefined && !fs.fileExistsSync(destDir)) {
    if (!options.createDirectories) {
      fatal.exit(colors.red(`Error: ${destDir} does not exist!`));
    }

    log.std.debug(`${destDir} doesn't exist, creating`);
    err = fs
      .mkdirSync(destDir, { recursive: true })
      .mapFailure((e) => errors.fromJSError(e))
      .failure();
    if (err !== undefined) {
      fatal.exitErr(err, `Failed to create ${destDir}`);
    }
  }

  log.std.debug("Determining config type");
  const configType = config.getConfigType(configName);

  // If config type is undefined then configName was not a valid config
  if (!configType) {
    console.error(colors.red(`Error: ${configName} is not a valid config!`));
    console.log("Use `config-gen list` to list all available config types.");
    process.exit(1);
  }

  log.std.debug("Determining file type");
  const fileType = options.type ? parseFileType(options.type, configType) : configType.defaultType;

  // Verify it's a valid file type
  if (!fileType) {
    const msg = `Error: ${options.type} file type is not supported by ${configType.name}`;
    fatal.exit(colors.red(msg));
  }

  let indentAmount = 2;
  if (options.indent) {
    const result = strconv.parseInt(options.indent);
    if (result.isFailure()) {
      fatal.exitErr(result.failure(), "failed to parse indent option as a number");
    }

    indentAmount = result.success();
  }

  log.std.debug("Getting config template");
  const templateResult = config.configTemplate(configName);
  if (templateResult.isFailure()) {
    fatal.exitErr(templateResult.failure(), `failed to get config template for ${configName}`);
  }

  const configTemplate = templateResult.success();
  let destPath = "";
  let configData = "";

  if (options.packageJson) {
    // Check that package.json is supported
    const packageJsonKey = configType.packageJsonName;
    if (packageJsonKey === undefined) {
      const msg = `Error: ${configType.name} does not support configuration through a package.json.`;
      fatal.exit(colors.red(msg));
    }

    log.std.info("Creating config and adding to package.json");
    destPath = path.join(destDir, "package.json");
    if (!fs.fileExistsSync(destPath)) {
      fatal.exit(colors.red(`Error: No package.json at ${destDir}!`));
    }

    const result = fs.readFileSync(destPath, "utf-8");
    if (result.isFailure()) {
      fatal.exitErr(errors.fromJSError(result.failure()), `Failed to read ${destPath}`);
    }

    const packageJson = JSON.parse(result.success()) as Record<string, unknown>;
    if (packageJsonKey in packageJson && !options.force) {
      fatal.exit(colors.red(`${packageJsonKey} field already exists in package.json! Aborting.`));
    }

    packageJson[packageJsonKey] = configTemplate;
    configData = JSON.stringify(packageJson, null, indentAmount);
  } else {
    const configFileName = configType.fileNames.get(fileType);
    if (configFileName === undefined) {
      fatal.exit(colors.red(`${fileType} is not a valid file type for ${configType.name}`));
    }

    log.std.info(`Creating config ${configFileName}`);
    destPath = path.join(destDir, configFileName);
    if (fs.fileExistsSync(destPath) && !options.force) {
      fatal.exit(colors.red(`${destPath} already exists! Aborting.`));
    }

    const result = createConfigFile(configTemplate, fileType, indentAmount);
    if (result.isFailure()) {
      fatal.exitErr(result.failure(), `failed to create config file for ${configType.name}`);
    }

    configData = result.success();
  }

  err = fs
    .writeFileSync(destPath, configData, "utf8")
    .mapFailure((e) => errors.fromJSError(e))
    .failure();
  if (err !== undefined) {
    fatal.exitErr(err, `failed to write ${destPath}`);
  }

  log.std.info(colors.green(`Successfully wrote ${configType.name} config to ${destPath}`));
}
