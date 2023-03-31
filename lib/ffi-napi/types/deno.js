/*
Copyright (c) Anthony Beaumont
This source code is licensed under the MIT License
found in the LICENSE file in the root directory of this source tree.
*/

import ref from "ref-napi";

export const types = Object.assign(Object.create(null), {
  i8 : ref.types.int8,
  u8 : ref.types.uint8,
  i16 : ref.types.int16,
  u16 : ref.types.uint16,
  i32 : ref.types.int32,
  u32 : ref.types.uint32,
  i64 : ref.types.int64,	
  u64 : ref.types.uint64,	
  usize : ref.types.size_t,	
  f32 : ref.types.float,
  f64 : ref.types.double,
  "function" : ref.refType(ref.types.void)
});