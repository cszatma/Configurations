export enum FileType {
  js = "js",
  json = "json",
  yaml = "yaml",
}

export const fileAliases = new Map<string, FileType>([["yml", FileType.yaml]]);

export interface ConfigType {
  readonly name: string;
  readonly defaultType: FileType;
  readonly fileNames: Map<FileType, string>;
  readonly packageJsonName?: string;
}

const babel: ConfigType = {
  name: "babel",
  defaultType: FileType.json,
  fileNames: new Map([
    [FileType.json, ".babelrc"],
    [FileType.js, ".babelrc.js"],
  ]),
  packageJsonName: "babel",
};

const eslint: ConfigType = {
  name: "eslint",
  defaultType: FileType.json,
  fileNames: new Map([
    [FileType.json, ".eslintrc.json"],
    [FileType.js, ".eslintrc.js"],
    [FileType.yaml, ".eslintrc.yml"],
  ]),
  packageJsonName: "eslintConfig",
};

const husky: ConfigType = {
  name: "husky",
  defaultType: FileType.json,
  fileNames: new Map([
    [FileType.json, ".huskyrc.json"],
    [FileType.js, ".huskyrc.js"],
  ]),
  packageJsonName: "husky",
};

// jest conflicts with the jest variable when running tests
// so we need a diff name
const jestConfig: ConfigType = {
  name: "jest",
  defaultType: FileType.js,
  fileNames: new Map([
    [FileType.json, "jest.config.json"],
    [FileType.js, "jest.config.js"],
  ]),
  packageJsonName: "jest",
};

const lintStaged: ConfigType = {
  name: "lint-staged",
  defaultType: FileType.json,
  fileNames: new Map([
    [FileType.json, ".lintstagedrc.json"],
    [FileType.js, "lint-staged.config.js"],
    [FileType.yaml, ".lintstagedrc.yml"],
  ]),
  packageJsonName: "lint-staged",
};

const prettier: ConfigType = {
  name: "prettier",
  defaultType: FileType.json,
  fileNames: new Map([
    [FileType.json, ".prettierrc.json"],
    [FileType.js, "prettier.config.js"],
    [FileType.yaml, ".prettierrc.yml"],
  ]),
  packageJsonName: "prettier",
};

const typescript: ConfigType = {
  name: "typescript",
  defaultType: FileType.json,
  fileNames: new Map([[FileType.json, "tsconfig.json"]]),
};

export const configTypes = new Map([
  [babel.name, babel],
  [eslint.name, eslint],
  [husky.name, husky],
  [jestConfig.name, jestConfig],
  [lintStaged.name, lintStaged],
  [prettier.name, prettier],
  [typescript.name, typescript],
]);

export const CUSTOM_CONFIG_TYPE_NAME = "__custom__";

export function configWithFileName(fileName: string): ConfigType | undefined {
  for (const c of configTypes.values()) {
    for (const f of c.fileNames.values()) {
      if (f === fileName) {
        return c;
      }
    }
  }

  return undefined;
}

export function parseFileType(type: string, config: ConfigType): FileType | undefined {
  let normalizedType = type.trim().toLowerCase();
  if (normalizedType[0] === ".") {
    normalizedType = normalizedType.slice(1);
  }

  const fileType = fileAliases.get(normalizedType) ?? (normalizedType as FileType);
  return config.fileNames.has(fileType) ? fileType : undefined;
}
