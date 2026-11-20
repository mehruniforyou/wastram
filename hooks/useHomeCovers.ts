'use client';

import { useState, useEffect, useCallback } from 'react';
import defaultHomeCovers from '@/data/home-covers.json';
import { HomeCoversStore } from '@/lib/homeCoversStore';

export function useHomeCovers() {
  const [covers, setCovers] = useState<HomeCoversStore>(defaultHomeCovers as unknown as HomeCoversStore);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCovers = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/home-covers?t=${Date.now()}`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data && data.hero && data.categories) {
          setCovers(data);
        }
      }
    } catch (_) {
      // Fallback to static default
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCovers();

    try {
      const channel = new BroadcastChannel('wastram_home_covers_sync');
      channel.onmessage = (event) => {
        if (event.data?.covers) {
          setCovers(event.data.covers);
        } else {
          fetchCovers();
        }
      };
      return () => {
        channel.close();
      };
    } catch (_) {}
  }, [fetchCovers]);

  return { covers, isLoading, refresh: fetchCovers };
}
