import { Command } from "commander";
import { logError } from "@cszatma/process-utils";

import commands from "./commands";

type Program = Command & { optionValues: { name?: string } };

const packageJson = require("../package.json");

const programName = packageJson.name;

const program: Program = new Command(programName)
  .version(packageJson.version, "-v, --version")
  .on("--help", () => {
    console.log(
      `\nRun \`${programName} COMMAND --help\` for more information about a given command.`,
    );
  }) as Program;

program.optionValues = {};

program
  .command("add <config-name>")
  .description("Adds the given configuration file to your project")
  .usage("<config-name> [options]")
  .option(
    "-p, --path <path>",
    "Path to add config file, defaults to current directory",
  )
  .option(
    "-c, --create-directories",
    "Automatically creates intermediate directories in the given path if they do not exist",
  )
  .option("-t, --type <type>", "File type, either js or json, defaults to json")
  .option(
    "-i, --indent <indent>",
    "Sets the indentation amount for the config file, defaults to 2",
  )
  .option("-P, --package-json", "Adds the config file to your package.json")
  .option("-w, --write", "Overwrites a config file if it already exists")
  .option(
    "-f, --force",
    "Equivalent to calling both --create-directories and --write",
  )
  .action(commands.add);

program
  .command("list [config]")
  .alias("ls")
  .description(
    "List all available configs or list available file types for a given config",
  )
  .usage("[options]")
  .action(commands.list);

program
  .command("save <config-file>")
  .description(
    "Saves a config file to config-gen which can be regenerated later.",
  )
  .usage("<config-file> [options]")
  .option("-n, --name <name>", "Name of the config. Defaults to file name.")
  .option(
    "-f, --force",
    "Replaces a config file with the same name if it already exists.",
  )
  .action(async (configFile: string, options: { force: boolean }) =>
    commands.save(configFile, {
      name: program.optionValues.name || "",
      force: options.force,
    }),
  )
  .on("option:name", (opt) => {
    program.optionValues.name = opt;
  });

program
  .command("delete <config-name>")
  .description("Deletes a custom config that was previously saved.")
  .usage("<config-name> [options]")
  .option("-f, --force", "Does not prompt for confirmation before deleting.")
  .action(commands.delete);

program.command("*", "", { noHelp: true }).action((command) => {
  logError(`Error: ${command} is not a valid command!`);
  console.log("Use `config-gen --help` to see a list of available commands.");
  process.exit(1);
});

program.parse(process.argv);

if (program.args.length < 1) {
  program.help();
  process.exit(0);
}
