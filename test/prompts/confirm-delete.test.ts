import inquirer from 'inquirer';

import confirmDelete from '../../src/prompts/confirm-delete';

jest.mock('inquirer');

describe('src/prompts/confirm-delete.ts tests', () => {
  let promptOriginal: typeof inquirer.prompt;

  beforeAll(() => {
    promptOriginal = inquirer.prompt;
  });

  afterAll(() => {
    inquirer.prompt = promptOriginal;
  });

  describe('confirmDelete() tests', () => {
    it('returns a boolean indicating whether or not to delete', async () => {
      inquirer.prompt = jest.fn().mockResolvedValue({
        shouldDelete: true,
      }) as any;

      const shouldDelete = await confirmDelete('my-eslint');
      expect(shouldDelete).toBe(true);
    });
  });
});
