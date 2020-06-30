"use strict";
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
exports.__esModule = true;
exports.inspect = void 0;
var fs_1 = require("fs");
var xml2js_1 = require("xml2js");
exports.inspect = function (path) {
    console.log("inspecting...", path);
    var dmnXml = fs_1["default"].readFileSync(path, "utf8");
    xml2js_1.parseStringPromise(dmnXml)
        .then(function (dmn) {
        console.log(dmn);
    })["catch"](function () {
        raiseError("DMN model could not be parsed.");
    });
};
function raiseError(errorMessage) {
    console.error("\n\n :: Error (dmn-cli) :: " + errorMessage + "\n");
    process.exit();
}
