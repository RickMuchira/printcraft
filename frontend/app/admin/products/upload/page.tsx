import ProductUploadForm from '@/components/admin/ProductUploadForm'
import { Toaster } from '@/components/ui/toaster'

export default function ProductUploadPage() {
  return (
    <div className="py-8">
      <ProductUploadForm />
      <Toaster />
    </div>
  )
}