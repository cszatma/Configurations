#!/usr/bin/env node

import chalk from 'chalk';
import commander from 'commander';
import fs from 'fs-extra';

import addCommand from './commands/add';
import stripScope from './utils/strip-scope';

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
    .option('-f, --force', 'Overwrites a config file if it already exists')
    .action(addCommand);

program.parse(process.argv);
