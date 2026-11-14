import {
  LayoutDashboard,
  Users,
  Settings,
  KeyRound,
  HelpCircle,
  Command,
  GalleryVerticalEnd,
  ShoppingBag,
  Layers,
  Percent,
  Box,
  Star,
  Store,
  Truck,
  FileText,
  Megaphone,
  BookOpen,
  Sparkles,
  Headphones,
  Boxes,
} from 'lucide-react'
import { type SidebarData } from '../types'

export const getSidebarData = (unreadOrdersCount = 0, openTicketsCount = 0): SidebarData => ({
  user: {
    name: 'Administrator',
    email: 'admin@ixosaudio.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'IXOS Audio',
      logo: Command,
      plan: 'Offizieller Shop',
    },
    {
      name: 'IXOS Operations',
      logo: GalleryVerticalEnd,
      plan: 'Verwaltungskonsole',
    },
  ],
  navGroups: [
    {
      title: 'Allgemein',
      items: [
        {
          title: 'Übersicht',
          url: 'overview',
          icon: LayoutDashboard,
        },
        {
          title: 'Bestellungen',
          url: 'orders',
          badge: unreadOrdersCount > 0 ? String(unreadOrdersCount) : undefined,
          icon: ShoppingBag,
        },
        {
          title: 'Kundenservice',
          url: 'customer-support',
          badge: openTicketsCount > 0 ? String(openTicketsCount) : undefined,
          icon: Headphones,
        },
        {
          title: 'Kunden',
          url: 'customers',
          icon: Users,
        },
      ],
    },
    {
      title: 'Shop & Inventar',
      items: [
        {
          title: 'Produkte',
          url: 'products',
          icon: Box,
        },
        {
          title: 'Inventar',
          url: 'inventory',
          icon: Boxes,
        },
        {
          title: 'Kategorien',
          url: 'categories',
          icon: Layers,
        },
        {
          title: 'Rabatte',
          url: 'discounts',
          icon: Percent,
        },
        {
          title: 'Bewertungen',
          url: 'reviews',
          icon: Star,
        },
        {
          title: 'Versandtarife',
          url: 'shipping',
          icon: Truck,
        },
        {
          title: 'Rechtliches & Richtlinien',
          url: 'legal-policies',
          icon: FileText,
        },
      ],
    },
    {
      title: 'Sonstiges',
      items: [
        {
          title: 'Shop-Einstellungen',
          icon: Store,
          items: [
            {
              title: 'Ankündigungen',
              url: 'store-announcements',
              icon: Megaphone,
            },
            {
              title: 'Blog & Ratgeber',
              url: 'store-blogs',
              icon: BookOpen,
            },
            {
              title: 'Aktualisierungen',
              url: 'store-updates',
              icon: Sparkles,
            },
          ],
        },
        {
          title: 'API-Schlüssel',
          url: 'api-keys',
          icon: KeyRound,
        },
        {
          title: 'Hilfe-Center',
          url: 'help-center',
          icon: HelpCircle,
        },
      ],
    },
  ],
})
