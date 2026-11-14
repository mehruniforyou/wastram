'use client'

import React from 'react'
import Image from 'next/image'
import {
  LayoutDashboard,
  Users,
  Settings,
  UserCog,
  Wrench,
  Palette,
  Bell,
  Monitor,
  KeyRound,
  HelpCircle,
  ChevronsUpDown,
  ChevronRight,
  Sparkles,
  BadgeCheck,
  CreditCard,
  LogOut,
  ShoppingBag,
  Layers,
  Percent,
  Box,
  Star,
  Truck,
  FileText,
  Boxes,
} from 'lucide-react'
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  useSidebar,
} from '@/components/ui/sidebar'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

export interface AdminMenuItem {
  id: string
  label: string
  icon: any
  badgeKey?: string
  desc?: string
}

export interface AdminSubGroup {
  subGroupLabel?: string
  items: AdminMenuItem[]
}

export interface AdminMenuGroup {
  id: string
  title: string
  icon: any
  subGroups: AdminSubGroup[]
}

interface AdminSidebarProps {
  activeTab: string
  onSelectTab: (tabId: any) => void
  unreadOrdersCount: number
  unreadClientsCount: number
  priceUnlocksCount: number
  onLogout: () => void
  adminMenuGroups?: AdminMenuGroup[]
}

