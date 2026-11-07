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

  // Get all category links in header
  const headerLinks = await page.evaluate(() => {
    const nav = document.querySelector('header nav');
    if (!nav) return 'No nav found';
    const links = Array.from(nav.querySelectorAll('a'));
    return links.map(a => ({
      text: a.innerText.trim(),
      href: a.getAttribute('href'),
      visible: a.offsetParent !== null,
      rect: a.getBoundingClientRect()
    }));
  });

  console.log('--- Header Nav Links ---');
  console.log(JSON.stringify(headerLinks, null, 2));

  // Get Product Fits Grid Tabs
  const gridTabs = await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('.diwali-fit-button'));
    return tabs.map(t => ({
      text: t.innerText.trim(),
      rect: t.getBoundingClientRect()
    }));
  });

  console.log('\n--- Grid Tabs ---');
  console.log(JSON.stringify(gridTabs, null, 2));

  await browser.close();
}

main().catch(console.error);
