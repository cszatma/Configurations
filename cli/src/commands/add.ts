import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';

export interface AddOptions {
    path: string;
    force: boolean;
}

export default function add(configName: string, options?: AddOptions) {
    const directory = process.cwd();

    // If force option was not enabled, check that the file doesn't already exist
    if (!options.force) {
        if (fs.existsSync(path.join(directory, configName))) {
            console.log(chalk.red(`${configName} already exists! Aborting.`));
            return;
        }
    }

    // Proceed with adding config file
}
