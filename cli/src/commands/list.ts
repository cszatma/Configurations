import configTypes from '../utils/config-types';
import logError from '../utils/log-error';

export default function list(config?: string) {
    if (!config) {
        listAllCommands();
        return process.exit(0);
    }

    listAvailableFileTypes(config);
}

function listAllCommands() {
    console.log('Available configurations:');
    Object.values(configTypes).forEach(config =>
        console.log(' - ' + config.name),
    );
}

function listAvailableFileTypes(configName: string) {
    const config = configTypes[configName];

    if (!config) {
        logError(`Error: ${configName} is not a valid config type!`);
        console.log(
            'Use `config-gen list` to list all available config types.',
        );
        process.exit(1);
    }

    console.log(`Available file types for ${configName}:`);
    config.fileTypes.forEach(fileType => console.log(' - ' + fileType));
    console.log(
        `Supports package.json: ${config.supportsPackageJson ? 'yes' : 'no'}`,
    );
}
