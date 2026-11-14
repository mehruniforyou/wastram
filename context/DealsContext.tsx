"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getCachedDiscounts, invalidateDiscountCache, getActiveDiscounts } from "@/lib/clientDiscountCache";

interface DealsContextType {
  hasActiveDeals: boolean;
  dealsCount: number;
  loading: boolean;
  refreshDeals: () => Promise<void>;
}

const DealsContext = createContext<DealsContextType>({
  hasActiveDeals: false,
  dealsCount: 0,
  loading: true,
  refreshDeals: async () => {},
});

export const DEALS_UPDATED_EVENT = "ixos_discounts_updated";

export function DealsProvider({ children }: { children: React.ReactNode }) {
  const [dealsCount, setDealsCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchDeals = useCallback(async (force = false) => {
    try {
      const data = await getCachedDiscounts(force);
      const active = getActiveDiscounts(data);
      setDealsCount(active.length);
    } catch {
      setDealsCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDeals(false);

    // Only listen to direct in-app custom event from admin mutations
    // NEVER listen blindly to window "storage" events to prevent infinite cross-tab storms
    const handleUpdate = () => {
      invalidateDiscountCache();
      fetchDeals(true);
    };

    window.addEventListener(DEALS_UPDATED_EVENT, handleUpdate);

    return () => {
      window.removeEventListener(DEALS_UPDATED_EVENT, handleUpdate);
    };
  }, [fetchDeals]);

  const hasActiveDeals = dealsCount > 0;

  return (
    <DealsContext.Provider
      value={{
        hasActiveDeals,
        dealsCount,
        loading,
        refreshDeals: () => fetchDeals(true),
      }}
    >
      {children}
    </DealsContext.Provider>
  );
}

export function useDeals() {
  return useContext(DealsContext);
}
