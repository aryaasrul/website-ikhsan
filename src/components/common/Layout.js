import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children, className = '' }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className={`flex-grow ${className}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;