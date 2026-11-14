'use client'

import React, { useState, useEffect } from 'react'
import {
  KeyRound,
  Eye,
  EyeOff,
  Save,
  Loader2,
  ShieldCheck,
  CreditCard,
  Globe,
  Mail,
  Truck,
  CheckCircle2,
  Edit3,
  AlertTriangle,
  ExternalLink,
  Send,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { Header } from '@/components/admin/layout/Header'
import { Main } from '@/components/admin/layout/Main'
import { Search } from '@/components/admin/Search'
import { ThemeSwitch } from '@/components/admin/ThemeSwitch'
import { ConfigDrawer } from '@/components/admin/ConfigDrawer'
import { notifyAdmin } from '@/app/admin/components/AdminToast'
import { adminFetch } from '@/app/admin/AdminClientPage'

export function ApiKeysView() {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({})
  const [testingPaypal, setTestingPaypal] = useState(false)
  const [testingEmail, setTestingEmail] = useState(false)

  const testEmailConnection = async () => {
    setTestingEmail(true)
    try {
      const res = await fetch('/api/email/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetEmail: form.senderEmail || 'orders@wastram.com' }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok && data.success) {
        notifyAdmin('success', 'Email Connection Successful', 'Test email was delivered.')
      } else {
        notifyAdmin('warning', 'E-Mail-Test fehlgeschlagen', data.error || 'Test-E-Mail konnte nicht gesendet werden.')
      }
    } catch (e: any) {
      notifyAdmin('error', 'Verbindungsfehler', e.message || String(e))
    } finally {
      setTestingEmail(false)
    }
  }
  const [paypalTestResult, setPaypalTestResult] = useState<{
    success: boolean
    detectedMode?: string
    selectedMode?: string
    liveWorks?: boolean
    sandboxWorks?: boolean
    message?: string
    error?: string
  } | null>(null)

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
    dhlApiKey: '',
    dhlAccountNumber: '',
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
      .catch((err) => console.warn('Could not load API keys:', err))
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
        notifyAdmin('success', 'API-Schlüssel gespeichert', 'Produktionsschlüssel wurden in der Datenbank aktualisiert.')
      } else {
        throw new Error('Server hat einen Fehler gemeldet.')
      }
    } catch (err: any) {
      console.error('Error saving API keys:', err)
      notifyAdmin('error', 'Speichern fehlgeschlagen', err.message || 'API-Schlüssel konnten nicht gespeichert werden.')
    } finally {
      setSaving(false)
    }
  }

  const handleTestPaypal = async () => {
    setTestingPaypal(true)
    setPaypalTestResult(null)
    try {
      const res = await adminFetch('/api/paypal/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paypalClientId: form.paypalClientId,
          paypalSecret: form.paypalSecret,
          environment: form.environment,
        }),
      })
      const data = await res.json()
      setPaypalTestResult(data)
    } catch (err: any) {
      setPaypalTestResult({
        success: false,
        message: 'Connection test failed: ' + (err.message || 'Unknown error'),
      })
    } finally {
      setTestingPaypal(false)
    }
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center p-20 text-sm text-muted-foreground'>
        <Loader2 className='w-4 h-4 mr-2 animate-spin' /> Loading production API configuration...
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
              <KeyRound className='w-6 h-6 text-primary' />
              <span>API-Schlüssel &amp; Integrationen</span>
            </h1>
            <p className='text-xs sm:text-sm text-muted-foreground mt-1'>
              Configure and manage live API credentials for payment gateways, database, analytics, logistics, and communications.
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
              <span>{isEditing ? 'Bearbeitungsmodus' : 'Bearbeiten'}</span>
            </Button>

            <Button
              type='button'
              onClick={() => handleSave()}
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
                  <span>Gespeichert!</span>
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

        <form onSubmit={handleSave} className='space-y-6 pt-6 max-w-4xl'>
          {saveSuccess && (
            <div className='p-3.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs font-medium flex items-center gap-2 animate-fade-in'>
              <CheckCircle2 className='w-4 h-4 shrink-0' />
              <span>Produktions-API-Schlüssel und Zugangsdaten erfolgreich in der Datenbank gespeichert!</span>
            </div>
          )}

          {/* ── Section 1: Payment Gateways ── */}
          <div className='space-y-4 rounded-xl border border-border p-5 bg-card'>
            <div className='flex items-center justify-between pb-3 border-b border-border'>
              <div className='flex items-center gap-2'>
                <CreditCard className='w-4 h-4 text-primary' />
                <h4 className='text-sm font-semibold text-foreground'>Zahlungsgateways (PayPal &amp; Stripe)</h4>
              </div>
              <Badge variant='outline' className='text-[10px] uppercase font-mono'>
                {form.environment === 'live' ? 'Live-Produktion' : 'Sandbox-Testmodus'}
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
                    <SelectValue placeholder='Modus auswählen' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='sandbox'>Sandbox (Testmodus)</SelectItem>
                    <SelectItem value='live'>Live (Produktionsmodus)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-1.5'>
                <Label className='text-xs font-semibold'>Default Store Currency</Label>
                <Select
                  value={form.defaultCurrency}
                  onValueChange={(val) => { setForm((p) => ({ ...p, defaultCurrency: val })); setIsEditing(true); }}
                >
                  <SelectTrigger className='w-full h-9 text-xs'>
                    <SelectValue placeholder='Währung auswählen' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='INR'>INR (₹) — Indian Rupee</SelectItem>
                    <SelectItem value='USD'>USD ($) — US Dollar</SelectItem>
                    <SelectItem value='EUR'>EUR (€) — Euro</SelectItem>
                    <SelectItem value='USD'>USD ($) — US-Dollar</SelectItem>
                    <SelectItem value='GBP'>GBP (£) — Britisches Pfund</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* PayPal Credentials */}
            <div className='space-y-3 pt-2'>
              <div className='space-y-1.5'>
                <Label className='text-xs font-semibold'>PayPal Client-ID</Label>
                <Input
                  value={form.paypalClientId}
                  onChange={(e) => { setForm((p) => ({ ...p, paypalClientId: e.target.value })); setIsEditing(true); }}
                  placeholder='z. B. A21AAJ... (Live oder Sandbox Client-ID)'
                  className='h-9 text-xs font-mono'
                />
              </div>

              <div className='space-y-1.5'>
                <Label className='text-xs font-semibold'>PayPal Geheimer Schlüssel (Secret)</Label>
                <div className='relative'>
                  <Input
                    type={showSecrets.paypalSecret ? 'text' : 'password'}
                    value={form.paypalSecret}
                    onChange={(e) => { setForm((p) => ({ ...p, paypalSecret: e.target.value })); setIsEditing(true); }}
                    placeholder={form.paypalSecret ? '••••••••••••••••' : 'PayPal Secret eingeben'}
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

              {/* PayPal Connection Tester */}
              <div className='pt-1 space-y-2'>
                <div className='flex items-center justify-between'>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={handleTestPaypal}
                    disabled={testingPaypal || !form.paypalClientId}
                    className='text-xs h-8 gap-1.5'
                  >
                    {testingPaypal ? (
                      <>
                        <Loader2 className='w-3.5 h-3.5 animate-spin' />
                        <span>Verbindung wird geprüft...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className='w-3.5 h-3.5 text-primary' />
                        <span>PayPal-Verbindung testen (Live / Sandbox)</span>
                      </>
                    )}
                  </Button>
                  <a
                    href='https://developer.paypal.com/dashboard/applications'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-[11px] text-muted-foreground hover:text-primary inline-flex items-center gap-1 hover:underline'
                  >
                    <span>developer.paypal.com öffnen</span>
                    <ExternalLink className='w-3 h-3' />
                  </a>
                </div>

                {paypalTestResult && (
                  <div
                    className={cn(
                      'p-3 rounded-lg text-xs border space-y-1 animate-fade-in',
                      paypalTestResult.liveWorks
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                        : paypalTestResult.sandboxWorks
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-800 dark:text-amber-200'
                        : 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300'
                    )}
                  >
                    <div className='font-semibold flex items-center gap-1.5'>
                      {paypalTestResult.liveWorks ? (
                        <CheckCircle2 className='w-4 h-4 text-emerald-600 shrink-0' />
                      ) : paypalTestResult.sandboxWorks ? (
                        <AlertTriangle className='w-4 h-4 text-amber-600 shrink-0' />
                      ) : (
                        <AlertTriangle className='w-4 h-4 text-rose-600 shrink-0' />
                      )}
                      <span>
                        {paypalTestResult.liveWorks
                          ? 'Live-Produktionsverbindung aktiv'
                          : paypalTestResult.sandboxWorks
                          ? 'Sandbox-Testschlüssel erkannt'
                          : 'Verbindung fehlgeschlagen'}
                      </span>
                    </div>
                    <p className='text-[11px] leading-relaxed'>{paypalTestResult.message || paypalTestResult.error}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Stripe Credentials */}
            <div className='space-y-3 pt-2 border-t border-border/60'>
              <div className='space-y-1.5'>
                <Label className='text-xs font-semibold'>Stripe Veröffentlichbarer Schlüssel (Publishable Key)</Label>
                <Input
                  value={form.stripePublishableKey}
                  onChange={(e) => { setForm((p) => ({ ...p, stripePublishableKey: e.target.value })); setIsEditing(true); }}
                  placeholder='pk_live_...'
                  className='h-9 text-xs font-mono'
                />
              </div>

              <div className='space-y-1.5'>
                <Label className='text-xs font-semibold'>Stripe Geheimer Schlüssel (Secret Key)</Label>
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
                <Label className='text-xs font-semibold'>Firebase API-Schlüssel</Label>
                <Input
                  value={form.firebaseApiKey}
                  onChange={(e) => { setForm((p) => ({ ...p, firebaseApiKey: e.target.value })); setIsEditing(true); }}
                  className='h-9 text-xs font-mono'
                />
              </div>

              <div className='space-y-1.5'>
                <Label className='text-xs font-semibold'>Firebase Projekt-ID</Label>
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
                <Label className='text-xs font-semibold'>Speicher-Bucket (Storage Bucket)</Label>
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
                <h4 className='text-sm font-semibold text-foreground'>Shipping &amp; Logistics Carriers (Delhivery / Blue Dart / DHL Express)</h4>
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-1.5'>
                <Label className='text-xs font-semibold'>DHL API-Schlüssel / Token</Label>
                <Input
                  value={form.dhlApiKey}
                  onChange={(e) => { setForm((p) => ({ ...p, dhlApiKey: e.target.value })); setIsEditing(true); }}
                  placeholder='dhl_api_...'
                  className='h-9 text-xs font-mono'
                />
              </div>

              <div className='space-y-1.5'>
                <Label className='text-xs font-semibold'>DHL Abrechnungsnummer (EKP-Konto)</Label>
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
                <h4 className='text-sm font-semibold text-foreground'>Marketing &amp; Tracking-Analysen</h4>
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-1.5'>
                <Label className='text-xs font-semibold'>Google Tag Manager ID</Label>
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
                <Label className='text-xs font-semibold'>Meta Pixel ID</Label>
                <Input
                  value={form.metaPixelId}
                  onChange={(e) => { setForm((p) => ({ ...p, metaPixelId: e.target.value })); setIsEditing(true); }}
                  placeholder='982341908234112'
                  className='h-9 text-xs font-mono'
                />
              </div>

              <div className='space-y-1.5'>
                <Label className='text-xs font-semibold'>Meta Conversion-API Token</Label>
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
                  placeholder='orders@wastram.com'
                  className='h-9 text-xs'
                />
              </div>

              <div className='space-y-1.5'>
                <Label className='text-xs font-semibold'>Resend API-Schlüssel</Label>
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
                  placeholder='smtp.drampalis.de'
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
                  placeholder='orders@wastram.com'
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

            <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-border'>
              <p className='text-[11px] text-muted-foreground'>
                Order confirmations &amp; GST invoices are automatically sent to the customer and copied to orders@wastram.com.
              </p>
              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={testEmailConnection}
                disabled={testingEmail}
                className='h-8 text-xs gap-1.5 cursor-pointer shrink-0'
              >
                {testingEmail ? (
                  <>
                    <Loader2 className='w-3.5 h-3.5 animate-spin' />
                    <span>Wird gesendet...</span>
                  </>
                ) : (
                  <>
                    <Send className='w-3.5 h-3.5 text-primary' />
                    <span>Test-E-Mail senden</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className='flex items-center justify-between gap-4 pt-2 border-t border-border'>
            <p className='text-xs text-muted-foreground'>
              Schlüssel werden verschlüsselt und sicher in Ihrer Produktionsdatenbank gespeichert.
            </p>
            <div className='flex items-center gap-2'>
              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={() => setIsEditing(!isEditing)}
                className='h-9 text-xs gap-1.5 cursor-pointer'
              >
                <Edit3 className='w-3.5 h-3.5' />
                <span>{isEditing ? 'Abbrechen' : 'Bearbeiten'}</span>
              </Button>
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
          </div>
        </form>
      </Main>
    </>
  )
}
export default ApiKeysView
