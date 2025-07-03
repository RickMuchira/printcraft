"use client";
import React, { useState, useEffect } from 'react';
import {
  Package,
  Search,
  Filter,
  Download,
  Edit3,
  Trash2,
  Eye,
  Star,
  Plus,
  Grid3X3,
  List,
  MoreVertical,
  CheckCircle,
  XCircle,
  ArrowUpDown,
  Calendar,
  DollarSign,
  Tag
} from 'lucide-react';

const ProductsManagement = ({ onNavigate }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        fetch("http://localhost:8000/api/products/"),
        fetch("http://localhost:8000/api/categories/")
      ]);
      if (productsRes.ok) setProducts(await productsRes.json());
      if (categoriesRes.ok) setCategories(await categoriesRes.json());
    } finally {
      setLoading(false);
    }
  };

  const getCategoryName = (categoryId) => {
    const cat = categories.find((c) => c.id === categoryId);
    return cat ? cat.name : "Uncategorized";
  };

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.description || "").toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || String(p.category_id) === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const sorted = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.created_at) - new Date(a.created_at);
      case "oldest":
        return new Date(a.created_at) - new Date(b.created_at);
      case "name":
        return a.name.localeCompare(b.name);
      case "price_high":
        return b.base_price - a.base_price;
      case "price_low":
        return a.base_price - b.base_price;
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600">Manage your product catalog</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => onNavigate && onNavigate("upload")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-2 md:space-y-0 mb-4">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-3 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:w-64"
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:w-48"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:w-48"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="name">Name A-Z</option>
            <option value="price_high">Price High-Low</option>
            <option value="price_low">Price Low-High</option>
          </select>
        </div>
        {loading ? (
          <div>Loading...</div>
        ) : sorted.length === 0 ? (
          <div className="text-center text-gray-500">No products found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Featured</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sorted.map((product) => (
                  <tr key={product.id}>
                    <td className="px-6 py-4 flex items-center space-x-2">
                      {product.main_image_url ? (
                        <img src={`http://localhost:8000${product.main_image_url}`} alt={product.name} className="w-10 h-10 rounded object-cover" />
                      ) : (
                        <Package className="h-6 w-6 text-gray-300" />
                      )}
                      <span className="font-medium text-gray-900">{product.name}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{getCategoryName(product.category_id)}</td>
                    <td className="px-6 py-4 text-gray-900 font-semibold">${product.base_price}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{product.is_active ? 'Active' : 'Draft'}</span>
                    </td>
                    <td className="px-6 py-4">
                      {product.is_featured ? <Star className="h-4 w-4 text-yellow-500" /> : <span className="text-gray-400">—</span>}
                    </td>
                    <td className="px-6 py-4 flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-gray-600" title="View"><Eye className="h-4 w-4" /></button>
                      <button className="p-2 text-gray-400 hover:text-gray-600" title="Edit"><Edit3 className="h-4 w-4" /></button>
                      <button className="p-2 text-gray-400 hover:text-gray-600" title="More"><MoreVertical className="h-4 w-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsManagement; 