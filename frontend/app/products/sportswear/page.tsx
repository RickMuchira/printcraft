"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ShoppingCart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/lib/cart-context"

export default function SportswearPage() {
  const products = [
    {
      id: 1,
      name: "Sports Jersey",
      description: "Custom team jersey with name & number",
      image: "/images/products/blank-jersey.png",
      price: 1800,
      minOrder: 10,
      sizes: ["S", "M", "L", "XL", "XXL"],
    },
    {
      id: 2,
      name: "Sports Shorts",
      description: "Athletic shorts with team logo",
      image: "/images/products/blank-shorts.png",
      price: 1200,
      minOrder: 10,
      sizes: ["S", "M", "L", "XL", "XXL"],
    },
    {
      id: 3,
      name: "Gym Bag",
      description: "Durable gym bag with custom print",
      image: "/images/products/blank-gymbag.png",
      price: 2200,
      minOrder: 5,
      sizes: ["Standard"],
    },
    {
      id: 4,
      name: "Sports Towel",
      description: "Microfiber towel with team branding",
      image: "/images/products/blank-towel.png",
      price: 650,
      minOrder: 15,
      sizes: ["30x60cm"],
    },
    {
      id: 5,
      name: "Track Suit",
      description: "Complete track suit with custom design",
      image: "/images/products/blank-tracksuit.png",
      price: 3500,
      minOrder: 5,
      sizes: ["S", "M", "L", "XL", "XXL"],
    },
    {
      id: 6,
      name: "Sports Cap",
      description: "Athletic cap with team logo",
      image: "/images/products/blank-sportscap.png",
      price: 850,
      minOrder: 10,
      sizes: ["Adjustable"],
    },
    {
      id: 7,
      name: "Compression Shirt",
      description: "Performance compression wear",
      image: "/images/products/blank-compression.png",
      price: 2200,
      minOrder: 8,
      sizes: ["S", "M", "L", "XL", "XXL"],
    },
    {
      id: 8,
      name: "Sports Socks",
      description: "Custom athletic socks",
      image: "/images/products/blank-socks.png",
      price: 450,
      minOrder: 20,
      sizes: ["S", "M", "L"],
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
            <h1 className="text-2xl font-bold text-gray-900">Sportswear</h1>
            <Button className="bg-blue-600 hover:bg-blue-700">Get Quote</Button>
          </div>
        </div>
      </header>

      {/* Products Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Custom Sportswear & Athletic Gear</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              High-performance sportswear and athletic accessories customized for teams, clubs, and individual athletes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-0">
                  <Link href={`/design/sportswear/${product.id}`}>
                    <div className="relative overflow-hidden rounded-t-lg cursor-pointer">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        width={300}
                        height={250}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <Badge className="absolute top-2 right-2 bg-green-600 hover:bg-green-600">Athletic</Badge>
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
                          id: `sportswear-${product.id}`,
                          name: product.name,
                          price: product.price,
                          minOrder: product.minOrder,
                          category: "Sportswear",
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
