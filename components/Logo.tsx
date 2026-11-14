'use client';

import React from 'react';
import WastramLogo from './WastramLogo';

export default function Logo({ className = 'h-8 w-auto' }: { className?: string; [key: string]: any }) {
  return (
    <div className="flex items-center gap-2">
      <WastramLogo className={className} variant="horizontal" />
    </div>
  );
}
