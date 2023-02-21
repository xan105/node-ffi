export function load(path: string, option?: object): (symbol: string, result: unknown, parameters: unknown[]) => ffi.ForeignFunction<any, any[]> | undefined;
export function dlopen(path: string, symbols: object, option?: object): object;
import ffi from "ffi-napi";
