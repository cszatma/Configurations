import { spawn } from 'child_process';

export interface CLIStatus {
  code: number;
  stdout: string;
  stderr?: string;
}

export const CONFIG_GEN_PATH = require.resolve('../../src/config-gen');
export const TS_NODE = require.resolve('ts-node/dist/bin');

export function runConfigGenCLI(args: string): Promise<CLIStatus> {
  return new Promise<CLIStatus>((resolve, reject) => {
    let stdout = '';
    let stderr = '';

    const childProcess = spawn(TS_NODE, [CONFIG_GEN_PATH, args], {
      cwd: __dirname,
      shell: true,
    });

    childProcess.on('error', error => reject(error));
    childProcess.stdout.on('data', data => {
      stdout += data.toString();
    });

    childProcess.stderr.on('data', data => {
      stderr += data.toString();
    });

    childProcess.on('close', code => {
      if (stderr) {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject({ code, stderr, stdout });
      } else {
        resolve({ code, stdout });
      }
    });
  });
}
