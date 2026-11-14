'use client'

import React, { useState } from 'react'
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

type NavUserProps = {
  user: {
    name: string
    email: string
    avatar: string
  }
  onSelectTab: (tabId: string) => void
  onLogout: () => void
}

export function NavUser({ user, onSelectTab, onLogout }: NavUserProps) {
  const { isMobile } = useSidebar()
  const [openSignOut, setOpenSignOut] = useState(false)

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size='lg'
                className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer'
              >
                <Avatar className='h-8 w-8 rounded-lg'>
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className='rounded-lg bg-[#0B2D7F] text-white font-serif font-bold text-xs'>
                    WA
                  </AvatarFallback>
                </Avatar>
                <div className='grid flex-1 text-start text-sm leading-tight'>
                  <span className='truncate font-semibold'>{user.name}</span>
                  <span className='truncate text-xs text-muted-foreground'>{user.email}</span>
                </div>
                <ChevronsUpDown className='ms-auto size-4' />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className='w-[var(--radix-dropdown-menu-trigger-width)] min-w-56 rounded-lg'
              side={isMobile ? 'bottom' : 'right'}
              align='end'
              sideOffset={4}
            >
              <DropdownMenuLabel className='p-0 font-normal'>
                <div className='flex items-center gap-2 px-1 py-1.5 text-start text-sm'>
                  <Avatar className='h-8 w-8 rounded-lg'>
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className='rounded-lg bg-[#0B2D7F] text-white font-serif font-bold text-xs'>
                      WA
                    </AvatarFallback>
                  </Avatar>
                  <div className='grid flex-1 text-start text-sm leading-tight'>
                    <span className='truncate font-semibold'>{user.name}</span>
                    <span className='truncate text-xs text-muted-foreground'>{user.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem className='cursor-pointer' onClick={() => onSelectTab('overview')}>
                  <Sparkles className='size-4 mr-2 text-primary' />
                  Store Telemetry
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem className='cursor-pointer' onClick={() => onSelectTab('settings-account')}>
                  <BadgeCheck className='size-4 mr-2' />
                  Account
                </DropdownMenuItem>
                <DropdownMenuItem className='cursor-pointer' onClick={() => onSelectTab('payment-settings')}>
                  <CreditCard className='size-4 mr-2' />
                  Billing &amp; Payments
                </DropdownMenuItem>
                <DropdownMenuItem className='cursor-pointer' onClick={() => onSelectTab('settings-notifications')}>
                  <Bell className='size-4 mr-2' />
                  Notifications
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className='cursor-pointer text-destructive focus:text-destructive'
                onClick={() => setOpenSignOut(true)}
              >
                <LogOut className='size-4 mr-2' />
                Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      <AlertDialog open={openSignOut} onOpenChange={setOpenSignOut}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Log Out</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to log out of the Wastram Atelier admin console?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={onLogout}
              className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
            >
              Log Out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
