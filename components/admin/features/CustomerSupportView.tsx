'use client'

import React, { useState, useMemo, useEffect, useCallback } from 'react'
import {
  Headphones,
  Search,
  Download,
  ShoppingBag,
  Mail,
  MoreHorizontal,
  ExternalLink,
  Copy,
  Check,
  Calendar,
  Clock,
  Phone,
  User,
  AlertCircle,
  CheckCircle2,
  Trash2,
  RefreshCw,
  MessageSquare,
  Sparkles,
  Save,
  Filter,
  X,
  Send,
  SlidersHorizontal,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
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
import {
  SupportTicket,
  SupportTicketStatus,
  SupportTicketPriority,
  TICKET_CATEGORIES,
} from '@/lib/supportTicketTypes'
import { notifyAdmin } from '@/app/admin/components/AdminToast'

export interface CustomerSupportViewProps {
  onSelectTab?: (tabId: string) => void
  onLogout?: () => void
}

export function CustomerSupportView({
  onSelectTab,
  onLogout,
}: CustomerSupportViewProps) {
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null)
  const [adminNoteInput, setAdminNoteInput] = useState('')
  const [savingNote, setSavingNote] = useState(false)
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null)

  const adminTz = useMemo(() => getAdminTimeZone(), [])

  // Fetch tickets from API
  const fetchTickets = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true)
    else setRefreshing(true)

    try {
      const res = await fetch(`/api/support-tickets?t=${Date.now()}`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      if (Array.isArray(data)) {
        setTickets(data)
      }
    } catch (err: any) {
      console.warn('[CustomerSupportView] Fetch error:', err)
      notifyAdmin('error', 'Loading Error', 'Support tickets could not be loaded.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchTickets()
  }, [fetchTickets])

  // Sync selected ticket notes
  useEffect(() => {
    if (selectedTicket) {
      setAdminNoteInput(selectedTicket.admin_notes || '')
    }
  }, [selectedTicket])

  // Status badge styling helper
  const getStatusBadge = (status: SupportTicketStatus) => {
    switch (status) {
      case 'open':
        return (
          <span className='inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-700'>
            <span className='size-1.5 rounded-full bg-amber-500 animate-pulse' />
            Offen
          </span>
        )
      case 'in_progress':
        return (
          <span className='inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-300 dark:border-blue-700'>
            <span className='size-1.5 rounded-full bg-blue-500' />
            In Progress
          </span>
        )
      case 'resolved':
        return (
          <span className='inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'>
            <CheckCircle2 size={12} className='text-emerald-600 dark:text-emerald-400' />
            Gelöst
          </span>
        )
      case 'closed':
        return (
          <span className='inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 border border-neutral-300 dark:border-neutral-700'>
            Closed
          </span>
        )
      default:
        return <Badge variant='outline'>{status}</Badge>
    }
  }

  // Priority badge styling
  const getPriorityBadge = (priority: SupportTicketPriority) => {
    switch (priority) {
      case 'urgent':
        return (
          <span className='px-2 py-0.5 text-[10px] font-extrabold uppercase rounded bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300 border border-red-300'>
            Dringend
          </span>
        )
      case 'low':
        return (
          <span className='px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'>
            Niedrig
          </span>
        )
      default:
        return (
          <span className='px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'>
            Normal
          </span>
        )
    }
  }

  // Update Ticket Status
  const handleUpdateStatus = async (ticketId: string, newStatus: SupportTicketStatus) => {
    setUpdatingStatusId(ticketId)
    try {
      const res = await fetch('/api/support-tickets', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: ticketId, status: newStatus }),
      })
      if (!res.ok) throw new Error('Status konnte nicht geändert werden.')

      setTickets((prev) =>
        prev.map((t) => (t.id === ticketId ? { ...t, status: newStatus, updated_at: new Date().toISOString() } : t))
      )

      if (selectedTicket && selectedTicket.id === ticketId) {
        setSelectedTicket((prev) => (prev ? { ...prev, status: newStatus } : null))
      }

      notifyAdmin('success', 'Status aktualisiert', `Ticket ${ticketId} ist jetzt "${newStatus}".`)
    } catch (err: any) {
      notifyAdmin('error', 'Error', err.message || 'Could not update ticket status.')
    } finally {
      setUpdatingStatusId(null)
    }
  }

  // Update Ticket Priority
  const handleUpdatePriority = async (ticketId: string, newPriority: SupportTicketPriority) => {
    try {
      const res = await fetch('/api/support-tickets', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: ticketId, priority: newPriority }),
      })
      if (!res.ok) throw new Error('Priorität konnte nicht geändert werden.')

      setTickets((prev) =>
        prev.map((t) => (t.id === ticketId ? { ...t, priority: newPriority } : t))
      )

      if (selectedTicket && selectedTicket.id === ticketId) {
        setSelectedTicket((prev) => (prev ? { ...prev, priority: newPriority } : null))
      }

      notifyAdmin('success', 'Priorität aktualisiert', `Ticket-Priorität geändert auf "${newPriority}".`)
    } catch (err: any) {
      notifyAdmin('error', 'Error', err.message || 'Could not update ticket priority.')
    }
  }

  // Save Admin Note
  const handleSaveAdminNote = async () => {
    if (!selectedTicket) return
    setSavingNote(true)
    try {
      const res = await fetch('/api/support-tickets', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedTicket.id,
          admin_notes: adminNoteInput,
        }),
      })
      if (!res.ok) throw new Error('Could not save note.')

      setTickets((prev) =>
        prev.map((t) =>
          t.id === selectedTicket.id
            ? { ...t, admin_notes: adminNoteInput, updated_at: new Date().toISOString() }
            : t
        )
      )

      setSelectedTicket((prev) => (prev ? { ...prev, admin_notes: adminNoteInput } : null))
      notifyAdmin('success', 'Note Saved', 'Internal note saved successfully.')
    } catch (err: any) {
      notifyAdmin('error', 'Error', err.message || 'Could not save note.')
    } finally {
      setSavingNote(false)
    }
  }

  // Delete Ticket
  const handleDeleteTicket = async (ticketId: string) => {
    if (!confirm(`Are you sure you want to permanently delete ticket ${ticketId}?`)) {
      return
    }

    try {
      const res = await fetch(`/api/support-tickets?id=${encodeURIComponent(ticketId)}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Ticket konnte nicht gelöscht werden.')

      setTickets((prev) => prev.filter((t) => t.id !== ticketId))
      if (selectedTicket && selectedTicket.id === ticketId) {
        setSelectedTicket(null)
      }
      notifyAdmin('success', 'Ticket gelöscht', `Ticket ${ticketId} wurde entfernt.`)
    } catch (err: any) {
      notifyAdmin('error', 'Error', err.message || 'Delete failed.')
    }
  }

  // Copy helper
  const copyToClipboard = (text: string, identifier: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(identifier)
    setTimeout(() => setCopiedId(null), 2000)
  }

  // Filtered Tickets
  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      // Status filter
      if (statusFilter !== 'all' && t.status !== statusFilter) {
        return false
      }
      // Category filter
      if (categoryFilter !== 'all' && t.category !== categoryFilter) {
        return false
      }
      // Search query
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase().trim()
        const match =
          (t.ticket_number || '').toLowerCase().includes(q) ||
          (t.order_id || '').toLowerCase().includes(q) ||
          (t.name || '').toLowerCase().includes(q) ||
          (t.email || '').toLowerCase().includes(q) ||
          (t.phone || '').toLowerCase().includes(q) ||
          (t.subject || '').toLowerCase().includes(q) ||
          (t.speaker_model || '').toLowerCase().includes(q) ||
          (t.message || '').toLowerCase().includes(q)
        if (!match) return false
      }
      return true
    })
  }, [tickets, statusFilter, categoryFilter, searchTerm])

  // Statistics counts
  const stats = useMemo(() => {
    const total = tickets.length
    const open = tickets.filter((t) => t.status === 'open').length
    const inProgress = tickets.filter((t) => t.status === 'in_progress').length
    const resolved = tickets.filter((t) => t.status === 'resolved').length
    const closed = tickets.filter((t) => t.status === 'closed').length
    return { total, open, inProgress, resolved, closed }
  }, [tickets])

  // Export CSV
  const handleExportCSV = useCallback(() => {
    if (filteredTickets.length === 0) {
      alert('No ticket data available to export.')
      return
    }

    const headers = [
      'Ticket-Nummer',
      'Status',
      'Priorität',
      'Bestellnummer',
      'Customer Name',
      'E-Mail',
      'Telefon',
      'Kategorie',
      'Lautsprechermodell',
      'Subject',
      'Erstellt am',
    ]

    const rows = filteredTickets.map((t) => [
      `"${t.ticket_number}"`,
      `"${t.status}"`,
      `"${t.priority || 'normal'}"`,
      `"${(t.order_id || '').replace(/"/g, '""')}"`,
      `"${t.name.replace(/"/g, '""')}"`,
      `"${t.email.replace(/"/g, '""')}"`,
      `"${(t.phone || '').replace(/"/g, '""')}"`,
      `"${t.category.replace(/"/g, '""')}"`,
      `"${(t.speaker_model || '').replace(/"/g, '""')}"`,
      `"${(t.subject || '').replace(/"/g, '""')}"`,
      `"${t.created_at}"`,
    ])

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `wastram-support-tickets-${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, [filteredTickets])

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
            <div className='flex items-center gap-2'>
              <h2 className='text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground'>
                Customer Support
              </h2>
              {stats.open > 0 && (
                <span className='px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-white animate-pulse'>
                  {stats.open} {stats.open === 1 ? 'Open Ticket' : 'Open Tickets'}
                </span>
              )}
            </div>
            <p className='text-xs sm:text-sm text-muted-foreground mt-1'>
              Manage wholesale inquiries, order tracking tickets, and boutique support centrally
            </p>
          </div>

          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => fetchTickets(true)}
              disabled={refreshing}
              className='cursor-pointer text-xs h-9'
            >
              <RefreshCw className={`size-3.5 mr-1.5 ${refreshing ? 'animate-spin' : ''}`} />Refresh</Button>
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
                onClick={() => onSelectTab('orders')}
                className='cursor-pointer text-xs h-9 bg-[#3628e6] hover:bg-[#2418b3] text-white'
              >
                <ShoppingBag className='size-3.5 mr-1.5' />
                Go to Orders
              </Button>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4'>
          <div
            onClick={() => setStatusFilter('all')}
            className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
              statusFilter === 'all'
                ? 'border-[#3628e6] bg-[#3628e6]/5 shadow-xs'
                : 'border-border bg-card hover:border-neutral-400'
            }`}
          >
            <div className='flex items-center justify-between text-muted-foreground text-xs font-bold uppercase'>
              <span>Alle Tickets</span>
              <Headphones size={15} />
            </div>
            <p className='text-2xl sm:text-3xl font-mono font-black mt-1 text-foreground'>
              {stats.total}
            </p>
          </div>

          <div
            onClick={() => setStatusFilter('open')}
            className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
              statusFilter === 'open'
                ? 'border-amber-500 bg-amber-500/10 shadow-xs'
                : 'border-border bg-card hover:border-amber-300'
            }`}
          >
            <div className='flex items-center justify-between text-amber-600 dark:text-amber-400 text-xs font-bold uppercase'>
              <span>Open</span>
              <span className='size-2 rounded-full bg-amber-500 animate-pulse' />
            </div>
            <p className='text-2xl sm:text-3xl font-mono font-black mt-1 text-amber-600 dark:text-amber-400'>
              {stats.open}
            </p>
          </div>

          <div
            onClick={() => setStatusFilter('in_progress')}
            className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
              statusFilter === 'in_progress'
                ? 'border-blue-500 bg-blue-500/10 shadow-xs'
                : 'border-border bg-card hover:border-blue-300'
            }`}
          >
            <div className='flex items-center justify-between text-blue-600 dark:text-blue-400 text-xs font-bold uppercase'>
              <span>In Progress</span>
              <Clock size={15} />
            </div>
            <p className='text-2xl sm:text-3xl font-mono font-black mt-1 text-blue-600 dark:text-blue-400'>
              {stats.inProgress}
            </p>
          </div>

          <div
            onClick={() => setStatusFilter('resolved')}
            className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
              statusFilter === 'resolved'
                ? 'border-emerald-500 bg-emerald-500/10 shadow-xs'
                : 'border-border bg-card hover:border-emerald-300'
            }`}
          >
            <div className='flex items-center justify-between text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase'>
              <span>Gelöst</span>
              <CheckCircle2 size={15} />
            </div>
            <p className='text-2xl sm:text-3xl font-mono font-black mt-1 text-emerald-600 dark:text-emerald-400'>
              {stats.resolved}
            </p>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className='flex flex-wrap items-center gap-3 p-3 bg-card border-2 border-border rounded-xl'>
          <div className='relative flex-1 min-w-[220px]'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground' />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder='Suche nach Ticket-ID, Bestellnummer, Name, E-Mail...'
              className='pl-9 h-9 text-xs border-border bg-background'
            />
            {searchTerm && (
              <button
                type='button'
                onClick={() => setSearchTerm('')}
                className='absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Status Select */}
          <div className='flex items-center gap-1.5'>
            <span className='text-xs font-bold text-muted-foreground uppercase tracking-wider text-[11px]'>
              Status:
            </span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className='h-9 px-3 rounded-lg border-2 border-border bg-background text-xs font-medium cursor-pointer focus:outline-none focus:border-[#3628e6]'
            >
              <option value='all'>Alle Status ({tickets.length})</option>
              <option value='open'>Open Only ({stats.open})</option>
              <option value='in_progress'>In Progress ({stats.inProgress})</option>
              <option value='resolved'>Gelöst ({stats.resolved})</option>
              <option value='closed'>Closed ({stats.closed})</option>
            </select>
          </div>

          {/* Category Select */}
          <div className='flex items-center gap-1.5'>
            <span className='text-xs font-bold text-muted-foreground uppercase tracking-wider text-[11px]'>
              Kategorie:
            </span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className='h-9 px-3 rounded-lg border-2 border-border bg-background text-xs font-medium cursor-pointer focus:outline-none focus:border-[#3628e6]'
            >
              <option value='all'>All Categories</option>
              {TICKET_CATEGORIES.map((c) => (
                <option key={c.id} value={c.labelDe}>
                  {c.labelDe}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tickets Table */}
        <div className='rounded-xl border-2 border-border bg-card overflow-hidden'>
          {loading ? (
            <div className='py-16 text-center text-muted-foreground space-y-2'>
              <RefreshCw className='size-6 animate-spin mx-auto text-[#3628e6]' />
              <p className='text-xs font-medium'>Loading support tickets...</p>
            </div>
          ) : filteredTickets.length === 0 ? (
            <div className='py-16 text-center text-muted-foreground space-y-3 px-4'>
              <div className='w-12 h-12 rounded-xl bg-muted border border-border flex items-center justify-center mx-auto text-muted-foreground'>
                <Headphones size={22} />
              </div>
              <h3 className='text-base font-bold text-foreground'>No support tickets found</h3>
              <p className='text-xs max-w-sm mx-auto'>
                {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all'
                  ? 'No tickets match your filter criteria.'
                  : 'No customer support inquiries yet. Inquiries from the contact page will appear here immediately.'}
              </p>
              {(searchTerm || statusFilter !== 'all' || categoryFilter !== 'all') && (
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => {
                    setSearchTerm('')
                    setStatusFilter('all')
                    setCategoryFilter('all')
                  }}
                  className='text-xs'
                >
                  Reset Filters
                </Button>
              )}
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <Table>
                <TableHeader>
                  <TableRow className='bg-muted/50 hover:bg-muted/50'>
                    <TableHead className='font-bold text-xs uppercase tracking-wider w-[140px]'>
                      Ticket-ID
                    </TableHead>
                    <TableHead className='font-bold text-xs uppercase tracking-wider w-[120px]'>
                      Status
                    </TableHead>
                    <TableHead className='font-bold text-xs uppercase tracking-wider'>Customer</TableHead>
                    <TableHead className='font-bold text-xs uppercase tracking-wider'>
                      Bestellnummer
                    </TableHead>
                    <TableHead className='font-bold text-xs uppercase tracking-wider'>
                      Category & Subject
                    </TableHead>
                    <TableHead className='font-bold text-xs uppercase tracking-wider w-[140px]'>
                      Erstellt am
                    </TableHead>
                    <TableHead className='font-bold text-xs uppercase tracking-wider text-right w-[100px]'>
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTickets.map((ticket) => {
                    const parsedDate = parseOrderTimestamp(ticket.created_at)
                    const formattedDate = parsedDate
                      ? formatAdminOrderDateTime(parsedDate, adminTz)
                      : { date: ticket.created_at?.slice(0, 10) || '', time: '' }

                    return (
                      <TableRow
                        key={ticket.id}
                        className='hover:bg-muted/40 cursor-pointer'
                        onClick={() => setSelectedTicket(ticket)}
                      >
                        {/* Ticket Number */}
                        <TableCell className='font-mono font-bold text-xs'>
                          <div className='flex items-center gap-1.5'>
                            <span className='text-foreground'>{ticket.ticket_number}</span>
                            <button
                              type='button'
                              onClick={(e) => {
                                e.stopPropagation()
                                copyToClipboard(ticket.ticket_number, ticket.ticket_number)
                              }}
                              className='text-muted-foreground hover:text-foreground p-0.5 rounded'
                              title='Nummer kopieren'
                            >
                              {copiedId === ticket.ticket_number ? (
                                <Check size={13} className='text-green-600' />
                              ) : (
                                <Copy size={13} />
                              )}
                            </button>
                          </div>
                          {ticket.priority && ticket.priority !== 'normal' && (
                            <div className='mt-1'>{getPriorityBadge(ticket.priority)}</div>
                          )}
                        </TableCell>

                        {/* Status */}
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button
                                type='button'
                                disabled={updatingStatusId === ticket.id}
                                className='cursor-pointer text-left'
                              >
                                {getStatusBadge(ticket.status)}
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align='start' className='text-xs'>
                              <DropdownMenuItem
                                onClick={() => handleUpdateStatus(ticket.id, 'open')}
                                className='gap-2 cursor-pointer'
                              >
                                <span className='size-2 rounded-full bg-amber-500' />
                                Offen
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleUpdateStatus(ticket.id, 'in_progress')}
                                className='gap-2 cursor-pointer'
                              >
                                <span className='size-2 rounded-full bg-blue-500' />
                                In Progress
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleUpdateStatus(ticket.id, 'resolved')}
                                className='gap-2 cursor-pointer'
                              >
                                <CheckCircle2 size={13} className='text-emerald-500' />
                                Gelöst
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleUpdateStatus(ticket.id, 'closed')}
                                className='gap-2 cursor-pointer'
                              >
                                <span className='size-2 rounded-full bg-neutral-400' />
                                Closed
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>

                        {/* Customer */}
                        <TableCell>
                          <div className='font-bold text-foreground text-xs leading-tight'>
                            {ticket.name}
                          </div>
                          <div className='flex items-center gap-1 text-[11px] text-muted-foreground mt-0.5'>
                            <a
                              href={`mailto:${ticket.email}?subject=Re: [${ticket.ticket_number}] ${ticket.subject}`}
                              onClick={(e) => e.stopPropagation()}
                              className='hover:underline hover:text-[#3628e6] font-mono'
                            >
                              {ticket.email}
                            </a>
                            <button
                              type='button'
                              onClick={(e) => {
                                e.stopPropagation()
                                copyToClipboard(ticket.email, ticket.email)
                              }}
                              className='p-0.5 hover:text-foreground'
                            >
                              {copiedId === ticket.email ? (
                                <Check size={11} className='text-green-600' />
                              ) : (
                                <Copy size={11} />
                              )}
                            </button>
                          </div>
                          {ticket.phone && (
                            <div className='text-[11px] text-muted-foreground font-mono mt-0.5'>
                              {ticket.phone}
                            </div>
                          )}
                        </TableCell>

                        {/* Order ID */}
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          {ticket.order_id ? (
                            <div className='space-y-1'>
                              <div className='inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-muted border border-border text-xs font-mono font-bold text-foreground'>
                                <ShoppingBag size={12} className='text-[#3628e6]' />
                                <span>{ticket.order_id}</span>
                                <button
                                  type='button'
                                  onClick={() => copyToClipboard(ticket.order_id!, ticket.order_id!)}
                                  className='p-0.5 text-muted-foreground hover:text-foreground'
                                  title='Bestellnummer kopieren'
                                >
                                  {copiedId === ticket.order_id ? (
                                    <Check size={12} className='text-green-600' />
                                  ) : (
                                    <Copy size={12} />
                                  )}
                                </button>
                              </div>
                              {onSelectTab && (
                                <div>
                                  <button
                                    type='button'
                                    onClick={() => onSelectTab('orders')}
                                    className='text-[10px] text-[#3628e6] hover:underline inline-flex items-center gap-0.5 font-bold cursor-pointer'
                                  >
                                    <span>Open Order</span>
                                    <ExternalLink size={10} />
                                  </button>
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className='text-muted-foreground text-xs'>—</span>
                          )}
                        </TableCell>

                        {/* Category & Subject */}
                        <TableCell>
                          <div className='text-xs font-semibold text-foreground line-clamp-1'>
                            {ticket.category}
                          </div>
                          <div className='text-xs text-muted-foreground line-clamp-1 mt-0.5 font-medium'>
                            {ticket.subject}
                          </div>
                          {ticket.speaker_model && (
                            <div className='text-[11px] text-[#3628e6] font-medium mt-0.5 line-clamp-1'>
                              Modell: {ticket.speaker_model}
                            </div>
                          )}
                        </TableCell>

                        {/* Created At */}
                        <TableCell className='text-xs text-muted-foreground font-mono'>
                          <div>{formattedDate.date}</div>
                          <div className='text-[10px] text-muted-foreground/70'>
                            {formattedDate.time}
                          </div>
                        </TableCell>

                        {/* Actions */}
                        <TableCell className='text-right' onClick={(e) => e.stopPropagation()}>
                          <div className='flex items-center justify-end gap-1'>
                            <Button
                              variant='ghost'
                              size='sm'
                              onClick={() => setSelectedTicket(ticket)}
                              className='h-8 text-xs cursor-pointer font-bold'
                            >
                              Details
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant='ghost' size='sm' className='h-8 w-8 p-0 cursor-pointer'>
                                  <MoreHorizontal size={14} />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align='end' className='text-xs'>
                                <DropdownMenuItem
                                  asChild
                                  className='cursor-pointer'
                                >
                                  <a
                                    href={`mailto:${ticket.email}?subject=Re: [${ticket.ticket_number}] ${ticket.subject}`}
                                  >
                                    <Mail size={13} className='mr-2' />
                                    Per E-Mail antworten
                                  </a>
                                </DropdownMenuItem>
                                {ticket.order_id && onSelectTab && (
                                  <DropdownMenuItem
                                    onClick={() => onSelectTab('orders')}
                                    className='cursor-pointer'
                                  >
                                    <ShoppingBag size={13} className='mr-2' />
                                    Search in orders
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => handleDeleteTicket(ticket.id)}
                                  className='text-red-600 focus:text-red-600 cursor-pointer'
                                >
                                  <Trash2 size={13} className='mr-2' />
                                  Delete Ticket
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        {/* Ticket Details Slide-Over Drawer / Modal */}
        {selectedTicket && (
          <div
            className='fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-end'
            onClick={() => setSelectedTicket(null)}
          >
            <div
              className='w-full max-w-xl h-full bg-card border-l-2 border-border shadow-2xl p-6 overflow-y-auto space-y-6 flex flex-col animate-in slide-in-from-right duration-200'
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drawer Header */}
              <div className='flex items-start justify-between pb-4 border-b border-border'>
                <div className='space-y-1'>
                  <div className='flex items-center gap-2'>
                    <span className='font-mono font-black text-xl text-foreground'>
                      {selectedTicket.ticket_number}
                    </span>
                    {getStatusBadge(selectedTicket.status)}
                  </div>
                  <p className='text-xs text-muted-foreground'>
                    Eingegangen am{' '}
                    {selectedTicket.created_at
                      ? new Date(selectedTicket.created_at).toLocaleString('de-DE')
                      : '—'}
                  </p>
                </div>
                <button
                  type='button'
                  onClick={() => setSelectedTicket(null)}
                  className='p-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer'
                >
                  <X size={18} />
                </button>
              </div>

              {/* Status & Priority Controls */}
              <div className='grid grid-cols-2 gap-3 p-3 bg-muted/40 rounded-xl border border-border'>
                <div>
                  <label className='text-[11px] font-bold uppercase text-muted-foreground block mb-1'>
                    Status anpassen:
                  </label>
                  <select
                    value={selectedTicket.status}
                    onChange={(e) =>
                      handleUpdateStatus(selectedTicket.id, e.target.value as SupportTicketStatus)
                    }
                    className='w-full h-8 px-2.5 rounded-md border border-border bg-background text-xs font-semibold cursor-pointer'
                  >
                    <option value='open'>Open</option>
                    <option value='in_progress'>In Progress</option>
                    <option value='resolved'>Gelöst</option>
                    <option value='closed'>Closed</option>
                  </select>
                </div>

                <div>
                  <label className='text-[11px] font-bold uppercase text-muted-foreground block mb-1'>
                    Priorität:
                  </label>
                  <select
                    value={selectedTicket.priority || 'normal'}
                    onChange={(e) =>
                      handleUpdatePriority(
                        selectedTicket.id,
                        e.target.value as SupportTicketPriority
                      )
                    }
                    className='w-full h-8 px-2.5 rounded-md border border-border bg-background text-xs font-semibold cursor-pointer'
                  >
                    <option value='normal'>Normal</option>
                    <option value='urgent'>Urgent</option>
                    <option value='low'>Low</option>
                  </select>
                </div>
              </div>

              {/* Customer Contact Box */}
              <div className='p-4 rounded-xl border border-border bg-card space-y-3'>
                <h4 className='text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5'>
                  <User size={14} />
                  <span>Customer Information</span>
                </h4>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs'>
                  <div>
                    <span className='text-muted-foreground block text-[11px]'>Name:</span>
                    <span className='font-bold text-foreground'>{selectedTicket.name}</span>
                  </div>
                  <div>
                    <span className='text-muted-foreground block text-[11px]'>E-Mail:</span>
                    <a
                      href={`mailto:${selectedTicket.email}?subject=Re: [${selectedTicket.ticket_number}] ${selectedTicket.subject}`}
                      className='font-bold text-[#3628e6] hover:underline font-mono'
                    >
                      {selectedTicket.email}
                    </a>
                  </div>
                  {selectedTicket.phone && (
                    <div>
                      <span className='text-muted-foreground block text-[11px]'>Telefon:</span>
                      <a
                        href={`tel:${selectedTicket.phone}`}
                        className='font-mono font-medium hover:underline'
                      >
                        {selectedTicket.phone}
                      </a>
                    </div>
                  )}
                  {selectedTicket.order_id && (
                    <div>
                      <span className='text-muted-foreground block text-[11px]'>Bestellnummer:</span>
                      <div className='flex items-center gap-1.5'>
                        <span className='font-mono font-bold text-foreground'>
                          {selectedTicket.order_id}
                        </span>
                        {onSelectTab && (
                          <button
                            type='button'
                            onClick={() => {
                              setSelectedTicket(null)
                              onSelectTab('orders')
                            }}
                            className='text-[10px] text-[#3628e6] hover:underline font-bold'
                          >
                            [View Order]
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Inquiry Details */}
              <div className='space-y-3'>
                <div className='flex items-center justify-between'>
                  <span className='text-xs font-bold uppercase tracking-wider text-muted-foreground'>
                    Kategorie: {selectedTicket.category}
                  </span>
                  {selectedTicket.speaker_model && (
                    <span className='text-xs font-bold text-[#3628e6] bg-[#3628e6]/10 px-2 py-0.5 rounded'>
                      Modell: {selectedTicket.speaker_model}
                    </span>
                  )}
                </div>

                <div className='p-4 rounded-xl border border-border bg-muted/20 space-y-2'>
                  <h5 className='text-sm font-bold text-foreground'>
                    {selectedTicket.subject}
                  </h5>
                  <div className='text-xs text-foreground/90 whitespace-pre-wrap leading-relaxed font-sans'>
                    {selectedTicket.message}
                  </div>
                </div>
              </div>

              {/* Internal Admin Notes */}
              <div className='space-y-2'>
                <label className='text-xs font-bold uppercase tracking-wider text-muted-foreground block'>
                  Internal Notes (visible only to Wastram Admin):
                </label>
                <textarea
                  rows={4}
                  value={adminNoteInput}
                  onChange={(e) => setAdminNoteInput(e.target.value)}
                  placeholder='Add internal notes (e.g. phone call notes, tracking numbers, boutique customization details)...'
                  className='w-full p-3 rounded-xl border border-border bg-background text-xs focus:outline-none focus:border-[#3628e6] leading-relaxed'
                />
                <Button
                  size='sm'
                  onClick={handleSaveAdminNote}
                  disabled={savingNote}
                  className='cursor-pointer text-xs h-8 bg-[#3628e6] hover:bg-[#2418b3] text-white'
                >
                  <Save className='size-3 mr-1.5' />
                  {savingNote ? 'Saving note...' : 'Save Note'}
                </Button>
              </div>

              {/* Actions Footer */}
              <div className='pt-4 border-t border-border mt-auto flex flex-wrap items-center justify-between gap-3'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => handleDeleteTicket(selectedTicket.id)}
                  className='text-xs text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer h-9'
                >
                  <Trash2 className='size-3.5 mr-1.5' />
                  Delete Ticket
                </Button>

                <div className='flex items-center gap-2'>
                  <Button
                    asChild
                    size='sm'
                    className='text-xs bg-[#3628e6] hover:bg-[#2418b3] text-white cursor-pointer h-9'
                  >
                    <a
                      href={`mailto:${selectedTicket.email}?subject=Re: [${selectedTicket.ticket_number}] ${selectedTicket.subject}`}
                    >
                      <Mail className='size-3.5 mr-1.5' />
                      Per E-Mail antworten
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Main>
    </>
  )
}
