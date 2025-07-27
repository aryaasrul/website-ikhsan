import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import HomePage from './pages/public/HomePage';
import AboutPage from './pages/public/AboutPage';
import BlogPage from './pages/public/BlogPage';
import ContactPage from './pages/public/ContactPage';
import ProductsPage from './pages/public/ProductsPage';

import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminPosts from './pages/admin/AdminPosts';
import AdminProducts from './pages/admin/AdminProducts';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminUsers from './pages/admin/AdminUsers';
import AdminSettings from './pages/admin/AdminSettings';

import Layout from './components/common/Layout';
import { useAuth } from './contexts/AuthContext';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !['admin', 'owner'].includes(profile?.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            You don't have permission to access this page. Only administrators can access the admin panel.
          </p>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">
              Current role: <span className="font-medium">{profile?.role || 'user'}</span>
            </p>
            <p className="text-sm text-gray-500">
              Required role: <span className="font-medium">admin or owner</span>
            </p>
          </div>
          <div className="mt-6 space-x-4">
            <a 
              href="/" 
              className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition-colors inline-block"
            >
              Back to Homepage
            </a>
            <button
              onClick={() => window.location.href = '/contact'}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Contact Admin
            </button>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-600"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <Layout>
            <HomePage />
          </Layout>
        } />
        
        <Route path="/about" element={
          <Layout>
            <AboutPage />
          </Layout>
        } />
        
        <Route path="/blog" element={
          <Layout>
            <BlogPage />
          </Layout>
        } />
        
        <Route path="/products" element={
          <Layout>
            <ProductsPage />
          </Layout>
        } />
        
        <Route path="/contact" element={
          <Layout>
            <ContactPage />
          </Layout>
        } />

        <Route path="/consultation" element={
          <Layout>
            <ConsultationPage />
          </Layout>
        } />

        <Route path="/login" element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        } />
        
        <Route path="/register" element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        } />

        <Route path="/profile" element={
          <ProtectedRoute>
            <Layout>
              <ProfilePage />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/my-purchases" element={
          <ProtectedRoute>
            <Layout>
              <MyPurchasesPage />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/admin" element={
          <ProtectedRoute requireAdmin={true}>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="posts" element={<AdminPosts />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        <Route path="/test" element={<TestPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

const ConsultationPage = () => (
  <div className="container mx-auto px-4 py-12">
    <h1 className="text-3xl font-bold text-gray-900 mb-8">📞 Konsultasi Pribadi</h1>
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="text-center">
        <div className="text-6xl mb-4">🚧</div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Coming Soon</h3>
        <p className="text-gray-600 mb-6">
          Halaman konsultasi pribadi sedang dalam pengembangan. 
          Untuk sementara, Anda dapat menghubungi kami melalui halaman kontak.
        </p>
        <a 
          href="/contact"
          className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
        >
          Hubungi Kami
        </a>
      </div>
    </div>
  </div>
);

const ProfilePage = () => (
  <div className="container mx-auto px-4 py-12">
    <h1 className="text-3xl font-bold text-gray-900 mb-8">👤 My Profile</h1>
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="text-center">
        <div className="text-6xl mb-4">🚧</div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Profile Page</h3>
        <p className="text-gray-600">User profile management coming soon...</p>
      </div>
    </div>
  </div>
);

const MyPurchasesPage = () => (
  <div className="container mx-auto px-4 py-12">
    <h1 className="text-3xl font-bold text-gray-900 mb-8">🛒 My Purchases</h1>
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="text-center">
        <div className="text-6xl mb-4">🚧</div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Purchase History</h3>
        <p className="text-gray-600">Purchase history and downloads coming soon...</p>
      </div>
    </div>
  </div>
);

const TestPage = () => (
  <Layout>
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">🧪 Test Page</h1>
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h3 className="font-semibold text-gray-800 mb-4">🔧 Development Tools</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium text-green-800 mb-3">✅ System Status</h4>
            <ul className="space-y-2 text-green-700 text-sm">
              <li>• React App: <span className="font-medium">Running</span></li>
              <li>• Tailwind CSS: <span className="font-medium">Working</span></li>
              <li>• Supabase: <span className="font-medium">Connected</span></li>
              <li>• Authentication: <span className="font-medium">Ready</span></li>
              <li>• Admin Panel: <span className="font-medium">Available</span></li>
            </ul>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-3">🔗 Quick Links</h4>
            <div className="space-y-2">
              <a href="/" className="block text-blue-600 hover:underline text-sm">🏠 Homepage</a>
              <a href="/about" className="block text-blue-600 hover:underline text-sm">👤 About Page</a>
              <a href="/blog" className="block text-blue-600 hover:underline text-sm">📝 Blog</a>
              <a href="/products" className="block text-blue-600 hover:underline text-sm">📚 Products</a>
              <a href="/contact" className="block text-blue-600 hover:underline text-sm">📞 Contact</a>
              <a href="/admin" className="block text-blue-600 hover:underline text-sm">👑 Admin Panel</a>
            </div>
          </div>

          <div className="p-4 bg-yellow-50 rounded-lg">
            <h4 className="font-medium text-yellow-800 mb-3">👥 Demo Accounts</h4>
            <div className="space-y-2 text-yellow-700 text-sm">
              <div>
                <p className="font-medium">Admin Account:</p>
                <p>Email: admin@muthawwifmuda.com</p>
                <p>Password: admin123</p>
              </div>
              <div className="mt-3">
                <p className="font-medium">Regular User:</p>
                <p>Email: user@example.com</p>
                <p>Password: user123</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-purple-50 rounded-lg">
            <h4 className="font-medium text-purple-800 mb-3">⚙️ Environment</h4>
            <div className="space-y-1 text-purple-700 text-sm">
              <p>Mode: <span className="font-medium">Development</span></p>
              <p>Version: <span className="font-medium">1.0.0</span></p>
              <p>Build: <span className="font-medium">React 18</span></p>
              <p>Styling: <span className="font-medium">Tailwind CSS</span></p>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-800 mb-2">📖 Setup Instructions</h4>
          <ol className="list-decimal list-inside space-y-1 text-gray-600 text-sm">
            <li>Create admin user via registration or Supabase dashboard</li>
            <li>Update user role to 'admin' in profiles table</li>
            <li>Login with admin credentials to access admin panel</li>
            <li>Test all features and functionality</li>
          </ol>
        </div>
      </div>
    </div>
  </Layout>
);

const NotFoundPage = () => (
  <Layout>
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md mx-auto p-8">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="space-x-4">
          <a 
            href="/" 
            className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition-colors inline-block"
          >
            Back to Homepage
          </a>
          <a 
            href="/contact" 
            className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors inline-block"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  </Layout>
);

export default App;