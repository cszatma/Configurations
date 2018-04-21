import stringifyObject from 'stringify-object';

export function stripScope(name: string): string {
    if (name.charAt(0) === '@') {
        const index = name.indexOf('/');
        return name.slice(index + 1);
    }

    return name;
}

export function createJsonFile(object: any, space: number = 2): string {
    return JSON.stringify(object, null, space);
}

export function createJsFile(object: any, indent: number = 2): string {
    const stringifiedObject = stringifyObject(object, {
        indent: ' '.repeat(indent),
    });
    return `module.exports = ${stringifiedObject};`;
}
