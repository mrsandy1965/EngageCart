# EngageCart – System Architecture

## 1. High-Level Overview

EngageCart is a full-stack, real-time e-commerce platform focused on
micro-experiences, personalization, and trust signals.

Architecture follows a modular, scalable design:

Client → API Gateway → Services → Database  
Client ↔ WebSocket Server (real-time updates)

---

## 2. Frontend Architecture

**Tech**
- React.js
- Tailwind CSS
- Zustand / Redux Toolkit

**Responsibilities**
- Product listing & micro-interactions
- Real-time inventory updates
- Personalized UI rendering
- Dynamic pricing explanation

Frontend communicates via:
- REST APIs (CRUD, auth)
- WebSockets (inventory, viewers)

---

## 3. Backend Architecture

**Tech**
- Node.js + Express
- JWT Authentication
- WebSockets (Socket.IO)

**Core Services**
- Auth Service
- Product Service
- Inventory Service (real-time)
- Personalization Engine
- Pricing Engine

---

## 4. Real-Time System

**Use Cases**
- Live stock count
- People viewing this product
- Back-in-stock notifications

**Flow**
- User opens product  
- WebSocket connection opens  
- Server tracks viewers  
- Inventory updates pushed to clients

---

## 5. Database Design (MongoDB)

**Collections**
- users
- products
- inventory
- orders
- user_activity
- pricing_rules

---

## 6. DevOps & Deployment

**CI/CD**
- GitHub Actions
- Lint → Test → Build pipeline

**Production**
- AWS EC2

---

## 7. Security Considerations

- JWT-based authentication
- Role-based access (admin / user)
- Env secrets via .env
- HTTPS enforced in production

---

## 8. Scalability Thoughts

- Stateless backend
- WebSocket server horizontally scalable
- DB indexes for high-read operations
