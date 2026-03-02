# EngageCart 🛒

> Interactive e-commerce platform with real-time inventory, dynamic cart UX, and a full admin dashboard.

[![CI Pipeline](https://github.com/mrsandy1965/EngageCart/actions/workflows/ci.yml/badge.svg)](https://github.com/mrsandy1965/EngageCart/actions/workflows/ci.yml)

---

## ✨ Features

### 🛍️ Shopping Experience
- **Product catalogue** — search, filter by category / price range, pagination
- **Product detail page** — image gallery, live stock badge, viewer count
- **Add to Cart → Qty Stepper** — button transforms seamlessly into `− qty +` stepper after first add, no layout shift
- **Real-time inventory** — WebSocket (Socket.io) pushes live stock updates across tabs
- **Urgency alerts** — "Only X left!", live viewer bubble, back-in-stock toast

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
- Node.js ≥ 18
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
# Backend (39 tests across 6 suites)
cd backend && npm test

# Frontend (27 tests across 4 suites)
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

## ⚙️ CI/CD Pipeline

5 jobs run on every push and PR:

```
backend-lint ──→ backend-test (Node 18 + Node 20)
                      └─ uploads coverage artifact

frontend-lint ──→ frontend-test ──→ frontend-build
                        └─ uploads coverage artifact
```

- Build only runs if **lint + tests both pass**
- Backend matrix tested on **Node 18 and Node 20**
- Coverage reports saved as **GitHub Actions artifacts** (7-day retention)

---

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