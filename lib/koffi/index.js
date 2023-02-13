/*
Copyright (c) Anthony Beaumont
This source code is licensed under the MIT License
found in the LICENSE file in the root directory of this source tree.
*/

import koffi from "koffi";
import * as windows from "./types/windows.js";
import * as rust from "./types/rust.js";
import { isWindows } from "@xan105/is";

function setAlias(list){
for (const [name, type] of Object.entries(list))
  if (koffi.types[name] === undefined) 
    koffi.alias(name,type);
}

if (isWindows()) setAlias(windows);
setAlias(rust);

export * from "./open.js";
export const types = {
  ...koffi.types,
  ...windows,
  ...rust
};