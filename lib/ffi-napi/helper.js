import process from "node:process";
import ffi from "ffi-napi";
import ref from "ref-napi";
import { shouldObj } from "@xan105/is/assert";
import { asArray } from "@xan105/is/opt";

class Callback{

  #ref
  #pointer
  
  constructor(definition, callback = ()=>{}){
  
    shouldObj(definition);
    
    const parameters = asArray(definition.parameters) ?? [];
    const result = definition.result || "void";
    
    this.#pointer = ffi.Callback(result, parameters, callback);
    
    // Make an extra reference to the callback pointer to avoid GC
    this.#ref = function(){ callback };
    process.on("exit", this.#ref);
  }
  
  get definition(){
    return "pointer";
  }
  
  get pointer(){
    return this.#pointer;
  }
  
  close(){
    process.off("exit", this.#ref);
    this.#ref = null;
    this.#pointer = null;
  }
}

function pointer(value){
  return ref.refType(value);
}

export { Callback, pointer };