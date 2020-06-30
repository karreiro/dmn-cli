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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.getPreview = void 0;
var puppeteer_1 = require("puppeteer");
var open_1 = require("open");
var fs_1 = require("fs");
var progress_1 = require("progress");
var DIAGRAM_NAME = "diagram.png";
exports.getPreview = function (path) {
    return (function () { return __awaiter(void 0, void 0, void 0, function () {
        var dmnXml, diagramData, browser, progressBar, e_1, e_2, e_3;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    dmnXml = "";
                    diagramData = "";
                    try {
                        dmnXml = fs_1["default"].readFileSync(path, "utf8");
                    }
                    catch (e) {
                        raiseError("This path could not be read: " + path);
                    }
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, initBrowser()];
                case 2:
                    browser = _c.sent();
                    progressBar = initProgressBar();
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _c.sent();
                    raiseError("DMN command line tool was not correctly installed.");
                    return [3 /*break*/, 4];
                case 4:
                    _c.trys.push([4, 6, , 7]);
                    progressBar.tick(1);
                    return [4 /*yield*/, getDMNDiagramImage(dmnXml, browser, progressBar)];
                case 5:
                    diagramData = _c.sent();
                    return [3 /*break*/, 7];
                case 6:
                    e_2 = _c.sent();
                    raiseError("DMN model preview could not be processed.");
                    return [3 /*break*/, 7];
                case 7:
                    try {
                        progressBar.tick(1);
                        createImageFile(diagramData);
                    }
                    catch (e) {
                        raiseError("DMN model preview image file could not be created.");
                    }
                    try {
                        progressBar.tick(1);
                        open_1["default"](DIAGRAM_NAME);
                    }
                    catch (e) {
                        raiseError("DMN model preview image file could not be opened.");
                    }
                    _c.label = 8;
                case 8:
                    _c.trys.push([8, 10, , 11]);
                    return [4 /*yield*/, browser.close()];
                case 9:
                    _c.sent();
                    return [3 /*break*/, 11];
                case 10:
                    e_3 = _c.sent();
                    process.exit();
                    return [3 /*break*/, 11];
                case 11: return [2 /*return*/];
            }
        });
    }); })();
};
function initBrowser() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, puppeteer_1.launch({
                        args: [
                            "--no-sandbox",
                            "--disable-setuid-sandbox",
                            "--disable-dev-shm-usage",
                            "--no-first-run",
                            "--no-zygote",
                            "--disable-gpu",
                        ]
                    })];
                case 1: return [2 /*return*/, _c.sent()];
            }
        });
    });
}
function getDMNDiagramImage(dmnXml, browser, progressBar) {
    return __awaiter(this, void 0, void 0, function () {
        var page, diagramData;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, browser.newPage()];
                case 1:
                    page = _c.sent();
                    progressBar.tick(1);
                    return [4 /*yield*/, page.goto("file:///" + __dirname + "/dmn-editor/index.html")];
                case 2:
                    _c.sent();
                    progressBar.tick(1);
                    return [4 /*yield*/, page.waitForSelector("body")];
                case 3:
                    _c.sent();
                    progressBar.tick(1);
                    return [4 /*yield*/, page.evaluate(function (xml) {
                            gwtEditorBeans.get("DMNDiagramEditor").get().setContent("", xml);
                        }, dmnXml)];
                case 4:
                    _c.sent();
                    progressBar.tick(1);
                    return [4 /*yield*/, page.waitForSelector("canvas")];
                case 5:
                    _c.sent();
                    progressBar.tick(1);
                    return [4 /*yield*/, page.focus("ul.nav.nav-tabs > li + li a")];
                case 6:
                    _c.sent();
                    return [4 /*yield*/, page.click("ul.nav.nav-tabs > li + li a")];
                case 7:
                    _c.sent();
                    progressBar.tick(1);
                    return [4 /*yield*/, page.waitForSelector("ul.nav.nav-tabs > li + li.active")];
                case 8:
                    _c.sent();
                    progressBar.tick(1);
                    diagramData = page.$eval(".diagram-image", function (el) { return el.src; });
                    return [2 /*return*/, diagramData];
            }
        });
    });
}
function initProgressBar() {
    return new progress_1["default"]("Processing DMN model preview... [:bar] (:current/:total)", {
        complete: "=",
        incomplete: " ",
        width: 20,
        total: 10
    });
}
function createImageFile(imageData) {
    var data = imageData.replace(/^data:image\/\w+;base64,/, "");
    fs_1["default"].writeFileSync(DIAGRAM_NAME, Buffer.from(data, "base64"));
}
function raiseError(errorMessage) {
    console.error("\n\n :: Error (dmn-cli) :: " + errorMessage + "\n");
    process.exit();
}
