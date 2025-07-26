import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, profile, signOut, isAdmin, canManageContent } = useAuth();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xl font-bold">🕋</span>
            </div>
            <div className="hidden md:block">
              <h1 className="text-xl font-bold text-gray-800">Muniful Ikhsan Alhafizi</h1>
              <p className="text-sm text-gray-600">Muthawwif Profesional</p>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`text-gray-700 hover:text-yellow-600 font-medium transition-colors ${
                isActive('/') ? 'text-yellow-600 border-b-2 border-yellow-600' : ''
              }`}
            >
              Beranda
            </Link>
            <Link 
              to="/about" 
              className={`text-gray-700 hover:text-yellow-600 font-medium transition-colors ${
                isActive('/about') ? 'text-yellow-600 border-b-2 border-yellow-600' : ''
              }`}
            >
              Tentang
            </Link>
            <Link 
              to="/blog" 
              className={`text-gray-700 hover:text-yellow-600 font-medium transition-colors ${
                isActive('/blog') ? 'text-yellow-600 border-b-2 border-yellow-600' : ''
              }`}
            >
              Blog
            </Link>
            <Link 
              to="/products" 
              className={`text-gray-700 hover:text-yellow-600 font-medium transition-colors ${
                isActive('/products') ? 'text-yellow-600 border-b-2 border-yellow-600' : ''
              }`}
            >
              Materi Premium
            </Link>
            <Link 
              to="/consultation" 
              className={`text-gray-700 hover:text-yellow-600 font-medium transition-colors ${
                isActive('/consultation') ? 'text-yellow-600 border-b-2 border-yellow-600' : ''
              }`}
            >
              Konsultasi
            </Link>
            <Link 
              to="/contact" 
              className={`text-gray-700 hover:text-yellow-600 font-medium transition-colors ${
                isActive('/contact') ? 'text-yellow-600 border-b-2 border-yellow-600' : ''
              }`}
            >
              Kontak
            </Link>
          </div>

          {/* Auth & Admin Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                {canManageContent() && (
                  <Link 
                    to="/admin" 
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Admin
                  </Link>
                )}
                
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-gray-900">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        {profile?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <span className="font-medium">{profile?.full_name || 'User'}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {/* Dropdown */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200">
                    <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Profile Saya
                    </Link>
                    <Link to="/my-purchases" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Pembelian Saya
                    </Link>
                    <hr className="my-2" />
                    <button 
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                    >
                      Keluar
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-yellow-600 font-medium"
                >
                  Masuk
                </Link>
                <Link 
                  to="/register" 
                  className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
                >
                  Daftar
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden flex items-center px-3 py-2 text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-3">
              <Link 
                to="/" 
                onClick={() => setIsOpen(false)}
                className="text-gray-700 hover:text-yellow-600 py-2"
              >
                Beranda
              </Link>
              <Link 
                to="/about" 
                onClick={() => setIsOpen(false)}
                className="text-gray-700 hover:text-yellow-600 py-2"
              >
                Tentang
              </Link>
              <Link 
                to="/blog" 
                onClick={() => setIsOpen(false)}
                className="text-gray-700 hover:text-yellow-600 py-2"
              >
                Blog
              </Link>
              <Link 
                to="/products" 
                onClick={() => setIsOpen(false)}
                className="text-gray-700 hover:text-yellow-600 py-2"
              >
                Materi Premium
              </Link>
              <Link 
                to="/consultation" 
                onClick={() => setIsOpen(false)}
                className="text-gray-700 hover:text-yellow-600 py-2"
              >
                Konsultasi
              </Link>
              <Link 
                to="/contact" 
                onClick={() => setIsOpen(false)}
                className="text-gray-700 hover:text-yellow-600 py-2"
              >
                Kontak
              </Link>
              
              <hr className="my-2" />
              
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        {profile?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <span className="font-medium">{profile?.full_name || 'User'}</span>
                  </div>
                  
                  {canManageContent() && (
                    <Link 
                      to="/admin" 
                      onClick={() => setIsOpen(false)}
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors block text-center"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  
                  <Link 
                    to="/profile" 
                    onClick={() => setIsOpen(false)}
                    className="text-gray-700 hover:text-yellow-600 py-2 block"
                  >
                    Profile Saya
                  </Link>
                  <Link 
                    to="/my-purchases" 
                    onClick={() => setIsOpen(false)}
                    className="text-gray-700 hover:text-yellow-600 py-2 block"
                  >
                    Pembelian Saya
                  </Link>
                  <button 
                    onClick={handleSignOut}
                    className="text-red-600 hover:text-red-700 py-2 w-full text-left"
                  >
                    Keluar
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link 
                    to="/login" 
                    onClick={() => setIsOpen(false)}
                    className="text-gray-700 hover:text-yellow-600 py-2 block"
                  >
                    Masuk
                  </Link>
                  <Link 
                    to="/register" 
                    onClick={() => setIsOpen(false)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors block text-center"
                  >
                    Daftar
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;