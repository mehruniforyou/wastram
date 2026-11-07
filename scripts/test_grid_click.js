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
  const clicked = await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('.diwali-fit-button'));
    const denimTab = tabs.find(t => t.innerText.includes('Denim Collection'));
    if (denimTab) {
      denimTab.click();
      return true;
    }
    return false;
  });

  console.log('Clicked denim tab in grid:', clicked);
  await new Promise(r => setTimeout(r, 500));

  // Check the rendered product titles
  const products = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('section:nth-of-type(4) h3, .grid h3'));
    return cards.slice(0, 5).map(h => h.innerText.trim());
  });

  console.log('Products displayed after click:', products);

  await browser.close();
}

main().catch(console.error);
