import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-black/90 backdrop-blur-md shadow-2xl sticky top-0 z-50 border-b border-red-800 min-w-[350px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Title */}
          <Link to="/" className="flex items-center flex-shrink-0">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-red-500 via-red-600 to-red-800 bg-clip-text text-transparent animate-pulse">
              🦇 UTB Strašidelná fakulta 🦇
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <Link
              to="/"
              className="bg-gradient-to-r from-red-600 to-red-800 text-white px-6 py-2 rounded-full hover:shadow-2xl transform hover:scale-105 transition-all duration-200 font-medium border border-red-400 hover:border-red-300"
            >
              🏠 Domů
            </Link>
            <Link
              to="/manage"
              className="bg-gradient-to-r from-red-600 to-red-800 text-white px-6 py-2 rounded-full hover:shadow-2xl transform hover:scale-105 transition-all duration-200 font-medium border border-red-400 hover:border-red-300"
            >
              ⚰️ Spravovat
            </Link>
            <Link
              to="/reservations"
              className="bg-gradient-to-r from-red-600 to-red-800 text-white px-6 py-2 rounded-full hover:shadow-2xl transform hover:scale-105 transition-all duration-200 font-medium border border-red-400 hover:border-red-300"
            >
              💀 Rezervovat
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="bg-gradient-to-r from-red-600 to-red-800 text-white p-2 rounded-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-200 border border-red-400 hover:border-red-300"
              aria-label="Toggle mobile menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-black/95 backdrop-blur-md rounded-lg mt-2 border border-red-800">
              <Link
                to="/"
                className="block bg-gradient-to-r from-red-600 to-red-800 text-white px-4 py-3 rounded-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-200 font-medium border border-red-400 hover:border-red-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                🏠 Domů
              </Link>
              <Link
                to="/manage"
                className="block bg-gradient-to-r from-red-600 to-red-800 text-white px-4 py-3 rounded-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-200 font-medium border border-red-400 hover:border-red-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                ⚰️ Spravovat
              </Link>
              <Link
                to="/reservations"
                className="block bg-gradient-to-r from-red-600 to-red-800 text-white px-4 py-3 rounded-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-200 font-medium border border-red-400 hover:border-red-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                💀 Rezervovat
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
