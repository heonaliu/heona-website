# Heona Liu — Personal Portfolio

A minimal, premium personal portfolio website built with Next.js 15, Tailwind CSS v4, and Framer Motion.

## Tech Stack

**Framework & Language**
- Next.js 15 (App Router, RSC)
- TypeScript
- React 19

**Styling**
- Tailwind CSS v4
- Framer Motion (animations)

**Backend & Database**
- Firebase Auth (Google sign-in)
- Firestore (blog posts, projects, artwork, page content)

**Content**
- ReactMarkdown + remark-gfm (blog posts)

**Email**
- Resend (contact form delivery)

**Deployment**
- Vercel

**Key Libraries**
- `lucide-react` — icons
- `next/image` + `next/og` — images and favicon generation
- `reading-time` — blog post read time estimates

## Features

- Dark mode with system-aware theme toggle
- Admin CMS — edit page headers, hero chips, about photo, timeline, interests, projects, artwork overrides, and blog posts all via the live site (no separate dashboard)
- Blog with draft/publish flow, tag filtering, search, and live markdown editor
- Art gallery with masonry layout and lightbox
- Contact form with real email delivery via Resend
- Custom cursor glow (desktop)
- Command palette (⌘K)
- Animated loading screen
- Scroll progress bar

## Pages

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Hero, featured projects, featured art, latest posts |
| About | `/about` | Bio, skills, timeline, interests, learning cards |
| Art | `/art` | Masonry gallery with lightbox modals |
| Projects | `/projects` | Filterable project cards with detail modals |
| Blog | `/blog` | Posts with tag filtering and search |
| Contact | `/contact` | Contact form + social links |
| Blog Post | `/blog/[slug]` | Reading view |
| Blog Editor | `/blog/new` or `/blog/[slug]/edit` | Admin-only markdown editor |
