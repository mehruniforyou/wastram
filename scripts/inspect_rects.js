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

  const navInfo = await page.evaluate(() => {
    const nav = document.querySelector('header nav');
    const container = nav.parentElement;
    const links = Array.from(nav.querySelectorAll('a')).map(a => {
      const r = a.getBoundingClientRect();
      return {
        text: a.innerText.trim(),
        href: a.getAttribute('href'),
        x: Math.round(r.x),
        y: Math.round(r.y),
        w: Math.round(r.width),
        h: Math.round(r.height)
      };
    });
    const cRect = container.getBoundingClientRect();
    return {
      container: { x: Math.round(cRect.x), y: Math.round(cRect.y), w: Math.round(cRect.width), h: Math.round(cRect.height) },
      links
    };
  });

  console.log(JSON.stringify(navInfo, null, 2));

  await browser.close();
}

main().catch(console.error);
