import { colors, fatal, log } from "@cszatma/node-stdlib";

import * as config from "../config/mod";
import { confirmDeletePrompt } from "../prompt/mod";

interface DeleteOptions {
  force: boolean;
}

export async function deleteCmd(configName: string, options: DeleteOptions): Promise<void> {
  let err = config.init();
  if (err !== undefined) {
    fatal.exitErr(err, "Failed to initialize config");
  }

  if (!(configName in config.configs())) {
    fatal.exit(colors.red(`Error: Config named ${configName} does not exist!`));
  }

  const shouldDelete = options.force || (await confirmDeletePrompt(configName));
  if (!shouldDelete) {
    log.std.info("Deletion aborted");
    return;
  }

  log.std.info(`Deleting config ${configName}`);
  err = config.deleteConfig(configName);
  if (err !== undefined) {
    console.log(err.detailedError());
    fatal.exitErr(err, `Failed to delete config ${configName}`);
  }

  log.std.info(colors.green(`Successfully deleted ${configName}`));
}
