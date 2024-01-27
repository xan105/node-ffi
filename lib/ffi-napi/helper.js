/*
Copyright (c) Anthony Beaumont
This source code is licensed under the MIT License
found in the LICENSE file in the root directory of this source tree.
*/

import process from "node:process";
import ffi from "ffi-napi";
import ref from "ref-napi";
import ref_struct from "ref-struct-di";
import { shouldObj } from "@xan105/is/assert";
import { asArray, asBoolean } from "@xan105/is/opt";
import { isWindows, isFunction } from "@xan105/is";
import { errorLookup } from "@xan105/error";
import { GetLastError } from "./util/win32.js";
import { conventions } from "./util/abi.js";

const StructType = ref_struct(ref);

class Callback{

  #parameters;
  #result;
  #abi;
  #ref = null;
  #pointer = null;
  
  constructor(definition, callback = null){
  
    shouldObj(definition);
    this.#parameters = asArray(definition.parameters) ?? [];
    this.#result = definition.result || "void";
    this.#abi = conventions.includes(definition.abi) ? definition.abi : 
                {"cdecl": "ms_cdecl"}[definition.abi] ?? "default_abi";
    
    if(isFunction(callback)) this.register(callback);
  }
  
  register(callback = ()=>{}){
    if(this.#ref && this.#pointer) this.close();
    this.#pointer = ffi.Callback(
      this.#result, 
      this.#parameters, 
      ffi["FFI_" + this.#abi.toUpperCase()], 
      callback
    );
    
    // Make an extra reference to the callback pointer to avoid GC
    this.#ref = callback;
    process.on("exit", ()=>{ this.#ref });
  }
  
  get type(){
    return ref.refType(ref.types.void);
  }
  
  get pointer(){
    return this.#pointer;
  }
  
  get address(){
    if(!this.#pointer) return null;
    return ref.address(this.#pointer);
  }
  
  close(){
    process.removeAllListeners("exit");
    this.#pointer = null;
    this.#ref = null;
  }
}

function pointer(value){
  return ref.refType(value);
}

class Struct{
  
  #ref = null;
  #value = null;
  #members = null;
  
  constructor(type){
    this.#ref = type;
    this.#value = new this.#ref();
    this.#members = Object.keys(this.#value.toObject());
  }

  get pointer(){
    return this.#value.ref();
  }
  
  set values(object){
    shouldObj(object);
    for (const [ name, value ] of Object.entries(object)){ 
      if (this.#members.includes(name)) this.#value[name] = value;
    } 
  }
  
  get values(){
    return this.#value.toObject();
  }
}

function struct(schema){
  shouldObj(schema);
  return Object.assign(Object.create(null),{
    type: StructType(schema),
    create: function(){ 
      return new Struct(this.type);
    }
  });
}

function alloc(type){
  return Object.assign(Object.create(null), {
    pointer: ref.alloc(type),
    get: function(){ 
      return this.pointer.deref();
    }
  });
}

function lastError(option = {}){
  const errno = isWindows() ? GetLastError() : ffi.errno();
  const options = { translate: asBoolean(option?.translate) ?? true };
  return options.translate ? errorLookup(errno) : errno;
}

export { 
  Callback, 
  pointer,
  struct, 
  alloc,
  lastError
};