const fs = require('fs');
const path = require('path');

const footerPath = path.join(__dirname, '..', 'components', 'Footer.tsx');
let content = fs.readFileSync(footerPath, 'utf8');

const oldDesktop = `                <li><Link href="/pages/about-us" className="hover:text-black">Our story</Link></li>`;
const newDesktop = `                <li><Link href="/collections/denim-collection" className="hover:text-[#FF2F00] text-[#FF2F00] font-bold">Denim Collection (140+ Styles) ✦</Link></li>
                <li><Link href="/collections/hoodies-sweatshirts" className="hover:text-black">Hoodies &amp; Sweatshirts</Link></li>
                <li><Link href="/collections/t-shirts" className="hover:text-black">T-Shirts Collection</Link></li>
                <li><Link href="/pages/about-us" className="hover:text-black">Our story</Link></li>`;

if (content.includes(oldDesktop)) {
  content = content.replace(oldDesktop, newDesktop);
}

const oldMobile = `                <li><Link href="/pages/reviews">Customer Reviews</Link></li>`;
const newMobile = `                <li><Link href="/collections/denim-collection" className="text-[#FF2F00] font-bold">Denim Collection (140+ Styles) ✦</Link></li>
                <li><Link href="/collections/hoodies-sweatshirts">Hoodies &amp; Sweatshirts</Link></li>
                <li><Link href="/collections/t-shirts">T-Shirts Collection</Link></li>
                <li><Link href="/pages/reviews">Customer Reviews</Link></li>`;

if (content.includes(oldMobile)) {
  content = content.replace(oldMobile, newMobile);
}

fs.writeFileSync(footerPath, content, 'utf8');
console.log('Updated Footer.tsx with category links');
