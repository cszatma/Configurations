import path from "path";
import { errors } from "@cszatma/node-stdlib";
import { readConfigFile, createConfigFile, FileType } from "../../src";

describe("util/file.ts", () => {
  describe("readConfigFile()", () => {
    it("reads the json config file", () => {
      const filePath = path.join(__dirname, "fixtures/.eslintrc");
      const data = readConfigFile(filePath).unwrap();
      expect(data).toEqual({
        rules: {
          "no-console": ["off"],
        },
      });
    });

    it("reads the js config file", () => {
      const filePath = path.join(__dirname, "fixtures/.eslintrc.js");
      const data = readConfigFile(filePath).unwrap();
      expect(data).toEqual({
        rules: {
          "no-console": ["off"],
        },
      });
    });

    it("reads the yml config file", () => {
      const filePath = path.join(__dirname, "fixtures/.eslintrc.yml");
      const data = readConfigFile(filePath).unwrap();
      expect(data).toEqual({
        rules: {
          "no-console": ["off"],
        },
      });
    });

    it("returns a failure if an error occurred", () => {
      const filePath = path.join(__dirname, "fixtures/foo.bar");
      const err = readConfigFile(filePath).unwrapFailure();
      expect(errors.isError(err)).toBe(true);
    });

    it("returns a failure if an error occurred while parsing the file", () => {
      const filePath = path.join(__dirname, "fixtures/invalid");
      const err = readConfigFile(filePath).unwrapFailure();
      expect(errors.isError(err)).toBe(true);
    });
  });

  describe("createConfigFile()", () => {
    it("creates a json string", () => {
      const str = createConfigFile({ isCustom: true }, FileType.json).unwrap();
      expect(str).toBe(`{
  "isCustom": true
}`);
    });

    it("creates a js string", () => {
      const str = createConfigFile({ isCustom: true }, FileType.js).unwrap();
      expect(str).toBe(`module.exports = {
  isCustom: true
};`);
    });

    it("creates a yaml string", () => {
      const str = createConfigFile({ isCustom: true }, FileType.yaml).unwrap();
      expect(str).toBe("isCustom: true\n");
    });

    it("returns a failure if an invalid file type is given", () => {
      // @ts-expect-error
      const err = createConfigFile({}, "naw").unwrapFailure();
      expect(errors.isError(err)).toBe(true);
    });
  });
});
