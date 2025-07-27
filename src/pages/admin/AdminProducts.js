// src/pages/admin/AdminProducts.js
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { supabase } from '../../utils/supabase';
import { formatPrice, formatDate, truncateText } from '../../utils/helpers';
import toast from 'react-hot-toast';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [filters, setFilters] = useState({
    status: searchParams.get('status') || '',
    category: searchParams.get('category') || '',
    type: searchParams.get('type') || '',
    search: searchParams.get('search') || ''
  });

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [filters]);

  const fetchCategories = async () => {
    try {
      const { data } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('products')
        .select(`
          *,
          category:categories(name, color)
        `)
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.status === 'active') {
        query = query.eq('is_active', true);
      } else if (filters.status === 'inactive') {
        query = query.eq('is_active', false);
      }
      
      if (filters.category) {
        query = query.eq('category_id', filters.category);
      }
      
      if (filters.type) {
        query = query.eq('product_type', filters.type);
      }
      
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;

      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Error loading products');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    const newParams = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) newParams.set(k, v);
    });
    setSearchParams(newParams);
  };

  const handleSelectProduct = (productId) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map(product => product.id));
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedProducts.length === 0) {
      toast.error('Please select products first');
      return;
    }

    const confirmMessage = {
      delete: 'Are you sure you want to delete selected products?',
      activate: 'Activate selected products?',
      deactivate: 'Deactivate selected products?',
      feature: 'Feature selected products?',
      unfeature: 'Unfeature selected products?'
    };

    if (!window.confirm(confirmMessage[action])) return;

    try {
      if (action === 'delete') {
        const { error } = await supabase
          .from('products')
          .delete()
          .in('id', selectedProducts);
        if (error) throw error;
        toast.success(`${selectedProducts.length} products deleted`);
      } else if (action === 'activate' || action === 'deactivate') {
        const is_active = action === 'activate';
        const { error } = await supabase
          .from('products')
          .update({ is_active })
          .in('id', selectedProducts);
        if (error) throw error;
        toast.success(`${selectedProducts.length} products ${action}d`);
      } else if (action === 'feature' || action === 'unfeature') {
        const is_featured = action === 'feature';
        const { error } = await supabase
          .from('products')
          .update({ is_featured })
          .in('id', selectedProducts);
        if (error) throw error;
        toast.success(`${selectedProducts.length} products ${action}d`);
      }

      setSelectedProducts([]);
      fetchProducts();
    } catch (error) {
      console.error(`Error ${action}ing products:`, error);
      toast.error(`Error ${action}ing products`);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;

      toast.success('Product deleted successfully');
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Error deleting product');
    }
  };

  const handleToggleStatus = async (productId, currentStatus) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_active: !currentStatus })
        .eq('id', productId);

      if (error) throw error;

      toast.success(`Product ${!currentStatus ? 'activated' : 'deactivated'}`);
      fetchProducts();
    } catch (error) {
      console.error('Error updating product status:', error);
      toast.error('Error updating product status');
    }
  };

  const handleToggleFeatured = async (productId, currentFeatured) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_featured: !currentFeatured })
        .eq('id', productId);

      if (error) throw error;

      toast.success(`Product ${!currentFeatured ? 'featured' : 'unfeatured'}`);
      fetchProducts();
    } catch (error) {
      console.error('Error updating product featured status:', error);
      toast.error('Error updating featured status');
    }
  };

  const productTypes = [
    { value: '', label: 'All Types' },
    { value: 'digital', label: 'Digital Product' },
    { value: 'course', label: 'Video Course' },
    { value: 'consultation', label: 'Consultation' },
    { value: 'bundle', label: 'Bundle Package' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">📦 Manage Products</h1>
          <p className="text-gray-600">Create and manage premium products</p>
        </div>
        <Link
          to="/admin/products/create"
          className="mt-4 sm:mt-0 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors inline-flex items-center"
        >
          ➕ Create New Product
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🔍 Search
            </label>
            <input
              type="text"
              placeholder="Search products..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📊 Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📦 Product Type
            </label>
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {productTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📂 Category
            </label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filters */}
          <div className="flex items-end">
            <button
              onClick={() => {
                setFilters({ status: '', category: '', type: '', search: '' });
                setSearchParams({});
              }}
              className="w-full bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
            >
              🗑️ Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedProducts.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-green-800">
              {selectedProducts.length} products selected
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => handleBulkAction('activate')}
                className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
              >
                ✅ Activate
              </button>
              <button
                onClick={() => handleBulkAction('deactivate')}
                className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
              >
                ⏸️ Deactivate
              </button>
              <button
                onClick={() => handleBulkAction('feature')}
                className="bg-purple-500 text-white px-3 py-1 rounded text-sm hover:bg-purple-600"
              >
                ⭐ Feature
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Products Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-16 text-center">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Products Found</h3>
          <p className="text-gray-600 mb-4">
            {filters.search || filters.status || filters.category || filters.type
              ? 'Try adjusting your filters or search terms'
              : 'Get started by creating your first product'
            }
          </p>
          <Link
            to="/admin/products/create"
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
          >
            Create First Product
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Table Header */}
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={selectedProducts.length === products.length}
                onChange={handleSelectAll}
                className="rounded border-gray-300 text-green-600 focus:ring-green-500 mr-4"
              />
              <span className="text-sm font-medium text-gray-900">
                Select All ({products.length} products)
              </span>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isSelected={selectedProducts.includes(product.id)}
                onSelect={() => handleSelectProduct(product.id)}
                onDelete={() => handleDeleteProduct(product.id)}
                onToggleStatus={() => handleToggleStatus(product.id, product.is_active)}
                onToggleFeatured={() => handleToggleFeatured(product.id, product.is_featured)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Stats Summary */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Products Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {products.filter(p => p.is_active).length}
            </div>
            <div className="text-sm text-gray-600">Active</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {products.filter(p => !p.is_active).length}
            </div>
            <div className="text-sm text-gray-600">Inactive</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {products.filter(p => p.is_featured).length}
            </div>
            <div className="text-sm text-gray-600">Featured</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {formatPrice(products.reduce((sum, p) => sum + (p.price || 0), 0))}
            </div>
            <div className="text-sm text-gray-600">Total Value</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {products.length}
            </div>
            <div className="text-sm text-gray-600">Total Products</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Product Card Component
const ProductCard = ({ product, isSelected, onSelect, onDelete, onToggleStatus, onToggleFeatured }) => {
  return (
    <div className={`border-2 rounded-lg overflow-hidden hover:shadow-md transition-all ${
      isSelected ? 'border-green-500 bg-green-50' : 'border-gray-200'
    }`}>
      {/* Card Header */}
      <div className="p-4 bg-gradient-to-r from-green-400 to-green-600 relative">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
          className="absolute top-4 left-4 rounded border-white text-green-600 focus:ring-green-500"
        />
        
        <div className="flex justify-center">
          <span className="text-6xl text-white">
            {product.content_type === 'pdf' ? '📄' : 
             product.content_type === 'video' ? '🎥' : 
             product.content_type === 'audio' ? '🎵' : 
             product.product_type === 'consultation' ? '💬' : '📦'}
          </span>
        </div>

        {/* Badges */}
        <div className="absolute top-4 right-4 space-y-1">
          {product.is_featured && (
            <span className="block bg-yellow-500 text-white px-2 py-1 rounded text-xs font-bold">
              ⭐ Featured
            </span>
          )}
          <span className={`block px-2 py-1 rounded text-xs font-bold ${
            product.is_active ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          }`}>
            {product.is_active ? '✅ Active' : '❌ Inactive'}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4">
        {/* Category */}
        {product.category && (
          <span 
            className="inline-block px-2 py-1 text-xs font-medium rounded-full mb-2"
            style={{ 
              backgroundColor: product.category.color + '20', 
              color: product.category.color 
            }}
          >
            {product.category.name}
          </span>
        )}

        {/* Title */}
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
          {product.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {truncateText(product.short_description || product.description, 80)}
        </p>

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            {product.original_price && (
              <span className="text-sm text-gray-500 line-through ml-2">
                {formatPrice(product.original_price)}
              </span>
            )}
          </div>
          <span className="text-sm text-gray-500 capitalize">
            {product.product_type}
          </span>
        </div>

        {/* Meta Info */}
        <div className="grid grid-cols-2 gap-4 mb-4 text-xs text-gray-500">
          <div>
            <span className="font-medium">Created:</span><br />
            {formatDate(product.created_at)}
          </div>
          <div>
            <span className="font-medium">Sales:</span><br />
            {product.sold_count || 0} sold
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between space-x-2">
          <div className="flex space-x-1">
            <Link
              to={`/products/${product.slug}`}
              target="_blank"
              className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
              title="View Product"
            >
              👁️
            </Link>
            <Link
              to={`/admin/products/edit/${product.id}`}
              className="bg-indigo-500 text-white px-2 py-1 rounded text-xs hover:bg-indigo-600"
              title="Edit Product"
            >
              ✏️
            </Link>
          </div>

          <div className="flex space-x-1">
            <button
              onClick={onToggleStatus}
              className={`px-2 py-1 rounded text-xs ${
                product.is_active 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
              title={product.is_active ? 'Deactivate' : 'Activate'}
            >
              {product.is_active ? '⏸️' : '▶️'}
            </button>
            <button
              onClick={onToggleFeatured}
              className={`px-2 py-1 rounded text-xs ${
                product.is_featured 
                  ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
                  : 'bg-gray-400 hover:bg-gray-500 text-white'
              }`}
              title={product.is_featured ? 'Unfeature' : 'Feature'}
            >
              ⭐
            </button>
            <button
              onClick={onDelete}
              className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
              title="Delete Product"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;