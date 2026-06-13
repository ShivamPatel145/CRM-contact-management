# Veselty - CRM Contact Management System

> A production-grade, full-stack CRM application built with the MERN stack designed to help teams scale seamlessly by tracking and managing all their contacts securely.

![Veselty Dashboard](https://img.shields.io/badge/Status-Production_Ready-success)
![MERN Stack](https://img.shields.io/badge/Stack-MongoDB_Express_React_Node-blue)
![Vite](https://img.shields.io/badge/Bundler-Vite-646CFF)

## ✨ Features

- **Secure Authentication:** Robust user registration and login system using JWT (JSON Web Tokens) and strict data validation (Zod).
- **Interactive Dashboard:** Data visualizations using Recharts to monitor contact metrics and activity.
- **Contact Management (CRUD):** Create, read, update, and delete contact information with ease.
- **Advanced Filtering & Search:** Quickly find contacts with powerful search queries and paginated tables.
- **Modern UI/UX:** Responsive, accessible, and beautiful interface built with Tailwind CSS, Lucide icons, and Radix UI components. Dark mode supported!
- **Performance Optimized:** Fast client-side routing, optimistic UI updates, and efficient data fetching via React Query.

## 🛠️ Tech Stack

**Frontend**
- React 19 + Vite
- React Router DOM
- Tailwind CSS
- React Hook Form + Zod
- TanStack React Query
- Radix UI Primitives & Recharts

**Backend**
- Node.js & Express
- MongoDB & Mongoose
- JSON Web Token (JWT) & bcryptjs
- Express Rate Limit & Helmet for Security
- Zod for request validation

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas)

### 1. Clone the Repository
```bash
git clone https://github.com/ShivamPatel145/CRM-contact-management.git
cd CRM-contact-management
```

### 2. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Create environment variables file
cp .env.example .env
```

**Configure Backend `.env`**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

**Start the Backend Server**
```bash
npm run dev
# API running at http://localhost:5000/api
```

### 3. Frontend Setup
Open a new terminal session in the project root:
```bash
cd frontend

# Install dependencies
npm install

# Create environment variables file (Optional if using defaults)
# .env -> VITE_API_URL=http://localhost:5000/api
```

**Start the Frontend App**
```bash
npm run dev
# App running at http://localhost:5173
```

---

## 🌍 Deployment (Vercel)

This project is configured as a Monorepo for easy deployment on **Vercel**. 

1. Push your repository to GitHub.
2. Go to Vercel and import your repository.
3. Keep the **Framework Preset** as `Other` and **Root Directory** as `./`.
4. The included `vercel.json` will automatically build the Vite frontend and set up the Express backend as Serverless Functions at `/api`.
5. Ensure you add the production Environment Variables in the Vercel dashboard:
   - `NODE_ENV=production`
   - `MONGODB_URI=...`
   - `JWT_SECRET=...`
   - `JWT_EXPIRES_IN=7d`
   - `CLIENT_URL=https://your-app-url.vercel.app`

## 🛡️ Security Features
- **Rate Limiting:** Prevents brute-force attacks on authentication endpoints.
- **Helmet.js:** Sets secure HTTP headers out of the box.
- **CORS Restricted:** Backend only accepts requests from the configured `CLIENT_URL`.
- **Payload Limits:** Maximum JSON payload size restricted to prevent DoS attacks.
