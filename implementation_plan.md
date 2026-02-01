# BakeTrack Implementation Plan

## Goal

Build a "Claymorphism" style bakery dashboard that matches specific design references. The app will use Google Sheets as a database/backend.

## Technical Stack

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS (Extensively customized for Clay/Soft UI)
- **Animation**: Framer Motion (For floating effects and interactions)
- **Icons**: Lucide React (Rounded, soft style)
- **Charts**: Recharts (Customized colors)
- **Backend**: Google Sheets via Google Apps Script (API)

## User Review Required

> [!IMPORTANT]
> **Design Fidelity**: The "Claymorphism" look relies heavily on specific shadow values and colors. I will configure a custom Tailwind theme. Please review the first "Page Skeleton" to ensure the _vibe_ matches before I build all functionalities.

## Proposed Changes

### 1. Project Initialization & Design System

- **Setup**: `npx create-next-app@latest` (Completed)
- **Tailwind Config**:
  - Add "Clay" utilities:
    - `.clay-card`: Background white/semi-transparent, double shadows (light top-left, dark bottom-right), rounded-3xl.
    - `.clay-btn`: Similar to card but interactive (active:scale-95, active:shadow-inset).
  - **Colors**: Extract palette from images (Pink: #FFB7D5, Background: #F7E6EF, Text: #6D5D6E).

### 2. Component Architecture

#### Layout

- `Sidebar`: Fixed left (desktop), collapsible/drawer (mobile). Contains the "floating pill" menu items.
- `TopBar`: Page title, Search bar (clay style), User profile.

#### UI Library (internal)

- `ClayCard`: Wrapper for content sections.
- `ClayButton`: Primary action buttons (e.g., "Simpan", "Edit").
- `ClayInput`: Form inputs with inner shadow styling.

### 3. Feature Implementation

#### [Data Layer]

- `services/api.ts`: Functions to `GET` and `POST` to the Google Script URL.
- **Handling CORS**: We will use Next.js API Routes (`/api/proxy`) to forward requests to Google Script if client-side CORS is blocked.

#### [Input Page]

- Form with fields: Date, Product (Dropdown), Qty, Price.
- Auto-calculate Total.
- Submit -> Calls API -> Updates Sheet.

#### [Report Page]

- **Stats Cards**: Total Omzet, Total Laba (Mocked logic or fetched if calculated in sheet).
- **Charts**: Weekly Sales (Bar Chart).
- **Table**: Recent Transactions.

#### [Product Page]

- List of items fetched from Sheet (or hardcoded if Sheet doesn't support generic read yet).
- _Note_: Brief says "Product... used for dropdown". We will assume we fetch the unique product names from the Sheet or a dedicated "Products" tab if available.

#### [Settings Page]

- Static user profile view.
- Connection status indicator (pinging the Google Sheet API).

#### [Login Page]

- **Setup CTA**: Add a clear "First time setup" section below the login form to guide new users to the database configuration wizard.

## Verification Plan

### Manual Verification

- **Visual Check**: Compare built UI side-by-side with inspiration images. Focus on shadow softness and button "pop".
- **Data Flow**:
  1. Input a transaction on the website.
  2. Open the actual Google Sheet.
  3. Verify the row appears instantly.
- **Responsiveness**: Check Sidebar behavior on mobile screen size.
