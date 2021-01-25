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

import { FieldInfo, JavaClassFile, JavaClassFileReader, SourceFileAttributeInfo } from "java-class-tools";
import fs from "fs";
import { join as joinPath } from "path";
import { DataType } from "./DataType";

export const fetchJavaClassesAsDataTypes = (path: string): DataType[] => {
  const dataTypes: DataType[] = [];

  getJavaClasses(path).forEach((javaClassPath) => {
    const javaClass = getJavaClass(javaClassPath);
    const dataType: DataType = {
      name: getClassName(javaClass),
      type: "",
      children: [],
    };

    javaClass.fields.forEach((fieldInfo) => {
      const childDataType: DataType = {
        name: getFieldName(javaClass, fieldInfo)!,
        type: getFieldType(javaClass, fieldInfo),
      };

      if (!!childDataType.type) {
        dataType.children!.push(childDataType);
      }
    });

    dataTypes.push(dataType);
  });

  return dataTypes;
};

function getJavaClasses(path: string) {
  return readJavaClassesFromDir(path, []);
}

function getClassName(javaClass: JavaClassFile) {
  const classNameIndex = getClassNameIndex(javaClass);
  const className = getNameFromConstantPool(javaClass, classNameIndex) || "";
  return className.replace(/\.java*$/, "");
}

function getClassNameIndex(javaClass: JavaClassFile) {
  const attr = javaClass.attributes.filter((attr) => {
    return getNameFromConstantPool(javaClass, attr.attribute_name_index) === "SourceFile";
  });
  if (attr.length > 0) {
    const sourceFileAttribute = attr[0] as SourceFileAttributeInfo;
    return sourceFileAttribute.sourcefile_index;
  }
  return -1;
}

function getFieldName(javaClass: JavaClassFile, fieldInfo: FieldInfo) {
  return getNameFromConstantPool(javaClass, fieldInfo.name_index);
}

function getFieldType(javaClass: JavaClassFile, fieldInfo: FieldInfo) {
  const fullName = getNameFromConstantPool(javaClass, fieldInfo.descriptor_index) || "";
  const fullNameParts = fullName.split("/");
  const typeName = fullNameParts.pop() || "";
  return typeName.slice(0, -1);
}

function getNameFromConstantPool(javaClass: JavaClassFile, index: number) {
  try {
    const nameInConstantPool = javaClass.constant_pool[index] as any;
    return textDecoder().decode(new Uint8Array(nameInConstantPool.bytes));
  } catch (error) {
    return "";
  }
}

function getJavaClass(path: string) {
  return new JavaClassFileReader().read(path);
}

function textDecoder() {
  return new TextDecoder();
}

function readJavaClassesFromDir(path: string, javaClasses: string[]) {
  if (!fs.existsSync(path)) {
    throw new Error(`The directory ${path} does not exist.`);
  }

  fs.readdirSync(path).forEach((file) => {
    const fileName = joinPath(path, file);
    const isPath = fs.lstatSync(fileName).isDirectory();
    if (isPath) {
      readJavaClassesFromDir(fileName, javaClasses);
    } else if (fileName.indexOf(".class") >= 0) {
      javaClasses.push(fileName);
    }
  });

  return javaClasses;
}
