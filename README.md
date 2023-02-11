About
=====

**F**oreign **F**unction **I**nterface helper.<br />
Provides a friendly abstraction/API for:

- [ffi-napi](https://www.npmjs.com/package/ffi-napi)
- [koffi](https://www.npmjs.com/package/koffi)

Example
=======

Loading a library with Deno like syntax

```js
import { dlopen } from "@xan105/ffi/ffi-napi";
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
import { load } from "@xan105/ffi/ffi-napi";
//OR
import { load } from "@xan105/ffi/koffi";

const call = load("user32.dll", { abi: "stdcall" });

const MessageBoxW = call("MessageBoxW", "int", ["void *", "str16", "str16", "uint"]);

const MB_ICONINFORMATION = 0x40;
MessageBoxW(null, "Hello World!", "Message", MB_ICONINFORMATION);
```

Install
=======

`npm install @xan105/ffi`

Please note that `ffi-napi` and `koffi` are optional peer dependencies.<br />
Install the one you wish to use yourself (or both 🙃).

API
===

⚠️ This module is only available as an ECMAScript module (ESM).

💡 This lib doesn't have a default entry point. Choose the export corresponding to your liking.

```js
import ... from "@xan105/ffi/ffi-napi/types";
//OR
import ... from "@xan105/ffi/koffi/types";
```

💡 FFI library's primitive types as well as corresponding alias such as Windows specific types (DWORD,...) are exposed under the `types` namespace for convenience.

```js
import { types } from "@xan105/ffi/koffi/";
import * as types from "@xan105/ffi/koffi/types";
import { DWORD, i32, uint8 } from "@xan105/ffi/koffi/types";
```

### Named export

#### `load(path: string, option?: object): function`

#### `dlopen(path: string, symbols: object, option?: object): object`