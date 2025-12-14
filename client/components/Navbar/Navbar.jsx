import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../src/assets/libra_logo.png";
import LoginModal from "../Ui/LoginModel.jsx";
import SignupModal from "../Ui/SignUpModel.jsx";
import { AuthContext } from "../../context/AuthContext.jsx";

export default function Navbar() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-sm shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={logo} alt="logo" className="h-15" />
            <span className="text-indigo-600">Libra</span>
          </div>
          
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="text-gray-700">
                  Welcome, <span className="font-semibold">{user.email}</span>
                </span>
                <button
                  onClick={() => navigate(user.role === "admin" ? "/admin" : "/user")}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setShowSignup(true)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Sign Up
                </button>
                <button
                  onClick={() => setShowLogin(true)}
                  className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50"
                >
                  Login
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      <LoginModal 
        isOpen={showLogin} 
        onClose={() => setShowLogin(false)} 
      />

      <SignupModal 
        isOpen={showSignup} 
        onClose={() => setShowSignup(false)} 
      />
    </>
  );
}