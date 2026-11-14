'use client'

import React, { useState, useMemo, useEffect, useCallback } from 'react'
import {
  Users,
  Search,
  Download,
  ShoppingBag,
  Mail,
  MoreHorizontal,
  ExternalLink,
  Copy,
  Check,
  Calendar,
  CreditCard,
  UserCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Header } from '@/components/admin/layout/Header'
import { Main } from '@/components/admin/layout/Main'
import { Search as SearchHeader } from '@/components/admin/Search'
import { ThemeSwitch } from '@/components/admin/ThemeSwitch'
import { ConfigDrawer } from '@/components/admin/ConfigDrawer'
import {
  parseOrderTimestamp,
  getAdminTimeZone,
  formatAdminOrderDateTime,
} from '@/utils/adminTimezone'

export interface CustomerItem {
  id: string
  name: string
  email: string
  totalSpent: number
  orderCount: number
  currency: string
  status: 'verified' | 'active'
  lastOrderDate: string
  fallback: string
}

export interface CustomersViewProps {
  onSelectTab?: (tabId: string) => void
  onLogout?: () => void
  orders?: any[]
  payments?: any[]
}

function getInitials(name?: string): string {
  if (!name) return 'CU'
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  return name.slice(0, 2).toUpperCase()
}

export function CustomersView({
  onSelectTab,
  onLogout,
  orders: externalOrders,
  payments: externalPayments,
}: CustomersViewProps) {
  const [internalOrders, setInternalOrders] = useState<any[]>([])
  const [internalPayments, setInternalPayments] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // Fetch orders and payments if not passed
  useEffect(() => {
    if (!externalOrders || externalOrders.length === 0) {
      let isMounted = true
      Promise.all([
        fetch('/api/orders?limit=200&t=' + Date.now())
          .then((r) => (r.ok ? r.json() : []))
          .catch(() => []),
        fetch('/api/payments?t=' + Date.now())
          .then((r) => (r.ok ? r.json() : []))
          .catch(() => []),
      ]).then(([ordData, payData]) => {
        if (isMounted) {
          if (Array.isArray(ordData)) setInternalOrders(ordData)
          if (Array.isArray(payData)) setInternalPayments(payData)
        }
      })
      return () => {
        isMounted = false
      }
    }
  }, [externalOrders])

  const orders = externalOrders && externalOrders.length > 0 ? externalOrders : internalOrders
  const payments = externalPayments && externalPayments.length > 0 ? externalPayments : internalPayments

  // Parse and aggregate real customers from verified orders and payments
  const customers = useMemo<CustomerItem[]>(() => {
    const customerMap = new Map<
      string,
      {
        id: string
        name: string
        email: string
        totalSpent: number
        orderCount: number
        currency: string
        lastDate: Date
      }
    >()

    const adminTz = getAdminTimeZone()

    const parseDate = (item: any): Date | null => {
      if (!item) return null
      const raw =
        item.created_at ||
        item.createdAt ||
        item.date ||
        item.order_date ||
        item.payment_date ||
        item.create_time
      return parseOrderTimestamp(raw)
    }

    // 1. Process Orders
    if (Array.isArray(orders)) {
      orders.forEach((ord: any) => {
        const orderStatus = (ord.order_status || ord.status || '').toLowerCase()
        const paymentStatus = (ord.payment_status || '').toLowerCase()
        // Skip cancelled / failed / deleted
        if (
          ord.is_deleted === true ||
          ord.is_cancelled === true ||
          orderStatus.includes('cancel') ||
          orderStatus.includes('stornier') ||
          orderStatus.includes('void') ||
          paymentStatus.includes('fail')
        ) {
          return
        }

        const email = (
          ord.customer_email ||
          ord.customerEmail ||
          ord.shipping_address?.email ||
          ord.billing_address?.email ||
          ''
        )
          .toLowerCase()
          .trim()

        if (!email) return

        const name =
          ord.customer_name ||
          ord.customerName ||
          ord.shipping_address?.full_name ||
          ord.shipping_address?.name ||
          email.split('@')[0]

        const amount = Number(ord.total_amount || ord.amount || ord.total || 0)
        const currency = ord.currency || 'EUR'
        const date = parseDate(ord) || new Date()

        const existing = customerMap.get(email)
        if (existing) {
          existing.totalSpent += amount
          existing.orderCount += 1
          if (date > existing.lastDate) {
            existing.lastDate = date
            if (name && name !== email.split('@')[0]) existing.name = name
          }
        } else {
          customerMap.set(email, {
            id: email,
            name,
            email,
            totalSpent: amount,
            orderCount: 1,
            currency,
            lastDate: date,
          })
        }
      })
    }

    // 2. Process Payments
    if (Array.isArray(payments)) {
      payments.forEach((pay: any) => {
        if (pay.is_deleted === true || pay.status === 'Cancelled' || pay.payment_status === 'Cancelled') return
        const payStatus = (pay.payment_status || pay.status || '').toLowerCase()
        if (payStatus !== 'paid' && payStatus !== 'completed' && payStatus !== '') return

        const email = (pay.customer_email || pay.payer_email || '').toLowerCase().trim()
        if (!email) return

        const name = pay.customer_name || pay.payer_name || email.split('@')[0]
        const amount = Number(pay.amount || 0)
        const currency = pay.currency || 'EUR'
        const date = parseDate(pay) || new Date()

        const existing = customerMap.get(email)
        if (existing) {
          // If customer already has this payment accounted from orders, don't double count if same order
          // Only add if not linked
          if (!pay.order_number && !pay.order_id) {
            existing.totalSpent += amount
            existing.orderCount += 1
          }
          if (date > existing.lastDate) {
            existing.lastDate = date
          }
        } else {
          customerMap.set(email, {
            id: email,
            name,
            email,
            totalSpent: amount,
            orderCount: 1,
            currency,
            lastDate: date,
          })
        }
      })
    }

    return Array.from(customerMap.values())
      .map((c) => ({
        id: c.id,
        name: c.name,
        email: c.email,
        totalSpent: c.totalSpent,
        orderCount: c.orderCount,
        currency: c.currency,
        status: 'verified' as const,
        lastOrderDate: formatAdminOrderDateTime(c.lastDate, adminTz).date,
        fallback: getInitials(c.name),
      }))
      .sort((a, b) => b.totalSpent - a.totalSpent)
  }, [orders, payments])

  const filteredCustomers = useMemo(() => {
    if (!searchTerm.trim()) return customers
    const term = searchTerm.toLowerCase().trim()
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        c.email.toLowerCase().includes(term)
    )
  }, [customers, searchTerm])

  const copyEmail = (email: string) => {
    navigator.clipboard.writeText(email)
    setCopiedId(email)
    setTimeout(() => setCopiedId(null), 2000)
  }

  // Export CSV
  const handleExportCSV = useCallback(() => {
    if (customers.length === 0) {
      alert('No customer data available to export.')
      return
    }
    const headers = ['Customer Name', 'Email', 'Order Count', 'Total Spent', 'Currency', 'Last Order Date']
    const rows = customers.map((c) => [
      `"${c.name.replace(/"/g, '""')}"`,
      `"${c.email.replace(/"/g, '""')}"`,
      c.orderCount,
      c.totalSpent.toFixed(2),
      `"${c.currency}"`,
      `"${c.lastOrderDate}"`,
    ])
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `wastram-customers-${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, [customers])

  return (
    <>
      <Header fixed>
        <div className='ms-auto flex items-center gap-2 sm:gap-4'>
          <SearchHeader />
          <ThemeSwitch />
          <ConfigDrawer />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        {/* Title and Top Actions */}
        <div className='flex flex-wrap items-end justify-between gap-3 mb-2'>
          <div>
            <h2 className='text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground'>Customers</h2>
          </div>
          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={handleExportCSV}
              className='cursor-pointer text-xs h-9'
            >
              <Download className='size-3.5 mr-1.5' />
              CSV exportieren
            </Button>
            {onSelectTab && (
              <Button
                size='sm'
                onClick={() => onSelectTab('sample-orders')}
                className='cursor-pointer text-xs h-9'
              >
                <ShoppingBag className='size-3.5 mr-1.5' />
                View All Orders
              </Button>
            )}
          </div>
        </div>

        {/* Filter Input */}
        <div className='flex items-center justify-between gap-2'>
          <div className='relative w-[240px] sm:w-[320px]'>
            <Search className='absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground' />
            <Input
              placeholder='Filter customers by name or email...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='h-8.5 pl-8 text-xs'
            />
          </div>
          <div className='text-xs text-muted-foreground font-medium'>
            {filteredCustomers.length} {filteredCustomers.length === 1 ? 'Customer' : 'Customers'}
          </div>
        </div>

        {/* Customer Table */}
        <div className='rounded-xl border border-border/80 shadow-xs bg-card overflow-hidden'>
          <Table>
            <TableHeader>
              <TableRow className='hover:bg-transparent'>
                <TableHead className='text-xs font-semibold'>Customer</TableHead>
                <TableHead className='text-xs font-semibold'>Orders</TableHead>
                <TableHead className='text-xs font-semibold'>Total Revenue</TableHead>
                <TableHead className='text-xs font-semibold'>Status</TableHead>
                <TableHead className='text-xs font-semibold'>Last Activity</TableHead>
                <TableHead className='w-[60px]'></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className='h-32 text-center text-xs text-muted-foreground'>
                    {searchTerm ? (
                      'No customers found matching your search.'
                    ) : (
                      <div className='flex flex-col items-center justify-center gap-2'>
                        <Users className='size-8 text-muted-foreground/50' />
                        <p className='font-medium text-foreground'>No verified customers yet</p>
                        <p className='text-[11px] text-muted-foreground'>
                          Verified customer orders and payments will appear automatically in this list.
                        </p>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div className='flex items-center gap-3'>
                        <Avatar className='size-8 border border-border/60 bg-muted'>
                          <AvatarFallback className='text-xs font-semibold text-foreground'>
                            {customer.fallback}
                          </AvatarFallback>
                        </Avatar>
                        <div className='flex flex-col min-w-0'>
                          <span className='font-semibold text-xs text-foreground truncate'>
                            {customer.name}
                          </span>
                          <span className='text-[11px] text-muted-foreground truncate'>
                            {customer.email}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge variant='secondary' className='text-[11px] font-medium'>
                        {customer.orderCount} {customer.orderCount === 1 ? 'Order' : 'Orders'}
                      </Badge>
                    </TableCell>

                    <TableCell className='text-xs font-semibold text-[#007934] dark:text-[#22c55e] tabular-nums'>
                      {customer.currency === 'USD' ? '$' : customer.currency === 'GBP' ? '£' : customer.currency === 'EUR' ? '€' : '₹'}
                      {customer.totalSpent.toLocaleString('en-IN', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </TableCell>

                    <TableCell>
                      <span className='inline-flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium'>
                        <span className='size-1.5 rounded-full bg-emerald-500' />
                        Verified Buyer
                      </span>
                    </TableCell>

                    <TableCell className='text-xs text-muted-foreground tabular-nums'>
                      {customer.lastOrderDate}
                    </TableCell>

                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant='ghost' size='icon' className='size-8 cursor-pointer'>
                            <MoreHorizontal className='size-4' />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end' className='w-48'>
                          <DropdownMenuItem
                            onClick={() => copyEmail(customer.email)}
                            className='cursor-pointer text-xs'
                          >
                            {copiedId === customer.email ? (
                              <Check className='size-3.5 mr-2 text-emerald-600' />
                            ) : (
                              <Copy className='size-3.5 mr-2' />
                            )}
                            E-Mail kopieren
                          </DropdownMenuItem>

                          {onSelectTab && (
                            <DropdownMenuItem
                              onClick={() => onSelectTab('sample-orders')}
                              className='cursor-pointer text-xs'
                            >
                              <ShoppingBag className='size-3.5 mr-2' />
                              View Orders
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Main>
    </>
  )
}

// Export backwards-compatible alias
export const UsersView = CustomersView
