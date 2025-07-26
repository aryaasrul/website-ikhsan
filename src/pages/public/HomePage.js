import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../utils/supabase';
import { formatDate, truncateText } from '../../utils/helpers';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [latestPosts, setLatestPosts] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [siteSettings, setSiteSettings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      // Fetch featured products
      const { data: productsData } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(name, color)
        `)
        .eq('is_active', true)
        .eq('is_featured', true)
        .limit(4);

      // Fetch latest posts
      const { data: postsData } = await supabase
        .from('posts')
        .select(`
          *,
          category:categories(name, color, icon),
          author:profiles(full_name)
        `)
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(3);

      // Fetch featured testimonials
      const { data: testimonialsData } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_active', true)
        .eq('is_featured', true)
        .order('sort_order')
        .limit(6);

      // Fetch site settings
      const { data: settingsData } = await supabase
        .from('site_settings')
        .select('*')
        .in('key', ['site_info', 'contact_info', 'social_media'])
        .eq('is_public', true);

      if (settingsData) {
        const settings = {};
        settingsData.forEach(setting => {
          settings[setting.key] = setting.value;
        });
        setSiteSettings(settings);
      }

      setFeaturedProducts(productsData || []);
      setLatestPosts(postsData || []);
      setTestimonials(testimonialsData || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching home data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection siteSettings={siteSettings} />
      
      {/* Stats Section */}
      <StatsSection />
      
      {/* Featured Products */}
      <FeaturedProductsSection products={featuredProducts} />
      
      {/* Latest Blog Posts */}
      <LatestPostsSection posts={latestPosts} />
      
      {/* Testimonials */}
      <TestimonialsSection testimonials={testimonials} />
      
      {/* Call to Action */}
      <CTASection siteSettings={siteSettings} />
    </div>
  );
};

// Hero Section Component
const HeroSection = ({ siteSettings }) => {
  return (
    <section className="relative bg-gradient-to-br from-yellow-50 via-white to-green-50 py-20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 text-6xl">🕋</div>
        <div className="absolute top-20 right-20 text-4xl">⭐</div>
        <div className="absolute bottom-20 left-20 text-5xl">🌙</div>
        <div className="absolute bottom-10 right-10 text-3xl">✨</div>
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <div className="mb-6">
              <span className="inline-block bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
                🎓 Lulusan Al-Azhar Kairo
              </span>
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              <span className="text-yellow-600">Muniful Ikhsan</span><br />
              <span className="text-gray-800">Alhafizi</span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-gray-600 mb-4 font-medium">
              {siteSettings.site_info?.tagline || 'Muthawwif Profesional Berpengalaman'}
            </p>
            
            <p className="text-lg text-gray-600 mb-8 max-w-2xl">
              Dipercaya membimbing <strong className="text-yellow-600">Gubernur Kalimantan Tengah</strong>, 
              <strong className="text-green-600"> Habib Umar Al-Mutohhar</strong>, dan rombongan ulama terkemuka. 
              Pengalaman 1000+ jamaah dengan standar pelayanan VIP.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link 
                to="/consultation" 
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-yellow-600 hover:to-yellow-700 transform hover:scale-105 transition-all shadow-lg"
              >
                📞 Konsultasi Gratis
              </Link>
              <Link 
                to="/products" 
                className="bg-white text-gray-800 px-8 py-4 rounded-lg font-semibold text-lg border-2 border-gray-200 hover:border-yellow-500 hover:text-yellow-600 transition-all"
              >
                📚 Lihat Materi Premium
              </Link>
            </div>

            {/* Social Proof */}
            <div className="mt-8 flex flex-wrap gap-6 justify-center lg:justify-start text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span className="text-green-500">✅</span>
                <span>1000+ Jamaah Terpuaskan</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-500">🏆</span>
                <span>Lulusan Al-Azhar</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-red-500">⭐</span>
                <span>Rating 5.0/5.0</span>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative mx-auto w-80 h-80 lg:w-96 lg:h-96">
              {/* Background Circle */}
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-green-500 rounded-full opacity-20 animate-pulse"></div>
              
              {/* Profile Image Placeholder */}
              <div className="absolute inset-4 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center text-white text-6xl font-bold shadow-2xl">
                🕋
              </div>
              
              {/* Floating Icons */}
              <div className="absolute -top-4 -right-4 bg-white rounded-full p-3 shadow-lg animate-bounce">
                <span className="text-2xl">📚</span>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white rounded-full p-3 shadow-lg animate-bounce" style={{animationDelay: '0.5s'}}>
                <span className="text-2xl">🤲</span>
              </div>
              <div className="absolute top-1/2 -left-6 bg-white rounded-full p-2 shadow-lg animate-bounce" style={{animationDelay: '1s'}}>
                <span className="text-xl">⭐</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Stats Section Component
const StatsSection = () => {
  const stats = [
    { number: '1000+', label: 'Jamaah Dibimbing', icon: '👥' },
    { number: '15+', label: 'Tahun Pengalaman', icon: '📅' },
    { number: '50+', label: 'Rombongan VIP', icon: '👑' },
    { number: '5.0', label: 'Rating Kepuasan', icon: '⭐' },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl mb-2">{stat.icon}</div>
              <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Featured Products Section
const FeaturedProductsSection = ({ products }) => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            📚 Materi Premium Terpilih
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Dapatkan panduan lengkap umrah & haji berdasarkan pembelajaran di Al-Azhar 
            dan pengalaman membimbing jamaah VIP
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link 
            to="/products" 
            className="inline-block bg-yellow-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
          >
            Lihat Semua Materi →
          </Link>
        </div>
      </div>
    </section>
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
           product.content_type === 'audio' ? '🎵' : '📦'}
        </span>
        {product.discount_percentage > 0 && (
          <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-bold">
            -{product.discount_percentage}%
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500 capitalize">{product.product_type}</span>
          <span className="text-sm text-gray-500">{product.difficulty_level}</span>
        </div>
        
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-yellow-600 transition-colors">
          {product.title}
        </h3>
        
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
            <span className="text-sm">⭐ 5.0</span>
          </div>
        </div>

        {/* CTA Button */}
        <Link 
          to={`/products/${product.slug}`}
          className="block w-full bg-yellow-500 text-white text-center py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
        >
          Lihat Detail
        </Link>
      </div>
    </div>
  );
};

// Latest Posts Section
const LatestPostsSection = ({ posts }) => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            📝 Artikel & Tips Terbaru
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Baca panduan, tips, dan pengalaman spiritual dari seorang muthawwif 
            lulusan Al-Azhar yang telah membimbing ribuan jamaah
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link 
            to="/blog" 
            className="inline-block bg-gray-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-900 transition-colors"
          >
            Baca Semua Artikel →
          </Link>
        </div>
      </div>
    </section>
  );
};

// Post Card Component
const PostCard = ({ post }) => {
  return (
    <article className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden group">
      {/* Post Image */}
      <div className="h-48 bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
        <span className="text-6xl text-white">
          {post.category?.icon || '📝'}
        </span>
      </div>

      {/* Post Content */}
      <div className="p-6">
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

        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {post.title}
        </h3>

        <p className="text-gray-600 mb-4 line-clamp-3">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">
            👁️ {post.view_count} views
          </span>
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

// Testimonials Section
const TestimonialsSection = ({ testimonials }) => {
  return (
    <section className="py-20 bg-gradient-to-br from-yellow-50 to-green-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            💬 Testimoni Jamaah
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Kepercayaan dari jamaah VIP, pejabat negara, dan ulama terkemuka 
            adalah kehormatan terbesar bagi kami
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

// Testimonial Card Component
const TestimonialCard = ({ testimonial }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      {/* Stars Rating */}
      <div className="flex items-center mb-4">
        {[...Array(testimonial.rating || 5)].map((_, i) => (
          <span key={i} className="text-yellow-400 text-lg">⭐</span>
        ))}
      </div>

      {/* Testimonial Content */}
      <blockquote className="text-gray-700 mb-6 italic leading-relaxed">
        "{testimonial.content}"
      </blockquote>

      {/* Author Info */}
      <div className="flex items-center">
        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
          {testimonial.name.charAt(0)}
        </div>
        <div>
          <div className="font-semibold text-gray-900">{testimonial.name}</div>
          <div className="text-sm text-gray-600">{testimonial.title}</div>
          {testimonial.location && (
            <div className="text-sm text-gray-500">📍 {testimonial.location}</div>
          )}
        </div>
      </div>
    </div>
  );
};

// Call to Action Section
const CTASection = ({ siteSettings }) => {
  const whatsappNumber = siteSettings.contact_info?.whatsapp?.replace(/[^0-9]/g, '') || '6282119097273';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=Assalamualaikum, saya ingin konsultasi tentang persiapan umrah/haji`;

  return (
    <section className="py-20 bg-gradient-to-r from-yellow-500 to-yellow-600">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            🤲 Siap Memulai Perjalanan Spiritual Anda?
          </h2>
          <p className="text-xl text-yellow-100 mb-8 max-w-2xl mx-auto">
            Dapatkan bimbingan personal dari muthawwif lulusan Al-Azhar 
            yang telah dipercaya pejabat dan ulama terkemuka
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a 
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-yellow-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-yellow-50 transition-colors shadow-lg"
            >
              💬 Konsultasi via WhatsApp
            </a>
            <Link 
              to="/products"
              className="bg-yellow-700 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-yellow-800 transition-colors"
            >
              📚 Lihat Materi Premium
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-yellow-100">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏛️</span>
              <span>Lulusan Al-Azhar</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">👑</span>
              <span>Dipercaya Pejabat</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">📞</span>
              <span>Konsultasi 24/7</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">✅</span>
              <span>Garansi Kepuasan</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomePage;