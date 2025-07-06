# Vercel Deployment Guide

## Quick Setup (5 minutes)

### 1. Prepare for Production
```bash
# Update package.json build script for Vercel
npm install @vercel/postgres
```

### 2. Push to GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 3. Deploy to Vercel
1. Go to https://vercel.com
2. Sign up/in with GitHub
3. Import your repository
4. Add environment variables:
   - `DATABASE_URL` (Vercel will provide)
   - `NEXTAUTH_SECRET` (generate random string)
   - `NEXTAUTH_URL` (Vercel will provide)

### 4. Database Setup
- Use Vercel Postgres (free tier)
- Run database migrations after deployment

## Environment Variables for Vercel
```
DATABASE_URL=postgresql://...  # From Vercel Postgres
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-random-secret-here
```

## Alternative: Railway ($5/month)
- Very easy setup
- Includes PostgreSQL
- One-click deploy

## Alternative: Netlify (Free)
- Need external database (Supabase free tier)
- Good for static sites, okay for Next.js
