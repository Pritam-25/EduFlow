<div align="center">

# 🎓 EduFlow LMS Platform

> A modern, full-featured Learning Management System built with cutting-edge technologies for creators and educators.

---

### 🧰 Tech Stack

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  <img src="https://img.shields.io/badge/Neon_DB-00EC9C?style=for-the-badge&logo=neon&logoColor=white" />
  <img src="https://img.shields.io/badge/Stripe-626CD9?style=for-the-badge&logo=stripe&logoColor=white" />
  <img src="https://img.shields.io/badge/shadcn/ui-000000?style=for-the-badge&logo=shadcnui&logoColor=white" />
  <img src="https://img.shields.io/badge/Arcjet-444DF2?style=for-the-badge&logo=shield&logoColor=white" />
  <img src="https://img.shields.io/badge/BetterAuth-6E40C9?style=for-the-badge&logo=auth0&logoColor=white" />
  <img src="https://img.shields.io/badge/pnpm-CC3534?style=for-the-badge&logo=pnpm&logoColor=white" />
</p>

</div>

### 👁️ Live Preview:
Open [https://eduflow25.vercel.app](https://eduflow25.vercel.app) to view the application.

---
<img width="1915" height="992" alt="Screenshot 2025-07-30 032221" src="https://github.com/user-attachments/assets/9d31491c-d19b-44fd-a009-8657c5b4e41c" />
<img width="1912" height="993" alt="Screenshot 2025-07-23 001032" src="https://github.com/user-attachments/assets/4bc8f9a4-ff03-4936-91a2-5f286233aa05" />

## ✨ Features

### 👨‍💼 For Administrators

- 📚 **Course Management**: Create, edit, and delete courses with rich content
- 📖 **Chapter & Lesson Organization**: Structured course content with drag-and-drop functionality
- 📊 **Analytics Dashboard**: Comprehensive insights into student engagement and course performance
- 👥 **Student Management**: Track student progress and manage enrollments
- 💰 **Revenue Tracking**: Monitor course sales and subscription metrics

### 👨‍🎓 For Students

- 🔍 **Course Catalog**: Browse and discover published courses
- 📈 **Progress Tracking**: Monitor learning progress across all enrolled courses
- 🎯 **Interactive Learning**: Engage with course content and track completion
- 🏠 **User Dashboard**: Personalized learning experience

---

## 🚀 Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/eduflow-lms.git
cd eduflow-lms

# 2. Install dependencies
pnpm install

# 3. Setup environment variables
cp .env.example .env.local
# Fill in your Database, Stripe, Arcjet, and BetterAuth credentials

# 4. Setup database
pnpm prisma generate
pnpm prisma db push

# 5. Run the development server
pnpm dev
```
---

## 📋 Environment Setup

Create a `.env.local` file with the following variables:

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/lms_db"
# Or for Neon: "postgresql://user:password@host.neon.tech/database"

# BetterAuth
BETTER_AUTH_SECRET="your-secret-key"
BETTER_AUTH_URL="http://localhost:3000"

# Stripe
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_publishable_key"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"

# Arcjet
ARCJET_KEY="your_arcjet_key"

# App
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"
```

---

## 📁 Project Structure

```
eduflow-lms/
├── src/
│   ├── app/                 # Next.js app directory
│   │   ├── (layout)/       # Layout routes
│   │   │   ├── admin/      # Admin dashboard
│   │   │   └── (public)/   # Public pages
│   │   └── (index)/        # Landing page
│   ├── components/          # Reusable UI components
│   │   └── ui/             # shadcn/ui components
│   ├── lib/                 # Utility functions
│   ├── hooks/               # Custom React hooks
│   └── actions/            # Server actions
├── prisma/                  # Database schema & migrations
├── public/                  # Static assets
└── .env.local              # Environment variables
```

---

## 🔐 Authentication & Security

- **BetterAuth**: Modern authentication with social logins
- **Role-based Access**: Admin and student role management
- **Arcjet Protection**: Bot detection, rate limiting, and attack protection

## 💳 Payment Integration

- **Stripe Integration**: Secure payment processing for course purchases
- **Subscription Management**: Handle course enrollments and subscriptions
- **Webhook Handling**: Real-time payment status updates

---

## 📝 Available Scripts

```bash
# Development
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint

# Database
pnpm db:generate  # Generate Prisma client
pnpm db:push      # Push schema changes
pnpm db:studio    # Open Prisma Studio

# Testing
pnpm test         # Run tests
```

---

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables
4. Deploy automatically

```bash
# Install Vercel CLI
pnpm add -g vercel

# Deploy
vercel --prod
```

---


<div align="center">

**Built with ❤️ by Pritam using modern web technologies for the future of online education.**

</div>
