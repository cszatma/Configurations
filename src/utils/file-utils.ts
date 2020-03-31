import path from "path";
import fs from "fs-extra";
import yaml from "js-yaml";
import stringifyObject from "stringify-object";

import { FileType } from "./config-types";

export function readConfigFile(filePath: string): any {
  const fileExt = path.extname(filePath);

  if (fileExt === ".yaml" || fileExt === ".yml") {
    return yaml.safeLoad(fs.readFileSync(filePath, "utf-8"));
  }

  return fs.readJsonSync(filePath);
}

export function createJsFile(object: any, indent = 2): string {
  const stringifiedObject = stringifyObject(object, {
    indent: " ".repeat(indent),
  });
  return `module.exports = ${stringifiedObject};`;
}

export function createConfigFile(
  template: any,
  fileType: FileType,
  indent = 2,
): string {
  switch (fileType) {
    case "json":
      return JSON.stringify(template, null, indent);
    case "js":
      return createJsFile(template, indent);
    case "yaml":
      return yaml.dump(template, { indent });
    default:
      throw new Error(`Invalid file type ${fileType}`);
  }
}
