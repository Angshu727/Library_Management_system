import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import heroImg from "../../src/assets/hero_img.jpg";
import LoginModal from "../Ui/LoginModel.jsx";
import { AuthContext } from "../../context/AuthContext.jsx";

export default function Hero() {
  const [isOpen, setIsOpen] = useState(false);
  const [prefRole, setPrefRole] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const openFor = (role) => {
    if (user) {
      // If already logged in, redirect to dashboard
      navigate(user.role === "admin" ? "/admin" : "/user");
    } else {
      setPrefRole(role);
      setIsOpen(true);
    }
  };

  return (
    <>
      {/* Background layer with overlay */}
      <div className="fixed inset-0 h-screen w-full z-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImg})` }}
          aria-hidden="true"
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content (above background) */}
      <div className="relative z-10 h-screen flex items-center justify-center px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Heading */}
          <div className="mb-8">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white drop-shadow-2xl mb-4 leading-tight">
              Welcome to Libra
            </h1>
            <p className="text-xl md:text-2xl text-gray-100 drop-shadow-lg max-w-2xl mx-auto">
              Streamline your library management—simple, efficient, and powerful.
            </p>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
              <span className="text-indigo-600 font-medium">📚 Easy Book Management</span>
            </div>
            <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
              <span className="text-indigo-600 font-medium">🔍 Smart Search</span>
            </div>
            <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
              <span className="text-indigo-600 font-medium">⚡ Quick Borrowing</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => openFor("user")}
              className="group relative px-8 py-4 bg-white text-indigo-600 rounded-lg text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 w-full sm:w-auto"
            >
              <span className="flex items-center justify-center gap-2">
                <span>👤</span>
                <span>Continue as User</span>
              </span>
            </button>

            <button
              onClick={() => openFor("admin")}
              className="group relative px-8 py-4 bg-indigo-600 text-white rounded-lg text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 border-white/20 w-full sm:w-auto"
            >
              <span className="flex items-center justify-center gap-2">
                <span>⚙️</span>
                <span>Admin Dashboard</span>
              </span>
            </button>
          </div>

          {/* Info Text */}
          <p className="mt-8 text-gray-200 text-sm">
            New here?{" "}
            <button
              onClick={() => setIsOpen(true)}
              className="text-white font-semibold underline hover:text-indigo-300 transition-colors"
            >
              Create an account
            </button>
          </p>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
        </div>
      </div>

      <LoginModal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        preferredRole={prefRole} 
      />
    </>
  );
}