# Stock-Trade-App
A production-ready MERN stock trading platform with dashboard analytics, market tracking, portfolio management, and admin oversight.

## Stack

- **Frontend:** React, Vite, React Router, Material UI, React Query, Recharts
- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT, bcrypt, Helmet, CORS, rate limiting
- **Deployment:** Vercel, Render, MongoDB Atlas

## Project Structure

- `client/` - React application
- `server/` - Express API and business logic
- `docs/` - API, architecture, and deployment documentation
- `.env.example` - Environment variable template

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Install app-specific dependencies:**
   ```bash
   npm --prefix client install
   npm --prefix server install
   ```
3. **Copy environment variables:**
   ```bash
   cp .env.example .env
   ```
4. **Start the app:**
   ```bash
   npm run dev
   ```

## Default Demo Credentials

- **Admin:** `admin@stockx.dev` / `admin123`
- **User:** `demo@stockx.dev` / `demo123`

## API Reference

See [docs/api.md](docs/api.md) for the full endpoint list.

## Production Deployment

- **Frontend:** Vercel
- **Backend:** Render
- **Database:** MongoDB Atlas
- **Health Endpoint:** `/api/health`
