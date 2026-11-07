const sharp = require('sharp');
const path = require('path');

async function main() {
  await sharp(path.join(__dirname, '..', 'screenshot_home_desktop.png'))
    .extract({ left: 0, top: 0, width: 1440, height: 120 })
    .toFile(path.join(__dirname, '..', 'header_crop.png'));
  console.log('Saved header_crop.png');
}

main().catch(console.error);
