// List of available config types

export interface ConfigType {
    readonly defaultType: string;
    readonly fileTypes: string[];
    readonly fileNames: {
        readonly js?: string;
        readonly json?: string;
        readonly packageJson?: string;
        readonly [key: string]: string;
    };
    readonly name: string;
    readonly supportsPackageJson: boolean;
}

export interface Configs {
    readonly [config: string]: ConfigType;
}

const babel: ConfigType = {
    defaultType: 'json',
    fileNames: {
        json: '.babelrc',
        packageJson: 'babel',
    },
    fileTypes: ['json'],
    name: 'babel',
    supportsPackageJson: true,
};

const eslint: ConfigType = {
    defaultType: 'json',
    fileNames: {
        js: '.eslintrc.js',
        json: '.eslintrc.json',
        packageJson: 'eslintConfig',
    },
    fileTypes: ['js', 'json'],
    name: 'eslint',
    supportsPackageJson: true,
};

const lintStaged: ConfigType = {
    defaultType: 'json',
    fileNames: {
        js: 'lint-staged.config.js',
        json: '.lintstagedrc',
        packageJson: 'lint-staged',
    },
    fileTypes: ['js', 'json'],
    name: 'lint-staged',
    supportsPackageJson: true,
};

const prettier: ConfigType = {
    defaultType: 'json',
    fileNames: {
        js: 'prettier.config.js',
        json: '.prettierrc.json',
        packageJson: 'prettier',
    },
    fileTypes: ['js', 'json'],
    name: 'prettier',
    supportsPackageJson: true,
};

const ts: ConfigType = {
    defaultType: 'json',
    fileNames: {
        json: 'tsconfig.json',
    },
    fileTypes: ['json'],
    name: 'ts',
    supportsPackageJson: false,
};

const tslint: ConfigType = {
    defaultType: 'json',
    fileNames: {
        json: 'tslint.json',
    },
    fileTypes: ['json'],
    name: 'tslint',
    supportsPackageJson: false,
};

const configTypes: Configs = {
    babel,
    eslint,
    lintStaged,
    prettier,
    ts,
    tslint,
};

export default configTypes;
