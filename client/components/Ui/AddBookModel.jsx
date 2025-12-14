import React, { useState } from "react";

export default function AddBookModal({ onClose }) {
  const [bookName, setBookName] = useState("");
  const [details, setDetails] = useState("");
  const [quantity, setQuantity] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newBook = {
      bookName,
      details,
      quantity,
      image
    };

    console.log("New Book:", newBook);

    // later → send to backend
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <h3 className="text-xl font-semibold mb-4">
          Add New Book
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            placeholder="Book Name"
            required
            value={bookName}
            onChange={(e) => setBookName(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />

          <textarea
            placeholder="Book Details"
            required
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />

          <input
            type="number"
            placeholder="Quantity"
            required
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full"
          />

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded"
            >
              Add Book
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
