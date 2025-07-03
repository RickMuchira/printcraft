"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Star, 
  ShoppingCart,
  Heart,
  Eye,
  ArrowUpDown,
  Package,
  Loader2,
  X,
  ChevronDown,
  SlidersHorizontal,
  Sparkles,
  TrendingUp,
  Award,
  Zap
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

// Types
interface Product {
  id: number;
  name: string;
  description: string;
  base_price: number;
  main_image_url: string;
  gallery_images: string[];
  category_id: number;
  is_featured: boolean;
  is_active: boolean;
  min_order_quantity: number;
  sizes: string[];
  colors: string[];
  materials: string[];
  created_at: string;
  rating?: number;
  reviews_count?: number;
  discount_percentage?: number;
  tags?: string[];
}

interface Category {
  id: number;
  name: string;
  slug: string;
  image_url: string;
  is_active: boolean;
}

interface Filters {
  category: string;
  priceRange: [number, number];
  sortBy: string;
  viewMode: 'grid' | 'list';
  showFeatured: boolean;
  colors: string[];
  materials: string[];
}

const ProductsCatalog: React.FC = () => {
  // State Management
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<Filters>({
    category: "all",
    priceRange: [0, 10000],
    sortBy: "featured",
    viewMode: 'grid',
    showFeatured: false,
    colors: [],
    materials: []
  });
  const [showFilters, setShowFilters] = useState(false);
  const [wishlist, setWishlist] = useState<Set<number>>(new Set());
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
  
  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch("http://localhost:8000/api/products/"),
          fetch("http://localhost:8000/api/categories/")
        ]);
        
        if (productsRes.ok) {
          const productsData = await productsRes.json();
          // Add mock data for enhanced features
          const enhancedProducts = productsData.map((product: Product) => ({
            ...product,
            rating: Math.random() * 2 + 3, // 3-5 rating
            reviews_count: Math.floor(Math.random() * 200) + 10,
            discount_percentage: Math.random() > 0.7 ? Math.floor(Math.random() * 30) + 10 : 0,
            tags: ['Custom', 'Premium', 'Popular'].filter(() => Math.random() > 0.6)
          }));
          setProducts(enhancedProducts);
        }
        
        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json();
          setCategories(categoriesData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Memoized filtered and sorted products
  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      // Search filter
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        if (!product.name.toLowerCase().includes(searchLower) &&
            !product.description.toLowerCase().includes(searchLower)) {
          return false;
        }
      }

      // Category filter
      if (filters.category !== "all" && product.category_id !== parseInt(filters.category)) {
        return false;
      }

      // Price range filter
      if (product.base_price < filters.priceRange[0] || product.base_price > filters.priceRange[1]) {
        return false;
      }

      // Featured filter
      if (filters.showFeatured && !product.is_featured) {
        return false;
      }

      // Color filter
      if (filters.colors.length > 0 && product.colors) {
        if (!filters.colors.some(color => product.colors.includes(color))) {
          return false;
        }
      }

      // Material filter
      if (filters.materials.length > 0 && product.materials) {
        if (!filters.materials.some(material => product.materials.includes(material))) {
          return false;
        }
      }

      return product.is_active;
    });

    // Sort products
    switch (filters.sortBy) {
      case 'featured':
        filtered.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
        break;
      case 'price_low':
        filtered.sort((a, b) => a.base_price - b.base_price);
        break;
      case 'price_high':
        filtered.sort((a, b) => b.base_price - a.base_price);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'popular':
        filtered.sort((a, b) => (b.reviews_count || 0) - (a.reviews_count || 0));
        break;
      default:
        break;
    }

    return filtered;
  }, [products, searchQuery, filters]);

  // Utility functions
  const getCategoryName = (categoryId: number) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : "Uncategorized";
  };

  const getImageUrl = (imageUrl: string) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith('http')) return imageUrl;
    return `http://localhost:8000${imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`}`;
  };

  const handleImageError = (productId: number) => {
    setImageErrors(prev => new Set([...prev, productId]));
  };

  const toggleWishlist = (productId: number) => {
    setWishlist(prev => {
      const newWishlist = new Set(prev);
      if (newWishlist.has(productId)) {
        newWishlist.delete(productId);
      } else {
        newWishlist.add(productId);
      }
      return newWishlist;
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" className="h-4 w-4 fill-yellow-400 text-yellow-400 opacity-50" />);
    }

    for (let i = stars.length; i < 5; i++) {
      stars.push(<Star key={i} className="h-4 w-4 text-gray-300" />);
    }

    return stars;
  };

  // Product Card Component
  const ProductCard = ({ product }: { product: Product }) => {
    const imageUrl = getImageUrl(product.main_image_url);
    const isInWishlist = wishlist.has(product.id);
    const hasDiscount = product.discount_percentage && product.discount_percentage > 0;

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
      >
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          {imageUrl && !imageErrors.has(product.id) ? (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              onError={() => handleImageError(product.id)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <Package className="h-16 w-16 text-gray-400" />
            </div>
          )}
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {product.is_featured && (
              <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Featured
              </span>
            )}
            {hasDiscount && (
              <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                -{product.discount_percentage}%
              </span>
            )}
            {product.tags?.includes('Popular') && (
              <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                Popular
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`p-2 rounded-full backdrop-blur-sm border transition-all duration-200 ${
                isInWishlist 
                  ? 'bg-red-500 text-white border-red-500' 
                  : 'bg-white/80 text-gray-600 border-white/80 hover:bg-red-50 hover:text-red-500'
              }`}
            >
              <Heart className={`h-4 w-4 ${isInWishlist ? 'fill-current' : ''}`} />
            </button>
            <Link href={`/products/${product.id}`}>
              <button className="p-2 rounded-full bg-white/80 backdrop-blur-sm border border-white/80 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200">
                <Eye className="h-4 w-4" />
              </button>
            </Link>
          </div>

          {/* Quick Add to Cart */}
          <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button className="w-full bg-black/80 backdrop-blur-sm text-white py-2 px-4 rounded-lg font-medium hover:bg-black transition-colors duration-200 flex items-center justify-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Quick Add
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4 space-y-3">
          <div className="space-y-1">
            <h3 className="font-semibold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
              {product.name}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2">
              {product.description}
            </p>
            <p className="text-xs text-gray-500">
              {getCategoryName(product.category_id)}
            </p>
          </div>

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {renderStars(product.rating)}
              </div>
              <span className="text-sm text-gray-600">
                {product.rating.toFixed(1)} ({product.reviews_count})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-gray-900">
                {formatPrice(product.base_price)}
              </span>
              {hasDiscount && (
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(product.base_price * (1 + product.discount_percentage! / 100))}
                </span>
              )}
            </div>
            <span className="text-xs text-gray-500">
              Min: {product.min_order_quantity}
            </span>
          </div>

          {/* Colors/Materials Preview */}
          <div className="flex items-center gap-2 text-xs text-gray-500">
            {product.colors?.slice(0, 3).map(color => (
              <span key={color} className="px-2 py-1 bg-gray-100 rounded-full">
                {color}
              </span>
            ))}
            {product.colors && product.colors.length > 3 && (
              <span>+{product.colors.length - 3} more</span>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  // Main Render
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Premium Print Products
            </h1>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Discover our extensive collection of customizable print products designed to elevate your brand
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products, categories, or materials..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filters */}
          <div className="lg:w-64 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Filters</h3>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
                >
                  <SlidersHorizontal className="h-5 w-5" />
                </button>
              </div>

              <div className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>                {/* Categories */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Category
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Price Range
                  </label>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="10000"
                      step="50"
                      value={filters.priceRange[1]}
                      onChange={(e) => setFilters(prev => ({ 
                        ...prev, 
                        priceRange: [0, parseInt(e.target.value)] 
                      }))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>$0</span>
                      <span>{formatPrice(filters.priceRange[1])}</span>
                    </div>
                  </div>
                </div>

                {/* Featured Toggle */}
                <div>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.showFeatured}
                      onChange={(e) => setFilters(prev => ({ ...prev, showFeatured: e.target.checked }))}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Featured only</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Products</span>
                  <span className="font-medium">{products.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Categories</span>
                  <span className="font-medium">{categories.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Featured</span>
                  <span className="font-medium">{products.filter(p => p.is_featured).length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Controls Bar */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">
                    {filteredProducts.length} products found
                  </span>
                  {searchQuery && (
                    <span className="text-sm text-gray-500">
                      for "{searchQuery}"
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  {/* Sort */}
                  <select
                    value={filters.sortBy}
                    onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    <option value="featured">Featured</option>
                    <option value="newest">Newest</option>
                    <option value="price_low">Price: Low to High</option>
                    <option value="price_high">Price: High to Low</option>
                    <option value="name">Name A-Z</option>
                    <option value="rating">Highest Rated</option>
                    <option value="popular">Most Popular</option>
                  </select>

                  {/* View Mode */}
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setFilters(prev => ({ ...prev, viewMode: 'grid' }))}
                      className={`p-2 ${filters.viewMode === 'grid' ? 'bg-blue-500 text-white' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setFilters(prev => ({ ...prev, viewMode: 'list' }))}
                      className={`p-2 ${filters.viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      <List className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
                  <p className="text-gray-600">Loading amazing products...</p>
                </div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setFilters(prev => ({ ...prev, category: "all", showFeatured: false }));
                  }}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <motion.div
                layout
                className={`grid gap-6 ${
                  filters.viewMode === 'grid' 
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                    : 'grid-cols-1'
                }`}
              >
                <AnimatePresence mode="popLayout">
                  {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsCatalog; 