import 'jest';

import { runConfigGenCLI } from './test-utils';

describe('Tests for the list command', () => {
    it('should list all available configs', async () => {
        const { code, stdout } = await runConfigGenCLI('list');
        expect(code).toBe(0);
        expect(stdout).toMatchSnapshot();
    });

    it('should word with the ls alias', async () => {
        const { code, stdout } = await runConfigGenCLI('ls');
        expect(code).toBe(0);
        expect(stdout).toMatchSnapshot();
    });

    it('should list all available file types for a given config', async () => {
        const { code, stdout } = await runConfigGenCLI('list eslint');
        expect(code).toBe(0);
        expect(stdout).toMatchSnapshot();
    });
});
