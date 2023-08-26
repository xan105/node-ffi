/*
Copyright (c) Anthony Beaumont
This source code is licensed under the MIT License
found in the LICENSE file in the root directory of this source tree.
*/

import { platform } from "node:process";
import { promisify } from "node:util";
import ffi from "ffi-napi";
import { Failure, attempt, errorLookup } from "@xan105/error";
import { asBoolean, asArray } from "@xan105/is/opt";
import { 
  shouldObj, 
  shouldObjWithinObj,
  shouldStringNotEmpty
} from "@xan105/is/assert";

function load(path, option = {}){

  shouldStringNotEmpty(path);
  shouldObj(option);

  const conventions = [
    "win64",
    "unix64",
    "ms_cdecl",
    "stdcall",
    "fastcall",
    "thiscall",
    "sysv",
    "vfp"
  ];

  const options = {
    ignoreLoadingFail: asBoolean(option.ignoreLoadingFail) ?? false,
    ignoreMissingSymbol: asBoolean(option.ignoreMissingSymbol) ?? false,
    abi: conventions.includes(option.abi) ? option.abi : "default_abi"
  };
  
  const ext = {
    "win32": ".dll",
    "darwin": ".dylib",
  }[platform] ?? ".so";
  
  if (path.indexOf(ext) === -1) path += ext;
  const [ dylib, err ] = attempt(ffi.DynamicLibrary, [
    path, 
    ffi.DynamicLibrary.FLAGS.RTLD_NOW, 
    ffi["FFI_" + options.abi.toUpperCase()]
  ]);
  
  if(err && !options.ignoreLoadingFail){
    const errCode = RegExp(/\d+$/).exec(err)?.[0];
    if(errCode == null){ //If couldn't extract error code
      err.code = "ERR_FFI";
      throw err; //Throw the default ffi error
    } else {
      const [ message ] = errorLookup(+errCode); //lookup error code
      throw new Failure(message, { 
        code: "ERR_FFI", 
        cause: err, 
        info: { lib: path }
      });
    }
  }

  const handle = function(symbol, result, parameters){
    try{
      if (!dylib) return undefined;
      const fnPtr = dylib.get(symbol);
      return ffi.ForeignFunction(fnPtr, result, parameters);
    }catch(err){
      const errCode = RegExp(/\d+$/).exec(err)?.[0];
      if(errCode == null){ //If couldn't extract error code
        err.code = "ERR_FFI";
        throw err; //Throw the default ffi error
      } else {
        const [ message, code ] = errorLookup(+errCode); //lookup error code
        if(
          options.ignoreMissingSymbol && 
          (code === "ERROR_PROC_NOT_FOUND" || err.message.includes("undefined symbol"))
        ) return undefined;
        throw new Failure(message, { 
          code: "ERR_FFI", 
          cause: err, 
          info: { symbol }
        });
      }
    }
  };

  return handle;
}

function dlopen(path, symbols, option){
  
  shouldObjWithinObj(symbols);

  const lib = Object.create(null);
  const handle = load(path, option);
  
  for (const [name, definition] of Object.entries(symbols)){
    
    if (name === "__proto__") continue; //not allowed
    
    const parameters = asArray(definition.parameters) ?? [];
    const result = definition.result || "void";
    const nonblocking = asBoolean(definition.nonblocking) ?? false;
    const symbol = definition.symbol || name;
    
    const fn = handle(symbol, result, parameters);
    if(typeof fn === "function")
      lib[name] = nonblocking ? promisify(fn.async) : fn;
  }
  return lib;
}

export { load, dlopen }