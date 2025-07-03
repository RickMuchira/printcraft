"use client";
import React, { useState } from 'react';
import RealAdminDashboard from '@/components/admin/AdminDashboard';
import ProductsManagement from '@/components/admin/ProductsManagement';
import ProductUploadForm from '@/components/admin/ProductUploadForm';
import CategoriesManagement from '@/components/admin/CategoriesManagement';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminDashboard() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Add navigation logic here if needed
  };

  return (
    <AdminLayout currentPage={currentPage} onPageChange={handlePageChange}>
      {currentPage === 'products' ? (
        <ProductsManagement onNavigate={handlePageChange} />
      ) : currentPage === 'upload' ? (
        <ProductUploadForm onNavigate={handlePageChange} />
      ) : currentPage === 'categories' ? (
        <CategoriesManagement onNavigate={handlePageChange} />
      ) : (
        <RealAdminDashboard />
      )}
    </AdminLayout>
  );
}