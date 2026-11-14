'use client'

import React, { useState, useEffect } from 'react'
import {
  Megaphone,
  BookOpen,
  Sparkles,
  Plus,
  Trash2,
  Edit3,
  Save,
  CheckCircle2,
  Loader2,
  ExternalLink,
  Tag,
  Calendar,
  User,
  Clock,
  Layers,
  FileText,
  AlertCircle,
  Eye,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Header } from '@/components/admin/layout/Header'
import { Main } from '@/components/admin/layout/Main'
import { Search } from '@/components/admin/Search'
import { ThemeSwitch } from '@/components/admin/ThemeSwitch'
import { ConfigDrawer } from '@/components/admin/ConfigDrawer'
import { notifyAdmin } from '@/app/admin/components/AdminToast'
import { cn } from '@/lib/utils'

interface StoreSettingsViewProps {
  subTab?: 'announcements' | 'blogs' | 'updates' | string
  onSelectTab?: (tabId: string) => void
}

interface Announcement {
  id: string
  tag: string
  text: string
  link?: string
  active: boolean
  order: number
}

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  author: string
  category: string
  coverImage?: string
  status: 'published' | 'draft'
  publishedAt: string
  updatedAt: string
}

interface StoreUpdate {
  id: string
  title: string
  badge: string
  description: string
  date: string
  active: boolean
}

const SUB_TABS = [
  { id: 'announcements', label: 'Ankündigungen', icon: Megaphone, desc: 'Verwalten Sie die Ticker-Leiste und Werbebanner der Shopfront.' },
  { id: 'blogs', label: 'Journal & Stories', icon: BookOpen, desc: 'Create, publish and edit textile craft stories, design blogs, and artisan features.' },
  { id: 'updates', label: 'Aktualisierungen', icon: Sparkles, desc: 'Shop-Änderungsprotokoll, Mitteilungen über Neuzugänge und Werkstatt-Ankündigungen.' },
]

