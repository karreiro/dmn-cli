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

import { Command } from "commander";
import { preview } from "./preview";
import { inspect } from "./inspect";
import { fetchTypes } from "./fetch-types";

const program = new Command();

program.name("dmn-cli");
program.description("DMN command line tools");
program.version("dmn-cli: 0.1.0", "-v, --version");

program
  .command("preview <path>")
  .description("shows an image of the DMN model")
  .action((path) => preview(path));

program
  .command("inspect <path>")
  .description("inspects elements into the DMN model")
  .action((path) => inspect(path));

program
  .command("fetch-types <path>")
  .description("fetches types from a path and creates a 'types.dmn' model with them")
  .action((path) => fetchTypes(path));

program.parse(process.argv);
