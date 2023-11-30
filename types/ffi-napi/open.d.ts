declare interface loadOption {
  ignoreLoadingFail?: boolean,
  ignoreMissingSymbol?: boolean,
  lazy?: boolean,
  abi?: string
}
export function load(path: string, option?: loadOption): (symbol: string, result: unknown, parameters: unknown[]) => ffi.ForeignFunction<unknown, unknown[]> | undefined;

declare interface dlopenOption {
  ignoreLoadingFail?: boolean,
  ignoreMissingSymbol?: boolean,
  lazy?: boolean,
  abi?: string,
  errorAtRuntime?: boolean,
  nonblocking?: boolean,
  stub?: boolean
}
export function dlopen(path: string, symbols: object, option?: dlopenOption): object;
import ffi from "ffi-napi";
