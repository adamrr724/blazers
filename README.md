# 🏀 Unofficial Portland Trail Blazers Nickname Voting App

> **Disclaimer**: This is an unofficial fan-created application and is not affiliated with, endorsed by, or connected to the Portland Trail Blazers, the NBA, or any official team entities.

A full-stack Next.js application that allows Portland Trail Blazers fans to vote on and suggest player nicknames. The app includes user authentication, voting functionality, and admin moderation capabilities.

## ✨ Features

- **User Authentication**: Secure sign-in with credentials
- **Player Roster**: Complete current Trail Blazers roster with photos
- **Nickname Voting**: Vote for your favorite fan-suggested nicknames (one vote per player per user)
- **Nickname Suggestions**: Submit new nickname ideas for players
- **Admin Dashboard**: Moderate nickname suggestions (approve/reject)
- **Real-time Vote Counting**: Live vote counts for each nickname
- **Responsive Design**: Works on desktop, tablet, and mobile

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API routes
- **Database**: SQLite (development)
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS with Trail Blazers theme

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd blazers-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your values (defaults should work for development)
   ```

4. **Set up the database**
   ```bash
   npm run db:push
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Visit [http://localhost:3000](http://localhost:3000)

## 🧹 Development

**Available Scripts:**
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application
- `npm run start` - Start production server  
- `npm run lint` - Run ESLint
- `npm run db:push` - Push schema changes to database
- `npm run db:seed` - Seed database with demo data
- `npm run db:studio` - Open Prisma Studio
- `npm run db:generate` - Generate Prisma client

**Code Quality:**
- ✅ TypeScript with strict mode
- ✅ ESLint with Next.js configuration
- ✅ Tailwind CSS for styling
- ✅ Prisma for database operations
- ✅ NextAuth.js for authentication
- ✅ All lint warnings resolved
- ✅ Image optimization with next/image
- ✅ Proper Link components for navigation

## 🏀 Current Roster

The app features the complete 2024-25 Trail Blazers roster:
- Deni Avdija (#8, Small Forward)
- Scoot Henderson (#00, Point Guard) 
- Shaedon Sharpe (#17, Shooting Guard)
- Toumani Camara (#33, Small Forward)
- Jerami Grant (#9, Power Forward)
- Donovan Clingan (#23, Center)
- Jrue Holiday (#4, Point Guard)
- Matisse Thybulle (#10, Shooting Guard)
- Robert Williams III (#35, Center) - "Timelord"
- Hansen Yang (#16, Guard)
- Duop Reath (#26, Center)
- Kris Murray (#25, Small Forward)
- Ryan Rupert (#50, Shooting Guard)
- Caleb Love (#20, Shooting Guard)
- Sidy Cissoko (#12, Guard)

## 🚀 Quick Start (Development)

### Prerequisites
- Node.js 20+ 
- npm or yarn

### Setup
1. **Clone and install dependencies:**
```bash
git clone <repository-url>
cd blazers-app
npm install
```

2. **Set up the database:**
```bash
npx prisma db push
npm run db:seed
```

3. **Start development server:**
```bash
npm run dev
```

4. **Open your browser:**
Navigate to [http://localhost:3000](http://localhost:3000)

### Demo Accounts (Development Only)
- **Fan Account**: `fan@blazers.com` / `password`
- **Admin Account**: `admin@blazers.com` / `admin123`

*Note: Demo accounts are only shown on the sign-in page during development. In production, users must create their own accounts.*

## 🎯 Demo Accounts

The seed script creates demo accounts for testing:

- **Admin**: `admin@blazers.com` / `admin123`
- **Fan**: `fan@blazers.com` / `fan123`

## 👨‍💼 Admin Account Management

### Creating Admin Accounts in Production

#### Option 1: Create a new admin user
```bash
npm run admin:create <email> <password> [name]
# Example: npm run admin:create admin@yoursite.com SecurePass123 "Site Administrator"
```

#### Option 2: Promote an existing user to admin
```bash
npm run admin:promote <email>
# Example: npm run admin:promote user@example.com
```

### On Google Cloud Platform
```bash
# After deployment, create an admin account
gcloud app exec "npm run admin:create admin@yoursite.com SecurePass123"

# Or promote an existing user
gcloud app exec "npm run admin:promote user@example.com"
```

**Security Note**: Always use strong passwords for admin accounts in production!

## 🌐 Production Deployment to Google Cloud Platform

### Option 1: Automated Deployment Script (Recommended)

1. **Install Google Cloud SDK:**
```bash
# macOS
brew install --cask google-cloud-sdk

# Windows/Linux
# Download from: https://cloud.google.com/sdk/docs/install
```

2. **Authenticate and set up project:**
```bash
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
```

3. **Run the automated deployment script:**
```bash
./deploy.sh
```

The script will:
- Enable required GCP APIs
- Create a PostgreSQL Cloud SQL instance
- Deploy to App Engine
- Provide next steps for database setup

### Option 2: Manual Deployment Steps

#### Step 1: Prepare Google Cloud Project
```bash
# Create a new project (optional)
gcloud projects create blazers-nickname-app
gcloud config set project blazers-nickname-app

# Enable required APIs
gcloud services enable cloudbuild.googleapis.com
gcloud services enable appengine.googleapis.com
gcloud services enable sqladmin.googleapis.com
```

#### Step 2: Set up Cloud SQL Database
```bash
# Create PostgreSQL instance
gcloud sql instances create blazers-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=us-central1

# Set password for postgres user
gcloud sql users set-password postgres \
  --instance=blazers-db \
  --password=YOUR_SECURE_PASSWORD

# Create application database
gcloud sql databases create blazers_app --instance=blazers-db

# Get connection details
gcloud sql instances describe blazers-db \
  --format="value(ipAddresses[0].ipAddress)"
```

#### Step 3: Configure Environment Variables
Update `app.yaml` with your database connection:
```yaml
env_variables:
  DATABASE_URL: postgresql://postgres:PASSWORD@HOST:5432/blazers_app?schema=public
  NEXTAUTH_URL: https://YOUR_PROJECT_ID.uc.r.appspot.com
  NEXTAUTH_SECRET: YOUR_LONG_RANDOM_SECRET_KEY
```

#### Step 4: Deploy Application
```bash
# Deploy to App Engine
gcloud app deploy

# Run database migrations
gcloud app exec 'npm run db:migrate'

# Seed the database
gcloud app exec 'npm run db:seed'
```

### Option 3: Docker Deployment

#### Build and run locally:
```bash
docker build -t blazers-app .
docker run -p 3000:3000 blazers-app
```

#### Deploy to Google Cloud Run:
```bash
# Build and push to Container Registry
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/blazers-app

# Deploy to Cloud Run
gcloud run deploy blazers-app \
  --image gcr.io/YOUR_PROJECT_ID/blazers-app \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `NEXTAUTH_URL` | App URL for NextAuth | `https://your-app.uc.r.appspot.com` |
| `NEXTAUTH_SECRET` | Secret for JWT signing | `long-random-string` |

### Database Schema
- **Users**: Authentication and role management (USER/ADMIN)
- **Players**: Trail Blazers roster with positions and jersey numbers
- **Nicknames**: Fan suggestions with approval status (PENDING/APPROVED/REJECTED)
- **Votes**: User votes for approved nicknames (one per player per user)

## 📊 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/*` | Various | NextAuth.js authentication |
| `/api/nicknames` | GET/POST | List and create nicknames |
| `/api/votes` | POST | Submit votes for nicknames |
| `/api/admin/nicknames` | GET | Admin: List all nicknames |
| `/api/admin/nicknames/[id]` | PUT/DELETE | Admin: Approve/reject nicknames |

## 🎯 Performance Optimizations

- ✅ Next.js 15 with App Router
- ✅ Server-side rendering for SEO
- ✅ Optimized images with Next.js Image component
- ✅ Database indexing for fast queries
- ✅ Responsive design with Tailwind CSS
- ✅ Production-ready Docker configuration

## 🛡️ Security Features

- ✅ Secure authentication with NextAuth.js
- ✅ Password hashing with bcryptjs
- ✅ Role-based access control (User/Admin)
- ✅ Input validation and sanitization
- ✅ CSRF protection
- ✅ Environment variable protection

## 📱 Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is for educational and entertainment purposes only. All team logos, player images, and trademarks are property of their respective owners.

## ⚠️ Legal Disclaimer

This is an unofficial fan-created application and is not affiliated with, endorsed by, or connected to the Portland Trail Blazers, the NBA, or any official team entities. All team logos, player images, and trademarks are property of their respective owners. This site is for entertainment purposes only.
