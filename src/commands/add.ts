import fs from 'fs-extra';
import path from 'path';
import {
  exitFailure,
  exitSuccess,
  logError,
  cwd,
} from '@cszatma/process-utils';

import { parseConfigName, parseFileType } from '../utils/parse-functions';
import { createConfigFile } from '../utils/file-utils';
import { resolveConfig } from '../utils/options';

export interface AddOptions {
  path: string;
  createDirectories: string;
  type: string;
  indent: string;
  packageJson: boolean;
  write: boolean;
  force: boolean;
}

const getWd = () => (process.env.NODE_ENV === 'dev' ? cwd() : process.cwd());

export default function add(configName: string, options: AddOptions): void {
  const writeDirectory = options.path || getWd();

  // If a custom path was specified make sure it exists
  if (!fs.existsSync(writeDirectory)) {
    if (options.createDirectories || options.force) {
      // Create the directory as specified
      fs.mkdirSync(writeDirectory);
    } else {
      exitFailure(`Error: ${writeDirectory} does not exist!`);
    }
  }

  // Get the config type
  const { config, isCustom } = parseConfigName(configName);

  // If config is null then configName was not a valid config
  if (!config) {
    logError(`Error: ${configName} is not a valid config!`);
    console.log('Use `config-gen list` to list all available config types.');
    return process.exit(1);
  }

  const fileType = options.type
    ? parseFileType(options.type, config)
    : config.defaultType;

  // Verify it's a valid file type
  if (!fileType) {
    return exitFailure(
      `Error: ${options.type} file type is not supported by ${config.name}`,
    );
  }

  // Get config file
  const configPath = isCustom
    ? resolveConfig(configName)
    : `../templates/${config.name}`;
  // eslint-disable-next-line
  const configTemplate = require(configPath);
  const indentAmount = options.indent ? parseInt(options.indent, 10) : 2;

  if (!indentAmount) {
    exitFailure(
      'Error: A valid integer must be specified for the indent option.',
    );
  }

  // Add the config to the package.json
  if (options.packageJson) {
    // Check that package.json is supported
    if (!config.supportsPackageJson) {
      exitFailure(
        `Error: ${config.name} does not support configuration through a package.json.`,
      );
    }

    // Check that a package.json exists and import it
    const packageJsonPath = path.join(writeDirectory, 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
      exitFailure('Error: No package.json in the current directory!');
    }

    // eslint-disable-next-line
    const packageJson = require(packageJsonPath);
    // config.fileNmaes.packageJson can't be undefined since we
    // already checked config.supportsPackageJson
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    packageJson[config.fileNames.packageJson!] = configTemplate;

    fs.writeFileSync(
      packageJsonPath,
      JSON.stringify(packageJson, null, indentAmount),
      'utf8',
    );

    exitSuccess(`Successfully wrote ${config.name} config to package.json.`);
  }

  const configFileName = config.fileNames[fileType];
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const writePath = path.join(writeDirectory, configFileName!);

  // If force option was not enabled, check that the file doesn't already exist
  if (!options.force && !options.write) {
    if (fs.existsSync(writePath)) {
      exitFailure(`${configFileName} already exists! Aborting.`);
    }
  }

  // Create the appropriate file
  const fileToWrite = createConfigFile(configTemplate, fileType, indentAmount);

  // Write the file
  try {
    fs.writeFileSync(writePath, fileToWrite, 'utf8');
    return exitSuccess(
      `Successfully wrote ${config.name} config to ${writePath}.`,
    );
  } catch (error) {
    return exitFailure(
      `An error occured will writing ${config.name} config to ${writePath}:\n${error}`,
    );
  }
}
