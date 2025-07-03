// components/admin/AdminDashboard.jsx
"use client"

import React, { useState, useEffect } from 'react';
import { Eye, Edit, Trash2, Package, CheckCircle, XCircle, Star, TrendingUp, Users, ShoppingCart, DollarSign } from 'lucide-react';

// Backend API base URL - UPDATE THIS TO MATCH YOUR BACKEND
const API_BASE_URL = 'http://localhost:8000/api';

const RealAdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({
    total_categories: 0,
    total_products: 0,
    featured_products: 0,
    timestamp: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Fetch real data from backend
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchProducts(),
        fetchCategories(),
        fetchStats()
      ]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/`);
      if (!response.ok) throw new Error(`Failed to fetch products: ${response.status}`);
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
      throw err;
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/`);
      if (!response.ok) throw new Error(`Failed to fetch categories: ${response.status}`);
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err);
      throw err;
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/stats`);
      if (!response.ok) throw new Error(`Failed to fetch stats: ${response.status}`);
      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
      throw err;
    }
  };

  const toggleProductActive = async (productId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${productId}/toggle-active`, {
        method: 'PUT',
      });
      if (!response.ok) throw new Error('Failed to toggle product status');
      
      const result = await response.json();
      alert(result.message);
      
      // Refresh products
      await fetchProducts();
      await fetchStats();
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const toggleProductFeatured = async (productId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${productId}/toggle-featured`, {
        method: 'PUT',
      });
      if (!response.ok) throw new Error('Failed to toggle featured status');
      
      const result = await response.json();
      alert(result.message);
      
      // Refresh products
      await fetchProducts();
      await fetchStats();
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const seedCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/dev/seed-categories`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to seed categories');
      
      const result = await response.json();
      alert(result.message);
      
      // Refresh categories
      await fetchCategories();
      await fetchStats();
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Unknown';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard data...</p>
          <p className="text-sm text-gray-500 mt-2">Connecting to backend at {API_BASE_URL}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <XCircle className="w-12 h-12 mx-auto mb-2" />
            <p className="text-lg font-semibold">Error Loading Dashboard</p>
          </div>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500 mb-4">
            Make sure your backend is running at: <strong>{API_BASE_URL}</strong>
          </p>
          <div className="space-y-2">
            <button
              onClick={fetchAllData}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 block mx-auto"
            >
              Retry Connection
            </button>
            <p className="text-xs text-gray-400">
              Expected backend commands:<br/>
              <code>cd backend && uvicorn main:app --reload</code>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-600">
                Last updated: {stats.timestamp ? formatDate(stats.timestamp) : 'Never'}
              </p>
              <p className="text-xs text-gray-500">
                Backend: {API_BASE_URL}
              </p>
            </div>
            <button
              onClick={fetchAllData}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Refresh Data
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'products'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Products ({products.length})
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'categories'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Categories ({categories.length})
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Package className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Products</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.total_products}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Star className="h-8 w-8 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Featured Products</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.featured_products}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <TrendingUp className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Categories</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.total_categories}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Active Products</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {products.filter(p => p.is_active).length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setActiveTab('products')}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Manage Products
                </button>
                <button
                  onClick={() => setActiveTab('categories')}
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                >
                  Manage Categories
                </button>
                <button
                  onClick={seedCategories}
                  className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600"
                >
                  Seed Categories
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Products</h2>
              <div className="text-sm text-gray-500">
                {products.length} total products
              </div>
            </div>

            {products.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No products yet</h3>
                <p className="text-gray-500">Upload your first product to get started</p>
              </div>
            ) : (
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {products.map((product) => (
                    <li key={product.id} className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-16 w-16">
                            {product.main_image_url ? (
                              <img
                                className="h-16 w-16 rounded-lg object-cover"
                                src={`http://localhost:8000${product.main_image_url}`}
                                alt={product.name}
                              />
                            ) : (
                              <div className="h-16 w-16 rounded-lg bg-gray-200 flex items-center justify-center">
                                <Package className="h-8 w-8 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="flex items-center">
                              <h3 className="text-lg font-medium text-gray-900">
                                {product.name}
                              </h3>
                              {product.is_featured && (
                                <Star className="ml-2 h-4 w-4 text-yellow-400 fill-current" />
                              )}
                            </div>
                            <p className="text-sm text-gray-500">
                              {getCategoryName(product.category_id)} • {formatPrice(product.base_price)}
                            </p>
                            <p className="text-xs text-gray-400">
                              Created: {formatDate(product.created_at)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="flex flex-col items-end">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              product.is_active 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {product.is_active ? 'Active' : 'Inactive'}
                            </span>
                            <div className="text-xs text-gray-500 mt-1">
                              Min Order: {product.min_order_quantity}
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setSelectedProduct(product)}
                              className="text-blue-600 hover:text-blue-900"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => toggleProductFeatured(product.id)}
                              className={`${
                                product.is_featured 
                                  ? 'text-yellow-600 hover:text-yellow-900' 
                                  : 'text-gray-400 hover:text-gray-600'
                              }`}
                              title={product.is_featured ? 'Remove from Featured' : 'Add to Featured'}
                            >
                              <Star className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => toggleProductActive(product.id)}
                              className={`${
                                product.is_active 
                                  ? 'text-red-600 hover:text-red-900' 
                                  : 'text-green-600 hover:text-green-900'
                              }`}
                              title={product.is_active ? 'Deactivate' : 'Activate'}
                            >
                              {product.is_active ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Categories</h2>
              <div className="text-sm text-gray-500">
                {categories.length} total categories
              </div>
            </div>

            {categories.length === 0 ? (
              <div className="text-center py-12">
                <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No categories yet</h3>
                <p className="text-gray-500 mb-4">Create categories to organize your products</p>
                <button
                  onClick={seedCategories}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Seed Categories
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => (
                  <div key={category.id} className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{category.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">{category.description}</p>
                        <p className="text-xs text-gray-400 mt-2">
                          Created: {formatDate(category.created_at)}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          category.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {category.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="text-sm text-gray-500">
                        Products: {products.filter(p => p.category_id === category.id).length}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">{selectedProduct.name}</h2>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  {selectedProduct.main_image_url && (
                    <img
                      src={`http://localhost:8000${selectedProduct.main_image_url}`}
                      alt={selectedProduct.name}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  )}
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">Product Details</h3>
                    <div className="mt-2 space-y-2">
                      <p><strong>Price:</strong> {formatPrice(selectedProduct.base_price)}</p>
                      <p><strong>Category:</strong> {getCategoryName(selectedProduct.category_id)}</p>
                      <p><strong>Min Order:</strong> {selectedProduct.min_order_quantity}</p>
                      <p><strong>Status:</strong> {selectedProduct.is_active ? 'Active' : 'Inactive'}</p>
                      <p><strong>Featured:</strong> {selectedProduct.is_featured ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                  
                  {selectedProduct.description && (
                    <div>
                      <h3 className="text-lg font-semibold">Description</h3>
                      <p className="text-gray-600 mt-2">{selectedProduct.description}</p>
                    </div>
                  )}
                  
                  {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold">Available Sizes</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedProduct.sizes.map((size, index) => (
                          <span key={index} className="bg-gray-100 px-2 py-1 rounded text-sm">
                            {size}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {selectedProduct.colors && selectedProduct.colors.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold">Available Colors</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedProduct.colors.map((color, index) => (
                          <span key={index} className="bg-gray-100 px-2 py-1 rounded text-sm">
                            {color}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RealAdminDashboard;