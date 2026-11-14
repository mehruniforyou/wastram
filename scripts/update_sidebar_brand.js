const fs = require('fs');
let c = fs.readFileSync('components/admin/AdminSidebar.tsx', 'utf8');

c = c.replace(/tooltip='IXOS Audio'/g, "tooltip='Wastram Atelier'");
c = c.replace(/<span className='font-black tracking-tighter text-sm'>IX<\/span>/g, "<span className='font-serif font-black text-sm'>W</span>");
c = c.replace(/<div className='flex flex-1 items-center justify-start overflow-hidden group-data-\[collapsible=icon\]:hidden ps-2'>[\s\S]*?<\/div>/, 
`<div className='flex flex-1 flex-col items-start justify-center overflow-hidden group-data-[collapsible=icon]:hidden ps-2'>
                <span className='font-serif font-bold text-sm tracking-wide'>WASTRAM</span>
                <span className='text-[10px] tracking-widest uppercase opacity-60 -mt-0.5'>ATELIER ADMIN</span>
              </div>`);

fs.writeFileSync('components/admin/AdminSidebar.tsx', c, 'utf8');
console.log('Updated AdminSidebar branding');
