//import { dlopen, types } from "../lib/ffi-napi/index.js";
import { dlopen } from "../lib/koffi/index.js";

const lib = dlopen("xinput1_4", {
  "XInputEnable": {
    parameters: ["BOOL"],
    nonblocking: true
  }
}, { abi: "stdcall", ignoreMissingSymbol: false });

console.log(lib);

await lib.XInputEnable(1);