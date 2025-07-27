// src/pages/admin/AdminAnalytics.js
import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';
import { formatPrice, formatDate } from '../../utils/helpers';

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    revenue: {
      total: 0,
      thisMonth: 0,
      lastMonth: 0,
      growth: 0
    },
    sales: {
      total: 0,
      thisMonth: 0,
      lastMonth: 0,
      growth: 0
    },
    users: {
      total: 0,
      thisMonth: 0,
      lastMonth: 0,
      growth: 0
    },
    topProducts: [],
    recentPurchases: [],
    monthlyRevenue: [],
    userRegistrations: []
  });
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30'); // days

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      // Date calculations
      const now = new Date();
      const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
      const rangeStart = new Date(now.getTime() - parseInt(dateRange) * 24 * 60 * 60 * 1000);

      // Fetch purchases data
      const { data: purchases } = await supabase
        .from('purchases')
        .select(`
          *,
          product:products(title, price)
        `)
        .eq('payment_status', 'completed')
        .gte('created_at', rangeStart.toISOString());

      // Fetch all purchases for total calculations
      const { data: allPurchases } = await supabase
        .from('purchases')
        .select('*')
        .eq('payment_status', 'completed');

      // Fetch users data
      const { data: users } = await supabase
        .from('profiles')
        .select('*')
        .gte('created_at', rangeStart.toISOString());

      const { data: allUsers } = await supabase
        .from('profiles')
        .select('*');

      // Calculate revenue metrics
      const totalRevenue = allPurchases?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;
      const thisMonthRevenue = allPurchases?.filter(p => 
        new Date(p.created_at) >= thisMonthStart
      ).reduce((sum, p) => sum + (p.amount || 0), 0) || 0;
      const lastMonthRevenue = allPurchases?.filter(p => 
        new Date(p.created_at) >= lastMonthStart && new Date(p.created_at) < thisMonthStart
      ).reduce((sum, p) => sum + (p.amount || 0), 0) || 0;

      // Calculate sales metrics
      const totalSales = allPurchases?.length || 0;
      const thisMonthSales = allPurchases?.filter(p => 
        new Date(p.created_at) >= thisMonthStart
      ).length || 0;
      const lastMonthSales = allPurchases?.filter(p => 
        new Date(p.created_at) >= lastMonthStart && new Date(p.created_at) < thisMonthStart
      ).length || 0;

      // Calculate user metrics
      const totalUsers = allUsers?.length || 0;
      const thisMonthUsers = allUsers?.filter(u => 
        new Date(u.created_at) >= thisMonthStart
      ).length || 0;
      const lastMonthUsers = allUsers?.filter(u => 
        new Date(u.created_at) >= lastMonthStart && new Date(u.created_at) < thisMonthStart
      ).length || 0;

      // Calculate growth percentages
      const revenueGrowth = lastMonthRevenue > 0 ? 
        ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue * 100) : 0;
      const salesGrowth = lastMonthSales > 0 ? 
        ((thisMonthSales - lastMonthSales) / lastMonthSales * 100) : 0;
      const usersGrowth = lastMonthUsers > 0 ? 
        ((thisMonthUsers - lastMonthUsers) / lastMonthUsers * 100) : 0;

      // Get top products
      const productSales = {};
      allPurchases?.forEach(purchase => {
        const productId = purchase.product_id;
        if (!productSales[productId]) {
          productSales[productId] = {
            id: productId,
            title: purchase.product?.title || 'Unknown Product',
            sales: 0,
            revenue: 0
          };
        }
        productSales[productId].sales += 1;
        productSales[productId].revenue += purchase.amount || 0;
      });

      const topProducts = Object.values(productSales)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      // Get recent purchases
      const recentPurchases = allPurchases
        ?.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 10) || [];

      // Generate monthly revenue data for chart
      const monthlyRevenue = [];
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const nextDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
        
        const monthRevenue = allPurchases?.filter(p => {
          const purchaseDate = new Date(p.created_at);
          return purchaseDate >= date && purchaseDate < nextDate;
        }).reduce((sum, p) => sum + (p.amount || 0), 0) || 0;

        monthlyRevenue.push({
          month: date.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' }),
          revenue: monthRevenue,
          sales: allPurchases?.filter(p => {
            const purchaseDate = new Date(p.created_at);
            return purchaseDate >= date && purchaseDate < nextDate;
          }).length || 0
        });
      }

      // User registrations by month
      const userRegistrations = [];
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const nextDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
        
        const monthUsers = allUsers?.filter(u => {
          const regDate = new Date(u.created_at);
          return regDate >= date && regDate < nextDate;
        }).length || 0;

        userRegistrations.push({
          month: date.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' }),
          users: monthUsers
        });
      }

      setAnalytics({
        revenue: {
          total: totalRevenue,
          thisMonth: thisMonthRevenue,
          lastMonth: lastMonthRevenue,
          growth: revenueGrowth
        },
        sales: {
          total: totalSales,
          thisMonth: thisMonthSales,
          lastMonth: lastMonthSales,
          growth: salesGrowth
        },
        users: {
          total: totalUsers,
          thisMonth: thisMonthUsers,
          lastMonth: lastMonthUsers,
          growth: usersGrowth
        },
        topProducts,
        recentPurchases,
        monthlyRevenue,
        userRegistrations
      });

    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">📈 Analytics Dashboard</h1>
          <p className="text-gray-600">Monitor your business performance</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 3 months</option>
            <option value="365">Last year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Total Revenue"
          value={formatPrice(analytics.revenue.total)}
          subtitle={`${formatPrice(analytics.revenue.thisMonth)} this month`}
          growth={analytics.revenue.growth}
          icon="💰"
          color="green"
        />
        <MetricCard
          title="Total Sales"
          value={analytics.sales.total.toLocaleString()}
          subtitle={`${analytics.sales.thisMonth} this month`}
          growth={analytics.sales.growth}
          icon="🛒"
          color="blue"
        />
        <MetricCard
          title="Total Users"
          value={analytics.users.total.toLocaleString()}
          subtitle={`${analytics.users.thisMonth} this month`}
          growth={analytics.users.growth}
          icon="👥"
          color="purple"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Monthly Revenue Trend</h3>
          <div className="space-y-3">
            {analytics.monthlyRevenue.map((month, index) => (
              <div key={month.month} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{month.month}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full"
                      style={{ 
                        width: `${Math.max(5, (month.revenue / Math.max(...analytics.monthlyRevenue.map(m => m.revenue))) * 100)}%` 
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-20 text-right">
                    {formatPrice(month.revenue)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Registrations Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">👥 User Registrations</h3>
          <div className="space-y-3">
            {analytics.userRegistrations.map((month, index) => (
              <div key={month.month} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{month.month}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full"
                      style={{ 
                        width: `${Math.max(5, (month.users / Math.max(...analytics.userRegistrations.map(m => m.users))) * 100)}%` 
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-12 text-right">
                    {month.users}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Products & Recent Purchases */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🏆 Top Selling Products</h3>
          <div className="space-y-4">
            {analytics.topProducts.length > 0 ? (
              analytics.topProducts.map((product, index) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg font-bold text-gray-500">#{index + 1}</span>
                    <div>
                      <h4 className="font-medium text-gray-900">{product.title}</h4>
                      <p className="text-sm text-gray-600">{product.sales} sales</p>
                    </div>
                  </div>
                  <span className="font-semibold text-green-600">
                    {formatPrice(product.revenue)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No sales data yet</p>
            )}
          </div>
        </div>

        {/* Recent Purchases */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">💳 Recent Purchases</h3>
          <div className="space-y-3">
            {analytics.recentPurchases.length > 0 ? (
              analytics.recentPurchases.map((purchase) => (
                <div key={purchase.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">
                      {purchase.product?.title || 'Unknown Product'}
                    </h4>
                    <p className="text-xs text-gray-600">
                      {formatDate(purchase.created_at)}
                    </p>
                  </div>
                  <span className="font-semibold text-green-600">
                    {formatPrice(purchase.amount)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No purchases yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Detailed Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {formatPrice(analytics.monthlyRevenue.reduce((sum, m) => sum + m.revenue, 0) / 12)}
            </div>
            <div className="text-sm text-gray-600">Avg Monthly Revenue</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {(analytics.monthlyRevenue.reduce((sum, m) => sum + m.sales, 0) / 12).toFixed(1)}
            </div>
            <div className="text-sm text-gray-600">Avg Monthly Sales</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {analytics.sales.total > 0 ? formatPrice(analytics.revenue.total / analytics.sales.total) : formatPrice(0)}
            </div>
            <div className="text-sm text-gray-600">Avg Order Value</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {analytics.users.total > 0 ? ((analytics.sales.total / analytics.users.total) * 100).toFixed(1) : 0}%
            </div>
            <div className="text-sm text-gray-600">Conversion Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Metric Card Component
const MetricCard = ({ title, value, subtitle, growth, icon, color }) => {
  const colorClasses = {
    green: 'bg-green-50 border-green-200',
    blue: 'bg-blue-50 border-blue-200',
    purple: 'bg-purple-50 border-purple-200'
  };

  const isPositive = growth >= 0;

  return (
    <div className={`p-6 rounded-lg border-2 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-3xl">{icon}</span>
        {growth !== 0 && (
          <span className={`text-sm font-medium ${
            isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            {isPositive ? '↗️' : '↘️'} {Math.abs(growth).toFixed(1)}%
          </span>
        )}
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
        <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>
    </div>
  );
};

export default AdminAnalytics;