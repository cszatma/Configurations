import { spawn } from 'child_process';
import fs from 'fs-extra';
import 'jest';
import path from 'path';
import configTypes from '../../utils/config-types';

const CONFIG_GEN_PATH = require.resolve('../../config-gen');
const TS_NODE = require.resolve('ts-node/dist/bin');

const resolveFile = (file: string) => path.resolve(__dirname, file);

describe('Tests for the add command', () => {
    beforeAll(() => {
        fs.writeFileSync(resolveFile('package.json'), JSON.stringify({}));
    });

    afterAll(() => {
        ['.prettierrc.json', '.eslintrc.js', 'package.json'].forEach(file =>
            fs.unlinkSync(resolveFile(file)),
        );
    });

    it('should print the help for config-gen', () => {
        return runConfigGenCLI('--help').then(({ stdout }) => {
            expect(stdout).toMatchSnapshot();
        });
    });

    it('should print the help for config-gen add', () => {
        return runConfigGenCLI('add --help').then(({ stdout }) => {
            expect(stdout).toMatchSnapshot();
        });
    });

    it('should create a .prettierrc.json file', () => {
        return runCLIAndAssertFileOutput('add prettier', '.prettierrc.json');
    });

    it('should create a .eslintrc.js file', () => {
        return runCLIAndAssertFileOutput(
            'add .eslintrc --type js',
            '.eslintrc.js',
        );
    });

    it('should return an error since eslintrc.js already exists', () => {
        return runCLIAndAssertError('add eslint --type js');
    });

    it('should create the file even though it exists since -w is passed', () => {
        return runCLIAndAssertFileOutput('add prettier -w', '.prettierrc.json');
    });

    it('should add an eslintConfig object to package.json', () => {
        return runCLIAndAssertPackageJson('add eslint -P', 'eslint');
    });
});

interface CLIStatus {
    stdout?: string;
    stderr?: string;
    code: number;
}

function runConfigGenCLI(args: string): Promise<CLIStatus> {
    return new Promise<CLIStatus>((resolve, reject) => {
        let stdout = '';
        let stderr = '';

        const childProcess = spawn(TS_NODE, [CONFIG_GEN_PATH, args], {
            cwd: __dirname,
            shell: true,
        });

        childProcess.on('error', error => reject(error));
        childProcess.stdout.on('data', data => {
            stdout += data.toString();
        });

        childProcess.stderr.on('data', data => {
            stderr += data.toString();
        });

        childProcess.on('close', code => {
            if (stderr) {
                reject({ stderr, code });
            } else {
                resolve({ stdout, code });
            }
        });
    });
}

function runCLIAndAssertFileOutput(args: string, fileName: string) {
    return runConfigGenCLI(args).then(({ stdout, code }) => {
        expect(stdout).toMatchSnapshot();
        expect(code).toBe(0);
        expect(fs.existsSync(resolveFile(fileName))).toBe(true);
    });
}

function runCLIAndAssertPackageJson(args: string, configName: string) {
    return runConfigGenCLI(args).then(({ stdout, code }) => {
        expect(stdout).toMatchSnapshot();
        expect(code).toBe(0);

        const packageJson = require(resolveFile('package.json'));
        const template = require(resolveFile('../../templates/' + configName));
        const configPackageJsonName =
            configTypes[configName].fileNames.packageJson;
        expect(packageJson[configPackageJsonName]).toEqual(template);
    });
}

function runCLIAndAssertError(args: string) {
    return runConfigGenCLI(args).catch(({ stderr, code }) => {
        expect(stderr).toMatchSnapshot();
        expect(code).toBe(1);
    });
}
