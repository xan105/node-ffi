declare interface loadOption {
  ignoreLoadingFail?: boolean,
  ignoreMissingSymbol?: boolean,
  lazy?: boolean,
  abi?: string
}
export function load(path: string, option?: loadOption): (symbol: string | number, result: unknown, parameters: unknown[]) => unknown;

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
