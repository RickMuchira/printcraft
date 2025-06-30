"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ShoppingCart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/lib/cart-context"

export default function StationeryPage() {
  const products = [
    {
      id: 1,
      name: "Business Cards",
      description: "Premium business cards with custom design",
      image: "/images/products/blank-businesscard.png",
      price: 15,
      minOrder: 100,
      unit: "per card",
    },
    {
      id: 2,
      name: "Notebook/Journal",
      description: "Custom cover notebook with logo",
      image: "/images/products/blank-notebook.png",
      price: 650,
      minOrder: 10,
      unit: "each",
    },
    {
      id: 3,
      name: "Calendar",
      description: "Wall or desk calendar with custom photos",
      image: "/images/products/blank-calendar.png",
      price: 850,
      minOrder: 5,
      unit: "each",
    },
    {
      id: 4,
      name: "Bookmark",
      description: "Custom printed bookmarks",
      image: "/images/products/blank-bookmark.png",
      price: 25,
      minOrder: 50,
      unit: "per piece",
    },
    {
      id: 5,
      name: "Letterhead",
      description: "Professional letterhead design",
      image: "/images/products/blank-letterhead.png",
      price: 12,
      minOrder: 100,
      unit: "per sheet",
    },
    {
      id: 6,
      name: "Envelope",
      description: "Custom printed envelopes",
      image: "/images/products/blank-envelope.png",
      price: 18,
      minOrder: 100,
      unit: "per envelope",
    },
    {
      id: 7,
      name: "Sticky Notes",
      description: "Custom branded sticky note pads",
      image: "/images/products/blank-stickynotes.png",
      price: 180,
      minOrder: 20,
      unit: "per pad",
    },
    {
      id: 8,
      name: "Brochure/Flyer",
      description: "Tri-fold brochure or single page flyer",
      image: "/images/products/blank-brochure.png",
      price: 35,
      minOrder: 50,
      unit: "per piece",
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
            <h1 className="text-2xl font-bold text-gray-900">Stationery</h1>
            <Button className="bg-blue-600 hover:bg-blue-700">Get Quote</Button>
          </div>
        </div>
      </header>

      {/* Products Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Custom Stationery & Print Materials</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Professional stationery and marketing materials to enhance your business image and communication.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-0">
                  <Link href={`/design/stationery/${product.id}`}>
                    <div className="relative overflow-hidden rounded-t-lg cursor-pointer">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        width={300}
                        height={250}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <Badge className="absolute top-2 right-2 bg-blue-500 hover:bg-blue-500">Print Ready</Badge>
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

                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="text-2xl font-bold text-blue-600">KSh {product.price}</span>
                        <p className="text-xs text-gray-500">{product.unit}</p>
                        <p className="text-xs text-gray-500">Min. {product.minOrder} pcs</p>
                      </div>
                    </div>

                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={() =>
                        addItem({
                          id: `stationery-${product.id}`,
                          name: product.name,
                          price: product.price,
                          minOrder: product.minOrder,
                          category: "Stationery",
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
