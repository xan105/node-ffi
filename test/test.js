//import { dlopen, types } from "../lib/ffi-napi.js";
import { dlopen, types } from "../lib/koffi.js";

const { BOOL } = types;

const lib = dlopen("xinput1_4", {
  "XInputEnable": {
    parameters: [BOOL],
    nonblocking: true
  }
}, { abi: "stdcall", ignoreMissingSymbol: false });

console.log(lib);