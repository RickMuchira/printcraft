"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ShoppingCart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/lib/cart-context"

export default function PhoneCasesPage() {
  const products = [
    {
      id: 1,
      name: "iPhone 15 Case",
      description: "Custom printed iPhone 15 case",
      image: "/images/products/blank-iphonecase.png",
      price: 1200,
      minOrder: 5,
      compatibility: "iPhone 15",
    },
    {
      id: 2,
      name: "Samsung Galaxy S24 Case",
      description: "Custom Samsung Galaxy S24 case",
      image: "/images/products/blank-samsungcase.png",
      price: 1100,
      minOrder: 5,
      compatibility: "Galaxy S24",
    },
    {
      id: 3,
      name: "iPhone 14 Case",
      description: "Durable iPhone 14 case with custom design",
      image: "/images/products/blank-iphone14case.png",
      price: 1150,
      minOrder: 5,
      compatibility: "iPhone 14",
    },
    {
      id: 4,
      name: "Universal Phone Case",
      description: "Adjustable case for most smartphones",
      image: "/images/products/blank-universalcase.png",
      price: 950,
      minOrder: 10,
      compatibility: "Universal",
    },
    {
      id: 5,
      name: "Pop Socket",
      description: "Custom printed pop socket grip",
      image: "/images/products/blank-popsocket.png",
      price: 280,
      minOrder: 20,
      compatibility: "All phones",
    },
    {
      id: 6,
      name: "Phone Ring Holder",
      description: "Metal ring holder with custom logo",
      image: "/images/products/blank-ringholder.png",
      price: 320,
      minOrder: 15,
      compatibility: "All phones",
    },
    {
      id: 7,
      name: "Wireless Charger",
      description: "Custom branded wireless charging pad",
      image: "/images/products/blank-charger.png",
      price: 2200,
      minOrder: 3,
      compatibility: "Qi-enabled",
    },
    {
      id: 8,
      name: "Phone Stand",
      description: "Adjustable phone stand with logo",
      image: "/images/products/blank-phonestand.png",
      price: 650,
      minOrder: 10,
      compatibility: "All phones",
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
            <h1 className="text-2xl font-bold text-gray-900">Phone Cases & Accessories</h1>
            <Button className="bg-blue-600 hover:bg-blue-700">Get Quote</Button>
          </div>
        </div>
      </header>

      {/* Products Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Custom Phone Cases & Mobile Accessories</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Protect your phone in style with custom cases and accessories featuring your personal designs or brand.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-0">
                  <Link href={`/design/phone-cases/${product.id}`}>
                    <div className="relative overflow-hidden rounded-t-lg cursor-pointer">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        width={300}
                        height={250}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <Badge className="absolute top-2 right-2 bg-red-500 hover:bg-red-500">Tech</Badge>
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
                      {product.compatibility}
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
                          id: `phone-${product.id}`,
                          name: product.name,
                          price: product.price,
                          minOrder: product.minOrder,
                          category: "Phone Cases",
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
