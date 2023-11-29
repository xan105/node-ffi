import test from "node:test";
import assert from "node:assert/strict";
import { isWindows, isPromise } from "@xan105/is";

const APIs = {
  koffi: await import("../lib/koffi/index.js"),
  "ffi-napi": await import("../lib/ffi-napi/index.js")
};

for (const [name, ffi] of Object.entries(APIs))
{
  
  test(`[${name}] nonblocking`, {
    skip: isWindows ? false : "This test runs on Windows" 
  }, () => {
    
    const { setCursorPos } = ffi.dlopen("user32.dll", {
      setCursorPos: {
        symbol: "SetCursorPos",
        result: ffi.types.win32.BOOL,
        parameters: [ ffi.types.i32, ffi.types.i32 ],
        nonblocking: true
      }
    }, { abi: "stdcall" });
    
    assert.ok(typeof setCursorPos === "function");
    
    const handle = setCursorPos(2,2);
    handle.then((value)=>{
      assert.ok(typeof value === "number");
    });
    assert.ok(isPromise(handle));
  });
  
};