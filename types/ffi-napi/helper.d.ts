export class Callback {
    constructor(definition: object, callback?: (unknown) => unknown | null);
    register(callback?: (unknown) => unknown): void;
    get type(): ref.Type<ref.Pointer<void>>;
    get pointer(): ref.Pointer<() => unknown>;
    get address(): number | null;
    close(): void;
    #private;
}
export function pointer(value: unknown): ref.Type<ref.Pointer<unknown>>;
declare class Struct {
    constructor(schema: object);
    get pointer(): ref_struct.StructType<unknown>;
    set values(object: object);
    get values(): object;
    #private;
}
export function struct(schema: object): { type: ref.Type<unknown>, create: () => Struct };
export function alloc(type: unknown): {
    pointer: Buffer;
    get: () => unknown;
};
export function lastError(option?: { translate?: boolean }): string[] | number;
import ref from "ref-napi";
import ref_struct from "ref-struct-di";
