'use client'

import { type ReactNode } from 'react'
import { ChevronRight } from 'lucide-react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  type NavCollapsible,
  type NavItem,
  type NavLink,
  type NavGroup as NavGroupProps,
} from './types'

interface NavGroupComponentProps extends NavGroupProps {
  activeTab: string
  onSelectTab: (tabId: string) => void
}

export function NavGroup({ title, items, activeTab, onSelectTab }: NavGroupComponentProps) {
  const { state, isMobile } = useSidebar()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const key = `${item.title}-${item.url}`

          if (!item.items)
            return (
              <SidebarMenuLink
                key={key}
                item={item as any}
                activeTab={activeTab}
                onSelectTab={onSelectTab}
              />
            )

          if (state === 'collapsed' && !isMobile)
            return (
              <SidebarMenuCollapsedDropdown
                key={key}
                item={item as any}
                activeTab={activeTab}
                onSelectTab={onSelectTab}
              />
            )

          return (
            <SidebarMenuCollapsible
              key={key}
              item={item as any}
              activeTab={activeTab}
              onSelectTab={onSelectTab}
            />
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}

function NavBadge({ children }: { children: ReactNode }) {
  return <Badge className='rounded-full px-1 py-0 text-xs'>{children}</Badge>
}

function SidebarMenuLink({
  item,
  activeTab,
  onSelectTab,
}: {
  item: NavLink
  activeTab: string
  onSelectTab: (tabId: string) => void
}) {
  const { setOpenMobile } = useSidebar()
  const isActive = checkIsActive(activeTab, item)

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        isActive={isActive}
        tooltip={item.title}
        onClick={() => {
          onSelectTab(item.url)
          setOpenMobile(false)
        }}
        className='cursor-pointer'
      >
        {item.icon && <item.icon />}
        <span>{item.title}</span>
        {item.badge && <NavBadge>{item.badge}</NavBadge>}
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

function SidebarMenuCollapsible({
  item,
  activeTab,
  onSelectTab,
}: {
  item: NavCollapsible
  activeTab: string
  onSelectTab: (tabId: string) => void
}) {
  const { setOpenMobile } = useSidebar()
  const isParentActive = checkIsActive(activeTab, item, true)

  return (
    <Collapsible
      asChild
      defaultOpen={isParentActive}
      className='group/collapsible'
    >
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip={item.title} className='cursor-pointer'>
            {item.icon && <item.icon />}
            <span>{item.title}</span>
            {item.badge && <NavBadge>{item.badge}</NavBadge>}
            <ChevronRight className='ms-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent className='CollapsibleContent'>
          <SidebarMenuSub>
            {item.items.map((subItem) => (
              <SidebarMenuSubItem key={subItem.title}>
                <SidebarMenuSubButton
                  isActive={checkIsActive(activeTab, subItem)}
                  onClick={() => {
                    onSelectTab(subItem.url)
                    setOpenMobile(false)
                  }}
                  className='cursor-pointer'
                >
                  {subItem.icon && <subItem.icon />}
                  <span>{subItem.title}</span>
                  {subItem.badge && <NavBadge>{subItem.badge}</NavBadge>}
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  )
}

function SidebarMenuCollapsedDropdown({
  item,
  activeTab,
  onSelectTab,
}: {
  item: NavCollapsible
  activeTab: string
  onSelectTab: (tabId: string) => void
}) {
  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            tooltip={item.title}
            isActive={checkIsActive(activeTab, item, true)}
            className='cursor-pointer'
          >
            {item.icon && <item.icon />}
            <span>{item.title}</span>
            {item.badge && <NavBadge>{item.badge}</NavBadge>}
            <ChevronRight className='ms-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent side='right' align='start' sideOffset={4}>
          <DropdownMenuLabel>
            {item.title} {item.badge ? `(${item.badge})` : ''}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {item.items.map((sub) => (
            <DropdownMenuItem
              key={`${sub.title}-${sub.url}`}
              onClick={() => onSelectTab(sub.url)}
              className={checkIsActive(activeTab, sub) ? 'bg-secondary cursor-pointer' : 'cursor-pointer'}
            >
              {sub.icon && <sub.icon />}
              <span className='max-w-52 text-wrap'>{sub.title}</span>
              {sub.badge && (
                <span className='ms-auto text-xs'>{sub.badge}</span>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  )
}

function checkIsActive(activeTab: string, item: NavItem | { url: string; items?: any }, isParent = false) {
  if (item.url === activeTab) return true
  if (item.url === 'overview' && (activeTab === 'overview' || activeTab === 'dashboard')) return true
  if ((item.url === 'customers' || item.url === 'users') && (activeTab === 'customers' || activeTab === 'users')) return true
  if ((item.url === 'orders' || item.url === 'sample-orders') && (activeTab === 'orders' || activeTab === 'sample-orders')) return true
  if ((item.url === 'payment-settings' || item.url === 'store-settings') && (activeTab === 'payment-settings' || activeTab === 'store-settings')) return true
  if (item.items && Array.isArray(item.items)) {
    return item.items.some((sub: any) => sub.url === activeTab)
  }
  return false
}
