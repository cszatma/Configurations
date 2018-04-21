import configTypes, { ConfigType } from './config-types';

export function parseConfigName(configName: string): ConfigType {
    const normalizedName = configName.trim().toLowerCase();

    // See if one of the configs matches the config name
    // For example `.prettierrc.json` would match the prettier config
    return Object.values(configTypes).find(config =>
        normalizedName.includes(config.name),
    );
}

export function parseConfigType(type: string, config: ConfigType): string {
    const normalizedType = type.trim().toLowerCase();
    return config.fileTypes.includes(normalizedType) ? normalizedType : null;
}
