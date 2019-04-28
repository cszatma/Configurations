import configTypes from '../utils/config-types';
import { logError } from '../utils/process-utils';
import { loadOptions } from '../utils/options';

export default function list(config?: string) {
  if (config) {
    listAvailableFileTypes(config);
  } else {
    listAllCommands();
  }
}

function listAllCommands() {
  printList(
    'Default configurations:',
    Object.values(configTypes),
    config => config.name,
  );

  const customConfigs = loadOptions().customConfigs;
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

function listAvailableFileTypes(configName: string) {
  const config = configTypes[configName];

  if (!config) {
    logError(`Error: ${configName} is not a valid config type!`);
    console.log('Use `config-gen list` to list all available config types.');
    process.exit(1);
  }

  printList(`Available file types for ${configName}:`, config.fileTypes);
  console.log(
    `Supports package.json: ${config.supportsPackageJson ? 'yes' : 'no'}`,
  );
}

function printList<T>(
  title: string,
  array: T[],
  formatItem?: (element: T) => string,
) {
  console.log(title);
  array.forEach(element => {
    const item = formatItem ? formatItem(element) : element;
    console.log(` - ${item}`);
  });
}
