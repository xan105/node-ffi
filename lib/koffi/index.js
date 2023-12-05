/*
Copyright (c) Anthony Beaumont
This source code is licensed under the MIT License
found in the LICENSE file in the root directory of this source tree.
*/

import koffi from "koffi";
import * as win32 from "./types/windows.js";
import * as deno from "./types/deno.js";
import { isWindows } from "@xan105/is";
import { shouldObj } from "@xan105/is/assert";
import { attempt } from "@xan105/error";

const setAlias = function(types){  
  shouldObj(types);
  for (const [name, type] of Object.entries(types))
    if (koffi.types[name] === undefined) 
      attempt(koffi.alias, [name, type]);
};

if (isWindows()) setAlias(win32);
setAlias({
  pointer: koffi.pointer(koffi.types.void),
  ...deno.types
});

export * from "./open.js";
export * from "./helper.js";
export const types = Object.assign(Object.create(null), {
  pointer: koffi.pointer(koffi.types.void),
  ...koffi.types,
  ...deno.types,
  win32
});