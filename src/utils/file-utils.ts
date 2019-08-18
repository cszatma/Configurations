import path from 'path';
import fs from 'fs-extra';
import yaml from 'js-yaml';
import stringifyObject from 'stringify-object';

import { FileType } from './config-types';

export function readConfigFile(filePath: string): any {
  const fileExt = path.extname(filePath);

  if (fileExt === '.yaml' || fileExt === '.yml') {
    return yaml.safeLoad(fs.readFileSync(filePath, 'utf-8'));
  }

  return fs.readJsonSync(filePath);
}

export function createJsonFile(object: any, indent: number = 2): string {
  return JSON.stringify(object, null, indent);
}

export function createJsFile(object: any, indent: number = 2): string {
  const stringifiedObject = stringifyObject(object, {
    indent: ' '.repeat(indent),
  });
  return `module.exports = ${stringifiedObject};`;
}

export function createYamlFile(object: any, indent: number = 2): string {
  return yaml.dump(object, { indent });
}

export function createConfigFile(
  template: any,
  fileType: FileType,
  indent?: number,
): string {
  switch (fileType) {
    case 'json':
      return createJsonFile(template, indent);
    case 'js':
      return createJsFile(template, indent);
    case 'yaml':
      return createYamlFile(template, indent);
    default:
      throw new Error(`Invalid file type ${fileType}`);
  }
}
