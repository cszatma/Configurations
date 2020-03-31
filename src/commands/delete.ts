import fs from "fs-extra";
import { exitFailure, exitSuccess } from "@cszatma/process-utils";

import {
  deleteCustomConfig,
  loadOptions,
  resolveConfig,
} from "../utils/options";
import confirmDelete from "../prompts/confirm-delete";

interface DeleteOptions {
  force: boolean;
}

export default async function (
  configName: string,
  options: DeleteOptions,
): Promise<void> {
  const { customConfigs } = loadOptions();

  if (!(configName in customConfigs)) {
    exitFailure(`Error: Config named ${configName} does not exist!`);
    return;
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
    exitFailure(`An error occurred while deleting ${configName}:\n${error}`);
  }
}
