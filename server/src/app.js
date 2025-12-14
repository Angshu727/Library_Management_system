const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

const UserSchema = new mongoose.Schema({
  email: String,
  passwordHash: String,
  role: { type: String, default: "user" }
}, { timestamps: true }); 
const User = mongoose.model("User", UserSchema);

const BookSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    details: {
      type: String,
      required: true,
    },
    image: {
      type: String, // image URL (for now)
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);

const Book = mongoose.model("Book", BookSchema);

const BorrowedBookSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: true,
  },
  borrowedAt: {
    type: Date,
    default: Date.now,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  returnedAt: {
    type: Date,
    default: null,
  },
  status: {
    type: String,
    enum: ["borrowed", "returned"],
    default: "borrowed",
  },
});

const BorrowedBook = mongoose.model("BorrowedBook", BorrowedBookSchema);

const authenticateToken = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};


app.post("/api/auth/register", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ 
      email, 
      passwordHash, 
      role: role || "user" 
    });

    res.status(201).json({ 
      message: "User created successfully", 
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
  });

  res.json({
    id: user._id,
    email: user.email,
    role: user.role,
  });
});

app.get("/api/auth/me", async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.json(null);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-passwordHash");

    res.json(user);
  } catch {
    res.json(null);
  }
});

app.post("/api/auth/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
});

module.exports = app;

app.post("/api/books", async (req, res) => {
  try {
    const { name, details, image, quantity } = req.body;
    if (!name || !details || quantity === undefined) {
      return res.status(400).json({ message: "All fields required" });
    }
    const book = await Book.create({
      name,
      details,
      image,
      quantity,
    });
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/books", async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


app.post("/api/books/:bookId/borrow", authenticateToken, async (req, res) => {
  try {
    const { bookId } = req.params;
    const userId = req.user.id;

    // Check if book exists and has quantity
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    if (book.quantity <= 0) {
      return res.status(400).json({ message: "Book not available" });
    }
    const existingBorrow = await BorrowedBook.findOne({
      userId,
      bookId,
      status: "borrowed",
    });
    if (existingBorrow) {
      return res
        .status(400)
        .json({ message: "You already borrowed this book" });
    }

    // Calculate due date (14 days from now)
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);

    // Create borrowed book record
    const borrowedBook = await BorrowedBook.create({
      userId,
      bookId,
      dueDate,
    });

    // Decrease book quantity
    book.quantity -= 1;
    await book.save();

    // Populate book details
    const populatedBorrow = await BorrowedBook.findById(
      borrowedBook._id
    ).populate("bookId");

    res.status(201).json(populatedBorrow);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/borrowed-books", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const borrowedBooks = await BorrowedBook.find({
      userId,
      status: "borrowed"
    })
      .populate("bookId")
      .sort({ borrowedAt: -1 });

    res.json(borrowedBooks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/borrowed-books/:borrowId/return", authenticateToken, async (req, res) => {
  try {
    const { borrowId } = req.params;
    const userId = req.user.id;

    const borrowedBook = await BorrowedBook.findOne({
      _id: borrowId,
      userId,
      status: "borrowed"
    });

    if (!borrowedBook) {
      return res.status(404).json({ message: "Borrowed book not found" });
    }

    // Update borrowed book status
    borrowedBook.status = "returned";
    borrowedBook.returnedAt = new Date();
    await borrowedBook.save();

    // Increase book quantity
    const book = await Book.findById(borrowedBook.bookId);
    if (book) {
      book.quantity += 1;
      await book.save();
    }

    res.json({ message: "Book returned successfully", borrowedBook });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a book (PUT)
app.put("/api/books/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, details, image, quantity } = req.body;

    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const book = await Book.findByIdAndUpdate(
      id,
      { name, details, image, quantity },
      { new: true, runValidators: true }
    );

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a book
app.delete("/api/books/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const book = await Book.findByIdAndDelete(id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all borrowed books (Admin only)
app.get("/api/admin/borrowed-books", authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const borrowedBooks = await BorrowedBook.find({ status: "borrowed" })
      .populate("bookId")
      .populate("userId", "email")
      .sort({ borrowedAt: -1 });

    res.json(borrowedBooks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all users (Admin only)
app.get("/api/admin/users", authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const users = await User.find()
      .select("-passwordHash") // Exclude password hash
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});