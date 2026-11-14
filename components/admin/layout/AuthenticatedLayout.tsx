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
              <SidebarProvider defaultOpen={defaultOpen} className='bg-background flex min-h-screen w-full'>
                <AppSidebar
                  activeTab={activeTab}
                  onSelectTab={onSelectTab}
                  unreadOrdersCount={unreadOrdersCount}
                  openTicketsCount={openTicketsCount}
                  onLogout={onLogout}
                />
                <SidebarInset className='flex-1 flex flex-col min-w-0 bg-background overflow-x-hidden overflow-y-auto min-h-screen'>
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
