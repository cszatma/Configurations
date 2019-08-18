import fs from 'fs-extra';

import {
  resolveConfig,
  loadOptions,
  saveOptions,
  saveCustomConfig,
  deleteCustomConfig,
} from '../../src/utils/options';
import configTypes from '../../src/utils/config-types';

jest.mock('os');
jest.mock('fs-extra');

const { __clearFiles, __setMockFiles } = fs as any;

describe('src/utils/options tests', () => {
  const mockFiles = {
    'home/.configgenrc': '{ "customConfigs": { "my-eslint": "eslint" } }',
  };
  let spyError: jest.SpyInstance;
  let spyExit: jest.SpyInstance;
  let stderrData: string;

  beforeEach(() => {
    __clearFiles();

    stderrData = '';
    spyError = jest
      .spyOn(console, 'error')
      .mockImplementation((inputs: string) => {
        stderrData += inputs;
      });
    spyExit = jest
      .spyOn(process, 'exit')
      .mockImplementation((() => {}) as () => never);
  });

  afterEach(() => {
    spyError.mockRestore();
    spyExit.mockRestore();
  });

  describe('resolveConfig() tests', () => {
    it('resolves the path to the config', () => {
      expect(resolveConfig('.eslintrc')).toBe('home/.config-gen/.eslintrc');
    });
  });

  describe('loadOptions() tests', () => {
    beforeEach(() => {
      jest.resetModules();
    });

    it('loads the default options when the configgenrc does not exist', () => {
      expect(loadOptions(true)).toEqual({
        customConfigs: {},
      });
    });

    it('loads the configgenrc when it exists', () => {
      __setMockFiles(mockFiles);

      expect(loadOptions(true)).toEqual({
        customConfigs: { 'my-eslint': 'eslint' },
      });
    });

    it('exits with a failure if it cannot parse the configgenrc', () => {
      __setMockFiles({ 'home/.configgenrc': '{' });

      loadOptions(true);

      expect(stderrData).toBeTruthy();
      expect(spyExit).toHaveBeenCalledWith(1);
    });
  });

  describe('saveOptions() tests', () => {
    it('saves the configgenrc', () => {
      const options = {
        customConfigs: {
          'ts-custom': 'typescript',
        },
      };

      saveOptions(options);

      expect(JSON.parse(fs.readFileSync('home/.configgenrc', 'utf-8'))).toEqual(
        options,
      );
    });

    it('exits with a failure if it cannot save the configgenrc', () => {
      jest.spyOn(JSON, 'stringify').mockImplementationOnce(() => {
        throw new Error('oh noes');
      });

      saveOptions({
        customConfigs: {
          'ts-custom': 'typescript',
        },
      });

      expect(stderrData).toBeTruthy();
      expect(spyExit).toHaveBeenCalledWith(1);
    });

    it('uses the cachedOptions if no options are given', () => {
      __setMockFiles(mockFiles);

      loadOptions(true);
      saveOptions();

      expect(JSON.parse(fs.readFileSync('home/.configgenrc', 'utf-8'))).toEqual(
        {
          customConfigs: { 'my-eslint': 'eslint' },
        },
      );
    });
  });

  describe('saveCustomConfig() tests', () => {
    it('saves the custom config', () => {
      __setMockFiles(mockFiles);

      saveCustomConfig('prettified', configTypes.prettier);

      const expected = {
        'my-eslint': 'eslint',
        prettified: 'prettier',
      };

      expect(loadOptions().customConfigs).toEqual(expected);
      expect(
        JSON.parse(fs.readFileSync('home/.configgenrc', 'utf-8')).customConfigs,
      ).toEqual(expected);
    });
  });

  describe('deleteCustomConfig() tests', () => {
    __setMockFiles(mockFiles);

    deleteCustomConfig('my-eslint');

    expect(loadOptions().customConfigs).toEqual({});
    expect(
      JSON.parse(fs.readFileSync('home/.configgenrc', 'utf-8')).customConfigs,
    ).toEqual({});
  });
});
