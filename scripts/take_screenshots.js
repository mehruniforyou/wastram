const puppeteer = require('puppeteer-core');
const path = require('path');

async function main() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Navigating to http://localhost:3000 ...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

  await page.screenshot({ path: path.join(__dirname, '..', 'screenshot_home_desktop.png') });
  console.log('Saved screenshot_home_desktop.png');

  console.log('Navigating to http://localhost:3000/collections/denim-collection ...');
  await page.goto('http://localhost:3000/collections/denim-collection', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(__dirname, '..', 'screenshot_denim_page.png') });
  console.log('Saved screenshot_denim_page.png');

  // Also check mobile drawer
  await page.setViewport({ width: 390, height: 844 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  // Click hamburger
  const menuBtn = await page.$('button[aria-label="Open Mobile Menu"]');
  if (menuBtn) {
    await menuBtn.click();
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(__dirname, '..', 'screenshot_mobile_drawer.png') });
    console.log('Saved screenshot_mobile_drawer.png');
  }

  await browser.close();
}

main().catch(console.error);
