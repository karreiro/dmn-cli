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

import { Browser, launch } from "puppeteer";
import open from "open";
import fs from "fs";
import ProgressBar from "progress";

const DIAGRAM_NAME = "diagram.png";

export const getPreview = (path: string) =>
  (async () => {
    let dmnXml: string = "";
    let diagramData: string = "";
    let browser: Browser;
    let progressBar: ProgressBar;

    try {
      dmnXml = fs.readFileSync(path, "utf8");
    } catch (e) {
      raiseError(`This path could not be read: ${path}`);
    }

    try {
      browser = await initBrowser();
      progressBar = initProgressBar();
    } catch (e) {
      raiseError("DMN command line tool was not correctly installed.");
    }

    try {
      progressBar.tick(1);
      diagramData = await getDMNDiagramImage(dmnXml, browser, progressBar);
    } catch (e) {
      raiseError("DMN model preview could not be generated.");
    }

    try {
      progressBar.tick(1);
      createImageFile(diagramData);
    } catch (e) {
      raiseError("DMN model preview image file could not be created.");
    }

    try {
      progressBar.tick(1);
      open(DIAGRAM_NAME);
    } catch (e) {
      raiseError("DMN model preview image file could not be opened.");
    }

    try {
      await browser.close();
    } catch (e) {
      process.exit();
    }
  })();

async function initBrowser() {
  return await launch({
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--no-first-run",
      "--no-zygote",
      "--disable-gpu",
    ],
  });
}

async function getDMNDiagramImage(
  dmnXml: string,
  browser: Browser,
  progressBar: ProgressBar
) {
  const page = await browser.newPage();

  progressBar.tick(1);
  await page.goto(`file:///${__dirname}/dmn-editor/index.html`);

  progressBar.tick(1);
  await page.waitForSelector("body");

  progressBar.tick(1);
  await page.evaluate((xml) => {
    gwtEditorBeans.get("DMNDiagramEditor").get().setContent("", xml);
  }, dmnXml);

  progressBar.tick(1);
  await page.waitForSelector("canvas");

  progressBar.tick(1);
  await page.focus("ul.nav.nav-tabs > li + li a");
  await page.click("ul.nav.nav-tabs > li + li a");

  progressBar.tick(1);
  await page.waitForSelector("ul.nav.nav-tabs > li + li.active");

  progressBar.tick(1);
  const diagramData = page.$eval(
    ".diagram-image",
    (el) => (el as any).src as string
  );

  return diagramData;
}

function initProgressBar() {
  return new ProgressBar(
    "Generating DMN model preview [:bar] (:current/:total)",
    {
      complete: "=",
      incomplete: " ",
      width: 20,
      total: 10,
    }
  );
}

function createImageFile(imageData: string) {
  const data = imageData.replace(/^data:image\/\w+;base64,/, "");

  fs.writeFileSync(DIAGRAM_NAME, Buffer.from(data, "base64"));
}

function raiseError(errorMessage: string): never {
  console.error(`\n\n :: Error (dmn-cli) :: ${errorMessage}\n`);
  process.exit();
}

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
