import { Optional } from "../types/aliases";
import { ConfigType, FILE_ALIASES, FileType } from "./config-types";
import { loadOptions } from "./options";
import { findConfigWithName } from "./config-utils";

export interface ParseResult {
  config?: ConfigType;
  isCustom: boolean;
}

export function parseConfigName(configName: string): ParseResult {
  const { customConfigs } = loadOptions();
  const isCustom = configName in customConfigs;
  const name = isCustom ? customConfigs[configName] : configName;

  return { config: findConfigWithName(name), isCustom };
}

export function parseFileType(
  type: string,
  config: ConfigType,
): Optional<FileType> {
  const trimmed = type.trim();
  const normalizedType = (trimmed.charAt(0) === "."
    ? trimmed.slice(1)
    : trimmed
  ).toLowerCase() as FileType;
  const fileType = FILE_ALIASES.get(normalizedType) || normalizedType;

  return config.fileTypes.includes(fileType) ? fileType : undefined;
}
