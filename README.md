# 💰 Cashnivo - Personal Finance Tracker

> Take control of your finances with a modern, intuitive, and secure expense tracking platform.

<div align="center">

<img src="public/logo.png" alt="Cashnivo Logo" width="200" />

**A modern, intuitive expense tracking application that helps you take control of your finances**

[![React](https://img.shields.io/badge/React-19.2.5-61DAFB?style=flat&logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.0.10-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-12.13.0-FFCA28?style=flat&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.3.0-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![DaisyUI](https://img.shields.io/badge/DaisyUI-5.5.19-5A0EF8?style=flat&logo=daisyui&logoColor=white)](https://daisyui.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](#-license--contributions)

<div align="center">
<a href="https://expensetracker-2ab95.web.app/" target="_blank">

![Live Demo](https://img.shields.io/badge/CASHNIVO-LIVE%20DEMO-6366F1?style=for-the-badge&logo=firefox-browser&logoColor=white&labelColor=111827)

</a>
</div>

</div>

---

## 📋 Table of Contents

- [About The Project](#-about-the-project)
- [Real-World Problem & Solution](#-real-world-problem--solution)
- [Key Features](#-key-features)
- [Tech Stack](#️-tech-stack)
- [Software Architecture](#️-software-architecture)
- [Database Schema](#-database-schema)
- [API Documentation](#-api-documentation)
- [Getting Started](#-getting-started)
- [Usage](#-usage)
- [Deployment](#-deployment)
- [License & Contributions](#-license--contributions)

---

## 🎯 About The Project

**Cashnivo** is a comprehensive personal finance management application designed to help individuals track their income and expenses effortlessly. Built with modern web technologies, it provides an intuitive dashboard with real-time insights into your financial health, customizable categories, and detailed transaction history.

### Why Choose Cashnivo?

- **Real-time Insights**: Instant visualization of your spending patterns and savings rate
- **Fully Customizable**: Create and manage categories that match your unique lifestyle
- **Data Persistence**: Cloud-based storage via Firebase and custom REST APIs ensures your data is secure and accessible anywhere
- **Responsive Design**: A seamless and beautiful experience across desktop, tablet, and mobile devices with integrated dark mode

---

## 🧠 Real-World Problem & Solution

### The Problem
Managing personal finances can be chaotic. Without proper tracking, individuals struggle with:
1. **Unstructured Spending** — Difficulty knowing exactly where money is going each month
2. **Scattered Data** — Spreadsheets are tedious and manual tracking is prone to errors
3. **Lack of Insights** — Hard to visualize savings rates and categorical expenses over time

### The Solution
Cashnivo streamlines financial tracking:
- **Centralized Dashboard**: A unified view of balances, total income, and expenses
- **Interactive Visualizations**: Recharts-powered pie and bar charts break down expenses instantly
- **Frictionless Entry**: Quick and easy transaction forms with automatic categorization

---

## ✨ Key Features

### 🏠 Intelligent Dashboards
- **Financial Summary Cards**: View current balance, total income, total expenses, and savings rate at a glance
- **Income vs Expense Chart**: Interactive bar charts comparing monthly income against expenses
- **Expense Breakdown Chart**: Interactive pie charts showing a clear breakdown of expenses by category
- **Insights & Quick Actions**: Smart automated feedback (e.g., daily average expenses, savings messages)

### 💳 Complete Transaction Lifecycle
- **Add Transactions**: Record income and expenses with amount, date, category, and description
- **Full CRUD Controls**: Edit and delete records with ease
- **Smart Filtering & Pagination**: Filter by type, search through history, and browse with paginated performance

### 📁 Custom Category Management
- **Type-Specific Management**: Separate controls for income vs. expense categories
- **System Defaults + Customization**: Start quickly with default categories, or build your own unlimited custom categories

### 🔐 Security & User Profiles
- **Firebase Authentication**: Email/Password and Google OAuth 2.0 integration
- **Role-Based Protected Routes**: Dashboards accessible only to authenticated users
- **User Avatars**: ImgBB integration for custom profile picture uploads

---

## 🛠️ Tech Stack

### Frontend Technologies

| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | 19.2.5 | Modern UI library with latest hooks and features |
| **Vite** | 8.0.10 | Lightning-fast build tool and dev server |
| **React Router** | 7.15.0 | Client-side routing and protected navigation |
| **TailwindCSS** | 4.3.0 | Utility-first CSS framework for rapid styling |
| **DaisyUI** | 5.5.19 | Beautiful accessible component library |
| **Recharts** | 3.8.1 | Composable charting library for data visualization |

### Backend & Services

| Service | Version | Purpose |
|---------|---------|-------------|
| **Firebase** | 12.13.0 | Authentication and high-performance hosting |
| **Axios** | 1.16.0 | Promise-based HTTP client for API requests |
| **REST API** | Custom | Backend endpoints for data persistence |
| **ImgBB API** | REST | Cloud storage for user profile avatars |

---

## 🏗️ Software Architecture

Cashnivo follows a robust **Component-Based Architecture** with a clear separation of concerns, built entirely on modern React patterns.

### Architecture Overview

```text
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                        │
│  (React Components, TailwindCSS, DaisyUI, Recharts)         │
├─────────────────────────────────────────────────────────────┤
│                    State Management Layer                     │
│  (React Context API, Custom Hooks, Local State)             │
├─────────────────────────────────────────────────────────────┤
│                    Business Logic Layer                       │
│  (Data Formatting, Form Validation, Math Aggregation)       │
├─────────────────────────────────────────────────────────────┤
│                    API Integration Layer                      │
│  (Axios HTTP Client, Firebase Auth SDK)                     │
├─────────────────────────────────────────────────────────────┤
│                    External Services                          │
│  (Firebase Authentication, REST API, ImgBB Cloud)           │
└─────────────────────────────────────────────────────────────┘
```

### Component Hierarchy

```text
App
├── RootLayout
│   ├── Navbar
│   ├── Public Routes (Home, About, Contact, Login, Register)
│   └── Footer
└── PrivateRoute (Auth Guard)
    └── DashboardLayout
        ├── Aside (Collapsible Sidebar)
        └── Dashboard Modules
            ├── DashboardHome (FinancialSummary, RecentTransactions)
            ├── AddTransaction
            ├── Transactions (Paginated List)
            ├── Categories (Default & Custom)
            └── Profile (Settings & Avatar Upload)
```

### Key Data Flows

#### 1. Authentication Lifecycle
```text
[Client] User Input → Firebase Auth → Session Validated
    ↓
AuthProvider fetches & sets global user state
    ↓
PrivateRoute checks session → Blocks unauthenticated users
    ↓
Dashboard components securely rendered
```

#### 2. Transaction Management Flow
```text
User Submits Form → Client-side Validation
    ↓
Axios POST Request → Backend REST API
    ↓
Database Insert → Response returned to Client
    ↓
Frontend State Updated → Toast Notification Displayed
```

### Design Patterns Used

| Pattern | Implementation |
|---|---|
| **Context Provider** | `AuthProvider` encapsulates global authentication states |
| **Higher-Order Component** | `PrivateRoute` securely wraps and protects dashboard routes |
| **Compound Components** | Modular dashboard construction (`FinancialSummary` + `RecentTransactions`) |
| **Controlled Components** | Form inputs strictly bound to React local state (`useState`) |

---

## 📁 Project Structure

Cashnivo consists of two main directories: `cashnivo-frontend` and `cashnivo-backend`.

```text
cashnivo/
├── cashnivo-frontend/           # The primary React + Vite Application
│   ├── public/                  # Static assets
│   ├── src/
│   │   ├── assets/              # Images and icons
│   │   ├── Components/          # Reusable React components
│   │   │   ├── Aside/           # Sidebar navigation
│   │   │   ├── DashboardLayout/ # Dashboard shell wrapper
│   │   │   ├── Footer/          # Shared site footer
│   │   │   └── Navbar/          # Top navigation bar
│   │   ├── Dashboard/           # Protected application modules
│   │   │   ├── AddTransaction/  # Form for new records
│   │   │   ├── Categories/      # Category management
│   │   │   ├── DashboardHome/   # Main overview & charts
│   │   │   └── Transactions/    # Paginated transaction list
│   │   ├── Pages/               # Public and Auth pages
│   │   │   ├── Home/            # Landing page sections
│   │   │   ├── AboutUs/         # About info
│   │   │   ├── ContactUs/       # Contact info
│   │   │   ├── Login/           # Authentication
│   │   │   └── Register/        # User registration
│   │   ├── Provider/            # React Context (AuthProvider)
│   │   ├── firebase/            # Firebase SDK configuration
│   │   ├── routes/              # Client-side routing logic
│   │   ├── App.jsx              # Main App wrapper
│   │   ├── index.css            # Tailwind global styles
│   │   └── main.jsx             # React entry point
│   ├── .env.local               # Environment variables
│   ├── package.json             # Frontend dependencies
│   ├── tailwind.config.js       # Tailwind configuration
│   └── vite.config.js           # Vite bundler config
│
├── cashnivo-backend/            # Node.js/Express Backend Service
│   ├── src/
│   │   ├── routes/              # Express API Routes
│   │   │   ├── categories.js    # Category CRUD endpoints
│   │   │   ├── stats.js         # Global platform stats
│   │   │   ├── transactions.js  # Transaction CRUD endpoints
│   │   │   └── users.js         # User role and profile management
│   │   └── index.js             # Express application setup
│   ├── .env                     # Environment variables
│   ├── package.json             # Backend dependencies
│   └── vercel.json              # Vercel deployment config
│
└── README.md                    # Project documentation
```

---

## 💾 Database Schema

### Transactions Collection
```json
{
  "_id": "ObjectId",
  "type": "expense",
  "amount": 50.00,
  "category": "Groceries",
  "date": "2026-05-16",
  "description": "Weekly grocery shopping",
  "email": "user@example.com",
  "createdAt": "2026-05-16T10:30:00.000Z"
}
```

### Categories Collection
```json
{
  "_id": "ObjectId",
  "name": "Groceries",
  "type": "expense",
  "email": "user@example.com",
  "isDefault": false,
  "createdAt": "2026-05-16T10:30:00.000Z"
}
```

---

## 🔌 API Documentation

Cashnivo integrates with a custom REST API. All endpoints return JSON responses.

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/transactions?email={email}` | Fetch all transactions for a user | Yes |
| `POST` | `/transactions` | Create a new transaction | Yes |
| `PUT` | `/transactions/{id}` | Update an existing transaction | Yes |
| `DELETE` | `/transactions/{id}` | Delete a transaction | Yes |
| `GET` | `/categories?email={email}` | Fetch default + custom user categories | Yes |
| `POST` | `/categories` | Create a new custom category | Yes |
| `GET` | `/stats` | Fetch overall global platform stats | No |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)
- **Firebase Account** for Authentication
- **ImgBB Account** for API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/SiratimMChy/cashnivo.git
   cd cashnivo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env.local` file in the root directory:
   ```env
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_firebase_app_id
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

---

## 🌐 Deployment

This project is configured for seamless deployment on **Firebase Hosting**.

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Authenticate and set project
firebase login
firebase init

# Build and deploy
npm run build
firebase deploy
```

---

## 📄 License & Contributions

Contributions make the open-source community an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

This project is open-source and welcoming. Anyone is free to view, explore, and contribute to this repository. However, proper credit and attribution must be given to the original creator.

Distributed under the **MIT License**. 

*Copyright © 2026 Cashnivo. All rights reserved.*

1. **Fork the Project**
2. **Create your Feature Branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your Changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push to the Branch**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request**

### Contribution Guidelines

- Follow the existing code style and conventions
- Write clear, descriptive commit messages
- Update documentation for any new features
- Add tests for new functionality when applicable
- Ensure all tests pass before submitting PR
- Keep pull requests focused on a single feature/fix

---
## 🙏 Acknowledgments

- [React Documentation](https://react.dev/) - Comprehensive React guides
- [Vite Documentation](https://vitejs.dev/) - Fast build tool documentation
- [Firebase Documentation](https://firebase.google.com/docs) - Authentication and hosting
- [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS framework
- [DaisyUI](https://daisyui.com/) - Beautiful Tailwind components
- [Lucide Icons](https://lucide.dev/) - Beautiful icon library
- [React Router](https://reactrouter.com/) - Client-side routing
- [Recharts](https://recharts.org/) - Data visualization library

---

<div align="center">

**Made by Siratim Mustakim Chowdhury**

[![GitHub](https://img.shields.io/badge/GitHub-SiratimMChy-181717?style=flat&logo=github)](https://github.com/SiratimMChy)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Siratim%20Mustakim-0077B5?style=flat&logo=linkedin)](https://www.linkedin.com/in/siratim-mustakim-chowdhury/)
[![Email](https://img.shields.io/badge/Email-chowdhurysiratimmustakim@gmail.com-D14836?style=flat&logo=gmail&logoColor=white)](mailto:chowdhurysiratimmustakim@gmail.com)
</div>
