# 📚 DigiLib+ | Advanced Digital Library Management System

DigiLib+ is a premium, official-grade digital library management system designed for academic and professional environments. Built with a focus on robust database management (ADBMS) and a sophisticated user experience, it provides a seamless interface for managing books, users, and library transactions.

![Design Status](https://img.shields.io/badge/Design-Premium-blueviolet?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Stack-Next.js%20|%20MongoDB%20|%20NextAuth-black?style=for-the-badge)

## ✨ Key Features

### 🏢 Role-Based Architecture
- **Admin Dashboard**: Real-time analytics, inventory management, user tracking, and unified activity logs.
- **User Dashboard**: Personal borrow history, active loan tracking, and profile management.
- **Secure Access**: Role-based redirection and route protection via Next.js Proxy/Middleware.

### 📖 Library Management
- **Smart Catalog**: Advanced search and category-wise filtering powered by MongoDB text indexes and regex.
- **Inventory Locking**: Atomic updates to `availableQuantity` ensure no over-borrowing during high-concurrency requests.
- **Chapter Explorer**: Navigate through book contents with a dedicated reading interface.

### 💰 Intelligent Fine System
- **Automated Penalties**: Built-in logic to calculate fines (₹3 per day) for overdue returns.
- **User Notifications**: Transparent fine notices displayed directly in the return workflow.
- **History Tracking**: Comprehensive "Reading History" showing every transaction, return date, and applied fine.

### 📊 Advanced DBMS (ADBMS) Implementation
- **Aggregation Pipelines**: Real-time dashboard stats and "Most Popular Books" rankings calculated via complex MongoDB `$group` and `$sort` stages.
- **Data Integrity**: Transaction-safe inventory management using atomic operators (`$inc`).
- **Soft Deletion**: Books are managed with an `isDeleted` flag to maintain referential integrity in transaction logs.

---

## 🚀 Tech Stack
- **Frontend**: Next.js 15+ (App Router), Vanilla CSS (Custom Design Tokens)
- **Backend**: Next.js API Routes, Node.js
- **Database**: MongoDB Atlas
- **Authentication**: NextAuth.js (JWT Strategy)
- **Styling**: Premium Light & Classy theme with Glassmorphism and Outfit/Inter typography.

---

## 🛠️ Setup & Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd digilab
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory:
```env
MONGODB_URI=your_mongodb_atlas_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

### 4. Seed the Database
Populate your database with initial admin and test users:
```bash
node scripts/seed-admin.js
```

### 5. Run the Development Server
```bash
npm run dev
```

---

## 🔑 Default Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@digilib.com` | `admin123` |
| **User** | `user@digilib.com` | `user123` |

---

## 🎨 Design Philosophy
DigiLib+ prioritizes **Visual Excellence**. Unlike generic library apps, it uses:
- **Glassmorphism**: Blurred overlays and subtle transparency.
- **Harmonious Palettes**: Slate and Cobalt tones for a professional, academic feel.
- **Micro-animations**: Smooth transitions (`animate-fade-up`) for all page loads and state changes.

---
*Developed as an Advanced Database Management System project.*
