export class Callback {
    constructor(definition: object, callback?: (unknown) => unknown | null);
    get type(): koffi.IKoffiCType;
    get pointer(): koffi.IKoffiRegisteredCallback;
    close(): void;
    register(callback?: (unknown) => unknown): void;
    #private;
}
export function pointer(value: unknown, direction?: string): koffi.IKoffiCType;
export function alloc(type: unknown): {
    pointer: Buffer;
    get: () => unknown;
};
import koffi from "koffi";
