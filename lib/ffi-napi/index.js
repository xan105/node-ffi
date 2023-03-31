/*
Copyright (c) Anthony Beaumont
This source code is licensed under the MIT License
found in the LICENSE file in the root directory of this source tree.
*/

import ref from "ref-napi";
import * as win32 from "./types/windows.js";
import * as deno from "./types/deno.js";

export * from "./open.js";
export * from "./helper.js";
export const types = Object.assign(Object.create(null), {
  pointer: ref.refType(ref.types.void),
  ...ref.types,
  ...deno.types,
  win32
});