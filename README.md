# 📚 Library Management System — Full Stack (MERN + React + Vite)

A complete Library Management System built using:

- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT Authentication
- **Frontend:** React JS (Vite), JavaScript, Axios, Tailwind CSS
- **Features:** OTP Email Verification, Secure Login, Book Management, Admin Authorization

---

## 🚀 Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcrypt
- Nodemailer

### Frontend
- React (Vite)
- JavaScript
- Axios
- React Router DOM
- Tailwind CSS

---

## 📂 Project Structure

```
Library-management-system/
│
├── Backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   ├── utils/
│   ├── app.js
│   ├── server.js
│   └── package.json
│
└── Frontend/
    └── client/
        ├── src/
        ├── public/
        ├── index.html
        ├── vite.config.js
        ├── tailwind.config.js
        └── package.json
```

---

## 🛠️ Backend Setup

### 1️⃣ Install Dependencies
```bash
cd Backend
npm install
```

### 2️⃣ Run Backend
```bash
npm run dev
```

**Backend runs on:** 👉 http://localhost:5000

### 🔐 Backend Environment Variables (`Backend/.env`)
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/library
JWT_SECRET=your_jwt_secret
JWT_EXPIRES=7d
COOKIE_EXPIRES_IN=7
FRONTEND_URL=http://localhost:5173

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### 🔧 Backend Features

#### ✔ Authentication
- Register user
- Send OTP to email
- Verify OTP
- Login with JWT
- Logout

#### ✔ Password Recovery
- Forgot password
- Reset password with token

#### ✔ Book Management
- Add / Update / Delete / View books
- Admin role required for protected routes

#### ✔ Middlewares
- `isAuthenticated`
- `isAuthorized(role)`
- Error handling middleware

---

## 🎨 Frontend Setup (React + Vite)

### 1️⃣ Install Dependencies
```bash
cd Frontend/client
npm install
```

### 2️⃣ Run Frontend
```bash
npm run dev
```

**Frontend runs on:** 👉 http://localhost:5173

### 🌍 Frontend Environment Variables (`Frontend/client/.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

### ✨ Frontend Features
- React component-based UI
- Login / Signup / OTP Verification
- Protected routes
- Axios API integration
- Tailwind CSS UI
- Toast notifications
- Dashboard + Book Management pages

---

## 🔗 API Documentation

### 🔐 Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user & send OTP |
| POST | `/api/auth/verify-otp` | Verify OTP & activate account |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/logout` | Logout |
| POST | `/api/auth/forgot-password` | Send reset password link |

### 📘 Book Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/books` | Get all books |
| GET | `/api/books/:id` | Get single book |
| POST | `/api/books` | Add book (admin) |
| PUT | `/api/books/:id` | Update book (admin) |
| DELETE | `/api/books/:id` | Delete book (admin) |

---

## 🧪 Testing With Postman

1. Create user → `/api/auth/register`
2. Verify OTP → `/api/auth/verify-otp`
3. Login → `/api/auth/login`
4. Test book routes using Bearer Token or Cookie
5. Verify admin-only routes

---

## ⚠️ Common Issues & Fixes

### ❌ ENOENT: package.json not found
Run commands inside correct folder:
```bash
cd Frontend/client
```

### ❌ does not provide an export named 'isAuthenticated'
Add export in middleware:
```javascript
export const isAuthenticated = ...
```

### ❌ does not provide a default export for bookRouter.js
Fix:
```javascript
export default router;
```

---

## 🧵 Running Frontend + Backend Together

1. Install concurrently:
```bash
npm install -D concurrently
```

2. Add to root `package.json`:
```json
"scripts": {
  "dev": "concurrently \"npm run dev --prefix Backend\" \"npm run dev --prefix Frontend/client\""
}
```

3. Run both:
```bash
npm run dev
```

---

## 🔒 Deployment Notes

### Backend:
- Use services like Render, Railway, or VPS
- Set `cookie.secure=true` in production
- Use environment-based configs

### Frontend:
- Build:
```bash
npm run build
```
- Deploy to Vercel / Netlify / Static hosting

---

## 🤝 Contribution

Pull requests and improvements are welcome!  
Before major changes, open an issue to discuss.

---

## 📄 License

This project is licensed under the MIT License — free to use and modify.