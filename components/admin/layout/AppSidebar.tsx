'use client'

import React from 'react'
import { useLayout } from '@/context/layout-provider'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { getSidebarData } from './data/sidebar-data'
import { NavGroup } from './NavGroup'

interface AppSidebarProps {
  activeTab: string
  onSelectTab: (tabId: string) => void
  unreadOrdersCount?: number
  openTicketsCount?: number
  onLogout?: () => void
}

export function AppSidebar({
  activeTab,
  onSelectTab,
  unreadOrdersCount = 0,
  openTicketsCount = 0,
}: AppSidebarProps) {
  const { collapsible, variant } = useLayout()
  const sidebarData = getSidebarData(unreadOrdersCount, openTicketsCount)

  return (
    <Sidebar collapsible={collapsible} variant={variant}>
      <SidebarHeader className='p-2 border-b border-border/40'>
        <div className='flex h-12 w-full items-center justify-start px-2 select-none'>
          <div className='flex items-center gap-2.5'>
            <div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-[#0B2D7F] text-white font-serif font-black text-sm shrink-0 shadow-sm'>
              W
            </div>
            <div className='flex flex-col items-start justify-center group-data-[collapsible=icon]:hidden'>
              <span className='font-serif font-bold text-sm tracking-wide text-foreground'>WASTRAM</span>
              <span className='text-[9px] tracking-widest uppercase text-muted-foreground -mt-0.5'>ATELIER ADMIN</span>
            </div>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {sidebarData.navGroups.map((props) => (
          <NavGroup
            key={props.title}
            {...props}
            activeTab={activeTab}
            onSelectTab={onSelectTab}
          />
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
