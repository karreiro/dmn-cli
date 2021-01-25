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

import { DataType } from "./DataType";

export const convertJavaTypesToDmnTypes = (dataTypes: DataType[]): DataType[] => {
  const customTypes = dataTypes.map((dt) => dt.name);
  return dataTypes.map((dataType) => convertDataType(dataType, customTypes));
};

function convertDataType(dataType: DataType, customTypes: string[]): DataType {
  return {
    name: dataType.name,
    type: inferDmnType(dataType.type, customTypes),
    children: dataType.children?.map((dt) => convertDataType(dt, customTypes)) || [],
  };
}

function inferDmnType(type: string, customTypes: string[]) {
  const isStructureType = !type;
  if (isStructureType) {
    return "";
  }

  const isBuiltInType = !customTypes.includes(type);
  if (isBuiltInType) {
    return inferBuiltInType(type);
  }

  return type;
}

function inferBuiltInType(type: string) {
  const javaToDmnMap = {
    Number: "number",
    AtomicInteger: "number",
    AtomicLong: "number",
    BigDecimal: "number",
    BigInteger: "number",
    Byte: "number",
    Double: "number",
    DoubleAccumulator: "number",
    DoubleAdder: "number",
    Float: "number",
    Integer: "number",
    Long: "number",
    LongAccumulator: "number",
    LongAdder: "number",
    Short: "number",
    Striped64: "number",
    String: "string",
    Character: "string",
    LocalDate: "date",
    LocalTime: "time",
    OffsetTime: "time",
    ZonedDateTime: "date and time",
    OffsetDateTime: "date and time",
    LocalDateTime: "date and time",
    Date: "date and time",
    Duration: "duration",
    ChronoPeriod: "duration",
    Boolean: "boolean",
  };
  return (javaToDmnMap as any)[type] || "any";
}
