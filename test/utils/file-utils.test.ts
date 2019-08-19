import fs from 'fs-extra';

import {
  readConfigFile,
  createJsFile,
  createConfigFile,
} from '../../src/utils/file-utils';

jest.mock('fs-extra');

const { __clearFiles, __setMockFiles } = fs as any;

describe('src/utils/file-utils.ts tests', () => {
  beforeEach(() => {
    __clearFiles();
  });

  describe('readConfigFile() tests', () => {
    it('reads the json config file', () => {
      __setMockFiles({
        'home/.eslintrc.json': '{ "rules": { "no-console": ["off"] } }',
      });

      expect(readConfigFile('home/.eslintrc.json')).toEqual({
        rules: {
          'no-console': ['off'],
        },
      });
    });

    it('reads the yaml config file', () => {
      __setMockFiles({
        'home/.eslintrc.yaml': `rules:
  no-console:
    - off
`,
      });

      expect(readConfigFile('home/.eslintrc.yaml')).toEqual({
        rules: {
          'no-console': ['off'],
        },
      });
    });
  });

  describe('createJsFile() tests', () => {
    it('creates a js file with the given indentation', () => {
      const stringified = createJsFile({ isCustom: true }, 4);

      expect(stringified).toBe(`module.exports = {
    isCustom: true
};`);
    });

    it('creates a js file with the default indentation', () => {
      const stringified = createJsFile({ isCustom: true });

      expect(stringified).toBe(`module.exports = {
  isCustom: true
};`);
    });
  });

  describe('createConfigFile() tests', () => {
    const object = { isCustom: true };

    it('creates a json string', () => {
      const stringified = createConfigFile(object, 'json');

      expect(stringified).toBe(`{
  "isCustom": true
}`);
    });

    it('creates a js string', () => {
      const stringified = createConfigFile(object, 'js');

      expect(stringified).toBe(`module.exports = {
  isCustom: true
};`);
    });

    it('creates a yaml string', () => {
      const stringified = createConfigFile(object, 'yaml');

      expect(stringified).toBe('isCustom: true\n');
    });

    it('throws an error when an invalid file type is given', () => {
      expect(() => {
        createConfigFile({}, 'naw' as any);
      }).toThrow(/^Invalid file type naw$/);
    });
  });
});
