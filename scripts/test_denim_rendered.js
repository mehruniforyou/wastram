const puppeteer = require('puppeteer-core');

async function main() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

  // Click the 'Denim Collection' tab in ProductFitsGrid
  await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('.diwali-fit-button'));
    const denimTab = tabs.find(t => t.innerText.includes('Denim Collection'));
    if (denimTab) denimTab.click();
  });

  await new Promise(r => setTimeout(r, 600));

  const titles = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('.grid a[href^="/products/"]'));
    return links.map(a => a.innerText.trim()).filter(Boolean).slice(0, 8);
  });

  console.log('Denim titles rendered:', titles);
  await browser.close();
}

main().catch(console.error);
