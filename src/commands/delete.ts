import fs from 'fs-extra';

import {
  deleteCustomConfig,
  loadOptions,
  resolveConfig,
} from '../utils/options';
import { exitFailure, exitSuccess } from '../utils/process-utils';
import confirmDelete from '../prompts/confirm-delete';

interface DeleteOptions {
  force: boolean;
}

export default async function(
  configName: string,
  options: DeleteOptions,
): Promise<void> {
  const customConfigs = loadOptions().customConfigs;

  if (!(configName in customConfigs)) {
    exitFailure(`Error: Config named ${configName} does not exist!`);
  }

  const shouldDelete = options.force || (await confirmDelete(configName));

  if (!shouldDelete) {
    return;
  }

  deleteCustomConfig(configName);

  try {
    fs.removeSync(resolveConfig(`${configName}.js`));
    exitSuccess(`Successfully deleted ${configName}.`);
  } catch (error) {
    exitFailure(`An error occurred while deleting ${configName}:\n` + error);
  }
}
