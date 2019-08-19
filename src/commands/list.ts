import { logError } from '@cszatma/process-utils';

import configTypes from '../utils/config-types';
import { loadOptions } from '../utils/options';
import { findConfigWithName } from '../utils/config-utils';

function printList<T>(
  title: string,
  array: T[],
  formatItem?: (element: T) => string,
): void {
  console.log(title);
  array.forEach(element => {
    const item = formatItem ? formatItem(element) : element;
    console.log(` - ${item}`);
  });
}

function listAllCommands(): void {
  printList(
    'Default configurations:',
    Object.values(configTypes),
    config => config.name,
  );

  const { customConfigs } = loadOptions();
  const keys = Object.keys(customConfigs);

  if (keys.length === 0) {
    return;
  }

  // Print custom configs
  printList(
    'Custom configurations:',
    keys,
    key => `${key} (${customConfigs[key]})`,
  );
}

function listAvailableFileTypes(configName: string): void {
  const config = findConfigWithName(configName);

  if (!config) {
    logError(`Error: ${configName} is not a valid config type!`);
    console.log('Use `config-gen list` to list all available config types.');
    process.exit(1);
    return;
  }

  printList(`Available file types for ${configName}:`, config.fileTypes);
  console.log(
    `Supports package.json: ${config.supportsPackageJson ? 'yes' : 'no'}`,
  );
}

export default function list(config?: string): void {
  if (config) {
    listAvailableFileTypes(config);
  } else {
    listAllCommands();
  }
}
