'use client'

import React from 'react'
import { Menu } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

type TopNavProps = React.HTMLAttributes<HTMLElement> & {
  links: {
    title: string
    href: string
    isActive: boolean
    disabled?: boolean
  }[]
  onSelectTab?: (tabId: string) => void
}

export function TopNav({ className, links, onSelectTab, ...props }: TopNavProps) {
  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            size='icon'
            variant='outline'
            className={cn('md:size-7 lg:hidden cursor-pointer', className)}
          >
            <Menu />
            <span className='sr-only'>Toggle navigation menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side='bottom' align='start'>
          {links.map(({ title, href, isActive, disabled }) => (
            <DropdownMenuItem
              key={`${title}-${href}`}
              disabled={disabled}
              onClick={() => onSelectTab && onSelectTab(href)}
              className={cn('cursor-pointer', !isActive && 'text-muted-foreground')}
            >
              {title}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <nav
        className={cn(
          'hidden items-center space-x-4 lg:flex lg:space-x-4 xl:space-x-6',
          className
        )}
        {...props}
      >
        {links.map(({ title, href, isActive, disabled }) => (
          <button
            key={`${title}-${href}`}
            type='button'
            disabled={disabled}
            onClick={() => onSelectTab && onSelectTab(href)}
            className={cn(
              'text-sm font-medium transition-colors hover:text-primary cursor-pointer disabled:opacity-50 disabled:pointer-events-none',
              isActive ? '' : 'text-muted-foreground'
            )}
          >
            {title}
          </button>
        ))}
      </nav>
    </>
  )
}
