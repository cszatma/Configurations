import { Optional } from '../types/aliases';
import configTypes, {
  ConfigType,
  FILE_ALIASES,
  FileType,
} from './config-types';

export function parseConfigName(configName: string): Optional<ConfigType> {
  const normalizedName = configName.trim().toLowerCase();

  // See if one of the configs matches the config name
  return Object.values(configTypes).find(
    config => normalizedName === config.name,
  );
}

export function parseConfigType(
  type: string,
  config: ConfigType,
): Optional<FileType> {
  const normalizedType = type.trim().toLowerCase() as FileType;
  const fileType = FILE_ALIASES.get(normalizedType) || normalizedType;

  return config.fileTypes.includes(fileType) ? fileType : undefined;
}
