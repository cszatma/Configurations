import { Command } from "commander";
import { colors, fatal, log } from "@cszatma/node-stdlib";

import { addCmd } from "./cmd/add";
import { createCmd } from "./cmd/create";
import { deleteCmd } from "./cmd/delete";
import { listCmd } from "./cmd/list";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJson = require("../package.json");

const programName = packageJson.name as string;
log.std.formatter = new log.TextFormatter({ disableTimestamp: true });

const program = new Command(programName)
  .storeOptionsAsProperties(false)
  .passCommandToAction(false)
  .version(packageJson.version)
  .option("-v, --verbose", "Enable verbose logging")
  .on("option:verbose", () => {
    fatal.showErrDetail(true);
    log.std.level = log.Level.debug;
  })
  .on("--help", () => {
    console.log(
      `\nRun \`${programName} COMMAND --help\` for more information about a given command.`,
    );
  });

program
  .command("create <config-name>")
  .description("Creates the given configuration file to your project")
  .usage("<config-name> [options]")
  .option(
    "-p, --path <path>",
    "Path at which to create the config file, defaults to current directory",
  )
  .option(
    "-c, --create-directories",
    "Automatically creates intermediate directories in the given path if they do not exist",
  )
  .option("-t, --type <type>", "File type to use")
  .option("-i, --indent <indent>", "Sets the indentation amount for the config file, defaults to 2")
  .option("-P, --package-json", "Adds the config file to your package.json")
  .option("-f, --force", "Overwrites a config file if it already exists")
  .action(createCmd);

program
  .command("list [config]")
  .alias("ls")
  .description("List all available configs or list available file types for a given config")
  .usage("[options]")
  .action(listCmd);

program
  .command("add <config-file>")
  .description("Adds a config file to config-gen which can be regenerated later.")
  .usage("<config-file> [options]")
  .option("-n, --name <name>", "Name of the config. Defaults to file name.")
  .option("-f, --force", "Replaces a config file with the same name if it already exists.")
  .action(addCmd);

program
  .command("delete <config-name>")
  .description("Deletes a config that was previously saved.")
  .usage("<config-name> [options]")
  .option("-f, --force", "Does not prompt for confirmation before deleting.")
  .action(deleteCmd);

program.command("*", "", { noHelp: true }).action((command) => {
  console.log(colors.red(`Error: ${command} is not a valid command!`));
  console.log("Use `config-gen --help` to see a list of available commands.");
  process.exit(1);
});

program.parse(process.argv);

if (program.args.length < 1) {
  program.help();
}
