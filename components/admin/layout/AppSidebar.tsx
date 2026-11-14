'use client'

import Image from 'next/image'
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
      <SidebarHeader className='p-2'>
        <div className='flex h-12 w-full items-center justify-center select-none'>
          <div className='flex items-center -translate-x-10 group-data-[collapsible=icon]:translate-x-0'>
            <Image
              src='/logo-light.png'
              alt='IXOS'
              width={120}
              height={42}
              className='h-7 w-auto object-contain dark:hidden group-data-[collapsible=icon]:hidden pointer-events-none'
              priority
            />
            <Image
              src='/logo-dark.png'
              alt='IXOS'
              width={120}
              height={42}
              className='h-7 w-auto object-contain hidden dark:block dark:group-data-[collapsible=icon]:hidden pointer-events-none'
              priority
            />
            <Image
              src='/icon.png'
              alt='IXOS'
              width={32}
              height={32}
              className='hidden size-7 rounded-md object-contain group-data-[collapsible=icon]:block pointer-events-none'
            />
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
