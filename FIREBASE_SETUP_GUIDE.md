# 🔥 Firebase Setup Guide - Complete Step-by-Step

Complete guide to set up Firebase Firestore for the Hacker Network platform. Perfect for mobile/Termux users!

## 📋 Table of Contents

1. [Create Firebase Project](#create-firebase-project)
2. [Set Up Firestore Database](#set-up-firestore-database)
3. [Create Service Account](#create-service-account)
4. [Get Credentials](#get-credentials)
5. [Deploy to Vercel](#deploy-to-vercel)
6. [Verify Setup](#verify-setup)
7. [Troubleshooting](#troubleshooting)

---

## 1️⃣ Create Firebase Project

### Step 1: Open Firebase Console

1. Open your phone browser
2. Go to: **https://console.firebase.google.com**
3. Sign in with your Google account (create one if needed)

### Step 2: Create New Project

1. Click **"Add project"** (big blue button)
2. Enter project name: `hacker-network` (or any name)
3. Click **"Continue"**
4. Choose location (default is fine)
5. Click **"Create project"**
6. Wait 1-2 minutes for project to initialize

### Step 3: Enable Firestore

1. In left menu, click **"Build"** → **"Firestore Database"**
2. Click **"Create Database"**
3. Choose **"Start in production mode"**
4. Choose location (closest to you is best)
5. Click **"Enable"**
6. Wait for database to initialize

✅ **Firestore is now ready!**

---

## 2️⃣ Set Up Firestore Database

### Create Collections

Firestore uses collections instead of tables. We need to create 3 collections:

#### Collection 1: Users

1. In Firestore, click **"Start collection"**
2. Collection ID: `users`
3. Click **"Next"**
4. Click **"Auto-ID"** (for document ID)
5. Add these fields:

```
email (string): test@example.com
username (string): testuser
passwordHash (string): $2b$10$...
credits (number): 300
role (string): user
verified (boolean): false
followers (number): 0
createdAt (timestamp): [current date]
updatedAt (timestamp): [current date]
```

6. Click **"Save"**

#### Collection 2: Posts

1. Click **"Add collection"** (or go back and click **"Start collection"**)
2. Collection ID: `posts`
3. Click **"Next"**
4. Click **"Auto-ID"**
5. Add these fields:

```
userId (string): test@example.com
title (string): My First Post
content (string): Post content here
type (string): news
tags (array): [cybersecurity, tools]
imageUrl (string): https://example.com/image.jpg
likes (number): 0
likedBy (array): []
commentCount (number): 0
createdAt (timestamp): [current date]
updatedAt (timestamp): [current date]
```

6. Click **"Save"**

#### Collection 3: Comments

1. Click **"Add collection"**
2. Collection ID: `comments`
3. Click **"Next"**
4. Click **"Auto-ID"**
5. Add these fields:

```
postId (string): [post document ID]
userId (string): test@example.com
content (string): Great post!
createdAt (timestamp): [current date]
```

6. Click **"Save"**

✅ **All collections created!**

---

## 3️⃣ Create Service Account

Service Account is needed for backend to access Firebase.

### Step 1: Go to Project Settings

1. In Firebase Console, click **⚙️ (gear icon)** in top-right
2. Click **"Project Settings"**

### Step 2: Create Service Account

1. Click **"Service Accounts"** tab
2. Click **"Generate New Private Key"** button
3. A JSON file will download automatically
4. **IMPORTANT**: Save this file safely!

### Step 3: Copy the JSON Content

1. Open the downloaded JSON file with a text editor
2. Copy ALL the content (Ctrl+A, Ctrl+C)
3. Keep it for next step

✅ **Service account created!**

---

## 4️⃣ Get Credentials

You need these credentials for deployment:

### From Firebase Console:

1. Go to **Project Settings** (⚙️ icon)
2. Click **"General"** tab
3. Find **"Project ID"** - copy it
4. Find **"Web API Key"** - copy it

### From Service Account JSON:

The JSON file you downloaded contains everything needed. You'll use it in next step.

---

## 5️⃣ Deploy to Vercel

### Step 1: Go to Vercel

1. Open: **https://vercel.com**
2. Sign up or sign in with GitHub
3. Click **"Add New"** → **"Project"**
4. Select your `hacker-network-vercel` repository
5. Click **"Import"**

### Step 2: Add Environment Variables

In the "Environment Variables" section, add these:

#### Get values from Firebase:

1. **FIREBASE_PROJECT_ID**
   - From Firebase Console → Project Settings → Project ID
   - Example: `hacker-network-abc123`

2. **FIREBASE_SERVICE_ACCOUNT**
   - The entire JSON file you downloaded
   - Paste the complete JSON content here
   - Example:
   ```json
   {
     "type": "service_account",
     "project_id": "hacker-network-abc123",
     "private_key_id": "...",
     ...
   }
   ```

3. **JWT_SECRET**
   - Create a random string (min 32 characters)
   - Example: `your-super-secret-key-min-32-characters-long`

4. **ADMIN_PASSWORD_HASH**
   - Generate bcrypt hash of your admin password
   - Use this command in Termux:
   ```bash
   node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('admin123', 10).then(h => console.log(h));"
   ```
   - Copy the output (starts with `$2b$10$`)

5. **ADMIN_PANEL_PATH**
   - Secret URL path for admin panel
   - Example: `/secret-admin-xyz-123`
   - Make it random and hard to guess!

6. **APP_URL**
   - Your Vercel app URL
   - Example: `https://hacker-network-vercel.vercel.app`

### Step 3: Deploy

1. Click **"Deploy"**
2. Wait 2-5 minutes for deployment
3. You'll get a URL like: `https://hacker-network-vercel.vercel.app`

✅ **Your platform is LIVE!**

---

## 6️⃣ Verify Setup

### Test the Platform

1. Open your app URL in browser
2. Click **"Get Started"**
3. Create an account
4. Create a post
5. Check if credits deducted (should be 290 credits left)

### Access Admin Panel

1. Go to: `https://your-app-url.vercel.app/secret-admin-xyz-123`
   - Replace with your actual ADMIN_PANEL_PATH
2. Login with your account
3. You should see admin dashboard

✅ **Everything working!**

---

## 7️⃣ Troubleshooting

### "Firebase credentials missing"

**Problem**: Error says Firebase credentials are missing

**Solution**:
1. Check FIREBASE_SERVICE_ACCOUNT is set in Vercel
2. Make sure it's the complete JSON (not truncated)
3. Redeploy after fixing

### "Cannot read posts"

**Problem**: Posts don't show in feed

**Solution**:
1. Check Firestore database exists
2. Verify collections are named correctly: `users`, `posts`, `comments`
3. Check Firebase permissions (should be in production mode)

### "Admin panel 404"

**Problem**: Admin panel URL shows 404

**Solution**:
1. Check ADMIN_PANEL_PATH is correct
2. Make sure you're logged in as admin user
3. Try different browser or clear cache

### "Deployment fails"

**Problem**: Vercel deployment shows error

**Solution**:
1. Check all environment variables are set
2. Make sure FIREBASE_SERVICE_ACCOUNT is valid JSON
3. Check for typos in variable names
4. Redeploy after fixing

### "Posts not saving"

**Problem**: Create post button doesn't work

**Solution**:
1. Check you have enough credits (starts with 300)
2. Verify Firebase Firestore is running
3. Check browser console for errors (F12)
4. Try creating a simpler post

---

## 📱 Mobile/Termux Tips

### Using Termux to Deploy

If you want to deploy from Termux:

```bash
# Install Node.js in Termux
pkg install nodejs

# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
cd /path/to/hacker-network-vercel
vercel --prod
```

### Using Phone Browser to Deploy

1. Go to https://vercel.com on your phone
2. Sign in with GitHub
3. Import repository
4. Add environment variables
5. Click Deploy

**Easier way** - just use phone browser! No Termux needed.

---

## 🎯 Next Steps

1. ✅ Create Firebase project
2. ✅ Set up Firestore database
3. ✅ Create service account
4. ✅ Deploy to Vercel
5. ✅ Test the platform
6. ✅ Share with friends!

---

## 📚 Quick Reference

| Item | Value |
|------|-------|
| Firebase Console | https://console.firebase.google.com |
| Vercel Dashboard | https://vercel.com/dashboard |
| Firestore Collections | users, posts, comments |
| Admin Panel Path | /secret-admin-xyz-123 (your choice) |
| Initial Credits | 300 per user |
| Cost per Post | 10 credits |

---

## 🆘 Need Help?

1. Check troubleshooting section above
2. Review Firebase documentation: https://firebase.google.com/docs
3. Check Vercel docs: https://vercel.com/docs
4. Look at browser console errors (F12 or long-press → Inspect)

---

**You're all set! 🚀 Your Hacker Network platform is ready to go!**

Happy hacking! ⚡
