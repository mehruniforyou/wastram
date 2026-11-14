'use client'

import React, { useState, useEffect } from 'react'
import {
  Search,
  LayoutDashboard,
  Box,
  Layers,
  ShoppingBag,
  Percent,
  Settings,
  CreditCard,
  ExternalLink,
  ArrowRight,
  Users,
  Star,
  Store,
  KeyRound,
  Boxes,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface CommandSearchProps {
  onSelectTab: (tabId: string) => void
}

const NAV_COMMANDS = [
  { id: 'overview', title: 'Dashboard', group: 'General', icon: LayoutDashboard },
  { id: 'orders', title: 'Orders', group: 'General', icon: ShoppingBag },
  { id: 'customers', title: 'Customers', group: 'General', icon: Users },
  { id: 'products', title: 'Products', group: 'Store & Catalog', icon: Box },
  { id: 'inventory', title: 'Inventory', group: 'Store & Catalog', icon: Boxes },
  { id: 'categories', title: 'Categories', group: 'Store & Catalog', icon: Layers },
  { id: 'discounts', title: 'Discounts', group: 'Store & Catalog', icon: Percent },
  { id: 'reviews', title: 'Reviews', group: 'Store & Catalog', icon: Star },
  { id: 'api-keys', title: 'API Keys', group: 'Settings', icon: KeyRound },
  { id: 'store-settings', title: 'Store Settings', group: 'Settings', icon: Store },
  { id: 'settings-profile', title: 'Profile Settings', group: 'Settings', icon: Settings },
  { id: 'settings-account', title: 'Account Settings', group: 'Settings', icon: Settings },
  { id: 'settings-appearance', title: 'Appearance', group: 'Settings', icon: Settings },
  { id: 'settings-notifications', title: 'Notifications', group: 'Settings', icon: Settings },
  { id: 'settings-display', title: 'Display Options', group: 'Settings', icon: Settings },
]

export function CommandSearch({ onSelectTab }: CommandSearchProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const filtered = query.trim()
    ? NAV_COMMANDS.filter(
        (c) =>
          c.title.toLowerCase().includes(query.toLowerCase()) ||
          c.group.toLowerCase().includes(query.toLowerCase())
      )
    : NAV_COMMANDS

  const handleSelect = (tabId: string) => {
    onSelectTab(tabId)
    setOpen(false)
    setQuery('')
  }

  return (
    <>
      <Button
        variant='outline'
        className='group relative h-8 w-full flex-1 justify-start rounded-md bg-muted/25 text-sm font-normal text-muted-foreground shadow-none hover:bg-accent sm:w-40 md:flex-none lg:w-52 xl:w-64 cursor-pointer'
        aria-keyshortcuts='Meta+K Control+K'
        onClick={() => setOpen(true)}
      >
        <Search
          aria-hidden='true'
          className='absolute start-2 top-1/2 -translate-y-1/2 opacity-70'
          size={16}
        />
        <span className='ms-4'>Search...</span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className='max-w-xl p-0 gap-0 overflow-hidden rounded-xl'>
          <DialogHeader className='p-0 border-b border-border'>
            <DialogTitle className='sr-only'>Command Menu</DialogTitle>
            <div className='flex items-center px-4 py-3 gap-2.5'>
              <Search className='size-4 text-muted-foreground shrink-0' />
              <input
                type='text'
                placeholder='Search modules, tabs, or settings... (ESC to close)'
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className='w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground'
                autoFocus
              />
              <kbd className='rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground'>
                ESC
              </kbd>
            </div>
          </DialogHeader>

          <div className='max-h-80 overflow-y-auto p-2'>
            {filtered.length === 0 ? (
              <div className='py-8 text-center text-xs text-muted-foreground'>
                No matching navigation targets found.
              </div>
            ) : (
              <div className='space-y-3'>
                {['General', 'Store & Catalog', 'Settings'].map((group) => {
                  const items = filtered.filter((c) => c.group === group)
                  if (items.length === 0) return null

                  return (
                    <div key={group} className='space-y-1'>
                      <div className='px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70'>
                        {group}
                      </div>
                      <div className='space-y-0.5'>
                        {items.map((item) => (
                          <button
                            key={item.id}
                            type='button'
                            onClick={() => handleSelect(item.id)}
                            className='flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-foreground hover:bg-accent cursor-pointer transition-colors text-start'
                          >
                            <div className='flex items-center gap-2.5'>
                              <item.icon className='size-4 text-muted-foreground' />
                              <span>{item.title}</span>
                            </div>
                            <ArrowRight className='size-3 text-muted-foreground/60' />
                          </button>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          <div className='flex items-center justify-between border-t border-border bg-muted/40 px-3 py-2 text-[11px] text-muted-foreground'>
            <span>Navigation shortcut</span>
            <div className='flex items-center gap-1'>
              <kbd className='rounded bg-background px-1.5 py-0.5 text-[10px] font-medium border border-border shadow-2xs'>
                Ctrl
              </kbd>
              <kbd className='rounded bg-background px-1.5 py-0.5 text-[10px] font-medium border border-border shadow-2xs'>
                K
              </kbd>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
