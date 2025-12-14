import React, { useState, useEffect } from "react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function UserDashboard() {
  const [books, setBooks] = useState([]);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // "all" or "borrowed"
  const [borrowing, setBorrowing] = useState(null); // Track which book is being borrowed

  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  // Fetch books from backend
  useEffect(() => {
    fetchBooks();
    fetchBorrowedBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:4000/api/books", {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch books");
      }

      const data = await response.json();
      setBooks(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching books:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBorrowedBooks = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/borrowed-books", {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch borrowed books");
      }

      const data = await response.json();
      setBorrowedBooks(data);
    } catch (err) {
      console.error("Error fetching borrowed books:", err);
    }
  };

  const handleBorrowBook = async (bookId) => {
    try {
      setBorrowing(bookId);
      const response = await fetch(
        `http://localhost:4000/api/books/${bookId}/borrow`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to borrow book");
      }

      // Refresh both lists
      await fetchBooks();
      await fetchBorrowedBooks();

      alert("Book borrowed successfully!");
    } catch (err) {
      alert(err.message);
    } finally {
      setBorrowing(null);
    }
  };

  const handleReturnBook = async (borrowId) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/borrowed-books/${borrowId}/return`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to return book");
      }

      // Refresh both lists
      await fetchBooks();
      await fetchBorrowedBooks();

      alert("Book returned successfully!");
    } catch (err) {
      alert(err.message);
    }
  };

  // Filter books based on search
  const filteredBooks = books.filter(
    (book) =>
      book.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.details.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter borrowed books based on search
  const filteredBorrowedBooks = borrowedBooks.filter(
    (borrowed) =>
      borrowed.bookId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      borrowed.bookId.details.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format date helper
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Check if book is overdue
  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold mb-6">Library</h2>
          <nav className="space-y-4">
            <button
              onClick={() => setActiveTab("all")}
              className={`block w-full text-left hover:text-indigo-600 ${
                activeTab === "all" ? "text-indigo-600 font-semibold" : ""
              }`}
            >
              📚 All Books
            </button>
            <button
              onClick={() => setActiveTab("borrowed")}
              className={`block w-full text-left hover:text-indigo-600 ${
                activeTab === "borrowed" ? "text-indigo-600 font-semibold" : ""
              }`}
            >
              📖 Borrowed Books
              {borrowedBooks.length > 0 && (
                <span className="ml-2 bg-indigo-600 text-white text-xs px-2 py-1 rounded-full">
                  {borrowedBooks.length}
                </span>
              )}
            </button>
          </nav>
        </div>
        <button
          onClick={handleLogout}
          className="text-red-500 hover:text-red-600"
        >
          🚪 Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full p-6">
        {/* Top Bar */}
        <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between mb-6">
          <input
            type="text"
            placeholder="Search books..."
            className="border rounded-md px-4 py-2 w-1/2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="w-10 h-10 bg-indigo-600 text-white flex items-center justify-center rounded-full">
            U
          </div>
        </div>

        {/* Welcome */}
        <div className="bg-indigo-500 rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-1 text-white">
            Hello, User 👋
          </h2>
          <p className="text-gray-100">
            {activeTab === "all"
              ? "Browse and borrow books from the library."
              : "Manage your borrowed books and return them on time."}
          </p>
        </div>

        {/* All Books Tab */}
        {activeTab === "all" && (
          <>
            <h3 className="text-xl font-semibold mb-4">Available Books</h3>

            {/* Loading State */}
            {loading && (
              <div className="text-center py-8">
                <p className="text-gray-600">Loading books...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                <p>Error: {error}</p>
                <button onClick={fetchBooks} className="mt-2 text-sm underline">
                  Try again
                </button>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && filteredBooks.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-600">
                  {searchTerm
                    ? "No books found matching your search."
                    : "No books available."}
                </p>
              </div>
            )}

            {/* Books Grid */}
            {!loading && !error && filteredBooks.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredBooks.map((book) => (
                  <div
                    key={book._id}
                    className="bg-white rounded-lg shadow overflow-hidden flex flex-col"
                  >
                    {/* Book Image */}
                    <img
                      src={book.image || "https://via.placeholder.com/150"}
                      alt={book.name}
                      className="h-40 w-full object-cover"
                    />
                    {/* Book Info */}
                    <div className="p-4 flex flex-col flex-1">
                      <h4 className="font-semibold text-lg mb-1">
                        {book.name}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">
                        {book.details}
                      </p>
                      <p className="text-sm mb-3">
                        Quantity:{" "}
                        <span className="font-medium">{book.quantity}</span>
                      </p>
                      {/* Borrow Button */}
                      <button
                        disabled={book.quantity === 0 || borrowing === book._id}
                        onClick={() => handleBorrowBook(book._id)}
                        className={`mt-auto px-4 py-2 rounded text-white ${
                          book.quantity === 0
                            ? "bg-gray-400 cursor-not-allowed"
                            : borrowing === book._id
                            ? "bg-indigo-400 cursor-wait"
                            : "bg-indigo-600 hover:bg-indigo-700"
                        }`}
                      >
                        {borrowing === book._id
                          ? "Borrowing..."
                          : book.quantity === 0
                          ? "Not Available"
                          : "Borrow Book"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Borrowed Books Tab */}
        {activeTab === "borrowed" && (
          <>
            <h3 className="text-xl font-semibold mb-4">Your Borrowed Books</h3>

            {/* Empty State */}
            {filteredBorrowedBooks.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-600">
                  {searchTerm
                    ? "No borrowed books found matching your search."
                    : "You haven't borrowed any books yet."}
                </p>
              </div>
            )}

            {/* Borrowed Books Grid */}
            {filteredBorrowedBooks.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredBorrowedBooks.map((borrowed) => (
                  <div
                    key={borrowed._id}
                    className="bg-white rounded-lg shadow overflow-hidden flex flex-col"
                  >
                    {/* Book Image */}
                    <img
                      src={
                        borrowed.bookId.image ||
                        "https://via.placeholder.com/150"
                      }
                      alt={borrowed.bookId.name}
                      className="h-40 w-full object-cover"
                    />
                    {/* Book Info */}
                    <div className="p-4 flex flex-col flex-1">
                      <h4 className="font-semibold text-lg mb-1">
                        {borrowed.bookId.name}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">
                        {borrowed.bookId.details}
                      </p>

                      {/* Borrow Details */}
                      <div className="text-sm mb-3 space-y-1">
                        <p>
                          <span className="text-gray-600">Borrowed:</span>{" "}
                          <span className="font-medium">
                            {formatDate(borrowed.borrowedAt)}
                          </span>
                        </p>
                        <p>
                          <span className="text-gray-600">Due Date:</span>{" "}
                          <span
                            className={`font-medium ${
                              isOverdue(borrowed.dueDate) ? "text-red-600" : ""
                            }`}
                          >
                            {formatDate(borrowed.dueDate)}
                            {isOverdue(borrowed.dueDate) && " (Overdue!)"}
                          </span>
                        </p>
                      </div>

                      {/* Return Button */}
                      <button
                        onClick={() => handleReturnBook(borrowed._id)}
                        className="mt-auto px-4 py-2 rounded text-white bg-green-600 hover:bg-green-700"
                      >
                        Return Book
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
