# Fullstack App

A modern full-stack web application with user authentication and CRUD operations.

## Live Demo

- **Frontend:** https://fullstack-be7l6qa7u-soham-cyber-devs-projects.vercel.app
- **Backend API:** https://fullstack-app-api-is6i.onrender.com/api/health

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite + Tailwind CSS |
| Backend | Node.js + Express |
| Database | PostgreSQL (Neon) |
| Auth | JWT + bcrypt |
| Hosting | Vercel + Render + Neon |
| CI/CD | GitHub Actions |

## Features

- User registration and login with JWT authentication
- Full CRUD operations on items
- Protected routes
- Futuristic dark glassmorphism UI
- Automated CI/CD pipeline

## Local Development

### Backend
```bash
cd server
npm install
npm run dev
```

### Frontend
```bash
cd client
npm install
npm run dev
```

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/auth/register | Register new user | No |
| POST | /api/auth/login | Login | No |
| GET | /api/items | Get all items | Yes |
| POST | /api/items | Create item | Yes |
| PUT | /api/items/:id | Update item | Yes |
| DELETE | /api/items/:id | Delete item | Yes |
