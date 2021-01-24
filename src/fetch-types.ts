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

import { fetchJavaClassesAsDataTypes } from "./fetchTypes/javaReader";
import { convertJavaTypesToDmnTypes } from "./fetchTypes/javaToDmnConverter";
import { saveModelWithDataTypes } from "./fetchTypes/dmnExporter";

export const fetchTypes = (path: string) => {
  try {
    const javaDataTypes = fetchJavaClassesAsDataTypes(path);
    const dmnDataTypes = convertJavaTypesToDmnTypes(javaDataTypes);

    saveModelWithDataTypes(dmnDataTypes);
  } catch (err) {
    console.log(`Error: ${err.message}`);
  }
};
