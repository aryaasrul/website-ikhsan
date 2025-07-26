import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { supabase } from '../../utils/supabase';
import { formatDate, truncateText } from '../../utils/helpers';

const BlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    search: searchParams.get('search') || '',
    page: parseInt(searchParams.get('page')) || 1
  });
  
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    currentPage: 1,
    perPage: 9
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchPosts();
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

  const fetchPosts = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('posts')
        .select(`
          *,
          category:categories(name, color, icon),
          author:profiles(full_name)
        `, { count: 'exact' })
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      // Apply filters
      if (filters.category) {
        query = query.eq('category_id', filters.category);
      }

      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,content.ilike.%${filters.search}%`);
      }

      // Apply pagination
      const from = (filters.page - 1) * pagination.perPage;
      const to = from + pagination.perPage - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      setPosts(data || []);
      setPagination({
        ...pagination,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / pagination.perPage),
        currentPage: filters.page
      });

    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value, page: 1 };
    setFilters(newFilters);
    
    // Update URL params
    const newSearchParams = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) newSearchParams.set(k, v.toString());
    });
    setSearchParams(newSearchParams);
  };

  const handlePageChange = (page) => {
    const newFilters = { ...filters, page };
    setFilters(newFilters);
    
    const newSearchParams = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) newSearchParams.set(k, v.toString());
    });
    setSearchParams(newSearchParams);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            📝 Blog & Artikel
          </h1>
          <p className="text-xl text-green-100 max-w-3xl mx-auto">
            Panduan, tips, dan pengalaman spiritual dari muthawwif lulusan Al-Azhar 
            yang telah membimbing ribuan jamaah
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🔍 Cari Artikel
              </label>
              <input
                type="text"
                placeholder="Masukkan kata kunci..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📂 Kategori
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Semua Kategori</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <button
                onClick={() => {
                  setFilters({ category: '', search: '', page: 1 });
                  setSearchParams({});
                }}
                className="w-full bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                🗑️ Reset Filter
              </button>
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex justify-between items-center mb-8">
          <p className="text-gray-600">
            Menampilkan {posts.length} dari {pagination.total} artikel
            {filters.search && ` untuk "${filters.search}"`}
            {filters.category && ` dalam kategori "${categories.find(c => c.id === filters.category)?.name}"`}
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-300"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-6 bg-gray-300 rounded mb-3"></div>
                  <div className="h-20 bg-gray-300 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          // No Results
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Artikel Tidak Ditemukan</h3>
            <p className="text-gray-600 mb-6">
              Coba ubah kata kunci pencarian atau pilih kategori lain
            </p>
            <button
              onClick={() => {
                setFilters({ category: '', search: '', page: 1 });
                setSearchParams({});
              }}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Lihat Semua Artikel
            </button>
          </div>
        ) : (
          // Posts Grid
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {posts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <Pagination 
                pagination={pagination}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

// Blog Post Card Component
const BlogPostCard = ({ post }) => {
  return (
    <article className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow group">
      {/* Featured Image */}
      <div className="h-48 bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center relative overflow-hidden">
        <span className="text-6xl text-white">
          {post.category?.icon || '📝'}
        </span>
        {post.is_featured && (
          <div className="absolute top-4 right-4 bg-yellow-500 text-white px-2 py-1 rounded-full text-sm font-bold">
            ⭐ Featured
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Meta */}
        <div className="flex items-center justify-between mb-3">
          <span 
            className="inline-block px-3 py-1 rounded-full text-sm font-medium"
            style={{ 
              backgroundColor: post.category?.color + '20', 
              color: post.category?.color 
            }}
          >
            {post.category?.name}
          </span>
          <span className="text-sm text-gray-500">
            {formatDate(post.published_at)}
          </span>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
          <Link to={`/blog/${post.slug}`}>
            {post.title}
          </Link>
        </h2>

        {/* Excerpt */}
        <p className="text-gray-600 mb-4 line-clamp-3">
          {post.excerpt || truncateText(post.content, 150)}
        </p>

        {/* Reading Time & Views */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <span>📖 {post.reading_time || 5} min read</span>
          <span>👁️ {post.view_count} views</span>
        </div>

        {/* Author & CTA */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white text-sm font-bold mr-2">
              {post.author?.full_name?.charAt(0) || 'M'}
            </div>
            <span className="text-sm text-gray-600">
              {post.author?.full_name || 'Muniful Ikhsan'}
            </span>
          </div>
          
          <Link 
            to={`/blog/${post.slug}`}
            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
          >
            Baca Selengkapnya →
          </Link>
        </div>
      </div>
    </article>
  );
};

// Pagination Component
const Pagination = ({ pagination, onPageChange }) => {
  const { currentPage, totalPages } = pagination;
  
  const getPageNumbers = () => {
    const pages = [];
    const showPages = 5;
    const startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
    const endPage = Math.min(totalPages, startPage + showPages - 1);
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  return (
    <div className="flex justify-center items-center space-x-2">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        ← Prev
      </button>

      {/* Page Numbers */}
      {getPageNumbers().map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-2 rounded-lg ${
            page === currentPage
              ? 'bg-blue-500 text-white'
              : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          {page}
        </button>
      ))}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next →
      </button>
    </div>
  );
};

export default BlogPage;