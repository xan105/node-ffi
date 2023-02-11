/*
Copyright (c) Anthony Beaumont
This source code is licensed under the MIT License
found in the LICENSE file in the root directory of this source tree.
*/

import { platform } from "node:os";
import { promisify } from "node:util";
import koffi from "koffi";
import { Failure, attempt } from "@xan105/error";
import { asBoolean, asStringNotEmpty, asArray } from "@xan105/is/opt";
import { 
  shouldObj, 
  //shoulObjWithinObj,
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
    ignoreMissingSymbol: asBoolean(option.ignoreMissingSymbol) ?? false,
    abi: conventions.includes(option.abi) ? option.abi : "func"
  };

  const ext = {
    "win32": ".dll",
    "darwin": ".dylib",
  }[platform()] ?? ".so";

  if (path.indexOf(ext) === -1) path += ext;
  const [dylib, err] = attempt(koffi.load, [path]);
   
  if(err) throw new Failure(err.message, { 
    code: 0, 
    cause: err, 
    info: path 
  });
   
  return function(name, result, parameters){
    try{
      return dylib[options.abi](name, result, parameters);
    }catch(err){
      if (
        options.ignoreMissingSymbol && 
        err.message.startsWith("Cannot find function") &&
        err.message.endsWith("in shared library")
      ) return undefined;
      throw new Failure(err.message, {code: 0, cause: err, info: name});
    }
  }
}

function dlopen(path, symbols, option){
  
  //shoulObjWithinObj(symbols);

  const lib = Object.create(null);
  const call = load(path, option);
  for (const [name, definition] of Object.entries(symbols)){
    
    const parameters = asArray(definition.parameters) ?? [];
    const result = definition.result || "void";
    const nonblocking = asBoolean(definition.nonblocking) ?? false;
    
    const fn = call(name, result, parameters);
    if(typeof fn === "function"){
      lib[name] = nonblocking ? promisify(fn.async) : fn;
    }
    
  }
  return lib;
}

export { load, dlopen }