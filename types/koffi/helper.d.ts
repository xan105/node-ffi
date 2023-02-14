export class Callback {
    constructor(name: string, definition: object, callback?: unknown);
    get definition(): koffi.IKoffiCType;
    get pointer(): koffi.IKoffiRegisteredCallback;
    close(): void;
    #private;
}
export function pointer(value: unknown, direction?: string): koffi.IKoffiCType;
import koffi from "koffi";
