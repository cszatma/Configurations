import 'jest';

import { runConfigGenCLI } from './test-utils';

const rootPackageJson = require('../../../package.json');

describe('Test general config-gen options', () => {
    it('should print the version number', async () => {
        const { stdout } = await runConfigGenCLI('-v');
        expect(stdout).toBe(rootPackageJson.version + '\n');
    });

    it('should print the help for config-gen', async () => {
        const { stdout } = await runConfigGenCLI('--help');
        expect(stdout).toMatchSnapshot();
    });

    it('should print the help when no arguments are passed', async () => {
        const { stdout } = await runConfigGenCLI('');
        expect(stdout).toMatchSnapshot();
    });

    it('should exit with an error when an unknown command is passed', () => {
        return runConfigGenCLI('does-not-exits').catch(
            ({ code, stderr, stdout }) => {
                expect(code).toBe(1);
                expect(stderr).toBe(
                    'Error: does-not-exits is not a valid command!\n',
                );
                expect(stdout).toBe(
                    'Use `config-gen --help` to see a list of available commands.\n',
                );
            },
        );
    });
});
