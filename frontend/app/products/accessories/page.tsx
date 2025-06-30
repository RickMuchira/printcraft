"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ShoppingCart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/lib/cart-context"

export default function AccessoriesPage() {
  const products = [
    {
      id: 1,
      name: "Tote Bag",
      description: "Canvas tote bag with custom print",
      image: "/images/products/blank-totebag.png",
      price: 850,
      minOrder: 10,
      material: "Canvas",
    },
    {
      id: 2,
      name: "Keychain",
      description: "Metal keychain with custom engraving",
      image: "/images/products/blank-keychain.png",
      price: 180,
      minOrder: 25,
      material: "Metal",
    },
    {
      id: 3,
      name: "Badge/Pin",
      description: "Custom enamel pin or badge",
      image: "/images/products/blank-badge.png",
      price: 220,
      minOrder: 20,
      material: "Enamel",
    },
    {
      id: 4,
      name: "Lanyard",
      description: "Custom printed lanyard with clip",
      image: "/images/products/blank-lanyard.png",
      price: 150,
      minOrder: 25,
      material: "Polyester",
    },
    {
      id: 5,
      name: "Wristband",
      description: "Silicone wristband with custom text",
      image: "/images/products/blank-wristband.png",
      price: 120,
      minOrder: 50,
      material: "Silicone",
    },
    {
      id: 6,
      name: "Backpack",
      description: "Custom printed backpack",
      image: "/images/products/blank-backpack.png",
      price: 2800,
      minOrder: 5,
      material: "Polyester",
    },
    {
      id: 7,
      name: "Wallet",
      description: "Leather wallet with custom embossing",
      image: "/images/products/blank-wallet.png",
      price: 1800,
      minOrder: 5,
      material: "Leather",
    },
    {
      id: 8,
      name: "Umbrella",
      description: "Custom printed umbrella",
      image: "/images/products/blank-umbrella.png",
      price: 1500,
      minOrder: 10,
      material: "Polyester",
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
            <h1 className="text-2xl font-bold text-gray-900">Accessories</h1>
            <Button className="bg-blue-600 hover:bg-blue-700">Get Quote</Button>
          </div>
        </div>
      </header>

      {/* Products Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Custom Accessories & Promotional Items</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Stylish accessories and promotional items perfect for events, marketing campaigns, and corporate gifts.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-0">
                  <Link href={`/design/accessories/${product.id}`}>
                    <div className="relative overflow-hidden rounded-t-lg cursor-pointer">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        width={300}
                        height={250}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <Badge className="absolute top-2 right-2 bg-orange-500 hover:bg-orange-500">Promo</Badge>
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
                      {product.material}
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
                          id: `accessories-${product.id}`,
                          name: product.name,
                          price: product.price,
                          minOrder: product.minOrder,
                          category: "Accessories",
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
