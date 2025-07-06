# Vercel Deployment Guide

## Quick Setup (5 minutes)

### 1. Prepare for Production
```bash
# Your package.json is already configured with:
# "build": "prisma generate && next build"
# "postinstall": "prisma generate"

# Just commit your changes
git add .
git commit -m "Ready for Vercel deployment"
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
4. **Build Settings** (Vercel auto-detects, but confirm):
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)
   - **Node.js Version**: 18.x or 20.x (recommended)

5. Add environment variables:
   - `DATABASE_URL` (from Vercel Postgres)
   - `NEXTAUTH_SECRET` (generate random string)
   - `NEXTAUTH_URL` (will be your deployed URL)

### 4. Custom Domain Setup
**Option 1: Free Vercel Subdomain**
- Automatic: `your-app-name.vercel.app`
- Ready immediately after deployment

**Option 2: Custom Domain**
1. Buy domain from any registrar (Namecheap, GoDaddy, etc.)
2. In Vercel dashboard → Project → Settings → Domains
3. Add your domain (e.g., `blazers-nicknames.com`)
4. Update DNS records at your registrar:
   - **A Record**: `@` → `76.76.19.61`
   - **CNAME**: `www` → `cname.vercel-dns.com`
5. Vercel handles SSL certificates automatically

**Domain Suggestions:**
- `blazers-nicknames.com`
- `trailblazers-voting.com`
- `riptown-nicknames.com`

### 4. Database Setup
- Use Vercel Postgres (free tier: 60 hours compute/month)
- After deployment, go to Storage tab in Vercel dashboard
- Create Postgres database
- Copy connection string to `DATABASE_URL`
- Run database setup:
  ```bash
  # In Vercel dashboard terminal or locally with production DATABASE_URL
  npx prisma db push
  npx prisma db seed
  ```

## Quick Deploy Checklist
✅ **Vercel Settings (Auto-detected)**
- Framework: Next.js
- Build Command: `prisma generate && next build` ✅ **FIXED**
- Output Directory: `.next`
- Install Command: `npm install`
- Node.js Version: 20.x

✅ **Prisma Fix Applied**
- Build script now runs `prisma generate` before `next build`
- `postinstall` script ensures Prisma client is generated
- No more "outdated Prisma Client" errors on Vercel

✅ **Environment Variables**
```env
DATABASE_URL=postgresql://... # From Vercel Postgres
NEXTAUTH_URL=https://your-app.vercel.app # Your deployed URL
NEXTAUTH_SECRET=your-super-secret-random-string-here
```

✅ **Domain Options**
- **Free**: `your-app.vercel.app` (instant)
- **Custom**: Point your domain to Vercel (5 minutes setup)

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
