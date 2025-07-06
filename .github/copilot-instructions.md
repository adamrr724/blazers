# Copilot Instructions for Portland Trail Blazers Nickname Voting App

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
This is a full-stack Next.js application for Portland Trail Blazers fans to vote on and suggest player nicknames. The app includes user authentication, voting functionality, and admin moderation capabilities.

## Tech Stack
- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API routes
- **Database**: Prisma with PostgreSQL (or SQLite for development)
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS with custom Trail Blazers theme

## Key Features
- User authentication (fans and admin)
- Player roster with official photos
- Nickname voting system (one vote per player per user)
- Nickname suggestion system
- Admin dashboard for moderating suggestions
- Real-time vote counting
- Responsive design

## Code Guidelines
- Use TypeScript for all components and API routes
- Follow Next.js App Router conventions
- Use Tailwind CSS for styling with Trail Blazers color scheme (red, black, white)
- Implement proper error handling and loading states
- Use React Server Components where appropriate
- Follow accessibility best practices

## Database Schema
- Users (id, email, name, role, createdAt)
- Players (id, name, position, jerseyNumber, imageUrl, officialNickname)
- Nicknames (id, playerId, nickname, suggestedBy, status, votes, createdAt)
- Votes (id, userId, nicknameId, createdAt)

## API Structure
- `/api/auth/*` - Authentication routes
- `/api/players` - Player management
- `/api/nicknames` - Nickname CRUD operations
- `/api/votes` - Voting functionality
- `/api/admin/*` - Admin moderation tools
