import fs from 'fs-extra';

import configTypes from '../../src/utils/config-types';
import {
  parseConfigName,
  parseFileType,
} from '../../src/utils/parse-functions';
import { saveCustomConfig } from '../../src/utils/options';

jest.mock('os');
jest.mock('fs-extra');

const { __clearFiles } = fs as any;

describe('src/utils/parse-functions.ts tests', () => {
  beforeEach(() => {
    __clearFiles();
  });

  describe('parseConfigName() tests', () => {
    it('should return the prettier config object', () => {
      expect(parseConfigName('prettier')).toEqual({
        config: configTypes.prettier,
        isCustom: false,
      });
    });

    it('should return the eslint config object', () => {
      expect(parseConfigName('eslint')).toEqual({
        config: configTypes.eslint,
        isCustom: false,
      });
    });

    it('should parse a custom config', () => {
      saveCustomConfig('my-eslint', configTypes.eslint);

      expect(parseConfigName('my-eslint')).toEqual({
        config: configTypes.eslint,
        isCustom: true,
      });
    });
  });

  describe('parseFileType() tests', () => {
    it('should return the string `json`', () => {
      expect(parseFileType(' JSON   ', configTypes.eslint)).toBe('json');
    });

    it('should return null for ts', () => {
      expect(parseFileType('ts', configTypes.eslint)).toBeUndefined();
    });

    it('should return yaml', () => {
      expect(parseFileType('yaml', configTypes.eslint)).toBe('yaml');
    });

    it('should return yaml for `yml`', () => {
      expect(parseFileType('yml', configTypes.eslint)).toBe('yaml');
    });

    it('should trim a leading .', () => {
      expect(parseFileType('.json', configTypes.eslint)).toBe('json');
    });
  });
});
