'use client'

import React, { useState } from 'react'
import {
  Settings,
  Search as SearchIcon,
  RotateCcw,
  CircleCheck,
  Sun,
  Moon,
  Laptop,
  Check,
  LogOut,
  Sparkles,
  CreditCard,
  BadgeCheck,
  Bell,
} from 'lucide-react'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { ThemeSwitch } from './ThemeSwitch'
import { CommandSearch } from './CommandSearch'

interface AdminHeaderProps {
  activeTab: string
  onSelectTab: (tabId: any) => void
  onLogout: () => void
  groupTitle?: string
  tabLabel?: string
  onAddProduct?: () => void
  onAddOrder?: () => void
}

export function AdminHeader({
  activeTab,
  onSelectTab,
  onLogout,
}: AdminHeaderProps) {
  const [configOpen, setConfigOpen] = useState(false)
  const [selectedTheme, setSelectedTheme] = useState<'system' | 'light' | 'dark'>('light')

  const setTheme = (mode: 'light' | 'dark' | 'system') => {
    setSelectedTheme(mode)
    if (mode === 'dark') {
      document.documentElement.classList.add('dark')
    } else if (mode === 'light') {
      document.documentElement.classList.remove('dark')
    } else {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  }

  return (
    <header className='z-50 h-16 sticky top-0 w-[inherit] border-b border-border bg-background/95 backdrop-blur-md'>
      <div className='relative flex h-full items-center gap-3 p-4 sm:gap-4'>
        {/* Sidebar Trigger & Separator */}
        <SidebarTrigger variant='outline' className='max-md:scale-125 cursor-pointer' />
        <Separator orientation='vertical' className='h-6' />

        <div className='ms-auto flex items-center gap-2 sm:gap-4'>
          {/* Search with Command Dialog */}
          <CommandSearch onSelectTab={onSelectTab} />

          {/* Theme Switcher */}
          <ThemeSwitch />

        {/* Config Drawer (Theme Settings Sheet) */}
        <Sheet open={configOpen} onOpenChange={setConfigOpen}>
          <SheetTrigger asChild>
            <Button
              size='icon'
              variant='ghost'
              aria-label='Open theme settings'
              className='rounded-full cursor-pointer'
            >
              <Settings className='size-4' />
            </Button>
          </SheetTrigger>
          <SheetContent className='flex flex-col'>
            <SheetHeader className='pb-0 text-start'>
              <SheetTitle>Theme Settings</SheetTitle>
              <SheetDescription>
                Adjust the appearance and layout to suit your preferences.
              </SheetDescription>
            </SheetHeader>
            <div className='space-y-6 overflow-y-auto px-4 py-4'>
              <div>
                <div className='mb-2 flex items-center justify-between text-sm font-semibold text-muted-foreground'>
                  <span>Theme</span>
                  <Button
                    type='button'
                    size='icon'
                    variant='secondary'
                    className='size-4 rounded-full'
                    onClick={() => setTheme('light')}
                    title='Reset to default'
                  >
                    <RotateCcw className='size-3' />
                  </Button>
                </div>
                <div className='grid grid-cols-3 gap-3'>
                  {[
                    { value: 'light', label: 'Light', icon: Sun },
                    { value: 'dark', label: 'Dark', icon: Moon },
                    { value: 'system', label: 'System', icon: Laptop },
                  ].map((item) => (
                    <button
                      key={item.value}
                      type='button'
                      onClick={() => setTheme(item.value as any)}
                      className={cn(
                        'flex flex-col items-center gap-1.5 p-3 rounded-lg border text-xs font-medium cursor-pointer transition-all',
                        selectedTheme === item.value
                          ? 'border-primary bg-primary/10 text-primary shadow-xs'
                          : 'border-border hover:bg-muted text-muted-foreground'
                      )}
                    >
                      <item.icon className='size-4' />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <SheetFooter className='gap-2 mt-auto'>
              <Button
                variant='destructive'
                onClick={() => {
                  setTheme('light')
                  setConfigOpen(false)
                }}
              >
                Reset
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
        </div>
      </div>
    </header>
  )
}
