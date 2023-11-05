/*
Copyright (c) Anthony Beaumont
This source code is licensed under the MIT License
found in the LICENSE file in the root directory of this source tree.
*/

/*
⚠️ Experimental and not yet tested
Based on https://github.com/nodejs/node/pull/46905
*/

export const types = Object.assign(Object.create(null), {
  i8 : "char",
  u8 : "char", 
  i16 : "short",
  u16 : "ushort",
  i32 : "int",
  u32 : "uint",
  i64 : "long",
  u64 : "ulong",	
  //usize : koffi.types.size_t,	
  f32 : "float",
  f64 : "double",
  "function" : "pointer"
});