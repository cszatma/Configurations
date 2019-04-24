import path from 'path';
import os from 'os';
import fs from 'fs-extra';

import { exitFailure } from './process-utils';
import { ConfigType } from './config-types';

export interface Options {
  customConfigs: {
    [key: string]: string;
  };
}

const emptyOptions = (): Options => ({
  customConfigs: {},
});

export const configDir = path.join(os.homedir(), '.config-gen');
export const rcPath = path.join(os.homedir(), '.configgenrc');
export const resolveConfig = (configName: string) =>
  path.join(configDir, configName);

let cachedOptions: Options;

export function loadOptions(force?: boolean): Options {
  if (cachedOptions && !force) {
    return cachedOptions;
  }

  if (fs.existsSync(rcPath)) {
    // Reac rc file
    try {
      cachedOptions = JSON.parse(fs.readFileSync(rcPath, 'utf-8'));
    } catch (error) {
      exitFailure(
        `Error loading saved preferences. ~/.configgenrc might be corrupted or have synatx errors. Please fix/delete it then rerun config-gen.\n(${
          error.message
        }`,
      );
    }

    return cachedOptions;
  } else {
    return emptyOptions();
  }
}

export function saveOptions(options: Options = cachedOptions): void {
  try {
    fs.writeFileSync(rcPath, JSON.stringify(options, null, 2));
  } catch (error) {
    exitFailure(
      `Error writing preferences: make sure you have write access to ${rcPath}.\n(${
        error.message
      })`,
    );
  }
}

export function saveCustomConfig(
  configName: string,
  configType: ConfigType,
): void {
  const options = loadOptions();
  options.customConfigs[configName] = configType.name;

  saveOptions(options);
}
