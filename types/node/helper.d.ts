export function alloc(type: unknown): {
    pointer: Buffer;
    get: () => unknown;
};
