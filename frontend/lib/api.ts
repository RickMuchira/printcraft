// lib/api.ts - Fixed API client for backend communication
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

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

  // Helper method for handling API errors
  private async handleResponse(response: Response) {
    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`
      
      try {
        const errorData = await response.json()
        errorMessage = errorData.detail || errorData.message || errorMessage
      } catch {
        // If we can't parse JSON, use the status text
        errorMessage = response.statusText || errorMessage
      }
      
      throw new Error(errorMessage)
    }
    return response.json()
  }

  // Helper method for making requests with timeout and better error handling
  private async fetchWithTimeout(url: string, options: RequestInit = {}, timeout: number = 30000) {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          ...options.headers,
        }
      })
      
      clearTimeout(timeoutId)
      return response
    } catch (error) {
      clearTimeout(timeoutId)
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timeout - please check your connection and try again')
        }
        if (error.message.includes('fetch')) {
          throw new Error('Failed to connect to server - please ensure the backend is running on http://localhost:8000')
        }
      }
      
      throw error
    }
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    const response = await this.fetchWithTimeout(`${this.baseURL}/categories/`)
    return this.handleResponse(response)
  }

  async getCategory(id: number): Promise<Category> {
    const response = await this.fetchWithTimeout(`${this.baseURL}/categories/${id}`)
    return this.handleResponse(response)
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

    const response = await this.fetchWithTimeout(`${this.baseURL}/categories/`, {
      method: 'POST',
      body: formData,
    })

    return this.handleResponse(response)
  }

  async updateCategory(
    id: number,
    name: string,
    description?: string,
    image?: File
  ): Promise<Category> {
    const formData = new FormData()
    formData.append('name', name)
    if (description) formData.append('description', description)
    if (image) formData.append('image', image)

    const response = await this.fetchWithTimeout(`${this.baseURL}/categories/${id}`, {
      method: 'PUT',
      body: formData,
    })

    return this.handleResponse(response)
  }

  async deleteCategory(id: number): Promise<{ message: string }> {
    const response = await this.fetchWithTimeout(`${this.baseURL}/categories/${id}`, {
      method: 'DELETE',
    })

    return this.handleResponse(response)
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

    const response = await this.fetchWithTimeout(`${this.baseURL}/products/?${params}`)
    return this.handleResponse(response)
  }

  async getProduct(id: number): Promise<Product> {
    const response = await this.fetchWithTimeout(`${this.baseURL}/products/${id}`)
    return this.handleResponse(response)
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
      files.gallery_images.forEach(image => {
        formData.append('gallery_images', image)
      })
    }
    
    if (files.design_template) formData.append('design_template', files.design_template)
    if (files.mockup_front) formData.append('mockup_front', files.mockup_front)
    if (files.mockup_back) formData.append('mockup_back', files.mockup_back)

    const response = await this.fetchWithTimeout(`${this.baseURL}/products/upload`, {
      method: 'POST',
      body: formData,
    }, 60000) // Longer timeout for file uploads

    return this.handleResponse(response)
  }

  async toggleProductActive(id: number): Promise<{ message: string }> {
    const response = await this.fetchWithTimeout(`${this.baseURL}/products/${id}/toggle-active`, {
      method: 'PUT',
    })

    return this.handleResponse(response)
  }

  async toggleProductFeatured(id: number): Promise<{ message: string }> {
    const response = await this.fetchWithTimeout(`${this.baseURL}/products/${id}/toggle-featured`, {
      method: 'PUT',
    })

    return this.handleResponse(response)
  }

  // Utility endpoints
  async getStats(): Promise<{
    total_categories: number
    total_products: number
    featured_products: number
    timestamp: string
  }> {
    const response = await this.fetchWithTimeout(`${this.baseURL}/stats`)
    return this.handleResponse(response)
  }

  async seedCategories(): Promise<{ message: string; categories: string[] }> {
    const response = await this.fetchWithTimeout(`${this.baseURL}/dev/seed-categories`, {
      method: 'POST',
    })

    return this.handleResponse(response)
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    const response = await this.fetchWithTimeout(`${this.baseURL.replace('/api', '')}/health`)
    return this.handleResponse(response)
  }
}

// Export singleton instance
export const api = new PrintCraftAPI()

// Export class for custom instances
export { PrintCraftAPI }