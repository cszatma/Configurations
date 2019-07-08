import configTypes from '../config-types';
import { parseConfigName, parseFileType } from '../parse-functions';

describe('Test parse functions', () => {
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
});
