# 📚 Libra - Library Management System

A modern, full-stack library management system built with React, Node.js, Express, and MongoDB. Libra streamlines book borrowing, user management, and administrative operations with an intuitive interface.


## ✨ Features

### For Users
- 🔍 **Browse Books** - Search and discover available books in the library
- 📖 **Borrow Books** - One-click book borrowing with automatic quantity tracking
- 📅 **Track Borrowed Books** - View borrowed books with due dates
- ⏰ **Overdue Alerts** - Visual indicators for overdue books
- 🔄 **Return Books** - Easy book return process
- 🔐 **Secure Authentication** - JWT-based authentication with role management

### For Admins
- ➕ **Add Books** - Add new books to the library catalog
- ✏️ **Edit Books** - Update book details and quantities
- 🗑️ **Delete Books** - Remove books from the system
- 📊 **Statistics Dashboard** - View total books, available copies, and borrowed books
- 👥 **User Management** - View all registered users and their information
- 🔍 **Search Functionality** - Quick search across books and users

## 🚀 Tech Stack

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling
- **Context API** - State management

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (v14 or higher)
- **MongoDB** (v4.4 or higher)
- **npm** or **yarn**

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/libra-library-management.git
cd libra-library-management
```

### 2. Install Backend Dependencies

```bash
npm install
```

### 3. Install Frontend Dependencies

```bash
cd client
npm install
cd ..
```

### 4. Environment Variables

Create a `.env` file in the root directory:

```env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/libra
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=development
```

### 5. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# On macOS with Homebrew
brew services start mongodb-community

# On Windows
net start MongoDB

# On Linux
sudo systemctl start mongod
```

## 🎯 Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
npm run dev
# or
node server.js
```
Backend will run on `http://localhost:4000`

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```
Frontend will run on `http://localhost:5173`

### Production Build

```bash
cd client
npm run build
```

## 📁 Project Structure

```
libra-library-management/
├── client/                    # Frontend React application
│   ├── components/
│   │   ├── Hero/
│   │   │   └── Hero.jsx
│   │   ├── Navbar/
│   │   │   └── Navbar.jsx
│   │   ├── Ui/
│   │   │   ├── AddBookModel.jsx
│   │   │   ├── LoginModel.jsx
│   │   │   └── SignupModel.jsx
│   │   └── ProtectedRoute.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── pages/
│   │   ├── AdminDashboard.jsx
│   │   ├── Home.jsx
│   │   └── UserDashboard.jsx
│   ├── src/
│   │   ├── assets/
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   └── package.json
├── app.js                     # Express app configuration
├── server.js                  # Server entry point
├── package.json
├── .env                       # Environment variables
└── README.md
```

## 🔑 API Endpoints

### Authentication
```
POST   /api/auth/register      # Register new user
POST   /api/auth/login         # User login
POST   /api/auth/logout        # User logout
GET    /api/auth/me            # Get current user
```

### Books
```
GET    /api/books              # Get all books
POST   /api/books              # Create new book (Admin)
PUT    /api/books/:id          # Update book (Admin)
DELETE /api/books/:id          # Delete book (Admin)
```

### Borrowing
```
POST   /api/books/:bookId/borrow           # Borrow a book
GET    /api/borrowed-books                 # Get user's borrowed books
POST   /api/borrowed-books/:borrowId/return # Return a book
GET    /api/admin/borrowed-books           # Get all borrowed books (Admin)
```

### Users
```
GET    /api/admin/users        # Get all users (Admin)
```

## 👤 Default Credentials

For testing purposes, you can create users through the signup form:

**Admin Account:**
- Email: `admin@example.com`
- Password: `admin123`
- Role: Admin

**User Account:**
- Email: `user@example.com`
- Password: `user123`
- Role: User

## 🎨 Screenshots

### Home Page
![Home Page](https://via.placeholder.com/800x500/6366f1/ffffff?text=Home+Page)

### User Dashboard
![User Dashboard](https://via.placeholder.com/800x500/6366f1/ffffff?text=User+Dashboard)

### Admin Dashboard
![Admin Dashboard](https://via.placeholder.com/800x500/6366f1/ffffff?text=Admin+Dashboard)

### Borrowed Books
![Borrowed Books](https://via.placeholder.com/800x500/6366f1/ffffff?text=Borrowed+Books)

## 🔒 Security Features

- **Password Hashing** - bcrypt with salt rounds
- **JWT Authentication** - Secure token-based auth
- **HTTP-only Cookies** - Prevents XSS attacks
- **Role-Based Access Control** - Admin and User roles
- **Protected Routes** - Authorization middleware
- **Input Validation** - Server-side validation

## 🐛 Known Issues

- Statistics page is under development (Work in Progress)
- Book image upload feature not yet implemented (currently using URLs)

## 🚧 Future Enhancements

- [ ] Advanced statistics with charts
- [ ] Email notifications for due dates
- [ ] Book reservation system
- [ ] Book categories and filters
- [ ] User profile management
- [ ] Book ratings and reviews
- [ ] Overdue fee calculation
- [ ] Image upload functionality
- [ ] Pagination for large datasets
- [ ] Export reports to PDF/Excel

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/Angshu727)
- LinkedIn: [Your LinkedIn](https://www.linkedin.com/in/angshuman-pramanick-49259b23b/)
- Email: angshumanpramanick07@gmail.com

## 🙏 Acknowledgments

- React Icons from [Lucide](https://lucide.dev/)
- UI inspiration from modern design systems
- Community support and open-source contributors

## 📞 Support

For support, email angshumanpramanick07@gmail.com or open an issue in the GitHub repository.

---

⭐ **Star this repository if you found it helpful!**

Made with ❤️ by Angshuman Pramanick