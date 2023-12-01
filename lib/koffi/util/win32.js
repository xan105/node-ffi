/*
Copyright (c) Anthony Beaumont
This source code is licensed under the MIT License
found in the LICENSE file in the root directory of this source tree.
*/

import { dlopen } from "../open.js";
import { DWORD } from "../types/windows.js";

export const { GetLastError } = dlopen("kernel32.dll", {
  "GetLastError": {
    result: DWORD,
    nonblocking: false
  }
}, { 
  abi: "stdcall",
  ignoreLoadingFail: true
});