async function run() {
  const res = await fetch('https://www.wastram.in/admin?t=' + Date.now(), {
    headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' }
  });
  const html = await res.text();
  const scripts = [...html.matchAll(/src="(\/_next\/static\/chunks\/app\/admin\/[^"]+)"/g)].map(x => x[1]);
  console.log('Admin scripts found:', scripts);
  for (const s of scripts) {
    const sRes = await fetch('https://www.wastram.in' + s);
    const js = await sRes.text();
    console.log('Script:', s, 'Size:', js.length);
    console.log('Has Colorway Variants:', js.includes('Colorway Variants'));
    console.log('Has All Styles:', js.includes('All Styles'));
    console.log('Has Alle Products:', js.includes('Alle Products'));
  }
}
run().catch(console.error);
