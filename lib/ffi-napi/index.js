/*
Copyright (c) Anthony Beaumont
This source code is licensed under the MIT License
found in the LICENSE file in the root directory of this source tree.
*/

import ref from "ref-napi";
import * as windows from "./types/windows.js";
import * as rust from "./types/rust.js";

export * from "./open.js";
export const types = {
  ...ref.types,
  ...windows,
  ...rust
};