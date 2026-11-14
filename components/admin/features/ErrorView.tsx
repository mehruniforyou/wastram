'use client'

import React from 'react'
import { Button } from '@/components/ui/button'

interface ErrorViewProps {
  code: string
  title: string
  desc: string
  onBack: () => void
}

export function ErrorView({ code, title, desc, onBack }: ErrorViewProps) {
  return (
    <div className='h-[calc(100vh-12rem)] flex'>
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
        <h1 className='text-[7rem] leading-tight font-bold'>{code}</h1>
        <span className='font-medium'>{title}</span>
        <p className='text-center text-muted-foreground max-w-md'>
          {desc}
        </p>
        <div className='mt-6 flex gap-4'>
          <Button variant='outline' onClick={onBack}>
            Go Back
          </Button>
          <Button onClick={onBack}>Zur Startseite</Button>
        </div>
      </div>
    </div>
  )
}
