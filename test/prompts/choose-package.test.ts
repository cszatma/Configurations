import inquirer from 'inquirer';

import choosePackage from '../../src/prompts/choose-package';
import configTypes from '../../src/utils/config-types';

jest.mock('inquirer');

describe('src/prompts/choose-package.ts tests', () => {
  let promptOriginal: typeof inquirer.prompt;

  beforeAll(() => {
    promptOriginal = inquirer.prompt;
  });

  afterAll(() => {
    inquirer.prompt = promptOriginal;
  });

  describe('choosePackage() tests', () => {
    it('returns the config type matching the choosen config name', async () => {
      inquirer.prompt = jest.fn().mockResolvedValue({
        packageName: 'eslint',
      }) as any;

      const configType = await choosePackage();
      expect(configType).toEqual(configTypes.eslint);
    });

    it('returns `undefined` if Other is selected', async () => {
      inquirer.prompt = jest.fn().mockResolvedValue({
        packageName: '__other__',
      }) as any;

      const configType = await choosePackage();
      expect(configType).toBeUndefined();
    });
  });
});
