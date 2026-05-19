# Mini Shop (Full-Stack Monorepo)

A complete e-commerce solution consisting of a mobile app, an admin web dashboard, and a high-performance backend. Built as part of a comprehensive technical delivery.

## 🚀 Architecture & Tech Stack

The project is structured into three distinct packages:

### 1. Backend (`/backend`)
- **Framework:** Fastify (Node.js) with TypeScript
- **Database & Auth:** Supabase (PostgreSQL, JWT Authentication)
- **Validation:** Zod
- **Highlights:** Highly performant REST API. Uses `service_role` keys safely while allowing client-side JWTs for secure customer endpoints.

### 2. Mobile App (`/mobile`)
- **Framework:** React Native + Expo Router
- **State Management:** Zustand (global UI, cart, theme) + TanStack React Query (API caching)
- **Styling:** Custom Glass-morphism UI with dynamically reactive light/dark theme support
- **Localization:** `react-i18next` with automatic RTL (Right-to-Left) layout support for Arabic

### 3. Admin Dashboard (`/admin`)
- **Framework:** React 18 + Vite (SPA)
- **State & Data:** Zustand + TanStack React Query
- **UI/UX:** Custom Vanilla CSS design system (Dark mode), Recharts for data visualization, Lucide React icons
- **Features:** Real-time revenue charts, complete Products CRUD, Orders pipeline management, and Customers directory.

---

## 🛠 How to Run Locally

### Prerequisites
Make sure you have Node.js (v18+) and npm installed. You will also need your Supabase project keys.

### 1. Environment Variables
You need to set up the environment variables for all three projects. Copy the `.env.example` files to `.env` in each respective directory and fill in your Supabase details.

```bash
cp backend/.env.example backend/.env
cp mobile/.env.example mobile/.env
cp admin/.env.example admin/.env
```

> **Note for Mobile:** For physical device testing, ensure `EXPO_PUBLIC_API_URL` points to your computer's local network IP (e.g., `http://192.168.1.XX:3000`).

### 2. Start the Backend
```bash
cd backend
npm install
npm run dev
```
*Runs on `http://localhost:3000`*

### 3. Start the Admin Dashboard
```bash
cd admin
npm install
npm run dev
```
*Runs on `http://localhost:5173`*

### 4. Start the Mobile App
```bash
cd mobile
npm install
npx expo start
```
*Press `i` for iOS Simulator or `a` for Android Emulator.*

---

## 🔑 Default Test Accounts
If your Supabase database is already seeded, you can use these accounts to test the flow:
- **Admin Account:** `admin@mailtest.com` / `Admin123!` (Access to Admin Dashboard)
- **Customer Account:** `customer@mailtest.com` / `Customer123!` (Mobile App login)

---

## 📸 Core Features Demonstrated
* **Dynamic Theme Context:** Real-time light/dark mode switching.
* **i18n & Localization:** Deep translation integration including `I18nManager.forceRTL` flips.
* **Global Toast System:** Replacing native alerts with beautiful, animated in-app notifications.
* **Complex Data Aggregation:** Backend processes that combine Supabase relational queries for admin dashboard charts.
