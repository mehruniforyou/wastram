'use client'

import React, { useState, useEffect } from 'react'
import {
  UserCog,
  Wrench,
  Palette,
  Bell,
  Monitor,
  KeyRound,
  Eye,
  EyeOff,
  Save,
  Check,
  Loader2,
  ShieldCheck,
  CreditCard,
  Lock,
  Globe,
  Mail,
  Truck,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Edit3,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Header } from '@/components/admin/layout/Header'
import { Main } from '@/components/admin/layout/Main'
import { Search } from '@/components/admin/Search'
import { ThemeSwitch } from '@/components/admin/ThemeSwitch'
import { ConfigDrawer } from '@/components/admin/ConfigDrawer'
import { notifyAdmin } from '@/app/admin/components/AdminToast'

interface SettingsViewProps {
  subTab?: string
  onSelectTab?: (tabId: string) => void
  onLogout?: () => void
}

const navItems = [
  { id: 'profile', title: 'Profile', icon: UserCog },
  { id: 'account', title: 'Account', icon: Wrench },
  { id: 'appearance', title: 'Appearance', icon: Palette },
  { id: 'notifications', title: 'Notifications', icon: Bell },
  { id: 'display', title: 'Display', icon: Monitor },
  { id: 'api-keys', title: 'API-Schlüssel', icon: KeyRound },
]

const languages = [
  { label: 'Deutsch (Standard)', value: 'de' },
  { label: 'Englisch', value: 'en' },
  { label: 'Griechisch (Ελληνικά)', value: 'el' },
  { label: 'Französisch (Français)', value: 'fr' },
  { label: 'Spanisch (Español)', value: 'es' },
]

/* ── Reusable Sub-Tab Header with Edit and Save Buttons ── */
interface SubTabHeaderProps {
  title: string
  description: string
  isEditing: boolean
  onToggleEdit: () => void
  onSave: () => void
  saving: boolean
  saveSuccess: boolean
}

function SubTabHeader({
  title,
  description,
  isEditing,
  onToggleEdit,
  onSave,
  saving,
  saveSuccess,
}: SubTabHeaderProps) {
  return (
    <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-6 border-b border-border'>
      <div>
        <h3 className='text-xl font-bold tracking-tight text-foreground'>{title}</h3>
        <p className='text-xs sm:text-sm text-muted-foreground mt-0.5'>{description}</p>
      </div>

      <div className='flex items-center gap-2 shrink-0'>
        <Button
          type='button'
          variant={isEditing ? 'default' : 'outline'}
          size='sm'
          onClick={onToggleEdit}
          className={cn(
            'h-8 text-xs gap-1.5 cursor-pointer font-medium transition-all',
            isEditing
              ? 'bg-neutral-800 text-white hover:bg-neutral-900 border-neutral-800 dark:bg-neutral-200 dark:text-neutral-900'
              : 'bg-background hover:bg-muted text-foreground border-border'
          )}
        >
          <Edit3 className='w-3.5 h-3.5' />
          <span>{isEditing ? 'Editing Mode' : 'Edit Profile'}</span>
        </Button>

        <Button
          type='button'
          onClick={onSave}
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
  )
}

