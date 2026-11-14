'use client'

import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface SaleItem {
  name: string
  email: string
  amount: string
  avatar?: string
  fallback: string
}

interface RecentSalesProps {
  sales?: SaleItem[]
}

export function RecentSales({ sales = [] }: RecentSalesProps) {
  if (sales.length === 0) {
    return (
      <div className='py-8 text-center space-y-1 text-muted-foreground'>
        <p className='text-sm font-medium text-foreground'>Noch keine verifizierten Verkäufe</p>
        <p className='text-xs'>Verifizierte Bestellungen erscheinen automatisch hier.</p>
      </div>
    )
  }

  return (
    <div className='divide-y divide-border/40 -mx-2'>
      {sales.map((sale, i) => (
        <div
          key={i}
          className='flex items-center justify-between gap-4 px-2 py-3 hover:bg-muted/40 dark:hover:bg-muted/20 rounded-xl transition-all duration-150 cursor-pointer group'
        >
          <div className='flex items-center gap-3.5 min-w-0'>
            <Avatar className='h-10 w-10 border border-border/60 shrink-0'>
              {sale.avatar && <AvatarImage src={sale.avatar} alt={sale.name} />}
              <AvatarFallback className='bg-muted/80 font-semibold text-xs text-foreground'>
                {sale.fallback}
              </AvatarFallback>
            </Avatar>
            <div className='min-w-0 space-y-1'>
              <p className='text-sm font-semibold leading-none text-foreground truncate group-hover:text-primary transition-colors'>
                {sale.name}
              </p>
              <p className='text-sm text-muted-foreground truncate'>{sale.email}</p>
            </div>
          </div>
          <div className='font-semibold text-sm sm:text-base text-[#007934] dark:text-[#22c55e] tabular-nums tracking-tight shrink-0'>
            {sale.amount}
          </div>
        </div>
      ))}
    </div>
  )
}
