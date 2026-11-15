async function run() {
  const res = await fetch('https://www.wastram.in/admin');
  const html = await res.text();
  console.log('HTML length:', html.length);
  const scripts = [...html.matchAll(/src="(\/_next\/static\/[^"]+)"/g)].map(x => x[1]);
  console.log('Scripts found:', scripts.length);
  for (const s of scripts) {
    const sRes = await fetch('https://www.wastram.in' + s);
    const js = await sRes.text();
    if (js.includes('Alle Products') || js.includes('insgesamt')) {
      console.log('FOUND German in script:', s);
    }
    if (js.includes('All Styles')) {
      console.log('FOUND All Styles in script:', s);
    }
  }
}
run().catch(console.error);
