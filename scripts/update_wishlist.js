const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'app', 'pages', 'swym-wishlist', 'page.tsx');
let code = fs.readFileSync(filePath, 'utf8');

code = code.replace(
  /<div className="flex items-center gap-1\.5 mt-0\.5 font-archivo">[\s\S]*?₹ \{p\.salePrice\.toLocaleString\(\)\}[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?<button[\s\S]*?<span>Move to Bag<\/span>[\s\S]*?<\/button>/,
  `<div className="flex items-center gap-1.5 mt-0.5 font-archivo">
                        <span className="text-[2.6vw] md:text-[0.82vw] font-bold text-[#482922]">
                          Price on Enquiry
                        </span>
                        <span className="text-[2.2vw] md:text-[0.68vw] text-black/50">
                          • {p.moq || 'MOQ 20 pcs'}
                        </span>
                      </div>
                    </div>

                    <Link
                      href={\`/products/\${p.slug}\`}
                      className="px-2.5 md:px-3 py-1 rounded-full border border-[#482922] bg-[#482922] text-[#F6C582] hover:bg-[#38201a] font-archivo text-[2.4vw] md:text-[0.75vw] font-semibold transition-all flex items-center gap-1 flex-shrink-0 active:scale-95 shadow-2xs"
                    >
                      <span>Enquire</span>
                    </Link>`
);

fs.writeFileSync(filePath, code, 'utf8');
console.log('Updated app/pages/swym-wishlist/page.tsx');
