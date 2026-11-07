const puppeteer = require('puppeteer-core');

async function main() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

  const navInfo = await page.evaluate(() => {
    const nav = document.querySelector('header nav');
    const container = nav.parentElement;
    const links = Array.from(nav.querySelectorAll('a')).map(a => {
      const r = a.getBoundingClientRect();
      const c = container.getBoundingClientRect();
      const inView = r.right > c.left && r.left < c.right;
      return {
        text: a.innerText.trim(),
        href: a.getAttribute('href'),
        x: Math.round(r.x),
        w: Math.round(r.width),
        inView
      };
    });
    return links;
  });

  console.log(JSON.stringify(navInfo, null, 2));

  await browser.close();
}

main().catch(console.error);
