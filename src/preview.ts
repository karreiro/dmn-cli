import puppeteer from "puppeteer";

export const getModelPreview = (path: string) => {
  console.log("getting dmn model image", path);

  return (async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto("file:///Users/karreiro/Projects/forks/dmn-cli/docs/index.html");
    await page.waitForSelector("#canvas");
    const canvas = await page.$("#canvas");

    await canvas!.screenshot({
      path: "logo-screenshot.png",
      omitBackground: true,
    });

    await browser.close();
  })();
};
