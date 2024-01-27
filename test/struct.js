import test from "node:test";
import assert from "node:assert/strict";
import { isWindows } from "@xan105/is";

const APIs = {
  koffi: await import("../lib/koffi/index.js"),
  "ffi-napi": await import("../lib/ffi-napi/index.js")
};

for (const [name, ffi] of Object.entries(APIs))
{

  test(`[${name}] Struct: no values`, () => {
    
      const POINT = new ffi.struct({
        x: ffi.types.i32,
        y: ffi.types.i32
      });
      
      const expected = { x: 0, y: 0 };
      const cursorPos = POINT.create();
      const actual = cursorPos.values;
      assert.deepEqual(actual, expected);
  });
  
  test(`[${name}] Struct: get/set values`, () => {
    
      const POINT = new ffi.struct({
        x: ffi.types.i32,
        y: ffi.types.i32
      });
      
      const expected = { x: 1, y: 2 };
      const cursorPos = POINT.create();
      cursorPos.values = { x: 1, y: 2, z: 3 };
      const actual = cursorPos.values;
      assert.deepEqual(actual, expected);
  });
  
};