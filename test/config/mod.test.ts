import os from "os";
import path from "path";
import { env, errors, fs } from "@cszatma/node-stdlib";
import { config } from "../../src";

describe("src/config/mod.ts", () => {
  let tmpDir: string;
  let rcPath: string;
  let templatesPath: string;

  beforeEach(async () => {
    const r = await fs.mkdtemp(`${os.tmpdir}${path.sep}`);
    tmpDir = r.unwrap();
    env.setEnv("CONFIG_GEN_ROOT_DIR", tmpDir);
    rcPath = path.join(tmpDir, ".configgenrc");
    templatesPath = path.join(tmpDir, ".config-gen");
  });

  afterEach(async () => {
    await fs.removeAll(tmpDir);
    env.unsetEnv("CONFIG_GEN_ROOT_DIR");
  });

  describe("init()", () => {
    it("loads the global config file", () => {
      const globalConfig = {
        configs: {
          "my-eslint": "eslint",
          "my-ts": "typescript",
        },
      };
      fs.writeFileSync(rcPath, JSON.stringify(globalConfig)).unwrap();

      const err = config.init();
      expect(err).toBeUndefined();
      expect(config.configs()).toEqual({
        "my-eslint": "eslint",
        "my-ts": "typescript",
      });
    });

    it("creates a default global config if it doesn't exist", () => {
      const err = config.init();
      expect(err).toBeUndefined();
      expect(config.configs()).toEqual({});
      expect(fs.fileExistsSync(rcPath)).toBe(true);
      expect(fs.fileExistsSync(templatesPath)).toBe(true);
    });

    it("returns an error if it couldn't parse the config file", () => {
      fs.writeFileSync(rcPath, "{malformed").unwrap();

      const err = config.init();
      expect(errors.isError(err)).toBe(true);
    });
  });
});