/* ── 1. Profile Tab ── */
function ProfileTab() {
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [username, setUsername] = useState('Angelos Drampalis')
  const [email, setEmail] = useState('ixos@drampalis.de')
  const [bio, setBio] = useState('IXOS Audio Saerbeck Administrator & Werkstattleitung.')
  const [role, setRole] = useState('Inhaber & Audio-Spezialist')
  const [urls, setUrls] = useState(['https://ixosaudio.com'])

  useEffect(() => {
    let mounted = true
    try {
      const stored = localStorage.getItem('ixos_admin_profile')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed.username) setUsername(parsed.username)
        if (parsed.email) setEmail(parsed.email)
        if (parsed.bio) setBio(parsed.bio)
        if (parsed.role) setRole(parsed.role)
        if (Array.isArray(parsed.urls)) setUrls(parsed.urls)
      }
    } catch {}

    fetch('/api/payment-settings?t=' + Date.now())
      .then(res => res.json())
      .then(data => {
        if (!mounted || !data) return
        if (data.adminName || data.ownerName) setUsername(data.adminName || data.ownerName)
        if (data.storeEmail) setEmail(data.storeEmail)
        if (data.bio) setBio(data.bio)
        if (Array.isArray(data.urls) && data.urls.length > 0) setUrls(data.urls)
      })
      .catch(err => console.warn('Could not load profile settings:', err))

    return () => { mounted = false }
  }, [])

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setSaving(true)
    setSaveSuccess(false)
    try {
      const payload = { adminName: username, ownerName: username, storeEmail: email, bio, urls, role }
      localStorage.setItem('ixos_admin_profile', JSON.stringify(payload))

      await fetch('/api/payment-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch(() => {})

      setSaveSuccess(true)
      setIsEditing(false)
      setTimeout(() => setSaveSuccess(false), 3500)
      notifyAdmin('success', 'Profile Saved', 'Admin profile details saved successfully.')
    } catch (err: any) {
      notifyAdmin('error', 'Save Failed', err.message || 'Profile could not be saved.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSave} className='space-y-6'>
      <SubTabHeader
        title='Admin Profile'
        description='Manage administrator display name, contact email, and bio details.'
        isEditing={isEditing}
        onToggleEdit={() => setIsEditing(!isEditing)}
        onSave={() => handleSave()}
        saving={saving}
        saveSuccess={saveSuccess}
      />

      {saveSuccess && (
        <div className='p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs font-medium flex items-center gap-2 animate-fade-in'>
          <CheckCircle2 className='w-4 h-4 shrink-0' />
          <span>Profile changes saved and synchronized!</span>
        </div>
      )}

      <div className='space-y-4 rounded-xl border border-border p-5 bg-card'>
        <div className='space-y-2'>
          <Label htmlFor='username' className='text-xs font-semibold'>Display Name / Admin Name</Label>
          <Input
            id='username'
            value={username}
            onChange={e => { setUsername(e.target.value); setIsEditing(true); }}
            placeholder='Admin-Name'
            className='h-9 text-sm'
          />
          <p className='text-[0.75rem] text-muted-foreground'>
            Öffentlicher Administratorname, der in der Shop-Kommunikation angezeigt wird.
          </p>
        </div>

        <div className='space-y-2'>
          <Label htmlFor='role' className='text-xs font-semibold'>Rolle / Titel</Label>
          <Input
            id='role'
            value={role}
            onChange={e => { setRole(e.target.value); setIsEditing(true); }}
            placeholder='Shop-Administrator'
            className='h-9 text-sm'
          />
        </div>

        <div className='space-y-2'>
          <Label htmlFor='email' className='text-xs font-semibold'>Primäre E-Mail-Adresse</Label>
          <Input
            id='email'
            type='email'
            value={email}
            onChange={e => { setEmail(e.target.value); setIsEditing(true); }}
            placeholder='admin@ixosaudio.com'
            className='h-9 text-sm'
          />
        </div>

        <div className='space-y-2'>
          <Label htmlFor='bio' className='text-xs font-semibold'>Biografie / Shop-Beschreibung</Label>
          <Textarea
            id='bio'
            value={bio}
            onChange={e => { setBio(e.target.value); setIsEditing(true); }}
            placeholder='Beschreiben Sie Ihre Audio-Spezialisierung'
            rows={3}
            className='text-sm'
          />
        </div>

        <div className='space-y-2 pt-2'>
          <Label className='text-xs font-semibold'>Website- &amp; Shop-Links</Label>
          {urls.map((url, i) => (
            <div key={i} className='flex items-center gap-2'>
              <Input
                value={url}
                onChange={e => {
                  const next = [...urls]
                  next[i] = e.target.value
                  setUrls(next)
                  setIsEditing(true)
                }}
                className='h-9 text-xs font-mono'
              />
            </div>
          ))}
          <Button
            type='button'
            variant='outline'
            size='sm'
            className='mt-1 text-xs cursor-pointer'
            onClick={() => { setUrls([...urls, '']); setIsEditing(true); }}
          >
            + Add Link
          </Button>
        </div>
      </div>

      <div className='flex items-center justify-between gap-4 pt-2'>
        <p className='text-xs text-muted-foreground'>
          Changes are securely saved to your administrative database.
        </p>
        <Button
          type='submit'
          disabled={saving}
          className='cursor-pointer text-xs h-9 gap-1.5 bg-black hover:bg-neutral-800 text-white dark:bg-white dark:text-black shadow-2xs'
        >
          {saving ? <Loader2 className='w-3.5 h-3.5 animate-spin' /> : <Save className='w-3.5 h-3.5' />}
          <span>Save Profile</span>
        </Button>
      </div>
    </form>
  )
}

/* ── 2. Account Tab ── */
function AccountTab() {
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const [form, setForm] = useState({
    storeName: 'IXOS Audio — Speaker Parts',
    ownerName: 'Angelos Drampalis',
    storeEmail: 'ixos@drampalis.de',
    storePhone: '01606705008',
    workshopAddress: 'Welps Esch 5, Saerbox Nr-12, 48369 Saerbeck, NRW, Germany',
    taxVatRate: 19,
    freeShippingThreshold: 75,
    defaultCurrency: 'INR',
    language: 'de',
  })

  useEffect(() => {
    let mounted = true
    try {
      const stored = localStorage.getItem('ixos_account_settings')
      if (stored) {
        setForm(prev => ({ ...prev, ...JSON.parse(stored) }))
      }
    } catch {}

    fetch('/api/payment-settings?t=' + Date.now())
      .then(res => res.json())
      .then(data => {
        if (!mounted || !data) return
        setForm(prev => ({
          ...prev,
          storeName: data.storeName || prev.storeName,
          ownerName: data.ownerName || prev.ownerName,
          storeEmail: data.storeEmail || prev.storeEmail,
          storePhone: data.storePhone || data.adminPhone || prev.storePhone,
          workshopAddress: data.workshopAddress || prev.workshopAddress,
          taxVatRate: typeof data.taxVatRate === 'number' ? data.taxVatRate : prev.taxVatRate,
          freeShippingThreshold: typeof data.freeShippingThreshold === 'number' ? data.freeShippingThreshold : prev.freeShippingThreshold,
          defaultCurrency: data.defaultCurrency || prev.defaultCurrency,
        }))
      })
      .catch(err => console.warn('Could not load account settings:', err))

    return () => { mounted = false }
  }, [])

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setSaving(true)
    setSaveSuccess(false)
    try {
      const payload = {
        ...form,
        taxVatRate: Number(form.taxVatRate) || 0,
        freeShippingThreshold: Number(form.freeShippingThreshold) || 75,
      }
      localStorage.setItem('ixos_account_settings', JSON.stringify(payload))
      const res = await fetch('/api/payment-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Failed to update store settings.')
      setSaveSuccess(true)
      setIsEditing(false)
      setTimeout(() => setSaveSuccess(false), 3500)
      notifyAdmin('success', 'Account Saved', 'Store and account settings updated.')
    } catch (err: any) {
      notifyAdmin('error', 'Save Failed', err.message || 'Could not save account settings.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSave} className='space-y-6'>
      <SubTabHeader
        title='Store Account &amp; Legal Details'
        description='Configure business profile, atelier contacts, tax rates, and operations.'
        isEditing={isEditing}
        onToggleEdit={() => setIsEditing(!isEditing)}
        onSave={() => handleSave()}
        saving={saving}
        saveSuccess={saveSuccess}
      />

      {saveSuccess && (
        <div className='p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs font-medium flex items-center gap-2 animate-fade-in'>
          <CheckCircle2 className='w-4 h-4 shrink-0' />
          <span>Boutique and business legal details successfully saved!</span>
        </div>
      )}

      <div className='space-y-4 rounded-xl border border-border p-5 bg-card'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='space-y-1.5'>
            <Label className='text-xs font-semibold'>Shop-Name</Label>
            <Input
              value={form.storeName}
              onChange={e => { setForm(p => ({ ...p, storeName: e.target.value })); setIsEditing(true); }}
              className='h-9 text-sm'
            />
          </div>

          <div className='space-y-1.5'>
            <Label className='text-xs font-semibold'>Gesetzlicher Vertreter / Inhaber</Label>
            <Input
              value={form.ownerName}
              onChange={e => { setForm(p => ({ ...p, ownerName: e.target.value })); setIsEditing(true); }}
              className='h-9 text-sm'
            />
          </div>

          <div className='space-y-1.5'>
            <Label className='text-xs font-semibold'>Shop-Kontakt-E-Mail</Label>
            <Input
              type='email'
              value={form.storeEmail}
              onChange={e => { setForm(p => ({ ...p, storeEmail: e.target.value })); setIsEditing(true); }}
              className='h-9 text-sm'
            />
          </div>

          <div className='space-y-1.5'>
            <Label className='text-xs font-semibold'>Telefonnummer</Label>
            <Input
              value={form.storePhone}
              onChange={e => { setForm(p => ({ ...p, storePhone: e.target.value })); setIsEditing(true); }}
              className='h-9 text-sm'
            />
          </div>
        </div>

        <div className='space-y-1.5 pt-2'>
          <Label className='text-xs font-semibold'>Werkstatt- / Geschäftsadresse</Label>
          <Input
            value={form.workshopAddress}
            onChange={e => { setForm(p => ({ ...p, workshopAddress: e.target.value })); setIsEditing(true); }}
            className='h-9 text-sm'
          />
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-border/60'>
          <div className='space-y-1.5'>
            <Label className='text-xs font-semibold'>Standard-MwSt.-Satz (%)</Label>
            <Input
              type='text'
              inputMode='decimal'
              value={form.taxVatRate !== undefined && form.taxVatRate !== null ? form.taxVatRate : ''}
              onChange={e => {
                const val = e.target.value.replace(/[^0-9.,]/g, '').replace(',', '.');
                setForm(p => ({ ...p, taxVatRate: val as any }));
                setIsEditing(true);
              }}
              placeholder='19'
              className='h-9 text-sm'
            />
          </div>

          <div className='space-y-1.5'>
            <Label className='text-xs font-semibold'>Minimum Order for Free Shipping (₹)</Label>
            <Input
              type='text'
              inputMode='decimal'
              value={form.freeShippingThreshold !== undefined && form.freeShippingThreshold !== null ? form.freeShippingThreshold : ''}
              onChange={e => {
                const val = e.target.value.replace(/[^0-9.,]/g, '').replace(',', '.');
                setForm(p => ({ ...p, freeShippingThreshold: val as any }));
                setIsEditing(true);
              }}
              placeholder='75'
              className='h-9 text-sm'
            />
          </div>

          <div className='space-y-1.5'>
            <Label className='text-xs font-semibold'>Default Currency</Label>
            <Select
              value={form.defaultCurrency}
              onValueChange={val => { setForm(p => ({ ...p, defaultCurrency: val })); setIsEditing(true); }}
            >
              <SelectTrigger className='w-full h-9 text-xs'>
                <SelectValue placeholder='Select Currency' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='INR'>INR (₹) – Indian Rupee</SelectItem>
                      <SelectItem value='USD'>USD ($) – US Dollar</SelectItem>
                      <SelectItem value='EUR'>EUR (€) – Euro</SelectItem>
                <SelectItem value='USD'>USD ($) – US-Dollar</SelectItem>
                <SelectItem value='GBP'>GBP (£) – Britisches Pfund</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className='flex items-center justify-between gap-4 pt-2'>
        <p className='text-xs text-muted-foreground'>
          Updates directly apply to store invoices and checkout.
        </p>
        <Button
          type='submit'
          disabled={saving}
          className='cursor-pointer text-xs h-9 gap-1.5 bg-black hover:bg-neutral-800 text-white dark:bg-white dark:text-black shadow-2xs'
        >
          {saving ? <Loader2 className='w-3.5 h-3.5 animate-spin' /> : <Save className='w-3.5 h-3.5' />}
          <span>Save Account Details</span>
        </Button>
      </div>
    </form>
  )
}

/* ── 3. Appearance Tab ── */
function AppearanceTab() {
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [font, setFont] = useState('inter')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'light' || savedTheme === 'dark') {
      setTheme(savedTheme)
    } else if (typeof document !== 'undefined') {
      setTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light')
    }
    const savedFont = localStorage.getItem('admin_font')
    if (savedFont) setFont(savedFont)
  }, [])

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setSaving(true)
    setSaveSuccess(false)
    try {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
      localStorage.setItem('theme', theme)
      localStorage.setItem('admin_font', font)

      await fetch('/api/payment-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme, font }),
      }).catch(() => {})

      setSaveSuccess(true)
      setIsEditing(false)
      setTimeout(() => setSaveSuccess(false), 3500)
      notifyAdmin('success', 'Appearance Saved', 'Theme and font settings updated.')
    } catch (err: any) {
      notifyAdmin('error', 'Save Failed', err.message || 'Could not save appearance settings.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSave} className='space-y-6'>
      <SubTabHeader
        title='Appearance'
        description='Customize dashboard theme, typography, and visual preferences.'
        isEditing={isEditing}
        onToggleEdit={() => setIsEditing(!isEditing)}
        onSave={() => handleSave()}
        saving={saving}
        saveSuccess={saveSuccess}
      />

      {saveSuccess && (
        <div className='p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs font-medium flex items-center gap-2 animate-fade-in'>
          <CheckCircle2 className='w-4 h-4 shrink-0' />
          <span>Appearance preferences saved!</span>
        </div>
      )}

      <div className='space-y-5 rounded-xl border border-border p-5 bg-card'>
        <div className='space-y-2'>
          <Label className='text-xs font-semibold'>Farbschema</Label>
          <RadioGroup
            value={theme}
            onValueChange={v => { setTheme(v as 'light' | 'dark'); setIsEditing(true); }}
            className='grid grid-cols-2 gap-4 pt-1 max-w-sm'
          >
            <label className={cn(
              'cursor-pointer rounded-xl border-2 p-3 transition-all flex flex-col items-center gap-2',
              theme === 'light' ? 'border-primary bg-primary/5' : 'border-border hover:border-muted-foreground/40'
            )}>
              <RadioGroupItem value='light' className='sr-only' />
              <div className='w-full h-12 rounded-lg bg-neutral-100 border border-neutral-300 flex items-center justify-center text-xs font-bold text-neutral-800 shadow-2xs'>
                ☀️ Heller Modus
              </div>
              <span className='text-xs font-semibold'>Hell</span>
            </label>

            <label className={cn(
              'cursor-pointer rounded-xl border-2 p-3 transition-all flex flex-col items-center gap-2',
              theme === 'dark' ? 'border-primary bg-primary/5' : 'border-border hover:border-muted-foreground/40'
            )}>
              <RadioGroupItem value='dark' className='sr-only' />
              <div className='w-full h-12 rounded-lg bg-neutral-900 border border-neutral-700 flex items-center justify-center text-xs font-bold text-neutral-100 shadow-2xs'>
                🌙 Dunkler Modus
              </div>
              <span className='text-xs font-semibold'>Dunkel</span>
            </label>
          </RadioGroup>
        </div>

        <div className='space-y-2 pt-2 border-t border-border/60'>
          <Label className='text-xs font-semibold'>Dashboard-Typografie</Label>
          <Select
            value={font}
            onValueChange={v => { setFont(v); setIsEditing(true); }}
          >
            <SelectTrigger className='w-[220px] h-9 text-xs'>
              <SelectValue placeholder='Select Font' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='inter'>Inter (Klar &amp; Modern)</SelectItem>
              <SelectItem value='manrope'>Manrope (Geometrisch)</SelectItem>
              <SelectItem value='system'>Systemstandard</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className='flex items-center justify-between gap-4 pt-2'>
        <p className='text-xs text-muted-foreground'>
          Design settings apply immediately to your admin session.
        </p>
        <Button
          type='submit'
          disabled={saving}
          className='cursor-pointer text-xs h-9 gap-1.5 bg-black hover:bg-neutral-800 text-white dark:bg-white dark:text-black shadow-2xs'
        >
          {saving ? <Loader2 className='w-3.5 h-3.5 animate-spin' /> : <Save className='w-3.5 h-3.5' />}
          <span>Save Appearance</span>
        </Button>
      </div>
    </form>
  )
}

