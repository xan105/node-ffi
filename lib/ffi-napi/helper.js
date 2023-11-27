/*
Copyright (c) Anthony Beaumont
This source code is licensed under the MIT License
found in the LICENSE file in the root directory of this source tree.
*/

import process from "node:process";
import ffi from "ffi-napi";
import ref from "ref-napi";
import { shouldObj } from "@xan105/is/assert";
import { asArray } from "@xan105/is/opt";

class Callback{

  #parameters;
  #result;
  #ref = null;
  #pointer = null;
  
  constructor(definition, callback = null){
  
    shouldObj(definition);
    this.#parameters = asArray(definition.parameters) ?? [];
    this.#result = definition.result || "void";
    
    if(typeof callback === "function"){
      this.register(callback);
    }
  }
  
  register(callback = ()=>{}){
    
    if(this.#ref && this.#pointer) this.close();

    this.#pointer = ffi.Callback(this.#result, this.#parameters, callback);
    
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

function alloc(type){
  return Object.assign(Object.create(null), {
    pointer: ref.alloc(type),
    get: function(){ 
      return this.pointer.deref();
    }
  });
}

export { Callback, pointer, alloc };