import test from "node:test";
import assert from "node:assert/strict";
import { isWindows } from "@xan105/is";

const APIs = {
  koffi: await import("../lib/koffi/index.js"),
  "ffi-napi": await import("../lib/ffi-napi/index.js")
};

for (const [name, ffi] of Object.entries(APIs))
{
  
  test(`[${name}] errorAtRuntime: fail load lib`, {
    skip: isWindows ? false : "This test runs on Windows" 
  }, () => {
    
    const lib = ffi.dlopen("xoutput1_4", { //fake
      "XInputEnable": {
        parameters: [ ffi.types.win32.BOOL ]
      }
    }, { 
      abi: "stdcall",
      errorAtRuntime: true
    });

    try{
      lib.XInputEnable(1);
    }catch(err){
      assert.equal(err.code, "ERR_FFI");

      if(name === "ffi-napi")
        assert.equal(err.cause.message, "Dynamic Linking Error: Win32 error 126");
      else
        assert.equal(err.cause.message, "Failed to load shared library: The specified module could not be found."); 
    }
  });
  
  test(`[${name}] errorAtRuntime: fail load lib (ignore)`, {
    skip: isWindows ? false : "This test runs on Windows" 
  }, () => {
    
    const lib = ffi.dlopen("xoutput1_4", { //fake
      "XInputEnable": {
        parameters: [ ffi.types.win32.BOOL ]
      }
    }, { 
      abi: "stdcall",
      errorAtRuntime: true,
      ignoreLoadingFail: true
    });

    assert.equal(lib.XInputEnable, undefined);
  }); 
  
  test(`[${name}] errorAtRuntime: missing symbol`, {
    skip: isWindows ? false : "This test runs on Windows" 
  }, () => {
    
    const lib = ffi.dlopen("xinput1_4", {
      "XInputEnable": {
        symbol: "XOutputEnable", //fake
        parameters: [ ffi.types.win32.BOOL ]
      }
    }, { 
      abi: "stdcall",
      errorAtRuntime: true
    });

    try{
      lib.XInputEnable(1);
    }catch(err){
      assert.equal(err.code, "ERR_FFI");
      
      if(name === "ffi-napi")
        assert.equal(err.cause.message, "Dynamic Symbol Retrieval Error: Win32 error 127");
      else
        assert.equal(err.cause.message, "Cannot find function 'XOutputEnable' in shared library");
    }
  });
  
  test(`[${name}] errorAtRuntime: missing symbol (ignore)`, {
    skip: isWindows ? false : "This test runs on Windows" 
  }, () => {
    
    const lib = ffi.dlopen("xinput1_4", {
      "XInputEnable": {
        symbol: "XOutputEnable", //fake
        parameters: [ ffi.types.win32.BOOL ]
      }
    }, { 
      abi: "stdcall",
      errorAtRuntime: true,
      ignoreMissingSymbol: true
    });

    assert.equal(lib.XInputEnable, undefined);
  }); 
  
};