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
    name: 'Atelier Admin',
    email: 'admin@wastram.com',
    avatar: '/images/brand/wastram-craft-emblem.png',
  },
  teams: [
    {
      name: 'Wastram Atelier',
      logo: Command,
      plan: 'Live Boutique',
    },
    {
      name: 'Wastram Operations',
      logo: GalleryVerticalEnd,
      plan: 'Wholesale Management',
    },
  ],
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          url: 'overview',
          icon: LayoutDashboard,
        },
        {
          title: 'Orders',
          url: 'orders',
          badge: unreadOrdersCount > 0 ? String(unreadOrdersCount) : undefined,
          icon: ShoppingBag,
        },
        {
          title: 'Customer Support',
          url: 'customer-support',
          badge: openTicketsCount > 0 ? String(openTicketsCount) : undefined,
          icon: Headphones,
        },
        {
          title: 'Customers',
          url: 'customers',
          icon: Users,
        },
      ],
    },
    {
      title: 'Store & Inventory',
      items: [
        {
          title: 'Products',
          url: 'products',
          icon: Box,
        },
        {
          title: 'Inventory',
          url: 'inventory',
          icon: Boxes,
        },
        {
          title: 'Categories',
          url: 'categories',
          icon: Layers,
        },
        {
          title: 'Discounts',
          url: 'discounts',
          icon: Percent,
        },
        {
          title: 'Reviews',
          url: 'reviews',
          icon: Star,
        },
        {
          title: 'Shipping Rates',
          url: 'shipping',
          icon: Truck,
        },
        {
          title: 'Legal & Policies',
          url: 'legal-policies',
          icon: FileText,
        },
      ],
    },
    {
      title: 'Settings & System',
      items: [
        {
          title: 'Store Settings',
          icon: Store,
          items: [
            {
              title: 'Announcements',
              url: 'store-announcements',
              icon: Megaphone,
            },
            {
              title: 'Lookbook & Journal',
              url: 'store-blogs',
              icon: BookOpen,
            },
            {
              title: 'Updates',
              url: 'store-updates',
              icon: Sparkles,
            },
          ],
        },
        {
          title: 'API Keys',
          url: 'api-keys',
          icon: KeyRound,
        },
        {
          title: 'Help Center',
          url: 'help-center',
          icon: HelpCircle,
        },
      ],
    },
  ],
})
