"use client";

import React, { useState, useEffect } from 'react';
import { 
  Star, 
  ShoppingCart, 
  Heart, 
  Share2, 
  ChevronLeft, 
  ChevronRight,
  Package,
  Truck,
  Shield,
  Award,
  Users,
  MessageSquare,
  ThumbsUp,
  Minus,
  Plus,
  Check,
  X,
  Info,
  Zap,
  Clock,
  Palette,
  Layers,
  Ruler
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

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

interface ProductDetailProps {
  params: {
    id: string;
  };
}

const ProductDetail: React.FC<ProductDetailProps> = ({ params }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:8000/api/products/${params.id}`);
        if (response.ok) {
          const productData = await response.json();
          // Enhance with mock data
          const enhancedProduct = {
            ...productData,
            rating: Math.random() * 2 + 3,
            reviews_count: Math.floor(Math.random() * 200) + 10,
            discount_percentage: Math.random() > 0.7 ? Math.floor(Math.random() * 30) + 10 : 0,
            tags: ['Custom', 'Premium', 'Popular'].filter(() => Math.random() > 0.6),
            gallery_images: productData.gallery_images || [productData.main_image_url]
          };
          setProduct(enhancedProduct);
          
          // Set defaults
          if (enhancedProduct.colors?.[0]) setSelectedColor(enhancedProduct.colors[0]);
          if (enhancedProduct.sizes?.[0]) setSelectedSize(enhancedProduct.sizes[0]);
          if (enhancedProduct.materials?.[0]) setSelectedMaterial(enhancedProduct.materials[0]);
          setQuantity(enhancedProduct.min_order_quantity || 1);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

  const getImageUrl = (imageUrl: string) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith('http')) return imageUrl;
    return `http://localhost:8000${imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`}`;
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

  const calculateFinalPrice = () => {
    if (!product) return 0;
    let price = product.base_price * quantity;
    if (product.discount_percentage) {
      price = price * (1 - product.discount_percentage / 100);
    }
    return price;
  };

  const handleQuantityChange = (newQuantity: number) => {
    const minQty = product?.min_order_quantity || 1;
    if (newQuantity >= minQty) {
      setQuantity(newQuantity);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-4">The product you're looking for doesn't exist.</p>
          <Link 
            href="/products" 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const allImages = product.gallery_images?.length > 0 ? product.gallery_images : [product.main_image_url];
  const currentImageUrl = getImageUrl(allImages[selectedImageIndex]);
  const hasDiscount = product.discount_percentage && product.discount_percentage > 0;
  const originalPrice = product.base_price * quantity;
  const finalPrice = calculateFinalPrice();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-700">Home</Link>
            <span className="text-gray-400">/</span>
            <Link href="/products" className="text-gray-500 hover:text-gray-700">Products</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200">
              {currentImageUrl && !imageError ? (
                <Image
                  src={currentImageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <Package className="h-24 w-24 text-gray-400" />
                </div>
              )}

              {/* Image Navigation */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImageIndex(prev => 
                      prev === 0 ? allImages.length - 1 : prev - 1
                    )}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setSelectedImageIndex(prev => 
                      prev === allImages.length - 1 ? 0 : prev + 1
                    )}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.is_featured && (
                  <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Featured
                  </span>
                )}
                {hasDiscount && (
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    -{product.discount_percentage}% OFF
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail Images */}
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {allImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 ${
                      selectedImageIndex === index ? 'border-blue-500' : 'border-gray-200'
                    }`}
                  >
                    {getImageUrl(image) ? (
                      <Image
                        src={getImageUrl(image)!}
                        alt={`${product.name} ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <Package className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              
              {/* Rating */}
              {product.rating && (
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center">
                    {renderStars(product.rating)}
                  </div>
                  <span className="text-sm text-gray-600">
                    {product.rating.toFixed(1)} ({product.reviews_count} reviews)
                  </span>
                </div>
              )}

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {product.tags.map(tag => (
                    <span key={tag} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Price */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl font-bold text-gray-900">
                  {formatPrice(finalPrice)}
                </span>
                {hasDiscount && (
                  <span className="text-lg text-gray-500 line-through">
                    {formatPrice(originalPrice)}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600">
                Minimum order: {product.min_order_quantity} units
              </p>
              {hasDiscount && (
                <p className="text-sm text-green-600 font-medium">
                  You save {formatPrice(originalPrice - finalPrice)}
                </p>
              )}
            </div>

            {/* Customization Options */}
            <div className="space-y-4">
              {/* Colors */}
              {product.colors && product.colors.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Palette className="inline h-4 w-4 mr-1" />
                    Color
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map(color => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-3 py-2 rounded-lg border transition-all ${
                          selectedColor === color
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Sizes */}
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Ruler className="inline h-4 w-4 mr-1" />
                    Size
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-3 py-2 rounded-lg border transition-all ${
                          selectedSize === size
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Materials */}
              {product.materials && product.materials.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Layers className="inline h-4 w-4 mr-1" />
                    Material
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.materials.map(material => (
                      <button
                        key={material}
                        onClick={() => setSelectedMaterial(material)}
                        className={`px-3 py-2 rounded-lg border transition-all ${
                          selectedMaterial === material
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {material}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= (product.min_order_quantity || 1)}
                  className="p-2 rounded-lg border border-gray-300 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-16 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  className="p-2 rounded-lg border border-gray-300 hover:border-gray-400"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium">
                <ShoppingCart className="h-5 w-5" />
                Add to Cart
              </button>
              <button
                onClick={() => setIsInWishlist(!isInWishlist)}
                className={`p-3 rounded-lg border transition-all ${
                  isInWishlist
                    ? 'border-red-500 bg-red-50 text-red-600'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Heart className={`h-5 w-5 ${isInWishlist ? 'fill-current' : ''}`} />
              </button>
              <button className="p-3 rounded-lg border border-gray-300 hover:border-gray-400">
                <Share2 className="h-5 w-5" />
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Truck className="h-4 w-4" />
                <span>Fast Shipping</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Shield className="h-4 w-4" />
                <span>Quality Guarantee</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="h-4 w-4" />
                <span>Expert Support</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Award className="h-4 w-4" />
                <span>Premium Quality</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-16">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {['description', 'specifications', 'reviews', 'shipping'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="mt-8">
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold mb-4">Product Description</h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
                <h4 className="text-md font-semibold mt-6 mb-3">Key Features:</h4>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>High-quality materials and construction</li>
                  <li>Fully customizable design options</li>
                  <li>Professional grade printing</li>
                  <li>Fast turnaround time</li>
                  <li>Competitive pricing for bulk orders</li>
                </ul>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Available Options</h4>
                    <div className="space-y-2 text-sm">
                      {product.colors && (
                        <div>
                          <span className="text-gray-600">Colors:</span>
                          <span className="ml-2">{product.colors.join(', ')}</span>
                        </div>
                      )}
                      {product.sizes && (
                        <div>
                          <span className="text-gray-600">Sizes:</span>
                          <span className="ml-2">{product.sizes.join(', ')}</span>
                        </div>
                      )}
                      {product.materials && (
                        <div>
                          <span className="text-gray-600">Materials:</span>
                          <span className="ml-2">{product.materials.join(', ')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Order Information</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-600">Minimum Order:</span>
                        <span className="ml-2">{product.min_order_quantity} units</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Price:</span>
                        <span className="ml-2">{formatPrice(product.base_price)} per unit</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Customer Reviews</h3>
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center">
                    {product.rating && renderStars(product.rating)}
                  </div>
                  <span className="text-lg font-medium">
                    {product.rating?.toFixed(1)} out of 5
                  </span>
                  <span className="text-gray-600">
                    ({product.reviews_count} reviews)
                  </span>
                </div>
                <div className="space-y-4">
                  {/* Mock reviews */}
                  {[1, 2, 3].map(i => (
                    <div key={i} className="border-b border-gray-200 pb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">{renderStars(5)}</div>
                        <span className="font-medium">John Doe</span>
                        <span className="text-gray-500 text-sm">2 days ago</span>
                      </div>
                      <p className="text-gray-600">
                        Excellent quality product! The printing was crisp and the materials feel premium. 
                        Will definitely order again.
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Shipping Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Shipping Options</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>Standard: 5-7 business days</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4" />
                        <span>Express: 2-3 business days</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4" />
                        <span>Overnight: 1 business day</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Order Processing</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p>• Orders are processed within 1-2 business days</p>
                      <p>• Custom products may require additional processing time</p>
                      <p>• You'll receive tracking information once shipped</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 