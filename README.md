# Voting App

A Next.js voting application with Neon PostgreSQL database.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up your Neon database and get the connection string.

3. Create a `.env.local` file and add your database URL:
```
DATABASE_URL=postgresql://username:password@ep-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require
```

4. Run the development server:
```bash
npm run dev
```

## Features

- Create polls with multiple options
- Vote on polls (one vote per poll)
- View poll results
- Responsive design with Tailwind CSS

## Database Schema

- `users` - User information
- `polls` - Poll questions and metadata
- `poll_options` - Available options for each poll
- `votes` - User votes (one per poll per user)

## API Routes

- `GET/POST /api/polls` - List and create polls
- `GET /api/polls/[id]` - Get specific poll
- `POST /api/polls/[id]/vote` - Vote on a poll