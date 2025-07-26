import { supabase } from '../utils/supabase'

// Posts API
export const postsAPI = {
  // Get all published posts
  getPublished: async (limit = 10, offset = 0) => {
    const { data, error, count } = await supabase
      .from('posts')
      .select(`
        *,
        category:categories(*),
        author:profiles(full_name, avatar_url)
      `, { count: 'exact' })
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .range(offset, offset + limit - 1)
    
    return { data, error, count }
  },

  // Get post by slug
  getBySlug: async (slug) => {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        category:categories(*),
        author:profiles(full_name, avatar_url)
      `)
      .eq('slug', slug)
      .eq('status', 'published')
      .single()
    
    return { data, error }
  },

  // Admin: Get all posts
  getAll: async () => {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        category:categories(*),
        author:profiles(full_name)
      `)
      .order('created_at', { ascending: false })
    
    return { data, error }
  },

  // Create post
  create: async (postData) => {
    const { data, error } = await supabase
      .from('posts')
      .insert(postData)
      .select()
      .single()
    
    return { data, error }
  },

  // Update post
  update: async (id, updates) => {
    const { data, error } = await supabase
      .from('posts')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    return { data, error }
  },

  // Delete post
  delete: async (id) => {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id)
    
    return { error }
  },

  // Increment view count
  incrementViews: async (id) => {
    const { error } = await supabase.rpc('increment_post_views', { post_id: id })
    return { error }
  }
}

// Products API
export const productsAPI = {
  // Get all active products
  getActive: async () => {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(*)
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
    
    return { data, error }
  },

  // Get product by slug
  getBySlug: async (slug) => {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(*)
      `)
      .eq('slug', slug)
      .eq('is_active', true)
      .single()
    
    return { data, error }
  },

  // Admin: Get all products
  getAll: async () => {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(*)
      `)
      .order('created_at', { ascending: false })
    
    return { data, error }
  },

  // Create product
  create: async (productData) => {
    const { data, error } = await supabase
      .from('products')
      .insert(productData)
      .select()
      .single()
    
    return { data, error }
  },

  // Update product
  update: async (id, updates) => {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    return { data, error }
  },

  // Delete product
  delete: async (id) => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
    
    return { error }
  }
}

// Categories API
export const categoriesAPI = {
  getActive: async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('name')
    
    return { data, error }
  },

  getAll: async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name')
    
    return { data, error }
  },

  create: async (categoryData) => {
    const { data, error } = await supabase
      .from('categories')
      .insert(categoryData)
      .select()
      .single()
    
    return { data, error }
  },

  update: async (id, updates) => {
    const { data, error } = await supabase
      .from('categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    return { data, error }
  }
}

// Purchases API
export const purchasesAPI = {
  // Get user purchases
  getUserPurchases: async (userId) => {
    const { data, error } = await supabase
      .from('purchases')
      .select(`
        *,
        product:products(*)
      `)
      .eq('user_id', userId)
      .eq('payment_status', 'completed')
      .order('created_at', { ascending: false })
    
    return { data, error }
  },

  // Check if user owns product
  checkOwnership: async (userId, productId) => {
    const { data, error } = await supabase
      .from('purchases')
      .select('id')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .eq('payment_status', 'completed')
      .single()
    
    return { data, error }
  },

  // Create purchase
  create: async (purchaseData) => {
    const { data, error } = await supabase
      .from('purchases')
      .insert(purchaseData)
      .select()
      .single()
    
    return { data, error }
  },

  // Update purchase status
  updateStatus: async (id, status) => {
    const { data, error } = await supabase
      .from('purchases')
      .update({ payment_status: status })
      .eq('id', id)
      .select()
      .single()
    
    return { data, error }
  }
}