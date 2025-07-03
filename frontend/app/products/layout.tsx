import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Products - PrintCraft',
  description: 'Explore our extensive collection of premium customizable print products designed to elevate your brand.',
  keywords: 'custom printing, business cards, promotional products, branded merchandise, print services',
  openGraph: {
    title: 'Premium Print Products - PrintCraft',
    description: 'Discover our extensive collection of customizable print products designed to elevate your brand',
    type: 'website',
    siteName: 'PrintCraft',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Premium Print Products - PrintCraft',
    description: 'Discover our extensive collection of customizable print products designed to elevate your brand',
  },
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
} 