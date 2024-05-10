/*
Copyright (c) Anthony Beaumont
This source code is licensed under the MIT License
found in the LICENSE file in the root directory of this source tree.
*/

import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { shouldStringNotEmpty } from "@xan105/is/assert";

function hashFileSync(filePath, algo = "sha256"){
  
  shouldStringNotEmpty(filePath);
  shouldStringNotEmpty(algo);

  const sum = createHash(algo);
  const chunk = readFileSync(filePath);
  sum.update(chunk);
  return sum.digest("base64");
}

export { hashFileSync }