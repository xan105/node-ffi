export class Callback {
    constructor(definition: object, callback?: (unknown) => unknown | null);
    register(callback?: (unknown) => unknown): void;
    get type(): ref.Type<ref.Pointer<void>>;
    get pointer(): ref.Pointer<() => any>;
    get address(): number | null;
    close(): void;
    #private;
}
export function pointer(value: unknown): ref.Type<ref.Pointer<any>>;
export function alloc(type: unknown): {
    pointer: Buffer;
    get: () => unknown;
};
import ref from "ref-napi";
