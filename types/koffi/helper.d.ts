/// <reference types="node" resolution-mode="require"/>
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
export function alloc(type: unknown): {
    pointer: Buffer;
    get: () => unknown;
};
import koffi from "koffi";
import { Buffer } from "buffer";
