import test from "node:test";
import assert from "node:assert/strict";
import { isWindows } from "@xan105/is";

const APIs = {
  koffi: await import("../lib/koffi/index.js"),
  "ffi-napi": await import("../lib/ffi-napi/index.js")
};

for (const [name, ffi] of Object.entries(APIs))
{
  
  test(`[${name}] Basic dylib calling`, {
    skip: isWindows ? false : "This test runs on Windows" 
  }, () => {
    
    const lib = ffi.load("user32.dll", { abi: "stdcall" });
    const setCursorPos = lib("SetCursorPos", ffi.types.win32.BOOL, [
      ffi.types.i32, 
      ffi.types.i32
    ]);
    
    const POINT = ffi.struct({
      x: ffi.types.win32.LONG,
      y: ffi.types.win32.LONG
    });
    
    const getCursorPos = lib("GetCursorPos", ffi.types.win32.BOOL, [
      ffi.pointer(POINT, "out")
    ]);
    
    const expected = { x: 0, y: 0 };
    setCursorPos(...Object.values(expected));
    
    if(name === "ffi-napi")
    {
      const cursorPos = new POINT();
      getCursorPos(cursorPos.ref());
      const actual = { x: cursorPos.x, y: cursorPos.y };
      assert.deepEqual(actual, expected);
    } 
    else 
    {
      const actual = {};
      getCursorPos(actual);
      assert.deepEqual(actual, expected);
    }
  });
   
};