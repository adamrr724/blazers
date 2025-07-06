#!/bin/bash

echo "🚀 Vercel Deployment Setup for Trail Blazers Nickname App"
echo "========================================================"

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📁 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit: Trail Blazers Nickname Voting App"
fi

echo ""
echo "🌟 Next Steps:"
echo ""
echo "1. Push to GitHub:"
echo "   - Create a new repository on GitHub"
echo "   - git remote add origin <your-github-url>"
echo "   - git push -u origin main"
echo ""
echo "2. Deploy to Vercel:"
echo "   - Go to https://vercel.com"
echo "   - Sign up/in with GitHub"
echo "   - Import your repository"
echo "   - Add environment variables (see .env.production)"
echo "   - Deploy!"
echo ""
echo "3. Add Vercel Postgres Database:"
echo "   - In Vercel dashboard, go to Storage tab"
echo "   - Create new Postgres database"
echo "   - Copy connection string to POSTGRES_URL"
echo ""
echo "4. Configure Domain:"
echo "   - In project settings, go to Domains tab"
echo "   - Add your custom domain OR use free .vercel.app domain"
echo ""
echo "🎯 Suggested domain names:"
echo "   - blazers-nicknames.vercel.app (free)"
echo "   - trail-blazers-voting.vercel.app (free)"
echo "   - blazersnicknames.com (custom, ~$12/year)"
echo ""
echo "✅ Your app will be live in ~5 minutes!"
