'use client'

import React from 'react'
import { Command } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface AuthPreviewProps {
  type: 'sign-in' | 'sign-in-2' | 'sign-up' | 'forgot-password' | 'otp' | 'clerk'
  onBack: () => void
}

export function AuthPreviewView({ type, onBack }: AuthPreviewProps) {
  const getTitles = () => {
    switch (type) {
      case 'sign-in':
      case 'sign-in-2':
        return { title: 'Sign in to account', desc: 'Enter your email below to log into your account' }
      case 'sign-up':
        return { title: 'Create an account', desc: 'Enter your email below to create your account' }
      case 'forgot-password':
        return { title: 'Forgot Password', desc: 'Enter your registered email and we will send you a reset link' }
      case 'otp':
        return { title: 'Two-Step Verification', desc: 'Please enter the authentication code sent to your phone' }
      case 'clerk':
        return { title: 'Clerk Authentication', desc: 'Managed identity and user sessions powered by Clerk' }
    }
  }

  const { title, desc } = getTitles()

  return (
    <div className='flex flex-1 flex-col items-center justify-center p-4 min-h-[calc(100vh-12rem)] font-inter'>
      <Card className='w-full max-w-sm shadow-sm gap-4'>
        <CardHeader className='text-center space-y-2'>
          <div className='flex justify-center mb-2'>
            <div className='flex aspect-square size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground'>
              <Command className='size-5' />
            </div>
          </div>
          <CardTitle className='text-lg tracking-tight'>{title}</CardTitle>
          <CardDescription className='text-sm text-muted-foreground'>{desc}</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          {type === 'otp' ? (
            <div className='flex justify-center gap-2'>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <input
                  key={i}
                  maxLength={1}
                  className='size-10 text-center text-lg font-bold border rounded-md bg-muted/20'
                  defaultValue={i === 1 ? '7' : ''}
                />
              ))}
            </div>
          ) : (
            <div className='space-y-3'>
              <div>
                <label className='text-sm font-medium leading-none'>Email address</label>
                <Input placeholder='name@example.com' className='mt-1.5' />
              </div>
              {type !== 'forgot-password' && (
                <div>
                  <label className='text-sm font-medium leading-none'>Password</label>
                  <Input type='password' placeholder='••••••••' className='mt-1.5' />
                </div>
              )}
            </div>
          )}

          <Button className='w-full'>
            Continue
          </Button>

          <div className='text-center'>
            <button
              type='button'
              onClick={onBack}
              className='text-sm text-muted-foreground hover:text-foreground underline underline-offset-4 cursor-pointer'
            >
              Back to Dashboard
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
