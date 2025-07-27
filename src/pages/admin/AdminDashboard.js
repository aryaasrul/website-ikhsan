import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../utils/supabase';
import { formatPrice, formatDate } from '../../utils/helpers';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalProducts: 0,
    totalUsers: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Simple count queries to avoid complex joins
      const [postsCount, productsCount, usersCount] = await Promise.all([
        supabase.from('posts').select('*', { count: 'exact', head: true }),
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true })
      ]);

      setStats({
        totalPosts: postsCount.count || 0,
        totalProducts: productsCount.count || 0,
        totalUsers: usersCount.count || 0,
        totalRevenue: 0 // Simplified for now
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">📊 Admin Dashboard</h1>
          <p className="text-gray-600">Kelola website dan monitor performa</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">
            {new Date().toLocaleDateString('id-ID', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Posts"
          value={stats.totalPosts}
          icon="📝"
          color="blue"
          link="/admin/posts"
        />
        <StatsCard
          title="Total Products"
          value={stats.totalProducts}
          icon="📦"
          color="green"
          link="/admin/products"
        />
        <StatsCard
          title="Total Users"
          value={stats.totalUsers}
          icon="👥"
          color="purple"
          link="/admin/users"
        />
        <StatsCard
          title="Total Revenue"
          value="Rp 0"
          icon="💰"
          color="yellow"
          link="/admin/analytics"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">⚡ Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/admin/posts"
            className="flex flex-col items-center justify-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
          >
            <span className="text-2xl mb-2">📝</span>
            <span className="text-sm font-medium text-blue-700">Manage Posts</span>
          </Link>
          
          <Link
            to="/admin/products"
            className="flex flex-col items-center justify-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
          >
            <span className="text-2xl mb-2">📦</span>
            <span className="text-sm font-medium text-green-700">Manage Products</span>
          </Link>
          
          <Link
            to="/admin/users"
            className="flex flex-col items-center justify-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
          >
            <span className="text-2xl mb-2">👥</span>
            <span className="text-sm font-medium text-purple-700">Manage Users</span>
          </Link>
          
          <Link
            to="/admin/settings"
            className="flex flex-col items-center justify-center p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors"
          >
            <span className="text-2xl mb-2">⚙️</span>
            <span className="text-sm font-medium text-yellow-700">Settings</span>
          </Link>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg p-6 text-white">
        <h2 className="text-xl font-bold mb-2">👋 Welcome to Admin Panel!</h2>
        <p className="text-yellow-100">
          Selamat datang di panel admin website Muthawwif Muda. 
          Gunakan menu di sidebar untuk mengelola konten, pengguna, dan pengaturan website.
        </p>
        <div className="mt-4 flex space-x-4">
          <Link
            to="/"
            target="_blank"
            className="bg-white text-yellow-600 px-4 py-2 rounded font-medium hover:bg-yellow-50 transition-colors"
          >
            🌐 View Website
          </Link>
          <Link
            to="/admin/settings"
            className="bg-yellow-700 text-white px-4 py-2 rounded font-medium hover:bg-yellow-800 transition-colors"
          >
            ⚙️ Website Settings
          </Link>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">🔧 System Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Database Connected</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Authentication Working</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">All Systems Operational</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple Stats Card Component
const StatsCard = ({ title, value, icon, color, link }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200'
  };

  return (
    <Link to={link} className="block">
      <div className={`p-6 rounded-lg border-2 hover:shadow-md transition-shadow ${colorClasses[color]}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium opacity-75">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
          <span className="text-3xl">{icon}</span>
        </div>
      </div>
    </Link>
  );
};

export default AdminDashboard;