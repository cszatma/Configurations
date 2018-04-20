export default function stripScope(name: string): string {
    if (name.charAt(0) === '@') {
        const index = name.indexOf('/');
        return name.slice(index + 1);
    }

    return name;
}
