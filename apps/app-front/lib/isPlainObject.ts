
export function IsPlainObject(variable: unknown): variable is Record<string, unknown> {
    return typeof variable === 'object' && variable !== null && !Array.isArray(variable);
}
