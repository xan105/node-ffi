About
=====

Foreign Function Interface (FFI) helper. Provides a friendly abstraction/API for:

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

Asynchronous calling

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

const lib = load("user32.dll", { abi: "stdcall" });
const MessageBoxA = lib("MessageBoxA", "int", [
  "void *", 
  types.win32.LPCSTR, 
  types.win32.LPCSTR, 
  "uint"
]);

const MB_ICONINFORMATION = 0x40;
MessageBoxA(null, "Hello World!", "Message", MB_ICONINFORMATION);
```

Callback with Deno like syntax

```js
import { dlopen, Callback} from "@xan105/ffi/koffi";

const lib = dlopen(
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

lib.set_status_callback(callback.pointer);
lib.start_long_operation();
callback.close();
```

Install
=======

```
npm install @xan105/ffi
```

Please note that `ffi-napi` and `koffi` are optional peer dependencies.<br />
Install the one you wish to use yourself (or both 🙃).

### ⚛️ Electron

⚠️ NB: As of this writing `ffi-napi` does not work with Electron >= 21.x.<br />
Due to [Electron and the V8 Memory Cage](https://www.electronjs.org/blog/v8-memory-cage).

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

⚙️ **Option**

- `ignoreLoadingFail?: boolean` (false)

When set to `true` the handle function will silently fail if the given library couldn't be loaded and return `undefined` in such case.

- `ignoreMissingSymbol?: boolean` (false)

When set to `true` the handle function will silently fail if the given library doesn't have the called symbol and return `undefined` in such case.

- `lazy?: boolean` (false)

When set to `true` use `RTLD_LAZY` (lazy-binding) on POSIX platforms otherwise use `RTLD_NOW`.

- `global?: boolean` (false)

When set to `true` use `RTLD_GLOBAL` on POSIX platforms otherwise use `RTLD_LOCAL`.

- `abi?: string` (koffi: "func" | ffi-napi: "default_abi")

ABI convention to use. Use this when you need to.<br />
_ex: Win32 API (x86) requires "stdcall"._

```js
[
  "cdecl", "ms_cdecl", //koffi & ffi-napi
  "stdcall", //koffi & ffi-napi
  "fastcall", //koffi & ffi-napi
  "thiscall", //koffi & ffi-napi
  "win64", //ffi-napi
  "unix64", //ffi-napi
  "sysv", //ffi-napi
  "vfp" //ffi-napi
]
```

**Return**

An handle function to call library's symbol(s).

```ts
function(symbol: string | number, result: unknown, parameters: unknown[]): unknown
```

💡 `Koffi` can call by ordinal (symbol:number)

See the corresponding FFI library for more information on what to pass for `result` and `parameters` as they have string type parser, structure/array/pointer interface, ... and other features.

❌ Throws on error

**Example**:

```js
import { load } from "@xan105/ffi/[ napi | koffi ]";
const lib = load("libm");
const ceil = lib("ceil", "double", ["double"]);
ceil(1.5); //2
```

#### `dlopen(path: string, symbols: object, option?: object): object`

Open library and define exported symbols. This is a friendly wrapper to `load()` inspired by Deno FFI `dlopen` syntax.<br />
If you ever use ffi-napi `ffi.Library()` this will be familiar.

**Param**

- `path: string`

  Library path to load.
  
- `symbols: object`

  Symbol(s) definition:

```ts
  {
    name: {
      symbol?: string | number,
      result?: unknown,
      parameters?: unknown[],
      nonblocking?: boolean,
      stub?: boolean
    },
    ...
  }
```

  By default the property `name` is used for `symbol`. Use `symbol` if you are using a symbol name different than the given property name or if you want to call by ordinal (Koffi).
  
  `result` and `parameters` are the same as for the returned handle from `load()`.<br />
  If omitted, `result` is set to "void" and `parameters` to an empty array.<br />
  See the corresponding FFI library for more information on what to pass for `result` and `parameters` as they have string type parser, structure/array/pointer interface, ... and other features.
  
  When `nonblocking` is `true` the corresponding symbol will return the promisified `async()` method (asynchronous calling). 💡 If set, this superseed the _"global"_ `nonblocking` option (see below).
  
  When `stub` is `true` the corresponding symbol will return a no-op if its missing.<br />
  💡 If set, this superseed the _"global"_ `stub` option (see below).
  
- ⚙️ `option?: object`

  Same as `load()` (see above) in addition to the following:
  
    + `errorAtRuntime?: boolean` (false)
    
      When set to `true`, initialisation error will be thrown on symbol invocation. 
    
    + `nonblocking?: boolean` (false)
    
      When set to `true`, every symbols will return the corresponding promisified `async()` method (asynchronous calling).<br />
     💡 This can be overriden per symbol (see symbol definition above).
    
    + `stub?: boolean` (false)
    
      When set to `true`, every missing symbols will return a no-op.<br />
      💡 This can be overriden per symbol (see symbol definition above).
  
**Return** 

  An object with the given symbol(s) as properties.
  
  ❌ Throws on error. 
  
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
const lib = load("user32.dll", { abi: "stdcall" });
const MessageBoxA = lib("MessageBoxA", "int", ["void *", "LPCSTR", "LPCSTR", "uint"]);
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
  
  `(definition: { result: unknown, parameters: unknown[], abi?: string }, callback?: Function | null)`
  
##### Properties
  
  - `pointer: unknown` _(read only)_
  
  The pointer to the callback.
  
  - `address: number | BigInt | null` _(read only)_
  
  The memory address of the pointer.
  
  - `type: unknown` _(read only)_
  
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

#### `pointer(value: unknown, direction?: string): unknown`

Just a shorthand to define a pointer.

```js
import { dlopen, types, pointer } from "@xan105/ffi/[ napi | koffi ]";

const dylib = dlopen("shell32.dll", {
  SHQueryUserNotificationState: {
    result: types.win32.HRESULT,
    parameters: [
      pointer(types.win32.ENUM, "out")
    ]
  }
}, { abi: "stdcall" });
```

#### `struct(schema: unknown): unknown`

Just a shorthand to define a structure.

```js
import { dlopen, types, struct, pointer } from "@xan105/ffi/[ napi | koffi ]";

const POINT = struct({ //define struct
  x: types.win32.LONG,
  y: types.win32.LONG
});

const dylib = dlopen("user32.dll", { //lib loading
    GetCursorPos: {
      result: types.win32.BOOL,
      parameters: [ pointer(POINT, "out") ] //struct pointer
    }
  }, { abi: "stdcall" });
```

⚠️ NB: Struct are use differently afterwards:

- Koffi

```js
const cursorPos = {};
GetCursorPos(cursorPos);
console.log(cursorPos) 
//{ x: 0, y: 0 }
```

- ffi-napi

```js
const cursorPos = new POINT();
GetCursorPos(cursorPos.ref());

//access the properties directly
console.log({ x: cursorPos.x, y: cursorPos.y }); //{ x: 0, y: 0 }

//or call .toObject()/.toJSON() (alias) to get a JS Object
console.log(cursorPos.toObject()); //{ x: 0, y: 0 }
```

#### `structEx(schema: object): object`

💡 It is worth noting that while the goal of this lib is to write the same code with different FFI libraries; 
when using Koffi you can just use Koffi's `struct()` function as Koffi converts JS objects to C structs, and vice-versa.

Define a structure. The returned object has 2 properties:

- `type: unknown` 

The type of the struct.

- `create: ()=> Class instance`

Return an instance of a class wrapper to the FFI library's struct functions.

##### Class properties
  
  - `pointer: unknown` _(read only)_
  
  The pointer to the struct.
  
  - `values: object`
  
  Get or set the values of the struct.
  
##### Example
  
```js
import { dlopen, types, struct, pointer } from "@xan105/ffi/[ napi | koffi ]";

const POINT = struct({ //define struct
  x: types.win32.LONG,
  y: types.win32.LONG
});

const dylib = dlopen("user32.dll", { //lib loading
    GetCursorPos: {
      result: types.win32.BOOL,
      parameters: [ pointer(POINT.type, "out") ] //struct pointer
    }
  }, { abi: "stdcall" });

const cursorPos = POINT.create();
GetCursorPos(cursorPos.pointer);
console.log(cursorPos.values) //{ x: 0, y: 0 }
```

#### `alloc(type: unknown): { pointer: Buffer, get: ()=> unknown }`

Allocate a buffer and get the corresponding data when passing a pointer to allow the called function to manipulate memory.

```js
import { dlopen, alloc } from "@xan105/ffi/[ napi | koffi ]";
const dylib = dlopen(...); //lib loading

const number = alloc("int"); //allocate Buffer for the output data
dylib.manipulate_number(number.pointer);
const result = number.get();
```

#### `lastError(option?: object): string[] | number`

Shorthand to errno (POSIX) and GetLastError (win32).

⚙️ **Option**

 - `translate?: boolean` (true)
 
When an error code is known it will be 'translated' to its corresponding message and code values as<br /> `[message: string, code?: string]`. If you only want the raw numerical code set it to `false`.

ex:
```js
if(result !== 0){ //something went wrong

  console.log(lastError())
  //['No such file or directory', 'ENOENT']

  console.log(lastError({ translate: false }));
  // 2
}
```