#!/usr/bin/env node

import chalk from 'chalk';
import commander from 'commander';
import fs from 'fs-extra';

import addCommand from './commands/add';
import stripScope from './utils/strip-scope';
import './utils/type-extensions';

const packageJson = require('../package.json');

const programName = stripScope(packageJson.name);

const program = new commander.Command(programName)
    .version(packageJson.version)
    .on('--help', () => {
        console.log(
            `\nRun \`${programName} COMMAND --help\` for more information about a given command.`,
        );
    });

program
    .command('add <config-name>')
    .description('Adds the given configuration file to your project')
    .usage('<config-name> [options]')
    .option(
        '-p, --path <path>',
        'Path to add config file, defaults to current directory',
    )
    .option('-n, --name <name>', 'Custom file name for the config file')
    .option(
        '-t, --type <type>',
        'File type, either js or json, defaults to json',
    )
    .option('-a, --append', 'Appends the config file to your package.json')
    .option('-f, --force', 'Overwrites a config file if it already exists')
    .action(addCommand);

program.parse(process.argv);

if (program.args.length < 1) {
    program.help();
    process.exit(0);
}
