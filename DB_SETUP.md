# Database Setup Instructions

## Getting Your Neon Database URL

1. Go to [Neon Console](https://console.neon.tech/)
2. Create a new project or select existing project
3. Go to **Settings** → **Connection Details**
4. Copy the **Connection string** under **Connection parameters**
5. Replace the placeholder in `.env.local` with your actual connection string

## Example Neon URL Format
```
DATABASE_URL=postgresql://your_username:your_password@ep-xxxxxxxx.us-east-2.aws.neon.tech/neondb?sslmode=require
```

## After Setting Up
1. Update `.env.local` with your real Neon URL
2. Restart the development server: `npm run dev`
3. Visit `http://localhost:3000` to see the app

## Important
- Never commit `.env.local` to git
- The URL should look like `postgresql://user:pass@host/db?sslmode=require`
- Your username/password/host will be different from the placeholder