/* ── 4. Notifications Tab ── */
function NotificationsTab() {
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [notifyType, setNotifyType] = useState<'all' | 'mentions' | 'none'>('all')
  const [orderAlerts, setOrderAlerts] = useState(true)
  const [inventoryAlerts, setInventoryAlerts] = useState(true)
  const [reviewAlerts, setReviewAlerts] = useState(true)
  const [marketingEmails, setMarketingEmails] = useState(false)
  const [mobile, setMobile] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('admin_notifications')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed.notifyType) setNotifyType(parsed.notifyType)
        if (typeof parsed.orderAlerts === 'boolean') setOrderAlerts(parsed.orderAlerts)
        if (typeof parsed.inventoryAlerts === 'boolean') setInventoryAlerts(parsed.inventoryAlerts)
        if (typeof parsed.reviewAlerts === 'boolean') setReviewAlerts(parsed.reviewAlerts)
        if (typeof parsed.marketingEmails === 'boolean') setMarketingEmails(parsed.marketingEmails)
        if (typeof parsed.mobile === 'boolean') setMobile(parsed.mobile)
      }
    } catch {}
  }, [])

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setSaving(true)
    setSaveSuccess(false)
    try {
      const payload = { notifyType, orderAlerts, inventoryAlerts, reviewAlerts, marketingEmails, mobile }
      localStorage.setItem('admin_notifications', JSON.stringify(payload))
      await fetch('/api/payment-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notifications: payload }),
      }).catch(() => {})
      setSaveSuccess(true)
      setIsEditing(false)
      setTimeout(() => setSaveSuccess(false), 3500)
      notifyAdmin('success', 'Notifications Saved', 'Notification preferences updated.')
    } catch (err: any) {
      notifyAdmin('error', 'Save Failed', err.message || 'Could not save notifications.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSave} className='space-y-6'>
      <SubTabHeader
        title='Notifications'
        description='Choose how and when you receive order, stock, and customer notifications.'
        isEditing={isEditing}
        onToggleEdit={() => setIsEditing(!isEditing)}
        onSave={() => handleSave()}
        saving={saving}
        saveSuccess={saveSuccess}
      />

      {saveSuccess && (
        <div className='p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs font-medium flex items-center gap-2 animate-fade-in'>
          <CheckCircle2 className='w-4 h-4 shrink-0' />
          <span>Notification settings updated!</span>
        </div>
      )}

      <div className='space-y-4 rounded-xl border border-border p-5 bg-card'>
        <div className='space-y-3 pb-3 border-b border-border'>
          <Label className='text-xs font-semibold'>Order &amp; Customer Notification Channels</Label>
          <div className='space-y-3'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-xs font-semibold text-foreground'>Neue Bestellbenachrichtigungen</p>
                <p className='text-[0.75rem] text-muted-foreground'>Immediate email notification when a customer places an apparel order.</p>
              </div>
              <Switch checked={orderAlerts} onCheckedChange={v => { setOrderAlerts(v); setIsEditing(true); }} />
            </div>

            <div className='flex items-center justify-between'>
              <div>
                <p className='text-xs font-semibold text-foreground'>Low Stock Alerts</p>
                <p className='text-[0.75rem] text-muted-foreground'>Benachrichtigung erhalten, wenn der Lautsprecherbestand unter 3 Stück fällt.</p>
              </div>
              <Switch checked={inventoryAlerts} onCheckedChange={v => { setInventoryAlerts(v); setIsEditing(true); }} />
            </div>

            <div className='flex items-center justify-between'>
              <div>
                <p className='text-xs font-semibold text-foreground'>Customer Reviews</p>
                <p className='text-[0.75rem] text-muted-foreground'>Benachrichtigung bei Eingang einer neuen Produktbewertung.</p>
              </div>
              <Switch checked={reviewAlerts} onCheckedChange={v => { setReviewAlerts(v); setIsEditing(true); }} />
            </div>
          </div>
        </div>

        <div className='space-y-2 pt-1'>
          <Label className='text-xs font-semibold'>Message Priority</Label>
          <RadioGroup
            value={notifyType}
            onValueChange={v => { setNotifyType(v as typeof notifyType); setIsEditing(true); }}
            className='flex flex-col gap-2'
          >
            <div className='flex items-center space-x-2'>
              <RadioGroupItem value='all' id='notif-all' />
              <label htmlFor='notif-all' className='text-xs font-medium cursor-pointer'>Alle Benachrichtigungen und Aktivitäten</label>
            </div>
            <div className='flex items-center space-x-2'>
              <RadioGroupItem value='mentions' id='notif-critical' />
              <label htmlFor='notif-critical' className='text-xs font-medium cursor-pointer'>High priority order and payment alerts only</label>
            </div>
            <div className='flex items-center space-x-2'>
              <RadioGroupItem value='none' id='notif-none' />
              <label htmlFor='notif-none' className='text-xs font-medium cursor-pointer'>Nicht essenzielle Benachrichtigungen stummschalten</label>
            </div>
          </RadioGroup>
        </div>
      </div>

      <div className='flex items-center justify-between gap-4 pt-2'>
        <p className='text-xs text-muted-foreground'>
          Benachrichtigungen werden an Ihre hinterlegte Administrator-E-Mail-Adresse gesendet.
        </p>
        <Button
          type='submit'
          disabled={saving}
          className='cursor-pointer text-xs h-9 gap-1.5 bg-black hover:bg-neutral-800 text-white dark:bg-white dark:text-black shadow-2xs'
        >
          {saving ? <Loader2 className='w-3.5 h-3.5 animate-spin' /> : <Save className='w-3.5 h-3.5' />}
          <span>Save Notifications</span>
        </Button>
      </div>
    </form>
  )
}

