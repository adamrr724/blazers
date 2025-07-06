# Vercel Deployment Guide

## 🚨 DATABASE ERROR FIX

**Error**: `Can't reach database server at localhost:5432`
**Solution**: You need to set up Vercel Postgres and add DATABASE_URL

## Step-by-Step Fix:

### 1. Set Up Vercel Postgres Database
1. Go to your Vercel project dashboard
2. Click **Storage** tab
3. Click **Create Database** → **Postgres**
4. Choose a database name (e.g., `blazers-db`)
5. Select region (same as your app)
6. Copy the connection string

### 2. Add Environment Variables
Go to **Settings** → **Environment Variables** and add:

```
DATABASE_URL=postgresql://username:password@host:5432/database
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-super-secret-random-string-here
```

### 3. Deploy Database Schema
After adding DATABASE_URL, redeploy and run:
```bash
# In Vercel dashboard terminal or locally with production DATABASE_URL
npx prisma db push
npx prisma db seed
```

### 4. Redeploy Your App
- Trigger a new deployment (push code or manual redeploy)
- Database should now connect properly

## Environment Variables for Vercel:

```
DATABASE_URL=postgresql://... (from Vercel Postgres - REQUIRED!)
NEXTAUTH_URL=https://your-domain.com (your deployed URL)
NEXTAUTH_SECRET=your-production-secret-here (random string)
```

## Domain Options:

### Free Subdomain:
- blazers-nicknames.vercel.app
- trail-blazers-voting.vercel.app
- pdx-nicknames.vercel.app

### Custom Domain Examples:
- blazersnicknames.com
- trailblazersvoting.com
- pdxnicknames.com

## Next Steps:
1. Run the deployment setup script
2. Connect your GitHub repository
3. Add environment variables
4. Configure your domain
