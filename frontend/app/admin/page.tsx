export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Welcome to the Admin Dashboard</h1>
      <p className="mb-2">Use the sidebar to manage categories and upload new products.</p>
      <ul className="list-disc ml-6 text-gray-700">
        <li>Click <b>Create Category</b> to add a new product category.</li>
        <li>Click <b>Upload Product</b> to add a new product with variants.</li>
      </ul>
    </div>
  );
} 