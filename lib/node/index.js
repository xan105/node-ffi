/*
Copyright (c) Anthony Beaumont
This source code is licensed under the MIT License
found in the LICENSE file in the root directory of this source tree.
*/

/*
⚠️ Experimental and not yet tested
Based on https://github.com/nodejs/node/pull/46905
*/

import * as deno from "./types/deno.js";

export * from "./open.js";
export const types = Object.assign(Object.create(null), {
  //node/lib/ffi.js | These are not exported
  "void": "void",
  "char": "char",
  "signed char": "char",
  "unsigned char": "uchar",
  "short": "short",
  "short int": "short",
  "signed short": "short",
  "signed short int": "short",
  "unsigned short": "ushort",
  "unsigned short int": "ushort",
  "int": "int",
  "signed": "int",
  "signed int": "int",
  "unsigned": "uint",
  "unsigned int": "uint",
  "long": "long",
  "long int": "long",
  "signed long": "long",
  "signed long int": "long",
  "unsigned long": "ulong",
  "unsigned long int": "ulong",
  "float": "float",
  "double": "double",
  "pointer": "pointer",
  ...deno.types,
});