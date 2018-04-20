import chalk from 'chalk';

export default function logError(message?: any, ...optionalParams: any[]) {
    console.error(chalk.red(message, ...optionalParams));
}
