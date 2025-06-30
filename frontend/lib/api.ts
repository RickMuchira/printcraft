// lib/api.ts - API client for backend communication
const API_BASE_URL = 'http://localhost:8000/api'

// Types matching backend schemas
export interface Category {
  id: number
  name: string
  slug: string
  description?: string
  image_url?: string
  is_active: boolean
  created_at: string
}

export interface ProductVariant {
  color?: string
  size?: string
  material?: string
  price: number
  stock: number
  sku?: string
  image_url?: string
}

export interface Product {
  id: number
  name: string
  slug: string
  description?: string
  base_price: number
  min_order_quantity: number
  category_id: number
  sizes?: string[]
  colors?: string[]
  materials?: string[]
  main_image_url?: string
  gallery_images?: string[]
  design_template_url?: string
  mockup_templates?: { front?: string; back?: string }
  print_areas?: PrintArea[]
  customization_options?: Record<string, any>
  is_active: boolean
  is_featured: boolean
  created_at: string
  category: Category
  variants?: ProductVariant[]
}

export interface PrintArea {
  name: string
  x: number
  y: number
  width: number
  height: number
}

export interface ProductUploadData {
  name: string
  description?: string
  base_price: number
  min_order_quantity: number
  category_id: number
  sizes?: string[]
  colors?: string[]
  materials?: string[]
  customization_options?: Record<string, any>
  print_areas?: PrintArea[]
  variants?: ProductVariant[]
}

export interface FileUploadResponse {
  filename: string
  url: string
  size: number
}

// API Functions
class PrintCraftAPI {
  private baseURL: string

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    const response = await fetch(`${this.baseURL}/categories/`)
    if (!response.ok) throw new Error('Failed to fetch categories')
    return response.json()
  }

  async getCategory(id: number): Promise<Category> {
    const response = await fetch(`${this.baseURL}/categories/${id}`)
    if (!response.ok) throw new Error('Failed to fetch category')
    return response.json()
  }

  async createCategory(
    name: string,
    description?: string,
    image?: File
  ): Promise<Category> {
    const formData = new FormData()
    formData.append('name', name)
    if (description) formData.append('description', description)
    if (image) formData.append('image', image)

    const response = await fetch(`${this.baseURL}/categories/`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) throw new Error('Failed to create category')
    return response.json()
  }

  // Products
  async getProducts(filters?: {
    category_id?: number
    is_active?: boolean
    skip?: number
    limit?: number
  }): Promise<Product[]> {
    const params = new URLSearchParams()
    if (filters?.category_id) params.append('category_id', filters.category_id.toString())
    if (filters?.is_active !== undefined) params.append('is_active', filters.is_active.toString())
    if (filters?.skip) params.append('skip', filters.skip.toString())
    if (filters?.limit) params.append('limit', filters.limit.toString())

    const response = await fetch(`${this.baseURL}/products/?${params}`)
    if (!response.ok) throw new Error('Failed to fetch products')
    return response.json()
  }

  async getProduct(id: number): Promise<Product> {
    const response = await fetch(`${this.baseURL}/products/${id}`)
    if (!response.ok) throw new Error('Failed to fetch product')
    return response.json()
  }

  async uploadProduct(
    productData: ProductUploadData,
    files: {
      main_image: File
      gallery_images?: File[]
      design_template?: File
      mockup_front?: File
      mockup_back?: File
    }
  ): Promise<Product> {
    const formData = new FormData()

    // Add product data
    formData.append('name', productData.name)
    if (productData.description) formData.append('description', productData.description)
    formData.append('base_price', productData.base_price.toString())
    formData.append('min_order_quantity', productData.min_order_quantity.toString())
    formData.append('category_id', productData.category_id.toString())

    // Add JSON arrays as strings
    if (productData.sizes) formData.append('sizes', JSON.stringify(productData.sizes))
    if (productData.colors) formData.append('colors', JSON.stringify(productData.colors))
    if (productData.materials) formData.append('materials', JSON.stringify(productData.materials))
    if (productData.customization_options) {
      formData.append('customization_options', JSON.stringify(productData.customization_options))
    }
    if (productData.print_areas) formData.append('print_areas', JSON.stringify(productData.print_areas))
    if (productData.variants) formData.append('variants', JSON.stringify(productData.variants))

    // Add files
    formData.append('main_image', files.main_image)
    
    if (files.gallery_images) {
      files.gallery_images.forEach(file => formData.append('gallery_images', file))
    }
    
    if (files.design_template) formData.append('design_template', files.design_template)
    if (files.mockup_front) formData.append('mockup_front', files.mockup_front)
    if (files.mockup_back) formData.append('mockup_back', files.mockup_back)

    const response = await fetch(`${this.baseURL}/products/upload`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.detail || 'Failed to upload product')
    }

    return response.json()
  }

  async toggleProductActive(id: number): Promise<{ message: string }> {
    const response = await fetch(`${this.baseURL}/products/${id}/toggle-active`, {
      method: 'PUT',
    })
    if (!response.ok) throw new Error('Failed to toggle product status')
    return response.json()
  }

  async toggleProductFeatured(id: number): Promise<{ message: string }> {
    const response = await fetch(`${this.baseURL}/products/${id}/toggle-featured`, {
      method: 'PUT',
    })
    if (!response.ok) throw new Error('Failed to toggle product featured status')
    return response.json()
  }

  // Utility
  async getStats(): Promise<{
    total_categories: number
    total_products: number
    featured_products: number
    timestamp: string
  }> {
    const response = await fetch(`${this.baseURL}/stats`)
    if (!response.ok) throw new Error('Failed to fetch stats')
    return response.json()
  }

  async seedCategories(): Promise<{ message: string; categories: string[] }> {
    const response = await fetch(`${this.baseURL}/dev/seed-categories`, {
      method: 'POST',
    })
    if (!response.ok) throw new Error('Failed to seed categories')
    return response.json()
  }
}

export const api = new PrintCraftAPI()

// Hook for using the API with React Query (optional but recommended)
export const useAPI = () => {
  return api
} 