import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { supabase } from '../../utils/supabase';
import { formatPrice, formatDate, truncateText } from '../../utils/helpers';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    search: searchParams.get('search') || '',
    type: searchParams.get('type') || '',
    priceRange: searchParams.get('priceRange') || '',
    sortBy: searchParams.get('sortBy') || 'newest'
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchCategories = async () => {
    try {
      const { data } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
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
        .eq('is_active', true);

      // Apply filters
      if (filters.category) {
        query = query.eq('category_id', filters.category);
      }

      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      if (filters.type) {
        query = query.eq('product_type', filters.type);
      }

      if (filters.priceRange) {
        const [min, max] = filters.priceRange.split('-').map(Number);
        if (max) {
          query = query.gte('price', min).lte('price', max);
        } else {
          query = query.gte('price', min);
        }
      }

      // Apply sorting
      switch (filters.sortBy) {
        case 'price_low':
          query = query.order('price', { ascending: true });
          break;
        case 'price_high':
          query = query.order('price', { ascending: false });
          break;
        case 'popular':
          query = query.order('sold_count', { ascending: false });
          break;
        case 'rating':
          query = query.order('rating_average', { ascending: false });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;

      if (error) throw error;

      setProducts(data || []);

    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Update URL params
    const newSearchParams = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) newSearchParams.set(k, v.toString());
    });
    setSearchParams(newSearchParams);
  };

  const priceRanges = [
    { label: 'Semua Harga', value: '' },
    { label: 'Di bawah Rp 500.000', value: '0-500000' },
    { label: 'Rp 500.000 - Rp 1.000.000', value: '500000-1000000' },
    { label: 'Rp 1.000.000 - Rp 2.000.000', value: '1000000-2000000' },
    { label: 'Di atas Rp 2.000.000', value: '2000000' }
  ];

  const productTypes = [
    { label: 'Semua Tipe', value: '' },
    { label: 'Materi Digital', value: 'digital' },
    { label: 'Video Course', value: 'course' },
    { label: 'Konsultasi', value: 'consultation' },
    { label: 'Bundle Paket', value: 'bundle' }
  ];

  const sortOptions = [
    { label: 'Terbaru', value: 'newest' },
    { label: 'Harga Terendah', value: 'price_low' },
    { label: 'Harga Tertinggi', value: 'price_high' },
    { label: 'Terpopuler', value: 'popular' },
    { label: 'Rating Tertinggi', value: 'rating' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            📚 Materi Premium
          </h1>
          <p className="text-xl text-yellow-100 max-w-3xl mx-auto">
            Dapatkan panduan lengkap umrah & haji berdasarkan pembelajaran di Al-Azhar 
            dan pengalaman membimbing jamaah VIP
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🔍 Cari Produk
              </label>
              <input
                type="text"
                placeholder="Nama produk..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📂 Kategori
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                <option value="">Semua Kategori</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Product Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📦 Tipe Produk
              </label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                {productTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                💰 Rentang Harga
              </label>
              <select
                value={filters.priceRange}
                onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                {priceRanges.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🔄 Urutkan
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Clear Filters */}
          <div className="mt-4">
            <button
              onClick={() => {
                setFilters({ category: '', search: '', type: '', priceRange: '', sortBy: 'newest' });
                setSearchParams({});
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              🗑️ Reset Semua Filter
            </button>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex justify-between items-center mb-8">
          <p className="text-gray-600">
            Menampilkan {products.length} produk
            {filters.search && ` untuk "${filters.search}"`}
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-300"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-6 bg-gray-300 rounded mb-3"></div>
                  <div className="h-20 bg-gray-300 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          // No Results
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Produk Tidak Ditemukan</h3>
            <p className="text-gray-600 mb-6">
              Coba ubah filter pencarian atau kata kunci
            </p>
            <button
              onClick={() => {
                setFilters({ category: '', search: '', type: '', priceRange: '', sortBy: 'newest' });
                setSearchParams({});
              }}
              className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
            >
              Lihat Semua Produk
            </button>
          </div>
        ) : (
          // Products Grid
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Product Card Component
const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden group">
      {/* Product Image */}
      <div className="h-48 bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center relative overflow-hidden">
        <span className="text-6xl text-white">
          {product.content_type === 'pdf' ? '📄' : 
           product.content_type === 'video' ? '🎥' : 
           product.content_type === 'audio' ? '🎵' : 
           product.product_type === 'consultation' ? '💬' : '📦'}
        </span>
        
        {/* Badges */}
        <div className="absolute top-4 left-4 right-4 flex justify-between">
          {product.is_featured && (
            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
              ⭐ Featured
            </span>
          )}
          {product.discount_percentage > 0 && (
            <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
              -{product.discount_percentage}%
            </span>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-6">
        {/* Meta */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500 capitalize">{product.product_type}</span>
          <span className="text-sm text-gray-500">{product.difficulty_level}</span>
        </div>
        
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-yellow-600 transition-colors">
          <Link to={`/products/${product.slug}`}>
            {product.title}
          </Link>
        </h3>
        
        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {product.short_description}
        </p>

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-2xl font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            {product.original_price && (
              <span className="text-sm text-gray-500 line-through ml-2">
                {formatPrice(product.original_price)}
              </span>
            )}
          </div>
          <div className="flex items-center text-yellow-500">
            <span className="text-sm">⭐ {product.rating_average || '5.0'}</span>
          </div>
        </div>

        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {product.tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index}
                className="inline-block bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* CTA Button */}
        <Link 
          to={`/products/${product.slug}`}
          className="block w-full bg-yellow-500 text-white text-center py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
        >
          {product.product_type === 'consultation' ? '📞 Pesan Konsultasi' : '🛒 Lihat Detail'}
        </Link>
      </div>
    </div>
  );
};

export default ProductsPage;