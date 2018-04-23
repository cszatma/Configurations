import { Optional } from '../types/aliases';
import configTypes, { ConfigType } from './config-types';

export function parseConfigName(configName: string): Optional<ConfigType> {
    const normalizedName = configName.trim().toLowerCase();

    // See if one of the configs matches the config name
    return Object.values(configTypes).find(
        config => normalizedName === config.name,
    );
}

export function parseConfigType(
    type: string,
    config: ConfigType,
): Optional<string> {
    const normalizedType = type.trim().toLowerCase();
    return config.fileTypes.includes(normalizedType)
        ? normalizedType
        : undefined;
}
