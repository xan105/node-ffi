export class Callback {
    constructor(name: string, definition: object, callback?: unknown);
    get definition(): koffi.IKoffiCType;
    get pointer(): koffi.IKoffiRegisteredCallback;
    close(): void;
    #private;
}
export function pointer(value: unknown, direction?: string): koffi.IKoffiCType;
export function alloc(type: unknown): {
    pointer: Buffer;
    get: () => unknown;
};
import koffi from "koffi";
