import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function LoginModal({ isOpen, onClose, preferredRole }) {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

const handleSubmit = async (e) => {
  e.preventDefault(); // stop page reload

  // reset old error and show loading
  setErr("");
  setLoading(true);

  try {
    // try logging in the user
    const userData = await login({
      email: email,
      password: password
    });

    // check role and go to correct page
    if (userData.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/user");
    }

    // close the login popup
    onClose();
  } catch (err) {
    // show error message if login fails
    setErr(err.message);
  }

  // stop loading in all cases
  setLoading(false);
};


  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-xl font-semibold mb-4">Log in {preferredRole ? `as ${preferredRole}` : ""}</h3>

        {err && <div className="text-red-600 mb-3">{err}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            required
            type="email"
            placeholder="Email"
            className="w-full border rounded px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            required
            type="password"
            placeholder="Password"
            className="w-full border rounded px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded border">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-indigo-600 text-white rounded">
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
