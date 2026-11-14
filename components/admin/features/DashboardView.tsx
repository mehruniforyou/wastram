'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ConfigDrawer } from '@/components/admin/ConfigDrawer'
import { Header } from '@/components/admin/layout/Header'
import { Main } from '@/components/admin/layout/Main'
import { Search } from '@/components/admin/Search'
import { ThemeSwitch } from '@/components/admin/ThemeSwitch'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Area, AreaChart } from 'recharts'
import {
  Tooltip as UiTooltip,
  TooltipTrigger as UiTooltipTrigger,
  TooltipContent as UiTooltipContent,
} from '@/components/ui/tooltip'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Calendar,
  Download,
  DollarSign,
  PackageCheck,
  CreditCard,
  Users,
  ShoppingBag,
  RefreshCw,
  Bell,
  FileText,
  TrendingUp,
  TrendingDown,
  Receipt,
  Truck,
  Box,
  Package,
  ShoppingCart,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
  Layers,
  Percent,
  ArrowUpRight,
  Filter,
  Check,
  Eye,
  Clock,
  Search as SearchIcon,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { formatOrderSerialNumber } from '@/utils/orderNumber'
import {
  parseOrderTimestamp,
  getAdminTimeZone,
  getAdminTodayDateString,
  getAdminLocalDateString,
  getAdminLocalHour,
  formatAdminOrderDateTime,
  formatAdminRelativeTime,
  getTimeZoneAbbreviation,
} from '@/utils/adminTimezone'

export type DashboardSubTab = 'overview' | 'analytics' | 'reports' | 'notifications'

export type FilterPeriod =
  | 'today'
  | 'yesterday'
  | 'last_7_days'
  | 'this_month'
  | 'last_month'
  | 'last_6_months'
  | 'custom'

const FILTER_OPTIONS: { id: FilterPeriod; label: string }[] = [
  { id: 'today', label: 'Today' },
  { id: 'yesterday', label: 'Yesterday' },
  { id: 'last_7_days', label: 'Last 7 Days' },
  { id: 'this_month', label: 'This Month' },
  { id: 'last_month', label: 'Last Month' },
  { id: 'last_6_months', label: 'Last 6 Months' },
  { id: 'custom', label: 'Custom Range' },
]

export interface DashboardViewProps {
  onSelectTab: (tabId: string) => void
  onSelectOrder?: (order: any, orderNumber?: string) => void
  onLogout?: () => void
  orders?: any[]
  payments?: any[]
  isLoading?: boolean
  onRefresh?: () => void
  onOrdersLoaded?: (orders: any[]) => void
  initialSubTab?: DashboardSubTab
}

export interface SaleItem {
  id?: string
  name: string
  productName: string
  sku: string
  partNumber: string
  variant: string
  quantity: number
  unitPrice: number
  total: number
}

interface VerifiedSale {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  customerCountry?: string
  customerCity?: string
  customerAddress?: string
  amount: number
  currency: string
  date: Date
  status: string
  paymentMethod?: string
  items?: SaleItem[]
  fallback: string
  avatar?: string
  rawOrder?: any
}

interface ChartBucket {
  name: string
  total: number
  count: number
}

function parseOrderDate(raw: any): Date | null {
  if (!raw) return null
  const direct = parseOrderTimestamp(raw.paid_at || raw.created_at || raw.date)
  if (direct) return direct

  const idStr = String(raw.id || raw.orderId || raw.order_number || '')
  const match = idStr.match(/\b(1[6789]\d{11})\b/)
  if (match) {
    const d = new Date(Number(match[1]))
    if (!isNaN(d.getTime())) return d
  }
  return null
}

function getInitials(name: string): string {
  if (!name) return 'IX'
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
}

function isVerifiedOrder(order: any): boolean {
  if (!order || typeof order !== 'object') return false
  if (order.is_deleted === true || order.is_cancelled === true) return false
  const status = (order.status || '').toLowerCase()
  const paymentStatus = (order.payment?.status || order.payment_status || '').toLowerCase()

  if (status.includes('cancel') || status.includes('refund') || status.includes('fail') || status.includes('stornier')) {
    return false
  }

  if (order.verified_server_side === true) return true
  if (paymentStatus === 'paid' || paymentStatus === 'completed') return true

  if (
    status === 'payment confirmed' ||
    status === 'courier assigned' ||
    status === 'in transit' ||
    status === 'shipped' ||
    status === 'delivered' ||
    status === 'completed' ||
    status.includes('paid')
  ) {
    return true
  }

  return false
}

function extractVerifiedSales(ordersList: any[] = [], paymentsList: any[] = []): VerifiedSale[] {
  const salesMap = new Map<string, VerifiedSale>()

  for (const order of ordersList) {
    if (!isVerifiedOrder(order)) continue

    const orderNumber = formatOrderSerialNumber(
      order.order_number || order.orderId || order.id
    )
    const date = parseOrderDate(order)
    if (!date) continue

    const amount = Number(order.total ?? order.amount ?? order.payment?.amount ?? 0)
    if (amount <= 0) continue

    const customerName =
      order.customer?.name || order.customer_name || order.payerName || 'Guest Customer'
    const customerEmail =
      order.customer?.email || order.customer_email || order.payerEmail || ''
    const customerPhone =
      order.customer?.phone || order.customer_phone || order.phone || ''
    const customerCountry =
      order.shipping?.country || order.shipping_country || order.country || 'Germany'
    const customerCity =
      order.shipping?.city || order.shipping_city || order.city || ''
    const customerAddress =
      order.shipping?.address || order.shipping_address || order.address || ''
    const currency = order.currency || 'INR'
    const status = order.status || 'Payment Confirmed'
    const paymentMethod =
      order.payment_method || order.paymentMethod || order.payment?.method || 'PayPal'

    // Extract itemized products
    let rawItems: any[] = []
    if (Array.isArray(order.items) && order.items.length > 0) {
      rawItems = order.items
    } else if (order.productName || order.product_name) {
      rawItems = [{
        name: order.productName || order.product_name,
        quantity: order.quantity || 1,
        unitPrice: order.unitPrice || order.price || amount,
        variant: order.variantName || order.variant || 'Standard Spec',
        partNumber: order.partNumber || order.sku || 'WST-APP',
      }]
    }

    const items: SaleItem[] = rawItems.map((it: any) => {
      const name = it.name || it.productName || it.title || 'IXOS Acoustic Component'
      const quantity = Math.max(1, Number(it.quantity || it.qty || 1))
      const unitPrice = Number(it.unitPrice || it.price || 0)
      const total = Number(it.total || it.amount || (unitPrice * quantity)) || (amount / Math.max(1, rawItems.length))
      const sku = it.partNumber || it.part_number || it.sku || it.id || 'WST-APP'
      const variant = it.variant || it.variantName || 'Standard Spec'
      return {
        id: it.id || sku,
        name,
        productName: name,
        sku,
        partNumber: sku,
        variant,
        quantity,
        unitPrice: unitPrice > 0 ? unitPrice : total / quantity,
        total,
      }
    })

    if (items.length === 0) {
      const fallbackName = order.productName || order.product_name || 'Wastram Apparel Product'
      items.push({
        id: order.productId || 'WST-APP',
        name: fallbackName,
        productName: fallbackName,
        sku: order.sku || 'WST-APP',
        partNumber: order.sku || 'WST-APP',
        variant: order.variantName || 'Standard Spec',
        quantity: 1,
        unitPrice: amount,
        total: amount,
      })
    }

    const key = orderNumber || order.id
    salesMap.set(key, {
      id: order.id || key,
      orderNumber: orderNumber || 'IXOS-Order',
      customerName,
      customerEmail,
      customerPhone,
      customerCountry,
      customerCity,
      customerAddress,
      amount,
      currency,
      date,
      status,
      paymentMethod,
      items,
      fallback: getInitials(customerName),
      avatar: order.avatar,
      rawOrder: order,
    })
  }

  for (const pay of paymentsList) {
    if (pay.is_deleted === true || pay.status === 'Cancelled' || pay.payment_status === 'Cancelled') continue
    const payStatus = (pay.payment_status || pay.status || '').toLowerCase()
    if (payStatus !== 'paid' && payStatus !== 'completed' && payStatus !== '') continue

    const orderNum = String(pay.order_number || pay.order_id || '')
    const txnId = String(pay.transaction_id || pay.id || '')

    let exists = false
    for (const [key, sale] of salesMap.entries()) {
      if (
        (orderNum && (sale.orderNumber === orderNum || key === orderNum)) ||
        (txnId && (key === txnId || sale.id === txnId))
      ) {
        exists = true
        break
      }
    }
    if (exists) continue

    const date = parseOrderDate(pay)
    if (!date) continue
    const amount = Number(pay.amount || 0)
    if (amount <= 0) continue

    const customerName = pay.customer_name || 'PayPal Customer'
    const customerEmail = pay.customer_email || ''
    const customerPhone = pay.customer_phone || pay.phone || ''
    const customerCountry = pay.customer_country || pay.country || 'Germany'
    const customerCity = pay.customer_city || pay.city || ''
    const customerAddress = pay.customer_address || pay.address || ''
    const currency = pay.currency || 'INR'
    const paymentMethod = 'PayPal'

    const payFallbackName = pay.product_name || pay.productName || pay.item_name || 'Wastram Apparel Product'
    const items: SaleItem[] = Array.isArray(pay.items) && pay.items.length > 0
      ? pay.items.map((it: any) => ({
          id: it.id || 'IX-ITEM',
          name: it.name || it.productName || payFallbackName,
          productName: it.name || it.productName || payFallbackName,
          sku: it.sku || it.partNumber || 'IX-ITEM',
          partNumber: it.partNumber || it.sku || 'IX-ITEM',
          variant: it.variant || it.variantName || 'Standard Spec',
          quantity: Number(it.quantity || 1),
          unitPrice: Number(it.unitPrice || it.price || amount),
          total: Number(it.total || amount),
        }))
      : [{
          id: pay.sku || 'IX-PAYPAL',
          name: payFallbackName,
          productName: payFallbackName,
          sku: pay.sku || 'IX-PAYPAL',
          partNumber: pay.sku || 'IX-PAYPAL',
          variant: pay.variantName || 'Standard Spec',
          quantity: Number(pay.quantity || 1),
          unitPrice: amount,
          total: amount,
        }]

    salesMap.set(txnId || `pay-${date.getTime()}`, {
      id: txnId || `pay-${date.getTime()}`,
      orderNumber: formatOrderSerialNumber(orderNum || txnId || `pay-${date.getTime()}`),
      customerName,
      customerEmail,
      customerPhone,
      customerCountry,
      customerCity,
      customerAddress,
      amount,
      currency,
      date,
      status: 'Paid',
      paymentMethod,
      items,
      fallback: getInitials(customerName),
      rawOrder: pay,
    })
  }

  return Array.from(salesMap.values()).sort((a, b) => b.date.getTime() - a.date.getTime())
}

function getFilterRange(
  period: FilterPeriod,
  customStart: string,
  customEnd: string
): { start: Date; end: Date } {
  const now = new Date()
  if (period === 'today') {
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)
    return { start, end }
  }
  if (period === 'yesterday') {
    const y = new Date(now)
    y.setDate(y.getDate() - 1)
    const start = new Date(y.getFullYear(), y.getMonth(), y.getDate(), 0, 0, 0, 0)
    const end = new Date(y.getFullYear(), y.getMonth(), y.getDate(), 23, 59, 59, 999)
    return { start, end }
  }
  if (period === 'last_7_days') {
    const start = new Date(now)
    start.setDate(start.getDate() - 6)
    start.setHours(0, 0, 0, 0)
    const end = new Date(now)
    end.setHours(23, 59, 59, 999)
    return { start, end }
  }
  if (period === 'this_month') {
    const start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0)
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)
    return { start, end }
  }
  if (period === 'last_month') {
    const start = new Date(now)
    start.setDate(start.getDate() - 29)
    start.setHours(0, 0, 0, 0)
    const end = new Date(now)
    end.setHours(23, 59, 59, 999)
    return { start, end }
  }
  if (period === 'last_6_months') {
    const start = new Date(now.getFullYear(), now.getMonth() - 5, 1, 0, 0, 0, 0)
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)
    return { start, end }
  }
  if (period === 'custom') {
    const s = customStart ? new Date(customStart + 'T00:00:00') : new Date(now.getTime() - 30 * 86400000)
    const e = customEnd ? new Date(customEnd + 'T23:59:59.999') : new Date(now)
    return {
      start: isNaN(s.getTime()) ? new Date(now.getTime() - 30 * 86400000) : s,
      end: isNaN(e.getTime()) ? new Date(now) : e,
    }
  }
  return { start: new Date(0), end: now }
}

