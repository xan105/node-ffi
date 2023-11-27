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
      if (err.code === "ERR_FFI_SYMBOL_NOT_FOUND" && options.ignoreMissingSymbol)
        return undefined;

      if(err.code === "ERR_FFI_LIBRARY_LOAD_FAILED" && options.ignoreLoadingFail)
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

function dlopen(path, symbols, option = {}){
  
  shouldObjWithinObj(symbols);

  shouldObj(option);
  const options = {
    errorAtRuntime: asBoolean(option.errorAtRuntime) ?? false,
    stub: asBoolean(option.stub) ?? false
  };
  
  delete option.errorAtRuntime;
  delete option.stub;

  const lib = Object.create(null);
  const handle = load(path, option);

  for (const [name, definition] of Object.entries(symbols)){
    
    if (name === "__proto__") continue; //not allowed
    
    const symbol = definition.symbol || name;
    const result = definition.result || "void";
    const parameters = asArray(definition.parameters) ?? [];

    //global option override
    const stub = asBoolean(definition.stub) ?? options.stub;

    const [ fn, err ] = attemptify(handle)(symbol, result, parameters);
    if(err && options.errorAtRuntime === false ) throw err;
    
    if(typeof fn === "function")
      lib[name] = fn;
    else if(err)
      lib[name] = ()=>{ throw err };
    else if(stub)
      lib[name] = ()=>{};
  }
  
  return lib;
}

export { load, dlopen }