/*
Copyright (c) Anthony Beaumont
This source code is licensed under the MIT License
found in the LICENSE file in the root directory of this source tree.
*/

import { platform } from "node:process";
import { promisify } from "node:util";
import koffi from "koffi";
import { Failure, attemptify } from "@xan105/error";
import { asBoolean, asArray, asStringLike } from "@xan105/is/opt";
import { 
  shouldObj, 
  shouldObjWithinObj,
  shouldStringNotEmpty
} from "@xan105/is/assert";
import { conventions } from "./util/abi.js";
import { hashFileSync } from "../util.js";

function load(path, option = {}){
  
  shouldStringNotEmpty(path);
  shouldObj(option);

  const options = {
    ignoreLoadingFail: asBoolean(option.ignoreLoadingFail) ?? false,
    ignoreMissingSymbol: asBoolean(option.ignoreMissingSymbol) ?? false,
    lazy: asBoolean(option.lazy) ?? false,
    global: asBoolean(option.global) ?? false, 
    abi: conventions.includes(option.abi) ? option.abi : "cdecl",
    integrity: asStringLike(option.integrity, "SRI") ?? ""
  };

  const ext = {
    "win32": ".dll",
    "darwin": ".dylib",
  }[platform] ?? ".so";
  
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
  
  const [dylib, err] = attemptify(koffi.load)(path, { 
    lazy: options.lazy,
    global: options.global
  });
  
  const handle = function(symbol, result, parameters){
    try{
      if (err) throw err;
      return dylib.func("__" + options.abi, symbol, result, parameters);
    }catch(err){
      if (
        options.ignoreMissingSymbol && 
        err.message.startsWith("Cannot find function") &&
        err.message.endsWith("in shared library")
      ) return undefined;
      
      if(!dylib && options.ignoreLoadingFail) return undefined;
      
      throw new Failure(err.message, {
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