"use client"
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { api } from '@/lib/api'

export default function CreateCategoryPage() {
  const { toast } = useToast()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.createCategory(name, description, image || undefined)
      toast({ title: 'Success', description: 'Category created!' })
      setName('')
      setDescription('')
      setImage(null)
      // Optionally: trigger a reload of categories in the upload product form (if using context or global state)
    } catch (err) {
      toast({ title: 'Error', description: err instanceof Error ? err.message : 'Failed to create category', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create Category</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Category Name *</Label>
          <Input id="name" value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Input id="description" value={description} onChange={e => setDescription(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="image">Image (optional)</Label>
          <Input id="image" type="file" accept="image/*" onChange={e => setImage(e.target.files?.[0] || null)} />
        </div>
        <Button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Category'}</Button>
      </form>
    </div>
  )
} 