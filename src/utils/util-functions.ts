import yaml from 'js-yaml';
import stringifyObject from 'stringify-object';
import { cwd } from '@cszatma/process-utils';

import { FileType } from './config-types';

export function stripScope(name: string): string {
  if (name.charAt(0) === '@') {
    const index = name.indexOf('/');
    return name.slice(index + 1);
  }

  return name;
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
  // eslint-disable-next-line default-case
  switch (fileType) {
    case 'json':
      return createJsonFile(template, indent);
    case 'js':
      return createJsFile(template, indent);
    case 'yaml':
      return createYamlFile(template, indent);
  }

  throw new Error(`Invalid file type ${fileType}`);
}

export function getCwd(): string {
  if (process.env.NODE_ENV === 'dev') {
    return cwd();
  }

  return process.cwd();
}
