# TeakAura — Bespoke Teakwood Furniture Platform

A production-grade, bespoke handcrafted solid teakwood furniture website and lead management platform. Designed specifically for high-conversion Meta ads mobile traffic, artisanal brand storytelling, and seamless lead acquisition via WhatsApp and dedicated consultation enquiry forms.

Built with **React 19 + TypeScript + Vite + Tailwind CSS + Framer Motion**, with full backend integration for **Cloudflare Pages Functions + Cloudflare D1 (SQLite) + Cloudflare R2 object storage**.

---

## 🏛️ Brand & Business Model

- **Craftsmanship First**: We run an independent carpentry workshop with 20+ years of generational woodworking experience. Every piece is built to order from 100% seasoned solid teakwood with traditional mortise-and-tenon joinery. Zero veneer. Zero particle board.
- **No Cart / No Online Payment**: Made-to-order bespoke furniture requires consultation on wood dimensions, room layouts, and grain finishes. Visitors browse the high-definition catalog and submit enquiries or click direct WhatsApp links. Every customer is personally contacted.
- **Mobile-First & Ad Optimized**: Tailored for Meta Ads (Instagram/Facebook) on mobile devices, featuring sticky call/WhatsApp floating bars, bottom navigation, instant lead capture modals, and integrated Meta Pixel event tracking (`Lead`, `Contact`, `ViewContent`).

---

## 🛠️ Architecture & Tech Stack

| Layer | Technology | Details |
|---|---|---|
| **Frontend** | React 19, TypeScript, Vite | Ultra-fast SPA, HMR, optimized bundle size |
| **Routing** | React Router v7 | Seamless client routing with scroll restoration |
| **Styling** | Tailwind CSS + Custom Design Tokens | Tailored luxury teak palette, warm cream backdrops, soft gold accents |
| **Motion** | Framer Motion | Smooth scroll reveals, page transitions, interactive galleries, animated stat counters |
| **Backend API** | Cloudflare Pages Functions | Serverless Edge API (`/functions/api/*`) |
| **Database** | Cloudflare D1 (SQLite) | Relational SQL schema with foreign keys and performance indexes |
| **Object Storage**| Cloudflare R2 | S3-compatible cloud storage for product photos & customer reference images |
| **Authentication**| Edge JWT in HttpOnly Cookie | PBKDF2 password hashing & secure session management |

---

## 📁 Project Structure

```
teak-furniture/
├── db/
│   ├── schema.sql                 # D1 SQLite database schema (5 tables, indexes)
│   └── seed.sql                   # Sample master categories, products, and testimonials
├── functions/                     # Cloudflare Pages Functions API
│   ├── _middleware.ts             # CORS & security headers
│   └── api/
│       ├── auth/                  # Admin authentication (login, logout, session check)
│       ├── categories/            # Category CRUD endpoints
│       ├── enquiries/             # Lead submission & admin CSV export
│       ├── products/              # Product CRUD with multi-image association
│       ├── testimonials/          # Customer reviews CRUD
│       ├── upload.ts              # R2 direct file upload endpoint with MIME validation
│       └── utils/                 # JWT auth, PBKDF2 hashing, D1 query helpers
├── public/                        # Static assets & SVG favicon
├── src/
│   ├── components/
│   │   ├── admin/                 # Admin layout, product modals, uploaders, tables
│   │   ├── catalog/               # Category pills, search bar, product cards
│   │   ├── common/                # Navbar, Footer, StickyMobileBar, SEO, EnquiryModal
│   │   └── home/                  # Hero, TrustBar, Craftsmanship, Process, Testimonials
│   ├── config/
│   │   ├── brand.ts               # Central brand config (phone, WhatsApp, addresses, stats)
│   │   └── mockData.ts            # High-fidelity offline fallback data
│   ├── context/                   # Admin authentication React context
│   ├── pages/
│   │   ├── admin/                 # Dashboard, Products, Enquiries, Categories, Testimonials
│   │   ├── AboutPage.tsx          # Workshop story, timber sourcing & joinery craft
│   │   ├── CatalogPage.tsx        # Filterable catalog with search & category switching
│   │   ├── ContactPage.tsx        # Workshop map, visiting hours, contact details
│   │   ├── CustomizePage.tsx      # Made-to-order bespoke project request wizard
│   │   ├── HomePage.tsx           # Full brand landing experience
│   │   └── ProductDetailPage.tsx  # Product specs, gallery, dimensions, WhatsApp enquiry
│   ├── types/                     # Shared TypeScript interfaces
│   ├── utils/                     # API client, Meta Pixel tracker, formatters
│   ├── App.tsx                    # Routes & transition layout
│   └── main.tsx                   # React root entry
├── index.html                     # HTML5 shell with Google Fonts & Meta Pixel script
├── package.json                   # Dependencies and scripts
├── tailwind.config.js             # Luxury Teak / Cream / Gold design system tokens
└── wrangler.toml                  # Cloudflare Pages, D1 and R2 bindings
```

