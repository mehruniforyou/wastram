# Wastram — Premium Indian Women's Wear Wholesale & Export Website

An international B2B wholesale and export web platform for **Wastram**, an Indian women's clothing manufacturer based in Jaipur, Rajasthan, India.

Built with **Next.js 14 (App Router)**, **TypeScript**, and **Tailwind CSS**. Designed to convert international fashion boutique owners, wholesalers, and importers into direct business enquiries via **WhatsApp** (+91 80030 88838).

---

## 🌟 Key Features

- **Genuine Jaipur Craftsmanship**: Showcases 131 actual products across 7 curated categories (Royal 3-Piece Kurti Sets, Designer Ethnic Co-Ords, Indo-Western Tiered Dresses, Artisanal Kurtas, Festive Lehengas, Luxe Satin Shirts, and Embroidered Tunics).
- **Direct WhatsApp Conversion Engine**: Context-aware click-to-chat links across the header, hero, category pages, product cards, and product detail views with prefilled product names and style codes (SKUs).
- **Dual Optimized UI (Desktop & Mobile)**:
  - **Desktop**: Editorial split-screen hero, multi-garment lookbook composition, hover zoom overlays, and side-by-side product detail views.
  - **Mobile**: Touch-optimized compact header, stacked editorial cards, swipeable category chips, a sticky bottom mobile inquiry bar on product pages, and a fixed 4-tab mobile navigation bar.
- **Full Catalogue Usability**: Live instant search by title, SKU, or fabric; category filter chips; sorting (Featured, A-Z, SKU); and empty state recovery.
- **Technical SEO & Structured Data**:
  - Semantic HTML5 landmarks
  - Dynamic XML sitemap (`/sitemap.xml`) indexing all 149 routes
  - `robots.txt` configuration
  - Rich JSON-LD schemas (`Organization`, `WebSite`, `Product`, `CollectionPage`, `BreadcrumbList`)
  - Canonical URLs and Open Graph social sharing tags
- **B2B Export Guidance**: Dedicated pages for About Us, Wholesale & Exports (4-stage workflow, flexible MOQs, sampling, international air/sea freight), Categorized FAQ accordion, and Contact Us form with instant WhatsApp transfer.

---

## 🎨 Brand Identity & Design System

- **Primary Blush Pink**: `#E6A39B`
- **Deep Navy Blue**: `#173B78`
- **Luxury Gold Accent**: `#D49A35`
- **Primary Background**: `#FFFFFF`
- **Secondary Background**: Ivory `#FAF8F5`
- **Typography Pairing**: *Playfair Display* (Editorial Serif) + *Plus Jakarta Sans* (Modern Sans)

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18.0 or later)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/mehruniforyou/wastram.git
cd wastram

# Install dependencies
npm install

# Run the development server
npm run dev

# Open http://localhost:3000 in your browser
```

### Production Build

```bash
# Compile optimized static pages (SSG)
npm run build

# Start production server
npm run start
```

---

## 📂 Project Structure

```
├── app/
│   ├── layout.tsx                # Root layout with fonts, metadata, and JSON-LD
│   ├── page.tsx                  # Editorial luxury homepage
│   ├── collections/
│   │   ├── page.tsx              # Searchable & filterable catalogue
│   │   └── [category]/page.tsx   # Dedicated category pages
│   ├── products/
│   │   └── [slug]/page.tsx       # Dedicated product detail pages
│   ├── about/page.tsx            # About Us & Jaipur textile heritage
│   ├── wholesale-exports/page.tsx# International B2B export guide
│   ├── faq/page.tsx              # Comprehensive categorized FAQ
│   ├── contact/page.tsx          # Wholesale enquiry form & contact desk
│   ├── sitemap.ts                # Dynamic XML sitemap generator
│   └── robots.ts                 # Search crawler rules
├── components/                   # Modular UI components
├── data/
│   ├── products.ts               # 131 product records with SKUs & specs
│   ├── categories.ts             # 7 category definitions
│   └── site-config.ts            # Centralized brand & WhatsApp config
├── public/
│   └── images/
│       ├── brand/                # Derived logos, wordmarks & favicons
│       ├── hero/                 # High-fashion campaign visuals
│       └── products/             # Curated product photography by category
└── scripts/                      # Asset extraction and optimization scripts
```

---

## 📞 Wholesale & Export Contact

- **Brand**: Wastram
- **WhatsApp**: [+91 80030 88838](https://wa.me/918003088838)
- **Origin**: Sanganer Textile Craft Hub, Jaipur, Rajasthan, India
- **Export Coverage**: Worldwide (UK, USA, GCC / Middle East, Europe, Australia)
