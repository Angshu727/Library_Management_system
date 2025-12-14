import React, { useState, useEffect } from "react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function AdminDashboard() {
  const [books, setBooks] = useState([]);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddBook, setShowAddBook] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingBook, setEditingBook] = useState(null);
  const [activeSection, setActiveSection] = useState("books"); // "books", "statistics", "users"
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  useEffect(() => {
    fetchBooks();
    fetchAllBorrowedBooks();
    if (activeSection === "users") {
      fetchUsers();
    }
  }, [activeSection]);

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

  const fetchAllBorrowedBooks = async () => {
    try {
      const response = await fetch(
        "http://localhost:4000/api/admin/borrowed-books",
        {
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setBorrowedBooks(data);
      }
    } catch (err) {
      console.error("Error fetching borrowed books:", err);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:4000/api/admin/users", {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBook = async (bookId) => {
    if (!window.confirm("Are you sure you want to delete this book?")) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:4000/api/books/${bookId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete book");
      }

      alert("Book deleted successfully!");
      fetchBooks();
    } catch (err) {
      alert(err.message);
    }
  };

  const filteredBooks = books.filter(
    (book) =>
      book.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.details.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalBooksCount = books.reduce((sum, book) => sum + book.quantity, 0);
  const borrowedBooksCount = borrowedBooks.length;

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold mb-6 text-indigo-600">
            Admin Panel
          </h2>
          <nav className="space-y-4">
            <button
              onClick={() => setActiveSection("books")}
              className={`block w-full text-left hover:text-indigo-600 ${
                activeSection === "books" ? "text-indigo-600 font-semibold" : ""
              }`}
            >
              📚 Manage Books
            </button>
            <button
              onClick={() => setActiveSection("statistics")}
              className={`block w-full text-left hover:text-indigo-600 ${
                activeSection === "statistics"
                  ? "text-indigo-600 font-semibold"
                  : ""
              }`}
            >
              📊 Statistics
            </button>
            <button
              onClick={() => setActiveSection("users")}
              className={`block w-full text-left hover:text-indigo-600 ${
                activeSection === "users" ? "text-indigo-600 font-semibold" : ""
              }`}
            >
              👥 Users
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
      <main className="flex-1 p-6">
        {/* Top Bar */}
        <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between mb-6">
          <input
            type="text"
            placeholder={
              activeSection === "users" ? "Search users..." : "Search books..."
            }
            className="border rounded-md px-4 py-2 w-1/2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="flex items-center gap-4">
            {activeSection === "books" && (
              <button
                onClick={() => setShowAddBook(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                + Add Book
              </button>
            )}
            <div className="w-10 h-10 bg-indigo-600 text-white flex items-center justify-center rounded-full">
              A
            </div>
          </div>
        </div>

        {/* Admin Welcome */}
        <div className="bg-indigo-500 rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-1 text-white">
            Welcome, Admin 👋
          </h2>
          <p className="text-gray-100">
            {activeSection === "books" &&
              "Manage your library books and monitor borrowing activities."}
            {activeSection === "statistics" &&
              "View library statistics and analytics."}
            {activeSection === "users" &&
              "Manage users and view their information."}
          </p>
        </div>

        {/* Statistics Cards (Always visible) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Books</p>
                <p className="text-3xl font-bold text-indigo-600">
                  {books.length}
                </p>
              </div>
              <div className="bg-indigo-100 p-3 rounded-full">
                <span className="text-2xl">📚</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Available Copies</p>
                <p className="text-3xl font-bold text-green-600">
                  {totalBooksCount}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Books Borrowed</p>
                <p className="text-3xl font-bold text-orange-600">
                  {borrowedBooksCount}
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <span className="text-2xl">📖</span>
              </div>
            </div>
          </div>
        </div>

        {/* Books Section */}
        {activeSection === "books" && (
          <>
            <h3 className="text-xl font-semibold mb-4">Manage Books</h3>

            {loading && (
              <div className="text-center py-8">
                <p className="text-gray-600">Loading books...</p>
              </div>
            )}

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                <p>Error: {error}</p>
                <button onClick={fetchBooks} className="mt-2 text-sm underline">
                  Try again
                </button>
              </div>
            )}

            {!loading && !error && filteredBooks.length === 0 && (
              <div className="text-center py-8 bg-white rounded-lg shadow">
                <p className="text-gray-600">
                  {searchTerm
                    ? "No books found matching your search."
                    : "No books available. Add your first book!"}
                </p>
              </div>
            )}

            {!loading && !error && filteredBooks.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredBooks.map((book) => (
                  <div
                    key={book._id}
                    className="bg-white rounded-lg shadow overflow-hidden flex flex-col"
                  >
                    <img
                      src={book.image || "https://via.placeholder.com/150"}
                      alt={book.name}
                      className="h-40 w-full object-cover"
                    />
                    <div className="p-4 flex flex-col flex-1">
                      <h4 className="font-semibold text-lg mb-1">
                        {book.name}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">
                        {book.details}
                      </p>
                      <p className="text-sm mb-3">
                        Quantity:{" "}
                        <span
                          className={`font-medium ${
                            book.quantity === 0
                              ? "text-red-600"
                              : "text-green-600"
                          }`}
                        >
                          {book.quantity}
                        </span>
                      </p>

                      <div className="mt-auto flex gap-2">
                        <button
                          onClick={() => {
                            setEditingBook(book);
                            setShowAddBook(true);
                          }}
                          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteBook(book._id)}
                          className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Statistics Section */}
        {activeSection === "statistics" && (
          <div className="bg-white rounded-lg shadow p-12">
            <div className="text-center">
              <div className="text-6xl mb-4">🚧</div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                Work in Progress
              </h3>
              <p className="text-gray-600">
                Detailed statistics and analytics are coming soon!
              </p>
            </div>
          </div>
        )}

        {/* Users Section */}
        {activeSection === "users" && (
          <>
            <h3 className="text-xl font-semibold mb-4">Registered Users</h3>

            {loading && (
              <div className="text-center py-8">
                <p className="text-gray-600">Loading users...</p>
              </div>
            )}

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                <p>Error: {error}</p>
                <button onClick={fetchUsers} className="mt-2 text-sm underline">
                  Try again
                </button>
              </div>
            )}

            {!loading && !error && filteredUsers.length === 0 && (
              <div className="text-center py-8 bg-white rounded-lg shadow">
                <p className="text-gray-600">
                  {searchTerm
                    ? "No users found matching your search."
                    : "No users registered yet."}
                </p>
              </div>
            )}

            {!loading && !error && filteredUsers.length > 0 && (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          #
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Joined Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredUsers.map((user, index) => (
                        <tr key={user._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                <span className="text-indigo-600 font-semibold">
                                  {user.email.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {user.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                user.role === "admin"
                                  ? "bg-purple-100 text-purple-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.createdAt
                              ? new Date(user.createdAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  }
                                )
                              : "N/A"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Total Users Summary */}
                <div className="bg-gray-50 px-6 py-4 border-t">
                  <p className="text-sm text-gray-600">
                    Total Users:{" "}
                    <span className="font-semibold text-gray-900">
                      {users.length}
                    </span>
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Add/Edit Book Modal */}
      {showAddBook && (
        <AddBookModal
          onClose={() => {
            setShowAddBook(false);
            setEditingBook(null);
          }}
          onSuccess={() => {
            fetchBooks();
            setShowAddBook(false);
            setEditingBook(null);
          }}
          editBook={editingBook}
        />
      )}
    </div>
  );
}

// Add Book Modal Component (same as before)
function AddBookModal({ onClose, onSuccess, editBook }) {
  const [formData, setFormData] = useState({
    name: editBook?.name || "",
    details: editBook?.details || "",
    image: editBook?.image || "",
    quantity: editBook?.quantity || 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.details || formData.quantity < 0) {
      setError("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const url = editBook
        ? `http://localhost:4000/api/books/${editBook._id}`
        : "http://localhost:4000/api/books";

      const method = editBook ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save book");
      }

      alert(
        editBook ? "Book updated successfully!" : "Book added successfully!"
      );
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "quantity" ? parseInt(value) || 0 : value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">
            {editBook ? "Edit Book" : "Add New Book"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Book Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
              placeholder="Enter book name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Details <span className="text-red-500">*</span>
            </label>
            <textarea
              name="details"
              value={formData.details}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
              placeholder="Enter book details"
              rows="3"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Image URL</label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Quantity <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
              placeholder="Enter quantity"
              min="0"
              required
            />
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border rounded-md hover:bg-gray-100"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-400"
              disabled={loading}
            >
              {loading ? "Saving..." : editBook ? "Update Book" : "Add Book"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
