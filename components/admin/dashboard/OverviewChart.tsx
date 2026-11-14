'use client'

import React, { useEffect, useState } from 'react'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts'

interface OverviewProps {
  data?: Array<{ name: string; total: number; count?: number }>
  currencySymbol?: string
}

export function Overview({ data = [], currencySymbol = '€' }: OverviewProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className='w-full h-[350px] flex items-end justify-between gap-2 pt-6 pb-2 px-4'>
        {data.map((d, i) => (
          <div key={i} className='flex-1 flex flex-col items-center gap-2 h-full justify-end'>
            <div
              className='w-full bg-primary/20 rounded-t-sm transition-all'
              style={{ height: `${Math.max(15, (d.total / 7000) * 100)}%` }}
            />
            <span className='text-[10px] text-muted-foreground'>{d.name}</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <ResponsiveContainer width='100%' height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey='name'
          stroke='#888888'
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke='#888888'
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${currencySymbol}${value}`}
        />
        <Tooltip
          formatter={(value: any) => [`${currencySymbol}${value}`, 'Umsatz']}
          cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
          contentStyle={{
            backgroundColor: 'var(--popover)',
            color: 'var(--popover-foreground)',
            borderRadius: '8px',
            border: '1px solid var(--border)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            fontSize: '12px',
          }}
        />
        <Bar
          dataKey='total'
          fill='currentColor'
          radius={[4, 4, 0, 0]}
          className='fill-primary'
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
