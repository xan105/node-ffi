export class Callback {
    constructor(definition: object, callback?: (unknown) => unknown | null);
    get type(): string;
    get pointer(): ref.Pointer<() => any>;
    close(): void;
    register(callback?: (unknown) => unknown): void;
    #private;
}
export function pointer(value: unknown): ref.Type<ref.Pointer<any>>;

export function alloc(type: unknown): {
    pointer: Buffer;
    get: () => unknown;
};
import ref from "ref-napi";