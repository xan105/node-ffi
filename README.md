About
=====

Foreign Function Interface helper. Provides a friendly abstraction/API for:

- [ffi-napi](https://www.npmjs.com/package/ffi-napi) (MIT)
- [koffi](https://www.npmjs.com/package/koffi) (MIT)

Syntax is inspired by Deno FFI. The goal was to be able to easily switch from `ffi-napi` to `koffi` or vice versa.

📦 Scoped `@xan105` packages are for my own personal use but feel free to use them.

Example
=======

Loading a library with Deno like syntax

```js
import { dlopen } from "@xan105/ffi/[ napi | koffi ]";

const lib = dlopen("libm", {
  ceil: { 
    result: "double", 
    parameters: [ "double" ] 
  }
});
lib.ceil(1.5); // 2
```

Async

```js
import { dlopen } from "@xan105/ffi/[ napi | koffi ]";

const lib = dlopen("libm", {
  ceil: { 
    result: "double", 
    parameters: [ "double" ],
    nonblocking: true 
  }
});
await lib.ceil(1.5); // 2
```

Calling directly from a library

```js
import { load, types } from "@xan105/ffi/[ napi | koffi ]";

const call = load("user32.dll", { abi: "stdcall" });
const MessageBoxA = call("MessageBoxA", "int", ["void *", types.win32.LPCSTR, types.win32.LPCSTR, "uint"]);

const MB_ICONINFORMATION = 0x40;
MessageBoxA(null, "Hello World!", "Message", MB_ICONINFORMATION);
```

Callback with Deno like syntax

```js
import { dlopen, Callback} from "@xan105/ffi/koffi";

const library = dlopen(
  "./callback.so",
  {
    set_status_callback: {
      parameters: ["function"],
      result: "void"
    },
    start_long_operation: {
      parameters: [],
      result: "void"
    }
  }
);

const callback = new Callback(
  {
    parameters: ["u8"],
    result: "void",
  },
  (success) => {}
);

library.set_status_callback(callback.pointer);
library.start_long_operation();
```

Install
=======

```
npm install @xan105/ffi
```

Please note that `ffi-napi` and `koffi` are optional peer dependencies.<br />
Install the one you wish to use yourself (or both 🙃).

API
===

⚠️ This module is only available as an ECMAScript module (ESM).

💡 This lib doesn't have a default entry point. Choose the export corresponding to your liking.

```js
import ... from "@xan105/ffi/napi";
//OR
import ... from "@xan105/ffi/koffi";
```

### Named export

#### `load(path: string, option?: object): function`

Load the given library path and return an handle function to call library's symbol(s).

**Option**

- `ignoreLoadingFail?: boolean` (false)

Silent fail if the given library couldn't be loaded.<br />
💡 Called symbol will be `undefined` in that case.

- `ignoreMissingSymbol?: boolean` (false)

Silent fail if the given library doesn't have the called symbol.<br />
💡 Called symbol will be `undefined` in that case.

- `abi?: string` ("func" for koffi and "default_abi" for ffi-napi)

ABI convention to use. Use this when you need to ex: winapi x86 requires "stdcall".

**Return**

```ts
function(symbol: string | number, result: unknown, parameters: unknown[]): any;
```

💡 `Koffi` can call by ordinal (symbol:number)

See the corresponding FFI library for more information on what to pass for `result` and `parameters` as they have string type parser, structure/array/pointer interface, ... and other features.

❌ Throws on error

**Example**:

```js
import { load } from "@xan105/ffi/[ napi | koffi ]";
const call = load("libm");

const ceil = call("ceil", "double", ["double"])
ceil(1.5); //2
```

#### `dlopen(path: string, symbols: object, option?: object): object`

Open library and define exported symbols. This is a friendly wrapper to `load()` inspired by Deno FFI `dlopen` syntax. 

If you ever use ffi-napi `ffi.Library()` this will be familiar.

**Param**

- `path: string`

  Library path to load
  
- `symbols: object`

  Symbol(s) definition:

```ts
  {
    name: {
      result?: unknown,
      parameters?: unknown[],
      nonblocking?: boolean,
      symbol?: string | number
    },
    ...
  }
```
  
  By default the property name is used for `symbol` when omitted. Use `symbol` if you are using a different name than the symbol name or if you want to call by ordinal (Koffi).
  
  When `nonblocking` is `true` (default false) this will return the promisified `async()` method of the corresponding symbol (see corresponding ffi library asynchronous calling). The rest is the same as for `load()`.
  
- option?: object

  Pass option(s) to `load()`. See above.
  
**Return** 

  An object with the given symbol(s) as properties.
  
  ❌ Throws on error
  
**Example**

```js
import { dlopen, types } from "@xan105/ffi/[ napi | koffi ]";
const { BOOL } = types.win32;

const lib = dlopen("xinput1_4", {
  "XInputEnable": {
    parameters: [BOOL],
    nonblocking: true
  }
}, { abi: "stdcall" });

await lib.XInputEnable(1);
```

#### `const types: object`

The FFI Library's primitive types as well as corresponding alias are exposed for convenience.
Such as Deno types (rust) and Windows specific types (DWORD,...).

💡 Windows specific types are grouped together under `win32`.

```js
import { types } from "@xan105/ffi/[ napi | koffi ]";
const { DWORD, LPCSTR } = types.win32;
```

💡 When using `koffi` alias are also set with `koffi.alias()` so you can use them as string.

```js
import { load } from "@xan105/ffi/koffi";
const call = load("user32.dll", { abi: "stdcall" });
const MessageBoxA = call("MessageBoxA", "int", ["void *", "LPCSTR", "LPCSTR", "uint"]);
```

⚠️ Types are not exposed under their own namespace because some words are illegal or already in use in JavaScript.
You can still use destructuring if needed as long as the name is "allowed".

❌ No

```
import { i32 } from "@xan105/ffi/koffi/types"
```

✔️ Yes
```
import { types } from "@xan105/ffi/koffi"
const { i32 } = types;
```

🚫 Forbidden

```
import { types } from "@xan105/ffi/napi"
const { function } = types;
```

#### `class Callback`

Create a callback to be called at a later time (registered callback).

This is a class wrapper to the FFI library's callback function(s) inspired by Deno FFI `UnsafeCallback class` syntax.

##### Constructor
  
  `(definition: { result: unknown, parameters: unknown[] }, callback?: Function | null)`
  
##### Properties
  
  - `pointer: unknown`
  
  The pointer to the callback.
  
  - `address: number | BigInt | null`
  
  The memory address of the pointer.
  
  - `type: unknown`
  
  The type of the callback.
  
##### Methods
  
  - `close(): void`
  
  Dispose of the callback. Remove function pointer associated with this instance.

  - `register(callback?: Function): void`
  
  Register the callback. If a callback was already registered with this instance it will be disposed of.

##### Example
  
```js
import { dlopen, types, Callback } from "@xan105/ffi/[ napi | koffi ]";

const library = dlopen("./callback.so", {
    setCallback: {
      parameters: [types.function],
      result: "void",
    },
    doSomething(): {
      parameters: [],
      result: "void",
    },
});

const callback = new Callback(
  { parameters: [], result: "void" },
  () => {},
);

library.setCallback(callback.pointer);
library.doSomething();

// After callback is no longer needed
callback.close();
```

You can also register the callback at a later time:

```js
import { dlopen, Callback } from "@xan105/ffi/[ napi | koffi ]";

const callback = new Callback(
  { parameters: [], result: "void" }
);

const library = dlopen("./callback.so", {
    setCallback: {
      parameters: [callback.type],
      result: "void",
    },
    doSomething(): {
      parameters: [],
      result: "void",
    },
});

callback.register(()=>{});

library.setCallback(callback.pointer);
library.doSomething();

// After callback is no longer needed
callback.close();
```

#### `pointer(value: unknown, direction?: string): any`

Just a shorthand to `ref.refType(x)` (ffi-napi) and `koffi.out/inout(koffi.pointer(x))` (koffi) to define a pointer.

#### `alloc(type: unknown): { pointer: Buffer, get: ()=> unknown }`

Allocate a buffer and get the corresponding data when passing a pointer to allow the called function to manipulate memory.

```js
import { dlopen, alloc } from "@xan105/ffi/[ napi | koffi ]";
const dylib = dlopen(...); //lib loading

const number = alloc("int"); //allocate Buffer for the output data
dylib.manipulate_number(number.pointer);
const result = number.get();
```