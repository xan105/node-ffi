import { dlopen, types, Callback } from "../lib/ffi-napi/index.js";
//import { dlopen, types, Callback } from "../lib/koffi/index.js";

const lib = dlopen("xinput1_4", {
  "XInputEnable": {
    parameters: [types.win32.BOOL],
    nonblocking: true
  }
}, { 
  abi: "stdcall",
  ignoreLoadingFail: false,
  ignoreMissingSymbol: false 
});

console.log(lib);

await lib.XInputEnable(1);

const cb = new Callback({}, ()=>{});
console.log(cb.type);
console.log(cb.pointer);
console.log(cb.address);
cb.close();
console.log(cb.pointer);

console.log(types);