function getPreviousFilterRange(
  period: FilterPeriod,
  customStart: string,
  customEnd: string
): { start: Date; end: Date; label: string } {
  const now = new Date()
  if (period === 'today') {
    const y = new Date(now)
    y.setDate(y.getDate() - 1)
    const start = new Date(y.getFullYear(), y.getMonth(), y.getDate(), 0, 0, 0, 0)
    const end = new Date(y.getFullYear(), y.getMonth(), y.getDate(), 23, 59, 59, 999)
    return { start, end, label: 'yesterday' }
  }
  if (period === 'yesterday') {
    const dby = new Date(now)
    dby.setDate(dby.getDate() - 2)
    const start = new Date(dby.getFullYear(), dby.getMonth(), dby.getDate(), 0, 0, 0, 0)
    const end = new Date(dby.getFullYear(), dby.getMonth(), dby.getDate(), 23, 59, 59, 999)
    return { start, end, label: 'Vortag' }
  }
  if (period === 'last_7_days') {
    const start = new Date(now)
    start.setDate(start.getDate() - 13)
    start.setHours(0, 0, 0, 0)
    const end = new Date(now)
    end.setDate(end.getDate() - 7)
    end.setHours(23, 59, 59, 999)
    return { start, end, label: 'previous 7 days' }
  }
  if (period === 'this_month') {
    const start = new Date(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0, 0)
    const end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999)
    return { start, end, label: 'last month' }
  }
  if (period === 'last_month') {
    const start = new Date(now.getFullYear(), now.getMonth() - 2, 1, 0, 0, 0, 0)
    const end = new Date(now.getFullYear(), now.getMonth() - 1, 0, 23, 59, 59, 999)
    return { start, end, label: 'previous month' }
  }
  if (period === 'last_6_months') {
    const start = new Date(now.getFullYear(), now.getMonth() - 11, 1, 0, 0, 0, 0)
    const end = new Date(now.getFullYear(), now.getMonth() - 5, 0, 23, 59, 59, 999)
    return { start, end, label: 'previous 6 months' }
  }
  if (period === 'custom') {
    const curRange = getFilterRange(period, customStart, customEnd)
    const diffMs = Math.max(86400000, curRange.end.getTime() - curRange.start.getTime())
    const start = new Date(curRange.start.getTime() - diffMs)
    const end = new Date(curRange.start.getTime() - 1)
    return { start, end, label: 'vorheriger Zeitraum' }
  }
  return { start: new Date(0), end: new Date(0), label: 'vorheriger Zeitraum' }
}

function calculatePercentageChange(current: number, previous: number): {
  percent: number
  formatted: string
  direction: 'increase' | 'decrease' | 'neutral'
} {
  if (previous === 0) {
    if (current > 0) {
      return { percent: 100, formatted: '+100.0%', direction: 'increase' }
    }
    return { percent: 0, formatted: '+0.0%', direction: 'neutral' }
  }

  const change = ((current - previous) / previous) * 100
  if (Math.abs(change) < 0.05) {
    return { percent: 0, formatted: '+0.0%', direction: 'neutral' }
  }
  if (change > 0) {
    return { percent: change, formatted: `+${change.toFixed(1)}%`, direction: 'increase' }
  }
  return { percent: change, formatted: `${change.toFixed(1)}%`, direction: 'decrease' }
}

function getTooltipDescription(
  change: { percent: number; formatted: string; direction: 'increase' | 'decrease' | 'neutral' },
  metricType: 'revenue' | 'sales' | 'aov' | 'customers',
  prevPeriodLabel: string
): string {
  const percentVal = Math.abs(change.percent)
  const percentStr =
    percentVal % 1 === 0 ? `${percentVal.toFixed(0)}%` : `${percentVal.toFixed(1)}%`
  const label = prevPeriodLabel || 'vorheriger Zeitraum'

  if (change.direction === 'neutral') {
    switch (metricType) {
      case 'revenue':
        return `Equal revenue compared to ${label}`
      case 'sales':
        return `Equal sales volume compared to ${label}`
      case 'aov':
        return `Equal average order value compared to ${label}`
      case 'customers':
        return `Equal customer count compared to ${label}`
    }
  }

  const isIncrease = change.direction === 'increase'

  switch (metricType) {
    case 'revenue':
      return isIncrease
        ? `${percentStr} higher revenue than ${label}`
        : `${percentStr} lower revenue than ${label}`
    case 'sales':
      return isIncrease
        ? `${percentStr} more orders than ${label}`
        : `${percentStr} fewer orders than ${label}`
    case 'aov':
      return isIncrease
        ? `${percentStr} higher average order value than ${label}`
        : `${percentStr} lower average order value than ${label}`
    case 'customers':
      return isIncrease
        ? `${percentStr} more customers than ${label}`
        : `${percentStr} fewer customers than ${label}`
  }
}

function formatRelativeTime(date: Date): string {
  const now = Date.now()
  const diffMs = Math.max(0, now - date.getTime())
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 2) return 'Gerade eben'
  if (diffMins < 60) return `vor ${diffMins} Min.`
  if (diffHours < 24) return `vor ${diffHours} Std.`
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `vor ${diffDays} Tagen`
  return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
}

interface ChartBucket {
  name: string
  tooltipLabel: string
  total: number
  count: number
}

const MONTH_NAMES = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez']
const FULL_MONTH_NAMES = [
  'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
]
const DAY_NAMES = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']
const FULL_DAY_NAMES = [
  'Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'
]

function generateChartData(
  period: FilterPeriod,
  sales: VerifiedSale[],
  range: { start: Date; end: Date }
): ChartBucket[] {
  const { start, end } = range
  const salesInRange = sales.filter((s) => s.date >= start && s.date <= end)
  const adminTz = getAdminTimeZone()
  const tzAbbr = getTimeZoneAbbreviation(new Date(), adminTz)

  // 1. TODAY (Hours of today in admin's local timezone)
  if (period === 'today') {
    const hours = [
      { name: '00:00', full: `Today, 00:00 – 03:00 (${tzAbbr})`, startH: 0, endH: 3 },
      { name: '03:00', full: `Today, 03:00 – 06:00 (${tzAbbr})`, startH: 3, endH: 6 },
      { name: '06:00', full: `Today, 06:00 – 09:00 (${tzAbbr})`, startH: 6, endH: 9 },
      { name: '09:00', full: `Today, 09:00 – 12:00 (${tzAbbr})`, startH: 9, endH: 12 },
      { name: '12:00', full: `Today, 12:00 – 15:00 (${tzAbbr})`, startH: 12, endH: 15 },
      { name: '15:00', full: `Today, 15:00 – 18:00 (${tzAbbr})`, startH: 15, endH: 18 },
      { name: '18:00', full: `Today, 18:00 – 21:00 (${tzAbbr})`, startH: 18, endH: 21 },
      { name: '21:00', full: `Today, 21:00 – 24:00 (${tzAbbr})`, startH: 21, endH: 24 },
    ]
    return hours.map((h) => {
      const matching = salesInRange.filter((s) => {
        const hour = getAdminLocalHour(s.date, adminTz)
        return hour >= h.startH && hour < h.endH
      })
      const total = matching.reduce((sum, s) => sum + s.amount, 0)
      return {
        name: h.name,
        tooltipLabel: h.full,
        total: Math.round(total * 100) / 100,
        count: matching.length,
      }
    })
  }

  // 2. YESTERDAY (Hours of yesterday in admin's local timezone)
  if (period === 'yesterday') {
    const hours = [
      { name: '00:00', full: `Yesterday, 00:00 – 03:00 (${tzAbbr})`, startH: 0, endH: 3 },
      { name: '03:00', full: `Yesterday, 03:00 – 06:00 (${tzAbbr})`, startH: 3, endH: 6 },
      { name: '06:00', full: `Yesterday, 06:00 – 09:00 (${tzAbbr})`, startH: 6, endH: 9 },
      { name: '09:00', full: `Yesterday, 09:00 – 12:00 (${tzAbbr})`, startH: 9, endH: 12 },
      { name: '12:00', full: `Yesterday, 12:00 – 15:00 (${tzAbbr})`, startH: 12, endH: 15 },
      { name: '15:00', full: `Yesterday, 15:00 – 18:00 (${tzAbbr})`, startH: 15, endH: 18 },
      { name: '18:00', full: `Yesterday, 18:00 – 21:00 (${tzAbbr})`, startH: 18, endH: 21 },
      { name: '21:00', full: `Yesterday, 21:00 – 24:00 (${tzAbbr})`, startH: 21, endH: 24 },
    ]
    return hours.map((h) => {
      const matching = salesInRange.filter((s) => {
        const hour = getAdminLocalHour(s.date, adminTz)
        return hour >= h.startH && hour < h.endH
      })
      const total = matching.reduce((sum, s) => sum + s.amount, 0)
      return {
        name: h.name,
        tooltipLabel: h.full,
        total: Math.round(total * 100) / 100,
        count: matching.length,
      }
    })
  }

  // 3. LAST 7 DAYS (Daily Breakdown with Weekday, Month, Day)
  if (period === 'last_7_days') {
    const buckets: ChartBucket[] = []
    for (let i = 0; i < 7; i++) {
      const d = new Date(start)
      d.setDate(d.getDate() + i)
      const dStart = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0)
      const dEnd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999)

      const matching = salesInRange.filter((s) => s.date >= dStart && s.date <= dEnd)
      const total = matching.reduce((sum, s) => sum + s.amount, 0)

      const dayName = DAY_NAMES[d.getDay()]
      const monthName = MONTH_NAMES[d.getMonth()]
      const dayNum = d.getDate()
      const formattedName = `${dayName}, ${monthName} ${dayNum}`
      const fullDate = `${FULL_DAY_NAMES[d.getDay()]}, ${MONTH_NAMES[d.getMonth()]} ${dayNum}, ${d.getFullYear()}`

      buckets.push({
        name: formattedName,
        tooltipLabel: fullDate,
        total: Math.round(total * 100) / 100,
        count: matching.length,
      })
    }
    return buckets
  }

  // 4. THIS MONTH (Weekly Intervals across current month)
  if (period === 'this_month') {
    const buckets: ChartBucket[] = []
    const daysInMonth = new Date(start.getFullYear(), start.getMonth() + 1, 0).getDate()
    const weekDurations = [7, 7, 7, Math.max(1, daysInMonth - 21)]
    let cur = new Date(start)

    for (let i = 0; i < weekDurations.length; i++) {
      const wStart = new Date(cur)
      const wEnd = new Date(cur)
      wEnd.setDate(wEnd.getDate() + (weekDurations[i] - 1))
      wEnd.setHours(23, 59, 59, 999)
      if (wEnd > end) wEnd.setTime(end.getTime())

      const matching = salesInRange.filter((s) => s.date >= wStart && s.date <= wEnd)
      const total = matching.reduce((sum, s) => sum + s.amount, 0)

      const sm = MONTH_NAMES[wStart.getMonth()]
      const sDay = wStart.getDate()
      const eDay = wEnd.getDate()

      const label = `${sm} ${sDay}–${eDay}`
      const tooltip = `Week ${i + 1}: ${sm} ${sDay} – ${eDay}, ${wEnd.getFullYear()}`

      buckets.push({
        name: label,
        tooltipLabel: tooltip,
        total: Math.round(total * 100) / 100,
        count: matching.length,
      })

      cur = new Date(wEnd)
      cur.setDate(cur.getDate() + 1)
      cur.setHours(0, 0, 0, 0)
    }
    return buckets
  }

  // 5. LAST MONTH (4 Weekly Intervals across the month)
  if (period === 'last_month') {
    const buckets: ChartBucket[] = []
    const weekDurations = [7, 7, 7, 9]
    let cur = new Date(start)

    for (let i = 0; i < weekDurations.length; i++) {
      const wStart = new Date(cur)
      const wEnd = new Date(cur)
      wEnd.setDate(wEnd.getDate() + (weekDurations[i] - 1))
      wEnd.setHours(23, 59, 59, 999)
      if (wEnd > end) wEnd.setTime(end.getTime())

      const matching = salesInRange.filter((s) => s.date >= wStart && s.date <= wEnd)
      const total = matching.reduce((sum, s) => sum + s.amount, 0)

      const sm = MONTH_NAMES[wStart.getMonth()]
      const em = MONTH_NAMES[wEnd.getMonth()]
      const sDay = wStart.getDate()
      const eDay = wEnd.getDate()

      const label = sm === em ? `${sm} ${sDay}–${eDay}` : `${sm} ${sDay} – ${em} ${eDay}`
      const tooltip = `Week ${i + 1}: ${sm} ${sDay} – ${em} ${eDay}, ${wEnd.getFullYear()}`

      buckets.push({
        name: label,
        tooltipLabel: tooltip,
        total: Math.round(total * 100) / 100,
        count: matching.length,
      })

      cur = new Date(wEnd)
      cur.setDate(cur.getDate() + 1)
      cur.setHours(0, 0, 0, 0)
    }
    return buckets
  }

  // 5. LAST 6 MONTHS (Monthly bars with Month & Year)
  if (period === 'last_6_months') {
    const buckets: ChartBucket[] = []
    const now = new Date()
    for (let i = 5; i >= 0; i--) {
      const mDate = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const mStart = new Date(mDate.getFullYear(), mDate.getMonth(), 1, 0, 0, 0)
      const mEnd = new Date(mDate.getFullYear(), mDate.getMonth() + 1, 0, 23, 59, 59, 999)

      const matching = salesInRange.filter((s) => s.date >= mStart && s.date <= mEnd)
      const total = matching.reduce((sum, s) => sum + s.amount, 0)

      const monthName = MONTH_NAMES[mDate.getMonth()]
      const fullMonth = FULL_MONTH_NAMES[mDate.getMonth()]
      const year = mDate.getFullYear()

      buckets.push({
        name: `${monthName} ${year}`,
        tooltipLabel: `${fullMonth} ${year}`,
        total: Math.round(total * 100) / 100,
        count: matching.length,
      })
    }
    return buckets
  }

  // 6. CUSTOM DATE
  if (period === 'custom') {
    const diffDays = Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)))

    // 1-2 Days: Hourly Breakdown
    if (diffDays <= 2) {
      const hours = [
        { name: '00:00', startH: 0, endH: 3 },
        { name: '03:00', startH: 3, endH: 6 },
        { name: '06:00', startH: 6, endH: 9 },
        { name: '09:00', startH: 9, endH: 12 },
        { name: '12:00', startH: 12, endH: 15 },
        { name: '15:00', startH: 15, endH: 18 },
        { name: '18:00', startH: 18, endH: 21 },
        { name: '21:00', startH: 21, endH: 24 },
      ]
      return hours.map((h) => {
        const matching = salesInRange.filter((s) => {
          const hour = getAdminLocalHour(s.date, adminTz)
          return hour >= h.startH && hour < h.endH
        })
        const total = matching.reduce((sum, s) => sum + s.amount, 0)
        return {
          name: h.name,
          tooltipLabel: `${h.name} (${matching.length} ${matching.length === 1 ? 'Order' : 'Orders'})`,
          total: Math.round(total * 100) / 100,
          count: matching.length,
        }
      })
    }

    // 3-10 Days: Daily breakdown with Day Name & Date
    if (diffDays <= 10) {
      const buckets: ChartBucket[] = []
      for (let i = 0; i < diffDays; i++) {
        const d = new Date(start)
        d.setDate(d.getDate() + i)
        const dStart = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0)
        const dEnd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999)

        const matching = salesInRange.filter((s) => s.date >= dStart && s.date <= dEnd)
        const total = matching.reduce((sum, s) => sum + s.amount, 0)

        const dayName = DAY_NAMES[d.getDay()]
        const monthName = MONTH_NAMES[d.getMonth()]
        const dayNum = d.getDate()

        buckets.push({
          name: `${dayName}, ${monthName} ${dayNum}`,
          tooltipLabel: `${FULL_DAY_NAMES[d.getDay()]}, ${MONTH_NAMES[d.getMonth()]} ${dayNum}, ${d.getFullYear()}`,
          total: Math.round(total * 100) / 100,
          count: matching.length,
        })
      }
      return buckets
    }

    // 11-35 Days: Weekly intervals
    const numBuckets = Math.min(5, Math.ceil(diffDays / 7))
    const step = Math.ceil(diffDays / numBuckets)
    const buckets: ChartBucket[] = []
    let cur = new Date(start)

    for (let i = 0; i < numBuckets; i++) {
      const bStart = new Date(cur)
      const bEnd = new Date(cur)
      bEnd.setDate(bEnd.getDate() + (step - 1))
      bEnd.setHours(23, 59, 59, 999)
      if (bEnd > end) bEnd.setTime(end.getTime())
      if (bStart > end) break

      const matching = salesInRange.filter((s) => s.date >= bStart && s.date <= bEnd)
      const total = matching.reduce((sum, s) => sum + s.amount, 0)

      const sm = MONTH_NAMES[bStart.getMonth()]
      const em = MONTH_NAMES[bEnd.getMonth()]
      const label = sm === em ? `${sm} ${bStart.getDate()}–${bEnd.getDate()}` : `${sm} ${bStart.getDate()} – ${em} ${bEnd.getDate()}`

      buckets.push({
        name: label,
        tooltipLabel: `${sm} ${bStart.getDate()} – ${em} ${bEnd.getDate()}, ${bEnd.getFullYear()}`,
        total: Math.round(total * 100) / 100,
        count: matching.length,
      })

      cur = new Date(bEnd)
      cur.setDate(cur.getDate() + 1)
      cur.setHours(0, 0, 0, 0)
    }
    return buckets
  }

  return []
}

