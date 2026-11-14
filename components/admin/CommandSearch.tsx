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
  { id: 'overview', title: 'Übersicht', group: 'Allgemein', icon: LayoutDashboard },
  { id: 'orders', title: 'Bestellungen', group: 'Allgemein', icon: ShoppingBag },
  { id: 'customers', title: 'Kunden', group: 'Allgemein', icon: Users },
  { id: 'products', title: 'Produkte', group: 'Shop & Lager', icon: Box },
  { id: 'inventory', title: 'Inventar', group: 'Shop & Lager', icon: Boxes },
  { id: 'categories', title: 'Kategorien', group: 'Shop & Lager', icon: Layers },
  { id: 'discounts', title: 'Rabatte', group: 'Shop & Lager', icon: Percent },
  { id: 'reviews', title: 'Bewertungen', group: 'Shop & Lager', icon: Star },
  { id: 'api-keys', title: 'API-Schlüssel', group: 'Sonstiges', icon: KeyRound },
  { id: 'store-settings', title: 'Shop-Einstellungen', group: 'Sonstiges', icon: Store },
  { id: 'settings-profile', title: 'Profil-Einstellungen', group: 'Einstellungen', icon: Settings },
  { id: 'settings-account', title: 'Konto-Einstellungen', group: 'Einstellungen', icon: Settings },
  { id: 'settings-appearance', title: 'Erscheinungsbild', group: 'Einstellungen', icon: Settings },
  { id: 'settings-notifications', title: 'Benachrichtigungen', group: 'Einstellungen', icon: Settings },
  { id: 'settings-display', title: 'Anzeige-Optionen', group: 'Einstellungen', icon: Settings },
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
          className='absolute inset-s-1.5 top-1/2 -translate-y-1/2 opacity-70'
          size={16}
        />
        <span className='ms-4'>Suchen</span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className='max-w-xl p-0 gap-0 overflow-hidden rounded-xl'>
          <DialogHeader className='p-0 border-b border-border'>
            <DialogTitle className='sr-only'>Befehlsmenü</DialogTitle>
            <div className='flex items-center px-4 py-3 gap-2.5'>
              <Search className='h-4 w-4 text-muted-foreground shrink-0' />
              <input
                type='text'
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder='Befehl eingeben oder suchen...'
                className='w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none font-medium'
                autoFocus
              />
            </div>
          </DialogHeader>

          <div className='max-h-80 overflow-y-auto p-2 space-y-1'>
            {filtered.length === 0 ? (
              <div className='py-8 text-center text-xs text-muted-foreground'>
                Keine passenden Ergebnisse gefunden.
              </div>
            ) : (
              filtered.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    type='button'
                    onClick={() => handleSelect(item.id)}
                    className='w-full flex items-center justify-between p-2.5 rounded-lg text-left text-xs hover:bg-accent transition-colors group cursor-pointer'
                  >
                    <div className='flex items-center gap-2.5 min-w-0'>
                      <div className='w-7 h-7 rounded-md bg-muted flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors shrink-0'>
                        <Icon className='w-3.5 h-3.5' />
                      </div>
                      <div className='min-w-0'>
                        <p className='font-semibold text-foreground truncate'>{item.title}</p>
                        <p className='text-[10px] text-muted-foreground font-mono'>{item.group}</p>
                      </div>
                    </div>
                    <ArrowRight className='w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0' />
                  </button>
                )
              })
            )}

            <div className='pt-2 border-t border-border/60 mt-2'>
              <a
                href='/'
                target='_blank'
                rel='noopener noreferrer'
                className='w-full flex items-center justify-between p-2 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-colors'
              >
                <div className='flex items-center gap-2'>
                  <ExternalLink className='w-3.5 h-3.5' />
                  <span>Online-Shop in neuem Tab öffnen</span>
                </div>
                <span className='text-[10px] font-mono'>ixosweb.vercel.app ↗</span>
              </a>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
