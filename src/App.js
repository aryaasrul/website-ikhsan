import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { supabase } from './utils/supabase';

// Import the new HomePage
import HomePage from './pages/public/HomePage';

function App() {
  const { loading } = useAuth();

  // Test Supabase connection
  useEffect(() => {
    console.log('Supabase connected:', supabase);
    
    // Test database connection
    const testConnection = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('count', { count: 'exact', head: true });
        
        if (error) {
          console.error('Database connection error:', error);
        } else {
          console.log('Database connected successfully');
        }
      } catch (err) {
        console.error('Connection test failed:', err);
      }
    };

    testConnection();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      {/* Temporary layout without separate components */}
      <div className="min-h-screen flex flex-col bg-gray-50">
        {/* Simple Navbar */}
        <nav className="bg-white shadow-lg sticky top-0 z-50">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl font-bold">🕋</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-800">Muniful Ikhsan Alhafizi</h1>
                  <p className="text-sm text-gray-600">Muthawwif Profesional</p>
                </div>
              </div>
              
              <div className="flex space-x-6">
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

// Temporary placeholder pages - will be replaced with real components
const AboutPage = () => (
  <div>
    <h1 className="text-3xl font-bold text-gray-900 mb-8">Tentang Muniful Ikhsan Alhafizi</h1>
    <div className="bg-white rounded-lg shadow-lg p-8">
      <p className="text-gray-600">Halaman About sedang dalam pengembangan...</p>
    </div>
  </div>
);

const BlogPage = () => (
  <div>
    <h1 className="text-3xl font-bold text-gray-900 mb-8">Blog & Artikel</h1>
    <div className="bg-white rounded-lg shadow-lg p-8">
      <p className="text-gray-600">Halaman Blog sedang dalam pengembangan...</p>
    </div>
  </div>
);

const ProductsPage = () => (
  <div>
    <h1 className="text-3xl font-bold text-gray-900 mb-8">Materi Premium</h1>
    <div className="bg-white rounded-lg shadow-lg p-8">
      <p className="text-gray-600">Halaman Products sedang dalam pengembangan...</p>
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

const ContactPage = () => (
  <div>
    <h1 className="text-3xl font-bold text-gray-900 mb-8">Kontak</h1>
    <div className="bg-white rounded-lg shadow-lg p-8">
      <p className="text-gray-600">Halaman Contact sedang dalam pengembangan...</p>
    </div>
  </div>
);

const LoginPage = () => (
  <div>
    <h1 className="text-3xl font-bold text-gray-900 mb-8">Masuk</h1>
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
      <p className="text-gray-600">Form login sedang dalam pengembangan...</p>
      <p className="text-sm text-gray-500 mt-4">Sementara gunakan <a href="/test" className="text-yellow-600">test page</a> untuk login.</p>
    </div>
  </div>
);

const RegisterPage = () => (
  <div>
    <h1 className="text-3xl font-bold text-gray-900 mb-8">Daftar</h1>
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
      <p className="text-gray-600">Form register sedang dalam pengembangan...</p>
      <p className="text-sm text-gray-500 mt-4">Sementara gunakan <a href="/test" className="text-yellow-600">test page</a> untuk register.</p>
    </div>
  </div>
);

// Test page untuk auth testing
const TestPage = () => {
  const { user, profile, signIn, signUp, signOut, loading, isAdmin, isOwner, canManageContent } = useAuth();
  const [testForm, setTestForm] = React.useState({
    email: 'admin@muthawwif.com',
    password: 'password123',
    fullName: 'Admin Muthawwif'
  });

  const handleInputChange = (e) => {
    setTestForm({
      ...testForm,
      [e.target.name]: e.target.value
    });
  };

  const handleTestSignUp = async () => {
    await signUp(testForm.email, testForm.password, testForm.fullName);
  };

  const handleTestSignIn = async () => {
    await signIn(testForm.email, testForm.password);
  };

  const setAdminRole = async () => {
    if (!user) {
      alert('Please login first');
      return;
    }
    
    const sqlCommand = `UPDATE profiles SET role = 'admin' WHERE email = '${user.email}';`;
    prompt('Run this SQL in Supabase SQL Editor:', sqlCommand);
  };

  const setOwnerRole = async () => {
    if (!user) {
      alert('Please login first');
      return;
    }
    
    const sqlCommand = `UPDATE profiles SET role = 'owner' WHERE email = '${user.email}';`;
    prompt('Run this SQL in Supabase SQL Editor:', sqlCommand);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">
        🕋 Muniful Ikhsan Alhafizi - Auth System Test
      </h1>
      
      {/* Auth Status */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">🔐 Auth Status</h2>
        {user ? (
          <div className="space-y-2">
            <p><strong>✅ Logged In:</strong> {user.email}</p>
            <p><strong>🆔 User ID:</strong> {user.id}</p>
            {profile && (
              <>
                <p><strong>👤 Full Name:</strong> {profile.full_name}</p>
                <p><strong>🎭 Role:</strong> 
                  <span className={`ml-2 px-2 py-1 rounded text-sm ${
                    profile.role === 'admin' ? 'bg-red-100 text-red-800' :
                    profile.role === 'owner' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {profile.role}
                  </span>
                </p>
                <p><strong>🏛️ Is Admin:</strong> {isAdmin() ? '✅ Yes' : '❌ No'}</p>
                <p><strong>👑 Is Owner:</strong> {isOwner() ? '✅ Yes' : '❌ No'}</p>
                <p><strong>⚡ Can Manage Content:</strong> {canManageContent() ? '✅ Yes' : '❌ No'}</p>
              </>
            )}
            
            <div className="mt-4 space-x-4">
              <button 
                onClick={signOut}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                🚪 Sign Out
              </button>
              
              {profile?.role === 'user' && (
                <>
                  <button 
                    onClick={setAdminRole}
                    className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
                  >
                    👨‍💼 Set Admin Role
                  </button>
                  <button 
                    onClick={setOwnerRole}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    👑 Set Owner Role
                  </button>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-600">❌ Not logged in</p>
            
            {/* Login Form */}
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="font-semibold mb-2">🔑 Test Login</h3>
              <div className="space-y-2">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={testForm.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={testForm.password}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name (for signup)"
                  value={testForm.fullName}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <div className="mt-4 space-x-4">
                <button 
                  onClick={handleTestSignIn}
                  disabled={loading}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  {loading ? '⏳' : '🔑'} Sign In
                </button>
                <button 
                  onClick={handleTestSignUp}
                  disabled={loading}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
                >
                  {loading ? '⏳' : '✨'} Sign Up
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Database Test */}
      <DatabaseTest />
      
      {/* Test Instructions */}
      <div className="bg-blue-50 rounded-lg p-6 mt-8">
        <h3 className="text-lg font-semibold mb-2">🧪 Testing Instructions</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Try "Sign Up" with a new email to create account</li>
          <li>Try "Sign In" with existing credentials</li>
          <li>After login, click "Set Admin Role" and run the SQL command</li>
          <li>Refresh page to see role changes</li>
          <li>Test role-based features (should show admin privileges)</li>
        </ol>
      </div>
    </div>
  );
};

// Component untuk test database
const DatabaseTest = () => {
  const [categories, setCategories] = React.useState([]);
  const [posts, setPosts] = React.useState([]);
  const [products, setProducts] = React.useState([]);

  React.useEffect(() => {
    testDatabase();
  }, []);

  const testDatabase = async () => {
    try {
      // Test categories
      const { data: categoriesData } = await supabase
        .from('categories')
        .select('*')
        .limit(5);
      setCategories(categoriesData || []);

      // Test posts
      const { data: postsData } = await supabase
        .from('posts')
        .select('*')
        .limit(5);
      setPosts(postsData || []);

      // Test products
      const { data: productsData } = await supabase
        .from('products')
        .select('*')
        .limit(5);
      setProducts(productsData || []);

    } catch (error) {
      console.error('Database test error:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-semibold mb-4">Database Test</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h3 className="font-semibold text-lg mb-2">Categories ({categories.length})</h3>
          <ul className="space-y-1">
            {categories.map(category => (
              <li key={category.id} className="text-sm">
                {category.icon} {category.name}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-2">Posts ({posts.length})</h3>
          <ul className="space-y-1">
            {posts.map(post => (
              <li key={post.id} className="text-sm truncate">
                {post.title}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-2">Products ({products.length})</h3>
          <ul className="space-y-1">
            {products.map(product => (
              <li key={product.id} className="text-sm truncate">
                {product.title}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default App;