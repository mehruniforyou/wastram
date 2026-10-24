const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function processAll() {
  fs.mkdirSync('public/images/hero', { recursive: true });
  fs.mkdirSync('public/images/about', { recursive: true });

  // 1. Process 3-Piece Sets
  const pieceDir = 'public/images/products/3-piece-sets';
  const pieceFiles = fs.readdirSync(pieceDir).filter(f => f.endsWith('.jpg') && !f.includes('-clean'));
  for (const f of pieceFiles) {
    const src = path.join(pieceDir, f);
    const meta = await sharp(src).metadata();
    const dest = path.join(pieceDir, f.replace('.jpg', '-clean.jpg'));
    if (meta.width >= 1150 && meta.height >= 1200) {
      await sharp(src)
        .extract({ left: 35, top: 40, width: 1130, height: 1100 })
        .jpeg({ quality: 90 })
        .toFile(dest);
    } else {
      await sharp(src)
        .jpeg({ quality: 90 })
        .toFile(dest);
    }
  }
  console.log(`Processed ${pieceFiles.length} 3-piece sets.`);

  // 2. Process Co-Ord Sets
  const coordDir = 'public/images/products/co-ord-sets';
  const coordFiles = fs.readdirSync(coordDir).filter(f => f.endsWith('.jpg') && !f.includes('-clean'));
  for (const f of coordFiles) {
    const src = path.join(coordDir, f);
    const meta = await sharp(src).metadata();
    const dest = path.join(coordDir, f.replace('.jpg', '-clean.jpg'));
    if (meta.width >= 1150 && meta.height >= 1200) {
      await sharp(src)
        .extract({ left: 35, top: 40, width: 1130, height: 1100 })
        .jpeg({ quality: 90 })
        .toFile(dest);
    } else {
      await sharp(src)
        .jpeg({ quality: 90 })
        .toFile(dest);
    }
  }
  console.log(`Processed ${coordFiles.length} co-ord sets.`);

  // 3. Process Dresses
  const dressDir = 'public/images/products/dresses';
  const dressFiles = fs.readdirSync(dressDir).filter(f => f.endsWith('.jpg') && !f.includes('-clean'));
  for (const f of dressFiles) {
    const src = path.join(dressDir, f);
    const meta = await sharp(src).metadata();
    const dest = path.join(dressDir, f.replace('.jpg', '-clean.jpg'));
    if (meta.width >= 1150 && meta.height >= 1200) {
      await sharp(src)
        .extract({ left: 35, top: 40, width: 1130, height: 1100 })
        .jpeg({ quality: 90 })
        .toFile(dest);
    } else {
      await sharp(src)
        .jpeg({ quality: 90 })
        .toFile(dest);
    }
  }
  console.log(`Processed ${dressFiles.length} dresses.`);

  // 4. Process Satin Shirts
  const satinDir = 'public/images/products/satin-shirts';
  const satinFiles = fs.readdirSync(satinDir).filter(f => f.endsWith('.jpg') && !f.includes('-clean'));
  for (const f of satinFiles) {
    const src = path.join(satinDir, f);
    const meta = await sharp(src).metadata();
    const dest = path.join(satinDir, f.replace('.jpg', '-clean.jpg'));
    if (meta.width >= 700 && meta.height >= 1100) {
      await sharp(src)
        .extract({ left: 54, top: 118, width: 680, height: 890 })
        .jpeg({ quality: 90 })
        .toFile(dest);
    } else {
      await sharp(src)
        .jpeg({ quality: 90 })
        .toFile(dest);
    }
  }
  console.log(`Processed ${satinFiles.length} satin shirts.`);

  // 5. Create Hero & Story Images
  await sharp('public/images/products/3-piece-sets/item-001-000-clean.jpg')
    .resize(1200, 1200, { fit: 'cover' })
    .jpeg({ quality: 92 })
    .toFile('public/images/hero/hero-main.jpg');

  await sharp('public/images/products/co-ord-sets/item-001-000-clean.jpg')
    .resize(800, 1000, { fit: 'cover' })
    .jpeg({ quality: 92 })
    .toFile('public/images/hero/hero-coords.jpg');

  await sharp('public/images/products/dresses/item-001-000-clean.jpg')
    .resize(800, 1000, { fit: 'cover' })
    .jpeg({ quality: 92 })
    .toFile('public/images/hero/hero-dress.jpg');

  await sharp('public/images/products/satin-shirts/item-02-clean.jpg')
    .resize(800, 1000, { fit: 'cover' })
    .jpeg({ quality: 92 })
    .toFile('public/images/hero/hero-satin.jpg');

  await sharp('public/images/products/lehengas/item-04.jpg')
    .resize(800, 1000, { fit: 'cover' })
    .jpeg({ quality: 92 })
    .toFile('public/images/hero/hero-lehenga.jpg');

  if (fs.existsSync('temp_inspect/pdf2_page-02.jpg')) {
    await sharp('temp_inspect/pdf2_page-02.jpg')
      .extract({ left: 40, top: 280, width: 350, height: 350 })
      .jpeg({ quality: 90 })
      .toFile('public/images/about/craft-dyeing.jpg');

    await sharp('temp_inspect/pdf2_page-02.jpg')
      .extract({ left: 440, top: 600, width: 350, height: 350 })
      .jpeg({ quality: 90 })
      .toFile('public/images/about/craft-blockprint.jpg');
  }

  console.log('All hero, about, and catalogue image processing completed!');
}

processAll().catch(console.error);
