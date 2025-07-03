"use client";
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  FolderOpen, 
  Upload, 
  Settings, 
  Users, 
  BarChart3, 
  ShoppingCart, 
  Bell, 
  Search, 
  Menu, 
  X,
  LogOut,
  User,
  ChevronDown,
  Home
} from 'lucide-react';

// Main Admin Layout Component
const AdminLayout = ({ children, currentPage, onPageChange }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navigation = [
    { 
      name: 'Dashboard', 
      icon: LayoutDashboard, 
      key: 'dashboard',
      description: 'Overview and statistics'
    },
    { 
      name: 'Products', 
      icon: Package, 
      key: 'products',
      description: 'Manage your products'
    },
    { 
      name: 'Categories', 
      icon: FolderOpen, 
      key: 'categories',
      description: 'Organize your catalog'
    },
    { 
      name: 'Upload Product', 
      icon: Upload, 
      key: 'upload',
      description: 'Add new products'
    },
    { 
      name: 'Orders', 
      icon: ShoppingCart, 
      key: 'orders',
      description: 'Customer orders'
    },
    { 
      name: 'Analytics', 
      icon: BarChart3, 
      key: 'analytics',
      description: 'Sales and insights'
    },
    { 
      name: 'Customers', 
      icon: Users, 
      key: 'customers',
      description: 'Customer management'
    },
    { 
      name: 'Settings', 
      icon: Settings, 
      key: 'settings',
      description: 'System configuration'
    }
  ];

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}>
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          {sidebarOpen && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">PC</span>
              </div>
              <span className="text-xl font-bold text-gray-900">PrintCraft</span>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.key;
            
            return (
              <button
                key={item.name}
                onClick={() => onPageChange(item.key)}
                className={`w-full flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors group ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
                title={!sidebarOpen ? item.name : ''}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'}`} />
                {sidebarOpen && (
                  <div className="ml-3">
                    <span className="block">{item.name}</span>
                    <span className="text-xs text-gray-500">{item.description}</span>
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-gray-200">
          {sidebarOpen ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50"
              >
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-gray-600" />
                </div>
                <div className="ml-3 flex-1 text-left">
                  <span className="block text-sm font-medium">Admin User</span>
                  <span className="text-xs text-gray-500">admin@printcraft.com</span>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>
              
              {userMenuOpen && (
                <div className="absolute bottom-full mb-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                  <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center">
                    <User className="h-4 w-4 mr-3" />
                    Profile
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center">
                    <Settings className="h-4 w-4 mr-3" />
                    Settings
                  </button>
                  <hr className="my-2" />
                  <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center">
                    <LogOut className="h-4 w-4 mr-3" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="w-full flex justify-center py-2 text-gray-400 hover:text-gray-600"
              title="User Menu"
            >
              <User className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900 capitalize">
              {currentPage === 'dashboard' ? 'Dashboard' : 
               currentPage === 'products' ? 'Products' :
               currentPage === 'categories' ? 'Categories' :
               currentPage === 'upload' ? 'Upload Product' :
               currentPage === 'orders' ? 'Orders' :
               currentPage === 'analytics' ? 'Analytics' :
               currentPage === 'customers' ? 'Customers' :
               currentPage === 'settings' ? 'Settings' : 'Admin'}
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Notifications */}
            <button className="p-2 text-gray-400 hover:text-gray-600 relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Quick Actions */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onPageChange('upload')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Add Product
              </button>
              <button
                onClick={() => window.open('/', '_blank')}
                className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100"
                title="View Store"
              >
                <Home className="h-5 w-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout; 