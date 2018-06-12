import fs from 'fs-extra';
import 'jest';
import path from 'path';

import { runConfigGenCLI } from './test-utils';

const resolveFile = (file: string) => path.resolve(__dirname, file);

describe('Tests for the add command', () => {
  beforeAll(() => {
    fs.writeFileSync(resolveFile('package.json'), JSON.stringify({}));
  });

  afterAll(() => {
    [
      '.prettierrc.json',
      '.eslintrc.js',
      '.lintstagedrc.yml',
      'package.json',
    ].forEach(file => {
      fs.unlinkSync(resolveFile(file));
    });
  });

  it('should print the help for config-gen add', () => {
    return runConfigGenCLI('add --help').then(({ stdout }) => {
      expect(stdout).toMatchSnapshot();
    });
  });

  it('should create a .prettierrc.json file', async () => {
    const { code, stdout } = await runConfigGenCLI('add prettier');
    const file = resolveFile('.prettierrc.json');

    expect(code).toBe(0);
    expect(stdout).toBe(`Successfully wrote prettier config to ${file}.\n`);
    expect(fs.existsSync(file)).toBe(true);
  });

  it('should create a .eslintrc.js file', async () => {
    const { code, stdout } = await runConfigGenCLI('add eslint --type js');
    const file = resolveFile('.eslintrc.js');

    expect(code).toBe(0);
    expect(stdout).toBe(`Successfully wrote eslint config to ${file}.\n`);
    expect(fs.existsSync(file)).toBe(true);
  });

  it('should create a .lintstagedrc.yml file', async () => {
    const { code, stdout } = await runConfigGenCLI(
      'add lint-staged --type yml',
    );
    const file = resolveFile('.lintstagedrc.yml');

    expect(code).toBe(0);
    expect(stdout).toBe(`Successfully wrote lint-staged config to ${file}.\n`);
    expect(fs.existsSync(file)).toBe(true);
  });

  it('should return an error since eslintrc.js already exists', () => {
    return runConfigGenCLI('add prettier').catch(({ code, stderr }) => {
      expect(code).toBe(1);
      expect(stderr).toBe('.prettierrc.json already exists! Aborting.\n');
    });
  });

  it('should create the file even though it exists since -w is passed', async () => {
    const { code, stdout } = await runConfigGenCLI('add prettier -w');
    const file = resolveFile('.prettierrc.json');

    expect(code).toBe(0);
    expect(stdout).toBe(`Successfully wrote prettier config to ${file}.\n`);
    expect(fs.existsSync(file)).toBe(true);
  });

  it('should add an eslintConfig object to package.json', async () => {
    const { code, stdout } = await runConfigGenCLI('add eslint --package-json');

    expect(code).toBe(0);
    expect(stdout).toBe('Successfully wrote eslint config to package.json.\n');

    const packageJson = require(resolveFile('package.json'));
    const template = require(resolveFile('../../templates/eslint'));
    expect(packageJson.eslintConfig).toEqual(template);
  });
});
