/*
Copyright (c) Anthony Beaumont
This source code is licensed under the MIT License
found in the LICENSE file in the root directory of this source tree.
*/

import koffi from "koffi";

export const types = Object.assign(Object.create(null), {
  i8 : koffi.types.int8,
  u8 : koffi.types.uint8, 
  i16 : koffi.types.int16,
  u16 : koffi.types.uint16,
  i32 : koffi.types.int32,
  u32 : koffi.types.uint32,
  i64 : koffi.types.int64,
  u64 : koffi.types.uint64,	
  usize : koffi.types.size_t,	
  f32 : koffi.types.float,
  f64 : koffi.types.double,
  "function" : koffi.pointer(koffi.types.void)
});