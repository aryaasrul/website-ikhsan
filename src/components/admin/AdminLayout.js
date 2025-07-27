import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const location = useLocation();

  const navigation = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: '📊',
      current: location.pathname === '/admin'
    },
    {
      name: 'Posts',
      href: '/admin/posts',
      icon: '📝',
      current: location.pathname.startsWith('/admin/posts')
    },
    {
      name: 'Products',
      href: '/admin/products',
      icon: '📦',
      current: location.pathname.startsWith('/admin/products')
    },
    {
      name: 'Users',
      href: '/admin/users',
      icon: '👥',
      current: location.pathname.startsWith('/admin/users')
    },
    {
      name: 'Analytics',
      href: '/admin/analytics',
      icon: '📈',
      current: location.pathname.startsWith('/admin/analytics')
    },
    {
      name: 'Settings',
      href: '/admin/settings',
      icon: '⚙️',
      current: location.pathname.startsWith('/admin/settings')
    }
  ];

  const handleSignOut = async () => {
    await signOut();
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div 
            className="fixed inset-0 bg-gray-600 bg-opacity-75" 
            onClick={() => setSidebarOpen(false)} 
          />
        </div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 bg-yellow-500">
            <Link to="/admin" className="flex items-center space-x-2">
              <span className="text-2xl">🕋</span>
              <span className="text-white font-bold text-lg">Admin Panel</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white hover:text-gray-200"
            >
              <span className="text-xl">✕</span>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  item.current
                    ? 'bg-yellow-100 text-yellow-800 border-r-4 border-yellow-500'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* User info & logout */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold">
                {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'A'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {profile?.full_name || 'Admin'}
                </p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <Link
                to="/"
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
              >
                <span>🌐</span>
                <span>View Site</span>
              </Link>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded w-full text-left"
              >
                <span>🚪</span>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Top bar */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <span className="text-xl">☰</span>
            </button>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Welcome, {profile?.full_name || 'Admin'}
              </span>
              
              {/* Quick actions */}
              <div className="flex items-center space-x-2">
                <Link
                  to="/admin/posts"
                  className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                >
                  📝 Posts
                </Link>
                <Link
                  to="/admin/products"
                  className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                >
                  📦 Products
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;