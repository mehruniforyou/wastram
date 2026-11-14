'use client'

import React from 'react'
import { ArrowRight, ChevronRight, Laptop, Moon, Sun } from 'lucide-react'
import { useSearch } from '@/context/search-provider'
import { useTheme } from '@/context/theme-provider'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { getSidebarData } from './layout/data/sidebar-data'
import { ScrollArea } from '@/components/ui/scroll-area'

interface CommandMenuProps {
  onSelectTab?: (tabId: string) => void
}

export function CommandMenu({ onSelectTab }: CommandMenuProps) {
  const { setTheme } = useTheme()
  const { open, setOpen } = useSearch()
  const sidebarData = getSidebarData()

  const runCommand = React.useCallback(
    (command: () => unknown) => {
      setOpen(false)
      command()
    },
    [setOpen]
  )

  return (
    <CommandDialog modal open={open} onOpenChange={setOpen}>
      <CommandInput placeholder='Befehl eingeben oder suchen...' />
      <CommandList>
        <ScrollArea className='h-72 pe-1'>
          <CommandEmpty>Keine Ergebnisse gefunden.</CommandEmpty>
          {sidebarData.navGroups.map((group) => (
            <CommandGroup key={group.title} heading={group.title}>
              {group.items.map((navItem, i) => {
                if (navItem.url)
                  return (
                    <CommandItem
                      key={`${navItem.url}-${i}`}
                      value={navItem.title}
                      onSelect={() => {
                        runCommand(() => onSelectTab && onSelectTab(navItem.url))
                      }}
                      className='cursor-pointer'
                    >
                      <div className='flex size-4 items-center justify-center'>
                        <ArrowRight className='size-2 text-muted-foreground/80' />
                      </div>
                      {navItem.title}
                    </CommandItem>
                  )

                return navItem.items?.map((subItem, j) => (
                  <CommandItem
                    key={`${navItem.title}-${subItem.url}-${j}`}
                    value={`${navItem.title}-${subItem.url}`}
                    onSelect={() => {
                      runCommand(() => onSelectTab && onSelectTab(subItem.url))
                    }}
                    className='cursor-pointer'
                  >
                    <div className='flex size-4 items-center justify-center'>
                      <ArrowRight className='size-2 text-muted-foreground/80' />
                    </div>
                    {navItem.title} <ChevronRight className='size-3 mx-1' /> {subItem.title}
                  </CommandItem>
                ))
              })}
            </CommandGroup>
          ))}
          <CommandSeparator />
          <CommandGroup heading='Design'>
            <CommandItem
              onSelect={() => runCommand(() => setTheme('light'))}
              className='cursor-pointer'
            >
              <Sun /> <span>Hell</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => setTheme('dark'))}
              className='cursor-pointer'
            >
              <Moon className='scale-90' />
              <span>Dunkel</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => setTheme('system'))}
              className='cursor-pointer'
            >
              <Laptop />
              <span>System</span>
            </CommandItem>
          </CommandGroup>
        </ScrollArea>
      </CommandList>
    </CommandDialog>
  )
}
