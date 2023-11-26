/*
Copyright (c) Anthony Beaumont
This source code is licensed under the MIT License
found in the LICENSE file in the root directory of this source tree.
*/

/*
⚠️ Experimental and not yet tested
Based on https://github.com/nodejs/node/pull/46905
*/

import { Buffer } from "node:buffer";
import { endianness } from "node:os";
import { sizeof, getBufferPointer } from "node:ffi";

function alloc(type){
  const buffer = Buffer.alloc(sizeof(type));
  const buff = Object.assign(Object.create(null), {
    pointer: getBufferPointer(buffer),
    get: function(){ 
        switch(type){
          case "char":
          case "signed char":
            return buffer.readInt8();
          case "uchar":  
          case "unsigned char":
            return buffer.readUInt8();
          case "short":
          case "short int":
          case "signed short":  
          case "signed short int":
            return buffer["readInt16" + endianness]();  
          case "ushort":   
          case "unsigned short":
          case "unsigned short int":
            return buffer["readUInt16" + endianness](); 
          case "int":
          case "signed":
          case "signed int":
            return buffer["readInt32" + endianness]();
          case "uint":
          case "unsigned":
          case "unsigned int":
            return buffer["readUInt32" + endianness](); 
          case "long":
          case "long int":
          case "signed long":
          case "signed long int":
            return buffer["readBigInt64" + endianness]();
          case "ulong":
          case "unsigned long":
          case "unsigned long int":
            return buffer["readBigUInt64" + endianness]();
          case "float":
            return buffer["readFloat" + endianness]();
          case "double":
            return buffer["readDouble" + endianness]();
          default:
            return buffer;
        }
    }
  });
  return buff;
}

export {
  alloc
};