export function StoreSettingsView({ subTab = 'announcements', onSelectTab }: StoreSettingsViewProps) {
  const normalized = subTab.replace('store-', '') || 'announcements'
  const [activeTab, setActiveTab] = useState<'announcements' | 'blogs' | 'updates'>(
    normalized === 'blogs' ? 'blogs' : normalized === 'updates' ? 'updates' : 'announcements'
  )

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  // Data states
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [blogs, setBlogs] = useState<BlogPost[]>([])
  const [updates, setUpdates] = useState<StoreUpdate[]>([])

  // Modal / Form states for Adding / Editing items
  const [announcementModalOpen, setAnnouncementModalOpen] = useState(false)
  const [editingAnnId, setEditingAnnId] = useState<string | null>(null)
  const [annForm, setAnnForm] = useState({ tag: '', text: '', link: '', active: true })

  const [blogModalOpen, setBlogModalOpen] = useState(false)
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null)
  const [blogForm, setBlogForm] = useState({
    title: '',
    slug: '',
    category: 'Reparaturanleitung',
    author: 'Angelos Drampalis',
    coverImage: '',
    excerpt: '',
    content: '',
    status: 'published' as 'published' | 'draft',
  })

  const [updateModalOpen, setUpdateModalOpen] = useState(false)
  const [editingUpdateId, setEditingUpdateId] = useState<string | null>(null)
  const [updateForm, setUpdateForm] = useState({
    title: '',
    badge: 'Neue Ware',
    description: '',
    date: new Date().toISOString().split('T')[0],
    active: true,
  })

  // Sync subTab prop
  useEffect(() => {
    if (subTab) {
      const clean = subTab.replace('store-', '')
      if (clean === 'blogs' || clean === 'updates' || clean === 'announcements') {
        setActiveTab(clean)
      }
    }
  }, [subTab])

  // Fetch initial content
  useEffect(() => {
    let mounted = true
    fetch('/api/store-content?t=' + Date.now())
      .then(res => res.json())
      .then(data => {
        if (!mounted || !data) return
        if (Array.isArray(data.announcements)) setAnnouncements(data.announcements)
        if (Array.isArray(data.blogs)) setBlogs(data.blogs)
        if (Array.isArray(data.updates)) setUpdates(data.updates)
      })
      .catch(err => console.warn('Could not load store content:', err))
      .finally(() => { if (mounted) setLoading(false); })

    return () => { mounted = false }
  }, [])

  // Persist all data
  const handleSaveAll = async () => {
    setSaving(true)
    setSaveSuccess(false)
    try {
      const res = await fetch('/api/store-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          announcements,
          blogs,
          updates,
        }),
      })

      if (!res.ok) throw new Error('Server returned an error.')
      setSaveSuccess(true)
      setIsEditing(false)
      setTimeout(() => setSaveSuccess(false), 3500)
      notifyAdmin('success', 'Store Settings Saved', 'Announcements, stories, and updates successfully saved.')
    } catch (err: any) {
      console.error('Error saving store content:', err)
      notifyAdmin('error', 'Save Failed', err.message || 'Could not save store settings.')
    } finally {
      setSaving(false)
    }
  }

  // Announcement Handlers
  const openNewAnnouncement = () => {
    setEditingAnnId(null)
    setAnnForm({ tag: 'NEUE WARE:', text: '', link: '/products', active: true })
    setAnnouncementModalOpen(true)
  }

  const openEditAnnouncement = (item: Announcement) => {
    setEditingAnnId(item.id)
    setAnnForm({ tag: item.tag, text: item.text, link: item.link || '', active: item.active })
    setAnnouncementModalOpen(true)
  }

  const saveAnnouncementModal = () => {
    if (!annForm.text.trim()) {
      alert('Bitte geben Sie einen Ankündigungstext ein.')
      return
    }

    if (editingAnnId) {
      setAnnouncements(prev => prev.map(a => a.id === editingAnnId ? { ...a, ...annForm } : a))
    } else {
      const newAnn: Announcement = {
        id: `ann-${Date.now()}`,
        tag: annForm.tag || 'INFO:',
        text: annForm.text,
        link: annForm.link || undefined,
        active: annForm.active,
        order: announcements.length,
      }
      setAnnouncements(prev => [...prev, newAnn])
    }
    setAnnouncementModalOpen(false)
    setIsEditing(true)
    notifyAdmin('info', 'Updated', 'Announcement updated in list. Click Save Changes.')
  }

  const deleteAnnouncement = (id: string) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return
    setAnnouncements(prev => prev.filter(a => a.id !== id))
    setIsEditing(true)
  }

  const toggleAnnouncementActive = (id: string) => {
    setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, active: !a.active } : a))
    setIsEditing(true)
  }

  // Blog Handlers
  const openNewBlog = () => {
    setEditingBlogId(null)
    setBlogForm({
      title: '',
      slug: '',
      category: 'Speaker Restoration',
      author: 'Angelos Drampalis',
      coverImage: '',
      excerpt: '',
      content: '',
      status: 'published',
    })
    setBlogModalOpen(true)
  }

  const openEditBlog = (post: BlogPost) => {
    setEditingBlogId(post.id)
    setBlogForm({
      title: post.title,
      slug: post.slug,
      category: post.category,
      author: post.author,
      coverImage: post.coverImage || '',
      excerpt: post.excerpt,
      content: post.content,
      status: post.status,
    })
    setBlogModalOpen(true)
  }

  const saveBlogModal = () => {
    if (!blogForm.title.trim()) {
      alert('Please enter an article title.')
      return
    }

    const slug = blogForm.slug.trim() || blogForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    if (editingBlogId) {
      setBlogs(prev => prev.map(b => b.id === editingBlogId ? {
        ...b,
        ...blogForm,
        slug,
        updatedAt: new Date().toISOString().split('T')[0],
      } : b))
    } else {
      const newPost: BlogPost = {
        id: `blog-${Date.now()}`,
        ...blogForm,
        slug,
        publishedAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      }
      setBlogs(prev => [newPost, ...prev])
    }
    setBlogModalOpen(false)
    setIsEditing(true)
    notifyAdmin('info', 'Story Updated', 'Journal article updated. Click Save Changes.')
  }

  const deleteBlog = (id: string) => {
    if (!confirm('Are you sure you want to delete this story?')) return
    setBlogs(prev => prev.filter(b => b.id !== id))
    setIsEditing(true)
  }

  // Update Handlers
  const openNewUpdate = () => {
    setEditingUpdateId(null)
    setUpdateForm({
      title: '',
      badge: 'Neue Teile',
      description: '',
      date: new Date().toISOString().split('T')[0],
      active: true,
    })
    setUpdateModalOpen(true)
  }

  const openEditUpdate = (item: StoreUpdate) => {
    setEditingUpdateId(item.id)
    setUpdateForm({
      title: item.title,
      badge: item.badge,
      description: item.description,
      date: item.date,
      active: item.active,
    })
    setUpdateModalOpen(true)
  }

  const saveUpdateModal = () => {
    if (!updateForm.title.trim()) {
      alert('Bitte geben Sie einen Titel für die Aktualisierung ein.')
      return
    }

    if (editingUpdateId) {
      setUpdates(prev => prev.map(u => u.id === editingUpdateId ? { ...u, ...updateForm } : u))
    } else {
      const newUpd: StoreUpdate = {
        id: `upd-${Date.now()}`,
        ...updateForm,
      }
      setUpdates(prev => [newUpd, ...prev])
    }
    setUpdateModalOpen(false)
    setIsEditing(true)
    notifyAdmin('info', 'Update Added', 'Update added to list. Click Save Changes.')
  }

  const deleteUpdate = (id: string) => {
    if (!confirm('Are you sure you want to delete this update?')) return
    setUpdates(prev => prev.filter(u => u.id !== id))
    setIsEditing(true)
  }

  const currentTabInfo = SUB_TABS.find(t => t.id === activeTab)!

  if (loading) {
    return (
      <div className='flex items-center justify-center p-20 text-sm text-muted-foreground'>
        <Loader2 className='w-4 h-4 mr-2 animate-spin' /> Loading announcements &amp; store content...
      </div>
    )
  }

  return (
    <>
      <Header fixed>
        <div className='ms-auto flex items-center gap-2 sm:gap-4'>
          <Search />
          <ThemeSwitch />
          <ConfigDrawer />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col overflow-y-auto min-h-0 pb-16 font-sans text-foreground'>
        {/* Top Header */}
        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border'>
          <div>
            <h1 className='text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5'>
              <currentTabInfo.icon className='w-6 h-6 text-primary' />
              <span>Store Settings</span>
            </h1>
            <p className='text-xs sm:text-sm text-muted-foreground mt-1'>
              {currentTabInfo.desc}
            </p>
          </div>

          <div className='flex items-center gap-2 shrink-0'>
            <Button
              type='button'
              variant={isEditing ? 'default' : 'outline'}
              size='sm'
              onClick={() => setIsEditing(!isEditing)}
              className={cn(
                'h-8 text-xs gap-1.5 cursor-pointer font-medium transition-all',
                isEditing
                  ? 'bg-neutral-800 text-white hover:bg-neutral-900 border-neutral-800 dark:bg-neutral-200 dark:text-neutral-900'
                  : 'bg-background hover:bg-muted text-foreground border-border'
              )}
            >
              <Edit3 className='w-3.5 h-3.5' />
              <span>{isEditing ? 'Editing Mode' : 'Edit Settings'}</span>
            </Button>

            <Button
              type='button'
              onClick={handleSaveAll}
              disabled={saving}
              size='sm'
              className={cn(
                'h-8 text-xs gap-1.5 cursor-pointer font-medium transition-all shadow-2xs',
                saveSuccess
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-black hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-200 dark:text-black disabled:opacity-50'
              )}
            >
              {saving ? (
                <>
                  <Loader2 className='w-3.5 h-3.5 animate-spin' />
                  <span>Saving...</span>
                </>
              ) : saveSuccess ? (
                <>
                  <CheckCircle2 className='w-3.5 h-3.5' />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Save className='w-3.5 h-3.5' />
                  <span>Save Changes</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Sub-tab pills */}
        <div className='flex flex-wrap items-center gap-2 py-4 border-b border-border/60'>
          {SUB_TABS.map(tab => {
            const isActive = activeTab === tab.id
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                type='button'
                onClick={() => {
                  setActiveTab(tab.id as any)
                  if (onSelectTab) onSelectTab(`store-${tab.id}`)
                }}
                className={cn(
                  'inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border',
                  isActive
                    ? 'bg-neutral-900 text-white border-neutral-900 shadow-2xs dark:bg-white dark:text-neutral-900'
                    : 'bg-card hover:bg-muted text-muted-foreground hover:text-foreground border-border'
                )}
              >
                <Icon className='w-3.5 h-3.5' />
                <span>{tab.label}</span>
                {tab.id === 'announcements' && (
                  <span className='ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-primary/20 text-primary'>
                    {announcements.filter(a => a.active).length}
                  </span>
                )}
                {tab.id === 'blogs' && (
                  <span className='ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-primary/20 text-primary'>
                    {blogs.length}
                  </span>
                )}
                {tab.id === 'updates' && (
                  <span className='ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-primary/20 text-primary'>
                    {updates.length}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Content Panel */}
        <div className='pt-6 max-w-4xl space-y-6'>
          {saveSuccess && (
            <div className='p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs font-medium flex items-center gap-2 animate-fade-in'>
              <CheckCircle2 className='w-4 h-4 shrink-0' />
              <span>Store settings and content updated successfully!</span>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════
              1. ANNOUNCEMENTS TAB
             ════════════════════════════════════════════════════════════════ */}
          {activeTab === 'announcements' && (
            <div className='space-y-4'>
              <div className='flex items-center justify-between pb-2'>
                <div>
                  <h3 className='text-sm font-bold text-foreground'>Aktiver Ankündigungs-Ticker</h3>
                  <p className='text-xs text-muted-foreground'>Diese Ankündigungen rotieren ganz oben im Shop-Kopfbereich.</p>
                </div>
                <Button
                  type='button'
                  size='sm'
                  onClick={openNewAnnouncement}
                  className='h-8 text-xs gap-1.5 bg-black hover:bg-neutral-800 text-white dark:bg-white dark:text-black cursor-pointer shadow-2xs'
                >
                  <Plus className='w-3.5 h-3.5' />
                  <span>Add Announcement</span>
                </Button>
              </div>

              <div className='space-y-2.5'>
                {announcements.map((ann, idx) => (
                  <div
                    key={ann.id}
                    className={cn(
                      'flex items-center justify-between gap-3 p-3.5 rounded-xl border transition-all',
                      ann.active ? 'bg-card border-border' : 'bg-muted/40 border-border/50 opacity-60'
                    )}
                  >
                    <div className='flex items-center gap-3 flex-1 min-w-0'>
                      <span className='text-xs font-mono text-muted-foreground shrink-0'>#{idx + 1}</span>
                      <div className='min-w-0 flex-1 space-y-1'>
                        <div className='flex items-center gap-2'>
                          <Badge variant='outline' className='text-[10px] font-bold uppercase tracking-wider bg-primary/10 border-primary/20 text-primary'>
                            {ann.tag}
                          </Badge>
                          {ann.link && (
                            <span className='text-[10px] font-mono text-muted-foreground truncate'>
                              Link: {ann.link}
                            </span>
                          )}
                        </div>
                        <p className='text-xs text-foreground font-medium truncate'>
                          {ann.text}
                        </p>
                      </div>
                    </div>

                    <div className='flex items-center gap-3 shrink-0'>
                      <div className='flex items-center gap-1.5'>
                        <span className='text-[11px] text-muted-foreground'>{ann.active ? 'Aktiv' : 'Deaktiviert'}</span>
                        <Switch
                          checked={ann.active}
                          onCheckedChange={() => toggleAnnouncementActive(ann.id)}
                        />
                      </div>
                      <Button
                        type='button'
                        variant='ghost'
                        size='sm'
                        onClick={() => openEditAnnouncement(ann)}
                        className='h-7 w-7 p-0 cursor-pointer text-muted-foreground hover:text-foreground'
                      >
                        <Edit3 className='w-3.5 h-3.5' />
                      </Button>
                      <Button
                        type='button'
                        variant='ghost'
                        size='sm'
                        onClick={() => deleteAnnouncement(ann.id)}
                        className='h-7 w-7 p-0 cursor-pointer text-destructive hover:bg-destructive/10'
                      >
                        <Trash2 className='w-3.5 h-3.5' />
                      </Button>
                    </div>
                  </div>
                ))}

                {announcements.length === 0 && (
                  <div className='py-12 text-center rounded-xl border border-dashed border-border bg-muted/20'>
                    <Megaphone className='w-8 h-8 text-muted-foreground/40 mx-auto mb-2' />
                    <p className='text-xs font-medium text-muted-foreground'>No announcements yet. Click 'Add Announcement' to create one.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════
              2. BLOGS TAB
             ════════════════════════════════════════════════════════════════ */}
          {activeTab === 'blogs' && (
            <div className='space-y-4'>
              <div className='flex items-center justify-between pb-2'>
                <div>
                  <h3 className='text-sm font-bold text-foreground'>Store Blog Articles &amp; Lookbooks</h3>
                  <p className='text-xs text-muted-foreground'>Technische Anleitungen, Vintage-Audio-Restaurierungen und Lautsprecher-Reparaturen.</p>
                </div>
                <Button
                  type='button'
                  size='sm'
                  onClick={openNewBlog}
                  className='h-8 text-xs gap-1.5 bg-black hover:bg-neutral-800 text-white dark:bg-white dark:text-black cursor-pointer shadow-2xs'
                >
                  <Plus className='w-3.5 h-3.5' />
                  <span>New Story</span>
                </Button>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {blogs.map(post => (
                  <div
                    key={post.id}
                    className='rounded-xl border border-border bg-card p-4 flex flex-col justify-between space-y-3 hover:border-primary/40 transition-colors'
                  >
                    <div className='space-y-2'>
                      <div className='flex items-center justify-between gap-2'>
                        <Badge variant='outline' className='text-[10px] font-semibold bg-primary/5 text-primary border-primary/20'>
                          {post.category}
                        </Badge>
                        <Badge
                          variant='outline'
                          className={cn(
                            'text-[10px] capitalize',
                            post.status === 'published' ? 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20' : 'text-amber-600 bg-amber-500/10 border-amber-500/20'
                          )}
                        >
                          {post.status === 'published' ? 'Veröffentlicht' : 'Entwurf'}
                        </Badge>
                      </div>

                      <h4 className='text-sm font-bold text-foreground line-clamp-2 leading-snug'>
                        {post.title}
                      </h4>
                      <p className='text-xs text-muted-foreground line-clamp-2 leading-relaxed'>
                        {post.excerpt}
                      </p>
                    </div>

                    <div className='pt-2 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground'>
                      <div className='flex items-center gap-1.5'>
                        <User className='w-3 h-3' />
                        <span>{post.author}</span>
                        <span>&bull;</span>
                        <span>{post.publishedAt}</span>
                      </div>

                      <div className='flex items-center gap-1'>
                        <Button
                          type='button'
                          variant='ghost'
                          size='sm'
                          onClick={() => openEditBlog(post)}
                          className='h-7 px-2 text-xs cursor-pointer'
                        >
                          <Edit3 className='w-3 h-3 mr-1' /> Edit
                        </Button>
                        <Button
                          type='button'
                          variant='ghost'
                          size='sm'
                          onClick={() => deleteBlog(post.id)}
                          className='h-7 px-2 text-xs text-destructive hover:bg-destructive/10 cursor-pointer'
                        >
                          <Trash2 className='w-3 h-3' />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

                {blogs.length === 0 && (
                  <div className='col-span-full py-12 text-center rounded-xl border border-dashed border-border bg-muted/20'>
                    <BookOpen className='w-8 h-8 text-muted-foreground/40 mx-auto mb-2' />
                    <p className='text-xs font-medium text-muted-foreground'>No journal stories yet. Click 'New Story' to publish your first editorial.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════
              3. UPDATES TAB
             ════════════════════════════════════════════════════════════════ */}
          {activeTab === 'updates' && (
            <div className='space-y-4'>
              <div className='flex items-center justify-between pb-2'>
                <div>
                  <h3 className='text-sm font-bold text-foreground'>Store Changelog &amp; Announcements</h3>
                  <p className='text-xs text-muted-foreground'>Keep boutique buyers informed about new arrivals and atelier collections.</p>
                </div>
                <Button
                  type='button'
                  size='sm'
                  onClick={openNewUpdate}
                  className='h-8 text-xs gap-1.5 bg-black hover:bg-neutral-800 text-white dark:bg-white dark:text-black cursor-pointer shadow-2xs'
                >
                  <Plus className='w-3.5 h-3.5' />
                  <span>Add Update</span>
                </Button>
              </div>

              <div className='space-y-3'>
                {updates.map(upd => (
                  <div
                    key={upd.id}
                    className='p-4 rounded-xl border border-border bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-3'
                  >
                    <div className='space-y-1.5'>
                      <div className='flex items-center gap-2'>
                        <Badge variant='outline' className='text-[10px] font-bold uppercase tracking-wider bg-primary/10 border-primary/20 text-primary'>
                          {upd.badge}
                        </Badge>
                        <span className='text-xs font-mono text-muted-foreground flex items-center gap-1'>
                          <Calendar className='w-3 h-3' /> {upd.date}
                        </span>
                      </div>
                      <h4 className='text-xs sm:text-sm font-bold text-foreground'>
                        {upd.title}
                      </h4>
                      <p className='text-xs text-muted-foreground leading-relaxed'>
                        {upd.description}
                      </p>
                    </div>

                    <div className='flex items-center gap-2 shrink-0 self-end sm:self-center'>
                      <Button
                        type='button'
                        variant='ghost'
                        size='sm'
                        onClick={() => openEditUpdate(upd)}
                        className='h-8 px-2 text-xs cursor-pointer'
                      >
                        <Edit3 className='w-3.5 h-3.5 mr-1' /> Edit
                      </Button>
                      <Button
                        type='button'
                        variant='ghost'
                        size='sm'
                        onClick={() => deleteUpdate(upd.id)}
                        className='h-8 px-2 text-xs text-destructive hover:bg-destructive/10 cursor-pointer'
                      >
                        <Trash2 className='w-3.5 h-3.5' />
                      </Button>
                    </div>
                  </div>
                ))}

                {updates.length === 0 && (
                  <div className='py-12 text-center rounded-xl border border-dashed border-border bg-muted/20'>
                    <Sparkles className='w-8 h-8 text-muted-foreground/40 mx-auto mb-2' />
                    <p className='text-xs font-medium text-muted-foreground'>No updates published yet. Click 'Add Update' to publish a notice.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Bottom Save Bar */}
          <div className='flex items-center justify-between gap-4 pt-4 border-t border-border mt-8'>
            <p className='text-xs text-muted-foreground'>
              Changes saved here are synchronized and published immediately on the online store.
            </p>
            <Button
              type='button'
              onClick={handleSaveAll}
              disabled={saving}
              className='cursor-pointer text-xs h-9 gap-1.5 bg-black hover:bg-neutral-800 text-white dark:bg-white dark:text-black shadow-2xs'
            >
              {saving ? <Loader2 className='w-3.5 h-3.5 animate-spin' /> : <Save className='w-3.5 h-3.5' />}
              <span>Save Changes</span>
            </Button>
          </div>
        </div>

        {/* ── Modal for Announcements ── */}
        {announcementModalOpen && (
          <div className='fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in'>
            <div className='bg-card border border-border rounded-xl shadow-xl max-w-lg w-full p-5 space-y-4'>
              <h3 className='text-base font-bold text-foreground'>
                {editingAnnId ? 'Edit Announcement' : 'Add New Announcement'}
              </h3>

              <div className='space-y-3 text-xs'>
                <div className='space-y-1'>
                  <Label className='text-xs font-semibold'>Badge / Tag-Text</Label>
                  <Input
                    value={annForm.tag}
                    onChange={e => setAnnForm(p => ({ ...p, tag: e.target.value }))}
                    placeholder='e.g. FREE EXPRESS SHIPPING ON ALL ORDERS!'
                    className='h-8 text-xs'
                  />
                </div>

                <div className='space-y-1'>
                  <Label className='text-xs font-semibold'>Ankündigungstext</Label>
                  <Textarea
                    value={annForm.text}
                    onChange={e => setAnnForm(p => ({ ...p, text: e.target.value }))}
                    placeholder='Geben Sie den im Ticker angezeigten Text ein...'
                    rows={3}
                    className='text-xs'
                  />
                </div>

                <div className='space-y-1'>
                  <Label className='text-xs font-semibold'>Ziellink (Optional)</Label>
                  <Input
                    value={annForm.link}
                    onChange={e => setAnnForm(p => ({ ...p, link: e.target.value }))}
                    placeholder='z. B. /products oder /shipping'
                    className='h-8 text-xs'
                  />
                </div>

                <div className='flex items-center justify-between pt-2'>
                  <Label className='text-xs font-semibold'>Active on Online Store</Label>
                  <Switch
                    checked={annForm.active}
                    onCheckedChange={v => setAnnForm(p => ({ ...p, active: v }))}
                  />
                </div>
              </div>

              <div className='flex items-center justify-end gap-2 pt-3 border-t border-border'>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => setAnnouncementModalOpen(false)}
                  className='h-8 text-xs cursor-pointer'
                >
                  Cancel
                </Button>
                <Button
                  type='button'
                  size='sm'
                  onClick={saveAnnouncementModal}
                  className='h-8 text-xs bg-black hover:bg-neutral-800 text-white dark:bg-white dark:text-black cursor-pointer shadow-2xs'
                >
                  In Liste übernehmen
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ── Modal for Blogs ── */}
        {blogModalOpen && (
          <div className='fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in'>
            <div className='bg-card border border-border rounded-xl shadow-xl max-w-xl w-full p-5 space-y-4 max-h-[90vh] overflow-y-auto'>
              <h3 className='text-base font-bold text-foreground'>
                {editingBlogId ? 'Edit Journal Story' : 'Write New Journal Story'}
              </h3>

              <div className='space-y-3 text-xs'>
                <div className='space-y-1'>
                  <Label className='text-xs font-semibold'>Story Title</Label>
                  <Input
                    value={blogForm.title}
                    onChange={e => setBlogForm(p => ({ ...p, title: e.target.value }))}
                    placeholder='z. B. Reparatur poröser Lautsprecher-Sicken'
                    className='h-8 text-xs'
                  />
                </div>

                <div className='grid grid-cols-2 gap-3'>
                  <div className='space-y-1'>
                    <Label className='text-xs font-semibold'>Kategorie</Label>
                    <Input
                      value={blogForm.category}
                      onChange={e => setBlogForm(p => ({ ...p, category: e.target.value }))}
                      placeholder='Lautsprecher-Restaurierung'
                      className='h-8 text-xs'
                    />
                  </div>
                  <div className='space-y-1'>
                    <Label className='text-xs font-semibold'>Autor</Label>
                    <Input
                      value={blogForm.author}
                      onChange={e => setBlogForm(p => ({ ...p, author: e.target.value }))}
                      placeholder='Angelos Drampalis'
                      className='h-8 text-xs'
                    />
                  </div>
                </div>

                <div className='space-y-1'>
                  <Label className='text-xs font-semibold'>Auszug / Kurzbeschreibung</Label>
                  <Textarea
                    value={blogForm.excerpt}
                    onChange={e => setBlogForm(p => ({ ...p, excerpt: e.target.value }))}
                    placeholder='Kurze Zusammenfassung für die Beitrags-Karten...'
                    rows={2}
                    className='text-xs'
                  />
                </div>

                <div className='space-y-1'>
                  <Label className='text-xs font-semibold'>Full Story Content</Label>
                  <Textarea
                    value={blogForm.content}
                    onChange={e => setBlogForm(p => ({ ...p, content: e.target.value }))}
                    placeholder='Write your artisan and collection story here...'
                    rows={6}
                    className='text-xs'
                  />
                </div>

                <div className='flex items-center justify-between pt-1'>
                  <Label className='text-xs font-semibold'>Veröffentlichungsstatus</Label>
                  <Select
                    value={blogForm.status}
                    onValueChange={(val: any) => setBlogForm(p => ({ ...p, status: val }))}
                  >
                    <SelectTrigger className='w-[140px] h-8 text-xs'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='published'>Veröffentlicht</SelectItem>
                      <SelectItem value='draft'>Entwurf</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className='flex items-center justify-end gap-2 pt-3 border-t border-border'>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => setBlogModalOpen(false)}
                  className='h-8 text-xs cursor-pointer'
                >
                  Cancel
                </Button>
                <Button
                  type='button'
                  size='sm'
                  onClick={saveBlogModal}
                  className='h-8 text-xs bg-black hover:bg-neutral-800 text-white dark:bg-white dark:text-black cursor-pointer shadow-2xs'
                >
                  In Liste übernehmen
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ── Modal for Updates ── */}
        {updateModalOpen && (
          <div className='fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in'>
            <div className='bg-card border border-border rounded-xl shadow-xl max-w-lg w-full p-5 space-y-4'>
              <h3 className='text-base font-bold text-foreground'>
                {editingUpdateId ? 'Edit Update' : 'Add Update'}
              </h3>

              <div className='space-y-3 text-xs'>
                <div className='space-y-1'>
                  <Label className='text-xs font-semibold'>Titel der Aktualisierung</Label>
                  <Input
                    value={updateForm.title}
                    onChange={e => setUpdateForm(p => ({ ...p, title: e.target.value }))}
                    placeholder='e.g. New Jaipur handloom batch dispatched'
                    className='h-8 text-xs'
                  />
                </div>

                <div className='grid grid-cols-2 gap-3'>
                  <div className='space-y-1'>
                    <Label className='text-xs font-semibold'>Kennzeichnung (Badge)</Label>
                    <Select
                      value={updateForm.badge}
                      onValueChange={val => setUpdateForm(p => ({ ...p, badge: val }))}
                    >
                      <SelectTrigger className='w-full h-8 text-xs'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='Neue Teile'>Neue Teile</SelectItem>
                        <SelectItem value='Werkstatt'>Werkstatt</SelectItem>
                        <SelectItem value='Shipping'>Shipping</SelectItem>
                        <SelectItem value='Hinweis'>Hinweis</SelectItem>
                        <SelectItem value='Betriebsferien'>Betriebsferien</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className='space-y-1'>
                    <Label className='text-xs font-semibold'>Datum</Label>
                    <Input
                      type='date'
                      value={updateForm.date}
                      onChange={e => setUpdateForm(p => ({ ...p, date: e.target.value }))}
                      className='h-8 text-xs'
                    />
                  </div>
                </div>

                <div className='space-y-1'>
                  <Label className='text-xs font-semibold'>Beschreibung</Label>
                  <Textarea
                    value={updateForm.description}
                    onChange={e => setUpdateForm(p => ({ ...p, description: e.target.value }))}
                    placeholder='Geben Sie Details zu dieser Aktualisierung ein...'
                    rows={3}
                    className='text-xs'
                  />
                </div>
              </div>

              <div className='flex items-center justify-end gap-2 pt-3 border-t border-border'>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => setUpdateModalOpen(false)}
                  className='h-8 text-xs cursor-pointer'
                >
                  Cancel
                </Button>
                <Button
                  type='button'
                  size='sm'
                  onClick={saveUpdateModal}
                  className='h-8 text-xs bg-black hover:bg-neutral-800 text-white dark:bg-white dark:text-black cursor-pointer shadow-2xs'
                >
                  In Liste übernehmen
                </Button>
              </div>
            </div>
          </div>
        )}
      </Main>
    </>
  )
}
export default StoreSettingsView
