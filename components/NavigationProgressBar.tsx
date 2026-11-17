'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function NavigationProgressBar() {
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    // When pathname changes, navigation has completed
    setIsNavigating(false);
  }, [pathname]);

  useEffect(() => {
    // Listen for click on internal links to start progress
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest('a');
      if (!target) return;

      const href = target.getAttribute('href');
      if (
        href &&
        href.startsWith('/') &&
        !href.startsWith('//') &&
        !href.startsWith('/#') &&
        target.target !== '_blank' &&
        href !== pathname
      ) {
        setIsNavigating(true);
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, [pathname]);

  if (!isNavigating) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-0.5 overflow-hidden">
      <div className="h-full w-full nav-progress-bar shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
    </div>
  );
}
