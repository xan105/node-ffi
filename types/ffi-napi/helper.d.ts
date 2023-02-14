export class Callback {
    constructor(definition: object, callback?: unknown);
    get definition(): string;
    get pointer(): ref.Pointer<() => any>;
    close(): void;
    #private;
}
export function pointer(value: unknown): ref.Type<ref.Pointer<any>>;
import ref from "ref-napi";