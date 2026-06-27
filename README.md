# Amazon Clone (Frontend + Backend)

An Amazon-style full-stack web application with authentication, product browsing, cart/wishlist, checkout, orders, and an admin dashboard.

---

## Tech used

### Frontend
- **React**
- **Vite** (dev server + build)
- **React Router DOM** (routing)
- **Axios** (API requests)
- **JWT auth** stored in `localStorage` and attached as `Authorization: Bearer <token>` via an Axios interceptor

### Backend
- **Node.js + Express** (REST API)
- **MySQL** (via `mysql2`) for data storage
- **JWT** (`jsonwebtoken`) for authentication/authorization
- **bcryptjs** for password hashing
- **CORS** for cross-origin requests

---

## Repository structure

- `backend/` – Express server, routes, middleware, database connection, and static images
- `frontend/` – React app (Vite)

---

## Prerequisites

- Node.js (recommended: **20.19+** or **22.12+** for Vite)
- MySQL database
- Environment variables (see below)

---

## Backend setup (MySQL + environment)

1) Create a MySQL database and the required tables (schema not included in this README; use your existing migration/SQL if you already have one).
2) Configure environment variables.

Create `backend/.env` (recommended) or set variables for the backend process:

- `DB_HOST`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `JWT_SECRET`
- `PORT` (optional; default `3000`)

> Note: The backend connects to MySQL using `backend/config/db.js` and uses `JWT_SECRET` in `authMiddleware.js` and `routes/auth.js`.

---

## Run the app

### 1) Start backend


cd backend
npm install
npm run dev


Backend will start on `PORT` (default: `3000`).

API base paths (as used by the frontend):
- `http://localhost:3000/api/auth`
- `http://localhost:3000/api/products`
- `http://localhost:3000/api/cart`
- `http://localhost:3000/api/wishlist`
- `http://localhost:3000/api/orders`
- `http://localhost:3000/api/payments`
- `http://localhost:3000/api/admin`

Images are served from:
- `http://localhost:3000/images/...`

### 2) Start frontend

Open a new terminal:


cd frontend
npm install
npm run dev


The app will open at Vite’s local URL (typically `http://localhost:5173/`).

#### Configure backend URL (frontend)

Frontend uses:
- `import.meta.env.VITE_API_URL` if set
- otherwise defaults to `http://localhost:3000/api`

Example:


# from frontend/
VITE_API_URL=http://localhost:3000/api npm run dev


---

## Terminal controls

- Stop a running dev server: **Ctrl + C**
- Changes auto-apply in the browser (HMR) when dev servers are running
- Production build (frontend):

cd frontend
npm run build
npm run preview

---

## What features are included (high level)

- **Auth**: register/login, JWT-protected routes
- **Products**: list, product details, and admin product CRUD
- **Cart**: add/update/remove cart items with stock checks
- **Wishlist**: add/remove items + move to cart
- **Checkout/Orders**: place order, list orders, cancel pending orders
- **Payments**: COD flow + payment status updates
- **Admin**: user/order/payment management + analytics/reports


