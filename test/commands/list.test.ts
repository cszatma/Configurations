import fs from 'fs-extra';
import chalk from 'chalk';

import list from '../../src/commands/list';
import { loadOptions } from '../../src/utils/options';

jest.mock('os');
jest.mock('fs-extra');

const { __clearFiles, __setMockFiles } = fs as any;

describe('src/commands/list.ts tests', () => {
  let spyLog: jest.SpyInstance;
  let spyError: jest.SpyInstance;
  let spyExit: jest.SpyInstance;
  let stdoutData: string;
  let stderrData: string;

  beforeEach(() => {
    __clearFiles();

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
  });

  afterEach(() => {
    spyLog.mockRestore();
    spyError.mockRestore();
    spyExit.mockRestore();
  });

  describe('list() tests', () => {
    it('lists all available config types', () => {
      loadOptions(true);

      list();
      expect(stdoutData).toMatchInlineSnapshot(`
                        "Default configurations:
                         - babel
                         - eslint
                         - lint-staged
                         - prettier
                         - typescript
                         - tslint
                        "
                  `);
    });

    it('lists all configs including custom configs', () => {
      __setMockFiles({
        'home/.configgenrc': '{ "customConfigs": { "my-eslint": "eslint" } }',
      });
      loadOptions(true);

      list();
      expect(stdoutData).toMatchInlineSnapshot(`
                        "Default configurations:
                         - babel
                         - eslint
                         - lint-staged
                         - prettier
                         - typescript
                         - tslint
                        Custom configurations:
                         - my-eslint (eslint)
                        "
                  `);
    });

    it('lists the available file types for the config type', () => {
      list('eslint');
      expect(stdoutData).toMatchInlineSnapshot(`
                "Available file types for eslint:
                 - js
                 - json
                 - yaml
                Supports package.json: yes
                "
            `);
    });

    it('lists the available file types and shows no for package.json', () => {
      list('typescript');
      expect(stdoutData).toMatchInlineSnapshot(`
        "Available file types for typescript:
         - json
        Supports package.json: no
        "
      `);
    });

    it('exists with a failure if an unknown config type is passed', () => {
      list('naw');

      expect(stderrData).toBe(
        `${chalk.red('Error: naw is not a valid config type!')}\n`,
      );
      expect(stdoutData).toBe(
        'Use `config-gen list` to list all available config types.\n',
      );
      expect(spyExit).toHaveBeenCalledWith(1);
    });
  });
});
