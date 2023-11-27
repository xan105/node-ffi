import { dlopen, types } from "../../lib/ffi-napi/index.js";
//import { dlopen, types } from "../../lib/koffi/index.js";

const lib = dlopen("xinput1_4", {
  "XInputEnable": {
    symbol: "XInputEnable2",
    parameters: [types.win32.BOOL]
  }
}, { 
  abi: "stdcall",
  errorAtRuntime: true,
  ignoreMissingSymbol: false,
  stub: false,
  nonblocking: true
});

console.log(lib);

await lib.XInputEnable(1);