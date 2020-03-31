// List of available config types

import { Optional } from "../types/aliases";

export type FileType = "js" | "json" | "yaml";

export const FILE_TYPES: FileType[] = ["js", "json", "yaml"];
export const FILE_ALIASES: Map<string, FileType> = new Map<string, FileType>([
  ["yml", "yaml"],
]);

export interface ConfigType {
  readonly defaultType: FileType;
  readonly fileTypes: FileType[];
  readonly fileNames: {
    readonly js?: string;
    readonly json?: string;
    readonly yaml?: string;
    readonly packageJson?: string;
    readonly [key: string]: Optional<string>;
  };
  readonly name: string;
  readonly supportsPackageJson: boolean;
}

export interface Configs {
  readonly [config: string]: ConfigType;
}

const babel: ConfigType = {
  defaultType: "json",
  fileNames: {
    js: ".babelrc.js",
    json: ".babelrc",
    packageJson: "babel",
  },
  fileTypes: ["js", "json"],
  name: "babel",
  supportsPackageJson: true,
};

const eslint: ConfigType = {
  defaultType: "json",
  fileNames: {
    js: ".eslintrc.js",
    json: ".eslintrc.json",
    packageJson: "eslintConfig",
    yaml: ".eslintrc.yml",
  },
  fileTypes: ["js", "json", "yaml"],
  name: "eslint",
  supportsPackageJson: true,
};

const lintStaged: ConfigType = {
  defaultType: "json",
  fileNames: {
    js: "lint-staged.config.js",
    json: ".lintstagedrc.json",
    packageJson: "lint-staged",
    yaml: ".lintstagedrc.yml",
  },
  fileTypes: ["js", "json", "yaml"],
  name: "lint-staged",
  supportsPackageJson: true,
};

const prettier: ConfigType = {
  defaultType: "json",
  fileNames: {
    js: "prettier.config.js",
    json: ".prettierrc.json",
    packageJson: "prettier",
    yaml: ".prettierrc.yml",
  },
  fileTypes: ["js", "json", "yaml"],
  name: "prettier",
  supportsPackageJson: true,
};

const ts: ConfigType = {
  defaultType: "json",
  fileNames: {
    json: "tsconfig.json",
  },
  fileTypes: ["json"],
  name: "typescript",
  supportsPackageJson: false,
};

const tslint: ConfigType = {
  defaultType: "json",
  fileNames: {
    json: "tslint.json",
  },
  fileTypes: ["json"],
  name: "tslint",
  supportsPackageJson: false,
};

const configTypes: Configs = {
  babel,
  eslint,
  lintStaged,
  prettier,
  ts,
  tslint,
};

export const configTypesArray = Object.values(configTypes);

export const configNames = configTypesArray.map((config) => config.name);

export default configTypes;
