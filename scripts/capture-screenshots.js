const puppeteer = require('puppeteer-core');
const fs = require('fs');

async function capture() {
  fs.mkdirSync('temp_inspect/screenshots', { recursive: true });

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();

  // 1. Desktop Homepage
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: 'temp_inspect/screenshots/desktop_home.jpg', quality: 85 });
  console.log('1. Captured desktop_home.jpg');

  // 2. Mobile Homepage
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: 'temp_inspect/screenshots/mobile_home.jpg', quality: 85 });
  console.log('2. Captured mobile_home.jpg');

  // 3. Mobile Collections
  await page.goto('http://localhost:3000/collections', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: 'temp_inspect/screenshots/mobile_collections.jpg', quality: 85 });
  console.log('3. Captured mobile_collections.jpg');

  // 4. Mobile Product Detail
  await page.goto('http://localhost:3000/products/chandrika-royal-chanderi-anarkali-suit', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: 'temp_inspect/screenshots/mobile_product.jpg', quality: 85 });
  console.log('4. Captured mobile_product.jpg');

  // 5. Desktop Product Detail
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000/products/chandrika-royal-chanderi-anarkali-suit', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: 'temp_inspect/screenshots/desktop_product.jpg', quality: 85 });
  console.log('5. Captured desktop_product.jpg');

  await browser.close();
  console.log('All screenshots captured successfully!');
}

capture().catch(console.error);
