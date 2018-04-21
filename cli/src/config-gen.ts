import commander from 'commander';

import addCommand from './commands/add';
import './utils/type-extensions';
import { stripScope } from './utils/util-functions';

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
    .option(
        '-c, --create-directories',
        'Automatically creates intermediate directories in the given path if they do not exist',
    )
    .option(
        '-t, --type <type>',
        'File type, either js or json, defaults to json',
    )
    .option('-P, --package-json', 'Adds the config file to your package.json')
    .option('-w, --write', 'Overwrites a config file if it already exists')
    .option(
        '-f, --force',
        'Equivalent to calling both --path-create and --write',
    )
    .action(addCommand);

program.parse(process.argv);

if (program.args.length < 1) {
    program.help();
    process.exit(0);
}
