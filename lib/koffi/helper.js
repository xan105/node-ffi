/*
Copyright (c) Anthony Beaumont
This source code is licensed under the MIT License
found in the LICENSE file in the root directory of this source tree.
*/

import { Buffer } from "node:buffer";
import { randomUUID } from "node:crypto";
import koffi from "koffi";
import { shouldStringNotEmpty, shouldObj } from "@xan105/is/assert";
import { asArray } from "@xan105/is/opt";

class Callback{
  
  #ref
  #pointer
  
  constructor(definition, callback = null){

    shouldObj(definition);
    
    const parameters = asArray(definition.parameters) ?? [];
    const result = definition.result || "void";
    
    const cb = koffi.callback(randomUUID(), result, parameters);
    this.#pointer = koffi.pointer(cb);

    if(typeof callback === "function"){
      this.register(callback);
    }
  }
  
  register(callback = ()=>{}){
    if(this.#pointer && this.#ref) this.close();
    this.#ref = koffi.register(callback, this.#pointer);
  }
  
  get type(){
    return this.#pointer;
  }
  
  get pointer(){
    return this.#ref;
  }
  
  close(){
    koffi.unregister(this.#ref);
    this.#ref = null;
    this.#pointer = null;
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

function alloc(type){
  return {
    pointer: Buffer.alloc(koffi.sizeof(type)),
    get: function(){ 
      return koffi.decode(this.pointer, type);
    }
  }
}

export { Callback, pointer, alloc };