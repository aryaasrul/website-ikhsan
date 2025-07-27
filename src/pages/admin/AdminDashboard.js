// src/pages/admin/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../utils/supabase';
import { formatPrice, formatDate } from '../../utils/helpers';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalProducts: 0,
    totalUsers: 0,
    totalRevenue: 0,
    recentPurchases: [],
    recentPosts: [],
    recentUsers: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch counts
      const [postsResult, productsResult, usersResult, purchasesResult] = await Promise.all([
        supabase.from('posts').select('*', { count: 'exact', head: true }),
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('purchases').select('*, product:products(title, price)').eq('payment_status', 'completed')
      ]);

      // Calculate revenue
      const totalRevenue = purchasesResult.data?.reduce((sum, purchase) => {
        return sum + (purchase.amount || purchase.product?.price || 0);
      }, 0) || 0;

      // Get recent data
      const [recentPostsResult, recentUsersResult] = await Promise.all([
        supabase.from('posts').select('*, author:profiles(full_name)').order('created_at', { ascending: false }).limit(5),
        supabase.from('profiles').select('*').order('created_at', { ascending: false }).limit(5)
      ]);

      setStats({
        totalPosts: postsResult.count || 0,
        totalProducts: productsResult.count || 0,
        totalUsers: usersResult.count || 0,
        totalRevenue,
        recentPurchases: purchasesResult.data?.slice(0, 5) || [],
        recentPosts: recentPostsResult.data || [],
        recentUsers: recentUsersResult.data || []
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
          value={formatPrice(stats.totalRevenue)}
          icon="💰"
          color="yellow"
          link="/admin/analytics"
        />
      </div>

      {/* Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Posts */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">📝 Recent Posts</h2>
            <Link to="/admin/posts" className="text-blue-600 hover:text-blue-800 text-sm">
              View All →
            </Link>
          </div>
          
          <div className="space-y-3">
            {stats.recentPosts.length > 0 ? (
              stats.recentPosts.map((post) => (
                <div key={post.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 text-sm line-clamp-1">{post.title}</h3>
                    <p className="text-xs text-gray-500">
                      By {post.author?.full_name || 'Unknown'} • {formatDate(post.created_at)}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${
                    post.status === 'published' ? 'bg-green-100 text-green-800' : 
                    post.status === 'draft' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {post.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No posts yet</p>
            )}
          </div>
        </div>

        {/* Recent Purchases */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">💰 Recent Purchases</h2>
            <Link to="/admin/analytics" className="text-blue-600 hover:text-blue-800 text-sm">
              View All →
            </Link>
          </div>
          
          <div className="space-y-3">
            {stats.recentPurchases.length > 0 ? (
              stats.recentPurchases.map((purchase) => (
                <div key={purchase.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 text-sm line-clamp-1">
                      {purchase.product?.title || 'Unknown Product'}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {formatDate(purchase.created_at)}
                    </p>
                  </div>
                  <span className="font-semibold text-green-600">
                    {formatPrice(purchase.amount || purchase.product?.price || 0)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No purchases yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Users */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">👥 Recent Users</h2>
          <Link to="/admin/users" className="text-blue-600 hover:text-blue-800 text-sm">
            View All →
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 text-sm font-medium text-gray-700">User</th>
                <th className="text-left py-2 text-sm font-medium text-gray-700">Email</th>
                <th className="text-left py-2 text-sm font-medium text-gray-700">Role</th>
                <th className="text-left py-2 text-sm font-medium text-gray-700">Joined</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentUsers.length > 0 ? (
                stats.recentUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100">
                    <td className="py-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {user.full_name?.charAt(0) || 'U'}
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {user.full_name || 'Unnamed User'}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 text-sm text-gray-600">{user.email || 'No email'}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded text-xs ${
                        user.role === 'admin' ? 'bg-red-100 text-red-800' :
                        user.role === 'editor' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role || 'user'}
                      </span>
                    </td>
                    <td className="py-3 text-sm text-gray-600">
                      {formatDate(user.created_at)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-gray-500">
                    No users yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">⚡ Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/admin/posts/create"
            className="flex flex-col items-center justify-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
          >
            <span className="text-2xl mb-2">📝</span>
            <span className="text-sm font-medium text-blue-700">Create Post</span>
          </Link>
          
          <Link
            to="/admin/products/create"
            className="flex flex-col items-center justify-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
          >
            <span className="text-2xl mb-2">📦</span>
            <span className="text-sm font-medium text-green-700">Add Product</span>
          </Link>
          
          <Link
            to="/admin/settings"
            className="flex flex-col items-center justify-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
          >
            <span className="text-2xl mb-2">⚙️</span>
            <span className="text-sm font-medium text-purple-700">Settings</span>
          </Link>
          
          <Link
            to="/admin/analytics"
            className="flex flex-col items-center justify-center p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors"
          >
            <span className="text-2xl mb-2">📈</span>
            <span className="text-sm font-medium text-yellow-700">Analytics</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

// Stats Card Component
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