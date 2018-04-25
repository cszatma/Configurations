interface ObjectConstructor {
    values<T>(o: { [p: string]: T }): T[];
}

Object.values = <T>(o: { [p: string]: T }): T[] => {
    return Object.keys(o).map(key => o[key]);
};

interface Array<T> {
    includes(searchElement: T, fromIndex?: number): boolean;
    last(): T;
}

Array.prototype.includes = function<T>(
    searchElement: T,
    fromIndex?: number,
): boolean {
    if (!this) {
        throw new TypeError('"this" is null or not defined');
    }

    for (let i = fromIndex || 0; i < this.length; i++) {
        if (this[i] === searchElement) {
            return true;
        }
    }

    return false;
};

Array.prototype.last = function<T>(): T {
    return this[this.length - 1];
};
