'use client'

import React, { useEffect, useState } from 'react'
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts'

const data = [
  { name: 'Mo', clicks: 650, uniques: 420 },
  { name: 'Di', clicks: 780, uniques: 510 },
  { name: 'Mi', clicks: 920, uniques: 630 },
  { name: 'Do', clicks: 810, uniques: 550 },
  { name: 'Fr', clicks: 980, uniques: 720 },
  { name: 'Sa', clicks: 450, uniques: 310 },
  { name: 'So', clicks: 520, uniques: 380 },
]

export function AnalyticsChart() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return <div className='w-full h-[300px] bg-muted/20 animate-pulse rounded-md' />
  }

  return (
    <ResponsiveContainer width='100%' height={300}>
      <AreaChart data={data}>
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
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'var(--popover)',
            color: 'var(--popover-foreground)',
            borderRadius: '8px',
            border: '1px solid var(--border)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            fontSize: '12px',
          }}
        />
        <Area
          type='monotone'
          dataKey='clicks'
          stroke='currentColor'
          className='text-primary'
          fill='currentColor'
          fillOpacity={0.15}
        />
        <Area
          type='monotone'
          dataKey='uniques'
          stroke='currentColor'
          className='text-muted-foreground'
          fill='currentColor'
          fillOpacity={0.1}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
