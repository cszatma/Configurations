import os from "os";
import path from "path";
import { format } from "util";
import { bytes, colors, env, fs } from "@cszatma/node-stdlib";

import { listCmd } from "../../src/cmd/list";

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

describe("src/cmd/list.ts", () => {
  let tmpDir: string;
  let logMock: ConsoleMock;
  let errorMock: ConsoleMock;
  let spyExit: jest.SpyInstance<never, [(number | undefined)?]>;

  beforeEach(async () => {
    const r = await fs.mkdtemp(`${os.tmpdir}${path.sep}`);
    tmpDir = r.unwrap();
    env.setEnv("CONFIG_GEN_ROOT_DIR", tmpDir);

    logMock = mockConsole("log");
    errorMock = mockConsole("error");
    spyExit = jest.spyOn(process, "exit").mockImplementation(() => {
      throw new Error("process.exit() was called");
    });
  });

  afterEach(async () => {
    await fs.removeAll(tmpDir);
    env.unsetEnv("CONFIG_GEN_ROOT_DIR");
    logMock.mock.mockRestore();
    errorMock.mock.mockRestore();
    spyExit.mockRestore();
  });

  it("lists all available config types", () => {
    const rcPath = path.join(tmpDir, ".configgenrc");
    const globalConfig = {
      configs: {
        "my-eslint": "eslint",
        "my-ts": "typescript",
        "jest-config": "jest",
        fmt: "prettier",
      },
    };
    fs.writeFileSync(rcPath, JSON.stringify(globalConfig)).unwrap();

    listCmd();

    expect(logMock.buf.toString()).toMatchInlineSnapshot(`
      "Available configs:
       - my-eslint (eslint)
       - my-ts (typescript)
       - jest-config (jest)
       - fmt (prettier)
      "
    `);
  });

  it("lists the available file types for the config type", () => {
    const rcPath = path.join(tmpDir, ".configgenrc");
    const globalConfig = {
      configs: {
        "my-eslint": "eslint",
        "my-ts": "typescript",
        "jest-config": "jest",
        fmt: "prettier",
      },
    };
    fs.writeFileSync(rcPath, JSON.stringify(globalConfig)).unwrap();

    listCmd("my-eslint");

    expect(logMock.buf.toString()).toMatchInlineSnapshot(`
      "Available file types for my-eslint:
       - json
       - js
       - yaml
      Supports package.json: yes
      "
    `);
  });

  it("lists the available file types and shows no for package.json", () => {
    const rcPath = path.join(tmpDir, ".configgenrc");
    const globalConfig = {
      configs: {
        "my-eslint": "eslint",
        "my-ts": "typescript",
        "jest-config": "jest",
        fmt: "prettier",
      },
    };
    fs.writeFileSync(rcPath, JSON.stringify(globalConfig)).unwrap();

    listCmd("my-ts");

    expect(logMock.buf.toString()).toMatchInlineSnapshot(`
      "Available file types for my-ts:
       - json
      Supports package.json: no
      "
    `);
  });

  it("exists with a failure if an unknown config type is passed", () => {
    expect(() => listCmd("naw")).toThrow();
    expect(errorMock.buf.toString()).toBe(
      `${colors.red("Error: naw is not a valid config type!")}\n`,
    );
    expect(logMock.buf.toString()).toBe(
      "Use `config-gen list` to list all available config types.\n",
    );
    expect(spyExit).toHaveBeenCalledWith(1);
  });
});
