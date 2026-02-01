# 🧁 BakeTrack Dashboard

**BakeTrack Dashboard** is a modern, aesthetics-focused bakery management application designed to streamline daily operations for small to medium-sized bakery businesses. Built with a "Claymorphism" design philosophy, it offers a visually engaging and soft user interface while leveraging the power and flexibility of **Google Sheets** as a free, real-time backend database.

---

## 🚀 Project Overview

The primary objective of BakeTrack is to provide bakery owners with a professional-grade dashboard without the complexity and cost of traditional ERP systems. By using Google Sheets as the database, users retain full ownership and easy access to their data, while the dashboard provides a premium frontend experience for data entry, visualization, and management.

### 🌟 Key Features

- **📊 Interactive Dashboard**: Real-time overview of total revenue, estimated profit, order volume, and visual sales charts.
- **📝 Seamless Transaction Entry**: A streamlined input form for recording daily sales with automatic total calculation and stock validation.
- **🍞 Product Management**: Full CRUD (Create, Read, Update, Delete) capabilities for managing your bakery menu, prices, and stock levels.
- **📈 Comprehensive Reports**: Detailed weekly performance charts, top-selling products analysis, and transaction history tables.
- **⚙️ Smart Settings**:
  - **Multi-Language Support**: Fully localized in **Indonesian (ID)** and **English (EN)**.
  - **Multi-Currency**: Helper tools to switch between IDR and USD views with custom exchange rates.
  - **Database Integration**: Easy-to-use wizard to connect your own Google Sheet.
- **🎨 Premium "Clay" UI**: A unique, soft, and modern interface design using Claymorphism (soft shadows and rounded corners) for a delightful user experience.

---

## 💎 why BakeTrack? (Unique Value Proposition)

Compared to standard admin templates, BakeTrack stands out by focusing on:

1.  **Zero-Cost Backend**: No need for expensive SQL servers or monthly cloud subscriptions. It runs entirely on your Google Drive.
2.  **Aesthetics First**: We believe internal tools shouldn't be boring. The Claymorphism design promotes a calm and enjoyable workflow.
3.  **Ownership**: You own your data. If the app goes down, you still have your Google Sheet with all transaction history.
4.  **Real-Time Sync**: Changes made in the dashboard reflect instantly in your spreadsheet, and vice-versa.

---

## 🛠️ Technology Stack

This project is built using the latest modern web technologies to ensure performance, scalability, and maintainability.

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router & Turbopack)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) with custom Clay utilities.
- **Animations**: [Framer Motion](https://www.framer.com/motion/) for smooth transitions and interactions.
- **Icons**: [Lucide React](https://lucide.dev/) & React Icons.
- **Charts**: [Recharts](https://recharts.org/) for data visualization.
- **Backend**: Google Apps Script (GAS) serving as a JSON API gateway to Google Sheets.

---

## 🎯 Target Audience

- **Home Bakers & SME Bakeries**: Who need a digital system but can't afford enterprise software.
- **Developers**: Looking for a high-quality reference implementation of a Next.js + Google Sheets project or a Claymorphism design system.

---

## 💻 Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites

- **Node.js** (v18 or higher recommended)
- **npm** or **yarn** or **pnpm**
- **Git**

### 1. Clone the Repository

```bash
git clone https://github.com/rezkyrevansyah/baketrack-dashboard.git
cd baketrack-dashboard
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 📖 Usage Guide & Setup

Since BakeTrack relies on your private Google Sheet, you need to connect it first. The app includes a built-in **Setup Wizard**.

### Step 1: Login & Navigation

Upon first launch, you will be on the Login page. If you haven't set up a database, look for the **"New here? Setup Database Now"** section at the bottom of the card. Click it to enter the Setup Wizard.

### Step 2: The Setup Wizard

1.  **Select Language**: Choose between English or Indonesia.
2.  **Create Database**:
    - The wizard provides a **"Official Template"** button. Click it to copy the master Google Sheet to your Drive.
    - **Keep the tab open!** You need to deploy the script inside that sheet.
3.  **Deploy Script (in Google Sheet)**:
    - Go to **Extensions** > **Apps Script**.
    - Click **Deploy** > **New Deployment**.
    - Select type: **Web App**.
    - Set _Who has access_ to: **Anyone**. (Crucial for the dashboard to reach it).
    - Click Deploy and **Copy the Web App URL**.
4.  **Connect API**:
    - Paste the Web App URL into the BakeTrack wizard.
    - Click **Test Connection**.
    - If successful, click **Finish**.

### Step 3: Default Credentials

Once connected, the wizard will show you the default login credentials stored in your new Sheet (usually `admin@admin.com` / `admin`). Use these to log in.

---

## 📂 Project Structure

```
src/
├── app/              # Next.js App Router pages
│   ├── login/        # Login page
│   ├── setup/        # Database setup wizard
│   ├── input/        # Transaction entry page
│   ├── report/       # Analytics page
│   └── ...
├── components/       # Reusable UI components
│   ├── input/        # Components specific to Input page
│   ├── settings/     # Components specific to Settings page
│   └── ui/           # Generic Clay-style UI (Buttons, Cards, Inputs)
├── context/          # React Context (Auth, Preferences)
├── services/         # API handling & helpers
└── utils/            # Formatters and utility functions
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📄 License

This project is open-source and available for personal and educational use.

---

Made with 🧁 and code by **Rezky Revansyah**.
