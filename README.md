<div align="center">

# Store Rating Platform

### A full-stack web application that allows users to discover, rate, and review stores registered on the platform.

Built as a production-level internship assignment demonstrating modern full-stack development practices.

![Node.js](https://img.shields.io/badge/Node.js-v20.20.2-339933?style=flat-square&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-4.x-000000?style=flat-square&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-5.x-2D3748?style=flat-square&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)

</div>

---

## Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [User Roles](#-user-roles)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Clone the Repository](#clone-the-repository)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#-environment-variables)
- [Database Setup](#-database-setup)
- [Running the Application](#-running-the-application)
- [API Reference](#-api-reference)
- [Build for Production](#-build-for-production)
- [Troubleshooting](#-troubleshooting)
- [Future Improvements](#-future-improvements)

---

## Overview

The **Store Rating Platform** is a full-stack web application where:

- **System Administrators** manage users and stores across the platform
- **Normal Users** can browse stores, submit ratings (1–5 stars), and update their ratings
- **Store Owners** can monitor their store's average rating and view which users rated them

The platform features a **single unified login system** with role-based access control, ensuring each user type sees only the features relevant to them. The UI is fully responsive across all device sizes — mobile, tablet, and desktop.

---

## Features

### Authentication & Security
- Single login system for all user roles
- JWT-based authentication with secure token storage
- Bcrypt password hashing (12 salt rounds)
- Protected routes — role-based access control
- Auto logout on token expiry

### Admin Features
- Platform statistics dashboard (total users, stores, ratings)
- Create new users with any role (Admin, User, Store Owner)
- Create and assign stores to store owners
- View all users with name, email, address, and role
- View all stores with name, email, address, and average rating
- Search, filter by role, sort by any column, and paginate all listings

### Normal User Features
- Public registration with validated form
- Browse all registered stores with search
- View overall store ratings
- Submit a rating (1–5 stars) for any store
- Update a previously submitted rating
- Change account password

### Store Owner Features
- View their store's average rating dashboard
- See a complete list of users who rated their store
- Change account password

### UI/UX Features
- Fully responsive layout (mobile, tablet, desktop)
- Animated sidebar drawer on mobile
- Skeleton loading states for all data
- Toast notifications for all actions
- Accessible modal dialogs with transitions
- Sortable columns in all data tables
- Server-side search, filter, sort, and pagination
- Empty states for zero-data scenarios
- Form validation with real-time error messages

---

## Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| **Express.js** | REST API server framework |
| **JavaScript (CommonJS)** | Backend language |
| **Prisma ORM** | Database access and migrations |
| **PostgreSQL (Neon DB)** | Cloud PostgreSQL database |
| **JSON Web Tokens (JWT)** | Authentication and authorization |
| **bcryptjs** | Secure password hashing |
| **Zod** | Request body validation |
| **dotenv** | Environment variable management |
| **Nodemon** | Development auto-restart |

### Frontend
| Technology | Purpose |
|---|---|
| **React.js 18** | UI library |
| **TypeScript** | Type-safe JavaScript |
| **Vite** | Fast build tool and dev server |
| **Tailwind CSS** | Utility-first CSS framework |
| **React Router DOM v6** | Client-side routing |
| **Context API** | Authentication state management |
| **TanStack Query (React Query)** | Server state management and caching |
| **TanStack Table** | Headless table with sorting |
| **Axios** | HTTP client with interceptors |
| **React Hook Form** | Performant form state management |
| **Zod** | Frontend schema validation |
| **Headless UI** | Accessible modal and dialog components |
| **react-icons** | Icon library |
| **react-loading-skeleton** | Loading placeholder components |
| **react-hot-toast** | Toast notification system |

---

## User Roles

The platform supports three distinct roles, all sharing a single login page:

### 1. System Administrator (`ADMIN`)
The admin has full platform control. Admins are created by other admins (not via public signup). Upon login, admins are directed to their management dashboard where they can:
- View real-time statistics of the platform
- Create users of any role
- Create stores and assign them to store owners
- Search, filter, sort, and paginate users and stores

### 2. Normal User (`USER`)
Normal users are the primary audience of the platform. They register through the public signup page. Upon login they can:
- Browse all stores on the platform
- Search stores by name or address
- Submit a star rating (1–5) for any store (one rating per store)
- Update a rating they previously submitted
- Change their account password

### 3. Store Owner (`STORE_OWNER`)
Store owners are created by admins and have a store assigned to them. They cannot self-register. Upon login they can:
- View their store's average rating
- View the list of users who submitted ratings and their individual scores
- Change their account password

---

## Project Structure
```bash
store-rating-platform/
│
├── backend/                          # Express.js REST API
│   ├── prisma/
│   │   ├── schema.prisma             # Database schema (User, Store, Rating)
│   │   └── seed.js                   # Database seeder with sample data
│   ├── src/
│   │   ├── config/
│   │   │   └── prisma.js             # Prisma client instance
│   │   ├── controllers/
│   │   │   ├── auth.controller.js    # Register, login, change password
│   │   │   ├── admin.controller.js   # Dashboard stats, create/list users & stores
│   │   │   ├── user.controller.js    # Browse stores, submit/update ratings
│   │   │   └── storeOwner.controller.js  # Store dashboard
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js    # JWT token verification
│   │   │   ├── role.middleware.js    # Role-based access control
│   │   │   └── error.middleware.js   # Centralized error handling
│   │   ├── routes/
│   │   │   ├── auth.routes.js        # /api/auth/*
│   │   │   ├── admin.routes.js       # /api/admin/*
│   │   │   ├── user.routes.js        # /api/user/*
│   │   │   └── storeOwner.routes.js  # /api/store-owner/*
│   │   ├── utils/
│   │   │   ├── asyncHandler.js       # Async error wrapper
│   │   │   ├── jwt.js                # Token generation and verification
│   │   │   └── password.js           # Hash and compare passwords
│   │   └── validators/
│   │       └── schemas.js            # Zod validation schemas
│   ├── app.js                        # Express app entry point
│   ├── .env                          # Environment variables (not committed)
│   ├── .env.example                  # Environment variable template
│   └── package.json
│
└── frontend/                         # React + TypeScript + Vite
├── src/
│   ├── api/
│   │   ├── axios.ts              # Axios instance with interceptors
│   │   ├── auth.api.ts           # Auth API calls
│   │   ├── admin.api.ts          # Admin API calls
│   │   ├── user.api.ts           # User API calls
│   │   └── storeOwner.api.ts     # Store owner API calls
│   ├── components/
│   │   ├── layout/
│   │   │   ├── DashboardLayout.tsx
│   │   │   ├── Sidebar.tsx       # Responsive sidebar with mobile drawer
│   │   │   └── Navbar.tsx
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── StarRating.tsx
│   │   │   ├── AppModal.tsx      # Headless UI modal
│   │   │   ├── ConfirmDialog.tsx
│   │   │   ├── DataTable.tsx     # TanStack Table wrapper
│   │   │   ├── Pagination.tsx
│   │   │   └── EmptyState.tsx
│   │   └── forms/
│   │       ├── CreateUserForm.tsx
│   │       └── CreateStoreForm.tsx
│   ├── context/
│   │   └── AuthContext.tsx       # Global auth state
│   ├── hooks/
│   │   └── useDebounce.ts
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.tsx
│   │   │   └── Register.tsx
│   │   ├── admin/
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── AdminUsers.tsx
│   │   │   └── AdminStores.tsx
│   │   ├── user/
│   │   │   └── UserDashboard.tsx
│   │   ├── storeOwner/
│   │   │   └── StoreOwnerDashboard.tsx
│   │   └── ChangePassword.tsx
│   ├── routes/
│   │   ├── ProtectedRoute.tsx
│   │   └── RoleRoute.tsx
│   ├── types/
│   │   └── index.ts              # Shared TypeScript types
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .env                          # Frontend environment variables
├── .env.example
├── tailwind.config.js
├── vite.config.ts
└── package.json

---

## Getting Started

### Prerequisites

Make sure the following are installed on your machine before proceeding:

| Tool | Version | Download |
|---|---|---|
| **Node.js** | v20.20.2 or higher | [nodejs.org](https://nodejs.org) |
| **npm** | v9.x or higher | Comes with Node.js |
| **Git** | Latest | [git-scm.com](https://git-scm.com) |

You will also need a free **Neon PostgreSQL** database:
1. Go to [neon.tech](https://neon.tech) and create a free account
2. Click **New Project** and name it `store-rating-platform`
3. Once created, go to **Connection Details**
4. Copy the connection string — you will use this as `DATABASE_URL`

---

### Clone the Repository

```bash
git clone https://github.com/your-username/store-rating-platform.git
cd store-rating-platform
```

---

### Backend Setup

```bash
# Step 1 — Navigate to backend folder
cd backend

# Step 2 — Install all dependencies
npm install
```

---

### Frontend Setup

Open a **new terminal** in the root of the project:

```bash
# Step 1 — Navigate to frontend folder
cd frontend

# Step 2 — Install all dependencies
npm install
```

---

## Environment Variables

### Backend — `backend/.env`

Create a file named `.env` inside the `backend/` folder and add the following:

```env
# PostgreSQL connection string from Neon DB
DATABASE_URL="postgresql://username:password@ep-xxxx-xxxx.us-east-2.aws.neon.tech/neondb?sslmode=require"

# JWT secret key — use a long random string (minimum 32 characters)
JWT_SECRET="your_super_secret_jwt_key_minimum_32_characters_here"

# JWT expiry duration
JWT_EXPIRES_IN="7d"

# Express server port
PORT=5000

# Node environment
NODE_ENV=development
```

> **Important:** Replace `DATABASE_URL` with your actual Neon DB connection string. Never commit your `.env` file to version control.

---

### Frontend — `frontend/.env`

Create a file named `.env` inside the `frontend/` folder and add the following:

```env
# Backend API base URL
VITE_API_URL=http://localhost:5000/api
```

---

## Database Setup

After configuring your `DATABASE_URL` in `backend/.env`, run the following commands from inside the `backend/` directory:

```bash
# Step 1 — Generate the Prisma client
npx prisma generate

# Step 2 — Run database migrations (creates all tables)
npx prisma migrate dev --name init

# Step 3 — Seed the database with sample data
node prisma/seed.js
```

After seeding, the following accounts are available for testing:

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@storerating.com` | `Admin@12345secure` |
| **User 1** | `rahul.kumar@example.com` | `User1@12345secure` |
| **User 2** | `priya.sharma@example.com` | `User2@12345secure` |
| **User 3** | `amit.patel@example.com` | `User3@12345secure` |
| **Store Owner 1** | `suresh.reddy@techmart.com` | `Owner1@12345secure` |
| **Store Owner 2** | `meena.iyer@fashionhub.com` | `Owner2@12345secure` |
| **Store Owner 3** | `vikram.singh@foodcorner.com` | `Owner3@12345secure` |

> **Tip:** You can view and edit your database tables visually using Prisma Studio:
> ```bash
> npx prisma studio
> ```
> This opens a browser-based GUI at `http://localhost:5555`

---

## Running the Application

### Run the Backend Server

From inside the `backend/` directory:

```bash
npm run dev
```

The backend API will start at: **`http://localhost:5000`**

Health check endpoint: `GET http://localhost:5000/health`

---

### Run the Frontend Dev Server

From inside the `frontend/` directory:

```bash
npm run dev
```

The React application will start at: **`http://localhost:3000`**

---

### Default Ports

| Service | Port | URL |
|---|---|---|
| Backend API | `5000` | http://localhost:5000 |
| Frontend App | `3000` | http://localhost:3000 |
| Prisma Studio | `5555` | http://localhost:5555 |

---

## API Reference

### Base URL
http://localhost:5000/api

### Authentication Endpoints

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `POST` | `/auth/register` |  | Register a new normal user |
| `POST` | `/auth/login` |  | Login for all roles |
| `POST` | `/auth/change-password` | Any | Update account password |
| `GET` | `/auth/me` | Any | Get current logged-in user |

### Admin Endpoints

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `GET` | `/admin/dashboard` |  Admin | Platform statistics |
| `POST` | `/admin/users` |  Admin | Create a new user |
| `GET` | `/admin/users` |  Admin | List users (search/filter/sort/paginate) |
| `GET` | `/admin/users/:id` | Admin | Get single user details |
| `POST` | `/admin/stores` | Admin | Create a new store |
| `GET` | `/admin/stores` |  Admin | List stores (search/sort/paginate) |

### User Endpoints

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `GET` | `/user/stores` | User | Browse stores (search/sort/paginate) |
| `POST` | `/user/ratings` | User | Submit a rating for a store |
| `PUT` | `/user/ratings/:storeId` | User | Update an existing rating |

### Store Owner Endpoints

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `GET` | `/store-owner/dashboard` | Store Owner | Store stats and rater list |

### Authorization Header Format

All protected endpoints require this header:
Authorization: Bearer <your_jwt_token>

> **Postman Testing:** Import requests into Postman. After login, copy the `token` from the response and set it as a Bearer Token in the Authorization tab for all subsequent requests.

---

## Build for Production

### Build the Frontend

From inside the `frontend/` directory:

```bash
npm run build
```

This generates an optimized production build in the `frontend/dist/` folder.

### Preview the Production Build

```bash
npm run preview
```

### Start the Backend in Production Mode

From inside the `backend/` directory:

```bash
npm start
```

---

## Form Validation Rules

All forms follow these validation rules (enforced on both frontend and backend):

| Field | Rules |
|---|---|
| **Name** | Minimum 20 characters, maximum 60 characters |
| **Email** | Must be a valid email format |
| **Password** | 8–16 characters, at least one uppercase letter, at least one special character |
| **Address** | Maximum 400 characters |
| **Rating** | Integer between 1 and 5 (inclusive) |

---

## Troubleshooting

### `Error: DATABASE_URL is not set`
Make sure you have created the `backend/.env` file and added a valid `DATABASE_URL`. Check that there are no trailing spaces or missing quotes around the connection string.

---

### `PrismaClientInitializationError` on startup
Run the following commands in order inside the `backend/` folder:
```bash
npx prisma generate
npx prisma migrate dev --name init
```

---

### Frontend shows blank page or 404
Make sure both the backend and frontend servers are running simultaneously in separate terminals. Also verify that `VITE_API_URL` in `frontend/.env` points to `http://localhost:5000/api`.

---

### Login returns `Invalid credentials`
Run the seed script to create sample accounts:
```bash
node prisma/seed.js
```
Then use the credentials listed in the [Database Setup](#-database-setup) section.

---

### `CORS error` in browser console
Make sure the backend is running on port `5000`. The Express server has CORS enabled for all origins in development mode. If you change the backend port, also update `VITE_API_URL` in `frontend/.env`.

---

### `Cannot find module '@prisma/client'`
Run `npx prisma generate` inside the `backend/` folder to regenerate the Prisma client after installing dependencies.

---

### Port already in use
If port `5000` or `3000` is already taken, update the port:
- **Backend:** Change `PORT=5000` in `backend/.env`
- **Frontend:** Update `VITE_API_URL` in `frontend/.env` to match the new backend port

---

### Store owner cannot see their dashboard
A store must be assigned to the store owner by an admin first. Login as admin, go to **Manage Stores**, and create a store selecting that store owner.

---

## Future Improvements

The following features are planned for future development iterations:

- **Email Verification** — Send OTP or confirmation link on registration
- **Forgot Password / Reset via Email** — Secure password reset flow using nodemailer
- **Admin Analytics Charts** — Visual charts for ratings over time using Recharts or Chart.js
- **Store Categories** — Allow stores to be categorized (e.g., Food, Electronics, Fashion)
- **Image Uploads** — Allow store owners to upload a profile photo or banner for their store
- **Review Comments** — Allow users to attach a text review alongside their star rating
- **Notifications System** — Notify store owners when a new rating is submitted
- **Dark Mode** — System-aware dark mode toggle
- **Rate Limiting** — API rate limiting with express-rate-limit to prevent abuse
- **Unit & Integration Tests** — Backend tests with Jest and Supertest
- **Docker Support** — Containerize backend and frontend for easy deployment
- **CI/CD Pipeline** — GitHub Actions workflow for automated testing and deployment
- **Deployed Demo** — Host on platforms like Vercel (frontend) and Railway or Render (backend)
- **Refresh Token Rotation** — More secure auth flow with access + refresh token pair

---

## Author

**Ashish More**
Full Stack Developer

> This project was built as a production-level internship coding challenge demonstrating full-stack skills including REST API design, database modeling, authentication, role-based authorization, and modern responsive React UI development.

---

<div align="center">

Made with using React, Express, Prisma & PostgreSQL

</div>