function CustomChartTooltip({ active, payload, label, currencySymbol = '₹' }: any) {
  if (active && payload && payload.length) {
    const item = payload[0].payload
    return (
      <div className='rounded-xl border border-border bg-popover/95 backdrop-blur-md p-3 shadow-lg text-xs space-y-1.5 min-w-[180px]'>
        <div className='font-semibold text-foreground text-xs pb-1 border-b border-border/50 flex items-center justify-between'>
          <span>{item.tooltipLabel || label}</span>
          <span className='text-[10px] text-muted-foreground font-normal'>Verifiziert</span>
        </div>
        <div className='flex items-center justify-between gap-3 pt-0.5'>
          <span className='text-muted-foreground'>Sales Volume:</span>
          <span className='font-bold text-[#007934] dark:text-[#22c55e] tabular-nums'>
            {currencySymbol}
            {Number(item.total || 0).toLocaleString('en-IN', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>
        <div className='flex items-center justify-between gap-3'>
          <span className='text-muted-foreground'>Orders:</span>
          <span className='font-semibold text-foreground tabular-nums'>
            {item.count || 0} {item.count === 1 ? 'Order' : 'Orders'}
          </span>
        </div>
      </div>
    )
  }
  return null
}

export function DashboardView({
  onSelectTab,
  onSelectOrder,
  onLogout,
  orders: externalOrders,
  payments: externalPayments,
  isLoading: externalLoading,
  onRefresh,
  onOrdersLoaded,
  initialSubTab,
}: DashboardViewProps) {
  const [internalOrders, setInternalOrders] = useState<any[]>([])
  const [internalPayments, setInternalPayments] = useState<any[]>([])
  const [internalLoading, setInternalLoading] = useState(false)

  // Period filter state - default is 'last_7_days', persisted in localStorage
  const [period, setPeriodState] = useState<FilterPeriod>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('ixos_admin_dashboard_period')
        if (
          saved &&
          (saved === 'today' ||
            saved === 'yesterday' ||
            saved === 'last_7_days' ||
            saved === 'this_month' ||
            saved === 'last_month' ||
            saved === 'last_6_months' ||
            saved === 'custom')
        ) {
          return saved as FilterPeriod
        }
      } catch {}
    }
    return 'last_7_days'
  })

  const setPeriod = useCallback((newPeriod: FilterPeriod) => {
    setPeriodState(newPeriod)
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('ixos_admin_dashboard_period', newPeriod)
      } catch {}
    }
  }, [])

  const [customStartDate, setCustomStartDateState] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('ixos_admin_dashboard_custom_start')
        if (saved) return saved
      } catch {}
    }
    const d = new Date()
    d.setDate(d.getDate() - 30)
    return getAdminLocalDateString(d, getAdminTimeZone())
  })

  const setCustomStartDate = useCallback((val: string) => {
    setCustomStartDateState(val)
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('ixos_admin_dashboard_custom_start', val)
      } catch {}
    }
  }, [])

  const [customEndDate, setCustomEndDateState] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('ixos_admin_dashboard_custom_end')
        if (saved) return saved
      } catch {}
    }
    return getAdminTodayDateString(getAdminTimeZone())
  })

  const setCustomEndDate = useCallback((val: string) => {
    setCustomEndDateState(val)
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('ixos_admin_dashboard_custom_end', val)
      } catch {}
    }
  }, [])

  // Self-fetch if external orders are not provided
  useEffect(() => {
    if (!externalOrders || externalOrders.length === 0) {
      let isMounted = true
      setInternalLoading(true)
      const token = typeof window !== 'undefined' ? sessionStorage.getItem('ixos_admin_token') : null
      const headers: Record<string, string> = { 'x-admin-session': 'active' }
      if (token) {
        headers['x-admin-token'] = token
        headers['Authorization'] = `Bearer ${token}`
      }
      Promise.all([
        fetch('/api/orders?limit=200&t=' + Date.now(), { credentials: 'include', headers })
          .then((r) => (r.ok ? r.json() : []))
          .catch(() => []),
        fetch('/api/payments?t=' + Date.now(), { credentials: 'include', headers })
          .then((r) => (r.ok ? r.json() : []))
          .catch(() => []),
      ])
        .then(([ordData, payData]) => {
          if (isMounted) {
            if (Array.isArray(ordData)) {
              setInternalOrders(ordData)
              onOrdersLoaded?.(ordData)
            }
            if (Array.isArray(payData)) setInternalPayments(payData)
          }
        })
        .finally(() => {
          if (isMounted) setInternalLoading(false)
        })
      return () => {
        isMounted = false
      }
    }
  }, [externalOrders, onOrdersLoaded])

  const orders = externalOrders && externalOrders.length > 0 ? externalOrders : internalOrders
  const payments = externalPayments && externalPayments.length > 0 ? externalPayments : internalPayments
  const loading = externalLoading || internalLoading

  // Extract all real verified sales
  const verifiedSales = useMemo(() => {
    return extractVerifiedSales(orders, payments)
  }, [orders, payments])

  // Detect store currency - IXOS operates in Germany, strictly default to EUR (€)
  const currencySymbol = useMemo(() => {
    const nonEur = verifiedSales.find((s) => {
      const c = (s.currency || '').toUpperCase()
      return c && c !== 'EUR'
    })
    if (nonEur) {
      const c = (nonEur.currency || '').toUpperCase()
      if (c === 'USD') return '$'
      if (c === 'GBP') return '£'
      if (c === 'CHF') return 'CHF'
    }
    return '€'
  }, [verifiedSales])

  // Filter range
  const filterRange = useMemo(() => {
    return getFilterRange(period, customStartDate, customEndDate)
  }, [period, customStartDate, customEndDate])

  // Sales in the selected period (drives all cards and charts)
  const salesInPeriod = useMemo(() => {
    return verifiedSales.filter((s) => s.date >= filterRange.start && s.date <= filterRange.end)
  }, [verifiedSales, filterRange])

  const filteredRevenue = useMemo(() => {
    return salesInPeriod.reduce((sum, s) => sum + s.amount, 0)
  }, [salesInPeriod])

  const filteredSalesCount = salesInPeriod.length

  const periodAverageOrderValue = useMemo(() => {
    return filteredSalesCount > 0 ? filteredRevenue / filteredSalesCount : 0
  }, [filteredSalesCount, filteredRevenue])

  const periodUniqueCustomersCount = useMemo(() => {
    const emails = new Set(
      salesInPeriod.map((s) => s.customerEmail.toLowerCase().trim()).filter(Boolean)
    )
    return emails.size
  }, [salesInPeriod])

  const activePeriodLabel = useMemo(() => {
    const opt = FILTER_OPTIONS.find((f) => f.id === period)
    return opt ? opt.label : 'Selected Period'
  }, [period])

  // Previous Period Range and Calculations for % Increase / % Decrease
  const prevFilterRange = useMemo(() => {
    return getPreviousFilterRange(period, customStartDate, customEndDate)
  }, [period, customStartDate, customEndDate])

  const prevSalesInPeriod = useMemo(() => {
    return verifiedSales.filter((s) => s.date >= prevFilterRange.start && s.date <= prevFilterRange.end)
  }, [verifiedSales, prevFilterRange])

  const prevRevenue = useMemo(() => {
    return prevSalesInPeriod.reduce((sum, s) => sum + s.amount, 0)
  }, [prevSalesInPeriod])

  const prevSalesCount = prevSalesInPeriod.length

  const prevAverageOrderValue = useMemo(() => {
    return prevSalesCount > 0 ? prevRevenue / prevSalesCount : 0
  }, [prevSalesCount, prevRevenue])

  const prevUniqueCustomersCount = useMemo(() => {
    const emails = new Set(
      prevSalesInPeriod.map((s) => s.customerEmail.toLowerCase().trim()).filter(Boolean)
    )
    return emails.size
  }, [prevSalesInPeriod])

  // % Changes from Previous Period
  const revenueChange = useMemo(() => {
    return calculatePercentageChange(filteredRevenue, prevRevenue)
  }, [filteredRevenue, prevRevenue])

  const salesCountChange = useMemo(() => {
    return calculatePercentageChange(filteredSalesCount, prevSalesCount)
  }, [filteredSalesCount, prevSalesCount])

  const aovChange = useMemo(() => {
    return calculatePercentageChange(periodAverageOrderValue, prevAverageOrderValue)
  }, [periodAverageOrderValue, prevAverageOrderValue])

  const customersChange = useMemo(() => {
    return calculatePercentageChange(periodUniqueCustomersCount, prevUniqueCustomersCount)
  }, [periodUniqueCustomersCount, prevUniqueCustomersCount])

  // Contextual Tooltip Descriptions on Hover for % changes
  const revenueTooltip = useMemo(() => {
    return getTooltipDescription(revenueChange, 'revenue', prevFilterRange.label)
  }, [revenueChange, prevFilterRange.label])

  const salesTooltip = useMemo(() => {
    return getTooltipDescription(salesCountChange, 'sales', prevFilterRange.label)
  }, [salesCountChange, prevFilterRange.label])

  const aovTooltip = useMemo(() => {
    return getTooltipDescription(aovChange, 'aov', prevFilterRange.label)
  }, [aovChange, prevFilterRange.label])

  const customersTooltip = useMemo(() => {
    return getTooltipDescription(customersChange, 'customers', prevFilterRange.label)
  }, [customersChange, prevFilterRange.label])

  // Controlled active subtab state (overview | analytics | reports | notifications)
  const [subTab, setSubTab] = useState<DashboardSubTab>(() => {
    if (initialSubTab) return initialSubTab
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const param = urlParams.get('subtab') || urlParams.get('tab')
      if (param === 'overview' || param === 'analytics' || param === 'reports' || param === 'notifications') {
        return param as DashboardSubTab
      }
      const hash = window.location.hash.replace('#', '')
      if (hash === 'overview' || hash === 'analytics' || hash === 'reports' || hash === 'notifications') {
        return hash as DashboardSubTab
      }
    }
    return 'overview'
  })

  useEffect(() => {
    if (initialSubTab && initialSubTab !== subTab) {
      setSubTab(initialSubTab)
    }
  }, [initialSubTab])

  const handleSubTabChange = useCallback((newTab: string) => {
    const valid = newTab as DashboardSubTab
    setSubTab(valid)
    if (typeof window !== 'undefined') {
      try {
        const url = new URL(window.location.href)
        url.searchParams.set('subtab', valid)
        window.history.replaceState(null, '', url.toString())
      } catch {}
    }
  }, [])

  // Reports helper calculations
  const shippedOrDeliveredCount = useMemo(() => {
    return salesInPeriod.filter(
      (s) => s.status.toLowerCase() === 'shipped' || s.status.toLowerCase() === 'delivered'
    ).length
  }, [salesInPeriod])

  const inTransitOrAssignedCount = useMemo(() => {
    return salesInPeriod.filter(
      (s) =>
        s.status.toLowerCase().includes('transit') ||
        s.status.toLowerCase().includes('courier') ||
        s.status.toLowerCase().includes('confirmed') ||
        s.status.toLowerCase().includes('paid')
    ).length
  }, [salesInPeriod])

  const fulfillmentRate = useMemo(() => {
    if (filteredSalesCount === 0) return 100
    return Math.round((shippedOrDeliveredCount / filteredSalesCount) * 100)
  }, [shippedOrDeliveredCount, filteredSalesCount])

  const estimatedNetRevenue = useMemo(() => {
    if (filteredRevenue <= 0) return 0
    const fee = filteredRevenue * 0.029 + filteredSalesCount * 0.3
    return Math.max(0, filteredRevenue - fee)
  }, [filteredRevenue, filteredSalesCount])

  // Active table view in Reports tab: 'sales' | 'customers' | 'products'
  const [reportTableTab, setReportTableTab] = useState<'sales' | 'customers' | 'products'>('sales')
  const [reportSearchQuery, setReportSearchQuery] = useState('')

  // 1. Aggregated Customers in active period
  const periodCustomers = useMemo(() => {
    const map = new Map<string, {
      email: string
      name: string
      phone: string
      country: string
      city: string
      address: string
      ordersCount: number
      totalSpent: number
      currency: string
      latestOrderNumber: string
      latestOrderDate: Date
      statuses: string[]
    }>()

    for (const sale of salesInPeriod) {
      const email = sale.customerEmail.toLowerCase().trim() || `anon-${sale.orderNumber}`
      const existing = map.get(email)
      if (existing) {
        existing.ordersCount += 1
        existing.totalSpent += sale.amount
        if (sale.date > existing.latestOrderDate) {
          existing.latestOrderDate = sale.date
          existing.latestOrderNumber = sale.orderNumber
        }
        if (sale.customerPhone && (!existing.phone || existing.phone === '–')) existing.phone = sale.customerPhone
        if (sale.customerCountry && existing.country === 'India') existing.country = sale.customerCountry
        if (!existing.statuses.includes(sale.status)) existing.statuses.push(sale.status)
      } else {
        map.set(email, {
          email: sale.customerEmail || 'Guest Account',
          name: sale.customerName,
          phone: sale.customerPhone || '–',
          country: sale.customerCountry || 'India',
          city: sale.customerCity || '–',
          address: sale.customerAddress || '–',
          ordersCount: 1,
          totalSpent: sale.amount,
          currency: sale.currency,
          latestOrderNumber: sale.orderNumber,
          latestOrderDate: sale.date,
          statuses: [sale.status],
        })
      }
    }

    return Array.from(map.values()).sort((a, b) => b.totalSpent - a.totalSpent)
  }, [salesInPeriod])

  // 2. Aggregated Products Sold in active period
  const periodProductsSold = useMemo(() => {
    const map = new Map<string, {
      sku: string
      name: string
      variant: string
      unitsSold: number
      totalRevenue: number
      currency: string
      orderNumbers: string[]
      latestOrderDate: Date
    }>()

    for (const sale of salesInPeriod) {
      const items = (sale.items && sale.items.length > 0) ? sale.items : [{
        name: 'Wastram Apparel Product',
        productName: 'Wastram Apparel Product',
        sku: 'WST-APP',
        partNumber: 'WST-APP',
        variant: 'Standard Spec',
        quantity: 1,
        unitPrice: sale.amount,
        total: sale.amount,
      }]

      for (const item of items) {
        const skuKey = (item.sku || item.partNumber || item.name).toLowerCase().trim()
        const existing = map.get(skuKey)
        const qty = item.quantity || 1
        const itemRev = item.total || (item.unitPrice ? item.unitPrice * qty : sale.amount / items.length)

        if (existing) {
          existing.unitsSold += qty
          existing.totalRevenue += itemRev
          if (!existing.orderNumbers.includes(sale.orderNumber)) {
            existing.orderNumbers.push(sale.orderNumber)
          }
          if (sale.date > existing.latestOrderDate) {
            existing.latestOrderDate = sale.date
          }
        } else {
          map.set(skuKey, {
            sku: item.sku || item.partNumber || 'WST-APP',
            name: item.name || item.productName || 'Wastram Handcrafted Apparel',
            variant: item.variant || 'Standard Spec',
            unitsSold: qty,
            totalRevenue: itemRev,
            currency: sale.currency,
            orderNumbers: [sale.orderNumber],
            latestOrderDate: sale.date,
          })
        }
      }
    }

    return Array.from(map.values()).sort((a, b) => b.unitsSold - a.unitsSold)
  }, [salesInPeriod])

  const periodTotalUnitsSold = useMemo(() => {
    return periodProductsSold.reduce((sum, p) => sum + p.unitsSold, 0)
  }, [periodProductsSold])

  const periodUniqueProductsSold = periodProductsSold.length

  const periodTopSellingProduct = useMemo(() => {
    return periodProductsSold[0] || null
  }, [periodProductsSold])

  const periodUniqueCountriesCount = useMemo(() => {
    const countries = new Set(salesInPeriod.map((s) => s.customerCountry || 'India'))
    return Math.max(1, countries.size)
  }, [salesInPeriod])

  // Filtered lists for the audit table search
  const filteredReportSales = useMemo(() => {
    if (!reportSearchQuery.trim()) return salesInPeriod
    const q = reportSearchQuery.toLowerCase().trim()
    return salesInPeriod.filter(
      (s) =>
        s.orderNumber.toLowerCase().includes(q) ||
        s.customerName.toLowerCase().includes(q) ||
        s.customerEmail.toLowerCase().includes(q) ||
        s.status.toLowerCase().includes(q)
    )
  }, [salesInPeriod, reportSearchQuery])

  const filteredReportCustomers = useMemo(() => {
    if (!reportSearchQuery.trim()) return periodCustomers
    const q = reportSearchQuery.toLowerCase().trim()
    return periodCustomers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q)
    )
  }, [periodCustomers, reportSearchQuery])

  const filteredReportProducts = useMemo(() => {
    if (!reportSearchQuery.trim()) return periodProductsSold
    const q = reportSearchQuery.toLowerCase().trim()
    return periodProductsSold.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.variant.toLowerCase().includes(q)
    )
  }, [periodProductsSold, reportSearchQuery])

  // Download Sales Data CSV (filtered according to time period)
  const handleDownloadSalesReport = useCallback(() => {
    if (salesInPeriod.length === 0) {
      alert(`No sales data available for ${activePeriodLabel}. Please select another time period.`)
      return
    }
    const headers = [
      'Bestellnummer',
      'Datum',
      'Uhrzeit',
      'Customer Name',
      'E-Mail-Adresse',
      'Telefonnummer',
      'Lieferland',
      'Lieferstadt',
      'Lieferadresse',
      'Bruttobetrag',
      'Währung',
      'Zahlungsmethode',
      'Zahlungsstatus',
      'Erfüllungsstatus',
      'Anzahl Artikel',
      'Artikelübersicht',
      'Zeitraumfilter',
    ]
    const rows = salesInPeriod.map((s) => {
      const itemsSummary = (s.items || [])
        .map((it) => `${it.name} (x${it.quantity})`)
        .join('; ') || 'Standard-Komponente'
      const dt = formatAdminOrderDateTime(s.date)
      const dateStr = dt.date
      const timeStr = dt.time
      return [
        `"${s.orderNumber}"`,
        `"${dateStr}"`,
        `"${timeStr}"`,
        `"${s.customerName.replace(/"/g, '""')}"`,
        `"${s.customerEmail.replace(/"/g, '""')}"`,
        `"${(s.customerPhone || '').replace(/"/g, '""')}"`,
        `"${(s.customerCountry || 'Deutschland').replace(/"/g, '""')}"`,
        `"${(s.customerCity || '').replace(/"/g, '""')}"`,
        `"${(s.customerAddress || '').replace(/"/g, '""')}"`,
        s.amount.toFixed(2),
        `"${s.currency}"`,
        `"${s.paymentMethod || 'PayPal'}"`,
        '"Bezahlt"',
        `"${s.status}"`,
        String(s.items?.reduce((acc, it) => acc + (it.quantity || 1), 0) || 1),
        `"${itemsSummary.replace(/"/g, '""')}"`,
        `"${activePeriodLabel}"`,
      ]
    })
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute(
      'download',
      `ixos-verkaeufe-${period}-${new Date().toISOString().slice(0, 10)}.csv`
    )
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, [salesInPeriod, activePeriodLabel, period])

  // Download Customer Data CSV (filtered according to time period)
  const handleDownloadCustomersReport = useCallback(() => {
    if (periodCustomers.length === 0) {
      alert(`No customer activity recorded for ${activePeriodLabel}. Please try another period.`)
      return
    }
    const headers = [
      'Customer Name',
      'E-Mail-Adresse',
      'Telefonnummer',
      'Lieferland',
      'Lieferstadt',
      'Lieferadresse',
      'Orders in Period',
      'Gesamtausgaben im Zeitraum',
      'Währung',
      'Avg. Spend per Order',
      'Letzte Bestellnummer',
      'Latest Order Date',
      'Customer Status',
      'Zeitraumfilter',
    ]
    const rows = periodCustomers.map((c) => {
      const avgSpend = c.ordersCount > 0 ? (c.totalSpent / c.ordersCount).toFixed(2) : '0.00'
      const tier = c.ordersCount > 1 ? 'Wiederkehrender Käufer' : 'Verifizierter Käufer'
      return [
        `"${c.name.replace(/"/g, '""')}"`,
        `"${c.email.replace(/"/g, '""')}"`,
        `"${(c.phone || '').replace(/"/g, '""')}"`,
        `"${(c.country || 'Deutschland').replace(/"/g, '""')}"`,
        `"${(c.city || '').replace(/"/g, '""')}"`,
        `"${(c.address || '').replace(/"/g, '""')}"`,
        String(c.ordersCount),
        c.totalSpent.toFixed(2),
        `"${c.currency || 'INR'}"`,
        avgSpend,
        `"${c.latestOrderNumber}"`,
        `"${c.latestOrderDate.toISOString().slice(0, 10)}"`,
        `"${tier}"`,
        `"${activePeriodLabel}"`,
      ]
    })
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute(
      'download',
      `ixos-kunden-daten-${period}-${new Date().toISOString().slice(0, 10)}.csv`
    )
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, [periodCustomers, activePeriodLabel, period])

  // Download Products Sold Data CSV (filtered according to time period)
  const handleDownloadProductsSoldReport = useCallback(() => {
    if (periodProductsSold.length === 0) {
      alert(`Keine Daten über verkaufte Produkte für ${activePeriodLabel} verfügbar. Versuchen Sie einen anderen Zeitraum.`)
      return
    }
    const headers = [
      'SKU / Teilenummer',
      'Produktname',
      'Variante / Spezifikation',
      'Units Sold (Qty)',
      'Total Sales Revenue',
      'Währung',
      'Avg. Sale Price',
      'Associated Orders',
      'Zugehörige Bestellnummern',
      'Latest Sale Date',
      'Zeitraumfilter',
    ]
    const rows = periodProductsSold.map((p) => {
      const avgPrice = p.unitsSold > 0 ? (p.totalRevenue / p.unitsSold).toFixed(2) : '0.00'
      const orderRefs = p.orderNumbers.slice(0, 10).join('; ')
      return [
        `"${p.sku.replace(/"/g, '""')}"`,
        `"${p.name.replace(/"/g, '""')}"`,
        `"${p.variant.replace(/"/g, '""')}"`,
        String(p.unitsSold),
        p.totalRevenue.toFixed(2),
        `"${p.currency || 'INR'}"`,
        avgPrice,
        String(p.orderNumbers.length),
        `"${orderRefs.replace(/"/g, '""')}"`,
        `"${p.latestOrderDate.toISOString().slice(0, 10)}"`,
        `"${activePeriodLabel}"`,
      ]
    })
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute(
      'download',
      `ixos-verkaufte-produkte-${period}-${new Date().toISOString().slice(0, 10)}.csv`
    )
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, [periodProductsSold, activePeriodLabel, period])

  // Download Tax Report (filtered according to time period)
  const handleDownloadTaxReport = useCallback(() => {
    if (salesInPeriod.length === 0) {
      alert(`Keine steuerlichen Transaktionen für ${activePeriodLabel} erfasst.`)
      return
    }
    const headers = [
      'Bestellnummer',
      'Datum',
      'Customer Name',
      'Zielland',
      'Region',
      'Steuerliche Einstufung',
      'Bruttobetrag',
      'Geschätzte MwSt. (19%)',
      'Zeitraumfilter',
    ]
    const rows = salesInPeriod.map((s) => {
      const dt = formatAdminOrderDateTime(s.date)
      return [
        `"${s.orderNumber}"`,
        `"${dt.date}"`,
        `"${s.customerName.replace(/"/g, '""')}"`,
        `"${s.customerCountry || 'Deutschland / EU'}"`,
        '"Europäische Union"',
        '"19% Standard EU-MwSt."',
        s.amount.toFixed(2),
        ((s.amount * 0.19) / 1.19).toFixed(2),
        `"${activePeriodLabel}"`,
      ]
    })
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ixos-steuer-export-${period}-${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [salesInPeriod, activePeriodLabel, period])

  // Download All Reports Bundle
  const handleDownloadAllReports = useCallback(() => {
    if (salesInPeriod.length === 0) {
      alert(`Keine Daten für ${activePeriodLabel} zum Exportieren vorhanden.`)
      return
    }
    handleDownloadSalesReport()
    setTimeout(() => handleDownloadCustomersReport(), 400)
    setTimeout(() => handleDownloadProductsSoldReport(), 800)
  }, [salesInPeriod, handleDownloadSalesReport, handleDownloadCustomersReport, handleDownloadProductsSoldReport, activePeriodLabel])

  // Notifications State & Logic
  const [notifCategory, setNotifCategory] = useState<'all' | 'orders' | 'inventory' | 'customers' | 'system' | 'discounts'>('all')
  const [showUnreadOnly, setShowUnreadOnly] = useState(false)
  const [readNotificationIds, setReadNotificationIds] = useState<Set<string>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('ixos_admin_read_notifications')
        if (saved) return new Set(JSON.parse(saved))
      } catch {}
    }
    return new Set()
  })

  interface AdminNotification {
    id: string
    category: 'orders' | 'inventory' | 'customers' | 'system' | 'discounts'
    title: string
    message: string
    time: string
    timestamp: Date
    unread: boolean
    actionLabel?: string
    actionTab?: string
    badge?: string
  }

  const [persistedNotifications, setPersistedNotifications] = useState<AdminNotification[]>([])

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch('/api/notifications?t=' + Date.now())
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data)) {
          setPersistedNotifications(
            data.map((n: any) => ({
              id: n.id,
              category: n.category || 'inventory',
              title: n.title,
              message: n.message,
              time: n.time || 'Gerade eben',
              timestamp: new Date(n.timestamp || Date.now()),
              unread: Boolean(n.unread),
              actionLabel: n.actionLabel || 'Inventar',
              actionTab: n.actionTab || 'inventory',
              badge: n.badge,
            }))
          )
        }
      }
    } catch (err) {
      console.warn('[DashboardView] Could not load notifications:', err)
    }
  }, [])

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications, subTab])

  const toggleNotificationRead = useCallback((id: string) => {
    setReadNotificationIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      try {
        localStorage.setItem('ixos_admin_read_notifications', JSON.stringify(Array.from(next)))
      } catch {}
      return next
    })

    fetch('/api/notifications', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    }).catch(() => {})
  }, [])

  const allNotifications = useMemo<AdminNotification[]>(() => {
    return persistedNotifications.map((n) => ({
      ...n,
      unread: readNotificationIds.has(n.id) ? false : n.unread,
    }))
  }, [persistedNotifications, readNotificationIds])

  const unreadNotificationsCount = useMemo(() => {
    return allNotifications.filter((n) => n.unread).length
  }, [allNotifications])

  const markAllNotificationsRead = useCallback(() => {
    const allIds = allNotifications.map((n) => n.id)
    const next = new Set(allIds)
    setReadNotificationIds(next)
    try {
      localStorage.setItem('ixos_admin_read_notifications', JSON.stringify(Array.from(next)))
    } catch {}

    fetch('/api/notifications', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ markAll: true }),
    }).catch(() => {})
  }, [allNotifications])

  const filteredNotifications = useMemo(() => {
    return allNotifications.filter((n) => {
      if (showUnreadOnly && !n.unread) return false
      if (notifCategory !== 'all' && n.category !== notifCategory) return false
      return true
    })
  }, [allNotifications, notifCategory, showUnreadOnly])

  // Generate chart data for active period
  const chartData = useMemo(() => {
    return generateChartData(period, verifiedSales, filterRange)
  }, [period, verifiedSales, filterRange])

  // Redirect to reports tab when clicking top header Download Report button
  const handleDownloadReport = useCallback(() => {
    handleSubTabChange('reports')
  }, [handleSubTabChange])

  // Redirect to order detail / orders tab when clicking recent sale
  const handleRecentSaleClick = useCallback(
    (sale: VerifiedSale) => {
      const targetOrder = sale.rawOrder || sale
      if (onSelectOrder) {
        onSelectOrder(targetOrder, sale.orderNumber)
      } else {
        onSelectTab('orders')
      }
    },
    [onSelectOrder, onSelectTab]
  )

  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header fixed>
        <div className='ms-auto flex items-center gap-2 sm:gap-4'>
          <Search />
          <ThemeSwitch />
          <ConfigDrawer />
        </div>
      </Header>

      {/* ===== Main ===== */}
      <Main>
        <div className='mb-4 flex items-center justify-between space-y-2'>
          <div>
            <h1 className='text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground'>
              Dashboard
            </h1>
          </div>
          <div className='flex items-center space-x-2'>
            {onRefresh && (
              <Button
                variant='outline'
                size='sm'
                onClick={onRefresh}
                disabled={loading}
                className='h-8 text-xs'
              >
                <RefreshCw className={`w-3.5 h-3.5 me-1.5 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            )}
            <Button
              size='sm'
              onClick={handleDownloadReport}
              className='h-8 text-xs cursor-pointer'
              title='Export or view reports'
            >
              <Download className='w-3.5 h-3.5 me-1.5' />
              Download Report
            </Button>
          </div>
        </div>

        <Tabs orientation='vertical' value={subTab} onValueChange={handleSubTabChange} className='space-y-4'>
          {/* Tabs Navigation & Time Period Filter Header: Filter placed immediately beside the tabs container */}
          <div className='flex flex-wrap items-center gap-2.5 sm:gap-3'>
            <div className='overflow-x-auto'>
              <TabsList>
                <TabsTrigger value='overview'>Overview</TabsTrigger>
                <TabsTrigger value='analytics'>Analytics</TabsTrigger>
                <TabsTrigger value='reports'>Reports</TabsTrigger>
                <TabsTrigger value='notifications' className='relative'>
                  Notifications {unreadNotificationsCount > 0 && (
                    <span className='ms-1.5 inline-flex items-center justify-center px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-destructive text-destructive-foreground'>
                      {unreadNotificationsCount}
                    </span>
                  )}
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Time Period Filter Dropdown placed immediately beside the tabs container */}
            {subTab !== 'notifications' && (
              <div className='flex items-center shrink-0'>
                <Select
                  value={period}
                  onValueChange={(val) => setPeriod(val as FilterPeriod)}
                >
                  <SelectTrigger className='w-[155px] h-9 text-xs font-medium bg-card border-border shadow-xs'>
                    <Calendar className='w-3.5 h-3.5 me-1.5 text-muted-foreground' />
                    <SelectValue placeholder='Select period' />
                  </SelectTrigger>
                  <SelectContent align='start'>
                    {FILTER_OPTIONS.map((f) => (
                      <SelectItem key={f.id} value={f.id} className='text-xs cursor-pointer'>
                        {f.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Custom Date Range Picker when Custom Period is selected */}
          {period === 'custom' && subTab !== 'notifications' && (
            <div className='p-3 bg-card border border-border/70 rounded-xl text-xs space-y-2 animate-fadeIn'>
              <div className='flex flex-wrap items-center justify-between gap-2.5'>
                <div className='flex items-center gap-2 flex-wrap sm:flex-nowrap'>
                  <div className='flex items-center gap-1.5 text-xs font-medium text-foreground shrink-0'>
                    <Calendar className='w-3.5 h-3.5 text-muted-foreground' />
                    <span>Custom Date Range:</span>
                  </div>
                  <div className='flex items-center gap-1.5 bg-muted/40 dark:bg-muted/20 border border-border/70 rounded-lg p-1 text-xs'>
                    <div className='flex items-center gap-1.5 px-1'>
                      <span className='text-[11px] font-medium text-muted-foreground select-none'>From</span>
                      <Input
                        type='date'
                        value={customStartDate}
                        onChange={(e) => setCustomStartDate(e.target.value)}
                        className='h-7 w-[140px] text-xs px-2 bg-background border-border/60 shadow-2xs'
                      />
                    </div>
                    <span className='text-muted-foreground/60 text-xs select-none'>–</span>
                    <div className='flex items-center gap-1.5 px-1'>
                      <span className='text-[11px] font-medium text-muted-foreground select-none'>To</span>
                      <Input
                        type='date'
                        value={customEndDate}
                        onChange={(e) => setCustomEndDate(e.target.value)}
                        className='h-7 w-[140px] text-xs px-2 bg-background border-border/60 shadow-2xs'
                      />
                    </div>
                  </div>
                </div>
                <button
                  type='button'
                  onClick={() => {
                    const now = new Date()
                    const monthAgo = new Date()
                    monthAgo.setDate(monthAgo.getDate() - 30)
                    const tz = getAdminTimeZone()
                    setCustomStartDate(getAdminLocalDateString(monthAgo, tz))
                    setCustomEndDate(getAdminLocalDateString(now, tz))
                  }}
                  className='text-xs font-medium text-muted-foreground hover:text-foreground hover:underline transition-colors shrink-0 cursor-pointer ms-auto'
                >
                  Reset to last 30 days
                </button>
              </div>
            </div>
          )}

          <TabsContent value='overview' className='space-y-4'>
            {/* Real Verified Summary Stats (Filtered by Active Time Period) */}
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>Total Revenue</CardTitle>
                  <span className='h-5 w-5 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center'>₹</span>
                </CardHeader>
                <CardContent>
                  <div className='text-3xl sm:text-4xl font-normal tracking-tight'>
                    {currencySymbol}
                    {filteredRevenue.toLocaleString('en-IN', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                  <p className='text-[11px] font-normal mt-0.5 flex items-center'>
                    <UiTooltip>
                      <UiTooltipTrigger asChild>
                        <span
                          title={revenueTooltip}
                          className={`cursor-default select-none inline-flex items-center ${
                            revenueChange.direction === 'increase'
                              ? 'text-[#007934] dark:text-[#22c55e]'
                              : revenueChange.direction === 'decrease'
                              ? 'text-rose-600 dark:text-rose-400'
                              : 'text-muted-foreground'
                          }`}
                        >
                          {revenueChange.formatted} {revenueChange.direction === 'increase' ? '↑' : revenueChange.direction === 'decrease' ? '↓' : ''}
                        </span>
                      </UiTooltipTrigger>
                      <UiTooltipContent side='top' sideOffset={6} className='text-xs font-normal'>
                        {revenueTooltip}
                      </UiTooltipContent>
                    </UiTooltip>
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>Verified Orders</CardTitle>
                  <PackageCheck className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-3xl sm:text-4xl font-normal tracking-tight'>+{filteredSalesCount}</div>
                  <p className='text-[11px] font-normal mt-0.5 flex items-center'>
                    <UiTooltip>
                      <UiTooltipTrigger asChild>
                        <span
                          title={salesTooltip}
                          className={`cursor-default select-none inline-flex items-center ${
                            salesCountChange.direction === 'increase'
                              ? 'text-[#007934] dark:text-[#22c55e]'
                              : salesCountChange.direction === 'decrease'
                              ? 'text-rose-600 dark:text-rose-400'
                              : 'text-muted-foreground'
                          }`}
                        >
                          {salesCountChange.formatted} {salesCountChange.direction === 'increase' ? '↑' : salesCountChange.direction === 'decrease' ? '↓' : ''}
                        </span>
                      </UiTooltipTrigger>
                      <UiTooltipContent side='top' sideOffset={6} className='text-xs font-normal'>
                        {salesTooltip}
                      </UiTooltipContent>
                    </UiTooltip>
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>Average Order Value</CardTitle>
                  <CreditCard className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-3xl sm:text-4xl font-normal tracking-tight'>
                    {currencySymbol}
                    {periodAverageOrderValue.toLocaleString('en-IN', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                  <p className='text-[11px] font-normal mt-0.5 flex items-center'>
                    <UiTooltip>
                      <UiTooltipTrigger asChild>
                        <span
                          title={aovTooltip}
                          className={`cursor-default select-none inline-flex items-center ${
                            aovChange.direction === 'increase'
                              ? 'text-[#007934] dark:text-[#22c55e]'
                              : aovChange.direction === 'decrease'
                              ? 'text-rose-600 dark:text-rose-400'
                              : 'text-muted-foreground'
                          }`}
                        >
                          {aovChange.formatted} {aovChange.direction === 'increase' ? '↑' : aovChange.direction === 'decrease' ? '↓' : ''}
                        </span>
                      </UiTooltipTrigger>
                      <UiTooltipContent side='top' sideOffset={6} className='text-xs font-normal'>
                        {aovTooltip}
                      </UiTooltipContent>
                    </UiTooltip>
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>Verified Customers</CardTitle>
                  <Users className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-3xl sm:text-4xl font-normal tracking-tight'>+{periodUniqueCustomersCount}</div>
                  <p className='text-[11px] font-normal mt-0.5 flex items-center'>
                    <UiTooltip>
                      <UiTooltipTrigger asChild>
                        <span
                          title={customersTooltip}
                          className={`cursor-default select-none inline-flex items-center ${
                            customersChange.direction === 'increase'
                              ? 'text-[#007934] dark:text-[#22c55e]'
                              : customersChange.direction === 'decrease'
                              ? 'text-rose-600 dark:text-rose-400'
                              : 'text-muted-foreground'
                          }`}
                        >
                          {customersChange.formatted} {customersChange.direction === 'increase' ? '↑' : customersChange.direction === 'decrease' ? '↓' : ''}
                        </span>
                      </UiTooltipTrigger>
                      <UiTooltipContent side='top' sideOffset={6} className='text-xs font-normal'>
                        {customersTooltip}
                      </UiTooltipContent>
                    </UiTooltip>
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Main Graphs & Recent Sales Section */}
            <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
              {/* Overview Graph Card with Real Data */}
              <Card className='col-span-1 lg:col-span-4 min-w-0'>
                <CardHeader className='pb-3'>
                  <CardTitle className='text-base font-semibold'>Revenue Overview</CardTitle>
                  <CardDescription className='text-xs mt-1 truncate'>
                    Verified Revenue Volume:{' '}
                    <span className='font-semibold text-[#007934] dark:text-[#22c55e]'>
                      {currencySymbol}
                      {filteredRevenue.toLocaleString('en-IN', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>{' '}
                    <span className='text-muted-foreground'>
                      ({filteredSalesCount} {filteredSalesCount === 1 ? 'Order' : 'Orders'} • {activePeriodLabel})
                    </span>
                  </CardDescription>
                </CardHeader>

                <CardContent className='ps-2'>
                  <div className='w-full h-[350px] relative'>
                    {filteredSalesCount === 0 && (
                      <div className='absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10'>
                        <div className='bg-background/85 backdrop-blur-xs px-4 py-2.5 rounded-xl border border-border/60 text-center shadow-xs'>
                          <p className='text-xs font-semibold text-foreground'>
                            No verified orders in this period
                          </p>
                          <p className='text-[11px] text-muted-foreground mt-0.5'>
                            Verified customer orders will automatically appear here
                          </p>
                        </div>
                      </div>
                    )}
                    <ResponsiveContainer width='100%' height={350}>
                      <BarChart
                        data={chartData}
                        margin={{ top: 12, right: 12, left: -8, bottom: 8 }}
                      >
                        <XAxis
                          dataKey='name'
                          stroke='#888888'
                          fontSize={11}
                          tickLine={false}
                          axisLine={false}
                          interval={0}
                        />
                        <YAxis
                          stroke='#888888'
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(value) => `${currencySymbol}${value}`}
                          domain={[
                            0,
                            (dataMax) => (dataMax === 0 ? 100 : Math.ceil(dataMax * 1.15)),
                          ]}
                        />
                        <Tooltip
                          cursor={{ fill: 'currentColor', opacity: 0.05 }}
                          content={<CustomChartTooltip currencySymbol={currencySymbol} />}
                        />
                        <Bar
                          dataKey='total'
                          fill='currentColor'
                          radius={[4, 4, 0, 0]}
                          className='fill-primary'
                          maxBarSize={48}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Sales with Real Verified Customer Data Filtered by Active Period */}
              <Card className='col-span-1 lg:col-span-3 min-w-0'>
                <CardHeader>
                  <div className='flex items-center justify-between gap-2'>
                    <div>
                      <CardTitle>Recent Sales</CardTitle>
                      <CardDescription>
                        {salesInPeriod.length > 0
                          ? `Showing latest ${Math.min(salesInPeriod.length, 5)} verified ${salesInPeriod.length === 1 ? 'order' : 'orders'} (${activePeriodLabel}).`
                          : `No verified orders recorded for ${activePeriodLabel.toLowerCase()}.`}
                      </CardDescription>
                    </div>
                    {salesInPeriod.length > 0 && (
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => onSelectTab('orders')}
                        className='text-xs text-muted-foreground hover:text-foreground h-8 px-2 cursor-pointer shrink-0'
                      >
                        <span>All Orders</span>
                        <ArrowUpRight className='w-3.5 h-3.5 ms-1' />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {salesInPeriod.length === 0 ? (
                    <div className='py-12 text-center space-y-2'>
                      <div className='w-10 h-10 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground'>
                        <ShoppingBag className='w-5 h-5' />
                      </div>
                      <p className='text-sm font-semibold text-foreground'>
                        Keine verifizierten Verkäufe für {activePeriodLabel.toLowerCase()}
                      </p>
                      <p className='text-xs text-muted-foreground max-w-xs mx-auto'>
                        Customer orders and checkouts will appear here in real time.
                      </p>
                    </div>
                  ) : (
                    <div className='divide-y divide-border/40 -mx-2'>
                      {salesInPeriod.slice(0, 5).map((sale) => (
                        <div
                          key={sale.id}
                          onClick={() => handleRecentSaleClick(sale)}
                          role='button'
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault()
                              handleRecentSaleClick(sale)
                            }
                          }}
                          title={`Click to view order ${sale.orderNumber}`}
                          className='flex items-center justify-between gap-4 px-2.5 py-3 hover:bg-muted/50 dark:hover:bg-muted/30 rounded-xl transition-all duration-150 cursor-pointer group'
                        >
                          <div className='flex items-center gap-3.5 min-w-0'>
                            <Avatar className='h-10 w-10 border border-border/60 shrink-0 group-hover:border-primary/50 transition-colors'>
                              {sale.avatar && <AvatarImage src={sale.avatar} alt={sale.customerName} />}
                              <AvatarFallback className='bg-muted/80 font-semibold text-xs text-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors'>
                                {sale.fallback}
                              </AvatarFallback>
                            </Avatar>
                            <div className='min-w-0 space-y-1'>
                              <div className='flex items-center gap-2'>
                                <p className='text-sm font-semibold leading-none text-foreground truncate group-hover:text-primary transition-colors'>
                                  {sale.customerName}
                                </p>
                                <span className='font-mono text-[10px] text-muted-foreground/80 bg-muted/60 px-1.5 py-0.5 rounded group-hover:bg-primary/10 group-hover:text-primary transition-colors shrink-0'>
                                  {sale.orderNumber}
                                </span>
                              </div>
                              <p className='text-xs text-muted-foreground truncate'>
                                {sale.customerEmail || 'Guest Customer'}
                              </p>
                            </div>
                          </div>
                          <div className='flex items-center gap-2 shrink-0'>
                            <div className='font-semibold text-sm sm:text-base text-[#007934] dark:text-[#22c55e] tabular-nums tracking-tight text-right'>
                              +{currencySymbol}
                              {sale.amount.toLocaleString('en-IN', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </div>
                            <ArrowUpRight className='w-4 h-4 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all' />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value='analytics' className='space-y-4'>
            <div className='space-y-4'>
              <Card className='min-w-0'>
                <CardHeader className='pb-3'>
                  <CardTitle className='text-base font-semibold'>Revenue Volume Trend</CardTitle>
                  <CardDescription className='text-xs mt-1 truncate'>
                    Verified order trajectory by period:{' '}
                    <span className='font-semibold text-[#007934] dark:text-[#22c55e]'>
                      {currencySymbol}
                      {filteredRevenue.toLocaleString('en-IN', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>{' '}
                    <span className='text-muted-foreground'>
                      ({filteredSalesCount} {filteredSalesCount === 1 ? 'Order' : 'Orders'} • {activePeriodLabel})
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent className='px-6'>
                  <ResponsiveContainer width='100%' height={300}>
                    <AreaChart data={chartData} margin={{ top: 12, right: 12, left: -8, bottom: 8 }}>
                      <XAxis dataKey='name' stroke='#888888' fontSize={11} tickLine={false} axisLine={false} interval={0} />
                      <YAxis
                        stroke='#888888'
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${currencySymbol}${value}`}
                      />
                      <Tooltip
                        cursor={{ fill: 'currentColor', opacity: 0.05 }}
                        content={<CustomChartTooltip currencySymbol={currencySymbol} />}
                      />
                      <Area
                        type='monotone'
                        dataKey='total'
                        stroke='currentColor'
                        className='text-primary'
                        fill='currentColor'
                        fillOpacity={0.15}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ===== REPORTS TAB CONTENT ===== */}
          <TabsContent value='reports' className='space-y-4'>
            {/* Quick Export Actions Bar */}
            <div className='flex flex-wrap items-center justify-between gap-3 p-3 bg-card border border-border/70 rounded-xl shadow-2xs min-w-0'>
              <div className='flex items-center gap-2 min-w-0'>
                <div className='w-7 h-7 rounded-lg bg-muted flex items-center justify-center text-muted-foreground shrink-0'>
                  <Download className='w-3.5 h-3.5' />
                </div>
                <div className='flex items-center gap-2 min-w-0'>
                  <span className='text-xs font-semibold text-foreground tracking-tight'>Schnell-Export</span>
                  <span className='text-muted-foreground/40 text-xs select-none'>•</span>
                  <Badge variant='secondary' className='text-[10px] font-medium h-5 px-1.5'>
                    {activePeriodLabel}
                  </Badge>
                </div>
              </div>
              <div className='flex items-center gap-2 flex-wrap ms-auto'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={handleDownloadSalesReport}
                  disabled={salesInPeriod.length === 0}
                  className='h-8 text-xs cursor-pointer px-2.5'
                  title={`Export orders for ${activePeriodLabel}`}
                >
                  <Receipt className='w-3.5 h-3.5 me-1.5 text-emerald-600 dark:text-emerald-400 shrink-0' />
                  Orders (CSV)
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={handleDownloadCustomersReport}
                  disabled={periodCustomers.length === 0}
                  className='h-8 text-xs cursor-pointer px-2.5'
                  title={`Export customers for ${activePeriodLabel}`}
                >
                  <Users className='w-3.5 h-3.5 me-1.5 text-blue-600 dark:text-blue-400 shrink-0' />
                  Customers (CSV)
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={handleDownloadProductsSoldReport}
                  disabled={periodProductsSold.length === 0}
                  className='h-8 text-xs cursor-pointer px-2.5'
                  title={`Download products sold for ${activePeriodLabel}`}
                >
                  <Package className='w-3.5 h-3.5 me-1.5 text-amber-600 dark:text-amber-400 shrink-0' />
                  Products Sold (CSV)
                </Button>
                <Button
                  size='sm'
                  onClick={handleDownloadAllReports}
                  disabled={salesInPeriod.length === 0}
                  className='h-8 text-xs cursor-pointer px-3 bg-primary text-primary-foreground hover:bg-primary/90'
                  title={`Export complete reports for ${activePeriodLabel}`}
                >
                  <Download className='w-3.5 h-3.5 me-1.5 shrink-0' />
                  Alle exportieren
                </Button>
              </div>
            </div>

            {/* Core Report Cards */}
            <div className='grid gap-3.5 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4'>
              {/* Card 1: Sales */}
              <Card className='p-4 sm:p-5 flex flex-col justify-between gap-4 hover:border-foreground/25 transition-colors rounded-xl shadow-2xs min-w-0'>
                <div className='min-w-0 space-y-3'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      <div className='w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0'>
                        <Receipt className='w-3.5 h-3.5' />
                      </div>
                      <span className='text-xs font-semibold text-foreground tracking-tight'>Sales Report</span>
                    </div>
                    <button
                      type='button'
                      onClick={() => onSelectTab('orders')}
                      className='text-muted-foreground/60 hover:text-foreground transition-colors p-1 cursor-pointer'
                      title='View in Orders'
                    >
                      <ArrowUpRight className='w-3.5 h-3.5' />
                    </button>
                  </div>
                  <div>
                    <div className='text-2xl font-bold tracking-tight text-foreground'>
                      {currencySymbol}{filteredRevenue.toFixed(2)}
                    </div>
                    <p className='text-[11px] text-muted-foreground mt-0.5 truncate'>
                      {filteredSalesCount} {filteredSalesCount === 1 ? 'verified order' : 'verified orders'} in {activePeriodLabel.toLowerCase()}
                    </p>
                  </div>
                </div>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={handleDownloadSalesReport}
                  disabled={filteredSalesCount === 0}
                  className='w-full text-xs h-8 cursor-pointer justify-center'
                >
                  <Download className='w-3.5 h-3.5 me-1.5 shrink-0 text-emerald-600 dark:text-emerald-400' />
                  CSV herunterladen
                </Button>
              </Card>

              {/* Card 2: Customers */}
              <Card className='p-4 sm:p-5 flex flex-col justify-between gap-4 hover:border-foreground/25 transition-colors rounded-xl shadow-2xs min-w-0'>
                <div className='min-w-0 space-y-3'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      <div className='w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0'>
                        <Users className='w-3.5 h-3.5' />
                      </div>
                      <span className='text-xs font-semibold text-foreground tracking-tight'>Customer Data</span>
                    </div>
                    <button
                      type='button'
                      onClick={() => onSelectTab('customers')}
                      className='text-muted-foreground/60 hover:text-foreground transition-colors p-1 cursor-pointer'
                      title='View in Customers'
                    >
                      <ArrowUpRight className='w-3.5 h-3.5' />
                    </button>
                  </div>
                  <div>
                    <div className='text-2xl font-bold tracking-tight text-foreground'>
                      {periodCustomers.length} {periodCustomers.length === 1 ? 'Käufer' : 'Käufer'}
                    </div>
                    <p className='text-[11px] text-muted-foreground mt-0.5 truncate'>
                      Durchschn. Ausgaben {currencySymbol}{periodAverageOrderValue.toFixed(2)} in {activePeriodLabel.toLowerCase()}
                    </p>
                  </div>
                </div>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={handleDownloadCustomersReport}
                  disabled={periodCustomers.length === 0}
                  className='w-full text-xs h-8 cursor-pointer justify-center'
                >
                  <Download className='w-3.5 h-3.5 me-1.5 shrink-0 text-blue-600 dark:text-blue-400' />
                  CSV herunterladen
                </Button>
              </Card>

              {/* Card 3: Products Sold */}
              <Card className='p-4 sm:p-5 flex flex-col justify-between gap-4 hover:border-foreground/25 transition-colors rounded-xl shadow-2xs min-w-0'>
                <div className='min-w-0 space-y-3'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      <div className='w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0'>
                        <Package className='w-3.5 h-3.5' />
                      </div>
                      <span className='text-xs font-semibold text-foreground tracking-tight'>Products Sold</span>
                    </div>
                    <button
                      type='button'
                      onClick={() => onSelectTab('products')}
                      className='text-muted-foreground/60 hover:text-foreground transition-colors p-1 cursor-pointer'
                      title='In Produkten ansehen'
                    >
                      <ArrowUpRight className='w-3.5 h-3.5' />
                    </button>
                  </div>
                  <div>
                    <div className='text-2xl font-bold tracking-tight text-foreground'>
                      {periodTotalUnitsSold} {periodTotalUnitsSold === 1 ? 'Einheit' : 'Einheiten'}
                    </div>
                    <p className='text-[11px] text-muted-foreground mt-0.5 truncate'>
                      Über {periodUniqueProductsSold} verschiedene SKUs
                    </p>
                  </div>
                </div>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={handleDownloadProductsSoldReport}
                  disabled={periodProductsSold.length === 0}
                  className='w-full text-xs h-8 cursor-pointer justify-center'
                >
                  <Download className='w-3.5 h-3.5 me-1.5 shrink-0 text-amber-600 dark:text-amber-400' />
                  CSV herunterladen
                </Button>
              </Card>

              {/* Card 4: Tax Statement */}
              <Card className='p-4 sm:p-5 flex flex-col justify-between gap-4 hover:border-foreground/25 transition-colors rounded-xl shadow-2xs min-w-0'>
                <div className='min-w-0 space-y-3'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      <div className='w-7 h-7 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0'>
                        <FileText className='w-3.5 h-3.5' />
                      </div>
                      <span className='text-xs font-semibold text-foreground tracking-tight'>Steuern &amp; Abgaben</span>
                    </div>
                    <button
                      type='button'
                      onClick={() => onSelectTab('settings')}
                      className='text-muted-foreground/60 hover:text-foreground transition-colors p-1 cursor-pointer'
                      title='Shop-Einstellungen'
                    >
                      <ArrowUpRight className='w-3.5 h-3.5' />
                    </button>
                  </div>
                  <div>
                    <div className='text-2xl font-bold tracking-tight text-foreground'>
                      {currencySymbol}{((filteredRevenue * 0.19) / 1.19).toFixed(2)}
                    </div>
                    <p className='text-[11px] text-muted-foreground mt-0.5 truncate'>
                      19% MwSt. auf {currencySymbol}{filteredRevenue.toFixed(2)} brutto
                    </p>
                  </div>
                </div>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={handleDownloadTaxReport}
                  disabled={filteredSalesCount === 0}
                  className='w-full text-xs h-8 cursor-pointer justify-center'
                >
                  <Download className='w-3.5 h-3.5 me-1.5 shrink-0 text-purple-600 dark:text-purple-400' />
                  CSV herunterladen
                </Button>
              </Card>
            </div>

            {/* 4. Interactive Data Audit & Explorer Table with 3-Way Tab Switcher */}
            <Card className='min-w-0'>
              <CardHeader className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3'>
                <div>
                  <CardTitle className='text-base font-semibold flex items-center gap-2'>
                    <span>Datenprüfung &amp; Explorer</span>
                    <Badge variant='outline' className='text-xs font-normal'>
                      {activePeriodLabel}
                    </Badge>
                  </CardTitle>
                  <CardDescription className='text-xs mt-0.5'>
                    {reportTableTab === 'sales' && `Zeigt ${filteredReportSales.length} von ${salesInPeriod.length} verifizierten Bestelldatensätzen.`}
                    {reportTableTab === 'customers' && `Zeigt ${filteredReportCustomers.length} von ${periodCustomers.length} eindeutigen Kundenkäufern.`}
                    {reportTableTab === 'products' && `Zeigt ${filteredReportProducts.length} von ${periodProductsSold.length} verkauften Produkten.`}
                  </CardDescription>
                </div>
                <div className='flex items-center gap-2 flex-wrap'>
                  {/* Table Tab Selector */}
                  <div className='inline-flex items-center p-1 bg-muted/60 dark:bg-muted/30 border border-border/50 rounded-lg text-xs'>
                    <button
                      type='button'
                      onClick={() => { setReportTableTab('sales'); setReportSearchQuery('') }}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                        reportTableTab === 'sales'
                          ? 'bg-background text-foreground shadow-2xs font-semibold'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Verkäufe ({salesInPeriod.length})
                    </button>
                    <button
                      type='button'
                      onClick={() => { setReportTableTab('customers'); setReportSearchQuery('') }}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                        reportTableTab === 'customers'
                          ? 'bg-background text-foreground shadow-2xs font-semibold'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Kunden ({periodCustomers.length})
                    </button>
                    <button
                      type='button'
                      onClick={() => { setReportTableTab('products'); setReportSearchQuery('') }}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                        reportTableTab === 'products'
                          ? 'bg-background text-foreground shadow-2xs font-semibold'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Products Sold ({periodProductsSold.length})
                    </button>
                  </div>

                  {/* Search Input */}
                  <div className='relative w-full sm:w-[190px]'>
                    <SearchIcon className='absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground' />
                    <Input
                      type='text'
                      placeholder={
                        reportTableTab === 'sales'
                          ? 'Filter orders...'
                          : reportTableTab === 'customers'
                          ? 'Kunden filtern...'
                          : 'Produkte filtern...'
                      }
                      value={reportSearchQuery}
                      onChange={(e) => setReportSearchQuery(e.target.value)}
                      className='h-8 pl-8 text-xs bg-background'
                    />
                  </div>

                  {/* Export Current View */}
                  <Button
                    size='sm'
                    variant='outline'
                    onClick={() => {
                      if (reportTableTab === 'sales') handleDownloadSalesReport()
                      else if (reportTableTab === 'customers') handleDownloadCustomersReport()
                      else handleDownloadProductsSoldReport()
                    }}
                    disabled={
                      reportTableTab === 'sales'
                        ? salesInPeriod.length === 0
                        : reportTableTab === 'customers'
                        ? periodCustomers.length === 0
                        : periodProductsSold.length === 0
                    }
                    className='h-8 text-xs shrink-0 cursor-pointer'
                  >
                    <Download className='w-3.5 h-3.5 me-1.5' />
                    Tabelle als CSV exportieren
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* 1. SALES TABLE VIEW */}
                {reportTableTab === 'sales' && (
                  filteredReportSales.length === 0 ? (
                    <div className='py-12 text-center space-y-2'>
                      <div className='w-10 h-10 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground'>
                        <Receipt className='w-5 h-5' />
                      </div>
                      <p className='text-sm font-semibold text-foreground'>
                        Keine Verkäufe entsprechen dem aktiven Zeitraum ({activePeriodLabel})
                      </p>
                      <p className='text-xs text-muted-foreground max-w-sm mx-auto'>
                        Wählen Sie einen anderen Filter wie „Dieser Monat“ oder leeren Sie die Sucheingabe.
                      </p>
                    </div>
                  ) : (
                    <div className='overflow-x-auto -mx-6 px-6'>
                      <table className='w-full text-left text-xs'>
                        <thead>
                          <tr className='border-b border-border/60 text-muted-foreground'>
                            <th className='py-2.5 px-3 font-medium'>Bestell-Nr.</th>
                            <th className='py-2.5 px-3 font-medium'>Datum</th>
                            <th className='py-2.5 px-3 font-medium'>Kunde</th>
                            <th className='py-2.5 px-3 font-medium'>Zielort</th>
                            <th className='py-2.5 px-3 font-medium text-right'>Bruttobetrag</th>
                            <th className='py-2.5 px-3 font-medium'>Status</th>
                            <th className='py-2.5 px-3 font-medium text-right'>Action</th>
                          </tr>
                        </thead>
                        <tbody className='divide-y divide-border/40'>
                          {filteredReportSales.slice(0, 20).map((sale) => (
                            <tr key={sale.id} className='hover:bg-muted/40 transition-colors'>
                              <td className='py-3 px-3 font-semibold text-foreground font-mono'>
                                {sale.orderNumber}
                              </td>
                              <td className='py-3 px-3 text-muted-foreground whitespace-nowrap'>
                                {(() => {
                                  const dt = formatAdminOrderDateTime(sale.date)
                                  return (
                                    <div>
                                      <span className='font-medium text-foreground'>{dt.date}</span>
                                      {dt.time && (
                                        <span className='text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5'>
                                          <Clock className='h-3 w-3 text-muted-foreground/70' />
                                          {dt.time}
                                        </span>
                                      )}
                                    </div>
                                  )
                                })()}
                              </td>
                              <td className='py-3 px-3'>
                                <div className='font-medium text-foreground truncate max-w-[180px]'>
                                  {sale.customerName}
                                </div>
                                <div className='text-[11px] text-muted-foreground truncate max-w-[180px]'>
                                  {sale.customerEmail}
                                </div>
                              </td>
                              <td className='py-3 px-3 text-muted-foreground whitespace-nowrap'>
                                {sale.customerCountry || 'Deutschland'}
                              </td>
                              <td className='py-3 px-3 text-right font-bold text-[#007934] dark:text-[#22c55e] tabular-nums whitespace-nowrap'>
                                {currencySymbol}{sale.amount.toFixed(2)}
                              </td>
                              <td className='py-3 px-3 whitespace-nowrap'>
                                <Badge
                                  variant={
                                    sale.status.toLowerCase().includes('deliv') ||
                                    sale.status.toLowerCase().includes('ship')
                                      ? 'default'
                                      : 'secondary'
                                  }
                                  className='text-[10px] font-medium'
                                >
                                  {sale.status}
                                </Badge>
                              </td>
                              <td className='py-3 px-3 text-right whitespace-nowrap'>
                                <Button
                                  size='sm'
                                  variant='ghost'
                                  onClick={() => handleRecentSaleClick(sale)}
                                  className='h-7 px-2 text-xs font-medium cursor-pointer hover:bg-primary/10 hover:text-primary'
                                >
                                  Details
                                  <ArrowUpRight className='w-3 h-3 ms-1' />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )
                )}

                {/* 2. CUSTOMERS TABLE VIEW */}
                {reportTableTab === 'customers' && (
                  filteredReportCustomers.length === 0 ? (
                    <div className='py-12 text-center space-y-2'>
                      <div className='w-10 h-10 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground'>
                        <Users className='w-5 h-5' />
                      </div>
                      <p className='text-sm font-semibold text-foreground'>
                        Keine Kundenkäufer gefunden für {activePeriodLabel}
                      </p>
                      <p className='text-xs text-muted-foreground max-w-sm mx-auto'>
                        Customer entries will appear here once orders are placed in the selected period.
                      </p>
                    </div>
                  ) : (
                    <div className='overflow-x-auto -mx-6 px-6'>
                      <table className='w-full text-left text-xs'>
                        <thead>
                          <tr className='border-b border-border/60 text-muted-foreground'>
                            <th className='py-2.5 px-3 font-medium'>Kundenname</th>
                            <th className='py-2.5 px-3 font-medium'>E-Mail</th>
                            <th className='py-2.5 px-3 font-medium'>Land</th>
                            <th className='py-2.5 px-3 font-medium text-center'>Orders</th>
                            <th className='py-2.5 px-3 font-medium text-right'>Gesamtausgaben</th>
                            <th className='py-2.5 px-3 font-medium'>Latest Order</th>
                            <th className='py-2.5 px-3 font-medium text-right'>Aktion</th>
                          </tr>
                        </thead>
                        <tbody className='divide-y divide-border/40'>
                          {filteredReportCustomers.slice(0, 20).map((cust, idx) => (
                            <tr key={cust.email + idx} className='hover:bg-muted/40 transition-colors'>
                              <td className='py-3 px-3 font-semibold text-foreground'>
                                {cust.name}
                              </td>
                              <td className='py-3 px-3 text-muted-foreground'>
                                {cust.email}
                              </td>
                              <td className='py-3 px-3 text-muted-foreground whitespace-nowrap'>
                                {cust.country}
                              </td>
                              <td className='py-3 px-3 text-center whitespace-nowrap font-medium'>
                                {cust.ordersCount}
                              </td>
                              <td className='py-3 px-3 text-right font-bold text-[#007934] dark:text-[#22c55e] tabular-nums whitespace-nowrap'>
                                {currencySymbol}{cust.totalSpent.toFixed(2)}
                              </td>
                              <td className='py-3 px-3 whitespace-nowrap font-mono text-[11px] text-muted-foreground'>
                                {cust.latestOrderNumber}
                              </td>
                              <td className='py-3 px-3 text-right whitespace-nowrap'>
                                <Button
                                  size='sm'
                                  variant='ghost'
                                  onClick={() => onSelectTab('customers')}
                                  className='h-7 px-2 text-xs font-medium cursor-pointer hover:bg-primary/10 hover:text-primary'
                                >
                                  Profil
                                  <ArrowUpRight className='w-3 h-3 ms-1' />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )
                )}

                {/* 3. PRODUCTS SOLD TABLE VIEW */}
                {reportTableTab === 'products' && (
                  filteredReportProducts.length === 0 ? (
                    <div className='py-12 text-center space-y-2'>
                      <div className='w-10 h-10 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground'>
                        <Package className='w-5 h-5' />
                      </div>
                      <p className='text-sm font-semibold text-foreground'>
                        Keine verkauften Einheiten in {activePeriodLabel}
                      </p>
                      <p className='text-xs text-muted-foreground max-w-sm mx-auto'>
                        Revenue analytics and SKU metrics will appear automatically after orders are processed.
                      </p>
                    </div>
                  ) : (
                    <div className='overflow-x-auto -mx-6 px-6'>
                      <table className='w-full text-left text-xs'>
                        <thead>
                          <tr className='border-b border-border/60 text-muted-foreground'>
                            <th className='py-2.5 px-3 font-medium'>SKU / Style Code</th>
                            <th className='py-2.5 px-3 font-medium'>Product Name</th>
                            <th className='py-2.5 px-3 font-medium'>Variant</th>
                            <th className='py-2.5 px-3 font-medium text-center'>Units Sold</th>
                            <th className='py-2.5 px-3 font-medium text-right'>Total Revenue</th>
                            <th className='py-2.5 px-3 font-medium text-center'>Orders</th>
                            <th className='py-2.5 px-3 font-medium text-right'>Aktion</th>
                          </tr>
                        </thead>
                        <tbody className='divide-y divide-border/40'>
                          {filteredReportProducts.slice(0, 20).map((prod, idx) => (
                            <tr key={prod.sku + idx} className='hover:bg-muted/40 transition-colors'>
                              <td className='py-3 px-3 font-semibold text-foreground font-mono'>
                                {prod.sku}
                              </td>
                              <td className='py-3 px-3 font-medium text-foreground max-w-[220px] truncate'>
                                {prod.name}
                              </td>
                              <td className='py-3 px-3 text-muted-foreground whitespace-nowrap'>
                                {prod.variant}
                              </td>
                              <td className='py-3 px-3 text-center font-bold text-foreground tabular-nums whitespace-nowrap'>
                                {prod.unitsSold}
                              </td>
                              <td className='py-3 px-3 text-right font-bold text-[#007934] dark:text-[#22c55e] tabular-nums whitespace-nowrap'>
                                {currencySymbol}{prod.totalRevenue.toFixed(2)}
                              </td>
                              <td className='py-3 px-3 text-center text-muted-foreground whitespace-nowrap'>
                                {prod.orderNumbers.length}
                              </td>
                              <td className='py-3 px-3 text-right whitespace-nowrap'>
                                <Button
                                  size='sm'
                                  variant='ghost'
                                  onClick={() => onSelectTab('products')}
                                  className='h-7 px-2 text-xs font-medium cursor-pointer hover:bg-primary/10 hover:text-primary'
                                >
                                  Katalog
                                  <ArrowUpRight className='w-3 h-3 ms-1' />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ===== NOTIFICATIONS TAB CONTENT ===== */}
          <TabsContent value='notifications' className='space-y-4'>
            <Card className='border border-border/80 shadow-xs overflow-hidden'>
              {/* Header & Controls */}
              <div className='p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3'>
                <div className='flex items-center gap-3'>
                  <div className='w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0'>
                    <Bell className='w-4 h-4' />
                  </div>
                  <div>
                    <div className='flex items-center gap-2'>
                      <h3 className='text-sm font-semibold text-foreground tracking-tight'>
                        Benachrichtigungszentrale
                      </h3>
                      <span className='inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'>
                        <span className='w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse' />
                        Live-Überwachung
                      </span>
                    </div>
                    <p className='text-xs text-muted-foreground mt-0.5'>
                      Echtzeit-Aktivitäten im Shop, Inventarsignale und Bestellmeilensteine
                    </p>
                  </div>
                </div>

                <div className='flex items-center gap-2 ms-auto sm:ms-0'>
                  <button
                    type='button'
                    onClick={() => setShowUnreadOnly(!showUnreadOnly)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer flex items-center gap-1.5 ${
                      showUnreadOnly
                        ? 'bg-primary/10 border-primary/30 text-primary'
                        : 'bg-background border-border/70 text-muted-foreground hover:text-foreground hover:bg-muted/40'
                    }`}
                  >
                    <Filter className='w-3 h-3' />
                    <span>Nur ungelesene</span>
                    {unreadNotificationsCount > 0 && (
                      <span className='px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-primary text-primary-foreground'>
                        {unreadNotificationsCount}
                      </span>
                    )}
                  </button>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={markAllNotificationsRead}
                    disabled={unreadNotificationsCount === 0}
                    className='h-8 text-xs cursor-pointer border-border/70'
                  >
                    <Check className='w-3.5 h-3.5 me-1.5' />
                    Alle als gelesen markieren
                  </Button>
                </div>
              </div>

              {/* Category Filter Pills Toolbar */}
              <div className='px-4 sm:px-5 py-2.5 border-t border-border/60 bg-muted/20 flex flex-wrap items-center gap-1.5'>
                {(
                  [
                    { id: 'all', label: 'Alle', count: allNotifications.length },
                    {
                      id: 'orders',
                      label: 'Orders',
                      count: allNotifications.filter((n) => n.category === 'orders').length,
                    },
                    {
                      id: 'inventory',
                      label: 'Lagerbestand',
                      count: allNotifications.filter((n) => n.category === 'inventory').length,
                    },
                    {
                      id: 'customers',
                      label: 'Kunden',
                      count: allNotifications.filter((n) => n.category === 'customers').length,
                    },
                    {
                      id: 'system',
                      label: 'System',
                      count: allNotifications.filter((n) => n.category === 'system').length,
                    },
                    {
                      id: 'discounts',
                      label: 'Discounts',
                      count: allNotifications.filter((n) => n.category === 'discounts').length,
                    },
                  ] as const
                ).map((cat) => {
                  const isActive = notifCategory === cat.id
                  return (
                    <button
                      key={cat.id}
                      type='button'
                      onClick={() => setNotifCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-primary text-primary-foreground shadow-2xs font-semibold'
                          : 'bg-background border border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted/50'
                      }`}
                    >
                      <span>{cat.label}</span>
                      {cat.count > 0 && (
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                            isActive
                              ? 'bg-primary-foreground/20 text-primary-foreground'
                              : 'bg-muted text-foreground'
                          }`}
                        >
                          {cat.count}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Notification Content Area */}
              <CardContent className='p-0 border-t border-border/60'>
                {filteredNotifications.length === 0 ? (
                  <div className='py-16 sm:py-20 px-4 text-center max-w-md mx-auto space-y-6'>
                    {/* Visual Hero Badge */}
                    <div className='relative mx-auto w-16 h-16 rounded-2xl bg-gradient-to-b from-primary/10 to-primary/5 border border-primary/20 flex items-center justify-center shadow-xs'>
                      <Bell className='w-7 h-7 text-primary/80' />
                      <span className='absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs'>
                        <Check className='w-3 h-3 stroke-[3]' />
                      </span>
                    </div>

                    {/* Clean Typography */}
                    <div className='space-y-1.5'>
                      <h3 className='text-base font-semibold text-foreground tracking-tight'>
                        Alles erledigt
                      </h3>
                      <p className='text-xs text-muted-foreground leading-relaxed'>
                        There are currently no active notifications. New orders, low stock warnings, and payment receipts will appear here in real time.
                      </p>
                    </div>

                    {/* Live System Status Badges */}
                    <div className='pt-1 flex flex-wrap items-center justify-center gap-2'>
                      <span className='inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-muted/40 border border-border/60 text-muted-foreground'>
                        <span className='w-1.5 h-1.5 rounded-full bg-emerald-500' />
                        Orders Active
                      </span>
                      <span className='inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-muted/40 border border-border/60 text-muted-foreground'>
                        <span className='w-1.5 h-1.5 rounded-full bg-emerald-500' />
                        Bestandsüberwachung aktiv
                      </span>
                      <span className='inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-muted/40 border border-border/60 text-muted-foreground'>
                        <span className='w-1.5 h-1.5 rounded-full bg-emerald-500' />
                        Zahlungsgateway online
                      </span>
                    </div>

                    {/* Helpful Quick Navigation Actions */}
                    <div className='pt-2 border-t border-border/60 flex flex-wrap items-center justify-center gap-2'>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => onSelectTab('orders')}
                        className='h-8 text-xs font-medium cursor-pointer border-border/70 hover:bg-muted'
                      >
                        <ShoppingBag className='w-3.5 h-3.5 me-1.5 text-muted-foreground' />
                        View Orders
                      </Button>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => onSelectTab('products')}
                        className='h-8 text-xs font-medium cursor-pointer border-border/70 hover:bg-muted'
                      >
                        <Box className='w-3.5 h-3.5 me-1.5 text-muted-foreground' />
                        Katalog &amp; Bestand
                      </Button>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => onSelectTab('settings')}
                        className='h-8 text-xs font-medium cursor-pointer border-border/70 hover:bg-muted'
                      >
                        <ShieldCheck className='w-3.5 h-3.5 me-1.5 text-muted-foreground' />
                        Shop-Einstellungen
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className='divide-y divide-border/60'>
                    {filteredNotifications.map((notif) => {
                      const getCategoryIcon = () => {
                        switch (notif.category) {
                          case 'orders':
                            return <ShoppingBag className='w-4 h-4 text-emerald-600 dark:text-emerald-400' />
                          case 'inventory':
                            return <Box className='w-4 h-4 text-amber-600 dark:text-amber-400' />
                          case 'customers':
                            return <Users className='w-4 h-4 text-blue-600 dark:text-blue-400' />
                          case 'discounts':
                            return <Percent className='w-4 h-4 text-rose-600 dark:text-rose-400' />
                          case 'system':
                          default:
                            return <ShieldCheck className='w-4 h-4 text-purple-600 dark:text-purple-400' />
                        }
                      }

                      const getCategoryBg = () => {
                        switch (notif.category) {
                          case 'orders':
                            return 'bg-emerald-500/10'
                          case 'inventory':
                            return 'bg-amber-500/10'
                          case 'customers':
                            return 'bg-blue-500/10'
                          case 'discounts':
                            return 'bg-rose-500/10'
                          case 'system':
                          default:
                            return 'bg-purple-500/10'
                        }
                      }

                      return (
                        <div
                          key={notif.id}
                          className={`p-4 transition-colors ${
                            notif.unread
                              ? 'bg-card'
                              : 'bg-muted/10 opacity-80'
                          }`}
                        >
                          <div className='flex items-start justify-between gap-3 sm:gap-4'>
                            {/* Icon */}
                            <div
                              className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${getCategoryBg()}`}
                            >
                              {getCategoryIcon()}
                            </div>

                            {/* Content */}
                            <div className='flex-1 min-w-0 space-y-1'>
                              <div className='flex items-center gap-2 flex-wrap'>
                                <h4 className='text-sm font-semibold text-foreground truncate'>
                                  {notif.title}
                                </h4>
                                {notif.badge && (
                                  <Badge variant='outline' className='text-[10px] font-medium'>
                                    {notif.badge}
                                  </Badge>
                                )}
                                {notif.unread && (
                                  <span className='size-2 rounded-full bg-primary shrink-0' />
                                )}
                              </div>
                              <p className='text-xs text-muted-foreground leading-relaxed'>
                                {notif.message}
                              </p>
                              <div className='text-[11px] text-muted-foreground/80 flex items-center gap-1.5 pt-1 font-mono'>
                                <Clock className='w-3 h-3' />
                                <span>{notif.time}</span>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className='flex items-center gap-2 shrink-0 self-center'>
                              {notif.actionTab && (
                                <Button
                                  size='sm'
                                  variant='outline'
                                  onClick={() => onSelectTab(notif.actionTab!)}
                                  className='h-8 text-xs font-medium cursor-pointer hover:bg-primary hover:text-primary-foreground'
                                >
                                  {notif.actionLabel || 'Details'}
                                  <ArrowUpRight className='w-3.5 h-3.5 ms-1' />
                                </Button>
                              )}
                              <button
                                type='button'
                                onClick={() => toggleNotificationRead(notif.id)}
                                title={notif.unread ? 'Als gelesen markieren' : 'Als ungelesen markieren'}
                                className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-colors cursor-pointer ${
                                  notif.unread
                                    ? 'border-border/70 hover:bg-muted text-muted-foreground hover:text-foreground'
                                    : 'border-transparent text-primary bg-primary/10'
                                }`}
                              >
                                <Check className='w-3.5 h-3.5' />
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </Main>
    </>
  )
}
