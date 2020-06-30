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
var commander_1 = require("commander");
var preview_1 = require("./preview");
var inspect_1 = require("./inspect");
var program = new commander_1.Command();
program.name("dmn-cli");
program.description("DMN command line tool");
program.version("dmn-cli: 0.1.0", "-v, --version");
program
    .command("preview <path>")
    .description("shows an image of the DMN model")
    .action(function (path) { return preview_1.getPreview(path); });
program
    .command("inspect <path>")
    .description("inspect elements into the DMN model")
    .action(function (path) { return inspect_1.inspect(path); });
program.parse(process.argv);
