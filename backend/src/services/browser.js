// backend/src/services/browser.js
import { chromium } from 'playwright';

export async function getPageTitle(url) {
  const browser = await chromium.launch({ headless: true });

  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    return await page.title();
  } finally {
    await browser.close();
  }
}