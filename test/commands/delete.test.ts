import fs from 'fs-extra';
import chalk from 'chalk';
import inquirer from 'inquirer';

import deleteCmd from '../../src/commands/delete';
import { loadOptions } from '../../src/utils/options';

jest.mock('os');
jest.mock('fs-extra');
jest.mock('inquirer');

const { __clearFiles, __setMockFiles } = fs as any;

describe('src/commands/delete.ts tests', () => {
  let spyLog: jest.SpyInstance;
  let spyError: jest.SpyInstance;
  let spyExit: jest.SpyInstance;
  let stdoutData: string;
  let stderrData: string;
  let promptOriginal: typeof inquirer.prompt;

  beforeEach(() => {
    __clearFiles();
    __setMockFiles({
      'home/.configgenrc': '{ "customConfigs": { "my-eslint": "eslint" } }',
      'home/.config-gen/my-eslint.js': 'module.exports = {};',
    });
    loadOptions(true);

    stdoutData = '';
    stderrData = '';
    spyLog = jest.spyOn(console, 'log').mockImplementation((inputs: string) => {
      stdoutData += inputs;
      stdoutData += '\n';
    });
    spyError = jest
      .spyOn(console, 'error')
      .mockImplementation((inputs: string) => {
        stderrData += inputs;
        stderrData += '\n';
      });
    spyExit = jest
      .spyOn(process, 'exit')
      .mockImplementation((() => {}) as () => never);

    promptOriginal = inquirer.prompt;
  });

  afterEach(() => {
    spyLog.mockRestore();
    spyError.mockRestore();
    spyExit.mockRestore();
    inquirer.prompt = promptOriginal;
  });

  describe('delete() tests', () => {
    it('deletes the custom config', async () => {
      inquirer.prompt = jest.fn().mockResolvedValue({
        shouldDelete: true,
      }) as any;
      await deleteCmd('my-eslint', { force: false });

      expect(loadOptions(true)).toEqual({
        customConfigs: {},
      });
      expect(stdoutData).toBe(
        `${chalk.green('Successfully deleted my-eslint.')}\n`,
      );
      expect(spyExit).toHaveBeenCalledWith(0);
    });

    it('does nothing if the user does not confirm', async () => {
      inquirer.prompt = jest.fn().mockResolvedValue({
        shouldDelete: false,
      }) as any;
      await deleteCmd('my-eslint', { force: false });

      expect(loadOptions(true)).toEqual({
        customConfigs: { 'my-eslint': 'eslint' },
      });
      expect(stdoutData).toBe('');
      expect(spyExit).not.toHaveBeenCalled();
    });

    it('exits with a failure if the custom config does not exist', async () => {
      await deleteCmd('naw', { force: false });

      expect(stderrData).toBe(
        `${chalk.red('Error: Config named naw does not exist!')}\n`,
      );
      expect(spyExit).toHaveBeenCalledWith(1);
    });

    it('exists with a failure if an error occurs while deleting the custom config', async () => {
      inquirer.prompt = jest.fn().mockResolvedValue({
        shouldDelete: true,
      }) as any;
      fs.removeSync('home/.config-gen/my-eslint.js');
      await deleteCmd('my-eslint', { force: false });

      expect(stderrData).toBeDefined();
      expect(spyExit).toHaveBeenCalledWith(1);
    });
  });
});
