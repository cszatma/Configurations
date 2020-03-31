import { ConfigType, configTypesArray } from "./config-types";
import { Optional } from "../types/aliases";

export const findConfigWithName = (name: string): Optional<ConfigType> =>
  configTypesArray.find((config) => name === config.name);

export const findConfigWithFileName = (
  fileName: string,
): Optional<ConfigType> =>
  configTypesArray.find((config) =>
    Object.values(config.fileNames).includes(fileName),
  );
