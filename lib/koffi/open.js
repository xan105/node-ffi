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
    abi: conventions.includes(option.abi) ? option.abi : "func"
  };

  const ext = {
    "win32": ".dll",
    "darwin": ".dylib",
  }[platform] ?? ".so";

  if (path.indexOf(ext) === -1) path += ext;
  const [dylib, err] = attemptify(koffi.load)(path);
   
  if(err && !options.ignoreLoadingFail){
    throw new Failure(err.message, { 
      code: "ERR_FFI", 
      cause: err, 
      info: { lib: path }
    });
  }
  
  const handle = function(symbol, result, parameters){
    try{
      if (!dylib) return undefined;
      return dylib[options.abi](symbol, result, parameters);
    }catch(err){
      if (
        options.ignoreMissingSymbol && 
        err.message.startsWith("Cannot find function") &&
        err.message.endsWith("in shared library")
      ) return undefined;
      throw new Failure(err.message, {
        code: "ERR_FFI", 
        cause: err, 
        info: { symbol }
      });
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
  
  return lib;
}

export { load, dlopen }