/*
 * Copyright 2020 Red Hat, Inc. and/or its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import fs from "fs";
import { parseStringPromise } from "xml2js";

export const inspect = (path: string) => {
  console.log("inspecting...", path);

  const dmnXml = fs.readFileSync(path, "utf8");

  parseStringPromise(dmnXml)
    .then((dmn) => {
      console.log(getDmnVersion(dmn));
    })
    .catch(() => {
      raiseError("DMN model could not be parsed.");
    });
};

function getDmnVersion(dmn: any) {
  const definition = Object.keys(dmn)[0] as string;
  const prefix = definition.split(":")[0];
  const namespace = dmn[definition]["$"]["xmlns:" + prefix];
  const namespaces: any = {
    "https://www.omg.org/spec/DMN/20191111/MODEL/": "DMN 1.3",
    "http://www.omg.org/spec/DMN/20180521/MODEL/": "DMN 1.2",
    "http://www.omg.org/spec/DMN/20151101/dmn.xsd": "DMN 1.1",
    "http://www.omg.org/spec/DMN/20130901": "DMN 1.0",
  };

  return namespaces[namespace];
}

function raiseError(errorMessage: string): never {
  console.error(`\n\n :: Error (dmn-cli) :: ${errorMessage}\n`);
  process.exit();
}
