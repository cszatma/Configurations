import os from "os";
import path from "path";
import { format } from "util";
import inquirer from "inquirer";
import { bytes, env, fs } from "@cszatma/node-stdlib";

import { config } from "../../src";
import { deleteCmd } from "../../src/cmd/delete";

interface ConsoleMock {
  mock: jest.SpyInstance<void, [unknown?, ...unknown[]]>;
  buf: bytes.DynamicBuffer;
}

function mockConsole(method: "log" | "error"): ConsoleMock {
  const buf = new bytes.DynamicBuffer();
  const mock = jest.spyOn(console, method).mockImplementation((msg, ...args) => {
    buf.writeString(`${format(msg, ...args)}\n`);
  });

  return { mock, buf };
}

describe("src/cmd/delete.ts", () => {
  let tmpDir: string;
  let errorMock: ConsoleMock;
  let spyExit: jest.SpyInstance<never, [(number | undefined)?]>;
  let promptOriginal: typeof inquirer.prompt;

  beforeEach(async () => {
    const r = await fs.mkdtemp(`${os.tmpdir}${path.sep}`);
    tmpDir = r.unwrap();
    fs.mkdirSync(path.join(tmpDir, ".config-gen")).unwrap();
    env.setEnv("CONFIG_GEN_ROOT_DIR", tmpDir);

    errorMock = mockConsole("error");
    spyExit = jest.spyOn(process, "exit").mockImplementation(() => {
      throw new Error("process.exit() was called");
    });
    promptOriginal = inquirer.prompt;
  });

  afterEach(async () => {
    await fs.removeAll(tmpDir);
    env.unsetEnv("CONFIG_GEN_ROOT_DIR");
    errorMock.mock.mockRestore();
    spyExit.mockRestore();
    inquirer.prompt = promptOriginal;
  });

  it("deletes the custom config", async () => {
    const rcPath = path.join(tmpDir, ".configgenrc");
    const globalConfig = {
      configs: {
        "my-eslint": "eslint",
      },
    };
    fs.writeFileSync(rcPath, JSON.stringify(globalConfig)).unwrap();

    const templatePath = path.join(tmpDir, ".config-gen", "my-eslint.json");
    const eslintTemplate = {
      rules: { "no-console": "off" },
    };
    fs.writeFileSync(templatePath, JSON.stringify(eslintTemplate)).unwrap();

    inquirer.prompt = jest.fn().mockResolvedValue({
      shouldDelete: true,
    }) as never;
    await deleteCmd("my-eslint", { force: false });

    expect(config.configs()).toEqual({});
    expect(fs.fileExistsSync(templatePath)).toBe(false);
  });

  it("does nothing if the user does not confirm", async () => {
    const rcPath = path.join(tmpDir, ".configgenrc");
    const globalConfig = {
      configs: {
        "my-eslint": "eslint",
      },
    };
    fs.writeFileSync(rcPath, JSON.stringify(globalConfig)).unwrap();

    const templatePath = path.join(tmpDir, ".config-gen", "my-eslint.json");
    const eslintTemplate = {
      rules: { "no-console": "off" },
    };
    fs.writeFileSync(templatePath, JSON.stringify(eslintTemplate)).unwrap();

    inquirer.prompt = jest.fn().mockResolvedValue({
      shouldDelete: false,
    }) as never;
    await deleteCmd("my-eslint", { force: false });

    expect(config.configs()).toEqual({
      "my-eslint": "eslint",
    });
    expect(fs.fileExistsSync(templatePath)).toBe(true);
  });

  it("exits with a failure if the custom config does not exist", async () => {
    await expect(deleteCmd("naw", { force: true })).rejects.toThrow();
    expect(errorMock.buf.toString()).toContain("Error: Config named naw does not exist!");
    expect(spyExit).toHaveBeenCalledWith(1);
  });
});
