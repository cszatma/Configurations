#!/usr/bin/env node

/* eslint-disable no-var */
/* eslint-disable prefer-template */

var nodeVersion = process.versions.node;
var majorVersion = parseInt(nodeVersion.split(".")[0], 10);

if (majorVersion < 10) {
  console.log(
    "You are running Node " +
      nodeVersion +
      ".\n" +
      "config-gen requires Node 10 or higher.\n" +
      "Please update your version of Node.",
  );

  process.exit(1);
}

require("./cli");
