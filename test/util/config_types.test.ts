import { configWithFileName, parseFileType, configTypes, FileType } from "../../src";

describe("util/config_types.ts", () => {
  describe("configWithFileName()", () => {
    it("returns the config type with the given file name", () => {
      const eslint = configWithFileName(".eslintrc.yml");
      expect(eslint).not.toBeUndefined();
      expect(eslint).toEqual(configTypes.get("eslint"));

      const lintStaged = configWithFileName("lint-staged.config.js");
      expect(lintStaged).not.toBeUndefined();
      expect(lintStaged).toEqual(configTypes.get("lint-staged"));

      const typescript = configWithFileName("tsconfig.json");
      expect(typescript).not.toBeUndefined();
      expect(typescript).toEqual(configTypes.get("typescript"));
    });

    it("returns undefined if there is no config type with the file name", () => {
      expect(configWithFileName("oh-noes.json")).toBeUndefined();
    });
  });

  describe("parseFileType()", () => {
    it("returns the file type for the given extension", () => {
      const eslint = configTypes.get("eslint")!;
      expect(parseFileType(" JSON   ", eslint)).toBe(FileType.json);
      expect(parseFileType("\n\tjs", eslint)).toBe(FileType.js);
      expect(parseFileType("yaml", eslint)).toBe(FileType.yaml);
    });

    it("resolves the alias type", () => {
      expect(parseFileType("yml", configTypes.get("eslint")!)).toBe(FileType.yaml);
    });

    it("ignores a leading .", () => {
      expect(parseFileType(".json", configTypes.get("eslint")!)).toBe(FileType.json);
    });

    it("returns undefined if there is no file type with the given extension", () => {
      expect(parseFileType(".foo", configTypes.get("eslint")!)).toBeUndefined();
    });
  });
});
