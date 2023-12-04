import test from "node:test";
import assert from "node:assert/strict";
import { Failure, errorLookup } from "@xan105/error";
import { 
  isWindows, 
  isObjLike, 
  isBuffer, 
  isFunction,
  isIntegerPositive
} from "@xan105/is";

const APIs = {
  koffi: await import("../lib/koffi/index.js"),
  "ffi-napi": await import("../lib/ffi-napi/index.js")
};

for (const [name, ffi] of Object.entries(APIs))
{
  
  test(`[${name}] alloc`, {
    skip: isWindows() ? false : "This test runs on Windows"
  }, () => {
    
    const { SHQueryUserNotificationState } = ffi.dlopen("shell32.dll", {
      SHQueryUserNotificationState: {
        result: ffi.types.win32.HRESULT,
        parameters: [
          ffi.pointer(ffi.types.win32.ENUM, "out")
        ]
      }
    }, { 
      abi: "stdcall"
    });

    const pquns = ffi.alloc(ffi.types.win32.ENUM);
    assert.ok(isObjLike(pquns, {
      pointer: isBuffer,
      get: isFunction
    }));
      
    const hr = SHQueryUserNotificationState(pquns.pointer);
    if (hr < 0) throw new Failure(...errorLookup(hr, "hresult"));
      
    const state = pquns.get();
    assert.ok(isIntegerPositive(state));
    
  });
  
};