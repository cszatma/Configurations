import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';

import logError from '../utils/log-error';
import { parseConfigName, parseConfigType } from '../utils/parse-functions';
import { createJsFile, createJsonFile } from '../utils/util-functions';

export interface AddOptions {
    path: string;
    createDirectories: string;
    type: string;
    indent: string;
    packageJson: boolean;
    write: boolean;
    force: boolean;
}

export default function add(configName: string, options?: AddOptions) {
    const writeDirectory = options.path || process.cwd();

    // If a custom path was specified make sure it exists
    if (!fs.existsSync(writeDirectory)) {
        if (options.createDirectories || options.force) {
            // Create the directory as specified
            fs.mkdirSync(writeDirectory);
        } else {
            logError(`Error: ${writeDirectory} does not exist!`);
            process.exit(1);
        }
    }

    // Get the config type
    const config = parseConfigName(configName);

    // If config is null then configName was not a valid config
    if (!config) {
        logError(`Error: ${configName} is not a valid config!`);
        process.exit(1);
    }

    const configType = options.type
        ? parseConfigType(options.type, config)
        : config.defaultType;

    // Verify it's a valid file type
    if (!configType) {
        logError(
            `Error: ${options.type} file type is not supported by ${
                config.name
            }`,
        );
        process.exit(1);
    }

    const configTemplate = require('../templates/' + config.name);
    const indentAmount = options.indent ? parseInt(options.indent, 10) : 2;

    if (!indentAmount) {
        logError(
            'Error: A valid integer must be specified for the indent option.',
        );
        process.exit(1);
    }

    // Add the config to the package.json
    if (options.packageJson) {
        // Check that package.json is supported
        if (!config.supportsPackageJson) {
            logError(
                `Error: ${
                    config.name
                } does not support configuration through a package.json.`,
            );
            process.exit(1);
        }

        // Check that a package.json exists and import it
        const packageJsonPath = path.join(writeDirectory, 'package.json');
        if (!fs.existsSync(packageJsonPath)) {
            logError('Error: No package.json in the current directory!');
            process.exit(1);
        }

        const packageJson = require(packageJsonPath);
        packageJson[config.fileNames.packageJson] = configTemplate;

        fs.writeFileSync(
            packageJsonPath,
            createJsonFile(packageJson, indentAmount),
            'utf8',
        );

        console.log(
            chalk.green(
                `Successfully wrote ${config.name} config to package.json.`,
            ),
        );
    }

    const configFileName = config.fileNames[configType];
    const writePath = path.join(writeDirectory, configFileName);

    // If force option was not enabled, check that the file doesn't already exist
    if (!options.force && !options.write) {
        if (fs.existsSync(writePath)) {
            logError(`${configFileName} already exists! Aborting.`);
            process.exit(1);
        }
    }

    // Create the appropriate file
    const fileToWrite =
        configType === 'js'
            ? createJsFile(configTemplate, indentAmount)
            : createJsonFile(configTemplate, indentAmount);

    // Write the file
    try {
        fs.writeFileSync(writePath, fileToWrite, 'utf8');
        console.log(
            chalk.green(
                `Successfully wrote ${config.name} config to ${writePath}.`,
            ),
        );
        process.exit(0);
    } catch (error) {
        logError(
            `An error occured will writing ${
                config.name
            } config to ${writePath}:`,
        );
        logError(error);
        process.exit(1);
    }
}
