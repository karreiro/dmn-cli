/*
 * Copyright 2021 Red Hat, Inc. and/or its affiliates.
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

import { v4 } from "uuid";
import fs from "fs";
import { DataType } from "./DataType";

export const saveModelWithDataTypes = (dataTypes: DataType[]) => {
  const dmnModel = generateDmnModel(dataTypes);
  saveDmnFile("./types.dmn", dmnModel);
  console.log("\x1b[32mThe 'types.dmn' model has been successfully generated!\x1b[0m");
};

function saveDmnFile(filePath: string, dmnModelXml: string) {
  fs.writeFile(filePath, dmnModelXml, function (err) {
    if (err) {
      return console.error(err);
    }
  });
}

function generateDmnModel(dataTypes: DataType[]) {
  const namespaceUUID = uuid();
  return `
    <dmn:definitions xmlns:dmn="http://www.omg.org/spec/DMN/20180521/MODEL/"
      xmlns="https://kiegroup.org/dmn/${namespaceUUID}"
      xmlns:feel="http://www.omg.org/spec/DMN/20180521/FEEL/"
      xmlns:kie="http://www.drools.org/kie/dmn/1.2"
      xmlns:dmndi="http://www.omg.org/spec/DMN/20180521/DMNDI/"
      xmlns:di="http://www.omg.org/spec/DMN/20180521/DI/"
      xmlns:dc="http://www.omg.org/spec/DMN/20180521/DC/" id="_039698F4-792A-4168-BB57-98D5AD935AED" name="types" typeLanguage="http://www.omg.org/spec/DMN/20180521/FEEL/" namespace="https://kiegroup.org/dmn/${namespaceUUID}">
      ${dataTypes.map((dt) => getItemDefintionRow(dt)).join("")}
    </dmn:definitions>
  `;
}

function getItemDefintionRow(dataType: DataType) {
  return `
    <dmn:itemDefinition id="${uuid()}" name="${dataType.name}" isCollection="false">
      ${dataType.children?.map((dt) => getItemComponent(dt)).join("")}
    </dmn:itemDefinition>
  `;
}

function getItemComponent(dataType: DataType): string {
  return `
    <dmn:itemComponent id="${uuid()}" name="${dataType.name}" isCollection="false">
      ${getTypeRef(dataType)}
      ${dataType.children?.map((dt) => getItemComponent(dt)).join("")}
    </dmn:itemComponent>
  `;
}

function getTypeRef(dataType: DataType) {
  const type = dataType.type;
  if (type) {
    return `<dmn:typeRef>${type}</dmn:typeRef>`;
  }
  return "";
}

function uuid() {
  return `_${v4().toUpperCase()}`;
}
