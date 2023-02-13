About
=====

Foreign Function Interface helper. Provides a friendly abstraction/API for:

- [ffi-napi](https://www.npmjs.com/package/ffi-napi) (MIT)
- [koffi](https://www.npmjs.com/package/koffi) (LGPL3)

Example
=======

Loading a library with Deno like syntax

```js
import { dlopen } from "@xan105/ffi/napi";
//OR
import { dlopen } from "@xan105/ffi/koffi";

const lib = dlopen("libm", {
  "ceil": { 
    result: "double", 
    parameters: [ "double" ] 
  }
});
lib.ceil(1.5); // 2
```

Calling from a library

```js
import { load, types } from "@xan105/ffi/napi";
//OR
import { load, types} from "@xan105/ffi/koffi";

const call = load("user32.dll", { abi: "stdcall" });
const MessageBoxA = call("MessageBoxA", "int", ["void *", types.LPCSTR, types.LPCSTR, "uint"]);

const MB_ICONINFORMATION = 0x40;
MessageBoxA(null, "Hello World!", "Message", MB_ICONINFORMATION);
```

Install
=======

```
npm install @xan105/ffi
```

Please note that `ffi-napi` and `koffi` are optional peer dependencies.<br />
Install the one you wish to use yourself (or both 🙃).

🤓 My personal recommendation ? give `koffi` a try you won't regret it 🚀 ! 

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

- `ignoreMissingSymbol?: boolean` (false)

Silent fail if the given library doesn't have the called symbol.<br />
💡 Called symbol will be `undefined` in that case.

- `abi?: string` ("func" for koffi and "default_abi" for ffi-napi)

ABI convention to use. Use this when you need to ex: winapi x86 requires "stdcall".

**Return**

```ts
function(name: string | number, result: any, parameters: any[]): any;
```

💡 `Koffi` can call by ordinal (name:number)

See the corresponding FFI library for more information on what to pass for `result` and `parameters` as they have string type parser, structure/array/pointer interface, ... and other features.

❌ Throws on error

**Example**:

```js
import { load } from "@xan105/ffi/...";
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
      result?: any,
      parameters?: any[],
      nonblocking?: boolean
    },
    ...
  }
```
  
  When `nonblocking` is `true` (default false) this will return the promisified `async()` method of the corresponding symbol (see corresponding ffi library asynchronous calling). The rest is the same as for `load()`.
  
- option?: object

  Pass option(s) to `load()`. See above.
  
**Return** 

  An object with the given symbol(s) as properties.
  
  ❌ Throws on error
  
**Example**

```js
import { dlopen, types } from "@xan105/ffi/...";
const { BOOL } = types;

const lib = dlopen("xinput1_4", {
  "XInputEnable": {
    parameters: [BOOL],
    nonblocking: true
  }
}, { abi: "stdcall" });

await lib.XInputEnable(1);
```

#### `const types: object`

The FFI Library's primitive types as well as corresponding alias such as Windows specific types (DWORD,...) are exposed for convenience.

```js
import { types } from "@xan105/ffi/napi";
//or
import { types } from "@xan105/ffi/koffi";
```

When using `koffi` alias are also set with `koffi.alias()`.

```js
import { load } from "@xan105/ffi/koffi";
const call = load("user32.dll", { abi: "stdcall" });
const MessageBoxA = call("MessageBoxA", "int", ["void *", "LPCSTR", "LPCSTR", "uint"]);
```