"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Upload, X, Plus, Trash2 } from 'lucide-react'
import { api, Category, ProductUploadData, PrintArea } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'

interface FilePreview {
  file: File
  url: string
}

const SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const COLOR_OPTIONS = ['Red', 'Blue', 'Green', 'Black', 'White', 'Yellow'];
const MATERIAL_OPTIONS = ['Cotton', 'Polyester', 'Wool', 'Silk', 'Leather'];

export function ProductUploadForm() {
  const { toast } = useToast()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  // Form data
  const [formData, setFormData] = useState<ProductUploadData>({
    name: '',
    description: '',
    base_price: 0,
    min_order_quantity: 1,
    category_id: 0,
    sizes: [],
    colors: [],
    materials: [],
    customization_options: {},
    print_areas: []
  })

  // File uploads
  const [mainImage, setMainImage] = useState<FilePreview | null>(null)
  const [galleryImages, setGalleryImages] = useState<FilePreview[]>([])
  const [designTemplate, setDesignTemplate] = useState<FilePreview | null>(null)
  const [mockupFront, setMockupFront] = useState<FilePreview | null>(null)
  const [mockupBack, setMockupBack] = useState<FilePreview | null>(null)

  // Dynamic arrays
  const [currentSize, setCurrentSize] = useState('')
  const [currentColor, setCurrentColor] = useState('')
  const [currentMaterial, setCurrentMaterial] = useState('')

  // Load categories on mount
  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      setLoading(true)
      const data = await api.getCategories()
      setCategories(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load categories",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = (file: File, type: 'main' | 'gallery' | 'template' | 'mockup_front' | 'mockup_back') => {
    const url = URL.createObjectURL(file)
    const preview = { file, url }

    switch (type) {
      case 'main':
        if (mainImage) URL.revokeObjectURL(mainImage.url)
        setMainImage(preview)
        break
      case 'gallery':
        setGalleryImages(prev => [...prev, preview])
        break
      case 'template':
        if (designTemplate) URL.revokeObjectURL(designTemplate.url)
        setDesignTemplate(preview)
        break
      case 'mockup_front':
        if (mockupFront) URL.revokeObjectURL(mockupFront.url)
        setMockupFront(preview)
        break
      case 'mockup_back':
        if (mockupBack) URL.revokeObjectURL(mockupBack.url)
        setMockupBack(preview)
        break
    }
  }

  const removeFile = (type: 'main' | 'template' | 'mockup_front' | 'mockup_back', index?: number) => {
    switch (type) {
      case 'main':
        if (mainImage) {
          URL.revokeObjectURL(mainImage.url)
          setMainImage(null)
        }
        break
      case 'template':
        if (designTemplate) {
          URL.revokeObjectURL(designTemplate.url)
          setDesignTemplate(null)
        }
        break
      case 'mockup_front':
        if (mockupFront) {
          URL.revokeObjectURL(mockupFront.url)
          setMockupFront(null)
        }
        break
      case 'mockup_back':
        if (mockupBack) {
          URL.revokeObjectURL(mockupBack.url)
          setMockupBack(null)
        }
        break
    }
  }

  const removeGalleryImage = (index: number) => {
    const imageToRemove = galleryImages[index]
    URL.revokeObjectURL(imageToRemove.url)
    setGalleryImages(prev => prev.filter((_, i) => i !== index))
  }

  const addToArray = (type: 'sizes' | 'colors' | 'materials', value: string) => {
    if (!value.trim()) return

    setFormData(prev => ({
      ...prev,
      [type]: [...(prev[type] || []), value.trim()]
    }))

    // Clear input
    switch (type) {
      case 'sizes':
        setCurrentSize('')
        break
      case 'colors':
        setCurrentColor('')
        break
      case 'materials':
        setCurrentMaterial('')
        break
    }
  }

  const removeFromArray = (type: 'sizes' | 'colors' | 'materials', index: number) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type]?.filter((_, i) => i !== index) || []
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!mainImage) {
      toast({
        title: "Error",
        description: "Main image is required",
        variant: "destructive"
      })
      return
    }

    if (!formData.category_id) {
      toast({
        title: "Error",
        description: "Please select a category",
        variant: "destructive"
      })
      return
    }

    try {
      setUploading(true)

      const files = {
        main_image: mainImage.file,
        gallery_images: galleryImages.map(img => img.file),
        design_template: designTemplate?.file,
        mockup_front: mockupFront?.file,
        mockup_back: mockupBack?.file,
      }

      const result = await api.uploadProduct(formData, files)

      toast({
        title: "Success",
        description: `Product "${result.name}" uploaded successfully!`,
      })

      // Reset form
      setFormData({
        name: '',
        description: '',
        base_price: 0,
        min_order_quantity: 1,
        category_id: 0,
        sizes: [],
        colors: [],
        materials: [],
        customization_options: {},
        print_areas: []
      })

      // Clear files
      if (mainImage) URL.revokeObjectURL(mainImage.url)
      if (designTemplate) URL.revokeObjectURL(designTemplate.url)
      if (mockupFront) URL.revokeObjectURL(mockupFront.url)
      if (mockupBack) URL.revokeObjectURL(mockupBack.url)
      galleryImages.forEach(img => URL.revokeObjectURL(img.url))

      setMainImage(null)
      setGalleryImages([])
      setDesignTemplate(null)
      setMockupFront(null)
      setMockupBack(null)

    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload product",
        variant: "destructive"
      })
    } finally {
      setUploading(false)
    }
  }

  const FileUploadCard = ({ 
    title, 
    file, 
    onUpload, 
    onRemove, 
    accept = "image/*",
    required = false 
  }: {
    title: string
    file: FilePreview | null
    onUpload: (file: File) => void
    onRemove: () => void
    accept?: string
    required?: boolean
  }) => (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">
          {title} {required && <span className="text-red-500">*</span>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {file ? (
          <div className="relative">
            <img 
              src={file.url} 
              alt={title}
              className="w-full h-32 object-cover rounded-md"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={onRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-md cursor-pointer hover:bg-gray-50">
            <Upload className="h-8 w-8 text-gray-400 mb-2" />
            <span className="text-sm text-gray-500">Click to upload</span>
            <input
              type="file"
              className="hidden"
              accept={accept}
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) onUpload(file)
              }}
            />
          </label>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Upload New Product</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Base Price (KSh) *</Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.base_price}
                      onChange={(e) => setFormData(prev => ({ ...prev, base_price: parseFloat(e.target.value) || 0 }))}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="min_order">Minimum Order Quantity *</Label>
                    <Input
                      id="min_order"
                      type="number"
                      min="1"
                      value={formData.min_order_quantity}
                      onChange={(e) => setFormData(prev => ({ ...prev, min_order_quantity: parseInt(e.target.value) || 1 }))}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category_id.toString()}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="specifications" className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              {/* Sizes */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Available Sizes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-col gap-2">
                    {SIZE_OPTIONS.map(size => (
                      <label key={size} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.sizes?.includes(size)}
                          onChange={e => {
                            setFormData(prev => ({
                              ...prev,
                              sizes: e.target.checked
                                ? [...(prev.sizes || []), size]
                                : (prev.sizes || []).filter(s => s !== size)
                            }))
                          }}
                        />
                        {size}
                      </label>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Colors */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Available Colors</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-col gap-2">
                    {COLOR_OPTIONS.map(color => (
                      <label key={color} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.colors?.includes(color)}
                          onChange={e => {
                            setFormData(prev => ({
                              ...prev,
                              colors: e.target.checked
                                ? [...(prev.colors || []), color]
                                : (prev.colors || []).filter(c => c !== color)
                            }))
                          }}
                        />
                        {color}
                      </label>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Materials */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Materials</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-col gap-2">
                    {MATERIAL_OPTIONS.map(material => (
                      <label key={material} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.materials?.includes(material)}
                          onChange={e => {
                            setFormData(prev => ({
                              ...prev,
                              materials: e.target.checked
                                ? [...(prev.materials || []), material]
                                : (prev.materials || []).filter(m => m !== material)
                            }))
                          }}
                        />
                        {material}
                      </label>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="files" className="space-y-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <FileUploadCard
                title="Main Product Image"
                file={mainImage}
                onUpload={(file) => handleFileUpload(file, 'main')}
                onRemove={() => removeFile('main')}
                required
              />

              <FileUploadCard
                title="Design Template (SVG)"
                file={designTemplate}
                onUpload={(file) => handleFileUpload(file, 'template')}
                onRemove={() => removeFile('template')}
                accept=".svg,image/*"
              />

              <FileUploadCard
                title="Mockup Front"
                file={mockupFront}
                onUpload={(file) => handleFileUpload(file, 'mockup_front')}
                onRemove={() => removeFile('mockup_front')}
              />

              <FileUploadCard
                title="Mockup Back"
                file={mockupBack}
                onUpload={(file) => handleFileUpload(file, 'mockup_back')}
                onRemove={() => removeFile('mockup_back')}
              />
            </div>

            {/* Gallery Images */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Gallery Images</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {galleryImages.map((img, index) => (
                    <div key={index} className="relative">
                      <img 
                        src={img.url} 
                        alt={`Gallery ${index + 1}`}
                        className="w-full h-24 object-cover rounded-md"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1 h-6 w-6 p-0"
                        onClick={() => removeGalleryImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                  
                  <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-md cursor-pointer hover:bg-gray-50">
                    <Plus className="h-6 w-6 text-gray-400" />
                    <span className="text-xs text-gray-500">Add Image</span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleFileUpload(file, 'gallery')
                      }}
                    />
                  </label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Product Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">{formData.name || 'Product Name'}</h3>
                    <p className="text-gray-600">{formData.description || 'No description provided'}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Price:</span> KSh {formData.base_price.toLocaleString()}
                    </div>
                    <div>
                      <span className="font-medium">Min Order:</span> {formData.min_order_quantity} pcs
                    </div>
                    <div>
                      <span className="font-medium">Category:</span> {categories.find(c => c.id === formData.category_id)?.name || 'Not selected'}
                    </div>
                  </div>

                  {formData.sizes && formData.sizes.length > 0 && (
                    <div>
                      <span className="font-medium text-sm">Sizes:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {formData.sizes.map((size, index) => (
                          <Badge key={index} variant="outline" className="text-xs">{size}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {formData.colors && formData.colors.length > 0 && (
                    <div>
                      <span className="font-medium text-sm">Colors:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {formData.colors.map((color, index) => (
                          <Badge key={index} variant="outline" className="text-xs">{color}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {mainImage && (
                    <div>
                      <span className="font-medium text-sm">Main Image:</span>
                      <img 
                        src={mainImage.url} 
                        alt="Main product"
                        className="w-48 h-48 object-cover rounded-md mt-2"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        <div className="flex justify-end">
          <Button type="submit" disabled={uploading}>
            {uploading ? 'Uploading...' : 'Upload Product'}
          </Button>
        </div>
      </form>
    </div>
  )
} 