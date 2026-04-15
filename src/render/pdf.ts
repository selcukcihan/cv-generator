import puppeteer from "puppeteer";

import { ensureParentDir } from "../lib/fs";
import { PageSize } from "../lib/types";

export async function renderPdf(html: string, outputPath: string, pageSize: PageSize): Promise<void> {
  ensureParentDir(outputPath);

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    await page.pdf({
      path: outputPath,
      format: pageSize,
      printBackground: true,
      margin: {
        top: "10mm",
        right: "10mm",
        bottom: "10mm",
        left: "10mm"
      }
    });
  } finally {
    await browser.close();
  }
}
