/*
Copyright (c) Anthony Beaumont
This source code is licensed under the MIT License
found in the LICENSE file in the root directory of this source tree.
*/

import { platform } from "node:process";
import { promisify } from "node:util";
import koffi from "koffi";
import { Failure, attemptify } from "@xan105/error";
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
    "cdecl", 
    "func", //allias to cdecl
    "stdcall",
    "fastcall",
    "thiscall"
  ];
  
  const options = {
    ignoreLoadingFail: asBoolean(option.ignoreLoadingFail) ?? false,
    ignoreMissingSymbol: asBoolean(option.ignoreMissingSymbol) ?? false,
    lazy: asBoolean(option.lazy) ?? false,
    abi: conventions.includes(option.abi) ? option.abi : "func"
  };

  const ext = {
    "win32": ".dll",
    "darwin": ".dylib",
  }[platform] ?? ".so";

  if (path.indexOf(ext) === -1) path += ext;
  const [dylib, err] = attemptify(koffi.load)(path, { lazy: options.lazy });

  const handle = function(symbol, result, parameters){
    try{
      if (err) throw err;
      return dylib[options.abi](symbol, result, parameters);
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

    if(typeof fn === "function")
      lib[name] = nonblocking ? promisify(fn.async) : fn;
    else if(err)
      lib[name] = nonblocking ? ()=>{ return Promise.reject(err) } : ()=>{ throw err };
    else if(stub)
      lib[name] = nonblocking ? ()=>{ return Promise.resolve() } : ()=>{};
  }

  return lib;
}

export { load, dlopen }