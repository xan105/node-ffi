import test from "node:test";
import assert from "node:assert/strict";
import { isWindows } from "@xan105/is";

const APIs = {
  koffi: await import("../lib/koffi/index.js"),
  "ffi-napi": await import("../lib/ffi-napi/index.js")
};

for (const [name, ffi] of Object.entries(APIs))
{
  
  test(`[${name}] Basic dlopen`, {
    skip: isWindows() ? false : "This test runs on Windows"
  }, () => {
    
    const POINT = ffi.structEx({
      x: ffi.types.win32.LONG,
      y: ffi.types.win32.LONG
    });
    
    const {
      setCursorPos,
      getCursorPos
    } = ffi.dlopen("user32.dll", {
      setCursorPos: {
        symbol: "SetCursorPos",
        result: ffi.types.win32.BOOL,
        parameters: [ ffi.types.i32, ffi.types.i32 ]
      },
      getCursorPos: {
        symbol: "GetCursorPos",
        result: ffi.types.win32.BOOL,
        parameters: [ ffi.pointer(POINT.type, "out") ]
      }
    }, { abi: "stdcall" });

    const expected = { x: 1, y: 1 };
    setCursorPos(...Object.values(expected));
    
    const cursorPos = POINT.create();
    getCursorPos(cursorPos.pointer);
    const actual = cursorPos.values;
    assert.deepEqual(actual, expected);
  });
  
};