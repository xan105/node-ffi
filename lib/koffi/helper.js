/*
Copyright (c) Anthony Beaumont
This source code is licensed under the MIT License
found in the LICENSE file in the root directory of this source tree.
*/

import { Buffer } from "node:buffer";
import { randomUUID } from "node:crypto";
import koffi from "koffi";
import { shouldStringNotEmpty, shouldObj } from "@xan105/is/assert";
import { asArray, asBoolean } from "@xan105/is/opt";
import { isWindows, isFunction } from "@xan105/is";
import { errorLookup } from "@xan105/error";
import { GetLastError } from "./util/win32.js";
import { conventions } from "./util/abi.js";

class Callback{
  
  #ref = null;
  #pointer = null;
  
  constructor(definition, callback = null){

    shouldObj(definition);
    const parameters = asArray(definition.parameters) ?? [];
    const result = definition.result || "void";
    const abi = conventions.includes(definition.abi) ? definition.abi : "cdecl";
    
    const cb = koffi.proto("__" + abi, randomUUID(), result, parameters);
    this.#ref = koffi.pointer(cb);

    if(isFunction(callback)) this.register(callback);
  }
  
  register(callback = ()=>{}){
    if(this.#ref && this.#pointer) this.close();
    this.#pointer = koffi.register(callback, this.#ref);
  }
  
  get type(){
    return this.#ref;
  }
  
  get pointer(){
    return this.#pointer;
  }
  
  get address(){
    if(!this.#pointer) return null;
    return koffi.address(this.#pointer);
  }
  
  close(){
    if(this.#pointer) koffi.unregister(this.#pointer);
    this.#pointer = null;
    this.#ref = null;
  }
}

function pointer(value, direction = "in"){
  
  shouldStringNotEmpty(direction);
  
  const ptr = koffi.pointer(value);

  switch(direction){
    case "out":
      return koffi.out(ptr);
    case "inout":
      return koffi.inout(ptr);
    default:
      return ptr
  }
}

function struct(schema){
  return koffi.struct(schema);
}

class Struct{

  #ref = null;
  #value = {};
  #members = null;
  
  constructor(type){
    this.#ref = type;
    this.#members = Object.keys(koffi.introspect(this.#ref).members);
  }

  get pointer(){
    return this.#value;
  }

  set values(object){
    shouldObj(object);
    for (const [ name, value ] of Object.entries(object)){ 
      if (this.#members.includes(name)) this.#value[name] = value;
    } 
  }
  
  get values(){
    //Workaround to mimic ffi-napi output when empty/non-init by FFI lib
    if(Object.keys(this.#value).length === 0){
      for (const { name, type } of Object.values(koffi.introspect(this.#ref).members)){
        this.#value[name] = alloc(type).get();
      }
    }
    return this.#value;
  }
}

function structEx(schema){
  shouldObj(schema);
  return Object.assign(Object.create(null),{
    type: struct(schema),
    create: function(){ 
      return new Struct(this.type);
    }
  });
}

function alloc(type){
  return Object.assign(Object.create(null), {
    pointer: Buffer.alloc(koffi.sizeof(type)),
    get: function(){ 
      return koffi.decode(this.pointer, type);
    }
  });
}

function lastError(option = {}){
  const errno = isWindows() ? GetLastError() : koffi.errno();
  const options = { translate: asBoolean(option?.translate) ?? true };
  return options.translate ? errorLookup(errno) : errno;
}

export { 
  Callback, 
  pointer,
  struct,
  structEx,
  alloc,
  lastError
};