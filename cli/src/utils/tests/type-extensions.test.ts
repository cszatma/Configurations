import 'jest';

import configTypes from '../config-types';
import '../type-extensions';

describe('Test standard type extensions', () => {
    const values = [
        configTypes.babel,
        configTypes.eslint,
        configTypes.lintStaged,
        configTypes.prettier,
        configTypes.ts,
        configTypes.tslint,
    ];

    const testArray = [1, 2, 3, 4, 5];

    it('should return an array of values', () => {
        expect(Object.values(configTypes)).toEqual(values);
    });

    it('should return true for array.includes', () => {
        expect(testArray.includes(2)).toBe(true);
    });

    it('should return false for array.includes past a certain index', () => {
        expect(testArray.includes(2, 2)).toBe(false);
    });

    it('should return false for array.includes a value that does not exist', () => {
        expect(testArray.includes(6)).toBe(false);
    });

    it('should return the last element which is 4', () => {
        expect([1, 2, 3, 4].last()).toBe(4);
    });

    it('should return the last element which is `d`', () => {
        expect(['a', 'b', 'c', 'd'].last()).toBe('d');
    });
});
