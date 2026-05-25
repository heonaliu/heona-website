# Heona Liu — Personal Portfolio

A minimal, premium personal portfolio website built with Next.js 15, Tailwind CSS v4, and Framer Motion.

## ✨ Features

- **Modern Design** — Clean, minimal aesthetic with purple accents (#671372)
- **Glassmorphism Navbar** — Floating rounded pill navbar with blur + active state
- **Dark Mode** — Smooth system-aware theme toggle
- **Framer Motion Animations** — Page transitions, scroll reveals, staggered cards
- **Cursor Glow** — Custom cursor ring effect (desktop only)
- **Command Palette** — ⌘K search navigation
- **Scroll Progress** — Animated gradient progress bar
- **Loading Screen** — Animated intro with progress bar
- **Grain Texture** — Subtle film grain overlay

## 📄 Pages

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Hero section with animated stats, featured work |
| About | `/about` | Personal story, skills, timeline, interests |
| Art | `/art` | Masonry gallery with lightbox modals |
| Projects | `/projects` | Filterable project cards with detail modals |
| Blog | `/blog` | MDX blog with tag filtering and search |
| Contact | `/contact` | Contact form + social links |
| Blog Post | `/blog/[slug]` | Beautiful reading experience |
| Blog Editor | `/blog/new` | Admin-only MDX editor with live preview |

## 🔧 Tech Stack

- **Next.js 15** — App Router, RSC, Static Generation
- **Tailwind CSS v4** — Utility-first styling with `@theme` variables
- **Framer Motion 12** — Animations and page transitions
- **Firebase 11** — Google Auth + Firestore for blog posts
- **MDX** — Markdown/MDX blog files via `next-mdx-remote`
- **TypeScript** — Full type safety

## 🚀 Getting Started

### 1. Clone and install

```bash
git clone https://github.com/heonaliu/heona-website.git
cd heona-website
npm install
```

### 2. Set up Firebase

1. Create a project at [Firebase Console](https://console.firebase.google.com)
2. Enable **Authentication** → Google provider
3. Enable **Firestore** database
4. Copy your config to `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123:web:abc123
```

### 3. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 4. Add blog posts

Create `.mdx` files in `content/blog/`:

```mdx
---
title: "My Post Title"
excerpt: "A short description"
date: "2026-05-24"
tags: ["personal", "coding"]
emoji: "🌱"
draft: false
---

# My Post

Write your content here in Markdown...
```

## 🔐 Admin Setup

The admin email is hardcoded to `heonaliu@gmail.com` in `src/context/AuthContext.tsx`.

Admins can:
- See a **New Post** button on the blog page
- Access the blog editor at `/blog/new`
- Edit existing posts

## 🚀 Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/heonaliu/heona-website)

Add your environment variables in Vercel dashboard.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── about/
│   ├── art/
│   ├── blog/
│   │   ├── [slug]/        # Dynamic blog post pages
│   │   └── new/           # Admin blog editor
│   ├── contact/
│   ├── projects/
│   ├── globals.css         # Tailwind + custom styles
│   └── layout.tsx          # Root layout
├── components/
│   ├── layout/            # Navbar, Footer
│   ├── sections/          # Page sections (Hero, etc.)
│   ├── ui/                # Reusable UI components
│   └── blog/              # Blog editor
├── context/               # React contexts (Theme, Auth)
└── lib/                   # Firebase, blog utilities
content/
└── blog/                  # MDX blog posts
```

## 🎨 Customization

- **Colors**: Edit `--color-brand` in `src/app/globals.css`
- **Personal info**: Update name/links in components and metadata
- **Admin email**: Change `ADMIN_EMAIL` in `src/context/AuthContext.tsx`
- **Content**: Edit the data arrays in each page's client component
