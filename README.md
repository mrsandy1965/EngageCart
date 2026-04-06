# EngageCart 🛒

> Interactive e-commerce platform with real-time inventory, dynamic cart UX, modern glassmorphism UI, and a full admin dashboard.

[![CI Pipeline](https://github.com/mrsandy1965/EngageCart/actions/workflows/ci.yml/badge.svg)](https://github.com/mrsandy1965/EngageCart/actions/workflows/ci.yml)

---

## ✨ Features

### 🛍️ Shopping Experience
- **Modern Storefront** — Redesigned home page with split-hero layout, gradient typography, and featured categories.
- **Product catalogue** — search, filter by category / price range (₹), pagination.
- **Product detail page** — image gallery, live stock badge, viewer count.
- **Add to Cart → Qty Stepper** — button transforms seamlessly into `− qty +` stepper after first add, no layout shift.
- **Real-time inventory** — WebSocket (Socket.io) pushes live stock updates across tabs.
- **Urgency alerts** — "Only X left!", live viewer bubble, back-in-stock toast.
- **Premium UI** — SVG icons (Phosphor/Lucide style), glassmorphism header, and 'Plus Jakarta Sans' branding.

### 🛒 Cart & Checkout
- Persistent cart (user-scoped, server-side)
- Checkout form with address & payment method
- Order confirmation and order history

### ⚙️ Admin Dashboard (`/admin`)
- **Dashboard** — stats cards (total orders, products, categories, pending)
- **Orders** — full table with status badges + status-update modal (pending → delivered → cancelled)
- **Products** — CRUD table + add/edit form with multi-image upload (Cloudinary)
- **Categories** — inline add / edit / delete
- Role-based route guard — non-admins are redirected

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, React Router v7, Vite 7 |
| Styling | Vanilla CSS (custom design system) |
| State | React Context API (`CartContext`, `AuthContext`) |
| Real-time | Socket.io client |
| Backend | Node.js, Express 4 |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| File uploads | Multer + Cloudinary |
| Real-time | Socket.io server |
| CI | GitHub Actions |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+ (Node 22 LTS recommended)
- MongoDB (local or Atlas)
- Cloudinary account (for image uploads)

### 1. Clone the repo
```bash
git clone https://github.com/mrsandy1965/EngageCart.git
cd EngageCart
```

### 2. Backend setup
```bash
cd backend
cp .env.example .env   # fill in MONGO_URI, JWT_SECRET, CLOUDINARY_* vars
npm install
npm run dev            # starts on http://localhost:5001
```

### 3. Frontend setup
```bash
cd frontend
cp .env.example .env   # set VITE_API_URL=http://localhost:5001/api
npm install
npm run dev            # starts on http://localhost:5173
```

### 4. Seed sample data (optional)
```bash
cd backend
npm run seed
```

---

## 🧪 Testing

### Run tests
```bash
# Backend
cd backend && npm test

# Frontend
cd frontend && npm test

# With coverage report
cd frontend && npm run test:coverage
cd backend  && npm test -- --coverage
```

### What's tested

**Frontend**
| Suite | Tests |
|-------|-------|
| `filterUtils` | Filter param stripping logic |
| `productService` | API endpoint calls + param forwarding |
| `authService` | Login, logout, token management |
| `AddToCartButton` | All 3 states: button / stepper / out-of-stock |

**Backend**
| Suite | Tests |
|-------|-------|
| `auth` | Register, login, duplicate email, wrong password |
| `product` | Create, list with filters, get by id, soft delete |
| `category` | List, create, duplicate slug, delete with guards |
| `cart` | Add, update qty, remove, clear |
| `order` | Create, cancel, status update |
| `app` | Server health |

---

## 🚀 Deployment

| Service | What | Free tier |
|---------|------|-----------|
| [**Railway**](https://railway.app) | Node.js backend + Socket.io | 500 hrs/month (Starter tier) |
| [**Vercel**](https://vercel.com) | React/Vite frontend | Unlimited static |
| [**MongoDB Atlas**](https://cloud.mongodb.com) | Database | 512 MB |

### 1. Backend — Railway

1. Go to [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub repo**
2. Select your repository and set the **Root Directory** to `backend`
3. Set the following **Environment Variables** in the Railway dashboard (Variables tab):

```
MONGO_URI         = mongodb+srv://...   ← from MongoDB Atlas
JWT_SECRET        = a_long_random_string
CLOUDINARY_CLOUD_NAME / API_KEY / API_SECRET
FRONTEND_URL      = https://your-app.vercel.app
```

4. Railway will automatically deploy on every push to the main branch.

---

### 2. Frontend — Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project** → import your repo
2. Set **Root Directory** to `frontend`
3. Add environment variables:

```
VITE_API_URL    = https://engagecart-api.up.railway.app/api
VITE_SOCKET_URL = https://engagecart-api.up.railway.app
```

4. Deploy → copy your Vercel URL → set it as `FRONTEND_URL` in Railway

---

### 3. GitHub Secrets (for auto-deploy on push)

Go to **GitHub → Settings → Secrets → Actions** and add:

| Secret | Value |
|--------|-------|
| `VITE_API_URL` | `https://your-app.up.railway.app/api` |
| `VITE_SOCKET_URL` | `https://your-app.up.railway.app` |
| `EC2_HOST` *(optional)* | EC2 public host/IP for SSH deploy |
| `EC2_USER` *(optional)* | EC2 SSH username |
| `EC2_PRIVATE_KEY` *(optional)* | Private key for EC2 SSH deploy |

> If EC2 secrets are not set, the EC2 deploy job is skipped safely.

---

## ⚙️ CI/CD Pipeline

Two workflows run on every push to `main`:

**`ci.yml`** — runs on every push & PR:
```
backend-lint → backend-test (Node 18 + Node 20)
frontend-lint → frontend-test → frontend-build
```

**`deploy.yml`** — runs only on push to `main`:
```
deploy-ec2     → deploys backend via SSH only when EC2 secrets exist
```

## 🐳 Docker Notes

- Backend Docker image uses `node:22-alpine` and starts with `npm start`.
- Frontend Docker image uses `node:22-alpine`, installs dependencies via `npm ci`, and builds the app with `npm run build`.


## 📁 Project Structure

```
EngageCart/
├── backend/
│   ├── src/
│   │   ├── controllers/    # auth, cart, order, product, category
│   │   ├── middleware/      # auth, admin, upload
│   │   ├── models/          # User, Product, Cart, Order, Category
│   │   ├── routes/
│   │   └── socket.js        # Socket.io real-time events
│   └── tests/
├── frontend/
│   ├── src/
│   │   ├── components/      # Header, Cart, ProductList, AddToCartButton …
│   │   ├── context/         # AuthContext, CartContext
│   │   ├── hooks/           # useAuth, useCart, useProductSocket
│   │   ├── pages/           # Home, Products, Cart, Checkout, Orders, Admin/*
│   │   └── services/        # authService, cartService, productService, adminService
│   └── src/__tests__/
└── .github/workflows/ci.yml
```

---

## 🔑 Environment Variables

### Backend `.env`
```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/engagecart
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NODE_ENV=development
```

### Frontend `.env`
```env
VITE_API_URL=http://localhost:5001/api
VITE_SOCKET_URL=http://localhost:5001
```

---

## 📄 License

MIT