import koffi from "koffi";
import { shouldStringNotEmpty, shouldObj } from "@xan105/is/assert";
import { asArray } from "@xan105/is/opt";

class Callback{

  #ref
  #pointer
  
  constructor(name, definition, callback = ()=>{}){
  
    shouldStringNotEmpty(name);
    shouldObj(definition);
    
    const parameters = asArray(definition.parameters) ?? [];
    const result = definition.result || "void";

    const cb = koffi.callback(name, result, parameters);
    this.#pointer = koffi.pointer(cb);
    this.#ref = koffi.register(callback, this.#pointer);
  }
  
  get definition(){
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

export { Callback, pointer };