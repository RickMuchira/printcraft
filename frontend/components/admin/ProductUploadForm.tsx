// components/admin/ProductUploadForm.tsx
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
import { Upload, X, Plus, Trash2, Loader2, ArrowRight, ArrowLeft, Image, CheckCircle, AlertCircle } from 'lucide-react'
import { api, Category, ProductUploadData } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'

interface FilePreview {
  file: File
  url: string
}

interface ProductVariant {
  color: string
  size: string
  material: string
  price: number
  stock: number
  sku: string
}

const SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const COLOR_OPTIONS = ['Red', 'Blue', 'Green', 'Black', 'White', 'Yellow', 'Orange', 'Purple', 'Pink', 'Gray'];
const MATERIAL_OPTIONS = ['100% Cotton', 'Polyester', 'Cotton Blend', 'Premium Cotton', 'Organic Cotton'];

export default function ProductUploadForm({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const { toast } = useToast()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)

  // Form data
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category_id: 0,
  })

  // Product specifications
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([])

  // Images
  const [mainImage, setMainImage] = useState<FilePreview | null>(null)
  const [mockupFront, setMockupFront] = useState<FilePreview | null>(null)
  const [mockupBack, setMockupBack] = useState<FilePreview | null>(null)

  // Variants (simplified)
  const [variants, setVariants] = useState<ProductVariant[]>([])

  // Load categories on mount
  useEffect(() => {
    loadCategories()
  }, [])

  // Auto-generate variants when specifications change
  useEffect(() => {
    if (selectedColors.length > 0 && selectedSizes.length > 0 && selectedMaterials.length > 0) {
      generateVariants()
    }
  }, [selectedColors, selectedSizes, selectedMaterials])

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

  const generateVariants = () => {
    const newVariants: ProductVariant[] = []
    
    selectedColors.forEach(color => {
      selectedSizes.forEach(size => {
        selectedMaterials.forEach(material => {
          newVariants.push({
            color,
            size,
            material,
            price: 0,
            stock: 0,
            sku: `${formData.name.replace(/\s+/g, '-').toLowerCase()}-${color.toLowerCase()}-${size.toLowerCase()}-${material.toLowerCase()}`
          })
        })
      })
    })
    
    setVariants(newVariants)
  }

  const updateVariant = (index: number, field: keyof ProductVariant, value: any) => {
    setVariants(prev => prev.map((variant, i) => 
      i === index ? { ...variant, [field]: value } : variant
    ))
  }

  const removeVariant = (index: number) => {
    setVariants(prev => prev.filter((_, i) => i !== index))
        }

  const handleImageUpload = (file: File, type: 'mainImage' | 'mockupFront' | 'mockupBack') => {
    const url = URL.createObjectURL(file)
    const preview = { file, url }

    // Clean up old image URL
    if (type === 'mainImage' && mainImage) URL.revokeObjectURL(mainImage.url)
    if (type === 'mockupFront' && mockupFront) URL.revokeObjectURL(mockupFront.url)
    if (type === 'mockupBack' && mockupBack) URL.revokeObjectURL(mockupBack.url)

    if (type === 'mainImage') setMainImage(preview)
    if (type === 'mockupFront') setMockupFront(preview)
    if (type === 'mockupBack') setMockupBack(preview)
  }

  const removeImage = (type: 'mainImage' | 'mockupFront' | 'mockupBack') => {
    if (type === 'mainImage' && mainImage) {
      URL.revokeObjectURL(mainImage.url)
      setMainImage(null)
    }
    if (type === 'mockupFront' && mockupFront) {
      URL.revokeObjectURL(mockupFront.url)
      setMockupFront(null)
    }
    if (type === 'mockupBack' && mockupBack) {
      URL.revokeObjectURL(mockupBack.url)
      setMockupBack(null)
    }
  }

  // Validation for each step
  const getStepValidation = (step: number) => {
    switch (step) {
      case 1:
        return {
          isValid: formData.name && formData.category_id,
          missing: []
        }
      case 2:
        const missing = []
        if (selectedSizes.length === 0) missing.push('sizes')
        if (selectedColors.length === 0) missing.push('colors')
        if (selectedMaterials.length === 0) missing.push('materials')
        return {
          isValid: selectedSizes.length > 0 && selectedColors.length > 0 && selectedMaterials.length > 0,
          missing
        }
      case 3:
        const imageMissing = []
        if (!mainImage) imageMissing.push('main image')
        if (!mockupFront) imageMissing.push('front mockup')
        if (!mockupBack) imageMissing.push('back mockup')
        return {
          isValid: mainImage && mockupFront && mockupBack,
          missing: imageMissing
        }
      case 4:
        const invalidVariants = variants.filter(v => v.price <= 0 || v.stock < 0)
        return {
          isValid: variants.length > 0 && invalidVariants.length === 0,
          missing: invalidVariants.length > 0 ? ['variant prices/stock'] : []
        }
      default:
        return { isValid: false, missing: [] }
    }
  }

  const canProceedToStep = (step: number) => {
    return getStepValidation(step).isValid
  }

  // Handle form submission
  const handleSubmit = async () => {
    const validation = getStepValidation(4)
    if (!validation.isValid) {
      toast({
        title: "Error",
        description: "Please complete all required fields",
        variant: "destructive"
      })
      return
    }

    try {
      setUploading(true)

      // Calculate base price (lowest price among all variants)
      const allPrices = variants.map(v => v.price).filter(price => price > 0)
      const basePrice = allPrices.length > 0 ? Math.min(...allPrices) : 0

      const productData: ProductUploadData = {
        name: formData.name,
        description: formData.description,
        base_price: basePrice,
        min_order_quantity: 1,
        category_id: formData.category_id,
        sizes: selectedSizes,
        colors: selectedColors,
        materials: selectedMaterials,
        variants
      }

      const files = {
        main_image: mainImage!.file,
        mockup_front: mockupFront!.file,
        mockup_back: mockupBack!.file,
      }

      const result = await api.uploadProduct(productData, files)

      toast({
        title: "Success",
        description: `Product "${result.name}" uploaded successfully!`,
      })

      // Reset form
      setFormData({ name: '', description: '', category_id: 0 })
      setSelectedSizes([])
      setSelectedColors([])
      setSelectedMaterials([])
      setVariants([])
      
      // Clean up image URLs
      if (mainImage) URL.revokeObjectURL(mainImage.url)
      if (mockupFront) URL.revokeObjectURL(mockupFront.url)
      if (mockupBack) URL.revokeObjectURL(mockupBack.url)
      setMainImage(null)
      setMockupFront(null)
      setMockupBack(null)
      
      setCurrentStep(1)

      // Redirect to products list if onNavigate is provided
      if (onNavigate) {
        onNavigate('products');
      }

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

  const ImageUploadCard = ({ 
    title, 
    file, 
    onUpload, 
    onRemove, 
    required = false 
  }: {
    title: string
    file: FilePreview | null
    onUpload: (file: File) => void
    onRemove: () => void
    required?: boolean
  }) => (
    <Card className="h-48">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">
          {title} {required && <span className="text-red-500">*</span>}
        </CardTitle>
      </CardHeader>
      <CardContent className="h-32">
        {file ? (
          <div className="relative h-full">
            <img 
              src={file.url} 
              alt={title}
              className="w-full h-full object-cover rounded-md"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-1 right-1"
              onClick={onRemove}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed rounded-md cursor-pointer hover:bg-gray-50">
            <Upload className="h-6 w-6 text-gray-400 mb-1" />
            <span className="text-xs text-gray-500 text-center">Click to upload</span>
            <input
              type="file"
              className="hidden"
              accept="image/*"
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

  const StepIndicator = () => {
    const steps = [
      { number: 1, title: 'Basic Info' },
      { number: 2, title: 'Specifications' },
      { number: 3, title: 'Images' },
      { number: 4, title: 'Variants & Pricing' }
    ]

    return (
      <div className="mb-8">
          <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const validation = getStepValidation(step.number)
            const isCompleted = currentStep > step.number
            const isCurrent = currentStep === step.number
            
                return (
              <div key={step.number} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                  isCompleted ? 'bg-green-500 text-white' :
                  isCurrent ? 'bg-blue-500 text-white' : 
                  'bg-gray-200 text-gray-600'
                }`}>
                  {isCompleted ? <CheckCircle className="h-5 w-5" /> : step.number}
                </div>
                <div className="ml-3">
                  <span className="font-medium text-sm">
                    {step.title}
                  </span>
                  {isCurrent && !validation.isValid && validation.missing.length > 0 && (
                    <div className="text-xs text-red-500 mt-1">
                      Missing: {validation.missing.join(', ')}
            </div>
          )}
          </div>
                {index < steps.length - 1 && (
                  <ArrowRight className="h-4 w-4 mx-4 text-gray-400" />
                )}
            </div>
            )
          })}
            </div>
          </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Upload New Product</h1>

      <StepIndicator />

      {/* Step 1: Basic Information */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 1: Basic Product Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Premium Cotton T-Shirt"
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
                placeholder="Describe your product..."
              />
            </div>

            <div>
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category_id?.toString() || ""}
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

            <div className="flex justify-end">
              <Button
                onClick={() => setCurrentStep(2)}
                disabled={!canProceedToStep(1)}
              >
                Next: Product Specifications
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Product Specifications */}
      {currentStep === 2 && (
          <Card>
            <CardHeader>
            <CardTitle>Step 2: Product Specifications</CardTitle>
              <p className="text-sm text-gray-600">
              Select the sizes, colors, and materials available for this product.
              </p>
            </CardHeader>
          <CardContent className="space-y-6">
            {/* Sizes */}
            <div>
              <Label className="text-sm font-medium">Available Sizes *</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {SIZE_OPTIONS.map(size => (
                  <label key={size} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedSizes.includes(size)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedSizes(prev => [...prev, size])
                        } else {
                          setSelectedSizes(prev => prev.filter(s => s !== size))
                        }
                      }}
                    />
                    <span className="text-sm">{size}</span>
                  </label>
                ))}
              </div>
              </div>

            {/* Colors */}
            <div>
              <Label className="text-sm font-medium">Available Colors *</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {COLOR_OPTIONS.map(color => (
                  <label key={color} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedColors.includes(color)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedColors(prev => [...prev, color])
                        } else {
                          setSelectedColors(prev => prev.filter(c => c !== color))
                        }
                      }}
                    />
                    <div 
                      className="w-4 h-4 rounded-full border border-gray-300"
                      style={{backgroundColor: color.toLowerCase()}}
                    ></div>
                    <span className="text-sm">{color}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Materials */}
            <div>
              <Label className="text-sm font-medium">Available Materials *</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {MATERIAL_OPTIONS.map(material => (
                  <label key={material} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedMaterials.includes(material)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedMaterials(prev => [...prev, material])
                        } else {
                          setSelectedMaterials(prev => prev.filter(m => m !== material))
                        }
                      }}
                    />
                    <span className="text-sm">{material}</span>
                  </label>
                ))}
              </div>
                </div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(1)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button
              onClick={() => setCurrentStep(3)}
              disabled={!canProceedToStep(2)}
            >
                Next: Upload Images
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Images */}
      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 3: Product Images</CardTitle>
            <p className="text-sm text-gray-600">
              Upload high-quality images for your product. These will be used for the product listing.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <ImageUploadCard
                title="Main Product Image"
                file={mainImage}
                onUpload={(file) => handleImageUpload(file, 'mainImage')}
                onRemove={() => removeImage('mainImage')}
                required
              />
              <ImageUploadCard
                title="Front Mockup"
                file={mockupFront}
                onUpload={(file) => handleImageUpload(file, 'mockupFront')}
                onRemove={() => removeImage('mockupFront')}
                required
              />
              <ImageUploadCard
                title="Back Mockup"
                file={mockupBack}
                onUpload={(file) => handleImageUpload(file, 'mockupBack')}
                onRemove={() => removeImage('mockupBack')}
                required
              />
            </div>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(2)}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button
                onClick={() => setCurrentStep(4)}
                disabled={!canProceedToStep(3)}
              >
                Next: Variants & Pricing
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Variants & Pricing */}
      {currentStep === 4 && (
          <Card>
            <CardHeader>
            <CardTitle>Step 4: Variants & Pricing</CardTitle>
              <p className="text-sm text-gray-600">
              Set prices and stock quantities for each product variant. {variants.length} variants will be created.
              </p>
            </CardHeader>
          <CardContent className="space-y-6">
            {variants.length > 0 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-6 gap-4 font-medium text-sm text-gray-600 border-b pb-2">
                  <div>Color</div>
                  <div>Size</div>
                  <div>Material</div>
                  <div>Price ($)</div>
                  <div>Stock</div>
                  <div>Actions</div>
                </div>

                {variants.map((variant, index) => (
                  <div key={index} className="grid grid-cols-6 gap-4 items-center p-3 bg-gray-50 rounded">
                    <div className="flex items-center gap-2">
                          <div 
                            className="w-4 h-4 rounded-full border"
                            style={{backgroundColor: variant.color.toLowerCase()}}
                          ></div>
                      <span className="text-sm">{variant.color}</span>
                        </div>
                    <div className="text-sm">{variant.size}</div>
                    <div className="text-sm">{variant.material}</div>
                    <Input
                      type="number"
                      step="0.01"
                      value={variant.price}
                      onChange={(e) => updateVariant(index, 'price', parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                      className="h-8"
                    />
                    <Input
                      type="number"
                      value={variant.stock}
                      onChange={(e) => updateVariant(index, 'stock', parseInt(e.target.value) || 0)}
                      placeholder="0"
                      className="h-8"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeVariant(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                          </div>
                        ))}
                      </div>
            ) : (
              <div className="text-center py-12 text-gray-500 border-2 border-dashed rounded-lg">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>No variants generated. Please go back and select sizes, colors, and materials.</p>
              </div>
            )}

          <div className="flex justify-between">
            <Button
              variant="outline"
                onClick={() => setCurrentStep(3)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button
              onClick={handleSubmit}
                disabled={uploading || !canProceedToStep(4)}
            >
              {uploading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {uploading ? 'Uploading...' : 'Upload Product'}
            </Button>
          </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}