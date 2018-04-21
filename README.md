# config-gen

A CLI to easily generate configuration files for various packages.

## Install
Install using `yarn`:

```bash
$ yarn global add config-gen
```

Or use `npm` if you wish:

```bash
$ npm install -g config-gen
```
## Usage

```bash
$ config-gen [command] [options]
```

To generate a new config file, use the `config-gen add <filename>` command.  
Use `config-gen --help` or `config-gen [command] --help` to get information on a given command.

## CLI Commands & Options
`add` options:

```
-p, --path <path>         Path to add config file, defaults to current directory
-c, --create-directories  Automatically creates intermediate directories in the given
						  path if they do not exist
-t, --type <type>         File type, either js or json, defaults to json
-i, --indent <indent>     Sets the indentation amount for the config file, defaults to 2
-P, --package-json        Adds the config file to your package.json
-w, --write               Overwrites a config file if it already exists
-f, --force               Equivalent to calling both --create-directories and --write
-h, --help                output usage information
```

To list all available configs run:

```bash
$ config-gen list
```

To list all available file types for a config run:

```bash
$ config-gen list [command]
```

### Examples:

```bash
$ config-gen add eslint
```
This will add a file named `.eslintrc.json` to your current directory.

To use a different supported file type use the `-t` or `--type` option.

```bash
$ config-gen add eslint --type js
```
This will add a file named `.eslintrc.js` to your current directory.

You can specify a custom path using `-p` or `--path`.

```bash
$ config-gen add eslint --path configs
```
Adds `configs/.eslintrc.json`.
Optionally pass the `-c` or `--create-directories` flag to create the directories if they are missing.

You can also add a config to your `package.json` if it is supported. Use the `-P` or `--package-json` flag.

```bash
$ config-gen add eslint --package-json
```
## License
config-gen is available under the [MIT License](https://github.com/cszatma/config-gen/tree/master/LICENSE).

## Contributing
Contributions are welcome. Feel free to open an issue or submit a pull request.

