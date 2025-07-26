import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/public/HomePage';
import AboutPage from './pages/public/AboutPage';
import BlogPage from './pages/public/BlogPage';
import ContactPage from './pages/public/ContactPage';
import ProductsPage from './pages/public/ProductsPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Navigation */}
        <nav className="bg-white shadow-md">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl font-bold">🕋</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-800">Muniful Ikhsan Alhafizi</h1>
                  <p className="text-sm text-gray-600">Muthawwif Profesional</p>
                </div>
              </div>
              
              <div className="hidden md:flex space-x-6">
                <a href="/" className="text-gray-700 hover:text-yellow-600">Beranda</a>
                <a href="/about" className="text-gray-700 hover:text-yellow-600">Tentang</a>
                <a href="/blog" className="text-gray-700 hover:text-yellow-600">Blog</a>
                <a href="/products" className="text-gray-700 hover:text-yellow-600">Materi</a>
                <a href="/test" className="bg-yellow-500 text-white px-4 py-2 rounded">Test</a>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/consultation" element={<ConsultationPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Test Route */}
            <Route path="/test" element={<TestPage />} />
          </Routes>
        </main>

        {/* Simple Footer */}
        <footer className="bg-gray-900 text-white py-8">
          <div className="container mx-auto px-4 text-center">
            <p>&copy; 2025 Muniful Ikhsan Alhafizi. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}


const TestPage = () => (
  <div>
    <h1 className="text-3xl font-bold text-gray-900 mb-8">Test Page</h1>
    <div className="bg-white rounded-lg shadow-lg p-8">
      <p className="text-gray-600">Halaman Test untuk development...</p>
      <div className="mt-4 p-4 bg-yellow-50 rounded">
        <h3 className="font-semibold text-yellow-800">Test Components:</h3>
        <ul className="mt-2 text-yellow-700">
          <li>• Homepage: <a href="/" className="text-blue-600 hover:underline">Lihat Homepage</a></li>
          <li>• Supabase Connection: <span className="text-green-600">Ready</span></li>
          <li>• Tailwind CSS: <span className="text-green-600">Working</span></li>
        </ul>
      </div>
    </div>
  </div>
);

const ConsultationPage = () => (
  <div>
    <h1 className="text-3xl font-bold text-gray-900 mb-8">Konsultasi Pribadi</h1>
    <div className="bg-white rounded-lg shadow-lg p-8">
      <p className="text-gray-600">Halaman Consultation sedang dalam pengembangan...</p>
    </div>
  </div>
);

const LoginPage = () => (
  <div>
    <h1 className="text-3xl font-bold text-gray-900 mb-8">Login</h1>
    <div className="bg-white rounded-lg shadow-lg p-8">
      <p className="text-gray-600">Halaman Login sedang dalam pengembangan...</p>
    </div>
  </div>
);

const RegisterPage = () => (
  <div>
    <h1 className="text-3xl font-bold text-gray-900 mb-8">Register</h1>
    <div className="bg-white rounded-lg shadow-lg p-8">
      <p className="text-gray-600">Halaman Register sedang dalam pengembangan...</p>
    </div>
  </div>
);

export default App;