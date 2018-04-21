#!/usr/bin/env node

import chalk from 'chalk';
import semver from 'semver';

const currentNodeVersion = process.versions.node;

if (semver.lt(currentNodeVersion, '6.0.0')) {
    console.log(
        chalk.red(
            `You are running Node ${currentNodeVersion}.\n` +
                'config-gen requires Node 6 or higher.\n' +
                'Please update your version of Node.',
        ),
    );

    process.exit(1);
}

import './config-gen';
