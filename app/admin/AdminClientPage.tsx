"use client";

import React, { useState, useMemo, useEffect, useCallback, useRef, Component, ErrorInfo } from "react";
import Link from "next/link";
import NextImage from "next/image";
import {
  BookOpen, BarChart3, FileText, Cpu, Globe, Search, Truck, Box, Plus, Lock, ShieldAlert, X, Upload, Check,
  Edit, Trash2, Eye, EyeOff, Star, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Save, Copy, ArrowLeft, Layers, Tag, Settings, Image as ImageIcon, HelpCircle, Download, Printer, GripVertical, Loader2, CreditCard, Mail,
  TrendingUp, ShoppingBag, Receipt, Users, ArrowRight, Clock, AlertCircle, ArrowUpRight, CheckCircle2, Menu, LayoutDashboard, RefreshCw,
  Activity, Phone, MessageCircle, Calendar, DollarSign, ShieldCheck, KeyRound, LogOut, Shield, Percent,
  FolderInput, ExternalLink, MapPin, Package, User, XCircle, Info, MoreHorizontal, Store, Megaphone, Sparkles, Headphones, Boxes
} from "lucide-react";
import Logo from "@/components/Logo";
import { firebase } from "@/lib/firebaseClient";
import InventoryTab from "./components/InventoryTab";
import DiscountsTab from "./components/DiscountsTab";
import ReviewsTab from "./components/ReviewsTab";
import ShippingTab from "./components/ShippingTab";
import LegalPoliciesTab from "./components/LegalPoliciesTab";
import AddSampleOrderModal from "./components/AddSampleOrderModal";
import EditOrderModal from "./components/EditOrderModal";
import AdminDrawer from "./components/AdminDrawer";
import { OrderDetailDrawer } from "./components/OrderDetailDrawer";
import { formatOrderSerialNumber, generateOrderSerialNumber } from "@/utils/orderNumber";
import { PRODUCTS as BASE_CATALOG_PRODUCTS } from "@/data/products";
import { getProductNormalizedCategoryId } from "@/data/compatibility";
import { isSurroundProduct, isCaseOrInlayProduct } from "@/utils/productLocalization";
import { invalidateCategoriesCache } from "@/lib/clientCategoriesCache";
import {
  AdminOverviewSkeleton,
  AdminCategoriesSkeleton,
  AdminProductsSkeleton,
  AdminOrdersSkeleton,
  AdminPaymentSettingsSkeleton,
  AdminSettingsSkeleton,
} from "./components/AdminSkeletons";
import AdminCustomSelect from "./components/AdminCustomSelect";
import { notifyAdmin, AdminToastContainer } from "./components/AdminToast";
import { safeSetLocalStorage } from "@/lib/safeStorage";
import { optimizeImageFile } from "@/lib/imageOptimizer";
import { generateProductSlug } from "@/utils/slug";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AuthenticatedLayout } from "@/components/admin/layout/AuthenticatedLayout";
import { Header } from "@/components/admin/layout/Header";
import { Main } from "@/components/admin/layout/Main";
import { Search as SearchHeader } from "@/components/admin/Search";
import { ThemeSwitch } from "@/components/admin/ThemeSwitch";
import { ConfigDrawer } from "@/components/admin/ConfigDrawer";
import { DashboardView } from "@/components/admin/features/DashboardView";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import {
  parseOrderTimestamp,
  getAdminTimeZone,
  getAdminLocalDateString,
  getAdminTodayDateString,
  getAdminLocalHour,
  formatAdminOrderDateTime,
  getTimeZoneAbbreviation,
} from "@/utils/adminTimezone";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Overview } from "@/components/admin/dashboard/OverviewChart";
import { RecentSales } from "@/components/admin/dashboard/RecentSales";
import { AnalyticsView } from "@/components/admin/dashboard/AnalyticsView";
import { CustomersView, UsersView } from "@/components/admin/features/UsersView";
import { CustomerSupportView } from "@/components/admin/features/CustomerSupportView";
import { SettingsView } from "@/components/admin/features/SettingsView";
import { ApiKeysView } from "@/components/admin/features/ApiKeysView";
import { StoreSettingsView } from "@/components/admin/features/StoreSettingsView";
import { ErrorView } from "@/components/admin/features/ErrorView";
import { AuthPreviewView } from "@/components/admin/features/AuthPreviewView";
import { useCurrency } from "@/context/CurrencyContext";
import { 
  DocCurrency, 
  DocLanguage, 
  SUPPORTED_CURRENCIES, 
  SUPPORTED_LANGUAGES, 
  formatDocCurrency, 
  formatDocCurrencyShort, 
  t 
} from "@/utils/exportDocsTranslations";

// ─── Types ───────────────────────────────────────────────────────
interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  is_hidden: boolean;
  sort_order: number;
  seo_meta: Record<string, string> | null;
  product_count?: number;
  isVirtual?: boolean;
}

interface Product {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  short_desc: string | null;
  long_desc: string | null;
  featured_image: string | null;
  is_hidden: boolean;
  is_featured: boolean;
  tag?: "SALE" | "POPULAR" | "BESTSELLER" | string | null;
  brand?: string | null;
  partNumber?: string | null;
  part_number?: string | null;
  fitsModels?: string | null;
  ohm?: string | null;
  spule_durchmesser?: string | null;
  shortDescription?: string | null;
  descriptionHtml?: string | null;
  seo_meta: Record<string, any> | null;
  tags: string[] | null;
  applications: string | null;
  price: number | null;
  stock?: number;
  stockQty?: number;
  technical_specs: Record<string, string> | null;
  media_urls: string[] | null;
  sort_order: number;
  moq: string | null;
  category?: { id?: string; name: string; slug: string };
  category_slug?: string;
  category_name?: string;
  gallery?: string[];
  variants?: Variant[];
  shipping_rates?: Record<string, number> | null;
  translations?: Record<string, any> | null;
}

interface Variant {
  id: string;
  product_id: string;
  name: string;
  specs: Record<string, string>;
  stock: number | null;
  price: number | null;
  is_active: boolean;
  sort_order: number;
  part_numbers?: PartNumber[];
}

interface PartNumber {
  id: string;
  variant_id: string;
  code: string;
}

interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  alt_text: string | null;
  order_index: number;
}

interface DownloadItem {
  id: string;
  product_id: string;
  type: string;
  url: string;
  title: string | null;
}

interface FAQ {
  id: string;
  product_id: string;
  question: string;
  answer: string;
  order_index: number;
}

// ─── Admin Auth & Fetch Interceptor ──────────────────────────────
export function getAdminHeaders(customHeaders: HeadersInit = {}): Headers {
  const headers = new Headers(customHeaders);
  headers.set("x-admin-session", "active");
  if (typeof window !== "undefined") {
    const token = sessionStorage.getItem("ixos_admin_token");
    if (token) {
      headers.set("x-admin-token", token);
      headers.set("Authorization", `Bearer ${token}`);
    }
  }
  return headers;
}

export async function adminFetch(url: string, init?: RequestInit): Promise<Response> {
  const headers = getAdminHeaders(init?.headers);
  return fetch(url, {
    ...init,
    credentials: "include",
    headers,
  });
}

// Transparently intercept internal API fetch calls on admin client to guarantee credentials & tokens
if (typeof window !== "undefined" && !(window as any).__ixos_admin_fetch_hooked) {
  (window as any).__ixos_admin_fetch_hooked = true;
  const originalFetch = window.fetch;
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    try {
      const urlStr =
        typeof input === "string"
          ? input
          : input instanceof URL
          ? input.toString()
          : (input as Request).url || "";
      if (urlStr.startsWith("/api/") || urlStr.includes("/api/")) {
        const token = sessionStorage.getItem("ixos_admin_token");
        const headers = new Headers(init?.headers || (input instanceof Request ? input.headers : {}));
        headers.set("x-admin-session", "active");
        if (token && !headers.has("x-admin-token")) {
          headers.set("x-admin-token", token);
        }
        if (token && !headers.has("Authorization")) {
          headers.set("Authorization", `Bearer ${token}`);
        }
        return originalFetch(input, {
          ...init,
          credentials: init?.credentials || "include",
          headers,
        });
      }
    } catch (_) {}
    return originalFetch(input, init);
  };
}

// ─── Helper: Generate slug ───────────────────────────────────────
function generateSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

// ─── Helper: Avatar Initials ────────────────────────────────────
function getInitials(name?: string): string {
  if (!name) return "KD";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

// ─── Reusable Input Component ────────────────────────────────────
function FormField({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-semibold text-muted-foreground uppercase tracking-wider text-[10px] font-sans">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputClass = "bg-background border border-input rounded-lg px-3.5 py-2 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-ring focus:border-ring transition-all font-sans";
const btnPrimary = "bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center px-4 py-2 text-xs font-bold uppercase tracking-wider cursor-pointer gap-1.5 rounded-lg shadow-xs transition-all touch-manipulation";
const btnSecondary = "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border inline-flex items-center justify-center px-4 py-2 text-xs font-bold uppercase tracking-wider cursor-pointer gap-1.5 rounded-lg transition-all touch-manipulation";
const btnDanger = "bg-destructive text-destructive-foreground hover:bg-destructive/90 inline-flex items-center justify-center px-3.5 py-1.5 text-xs font-bold tracking-wider cursor-pointer gap-1 rounded-lg shadow-xs transition-all touch-manipulation";

// ═══════════════════════════════════════════════════════════════════
// ERROR BOUNDARY FOR RESILIENT ADMIN CONSOLE
// ═══════════════════════════════════════════════════════════════════
interface AdminErrorBoundaryProps {
  children: React.ReactNode;
}
interface AdminErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class AdminErrorBoundary extends Component<AdminErrorBoundaryProps, AdminErrorBoundaryState> {
  constructor(props: AdminErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): AdminErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[Admin Error Boundary Caught]", error, errorInfo);
  }

  handleClearCacheAndReload = () => {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("gsp_sample_orders");
        localStorage.removeItem("gsp_inquiries");
        localStorage.removeItem("ixos_admin_expenses");
      } catch (e) {
        console.error("Failed to clear local cache:", e);
      }
      window.location.reload();
    }
  };

  handleSignOutAndReset = async () => {
    if (typeof window !== "undefined") {
      try {
        await fetch("/api/admin/auth", { method: "DELETE" }).catch(() => {});
        sessionStorage.removeItem("gsp_admin_authenticated");
        localStorage.removeItem("gsp_sample_orders");
        localStorage.removeItem("gsp_inquiries");
      } catch (e) {
        console.error("Failed to reset session:", e);
      }
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0F0F10] text-white flex items-center justify-center p-6 font-sans">
          <div className="max-w-xl w-full bg-[#18181A] border border-red-500/30 rounded-2xl p-8 space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/30 text-[#000000] flex items-center justify-center">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-white">Admin Console Restored</h2>
              <p className="text-xs text-slate-400 mt-1">
                A component error was caught. You can reload the page or reset the local cache:
              </p>
            </div>
            <div className="p-3.5 bg-black/50 border border-red-500/20 rounded-xl font-mono text-[11px] text-red-400 overflow-x-auto">
              {this.state.error?.message || "Unknown rendering exception"}
            </div>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={this.handleClearCacheAndReload}
                className="px-4 py-2.5 bg-[#000000] hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                Clear Local Cache &amp; Reload
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                Reload Console
              </button>
              <button
                onClick={this.handleSignOutAndReset}
                className="px-4 py-2.5 bg-transparent border border-slate-700 hover:border-slate-500 text-slate-300 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// ═══════════════════════════════════════════════════════════════════
// MAIN ADMIN COMPONENT
// ═══════════════════════════════════════════════════════════════════
export default function AdminPage() {
  return (
    <AdminErrorBoundary>
      <AdminPageContent />
    </AdminErrorBoundary>
  );
}

// ═══════════════════════════════════════════════════════════════════
// ORDER TABS PIPELINE DEFINITION
// ═══════════════════════════════════════════════════════════════════
const ORDER_TABS_PIPELINE = [
  {
    id: "NEW",
    label: "Neue Orders",
    nextStatus: "Courier Assigned",
    nextTabId: "COURIER_ASSIGNED",
    nextActionLabel: "Mark as 'Courier Assigned'",
  },
  {
    id: "COURIER_ASSIGNED",
    label: "Courier Assigned",
    nextStatus: "In Transit",
    nextTabId: "IN_TRANSIT",
    nextActionLabel: "Als 'Auf dem Shippingweg' markieren",
  },
  {
    id: "IN_TRANSIT",
    label: "Auf dem Shippingweg",
    nextStatus: "Shipped",
    nextTabId: "SHIPPED",
    nextActionLabel: "Mark as 'Dispatched'",
  },
  {
    id: "SHIPPED",
    label: "Delivered / Dispatched",
    nextStatus: "Delivered",
    nextTabId: "SHIPPED",
    nextActionLabel: "Als 'Zugestellt' markieren",
  },
  {
    id: "CANCELLED",
    label: "Cancelled",
    nextStatus: "Payment Confirmed",
    nextTabId: "NEW",
    nextActionLabel: "Wiederherstellen (Neue Order)",
  },
];

function normalizeAdminOrder(order: any): any {
  if (!order || typeof order !== "object") return order;
  const orderNumber = formatOrderSerialNumber(
    order.orderId || order.order_number || order.id
  );

  const custName =
    order.customer?.name ||
    order.customer_name ||
    order.payerName ||
    "Guest Customer";

  const custEmail =
    order.customer?.email ||
    order.customer_email ||
    order.payerEmail ||
    "guest@ixos.audio";

  const custPhone =
    order.customer?.phone ||
    order.customer_phone ||
    "";

  const custCompany =
    order.customer?.company ||
    "";

  const shipStreet =
    order.shipping?.address ||
    order.shipping_street ||
    order.address ||
    "";

  const shipCity =
    order.shipping?.city ||
    order.shipping_city ||
    order.city ||
    "";

  const shipState =
    order.shipping?.state ||
    order.shipping_state ||
    "";

  const shipZip =
    order.shipping?.zip ||
    order.shipping_zip ||
    order.postalCode ||
    "";

  const shipCountry =
    order.shipping?.country ||
    order.shipping_country ||
    order.country ||
    "India";

  let prodName = order.productName || order.product_name;
  let varName = order.variantName;

  if (Array.isArray(order.items) && order.items.length > 0) {
    if (!prodName) {
      prodName = order.items
        .map((i: any) => `${i.name || i.productName || "Item"} (x${i.quantity || 1})`)
        .join(", ");
    }
    if (!varName) {
      varName = order.items[0]?.variant || order.items[0]?.variantName || "Standard Spec";
    }
  }

  if (!prodName) prodName = "Wastram Atelier Product";
  if (!varName) varName = "Standard Spec";

  const normalizedItems = Array.isArray(order.items) && order.items.length > 0
    ? order.items.map((it: any) => {
        const iName = it.name || it.productName || it.title || prodName;
        return {
          ...it,
          id: it.id || it.productId || it.product_id,
          name: iName,
          productName: iName,
          quantity: Number(it.quantity) || 1,
          unitPrice: Number(it.unitPrice || it.price || 0),
          price: Number(it.price || it.unitPrice || 0),
          variant: it.variant || it.variantName || varName,
          variantName: it.variantName || it.variant || varName,
          image: it.image || it.featured_image || it.thumbnail || order.featured_image || order.image || "",
          partNumber: it.partNumber || it.part_number || "",
        };
      })
    : [{
        id: order.productId || "part-1",
        name: prodName,
        productName: prodName,
        quantity: Number(order.quantity) || 1,
        unitPrice: Number(order.unitPrice || order.total) || 0,
        price: Number(order.price || order.total) || 0,
        variant: varName,
        variantName: varName,
        image: order.image || order.featured_image || "",
        partNumber: order.partNumber || "",
      }];

  const rawStatus = (order.status || "").trim();
  let normalizedStatus = rawStatus;
  const sLower = rawStatus.toLowerCase();
  if (sLower === "courier assigned" || sLower === "courier_assigned" || sLower === "accepted") {
    normalizedStatus = "Courier Assigned";
  } else if (sLower === "in transit" || sLower === "in_transit" || sLower === "in-transit" || sLower.includes("transit")) {
    normalizedStatus = "In Transit";
  } else if (sLower === "shipped" || sLower === "dispatched") {
    normalizedStatus = "Shipped";
  } else if (sLower === "delivered" || sLower === "completed") {
    normalizedStatus = "Delivered";
  } else if (sLower === "cancelled" || sLower === "canceled" || sLower === "refunded") {
    normalizedStatus = "Cancelled";
  } else if (
    !normalizedStatus ||
    normalizedStatus === "Paid via PayPal" ||
    normalizedStatus === "Paid" ||
    sLower === "confirmed" ||
    sLower === "new" ||
    sLower === "pending" ||
    sLower === "payment confirmed"
  ) {
    normalizedStatus = "Payment Confirmed";
  }

  const payGateway =
    order.payment?.gateway ||
    order.payment_gateway ||
    "PayPal";

  const payTxn =
    order.payment?.transactionId ||
    order.payment_id ||
    order.paypal_order_id ||
    "";

  const payStatus =
    order.payment?.status ||
    (normalizedStatus === "Payment Confirmed" || rawStatus.toLowerCase().includes("paid")
      ? "Paid"
      : "Pending");

  const parsedDate = parseOrderTimestamp(order.created_at || order.date);
  const orderDate = parsedDate
    ? getAdminLocalDateString(parsedDate)
    : (order.date || getAdminTodayDateString());

  const totalVal = Number(order.total) || 0;

  return {
    ...order,
    id: orderNumber,
    orderId: orderNumber,
    order_number: orderNumber,
    total: totalVal,
    customer_name: custName,
    customer_email: custEmail,
    customer_phone: custPhone,
    shipping_street: shipStreet,
    shipping_city: shipCity,
    shipping_zip: shipZip,
    shipping_country: shipCountry,
    product_name: prodName,
    productName: prodName,
    variantName: varName,
    items: normalizedItems,
    date: orderDate,
    status: normalizedStatus,
    customer: {
      name: custName,
      company: custCompany,
      email: custEmail,
      phone: custPhone,
      taxId: order.customer?.taxId || "",
    },
    shipping: {
      address: shipStreet,
      city: shipCity,
      state: shipState,
      zip: shipZip,
      country: shipCountry,
      trackingNumber: order.shipping?.trackingNumber || order.trackingAwbNumber || order.tracking_number || "",
      carrier: order.shipping?.carrier || order.courier || order.carrierName || "DHL Paket / Deutsche Post",
    },
    payment: {
      gateway: payGateway,
      method: order.payment?.method || order.payment_method || "paypal",
      status: payStatus,
      transactionId: payTxn,
    },
    payment_gateway: payGateway,
    payment_id: payTxn,
  };
}

function AdminPageContent() {
  const { formatAmount, convertAmount, currency, setCurrency } = useCurrency();
  const formatViewAmount = (val: number, options?: { minimumFractionDigits?: number; maximumFractionDigits?: number }) => {
    return formatAmount(val, { ...options, fromCurrency: currency });
  };

  // Lock Admin Panel currency strictly to EUR (₹)
  useEffect(() => {
    if (currency !== "EUR") {
      setCurrency("EUR");
    }
  }, [currency, setCurrency]);

  // Auth
  const [passcode, setPasscode] = useState("");

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [error, setError] = useState("");

  // Navigation
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [sidebarSearchQuery, setSidebarSearchQuery] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("gsp_admin_sidebar_collapsed");
      if (saved === "true") setIsSidebarCollapsed(true);
    } catch {}
  }, []);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(prev => {
      const next = !prev;
      try {
        localStorage.setItem("gsp_admin_sidebar_collapsed", String(next));
      } catch {}
      return next;
    });
  };
  const [unreadOrdersCount, setUnreadOrdersCount] = useState<number>(0);
  const [unreadClientsCount, setUnreadClientsCount] = useState<number>(0);
  const [crmClientsCount, setCrmClientsCount] = useState<number>(0);
  const [hoveredTrendDay, setHoveredTrendDay] = useState<number | null>(null);
  const [isGraphRangeOpen, setIsGraphRangeOpen] = useState(false);
  const [graphRange, setGraphRange] = useState<"today" | "7d" | "last_month" | "last_3_months" | "custom">("7d");
  const [customGraphStart, setCustomGraphStart] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() - 14);
    return d.toISOString().split("T")[0];
  });
  const [customGraphEnd, setCustomGraphEnd] = useState<string>(() => {
    return new Date().toISOString().split("T")[0];
  });
  const [purchaseOrders, setPurchaseOrders] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);

  // Wholesale Price Unlocks Leads State
  const [priceUnlocks, setPriceUnlocks] = useState<Array<{
    id: string;
    order_number?: string;
    email: string;
    phone: string;
    customer_name?: string;
    product_name?: string;
    status?: string;
    country?: string;
    country_code?: string;
    country_flag?: string;
    city?: string;
    session_matched?: boolean;
    date?: string;
    created_at?: string;
  }>>([]);
  const [loadingPriceUnlocks, setLoadingPriceUnlocks] = useState(false);
  const [priceUnlockSearchQuery, setPriceUnlockSearchQuery] = useState("");

  // Live Storefront Traffic & Session Intelligence State
  const [trafficStats, setTrafficStats] = useState<{
    live_active_now: number;
    today_visitors: number;
    today_sessions: number;
    today_pageviews: number;
    total_sessions: number;
    avg_duration_seconds: number;
    top_country: { name: string; flag: string; count: number };
    top_explored_items: Array<{ item: string; category: string; count: number }>;
  }>({
    live_active_now: 0,
    today_visitors: 0,
    today_sessions: 0,
    today_pageviews: 0,
    total_sessions: 0,
    avg_duration_seconds: 0,
    top_country: { name: "Global", flag: "🌐", count: 0 },
    top_explored_items: [],
  });


  // Categories state
  const [categories, setCategories] = useState<Category[]>([]);
  const [catLoading, setCatLoading] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [showCatForm, setShowCatForm] = useState(false);
  const [catSearch, setCatSearch] = useState("");

  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  const [prodLoading, setProdLoading] = useState(false);
  const [editingProd, setEditingProd] = useState<Product | null>(null);
  const [showProdForm, setShowProdForm] = useState(false);
  const [prodCategoryFilter, setProdCategoryFilter] = useState("");
  const [prodStatusFilter, setProdStatusFilter] = useState<"ALL" | "ACTIVE" | "FEATURED" | "HIDDEN">("ALL");
  const [prodSearch, setProdSearch] = useState("");
  const [prodCurrentPage, setProdCurrentPage] = useState(1);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeletingProd, setIsDeletingProd] = useState(false);
  const [selectedProdIds, setSelectedProdIds] = useState<string[]>([]);
  const [bulkTargetCat, setBulkTargetCat] = useState<string>("");
  const [isBulkMoving, setIsBulkMoving] = useState<boolean>(false);

  // Used Parts & Category specific add options
  const [showUsedPartsChoiceModal, setShowUsedPartsChoiceModal] = useState(false);
  const [showSelectExistingModal, setShowSelectExistingModal] = useState(false);
  const [catalogForUsedModal, setCatalogForUsedModal] = useState<Product[]>([]);
  const [loadingCatalogForUsed, setLoadingCatalogForUsed] = useState(false);
  const [existingProdSearch, setExistingProdSearch] = useState("");
  const [existingProdCatFilter, setExistingProdCatFilter] = useState("all");
  const [targetCategoryForAdd, setTargetCategoryForAdd] = useState<Category | null>(null);

  const isBaseCatalogProduct = useCallback((p: Product | { id?: string; slug?: string } | null) => {
    if (!p) return false;
    const cleanId = (p.id || "").toLowerCase().trim();
    const cleanSlug = (p.slug || "").toLowerCase().trim();
    return BASE_CATALOG_PRODUCTS.some(
      (bp) =>
        bp.id.toLowerCase().trim() === cleanId ||
        bp.slug.toLowerCase().trim() === cleanSlug ||
        bp.aliasSlugs?.some((a) => a.toLowerCase().trim() === cleanSlug || a.toLowerCase().trim() === cleanId)
    );
  }, []);

  const unassignedProducts = useMemo(() => {
    return products.filter((p) => {
      const catId = getProductNormalizedCategoryId(p);
      return !catId || catId === "" || catId === "none" || catId === "unassigned";
    });
  }, [products]);

  // Product detail editing
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [detailVariants, setDetailVariants] = useState<Variant[]>([]);
  const [detailImages, setDetailImages] = useState<ProductImage[]>([]);
  const [detailDownloads, setDetailDownloads] = useState<DownloadItem[]>([]);
  const [detailFaqs, setDetailFaqs] = useState<FAQ[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [sampleOrders, setSampleOrders] = useState<any[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const storedOrders = localStorage.getItem("gsp_sample_orders");
        if (storedOrders) {
          const parsed = JSON.parse(storedOrders);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed.filter(Boolean).map(normalizeAdminOrder);
          }
        }
      } catch {}
    }
    return [];
  });
  const [orderSearchQuery, setOrderSearchQuery] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("ALL");
  const [expandedOrderIds, setExpandedOrderIds] = useState<string[]>([]);
  const [selectedOrderRowIds, setSelectedOrderRowIds] = useState<string[]>([]);

  const toggleOrderExpanded = useCallback((id: string) => {
    setExpandedOrderIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  }, []);

  // Payments State
  const [payments, setPayments] = useState<any[]>([]);
  const [loadingPayments, setLoadingPayments] = useState(false);
  const [paymentSearch, setPaymentSearch] = useState("");
  const [paymentGatewayFilter, setPaymentGatewayFilter] = useState("all");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all");
  const [paymentSortKey, setPaymentSortKey] = useState("created_at");
  const [paymentSortOrder, setPaymentSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedPayment, setSelectedPayment] = useState<any | null>(null);
  const [paymentPage, setPaymentPage] = useState(1);
  // Sample Order Modal state
  const [showAddSampleOrderModal, setShowAddSampleOrderModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState<any | null>(null);
  const [selectedOrderForDetail, setSelectedOrderForDetail] = useState<any | null>(null);

  // Refund state
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundAmount, setRefundAmount] = useState("");
  const [refundType, setRefundType] = useState<"full" | "partial">("full");
  const [processingRefund, setProcessingRefund] = useState(false);

  const [paymentSettings, setPaymentSettings] = useState({
    enablePaypal: true,
    paypalClientId: "",
    paypalSecret: "",
    environment: "sandbox",
    defaultCurrency: "INR",
  });
  const [savingSettings, setSavingSettings] = useState(false);

  // PDF Price List Generation States
  const [showPriceListModal, setShowPriceListModal] = useState(false);
  const [priceListStep, setPriceListStep] = useState<1 | 2>(1);
  const [priceListMode, setPriceListMode] = useState<"categories" | "products">("categories");
  const [priceListSelectedCategoryIds, setPriceListSelectedCategoryIds] = useState<string[]>([]);
  const [priceListSelectedProductIds, setPriceListSelectedProductIds] = useState<string[]>([]);
  const [priceListSearchQuery, setPriceListSearchQuery] = useState("");
  const [priceListExpandedCategoryIds, setPriceListExpandedCategoryIds] = useState<string[]>([]);
  const [priceListCustomPrices, setPriceListCustomPrices] = useState<Record<string, number | string>>({});
  const [priceListBulkDiscountPercent, setPriceListBulkDiscountPercent] = useState<string>("");
  const [pdfSelectedCurrencies, setPdfSelectedCurrencies] = useState<import("@/utils/pdfGenerator").CurrencyCode[]>(["EUR", "USD"]);
  const [generatingPdfStatus, setGeneratingPdfStatus] = useState("");

  // ─── Manual Invoice & Bulk Order States ─────────────────────────
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [invoiceGateway, setInvoiceGateway] = useState("Manual Invoice");
  const [invoicePaymentStatus, setInvoicePaymentStatus] = useState("Paid");
  const [invoiceOrderStatus, setInvoiceOrderStatus] = useState("Payment Confirmed");
  
  const [custCompany, setCustCompany] = useState("");
  const [custName, setCustName] = useState("");
  const [custEmail, setCustEmail] = useState("");
  const [custPhone, setCustPhone] = useState("");
  const [custTaxId, setCustTaxId] = useState("");
  
  const [shipAddress, setShipAddress] = useState("");
  const [shipCity, setShipCity] = useState("");
  const [shipState, setShipState] = useState("");
  const [shipZip, setShipZip] = useState("");
  const [shipCountry, setShipCountry] = useState("Spain");

  interface InvoiceItem {
    productId: string;
    productName: string;
    variantId: string;
    variantName: string;
    quantity: number;
    unitPrice: number;
  }
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
  
  const [currItemCategoryId, setCurrItemCategoryId] = useState("");
  const [currItemProductId, setCurrItemProductId] = useState("");
  const [currItemVariantId, setCurrItemVariantId] = useState("");
  const [currItemQty, setCurrItemQty] = useState(1);
  const [currItemPrice, setCurrItemPrice] = useState(0);

  const [invoiceShippingFee, setInvoiceShippingFee] = useState(0);
  const [invoiceTaxRate, setInvoiceTaxRate] = useState(0);
  const [invoiceDiscount, setInvoiceDiscount] = useState(0);

  // International Export Specifics
  const [invoiceIncoterms, setInvoiceIncoterms] = useState("CPT - Carriage Paid To");
  const [invoiceHsCode, setInvoiceHsCode] = useState("8518.90.00");
  const [invoicePortOfLoading, setInvoicePortOfLoading] = useState("Jaipur International Airport (JAI), India");
  const [invoiceNotes, setInvoiceNotes] = useState("Wastram Sound & Audio precision acoustic components and speaker repair parts.");

  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<any | null>(null);

  // ─── Export Documents Suite States ──────────────────────────────
  const [activeDocType, setActiveDocType] = useState<"CI" | "PI" | "PL" | "QUOTATION" | "COO" | "COA" | "SWIFT" | "SHIPPING_ADVICE" | "SAMPLE_NOTE" | "CONTRACT">("CI");
  const [docModalType, setDocModalType] = useState<"CI" | "PI" | "PL" | "QUOTATION" | "COO" | "COA" | "SWIFT" | "SHIPPING_ADVICE" | "SAMPLE_NOTE" | "CONTRACT">("CI");
  const [docValidUntil, setDocValidUntil] = useState("30 Days from issue");
  const [carrierName, setCarrierName] = useState("DHL Paket Air Cargo");
  const [trackingAwbNumber, setTrackingAwbNumber] = useState("");
  const [dispatchDate, setDispatchDate] = useState("");
  const [estimatedDeliveryDate, setEstimatedDeliveryDate] = useState("");
  const [selectedOrderToLoad, setSelectedOrderToLoad] = useState("");

  // Export Document Currency & Multi-Language Configuration
  const [docCurrency, setDocCurrency] = useState<DocCurrency>("EUR");
  const [docLanguage, setDocLanguage] = useState<DocLanguage>("de");

  // Advance / Partial Payment Settlement State
  const [paymentBreakdownMode, setPaymentBreakdownMode] = useState<"full_paid" | "full_unpaid" | "partial">("full_paid");
  const [advancePaidPct, setAdvancePaidPct] = useState<number>(30);
  const [advancePaidAmountInput, setAdvancePaidAmountInput] = useState<string>("");



  // Auto-fill first variant and price when product is selected in item builder
  useEffect(() => {
    if (!currItemProductId) return;
    if (currItemProductId === "CATEGORY_ALL" && currItemCategoryId) {
      setCurrItemVariantId("");
      const catProds = products.filter(p => p.category_id === currItemCategoryId);
      const estTotal = catProds.reduce((sum, p) => {
        const vPrice = p.variants?.[0]?.price || p.price || 0;
        return sum + vPrice;
      }, 0);
      setCurrItemPrice(Number(estTotal.toFixed(2)) || 0);
      return;
    }
    const prod = products.find(p => p.id === currItemProductId);
    if (prod && prod.variants && prod.variants.length > 0) {
      const firstVar = prod.variants[0];
      setCurrItemVariantId(firstVar.id);
      setCurrItemPrice(firstVar.price || 0);
    } else {
      setCurrItemVariantId("");
      setCurrItemPrice(0);
    }
  }, [currItemProductId, currItemCategoryId, products]);

  // Update unit price when variant changes
  useEffect(() => {
    if (!currItemProductId || !currItemVariantId || currItemProductId === "CATEGORY_ALL") return;
    const prod = products.find(p => p.id === currItemProductId);
    if (prod && prod.variants) {
      const v = prod.variants.find(varItem => varItem.id === currItemVariantId);
      if (v) {
        setCurrItemPrice(v.price || 0);
      }
    }
  }, [currItemVariantId, currItemProductId, products]);

  // Add Item to Invoice handler
  const handleAddInvoiceItem = () => {
    if (!currItemProductId) {
      notifyAdmin("warning", "Selection Required", "Please select a product or a complete category.");
      return;
    }

    // Complete Category Lot package item
    if (currItemProductId === "CATEGORY_ALL" && currItemCategoryId) {
      const cat = categories.find(c => c.id === currItemCategoryId);
      if (!cat) return;
      const catProds = products.filter(p => p.category_id === cat.id);
      const newItem: InvoiceItem = {
        productId: `cat-${cat.id}`,
        productName: `${cat.name} (Komplettes Category-Sortiment)`,
        variantId: "",
        variantName: `Complete Category Set (${catProds.length} Styles)`,
        quantity: Number(currItemQty) > 0 ? Number(currItemQty) : 1,
        unitPrice: Number(currItemPrice) >= 0 ? Number(currItemPrice) : 0,
      };

      setInvoiceItems(prev => [...prev, newItem]);
      setCurrItemProductId("");
      setCurrItemVariantId("");
      setCurrItemQty(1);
      setCurrItemPrice(0);
      return;
    }

    const prod = products.find(p => p.id === currItemProductId);
    if (!prod) return;

    let variantName = "Standard";
    if (currItemVariantId && prod.variants) {
      const v = prod.variants.find(varItem => varItem.id === currItemVariantId);
      if (v) variantName = v.name;
    }

    const newItem: InvoiceItem = {
      productId: prod.id,
      productName: prod.name,
      variantId: currItemVariantId,
      variantName,
      quantity: Number(currItemQty) > 0 ? Number(currItemQty) : 1,
      unitPrice: Number(currItemPrice) >= 0 ? Number(currItemPrice) : 0,
    };

    setInvoiceItems(prev => [...prev, newItem]);
    // Reset product selection to allow picking next item
    setCurrItemProductId("");
    setCurrItemVariantId("");
    setCurrItemQty(1);
    setCurrItemPrice(0);
  };

  // Bulk add all products in a category
  const handleAddAllCategoryItems = (catId?: string) => {
    const targetCatId = catId || currItemCategoryId;
    if (!targetCatId) {
      notifyAdmin("warning", "Category Required", "Please select a category first.");
      return;
    }
    const cat = categories.find(c => c.id === targetCatId);
    if (!cat) return;
    const catProds = products.filter(p => p.category_id === cat.id);
    if (catProds.length === 0) {
      notifyAdmin("info", "No Products", `No products found in category "${cat.name}".`);
      return;
    }

    const defaultQty = Number(currItemQty) > 0 ? Number(currItemQty) : 100;
    const newItems: InvoiceItem[] = catProds.map(prod => {
      let variantId = "";
      let variantName = "Standard";
      let unitPrice = prod.price || 0;
      if (prod.variants && prod.variants.length > 0) {
        variantId = prod.variants[0].id;
        variantName = prod.variants[0].name;
        if (prod.variants[0].price) {
          unitPrice = prod.variants[0].price;
        }
      }
      return {
        productId: prod.id,
        productName: prod.name,
        variantId,
        variantName,
        quantity: defaultQty,
        unitPrice,
      };
    });

    setInvoiceItems(prev => [...prev, ...newItems]);
  };

  const handleRemoveInvoiceItem = (index: number) => {
    setInvoiceItems(prev => prev.filter((_, i) => i !== index));
  };

  // Submit Manual Invoice / Bulk Order handler
  const handleCreateManualInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName.trim()) {
      notifyAdmin("warning", "Angabe fehlt", "Customers- / Käufername ist zum Save einer Order erforderlich.");
      return;
    }
    if (invoiceItems.length === 0) {
      notifyAdmin("warning", "Product Missing", "Please add at least one product to the invoice document.");
      return;
    }

    const subtotal = invoiceItems.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
    const taxAmount = Number(((subtotal * Number(invoiceTaxRate)) / 100).toFixed(2));
    const grandTotal = Number((subtotal + Number(invoiceShippingFee) + taxAmount - Number(invoiceDiscount)).toFixed(2));
    const totalQty = invoiceItems.reduce((acc, item) => acc + item.quantity, 0);

    const generatedOrderId = invoiceNumber
      ? formatOrderSerialNumber(invoiceNumber)
      : generateOrderSerialNumber();

    const orderData = {
      id: crypto.randomUUID(),
      orderId: generatedOrderId,
      order_number: generatedOrderId,
      date: invoiceDate || new Date().toISOString().split("T")[0],
      productId: invoiceItems[0].productId,
      productName: invoiceItems.length === 1 ? invoiceItems[0].productName : `${invoiceItems[0].productName} + ${invoiceItems.length - 1} additional styles`,
      variantName: invoiceItems.length === 1 ? invoiceItems[0].variantName : "Sortiert",
      quantity: totalQty,
      unitPrice: Number((subtotal / Math.max(1, totalQty)).toFixed(2)),
      subtotal: subtotal,
      shippingFee: Number(invoiceShippingFee),
      taxRate: Number(invoiceTaxRate),
      taxAmount: taxAmount,
      discount: Number(invoiceDiscount),
      total: grandTotal,
      customer: {
        company: custCompany || "Retail Client",
        name: custName,
        phone: custPhone || "+49 (0) 160 6705008",
        email: custEmail || "info@ixos.de",
        taxId: custTaxId || ""
      },
      shipping: {
        address: shipAddress || "Atelier / Factory Dispatch",
        city: shipCity || "Hauptwerk",
        state: shipState || "",
        zip: shipZip || "",
        country: shipCountry || "India"
      },
      payment: {
        gateway: invoiceGateway || "Direct Bank Wire / UPI",
        status: invoicePaymentStatus || "Pending",
        transactionId: `TXN-${Math.floor(100000 + Math.random() * 900000)}`
      },
      status: invoiceOrderStatus || "Processing",
      incoterms: invoiceIncoterms || "CPT - Frachtfrei bis",
      hsCode: invoiceHsCode || "8518.90.00",
      portOfLoading: invoicePortOfLoading || "Jaipur International Airport (JAI), India",
      notes: invoiceNotes || "Wastram Haute Textiles & Wholesale Apparel Production.",
      items: invoiceItems,
      created_at: new Date().toISOString(),
    };

    setGeneratingPdfStatus("Saving order to database...");
    try {
      // 1. Save to backend API
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData)
      });

      // 1b. Auto-sync customer to Clients CRM
      try {
        await fetch("/api/clients", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            company_name: custCompany || custName || "B2B-Customer",
            contact_name: custName,
            email: custEmail,
            phone: custPhone,
            whatsapp: custPhone,
            tax_id: custTaxId,
            address: shipAddress,
            city: shipCity,
            state: shipState,
            zip: shipZip,
            country: shipCountry || "India",
            status: "Ordered",
            source: "Manual Atelier Order / Proforma Invoice",
            total_orders: 1,
            total_revenue: grandTotal,
            notes: `Manual Order #${orderData.orderId} (${activeDocType}). Total: ₹${grandTotal.toFixed(2)}. Products: ${invoiceItems.map(i => `${i.productName} (${i.quantity} pcs)`).join(', ')}`
          })
        });
      } catch (clientErr) {
        console.warn("Could not sync client to CRM:", clientErr);
      }

      // 2. Update local state and localStorage
      setSampleOrders(prev => {
        const updated = [orderData, ...prev.filter(o => o.orderId !== orderData.orderId && o.id !== orderData.id)];
        if (typeof window !== "undefined") {
          safeSetLocalStorage("gsp_sample_orders", JSON.stringify(updated));
        }
        return updated;
      });

      // 4. Reset form fields
      setInvoiceItems([]);
      setCustCompany("");
      setCustName("");
      setCustEmail("");
      setCustPhone("");
      setCustTaxId("");
      setShipAddress("");
      setShipCity("");
      setShipState("");
      setShipZip("");
      setInvoiceShippingFee(0);
      setInvoiceTaxRate(0);
      setInvoiceDiscount(0);

      // 5. Navigate to Orders Received list
      setActiveTab("orders");
      fetchOrders();

      notifyAdmin(
        "success",
        "Order Saved Successfully",
        `Order #${orderData.orderId} saved and synced to database! Total: ₹${grandTotal.toFixed(2)}`
      );
    } catch (err: any) {
      console.error("Error saving order to database:", err);
      notifyAdmin(
        "error",
        "Error beim Save der Order",
        err.message || "Order could not be saved to database",
        err
      );
    } finally {
      setGeneratingPdfStatus("");
    }
  };

  // Auto-populate document form from existing order
  const handleLoadOrderIntoDocs = (selectedId: string) => {
    setSelectedOrderToLoad(selectedId);
    if (!selectedId) return;
    const order = sampleOrders.find(o => o.orderId === selectedId || o.id === selectedId);
    if (!order) return;

    if (order.customer) {
      setCustCompany(order.customer.company || "");
      setCustName(order.customer.name || "");
      setCustEmail(order.customer.email || "");
      setCustPhone(order.customer.phone || "");
      setCustTaxId(order.customer.taxId || "");
    }
    if (order.shipping) {
      setShipAddress(order.shipping.address || "");
      setShipCity(order.shipping.city || "");
      setShipState(order.shipping.state || "");
      setShipZip(order.shipping.zip || "");
      setShipCountry(order.shipping.country || "Spain");
    }
    if (order.incoterms) setInvoiceIncoterms(order.incoterms);
    if (order.hsCode) setInvoiceHsCode(order.hsCode);
    if (order.portOfLoading) setInvoicePortOfLoading(order.portOfLoading);
    if (order.notes) setInvoiceNotes(order.notes);

    if (order.items && order.items.length > 0) {
      setInvoiceItems(order.items.map((it: any) => ({
        productId: it.productId || "",
        productName: it.productName || "Precision Speaker Part",
        variantId: it.variantId || "",
        variantName: it.variantName || "Standard",
        quantity: it.quantity || 1,
        unitPrice: it.unitPrice || 0
      })));
    } else if (order.productName) {
      setInvoiceItems([{
        productId: "",
        productName: order.productName,
        variantId: "",
        variantName: order.variantName || "Standard",
        quantity: order.quantity || 1,
        unitPrice: order.unitPrice || (order.total / (order.quantity || 1))
      }]);
    }

    if (order.shippingFee) setInvoiceShippingFee(order.shippingFee);
    if (order.taxRate) setInvoiceTaxRate(order.taxRate);
    if (order.discount) setInvoiceDiscount(order.discount);
  };

  // Download Vector PDF for any Export Document Type
  const handleDownloadActiveDocPDF = async (docType: string, customData?: any) => {
    const subtotal = invoiceItems.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
    const taxAmount = (subtotal * Number(invoiceTaxRate)) / 100;
    const grandTotal = Math.max(0, subtotal + Number(invoiceShippingFee) + taxAmount - Number(invoiceDiscount));

    const computedAdvancePaid = paymentBreakdownMode === "partial"
      ? (advancePaidAmountInput !== "" ? Number(advancePaidAmountInput) : Number(((grandTotal * advancePaidPct) / 100).toFixed(2)))
      : (paymentBreakdownMode === "full_paid" ? grandTotal : 0);
    const computedBalanceDue = Math.max(0, grandTotal - computedAdvancePaid);

    let computedPaymentStatus = invoicePaymentStatus;
    if (docType === "PI") {
      if (paymentBreakdownMode === "full_paid") {
        computedPaymentStatus = invoicePaymentStatus && invoicePaymentStatus.toLowerCase().includes("paid") && !invoicePaymentStatus.toLowerCase().includes("unpaid")
          ? invoicePaymentStatus
          : t("STATUS_PAID", docLanguage);
      } else if (paymentBreakdownMode === "partial" && computedAdvancePaid > 0) {
        computedPaymentStatus = `${t("STATUS_PARTIAL", docLanguage)} (${formatDocCurrencyShort(computedAdvancePaid, docCurrency)} Paid • ${formatDocCurrencyShort(computedBalanceDue, docCurrency)} Due)`;
      } else if (paymentBreakdownMode === "full_unpaid") {
        computedPaymentStatus = t("STATUS_UNPAID", docLanguage);
      } else {
        computedPaymentStatus = invoicePaymentStatus || t("STATUS_UNPAID", docLanguage);
      }
    }

    const data = customData || {
      docType,
      docNumber: invoiceNumber || "Wastram-DOC-000000",
      docDate: invoiceDate || new Date().toISOString().split("T")[0],
      validUntil: docValidUntil,
      docCurrency,
      docLanguage,
      subtotal,
      shippingFee: invoiceShippingFee,
      taxRate: invoiceTaxRate,
      taxAmount,
      discount: invoiceDiscount,
      total: grandTotal,
      advancePaidAmount: computedAdvancePaid,
      advancePaidPct: paymentBreakdownMode === "partial" ? advancePaidPct : undefined,
      balanceDueAmount: computedBalanceDue,
      customer: {
        company: custCompany,
        name: custName,
        email: custEmail,
        phone: custPhone,
        taxId: custTaxId,
      },
      shipping: {
        address: shipAddress,
        city: shipCity,
        state: shipState,
        zip: shipZip,
        country: shipCountry,
      },
      payment: {
        gateway: invoiceGateway,
        status: computedPaymentStatus,
      },
      incoterms: invoiceIncoterms,
      hsCode: invoiceHsCode,
      portOfLoading: invoicePortOfLoading,
      carrierName: carrierName,
      trackingAwbNumber: trackingAwbNumber,
      dispatchDate: dispatchDate,
      estimatedDeliveryDate: estimatedDeliveryDate,
      notes: invoiceNotes,
      items: invoiceItems.length > 0 ? invoiceItems : [{
        productName: "Precision Speaker Components",
        variantName: "Standard",
        quantity: 1000,
        unitPrice: 1.18
      }]
    };

    const gen = await import("@/utils/exportDocsGenerator");
    switch (docType) {
      case "PI":
        await gen.generateProformaInvoicePDF(data);
        break;
      case "PL":
        await gen.generatePackingListPDF(data);
        break;
      case "QUOTATION":
        await gen.generateQuotationPDF(data);
        break;
      case "COO":
        await gen.generateCertificateOfOriginPDF(data);
        break;
      case "COA":
        await gen.generateQualityCertificatePDF(data);
        break;
      case "SWIFT":
        await gen.generateSwiftWireInstructionsPDF(data);
        break;
      case "SHIPPING_ADVICE":
        await gen.generateShippingAdvicePDF(data);
        break;
      case "SAMPLE_NOTE":
        await gen.generateSampleAgreementPDF(data);
        break;
      case "CONTRACT":
        await gen.generateSalesContractPDF(data);
        break;
      case "TERMS":
        await gen.generateTermsAndConditionsPDF({
          docLanguage: docLanguage,
        });
        break;
      case "CI":
      default:
        const { generateInvoicePDF } = await import("@/utils/invoicePdfGenerator");
        await generateInvoicePDF(data);
        break;
    }
  };

  const handleDownloadTermsAndConditions = async () => {
    try {
      const gen = await import("@/utils/exportDocsGenerator");
      await gen.generateTermsAndConditionsPDF({
        docLanguage: docLanguage,
      });
    } catch (err) {
      console.error("Failed to generate Terms & Conditions PDF:", err);
    }
  };

  // PDF Generation Trigger for Custom Selection & Negotiation
  const handleGeneratePdfPriceList = async () => {
    if (priceListMode === "categories" && priceListSelectedCategoryIds.length === 0) return;
    if (priceListMode === "products" && priceListSelectedProductIds.length === 0) return;
    
    setGeneratingPdfStatus("Loading product data...");
    try {
      const res = await fetch("/api/products?includeHidden=true");
      if (!res.ok) throw new Error("Failed to fetch product data for PDF generation");
      const allProds: Product[] = await res.json();
      
      let selectedCats: Category[] = [];
      let selectedProdIds: string[] | undefined = undefined;

      if (priceListMode === "categories") {
        selectedCats = categories.filter(c => priceListSelectedCategoryIds.includes(c.id));
      } else {
        selectedProdIds = priceListSelectedProductIds;
        // Include any category that has at least one of the selected products
        selectedCats = categories.filter(c => 
          allProds.some((p: Product) => selectedProdIds!.includes(p.id) && p.category_id === c.id)
        );
      }
      
      const { generatePriceListPDF } = await import("@/utils/pdfGenerator");
      await generatePriceListPDF(
        selectedCats, 
        allProds, 
        (progress) => {
          setGeneratingPdfStatus(progress);
        }, 
        pdfSelectedCurrencies,
        selectedProdIds,
        Object.keys(priceListCustomPrices).length > 0
          ? Object.fromEntries(
              Object.entries(priceListCustomPrices).map(([k, v]) => [k, parseFloat(String(v)) || 0])
            )
          : undefined
      );
      
      setShowPriceListModal(false);
      setPriceListStep(1);
    } catch (err: any) {
      console.error(err);
      notifyAdmin("error", "Error Generating PDF", err.message || "PDF document could not be generated.", err);
    } finally {
      setGeneratingPdfStatus("");
    }
  };

  // Direct single category download handler
  const handleDirectCategoryPdfDownload = async (category: Category) => {
    setGeneratingPdfStatus(`Loading styles for ${category.name}...`);
    try {
      const res = await fetch("/api/products?includeHidden=true");
      if (!res.ok) throw new Error("Product catalog data could not be loaded for PDF export.");
      const allProds = await res.json();
      
      const { generatePriceListPDF } = await import("@/utils/pdfGenerator");
      await generatePriceListPDF([category], allProds, (progress) => {
        setGeneratingPdfStatus(progress);
      }, pdfSelectedCurrencies);
    } catch (err: any) {
      console.error(err);
      notifyAdmin("error", "Error Generating PDF", `Error bei der PDF-Erstellung für ${category.name}: ${err.message}`, err);
    } finally {
      setGeneratingPdfStatus("");
    }
  };

  // Settings
  const [whatsappNumber, setWhatsappNumber] = useState("01606705008");

  // Newsletter subscribers state
  interface Subscriber {
    id: string;
    email: string;
    created_at: string;
  }
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [subscribersLoading, setSubscribersLoading] = useState(false);

  // ─── Auth ────────────────────────────────────────────────────────
  useEffect(() => {
    const docEl = document.documentElement;
    const previousDarkState = docEl.classList.contains("dark");

    // Initialize admin theme according to saved preference (defaults to light)
    if (typeof window !== "undefined") {
      const cookieTheme = typeof document !== "undefined"
        ? document.cookie.split("; ").find((row) => row.startsWith("vite-ui-theme="))?.split("=")[1]
        : undefined;
      const savedTheme = cookieTheme || localStorage.getItem("ixos_admin_theme") || "light";
      const isDark =
        savedTheme === "dark" ||
        (savedTheme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

      if (isDark) {
        docEl.classList.add("dark");
      } else {
        docEl.classList.remove("dark");
      }
    }

    if (typeof window !== "undefined") {
      // Fast UI hint from sessionStorage, then verify server-side
      const cached = sessionStorage.getItem("gsp_admin_authenticated") === "true";
      if (cached) setIsAuthenticated(true);

      // Always verify the HttpOnly cookie or token server-side
      const token = sessionStorage.getItem("ixos_admin_token");
      fetch("/api/admin/auth", {
        method: "GET",
        credentials: "include",
        headers: token ? { "x-admin-token": token, Authorization: `Bearer ${token}` } : {},
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.authenticated) {
            sessionStorage.setItem("gsp_admin_authenticated", "true");
            if (data.token) {
              sessionStorage.setItem("ixos_admin_token", data.token);
            }
            setIsAuthenticated(true);
          } else {
            sessionStorage.removeItem("gsp_admin_authenticated");
            sessionStorage.removeItem("ixos_admin_token");
            setIsAuthenticated(false);
          }
        })
        .catch(() => {
          // If network fails, keep cached state
        });
      const storedWhatsapp = localStorage.getItem("gsp_whatsapp_number");
      if (storedWhatsapp) setWhatsappNumber(storedWhatsapp);
      const storedOrders = localStorage.getItem("gsp_sample_orders");
      if (storedOrders) {
        try {
          const parsed = JSON.parse(storedOrders);
          if (Array.isArray(parsed)) setSampleOrders(parsed.filter(Boolean).map(normalizeAdminOrder));
        } catch {
          setSampleOrders([]);
        }
      }
    }

    return () => {
      if (previousDarkState) {
        docEl.classList.add("dark");
      } else {
        docEl.classList.remove("dark");
      }
    };
  }, []);

  const [loginLoading, setLoginLoading] = useState(false);
  const [remainingAttempts, setRemainingAttempts] = useState(5);
  const [isLocked, setIsLocked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loginLoading || isLocked) return;
    setLoginLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode: (passcode || "").trim() }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        if (typeof window !== "undefined") {
          sessionStorage.setItem("gsp_admin_authenticated", "true");
          if (data.token) {
            sessionStorage.setItem("ixos_admin_token", data.token);
          }
        }
        setIsAuthenticated(true);
        setError("");
      } else {
        setError(data.error || "Zugriff verweigert: Ungültiger Sicherheitspasscode.");
        if (typeof data.remainingAttempts === "number") {
          setRemainingAttempts(data.remainingAttempts);
        }
        if (data.locked) {
          setIsLocked(true);
        }
        // Shake the form
        const form = document.getElementById("admin-auth-form");
        if (form) {
          form.classList.add("animate-shake");
          setTimeout(() => form.classList.remove("animate-shake"), 600);
        }
      }
    } catch (err) {
      console.error("[Admin Auth] Login error:", err);
      setError("Network connection error. Please verify your connection and try again.");
    }

    setLoginLoading(false);
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth", { method: "DELETE", credentials: "include" });
    } catch (err) {
      console.error("[Admin Auth] Logout error:", err);
    }
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("gsp_admin_authenticated");
      sessionStorage.removeItem("ixos_admin_token");
    }
    setIsAuthenticated(false);
    setPasscode("");
    setError("");
  };

  // ─── Fetch Categories ────────────────────────────────────────────
  const fetchCategories = useCallback(async () => {
    setCatLoading(true);
    try {
      const res = await adminFetch("/api/categories?t=" + Date.now() + "&includeHidden=true&admin=1");
      const data = await res.json();
      if (Array.isArray(data)) {
        const real = data.filter(
          (c: any) =>
            c.id !== "all-parts" &&
            c.id !== "specials" &&
            !c.isVirtual &&
            !/bead[-_\s]?repair/i.test(c.id || "") &&
            !/bead[-_\s]?repair/i.test(c.slug || "") &&
            !/bead[-_\s]?repair/i.test(c.name || "") &&
            !(c.id === "etui-inlays" && c.slug === "etui-inlays")
        );
        setCategories(real);
        try {
          const storedStr = localStorage.getItem("ixos_categories_overrides");
          if (storedStr) {
            const stored = JSON.parse(storedStr);
            if (stored["etui-inlays"]) {
              delete stored["etui-inlays"];
              localStorage.setItem("ixos_categories_overrides", JSON.stringify(stored));
            }
          }
        } catch (_) {}
      }
    } catch (err) { console.error("Error fetching categories", err); }
    setCatLoading(false);
  }, []);

  // ─── Fetch Products ──────────────────────────────────────────────
  const fetchProducts = useCallback(async () => {
    setProdLoading(true);
    try {
      const url = "/api/products?t=" + Date.now() + "&includeHidden=true&admin=1";
      const res = await adminFetch(url);
      const data = await res.json();
      if (Array.isArray(data)) {
        const normalized = data.map((p: any) => ({
          ...p,
          featured_image: p.featured_image || p.mainImage || p.image || p.images?.[0] || p.colorVariants?.[0]?.images?.[0] || "",
          mainImage: p.mainImage || p.featured_image || p.image || p.images?.[0] || "",
        }));
        setProducts(normalized);
      }
    } catch (err) { console.error("Error fetching products", err); }
    setProdLoading(false);
  }, []);

  const openPriceListModal = useCallback(async (preferredCatSlug?: string) => {
    try {
      const res = await adminFetch("/api/products?t=" + Date.now() + "&includeHidden=true&admin=1");
      const data = await res.json();
      if (Array.isArray(data)) setProducts(data);
    } catch (e) {
      console.warn("Could not refresh products for price list:", e);
    }
    if (preferredCatSlug) {
      const cat = categories.find(c => c.slug === preferredCatSlug);
      if (cat) {
        setPriceListSelectedCategoryIds([cat.id]);
      } else {
        setPriceListSelectedCategoryIds(categories.map(c => c.id));
      }
    } else {
      setPriceListSelectedCategoryIds(categories.map(c => c.id));
    }
    setShowPriceListModal(true);
  }, [categories]);

  const fetchPayments = useCallback(async () => {
    setLoadingPayments(true);
    try {
      const res = await adminFetch("/api/payments?t=" + Date.now());
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setPayments(data);
      }
    } catch (e) {
      console.error("Failed to fetch payments:", e);
    } finally {
      setLoadingPayments(false);
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await adminFetch("/api/orders?limit=200&t=" + Date.now());
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          const normalized = data.map(normalizeAdminOrder);
          setSampleOrders(normalized);
          if (typeof window !== "undefined") {
            safeSetLocalStorage("gsp_sample_orders", JSON.stringify(normalized));
          }
        }
      } else {
        console.warn("fetchOrders response not ok:", res.status);
      }
    } catch (err) {
      console.warn("Error fetching orders:", err);
    }
  }, []);

  const fetchPriceUnlocks = useCallback(async () => {
    setLoadingPriceUnlocks(true);
    try {
      const res = await fetch("/api/price-unlocks?t=" + Date.now());
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.unlocks)) {
          setPriceUnlocks(data.unlocks);
        }
      }
    } catch (err) {
      console.warn("Error fetching price unlocks:", err);
    }
    setLoadingPriceUnlocks(false);
  }, []);


  const handleDeletePriceUnlock = async (id: string) => {
    if (!confirm("Are you sure you want to delete this buyer inquiry record?")) return;
    try {
      const res = await fetch(`/api/price-unlocks?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      if (res.ok) {
        setPriceUnlocks(prev => prev.filter(u => u.id !== id && u.order_number !== id));
      }
    } catch (err) {
      console.error("Error deleting price unlock lead:", err);
    }
  };

  const exportPriceUnlocksCSV = () => {
    if (priceUnlocks.length === 0) {
      notifyAdmin("info", "Export", "No lead entries available to export.");
      return;
    }
    const headers = ["ID", "Email", "Phone", "Viewed Product", "Status", "Date", "Timestamp"];
    const rows = priceUnlocks.map(u => [
      `"${u.id || ""}"`,
      `"${u.email || ""}"`,
      `"${u.phone || ""}"`,
      `"${(u.product_name || "").replace(/"/g, '""')}"`,
      `"${u.status || "Priceanfrage freigeschaltet"}"`,
      `"${u.date || ""}"`,
      `"${u.created_at || ""}"`,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `price_unlock_leads_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    notifyAdmin("success", "Export Completed", "Buyer inquiry records exported to CSV successfully.");
  };

  const fetchPaymentSettings = useCallback(async () => {
    // 1. Immediately hydrate from localStorage for instantaneous UI load
    if (typeof window !== "undefined") {
      try {
        const local = localStorage.getItem("ixos_payment_settings");
        if (local) {
          const parsed = JSON.parse(local);
          if (parsed && typeof parsed === "object") {
            setPaymentSettings(prev => ({
              ...prev,
              ...parsed,
              paypalClientId: parsed.paypalClientId || prev.paypalClientId || "",
              paypalSecret: parsed.paypalSecret || parsed.paypalSecretKey || prev.paypalSecret || "",
              enablePaypal: parsed.enablePaypal !== undefined ? Boolean(parsed.enablePaypal) : true,
              environment: parsed.environment || prev.environment || "sandbox",
            }));
          }
        }
      } catch (err) {
        console.warn("Failed to load local payment settings:", err);
      }
    }

    try {
      const res = await fetch("/api/payment-settings?t=" + Date.now());
      if (res.ok) {
        const data = await res.json();
        const settings = data.settings || data;
        setPaymentSettings(prev => {
          const merged = {
            ...prev,
            ...settings,
            paypalClientId: settings.paypalClientId || prev.paypalClientId || "",
            paypalSecret: settings.paypalSecret || settings.paypalSecretKey || prev.paypalSecret || "",
            enablePaypal: settings.enablePaypal !== undefined ? Boolean(settings.enablePaypal) : prev.enablePaypal,
            environment: settings.environment || prev.environment || "sandbox",
          };
          if (typeof window !== "undefined") {
            try {
              const { paypalSecret, paypalSecretKey, stripeSecretKey, smtpPass, ...safeMerged } = merged as any;
              localStorage.setItem("ixos_payment_settings", JSON.stringify(safeMerged));
            } catch (_) {}
          }
          return merged;
        });
      }
    } catch (e) {
      console.error("Failed to fetch payment settings:", e);
    }
  }, []);

  const handleSavePaymentSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const payload = {
        ...paymentSettings,
        paypalClientId: (paymentSettings.paypalClientId || "").trim(),
        paypalSecret: (paymentSettings.paypalSecret || "").trim(),
        paypalSecretKey: (paymentSettings.paypalSecret || "").trim(),
        environment: paymentSettings.environment || "sandbox",
        enablePaypal: Boolean(paymentSettings.enablePaypal),
      };

      // Persist client preferences to localStorage safely without sensitive secrets
      if (typeof window !== "undefined") {
        try {
          const { paypalSecret, paypalSecretKey, stripeSecretKey, smtpPass, ...safeLocal } = payload as any;
          localStorage.setItem("ixos_payment_settings", JSON.stringify(safeLocal));
        } catch (_) {}
      }

      const res = await fetch("/api/payment-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.settings) {
          setPaymentSettings(prev => ({
            ...prev,
            ...data.settings,
            paypalClientId: data.settings.paypalClientId || payload.paypalClientId,
            paypalSecret: data.settings.paypalSecret || data.settings.paypalSecretKey || payload.paypalSecret,
          }));
        }
        notifyAdmin("success", "Payment Settings Saved", "Payment settings saved and active in live store!");
      } else {
        notifyAdmin("info", "Payment settings saved locally", "Payment configuration saved to local cache.");
      }
    } catch (e: any) {
      console.error(e);
      notifyAdmin("info", "Payment settings saved locally", "Payment configuration saved to local cache.", e);
    } finally {
      setSavingSettings(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchCategories();
      fetchProducts();
      fetchPaymentSettings();
      fetchOrders();
      fetchPayments();
      fetchPriceUnlocks();

      const initialTimer = setTimeout(() => {
        setIsInitialLoading(false);
      }, 500);

      // No automatic background polling. Orders and payments are fetched only on initial load, browser refresh, or manual refresh button.
      return () => {
        clearTimeout(initialTimer);
      };
    }
  }, [isAuthenticated, activeTab, fetchCategories, fetchProducts, fetchPaymentSettings, fetchOrders, fetchPayments, fetchPriceUnlocks]);

  // ─── Category CRUD ───────────────────────────────────────────────
  const saveCat = async (cat: Partial<Category>) => {
    try {
      const isUpdate = Boolean(editingCat?.id);
      const url = isUpdate ? `/api/categories/${editingCat!.slug}` : "/api/categories";
      const method = isUpdate ? "PUT" : "POST";
      const res = await adminFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...cat, id: editingCat?.id || cat.id })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Category could not be saved");
      }

      // Optimistic local update
      const updatedCat = (data.category || cat) as Category;
      setCategories((prev) => {
        if (isUpdate && editingCat?.id) {
          return prev.map((c) => (c.id === editingCat.id || c.slug === editingCat.slug ? { ...c, ...updatedCat } : c));
        } else if (updatedCat.id || updatedCat.slug) {
          const exists = prev.some((c) => c.id === (updatedCat.id || updatedCat.slug) || c.slug === updatedCat.slug);
          if (exists) {
            return prev.map((c) => (c.id === (updatedCat.id || updatedCat.slug) || c.slug === updatedCat.slug ? { ...c, ...updatedCat } : c));
          }
          return [...prev, updatedCat];
        }
        return prev;
      });

      // Update local storage & broadcast instant 0ms sync
      try {
        const storedStr = localStorage.getItem("ixos_categories_overrides") || "{}";
        const overrides = JSON.parse(storedStr);
        const catKey = updatedCat.id || updatedCat.slug;
        overrides[catKey] = {
          ...updatedCat,
          isCustomCategory: true,
        };
        safeSetLocalStorage("ixos_categories_overrides", JSON.stringify(overrides));
        window.dispatchEvent(new CustomEvent("ixos_categories_updated", { detail: updatedCat }));
        const bc = new BroadcastChannel("ixos_categories_sync");
        bc.postMessage({ type: "CATEGORY_UPDATED", category: updatedCat });
        bc.close();
      } catch (_) {}

      notifyAdmin(
        "success",
        isUpdate ? "Category Updated & Synced" : "New Category Created & Synced",
        `Category "${cat.name || ""}" saved and synchronized sitewide.`
      );

      if (data.warning) {
        notifyAdmin("warning", "Sync Notice", data.warning);
      }

      setShowCatForm(false);
      setEditingCat(null);
      fetchCategories();
    } catch (err: any) {
      console.error("Error saving category", err);
      notifyAdmin(
        "error",
        "Category could not be saved",
        err instanceof Error ? err.message : String(err),
        err
      );
      throw err;
    }
  };

  const deleteCat = async (targetSlugOrId: string, optionalId?: string) => {
    if (!confirm("Delete this category? Contained products will not be deleted, but marked as unassigned.")) return;
    try {
      const cleanSlug = encodeURIComponent(targetSlugOrId.trim());
      const queryPart = optionalId ? `?id=${encodeURIComponent(optionalId.trim())}` : "";
      const res = await adminFetch(`/api/categories/${cleanSlug}${queryPart}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Category could not be deleted");
      }

      const normSlug = targetSlugOrId.toLowerCase().trim();
      const normId = (optionalId || targetSlugOrId).toLowerCase().trim();

      setCategories((prev) =>
        prev.filter((c) => {
          const cSlug = (c.slug || "").toLowerCase().trim();
          const cId = (c.id || "").toLowerCase().trim();
          return cSlug !== normSlug && cSlug !== normId && cId !== normSlug && cId !== normId;
        })
      );

      try {
        const storedStr = localStorage.getItem("ixos_categories_overrides") || "{}";
        const overrides = JSON.parse(storedStr);
        delete overrides[targetSlugOrId];
        delete overrides[normSlug];
        delete overrides[normId];
        if (optionalId) delete overrides[optionalId];

        for (const [k, v] of Object.entries(overrides)) {
          const vSlug = ((v as any)?.slug || "").toLowerCase().trim();
          const vId = ((v as any)?.id || "").toLowerCase().trim();
          if (vSlug === normSlug || vSlug === normId || vId === normSlug || vId === normId) {
            delete overrides[k];
          }
        }

        // Set tombstones so any other client caches immediately filter them out
        overrides[normSlug] = { id: normId, slug: normSlug, deleted: true, is_hidden: true };
        if (normId !== normSlug) {
          overrides[normId] = { id: normId, slug: normSlug, deleted: true, is_hidden: true };
        }

        safeSetLocalStorage("ixos_categories_overrides", JSON.stringify(overrides));
        invalidateCategoriesCache();
        window.dispatchEvent(new CustomEvent("ixos_categories_updated"));
        const bc = new BroadcastChannel("ixos_categories_sync");
        bc.postMessage({ type: "CATEGORY_DELETED", slug: normSlug, id: normId });
        bc.close();
      } catch (_) {}

      notifyAdmin("success", "Category Deleted", "Category removed successfully.");
      await fetchCategories();
    } catch (err: any) {
      console.error("Error deleting category", err);
      notifyAdmin("error", "Error beim Delete der Category", err.message || "Error beim Delete", err);
    }
  };

  const toggleCatVisibility = async (cat: Category) => {
    try {
      const nextHidden = !cat.is_hidden;
      setCategories((prev) =>
        prev.map((c) => (c.id === cat.id || c.slug === cat.slug ? { ...c, is_hidden: nextHidden } : c))
      );
      await adminFetch(`/api/categories/${cat.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_hidden: nextHidden })
      });
      notifyAdmin("success", "Visibility Updated", `Category "${cat.name}" is now ${nextHidden ? "hidden" : "visible in store"}.`);

      try {
        const storedStr = localStorage.getItem("ixos_categories_overrides") || "{}";
        const overrides = JSON.parse(storedStr);
        const catKey = cat.id || cat.slug;
        overrides[catKey] = {
          ...(overrides[catKey] || cat),
          is_hidden: nextHidden,
        };
        safeSetLocalStorage("ixos_categories_overrides", JSON.stringify(overrides));
        window.dispatchEvent(new CustomEvent("ixos_categories_updated"));
        const bc = new BroadcastChannel("ixos_categories_sync");
        bc.postMessage({ type: "CATEGORY_UPDATED", category: overrides[catKey] });
        bc.close();
      } catch (_) {}

      fetchCategories();
    } catch (err: any) {
      console.error("Error toggling category visibility", err);
      notifyAdmin("error", "Error beim Refresh", err instanceof Error ? err.message : String(err), err);
    }
  };

  // Broadcast product changes across tabs and windows (<1s sync)
  const broadcastProductsUpdate = () => {
    try {
      window.dispatchEvent(new Event("ixos_products_updated"));
      if (typeof BroadcastChannel !== "undefined") {
        const ch = new BroadcastChannel("wastram_products_sync"); try { const chOld = new BroadcastChannel("ixos_products_sync"); chOld.postMessage({ type: "products_updated", timestamp: Date.now() }); chOld.close(); } catch(_) {}
        ch.postMessage({ type: "products_updated", timestamp: Date.now() });
        ch.close();
      }
    } catch (_) {}
  };

  // ─── Product CRUD ────────────────────────────────────────────────
  const saveProd = async (prod: Partial<Product>) => {
    try {
      const targetId = editingProd?.id || detailProduct?.id || prod.id;
      const originalSlug = editingProd?.slug || detailProduct?.slug || prod.slug;

      if (prod.name && typeof prod.name === "string" && prod.name.trim()) {
        const trimmed = prod.name.trim().toLowerCase();
        const duplicate = products.find(p => {
          if (targetId && (p.id === targetId || (p as any)._id === targetId)) return false;
          if (originalSlug && p.slug.toLowerCase() === originalSlug.toLowerCase()) return false;
          return p.name.trim().toLowerCase() === trimmed;
        });
        if (duplicate) {
          throw new Error("This product title already exists. Please choose a distinct title.");
        }
      }

      const isUpdate = Boolean(editingProd?.id || detailProduct?.id || prod.id);
      const url = isUpdate && originalSlug ? `/api/products/${encodeURIComponent(originalSlug)}` : "/api/products";
      const method = isUpdate && originalSlug ? "PUT" : "POST";
      const res = await adminFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...prod, id: targetId || prod.id, originalSlug })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Product could not be saved");
      }

      // Optimistic in-memory update for instant responsiveness
      const updatedProduct = data.product || data.updated || prod;
      const targetCatId = updatedProduct.category_id !== undefined ? updatedProduct.category_id : prod.category_id;
      const isClearingCategory = targetCatId === "" || targetCatId === "none" || targetCatId === "unassigned";

      const targetCatMeta = !isClearingCategory && targetCatId
        ? categories.find((c) => c.id.toLowerCase() === String(targetCatId).toLowerCase() || c.slug.toLowerCase() === String(targetCatId).toLowerCase())
        : undefined;
      const targetCatName = isClearingCategory
        ? ""
        : (targetCatMeta ? targetCatMeta.name : (updatedProduct.category_name || (prod as any).category_name || targetCatId || ""));
      const targetCatObj = !isClearingCategory && targetCatId ? {
        id: targetCatMeta?.id || targetCatId,
        name: targetCatName,
        slug: targetCatMeta?.slug || targetCatId,
      } : undefined;

      // Sync to localStorage for instant preview across store pages in this browser
      try {
        const stored = JSON.parse(localStorage.getItem("ixos_products_overrides") || "{}");
        const key = targetId || prod.id || originalSlug;
        const bannedKeys = new Set([
          "brand", "marke", "hersteller", "manufacturer",
          "fitment", "passend für", "passend fuer", "passend", "suitable for", "kompatibel mit", "kompatibel",
          "moq",
          "warranty", "garantie", "warranty / garantie", "εγγύηση"
        ]);

        // Clean any existing cached products in localStorage of banned keys
        for (const [k, item] of Object.entries(stored as Record<string, any>)) {
          if (item?.technical_specs && typeof item.technical_specs === "object") {
            const cleaned: Record<string, string> = {};
            for (const [sk, sv] of Object.entries(item.technical_specs)) {
              const isBlankAllowedOld = sk.toLowerCase().trim() === "maße" || sk.toLowerCase().trim() === "masse" || sk.toLowerCase().trim() === "material" || sk.toLowerCase().trim() === "dimensions";
              if (!bannedKeys.has(sk.toLowerCase().trim()) && (sv || isBlankAllowedOld)) cleaned[sk] = String(sv ?? "");
            }
            item.technical_specs = Object.keys(cleaned).length > 0 ? cleaned : null;
          }
        }

        if (key) {
          const rawSpecs = prod.technical_specs !== undefined ? prod.technical_specs : (updatedProduct.technical_specs || stored[key]?.technical_specs);
          const cleanSpecs: Record<string, string> = {};
          if (rawSpecs && typeof rawSpecs === "object") {
            for (const [k, v] of Object.entries(rawSpecs)) {
              const isBlankAllowed = k.toLowerCase().trim() === "maße" || k.toLowerCase().trim() === "masse" || k.toLowerCase().trim() === "material" || k.toLowerCase().trim() === "dimensions";
              if (!bannedKeys.has(k.toLowerCase().trim()) && v !== undefined && v !== null && (String(v).trim() !== "" || isBlankAllowed)) {
                cleanSpecs[k] = String(v);
              }
            }
          }
          const ovData = {
            ...stored[key],
            ...prod,
            ...updatedProduct,
            translations: updatedProduct.translations || prod.translations || stored[key]?.translations,
            technical_specs: Object.keys(cleanSpecs).length > 0 ? cleanSpecs : null,
            id: key,
            slug: prod.slug || originalSlug,
            category_id: isClearingCategory ? "" : (targetCatId || ""),
            category_slug: isClearingCategory ? "" : (targetCatMeta?.slug || targetCatId || ""),
            category_name: isClearingCategory ? "" : targetCatName,
            category: isClearingCategory ? "" : targetCatName,
          };
          stored[key] = ovData;
          if (originalSlug) stored[originalSlug] = ovData;
          if (prod.slug && prod.slug !== originalSlug) stored[prod.slug] = ovData;
          safeSetLocalStorage("ixos_products_overrides", JSON.stringify(stored));
          broadcastProductsUpdate();
        }
      } catch (_) {}

      setProducts((prev) => {
        const idToMatch = targetId || prod.id;
        const slugToMatch = originalSlug || prod.slug;
        const exists = prev.some((p) => (idToMatch && String(p.id) === String(idToMatch)) || (slugToMatch && p.slug === slugToMatch));
        if (exists) {
          return prev.map((p) => {
            if ((idToMatch && String(p.id) === String(idToMatch)) || (slugToMatch && p.slug === slugToMatch)) {
              return {
                ...p,
                ...updatedProduct,
                translations: updatedProduct.translations || prod.translations || (p as any).translations,
                technical_specs: prod.technical_specs !== undefined ? prod.technical_specs : updatedProduct.technical_specs,
                category_id: isClearingCategory ? "" : (targetCatId !== undefined ? targetCatId : p.category_id),
                category_slug: isClearingCategory ? "" : (targetCatMeta?.slug || (targetCatId !== undefined ? targetCatId : p.category_slug)),
                category_name: isClearingCategory ? "" : (targetCatName || p.category_name),
                category: isClearingCategory ? undefined : (targetCatObj || p.category),
              };
            }
            return p;
          });
        }
        return [
          {
            ...updatedProduct,
            id: idToMatch || `prod-${Date.now()}`,
            slug: slugToMatch || "",
            category_id: isClearingCategory ? "" : (targetCatId || ""),
            category_slug: isClearingCategory ? "" : (targetCatMeta?.slug || targetCatId || ""),
            category_name: isClearingCategory ? "" : targetCatName,
            category: isClearingCategory ? undefined : targetCatObj,
          } as Product,
          ...prev,
        ];
      });

      notifyAdmin(
        "success",
        isUpdate ? "Product Updated & Synced" : "New Product Created & Synced",
        `"${prod.name || "Product"}" saved and synchronized across the storefront.`
      );

      if (data.warning) {
        notifyAdmin("warning", "Sync Notice", data.warning);
      }

      broadcastProductsUpdate();
      setShowProdForm(false);
      setEditingProd(null);
      await Promise.all([fetchProducts(), fetchCategories()]);
      if (detailProduct && (targetId === detailProduct.id || originalSlug === detailProduct.slug)) {
        const nextSlug = prod.slug || originalSlug || detailProduct.slug;
        loadProductDetail(nextSlug);
      }
    } catch (err: any) {
      console.error("Error saving product", err);
      notifyAdmin(
        "error",
        "Product could not be saved",
        err instanceof Error ? err.message : String(err),
        err
      );
      throw err;
    }
  };

  const handleBulkMove = async () => {
    if (selectedProdIds.length === 0 || !bulkTargetCat) return;
    setIsBulkMoving(true);
    try {
      const res = await adminFetch("/api/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "bulk-move",
          productIds: selectedProdIds,
          targetCategoryId: bulkTargetCat,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Error beim Verschieben der Products");

      const isUnassigning = bulkTargetCat === "unassigned" || bulkTargetCat === "";
      const targetCatObj = !isUnassigning
        ? categories.find((c) => c.id.toLowerCase() === bulkTargetCat.toLowerCase() || c.slug.toLowerCase() === bulkTargetCat.toLowerCase())
        : undefined;
      const targetCatId = isUnassigning ? "" : (targetCatObj ? targetCatObj.id : bulkTargetCat);
      const targetCatName = isUnassigning ? "" : (targetCatObj ? targetCatObj.name : bulkTargetCat);
      const categoryField = isUnassigning ? undefined : {
        id: targetCatId,
        name: targetCatName,
        slug: targetCatObj?.slug || targetCatId,
      };

      // Sync to localStorage for instant local preview across store pages in this browser
      try {
        const stored = JSON.parse(localStorage.getItem("ixos_products_overrides") || "{}");
        selectedProdIds.forEach((id) => {
          stored[id] = {
            ...stored[id],
            id,
            category_id: isUnassigning ? "" : targetCatId,
            category_slug: isUnassigning ? "" : targetCatId,
            category_name: isUnassigning ? "" : targetCatName,
            category: isUnassigning ? "" : targetCatName,
          };
        });
        safeSetLocalStorage("ixos_products_overrides", JSON.stringify(stored));
        broadcastProductsUpdate();
      } catch (_) {}

      // Optimistic update for bulk moving products
      setProducts((prev) =>
        prev.map((p) => {
          if (selectedProdIds.includes(p.id) || (p.slug && selectedProdIds.includes(p.slug))) {
            return {
              ...p,
              category_id: isUnassigning ? "" : targetCatId,
              category_slug: isUnassigning ? "" : targetCatId,
              category_name: isUnassigning ? "" : targetCatName,
              category: isUnassigning ? undefined : categoryField,
            };
          }
          return p;
        })
      );

      notifyAdmin(
        "success",
        isUnassigning ? "Zuweisung aufgehoben" : "Products verschoben",
        isUnassigning
          ? `${selectedProdIds.length} products successfully unassigned from category.`
          : `${selectedProdIds.length} products successfully moved to "${targetCatName}".`
      );

      setSelectedProdIds([]);
      await Promise.all([fetchProducts(), fetchCategories()]);
    } catch (err: any) {
      console.error("Bulk move error", err);
      notifyAdmin("error", "Error beim Verschieben", err.message || String(err), err);
    } finally {
      setIsBulkMoving(false);
    }
  };

  // Used Parts specific handlers
  const handleAddNewFromScratchForUsed = () => {
    setShowUsedPartsChoiceModal(false);
    const usedCat = categories.find(c => c.slug === "used-parts" || c.id === "used-parts" || c.name.toLowerCase().includes("used"));
    const usedCatId = usedCat ? (usedCat.id || usedCat.slug) : "used-parts";
    setEditingProd({
      category_id: usedCatId,
      category: { name: usedCat?.name || "Used Parts", slug: "used-parts" },
      is_hidden: false,
      is_featured: false,
      technical_specs: { "Condition": "Used / Gebraucht (Tested & Functional)" },
      seo_meta: { badge_text: "USED", badge_color: "#2563EB", badge_text_color: "#FFFFFF" }
    } as any);
    setShowProdForm(true);
  };

  const handleOpenSelectExistingForUsed = async () => {
    setShowUsedPartsChoiceModal(false);
    setShowSelectExistingModal(true);
    setExistingProdSearch("");
    setExistingProdCatFilter("all");

    if (catalogForUsedModal.length === 0) {
      setLoadingCatalogForUsed(true);
      try {
        const res = await fetch("/api/products?t=" + Date.now() + "&includeHidden=true");
        const data = await res.json();
        if (Array.isArray(data)) {
          setCatalogForUsedModal(data);
        }
      } catch (err) {
        console.error("Failed to load catalog for used parts", err);
      } finally {
        setLoadingCatalogForUsed(false);
      }
    }
  };

  const handleSelectProductForUsed = (p: Product) => {
    setShowSelectExistingModal(false);
    const usedCat = categories.find(c => c.slug === "used-parts" || c.id === "used-parts" || c.name.toLowerCase().includes("used"));
    const usedCatId = usedCat ? (usedCat.id || usedCat.slug) : "used-parts";

    const cleanName = p.name.toLowerCase().includes("used") || p.name.toLowerCase().includes("gebraucht")
      ? p.name
      : `${p.name} (Used)`;

    const cleanSlug = `${(p.slug || "item").replace(/-used(-\d+)?$/, "")}-used-${Math.floor(1000 + Math.random() * 9000)}`;

    const originalPrice = typeof p.price === "number" ? p.price : parseFloat(String(p.price || "0")) || 0;
    const suggestedPrice = originalPrice > 0 ? Math.round(originalPrice * 0.75 * 100) / 100 : originalPrice;

    const rawGallery = (p as any)?.gallery || 
                       (p as any)?.product_images?.map((img: any) => img.url || img) || 
                       (p as any)?.images?.map((img: any) => typeof img === "string" ? img : img.url) || 
                       [];

    const clonedProd: any = {
      // Intentionally omitting `id` so saving invokes POST /api/products
      name: cleanName,
      slug: cleanSlug,
      category_id: usedCatId,
      category: { name: usedCat?.name || "Used Parts", slug: "used-parts" },
      short_desc: p.short_desc || "Artisanal handcrafted luxury garment crafted from premium Indian textiles.",
      long_desc: p.long_desc || "",
      featured_image: p.featured_image || (p as any)?.mainImage || "",
      gallery: rawGallery,
      is_hidden: false,
      is_featured: false,
      price: suggestedPrice > 0 ? suggestedPrice : (p.price ?? 0),
      applications: p.applications || "",
      tags: Array.from(new Set([...(p.tags || []), "used", "gebraucht", "pre-owned"])),
      technical_specs: {
        ...(p.technical_specs || {}),
        "Condition": "Used / Gebraucht (Tested & Functional)",
        "Original Price Reference": originalPrice > 0 ? `₹${originalPrice.toFixed(2)}` : "N/A"
      },
      seo_meta: {
        ...(p.seo_meta || {}),
        badge_text: "USED",
        badge_color: "#2563EB",
        badge_text_color: "#FFFFFF"
      }
    };

    setEditingProd(clonedProd);
    setShowProdForm(true);
  };

  const deleteProd = async (slug: string) => {
    const target = products.find(p => p.slug === slug || p.id === slug);
    const prodName = target?.name || slug;
    if (!confirm(`Are you sure you want to permanently delete this product?\n\n"${prodName}"\n\nThis product will be permanently purged from the storefront, admin console, and database.`)) return;
    try {
      if (target) {
        try {
          const stored = JSON.parse(localStorage.getItem("ixos_products_overrides") || "{}");
          const targetId = (target.id || "").toLowerCase().trim();
          const targetSlug = (target.slug || "").toLowerCase().trim();
          const targetPart = ((target as any).part_number || (target as any).partNumber || "").toLowerCase().trim();

          Object.keys(stored).forEach((k) => {
            const kLower = k.toLowerCase().trim();
            const ov = stored[k];
            const ovId = (ov?.id || "").toLowerCase().trim();
            const ovSlug = (ov?.slug || "").toLowerCase().trim();
            const ovPart = (ov?.partNumber || "").toLowerCase().trim();

            if (
              kLower === targetId ||
              kLower === targetSlug ||
              kLower === targetPart ||
              ovId === targetId ||
              ovSlug === targetSlug ||
              (targetPart && ovPart === targetPart)
            ) {
              delete stored[k];
            }
          });

          if (isBaseCatalogProduct(target)) {
            stored[target.id] = { id: target.id, slug: target.slug, deleted: true, is_hidden: true };
            if (target.slug) stored[target.slug] = { id: target.id, slug: target.slug, deleted: true, is_hidden: true };
          }
          safeSetLocalStorage("ixos_products_overrides", JSON.stringify(stored));
          broadcastProductsUpdate();
        } catch (_) {}
      }

      setProducts((prev) => prev.filter((p) => p.slug !== slug && p.id !== slug));
      const res = await adminFetch(`/api/products/${encodeURIComponent(slug)}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Product could not be deleted");
      }
      notifyAdmin("success", "Product Deleted", `"${prodName}" permanently deleted.`);
      broadcastProductsUpdate();
      setDetailProduct(null);
      await Promise.all([fetchProducts(), fetchCategories()]);
    } catch (err: any) {
      console.error("Error deleting product", err);
      notifyAdmin("error", "Error deleting product", err.message || "Error deleting product", err);
      fetchProducts();
    }
  };

  const toggleProdVisibility = async (prod: Product) => {
    try {
      const nextHidden = !prod.is_hidden;
      setProducts((prev) =>
        prev.map((p) => (p.slug === prod.slug || p.id === prod.id ? { ...p, is_hidden: nextHidden } : p))
      );
      await adminFetch(`/api/products/${prod.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_hidden: nextHidden })
      });
      notifyAdmin("success", "Visibility Updated", `Product "${prod.name}" is now ${nextHidden ? "hidden" : "visible in store"}.`);
      broadcastProductsUpdate();
      fetchProducts();
    } catch (err: any) {
      console.error("Error toggling product visibility", err);
      notifyAdmin("error", "Error beim Refresh", err instanceof Error ? err.message : String(err), err);
      fetchProducts();
    }
  };

  const toggleProdFeatured = async (prod: Product) => {
    try {
      const nextFeatured = !prod.is_featured;
      setProducts((prev) =>
        prev.map((p) => (p.slug === prod.slug || p.id === prod.id ? { ...p, is_featured: nextFeatured } : p))
      );
      await adminFetch(`/api/products/${prod.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_featured: nextFeatured })
      });
      notifyAdmin("success", "Featured Status Updated", `Product "${prod.name}" is now ${nextFeatured ? "featured" : "standard"}.`);
      broadcastProductsUpdate();
      fetchProducts();
    } catch (err: any) {
      console.error("Error toggling product featured state", err);
      notifyAdmin("error", "Error beim Refresh", err instanceof Error ? err.message : String(err), err);
      fetchProducts();
    }
  };

  const duplicateProd = async (prod: Product) => {
    try {
      const newSlug = prod.slug + "-copy-" + Date.now().toString(36);
      await adminFetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...prod,
          id: undefined,
          name: prod.name + " (Kopie)",
          slug: newSlug,
          category_id: prod.category_id
        })
      });
      notifyAdmin("success", "Product Duplicated", `Copy of "${prod.name}" created successfully.`);
      fetchProducts();
    } catch (err: any) {
      console.error("Error duplicating product", err);
      notifyAdmin("error", "Error beim Duplizieren", err instanceof Error ? err.message : String(err), err);
    }
  };

  // ─── Product Detail Loading ──────────────────────────────────────
  const loadProductDetail = async (slug: string) => {
    try {
      const res = await fetch(`/api/products/${slug}?t=${Date.now()}`);
      const data = await res.json();
      setDetailProduct(data);
      setDetailVariants(data.variants || []);
      setDetailImages(data.images || []);
      setDetailDownloads(data.downloads || []);
      setDetailFaqs(data.faqs || []);
    } catch (err) { console.error("Error loading product detail", err); }
  };

  // ─── Variant CRUD ────────────────────────────────────────────────
  const saveVariant = async (variant: Partial<Variant>) => {
    try {
      if (variant.id) {
        await adminFetch(`/api/variants/${variant.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(variant)
        });
      } else {
        await adminFetch("/api/variants", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(variant)
        });
      }
      notifyAdmin("success", "Color Variant Saved", `Color Variant "${variant.name || "Color Variant"}" saved successfully.`);
      if (detailProduct) loadProductDetail(detailProduct.slug);
    } catch (err: any) {
      console.error("Error saving variant", err);
      notifyAdmin("error", "Error beim Save der Color Variant", err.message || String(err), err);
    }
  };

  const deleteVariant = async (id: string) => {
    if (!confirm("Delete this color variant and its associated images?")) return;
    try {
      await adminFetch(`/api/variants/${id}`, { method: "DELETE" });
      notifyAdmin("success", "Color Variant Deleted", "Color variant and associated images deleted.");
      if (detailProduct) loadProductDetail(detailProduct.slug);
    } catch (err: any) {
      console.error("Error deleting variant", err);
      notifyAdmin("error", "Error beim Delete der Color Variant", err.message || String(err), err);
    }
  };

  // ─── Part Number CRUD ────────────────────────────────────────────
  const addPartNumber = async (variantId: string, code: string) => {
    try {
      await adminFetch("/api/part-numbers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variant_id: variantId, code })
      });
      notifyAdmin("success", "SKU Added", `SKU "${code}" added successfully.`);
      if (detailProduct) loadProductDetail(detailProduct.slug);
    } catch (err: any) {
      console.error("Error adding part number", err);
      notifyAdmin("error", "Error adding SKU / Part Number", err.message || String(err), err);
    }
  };

  const deletePartNumber = async (id: string) => {
    try {
      await adminFetch("/api/part-numbers", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      notifyAdmin("success", "SKU Removed", "SKU removed successfully.");
      if (detailProduct) loadProductDetail(detailProduct.slug);
    } catch (err: any) {
      console.error("Error deleting part number", err);
      notifyAdmin("error", "Error deleting SKU / Part Number", err.message || String(err), err);
    }
  };

  // ─── Image CRUD ──────────────────────────────────────────────────
  const addImage = async (productId: string, url: string, altText: string) => {
    try {
      const res = await adminFetch("/api/product-images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: productId, url, alt_text: altText, order_index: detailImages.length })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Image could not be added");
      }

      // Sync to localStorage
      try {
        const stored = JSON.parse(localStorage.getItem("ixos_products_overrides") || "{}");
        const key = productId || detailProduct?.id || detailProduct?.slug;
        if (key) {
          const ov = stored[key] || {};
          const gallery = Array.isArray(ov.gallery) ? [...ov.gallery] : (detailProduct ? (detailProduct as any).gallery || (detailProduct as any).galleryImages?.map((g: any) => g.url || g) || [] : []);
          if (!gallery.includes(url)) gallery.push(url);
          const updated = { ...ov, gallery, featured_image: ov.featured_image || url };
          stored[key] = updated;
          if (detailProduct?.slug) stored[detailProduct.slug] = updated;
          if (detailProduct?.id) stored[detailProduct.id] = updated;
          safeSetLocalStorage("ixos_products_overrides", JSON.stringify(stored));
          broadcastProductsUpdate();
        }
      } catch (_) {}

      notifyAdmin("success", "Image Added", "Gallery photoshoot image added successfully.");

      if (data.warning) {
        notifyAdmin("warning", "Sync Notice", data.warning);
      }

      if (detailProduct) loadProductDetail(detailProduct.slug);
    } catch (err: any) {
      console.error("Error adding image", err);
      notifyAdmin("error", "Error beim Add des Imagees", err.message || String(err), err);
    }
  };

  const handleMediaUpload = async (productId: string, files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);
    try {
      for (const file of Array.from(files)) {
        const optimized = await optimizeImageFile(file);
        const formData = new FormData();
        formData.append("file", optimized);
        const res = await adminFetch("/api/uploads", { method: "POST", body: formData });
        const json = await res.json();
        if (!res.ok || !json.url) {
          throw new Error(json?.error || `Upload fehlgeschlagen für ${file.name}`);
        }
        await addImage(productId, json.url, file.name);
      }
      notifyAdmin("success", "Upload Successful", `${files.length} media file(s) uploaded successfully.`);
    } catch (err: any) {
      console.error("Error uploading media", err);
      notifyAdmin("error", "Medien-Upload fehlgeschlagen", err.message || String(err), err);
    } finally {
      setIsUploading(false);
    }
  };

  const deleteImage = async (id: string, url?: string) => {
    try {
      await adminFetch("/api/product-images", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, url, product_id: detailProduct?.id, slug: detailProduct?.slug })
      });

      // Sync removal to localStorage
      try {
        const stored = JSON.parse(localStorage.getItem("ixos_products_overrides") || "{}");
        const key = detailProduct?.id || detailProduct?.slug;
        if (key && stored[key]) {
          const ov = stored[key];
          let gallery = Array.isArray(ov.gallery) ? [...ov.gallery] : [];
          gallery = gallery.filter((u: string) => u !== id && (!url || u !== url));
          let featured_image = ov.featured_image;
          if (featured_image === url || featured_image === id) {
            featured_image = gallery.length > 0 ? gallery[0] : "";
          }
          const updated = { ...ov, gallery, featured_image };
          stored[key] = updated;
          if (detailProduct?.slug) stored[detailProduct.slug] = updated;
          if (detailProduct?.id) stored[detailProduct.id] = updated;
          safeSetLocalStorage("ixos_products_overrides", JSON.stringify(stored));
          broadcastProductsUpdate();
        }
      } catch (_) {}

      notifyAdmin("success", "Image Removed", "Gallery image removed successfully.");
      if (detailProduct) loadProductDetail(detailProduct.slug);
    } catch (err: any) {
      console.error("Error deleting image", err);
      notifyAdmin("error", "Error beim Delete des Imagees", err.message || String(err), err);
    }
  };

  // ─── Download CRUD ───────────────────────────────────────────────
  const addDownload = async (productId: string, type: string, url: string, title: string) => {
    try {
      await adminFetch("/api/downloads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: productId, type, url, title })
      });
      notifyAdmin("success", "Document Attached", `Document "${title || type}" attached successfully.`);
      if (detailProduct) loadProductDetail(detailProduct.slug);
    } catch (err: any) {
      console.error("Error adding download", err);
      notifyAdmin("error", "Error beim Add des Downloads", err.message || String(err), err);
    }
  };

  const deleteDownload = async (id: string) => {
    try {
      await adminFetch("/api/downloads", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      notifyAdmin("success", "Document Removed", "Document removed successfully.");
      if (detailProduct) loadProductDetail(detailProduct.slug);
    } catch (err: any) {
      console.error("Error deleting download", err);
      notifyAdmin("error", "Error beim Delete des Downloads", err.message || String(err), err);
    }
  };

  // ─── FAQ CRUD ────────────────────────────────────────────────────
  const addFaq = async (productId: string, question: string, answer: string) => {
    try {
      await adminFetch("/api/faqs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: productId, question, answer, order_index: detailFaqs.length })
      });
      notifyAdmin("success", "FAQ Added", "FAQ item added successfully.");
      if (detailProduct) loadProductDetail(detailProduct.slug);
    } catch (err: any) {
      console.error("Error adding FAQ", err);
      notifyAdmin("error", "Error beim Add der FAQ", err.message || String(err), err);
    }
  };

  const deleteFaq = async (id: string) => {
    try {
      await adminFetch("/api/faqs", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      notifyAdmin("success", "FAQ Removed", "FAQ item removed successfully.");
      if (detailProduct) loadProductDetail(detailProduct.slug);
    } catch (err: any) {
      console.error("Error deleting FAQ", err);
      notifyAdmin("error", "Error beim Delete der FAQ", err.message || String(err), err);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    const matchedOrder = (sampleOrders || []).find(o => 
      o && (o.orderId === orderId || o.order_number === orderId || o.id === orderId)
    );

    setSampleOrders(prev => {
      const safePrev = Array.isArray(prev) ? prev : [];
      const updated = safePrev.map(order => (order && (order.orderId === orderId || order.order_number === orderId || order.id === orderId)) ? { ...order, status: newStatus } : order);
      if (typeof window !== "undefined") safeSetLocalStorage("gsp_sample_orders", JSON.stringify(updated));
      return updated;
    });

    try {
      await fetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: matchedOrder?.id || orderId,
          order_number: matchedOrder?.order_number || matchedOrder?.orderId || orderId,
          orderId: matchedOrder?.orderId || matchedOrder?.order_number || orderId,
          status: newStatus,
          shipping: {
            ...(matchedOrder?.shipping || {}),
            status: newStatus,
          }
        })
      });
      notifyAdmin("success", "Order Status Updated", `Order #${orderId} set to "${newStatus}".`);
      await fetchOrders();
    } catch (e: any) {
      console.warn("Could not sync order status to backend:", e);
      notifyAdmin("error", "Error beim Synchronisieren des Status", e.message || String(e), e);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!orderId) return;
    const ok = window.confirm(`Are you sure you want to permanently delete Order #${orderId}? This action cannot be undone.`);
    if (!ok) return;

    const safeOrders = Array.isArray(sampleOrders) ? sampleOrders : [];
    const targetOrder = safeOrders.find(o => o && (o.orderId === orderId || o.id === orderId || o.order_number === orderId));
    const paymentId = targetOrder?.payment_id || targetOrder?.payment?.transactionId || targetOrder?.paypal_order_id || "";

    try {
      await fetch("/api/orders", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_number: orderId,
          id: orderId,
          orderId: orderId,
          payment_id: paymentId,
        })
      });
      notifyAdmin("success", "Order Deleted", `Order #${orderId} deleted.`);
    } catch (err: any) {
      console.warn("Could not delete from backend:", err);
      notifyAdmin("error", "Error beim Delete der Order", err.message || String(err), err);
    }

    setSampleOrders(prev => {
      const safePrev = Array.isArray(prev) ? prev : [];
      const updated = safePrev.filter(order => order && order.orderId !== orderId && order.id !== orderId && order.order_number !== orderId);
      if (typeof window !== "undefined") {
        safeSetLocalStorage("gsp_sample_orders", JSON.stringify(updated));
      }
      return updated;
    });

    setPayments(prev => {
      const safePrev = Array.isArray(prev) ? prev : [];
      return safePrev.filter(p => p && p.order_number !== orderId && p.order_id !== orderId && p.id !== orderId && (!paymentId || p.transaction_id !== paymentId));
    });
  };

  const handleSaveOrder = async (updatedOrder: any) => {
    const orderId = updatedOrder.orderId || updatedOrder.id || updatedOrder.order_number;
    setSampleOrders(prev => {
      const safePrev = Array.isArray(prev) ? prev : [];
      const updated = safePrev.map(order => (order && (order.orderId === orderId || order.order_number === orderId || order.id === orderId)) ? updatedOrder : order);
      if (typeof window !== "undefined") safeSetLocalStorage("gsp_sample_orders", JSON.stringify(updated));
      return updated;
    });

    try {
      await fetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedOrder)
      });
      notifyAdmin("success", "Order Saved", `Order #${orderId} updated successfully.`);
    } catch (e: any) {
      console.warn("Could not sync updated order to backend:", e);
      notifyAdmin("error", "Error beim Save der Order", e.message || String(e), e);
    }
  };

  const getOrderProductInfo = useCallback((order: any) => {
    const rawItems = Array.isArray(order.items) && order.items.length > 0
      ? order.items
      : [{
          name: order.productName || order.product_name || "Wastram Precision Component",
          quantity: Number(order.quantity) || 1,
          unitPrice: Number(order.unitPrice || order.total || 0),
          price: Number(order.unitPrice || order.total || 0),
          image: order.image || order.featured_image || "",
          variant: order.variantName || order.variant || "",
        }];

    const primaryItem = rawItems[0] || {};
    let primaryName = primaryItem.name || primaryItem.productName || primaryItem.title || "";
    if (!primaryName || primaryName.toLowerCase() === "item" || primaryName.toLowerCase() === "ixos order") {
      if (order.productName && order.productName.toLowerCase() !== "item") {
        primaryName = order.productName;
      } else if (order.product_name && order.product_name.toLowerCase() !== "item") {
        primaryName = order.product_name;
      } else {
        primaryName = "Wastram Atelier Product";
      }
    }

    const primaryQty = Number(primaryItem.quantity) || 1;
    const primaryPrice = Number(primaryItem.unitPrice || primaryItem.price || 0);
    const primaryVariant = primaryItem.variant || primaryItem.variantName || order.variantName || "";
    const primaryPartNumber = primaryItem.partNumber || primaryItem.part_number || "";

    // Image resolution cascade
    let image = primaryItem.image || primaryItem.featured_image || primaryItem.thumbnail || order.image || order.featured_image || "";
    if (!image && products.length > 0) {
      const pId = primaryItem.id || primaryItem.productId || primaryItem.product_id;
      const matched = products.find(p =>
        (pId && (p.id === pId || p.slug === pId)) ||
        (p.name && primaryName && p.name.toLowerCase().trim() === primaryName.toLowerCase().trim())
      );
      if (matched) {
        image = matched.featured_image || ((matched as any).images?.[0]?.url) || "";
      }
    }

    const totalItemsCount = rawItems.reduce((acc: number, it: any) => acc + (Number(it.quantity) || 1), 0);

    return {
      items: rawItems,
      primaryItem,
      primaryName,
      primaryQty,
      primaryPrice,
      primaryVariant,
      primaryPartNumber,
      image,
      totalItemsCount,
    };
  }, [products]);

  const handleBatchAdvanceOrders = async () => {
    if (selectedOrderRowIds.length === 0) return;
    const currentPipeline = ORDER_TABS_PIPELINE.find(p => p.id === orderStatusFilter) || ORDER_TABS_PIPELINE[0];
    const targetStatus = currentPipeline.nextStatus;
    if (!targetStatus) return;

    const idsToSync = [...selectedOrderRowIds];

    // Find all full order objects from state
    const ordersToSync = (sampleOrders || []).filter(order => {
      if (!order) return false;
      const oid = String(order.orderId || order.id || order.order_number || "");
      const rid = String(order.id || "");
      const onum = String(order.order_number || "");
      return idsToSync.includes(oid) || idsToSync.includes(rid) || idsToSync.includes(onum);
    });

    // 1. Optimistically update local state & localStorage immediately
    setSampleOrders(prev => {
      const safePrev = Array.isArray(prev) ? prev : [];
      const updated = safePrev.map(order => {
        if (!order) return order;
        const oid = String(order.orderId || order.id || order.order_number || "");
        const rid = String(order.id || "");
        const onum = String(order.order_number || "");
        if (idsToSync.includes(oid) || idsToSync.includes(rid) || idsToSync.includes(onum)) {
          return { ...order, status: targetStatus };
        }
        return order;
      });
      if (typeof window !== "undefined") {
        safeSetLocalStorage("gsp_sample_orders", JSON.stringify(updated));
      }
      return updated;
    });

    setSelectedOrderRowIds([]);

    // 2. Persist to backend / Firestore
    const syncPromises = (ordersToSync.length > 0 ? ordersToSync : idsToSync.map(id => ({ id, order_number: id, orderId: id }))).map(async (order: any) => {
      try {
        await fetch("/api/orders", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: order.id,
            order_number: order.order_number || order.orderId || order.id,
            orderId: order.orderId || order.order_number || order.id,
            status: targetStatus,
            shipping: {
              ...(order.shipping || {}),
              carrier: order.carrierName || order.courier || order.shipping?.carrier || "DHL Paket",
              trackingNumber: order.trackingAwbNumber || order.tracking_number || order.shipping?.trackingNumber || "",
              status: targetStatus,
            }
          })
        });
      } catch (e) {
        console.warn("Batch sync error for order:", order, e);
      }
    });

    await Promise.all(syncPromises);

    // 3. Immediately re-fetch to ensure fresh database state is loaded
    await fetchOrders();
  };

  const handleBatchSetStatus = async (targetStatus: string) => {
    if (selectedOrderRowIds.length === 0) return;
    const idsToSync = [...selectedOrderRowIds];

    const ordersToSync = (sampleOrders || []).filter(order => {
      if (!order) return false;
      const oid = String(order.orderId || order.id || order.order_number || "");
      const rid = String(order.id || "");
      const onum = String(order.order_number || "");
      return idsToSync.includes(oid) || idsToSync.includes(rid) || idsToSync.includes(onum);
    });

    setSampleOrders(prev => {
      const safePrev = Array.isArray(prev) ? prev : [];
      const updated = safePrev.map(order => {
        if (!order) return order;
        const oid = String(order.orderId || order.id || order.order_number || "");
        const rid = String(order.id || "");
        const onum = String(order.order_number || "");
        if (idsToSync.includes(oid) || idsToSync.includes(rid) || idsToSync.includes(onum)) {
          return { ...order, status: targetStatus };
        }
        return order;
      });
      if (typeof window !== "undefined") safeSetLocalStorage("gsp_sample_orders", JSON.stringify(updated));
      return updated;
    });

    setSelectedOrderRowIds([]);

    const syncPromises = (ordersToSync.length > 0 ? ordersToSync : idsToSync.map(id => ({ id, order_number: id, orderId: id }))).map(async (order: any) => {
      try {
        await fetch("/api/orders", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: order.id,
            order_number: order.order_number || order.orderId || order.id,
            orderId: order.orderId || order.order_number || order.id,
            status: targetStatus,
          })
        });
      } catch (e) {
        console.warn("Batch status sync error:", e);
      }
    });

    await Promise.all(syncPromises);
    await fetchOrders();
  };

  const handleBatchDeleteOrders = async () => {
    if (selectedOrderRowIds.length === 0) return;
    const ok = window.confirm(`Are you sure you want to permanently delete ${selectedOrderRowIds.length} selected ${selectedOrderRowIds.length === 1 ? "order" : "orders"}? This action cannot be undone.`);
    if (!ok) return;

    const idsToDelete = [...selectedOrderRowIds];
    setSelectedOrderRowIds([]);

    setSampleOrders(prev => {
      const safePrev = Array.isArray(prev) ? prev : [];
      const updated = safePrev.filter(order => {
        if (!order) return false;
        const oid = String(order.orderId || order.id || order.order_number);
        return !idsToDelete.includes(oid);
      });
      if (typeof window !== "undefined") {
        safeSetLocalStorage("gsp_sample_orders", JSON.stringify(updated));
      }
      return updated;
    });

    for (const orderId of idsToDelete) {
      try {
        await fetch("/api/orders", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order_number: orderId, id: orderId })
        });
      } catch (err) {
        console.warn("Batch delete from backend error:", err);
      }
    }
  };

  const filteredOrders = useMemo(() => {
    if (!Array.isArray(sampleOrders)) return [];
    let list = sampleOrders.filter(Boolean);

    if (orderStatusFilter !== "ALL") {
      list = list.filter(order => {
        const s = (order?.status || "").toLowerCase().trim();
        if (orderStatusFilter === "NEW") {
          return (
            (s === "new" || s === "pending payment" || s === "pending" || s === "payment confirmed" || s === "paid via paypal" || s === "paid" || !s) &&
            s !== "courier assigned" && s !== "courier_assigned" && s !== "accepted" && s !== "processing"
          );
        }
        if (orderStatusFilter === "COURIER_ASSIGNED") {
          return s === "courier assigned" || s === "courier_assigned" || s === "accepted" || s === "processing";
        }
        if (orderStatusFilter === "IN_TRANSIT") {
          return s === "in transit" || s === "in-transit" || s.includes("transit");
        }
        if (orderStatusFilter === "SHIPPED") {
          return s === "shipped" || s === "dispatched" || s === "delivered" || s === "completed";
        }
        if (orderStatusFilter === "CANCELLED") {
          return s === "cancelled" || s === "canceled" || s === "refunded" || s === "rejected";
        }
        return true;
      });
    }

    const q = orderSearchQuery.toLowerCase().trim();
    if (!q) return list;
    return list.filter(order => {
      if (!order) return false;
      return (
        (order.orderId || order.order_number || "").toLowerCase().includes(q) ||
        (order.customer?.company || "").toLowerCase().includes(q) ||
        (order.customer?.name || order.customer_name || "").toLowerCase().includes(q) ||
        (order.customer?.email || order.customer_email || "").toLowerCase().includes(q) ||
        (order.customer?.phone || order.customer_phone || "").toLowerCase().includes(q) ||
        (order.productName || order.product_name || "").toLowerCase().includes(q) ||
        (order.shipping?.city || order.shipping_city || "").toLowerCase().includes(q) ||
        (order.shipping?.country || order.shipping_country || "").toLowerCase().includes(q) ||
        (order.payment?.transactionId || order.payment_id || "").toLowerCase().includes(q)
      );
    });
  }, [sampleOrders, orderSearchQuery, orderStatusFilter]);

  const handleExportOrdersCSV = useCallback(() => {
    if (!filteredOrders || filteredOrders.length === 0) {
      notifyAdmin("info", "Export", "No order records available to export.");
      return;
    }
    const headers = ["Order #", "Date", "Customer Name", "Email", "Products", "Status", "Total Amount", "Currency"];
    const rows = filteredOrders.map((o) => {
      const orderId = formatOrderSerialNumber(o);
      const productInfo = getOrderProductInfo(o);
      const customerName = o.shipping_address?.name || o.customer?.name || o.customer_name || o.payer?.name?.given_name || "Customer";
      const email = o.shipping_address?.email || o.customer?.email || o.customer_email || o.payer?.email_address || "";
      const dateStr = o.createdAt || o.created_at || o.date || "";
      const total = Number(o.total || 0).toFixed(2);
      const currency = o.currency || "EUR";
      const status = o.status || "New";
      return [
        `"${orderId}"`,
        `"${dateStr}"`,
        `"${customerName.replace(/"/g, '""')}"`,
        `"${email.replace(/"/g, '""')}"`,
        `"${productInfo.primaryName.replace(/"/g, '""')} x${productInfo.primaryQty}"`,
        `"${status}"`,
        total,
        `"${currency}"`,
      ];
    });
    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `ixos-orders-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    notifyAdmin("success", "Export Completed", "Order records downloaded as CSV successfully.");
  }, [filteredOrders, getOrderProductInfo]);

  const paymentStats = useMemo(() => {
    const safePayments = Array.isArray(payments) ? payments.filter(Boolean) : [];
    const safeOrders = Array.isArray(sampleOrders) ? sampleOrders.filter(Boolean) : [];

    const toView = (amt: number, fromCurr: string = "EUR") => {
      return convertAmount(amt, fromCurr, currency);
    };

    const paidPayments = safePayments.filter(p => p?.payment_status === "Paid" || p?.payment_status === "Partially Refunded");
    const failedPayments = safePayments.filter(p => p?.payment_status === "Failed" || p?.payment_status === "Cancelled");
    const pendingPayments = safePayments.filter(p => p?.payment_status === "Pending");
    const refundedPayments = safePayments.filter(p => p?.payment_status === "Refunded" || p?.payment_status === "Partially Refunded");

    // Orders revenue: orders with paid or confirmed status that aren't already represented in paidPayments
    const validOrders = safeOrders.filter(o => {
      const pStatus = (o?.payment?.status || o?.status || "").toLowerCase();
      return (
        pStatus.includes("paid") ||
        pStatus.includes("confirm") ||
        pStatus === "processing" ||
        pStatus === "shipped" ||
        pStatus === "delivered" ||
        pStatus === "completed"
      );
    });

    const ordersRevenue = validOrders
      .filter(o => !paidPayments.some(p => p.order_number === o.orderId || p.order_id === o.id || p.transaction_id === o.payment?.transactionId))
      .reduce((acc, o) => acc + toView(Number(o?.total) || 0, o?.currency || "EUR"), 0);

    const gatewayRevenue = paidPayments.reduce((acc, p) => acc + toView(Number(p?.amount) || 0, p?.currency || "EUR"), 0);
    const totalRevenue = gatewayRevenue + ordersRevenue;
    const totalRefunds = safePayments.reduce((acc, p) => acc + toView(Number(p?.refund_amount) || 0, p?.currency || "EUR"), 0);
    const netRevenue = Math.max(0, totalRevenue - totalRefunds);
    const adminTz = getAdminTimeZone();
    const tzAbbr = getTimeZoneAbbreviation(new Date(), adminTz);
    const todayStr = getAdminTodayDateString(adminTz);
    
    // Today's revenue from gateways + today's revenue from orders
    const todayGatewayRev = paidPayments
      .filter(p => getAdminLocalDateString(p?.created_at, adminTz) === todayStr)
      .reduce((acc, p) => acc + toView(Number(p?.amount) || 0, p?.currency || "EUR"), 0);

    const todayOrdersRev = validOrders
      .filter(o => getAdminLocalDateString(o?.created_at || o?.date, adminTz) === todayStr && !paidPayments.some(p => p.order_number === o.orderId && getAdminLocalDateString(p?.created_at, adminTz) === todayStr))
      .reduce((acc, o) => acc + toView(Number(o?.total) || 0, o?.currency || "EUR"), 0);
    const todayRevenue = todayGatewayRev + todayOrdersRev;

    // Exact Last 7 Days Revenue (past 7 days including today)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const isWithinLast7Days = (val: any) => {
      if (!val) return false;
      const d = new Date(val);
      if (isNaN(d.getTime())) return false;
      return d >= sevenDaysAgo;
    };

    const last7DaysGatewayRev = paidPayments
      .filter(p => isWithinLast7Days(p?.created_at || p?.date))
      .reduce((acc, p) => acc + toView(Number(p?.amount) || 0, p?.currency || "EUR"), 0);

    const last7DaysOrdersRev = validOrders
      .filter(o => isWithinLast7Days(o?.created_at || o?.date) && !paidPayments.some(p => p.order_number === o.orderId && isWithinLast7Days(p?.created_at || p?.date)))
      .reduce((acc, o) => acc + toView(Number(o?.total) || 0, o?.currency || "EUR"), 0);

    const last7DaysRevenue = last7DaysGatewayRev + last7DaysOrdersRev;

    const totalPaidTransactionsCount = paidPayments.length + validOrders.filter(o => !paidPayments.some(p => p.order_number === o.orderId)).length;
    const aov = totalPaidTransactionsCount > 0 ? totalRevenue / totalPaidTransactionsCount : 0;

    const totalTxns = safePayments.length + validOrders.length;
    const successRate = totalTxns > 0 ? (totalPaidTransactionsCount / totalTxns) * 100 : 100;

    // Dynamic trend points calculation based on selected graph range
    let trendPoints: { key: string; label: string; subLabel: string; sale: number; purchase: number }[] = [];

    const extractDateKey = (val: any) => {
      return getAdminLocalDateString(val, adminTz);
    };

    if (graphRange === "today") {
      // 6 time buckets across today: 00:00, 04:00, 08:00, 12:00, 16:00, 20:00 (Admin Local Time)
      const buckets = [
        { key: "00", label: "12 AM", subLabel: `12:00 AM – 04:00 AM (${tzAbbr})`, startH: 0, endH: 4 },
        { key: "04", label: "4 AM", subLabel: `04:00 AM – 08:00 AM (${tzAbbr})`, startH: 4, endH: 8 },
        { key: "08", label: "8 AM", subLabel: `08:00 AM – 12:00 PM (${tzAbbr})`, startH: 8, endH: 12 },
        { key: "12", label: "12 PM", subLabel: `12:00 PM – 04:00 PM (${tzAbbr})`, startH: 12, endH: 16 },
        { key: "16", label: "4 PM", subLabel: `04:00 PM – 08:00 PM (${tzAbbr})`, startH: 16, endH: 20 },
        { key: "20", label: "8 PM", subLabel: `08:00 PM – 11:59 PM (${tzAbbr})`, startH: 20, endH: 24 }
      ];

      trendPoints = buckets.map(b => ({
        key: b.key,
        label: b.label,
        subLabel: b.subLabel,
        sale: 0,
        purchase: 0
      }));

      const todayDateStr = todayStr;

      paidPayments.forEach(p => {
        const pKey = extractDateKey(p?.created_at);
        if (pKey === todayDateStr) {
          const hour = p?.created_at ? getAdminLocalHour(p.created_at, adminTz) : 12;
          const bucket = trendPoints.find((_, idx) => {
            const b = buckets[idx];
            return hour >= b.startH && hour < b.endH;
          }) || trendPoints[trendPoints.length - 1];
          bucket.sale += toView(Number(p?.amount) || 0, p?.currency || "EUR");
        }
      });

      validOrders.forEach(o => {
        const oKey = extractDateKey(o?.created_at || o?.date);
        if (oKey === todayDateStr && !paidPayments.some(p => p.order_number === o.orderId)) {
          const hour = o?.created_at ? getAdminLocalHour(o.created_at, adminTz) : 12;
          const bucket = trendPoints.find((_, idx) => {
            const b = buckets[idx];
            return hour >= b.startH && hour < b.endH;
          }) || trendPoints[trendPoints.length - 1];
          bucket.sale += toView(Number(o?.total) || 0, o?.currency || "EUR");
        }
      });

      const safePOs = Array.isArray(purchaseOrders) ? purchaseOrders : [];
      safePOs.forEach(po => {
        if (po?.status !== "Cancelled") {
          const poKey = extractDateKey(po?.order_date || po?.created_at);
          if (poKey === todayDateStr) {
            const hour = po?.created_at ? getAdminLocalHour(po.created_at, adminTz) : 12;
            const bucket = trendPoints.find((_, idx) => {
              const b = buckets[idx];
              return hour >= b.startH && hour < b.endH;
            }) || trendPoints[trendPoints.length - 1];
            bucket.purchase += toView(Number(po?.total_amount) || 0, po?.currency || "EUR");
          }
        }
      });
    } else {
      // Date range calculation (7d, last_month, last_3_months, custom)
      let numDays = 7;
      let startD = new Date();

      if (graphRange === "7d") {
        numDays = 7;
        startD.setDate(startD.getDate() - 6);
      } else if (graphRange === "last_month") {
        numDays = 30;
        startD.setDate(startD.getDate() - 29);
      } else if (graphRange === "last_3_months") {
        numDays = 90;
        startD.setDate(startD.getDate() - 89);
      } else if (graphRange === "custom") {
        const s = new Date(customGraphStart || todayStr);
        const e = new Date(customGraphEnd || todayStr);
        const minTime = Math.min(s.getTime(), e.getTime());
        const maxTime = Math.max(s.getTime(), e.getTime());
        const diffTime = maxTime - minTime;
        numDays = Math.min(365, Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1));
        startD = new Date(minTime);
      }

      const dateMap: Record<string, { sale: number; purchase: number; label: string; subLabel: string }> = {};

      for (let i = 0; i < numDays; i++) {
        const cur = new Date(startD);
        cur.setDate(cur.getDate() + i);
        const key = getAdminLocalDateString(cur, adminTz);
        dateMap[key] = {
          sale: 0,
          purchase: 0,
          label: cur.toLocaleDateString("de-DE", { weekday: "short", timeZone: adminTz }),
          subLabel: cur.toLocaleDateString("de-DE", { month: "short", day: "numeric", year: "numeric", timeZone: adminTz })
        };
      }

      paidPayments.forEach(p => {
        const dateKey = extractDateKey(p?.created_at);
        if (dateKey && dateKey in dateMap) {
          dateMap[dateKey].sale += toView(Number(p?.amount) || 0, p?.currency || "EUR");
        }
      });

      validOrders.forEach(o => {
        const dateKey = extractDateKey(o?.created_at || o?.date);
        if (dateKey && dateKey in dateMap && !paidPayments.some(p => p.order_number === o.orderId)) {
          dateMap[dateKey].sale += toView(Number(o?.total) || 0, o?.currency || "EUR");
        }
      });

      const safePOs = Array.isArray(purchaseOrders) ? purchaseOrders : [];
      safePOs.forEach(po => {
        if (po?.status !== "Cancelled") {
          const dateKey = extractDateKey(po?.order_date || po?.created_at);
          if (dateKey && dateKey in dateMap) {
            dateMap[dateKey].purchase += toView(Number(po?.total_amount) || 0, po?.currency || "EUR");
          }
        }
      });

      trendPoints = Object.entries(dateMap).map(([key, data]) => ({
        key,
        label: data.label,
        subLabel: data.subLabel,
        sale: data.sale,
        purchase: data.purchase
      }));
    }

    // Gateway split
    const gateways: Record<string, number> = { PayPal: 0, Other: 0 };
    paidPayments.forEach(p => {
      const gw = p?.payment_gateway || "Other";
      const val = toView(Number(p?.amount) || 0, p?.currency || "EUR");
      if (gw in gateways) {
        gateways[gw] += val;
      } else {
        gateways.Other += val;
      }
    });
    validOrders.forEach(o => {
      if (!paidPayments.some(p => p.order_number === o.orderId)) {
        const gw = o?.payment?.gateway || "Bank Wire / TT";
        const val = toView(Number(o?.total) || 0, o?.currency || (o?.payment?.gateway === "PayPal" ? "USD" : "INR"));
        if (gw in gateways) {
          gateways[gw] += val;
        } else {
          gateways.Other += val;
        }
      }
    });

    return {
      totalRevenue,
      netRevenue,
      totalRefunds,
      todayRevenue,
      last7DaysRevenue,
      paidCount: totalPaidTransactionsCount,
      failedCount: failedPayments.length,
      pendingCount: pendingPayments.length,
      refundedCount: refundedPayments.length,
      refundCount: refundedPayments.length,
      aov,
      successRate,
      dailyRev: trendPoints.map(p => ({
        date: p.key,
        label: p.label,
        subLabel: p.subLabel,
        sale: p.sale,
        purchase: p.purchase,
        val: p.sale
      })),
      totalTrendSales: trendPoints.reduce((sum, p) => sum + p.sale, 0),
      totalTrendPurchases: trendPoints.reduce((sum, p) => sum + p.purchase, 0),
      total7dSales: trendPoints.reduce((sum, p) => sum + p.sale, 0),
      total7dPurchases: trendPoints.reduce((sum, p) => sum + p.purchase, 0),
      gateways,
    };
  }, [payments, sampleOrders, purchaseOrders, currency, convertAmount]);

    // ─── DEDICATED REACTIVE TREND GRAPH ENGINE (ADMIN LOCAL TIMELINE) ───
  const trendGraphData = useMemo(() => {
    const safePayments = Array.isArray(payments) ? payments.filter(Boolean) : [];
    const safeOrders = Array.isArray(sampleOrders) ? sampleOrders.filter(Boolean) : [];
    const safePOs = Array.isArray(purchaseOrders) ? purchaseOrders.filter(Boolean) : [];
    const safeExpenses = Array.isArray(expenses) ? expenses.filter(Boolean) : [];

    const toView = (amt: number, fromCurr: string = "EUR") => {
      return convertAmount(amt, fromCurr, currency);
    };

    const adminTz = getAdminTimeZone();
    const tzAbbr = getTimeZoneAbbreviation(new Date(), adminTz);

    const getDateTimeInfo = (val: any) => {
      if (!val) return { dateStr: "", hour: 12 };
      const dateStr = getAdminLocalDateString(val, adminTz);
      const hour = getAdminLocalHour(val, adminTz);
      return { dateStr, hour };
    };

    const adminToday = getAdminTodayDateString(adminTz);
    const paidPayments = safePayments.filter(p => p?.payment_status === "Paid" || p?.payment_status === "Partially Refunded");
    const validOrders = safeOrders.filter(o => {
      const pStatus = (o?.payment?.status || o?.status || "").toLowerCase();
      return (
        pStatus.includes("paid") ||
        pStatus.includes("confirm") ||
        pStatus === "processing" ||
        pStatus === "shipped" ||
        pStatus === "delivered" ||
        pStatus === "completed"
      );
    });

    let points: {
      key: string;
      label: string;
      subLabel: string;
      fullDateLabel: string;
      sale: number;
      expense: number;
    }[] = [];

    if (graphRange === "today") {
      // 6 time slots across 24-hour administrator local time
      const slots = [
        { key: "00", label: "12 AM", subLabel: `00:00 – 04:00 ${tzAbbr}`, fullDateLabel: `Heute (${adminToday}), 00:00 – 04:00 ${tzAbbr}`, startH: 0, endH: 4 },
        { key: "04", label: "4 AM", subLabel: `04:00 – 08:00 ${tzAbbr}`, fullDateLabel: `Heute (${adminToday}), 04:00 – 08:00 ${tzAbbr}`, startH: 4, endH: 8 },
        { key: "08", label: "8 AM", subLabel: `08:00 – 12:00 ${tzAbbr}`, fullDateLabel: `Heute (${adminToday}), 08:00 – 12:00 ${tzAbbr}`, startH: 8, endH: 12 },
        { key: "12", label: "12 PM", subLabel: `12:00 – 16:00 ${tzAbbr}`, fullDateLabel: `Heute (${adminToday}), 12:00 – 16:00 ${tzAbbr}`, startH: 12, endH: 16 },
        { key: "16", label: "4 PM", subLabel: `16:00 – 20:00 ${tzAbbr}`, fullDateLabel: `Heute (${adminToday}), 16:00 – 20:00 ${tzAbbr}`, startH: 16, endH: 20 },
        { key: "20", label: "8 PM", subLabel: `20:00 – 23:59 ${tzAbbr}`, fullDateLabel: `Heute (${adminToday}), 20:00 – 23:59 ${tzAbbr}`, startH: 20, endH: 24 }
      ];

      points = slots.map(s => ({
        key: s.key,
        label: s.label,
        subLabel: s.subLabel,
        fullDateLabel: s.fullDateLabel,
        sale: 0,
        expense: 0
      }));

      paidPayments.forEach(p => {
        const { dateStr, hour } = getDateTimeInfo(p?.created_at);
        if (dateStr === adminToday) {
          const slot = points.find((_, idx) => hour >= slots[idx].startH && hour < slots[idx].endH) || points[points.length - 1];
          slot.sale += toView(Number(p?.amount) || 0, p?.currency || "EUR");
        }
      });

      validOrders.forEach(o => {
        const { dateStr, hour } = getDateTimeInfo(o?.created_at || o?.date);
        if (dateStr === adminToday && !paidPayments.some(p => p.order_number === o.orderId)) {
          const slot = points.find((_, idx) => hour >= slots[idx].startH && hour < slots[idx].endH) || points[points.length - 1];
          slot.sale += toView(Number(o?.total) || 0, o?.currency || "EUR");
        }
      });

      // 1. POs as Raw Material Expenses
      safePOs.forEach(po => {
        if (po?.status !== "Cancelled") {
          const { dateStr, hour } = getDateTimeInfo(po?.order_date || po?.created_at);
          if (dateStr === adminToday) {
            const slot = points.find((_, idx) => hour >= slots[idx].startH && hour < slots[idx].endH) || points[points.length - 1];
            slot.expense += toView(Number(po?.total_amount) || 0, po?.currency || "EUR");
          }
        }
      });

      // 2. Direct Operational Expenses
      safeExpenses.forEach(exp => {
        const { dateStr, hour } = getDateTimeInfo(exp?.date || exp?.created_at);
        if (dateStr === adminToday) {
          const slot = points.find((_, idx) => hour >= slots[idx].startH && hour < slots[idx].endH) || points[points.length - 1];
          slot.expense += toView(Number(exp?.amount) || 0, exp?.currency || "EUR");
        }
      });
    } else {
      let numDays = 7;
      let startD = new Date();

      if (graphRange === "7d") {
        numDays = 7;
        startD.setDate(startD.getDate() - 6);
      } else if (graphRange === "last_month") {
        numDays = 30;
        startD.setDate(startD.getDate() - 29);
      } else if (graphRange === "last_3_months") {
        numDays = 90;
        startD.setDate(startD.getDate() - 89);
      } else if (graphRange === "custom") {
        const s = new Date(customGraphStart || adminToday);
        const e = new Date(customGraphEnd || adminToday);
        const minTime = Math.min(s.getTime(), e.getTime());
        const maxTime = Math.max(s.getTime(), e.getTime());
        const diffTime = maxTime - minTime;
        numDays = Math.min(365, Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1));
        startD = new Date(minTime);
      }

      const dateMap: Record<string, { sale: number; expense: number; label: string; subLabel: string; fullDateLabel: string }> = {};

      for (let i = 0; i < numDays; i++) {
        const cur = new Date(startD);
        cur.setDate(cur.getDate() + i);
        const key = cur.toLocaleDateString("en-CA", { timeZone: adminTz });
        dateMap[key] = {
          sale: 0,
          expense: 0,
          label: cur.toLocaleDateString("de-DE", { weekday: "short", timeZone: adminTz }),
          subLabel: cur.toLocaleDateString("de-DE", { month: "short", day: "numeric", timeZone: adminTz }),
          fullDateLabel: cur.toLocaleDateString("de-DE", { weekday: "short", month: "short", day: "numeric", year: "numeric", timeZone: adminTz })
        };
      }

      paidPayments.forEach(p => {
        const { dateStr } = getDateTimeInfo(p?.created_at);
        if (dateStr && dateStr in dateMap) {
          dateMap[dateStr].sale += toView(Number(p?.amount) || 0, p?.currency || "EUR");
        }
      });

      validOrders.forEach(o => {
        const { dateStr } = getDateTimeInfo(o?.created_at || o?.date);
        if (dateStr && dateStr in dateMap && !paidPayments.some(p => p.order_number === o.orderId)) {
          dateMap[dateStr].sale += toView(Number(o?.total) || 0, o?.currency || "EUR");
        }
      });

      // 1. POs as Raw Material Expenses
      safePOs.forEach(po => {
        if (po?.status !== "Cancelled") {
          const { dateStr } = getDateTimeInfo(po?.order_date || po?.created_at);
          if (dateStr && dateStr in dateMap) {
            dateMap[dateStr].expense += toView(Number(po?.total_amount) || 0, po?.currency || "EUR");
          }
        }
      });

      // 2. Direct Operational Expenses
      safeExpenses.forEach(exp => {
        const { dateStr } = getDateTimeInfo(exp?.date || exp?.created_at);
        if (dateStr && dateStr in dateMap) {
          dateMap[dateStr].expense += toView(Number(exp?.amount) || 0, exp?.currency || "EUR");
        }
      });

      points = Object.entries(dateMap).map(([key, data]) => ({
        key,
        label: data.label,
        subLabel: data.subLabel,
        fullDateLabel: data.fullDateLabel,
        sale: data.sale,
        expense: data.expense
      }));
    }

    const totalSales = points.reduce((sum, p) => sum + p.sale, 0);
    const totalExpenses = points.reduce((sum, p) => sum + p.expense, 0);

    return {
      points,
      totalSales,
      totalExpenses,
      rangeLabel: graphRange === "today" 
        ? `Heute (24 Std. ${tzAbbr})` 
        : graphRange === "7d" 
          ? "Last 7 Days" 
          : graphRange === "last_month" 
            ? "Last Month (30 Days)" 
            : graphRange === "last_3_months" 
              ? "Last 3 Months (90 Days)" 
              : "Benutzerdefinierter Zeitraum",
      periodSalesLabel: graphRange === "today" ? "Today's Revenue" : graphRange === "7d" ? "7-Day Revenue" : graphRange === "last_month" ? "30-Day Revenue" : graphRange === "last_3_months" ? "90-Day Revenue" : "Period Revenue",
      periodExpensesLabel: graphRange === "today" ? "Today's Costs" : graphRange === "7d" ? "7-Day Costs" : graphRange === "last_month" ? "30-Day Costs" : graphRange === "last_3_months" ? "90-Day Costs" : "Period Costs",
    };
  }, [payments, sampleOrders, purchaseOrders, expenses, currency, convertAmount, graphRange, customGraphStart, customGraphEnd]);

  const filteredPayments = useMemo(() => {
    if (!Array.isArray(payments)) return [];
    return payments
      .filter(p => {
        if (!p) return false;
        const matchSearch =
          (p.customer_name || "").toLowerCase().includes(paymentSearch.toLowerCase()) ||
          (p.customer_email || "").toLowerCase().includes(paymentSearch.toLowerCase()) ||
          (p.transaction_id || "").toLowerCase().includes(paymentSearch.toLowerCase()) ||
          (p.order_number || "").toLowerCase().includes(paymentSearch.toLowerCase());
        
        const matchGateway = paymentGatewayFilter === "all" || p.payment_gateway?.toLowerCase() === paymentGatewayFilter.toLowerCase();
        const matchStatus = paymentStatusFilter === "all" || p.payment_status?.toLowerCase() === paymentStatusFilter.toLowerCase();

        return matchSearch && matchGateway && matchStatus;
      })
      .sort((a, b) => {
        if (!a || !b) return 0;
        let valA = a[paymentSortKey];
        let valB = b[paymentSortKey];
        
        if (paymentSortKey === "amount") {
          valA = Number(valA || 0);
          valB = Number(valB || 0);
        } else {
          valA = String(valA || "").toLowerCase();
          valB = String(valB || "").toLowerCase();
        }

        if (valA < valB) return paymentSortOrder === "asc" ? -1 : 1;
        if (valA > valB) return paymentSortOrder === "asc" ? 1 : -1;
        return 0;
      });
  }, [payments, paymentSearch, paymentGatewayFilter, paymentStatusFilter, paymentSortKey, paymentSortOrder]);
    // ═══════════════════════════════════════════════════════════════════
  // CATEGORIZED DASHBOARD INDEX MENU STRUCTURE (MAIN MENU -> SUBMENUS -> SUB-GROUPS)
  // ═══════════════════════════════════════════════════════════════════
  interface AdminSubMenuItem {
    id: string;
    label: string;
    icon: any;
    badgeKey?: "orders" | "clients" | "priceUnlocks";
    desc?: string;
  }

  interface AdminSubGroup {
    subGroupLabel?: string;
    items: AdminSubMenuItem[];
  }

  interface AdminMenuGroup {
    id: string;
    title: string;
    icon: any;
    description?: string;
    subGroups: AdminSubGroup[];
  }

    const adminMenuGroups: AdminMenuGroup[] = useMemo(() => [
    {
      id: "general",
      title: "General",
      icon: LayoutDashboard,
      subGroups: [
        {
          items: [
            { id: "overview", label: "Overview", icon: LayoutDashboard, desc: "Performance overview & sales analytics" },
            { id: "orders", label: "Orders", icon: ShoppingBag, badgeKey: "orders", desc: "Customer orders & fulfillment status" },
            { id: "customer-support", label: "Customersservice", icon: Headphones, desc: "Support-Tickets, Customersanfragen & Reparaturen" },
            { id: "customers", label: "Customers", icon: Users, desc: "Customersverzeichnis & Käuferprofile" },
          ]
        }
      ]
    },
    {
      id: "catalog",
      title: "Store & Catalog",
      icon: Box,
      subGroups: [
        {
          items: [
            { id: "products", label: "Products", icon: Cpu, desc: "Lautsprecherkomponenten, Inventory & Pricee" },
            { id: "inventory", label: "Inventory", icon: Boxes, desc: "Stock levels, thresholds & inventory management" },
            { id: "categories", label: "Categories", icon: Layers, desc: "Catalog taxonomy & collections" },
            { id: "discounts", label: "Discounts", icon: Percent, desc: "Promo codes & promotions" },
            { id: "shipping", label: "Shipping Rates", icon: Truck, desc: "Domestic wholesale shipping & export rates" },
            { id: "reviews", label: "Reviews", icon: Star, desc: "Customersrezensionen & Moderation" },
            { id: "legal-policies", label: "Legal & Policies", icon: FileText, desc: "Privacy Policy, Terms of Service, Shipping Policy, Returns" },
          ]
        }
      ]
    },
    {
      id: "settings",
      title: "Store Settings & Tools",
      icon: Store,
      subGroups: [
        {
          items: [
            { id: "store-settings", label: "Shop-Settings", icon: Store, desc: "Ankündigungen, Blogs, Aktualisierungen & Hinweise" },
            { id: "api-keys", label: "API-Schlüssel", icon: KeyRound, desc: "Payments-Gateways, PayPal, Stripe, DHL, Google & Meta" },
            { id: "store-announcements", label: "Ankündigungen", icon: Megaphone, desc: "Ticker-Ankündigungen im Storefront" },
            { id: "store-blogs", label: "Blogartikel", icon: BookOpen, desc: "Technische Anleitungen & Reparaturberichte" },
            { id: "store-updates", label: "Aktualisierungen", icon: Sparkles, desc: "Changelog & Systemhinweise" },
          ]
        }
      ]
    }
  ], []);

  const [openMenuGroups, setOpenMenuGroups] = useState<Record<string, boolean>>({
    general: true,
    catalog: true,
    settings: true
  });

  const toggleMenuGroup = (groupId: string) => {
    setOpenMenuGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  const navTabsList = useMemo(() => {
    const list: Array<{ id: string; label: string; icon: any; group: string }> = [
      { id: "overview", label: "Overview", icon: LayoutDashboard, group: "General" }
    ];
    adminMenuGroups.forEach(group => {
      group.subGroups.forEach(sub => {
        sub.items.forEach(item => {
          if (item.id !== "overview") {
            list.push({
              id: item.id,
              label: item.label,
              icon: item.icon,
              group: group.title
            });
          }
        });
      });
    });
    return list;
  }, [adminMenuGroups]);

  const filteredNavTabs = useMemo(() => {
    if (!sidebarSearchQuery.trim()) return [];
    const q = sidebarSearchQuery.toLowerCase().trim();
    return navTabsList.filter(item => 
      item.label.toLowerCase().includes(q) || item.group.toLowerCase().includes(q)
    );
  }, [sidebarSearchQuery, navTabsList]);

  // Automatically ensure the active tab's parent group is expanded
  useEffect(() => {
    const parentGroup = adminMenuGroups.find(g => 
      g.subGroups.some(sg => sg.items.some(item => item.id === activeTab))
    );
    if (parentGroup && !openMenuGroups[parentGroup.id]) {
      setOpenMenuGroups(prev => ({ ...prev, [parentGroup.id]: true }));
    }
  }, [activeTab, adminMenuGroups]);

  const activeTabMeta = navTabsList.find(t => t.id === activeTab || (activeTab === "sample-orders" && t.id === "orders")) || navTabsList[0];

  // Sync and track unread orders & price unlocks count for notification badge
  useEffect(() => {
    if (typeof window === "undefined") return;
    const total = (Array.isArray(sampleOrders) ? sampleOrders.length : 0) + (Array.isArray(priceUnlocks) ? priceUnlocks.length : 0);
    const seenStr = localStorage.getItem("ixos_last_seen_orders_count");
    
    if (seenStr === null) {
      localStorage.setItem("ixos_last_seen_orders_count", String(total));
      setUnreadOrdersCount(0);
    } else {
      const lastSeen = Number(seenStr);
      if (activeTab === "orders" || activeTab === "sample-orders") {
        localStorage.setItem("ixos_last_seen_orders_count", String(total));
        setUnreadOrdersCount(0);
      } else {
        const unread = Math.max(0, total - lastSeen);
        setUnreadOrdersCount(unread);
      }
    }
  }, [sampleOrders, priceUnlocks, activeTab]);

  const [openTicketsCount, setOpenTicketsCount] = useState<number>(0);

  const fetchOpenTicketsCount = useCallback(async () => {
    try {
      const res = await fetch("/api/support-tickets?status=open&t=" + Date.now());
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setOpenTicketsCount(data.length);
        }
      }
    } catch (_) {}
  }, []);

  useEffect(() => {
    fetchOpenTicketsCount();
  }, [fetchOpenTicketsCount]);

  const handleSelectTab = (tabId: string) => {
    setActiveTab(tabId as any);
    setDetailProduct(null);
    if (tabId === "customer-support") {
      fetchOpenTicketsCount();
    }
    if (tabId === "products") {
      setProdCategoryFilter("");
      setProdSearch("");
      setProdCurrentPage(1);
    }
    if (tabId === "orders" || tabId === "sample-orders") {
      fetchOrders();
      fetchPayments();
      const total = (Array.isArray(sampleOrders) ? sampleOrders.length : 0) + (Array.isArray(priceUnlocks) ? priceUnlocks.length : 0);
      if (typeof window !== "undefined") {
        localStorage.setItem("ixos_last_seen_orders_count", String(total));
      }
      setUnreadOrdersCount(0);
    }
    if (tabId === "overview" || tabId === "dashboard") {
      fetchOrders();
      fetchPayments();
    }
    if (tabId === "price-unlocks") {
      fetchPriceUnlocks();
    }
  };

  const handleSelectOrder = (order: any, orderNumber?: string) => {
    handleSelectTab("orders");

    const targetId = String(
      order?.orderId || order?.order_number || order?.orderNumber || order?.id || orderNumber || ""
    ).trim();
    const targetEmail = String(
      order?.customer?.email || order?.customer_email || order?.customerEmail || order?.payerEmail || ""
    ).trim().toLowerCase();

    // Look for matching normalized order in sampleOrders
    const matched = (Array.isArray(sampleOrders) ? sampleOrders : []).find((o) => {
      const oId = String(o?.orderId || o?.order_number || o?.id || "").trim();
      if (targetId && (oId === targetId || oId.toLowerCase() === targetId.toLowerCase())) {
        return true;
      }
      if (targetEmail && (String(o?.customer?.email || o?.customer_email || "").toLowerCase() === targetEmail)) {
        return true;
      }
      return false;
    });

    const finalOrder = matched || (order ? normalizeAdminOrder(order) : null);
    if (finalOrder && !matched) {
      setSampleOrders((prev) => [finalOrder, ...(Array.isArray(prev) ? prev.filter(Boolean) : [])]);
    }

    // Filter order search query to the target order ID or customer name so it's directly visible in the orders list
    if (targetId) {
      setOrderSearchQuery(targetId);
    } else if (order?.customerName || order?.customer_name) {
      setOrderSearchQuery(order.customerName || order.customer_name);
    }

    // Set correct pipeline status filter tab so the order is in the active list
    if (finalOrder) {
      const s = String(finalOrder?.status || "").toLowerCase().trim();
      if (s === "courier assigned" || s === "courier_assigned" || s === "accepted" || s === "processing") {
        setOrderStatusFilter("COURIER_ASSIGNED");
      } else if (s === "in transit" || s === "in-transit" || s.includes("transit")) {
        setOrderStatusFilter("IN_TRANSIT");
      } else if (s === "shipped" || s === "dispatched" || s === "delivered" || s === "completed") {
        setOrderStatusFilter("SHIPPED");
      } else if (s === "cancelled" || s === "canceled" || s === "refunded" || s === "rejected") {
        setOrderStatusFilter("CANCELLED");
      } else {
        setOrderStatusFilter("NEW");
      }

      // Automatically open the Order Details Drawer for full detail inspection
      setSelectedOrderForDetail(finalOrder);
    }
  };

  // ═══════════════════════════════════════════════════════════════════
  // LOGIN SCREEN — Wastram Branded Sign-in
  // ═══════════════════════════════════════════════════════════════════
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-between p-4 bg-background text-foreground font-sans">
        {/* Upper region between top of screen and authentication card */}
        <div className="w-full flex-1 flex flex-col items-center justify-center min-h-[120px]">
          {/* 60% distance from the top screen */}
          <div style={{ flex: "6 1 0%" }} className="w-full min-h-[36px]" />

          {/* Wastram Brand Logo */}
          <div className="flex items-center justify-center select-none shrink-0">
            <NextImage
              src="/logo-light.png"
              alt="Wastram"
              width={160}
              height={52}
              className="h-10 w-auto object-contain dark:hidden pointer-events-none"
              priority
            />
            <NextImage
              src="/logo-dark.png"
              alt="Wastram"
              width={160}
              height={52}
              className="h-10 w-auto object-contain hidden dark:block pointer-events-none"
              priority
            />
          </div>

          {/* 40% distance to the authentication card */}
          <div style={{ flex: "4 1 0%" }} className="w-full min-h-[24px]" />
        </div>

        {/* Card of Authentication */}
        <div className="w-full max-w-sm shrink-0">
          <Card className="shadow-xs border-border">
            <CardHeader className="space-y-1">
              <CardTitle className="text-xl font-semibold tracking-tight">Sign In</CardTitle>
              <CardDescription>
                Enter your administrative passcode to unlock the Atelier console.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form id="admin-auth-form" onSubmit={handleLogin} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-md bg-destructive/15 border border-destructive/30 text-destructive text-xs flex flex-col gap-1">
                    <div className="flex items-center gap-2 font-medium">
                      <ShieldAlert className="size-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                    {!isLocked && remainingAttempts < 5 && (
                      <span className="text-[11px] opacity-80 pl-6">
                        {remainingAttempts} {remainingAttempts === 1 ? 'Versuch verbleibend' : 'Versuche verbleibend'}
                      </span>
                    )}
                  </div>
                )}

                {/* Password Port */}
                <div className="space-y-2">
                  <label htmlFor="passcode-input" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Passwort
                  </label>
                  <div className="relative">
                    <input
                      id="passcode-input"
                      type={showPassword ? "text" : "password"}
                      autoFocus
                      required
                      disabled={loginLoading || isLocked}
                      value={passcode}
                      onChange={(e) => setPasscode(e.target.value)}
                      placeholder="••••••••••••"
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 pr-9 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer p-0.5"
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loginLoading || isLocked || !passcode.trim()}
                  className="w-full h-9 cursor-pointer"
                >
                  {loginLoading ? (
                    <>
                      <Loader2 className="size-4 animate-spin mr-2" />
                      <span>Sitzung wird überprüft...</span>
                    </>
                  ) : isLocked ? (
                    <span>Vorübergehend gesperrt</span>
                  ) : (
                    <span>Sign In</span>
                  )}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col gap-2 pt-0 pb-5">
              <Link
                href="/"
                className="text-xs text-muted-foreground hover:text-primary underline underline-offset-4 text-center flex items-center justify-center gap-1"
              >
                <span>Live Store</span>
                <ExternalLink className="size-3" />
              </Link>
            </CardFooter>
          </Card>
        </div>

        {/* Bottom spacer to balance the card on screen */}
        <div className="w-full flex-1 min-h-[48px]" />
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════
  // MAIN DASHBOARD
  // ═══════════════════════════════════════════════════════════════════
  return (
    <AuthenticatedLayout
      activeTab={activeTab}
      onSelectTab={handleSelectTab}
      unreadOrdersCount={unreadOrdersCount}
      openTicketsCount={openTicketsCount}
      onLogout={handleLogout}
    >
      {/* ─── SHADCN-ADMIN CANONICAL FEATURE MODULES ─── */}
      {(activeTab === "overview" ||
        activeTab === "dashboard" ||
        activeTab === "analytics" ||
        activeTab === "reports" ||
        activeTab === "notifications") && (
        <DashboardView
          initialSubTab={
            activeTab === "reports"
              ? "reports"
              : activeTab === "notifications"
              ? "notifications"
              : activeTab === "analytics"
              ? "analytics"
              : "overview"
          }
          onSelectTab={handleSelectTab}
          onSelectOrder={handleSelectOrder}
          onLogout={handleLogout}
          orders={sampleOrders}
          payments={payments}
          isLoading={isInitialLoading || loadingPayments}
          onRefresh={() => {
            fetchOrders();
            fetchPayments();
          }}
          onOrdersLoaded={(loadedOrders) => {
            if (Array.isArray(loadedOrders) && loadedOrders.length > 0) {
              const normalized = loadedOrders.map(normalizeAdminOrder);
              setSampleOrders(normalized);
              if (typeof window !== "undefined") {
                safeSetLocalStorage("gsp_sample_orders", JSON.stringify(normalized));
              }
            }
          }}
        />
      )}

      {(activeTab === "users" || activeTab === "customers") && (
        <CustomersView
          onSelectTab={handleSelectTab}
          onLogout={handleLogout}
          orders={sampleOrders}
          payments={payments}
        />
      )}

      {activeTab === "customer-support" && (
        <CustomerSupportView
          onSelectTab={handleSelectTab}
          onLogout={handleLogout}
        />
      )}

      {(activeTab === "api-keys" ||
        activeTab === "payment-settings" ||
        activeTab === "settings-api-keys") && (
        <ApiKeysView />
      )}

      {(activeTab === "store-settings" ||
        activeTab.startsWith("store-")) && (
        <StoreSettingsView
          subTab={activeTab === "store-settings" ? "announcements" : activeTab.replace("store-", "")}
          onSelectTab={handleSelectTab}
        />
      )}

      {(activeTab === "settings" ||
        activeTab.startsWith("settings-")) && (
        <SettingsView
          subTab={activeTab.replace("settings-", "")}
          onSelectTab={handleSelectTab}
          onLogout={handleLogout}
        />
      )}

      {activeTab.startsWith("error-") && (
        <ErrorView
          code={activeTab.replace("error-", "")}
          title={
            activeTab === "error-401" ? "Nicht autorisierter Zugriff" :
            activeTab === "error-403" ? "Zugriff verweigert" :
            activeTab === "error-404" ? "Seite nicht gefunden" :
            activeTab === "error-500" ? "Internal Server Error" :
            activeTab === "error-503" ? "Dienst nicht verfügbar" : "Error aufgetreten"
          }
          desc={
            activeTab === "error-401" ? "Please sign in with administrator credentials to access this section." :
            activeTab === "error-403" ? "You do not have permissions to view or manage this resource." :
            activeTab === "error-404" ? "The page or record you are searching for does not exist." :
            activeTab === "error-500" ? "Something went wrong on the server. Please try again later." :
            activeTab === "error-503" ? "Der Dienst ist aufgrund von Wartungsarbeiten vorübergehend nicht verfügbar." :
            "Ein unerwarteter Error ist aufgetreten."
          }
          onBack={() => handleSelectTab("overview")}
        />
      )}

      {activeTab.startsWith("auth-") && (
        <AuthPreviewView
          type={activeTab.replace("auth-", "") as any}
          onBack={() => handleSelectTab("overview")}
        />
      )}

      {activeTab.startsWith("clerk-") && (
        <AuthPreviewView
          type="clerk"
          onBack={() => handleSelectTab("overview")}
        />
      )}

      {activeTab === "help-center" && (
        <>
          <Header fixed>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold tracking-tight text-foreground">Hilfecenter</h1>
            </div>
            <div className="ms-auto flex items-center gap-2 sm:gap-4">
              <SearchHeader />
              <ThemeSwitch />
              <ConfigDrawer />
            </div>
          </Header>
          <Main className="flex flex-1 flex-col gap-4 font-inter text-foreground">
            <Card>
              <CardHeader>
                <CardTitle>Dokumentation & Support</CardTitle>
                <CardDescription>
                  Entdecken Sie Anleitungen, API-Dokumentationen und Hilfsressourcen für Ihr Dashboard.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Welcome to the Wastram Admin Knowledge Base. Find guides to manage your catalog, process boutique orders, customize theme aesthetics, and configure integrations.
                </p>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div className="rounded-lg border p-4">
                    <h3 className="font-semibold text-sm mb-1">Catalog Management</h3>
                    <p className="text-xs text-muted-foreground">Create and edit products, configure visibility, and assign categories.</p>
                  </div>
                  <div className="rounded-lg border p-4">
                    <h3 className="font-semibold text-sm mb-1">Bestellabwicklung</h3>
                    <p className="text-xs text-muted-foreground">Track dispatch status, generate proforma invoices, and verify payment proofs.</p>
                  </div>
                  <div className="rounded-lg border p-4">
                    <h3 className="font-semibold text-sm mb-1">Design & Anpassung</h3>
                    <p className="text-xs text-muted-foreground">Hell-/Dunkelmodus umschalten oder primäre OKLCH-Farbpaletten anpassen.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Main>
        </>
      )}

      {/* ─── STORE & INVENTORY TABS (BACKEND PRESERVED) ─── */}
      {activeTab !== "overview" &&
        activeTab !== "dashboard" &&
        activeTab !== "analytics" &&
        activeTab !== "reports" &&
        activeTab !== "notifications" &&
        activeTab !== "users" &&
        activeTab !== "customers" &&
        activeTab !== "customer-support" &&
        activeTab !== "settings" &&
        !activeTab.startsWith("settings-") &&
        activeTab !== "store-settings" &&
        !activeTab.startsWith("store-") &&
        activeTab !== "payment-settings" &&
        activeTab !== "api-keys" &&
        !activeTab.startsWith("error-") &&
        !activeTab.startsWith("auth-") &&
        !activeTab.startsWith("clerk-") &&
        activeTab !== "help-center" && (
          <>
            <Header fixed>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold tracking-tight capitalize text-foreground">
                  {activeTabMeta.label}
                </h1>
              </div>
              <div className="ms-auto flex items-center gap-2 sm:gap-4">
                <SearchHeader />
                <ThemeSwitch />
                <ConfigDrawer />
              </div>
            </Header>
            <Main className="flex flex-1 flex-col gap-4 font-inter text-foreground">

          {/* ─── CATEGORIES TAB ───────────────────────────────────────── */}
          {activeTab === "categories" && (
            catLoading && categories.length === 0 ? (
              <AdminCategoriesSkeleton />
            ) : (() => {
              const realCategories = categories.filter(c => c.id !== "all-parts" && c.id !== "specials" && !c.isVirtual);
              const filteredCategories = realCategories.filter(c => {
                if (!catSearch.trim()) return true;
                const q = catSearch.toLowerCase();
                return (
                  c.name.toLowerCase().includes(q) ||
                  c.slug.toLowerCase().includes(q) ||
                  (c.description && c.description.toLowerCase().includes(q))
                );
              });
              const totalAssignedProducts = realCategories.reduce((sum, c) => sum + (c.product_count || 0), 0) || (products.length > 0 ? products.length : 273);
              const visibleCategoriesCount = realCategories.filter(c => !c.is_hidden).length;
              const hiddenCategoriesCount = realCategories.filter(c => c.is_hidden).length;

              return (
                <div className="space-y-4 font-sans text-foreground animate-fade-in">
                  {/* ── TOP SECTION: Minimal Header & Search ── */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
                    <div>
                      <h1 className="text-3xl sm:text-4xl font-heading font-black tracking-tight text-black">
                        Categories
                      </h1>
                    </div>

                    {/* Right: Search & Add Category */}
                    <div className="flex items-center gap-2 flex-wrap shrink-0">
                      <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                        <input
                          type="text"
                          placeholder="Search categories..."
                          value={catSearch}
                          onChange={(e) => setCatSearch(e.target.value)}
                          className="bg-white border-2 border-neutral-200 focus:border-black rounded-xl pl-9 pr-3 py-2 text-xs text-black placeholder:text-neutral-400 outline-none w-44 sm:w-56 font-medium transition-colors"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => { setEditingCat(null); setShowCatForm(true); }}
                        className="px-4 py-2 bg-black hover:bg-neutral-800 text-white text-xs font-heading font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                      >
                        <Plus className="w-4 h-4 stroke-[2.5]" />
                        <span>Add Category</span>
                      </button>
                    </div>
                  </div>

                  {/* ── BOTTOM SECTION: Minimal Clean Category Cards ── */}
                  {filteredCategories.length === 0 ? (
                    <div className="py-16 text-center text-black font-medium text-xs bg-white rounded-2xl border-2 border-neutral-200 p-8">
                      No matching categories found.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredCategories.map(cat => (
                        <div 
                          key={cat.id} 
                          onClick={() => { setEditingCat(cat); setShowCatForm(true); }} 
                          className="bg-white border-2 border-neutral-200 hover:border-black rounded-2xl p-4 sm:p-5 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                          {/* Left: Bigger Thumbnail & Category Info */}
                          <div className="flex items-center gap-4 min-w-0 flex-1">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl border-2 border-neutral-200 bg-white p-1.5 shrink-0 overflow-hidden flex items-center justify-center">
                              {cat.image_url ? (
                                <img 
                                  src={cat.image_url} 
                                  alt={cat.name} 
                                  className="w-full h-full object-cover rounded-lg" 
                                />
                              ) : (
                                <Layers className="w-7 h-7 text-black stroke-[1.5]" />
                              )}
                            </div>
                            <div className="min-w-0 flex-1 space-y-1">
                              <div className="flex items-center gap-2.5 flex-wrap">
                                <h4 className="font-heading font-black text-base sm:text-lg text-black">{cat.name}</h4>
                                <span className={`text-[10px] font-heading font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                                  cat.is_hidden 
                                    ? "text-neutral-600 bg-neutral-100 border-neutral-300" 
                                    : "text-emerald-800 bg-emerald-50 border-emerald-300"
                                }`}>
                                  {cat.is_hidden ? "Ausgeblendet" : "Active"}
                                </span>
                              </div>
                              <p className="text-xs text-neutral-800 font-medium line-clamp-1">
                                {cat.description || `/${cat.slug}`}
                              </p>
                            </div>
                          </div>

                          {/* Center: Clean Products Count */}
                          <div className="flex items-center gap-3 shrink-0" onClick={(e) => e.stopPropagation()}>
                            <button
                              type="button"
                              onClick={() => {
                                setProdCategoryFilter(cat.slug);
                                setActiveTab("products");
                                setProdCurrentPage(1);
                              }}
                              className="px-3.5 py-2 rounded-xl text-xs font-heading font-bold text-black border-2 border-neutral-200 hover:border-black bg-white transition-colors cursor-pointer"
                              title="Products nach dieser Category filtern"
                            >
                              {cat.product_count ?? 0} {cat.product_count === 1 ? 'Product' : 'Products'}
                            </button>
                          </div>

                          {/* Right: Actions */}
                          <div onClick={(e) => e.stopPropagation()} className="flex items-center justify-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-200">
                            <a
                              href={`/${cat.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-xl border border-neutral-300 hover:border-black text-black transition-colors"
                              title="View category live in store"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                            <button 
                              type="button"
                              onClick={() => { setEditingCat(cat); setShowCatForm(true); }} 
                              className="px-4 py-2 bg-black hover:bg-neutral-800 text-white rounded-xl text-xs font-heading font-bold uppercase tracking-wider transition-colors cursor-pointer"
                              title="Edit Category"
                            >
                              Edit
                            </button>
                            <button 
                              type="button"
                              onClick={() => deleteCat(cat.slug || cat.id, cat.id)} 
                              className="p-2 rounded-xl text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer" 
                              title="Delete Category"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Category Form Modal */}
                  {showCatForm && (
                    <CategoryFormModal 
                      key={editingCat?.id || editingCat?.slug || "new-category"}
                      category={editingCat} 
                      categories={categories} 
                      onSave={saveCat} 
                      onClose={() => { setShowCatForm(false); setEditingCat(null); }} 
                    />
                  )}
                </div>
              );
            })()
          )}

          {/* ─── PRODUCTS TAB ─────────────────────────────────────────── */}
          {activeTab === "products" && !detailProduct && (
            prodLoading && products.length === 0 ? (
              <AdminProductsSkeleton />
            ) : (() => {
              const displayCategories = categories.filter(c => c.id !== "all-parts" && c.id !== "specials" && !c.isVirtual);
              const selectedCat = categories.find(c => c.slug === prodCategoryFilter || c.id === prodCategoryFilter);
              const isCategorySelected = Boolean(prodCategoryFilter);
              const isSearching = Boolean(prodSearch.trim());
              const isUsedPartsCategory = Boolean(
                prodCategoryFilter === "used-parts" || 
                selectedCat?.slug === "used-parts" || 
                selectedCat?.id === "used-parts" || 
                selectedCat?.name?.toLowerCase().includes("used") ||
                selectedCat?.name?.toLowerCase().includes("gebraucht")
              );

              // Products filtering
              const filteredProducts = products.filter(p => {
                if (prodStatusFilter === "ACTIVE" && p.is_hidden) return false;
                if (prodStatusFilter === "FEATURED" && !p.is_featured) return false;
                if (prodStatusFilter === "HIDDEN" && !p.is_hidden) return false;
                if (prodCategoryFilter && prodCategoryFilter !== "all") {
                  if (prodCategoryFilter === "unassigned") {
                    const normCatId = getProductNormalizedCategoryId(p);
                    if (normCatId && normCatId !== "" && normCatId !== "none" && normCatId !== "unassigned") return false;
                  } else {
                    const catLower = prodCategoryFilter.toLowerCase().trim();
                    const normCat = (catLower === "dust-cap" || catLower === "dust cap") ? "dust-caps" : catLower;
                    const pCatId = getProductNormalizedCategoryId(p);
                    if (!pCatId) return false;
                    const normPCatId = (pCatId === "dust-cap" || pCatId === "dust cap") ? "dust-caps" : pCatId;
                    const pCatName = (p.category_name || p.category?.name || (typeof p.category === "string" ? p.category : "")).toLowerCase().trim();
                    const isMatch =
                      pCatId === catLower ||
                      normPCatId === normCat ||
                      pCatName === catLower ||
                      (normCat === "dust-caps" && (normPCatId === "dust-caps" || pCatName.includes("dust cap") || pCatName.includes("staubkappe"))) ||
                      (normCat === "surround-repair" && (normPCatId === "surround-repair" || normPCatId === "surround-repairs")) ||
                      (selectedCat && (
                        pCatId === (selectedCat as any).id?.toLowerCase() ||
                        normPCatId === (selectedCat as any).id?.toLowerCase() ||
                        pCatId === selectedCat.slug.toLowerCase() ||
                        normPCatId === selectedCat.slug.toLowerCase() ||
                        pCatName === selectedCat.name.toLowerCase()
                      ));
                    if (!isMatch) return false;
                  }
                }
                if (prodSearch.trim()) {
                  const q = prodSearch.toLowerCase().trim();
                  const nameMatch = p.name?.toLowerCase().includes(q);
                  const skuMatch = (p.technical_specs?.["Part Number"] || p.technical_specs?.SKU || p.id || "")?.toLowerCase().includes(q);
                  const brandMatch = p.brand?.toLowerCase().includes(q);
                  if (!nameMatch && !skuMatch && !brandMatch) return false;
                }
                return true;
              });

              const activeCount = filteredProducts.filter(p => !p.is_hidden).length;
              const hiddenCount = filteredProducts.filter(p => p.is_hidden).length;

              const PRODS_PER_PAGE = 25;
              const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PRODS_PER_PAGE));
              const currentPageSafe = Math.min(prodCurrentPage, totalPages);
              const startIndex = (currentPageSafe - 1) * PRODS_PER_PAGE;
              const paginatedProducts = filteredProducts.slice(startIndex, startIndex + PRODS_PER_PAGE);

              return (
                <div className="space-y-5 font-sans text-foreground animate-fade-in">
                  {/* ── VIEW 1: CATEGORY CARDS VIEW (When no category selected and not searching) ── */}
                  {!isCategorySelected && !isSearching ? (
                    <div className="space-y-5">
                      {/* Top Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
                        <div>
                          <h1 className="text-3xl sm:text-4xl font-heading font-black tracking-tight text-black">
                            Products
                          </h1>
                          <p className="text-xs text-neutral-500 font-semibold mt-1">
                            Select a category below to browse and manage its styles ({displayCategories.length} categories available)
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 flex-wrap shrink-0">
                          <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                            <input
                              type="text"
                              placeholder="Search products..."
                              value={prodSearch}
                              onChange={(e) => { setProdSearch(e.target.value); setProdCurrentPage(1); }}
                              className="bg-white border-2 border-neutral-200 focus:border-black rounded-xl pl-9 pr-3 py-2 text-xs text-black placeholder:text-neutral-400 outline-none w-44 sm:w-56 font-medium transition-colors"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => { setEditingProd(null); setShowProdForm(true); }}
                            className="px-4 py-2 bg-black hover:bg-neutral-800 text-white text-xs font-heading font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                          >
                            <Plus className="w-4 h-4 stroke-[2.5]" />
                            <span>Add Product</span>
                          </button>
                        </div>
                      </div>

                      {/* Grid of Category Cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {/* "All Products" Card */}
                        <div
                          onClick={() => {
                            setProdCategoryFilter("all");
                            setProdCurrentPage(1);
                          }}
                          className="bg-white border-2 border-neutral-200 hover:border-black rounded-2xl p-5 cursor-pointer transition-all hover:shadow-md group flex flex-col justify-between"
                        >
                          <div className="w-24 h-24 mx-auto rounded-xl border-2 border-neutral-200 p-2 overflow-hidden flex items-center justify-center bg-white group-hover:scale-105 transition-transform">
                            <Box className="w-10 h-10 text-black stroke-[1.5]" />
                          </div>
                          <div className="mt-4 text-center">
                            <h3 className="font-heading font-black text-base text-black">
                              All Styles
                            </h3>
                            <p className="text-xs text-neutral-500 font-semibold mt-1">
                              {products.length} styles total
                            </p>
                          </div>
                          <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-center gap-1.5 text-xs font-heading font-bold uppercase tracking-wider text-black group-hover:underline">
                            <span>Browse All Products</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </div>
                        </div>

                        {displayCategories.map(cat => {
                          const inMemoryCount = products.filter(p => {
                            const pCatId = getProductNormalizedCategoryId(p);
                            const catId = cat.id.toLowerCase().trim();
                            const catSlug = cat.slug.toLowerCase().trim();
                            return (
                              pCatId === catId ||
                              pCatId === catSlug ||
                              (catId === "dust-caps" && (pCatId === "dust-cap" || pCatId === "dust-caps")) ||
                              (catId === "surround-repair" && (pCatId === "surround-repair" || pCatId === "surround-repairs"))
                            );
                          }).length;
                          const count = inMemoryCount > 0 ? inMemoryCount : ((cat as any).product_count || (cat as any).itemCount || 0);
                          const img = cat.image_url || (cat as any).image || (cat as any).heroImage;

                          return (
                            <div
                              key={cat.id}
                              onClick={() => {
                                setProdCategoryFilter(cat.slug);
                                setProdCurrentPage(1);
                              }}
                              className="bg-white border-2 border-neutral-200 hover:border-black rounded-2xl p-5 cursor-pointer transition-all hover:shadow-md group flex flex-col justify-between"
                            >
                              <div className="w-24 h-24 mx-auto rounded-xl border-2 border-neutral-200 p-2 overflow-hidden flex items-center justify-center bg-white group-hover:scale-105 transition-transform">
                                {img ? (
                                  <img
                                    src={img}
                                    alt={cat.name}
                                    className="w-full h-full object-cover rounded-lg"
                                  />
                                ) : (
                                  <Box className="w-10 h-10 text-black stroke-[1.5]" />
                                )}
                              </div>
                              <div className="mt-4 text-center">
                                <h3 className="font-heading font-black text-base text-black line-clamp-1">
                                  {cat.name}
                                </h3>
                                <p className="text-xs text-neutral-500 font-semibold mt-1">
                                  {count} Products
                                </p>
                              </div>
                              <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-center gap-1.5 text-xs font-heading font-bold uppercase tracking-wider text-black group-hover:underline">
                                <span>View Products</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </div>
                            </div>
                          );
                        })}

                        {/* Unassigned Products Card */}
                        {unassignedProducts.length > 0 && (
                          <div
                            onClick={() => {
                              setProdCategoryFilter("unassigned");
                              setProdCurrentPage(1);
                            }}
                            className="bg-white border-2 border-red-200 hover:border-red-500 rounded-2xl p-5 cursor-pointer transition-all hover:shadow-md group flex flex-col justify-between"
                          >
                            <div className="w-24 h-24 mx-auto rounded-xl border-2 border-red-100 bg-red-50/50 p-2 overflow-hidden flex items-center justify-center group-hover:scale-105 transition-transform">
                              <AlertCircle className="w-10 h-10 text-red-600 stroke-[1.5]" />
                            </div>
                            <div className="mt-4 text-center">
                              <h3 className="font-heading font-black text-base text-red-600">
                                No Category
                              </h3>
                              <p className="text-xs text-red-500 font-semibold mt-1">
                                {unassignedProducts.length} {unassignedProducts.length === 1 ? "Style" : "Styles"} unassigned
                              </p>
                            </div>
                            <div className="mt-4 pt-3 border-t border-red-100 flex items-center justify-center gap-1.5 text-xs font-heading font-bold uppercase tracking-wider text-red-600 group-hover:underline">
                              <span>Jetzt zuweisen</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    /* ── VIEW 2: CATEGORY PRODUCTS LIST VIEW (When a category is clicked OR searching) ── */
                    <div className="space-y-4">
                      {/* Top Header with Back to Categories Button */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
                        <div className="flex items-center gap-3 flex-wrap">
                          <button
                            type="button"
                            onClick={() => {
                              setProdCategoryFilter("");
                              setProdSearch("");
                              setProdCurrentPage(1);
                            }}
                            className="px-4 py-2 bg-white border-2 border-neutral-200 hover:border-black text-black text-xs font-heading font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer flex items-center gap-2 shadow-2xs"
                          >
                            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
                            <span>Categories</span>
                          </button>

                          <div>
                            <h1 className="text-2xl sm:text-3xl font-heading font-black tracking-tight text-black flex items-center gap-2">
                              <span>
                                {isSearching 
                                  ? `Search: "${prodSearch}"` 
                                  : (selectedCat?.name || (prodCategoryFilter === "all" ? "All Styles" : (prodCategoryFilter === "unassigned" ? "Unassigned Category" : prodCategoryFilter)))}
                              </span>
                              <span className="text-sm font-heading font-bold text-neutral-500">
                                ({filteredProducts.length})
                              </span>
                            </h1>
                          </div>
                        </div>

                        {/* Right: Search & Add Product */}
                        <div className="flex items-center gap-2 flex-wrap shrink-0">
                          <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                            <input
                              type="text"
                              placeholder={selectedCat ? `Search in ${selectedCat.name}...` : (prodCategoryFilter === "unassigned" ? "Search unassigned styles..." : "Search catalog products...")}
                              value={prodSearch}
                              onChange={(e) => { setProdSearch(e.target.value); setProdCurrentPage(1); }}
                              className="bg-white border-2 border-neutral-200 focus:border-black rounded-xl pl-9 pr-3 py-2 text-xs text-black placeholder:text-neutral-400 outline-none w-44 sm:w-56 font-medium transition-colors"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              if (isUsedPartsCategory) {
                                setTargetCategoryForAdd(null);
                                setShowUsedPartsChoiceModal(true);
                              } else if (selectedCat && unassignedProducts.length > 0) {
                                setTargetCategoryForAdd(selectedCat);
                                setShowUsedPartsChoiceModal(true);
                              } else if (selectedCat) {
                                setTargetCategoryForAdd(null);
                                setEditingProd({
                                  category_id: selectedCat.id,
                                  category: { name: selectedCat.name, slug: selectedCat.slug || selectedCat.id },
                                  is_hidden: false,
                                  is_featured: false,
                                } as any);
                                setShowProdForm(true);
                              } else {
                                setTargetCategoryForAdd(null);
                                setEditingProd(null);
                                setShowProdForm(true);
                              }
                            }}
                            className="px-4 py-2 bg-black hover:bg-neutral-800 text-white text-xs font-heading font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                          >
                            <Plus className="w-4 h-4 stroke-[2.5]" />
                            <span>Add Product</span>
                          </button>
                        </div>
                      </div>

                      {/* Minimal Filter Toolbar */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border-2 border-neutral-200 shadow-2xs">
                        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                          {/* Select All Checkbox */}
                          <div className="flex items-center gap-2 pl-1 pr-2.5 py-1 border-r-2 border-neutral-200 shrink-0">
                            <input
                              type="checkbox"
                              checked={paginatedProducts.length > 0 && paginatedProducts.every(p => selectedProdIds.includes(p.id))}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  const newIds = new Set([...selectedProdIds, ...paginatedProducts.map(p => p.id)]);
                                  setSelectedProdIds(Array.from(newIds));
                                } else {
                                  const pageIds = new Set(paginatedProducts.map(p => p.id));
                                  setSelectedProdIds(selectedProdIds.filter(id => !pageIds.has(id)));
                                }
                              }}
                              className="w-4 h-4 rounded border-2 border-neutral-300 text-black focus:ring-black cursor-pointer"
                              title="Select all products on this page"
                            />
                            <span className="text-xs font-heading font-bold text-neutral-700 hidden sm:inline select-none">
                              {selectedProdIds.length > 0 ? `${selectedProdIds.length} gewählt` : "Alle"}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => { setProdStatusFilter("ALL"); setProdCurrentPage(1); }}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-heading font-bold transition-all cursor-pointer ${
                              prodStatusFilter === "ALL"
                                ? "bg-black text-white"
                                : "bg-white text-black hover:bg-neutral-100 border border-neutral-200"
                            }`}
                          >
                            Alle ({filteredProducts.length})
                          </button>

                          <button
                            type="button"
                            onClick={() => { setProdStatusFilter("ACTIVE"); setProdCurrentPage(1); }}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-heading font-bold transition-all cursor-pointer ${
                              prodStatusFilter === "ACTIVE"
                                ? "bg-black text-white"
                                : "bg-white text-black hover:bg-neutral-100 border border-neutral-200"
                            }`}
                          >
                            Active ({activeCount})
                          </button>

                          <button
                            type="button"
                            onClick={() => { setProdStatusFilter("HIDDEN"); setProdCurrentPage(1); }}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-heading font-bold transition-all cursor-pointer ${
                              prodStatusFilter === "HIDDEN"
                                ? "bg-black text-white"
                                : "bg-white text-black hover:bg-neutral-100 border border-neutral-200"
                            }`}
                          >
                            Ausgeblendet ({hiddenCount})
                          </button>
                        </div>

                        {/* Category Dropdown Switcher */}
                        <div className="shrink-0 flex items-center gap-2">
                          <select
                            value={prodCategoryFilter}
                            onChange={(e) => {
                              setProdCategoryFilter(e.target.value);
                              setProdCurrentPage(1);
                            }}
                            className="bg-white border-2 border-neutral-200 focus:border-black rounded-xl px-3 py-1.5 text-xs text-black font-semibold outline-none cursor-pointer"
                          >
                            <option value="">← Category-Overview</option>
                            <option value="all">All Styles</option>
                            {unassignedProducts.length > 0 && (
                              <option value="unassigned">⚠️ Unassigned Category ({unassignedProducts.length})</option>
                            )}
                            {displayCategories.map(cat => (
                              <option key={cat.id} value={cat.slug}>{cat.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {filteredProducts.length === 0 ? (
                        <div className="py-16 text-center text-black font-medium text-xs bg-white rounded-2xl border-2 border-neutral-200 p-8 space-y-4">
                          <p>No matching products found in this category.</p>
                          <div className="flex items-center justify-center gap-2 flex-wrap">
                            <button
                              type="button"
                              onClick={() => { setProdCategoryFilter(""); setProdSearch(""); }}
                              className="px-4 py-2 bg-white border-2 border-neutral-200 hover:border-black text-black text-xs font-heading font-bold uppercase rounded-xl cursor-pointer transition-colors"
                            >
                              Back zu allen Categories
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (isUsedPartsCategory) {
                                  setTargetCategoryForAdd(null);
                                  setShowUsedPartsChoiceModal(true);
                                } else if (selectedCat && unassignedProducts.length > 0) {
                                  setTargetCategoryForAdd(selectedCat);
                                  setShowUsedPartsChoiceModal(true);
                                } else if (selectedCat) {
                                  setTargetCategoryForAdd(null);
                                  setEditingProd({
                                    category_id: selectedCat.id,
                                    category: { name: selectedCat.name, slug: selectedCat.slug || selectedCat.id },
                                    is_hidden: false,
                                    is_featured: false,
                                  } as any);
                                  setShowProdForm(true);
                                } else {
                                  setTargetCategoryForAdd(null);
                                  setEditingProd(null);
                                  setShowProdForm(true);
                                }
                              }}
                              className="px-4 py-2 bg-black hover:bg-neutral-800 text-white text-xs font-heading font-bold uppercase rounded-xl cursor-pointer flex items-center gap-1.5 shadow-xs transition-colors"
                            >
                              <Plus className="w-4 h-4 stroke-[2.5]" />
                              <span>Add Product</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          {/* Products List with BIGGER Images & THINNER Price */}
                          <div className="space-y-3">
                            {paginatedProducts.map(prod => (
                              <div 
                                key={prod.id} 
                                onClick={() => { setEditingProd(prod); setShowProdForm(true); }} 
                                className={`bg-white border-2 rounded-2xl p-4 sm:p-5 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                                  selectedProdIds.includes(prod.id) ? "border-black bg-neutral-50/50 shadow-sm" : "border-neutral-200 hover:border-black"
                                }`}
                              >
                                {/* Left: Checkbox + Prominent Large Image & Product Details */}
                                <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                                  <input
                                    type="checkbox"
                                    checked={selectedProdIds.includes(prod.id)}
                                    onChange={(e) => {
                                      e.stopPropagation();
                                      setSelectedProdIds(prev =>
                                        prev.includes(prod.id) ? prev.filter(id => id !== prod.id) : [...prev, prod.id]
                                      );
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                    className="w-4 h-4 rounded border-2 border-neutral-300 text-black focus:ring-black cursor-pointer shrink-0"
                                    title="Select Product"
                                  />

                                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl border-2 border-neutral-200 bg-white p-1 shrink-0 overflow-hidden flex items-center justify-center">
                                    {(() => {
                                      const prodImg = prod.featured_image || (prod as any).mainImage || (prod as any).image || (prod as any).images?.[0] || ((prod as any).colorVariants?.[0]?.images?.[0]);
                                      return prodImg ? (
                                        <img 
                                          src={prodImg} 
                                          alt={prod.name} 
                                          className="w-full h-full object-cover rounded-lg" 
                                          loading="lazy"
                                        />
                                      ) : (
                                        <Box className="w-8 h-8 text-black stroke-[1.5]" />
                                      );
                                    })()}
                                  </div>

                                  <div className="min-w-0 flex-1 space-y-1">
                                    <h3 className="font-heading font-black text-sm sm:text-base text-black leading-snug line-clamp-2">
                                      {prod.name}
                                    </h3>
                                    <div className="text-xs text-neutral-800 font-semibold flex items-center gap-2 flex-wrap">
                                      {(!prod.category_id || prod.category_id === "none" || prod.category_id === "" || prod.category_id === "unassigned") ? (
                                        <span className="text-red-600 font-bold">⚠️ Unassigned Category</span>
                                      ) : (
                                        <span className="text-black font-bold">
                                          {categories.find(c => c.id === prod.category_id || c.slug === prod.category_id || c.id === (prod as any).category?.id)?.name || prod.category?.name || (typeof prod.category === "string" ? prod.category : "Uncategorized")}
                                        </span>
                                      )}
                                      <span>•</span>
                                      <span className="font-mono">
                                        SKU: {prod.technical_specs?.["Part Number"] || prod.technical_specs?.SKU || prod.id}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2 pt-0.5">
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          toggleProdVisibility(prod);
                                        }}
                                        className={`text-[10px] font-heading font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border cursor-pointer transition-colors ${
                                          prod.is_hidden 
                                            ? "text-neutral-600 bg-neutral-100 border-neutral-300 hover:bg-neutral-200" 
                                            : "text-emerald-800 bg-emerald-50 border-emerald-300 hover:bg-emerald-100"
                                        }`}
                                        title={prod.is_hidden ? "Klicken um Product auf Active zu schalten" : "Klicken um Product auf Inactive (Ausgeblendet) zu schalten"}
                                      >
                                        {prod.is_hidden ? "Ausgeblendet" : "Active"}
                                      </button>
                                      {prod.is_featured && (
                                        <span className="text-[10px] font-heading font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border text-amber-800 bg-amber-50 border-amber-300">
                                          Hervorgehoben
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* Middle: Thinner Price Font */}
                                <div className="shrink-0 sm:text-right" onClick={(e) => e.stopPropagation()}>
                                  <div className="font-sans font-medium text-base sm:text-lg text-black tabular-nums tracking-tight">
                                    {prod.price !== null && prod.price !== undefined ? `₹${Number(prod.price).toFixed(2)}` : "Auf Anfrage"}
                                  </div>
                                  <span className="text-[11px] text-neutral-500 font-normal">EUR</span>
                                </div>

                                {/* Right: Actions */}
                                <div onClick={(e) => e.stopPropagation()} className="flex items-center justify-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-200">
                                  <a
                                    href={`/${(prod.slug || prod.id).trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/(^-|-$)/g, "")}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 rounded-xl border border-neutral-300 hover:border-black text-black transition-colors"
                                    title="View product live in store"
                                  >
                                    <ExternalLink className="w-4 h-4" />
                                  </a>
                                  <button 
                                    type="button"
                                    onClick={() => { setEditingProd(prod); setShowProdForm(true); }} 
                                    className="px-4 py-2 bg-black hover:bg-neutral-800 text-white rounded-xl text-xs font-heading font-bold uppercase tracking-wider transition-colors cursor-pointer"
                                    title="Edit Product"
                                  >
                                    Edit
                                  </button>
                                  <button 
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setProductToDelete(prod);
                                    }} 
                                    className="p-2 rounded-xl text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer" 
                                    title="Permanently Delete Product"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Clean Pagination Bar */}
                          {totalPages > 1 && (
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border-2 border-neutral-200 shadow-2xs">
                              <span className="text-xs text-black font-semibold">
                                Page {currentPageSafe} of {totalPages} ({filteredProducts.length} styles total)
                              </span>
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => setProdCurrentPage(prev => Math.max(1, prev - 1))}
                                  disabled={currentPageSafe === 1}
                                  className="px-3 py-1.5 text-xs font-heading font-bold rounded-xl border-2 border-neutral-200 bg-white text-black hover:border-black disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                                >
                                  Vorherige
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setProdCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                  disabled={currentPageSafe === totalPages}
                                  className="px-3 py-1.5 text-xs font-heading font-bold rounded-xl border-2 border-neutral-200 bg-white text-black hover:border-black disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                                >
                                  Nächste
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Floating Bulk Action Bar */}
                          {selectedProdIds.length > 0 && (
                            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-neutral-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-4 flex-wrap border border-neutral-700 animate-slide-up max-w-[95vw]">
                              <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                                <span className="text-xs font-heading font-black uppercase tracking-wider">
                                  {selectedProdIds.length} {selectedProdIds.length === 1 ? "Product" : "Products"} ausgewählt
                                </span>
                              </div>

                              <div className="flex items-center gap-2 flex-wrap">
                                <select
                                  value={bulkTargetCat}
                                  onChange={(e) => setBulkTargetCat(e.target.value)}
                                  className="bg-neutral-800 border border-neutral-600 text-white rounded-xl px-3 py-1.5 text-xs font-semibold outline-none cursor-pointer focus:border-white"
                                >
                                  <option value="">Select Target Category...</option>
                                  <option value="unassigned">⚠️ Unassign (Remove Category)</option>
                                  {displayCategories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                  ))}
                                </select>

                                <button
                                  type="button"
                                  onClick={handleBulkMove}
                                  disabled={!bulkTargetCat || isBulkMoving}
                                  className="px-4 py-1.5 bg-white text-black hover:bg-neutral-200 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl text-xs font-heading font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                                >
                                  {isBulkMoving ? (
                                    <>
                                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                      <span>Wird verschoben...</span>
                                    </>
                                  ) : (
                                    <>
                                      <FolderInput className="w-3.5 h-3.5" />
                                      <span>In Category verschieben</span>
                                    </>
                                  )}
                                </button>

                                <button
                                  type="button"
                                  onClick={() => setSelectedProdIds([])}
                                  className="px-3 py-1.5 text-neutral-400 hover:text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}

                  {/* ── Product Form Modal ── */}
                  {showProdForm && (
                    <ProductFormModal 
                      key={editingProd?.id || editingProd?.slug || "new-product"}
                      product={editingProd} 
                      categories={categories} 
                      existingProducts={products}
                      onSave={saveProd} 
                      onClose={() => { setShowProdForm(false); setEditingProd(null); }} 
                      onOpenSelectExisting={() => {
                        setShowProdForm(false);
                        handleOpenSelectExistingForUsed();
                      }}
                    />
                  )}

                  {/* ── Used Parts & Category Choice Modal ── */}
                  {showUsedPartsChoiceModal && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in">
                      <div className="bg-white border-2 border-neutral-200 rounded-3xl max-w-lg w-full p-6 sm:p-7 space-y-6 shadow-2xl relative">
                        <button
                          type="button"
                          onClick={() => { setShowUsedPartsChoiceModal(false); setTargetCategoryForAdd(null); }}
                          className="absolute top-5 right-5 p-2 rounded-xl text-neutral-400 hover:text-black hover:bg-neutral-100 transition-colors cursor-pointer"
                          aria-label="Close"
                        >
                          <X className="w-5 h-5 stroke-[2]" />
                        </button>

                        <div>
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-100 text-[10px] font-heading font-black tracking-wider uppercase text-neutral-700 mb-2">
                            <span>{targetCategoryForAdd ? targetCategoryForAdd.name : "Gebrauchtteile"}</span>
                          </div>
                          <h2 className="text-xl sm:text-2xl font-heading font-black text-black tracking-tight">
                            {targetCategoryForAdd ? `Add Product to "${targetCategoryForAdd.name}"` : "Add Custom Style"}
                          </h2>
                          <p className="text-xs text-neutral-500 font-medium mt-1">
                            {targetCategoryForAdd
                              ? `How would you like to add a style to "${targetCategoryForAdd.name}"?`
                              : "How would you like to configure this product?"}
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* Option 1: Brand new from scratch */}
                          <button
                            type="button"
                            onClick={() => {
                              if (targetCategoryForAdd) {
                                setShowUsedPartsChoiceModal(false);
                                setEditingProd({
                                  category_id: targetCategoryForAdd.id,
                                  category: { name: targetCategoryForAdd.name, slug: targetCategoryForAdd.slug || targetCategoryForAdd.id },
                                  is_hidden: false,
                                  is_featured: false,
                                } as any);
                                setShowProdForm(true);
                              } else {
                                handleAddNewFromScratchForUsed();
                              }
                            }}
                            className="group flex flex-col justify-between text-left p-5 rounded-2xl border-2 border-neutral-200 hover:border-black bg-white hover:bg-neutral-50/70 transition-all cursor-pointer shadow-2xs"
                          >
                            <div>
                              <div className="w-12 h-12 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-black mb-4 group-hover:bg-black group-hover:text-white transition-colors">
                                <Plus className="w-5 h-5 stroke-[2.5]" />
                              </div>
                              <h3 className="font-heading font-black text-sm text-black">
                                Create from Scratch
                              </h3>
                              <p className="text-xs text-neutral-500 font-medium leading-relaxed mt-1.5">
                                {targetCategoryForAdd
                                  ? `Beginnen Sie mit einem leeren Formular für ein neues Product direkt in "${targetCategoryForAdd.name}".`
                                  : "Beginnen Sie mit einem leeren Formular für ein neues Teil, eigene Fotos, Spezifikationen und Gebrauchtpreis."}
                              </p>
                            </div>
                            <div className="mt-5 pt-3 border-t border-neutral-100 flex items-center gap-1 text-xs font-heading font-bold uppercase tracking-wider text-black group-hover:translate-x-1 transition-transform">
                              <span>Create New</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </div>
                          </button>

                          {/* Option 2: From current store listings / unassigned */}
                          <button
                            type="button"
                            onClick={() => {
                              setShowUsedPartsChoiceModal(false);
                              setShowSelectExistingModal(true);
                              setExistingProdSearch("");
                              setExistingProdCatFilter("all");
                              if (!targetCategoryForAdd && catalogForUsedModal.length === 0) {
                                handleOpenSelectExistingForUsed();
                              }
                            }}
                            className="group flex flex-col justify-between text-left p-5 rounded-2xl border-2 border-neutral-200 hover:border-black bg-white hover:bg-neutral-50/70 transition-all cursor-pointer shadow-2xs"
                          >
                            <div>
                              <div className="w-12 h-12 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-black mb-4 group-hover:bg-black group-hover:text-white transition-colors">
                                <Layers className="w-5 h-5 stroke-[2.5]" />
                              </div>
                              <h3 className="font-heading font-black text-sm text-black">
                                {targetCategoryForAdd ? "Assign unassigned product" : "Select from existing catalog"}
                              </h3>
                              <p className="text-xs text-neutral-500 font-medium leading-relaxed mt-1.5">
                                {targetCategoryForAdd
                                  ? `Select from ${unassignedProducts.length} unassigned styles and associate directly.`
                                  : "Select an existing style from your catalog. Photos, specifications, and pricing will be pre-filled."}
                              </p>
                            </div>
                            <div className="mt-5 pt-3 border-t border-neutral-100 flex items-center gap-1 text-xs font-heading font-bold uppercase tracking-wider text-black group-hover:translate-x-1 transition-transform">
                              <span>{targetCategoryForAdd ? "Assign Style" : "Select Style"}</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </div>
                          </button>
                        </div>

                        <div className="flex justify-end pt-1">
                          <button
                            type="button"
                            onClick={() => { setShowUsedPartsChoiceModal(false); setTargetCategoryForAdd(null); }}
                            className="px-4 py-2 rounded-xl text-xs font-heading font-bold text-neutral-500 hover:text-black hover:bg-neutral-100 transition-colors cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── Used Parts & Category Product Assign Modal ── */}
                  {showSelectExistingModal && (() => {
                    const availableCatalog = targetCategoryForAdd
                      ? unassignedProducts.filter(p => {
                          if (existingProdSearch.trim()) {
                            const q = existingProdSearch.toLowerCase().trim();
                            const matchName = p.name?.toLowerCase().includes(q);
                            const matchSlug = p.slug?.toLowerCase().includes(q);
                            const matchSku = (p as any).partNumber?.toLowerCase().includes(q) || (p as any).technical_specs?.["Part Number"]?.toLowerCase().includes(q);
                            if (!matchName && !matchSku && !matchSlug) return false;
                          }
                          return true;
                        })
                      : catalogForUsedModal.filter(p => {
                          const isAlreadyUsed = 
                            p.category_id === "used-parts" || 
                            (p as any).category === "Used Parts" || 
                            (p as any).category?.slug === "used-parts" || 
                            p.name.toLowerCase().includes("(used)") ||
                            p.name.toLowerCase().includes("(gebraucht)");
                          if (isAlreadyUsed) return false;

                          if (existingProdCatFilter !== "all") {
                            const matchCat = p.category_id === existingProdCatFilter || 
                                             (p as any).category?.slug === existingProdCatFilter ||
                                             (p as any).category === existingProdCatFilter;
                            if (!matchCat) return false;
                          }

                          if (existingProdSearch.trim()) {
                            const q = existingProdSearch.toLowerCase().trim();
                            const matchName = p.name.toLowerCase().includes(q);
                            const matchSlug = p.slug.toLowerCase().includes(q);
                            const matchSku = (p as any).partNumber?.toLowerCase().includes(q);
                            if (!matchName && !matchSku && !matchSlug) return false;
                          }

                          return true;
                        });

                    const filterCategories = categories.filter(c => c.slug !== "used-parts" && c.id !== "used-parts");

                    return (
                      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 animate-fade-in">
                        <div className="bg-white border-2 border-neutral-200 rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
                          {/* Modal Top Header */}
                          <div className="p-5 sm:p-6 border-b border-neutral-100 flex items-center justify-between gap-4 shrink-0">
                            <div>
                              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-neutral-100 text-[10px] font-heading font-black tracking-wider uppercase text-neutral-700 mb-1">
                                <span>{targetCategoryForAdd ? targetCategoryForAdd.name : "Catalog Import"}</span>
                              </div>
                              <h2 className="text-lg sm:text-xl font-heading font-black text-black tracking-tight">
                                {targetCategoryForAdd ? `Assign Style to "${targetCategoryForAdd.name}"` : "Select Style"}
                              </h2>
                              <p className="text-xs text-neutral-500 font-medium">
                                {targetCategoryForAdd
                                  ? `Select an unassigned product to associate directly with "${targetCategoryForAdd.name}".`
                                  : "Select a product from your catalog to duplicate specifications and images."}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => { setShowSelectExistingModal(false); setTargetCategoryForAdd(null); }}
                              className="p-2 rounded-xl text-neutral-400 hover:text-black hover:bg-neutral-100 transition-colors cursor-pointer shrink-0"
                              aria-label="Close"
                            >
                              <X className="w-5 h-5 stroke-[2]" />
                            </button>
                          </div>

                          {/* Search & Filter Toolbar */}
                          <div className="p-4 sm:p-5 border-b border-neutral-100 bg-neutral-50/50 flex flex-col sm:flex-row items-center gap-3 shrink-0">
                            <div className="relative flex-1 w-full">
                              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                              <input
                                type="text"
                                placeholder={targetCategoryForAdd ? "Search unassigned products..." : "Search catalog by title, SKU, or style..."}
                                value={existingProdSearch}
                                onChange={e => setExistingProdSearch(e.target.value)}
                                className="w-full bg-white border-2 border-neutral-200 focus:border-black rounded-xl pl-9 pr-3 py-2 text-xs text-black placeholder:text-neutral-400 font-medium outline-none transition-colors"
                                autoFocus
                              />
                            </div>

                            {!targetCategoryForAdd && (
                              <div className="w-full sm:w-auto shrink-0 flex items-center gap-2">
                                <select
                                  value={existingProdCatFilter}
                                  onChange={e => setExistingProdCatFilter(e.target.value)}
                                  className="w-full sm:w-48 bg-white border-2 border-neutral-200 focus:border-black rounded-xl px-3 py-2 text-xs text-black font-medium outline-none transition-colors cursor-pointer"
                                >
                                  <option value="all">Alle Categories ({catalogForUsedModal.length})</option>
                                  {filterCategories.map(cat => (
                                    <option key={cat.id} value={cat.slug || cat.id}>
                                      {cat.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            )}
                          </div>

                          {/* Scrollable Products List */}
                          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-2.5 min-h-[300px]">
                            {loadingCatalogForUsed ? (
                              <div className="py-20 flex flex-col items-center justify-center gap-3 text-neutral-500">
                                <Loader2 className="w-7 h-7 animate-spin text-black" />
                                <p className="text-xs font-heading font-bold uppercase tracking-wider">Loading boutique catalog...</p>
                              </div>
                            ) : availableCatalog.length === 0 ? (
                              <div className="py-16 text-center text-neutral-500 font-medium text-xs bg-neutral-50 rounded-2xl border-2 border-dashed border-neutral-200 p-8 space-y-2">
                                <p className="text-sm font-heading font-bold text-black">No products found</p>
                                <p>{targetCategoryForAdd ? "There are currently no unassigned styles." : "Refine your search query or category filter above."}</p>
                              </div>
                            ) : (
                              availableCatalog.map(p => {
                                const origPrice = typeof p.price === "number" ? p.price : parseFloat(String(p.price || "0")) || 0;
                                const suggestedUsed = origPrice > 0 ? (Math.round(origPrice * 0.75 * 100) / 100).toFixed(2) : "0.00";
                                const imgSrc = p.featured_image || (p as any)?.mainImage;
                                const catName = targetCategoryForAdd ? "Uncategorized" : (categories.find(c => c.id === p.category_id || c.slug === p.category_id)?.name || (p as any)?.category?.name || (p as any)?.category || "Product");

                                return (
                                  <div
                                    key={p.id || p.slug}
                                    className="bg-white border-2 border-neutral-200 hover:border-black rounded-2xl p-3 sm:p-4 transition-all flex items-center justify-between gap-3 sm:gap-4 shadow-2xs group"
                                  >
                                    {/* Left: Thumbnail & Details */}
                                    <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl border border-neutral-200 bg-neutral-50 p-1 shrink-0 overflow-hidden flex items-center justify-center">
                                        {imgSrc ? (
                                          <img
                                            src={imgSrc}
                                            alt={p.name}
                                            className="w-full h-full object-contain"
                                            loading="lazy"
                                          />
                                        ) : (
                                          <Box className="w-6 h-6 text-neutral-300 stroke-[1.5]" />
                                        )}
                                      </div>

                                      <div className="min-w-0 flex-1 space-y-1">
                                        <div className="flex items-center gap-2 flex-wrap">
                                          <span className="px-2 py-0.5 rounded-md bg-neutral-100 text-[10px] font-heading font-bold text-neutral-600 uppercase tracking-wider">
                                            {catName}
                                          </span>
                                          {(p as any)?.partNumber && (
                                            <span className="text-[10px] text-neutral-400 font-mono">
                                              SKU: {(p as any).partNumber}
                                            </span>
                                          )}
                                        </div>
                                        <h4 className="font-heading font-black text-xs sm:text-sm text-black truncate">
                                          {p.name}
                                        </h4>
                                        <div className="flex items-center gap-3 text-xs flex-wrap">
                                          <span className="text-neutral-500 font-medium">
                                            Price: <strong className="text-black font-bold">₹{origPrice.toFixed(2)}</strong>
                                          </span>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Right: Action button */}
                                    {targetCategoryForAdd ? (
                                      <button
                                        type="button"
                                        onClick={async () => {
                                          try {
                                            await saveProd({ id: p.id, category_id: targetCategoryForAdd.id || targetCategoryForAdd.slug });
                                            notifyAdmin("success", "Category Assigned", `"${p.name}" assigned to "${targetCategoryForAdd.name}" successfully.`);
                                          } catch (err: any) {
                                            notifyAdmin("error", "Error bei Zuweisung", err.message || "Error beim Zuweisen der Category");
                                          }
                                        }}
                                        className="px-3.5 py-2 bg-black hover:bg-neutral-800 text-white text-xs font-heading font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer shrink-0 flex items-center gap-1.5 shadow-xs hover:scale-102"
                                      >
                                        <Plus className="w-3.5 h-3.5" />
                                        <span>Zu {targetCategoryForAdd.name} zuweisen</span>
                                      </button>
                                    ) : (
                                      <button
                                        type="button"
                                        onClick={() => handleSelectProductForUsed(p)}
                                        className="px-3.5 py-2 bg-black hover:bg-neutral-800 text-white text-xs font-heading font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer shrink-0 flex items-center gap-1.5 shadow-xs hover:scale-102"
                                      >
                                        <span>Save as Archival Style</span>
                                        <ArrowRight className="w-3.5 h-3.5" />
                                      </button>
                                    )}
                                  </div>
                                );
                              })
                            )}
                          </div>

                          {/* Modal Bottom Footer */}
                          <div className="p-4 border-t border-neutral-100 bg-white flex items-center justify-between shrink-0 flex-wrap gap-2">
                            <span className="text-xs text-neutral-500 font-medium">
                              {availableCatalog.length} {availableCatalog.length === 1 ? "Product" : "Products"} verfügbar
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setShowSelectExistingModal(false);
                                  setShowUsedPartsChoiceModal(true);
                                }}
                                className="px-3.5 py-1.5 rounded-xl border border-neutral-200 text-xs font-heading font-bold text-neutral-600 hover:text-black hover:border-black transition-colors cursor-pointer"
                              >
                                ← Back zur Auswahl
                              </button>
                              <button
                                type="button"
                                onClick={() => { setShowSelectExistingModal(false); setTargetCategoryForAdd(null); }}
                                className="px-3.5 py-1.5 rounded-xl bg-neutral-100 text-xs font-heading font-bold text-neutral-700 hover:text-black hover:bg-neutral-200 transition-colors cursor-pointer"
                              >
                                Close
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* ── Delete Confirmation Popup Modal ── */}
                  {productToDelete && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in">
                      <div className="bg-white border-2 border-neutral-200 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-red-50 border-2 border-red-200 flex items-center justify-center text-red-600 shrink-0">
                            <Trash2 className="w-6 h-6 stroke-[2]" />
                          </div>
                          <div className="space-y-1.5 min-w-0 flex-1">
                            <h3 className="font-heading font-black text-lg text-black">
                              Permanently Delete Product
                            </h3>
                            <p className="text-sm text-neutral-800 font-semibold leading-relaxed">
                              Are you sure you want to permanently delete this product?
                            </p>
                            <div className="p-3 bg-neutral-100 rounded-xl border border-neutral-200 text-xs font-mono text-black font-bold break-all">
                              {productToDelete.name}
                              {(productToDelete.part_number || productToDelete.partNumber) && (
                                <span className="block text-[11px] text-neutral-500 font-sans font-normal mt-0.5">
                                  SKU: {productToDelete.part_number || productToDelete.partNumber}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-red-600 font-medium leading-normal">
                              The product will be permanently purged from the website, admin console, and database. This action cannot be undone.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100">
                          <button
                            type="button"
                            disabled={isDeletingProd}
                            onClick={() => setProductToDelete(null)}
                            className="px-5 py-2.5 rounded-xl border-2 border-neutral-300 hover:border-black text-black text-xs font-heading font-bold uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            disabled={isDeletingProd}
                            onClick={async () => {
                              setIsDeletingProd(true);
                              const target = productToDelete;
                              try {
                                // 1. Scrub browser localStorage immediately
                                try {
                                  const stored = JSON.parse(localStorage.getItem("ixos_products_overrides") || "{}");
                                  const targetId = (target.id || "").toLowerCase().trim();
                                  const targetSlug = (target.slug || "").toLowerCase().trim();
                                  const targetPart = ((target as any).part_number || (target as any).partNumber || "").toLowerCase().trim();

                                  Object.keys(stored).forEach((k) => {
                                    const kLower = k.toLowerCase().trim();
                                    const ov = stored[k];
                                    const ovId = (ov?.id || "").toLowerCase().trim();
                                    const ovSlug = (ov?.slug || "").toLowerCase().trim();
                                    const ovPart = (ov?.partNumber || "").toLowerCase().trim();

                                    if (
                                      kLower === targetId ||
                                      kLower === targetSlug ||
                                      kLower === targetPart ||
                                      ovId === targetId ||
                                      ovSlug === targetSlug ||
                                      (targetPart && ovPart === targetPart)
                                    ) {
                                      delete stored[k];
                                    }
                                  });

                                  if (isBaseCatalogProduct(target)) {
                                    stored[target.id] = { id: target.id, slug: target.slug, deleted: true, is_hidden: true };
                                    if (target.slug) stored[target.slug] = { id: target.id, slug: target.slug, deleted: true, is_hidden: true };
                                  }
                                  safeSetLocalStorage("ixos_products_overrides", JSON.stringify(stored));
                                  broadcastProductsUpdate();
                                } catch (_) {}

                                // 2. Optimistic UI update
                                setProducts((prev) => prev.filter((p) => p.id !== target.id && p.slug !== target.slug));

                                // 3. Call DELETE API
                                const res = await adminFetch(`/api/products/${encodeURIComponent(target.slug || target.id)}`, { method: "DELETE" });
                                if (!res.ok) {
                                  const errData = await res.json().catch(() => ({}));
                                  throw new Error(errData?.error || "Product could not be deleted");
                                }

                                notifyAdmin("success", "Product Deleted", `"${target.name}" permanently deleted.`);
                                setProductToDelete(null);
                                setDetailProduct(null);
                                await Promise.all([fetchProducts(), fetchCategories()]);
                              } catch (err: any) {
                                console.error("Error deleting product", err);
                                notifyAdmin("error", "Error deleting product", err.message || "Product could not be deleted", err);
                                await fetchProducts();
                              } finally {
                                setIsDeletingProd(false);
                              }
                            }}
                            className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-heading font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-50 shadow-xs"
                          >
                            {isDeletingProd ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Deleting...</span>
                              </>
                            ) : (
                              <>
                                <Trash2 className="w-4 h-4 stroke-[2]" />
                                <span>Permanently Delete</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()
          )}

          {/* ─── PRODUCT DETAIL EDITOR ────────────────────────────────── */}
          {activeTab === "products" && detailProduct && (
            <ProductDetailEditor
              product={detailProduct}
              variants={detailVariants}
              images={detailImages}
              downloads={detailDownloads}
              faqs={detailFaqs}
              categories={categories}
              onBack={() => setDetailProduct(null)}
              onDeleteProduct={(prod) => setProductToDelete(prod)}
              onSaveProduct={async (data) => { await saveProd(data); if (detailProduct) loadProductDetail(detailProduct.slug); }}
              onEditProduct={(prod) => {
                setEditingProd(prod);
                setShowProdForm(true);
              }}
              onUploadMedia={handleMediaUpload}
              isUploading={isUploading}
              onSaveVariant={saveVariant}
              onDeleteVariant={deleteVariant}
              onAddPartNumber={addPartNumber}
              onDeletePartNumber={deletePartNumber}
              onAddImage={addImage}
              onDeleteImage={deleteImage}
              onAddDownload={addDownload}
              onDeleteDownload={deleteDownload}
              onAddFaq={addFaq}
              onDeleteFaq={deleteFaq}
            />
          )}

          {/* ─── ORDERS TAB ─────────────────────────────────────────── */}
          {(activeTab === "orders" || activeTab === "sample-orders") && (isInitialLoading && sampleOrders.length === 0 ? (
            <AdminOrdersSkeleton />
          ) : (
            <div className="flex flex-1 flex-col gap-4 sm:gap-6 font-sans text-foreground animate-fade-in">

              {/* Title and Top Actions */}
              <div className="flex flex-wrap items-end justify-between gap-3 mb-2">
                <div>
                  <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
                    Orders
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExportOrdersCSV}
                    className="cursor-pointer text-xs h-9"
                  >
                    <Download className="size-3.5 mr-1.5" />
                    Export CSV
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => { fetchOrders(); fetchPayments(); }}
                    className="cursor-pointer text-xs h-9"
                    title="Sync orders from database"
                  >
                    <RefreshCw className="size-3.5 mr-1.5" />
                    Sync Orders
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setShowAddSampleOrderModal(true)}
                    className="cursor-pointer text-xs h-9"
                  >
                    <Plus className="size-3.5 mr-1.5" />
                    Order erstellen
                  </Button>
                </div>
              </div>

              {/* Filter Input */}
              <div className="flex items-center justify-between gap-2">
                <div className="relative w-[240px] sm:w-[320px]">
                  <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Orders nach ID, Customer oder Product filtern..."
                    value={orderSearchQuery}
                    onChange={(e) => setOrderSearchQuery(e.target.value)}
                    className="h-8.5 pl-8 text-xs"
                  />
                </div>
                <div className="text-xs text-muted-foreground font-medium">
                  {filteredOrders.length} {filteredOrders.length === 1 ? "Order" : "Orders"}
                </div>
              </div>

              {/* Pipeline Status Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                {[
                  {
                    id: "ALL",
                    label: "Alle Orders",
                    count: sampleOrders.length,
                  },
                  {
                    id: "NEW",
                    label: "Neue Orders",
                    count: sampleOrders.filter(o => {
                      const s = (o?.status || "").toLowerCase().trim();
                      return (
                        (s === "new" || s === "pending payment" || s === "pending" || s === "payment confirmed" || s === "paid via paypal" || s === "paid" || !s) &&
                        s !== "courier assigned" && s !== "courier_assigned" && s !== "accepted" && s !== "processing"
                      );
                    }).length,
                  },
                  {
                    id: "COURIER_ASSIGNED",
                    label: "Courier Assigned",
                    count: sampleOrders.filter(o => {
                      const s = (o?.status || "").toLowerCase().trim();
                      return s === "courier assigned" || s === "courier_assigned" || s === "accepted" || s === "processing";
                    }).length,
                  },
                  {
                    id: "IN_TRANSIT",
                    label: "Auf dem Shippingweg",
                    count: sampleOrders.filter(o => {
                      const s = (o?.status || "").toLowerCase().trim();
                      return s === "in transit" || s === "in-transit" || s.includes("transit");
                    }).length,
                  },
                  {
                    id: "SHIPPED",
                    label: "Delivered / Dispatched",
                    count: sampleOrders.filter(o => {
                      const s = (o?.status || "").toLowerCase().trim();
                      return s === "shipped" || s === "dispatched" || s === "delivered" || s === "completed";
                    }).length,
                  },
                  {
                    id: "CANCELLED",
                    label: "Cancelled",
                    count: sampleOrders.filter(o => {
                      const s = (o?.status || "").toLowerCase().trim();
                      return s === "cancelled" || s === "canceled" || s === "refunded" || s === "rejected";
                    }).length,
                  },
                ].map((tab) => {
                  const isSelected = orderStatusFilter === tab.id;
                  return (
                    <Button
                      key={tab.id}
                      type="button"
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setOrderStatusFilter(tab.id as any);
                        setSelectedOrderRowIds([]);
                      }}
                      className="h-8 gap-1.5 text-xs font-semibold cursor-pointer shrink-0"
                    >
                      <span>{tab.label}</span>
                      <span
                        className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                          isSelected ? "bg-primary-foreground/20 text-primary-foreground font-extrabold" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {tab.count}
                      </span>
                    </Button>
                  );
                })}
              </div>

              {/* Orders Table Container */}
              <div className="rounded-xl border border-border/80 shadow-xs bg-card overflow-hidden">
                {/* Batch Action Bar */}
                {selectedOrderRowIds.length > 0 && (
                  <div className="px-6 py-2.5 flex items-center justify-between animate-fade-in border-b border-border/80 bg-muted/30">
                    <span className="text-xs text-muted-foreground font-medium">
                      {selectedOrderRowIds.length} {selectedOrderRowIds.length === 1 ? "Order ausgewählt" : "Orders ausgewählt"}
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedOrderRowIds([])}
                        className="text-xs h-7 cursor-pointer"
                      >
                        Auswahl aufheben
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        onClick={handleBatchAdvanceOrders}
                        className="gap-1.5 text-xs font-semibold cursor-pointer h-7"
                      >
                        <span>
                          {ORDER_TABS_PIPELINE.find(p => p.id === orderStatusFilter)?.nextActionLabel || "In nächste Stufe versetzen"}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Table Component */}
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="w-[40px] pl-4 pr-1 text-center">
                        <input
                          type="checkbox"
                          checked={filteredOrders.length > 0 && selectedOrderRowIds.length === filteredOrders.length}
                          ref={el => {
                            if (el) el.indeterminate = selectedOrderRowIds.length > 0 && selectedOrderRowIds.length < filteredOrders.length;
                          }}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedOrderRowIds(filteredOrders.map(o => String(o.orderId || o.id || o.order_number)));
                            } else {
                              setSelectedOrderRowIds([]);
                            }
                          }}
                          className="w-4 h-4 rounded border-input text-primary focus:ring-ring cursor-pointer accent-primary"
                          title="Select all visible orders"
                        />
                      </TableHead>
                      <TableHead className="text-xs font-semibold w-32 whitespace-nowrap">Bestell-Nr.</TableHead>
                      <TableHead className="text-xs font-semibold">Ordered Products</TableHead>
                      <TableHead className="text-xs font-semibold w-28 whitespace-nowrap">Date</TableHead>
                      <TableHead className="text-xs font-semibold w-24 text-right whitespace-nowrap">Total</TableHead>
                      <TableHead className="w-[60px] text-center whitespace-nowrap">Aktion</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-32 text-center text-xs text-muted-foreground">
                          {orderSearchQuery ? (
                            `No orders found for "${orderSearchQuery}".`
                          ) : (
                            <div className="flex flex-col items-center justify-center gap-2">
                              <Package className="size-8 text-muted-foreground/50" />
                              <p className="font-medium text-foreground">No orders recorded yet</p>
                              <p className="text-[11px] text-muted-foreground">
                                Verified boutique orders and manually generated invoices will appear here automatically.
                              </p>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredOrders.map((order) => {
                        const orderId = formatOrderSerialNumber(order);
                        const isSelected = selectedOrderRowIds.includes(orderId);
                        const productInfo = getOrderProductInfo(order);

                        const dateStr = order.createdAt || order.created_at || order.date;
                        const adminTz = getAdminTimeZone();
                        const orderDateTime = formatAdminOrderDateTime(dateStr, adminTz);

                        return (
                          <TableRow
                            key={orderId || Math.random()}
                            onClick={() => setSelectedOrderForDetail(order)}
                            className={`cursor-pointer transition-colors ${
                              isSelected ? "bg-muted font-medium" : "hover:bg-muted/50"
                            }`}
                          >
                            {/* Checkbox */}
                            <TableCell className="w-[40px] pl-4 pr-1 text-center" onClick={(e) => e.stopPropagation()}>
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  setSelectedOrderRowIds(prev =>
                                    prev.includes(orderId) ? prev.filter(x => x !== orderId) : [...prev, orderId]
                                  );
                                }}
                                className="w-4 h-4 rounded border-input text-primary focus:ring-ring cursor-pointer accent-primary"
                              />
                            </TableCell>

                            {/* Order # */}
                            <TableCell className="w-32 whitespace-nowrap">
                              <span className="font-mono font-bold text-xs text-foreground group-hover:text-primary transition-colors tracking-tight">
                                {orderId}
                              </span>
                            </TableCell>

                            {/* Ordered Items */}
                            <TableCell>
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className="w-8 h-8 rounded-lg bg-muted border border-border overflow-hidden shrink-0 flex items-center justify-center relative shadow-2xs">
                                  {productInfo.image ? (
                                    <img
                                      src={productInfo.image}
                                      alt={productInfo.primaryName}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        (e.currentTarget as HTMLElement).style.display = 'none';
                                      }}
                                    />
                                  ) : (
                                    <Package className="w-4 h-4 text-muted-foreground" />
                                  )}
                                </div>
                                <div className="min-w-0 flex-1 flex items-center gap-2 flex-wrap">
                                  <span className="font-semibold text-xs text-foreground group-hover:text-primary transition-colors truncate max-w-[260px] sm:max-w-[340px]">
                                    {productInfo.primaryName}
                                  </span>
                                  <span className="text-[11px] text-muted-foreground font-semibold shrink-0">
                                    ×{productInfo.primaryQty}
                                  </span>
                                  {productInfo.primaryVariant && productInfo.primaryVariant !== "Standard Spec" && (
                                    <span className="text-[10px] text-muted-foreground bg-muted border border-border px-1.5 py-0.5 rounded shrink-0 truncate max-w-[140px]">
                                      {productInfo.primaryVariant}
                                    </span>
                                  )}
                                  {productInfo.items.length > 1 && (
                                    <span className="text-[10px] font-bold text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full shrink-0">
                                      +{productInfo.items.length - 1} weitere
                                    </span>
                                  )}
                                </div>
                              </div>
                            </TableCell>

                            {/* Date & Placed Time */}
                            <TableCell className="w-32 text-muted-foreground font-medium whitespace-nowrap text-xs">
                              <div className="flex flex-col">
                                <span className="font-semibold text-foreground">{orderDateTime.date}</span>
                                {orderDateTime.time && (
                                  <span className="text-[11px] text-muted-foreground flex items-center gap-1 font-mono">
                                    <Clock className="w-3 h-3 inline shrink-0" />
                                    {orderDateTime.time}
                                  </span>
                                )}
                              </div>
                            </TableCell>

                            {/* Total */}
                            <TableCell className="w-24 text-right text-xs font-semibold text-[#007934] dark:text-[#22c55e] tabular-nums whitespace-nowrap">
                              {order.currency === "USD" ? "$" : "₹"}
                              {Number(order.total || 0).toLocaleString("de-DE", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </TableCell>

                            {/* Action */}
                            <TableCell className="w-[60px] text-center" onClick={(e) => e.stopPropagation()}>
                              <button
                                type="button"
                                onClick={() => setSelectedOrderForDetail(order)}
                                className="w-7 h-7 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground text-muted-foreground inline-flex items-center justify-center transition-all cursor-pointer shadow-2xs mx-auto"
                                title="View Order Details &amp; Actions"
                              >
                                <Info className="w-3.5 h-3.5" />
                              </button>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          ))}
          {/* ─── SETTINGS TAB ─────────────────────────────────────────── */}
          {activeTab === "settings" && (
            <div className="space-y-4 font-sans text-foreground animate-fade-in">
              {/* ── TOP SECTION: shadcn-admin standard header & toolbar ── */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-foreground">
                    Settings
                  </h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    Store management, operator profile, and system configuration.
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted text-muted-foreground text-xs font-semibold shrink-0">
                  <span>Angelos Drampalis</span>
                  <span>•</span>
                  <span>Jaipur Master Atelier</span>
                </div>
              </div>

              {/* ── BOTTOM SECTION: Standard shadcn card container ── */}
              <div className="bg-card text-card-foreground rounded-xl shadow-xs border border-border p-6 space-y-6">
                {/* Owner & Administrator Credentials Card */}
                <div className="bg-muted/50 border border-border rounded-xl p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Inhaber &amp; Geschäftsführung</span>
                  <span className="text-xs font-bold text-foreground block">Angelos Drampalis</span>
                  <span className="text-[10.5px] text-muted-foreground">Leitung Meisterwerkstatt</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Telefon / Mobilnummer</span>
                  <span className="text-xs font-mono font-bold text-foreground block">01606705008</span>
                  <span className="text-[10.5px] text-muted-foreground">WhatsApp &amp; Direktsupport</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Offizielle Shop-E-Mail</span>
                  <span className="text-xs font-mono font-bold text-foreground block">ixos@drampalis.de</span>
                  <span className="text-[10.5px] text-muted-foreground">Direktanfragen &amp; Orders</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Werkstatt-Standort</span>
                  <span className="text-xs font-bold text-foreground block">Jaipur 302020</span>
                  <span className="text-[10.5px] text-muted-foreground">Welps Esch 5, Saerbox Nr-12</span>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  Kommunikationskanäle
                </h4>
                <FormField label="Zentrale WhatsApp- / Telefonnummer">
                  <input
                    type="text"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    className={inputClass}
                    placeholder="01606705008"
                  />
                </FormField>
                <button
                  type="button"
                  onClick={async () => {
                    localStorage.setItem("gsp_whatsapp_number", whatsappNumber);
                    try {
                      await fetch("/api/payment-settings", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ storePhone: whatsappNumber, adminPhone: whatsappNumber }),
                      });
                    } catch (e) {
                      console.warn("Could not save to backend settings", e);
                    }
                    notifyAdmin("success", "Settings Saved", "Administrator settings saved successfully and active.");
                  }}
                  className={btnPrimary}
                >
                  <Save className="w-3.5 h-3.5" /> SAVE SETTINGS
                </button>
              </div>
            </div>
            </div>
          )}

          {/* ─── PAYMENT SETTINGS TAB ──────────────────────────────────── */}
          {activeTab === "payment-settings" && (
            <div className="space-y-4 font-sans text-foreground animate-fade-in">
              {/* ── TOP SECTION: shadcn-admin standard header & toolbar ── */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-foreground">
                    Paymentseinstellungen
                  </h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    Configure payment gateways, wire transfers (NEFT/RTGS), and invoicing options.
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted text-muted-foreground text-xs font-semibold shrink-0">
                  <span>Currency: INR (₹)</span>
                  <span>•</span>
                  <span>Online-Checkout</span>
                </div>
              </div>

              {/* ── BOTTOM SECTION: Standard shadcn form container ── */}
              <form onSubmit={handleSavePaymentSettings} className="bg-card text-card-foreground rounded-xl shadow-xs border border-border p-6 space-y-6">
                <h3 className="font-display text-sm font-bold text-foreground uppercase tracking-wider border-b border-border pb-3">Paymentseinstellungen konfigurieren</h3>

              <div className="border-b border-border pb-6">
                {/* PayPal Config */}
                <div className="max-w-xl space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                        <CreditCard className="w-4 h-4 text-muted-foreground" /> PayPal Bezahlung
                      </h4>
                      <p className="text-[10px] text-muted-foreground">Sandbox &amp; Live REST-API</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={paymentSettings.enablePaypal} 
                        onChange={(e) => setPaymentSettings(p => ({ ...p, enablePaypal: e.target.checked }))} 
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-background after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-background after:border-border after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <FormField label="PayPal Client-ID">
                    <input 
                      type="text" 
                      value={paymentSettings.paypalClientId || ""} 
                      onChange={(e) => setPaymentSettings(p => ({ ...p, paypalClientId: e.target.value, enablePaypal: true }))}
                      className={inputClass} 
                      placeholder="z. B. A21AAJ... (Sandbox- oder Live-Client-ID)"
                    />
                  </FormField>

                  <FormField label="PayPal Client-Secret">
                    <input 
                      type="password" 
                      value={paymentSettings.paypalSecret || ""} 
                      onChange={(e) => setPaymentSettings(p => ({ ...p, paypalSecret: e.target.value, enablePaypal: true }))}
                      className={inputClass} 
                      placeholder={paymentSettings.paypalSecret ? "••••••••••••••••" : "PayPal Client-Secret eingeben"}
                    />
                  </FormField>
                </div>
              </div>

              <div className="max-w-xl grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                <FormField label="Gateway-Umgebung">
                  <AdminCustomSelect
                    value={paymentSettings.environment}
                    onChange={(val) => setPaymentSettings(p => ({ ...p, environment: val }))}
                    options={[
                      { value: "sandbox", label: "Sandbox (Testmodus)" },
                      { value: "live", label: "Live (Productivbetrieb)" }
                    ]}
                    variant="form"
                  />
                </FormField>

                <FormField label="Standardwährung">
                  <AdminCustomSelect
                    value={paymentSettings.defaultCurrency}
                    onChange={(val) => setPaymentSettings(p => ({ ...p, defaultCurrency: val }))}
                    options={[
                      { value: "EUR", label: "EUR (₹)" },
                      { value: "USD", label: "USD ($)" },
                      { value: "GBP", label: "GBP (£)" },
                      { value: "INR", label: "INR (₹)" }
                    ]}
                    variant="form"
                  />
                </FormField>
              </div>

              <button type="submit" disabled={savingSettings} className={btnPrimary}>
                {savingSettings ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> SAVING...
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" /> SAVE PAYMENT SETTINGS
                  </>
                )}
              </button>
            </form>
            </div>
          )}

          {/* ─── INVENTORY TAB ─────────────────────────────────────────────── */}
          {activeTab === "inventory" && (
            <div className="animate-fade-in">
              <InventoryTab onSelectTab={handleSelectTab} />
            </div>
          )}

          {/* ─── DISCOUNTS TAB ─────────────────────────────────────────────── */}
          {activeTab === "discounts" && (
            <div className="animate-fade-in">
              <DiscountsTab />
            </div>
          )}

          {/* ─── REVIEWS TAB ──────────────────────────────────────── */}
          {activeTab === "reviews" && (
            <div className="animate-fade-in">
              <ReviewsTab />
            </div>
          )}

          {/* ─── SHIPPING RATES TAB ───────────────────────────────── */}
          {activeTab === "shipping" && (
            <div className="animate-fade-in">
              <ShippingTab categories={categories} />
            </div>
          )}

          {/* ─── LEGAL & POLICIES TAB ─────────────────────────────── */}
          {activeTab === "legal-policies" && (
            <div className="animate-fade-in">
              <LegalPoliciesTab />
            </div>
          )}

          {/* PDF Generation Loader Toast */}
          {generatingPdfStatus && (
            <div className="fixed bottom-6 right-6 z-50 bg-[#0F0F10] text-white px-5 py-4 rounded-2xl border border-border flex items-center gap-3 animate-slide-in">
              <Loader2 className="w-5 h-5 text-accent animate-spin" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-700">PDF-Generator</p>
                <p className="text-xs font-semibold">{generatingPdfStatus}</p>
              </div>
            </div>
          )}

          {/* Dynamic Price List Selection & Negotiation Drawer */}
          {showPriceListModal && (
            <AdminDrawer
              isOpen={showPriceListModal}
              onClose={() => {
                setShowPriceListModal(false);
                setPriceListStep(1);
              }}
              title={priceListStep === 1 ? "Download PDF Catalog" : "Preview & Customize Wholesale Prices"}
              subtitle={priceListStep === 1
                ? "Select categories or specific styles for the B2B Wholesale Line Sheet."
                : "Vorschau der nach Categories gruppierten Products mit individueller Priceanpassung vor der PDF-Generierung."}
              badge={
                <span className="text-[10px] normal-case bg-neutral-100 text-black px-2 py-0.5 rounded-full font-medium">
                  Schritt {priceListStep} von 2
                </span>
              }
              maxWidthClass="max-w-6xl"
              backLabel="Back zu Productsn"
            >

                {/* ═══════════════════════════════════════════════════════════ */}
                {/* STEP 1: ITEM & CURRENCY SELECTION */}
                {/* ═══════════════════════════════════════════════════════════ */}
                {priceListStep === 1 && (
                  <div className="space-y-4 py-1">
                    {/* Currency Selection Buttons (Max 3, Default EUR) */}
                    <div className="bg-card border border-border rounded-xl p-3.5">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-[10px] font-bold text-foreground uppercase tracking-wider block">
                          Select line sheet currencies (Default: INR ₹):
                        </label>
                        <span className="text-[10px] font-bold text-accent">
                          {pdfSelectedCurrencies.length}/3 ausgewählt
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {(["EUR", "USD", "GBP", "AUD", "CAD", "INR", "BRL", "RUB", "AED", "PLN"] as const).map((curr) => {
                          const currencySymbols: Record<string, string> = { 
                            EUR: "₹", 
                            USD: "$", 
                            GBP: "£", 
                            AUD: "A$", 
                            CAD: "CA$", 
                            INR: "₹",
                            BRL: "R$",
                            RUB: "₽",
                            AED: "AED",
                            PLN: "zł"
                          };
                          const isChecked = pdfSelectedCurrencies.includes(curr);
                          const isDisabled = !isChecked && pdfSelectedCurrencies.length >= 3;
                          return (
                            <button
                              key={curr}
                              type="button"
                              disabled={isDisabled}
                              onClick={() => {
                                if (isChecked) {
                                  if (pdfSelectedCurrencies.length === 1) return; // Keep at least 1
                                  setPdfSelectedCurrencies(pdfSelectedCurrencies.filter(c => c !== curr));
                                } else {
                                  if (pdfSelectedCurrencies.length < 3) {
                                    setPdfSelectedCurrencies([...pdfSelectedCurrencies, curr]);
                                  }
                                }
                              }}
                              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                                isChecked
                                  ? "bg-primary text-primary-foreground border-primary"
                                  : isDisabled
                                  ? "bg-muted text-muted-foreground border-border cursor-not-allowed opacity-50"
                                  : "bg-card text-muted-foreground border-border hover:bg-muted hover:text-foreground"
                              }`}
                            >
                              <span>{curr} ({currencySymbols[curr]})</span>
                              {isChecked && <Check className="w-3.5 h-3.5" />}
                            </button>
                          );
                        })}
                      </div>
                      <p className="text-[9px] text-muted-foreground font-normal mt-2">
                        Die PDF-Spaltenüberschriften lauten z. B. <strong className="font-semibold text-foreground">EUR (₹) / STK.</strong> mit tagesaktuellen Umrechnungskursen.
                      </p>
                    </div>

                    {/* Mode Tabs: Full Categories vs. Select Specific Products */}
                    <div className="flex bg-muted p-1 rounded-xl border border-border">
                      <button
                        type="button"
                        onClick={() => setPriceListMode("categories")}
                        className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                          priceListMode === "categories"
                            ? "bg-card text-foreground border border-border shadow-xs"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <Layers className="w-3.5 h-3.5" />
                        <span>Nach ganzen Categories ({priceListSelectedCategoryIds.length})</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setPriceListMode("products");
                          if (priceListExpandedCategoryIds.length === 0) {
                            setPriceListExpandedCategoryIds(categories.map(c => c.id));
                          }
                        }}
                        className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                          priceListMode === "products"
                            ? "bg-card text-foreground border border-border shadow-xs"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <Box className="w-3.5 h-3.5" />
                        <span>Select Specific Styles ({priceListSelectedProductIds.length})</span>
                      </button>
                    </div>

                    {/* ─── MODE 1: CATEGORY SELECTION ─── */}
                    {priceListMode === "categories" && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-2.5 rounded-lg bg-card border border-dashed border-border">
                          <label className="flex items-center gap-2.5 cursor-pointer">
                            <input 
                              type="checkbox"
                              checked={priceListSelectedCategoryIds.length === categories.length && categories.length > 0}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setPriceListSelectedCategoryIds(categories.map(c => c.id));
                                } else {
                                  setPriceListSelectedCategoryIds([]);
                                }
                              }}
                              className="rounded text-accent focus:ring-accent w-4 h-4 cursor-pointer"
                            />
                            <span className="text-xs font-bold uppercase text-foreground">Select All Categories</span>
                          </label>
                          <span className="text-[10px] font-semibold text-muted-foreground">
                            {priceListSelectedCategoryIds.length} von {categories.length} ausgewählt
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[320px] overflow-y-auto pr-1">
                          {categories.map((cat, idx) => {
                            const isChecked = priceListSelectedCategoryIds.includes(cat.id);
                            const catProdsCount = products.filter(p => p.category_id === cat.id).length;
                            return (
                              <label 
                                key={cat.id} 
                                className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                                  isChecked 
                                    ? "border-black bg-slate-50 " 
                                    : "border-[#EAEAEA] hover:border-slate-300 bg-white"
                                }`}
                              >
                                <input 
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setPriceListSelectedCategoryIds([...priceListSelectedCategoryIds, cat.id]);
                                    } else {
                                      setPriceListSelectedCategoryIds(priceListSelectedCategoryIds.filter(id => id !== cat.id));
                                    }
                                  }}
                                  className="rounded text-accent focus:ring-accent w-4 h-4 mt-0.5 cursor-pointer"
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-1">
                                    <p className="text-xs font-bold text-foreground truncate">{cat.name}</p>
                                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                                      {catProdsCount} Styles
                                    </span>
                                  </div>
                                  <p className="text-[9.5px] text-muted-foreground font-mono mt-0.5 truncate">Abschnitt {idx + 1} • /{cat.slug}</p>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* ─── MODE 2: SPECIFIC PRODUCTS SELECTION ─── */}
                    {priceListMode === "products" && (
                      <div className="space-y-3">
                        <div className="relative">
                          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={priceListSearchQuery}
                            onChange={(e) => setPriceListSearchQuery(e.target.value)}
                            placeholder="Filter styles by name, SKU, or category..."
                            className="w-full pl-9 pr-8 py-2 text-xs border border-border bg-card text-foreground rounded-lg focus:outline-none focus:ring-1 focus:ring-accent"
                          />
                          {priceListSearchQuery && (
                            <button
                              onClick={() => setPriceListSearchQuery("")}
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-card rounded-xl border border-border">
                          <div>
                            <p className="text-xs font-bold text-foreground">
                              <span className="text-accent">{priceListSelectedProductIds.length}</span> Products ausgewählt
                            </p>
                            <p className="text-[9.5px] text-muted-foreground font-normal">
                              {categories.filter(c => products.some(p => priceListSelectedProductIds.includes(p.id) && p.category_id === c.id)).length} Categories mit separaten PDF-Abschnitten
                            </p>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                const filteredIds = products
                                  .filter(p => {
                                    if (!priceListSearchQuery.trim()) return true;
                                    const q = priceListSearchQuery.toLowerCase();
                                    const cat = categories.find(c => c.id === p.category_id);
                                    return p.name.toLowerCase().includes(q) || (cat && cat.name.toLowerCase().includes(q));
                                  })
                                  .map(p => p.id);
                                const merged = Array.from(new Set([...priceListSelectedProductIds, ...filteredIds]));
                                setPriceListSelectedProductIds(merged);
                              }}
                              className="px-2.5 py-1 text-[10px] font-bold text-foreground bg-card hover:bg-muted border border-border rounded-md cursor-pointer transition-colors"
                            >
                              Select All
                            </button>
                            <button
                              type="button"
                              onClick={() => setPriceListSelectedProductIds([])}
                              className="px-2.5 py-1 text-[10px] font-bold text-foreground bg-card hover:bg-muted border border-border rounded-md cursor-pointer transition-colors"
                            >
                              Auswahl aufheben
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (priceListExpandedCategoryIds.length === categories.length) {
                                  setPriceListExpandedCategoryIds([]);
                                } else {
                                  setPriceListExpandedCategoryIds(categories.map(c => c.id));
                                }
                              }}
                              className="px-2.5 py-1 text-[10px] font-bold text-slate-600 bg-white hover:bg-slate-100 border border-slate-200 rounded-md cursor-pointer transition-colors"
                            >
                              {priceListExpandedCategoryIds.length === categories.length ? "Alle einklappen" : "Alle ausklappen"}
                            </button>
                          </div>
                        </div>

                        <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
                          {categories.map((cat, catIdx) => {
                            const catProds = products.filter(p => {
                              if (p.category_id !== cat.id) return false;
                              if (!priceListSearchQuery.trim()) return true;
                              const q = priceListSearchQuery.toLowerCase();
                              return (
                                p.name.toLowerCase().includes(q) ||
                                (p.short_desc && p.short_desc.toLowerCase().includes(q)) ||
                                cat.name.toLowerCase().includes(q)
                              );
                            });

                            if (catProds.length === 0) return null;

                            const isExpanded = priceListExpandedCategoryIds.includes(cat.id);
                            const catProdIds = catProds.map(p => p.id);
                            const selectedInThisCat = catProdIds.filter(id => priceListSelectedProductIds.includes(id)).length;
                            const isAllInCatSelected = catProdIds.length > 0 && selectedInThisCat === catProdIds.length;

                            return (
                              <div key={cat.id} className="border border-[#EAEAEA] rounded-xl overflow-hidden bg-white">
                                <div className="flex items-center justify-between p-3 bg-slate-50 border-b border-[#EAEAEA]">
                                  <div className="flex items-center gap-2.5">
                                    <input
                                      type="checkbox"
                                      checked={isAllInCatSelected}
                                      onChange={() => {
                                        if (isAllInCatSelected) {
                                          setPriceListSelectedProductIds(priceListSelectedProductIds.filter(id => !catProdIds.includes(id)));
                                        } else {
                                          const merged = Array.from(new Set([...priceListSelectedProductIds, ...catProdIds]));
                                          setPriceListSelectedProductIds(merged);
                                        }
                                      }}
                                      className="rounded text-accent focus:ring-accent w-4 h-4 cursor-pointer"
                                    />
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <span className="text-[9.5px] font-bold px-1.5 py-0.5 rounded bg-black text-white uppercase tracking-wider">
                                          Abschnitt {catIdx + 1}
                                        </span>
                                        <span className="text-xs font-bold text-foreground uppercase">{cat.name}</span>
                                      </div>
                                      <span className="text-[9.5px] text-slate-700">
                                        {selectedInThisCat} von {catProds.length} Productsn ausgewählt
                                      </span>
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (isExpanded) {
                                        setPriceListExpandedCategoryIds(priceListExpandedCategoryIds.filter(id => id !== cat.id));
                                      } else {
                                        setPriceListExpandedCategoryIds([...priceListExpandedCategoryIds, cat.id]);
                                      }
                                    }}
                                    className="p-1 rounded hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                                  >
                                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                  </button>
                                </div>

                                {isExpanded && (
                                  <div className="divide-y divide-slate-100 bg-white">
                                    {catProds.map((prod) => {
                                      const isProdSelected = priceListSelectedProductIds.includes(prod.id);
                                      return (
                                        <label
                                          key={prod.id}
                                          className={`flex items-center gap-3 p-2.5 hover:bg-slate-50 cursor-pointer transition-colors ${
                                            isProdSelected ? "bg-slate-100/70" : ""
                                          }`}
                                        >
                                          <input
                                            type="checkbox"
                                            checked={isProdSelected}
                                            onChange={(e) => {
                                              if (e.target.checked) {
                                                setPriceListSelectedProductIds([...priceListSelectedProductIds, prod.id]);
                                              } else {
                                                setPriceListSelectedProductIds(priceListSelectedProductIds.filter(id => id !== prod.id));
                                              }
                                            }}
                                            className="rounded text-accent focus:ring-accent w-3.5 h-3.5 cursor-pointer ml-1"
                                          />
                                          <div className="w-9 h-9 rounded-md bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                                            {prod.featured_image ? (
                                              <img src={prod.featured_image} alt={prod.name} className="w-full h-full object-cover" />
                                            ) : (
                                              <Box className="w-4 h-4 text-slate-700" />
                                            )}
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <p className="text-xs font-semibold text-foreground truncate">{prod.name}</p>
                                            <div className="flex items-center gap-2 mt-0.5">
                                              <span className="text-[10px] font-bold text-accent font-mono">
                                                ₹{Number(prod.price || 0).toFixed(2)}
                                              </span>
                                              {prod.short_desc && (
                                                <span className="text-[9.5px] text-slate-700 truncate max-w-xs font-normal">
                                                  • {prod.short_desc}
                                                </span>
                                              )}
                                            </div>
                                          </div>
                                        </label>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Step 1 Footer Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#EAEAEA] mt-4">
                      <button 
                        onClick={() => setShowPriceListModal(false)}
                        disabled={!!generatingPdfStatus}
                        className="py-2.5 px-4 border border-[#E5E7EB] text-[10px] font-bold uppercase rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleGeneratePdfPriceList}
                        disabled={
                          (priceListMode === "categories" && priceListSelectedCategoryIds.length === 0) ||
                          (priceListMode === "products" && priceListSelectedProductIds.length === 0) ||
                          !!generatingPdfStatus
                        }
                        className="py-2.5 px-4 border border-border bg-card hover:bg-muted text-foreground text-[10px] font-bold uppercase rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download directly (Base prices)</span>
                      </button>
                      <button 
                        onClick={() => {
                          // Initialize custom price overrides with default prices for selected products
                          const selectedProds = priceListMode === "categories"
                            ? products.filter(p => priceListSelectedCategoryIds.includes(p.category_id))
                            : products.filter(p => priceListSelectedProductIds.includes(p.id));
                          
                          const initialOverrides: Record<string, number | string> = { ...priceListCustomPrices };
                          selectedProds.forEach(p => {
                            if (p.variants && p.variants.length > 0) {
                              p.variants.forEach(v => {
                                if (initialOverrides[v.id] === undefined) {
                                  initialOverrides[v.id] = v.price || p.price || 0.0;
                                }
                              });
                            } else {
                              if (initialOverrides[p.id] === undefined) {
                                initialOverrides[p.id] = p.price || 0.0;
                              }
                            }
                          });
                          setPriceListCustomPrices(initialOverrides);
                          setPriceListStep(2);
                        }}
                        disabled={
                          (priceListMode === "categories" && priceListSelectedCategoryIds.length === 0) ||
                          (priceListMode === "products" && priceListSelectedProductIds.length === 0) ||
                          !!generatingPdfStatus
                        }
                        className="flex-1 py-2.5 bg-black hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all disabled:opacity-40 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>Vorschau &amp; Verhandlungspreise anpassen</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* ═══════════════════════════════════════════════════════════ */}
                {/* STEP 2: NEGOTIATION PRICE PREVIEW & ADJUSTMENTS */}
                {/* ═══════════════════════════════════════════════════════════ */}
                {priceListStep === 2 && (
                  <div className="space-y-4 py-1">
                    {/* Notice Banner */}
                    <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3 flex items-start gap-2.5 text-amber-900">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div className="text-xs">
                        <p className="font-bold">B2B-Verhandlungsbereich (nur für PDF-Angebot)</p>
                        <p className="text-[10px] text-amber-800 font-light mt-0.5">
                          Passen Sie die Angebotspreise nach Bedarf an. Diese Pricee gelten <strong className="font-semibold">ausschließlich für dieses generierte PDF</strong> und verändern nicht die Shop-Pricee in der Datenbank.
                        </p>
                      </div>
                    </div>

                    {/* Global Bulk Adjust Toolbar with Custom % Input & Presets */}
                    <div className="bg-slate-50 border border-[#EAEAEA] rounded-xl p-3.5 space-y-2.5">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        {/* Custom Percentage Input Form */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 whitespace-nowrap">
                            Individuelle %-Anpassung:
                          </span>
                          <div className="flex items-center">
                            <div className="relative flex items-center">
                              <input
                                type="text"
                                inputMode="decimal"
                                placeholder="z. B. -12.5 oder +15"
                                value={priceListBulkDiscountPercent}
                                onChange={(e) => {
                                  const val = e.target.value.replace(/[^0-9.,+-]/g, "").replace(",", ".");
                                  setPriceListBulkDiscountPercent(val);
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    const val = parseFloat(priceListBulkDiscountPercent);
                                    if (!isNaN(val)) {
                                      const updated: Record<string, number | string> = { ...priceListCustomPrices };
                                      const selectedProds = priceListMode === "categories"
                                        ? products.filter(p => priceListSelectedCategoryIds.includes(p.category_id))
                                        : products.filter(p => priceListSelectedProductIds.includes(p.id));
                                      
                                      selectedProds.forEach(p => {
                                        if (p.variants && p.variants.length > 0) {
                                          p.variants.forEach(v => {
                                            const base = v.price || p.price || 0.0;
                                            const adjusted = Math.max(0.01, +(base * (1 + val / 100)).toFixed(2));
                                            updated[v.id] = adjusted;
                                          });
                                        } else {
                                          const base = p.price || 0.0;
                                          const adjusted = Math.max(0.01, +(base * (1 + val / 100)).toFixed(2));
                                          updated[p.id] = adjusted;
                                        }
                                      });
                                      setPriceListCustomPrices(updated);
                                    }
                                  }
                                }}
                                className="w-28 pl-2.5 pr-6 py-1 text-xs font-bold font-mono border border-slate-300 rounded-l-lg bg-white focus:outline-none focus:ring-1 focus:ring-accent"
                              />
                              <span className="absolute right-2 text-xs font-bold text-slate-700 font-mono">%</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const val = parseFloat(priceListBulkDiscountPercent);
                                if (!isNaN(val)) {
                                  const updated: Record<string, number | string> = { ...priceListCustomPrices };
                                  const selectedProds = priceListMode === "categories"
                                    ? products.filter(p => priceListSelectedCategoryIds.includes(p.category_id))
                                    : products.filter(p => priceListSelectedProductIds.includes(p.id));
                                  
                                  selectedProds.forEach(p => {
                                    if (p.variants && p.variants.length > 0) {
                                      p.variants.forEach(v => {
                                        const base = v.price || p.price || 0.0;
                                        const adjusted = Math.max(0.01, +(base * (1 + val / 100)).toFixed(2));
                                        updated[v.id] = adjusted;
                                      });
                                    } else {
                                      const base = p.price || 0.0;
                                      const adjusted = Math.max(0.01, +(base * (1 + val / 100)).toFixed(2));
                                      updated[p.id] = adjusted;
                                    }
                                  });
                                  setPriceListCustomPrices(updated);
                                }
                              }}
                              disabled={!priceListBulkDiscountPercent || isNaN(parseFloat(priceListBulkDiscountPercent))}
                              className="px-3 py-1 bg-[#18181B] hover:bg-black text-white text-[10px] font-bold uppercase tracking-wider rounded-r-lg border border-l-0 border-black transition-colors disabled:opacity-40 cursor-pointer"
                            >
                              %-Satz anwenden
                            </button>
                          </div>

                          {/* Quick Increase / Decrease Action Buttons */}
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                const val = parseFloat(priceListBulkDiscountPercent);
                                if (!isNaN(val)) {
                                  const pctVal = -Math.abs(val);
                                  const updated: Record<string, number | string> = { ...priceListCustomPrices };
                                  const selectedProds = priceListMode === "categories"
                                    ? products.filter(p => priceListSelectedCategoryIds.includes(p.category_id))
                                    : products.filter(p => priceListSelectedProductIds.includes(p.id));
                                  
                                  selectedProds.forEach(p => {
                                    if (p.variants && p.variants.length > 0) {
                                      p.variants.forEach(v => {
                                        const base = v.price || p.price || 0.0;
                                        const adjusted = Math.max(0.01, +(base * (1 + pctVal / 100)).toFixed(2));
                                        updated[v.id] = adjusted;
                                      });
                                    } else {
                                      const base = p.price || 0.0;
                                      const adjusted = Math.max(0.01, +(base * (1 + pctVal / 100)).toFixed(2));
                                      updated[p.id] = adjusted;
                                    }
                                  });
                                  setPriceListCustomPrices(updated);
                                }
                              }}
                              disabled={!priceListBulkDiscountPercent || isNaN(parseFloat(priceListBulkDiscountPercent))}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-md text-[10px] font-bold uppercase transition-colors disabled:opacity-40 cursor-pointer whitespace-nowrap"
                            >
                              Senken (-{Math.abs(parseFloat(priceListBulkDiscountPercent) || 0)}%)
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const val = parseFloat(priceListBulkDiscountPercent);
                                if (!isNaN(val)) {
                                  const pctVal = Math.abs(val);
                                  const updated: Record<string, number | string> = { ...priceListCustomPrices };
                                  const selectedProds = priceListMode === "categories"
                                    ? products.filter(p => priceListSelectedCategoryIds.includes(p.category_id))
                                    : products.filter(p => priceListSelectedProductIds.includes(p.id));
                                  
                                  selectedProds.forEach(p => {
                                    if (p.variants && p.variants.length > 0) {
                                      p.variants.forEach(v => {
                                        const base = v.price || p.price || 0.0;
                                        const adjusted = Math.max(0.01, +(base * (1 + pctVal / 100)).toFixed(2));
                                        updated[v.id] = adjusted;
                                      });
                                    } else {
                                      const base = p.price || 0.0;
                                      const adjusted = Math.max(0.01, +(base * (1 + pctVal / 100)).toFixed(2));
                                      updated[p.id] = adjusted;
                                    }
                                  });
                                  setPriceListCustomPrices(updated);
                                }
                              }}
                              disabled={!priceListBulkDiscountPercent || isNaN(parseFloat(priceListBulkDiscountPercent))}
                              className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-md text-[10px] font-bold uppercase transition-colors disabled:opacity-40 cursor-pointer whitespace-nowrap"
                            >
                              Erhöhen (+{Math.abs(parseFloat(priceListBulkDiscountPercent) || 0)}%)
                            </button>
                          </div>
                        </div>

                        {/* Reset Button */}
                        <button
                          type="button"
                          onClick={() => {
                            const resetMap: Record<string, number> = {};
                            const selectedProds = priceListMode === "categories"
                              ? products.filter(p => priceListSelectedCategoryIds.includes(p.category_id))
                              : products.filter(p => priceListSelectedProductIds.includes(p.id));
                            
                            selectedProds.forEach(p => {
                              if (p.variants && p.variants.length > 0) {
                                p.variants.forEach(v => {
                                  resetMap[v.id] = v.price || p.price || 0.0;
                                });
                              } else {
                                resetMap[p.id] = p.price || 0.0;
                              }
                            });
                            setPriceListCustomPrices(resetMap);
                            setPriceListBulkDiscountPercent("");
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold text-slate-600 hover:text-red-600 bg-white border border-slate-200 hover:border-red-200 rounded-md transition-all cursor-pointer whitespace-nowrap"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Alle auf Standard zurücksetzen</span>
                        </button>
                      </div>

                      {/* Quick Presets Row */}
                      <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-slate-200/60">
                        <span className="text-[9.5px] font-bold uppercase tracking-wider text-slate-700">Schnell-Vorlagen:</span>
                        {[-25, -20, -15, -10, -5, 5, 10, 15, 20].map((pct) => (
                          <button
                            key={pct}
                            type="button"
                            onClick={() => {
                              setPriceListBulkDiscountPercent(Math.abs(pct).toString());
                              const updated: Record<string, number | string> = { ...priceListCustomPrices };
                              const selectedProds = priceListMode === "categories"
                                ? products.filter(p => priceListSelectedCategoryIds.includes(p.category_id))
                                : products.filter(p => priceListSelectedProductIds.includes(p.id));
                              
                              selectedProds.forEach(p => {
                                if (p.variants && p.variants.length > 0) {
                                  p.variants.forEach(v => {
                                    const base = v.price || p.price || 0.0;
                                    const adjusted = Math.max(0.01, +(base * (1 + pct / 100)).toFixed(2));
                                    updated[v.id] = adjusted;
                                  });
                                } else {
                                  const base = p.price || 0.0;
                                  const adjusted = Math.max(0.01, +(base * (1 + pct / 100)).toFixed(2));
                                  updated[p.id] = adjusted;
                                }
                              });
                              setPriceListCustomPrices(updated);
                            }}
                            className={`px-2 py-0.5 text-[9.5px] font-bold rounded border transition-all cursor-pointer ${
                              pct < 0
                                ? "bg-white hover:bg-slate-50 text-slate-800 border-slate-200 hover:border-black"
                                : "bg-white hover:bg-emerald-50 text-emerald-700 border-slate-200 hover:border-emerald-300"
                            }`}
                          >
                            {pct > 0 ? `+${pct}%` : `${pct}%`}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Category-Grouped Preview Table with Editable Prices */}
                    <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
                      {categories.map((cat, catIndex) => {
                        const catProds = priceListMode === "categories"
                          ? (priceListSelectedCategoryIds.includes(cat.id) ? products.filter(p => p.category_id === cat.id) : [])
                          : products.filter(p => priceListSelectedProductIds.includes(p.id) && p.category_id === cat.id);

                        if (catProds.length === 0) return null;

                        return (
                          <div key={cat.id} className="border border-[#EAEAEA] rounded-xl overflow-hidden bg-white">
                            {/* Heading Header */}
                            <div className="bg-[#18181B] text-white p-3 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-accent text-white uppercase tracking-wider">
                                  Abschnitt {catIndex + 1}
                                </span>
                                <h4 className="text-xs font-bold uppercase tracking-wider">{cat.name}</h4>
                              </div>
                              <span className="text-[10px] text-slate-200 font-mono">
                                {catProds.length} Products in diesem Abschnitt
                              </span>
                            </div>

                            {/* Table of items */}
                            <div className="divide-y divide-slate-100">
                              {catProds.map((prod) => {
                                const hasVariants = prod.variants && prod.variants.length > 0;
                                const itemsToRender = hasVariants
                                  ? prod.variants!.map((v, i) => ({
                                      keyId: v.id,
                                      title: i === 0 ? prod.name : `${prod.name} (${v.name})`,
                                      basePrice: v.price || prod.price || 0.0,
                                      currentPrice: priceListCustomPrices[v.id] !== undefined ? priceListCustomPrices[v.id] : (v.price || prod.price || 0.0),
                                      specs: Object.entries(v.specs || {}).map(([k, val]) => `${k}: ${val}`).join(", ") || prod.short_desc || ""
                                    }))
                                  : [{
                                      keyId: prod.id,
                                      title: prod.name,
                                      basePrice: prod.price || 0.0,
                                      currentPrice: priceListCustomPrices[prod.id] !== undefined ? priceListCustomPrices[prod.id] : (prod.price || 0.0),
                                      specs: prod.short_desc || ""
                                    }];

                                return (
                                  <div key={prod.id} className="p-3 bg-white hover:bg-slate-50/50 transition-colors">
                                    {itemsToRender.map((item) => {
                                      const itemCurrentNum = Number(item.currentPrice) || 0;
                                      const isChanged = Math.abs(itemCurrentNum - item.basePrice) > 0.001;
                                      const diffPercent = item.basePrice > 0 ? ((itemCurrentNum - item.basePrice) / item.basePrice) * 100 : 0;
                                      
                                      // Approximate conversions for live preview
                                      const rateUSD_EUR = 0.92;
                                      const rateUSD_GBP = 0.78;
                                      const rateUSD_AUD = 1.50;
                                      const rateUSD_INR = 83.50;

                                      return (
                                        <div key={item.keyId} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-1.5">
                                          {/* Product info */}
                                          <div className="flex items-center gap-3 min-w-0 flex-1">
                                            <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                                              {prod.featured_image ? (
                                                <img src={prod.featured_image} alt={prod.name} className="w-full h-full object-cover" />
                                              ) : (
                                                <Box className="w-4 h-4 text-slate-700" />
                                              )}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                              <p className="text-xs font-bold text-foreground truncate">{item.title}</p>
                                              {item.specs && (
                                                <p className="text-[10px] text-slate-700 truncate max-w-sm font-normal mt-0.5">
                                                  {item.specs}
                                                </p>
                                              )}
                                              <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[9.5px] text-slate-700 font-mono">
                                                  Catalog Price: ₹{item.basePrice.toFixed(2)}
                                                </span>
                                                {isChanged && (
                                                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                                                    diffPercent < 0 
                                                      ? "bg-emerald-100 text-emerald-800" 
                                                      : "bg-blue-100 text-blue-800"
                                                  }`}>
                                                    {diffPercent < 0 ? `${diffPercent.toFixed(1)}%` : `+${diffPercent.toFixed(1)}%`}
                                                  </span>
                                                )}
                                              </div>
                                            </div>
                                          </div>

                                          {/* Price Input and Live Conversions */}
                                          <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                                            <div className="flex flex-col items-end">
                                              <div className="flex items-center gap-1.5">
                                                <span className="text-xs font-bold text-slate-800 font-mono">EUR ₹</span>
                                                <input
                                                  type="text"
                                                  inputMode="decimal"
                                                  value={item.currentPrice !== undefined && item.currentPrice !== null ? item.currentPrice : ""}
                                                  onChange={(e) => {
                                                    const val = e.target.value.replace(/[^0-9.,]/g, "").replace(",", ".");
                                                    setPriceListCustomPrices({
                                                      ...priceListCustomPrices,
                                                      [item.keyId]: val
                                                    });
                                                  }}
                                                  placeholder="0.00"
                                                  className={`w-20 px-2 py-1 text-xs font-bold font-mono text-right rounded-md border focus:outline-none focus:ring-1 focus:ring-accent ${
                                                    isChanged ? "border-blue-500 bg-blue-50/30 text-blue-700" : "border-slate-300 bg-white text-slate-900"
                                                  }`}
                                                />
                                              </div>
                                              {/* Live Secondary Currencies Preview */}
                                              <div className="flex items-center gap-1.5 text-[9px] text-slate-700 font-mono mt-1">
                                                <span>≈ ${(itemCurrentNum * (1 / rateUSD_EUR)).toFixed(2)}</span>
                                                <span>•</span>
                                                <span>£{(itemCurrentNum * (rateUSD_GBP / rateUSD_EUR)).toFixed(2)}</span>
                                              </div>
                                            </div>

                                            {/* Reset Single item */}
                                            {isChanged && (
                                              <button
                                                type="button"
                                                title="Reset to catalog price"
                                                onClick={() => {
                                                  const copy = { ...priceListCustomPrices };
                                                  delete copy[item.keyId];
                                                  setPriceListCustomPrices(copy);
                                                }}
                                                className="p-1 rounded text-slate-700 hover:text-red-600 hover:bg-slate-100 transition-colors cursor-pointer"
                                              >
                                                <X className="w-3.5 h-3.5" />
                                              </button>
                                            )}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Step 2 Footer Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-neutral-200 mt-4">
                      <button 
                        onClick={() => setPriceListStep(1)}
                        disabled={!!generatingPdfStatus}
                        className="py-2.5 px-4 bg-card border border-border hover:border-foreground text-foreground text-xs font-bold uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Back zur Auswahl</span>
                      </button>
                      <button 
                        onClick={handleGeneratePdfPriceList}
                        disabled={!!generatingPdfStatus}
                        className="flex-1 py-2.5 bg-black hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors disabled:opacity-40 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {generatingPdfStatus ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>{generatingPdfStatus}</span>
                          </>
                        ) : (
                          <>
                            <FileText className="w-3.5 h-3.5" />
                            <span>Download Custom B2B Price List (PDF)</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
            </AdminDrawer>
          )}

          {/* Add Manual Sample Order Modal */}
          {showAddSampleOrderModal && (
            <AddSampleOrderModal
              isOpen={showAddSampleOrderModal}
              onClose={() => setShowAddSampleOrderModal(false)}
              products={products}
              categories={categories}
              onOrderCreated={(newOrder) => {
                fetchOrders();
                fetchPayments();
              }}
            />
          )}

          {/* Edit Order Details Modal */}
          {editingOrder && (
            <EditOrderModal
              isOpen={Boolean(editingOrder)}
              onClose={() => setEditingOrder(null)}
              order={editingOrder}
              products={products}
              categories={categories}
              onOrderUpdated={(updatedOrder) => {
                fetchOrders();
                fetchPayments();
                if (
                  selectedOrderForInvoice &&
                  (selectedOrderForInvoice.orderId === updatedOrder.orderId ||
                    selectedOrderForInvoice.order_number === updatedOrder.order_number ||
                    selectedOrderForInvoice.id === updatedOrder.id)
                ) {
                  setSelectedOrderForInvoice(updatedOrder);
                }
              }}
            />
          )}
          {/* ── Order Details Right-Edge Slide-Over Modal (40% width, dimmed backdrop) ── */}
          <OrderDetailDrawer
            order={selectedOrderForDetail}
            isOpen={Boolean(selectedOrderForDetail)}
            onClose={() => setSelectedOrderForDetail(null)}
            onEdit={(order) => {
              setSelectedOrderForDetail(null);
              setEditingOrder(order);
            }}
            onPrintInvoice={(order) => {
              setSelectedOrderForDetail(null);
              setSelectedOrderForInvoice(order);
            }}
            onDelete={(orderId) => {
              setSelectedOrderForDetail(null);
              handleDeleteOrder(orderId);
            }}
            onStatusChange={async (orderId, newStatus) => {
              await handleUpdateOrderStatus(orderId, newStatus);
              setSelectedOrderForDetail((prev: any) =>
                prev ? { ...prev, status: newStatus } : null
              );
            }}
            onSaveOrder={(updated) => {
              handleSaveOrder(updated);
              setSelectedOrderForDetail(updated);
            }}
          />

          {/* B2B Printable Invoice Detail Drawer */}
          {selectedOrderForInvoice && (
            <AdminDrawer
              isOpen={Boolean(selectedOrderForInvoice)}
              onClose={() => setSelectedOrderForInvoice(null)}
              title="B2B-Handelsdokumente &amp; Rechnungen"
              subtitle={`Dokument: ${docModalType} • Bestell-Nr. ${selectedOrderForInvoice.orderId || selectedOrderForInvoice.order_number}`}
              badge={
                <Badge variant="secondary" className="font-mono text-xs">
                  {docModalType}
                </Badge>
              }
              maxWidthClass="max-w-6xl"
              backLabel="Back zu Orders"
            >
              <div id="printable-invoice-portal" className="text-left print:p-0 print:m-0">
                <div id="printable-invoice-modal" className="space-y-4">
                  
                  {/* Modal Controls (Hidden in Print) */}
                  <div className="pb-3 mb-2 print:hidden space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-foreground uppercase tracking-wider">Actions:</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 flex-wrap sm:flex-nowrap">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingOrder(selectedOrderForInvoice)}
                          className="gap-1.5 text-xs font-semibold cursor-pointer"
                          title="Edit Order Details"
                        >
                          <Edit className="w-3.5 h-3.5" /> Edit Order
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleDownloadActiveDocPDF(docModalType, selectedOrderForInvoice)}
                          className="gap-1.5 text-xs font-semibold cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" /> Download {docModalType} PDF
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.print()}
                          className="gap-1.5 text-xs font-semibold cursor-pointer"
                        >
                          <Printer className="w-3.5 h-3.5" /> Drucken
                        </Button>
                      </div>
                    </div>

                    {/* Modal Document Switcher Strip */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[10px] no-scrollbar">
                      {[
                        { id: "CI", label: "Commercial Invoice" },
                        { id: "PI", label: "Proforma Invoice" },
                        { id: "PL", label: "Packliste" },
                        { id: "QUOTATION", label: "Angebot" },
                        { id: "COO", label: "Ursprungszeugnis" },
                        { id: "COA", label: "Qualitätszertifikat" },
                        { id: "SWIFT", label: "SWIFT-Paymentsavis" },
                        { id: "SHIPPING_ADVICE", label: "Shippingavis" },
                        { id: "SAMPLE_NOTE", label: "Musterbegleitschein" },
                        { id: "CONTRACT", label: "Kaufvertrag" },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setDocModalType(item.id as any)}
                          className={`px-3 py-1.5 rounded-xl font-bold uppercase tracking-wider text-[10px] whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                            docModalType === item.id
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground hover:text-foreground border border-border"
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>

                    {/* Live Document Customization Controls (Hidden in Print) */}
                    <div className="border border-border rounded-xl p-3 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-[11px] print:hidden bg-card">
                      <div>
                        <label className="block text-[9.5px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Kurier / Logistik</label>
                        <AdminCustomSelect
                          value={selectedOrderForInvoice.carrierName || "DHL Paket"}
                          onChange={async (val) => {
                            setSelectedOrderForInvoice((prev: any) => ({ ...prev, carrierName: val }));
                            try {
                              await fetch("/api/orders", {
                                method: "PUT",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ order_number: selectedOrderForInvoice.orderId, carrierName: val })
                              });
                            } catch (err) {}
                          }}
                          options={[
                            { value: "DHL Paket", label: "DHL Paket" },
                            { value: "Deutsche Post", label: "Deutsche Post / Paket" },
                            { value: "FedEx Express", label: "FedEx Express" },
                            { value: "UPS Worldwide", label: "UPS Worldwide" },
                            { value: "Standard Courier", label: "Standardzustellung" }
                          ]}
                          variant="form"
                          size="xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[9.5px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Sendungsnummer / AWB #</label>
                        <input
                          type="text"
                          value={selectedOrderForInvoice.trackingAwbNumber || selectedOrderForInvoice.tracking_number || ""}
                          placeholder="DHL-981421094"
                          onChange={(e) => {
                            const val = e.target.value;
                            setSelectedOrderForInvoice((prev: any) => ({ ...prev, trackingAwbNumber: val }));
                          }}
                          onBlur={async () => {
                            try {
                              await fetch("/api/orders", {
                                method: "PUT",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ order_number: selectedOrderForInvoice.orderId, trackingAwbNumber: selectedOrderForInvoice.trackingAwbNumber })
                              });
                            } catch (err) {}
                          }}
                          className="w-full bg-background border border-input rounded-xl px-3 py-1.5 text-xs font-mono font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                        />
                      </div>

                      <div>
                        <label className="block text-[9.5px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Shippingort / Herkunft</label>
                        <input
                          type="text"
                          value={selectedOrderForInvoice.portOfLoading || "Jaipur, India"}
                          onChange={(e) => {
                            const val = e.target.value;
                            setSelectedOrderForInvoice((prev: any) => ({ ...prev, portOfLoading: val }));
                          }}
                          onBlur={async () => {
                            try {
                              await fetch("/api/orders", {
                                method: "PUT",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ order_number: selectedOrderForInvoice.orderId, portOfLoading: selectedOrderForInvoice.portOfLoading })
                              });
                            } catch (err) {}
                          }}
                          className="w-full bg-background border border-input rounded-xl px-3 py-1.5 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                        />
                      </div>

                      <div>
                        <label className="block text-[9.5px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Dokumentsprache</label>
                        <AdminCustomSelect
                          value={selectedOrderForInvoice.docLanguage || docLanguage || "de"}
                          onChange={(val) => {
                            setDocLanguage(val as any);
                            setSelectedOrderForInvoice((prev: any) => ({ ...prev, docLanguage: val }));
                          }}
                          options={[
                            { value: "de", label: "🇩🇪 Deutsch (German)" },
                            { value: "en", label: "🇬🇧 English" },
                            { value: "es", label: "🇪🇸 Español" },
                            { value: "fr", label: "🇫🇷 Français" },
                            { value: "it", label: "🇮🇹 Italiano" },
                            { value: "pt", label: "🇧🇷 Português" }
                          ]}
                          variant="form"
                          size="xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Invoice Printable Document Body */}
                  <div className="space-y-6 font-sans text-slate-800">
                    
                    {/* Top Branding & Invoice Header */}
                    <div className="flex justify-between items-start border-b-2 border-black pb-4">
                      <div className="space-y-0.5">
                        {/* Official Speaker Parts Company Logo */}
                        <img 
                          src="/assets/images/ixos-logo-black-sticky.png" 
                          alt="Wastram Sound & Audio" 
                          className="h-10 w-auto object-contain mb-1.5"
                        />
                        <p className="text-[11px] text-black font-bold">Wastram SOUND &amp; AUDIO</p>
                        <p className="text-[9.5px] text-slate-600 font-light">Weltweite Lautsprecherkomponenten &amp; Akustik-Hardware</p>
                        <p className="text-[9.5px] text-slate-600 font-light">support@ixosweb.com • ixosweb.vercel.app</p>
                      </div>
                      <div className="text-right">
                        <span className="inline-block bg-black text-white text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-wider mb-1">
                          {docModalType === "PI" ? t("DOC_PI", selectedOrderForInvoice.docLanguage || docLanguage) :
                           docModalType === "PL" ? t("DOC_PL", selectedOrderForInvoice.docLanguage || docLanguage) :
                           docModalType === "QUOTATION" ? t("DOC_QUOTATION", selectedOrderForInvoice.docLanguage || docLanguage) :
                           docModalType === "COO" ? t("DOC_COO", selectedOrderForInvoice.docLanguage || docLanguage) :
                           docModalType === "COA" ? t("DOC_COA", selectedOrderForInvoice.docLanguage || docLanguage) :
                           docModalType === "SWIFT" ? t("DOC_SWIFT", selectedOrderForInvoice.docLanguage || docLanguage) :
                           docModalType === "SHIPPING_ADVICE" ? t("DOC_SHIPPING_ADVICE", selectedOrderForInvoice.docLanguage || docLanguage) :
                           docModalType === "SAMPLE_NOTE" ? t("DOC_SAMPLE_NOTE", selectedOrderForInvoice.docLanguage || docLanguage) :
                           docModalType === "CONTRACT" ? t("DOC_CONTRACT", selectedOrderForInvoice.docLanguage || docLanguage) :
                           t("DOC_CI", selectedOrderForInvoice.docLanguage || docLanguage)}
                        </span>
                        <p className="font-mono text-sm font-bold text-black">{selectedOrderForInvoice.orderId}</p>
                        <p className="text-xs text-slate-700">Date: {selectedOrderForInvoice.date}</p>
                        <p className="text-xs text-slate-700 font-semibold">
                          Payment: {selectedOrderForInvoice.payment?.status || (docModalType === "PI" ? t("STATUS_UNPAID", selectedOrderForInvoice.docLanguage || docLanguage) : "PAID")}
                        </p>
                      </div>
                    </div>

                  {/* Bill To, Ship To & Customs Metadata */}
                  <div className="grid grid-cols-3 gap-4 bg-white p-4 border border-black rounded-xl text-xs">
                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-black mb-1">Billed To / Importer:</h4>
                      <p className="font-bold text-black">{selectedOrderForInvoice.customer?.company || selectedOrderForInvoice.customer?.name}</p>
                      <p className="text-black">{selectedOrderForInvoice.customer?.name}</p>
                      <p className="text-black font-mono text-[11px] break-all">{selectedOrderForInvoice.customer?.email}</p>
                      <p className="text-black">{selectedOrderForInvoice.customer?.phone}</p>
                      {selectedOrderForInvoice.customer?.taxId && (
                        <p className="text-[10px] text-black font-mono mt-1">USt-IdNr.: {selectedOrderForInvoice.customer.taxId}</p>
                      )}
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-black mb-1">Lieferanschrift:</h4>
                      <p className="text-black break-words">{selectedOrderForInvoice.shipping?.address || "Werkstatt-Direktlieferung"}</p>
                      <p className="text-black font-semibold">
                        {[selectedOrderForInvoice.shipping?.city, selectedOrderForInvoice.shipping?.state, selectedOrderForInvoice.shipping?.zip]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                      <p className="font-bold text-black">{selectedOrderForInvoice.shipping?.country || "India"}</p>
                      <p className="text-[10px] text-black mt-1 font-mono">Payment: {selectedOrderForInvoice.payment?.status || selectedOrderForInvoice.payment?.gateway || "PAID"}</p>
                    </div>
                    <div className="border-l border-black pl-3 space-y-1">
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-black mb-1">Shipping- &amp; Bereitstellungsinformationen:</h4>
                      <p className="text-[11px]"><strong className="text-black">Kurier:</strong> <span className="font-semibold text-black">{selectedOrderForInvoice.carrierName || "DHL Paket"}</span></p>
                      <p className="text-[11px]"><strong className="text-black">Tracking / Air Waybill (AWB):</strong> <span className="font-mono text-black">{selectedOrderForInvoice.trackingAwbNumber || selectedOrderForInvoice.tracking_number || "PENDING"}</span></p>
                      <p className="text-[11px]"><strong className="text-black">Port of Loading / Dispatch:</strong> <span className="text-black">{selectedOrderForInvoice.portOfLoading || "Jaipur, India"}</span></p>
                      {selectedOrderForInvoice.notes && (
                        <p className="text-[10px] text-black italic mt-0.5 line-clamp-2">Hinweise: {selectedOrderForInvoice.notes}</p>
                      )}
                    </div>
                  </div>

                  {/* Line Items Table */}
                  <div className="border border-black rounded-xl overflow-hidden bg-white">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead className="bg-black text-white font-bold">
                        <tr>
                          <th className="px-4 py-2.5 border-r border-black">{t("TH_ITEM_DESCRIPTION", selectedOrderForInvoice.docLanguage || docLanguage)}</th>
                          <th className="px-3 py-2.5 text-center border-r border-black">{t("TH_QTY", selectedOrderForInvoice.docLanguage || docLanguage)}</th>
                          <th className="px-3 py-2.5 text-right border-r border-black">{t("TH_UNIT_PRICE", selectedOrderForInvoice.docLanguage || docLanguage)}</th>
                          <th className="px-4 py-2.5 text-right">{t("TH_TOTAL", selectedOrderForInvoice.docLanguage || docLanguage)} ({selectedOrderForInvoice.docCurrency || docCurrency})</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-black text-black bg-white">
                        {(() => {
                          const cur = selectedOrderForInvoice.docCurrency || docCurrency || "EUR";
                          const items = selectedOrderForInvoice.items && selectedOrderForInvoice.items.length > 0
                            ? selectedOrderForInvoice.items
                            : [{
                                productName: selectedOrderForInvoice.productName,
                                variantName: selectedOrderForInvoice.variantName || "Standard",
                                quantity: selectedOrderForInvoice.quantity || 1,
                                unitPrice: selectedOrderForInvoice.unitPrice || (selectedOrderForInvoice.total / (selectedOrderForInvoice.quantity || 1))
                              }];
                          return items.map((item: any, idx: number) => (
                            <tr key={idx} className="bg-white hover:bg-white border-b border-black last:border-b-0">
                              <td className="px-4 py-2.5 border-r border-black">
                                <strong className="text-black block">{item.productName}</strong>
                                {item.variantName && <span className="text-[10px] text-black">{item.variantName}</span>}
                              </td>
                              <td className="px-3 py-2.5 text-center font-bold border-r border-black">{item.quantity}</td>
                              <td className="px-3 py-2.5 text-right font-mono border-r border-black">{formatDocCurrency(Number(item.unitPrice || 0), cur)}</td>
                              <td className="px-4 py-2.5 text-right font-mono font-bold text-black">
                                {formatDocCurrency((Number(item.quantity || 1) * Number(item.unitPrice || 0)), cur)}
                              </td>
                            </tr>
                          ));
                        })()}
                      </tbody>
                    </table>
                  </div>

                  {/* Financial Breakdown Totals */}
                  <div className="flex justify-end">
                    <div className="w-full sm:w-80 space-y-1 text-xs">
                      {(() => {
                        const cur = selectedOrderForInvoice.docCurrency || docCurrency || "EUR";
                        const sub = Number(selectedOrderForInvoice.subtotal) || Number(selectedOrderForInvoice.total) || 0;
                        const tot = Number(selectedOrderForInvoice.total || 0);
                        const adv = typeof selectedOrderForInvoice.advancePaidAmount === "number" ? selectedOrderForInvoice.advancePaidAmount : undefined;
                        const bal = typeof selectedOrderForInvoice.balanceDueAmount === "number" ? selectedOrderForInvoice.balanceDueAmount : undefined;

                        return (
                          <>
                            <div className="flex justify-between text-black">
                              <span>Subtotal Products:</span>
                              <span className="font-mono font-bold">
                                {formatDocCurrency(sub, cur)}
                              </span>
                            </div>
                            {Number(selectedOrderForInvoice.shippingFee) > 0 && (
                              <div className="flex justify-between text-black">
                                <span>Express Shipping &amp; Handling:</span>
                                <span className="font-mono font-bold">{formatDocCurrency(Number(selectedOrderForInvoice.shippingFee), cur)}</span>
                              </div>
                            )}
                            {Number(selectedOrderForInvoice.taxAmount) > 0 && (
                              <div className="flex justify-between text-black">
                                <span>Steuer / MwSt. ({selectedOrderForInvoice.taxRate || 0}%):</span>
                                <span className="font-mono font-bold">{formatDocCurrency(Number(selectedOrderForInvoice.taxAmount), cur)}</span>
                              </div>
                            )}
                            {Number(selectedOrderForInvoice.discount) > 0 && (
                              <div className="flex justify-between text-black">
                                <span>Wholesale Trade Discount:</span>
                                <span className="font-mono font-bold">-{formatDocCurrency(Number(selectedOrderForInvoice.discount), cur)}</span>
                              </div>
                            )}
                            <div className="flex justify-between text-sm font-bold text-black pt-1.5 border-t-2 border-black">
                              <span className="uppercase tracking-wider">{t("ROW_GRAND_TOTAL", selectedOrderForInvoice.docLanguage || docLanguage)}:</span>
                              <span className="font-mono font-bold text-black">{formatDocCurrency(tot, cur)}</span>
                            </div>

                            {/* Advance & Balance Due Rows */}
                            {adv !== undefined && adv > 0 && (
                              <div className="flex justify-between text-xs font-semibold text-emerald-800 pt-1 border-t border-dashed border-slate-300">
                                <span>{t("ROW_ADVANCE_PAID", selectedOrderForInvoice.docLanguage || docLanguage)} ({selectedOrderForInvoice.advancePaidPct ? `${selectedOrderForInvoice.advancePaidPct}%` : 'Anzahlung'}):</span>
                                <span className="font-mono font-bold">{formatDocCurrency(adv, cur)}</span>
                              </div>
                            )}
                            {bal !== undefined && (
                              <div className="flex justify-between text-xs font-bold text-red-700">
                                <span>{t("ROW_BALANCE_DUE", selectedOrderForInvoice.docLanguage || docLanguage)}:</span>
                                <span className="font-mono font-bold">{formatDocCurrency(bal, cur)}</span>
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Point-Wise Store Order & Delivery Terms & Conditions */}
                  <div className="border border-black rounded-xl p-3.5 bg-white space-y-1.5 text-[9.5px] text-black">
                    <h4 className="font-bold text-[11px] uppercase tracking-wider text-black flex items-center gap-1.5 border-b border-black pb-1">
                      <Truck className="w-3.5 h-3.5 text-black" /> Terms of Service &amp; Shipping Policies
                    </h4>
                    
                    <ol className="list-decimal pl-4 space-y-0.5 text-black leading-normal">
                      <li>
                        <strong className="text-black">Artisanal Craftsmanship:</strong> Handcrafted pure mulmul, modal silks, and heritage hand-block print apparel. 100% quality inspected before dispatch.
                      </li>
                      <li>
                        <strong className="text-black">Delivery &amp; Logistics:</strong> Dispatched via authorized air couriers with end-to-end online tracking upon handover.
                      </li>
                      <li>
                        <strong className="text-black">Quality Assurance &amp; Transit Guarantee:</strong> Thoroughly inspected prior to international air dispatch. Any damages in transit must be reported within <strong className="text-black">7 calendar days</strong> with unboxing photographs/videos.
                      </li>
                      <li>
                        <strong className="text-black">Protective Packaging:</strong> Individually packed in moisture-resistant poly-sleeves and heavy-duty wholesale master cartons.
                      </li>
                      <li>
                        <strong className="text-black">Jurisdiction &amp; Trade Terms:</strong> Governed under the commercial jurisdiction of Jaipur, Rajasthan, India.
                      </li>
                    </ol>
                  </div>

                  {/* Authorized Declaration & Signatory Block */}
                  <div className="grid grid-cols-2 gap-4 border-t border-black pt-3 text-[10px]">
                    <div className="space-y-1 text-black">
                      <p className="font-bold text-black uppercase text-[10px]">Legal Trade Declaration:</p>
                      <p className="italic text-[9.5px] leading-tight">
                        "We hereby certify that this invoice shows the actual price of the described goods, that no other invoice has been or will be issued, and that all particulars are true and correct."
                      </p>
                    </div>
                    <div className="text-right flex flex-col justify-between items-end">
                      <div>
                        <p className="font-bold text-black uppercase text-[10px]">Für Wastram SOUND &amp; AUDIO</p>
                        <p className="text-black text-[9px] font-semibold">Lautsprecherkomponenten &amp; Akustikteile</p>
                        <p className="text-black text-[8.5px] font-mono">USt-IdNr.: DE-Wastram-2008</p>
                        <p className="text-black text-[8.5px]">Jaipur, Rajasthan, India</p>
                      </div>
                      <div className="border-t border-black pt-1 mt-4 w-44 text-center">
                        <p className="font-bold text-[9.5px] text-black">Authorized Signature &amp; Seal</p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </AdminDrawer>
        )}
      </Main>
    </>
    )}
    <AdminToastContainer />
  </AuthenticatedLayout>
);
}

// ═══════════════════════════════════════════════════════════════════
// CATEGORY FORM MODAL
// ═══════════════════════════════════════════════════════════════════
function CategoryFormModal({ category, onSave, onClose }: {
  category: Category | null;
  categories: Category[];
  onSave: (cat: Partial<Category>) => Promise<void> | void;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    name: category?.name || "",
    slug: category?.slug || "",
    description: category?.description || "",
    image_url: category?.image_url || "",
    sort_order: category?.sort_order ?? 0,
    is_hidden: category?.is_hidden ?? false,
    seo_meta: {
      title: category?.seo_meta?.title || "",
      description: category?.seo_meta?.description || "",
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError("");
    try {
      await onSave({
        name: form.name,
        slug: form.slug || generateSlug(form.name),
        description: form.description || null,
        image_url: form.image_url || null,
        sort_order: form.sort_order,
        is_hidden: form.is_hidden,
        seo_meta: form.seo_meta.title || form.seo_meta.description ? form.seo_meta : null,
      });
    } catch (err: any) {
      setFormError(err.message || "Error beim Save der Category");
    } finally {
      setIsSubmitting(false);
    }
  };

  const cardClass = "bg-white border-2 border-neutral-200 rounded-2xl p-5 space-y-4 shadow-xs";
  const labelTextClass = "block text-xs font-heading font-black text-black uppercase tracking-wider mb-1.5";
  const textInputClass = "w-full bg-white border-2 border-neutral-200 focus:border-black rounded-xl px-4 py-2.5 text-xs text-black placeholder:text-neutral-400 font-medium outline-none transition-colors";

  return (
    <AdminDrawer
      isOpen={true}
      onClose={onClose}
      title={category ? "Edit Category" : "New Category"}
      subtitle="Categoriesame, Slug, Description und Anzeigeeinstellungen anpassen."
      maxWidthClass="max-w-2xl"
      backLabel="Back zu Categories"
    >
      <form onSubmit={handleSubmit} className="space-y-5 text-xs font-sans">
        {/* Card 1: Category Info */}
        <div className={cardClass}>
          <div>
            <label className={labelTextClass}>Category Name *</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={e => {
                const val = e.target.value;
                setForm({ ...form, name: val, slug: category ? form.slug : generateSlug(val) });
              }}
              className={textInputClass}
              placeholder="e.g. Western Dresses"
            />
          </div>

          <div>
            <label className={labelTextClass}>URL-Slug</label>
            <input
              type="text"
              value={form.slug}
              onChange={e => setForm({ ...form, slug: e.target.value })}
              className={textInputClass}
              placeholder="e.g. western-dresses"
            />
          </div>

          <div>
            <label className={labelTextClass}>Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              className={`${textInputClass} resize-none`}
              placeholder="Collection overview and artisanal apparel description..."
            />
          </div>
        </div>

        {/* Card 2: Image */}
        <div className={cardClass}>
          <label className={labelTextClass}>Category Cover Image</label>
          <MediaUploader
            value={form.image_url}
            onChange={url => setForm({ ...form, image_url: url })}
          />
        </div>

        {/* Card 3: Visibility & Display */}
        <div className={cardClass}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelTextClass}>Visibility</label>
              <select
                value={form.is_hidden ? "hidden" : "visible"}
                onChange={e => setForm({ ...form, is_hidden: e.target.value === "hidden" })}
                className={textInputClass}
              >
                <option value="visible">Visible in Store (Published)</option>
                <option value="hidden">Hidden in Store (Draft)</option>
              </select>
            </div>
            <div>
              <label className={labelTextClass}>Display Order</label>
              <input
                type="text"
                inputMode="numeric"
                value={form.sort_order !== undefined && form.sort_order !== null ? form.sort_order : ""}
                onChange={e => {
                  const val = e.target.value.replace(/[^0-9]/g, "");
                  setForm({ ...form, sort_order: val as any });
                }}
                placeholder="0"
                className={textInputClass}
              />
            </div>
          </div>
        </div>

        {formError && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-xl text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span className="font-medium leading-relaxed">{formError}</span>
          </div>
        )}

        {/* Actions Toolbar */}
        <div className="flex items-center justify-end gap-3 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border-2 border-neutral-300 hover:border-black text-black text-xs font-heading font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl bg-black hover:bg-neutral-800 disabled:opacity-50 text-white text-xs font-heading font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin stroke-[2]" />
                <span>Save...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 stroke-[2]" />
                <span>{category ? "Save Changes" : "Create Category"}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </AdminDrawer>
  );
}

// ═══════════════════════════════════════════════════════════════════
// PRODUCT FORM MODAL & HELPERS
// ═══════════════════════════════════════════════════════════════════

// Media uploader sub-component
function MediaUploader({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const ACCEPTED = "image/*,video/*";

  const upload = async (file: File) => {
    setUploading(true);
    setError("");
    try {
      const optimized = await optimizeImageFile(file);
      const formData = new FormData();
      formData.append("file", optimized);
      const res = await adminFetch("/api/uploads", { method: "POST", body: formData });
      const json = await res.json();
      if (!res.ok || !json.url) {
        throw new Error(json?.error || `Upload fehlgeschlagen (${res.status})`);
      }
      onChange(json.url);
    } catch (e: any) {
      setError(e?.message || "Upload fehlgeschlagen");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) upload(file);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) upload(file);
  };

  const isVideo = Boolean(
    value && (
      value.startsWith("data:video/") ||
      /\.(mp4|mov|webm|ogg|avi)($|\?)/i.test(value)
    )
  );
  const isImage = Boolean(
    value && !isVideo && (
      value.startsWith("data:image/") ||
      value.startsWith("/") ||
      value.startsWith("http://") ||
      value.startsWith("https://") ||
      /\.(jpe?g|png|gif|webp|svg|avif|jfif|bmp|heic|tiff?)($|\?)/i.test(value)
    )
  );

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all bg-white ${
          dragging ? "border-black bg-neutral-50" : "border-neutral-300 hover:border-black"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED}
          className="hidden"
          onChange={handleFile}
        />
        {uploading ? (
          <div className="flex flex-col items-center gap-2 text-black">
            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-heading font-bold uppercase tracking-wider">Uploading file...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-black">
            <Upload className="w-5 h-5 stroke-[2]" />
            <p className="text-xs font-heading font-bold uppercase tracking-wider">Drag file here or click to browse</p>
            <p className="text-[11px] text-neutral-500">JPG, PNG, WEBP high-resolution atelier photography</p>
          </div>
        )}
      </div>

      {/* URL fallback */}
      <div>
        <label className="block text-[11px] font-heading font-bold text-neutral-600 uppercase tracking-wider mb-1">
          Oder Medien-URL einfügen
        </label>
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full bg-white border-2 border-neutral-200 focus:border-black rounded-xl px-4 py-2 text-xs text-black placeholder:text-neutral-400 font-medium outline-none transition-colors"
          placeholder="https://..."
        />
      </div>

      {/* Preview */}
      {value && (
        <div className="relative rounded-2xl overflow-hidden border-2 border-neutral-200 bg-white p-3 flex items-center justify-center">
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2.5 right-2.5 z-10 bg-black hover:bg-neutral-800 text-white rounded-full p-1.5 transition-colors cursor-pointer"
            title="Remove Media"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          {isImage ? (
            <img src={value} alt="Vorschau" className="max-h-48 w-auto object-contain rounded-xl" />
          ) : isVideo ? (
            <video src={value} controls className="max-h-48 w-auto rounded-xl" />
          ) : (
            <div className="flex items-center gap-2 py-3 text-xs font-mono text-black">
              <Box className="w-4 h-4 text-black" />
              <span className="truncate max-w-xs">{value}</span>
            </div>
          )}
        </div>
      )}

      {error && <p className="text-xs text-red-600 font-bold">{error}</p>}
    </div>
  );
}

// Key-value spec builder sub-component
function SpecBuilder({
  specs,
  onChange,
}: {
  specs: Array<{ key: string; value: string }>;
  onChange: (specs: Array<{ key: string; value: string }>) => void;
}) {
  const add = (key = "", value = "") => onChange([...specs, { key, value }]);
  const remove = (i: number) => onChange(specs.filter((_, idx) => idx !== i));
  const update = (i: number, field: "key" | "value", val: string) => {
    const next = specs.map((s, idx) => idx === i ? { ...s, [field]: val } : s);
    onChange(next);
  };

  const quickChips = [
    { label: "+ Condition", key: "Condition", defaultVal: "Brand New (Artisanal)" },
    { label: "+ Maße", key: "Maße", defaultVal: "" },
    { label: "+ Material", key: "Material", defaultVal: "" },
    { label: "+ Fabric", key: "Fabric", defaultVal: "Pure Mulmul Cotton" },
    { label: "+ Craft / Weave", key: "Craft", defaultVal: "Handloom Zari" },
    { label: "+ Part Number", key: "Part Number", defaultVal: "" },
    { label: "+ Pattern", key: "Pattern", defaultVal: "Jaipuri Hand-block" },
    { label: "+ Fit Type", key: "Fit", defaultVal: "Flared Maxi" },
    { label: "+ Wash Care", key: "Care", defaultVal: "Hand Wash Cold" },
  ];

  return (
    <div className="space-y-3">
      {/* Table Header */}
      <div className="hidden sm:grid sm:grid-cols-12 gap-3 px-2 text-[11px] font-heading font-black text-neutral-500 uppercase tracking-wider">
        <div className="sm:col-span-5">Specification / Attribute</div>
        <div className="sm:col-span-6">Value / Specification</div>
        <div className="sm:col-span-1 text-center">Action</div>
      </div>

      {specs.length === 0 ? (
        <div className="p-4 rounded-xl border-2 border-dashed border-neutral-200 text-center bg-neutral-50/50">
          <p className="text-xs text-neutral-500 italic py-1">No specifications added yet.</p>
          <p className="text-[11px] text-neutral-400">Use the button or quick-add tags below to add specification rows (e.g. Fabric, Seam, Lining).</p>
        </div>
      ) : (
        <div className="space-y-2">
          {specs.map((spec, i) => (
            <div key={i} className="flex flex-col sm:grid sm:grid-cols-12 gap-2 sm:gap-3 items-center bg-neutral-50/60 p-2 sm:p-0 sm:bg-transparent rounded-xl border sm:border-0 border-neutral-200">
              <div className="w-full sm:col-span-5">
                <input
                  type="text"
                  placeholder="e.g. Fabric, Weave, Lining, MOQ"
                  value={spec.key}
                  onChange={e => update(i, "key", e.target.value)}
                  className="w-full bg-white border-2 border-neutral-200 focus:border-black rounded-xl px-3.5 py-2 text-xs text-black font-semibold outline-none transition-colors"
                />
              </div>
              <div className="w-full sm:col-span-6">
                <input
                  type="text"
                  placeholder="z. B. 8, 44,4 mm, IX-1059, Neuware"
                  value={spec.value}
                  onChange={e => update(i, "value", e.target.value)}
                  className="w-full bg-white border-2 border-neutral-200 focus:border-black rounded-xl px-3.5 py-2 text-xs text-black font-medium outline-none transition-colors"
                />
              </div>
              <div className="w-full sm:col-span-1 flex justify-end sm:justify-center">
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="p-2 rounded-xl text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  title="Remove Row"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Button & Quick Suggestions */}
      <div className="pt-1 space-y-2.5">
        <button
          type="button"
          onClick={() => add("", "")}
          className="w-full py-2.5 rounded-xl border-2 border-dashed border-neutral-300 hover:border-black text-black text-xs font-heading font-bold uppercase tracking-wider transition-colors bg-white flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Specification Row
        </button>

        <div>
          <span className="text-[10px] font-heading font-bold text-neutral-400 uppercase tracking-wider block mb-1.5">
            Quick-add common apparel attributes:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {quickChips.map((chip) => (
              <button
                key={chip.key}
                type="button"
                onClick={() => {
                  const exists = specs.some(s => s.key.trim().toLowerCase() === chip.key.toLowerCase());
                  if (!exists) {
                    add(chip.key, chip.defaultVal);
                  }
                }}
                className="text-[11px] font-medium bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductFormModal({ product, categories, existingProducts = [], onSave, onClose, onOpenSelectExisting }: {
  product: Product | null;
  categories: Category[];
  existingProducts?: Product[];
  onSave: (prod: Partial<Product>) => Promise<void> | void;
  onClose: () => void;
  onOpenSelectExisting?: () => void;
}) {
  const specs = ((product?.technical_specs || (product as any)?.variants?.[0]?.specs || {}) as Record<string, string>);

  // Extract Ohm
  let initialOhm = (product as any)?.ohm || specs["Ohm"] || specs["ohm"] || specs["Impedanz"] || specs["Impedance"] || "";
  if (!initialOhm && product?.name) {
    const m = (product.name + " " + (product?.shortDescription || product?.short_desc || "")).match(/\b(\d+(?:[,.]\d+)?)\s*(?:ohm|Ω)\b/i);
    if (m) initialOhm = `${m[1]} Ohm`;
  }

  // Extract Spule Durchmesser
  let initialCoil = (product as any)?.craft || specs["Craft"] || specs["Weave"] || "";
  if (!initialCoil && specs["Brand"] && /^[\d,.]+(?:\s*mm)?$/.test(specs["Brand"].trim())) {
    initialCoil = specs["Brand"].trim();
    if (!initialCoil.includes("mm")) initialCoil += " mm";
  }
  if (!initialCoil && product?.name) {
    const m = (product.name + " " + (product?.shortDescription || product?.short_desc || "")).match(/\b(\d+(?:[,.]\d+)?)\s*(?:mm)\b/i);
    if (m) initialCoil = `${m[1]} mm`;
  }

  // Extract Brand
  let initialBrand = (product as any)?.brand || specs["Brand"] || "";
  if (/^[\d,.]+(?:\s*mm)?$/.test(initialBrand.trim())) {
    initialBrand = "Wastram";
  }
  if (!initialBrand) initialBrand = "Wastram";

  // Extract Part Number / SKU
  const initialPartNumber = (product as any)?.partNumber || (product as any)?.part_number || specs["Part Number"] || specs["SKU"] || product?.id || "";

  // Extract Fitment
  const initialFitment = (product as any)?.fitsModels || specs["Fitment"] || specs["Passend für"] || "";

  // Banned / suppressed keys that should NEVER be added to the technical specs table:
  const suppressedSpecKeys = new Set([
    "brand", "marke", "hersteller", "manufacturer",
    "fitment", "passend für", "passend fuer", "passend", "suitable for", "kompatibel mit", "kompatibel",
    "moq",
    "warranty", "garantie", "warranty / garantie", "εγγύηση"
  ]);

  const resolvedInitialCatId = (() => {
    if (!product) return "";
    const rawCatId = product.category_id;
    if (rawCatId === "" || rawCatId === "none" || rawCatId === "unassigned") {
      return "";
    }
    const directId = product.category_id || (product as any)?.category?.id || (product as any)?.category?.slug;
    if (directId) {
      const match = categories.find(c => c.id.toLowerCase() === String(directId).toLowerCase() || c.slug.toLowerCase() === String(directId).toLowerCase());
      if (match) return match.id;
    }
    const normId = getProductNormalizedCategoryId(product);
    if (!normId) return "";
    const matchNorm = categories.find(c => c.id.toLowerCase() === normId.toLowerCase() || c.slug.toLowerCase() === normId.toLowerCase());
    if (matchNorm) return matchNorm.id;
    return "";
  })();

  const isSurround =
    isSurroundProduct(product) ||
    resolvedInitialCatId === "sicken" ||
    resolvedInitialCatId === "surround-repair" ||
    resolvedInitialCatId === "surrounds";

  const isCaseOrInlay =
    isCaseOrInlayProduct(product) ||
    resolvedInitialCatId === "koffer" ||
    resolvedInitialCatId === "inlays" ||
    resolvedInitialCatId === "cases";

  const requiresMasseAndMaterial = isSurround || isCaseOrInlay;

  // Build unified initial specs rows: loads all technical_specs directly into the editor table
  const initialSpecsRows: Array<{ key: string; value: string }> = [];
  const existingTechSpecs = (product?.technical_specs || (product as any)?.technical_specs);

  if (existingTechSpecs && typeof existingTechSpecs === "object" && Object.keys(existingTechSpecs).length > 0) {
    for (const [key, value] of Object.entries(existingTechSpecs)) {
      if (suppressedSpecKeys.has(key.toLowerCase().trim())) continue;
      const isBlankAllowed = key.toLowerCase().trim() === "maße" || key.toLowerCase().trim() === "masse" || key.toLowerCase().trim() === "dimensions" || key.toLowerCase().trim() === "material";
      if (value !== undefined && value !== null && (String(value).trim() !== "" || isBlankAllowed)) {
        initialSpecsRows.push({ key, value: String(value) });
      }
    }
    const hasKey = (k: string) => initialSpecsRows.some(r => r.key.toLowerCase().trim() === k.toLowerCase().trim());
    if (requiresMasseAndMaterial) {
      if (!hasKey("Maße") && !hasKey("Dimensions") && !hasKey("Abmessungen") && !hasKey("masse")) {
        initialSpecsRows.push({ key: "Maße", value: "" });
      }
      if (!hasKey("Material")) {
        initialSpecsRows.push({ key: "Material", value: "" });
      }
    }
    if (!hasKey("Ohm") && !hasKey("Impedanz") && initialOhm) {
      initialSpecsRows.push({ key: "Ohm", value: initialOhm });
    }
    if (!hasKey("Spule Durchmesser") && !hasKey("Spulendurchmesser") && !hasKey("Voice Coil") && initialCoil) {
      initialSpecsRows.push({ key: "Craft", value: initialCoil });
    }
    if (!hasKey("Part Number") && !hasKey("SKU") && initialPartNumber) {
      initialSpecsRows.push({ key: "Part Number", value: initialPartNumber });
    }
  } else {
    // New product or product without explicit technical_specs
    initialSpecsRows.push({ key: "Condition", value: "Brand New (Artisanal)" });
    if (requiresMasseAndMaterial) {
      initialSpecsRows.push({ key: "Maße", value: "" });
      initialSpecsRows.push({ key: "Material", value: "" });
    }
    if (initialOhm) initialSpecsRows.push({ key: "Ohm", value: initialOhm });
    if (initialCoil) initialSpecsRows.push({ key: "Craft", value: initialCoil });
    if (initialPartNumber) initialSpecsRows.push({ key: "Part Number", value: initialPartNumber });
    for (const [k, v] of Object.entries(specs)) {
      if (suppressedSpecKeys.has(k.toLowerCase().trim())) continue;
      const isBlankAllowed = k.toLowerCase().trim() === "maße" || k.toLowerCase().trim() === "masse" || k.toLowerCase().trim() === "dimensions" || k.toLowerCase().trim() === "material";
      if (!initialSpecsRows.some(r => r.key.toLowerCase().trim() === k.toLowerCase().trim()) && v !== undefined && v !== null && (String(v).trim() !== "" || isBlankAllowed)) {
        initialSpecsRows.push({ key: k, value: String(v) });
      }
    }
  }

  const initialTag = (product as any)?.tag || product?.seo_meta?.badge_text || "";
  const initialShippingRates = (product as any)?.shipping_rates || {};

  const [form, setForm] = useState({
    name: product?.name || "",
    slug: product?.slug || "",
    category_id: resolvedInitialCatId,
    short_desc: product?.short_desc || product?.shortDescription || "",
    featured_image: product?.featured_image || (product as any)?.mainImage || "",
    is_hidden: product?.is_hidden ?? false,
    is_featured: product?.is_featured ?? false,
    tag: initialTag,
    brand: initialBrand || "Wastram",
    partNumber: initialPartNumber,
    ohm: initialOhm,
    spule_durchmesser: initialCoil,
    fitment: "",
    applications: product?.applications || (product as any)?.fitsModels || "",
    tags: (product?.tags || []).join(", "),
    price: product?.price?.toString() || (product as any)?.variants?.[0]?.price?.toString() || "",
    shipping_rates: {
      de: initialShippingRates.de !== undefined ? String(initialShippingRates.de) : (initialShippingRates["DE"] !== undefined ? String(initialShippingRates["DE"]) : ""),
      eu: initialShippingRates.eu !== undefined ? String(initialShippingRates.eu) : (initialShippingRates["EU"] !== undefined ? String(initialShippingRates["EU"]) : ""),
      gb: initialShippingRates.gb !== undefined ? String(initialShippingRates.gb) : (initialShippingRates["GB"] !== undefined ? String(initialShippingRates["GB"]) : ""),
      us: initialShippingRates.us !== undefined ? String(initialShippingRates.us) : (initialShippingRates["US"] !== undefined ? String(initialShippingRates["US"]) : ""),
      ca: initialShippingRates.ca !== undefined ? String(initialShippingRates.ca) : (initialShippingRates["CA"] !== undefined ? String(initialShippingRates["CA"]) : ""),
      intl: initialShippingRates.intl !== undefined ? String(initialShippingRates.intl) : (initialShippingRates.world !== undefined ? String(initialShippingRates.world) : ""),
    },
    sort_order: product?.sort_order ?? 0,
    seo_meta: {
      title: product?.seo_meta?.title || "",
      description: product?.seo_meta?.description || "",
      hide_price: product?.seo_meta?.hide_price === true,
      badge_text: initialTag,
    },
    gallery: (() => {
      const explicitGallery: string[] = (Array.isArray((product as any)?.gallery) && (product as any).gallery.length > 0)
        ? (product as any).gallery
        : (Array.isArray((product as any)?.galleryImages) && (product as any).galleryImages.length > 0)
        ? (product as any).galleryImages.map((img: any) => typeof img === "string" ? img : img.url)
        : (Array.isArray((product as any)?.product_images) && (product as any).product_images.length > 0)
        ? (product as any).product_images.map((img: any) => img.url || img)
        : (Array.isArray((product as any)?.images) && (product as any).images.length > 0)
        ? (product as any).images.map((img: any) => typeof img === "string" ? img : img.url)
        : [];
      const feat = product?.featured_image || (product as any)?.mainImage || "";
      let res = [...explicitGallery];
      if (feat && !res.includes(feat)) {
        res = [feat, ...res];
      }
      return res;
    })()
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [isGalleryUploading, setIsGalleryUploading] = useState(false);

  const trimmedName = (form.name || "").trim();
  const duplicateProduct = existingProducts.find(p => {
    if (!trimmedName) return false;
    // When editing an existing product, ignore itself
    if (product?.id && (p.id === product.id || (p as any)._id === product.id)) return false;
    if (product?.slug && p.slug.toLowerCase() === product.slug.toLowerCase()) return false;
    return p.name.trim().toLowerCase() === trimmedName.toLowerCase();
  });
  const isDuplicateName = Boolean(duplicateProduct);

  const [specRows, setSpecRows] = useState<Array<{ key: string; value: string }>>(initialSpecsRows);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError("");

    if (isDuplicateName) {
      setFormError("This product title already exists. Please choose a distinct title.");
      setIsSubmitting(false);
      return;
    }

    try {
      const technical_specs: Record<string, string> = {};
      for (const { key, value } of specRows) {
        const k = key.trim();
        if (k && !suppressedSpecKeys.has(k.toLowerCase())) {
          technical_specs[k] = value.trim();
        }
      }

      // Sync top-level product schema attributes from technical_specs
      const extractedOhm = technical_specs["Ohm"] || technical_specs["ohm"] || technical_specs["Impedanz"] || technical_specs["Impedance"] || null;
      const extractedCoil = technical_specs["Craft"] || technical_specs["craft"] || technical_specs["Weave"] || null;
      const extractedPartNumber = technical_specs["Part Number"] || technical_specs["part number"] || technical_specs["SKU"] || technical_specs["sku"] || form.partNumber.trim() || product?.partNumber || null;

      const cleanSlug = generateProductSlug(form.name) || form.slug;

      const customShippingRates: Record<string, number> = {};
      if (form.shipping_rates.de.trim() !== "") customShippingRates.de = Math.max(0, parseFloat(form.shipping_rates.de) || 0);
      if (form.shipping_rates.eu.trim() !== "") customShippingRates.eu = Math.max(0, parseFloat(form.shipping_rates.eu) || 0);
      if (form.shipping_rates.gb.trim() !== "") customShippingRates.gb = Math.max(0, parseFloat(form.shipping_rates.gb) || 0);
      if (form.shipping_rates.us.trim() !== "") customShippingRates.us = Math.max(0, parseFloat(form.shipping_rates.us) || 0);
      if (form.shipping_rates.ca.trim() !== "") customShippingRates.ca = Math.max(0, parseFloat(form.shipping_rates.ca) || 0);
      if (form.shipping_rates.intl.trim() !== "") customShippingRates.intl = Math.max(0, parseFloat(form.shipping_rates.intl) || 0);

      let finalFeatured = form.featured_image || null;
      let finalGallery = form.gallery.filter(Boolean);

      if (finalFeatured && !finalGallery.includes(finalFeatured)) {
        finalGallery = [finalFeatured, ...finalGallery];
      }
      if (!finalFeatured && finalGallery.length > 0) {
        finalFeatured = finalGallery[0];
      }

      await onSave({
        id: product?.id,
        name: form.name,
        slug: cleanSlug,
        brand: product?.brand || "Wastram",
        partNumber: extractedPartNumber,
        category_id: form.category_id,
        short_desc: form.short_desc || null,
        shortDescription: form.short_desc || null,
        long_desc: (product as any)?.long_desc || (product as any)?.descriptionHtml || null,
        featured_image: finalFeatured,
        is_hidden: form.is_hidden,
        is_featured: form.is_featured,
        tag: form.tag ? (form.tag as any) : undefined,
        applications: form.applications || null,
        fitsModels: null,
        ohm: extractedOhm,
        spule_durchmesser: extractedCoil,
        tags: form.tags ? form.tags.split(",").map(t => t.trim()).filter(Boolean) : [],
        price: form.price ? parseFloat(form.price) : null,
        technical_specs: Object.keys(technical_specs).length > 0 ? technical_specs : null,
        shipping_rates: Object.keys(customShippingRates).length > 0 ? customShippingRates : null,
        sort_order: form.sort_order,
        seo_meta: {
          title: form.seo_meta.title || "",
          description: form.seo_meta.description || "",
          hide_price: form.seo_meta.hide_price,
          badge_text: form.tag || null,
          speaker_compatibility: null,
        },
        gallery: finalGallery,
      });
    } catch (err: any) {
      setFormError(err.message || "Error beim Save des Products");
    } finally {
      setIsSubmitting(false);
    }
  };

  const cardClass = "bg-white border-2 border-neutral-200 rounded-2xl p-5 space-y-4 shadow-xs";
  const labelTextClass = "block text-xs font-heading font-black text-black uppercase tracking-wider mb-1.5";
  const textInputClass = "w-full bg-white border-2 border-neutral-200 focus:border-black rounded-xl px-4 py-2.5 text-xs text-black placeholder:text-neutral-400 font-medium outline-none transition-colors";

  return (
    <AdminDrawer
      isOpen={true}
      onClose={onClose}
      title={product?.id ? "Edit Product" : "Add New Product"}
      subtitle="Customize title, prices, images, colorways, fabric specifications, and visibility."
      maxWidthClass="max-w-4xl"
      backLabel="Back zu den Productsn"
    >
      <form onSubmit={handleSubmit} className="space-y-5 text-xs font-sans">
        {/* Card 1: Product Basics */}
        <div className={cardClass}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelTextClass}>Product Title *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={e => {
                  const val = e.target.value;
                  const autoSlug = generateProductSlug(val);
                  setForm({ ...form, name: val, slug: autoSlug });
                }}
                className={`${textInputClass} ${isDuplicateName ? "border-red-500 focus:border-red-600 bg-red-50/30" : ""}`}
                placeholder="z. B. 76,2 mm Titan-Membran"
              />
              {isDuplicateName && (
                <div className="mt-1.5 flex items-center gap-1.5 text-xs text-red-600 font-semibold animate-fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>This product title already exists. Please choose a distinct title.</span>
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-heading font-black text-black uppercase tracking-wider">Category *</label>
                {onOpenSelectExisting && (
                  <button
                    type="button"
                    onClick={onOpenSelectExisting}
                    className="text-[11px] font-heading font-bold text-neutral-600 hover:text-black underline cursor-pointer"
                  >
                    Import from catalog as sample style →
                  </button>
                )}
              </div>
              <select
                value={form.category_id}
                onChange={e => {
                  const newCat = e.target.value;
                  setForm({ ...form, category_id: newCat });
                  const isNewCatSurround = newCat === "sicken" || newCat === "surround-repair" || newCat.toLowerCase().includes("sicken") || newCat.toLowerCase().includes("surround");
                  const isNewCatCaseOrInlay = newCat === "koffer" || newCat === "inlays" || newCat === "cases" || newCat.toLowerCase().includes("koffer") || newCat.toLowerCase().includes("inlay") || newCat.toLowerCase().includes("case");
                  if (isNewCatSurround || isNewCatCaseOrInlay) {
                    setSpecRows(prev => {
                      const next = [...prev];
                      if (!next.some(r => r.key.toLowerCase().trim() === "maße" || r.key.toLowerCase().trim() === "dimensions" || r.key.toLowerCase().trim() === "abmessungen" || r.key.toLowerCase().trim() === "masse")) {
                        next.push({ key: "Maße", value: "" });
                      }
                      if (!next.some(r => r.key.toLowerCase().trim() === "material")) {
                        next.push({ key: "Material", value: "" });
                      }
                      return next;
                    });
                  }
                }}
                className={textInputClass}
              >
                <option value="">⚠️ No Category Assigned (Remove)</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>


          <div>
            <label className={labelTextClass}>Kurzbeschreibung</label>
            <textarea
              rows={2}
              value={form.short_desc}
              onChange={e => setForm({ ...form, short_desc: e.target.value })}
              className={`${textInputClass} resize-none`}
              placeholder="Brief product summary for catalog and search cards..."
            />
          </div>
        </div>

        {/* Card 2: Pricing */}
        <div className={cardClass}>
          <div>
            <label className={labelTextClass}>Price in EUR (₹)</label>
            <input
              type="text"
              inputMode="decimal"
              value={form.price}
              onChange={e => {
                const val = e.target.value.replace(/[^0-9.,]/g, "").replace(",", ".");
                setForm({ ...form, price: val });
              }}
              className={textInputClass}
              placeholder="0.00 (leer lassen für Auf Anfrage)"
            />
          </div>
        </div>

        {/* Card 2b: Product-Specific Shipping Rates (Optional) */}
        <div className={cardClass}>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Truck className="w-4 h-4 text-[#3628e6]" />
              <label className={labelTextClass}>Custom Shipping Fee for this Style (Optional)</label>
            </div>
            <p className="text-[11px] text-neutral-500 font-medium">
              By default, standard zone rates apply. Enter custom amounts only if this garment has special packaging or express rates. Leave blank for standard rates.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
            <div>
              <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                🇮🇳 Domestic India (₹)
              </label>
              <input
                type="text"
                inputMode="decimal"
                value={form.shipping_rates.de}
                onChange={e => {
                  const val = e.target.value.replace(/[^0-9.,]/g, "").replace(",", ".");
                  setForm({ ...form, shipping_rates: { ...form.shipping_rates, de: val } });
                }}
                className={textInputClass}
                placeholder="0.00 (Standard: Gratis)"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                🇪🇺 EU-Mitgliedstaaten (₹)
              </label>
              <input
                type="text"
                inputMode="decimal"
                value={form.shipping_rates.eu}
                onChange={e => {
                  const val = e.target.value.replace(/[^0-9.,]/g, "").replace(",", ".");
                  setForm({ ...form, shipping_rates: { ...form.shipping_rates, eu: val } });
                }}
                className={textInputClass}
                placeholder="z. B. 9.95"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                🇬🇧 Großbritannien (₹)
              </label>
              <input
                type="text"
                inputMode="decimal"
                value={form.shipping_rates.gb}
                onChange={e => {
                  const val = e.target.value.replace(/[^0-9.,]/g, "").replace(",", ".");
                  setForm({ ...form, shipping_rates: { ...form.shipping_rates, gb: val } });
                }}
                className={textInputClass}
                placeholder="z. B. 11.95"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                🇺🇸 USA (₹)
              </label>
              <input
                type="text"
                inputMode="decimal"
                value={form.shipping_rates.us}
                onChange={e => {
                  const val = e.target.value.replace(/[^0-9.,]/g, "").replace(",", ".");
                  setForm({ ...form, shipping_rates: { ...form.shipping_rates, us: val } });
                }}
                className={textInputClass}
                placeholder="z. B. 14.95"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                🇨🇦 Kanada (₹)
              </label>
              <input
                type="text"
                inputMode="decimal"
                value={form.shipping_rates.ca}
                onChange={e => {
                  const val = e.target.value.replace(/[^0-9.,]/g, "").replace(",", ".");
                  setForm({ ...form, shipping_rates: { ...form.shipping_rates, ca: val } });
                }}
                className={textInputClass}
                placeholder="z. B. 14.95"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                🌐 Rest der Welt (₹)
              </label>
              <input
                type="text"
                inputMode="decimal"
                value={form.shipping_rates.intl}
                onChange={e => {
                  const val = e.target.value.replace(/[^0-9.,]/g, "").replace(",", ".");
                  setForm({ ...form, shipping_rates: { ...form.shipping_rates, intl: val } });
                }}
                className={textInputClass}
                placeholder="z. B. 19.95"
              />
            </div>
          </div>
        </div>

        {/* Card 3: Unified Product Media & Gallery Manager */}
        <div className={cardClass}>
          <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
            <div>
              <label className={labelTextClass}>Product-Imageer & Medien ({form.gallery.length})</label>
              <p className="text-[11px] text-neutral-500 font-medium -mt-0.5">
                Manage all product images. The starred image is the primary cover image displayed in the store.
              </p>
            </div>
            {form.featured_image && (
              <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-black px-2.5 py-1 rounded-full flex items-center gap-1 shadow-xs">
                <Star className="w-3 h-3 fill-black" /> 1 Hauptbild aktiv
              </span>
            )}
          </div>

          {/* Upload Drop Zone & Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div
              onDragOver={e => e.preventDefault()}
              onDrop={async e => {
                e.preventDefault();
                const files = Array.from(e.dataTransfer.files);
                if (files.length === 0) return;
                setIsGalleryUploading(true);
                try {
                  const urls: string[] = [];
                  for (const file of files) {
                    const optimized = await optimizeImageFile(file);
                    const formData = new FormData();
                    formData.append("file", optimized);
                    const res = await adminFetch("/api/uploads", { method: "POST", body: formData });
                    const json = await res.json();
                    if (!res.ok || !json.url) {
                      throw new Error(json?.error || `Upload fehlgeschlagen für ${file.name}`);
                    }
                    urls.push(json.url);
                  }
                  setForm(prev => {
                    const updated = [...prev.gallery, ...urls];
                    const newFeatured = prev.featured_image || urls[0] || "";
                    return { ...prev, gallery: updated, featured_image: newFeatured };
                  });
                  notifyAdmin("success", "Media Uploaded", `${urls.length} file(s) uploaded successfully.`);
                } catch (err: any) {
                  notifyAdmin("error", "Upload fehlgeschlagen", err.message || String(err), err);
                } finally {
                  setIsGalleryUploading(false);
                }
              }}
              onClick={() => {
                const input = document.createElement("input");
                input.type = "file";
                input.multiple = true;
                input.accept = "image/*,video/*";
                input.onchange = async () => {
                  if (!input.files || input.files.length === 0) return;
                  setIsGalleryUploading(true);
                  try {
                    const urls: string[] = [];
                    for (const file of Array.from(input.files)) {
                      const optimized = await optimizeImageFile(file);
                      const formData = new FormData();
                      formData.append("file", optimized);
                      const res = await adminFetch("/api/uploads", { method: "POST", body: formData });
                      const json = await res.json();
                      if (!res.ok || !json.url) {
                        throw new Error(json?.error || `Upload failed for ${file.name}`);
                      }
                      urls.push(json.url);
                    }
                    setForm(prev => {
                      const updated = [...prev.gallery, ...urls];
                      const newFeatured = prev.featured_image || urls[0] || "";
                      return { ...prev, gallery: updated, featured_image: newFeatured };
                    });
                    notifyAdmin("success", "Media Uploaded", `${urls.length} file(s) uploaded successfully.`);
                  } catch (err: any) {
                    notifyAdmin("error", "Upload fehlgeschlagen", err.message || String(err), err);
                  } finally {
                    setIsGalleryUploading(false);
                  }
                };
                input.click();
              }}
              className="sm:col-span-2 border-2 border-dashed border-neutral-300 hover:border-black rounded-xl p-4 flex flex-col items-center justify-center bg-white transition-colors cursor-pointer group"
            >
              <Upload className="w-5 h-5 text-black stroke-[2] mb-1 group-hover:scale-110 transition-transform" />
              <p className="text-xs font-heading font-bold uppercase tracking-wider text-black text-center">
                {isGalleryUploading ? "Uploading photoshoot files..." : "Drop images here or click to upload"}
              </p>
              <p className="text-[11px] text-neutral-500 mt-0.5">JPG, PNG, WEBP oder MP4 • Mehrfachauswahl möglich</p>
            </div>

            {/* Direct URL input */}
            <div className="border-2 border-neutral-200 rounded-xl p-3 bg-neutral-50 flex flex-col justify-between">
              <div>
                <label className="block text-[10px] font-heading font-bold text-neutral-600 uppercase tracking-wider mb-1">
                  Oder Image-URL einfügen
                </label>
                <input
                  type="text"
                  id="direct-image-url-input"
                  className="w-full bg-white border border-neutral-300 focus:border-black rounded-lg px-2.5 py-1.5 text-xs text-black outline-none transition-colors"
                  placeholder="https://..."
                  onKeyDown={e => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const val = (e.currentTarget.value || "").trim();
                      if (val) {
                        setForm(prev => {
                          const updated = prev.gallery.includes(val) ? prev.gallery : [...prev.gallery, val];
                          return { ...prev, gallery: updated, featured_image: prev.featured_image || val };
                        });
                        e.currentTarget.value = "";
                      }
                    }
                  }}
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById("direct-image-url-input") as HTMLInputElement;
                  if (el && el.value.trim()) {
                    const val = el.value.trim();
                    setForm(prev => {
                      const updated = prev.gallery.includes(val) ? prev.gallery : [...prev.gallery, val];
                      return { ...prev, gallery: updated, featured_image: prev.featured_image || val };
                    });
                    el.value = "";
                  }
                }}
                className="mt-2 w-full bg-black hover:bg-neutral-800 text-white text-[11px] font-heading font-bold uppercase tracking-wider py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                + Add Image URL
              </button>
            </div>
          </div>

          {/* Media Tiles Grid */}
          {form.gallery.length === 0 ? (
            <div className="py-8 text-center text-neutral-400 border border-neutral-100 rounded-xl bg-neutral-50/50">
              <p className="text-xs font-medium">No images attached yet. Upload photos above.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 pt-2">
              {form.gallery.map((url: string, idx: number) => {
                const isVideo = url.startsWith("data:video/") || url.endsWith(".mp4") || url.endsWith(".webm") || url.endsWith(".ogg");
                const isMain = form.featured_image ? form.featured_image === url : idx === 0;

                return (
                  <div
                    key={`${url}-${idx}`}
                    className={`relative rounded-xl border-2 bg-white p-2 aspect-square flex flex-col items-center justify-between overflow-hidden group transition-all shadow-xs ${
                      isMain ? "border-amber-500 ring-2 ring-amber-400/40" : "border-neutral-200 hover:border-black"
                    }`}
                  >
                    {/* Top badges & controls */}
                    <div className="absolute top-1.5 left-1.5 right-1.5 z-10 flex items-center justify-between pointer-events-none">
                      {isMain ? (
                        <span className="bg-amber-500 text-black text-[9px] font-black uppercase px-2 py-0.5 rounded shadow-sm flex items-center gap-1 pointer-events-auto">
                          <Star className="w-2.5 h-2.5 fill-black" /> Hauptbild
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setForm(prev => {
                              const rest = prev.gallery.filter((_, i) => i !== idx);
                              return { ...prev, featured_image: url, gallery: [url, ...rest] };
                            });
                          }}
                          className="bg-white/95 hover:bg-black hover:text-white text-neutral-800 text-[9px] font-bold uppercase px-2 py-0.5 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer pointer-events-auto"
                          title="Als Hauptbild festlegen"
                        >
                          Als Hauptbild
                        </button>
                      )}

                      <div className="flex items-center gap-1 pointer-events-auto">
                        {/* Replace image button */}
                        <label
                          className="bg-white/95 hover:bg-black hover:text-white text-neutral-800 rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          title="Dieses Image austauschen"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <input
                            type="file"
                            accept="image/*,video/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              setIsGalleryUploading(true);
                              try {
                                const optimized = await optimizeImageFile(file);
                                const formData = new FormData();
                                formData.append("file", optimized);
                                const res = await adminFetch("/api/uploads", { method: "POST", body: formData });
                                const json = await res.json();
                                if (!res.ok || !json.url) {
                                  throw new Error(json?.error || "Upload fehlgeschlagen");
                                }
                                const newUrl = json.url;
                                setForm(prev => {
                                  const updatedGallery = [...prev.gallery];
                                  updatedGallery[idx] = newUrl;
                                  const updatedFeatured = (isMain || prev.featured_image === url) ? newUrl : prev.featured_image;
                                  return { ...prev, gallery: updatedGallery, featured_image: updatedFeatured };
                                });
                                notifyAdmin("success", "Image Replaced", "Product image replaced successfully.");
                              } catch (err: any) {
                                notifyAdmin("error", "Ersetzen fehlgeschlagen", err.message || String(err), err);
                              } finally {
                                setIsGalleryUploading(false);
                              }
                            }}
                          />
                        </label>

                        {/* Delete image button */}
                        <button
                          type="button"
                          onClick={() => {
                            setForm(prev => {
                              const updatedGallery = prev.gallery.filter((_, i) => i !== idx);
                              let updatedFeatured = prev.featured_image;
                              if (updatedFeatured === url) {
                                updatedFeatured = updatedGallery.length > 0 ? updatedGallery[0] : "";
                              }
                              return { ...prev, gallery: updatedGallery, featured_image: updatedFeatured };
                            });
                          }}
                          className="bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-sm cursor-pointer transition-colors"
                          title="Remove Image"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Preview Content */}
                    <div className="w-full h-full flex items-center justify-center p-2 pt-6">
                      {isVideo ? (
                        <video src={url} className="max-h-full max-w-full object-contain rounded" muted playsInline />
                      ) : (
                        <img src={url} alt={`Productbild ${idx + 1}`} className="max-h-full max-w-full object-contain rounded" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Card 5: Technical Specifications */}
        <div className={cardClass}>
          <div className="flex items-center justify-between pb-1 border-b border-neutral-100">
            <div>
              <label className={labelTextClass}>Craft & Technical Specifications</label>
              <p className="text-[11px] text-neutral-500 font-medium -mt-0.5">
                All attributes listed here will render directly in the Product Detail specification drawer on the live store.
              </p>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-black text-white px-2.5 py-1 rounded-full flex-shrink-0">
              OEM Spec Table
            </span>
          </div>

          <SpecBuilder specs={specRows} onChange={setSpecRows} />
        </div>


        {/* Card 7: Display, Status & Shop Flag Badge */}
        <div className={cardClass}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={labelTextClass}>Visibility</label>
              <select
                value={form.is_hidden ? "hidden" : "visible"}
                onChange={e => setForm({ ...form, is_hidden: e.target.value === "hidden" })}
                className={textInputClass}
              >
                <option value="visible">Visible in Store (Published)</option>
                <option value="hidden">Hidden in Store (Draft)</option>
              </select>
            </div>
            <div>
              <label className={labelTextClass}>Hervorgehoben</label>
              <select
                value={form.is_featured ? "yes" : "no"}
                onChange={e => setForm({ ...form, is_featured: e.target.value === "yes" })}
                className={textInputClass}
              >
                <option value="no">No</option>
                <option value="yes">Yes (Hervorgehoben)</option>
              </select>
            </div>
            <div>
              <label className={labelTextClass}>Display Order</label>
              <input
                type="text"
                inputMode="numeric"
                value={form.sort_order !== undefined && form.sort_order !== null ? form.sort_order : ""}
                onChange={e => {
                  const val = e.target.value.replace(/[^0-9]/g, "");
                  setForm({ ...form, sort_order: val as any });
                }}
                placeholder="0"
                className={textInputClass}
              />
            </div>
          </div>

          <div className="pt-2 border-t border-neutral-100 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelTextClass}>Store Corner Ribbon Badge (e.g. Signature, Handcrafted, Bestseller)</label>
                <select
                  value={
                    form.tag === "SALE" || form.tag === "BESTSELLER" || form.tag === "POPULAR" || !form.tag
                      ? form.tag
                      : "CUSTOM"
                  }
                  onChange={e => {
                    const val = e.target.value;
                    if (val === "CUSTOM") {
                      if (!form.tag || form.tag === "SALE" || form.tag === "BESTSELLER" || form.tag === "POPULAR") {
                        setForm({ ...form, tag: "NEW" });
                      }
                    } else {
                      setForm({ ...form, tag: val });
                    }
                  }}
                  className={textInputClass}
                >
                  <option value="">No Badge</option>
                  <option value="SALE">SALE (Blaues Wastram Flag-Badge)</option>
                  <option value="BESTSELLER">BESTSELLER (Schwarzes Flag-Badge mit Wastram-Punkt)</option>
                  <option value="POPULAR">POPULAR (Schwarzes Flag-Badge)</option>
                  <option value="CUSTOM">Benutzerdefinierter Text...</option>
                </select>
              </div>

              <div>
                <label className={labelTextClass}>Badge-Text</label>
                <input
                  type="text"
                  value={form.tag}
                  onChange={e => setForm({ ...form, tag: e.target.value.toUpperCase() })}
                  className={textInputClass}
                  placeholder="z. B. SALE, BESTSELLER, POPULAR, EXKLUSIV"
                />
              </div>
            </div>

            {/* Live Flag Badge Preview */}
            {form.tag && (
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-neutral-50 border border-neutral-200">
                <span className="text-xs font-bold text-neutral-600">Live Preview:</span>
                <span
                  className={`inline-flex items-center text-white text-[10px] font-heading font-black uppercase tracking-wider px-3 py-1 rounded shadow-xs ${
                    form.tag === "SALE" ? "bg-[#3628e6]" : "bg-black"
                  }`}
                >
                  {form.tag === "BESTSELLER" && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3628e6] inline-block mr-1.5 ring-1 ring-white/50" />
                  )}
                  {form.tag}
                </span>
                <span className="text-[11px] text-neutral-400 font-medium">
                  (Displayed on product cards and detail page)
                </span>
              </div>
            )}
          </div>
        </div>

        {formError && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-xl text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span className="font-medium leading-relaxed">{formError}</span>
          </div>
        )}

        {/* Actions Toolbar */}
        <div className="flex items-center justify-end gap-3 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border-2 border-neutral-300 hover:border-black text-black text-xs font-heading font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl bg-black hover:bg-neutral-800 disabled:opacity-50 text-white text-xs font-heading font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin stroke-[2]" />
                <span>Save...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 stroke-[2]" />
                <span>{product ? "Save Changes" : "Create Product"}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </AdminDrawer>
  );
}

// ═══════════════════════════════════════════════════════════════════
// PRODUCT DETAIL EDITOR (Variants, Images, Downloads, FAQs)
// ═══════════════════════════════════════════════════════════════════
function ProductDetailEditor({ product, variants, images, downloads, faqs, categories, onBack, onSaveProduct, onSaveVariant, onDeleteVariant, onAddPartNumber, onDeletePartNumber, onAddImage, onDeleteImage, onAddDownload, onDeleteDownload, onAddFaq, onDeleteFaq, onUploadMedia, isUploading, onEditProduct, onDeleteProduct }: {
  product: Product;
  variants: Variant[];
  images: ProductImage[];
  downloads: DownloadItem[];
  faqs: FAQ[];
  categories: Category[];
  onBack: () => void;
  onSaveProduct: (data: Partial<Product>) => Promise<void>;
  onSaveVariant: (variant: Partial<Variant>) => Promise<void>;
  onDeleteVariant: (id: string) => Promise<void>;
  onAddPartNumber: (variantId: string, code: string) => Promise<void>;
  onDeletePartNumber: (id: string) => Promise<void>;
  onAddImage: (productId: string, url: string, altText: string) => Promise<void>;
  onDeleteImage: (id: string, url?: string) => Promise<void>;
  onAddDownload: (productId: string, type: string, url: string, title: string) => Promise<void>;
  onDeleteDownload: (id: string) => Promise<void>;
  onAddFaq: (productId: string, question: string, answer: string) => Promise<void>;
  onDeleteFaq: (id: string) => Promise<void>;
  onUploadMedia: (productId: string, files: FileList | null) => Promise<void>;
  isUploading: boolean;
  onEditProduct: (prod: Product) => void;
  onDeleteProduct?: (prod: Product) => void;
}) {
  const [activeSection, setActiveSection] = useState<"variants" | "images" | "downloads" | "faqs">("variants");

  // Variant form
  const [showVariantForm, setShowVariantForm] = useState(false);
  const [variantForm, setVariantForm] = useState({ name: "", specs: "{}", stock: "", price: "", sort_order: 0 });
  const [editingVariantId, setEditingVariantId] = useState<string | null>(null);

  // Part number input
  const [pnInput, setPnInput] = useState<Record<string, string>>({});

  // Image form
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");

  // Download form
  const [dlType, setDlType] = useState("datasheet");
  const [dlUrl, setDlUrl] = useState("");
  const [dlTitle, setDlTitle] = useState("");

  // FAQ form
  const [faqQ, setFaqQ] = useState("");
  const [faqA, setFaqA] = useState("");

  const handleSaveVariant = async () => {
    let specs: Record<string, string> = {};
    try { specs = JSON.parse(variantForm.specs); } catch { specs = {}; }
    await onSaveVariant({
      id: editingVariantId || undefined,
      product_id: product.id,
      name: variantForm.name,
      specs,
      stock: variantForm.stock ? parseInt(variantForm.stock) : null,
      price: variantForm.price ? parseFloat(variantForm.price) : null,
      sort_order: variantForm.sort_order,
    });
    setShowVariantForm(false);
    setEditingVariantId(null);
    setVariantForm({ name: "", specs: "{}", stock: "", price: "", sort_order: 0 });
  };

  const startEditVariant = (v: Variant) => {
    setVariantForm({
      name: v.name,
      specs: JSON.stringify(v.specs, null, 2),
      stock: v.stock?.toString() || "",
      price: v.price?.toString() || "",
      sort_order: v.sort_order,
    });
    setEditingVariantId(v.id);
    setShowVariantForm(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back + Header */}
      <div className="bg-white rounded-2xl shadow-xs border-0 p-6">
        <button onClick={onBack} className="flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-black mb-4 uppercase tracking-wider cursor-pointer">
          <ArrowLeft className="w-4 h-4" /> Back zu den Productsn
        </button>
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-widest">
              {(() => {
                const normCatId = getProductNormalizedCategoryId(product);
                if (!normCatId) {
                  return <span className="text-red-600 font-bold">⚠️ Unassigned Category</span>;
                }
                const cat = categories.find(c => c.id.toLowerCase() === normCatId.toLowerCase() || c.slug.toLowerCase() === normCatId.toLowerCase());
                return <span className="text-slate-800">{cat?.name || normCatId}</span>;
              })()}
            </p>
            <div className="flex items-center gap-3">
              <h2 className="font-display text-xl font-extrabold text-foreground">{product.name}</h2>
              <button
                onClick={() => onEditProduct(product)}
                className="flex items-center gap-1 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider rounded border border-border bg-card text-muted-foreground hover:text-foreground hover:border-foreground cursor-pointer"
                title="Edit Product Info"
              >
                <Edit className="w-3 h-3" /> Edit Info
              </button>
              {onDeleteProduct && (
                <button
                  type="button"
                  onClick={() => onDeleteProduct(product)}
                  className="flex items-center gap-1 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider rounded border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:border-red-400 cursor-pointer transition-colors"
                  title="Permanently Delete Product"
                >
                  <Trash2 className="w-3 h-3" /> Delete Product
                </button>
              )}
            </div>
            <a
              href={`/${product.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-muted-foreground hover:text-foreground font-mono inline-flex items-center gap-1 group transition-colors"
              title="View product live in store"
            >
              <span>/{product.slug}</span>
              <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100" />
            </a>
          </div>
          {product.featured_image && (
            <img src={product.featured_image} alt={product.name} className="w-16 h-16 rounded-lg object-cover border border-border" />
          )}
        </div>
      </div>

      {/* Section Tabs */}
      <div className="flex gap-2 flex-wrap">
        {[
          { id: "variants", label: "Color Variants & SKUs", icon: Tag },
          { id: "images", label: "Image Gallery", icon: ImageIcon },
          { id: "downloads", label: "Downloads", icon: Download },
          { id: "faqs", label: "Häufige Fragen (FAQ)", icon: HelpCircle },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id as typeof activeSection)}
            className={`flex items-center gap-1.5 px-4 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg border transition-all cursor-pointer ${
              activeSection === tab.id
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-muted-foreground border-border hover:border-foreground hover:text-foreground"
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" /> {tab.label}
          </button>
        ))}
      </div>

      {/* ─── VARIANTS SECTION ──────────────────────────────────────── */}
      {activeSection === "variants" && (
        <div className="bg-card text-card-foreground rounded-2xl shadow-xs border border-border p-6 space-y-6">
          <div className="flex justify-between items-center border-b border-border pb-4">
            <h3 className="font-display text-sm font-bold text-foreground uppercase tracking-wider">Color Variants ({variants.length})</h3>
            <button onClick={() => { setEditingVariantId(null); setVariantForm({ name: "", specs: '{\n  "Size": "",\n  "Material": "",\n  "Power": ""\n}', stock: "", price: "", sort_order: variants.length }); setShowVariantForm(true); }} className={btnPrimary}>
              <Plus className="w-3.5 h-3.5" /> ADD COLORWAY / VARIANT
            </button>
          </div>

          {showVariantForm && (
            <div className="border border-border rounded-lg p-4 space-y-3 bg-muted/30">
              <h4 className="text-xs font-bold text-foreground uppercase">{editingVariantId ? "Edit Color Variant" : "New Color Variant"}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormField label="Color Variantsname" required>
                  <input type="text" value={variantForm.name} onChange={e => setVariantForm({ ...variantForm, name: e.target.value })} className={inputClass} placeholder="z. B. Kupfer" />
                </FormField>
                <div className="grid grid-cols-2 gap-3">
                  <FormField label="Price (₹)">
                    <input type="text" value={variantForm.price} onChange={e => setVariantForm({ ...variantForm, price: e.target.value })} className={inputClass} placeholder="0.00" />
                  </FormField>
                  <FormField label="Inventory">
                    <input type="text" value={variantForm.stock} onChange={e => setVariantForm({ ...variantForm, stock: e.target.value })} className={inputClass} placeholder="Stock Units" />
                  </FormField>
                </div>
              </div>
              <FormField label="Spezifikationen (JSON)">
                <textarea rows={5} value={variantForm.specs} onChange={e => setVariantForm({ ...variantForm, specs: e.target.value })} className={`${inputClass} font-mono text-[10px] resize-none`} />
              </FormField>
              <div className="flex gap-2 justify-end">
                <button onClick={() => setShowVariantForm(false)} className={btnSecondary}>Cancel</button>
                <button onClick={handleSaveVariant} className={btnPrimary}><Save className="w-3.5 h-3.5" /> Save</button>
              </div>
            </div>
          )}

          {variants.length === 0 ? (
            <p className="text-xs text-slate-700 font-medium text-center py-8">No color variants added yet. Click above to add a colorway.</p>
          ) : (
            <div className="space-y-4">
              {variants.map(v => (
                <div key={v.id} className="border border-border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-bold text-foreground">{v.name}</h4>
                      <div className="flex gap-3 mt-1 text-[10px] text-muted-foreground font-medium">
                        {v.price && <span>Price: <strong className="text-foreground font-numbers">₹{v.price}</strong></span>}
                        {v.stock !== null && <span>Inventory: <strong className="text-foreground">{v.stock}</strong></span>}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => startEditVariant(v)} className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"><Edit className="w-3.5 h-3.5" /></button>
                      <button onClick={() => onDeleteVariant(v.id)} className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>

                  {/* Specs table */}
                  {v.specs && Object.keys(v.specs).length > 0 && (
                    <div className="bg-muted/30 rounded-lg p-3">
                      <table className="w-full text-[10px]">
                        <tbody>
                          {Object.entries(v.specs).map(([key, val]) => (
                            <tr key={key} className="border-b border-border last:border-0">
                              <td className="py-1.5 pr-4 text-muted-foreground font-medium">{key}</td>
                              <td className="py-1.5 text-foreground font-semibold">{String(val)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Part Numbers */}
                  <div>
                    <p className="text-[9px] font-bold text-foreground uppercase tracking-wider mb-2">SKU Numbers</p>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {(v.part_numbers || []).map(pn => (
                        <span key={pn.id} className="inline-flex items-center gap-1 text-[10px] bg-muted border border-border rounded px-2 py-1 font-mono text-foreground">
                          {pn.code}
                          <button onClick={() => onDeletePartNumber(pn.id)} className="text-muted-foreground hover:text-destructive cursor-pointer"><X className="w-3 h-3" /></button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input type="text" value={pnInput[v.id] || ""} onChange={e => setPnInput({ ...pnInput, [v.id]: e.target.value })} className={`${inputClass} flex-1`} placeholder="Add SKU / Barcode..." onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); if (pnInput[v.id]) { onAddPartNumber(v.id, pnInput[v.id]); setPnInput({ ...pnInput, [v.id]: "" }); } } }} />
                      <button onClick={() => { if (pnInput[v.id]) { onAddPartNumber(v.id, pnInput[v.id]); setPnInput({ ...pnInput, [v.id]: "" }); } }} className={btnSecondary}><Plus className="w-3.5 h-3.5" /> Add</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── IMAGES SECTION ────────────────────────────────────────── */}
      {activeSection === "images" && (
        <div className="bg-card text-card-foreground border border-border rounded-2xl p-6 space-y-6">
          <h3 className="font-display text-sm font-bold text-foreground uppercase tracking-wider border-b border-border pb-4">Galerie-Imageer ({images.length})</h3>
          <div className="flex gap-3 flex-wrap">
            <input type="text" value={imageUrl} onChange={e => setImageUrl(e.target.value)} className={`${inputClass} flex-1 min-w-[220px]`} placeholder="Image-URL..." />
            <input type="text" value={imageAlt} onChange={e => setImageAlt(e.target.value)} className={`${inputClass} w-[180px]`} placeholder="Alt-Text..." />
            <button onClick={() => { if (imageUrl) { onAddImage(product.id, imageUrl, imageAlt); setImageUrl(""); setImageAlt(""); } }} className={btnPrimary}><Plus className="w-3.5 h-3.5" /> Add URL</button>
            <label className={`${btnSecondary} cursor-pointer`}>
              <Upload className="w-3.5 h-3.5" /> {isUploading ? "Uploading..." : "Upload Media"}
              <input type="file" multiple accept="image/*,video/*" className="hidden" onChange={(e) => onUploadMedia(product.id, e.target.files)} />
            </label>
          </div>
          {images.length === 0 ? (
            <p className="text-xs text-slate-700 font-medium text-center py-8">No gallery photoshoot images added yet. Add image URLs above.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {images.map((img, idx) => {
                const isFeatured = (product as any)?.featured_image === img.url || (product as any)?.mainImage === img.url || idx === 0;
                return (
                  <div key={img.id} className={`relative group rounded-xl overflow-hidden border-2 bg-white ${isFeatured ? "border-amber-500 ring-2 ring-amber-400/40" : "border-[#EAEAEA]"}`}>
                    <img src={img.url} alt={img.alt_text || ""} className="w-full aspect-square object-contain p-1" />
                    {isFeatured ? (
                      <span className="absolute top-2 left-2 z-10 bg-amber-500 text-black text-[9px] font-black uppercase px-2 py-0.5 rounded shadow flex items-center gap-1">
                        <Star className="w-3 h-3 fill-black" /> Hauptbild
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={async () => {
                          await onSaveProduct({ featured_image: img.url });
                        }}
                        className="absolute top-2 left-2 z-10 bg-black/80 hover:bg-black text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        title="Als Hauptbild festlegen"
                      >
                        Als Hauptbild
                      </button>
                    )}
                    <div className="absolute top-2 right-2 flex items-center gap-1 z-10">
                      <label
                        className="w-6 h-6 rounded-full bg-black/80 hover:bg-black text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow"
                        title="Image austauschen"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <input
                          type="file"
                          accept="image/*,video/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            try {
                              const optimized = await optimizeImageFile(file);
                              const formData = new FormData();
                              formData.append("file", optimized);
                              const res = await adminFetch("/api/uploads", { method: "POST", body: formData });
                              const json = await res.json();
                              if (!res.ok || !json?.url) {
                                throw new Error(json?.error || "Image-Upload fehlgeschlagen");
                              }
                              await adminFetch("/api/product-images", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ product_id: product.id, url: json.url, replace_url: img.url })
                              });
                              if (isFeatured) {
                                await onSaveProduct({ featured_image: json.url });
                              } else {
                                await onSaveProduct({});
                              }
                              notifyAdmin("success", "Image Replaced", "Product image replaced successfully.");
                            } catch (err: any) {
                              notifyAdmin("error", "Ersetzen fehlgeschlagen", err.message || String(err), err);
                            }
                          }}
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => onDeleteImage(img.id, img.url)}
                        className="w-6 h-6 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow"
                        title="Delete Image"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {img.alt_text && <p className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-[8px] px-2 py-1 truncate">{img.alt_text}</p>}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ─── DOWNLOADS SECTION ─────────────────────────────────────── */}
      {activeSection === "downloads" && (
        <div className="bg-card text-card-foreground border border-border rounded-2xl p-6 space-y-6">
          <h3 className="font-display text-sm font-bold text-foreground uppercase tracking-wider border-b border-border pb-4">Downloads ({downloads.length})</h3>
          <div className="flex gap-3 flex-wrap">
            <div className="w-[160px]">
              <AdminCustomSelect
                value={dlType}
                onChange={val => setDlType(val)}
                options={[
                  { value: "datasheet", label: "Datenblatt" },
                  { value: "catalogue", label: "Catalog" },
                  { value: "drawing", label: "Zeichnung / Maßblatt" },
                  { value: "manual", label: "Anleitung / Handbuch" }
                ]}
                variant="form"
              />
            </div>
            <input type="text" value={dlUrl} onChange={e => setDlUrl(e.target.value)} className={`${inputClass} flex-1`} placeholder="Datei-URL..." />
            <input type="text" value={dlTitle} onChange={e => setDlTitle(e.target.value)} className={`${inputClass} w-[160px]`} placeholder="Title..." />
            <button onClick={() => { if (dlUrl) { onAddDownload(product.id, dlType, dlUrl, dlTitle); setDlUrl(""); setDlTitle(""); } }} className={btnPrimary}><Plus className="w-3.5 h-3.5" /> Add</button>
          </div>
          {downloads.length === 0 ? (
            <p className="text-xs text-muted-foreground font-medium text-center py-8">No downloadable lookbooks or line sheets added.</p>
          ) : (
            <div className="space-y-2">
              {downloads.map(dl => (
                <div key={dl.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div className="flex items-center gap-3">
                    <Download className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs font-bold text-foreground">{dl.title || dl.type}</p>
                      <p className="text-[10px] text-muted-foreground font-mono truncate max-w-[300px]">{dl.url}</p>
                    </div>
                    <span className="text-[8px] font-bold text-foreground bg-muted border border-border px-1.5 py-0.5 rounded uppercase">{dl.type}</span>
                  </div>
                  <button onClick={() => onDeleteDownload(dl.id)} className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── FAQS SECTION ──────────────────────────────────────────── */}
      {activeSection === "faqs" && (
        <div className="bg-card text-card-foreground border border-border rounded-2xl p-6 space-y-6">
          <h3 className="font-display text-sm font-bold text-foreground uppercase tracking-wider border-b border-border pb-4">Häufige Fragen (FAQ) ({faqs.length})</h3>
          <div className="space-y-3">
            <FormField label="Frage">
              <input type="text" value={faqQ} onChange={e => setFaqQ(e.target.value)} className={inputClass} placeholder="Frage eingeben..." />
            </FormField>
            <FormField label="Antwort">
              <textarea rows={2} value={faqA} onChange={e => setFaqA(e.target.value)} className={`${inputClass} resize-none`} placeholder="Antwort eingeben..." />
            </FormField>
            <button onClick={() => { if (faqQ && faqA) { onAddFaq(product.id, faqQ, faqA); setFaqQ(""); setFaqA(""); } }} className={btnPrimary}><Plus className="w-3.5 h-3.5" /> Add FAQ</button>
          </div>
          {faqs.length === 0 ? (
            <p className="text-xs text-muted-foreground font-medium text-center py-4">No product FAQs added yet.</p>
          ) : (
            <div className="space-y-3">
              {faqs.map(faq => (
                <div key={faq.id} className="p-4 rounded-lg border border-border space-y-2">
                  <div className="flex justify-between items-start">
                    <h4 className="text-xs font-bold text-foreground">{faq.question}</h4>
                    <button onClick={() => onDeleteFaq(faq.id)} className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive cursor-pointer shrink-0"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                  <p className="text-[11px] text-foreground leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
