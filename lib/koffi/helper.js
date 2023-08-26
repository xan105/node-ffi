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
  
  #ref = null;
  #pointer = null;
  
  constructor(definition, callback = null){

    shouldObj(definition);
    
    const parameters = asArray(definition.parameters) ?? [];
    const result = definition.result || "void";
    
    const cb = koffi.proto(randomUUID(), result, parameters);
    this.#ref = koffi.pointer(cb);

    if(typeof callback === "function"){
      this.register(callback);
    }
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

function alloc(type){
  return {
    pointer: Buffer.alloc(koffi.sizeof(type)),
    get: function(){ 
      return koffi.decode(this.pointer, type);
    }
  }
}

export { Callback, pointer, alloc };