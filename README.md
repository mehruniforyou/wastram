# NISHORAMA India — Code-for-Code E-Commerce Clone

A high-fidelity, pixel-perfect, production-grade Next.js 14 clone of **[NISHORAMA India](https://www.nishorama.com)** ("YOU know where to GET IT").

Built with **Next.js 14 (App Router)**, **TypeScript**, and **Tailwind CSS**. Fully responsive with dedicated desktop and mobile layouts, interactive modals, drawers, live countdown tickers, and cart state management.

---

## 🌟 Features Replicated Code-for-Code

### 1. Header & Navigation (Desktop & Mobile)
- **Live Sale Countdown Ticker**: Real-time ticker counting down hours, minutes, and seconds (`14 Hours : XX Minutes : YY Seconds`).
- **Diwali Sale Pill Banner**: `DIWALI SALE | UP TO 50% OFF | SHOP NOW`.
- **Mobile Notification Strip**: `10% OFF Automatically Applied on Orders ₹2,599+`.
- **Desktop Navigation**:
  - Menu toggle with animated bars.
  - Authentic NISHORAMA SVG Wordmark and center quote `“ YOU know where to GET IT ”`.
  - Nav link pills: `New in`, `Shop All`, `Kurtis`, `Trending 🔴` (with pulsing red indicator), `Tops`, `Bottom`.
  - "Leaving soon 30% OFF" badge.
  - Interactive Instagram-style **Story Ring** with Hindi monogram `नी` and spinning gradient animation.
  - Wishlist bookmark icon with live counter.
  - Search trigger opening predictive search modal.
  - User account link.
  - Cart pill with count.
- **Mobile Header**:
  - Hamburger menu trigger + search icon on the left.
  - Centered brand vector wordmark with italic Hindi quote.
  - Story ring, wishlist bookmark, and shopping bag icon with item count.
- **Mobile Navigation Drawer**:
  - Search input with quick navigation.
  - Quick promo links (`Shop All`, `New In`, `MOST WANTED`, `FLAT 50% OFF`, `FLAT 40% OFF`, `UNDER ₹1299`, `UNDER ₹999`).
  - Interactive accordion submenus for `Kurtis`, `Dresses`, `Sets`, `Nisho Men`, `Tops`, `Bottoms`, and `Collections`.
  - Customer support desk (Phone, WhatsApp, Account, FAQs).

### 2. Interactive Modals & Drawers
- **Story Viewer Modal**:
  - Fullscreen Instagram-style story experience triggered by tapping the gradient story ring.
  - Multi-segment progress bars, auto-advancing slides every 4 seconds, tap to navigate previous/next, and direct "Shop Collection" CTAs.
- **Predictive Search Modal**:
  - Live filtering by title, category, and fabric across all styles.
  - Popular search tags (`White Pants`, `Corset Kurti`, `Mulmul Cover Up`, `Skirt Set`, etc.).
- **Diwali Promotional Modal**:
  - Authentic Diwali pop-up with dual-model photography, email capture form, cyan CTA, and session dismissal persistence.
- **Cart Drawer & Page**:
  - Slide-out cart drawer with free shipping & free pants progress meter.
  - Quantity adjustments, size display, item removal, discount code input, and checkout flow.
- **Quick Add Modal**:
  - Quick size selector (`XS`, `S`, `M`, `L`, `XL`, `XXL`) triggered directly from any product card.

### 3. Homepage Editorial Layout
- **Hero Section**:
  - Desktop split-screen layout with genuine campaign photography, faded watermark typography, `[Ends Tonight]`, bold red headline `FREE PANTS WORTH ₹1399`, and frosted glass `SHOP ALL` pill.
  - Mobile vertical portrait composition with dark gradient overlay.
- **Diwali 4-Feature Capsule Grid**:
  - 4 capsule cards framed by `border: 5px solid #FF2F00; border-radius: 1vw` (desktop 4-columns, mobile 2x2 grid):
    - `MOST WANTED`
    - `SETS UP TO 50% off`
    - `UNDER ₹999`
    - `KURTIS UP TO 50% off`
- **5 Editorial Textured Banners**:
  - Warm chocolate/espresso brown banners with genuine photography, italic serif subtitles, Archivo uppercase headlines, and frosted glass arrow buttons (`most WANTED`, `upto 50% SETS`, `upto 50% KURTIES`, `upto 50% TOPS`, `upto 50% DRESSES`).
- **Product Fits Tabbed Slider**:
  - 4 tabs (`UNDER ₹999`, `Festive Sets`, `UPTO 50%`, `Most Wanted`) with active state highlighted in `#482922` and gold border `#F6C582`.
  - Product cards with discount badges, front/back hover image toggle, pricing, and `+ Add` button.
  - `View All` button linking to `/collections/shop-all`.
- **Artisan Engraving Custom Footer**:
  - Authentic block-print artisan engraving illustration (`cust-footer-svg.svg`).
  - Desktop 4 columns (Connect with us, Order Support, We Are Nishorama, Nishorama Pvt Ltd Mumbai office details).
  - Mobile interactive footer accordions with `+`/`−` toggles.
  - Accepted payment badges (UPI, Cards, NetBanking, PayPal).
  - Large `#482922` Nishorama vector logo with `" YOU know where to GET IT "` and copyright.
- **SEO Tag Cloud / Directory Index**:
  - Bottom directory covering `Kurtis`, `Tops`, `Sets`, `Bottoms`, `Dresses`, and `Our Collections`.

### 4. Catalogue & Product Detail Views
- **Collection Pages** (`/collections/[category]` and `/collections/shop-all`):
  - Category selector chips, sorting (Price: Low/High, Featured), responsive 4-column desktop and 2-column mobile grid.
- **Product Detail Pages** (`/products/[slug]`):
  - Multi-image gallery with thumbnails, size pills, quantity stepper, "ADD TO BAG", "BUY NOW", accordions for Description & Fit, Fabric & Care, and Shipping & Returns, plus "You May Also Like" recommendations.
- **Customer Information Pages**:
  - `/pages/about-us` (Our Story & Craft Heritage)
  - `/pages/contact` (Contact Form & Mumbai Office)
  - `/pages/faqs` (Categorized Support Accordion)
  - `/pages/refund-policy` (Shipping & 7-Day Return Policy)
  - `/pages/terms-of-service` (Terms of Service)
  - `/pages/swym-wishlist` (Saved Wishlist Items)
  - `/cart` (Full Shopping Bag View)

---

## 🎨 Color Palette & Typography

- **Brand Dark Brown**: `#482922`
- **Diwali Festival Red**: `#FF2F00`
- **Accent Gold Border**: `#F6C582`
- **Cyan Accent (Modal)**: `#5CE1E6`
- **Background Cream**: `#FAF8F5`
- **Background Light Grey**: `#EFEFEF` / `#F5F5F5`
- **Typography**:
  - **Primary**: *Archivo* (Weights: 300, 400, 500, 600, 700, 800, 900)
  - **Editorial Serif Accent**: *Playfair Display* (Italic)

---

## 🚀 Running the Project

```bash
# Install dependencies
npm install

# Run development server
npm run dev
# Open http://localhost:3000

# Build for production
npm run build

# Start production server
npm run start
```
