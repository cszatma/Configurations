import chalk from 'chalk';
import 'jest';

import * as processUtils from '../process-utils';
import '../type-extensions';

describe('Test process-utils', () => {
    let stdoutData = '';
    let stderrData = '';
    console.log = jest.fn((inputs: string) => (stdoutData += inputs));
    console.error = jest.fn((inputs: string) => (stderrData += inputs));
    const realExit = process.exit;
    let exitMock: () => void;

    beforeEach(() => {
        stdoutData = '';
        stderrData = '';
        exitMock = jest.fn();
        // @ts-ignore - ignore error as this is a mock
        process.exit = exitMock;
    });

    afterAll(() => {
        process.exit = realExit;
    });

    it('should console.error the message', () => {
        processUtils.logError('Error message');
        expect(stderrData).toBe(chalk.red('Error message'));
    });

    it('should console.log the message', () => {
        processUtils.logSuccess('Success message');
        expect(stdoutData).toBe(chalk.green('Success message'));
    });

    it('should call logError then exit with status code 1', () => {
        processUtils.exitFailure('Error message');
        expect(stderrData).toBe(chalk.red('Error message'));
        expect(exitMock).toHaveBeenCalledWith(1);
    });

    it('should call logSuccess then exit with status code 0', () => {
        processUtils.exitSuccess('Success message');
        expect(stdoutData).toBe(chalk.green('Success message'));
        expect(exitMock).toHaveBeenCalledWith(0);
    });
});
