"use client";

import React from 'react';
import { 
  ShoppingCart, 
  X, 
  Plus, 
  Minus, 
  Trash2, 
  Package,
  ArrowRight,
  Heart,
  Star,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/lib/cart-context';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export const CartSidebar: React.FC = () => {
  const { state, removeItem, updateQuantity, closeCart, clearCart } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const getImageUrl = (imageUrl: string) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith('http')) return imageUrl;
    return `http://localhost:8000${imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`}`;
  };

  return (
    <AnimatePresence>
      {state.isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          
          {/* Cart Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-600 p-2 rounded-full">
                  <ShoppingCart className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Shopping Cart</h2>
                  <p className="text-sm text-gray-600">
                    {state.itemCount} {state.itemCount === 1 ? 'item' : 'items'}
                  </p>
                </div>
              </div>
              <button
                onClick={closeCart}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {state.items.length === 0 ? (
                <div className="text-center py-16">
                  <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="h-10 w-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h3>
                  <p className="text-gray-500 mb-6">
                    Add some products to get started
                  </p>
                  <Link href="/products">
                    <Button 
                      onClick={closeCart}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Browse Products
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence>
                    {state.items.map((item) => (
                      <motion.div
                        key={`${item.id}-${item.selectedColor}-${item.selectedSize}-${item.selectedMaterial}`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                      >
                        {/* Product Image */}
                        <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                          {getImageUrl(item.image) ? (
                            <Image
                              src={getImageUrl(item.image)!}
                              alt={item.name}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 text-sm truncate mb-1">
                            {item.name}
                          </h3>
                          
                          {/* Variants */}
                          <div className="flex flex-wrap gap-1 mb-2">
                            {item.selectedColor && (
                              <Badge variant="secondary" className="text-xs">
                                {item.selectedColor}
                              </Badge>
                            )}
                            {item.selectedSize && (
                              <Badge variant="secondary" className="text-xs">
                                {item.selectedSize}
                              </Badge>
                            )}
                            {item.selectedMaterial && (
                              <Badge variant="secondary" className="text-xs">
                                {item.selectedMaterial}
                              </Badge>
                            )}
                          </div>

                          {/* Price */}
                          <div className="flex items-center justify-between">
                            <div className="text-sm font-bold text-gray-900">
                              {formatPrice(item.price * item.quantity)}
                            </div>
                            <div className="text-xs text-gray-500">
                              {formatPrice(item.price)} each
                            </div>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                disabled={item.quantity <= item.minOrderQuantity}
                                className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="text-sm font-medium w-8 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-sm hover:bg-gray-50 transition-colors"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                            
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Clear Cart Button */}
                  {state.items.length > 0 && (
                    <div className="pt-4 border-t">
                      <button
                        onClick={clearCart}
                        className="w-full text-center text-red-600 hover:text-red-700 text-sm font-medium py-2 hover:bg-red-50 rounded transition-colors"
                      >
                        Clear Cart
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            {state.items.length > 0 && (
              <div className="border-t bg-gray-50 p-6 space-y-4">
                {/* Subtotal */}
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Subtotal:</span>
                  <span className="text-2xl font-bold text-gray-900">
                    {formatPrice(state.total)}
                  </span>
                </div>

                {/* Shipping Notice */}
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Free shipping on orders over $100</span>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3">
                    Proceed to Checkout
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  
                  <Link href="/products">
                    <Button 
                      variant="outline" 
                      className="w-full border-gray-300 hover:bg-gray-50"
                      onClick={closeCart}
                    >
                      Continue Shopping
                    </Button>
                  </Link>
                </div>

                {/* Trust Badges */}
                <div className="flex items-center justify-center space-x-4 pt-4 border-t">
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span>4.9/5 Rating</span>
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <Heart className="h-3 w-3 text-red-500" />
                    <span>50K+ Happy Customers</span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;