---

## 🚀 Running Locally

The application comes with built-in resilient mock fallbacks. If the Cloudflare D1 backend is not connected locally, the frontend automatically falls back to rich sample data from `src/config/mockData.ts` so you can test all public pages, modals, and filters instantly!

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Vite Dev Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 3. Build for Production
```bash
npm run build
```

---

## ☁️ Cloudflare Setup & Deployment Guide

Follow these steps to deploy to Cloudflare Pages with live Cloudflare D1 and R2:

### Step 1: Install Wrangler CLI & Authenticate
```bash
npx wrangler login
```

### Step 2: Create Cloudflare D1 Database
```bash
npx wrangler d1 create teak-furniture-db
```
Wrangler will output your `database_name` and `database_id`. Open `wrangler.toml` and update line 9:
```toml
[[d1_databases]]
binding = "DB"
database_name = "teak-furniture-db"
database_id = "PASTE_YOUR_DATABASE_ID_HERE"
```

### Step 3: Run Database Migrations
Run the schema and seed scripts to initialize the database:
```bash
# Apply schema to local dev database
npx wrangler d1 execute teak-furniture-db --local --file=./db/schema.sql
npx wrangler d1 execute teak-furniture-db --local --file=./db/seed.sql

# Apply schema to production Cloudflare D1
npx wrangler d1 execute teak-furniture-db --remote --file=./db/schema.sql
npx wrangler d1 execute teak-furniture-db --remote --file=./db/seed.sql
```

### Step 4: Create Cloudflare R2 Storage Bucket
```bash
npx wrangler r2 bucket create teak-furniture-images
```
In your Cloudflare Dashboard under **R2 > teak-furniture-images > Settings > Public Access**, enable a custom domain or the R2 dev subdomain and update `R2_PUBLIC_URL` in `wrangler.toml`.

### Step 5: Configure Environment Secrets
```bash
npx wrangler pages secret put JWT_SECRET
# Enter a secure 64-character random string when prompted
```

### Step 6: Deploy to Cloudflare Pages
```bash
npm run build
npx wrangler pages deploy dist
```

---

## 🎨 How to Customize the Brand

### 1. Update Brand Details, Phone, WhatsApp & Address
Edit [`src/config/brand.ts`](file:///home/ubuntu-1/.gemini/antigravity-ide/scratch/teak-furniture/src/config/brand.ts):
- `BRAND.name`: Your brand name
- `BRAND.phone`: Call button phone number
- `BRAND.whatsappNumber`: International WhatsApp number without `+` or spaces (e.g. `918956903770`)
- `BRAND.workshopAddress`: Workshop street, city, map URL, and embedded Google Maps iframe URL
- `BRAND.metrics`: Animated statistics shown on the homepage
- `BRAND.socials`: Instagram, Facebook, and YouTube links

### 2. Update Brand Colors
Edit [`tailwind.config.js`](file:///home/ubuntu-1/.gemini/antigravity-ide/scratch/teak-furniture/tailwind.config.js):
- `teak`: 50 through 950 deep wood tones
- `cream`: 50 through 400 warm background neutrals
- `gold`: 300 through 700 brass and gold accent colors

### 3. Update Meta Pixel ID
Edit [`index.html`](file:///home/ubuntu-1/.gemini/antigravity-ide/scratch/teak-furniture/index.html) around line 38:
Replace `'YOUR_PIXEL_ID'` with your Meta Pixel ID. Events like `PageView`, `Lead`, and `Contact` are automatically dispatched.

---

## 🔐 Admin Panel

Access the built-in management interface at `/admin/login`:
- **Default Email**: `admin@teakaura.com`
- **Default Password**: `TeakAdmin2024!`
*(Configurable via `functions/api/auth/login.ts` or in production D1 `admins` table)*

### Admin Capabilities:
- **Products**: Add, edit, toggle visibility, assign images, specify wood grades, dimensions, and prices.
- **Enquiries**: Review all incoming product leads, custom made-to-order inquiries, and contact submissions. Filter by status (`New`, `Contacted`, `Quoted`, `Won`, `Lost`), add internal workshop notes, and export to CSV.
- **Categories**: Organize product catalog departments.
- **Testimonials**: Manage client reviews and featured homepage quotes.
