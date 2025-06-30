"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ShoppingCart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/lib/cart-context"

export default function ClothingApparelPage() {
  const products = [
    {
      id: 1,
      name: "Custom T-Shirt (Cotton)",
      description: "100% cotton, custom printed design",
      image: "/images/products/blank-tshirt.png",
      price: 850,
      minOrder: 10,
      sizes: ["S", "M", "L", "XL", "XXL"],
    },
    {
      id: 2,
      name: "Polo Shirt",
      description: "Premium polo with embroidered logo",
      image: "/images/products/blank-polo.png",
      price: 1200,
      minOrder: 5,
      sizes: ["S", "M", "L", "XL", "XXL"],
    },
    {
      id: 3,
      name: "Hoodie/Sweatshirt",
      description: "Warm hoodie with custom print/embroidery",
      image: "/images/products/blank-hoodie.png",
      price: 2500,
      minOrder: 5,
      sizes: ["S", "M", "L", "XL", "XXL"],
    },
    {
      id: 4,
      name: "Corporate Uniform Shirt",
      description: "Professional uniform with company branding",
      image: "/images/products/blank-uniform.png",
      price: 1800,
      minOrder: 10,
      sizes: ["S", "M", "L", "XL", "XXL"],
    },
    {
      id: 5,
      name: "Tank Top/Vest",
      description: "Lightweight tank top with custom design",
      image: "/images/products/blank-tank.png",
      price: 650,
      minOrder: 10,
      sizes: ["S", "M", "L", "XL", "XXL"],
    },
    {
      id: 6,
      name: "Long Sleeve Shirt",
      description: "Long sleeve tee with custom printing",
      image: "/images/products/blank-longsleeve.png",
      price: 1100,
      minOrder: 10,
      sizes: ["S", "M", "L", "XL", "XXL"],
    },
    {
      id: 7,
      name: "Apron",
      description: "Kitchen/work apron with custom logo",
      image: "/images/products/blank-apron.png",
      price: 950,
      minOrder: 5,
      sizes: ["One Size"],
    },
    {
      id: 8,
      name: "Cap/Hat",
      description: "Baseball cap with embroidered design",
      image: "/images/products/blank-cap.png",
      price: 750,
      minOrder: 10,
      sizes: ["Adjustable"],
    },
  ]

  const { addItem } = useCart()

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Home</span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Clothing & Apparel</h1>
            <Button className="bg-blue-600 hover:bg-blue-700">Get Quote</Button>
          </div>
        </div>
      </header>

      {/* Products Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Custom Clothing & Apparel</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              High-quality custom printed and embroidered clothing for businesses, events, and personal use. All prices
              include basic single-color printing.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-0">
                  <Link href={`/design/clothing-apparel/${product.id}`}>
                    <div className="relative overflow-hidden rounded-t-lg cursor-pointer">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        width={300}
                        height={250}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <Badge className="absolute top-2 right-2 bg-green-500 hover:bg-green-500">In Stock</Badge>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                        <span className="text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          Click to Design
                        </span>
                      </div>
                    </div>
                  </Link>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{product.description}</p>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {product.sizes.map((size) => (
                        <Badge key={size} variant="outline" className="text-xs">
                          {size}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="text-2xl font-bold text-blue-600">KSh {product.price.toLocaleString()}</span>
                        <p className="text-xs text-gray-500">Min. {product.minOrder} pcs</p>
                      </div>
                    </div>

                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={() =>
                        addItem({
                          id: `clothing-${product.id}`,
                          name: product.name,
                          price: product.price,
                          minOrder: product.minOrder,
                          category: "Clothing & Apparel",
                          image: product.image,
                        })
                      }
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Quote
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
