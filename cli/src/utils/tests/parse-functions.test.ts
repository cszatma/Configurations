import 'jest';

import configTypes from '../config-types';
import { parseConfigName, parseConfigType } from '../parse-functions';

describe('Test parse functions', () => {
    it('should return the prettier config object', () => {
        expect(parseConfigName('.prettier.config.js')).toBe(
            configTypes.prettier,
        );
    });

    it('should return the eslint config object', () => {
        expect(parseConfigName('.eslintrc.js')).toBe(configTypes.eslint);
    });

    it('should return the string `json`', () => {
        expect(parseConfigType(' JSON   ', configTypes.eslint)).toBe('json');
    });

    it('should return null for ts', () => {
        expect(parseConfigType('ts', configTypes.eslint)).toBeNull();
    });
});
