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

type DataType = {
  label: string;
  children: DataType[];
};

class DmnInspector {
  private prefix?: string;
  private definitions?: any;
  private definitionsKey?: string;
  private namespace?: string;

  constructor(public dmnModel: any) {}

  getDefinitionsKey() {
    if (!this.definitionsKey) {
      this.definitionsKey = Object.keys(this.dmnModel)[0];
    }
    return this.definitionsKey;
  }

  getDefinitions() {
    if (!this.definitions) {
      this.definitions = this.dmnModel[(this, this.getDefinitionsKey())];
    }
    return this.definitions;
  }

  getPrefix() {
    if (!this.prefix) {
      this.prefix = this.getDefinitionsKey().split(":")[0];
    }
    return this.prefix;
  }

  getNamespace() {
    if (!this.namespace) {
      const namespaces = this.getDefinitions()["$"];
      const prefix = this.getPrefix();
      this.namespace = namespaces["xmlns:" + prefix];
    }
    return this.namespace || "(undefined namespace)";
  }

  getDmnDataType(dataTypeDefinition: any): DataType {
    try {
      const prefix = this.getPrefix();
      const name = dataTypeDefinition["$"]["name"];
      const typeRef = dataTypeDefinition[prefix + ":typeRef"] || "Structure";
      const label = `${name} (${typeRef})`;
      const children = (dataTypeDefinition[prefix + ":itemComponent"] || []).map((dt: any) => this.getDmnDataType(dt));

      return {
        label,
        children,
      };
    } catch (err) {
      raiseError("DMN model data type could not be parsed.");
    }
  }

  getDmnDataTypes(): DataType[] {
    const prefix = this.getPrefix();
    const dmnDataTypes: DataType[] = [];

    try {
      for (let [key, value] of Object.entries(this.getDefinitions())) {
        var definitionType = key.replace(prefix + ":", "");
        var definitions = value as any[];

        if (definitionType === "itemDefinition") {
          definitions.forEach((d) => dmnDataTypes.push(this.getDmnDataType(d)));
        }
      }
    } catch (err) {
      console.log(err);
      raiseError("DMN model data types could not be parsed.");
    }

    return dmnDataTypes;
  }

  getDmnNodes() {
    const prefix = this.getPrefix();
    const dmnNodes: string[] = [];

    try {
      for (let [key, value] of Object.entries(this.getDefinitions())) {
        var definitionType = key.replace(prefix + ":", "");
        var definitions = value as any[];

        switch (definitionType) {
          case "decision":
            definitions.forEach((d) => dmnNodes.push(d["$"]["name"] + " (Decision)"));
            break;
          case "inputData":
            definitions.forEach((d) => dmnNodes.push(d["$"]["name"] + " (Input Data)"));
            break;
          case "knowledgeSource":
            definitions.forEach((d) => dmnNodes.push(d["$"]["name"] + " (Knowledge Source)"));
            break;
          case "decisionService":
            definitions.forEach((d) => dmnNodes.push(d["$"]["name"] + " (Decision Service)"));
            break;
          case "businessKnowledgeModel":
            definitions.forEach((d) => dmnNodes.push(d["$"]["name"] + " (Business Knowledge Model)"));
            break;
          case "textAnnotation":
            definitions.forEach((d) => dmnNodes.push(d[prefix + ":text"][0] + " (Text Annotation)"));
        }
      }
    } catch (err) {
      console.log(err);
      raiseError("DMN model nodes could not be parsed.");
    }

    return dmnNodes;
  }

  getVersion() {
    const namespace = this.getNamespace();
    const namespaces: any = {
      "https://www.omg.org/spec/DMN/20191111/MODEL/": "1.3",
      "http://www.omg.org/spec/DMN/20180521/MODEL/": "1.2",
      "http://www.omg.org/spec/DMN/20151101/dmn.xsd": "1.1",
      "http://www.omg.org/spec/DMN/20130901": "1.0",
    };

    return "DMN " + namespaces[namespace] || `Undefined version for namespace: "${namespace}".`;
  }
}

export const inspect = (path: string) => {
  const dmnXml = fs.readFileSync(path, "utf8");

  parseStringPromise(dmnXml)
    .then((dmn: any) => {
      const inspector = new DmnInspector(dmn);

      // var jsonContent = JSON.stringify(dmn);
      // fs.writeFile("output.json", jsonContent, "utf8", (_) => {});

      logEntry("Version", inspector.getVersion());
      logEntries("DMN nodes", inspector.getDmnNodes());

      console.log(" ─ DMN data types:");
      inspector.getDmnDataTypes().forEach((dataType) => logDataType(1, dataType));
    })
    .catch(() => {
      raiseError("DMN model could not be parsed.");
    });
};

function logDataType(level: number, dataType: DataType) {
  const levelStr = "    ".repeat(level);
  console.log(`${levelStr}└ \x1b[32m${dataType.label}\x1b[0m`);
  dataType.children.forEach((dt) => logDataType(level + 1, dt));
}

function logEntry(key: string, value: string) {
  console.log(` ─ ${key}: \x1b[32m${value}\x1b[0m`);
}

function logEntries(key: string, values: string[]) {
  if (values.length === 0) {
    return;
  }
  console.log(` ─ ${key}:`);
  values.forEach((value) => {
    console.log(`    └ \x1b[32m${value}\x1b[0m`);
  });
}

function raiseError(errorMessage: string): never {
  console.error(`\x1b[31m :: Error (dmn-cli) :: ${errorMessage}\x1b[0m`);
  process.exit();
}
