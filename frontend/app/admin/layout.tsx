import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-900 text-white flex flex-col p-4">
        <h2 className="text-xl font-bold mb-6">Admin Dashboard</h2>
        <nav className="flex flex-col gap-2">
          <Link href="/admin/categories/create" className="hover:bg-gray-800 rounded px-3 py-2">Create Category</Link>
          <Link href="/admin/products/upload" className="hover:bg-gray-800 rounded px-3 py-2">Upload Product</Link>
        </nav>
      </aside>
      <main className="flex-1 bg-gray-50 p-8">{children}</main>
    </div>
  );
} 