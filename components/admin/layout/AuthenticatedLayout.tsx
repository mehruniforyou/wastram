'use client'

import React from 'react'
import { getCookie } from '@/lib/cookies'
import { cn } from '@/lib/utils'
import { LayoutProvider } from '@/context/layout-provider'
import { SearchProvider } from '@/context/search-provider'
import { ThemeProvider } from '@/context/theme-provider'
import { FontProvider } from '@/context/font-provider'
import { DirectionProvider } from '@/context/direction-provider'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from './AppSidebar'
import { CommandMenu } from '../CommandMenu'

type AuthenticatedLayoutProps = {
  children?: React.ReactNode
  activeTab: string
  onSelectTab: (tabId: string) => void
  unreadOrdersCount?: number
  openTicketsCount?: number
  onLogout: () => void
}

export function AuthenticatedLayout({
  children,
  activeTab,
  onSelectTab,
  unreadOrdersCount = 0,
  openTicketsCount = 0,
  onLogout,
}: AuthenticatedLayoutProps) {
  const defaultOpen = getCookie('sidebar_state') !== 'false'

  return (
    <ThemeProvider defaultTheme='light' storageKey='vite-ui-theme'>
      <FontProvider>
        <DirectionProvider>
          <SearchProvider>
            <LayoutProvider>
              <SidebarProvider defaultOpen={defaultOpen} className='bg-sidebar'>
                <AppSidebar
                  activeTab={activeTab}
                  onSelectTab={onSelectTab}
                  unreadOrdersCount={unreadOrdersCount}
                  openTicketsCount={openTicketsCount}
                  onLogout={onLogout}
                />
                <SidebarInset
                  className={cn(
                    '@container/content',
                    'has-data-[layout=fixed]:h-svh',
                    'peer-data-[variant=inset]:has-data-[layout=fixed]:h-[calc(100svh-(var(--spacing)*4))]'
                  )}
                >
                  {children}
                </SidebarInset>
                <CommandMenu onSelectTab={onSelectTab} />
              </SidebarProvider>
            </LayoutProvider>
          </SearchProvider>
        </DirectionProvider>
      </FontProvider>
    </ThemeProvider>
  )
}
