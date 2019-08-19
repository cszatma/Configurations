import {
  findConfigWithName,
  findConfigWithFileName,
} from '../../src/utils/config-utils';
import configTypes from '../../src/utils/config-types';

describe('src/utils/config-utils tests', () => {
  describe('findConfigWithName() tests', () => {
    it('returns the config type with the given name', () => {
      expect(findConfigWithName('babel')).toEqual(configTypes.babel);
    });

    it('returns `undefined` when the config type does not exist', () => {
      expect(findConfigWithName('oh-noes')).toBeUndefined();
    });
  });

  describe('findConfigWithFileName() tests', () => {
    it('returns the config type with the given file name', () => {
      expect(findConfigWithFileName('tsconfig.json')).toEqual(configTypes.ts);
    });

    it('returns `undefined` when there is no config type with the file name', () => {
      expect(findConfigWithFileName('oh-noes.json')).toBeUndefined();
    });
  });
});
