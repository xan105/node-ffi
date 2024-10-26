/*
Copyright (c) Anthony Beaumont
This source code is licensed under the MIT License
found in the LICENSE file in the root directory of this source tree.
*/

import { platform } from "node:process";
import { promisify } from "node:util";
import ffi from "ffi-napi";
import { Failure, attemptify, errorLookup } from "@xan105/error";
import { asBoolean, asArray, asStringLike } from "@xan105/is/opt";
import { 
  shouldObj, 
  shouldObjWithinObj,
  shouldStringNotEmpty
} from "@xan105/is/assert";
import { conventions } from "./util/abi.js";
import { hashFileSync } from "../util.js"

function load(path, option = {}){

  shouldStringNotEmpty(path);
  shouldObj(option);

  const options = {
    ignoreLoadingFail: asBoolean(option.ignoreLoadingFail) ?? false,
    ignoreMissingSymbol: asBoolean(option.ignoreMissingSymbol) ?? false,
    lazy: asBoolean(option.lazy) ?? false,
    global: asBoolean(option.global) ?? false,
    abi: conventions.includes(option.abi) ? 
         option.abi : 
         {"cdecl": "ms_cdecl"}[option.abi] ?? "default_abi",
    integrity: asStringLike(option.integrity, "SRI") ?? ""
  };
  
  const ext = {
    "win32": ".dll",
    "darwin": ".dylib",
  }[platform] ?? ".so";
  
  let flags = 0;
  flags |= options.lazy ? ffi.DynamicLibrary.FLAGS.RTLD_LAZY : ffi.DynamicLibrary.FLAGS.RTLD_NOW;
  flags |= options.global ? ffi.DynamicLibrary.FLAGS.RTLD_GLOBAL : ffi.DynamicLibrary.FLAGS.RTLD_LOCAL;
  
  if (!path.endsWith(ext)) path += ext;
  
  //sri
  if(options.integrity){
    const [ algo, expected ] = options.integrity.split("-");
    const [ hash = "" ] = attemptify(hashFileSync)(path, algo);
    if(hash !== expected){
      throw new Failure("Integrity check failed ! Dylib loading has been aborted.", {
        code: "ERR_INTEGRITY",
        info : { path, algo, hash }
      });
    }
  }
  
  const [ dylib, err ] = attemptify(ffi.DynamicLibrary)(
    path,
    flags, 
    ffi["FFI_" + options.abi.toUpperCase()]
  );

  const handle = function(symbol, result, parameters){
    try{
      if (err) throw err;
      const fnPtr = dylib.get(symbol);
      return ffi.ForeignFunction(fnPtr, result, parameters);
    }catch(err){
      //lookup error code
      const errCode = RegExp(/\d+$/).exec(err)?.[0];
      const [ message, code ] = errCode ? errorLookup(+errCode) : [ err.message ];
      
      if(
        options.ignoreMissingSymbol && 
        (code === "ERROR_PROC_NOT_FOUND" || message.includes("undefined symbol"))
      ) return undefined;
      
      if(!dylib && options.ignoreLoadingFail) return undefined;
      
      throw new Failure(message, {
        code: "ERR_FFI",
        cause: err, 
        info: { lib: path, symbol }
      });
    }
  };

  return handle;
}

function dlopen(path, symbols, option = {}){
  
  shouldObjWithinObj(symbols);
  shouldObj(option);
  
  const options = {
    errorAtRuntime: asBoolean(option.errorAtRuntime) ?? false,
    nonblocking: asBoolean(option.nonblocking) ?? false,
    stub: asBoolean(option.stub) ?? false
  };
  
  delete option.errorAtRuntime;
  delete option.nonblocking;
  delete option.stub;

  const lib = Object.create(null);
  const handle = load(path, option);
  
  for (const [name, definition] of Object.entries(symbols)){
    
    if (name === "__proto__") continue; //not allowed
    
    const symbol = definition.symbol || name;
    const result = definition.result || "void";
    const parameters = asArray(definition.parameters) ?? [];
    
    //override
    const nonblocking = asBoolean(definition.nonblocking) ?? options.nonblocking;
    const stub = asBoolean(definition.stub) ?? options.stub;
    
    const [ fn, err ] = attemptify(handle)(symbol, result, parameters);
    if(err && options.errorAtRuntime === false ) throw err;

    if(typeof fn === "function"){
      lib[name] = nonblocking ? promisify(fn.async) : fn;
      delete lib[name].async;
    }
    else if(err)
      lib[name] = nonblocking ? ()=>{ return Promise.reject(err) } : ()=>{ throw err };
    else if(stub)
      lib[name] = nonblocking ? ()=>{ return Promise.resolve() } : ()=>{};
  }
  return lib;
}

export { load, dlopen }