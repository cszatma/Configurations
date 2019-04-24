#!/usr/bin/env node

/* tslint:disable */

var chalk = require('chalk');
var semver = require('semver');

var currentNodeVersion = process.versions.node;

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

require('./config-gen');
