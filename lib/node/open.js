/*
Copyright (c) Anthony Beaumont
This source code is licensed under the MIT License
found in the LICENSE file in the root directory of this source tree.
*/

/*
⚠️ Experimental and not yet tested
Based on https://github.com/nodejs/node/pull/46905
*/

import { platform } from "node:process";
import { getNativeFunction } from "node:ffi";
import { Failure } from "@xan105/error";
import { asBoolean, asArray } from "@xan105/is/opt";
import { 
  shouldObj, 
  shouldObjWithinObj,
  shouldStringNotEmpty
} from "@xan105/is/assert";

function load(path, option = {}){
  
  shouldStringNotEmpty(path);
  shouldObj(option);

  const options = {
    ignoreLoadingFail: asBoolean(option.ignoreLoadingFail) ?? false,
    ignoreMissingSymbol: asBoolean(option.ignoreMissingSymbol) ?? false
  };

  const ext = {
    "win32": ".dll",
    "darwin": ".dylib",
  }[platform] ?? ".so";

  if (path.indexOf(ext) === -1) path += ext;

  const handle = function(symbol, result, parameters){
    try{
      return getNativeFunction(path, symbol, result, parameters);
    }catch(err){
      if(err.code === "ERR_FFI_LIBRARY_LOAD_FAILED" && options.ignoreLoadingFail)
        return undefined;
      else if (err.code === "ERR_FFI_SYMBOL_NOT_FOUND" && options.ignoreMissingSymbol)
        return undefined;
        
      throw new Failure(err.message, {
        code: "ERR_FFI", 
        cause: err, 
        info: { lib: path, symbol }
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
    if(typeof fn === "function") lib[name] = fn;
  }
  
  return lib;
}

export { load, dlopen }