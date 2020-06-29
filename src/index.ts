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
import puppeteer from "puppeteer";
import open from "open";
import fs from "fs";

declare global {
  const gwtEditorBeans: {
    get: (
      editorName: string
    ) => {
      get: () => {
        setContent: (_a: string, _b: string) => void;
      };
    };
  };
}

(async () => {
  const a0 = new Date().getTime();
  const browser = await puppeteer.launch();
  const a1 = new Date().getTime();
  console.log("launch: " + (a1 - a0) + "ms");
  const page = await browser.newPage();
  const a2 = new Date().getTime();
  console.log("new page: " + (a2 - a1) + "ms");
  await page.goto(`file:///${__dirname}/dmn-editor/index.html`);
  const a3 = new Date().getTime();
  console.log("go to: " + (a3 - a2) + "ms");
  await page.waitForSelector("body");
  const a4 = new Date().getTime();
  console.log("load body: " + (a4 - a3) + "ms");

  await page.evaluate(function () {
    gwtEditorBeans
      .get("DMNDiagramEditor")
      .get()
      .setContent(
        "",
        '<dmn:definitions xmlns:dmn="http://www.omg.org/spec/DMN/20180521/MODEL/" xmlns="https://kiegroup.org/dmn/_2D33DF49-5887-43C7-A5F1-CC77660CB14F" xmlns:feel="http://www.omg.org/spec/DMN/20180521/FEEL/" xmlns:kie="http://www.drools.org/kie/dmn/1.2" xmlns:dmndi="http://www.omg.org/spec/DMN/20180521/DMNDI/" xmlns:di="http://www.omg.org/spec/DMN/20180521/DI/" xmlns:dc="http://www.omg.org/spec/DMN/20180521/DC/" id="_216175AC-8BBF-428A-BA98-8FB0171425CE" name="new-file" typeLanguage="http://www.omg.org/spec/DMN/20180521/FEEL/" namespace="https://kiegroup.org/dmn/_2D33DF49-5887-43C7-A5F1-CC77660CB14F"><dmn:extensionElements/><dmn:decision id="_DDA343D1-5547-441F-83BA-8D3E19CEC3F8" name="Decision-1"><dmn:extensionElements/><dmn:variable id="_1737734A-00CD-4A69-9D0A-1C13B6634D12" name="Decision-1"/></dmn:decision><dmn:decision id="_FF8E9F45-4451-4962-80ED-2B7A27DAE0DA" name="Decision-2"><dmn:extensionElements/><dmn:variable id="_64348A58-E8B5-4AC7-9303-6BD4889E8AC4" name="Decision-2"/></dmn:decision><dmndi:DMNDI><dmndi:DMNDiagram><di:extension><kie:ComponentsWidthsExtension/></di:extension><dmndi:DMNShape id="dmnshape-_DDA343D1-5547-441F-83BA-8D3E19CEC3F8" dmnElementRef="_DDA343D1-5547-441F-83BA-8D3E19CEC3F8" isCollapsed="false"><dmndi:DMNStyle><dmndi:FillColor red="255" green="255" blue="255"/><dmndi:StrokeColor red="0" green="0" blue="0"/><dmndi:FontColor red="0" green="0" blue="0"/></dmndi:DMNStyle><dc:Bounds x="90" y="196" width="100" height="50"/><dmndi:DMNLabel/></dmndi:DMNShape><dmndi:DMNShape id="dmnshape-_FF8E9F45-4451-4962-80ED-2B7A27DAE0DA" dmnElementRef="_FF8E9F45-4451-4962-80ED-2B7A27DAE0DA" isCollapsed="false"><dmndi:DMNStyle><dmndi:FillColor red="255" green="255" blue="255"/><dmndi:StrokeColor red="0" green="0" blue="0"/><dmndi:FontColor red="0" green="0" blue="0"/></dmndi:DMNStyle><dc:Bounds x="2605" y="66" width="100" height="50"/><dmndi:DMNLabel/></dmndi:DMNShape></dmndi:DMNDiagram></dmndi:DMNDI></dmn:definitions>'
      );
  });
  const a5 = new Date().getTime();
  console.log("execute set content: " + (a5 - a4) + "ms");

  await page.waitForSelector("canvas");
  const a6 = new Date().getTime();
  console.log("wait canvas load: " + (a6 - a5) + "ms");
  await page.click("canvas");
  const a7 = new Date().getTime();
  console.log("click on canvas: " + (a7 - a6) + "ms");
  await page.click("ul.nav.nav-tabs > li + li a");
  const a8 = new Date().getTime();
  console.log("open doc tab: " + (a8 - a7) + "ms");
  await page.waitForSelector("ul.nav.nav-tabs > li + li.active");
  const a9 = new Date().getTime();
  console.log("wait doc active: " + (a9 - a8) + "ms");

  const img = await page.$eval(".diagram-image", (el) => (el as any).src);
  const a10 = new Date().getTime();
  console.log("get image: " + (a10 - a9) + "ms");

  const data = img.replace(/^data:image\/\w+;base64,/, "");

  fs.writeFileSync("image.png", Buffer.from(data, "base64"));

  open("image.png");

  // await canvas!.screenshot({
  //   path: "logo-screenshot.png",
  // });

  await browser.close();
})();

// -- WOKRS OPEN ----------------------------------------------------
// import open from "open";

// (async () => {
//   await open("/Users/karreiro/Projects/dmn-cli/docs/diagram-dmn.png");
// })();
// -- WOKRS OPEN ---------------

// -- WOKRS CLI ----------------------------------------------------
// import { Command } from "commander";
// const program = new Command();

// program.name("dmn-cli");
// program.description("DMN command line tool");
// program.version("dmn-cli: 0.1.0", "-v, --version");

// program
//   .command("preview <path>")
//   .description("shows an image of the DMN model")
//   .action((path) => {
//     getModelPreview(path);
//   });

// program
//   .command("inspect <path>")
//   .description("inspect elements into the DMN model")
//   .action((path) => {
//     console.log("inspect", path);
//   });

// program.parse(process.argv);
// -- WOKRS CLI ---------------
