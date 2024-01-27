export class Callback {
    constructor(definition: object, callback?: (unknown) => unknown | null);
    register(callback?: (unknown) => unknown): void;
    get type(): koffi.IKoffiCType;
    get pointer(): koffi.IKoffiRegisteredCallback;
    get address(): bigint | null;
    close(): void;
    #private;
}
export function pointer(value: unknown, direction?: string): koffi.IKoffiCType;
declare class Struct {
    constructor(type: koffi.IKoffiCType);
    get pointer(): object;
    set values(object: object);
    get values(): object;
    #private;
}
export function struct(schema: object): { type: koffi.IKoffiCType, create: () => Struct };
export function alloc(type: unknown): {
    pointer: Buffer;
    get: () => unknown;
};
export function lastError(option?: { translate?: boolean }): string[] | number;
import koffi from "koffi";
