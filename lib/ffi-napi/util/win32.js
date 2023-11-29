import { dlopen } from "../open.js";
import { DWORD } from "../types/windows.js";

export const { GetLastError } = dlopen("kernel32.dll", {
  "GetLastError": {
    result: DWORD,
    nonblocking: false //!important
  }
}, { 
  abi: "stdcall",
  ignoreLoadingFail: true
});