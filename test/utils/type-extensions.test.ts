import configTypes from '../../src/utils/config-types';
import '../../src/utils/type-extensions';

describe('Test standard type extensions', () => {
  const values = [
    configTypes.babel,
    configTypes.eslint,
    configTypes.lintStaged,
    configTypes.prettier,
    configTypes.ts,
    configTypes.tslint,
  ];

  it('should return an array of values', () => {
    expect(Object.values(configTypes)).toEqual(values);
  });
});
