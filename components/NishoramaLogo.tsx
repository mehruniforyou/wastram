'use client';

import React from 'react';
import WastramLogo from './WastramLogo';

export default function NishoramaLogo({
  className = 'h-7 w-auto',
  color
}: {
  className?: string;
  color?: string;
}) {
  return <WastramLogo className={className} />;
}
