import koffi from "koffi";
import { shouldObj } from "@xan105/is/assert";
import { attempt } from "@xan105/error";

export function setAlias(types){  
  shouldObj(types);
  for (const [name, type] of Object.entries(types))
    if (koffi.types[name] === undefined) 
      attempt(koffi.alias, [name, type]);
}