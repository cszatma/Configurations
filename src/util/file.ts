import path from "path";
import yaml from "js-yaml";
import stringifyObject from "stringify-object";
import { Result, errors, fs } from "@cszatma/node-stdlib";

import { FileType } from "./config_types";

export function readConfigFile(filePath: string): Result<unknown, error> {
  const fileExt = path.extname(filePath);

  if (fileExt === ".js") {
    // Need to resolve the absolute path or node will think it is relative to this file
    const absolutePath = path.isAbsolute(filePath) ? filePath : path.resolve(filePath);

    // eslint-disable-next-line global-require, import/no-dynamic-require
    return Result.of(() => require(absolutePath)).mapFailure((e) => {
      const err = errors.fromJSError(e);
      return errors.wrap(err, `failed to read js config file ${filePath}`);
    });
  }

  return fs
    .readFileSync(filePath, "utf-8")
    .mapFailure((e) => errors.fromJSError(e))
    .flatMap((s) => {
      let parseFn: (str: string) => unknown = JSON.parse;
      if (fileExt === ".yaml" || fileExt === ".yml") {
        parseFn = yaml.safeLoad;
      }

      return Result.of(() => parseFn(s)).mapFailure((e) => {
        return errors.wrap(errors.fromJSError(e), `failed to parse config file ${filePath}`);
      });
    });
}

function createJsFile(object: unknown, indent = 2): string {
  const stringifiedObject = stringifyObject(object, {
    indent: " ".repeat(indent),
  });
  return `module.exports = ${stringifiedObject};`;
}

export function createConfigFile(
  template: unknown,
  fileType: FileType,
  indent = 2,
): Result<string, error> {
  switch (fileType) {
    case "json":
      return Result.success(JSON.stringify(template, null, indent));
    case "js":
      return Result.success(createJsFile(template, indent));
    case "yaml":
      return Result.success(yaml.dump(template, { indent }));
    default:
      return Result.failure(errors.newError(`Invalid file type ${fileType}`));
  }
}
