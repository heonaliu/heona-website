# Firebase Setup Guide

Follow these steps to enable the authentication and blog editor features.

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **Add project**
3. Name it `heona-website` (or any name)
4. Disable Google Analytics (optional)
5. Click **Create project**

## 2. Enable Google Authentication

1. In your project, go to **Authentication** → **Sign-in method**
2. Click **Google** → Enable
3. Set your public-facing name (e.g., "Heona Liu Portfolio")
4. Add your email as a support email
5. Click **Save**

## 3. Create Firestore Database

1. Go to **Firestore Database** → **Create database**
2. Choose **Start in test mode** (you can secure it later)
3. Select a region close to you

## 4. Get Your Config

1. Go to **Project Settings** (gear icon)
2. Scroll to **Your apps** → click the web icon (`</>`)
3. Register your app, get the config object
4. Copy the values to your `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1234567890
NEXT_PUBLIC_FIREBASE_APP_ID=1:1234:web:abcdef
```

## 5. Add Authorized Domain

1. In **Authentication** → **Settings** → **Authorized domains**
2. Add `localhost` (already there by default)
3. When deployed, add your Vercel URL (e.g., `heona-website.vercel.app`)

## 6. Firestore Security Rules

In **Firestore** → **Rules**, set:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Anyone can read posts
    match /posts/{postId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.email == 'heonaliu@gmail.com';
    }
  }
}
```

## 7. Test

Run `npm run dev`, click **Sign in** in the navbar → should open Google popup.

After signing in with `heonaliu@gmail.com`, you'll see:
- Admin badge in navbar
- **New Post** button on the blog page
- Edit buttons on blog posts
