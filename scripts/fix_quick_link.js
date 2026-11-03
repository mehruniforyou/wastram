const fs = require('fs');
const path = require('path');

const quickPath = path.join(__dirname, '..', 'components', 'QuickAddModal.tsx');
let code = fs.readFileSync(quickPath, 'utf8');

if (!code.includes("import Link from 'next/link';")) {
  code = code.replace(
    "import React, { useState } from 'react';",
    "import React, { useState } from 'react';\nimport Link from 'next/link';"
  );
  fs.writeFileSync(quickPath, code, 'utf8');
  console.log('Added Link import to QuickAddModal.tsx');
}
