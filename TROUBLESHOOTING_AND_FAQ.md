# 🆘 Troubleshooting & FAQ Guide

Complete troubleshooting guide and frequently asked questions for Hacker Network platform.

## 📋 Table of Contents

1. [Common Issues](#common-issues)
2. [Firebase Issues](#firebase-issues)
3. [Vercel Issues](#vercel-issues)
4. [Authentication Issues](#authentication-issues)
5. [Platform Features Issues](#platform-features-issues)
6. [FAQ](#faq)
7. [Getting Help](#getting-help)

---

## 🔴 Common Issues

### Issue 1: "Cannot connect to database"

**Error Message**: 
```
Firebase credentials missing
Cannot initialize Firebase
```

**Cause**: Firebase credentials not set or invalid

**Solution**:

1. Check environment variables in Vercel:
   - Go to Vercel Dashboard
   - Click your project
   - Go to **Settings** → **Environment Variables**
   - Verify these are set:
     - `FIREBASE_PROJECT_ID`
     - `FIREBASE_SERVICE_ACCOUNT`

2. Verify Firebase service account JSON:
   - Go to Firebase Console
   - Project Settings → Service Accounts
   - Generate new private key
   - Copy entire JSON
   - Update `FIREBASE_SERVICE_ACCOUNT` in Vercel

3. Redeploy:
   - Go to Vercel Dashboard
   - Click **Deployments**
   - Click **...** menu
   - Click **Redeploy**

---

### Issue 2: "Posts not showing in feed"

**Problem**: Feed page is empty or shows no posts

**Causes**:
1. No posts created yet
2. Firebase connection issue
3. Browser cache issue

**Solutions**:

**Try 1: Create a test post**
1. Go to **Create Post**
2. Fill in all fields
3. Click **Publish**
4. Go back to feed
5. Refresh page (Ctrl+R or Cmd+R)

**Try 2: Check Firebase**
1. Go to Firebase Console
2. Click **Firestore Database**
3. Click **posts** collection
4. Should see posts listed
5. If empty, create test post first

**Try 3: Clear browser cache**
1. Press **F12** to open developer tools
2. Right-click refresh button
3. Click **"Empty cache and hard refresh"**
4. Wait for page to reload

---

### Issue 3: "Admin panel shows 404"

**Problem**: Admin panel URL not found

**Causes**:
1. Wrong admin panel path
2. Not logged in
3. Account not admin role

**Solutions**:

**Check admin path**:
1. Go to Vercel Dashboard
2. Settings → Environment Variables
3. Find `ADMIN_PANEL_PATH`
4. Copy exact value
5. Go to: `https://your-app.vercel.app` + path value
6. Example: `https://your-app.vercel.app/secret-admin-xyz-123`

**Check login status**:
1. Go to home page
2. Check if you're logged in
3. If not, click **"Get Started"** and login
4. Then try admin panel URL

**Check admin role**:
1. Go to Firebase Console
2. Firestore Database → users collection
3. Find your user (by email)
4. Check `role` field is `admin`
5. If not, change it to `admin` and save

---

### Issue 4: "Credits not deducting"

**Problem**: Create post doesn't deduct credits

**Causes**:
1. Firebase connection issue
2. User doesn't have enough credits
3. Post not actually created

**Solutions**:

**Check credits**:
1. Go to **Profile**
2. Look at credits display
3. Should show current balance
4. If 0, admin needs to top-up

**Check post creation**:
1. Create a post
2. Check if you see success message
3. Go to **Feed**
4. Refresh page
5. Should see your new post

**Check Firebase**:
1. Go to Firebase Console
2. Firestore → posts collection
3. Should see new post
4. Check user credits in users collection

---

### Issue 5: "Cannot login"

**Problem**: Login fails or shows error

**Causes**:
1. Wrong email/password
2. Account doesn't exist
3. Firebase connection issue

**Solutions**:

**Try 1: Check credentials**
1. Make sure email is correct
2. Make sure password is correct
3. Try creating new account instead

**Try 2: Create new account**
1. Go to **Get Started**
2. Click **"Create Account"**
3. Enter email, username, password
4. Click **"Sign Up"**
5. Should be logged in

**Try 3: Check Firebase**
1. Go to Firebase Console
2. Firestore → users collection
3. Should see your user document
4. Check email matches

---

## 🔥 Firebase Issues

### Firebase Issue 1: "Service account not found"

**Error**: 
```
Firebase credential error
Service account initialization failed
```

**Solution**:

1. Go to Firebase Console
2. Project Settings → Service Accounts
3. Click **"Generate New Private Key"**
4. Download JSON file
5. Open with text editor
6. Copy ALL content
7. Go to Vercel Dashboard
8. Settings → Environment Variables
9. Edit `FIREBASE_SERVICE_ACCOUNT`
10. Paste entire JSON
11. Save
12. Redeploy

---

### Firebase Issue 2: "Permission denied"

**Error**:
```
Permission denied: Missing or insufficient permissions
```

**Cause**: Firestore security rules too strict

**Solution**:

1. Go to Firebase Console
2. Firestore Database → **Rules** tab
3. Replace with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

4. Click **"Publish"**
5. Wait for rules to update
6. Try again

---

### Firebase Issue 3: "Collection not found"

**Error**:
```
Collection 'posts' does not exist
```

**Solution**:

1. Go to Firebase Console
2. Firestore Database
3. Click **"Start collection"**
4. Create missing collections:
   - `users`
   - `posts`
   - `comments`

5. Add sample documents to each

---

## 🚀 Vercel Issues

### Vercel Issue 1: "Deployment failed"

**Error**: Deployment shows red X

**Causes**:
1. Missing environment variables
2. Invalid Firebase credentials
3. Code errors

**Solutions**:

**Check environment variables**:
1. Go to Vercel Dashboard
2. Settings → Environment Variables
3. Verify all required variables are set:
   - FIREBASE_PROJECT_ID
   - FIREBASE_SERVICE_ACCOUNT
   - JWT_SECRET
   - ADMIN_PASSWORD_HASH
   - ADMIN_PANEL_PATH
   - APP_URL

**Check build logs**:
1. Go to Deployments
2. Click failed deployment
3. Scroll down to see error messages
4. Fix errors
5. Redeploy

---

### Vercel Issue 2: "Build timeout"

**Error**: Deployment takes too long and times out

**Solution**:

1. Go to Vercel Dashboard
2. Settings → Build & Development Settings
3. Increase **Build Command Timeout** to 60 seconds
4. Save
5. Redeploy

---

### Vercel Issue 3: "Function execution timeout"

**Error**: API calls timeout

**Solution**:

1. Go to Vercel Dashboard
2. Settings → Functions
3. Increase **Max Duration** to 60 seconds
4. Save
5. Redeploy

---

## 🔐 Authentication Issues

### Auth Issue 1: "Invalid token"

**Error**: 
```
Unauthorized: Invalid or expired token
```

**Cause**: JWT token expired or invalid

**Solution**:

1. Logout and login again
2. Browser will get new token
3. Try again

---

### Auth Issue 2: "Session lost"

**Problem**: Logged out unexpectedly

**Causes**:
1. Browser cleared cookies
2. Token expired
3. Switched browsers

**Solution**:

1. Login again
2. Check browser allows cookies
3. Go to Settings → Privacy
4. Make sure cookies are enabled

---

### Auth Issue 3: "Cannot create account"

**Error**: Sign up fails

**Causes**:
1. Email already exists
2. Password too short
3. Username taken

**Solutions**:

**Try different email**:
1. Use unique email address
2. Example: `user123@gmail.com`

**Use longer password**:
1. Password must be 8+ characters
2. Include uppercase, lowercase, numbers

**Use unique username**:
1. Username must be unique
2. Try adding numbers: `username123`

---

## ⚙️ Platform Features Issues

### Feature Issue 1: "Cannot create post"

**Problem**: Create post button doesn't work

**Causes**:
1. Not logged in
2. Not enough credits
3. Form validation error

**Solutions**:

**Check login**:
1. Go to home page
2. Check if logged in
3. If not, click **"Get Started"** and login

**Check credits**:
1. Go to **Profile**
2. Check credit balance
3. Need at least 10 credits to post
4. If 0, ask admin to top-up

**Check form**:
1. All fields must be filled
2. Title required
3. Content required
4. At least one tag required
5. Post type required

---

### Feature Issue 2: "Comments not showing"

**Problem**: Comments don't appear on posts

**Causes**:
1. No comments created yet
2. Firebase connection issue
3. Browser cache

**Solutions**:

**Create test comment**:
1. Go to any post
2. Scroll to comments section
3. Add a comment
4. Refresh page
5. Should see comment

**Check Firebase**:
1. Go to Firebase Console
2. Firestore → comments collection
3. Should see comments listed

**Clear cache**:
1. Press F12
2. Right-click refresh
3. Click "Empty cache and hard refresh"

---

### Feature Issue 3: "Likes not working"

**Problem**: Like button doesn't work

**Causes**:
1. Not logged in
2. Firebase connection issue
3. Browser issue

**Solutions**:

**Check login**:
1. Must be logged in to like
2. If not, login first
3. Then try liking again

**Refresh page**:
1. Press Ctrl+R (or Cmd+R on Mac)
2. Try liking again

**Check browser console**:
1. Press F12
2. Click **Console** tab
3. Look for error messages
4. Screenshot and share error

---

### Feature Issue 4: "Profile not loading"

**Problem**: Profile page shows error or blank

**Causes**:
1. Not logged in
2. Firebase connection issue
3. Browser cache

**Solutions**:

**Login first**:
1. Profile requires login
2. Go to **Get Started** and login
3. Then click **Profile**

**Refresh page**:
1. Press Ctrl+R
2. Wait for page to load

**Clear cache**:
1. Press F12
2. Right-click refresh
3. Click "Empty cache and hard refresh"

---

## ❓ FAQ

### Q1: How do I reset my password?

**A**: Currently no password reset feature. To reset:
1. Contact admin
2. Admin can delete your account
3. Create new account with same email

---

### Q2: How do I delete my account?

**A**: Contact admin to delete your account:
1. Go to admin panel
2. Users tab
3. Find your account
4. Click delete button

---

### Q3: How do I get verified?

**A**: 
1. Get 1000+ followers
2. Ask admin to verify
3. Admin will grant verification badge
4. Badge shows next to your name

---

### Q4: How do I get more credits?

**A**: 
1. Contact admin
2. Provide reason for credit request
3. Admin can top-up your credits

---

### Q5: Can I delete my posts?

**A**: Yes! Go to your profile and click delete button on any post.

---

### Q6: Can I edit my posts?

**A**: Not yet. Delete and create new post instead.

---

### Q7: How many posts can I create?

**A**: Unlimited! As long as you have credits (10 per post).

---

### Q8: Can I upload images?

**A**: Yes! When creating post, select "Image" type and upload image.

---

### Q9: What are the post types?

**A**: 
- **News**: Breaking news and updates
- **Blog**: Longer articles and tutorials
- **Image**: Image posts with caption

---

### Q10: What are the topic tags?

**A**:
- Cybersecurity
- Exploit
- Tools
- CTF
- Privacy

---

### Q11: How do I report inappropriate content?

**A**: Contact admin with details of post/user. Admin will review and take action.

---

### Q12: Is my data safe?

**A**: Yes! Data stored in Firebase with encryption. Passwords hashed with bcrypt.

---

### Q13: Can I export my data?

**A**: Not yet. Contact admin if you need data export.

---

### Q14: How do I contact admin?

**A**: Admin panel has contact form (coming soon). For now, use GitHub issues.

---

### Q15: Is there a mobile app?

**A**: Not yet. Platform works great on mobile browser!

---

## 🆘 Getting Help

### Where to Find Help

1. **This Guide**: Check troubleshooting section above
2. **Firebase Docs**: https://firebase.google.com/docs
3. **Vercel Docs**: https://vercel.com/docs
4. **GitHub Issues**: Post issue on repository
5. **Browser Console**: Press F12 to see error messages

### How to Report Bugs

1. Go to GitHub repository
2. Click **"Issues"**
3. Click **"New Issue"**
4. Describe problem:
   - What were you doing?
   - What error did you see?
   - What did you expect?
   - Screenshot if possible
5. Click **"Submit"**

### How to Get Support

1. Check this troubleshooting guide
2. Check FAQ section
3. Search GitHub issues
4. Post new GitHub issue with details
5. Include error messages and screenshots

---

## 📊 Debug Information

### Collect Debug Info

When reporting issues, include:

1. **Browser Info**:
   - Browser name and version
   - Operating system

2. **Error Messages**:
   - Full error text
   - Screenshot of error

3. **Steps to Reproduce**:
   - What were you doing?
   - What happened?
   - What should happen?

4. **Console Errors**:
   - Press F12
   - Click Console tab
   - Copy any red error messages

5. **Network Errors**:
   - Press F12
   - Click Network tab
   - Reproduce issue
   - Screenshot network tab

---

## 🔧 Advanced Troubleshooting

### Check Server Logs

**In Vercel**:
1. Go to Vercel Dashboard
2. Click your project
3. Click **"Deployments"**
4. Click latest deployment
5. Scroll down to see logs

### Check Firebase Logs

**In Firebase**:
1. Go to Firebase Console
2. Click **"Firestore Database"**
3. Click **"Logs"** tab
4. See recent database operations

### Check Browser Console

1. Press **F12** to open developer tools
2. Click **"Console"** tab
3. Look for red error messages
4. Copy error text for debugging

---

## 📝 Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| `Firebase credentials missing` | Env vars not set | Set FIREBASE_SERVICE_ACCOUNT |
| `Cannot read posts` | Firebase connection | Check Firebase is running |
| `Unauthorized` | Not logged in | Login first |
| `Insufficient credits` | Not enough credits | Admin top-up credits |
| `Admin panel 404` | Wrong path | Check ADMIN_PANEL_PATH |
| `Permission denied` | Firestore rules | Update security rules |
| `Timeout` | Request too slow | Check network connection |

---

## ✅ Checklist for Troubleshooting

When something doesn't work:

- [ ] Check error message
- [ ] Search this guide
- [ ] Check FAQ section
- [ ] Clear browser cache
- [ ] Refresh page
- [ ] Logout and login
- [ ] Check Firebase Console
- [ ] Check Vercel Dashboard
- [ ] Check browser console (F12)
- [ ] Post GitHub issue with details

---

**Still stuck? Post a GitHub issue with details and we'll help!** 🚀

Happy troubleshooting! ⚡
