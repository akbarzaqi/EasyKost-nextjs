# Kost Pak Aji - Management System

A full-featured boarding house (kost) management application built with Next.js 16 App Router. Provides dual interfaces for **admins** (property managers) and **tenants/users** (penghuni) to manage rooms, rental contracts, invoices, and payments.

## Fitur

### Admin
- **Dashboard** — Overview with stats cards (Total Hunian, Penghuni Aktif, Tagihan Bulan Ini, Menunggu Verifikasi)
- **Manajemen Hunian** — CRUD rooms with card display, status filter, search, image upload
- **Manajemen Sewa** — Data table of rental contracts with status tabs & search
- **Manajemen Tagihan** — Create, edit, delete invoices per room
- **Status Pembayaran** — View payment proofs, verify/approve/reject payments

### User/Penghuni
- **Dashboard** — Room info, billing summary, payment history, service status
- **Kamar Saya** — Room detail with pricing breakdown and contract info
- **Tagihan** — Invoice list with year filter, pay or view invoice, upload payment proof
- **Status Pembayaran** — Payment status table with pagination

## Teknologi

| Teknologi | Versi |
|---|---|
| [Next.js](https://nextjs.org) (App Router) | 16.2.6 |
| [React](https://react.dev) | 19.2.4 |
| [TypeScript](https://www.typescriptlang.org) | ^5 |
| [Tailwind CSS](https://tailwindcss.com) | ^4 |
| [shadcn/ui](https://ui.shadcn.com) (radix-nova) | ^4.10.0 |
| [TanStack Table](https://tanstack.com/table) | ^8.21.3 |
| [Lucide React](https://lucide.dev) | ^1.17.0 |
| [Radix UI](https://www.radix-ui.com) | ^1.4.3 |
| [class-variance-authority](https://cva.style) | ^0.7.1 |
| [React Compiler](https://react.dev/learn/react-compiler) | 1.0.0 |

## Cara Setup

### Prerequisites
- Node.js 20+
- npm / yarn / pnpm / bun

### Instalasi

```bash
# Clone repository
git clone <repository-url>
cd kost-fe

# Install dependencies
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### Menjalankan Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

### Build untuk Production

```bash
npm run build
npm start
```

## Struktur Proyek

```
src/
├── app/
│   ├── (auth)/                   # Login & Register
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (dashboard)/
│   │   ├── admin/dashboard/      # Admin pages
│   │   │   ├── hunian/           # CRUD rooms
│   │   │   ├── sewa/             # Rental contracts
│   │   │   ├── tagihan/          # Invoices
│   │   │   └── pembayaran/       # Payment verifications
│   │   └── users/dashboard/      # User/tenant pages
│   │       ├── kamar-saya/       # My room
│   │       ├── tagihan/          # My invoices
│   │       └── status/           # Payment status
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Landing page
│   └── globals.css               # Global styles + Tailwind
└── styles/
    ├── components/ui/            # shadcn/ui components
    ├── hooks/                    # Custom hooks
    └── lib/                      # Utilities
```
