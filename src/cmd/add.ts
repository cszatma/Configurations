import path from "path";
import { colors, fatal, log, panic } from "@cszatma/node-stdlib";

import * as config from "../config/mod";
import { chooseConfigTypePrompt } from "../prompt/mod";
import {
  configTypes,
  configWithFileName,
  parseFileType,
  CUSTOM_CONFIG_TYPE_NAME,
  FileType,
} from "../util/config_types";

export interface AddOptions {
  name: string;
  force: boolean;
}

export async function addCmd(configFile: string, options: AddOptions): Promise<void> {
  let err = config.init();
  if (err !== undefined) {
    fatal.exitErr(err, "Failed to initialize config");
  }

  const pathInfo = path.parse(configFile);
  const configName = options.name ? path.parse(options.name).name : pathInfo.name;

  if (configName in config.configs() && !options.force) {
    const msg = `${configName} already exists! If you wish to replace it use the '--force' option.`;
    fatal.exit(colors.red(msg));
  }

  log.std.debug("Determining config type");
  let configType = configWithFileName(configFile);
  if (!configType) {
    // Couldn't determine config type from file name, have user explicitly specify
    const configTypeNames = [...configTypes.keys()];
    const name = await chooseConfigTypePrompt(configTypeNames);

    // Handle custom
    if (name === CUSTOM_CONFIG_TYPE_NAME) {
      fatal.exit("Custom package configs are currently not supported.");
    }

    const ct = configTypes.get(name);
    if (!ct) {
      // This is a bug, name should always be valid
      panic(`could not get config type named ${name}`);
    }

    configType = ct;
  }

  log.std.debug("Determining file type");

  // Assume json if no file extension since most configs allow this
  // ex: .eslintrc, .prettierrc
  const fileType = parseFileType(pathInfo.ext, configType) ?? FileType.json;
  if (!fileType) {
    fatal.exit(colors.red(`${pathInfo.ext} file type is not supported by ${configType.name}`));
  }

  log.std.info(`Adding config ${configName}`);
  err = config.addConfig(configName, configType, configFile);
  if (err !== undefined) {
    fatal.exitErr(err, `Failed to add config ${configName}`);
  }

  log.std.info(colors.green(`Successfully added ${configName}`));
}
