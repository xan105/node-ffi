export class Callback {
    constructor(name: string, definition: object, callback?: function | null);
    get definition(): koffi.IKoffiCType;
    get pointer(): koffi.IKoffiRegisteredCallback;
    close(): void;
    register(callback?: function): void;
    #private;
}
export function pointer(value: unknown, direction?: string): koffi.IKoffiCType;
export function alloc(type: unknown): {
    pointer: Buffer;
    get: () => unknown;
};
import koffi from "koffi";
