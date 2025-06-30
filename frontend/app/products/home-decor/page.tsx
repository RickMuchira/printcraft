"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ShoppingCart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/lib/cart-context"

export default function HomeDecorPage() {
  const { addItem } = useCart()
  const products = [
    {
      id: 1,
      name: "Canvas Print",
      description: "High-quality canvas print with custom image",
      image: "/images/products/blank-canvas.png",
      price: 2500,
      minOrder: 1,
      size: "16x20 inches",
    },
    {
      id: 2,
      name: "Throw Pillow Cover",
      description: "Custom printed pillow cover",
      image: "/images/products/blank-pillow.png",
      price: 850,
      minOrder: 5,
      size: "18x18 inches",
    },
    {
      id: 3,
      name: "Wall Decal",
      description: "Removable vinyl wall decal",
      image: "/images/products/blank-decal.png",
      price: 1200,
      minOrder: 3,
      size: "24x24 inches",
    },
    {
      id: 4,
      name: "Photo Frame",
      description: "Custom wooden frame with engraving",
      image: "/images/products/blank-frame.png",
      price: 1800,
      minOrder: 2,
      size: "8x10 inches",
    },
    {
      id: 5,
      name: "Ceramic Tile",
      description: "Custom printed ceramic tile",
      image: "/images/products/blank-tile.png",
      price: 650,
      minOrder: 10,
      size: "6x6 inches",
    },
    {
      id: 6,
      name: "Wall Clock",
      description: "Custom printed wall clock",
      image: "/images/products/blank-clock.png",
      price: 2200,
      minOrder: 2,
      size: "12 inches diameter",
    },
    {
      id: 7,
      name: "Door Mat",
      description: "Custom printed welcome mat",
      image: "/images/products/blank-doormat.png",
      price: 1500,
      minOrder: 3,
      size: "24x16 inches",
    },
    {
      id: 8,
      name: "Blanket",
      description: "Soft fleece blanket with custom print",
      image: "/images/products/blank-blanket.png",
      price: 3500,
      minOrder: 2,
      size: "50x60 inches",
    },
  ]

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
            <h1 className="text-2xl font-bold text-gray-900">Home Decor</h1>
            <Button className="bg-blue-600 hover:bg-blue-700">Get Quote</Button>
          </div>
        </div>
      </header>

      {/* Products Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Custom Home Decor Items</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Transform your space with personalized home decor items. Perfect for gifts or adding a personal touch to
              your home.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-0">
                  <Link href={`/design/home-decor/${product.id}`}>
                    <div className="relative overflow-hidden rounded-t-lg cursor-pointer">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        width={300}
                        height={250}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <Badge className="absolute top-2 right-2 bg-green-500 hover:bg-green-500">Custom</Badge>
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

                    <Badge variant="outline" className="mb-3">
                      {product.size}
                    </Badge>

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
                          id: `home-decor-${product.id}`,
                          name: product.name,
                          price: product.price,
                          minOrder: product.minOrder,
                          category: "Home Decor",
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