export function AdminSidebar({
  activeTab,
  onSelectTab,
  unreadOrdersCount,
  onLogout,
}: AdminSidebarProps) {
  const { isMobile, setOpenMobile } = useSidebar()

  return (
    <Sidebar collapsible='icon' variant='sidebar'>
      {/* ── IXOS Brand Logo Header (No Switching, Brand Only) ── */}
      <SidebarHeader className='h-16 flex items-center justify-center p-2 border-b border-sidebar-border/40'>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size='lg'
              className='cursor-pointer hover:bg-transparent active:bg-transparent px-2 transition-opacity hover:opacity-90'
              onClick={() => onSelectTab('overview')}
              tooltip='Wastram Atelier'
            >
              <div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-black text-xs shrink-0 shadow-sm'>
                <span className='font-serif font-black text-sm'>W</span>
              </div>
              <div className='flex flex-1 flex-col items-start justify-center overflow-hidden group-data-[collapsible=icon]:hidden ps-2'>
                <span className='font-serif font-bold text-sm tracking-wide'>WASTRAM</span>
                <span className='text-[10px] tracking-widest uppercase opacity-60 -mt-0.5'>ATELIER ADMIN</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* ── Sidebar Navigation Groups ── */}
      <SidebarContent>
        {/* GROUP 1: General */}
        <SidebarGroup>
          <SidebarGroupLabel>General</SidebarGroupLabel>
          <SidebarMenu>
            {/* Dashboard */}
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={activeTab === 'overview' || activeTab === 'dashboard'}
                tooltip='Dashboard'
                onClick={() => {
                  onSelectTab('overview')
                  setOpenMobile(false)
                }}
              >
                <LayoutDashboard />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* Orders */}
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={activeTab === 'orders' || activeTab === 'sample-orders'}
                tooltip='Orders'
                onClick={() => {
                  onSelectTab('orders')
                  setOpenMobile(false)
                }}
              >
                <ShoppingBag />
                <span>Orders</span>
                {unreadOrdersCount > 0 && (
                  <Badge variant='destructive' className='ms-auto rounded-full px-1.5 py-0 text-xs'>
                    {unreadOrdersCount}
                  </Badge>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* Customers */}
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={activeTab === 'users' || activeTab === 'customers'}
                tooltip='Customers'
                onClick={() => {
                  onSelectTab('customers')
                  setOpenMobile(false)
                }}
              >
                <Users />
                <span>Customers</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* GROUP 2: Store & Inventory (Just below General) */}
        <SidebarGroup>
          <SidebarGroupLabel>Store &amp; Inventory</SidebarGroupLabel>
          <SidebarMenu>
            {/* Products */}
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={activeTab === 'products'}
                tooltip='Products'
                onClick={() => {
                  onSelectTab('products')
                  setOpenMobile(false)
                }}
              >
                <Box />
                <span>Products</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* Inventory */}
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={activeTab === 'inventory'}
                tooltip='Inventory'
                onClick={() => {
                  onSelectTab('inventory')
                  setOpenMobile(false)
                }}
              >
                <Boxes />
                <span>Inventory</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* Categories */}
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={activeTab === 'categories'}
                tooltip='Categories'
                onClick={() => {
                  onSelectTab('categories')
                  setOpenMobile(false)
                }}
              >
                <Layers />
                <span>Categories</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* Discounts */}
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={activeTab === 'discounts'}
                tooltip='Discounts'
                onClick={() => {
                  onSelectTab('discounts')
                  setOpenMobile(false)
                }}
              >
                <Percent />
                <span>Discounts</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* Reviews */}
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={activeTab === 'reviews'}
                tooltip='Reviews'
                onClick={() => {
                  onSelectTab('reviews')
                  setOpenMobile(false)
                }}
              >
                <Star />
                <span>Reviews</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* Shipping Rates */}
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={activeTab === 'shipping'}
                tooltip='Shipping Rates'
                onClick={() => {
                  onSelectTab('shipping')
                  setOpenMobile(false)
                }}
              >
                <Truck />
                <span>Shipping Rates</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* Store Settings */}
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={activeTab === 'settings' || activeTab === 'payment-settings'}
                tooltip='Store Settings'
                onClick={() => {
                  onSelectTab('settings')
                  setOpenMobile(false)
                }}
              >
                <Settings />
                <span>Store Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* Legal & Policies */}
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={activeTab === 'legal-policies'}
                tooltip='Legal & Policies'
                onClick={() => {
                  onSelectTab('legal-policies')
                  setOpenMobile(false)
                }}
              >
                <FileText />
                <span>Legal &amp; Policies</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* GROUP 3: Other (Kept at the very bottom) */}
        <SidebarGroup className='mt-auto'>
          <SidebarGroupLabel>Other</SidebarGroupLabel>
          <SidebarMenu>
            {/* Settings Collapsible */}
            <Collapsible asChild className='group/collapsible'>
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip='Settings'>
                    <Settings />
                    <span>Settings</span>
                    <ChevronRight className='ms-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        isActive={activeTab === 'settings-profile'}
                        onClick={() => {
                          onSelectTab('settings-profile')
                          setOpenMobile(false)
                        }}
                      >
                        <UserCog className='size-3.5' />
                        <span>Profile</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        isActive={activeTab === 'settings-account'}
                        onClick={() => {
                          onSelectTab('settings-account')
                          setOpenMobile(false)
                        }}
                      >
                        <Wrench className='size-3.5' />
                        <span>Account</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        isActive={activeTab === 'settings-appearance'}
                        onClick={() => {
                          onSelectTab('settings-appearance')
                          setOpenMobile(false)
                        }}
                      >
                        <Palette className='size-3.5' />
                        <span>Appearance</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        isActive={activeTab === 'settings-notifications'}
                        onClick={() => {
                          onSelectTab('settings-notifications')
                          setOpenMobile(false)
                        }}
                      >
                        <Bell className='size-3.5' />
                        <span>Notifications</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        isActive={activeTab === 'settings-display'}
                        onClick={() => {
                          onSelectTab('settings-display')
                          setOpenMobile(false)
                        }}
                      >
                        <Monitor className='size-3.5' />
                        <span>Display</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        isActive={activeTab === 'settings-api-keys'}
                        onClick={() => {
                          onSelectTab('settings-api-keys')
                          setOpenMobile(false)
                        }}
                      >
                        <KeyRound className='size-3.5' />
                        <span>API Keys</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>

            {/* Help Center */}
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={activeTab === 'help-center'}
                tooltip='Help Center'
                onClick={() => {
                  onSelectTab('help-center')
                  setOpenMobile(false)
                }}
              >
                <HelpCircle />
                <span>Help Center</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* ── Footer: Admin Profile Dropdown ── */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size='lg'
                  className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer'
                >
                  <Avatar className='h-8 w-8 rounded-lg'>
                    <AvatarImage src='/icon.png' alt='Admin' />
                    <AvatarFallback className='rounded-lg'>IX</AvatarFallback>
                  </Avatar>
                  <div className='grid flex-1 text-start text-sm leading-tight'>
                    <span className='truncate font-semibold'>Admin</span>
                    <span className='truncate text-xs text-muted-foreground'>admin@ixosaudio.com</span>
                  </div>
                  <ChevronsUpDown className='ms-auto size-4' />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className='w-56 rounded-lg'
                side={isMobile ? 'bottom' : 'right'}
                align='end'
                sideOffset={4}
              >
                <DropdownMenuLabel className='p-0 font-normal'>
                  <div className='flex items-center gap-2 px-1 py-1.5 text-start text-sm'>
                    <Avatar className='h-8 w-8 rounded-lg'>
                      <AvatarImage src='/icon.png' alt='Admin' />
                      <AvatarFallback className='rounded-lg'>IX</AvatarFallback>
                    </Avatar>
                    <div className='grid flex-1 text-start text-sm leading-tight'>
                      <span className='truncate font-semibold'>Admin</span>
                      <span className='truncate text-xs text-muted-foreground'>
                        admin@ixosaudio.com
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem className='cursor-pointer'>
                    <Sparkles className='size-4' />
                    Upgrade to Pro
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    className='cursor-pointer'
                    onClick={() => onSelectTab('settings-account')}
                  >
                    <BadgeCheck className='size-4' />
                    Account
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className='cursor-pointer'
                    onClick={() => onSelectTab('settings-profile')}
                  >
                    <CreditCard className='size-4' />
                    Billing
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className='cursor-pointer'
                    onClick={() => onSelectTab('settings-notifications')}
                  >
                    <Bell className='size-4' />
                    Notifications
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant='destructive'
                  className='cursor-pointer text-destructive focus:bg-destructive focus:text-destructive-foreground'
                  onClick={onLogout}
                >
                  <LogOut className='size-4' />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
