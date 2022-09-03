/*
Copyright (c) Anthony Beaumont
This source code is licensed under the MIT License
found in the LICENSE file in the root directory of this source tree.
*/

import ffi from "ffi-napi";
import { Failure, attempt, errorLookup } from "@xan105/error";
import { shouldStringNotEmpty, shouldObj } from "@xan105/is/assert";
import { asBoolean, asStringNotEmpty } from "@xan105/is/opt";

function load(name, option = {}){

  shouldStringNotEmpty(name);

  const options = {
    silentFail: asBoolean(option.silentFail) ?? false,
    mode: asStringNotEmpty(option.mode)
  };
  
  const { FLAGS } = ffi.DynamicLibrary;
  const [ lib, err ] = attempt(ffi.DynamicLibrary, [
    name, 
    FLAGS[options.mode] ?? FLAGS.RTLD_NOW, 
    ffi.FFI_DEFAULT_ABI;
  ]);
  
  if(err){
    const errCode = RegExp(/\d+$/).exec(err)?.[0];
    if(errCode === null) //If couldn't extract error code
      throw err; //Throw the default ffi error
    else {
      const [ message, code ] = errorLookup(+errCode); //lookup error code
      throw new Failure(message, { code, cause: err, info: name });
    }
  }

  return function(fnSymbol, resultType, paramType){
    shouldStringNotEmpty(fnSymbol);
    try{
      const fnPtr = lib.get(fnSymbol);
      return ffi.ForeignFunction(fnPtr, resultType, paramType);
    }catch(err){
      if (options.silentFail) return null;
      const errCode = RegExp(/\d+$/).exec(err)?.[0];
      if(errCode === null) //If couldn't extract error code
        throw err; //Throw the default ffi error
      else {
        const [ message, code ] = errorLookup(+errCode); //lookup error code
        throw new Failure(message, { code, cause: err, info: fnSymbol });
      }
    }
  };
}

function dlopen(name, func){
  
  shouldObj(func);
  
  let lib = Object.create(null);
  const call = load(name);
  for (const [fnSymbol, fnDefinition] of Object.entries(func)){
    
    const parameters = asArray(fnDefinition.parameters) ?? [];
    const result = fnDefinition.result || "void";
    const nonblocking = asBoolean(fnDefinition.nonblocking) ?? false;
    
    const fn = call(fnSymbol, result, parameters);
    lib[fnSymbol] = nonblocking ? fn.async : fn;
    
  }
  return lib;
}


class Callback {

  constructor(name, fnDefinition, cb = ()=>{}){
    const parameters = asArray(fnDefinition.parameters) ?? [];
    const result = fnDefinition.result || "void";
       
    this.callback = ffi.Callback(result, parameters, cb);
    
    // Make an extra reference to the callback pointer to avoid GC
    process.on("exit", function () {
      this.callback;
    }); 
  }
  
  pointer(){ 
    return this.callback;
  }

}

//deno types
const Types = {
"i8": ref.types.int8,  
"u8":	ref.types.uint8, 
"i16": ref.types.int16,
"u16": ref.types.uint16,
"i32": ref.types.int32,
"u32": ref.types.uint32,
"i64": ref.types.int64,	
"u64": ref.types.uint64,	
"usize": ref.types.size_t,	
"f32": ref.types.float,
"f64": ref.types.double,
"void": ref.types.void,
"pointer": ref.types.pointer,
//"function":
};

export { load, dlopen }