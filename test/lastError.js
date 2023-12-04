import test from "node:test";
import assert from "node:assert/strict";
import { isWindows } from "@xan105/is";

const APIs = {
  koffi: await import("../lib/koffi/index.js"),
  "ffi-napi": await import("../lib/ffi-napi/index.js")
};

for (const [name, ffi] of Object.entries(APIs))
{
  
  test(`[${name}] lastError()`, {
    skip: isWindows() ? false : "This test runs on Windows" 
  }, () => {
    
    const lib = ffi.dlopen("kernel32", {
      "SetLastError": {
        parameters: [ ffi.types.win32.DWORD ]
      }
    }, { abi: "stdcall" });

    lib.SetLastError(1);
    const errno = ffi.lastError();
    
    const expected = ["Incorrect function", "ERROR_INVALID_FUNCTION"];
    assert.deepEqual(errno, expected);
  }); 
  
};