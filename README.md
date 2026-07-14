# NGND Club Website

Full-stack web application for the NGND club — built with React (Vite) on the frontend and Node/Express on the backend.

---

## Project Structure

```
NGND/
├── client/          # React + Vite frontend
├── server/          # Node + Express backend
├── .gitignore
└── README.md
```

---

## Prerequisites

- Node.js >= 18
- npm >= 9
- MongoDB (local or Atlas connection string)

---

## Environment Variables

### Server (`server/.env`)

Copy `server/.env.example` and fill in your values:

```
MONGO_URI=mongodb://localhost:27017/ngnd
JWT_SECRET=your_jwt_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### Client (`client/.env`)

```
VITE_API_URL=http://localhost:5000/api/v1
```

---

## Setup

### 1. Install dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Configure environment

```bash
# Server
cp server/.env.example server/.env
# Edit server/.env with your values

# Client
cp client/.env.example client/.env
```

### 3. Run in development

```bash
# Terminal 1 — start backend (from /server)
npm run dev

# Terminal 2 — start frontend (from /client)
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api/v1

### 4. Run in production

```bash
# Build frontend
cd client && npm run build

# Start backend (serves API; frontend served separately or via CDN)
cd ../server && npm start
```

---

## Tech Stack

| Layer     | Technology                                    |
|-----------|-----------------------------------------------|
| Frontend  | React 18, Vite, Tailwind CSS, Framer Motion, GSAP |
| Routing   | React Router v6                               |
| HTTP      | Axios                                         |
| Backend   | Node.js, Express                              |
| Database  | MongoDB, Mongoose                             |
| Auth      | JWT (access + refresh tokens), bcrypt         |
| Upload    | Multer                                        |