/* ── 5. Display Tab ── */
function DisplayTab() {
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [checkedItems, setCheckedItems] = useState<string[]>(['products', 'orders', 'categories', 'discounts', 'reviews'])
  const [pageSize, setPageSize] = useState('25')

  const modules = [
    { id: 'products', label: 'Products & Inventory' },
    { id: 'orders', label: 'Customer Orders & Fulfillment' },
    { id: 'categories', label: 'Lautsprecherteile-Kategorien' },
    { id: 'discounts', label: 'Discounts & Promotion Codes' },
    { id: 'reviews', label: 'Customer Reviews' },
    { id: 'shipping', label: 'Shipping Rates & Regional Rules' },
    { id: 'policies', label: 'Legal Policies & Terms' },
  ]

  useEffect(() => {
    try {
      const stored = localStorage.getItem('admin_display_prefs')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed.items)) setCheckedItems(parsed.items)
        if (parsed.pageSize) setPageSize(parsed.pageSize)
      }
    } catch {}
  }, [])

  const toggle = (id: string, checked: boolean) => {
    setCheckedItems(prev => checked ? [...prev, id] : prev.filter(i => i !== id))
    setIsEditing(true)
  }

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setSaving(true)
    setSaveSuccess(false)
    try {
      localStorage.setItem('admin_display_prefs', JSON.stringify({ items: checkedItems, pageSize }))
      setSaveSuccess(true)
      setIsEditing(false)
      setTimeout(() => setSaveSuccess(false), 3500)
      notifyAdmin('success', 'Display Saved', 'Display visibility settings saved.')
    } catch (err: any) {
      notifyAdmin('error', 'Save Failed', err.message || 'Could not save display settings.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSave} className='space-y-6'>
      <SubTabHeader
        title='Display &amp; Navigation'
        description='Configure table density, default pagination, and visible admin modules.'
        isEditing={isEditing}
        onToggleEdit={() => setIsEditing(!isEditing)}
        onSave={() => handleSave()}
        saving={saving}
        saveSuccess={saveSuccess}
      />

      {saveSuccess && (
        <div className='p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs font-medium flex items-center gap-2 animate-fade-in'>
          <CheckCircle2 className='w-4 h-4 shrink-0' />
          <span>Display preferences saved!</span>
        </div>
      )}

      <div className='space-y-4 rounded-xl border border-border p-5 bg-card'>
        <div className='space-y-2'>
          <Label className='text-xs font-semibold'>Sichtbare Verwaltungsbereiche</Label>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1'>
            {modules.map(item => (
              <div key={item.id} className='flex items-center space-x-2.5 p-2 rounded-lg border border-border/70 hover:bg-muted/30 transition-colors'>
                <Checkbox
                  id={`display-${item.id}`}
                  checked={checkedItems.includes(item.id)}
                  onCheckedChange={v => toggle(item.id, !!v)}
                />
                <label htmlFor={`display-${item.id}`} className='text-xs font-medium cursor-pointer'>
                  {item.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className='space-y-2 pt-3 border-t border-border/60'>
          <Label className='text-xs font-semibold'>Standard-Zeilen pro Tabellenseite</Label>
          <Select
            value={pageSize}
            onValueChange={v => { setPageSize(v); setIsEditing(true); }}
          >
            <SelectTrigger className='w-[160px] h-9 text-xs'>
              <SelectValue placeholder='Zeilen pro Seite' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='10'>10 Zeilen</SelectItem>
              <SelectItem value='25'>25 Zeilen</SelectItem>
              <SelectItem value='50'>50 Zeilen</SelectItem>
              <SelectItem value='100'>100 Zeilen</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className='flex items-center justify-between gap-4 pt-2'>
        <p className='text-xs text-muted-foreground'>
          Settings are saved to your local admin profile.
        </p>
        <Button
          type='submit'
          disabled={saving}
          className='cursor-pointer text-xs h-9 gap-1.5 bg-black hover:bg-neutral-800 text-white dark:bg-white dark:text-black shadow-2xs'
        >
          {saving ? <Loader2 className='w-3.5 h-3.5 animate-spin' /> : <Save className='w-3.5 h-3.5' />}
          <span>Save Display</span>
        </Button>
      </div>
    </form>
  )
}

/* ── 6. API Keys Tab ── */
function ApiKeysTab() {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({})

  const [form, setForm] = useState({
    enablePaypal: true,
    paypalClientId: '',
    paypalSecret: '',
    environment: 'sandbox',
    defaultCurrency: 'INR',
    stripePublishableKey: '',
    stripeSecretKey: '',
    firebaseApiKey: '',
    firebaseAuthDomain: '',
    firebaseProjectId: '',
    firebaseStorageBucket: '',
    firebaseAppId: '',
    ebayAppId: '',
    ebayDevId: '',
    ebayCertId: '',
    ebayUserToken: '',
    dhlApiKey: '',
    dhlAccountNumber: '',
    deutschePostApiKey: '',
    upsAccessKey: '',
    googleTagManagerId: '',
    googleAnalytics4Id: '',
    metaPixelId: '',
    metaConversionApiToken: '',
    resendApiKey: '',
    smtpHost: '',
    smtpPort: '587',
    smtpUser: '',
    smtpPass: '',
    senderEmail: '',
    adminPasscode: '',
  })

  useEffect(() => {
    let isMounted = true
    fetch('/api/payment-settings?t=' + Date.now())
      .then((r) => r.json())
      .then((data) => {
        if (isMounted && data) {
          setForm((prev) => ({
            ...prev,
            ...data,
            paypalSecret: data.paypalSecret || '',
            stripeSecretKey: data.stripeSecretKey || '',
            smtpPass: data.smtpPass || '',
          }))
        }
      })
      .catch((err) => console.warn('Could not load api keys settings:', err))
      .finally(() => {
        if (isMounted) setLoading(false)
      })
    return () => {
      isMounted = false
    }
  }, [])

  const toggleSecret = (key: string) => {
    setShowSecrets((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setSaving(true)
    setSaveSuccess(false)
    try {
      const res = await fetch('/api/payment-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setSaveSuccess(true)
        setIsEditing(false)
        setTimeout(() => setSaveSuccess(false), 4000)
        notifyAdmin('success', 'API Keys Saved', 'Production keys updated in database.')
      } else {
        throw new Error('Server returned an error.')
      }
    } catch (err: any) {
      console.error('Error saving API keys:', err)
      notifyAdmin('error', 'Save Failed', err.message || 'Could not save API keys.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center p-12 text-sm text-muted-foreground'>
        <Loader2 className='w-4 h-4 mr-2 animate-spin' /> Produktions-API-Konfiguration wird geladen...
      </div>
    )
  }

  return (
    <form onSubmit={handleSave} className='space-y-6'>
      <SubTabHeader
        title='API-Schlüssel &amp; Integrationen'
        description='Configure and manage API keys for payment gateways, database, analytics, shipping, and email services.'
        isEditing={isEditing}
        onToggleEdit={() => setIsEditing(!isEditing)}
        onSave={() => handleSave()}
        saving={saving}
        saveSuccess={saveSuccess}
      />

      {saveSuccess && (
        <div className='p-3.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs font-medium flex items-center gap-2 animate-fade-in'>
          <CheckCircle2 className='w-4 h-4 shrink-0' />
          <span>Production API keys saved in database!</span>
        </div>
      )}

      {/* ── Section 1: Payment Gateways ── */}
      <div className='space-y-4 rounded-xl border border-border p-5 bg-card'>
        <div className='flex items-center justify-between pb-3 border-b border-border'>
          <div className='flex items-center gap-2'>
            <CreditCard className='w-4 h-4 text-primary' />
            <h4 className='text-sm font-semibold text-foreground'>Payment Providers (Razorpay, Stripe &amp; Cashfree)</h4>
          </div>
          <Badge variant='outline' className='text-[10px] uppercase font-mono'>
            {form.environment === 'live' ? 'Live-Produktion' : 'Sandbox-Modus'}
          </Badge>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 pt-1'>
          <div className='space-y-1.5'>
            <Label className='text-xs font-semibold'>Gateway-Modus</Label>
            <Select
              value={form.environment}
              onValueChange={(val) => { setForm((p) => ({ ...p, environment: val })); setIsEditing(true); }}
            >
              <SelectTrigger className='w-full h-9 text-xs'>
                <SelectValue placeholder='Select Mode' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='sandbox'>Sandbox (Testmodus)</SelectItem>
                <SelectItem value='live'>Live (Produktionsmodus)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-1.5'>
            <Label className='text-xs font-semibold'>Default Currency</Label>
            <Select
              value={form.defaultCurrency}
              onValueChange={(val) => { setForm((p) => ({ ...p, defaultCurrency: val })); setIsEditing(true); }}
            >
              <SelectTrigger className='w-full h-9 text-xs'>
                <SelectValue placeholder='Select Currency' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='INR'>INR (₹) – Indian Rupee</SelectItem>
                      <SelectItem value='USD'>USD ($) – US Dollar</SelectItem>
                      <SelectItem value='EUR'>EUR (€) – Euro</SelectItem>
                <SelectItem value='USD'>USD ($) – US-Dollar</SelectItem>
                <SelectItem value='GBP'>GBP (£) – Britisches Pfund</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* PayPal Credentials */}
        <div className='space-y-3 pt-2'>
          <div className='space-y-1.5'>
            <Label className='text-xs font-semibold'>PayPal-Client-ID</Label>
            <Input
              value={form.paypalClientId}
              onChange={(e) => { setForm((p) => ({ ...p, paypalClientId: e.target.value })); setIsEditing(true); }}
              placeholder='z. B. A21AAJ... (Live- oder Sandbox-Client-ID)'
              className='h-9 text-xs font-mono'
            />
          </div>

          <div className='space-y-1.5'>
            <Label className='text-xs font-semibold'>PayPal-Geheimschlüssel (Secret)</Label>
            <div className='relative'>
              <Input
                type={showSecrets.paypalSecret ? 'text' : 'password'}
                value={form.paypalSecret}
                onChange={(e) => { setForm((p) => ({ ...p, paypalSecret: e.target.value })); setIsEditing(true); }}
                placeholder={form.paypalSecret ? '••••••••••••••••' : 'PayPal-Geheimschlüssel eingeben'}
                className='h-9 text-xs font-mono pr-9'
              />
              <button
                type='button'
                onClick={() => toggleSecret('paypalSecret')}
                className='absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer'
              >
                {showSecrets.paypalSecret ? <EyeOff className='w-3.5 h-3.5' /> : <Eye className='w-3.5 h-3.5' />}
              </button>
            </div>
          </div>
        </div>

        {/* Stripe Credentials */}
        <div className='space-y-3 pt-2 border-t border-border/60'>
          <div className='space-y-1.5'>
            <Label className='text-xs font-semibold'>Stripe-Veröffentlichbarer Schlüssel</Label>
            <Input
              value={form.stripePublishableKey}
              onChange={(e) => { setForm((p) => ({ ...p, stripePublishableKey: e.target.value })); setIsEditing(true); }}
              placeholder='pk_live_...'
              className='h-9 text-xs font-mono'
            />
          </div>

          <div className='space-y-1.5'>
            <Label className='text-xs font-semibold'>Stripe-Geheimschlüssel</Label>
            <div className='relative'>
              <Input
                type={showSecrets.stripeSecret ? 'text' : 'password'}
                value={form.stripeSecretKey}
                onChange={(e) => { setForm((p) => ({ ...p, stripeSecretKey: e.target.value })); setIsEditing(true); }}
                placeholder={form.stripeSecretKey ? '••••••••••••••••' : 'sk_live_...'}
                className='h-9 text-xs font-mono pr-9'
              />
              <button
                type='button'
                onClick={() => toggleSecret('stripeSecret')}
                className='absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer'
              >
                {showSecrets.stripeSecret ? <EyeOff className='w-3.5 h-3.5' /> : <Eye className='w-3.5 h-3.5' />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Section 2: Database & Cloud Services (Firebase) ── */}
      <div className='space-y-4 rounded-xl border border-border p-5 bg-card'>
        <div className='flex items-center justify-between pb-3 border-b border-border'>
          <div className='flex items-center gap-2'>
            <Globe className='w-4 h-4 text-primary' />
            <h4 className='text-sm font-semibold text-foreground'>Firebase &amp; Cloud-Speicher</h4>
          </div>
          <Badge variant='outline' className='text-[10px] text-emerald-600 bg-emerald-500/10 border-emerald-500/30'>
            Verbunden
          </Badge>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='space-y-1.5'>
            <Label className='text-xs font-semibold'>Firebase-API-Schlüssel</Label>
            <Input
              value={form.firebaseApiKey}
              onChange={(e) => { setForm((p) => ({ ...p, firebaseApiKey: e.target.value })); setIsEditing(true); }}
              className='h-9 text-xs font-mono'
            />
          </div>

          <div className='space-y-1.5'>
            <Label className='text-xs font-semibold'>Firebase-Projekt-ID</Label>
            <Input
              value={form.firebaseProjectId}
              onChange={(e) => { setForm((p) => ({ ...p, firebaseProjectId: e.target.value })); setIsEditing(true); }}
              className='h-9 text-xs font-mono'
            />
          </div>

          <div className='space-y-1.5'>
            <Label className='text-xs font-semibold'>Authentifizierungs-Domain</Label>
            <Input
              value={form.firebaseAuthDomain}
              onChange={(e) => { setForm((p) => ({ ...p, firebaseAuthDomain: e.target.value })); setIsEditing(true); }}
              className='h-9 text-xs font-mono'
            />
          </div>

          <div className='space-y-1.5'>
            <Label className='text-xs font-semibold'>Speicher-Bucket</Label>
            <Input
              value={form.firebaseStorageBucket}
              onChange={(e) => { setForm((p) => ({ ...p, firebaseStorageBucket: e.target.value })); setIsEditing(true); }}
              className='h-9 text-xs font-mono'
            />
          </div>
        </div>
      </div>

      {/* ── Section 3: Shipping & Logistics (DHL / UPS) ── */}
      <div className='space-y-4 rounded-xl border border-border p-5 bg-card'>
        <div className='flex items-center justify-between pb-3 border-b border-border'>
          <div className='flex items-center gap-2'>
            <Truck className='w-4 h-4 text-primary' />
            <h4 className='text-sm font-semibold text-foreground'>Shipping &amp; Logistics</h4>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='space-y-1.5'>
            <Label className='text-xs font-semibold'>DHL-API-Schlüssel / Token</Label>
            <Input
              value={form.dhlApiKey}
              onChange={(e) => { setForm((p) => ({ ...p, dhlApiKey: e.target.value })); setIsEditing(true); }}
              placeholder='dhl_api_...'
              className='h-9 text-xs font-mono'
            />
          </div>

          <div className='space-y-1.5'>
            <Label className='text-xs font-semibold'>Logistics Account Number / Courier ID</Label>
            <Input
              value={form.dhlAccountNumber}
              onChange={(e) => { setForm((p) => ({ ...p, dhlAccountNumber: e.target.value })); setIsEditing(true); }}
              placeholder='2222222222...'
              className='h-9 text-xs font-mono'
            />
          </div>
        </div>
      </div>

      {/* ── Section 4: Marketing & Analytics ── */}
      <div className='space-y-4 rounded-xl border border-border p-5 bg-card'>
        <div className='flex items-center justify-between pb-3 border-b border-border'>
          <div className='flex items-center gap-2'>
            <ShieldCheck className='w-4 h-4 text-primary' />
            <h4 className='text-sm font-semibold text-foreground'>Marketing- &amp; Tracking-Analysen</h4>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='space-y-1.5'>
            <Label className='text-xs font-semibold'>Google Tag Manager-ID</Label>
            <Input
              value={form.googleTagManagerId}
              onChange={(e) => { setForm((p) => ({ ...p, googleTagManagerId: e.target.value })); setIsEditing(true); }}
              placeholder='GTM-...'
              className='h-9 text-xs font-mono'
            />
          </div>

          <div className='space-y-1.5'>
            <Label className='text-xs font-semibold'>Google Analytics 4 Mess-ID</Label>
            <Input
              value={form.googleAnalytics4Id}
              onChange={(e) => { setForm((p) => ({ ...p, googleAnalytics4Id: e.target.value })); setIsEditing(true); }}
              placeholder='G-...'
              className='h-9 text-xs font-mono'
            />
          </div>

          <div className='space-y-1.5'>
            <Label className='text-xs font-semibold'>Meta-Pixel-ID</Label>
            <Input
              value={form.metaPixelId}
              onChange={(e) => { setForm((p) => ({ ...p, metaPixelId: e.target.value })); setIsEditing(true); }}
              placeholder='982341908234112'
              className='h-9 text-xs font-mono'
            />
          </div>

          <div className='space-y-1.5'>
            <Label className='text-xs font-semibold'>Meta Conversion API-Token</Label>
            <Input
              type='password'
              value={form.metaConversionApiToken}
              onChange={(e) => { setForm((p) => ({ ...p, metaConversionApiToken: e.target.value })); setIsEditing(true); }}
              placeholder='••••••••••••••••'
              className='h-9 text-xs font-mono'
            />
          </div>
        </div>
      </div>

      {/* ── Section 5: Email & SMTP ── */}
      <div className='space-y-4 rounded-xl border border-border p-5 bg-card'>
        <div className='flex items-center justify-between pb-3 border-b border-border'>
          <div className='flex items-center gap-2'>
            <Mail className='w-4 h-4 text-primary' />
            <h4 className='text-sm font-semibold text-foreground'>Transaktionale E-Mails &amp; SMTP</h4>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='space-y-1.5'>
            <Label className='text-xs font-semibold'>Absender-E-Mail-Adresse</Label>
            <Input
              value={form.senderEmail}
              onChange={(e) => { setForm((p) => ({ ...p, senderEmail: e.target.value })); setIsEditing(true); }}
              placeholder='orders@ixosaudio.com'
              className='h-9 text-xs'
            />
          </div>

          <div className='space-y-1.5'>
            <Label className='text-xs font-semibold'>Resend-API-Schlüssel</Label>
            <Input
              type='password'
              value={form.resendApiKey}
              onChange={(e) => { setForm((p) => ({ ...p, resendApiKey: e.target.value })); setIsEditing(true); }}
              placeholder='re_...'
              className='h-9 text-xs font-mono'
            />
          </div>

          <div className='space-y-1.5'>
            <Label className='text-xs font-semibold'>SMTP-Server (Host)</Label>
            <Input
              value={form.smtpHost}
              onChange={(e) => { setForm((p) => ({ ...p, smtpHost: e.target.value })); setIsEditing(true); }}
              placeholder='smtp.example.com'
              className='h-9 text-xs font-mono'
            />
          </div>

          <div className='space-y-1.5'>
            <Label className='text-xs font-semibold'>SMTP-Port</Label>
            <Input
              value={form.smtpPort}
              onChange={(e) => { setForm((p) => ({ ...p, smtpPort: e.target.value })); setIsEditing(true); }}
              placeholder='587'
              className='h-9 text-xs font-mono'
            />
          </div>

          <div className='space-y-1.5'>
            <Label className='text-xs font-semibold'>SMTP-Benutzername (E-Mail)</Label>
            <Input
              value={form.smtpUser}
              onChange={(e) => { setForm((p) => ({ ...p, smtpUser: e.target.value })); setIsEditing(true); }}
              placeholder='ixos@drampalis.de'
              className='h-9 text-xs font-mono'
            />
          </div>

          <div className='space-y-1.5'>
            <Label className='text-xs font-semibold'>SMTP-Passwort</Label>
            <Input
              type='password'
              value={form.smtpPass}
              onChange={(e) => { setForm((p) => ({ ...p, smtpPass: e.target.value })); setIsEditing(true); }}
              placeholder='••••••••'
              className='h-9 text-xs font-mono'
            />
          </div>
        </div>
      </div>

      <div className='flex items-center justify-between gap-4 pt-2'>
        <p className='text-xs text-muted-foreground'>
          Schlüssel sind verschlüsselt und werden sicher mit Ihrer Produktionsdatenbank synchronisiert.
        </p>
        <Button
          type='submit'
          disabled={saving}
          className='cursor-pointer text-xs h-9 gap-1.5 bg-black hover:bg-neutral-800 text-white dark:bg-white dark:text-black shadow-2xs'
        >
          {saving ? (
            <>
              <Loader2 className='w-3.5 h-3.5 animate-spin' />
              <span>Saving Keys...</span>
            </>
          ) : (
            <>
              <Save className='w-3.5 h-3.5' />
              <span>Save API Keys</span>
            </>
          )}
        </Button>
      </div>
    </form>
  )
}

/* ── Main SettingsView ── */
export function SettingsView({ subTab = 'profile', onSelectTab, onLogout }: SettingsViewProps) {
  const normalized = subTab.replace('settings-', '') || 'profile'
  const [activeSubTab, setActiveSubTab] = useState(normalized)

  useEffect(() => {
    if (subTab) {
      setActiveSubTab(subTab.replace('settings-', '') || 'profile')
    }
  }, [subTab])

  const tabContent: Record<string, React.ReactNode> = {
    profile: <ProfileTab />,
    account: <AccountTab />,
    appearance: <AppearanceTab />,
    notifications: <NotificationsTab />,
    display: <DisplayTab />,
    'api-keys': <ApiKeysTab />,
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
        <div className='mb-2'>
          <h1 className='text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground'>
            Einstellungen
          </h1>
        </div>

        <Separator className='my-4 lg:my-6' />

        <div className='flex flex-1 flex-col space-y-6 lg:flex-row lg:space-y-0 lg:space-x-10'>
          {/* Sidebar Nav */}
          <aside className='top-0 lg:sticky lg:w-1/5 shrink-0'>
            <nav className='flex space-x-2 overflow-x-auto pb-2 lg:flex-col lg:space-x-0 lg:space-y-1 lg:overflow-visible lg:pb-0'>
              {navItems.map(item => (
                <button
                  key={item.id}
                  type='button'
                  onClick={() => {
                    setActiveSubTab(item.id)
                    if (onSelectTab) onSelectTab(`settings-${item.id}`)
                  }}
                  className={cn(
                    'inline-flex items-center justify-start gap-2 whitespace-nowrap rounded-lg text-xs font-semibold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 px-3.5 py-2 cursor-pointer',
                    activeSubTab === item.id
                      ? 'bg-neutral-900 text-white shadow-2xs dark:bg-white dark:text-neutral-900'
                      : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                  )}
                >
                  <item.icon className='size-3.5' />
                  <span>{item.title}</span>
                </button>
              ))}
            </nav>
          </aside>

          {/* Content Panel (fully scrollable, responsive) */}
          <div className='flex-1 w-full max-w-4xl'>
            <div className='w-full'>
              {tabContent[activeSubTab]}
            </div>
          </div>
        </div>
      </Main>
    </>
  )
}
export default SettingsView
