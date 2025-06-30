"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ShoppingCart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/lib/cart-context"

export default function DrinkwareKitchenPage() {
  const { addItem } = useCart()
  const products = [
    {
      id: 1,
      name: "Ceramic Coffee Mug",
      description: "11oz ceramic mug with custom printing",
      image: "/images/products/blank-mug.png",
      price: 450,
      minOrder: 12,
      capacity: "11oz",
    },
    {
      id: 2,
      name: "Stainless Steel Water Bottle",
      description: "500ml insulated bottle with logo",
      image: "/images/products/blank-bottle.png",
      price: 1800,
      minOrder: 6,
      capacity: "500ml",
    },
    {
      id: 3,
      name: "Travel Tumbler",
      description: "Insulated tumbler with lid and straw",
      image: "/images/products/blank-tumbler.png",
      price: 1200,
      minOrder: 10,
      capacity: "400ml",
    },
    {
      id: 4,
      name: "Glass Mug",
      description: "Clear glass mug with custom etching",
      image: "/images/products/blank-glass.png",
      price: 650,
      minOrder: 12,
      capacity: "12oz",
    },
    {
      id: 5,
      name: "Plastic Sports Bottle",
      description: "BPA-free sports bottle with custom print",
      image: "/images/products/blank-sportsbottle.png",
      price: 350,
      minOrder: 20,
      capacity: "750ml",
    },
    {
      id: 6,
      name: "Coaster Set",
      description: "Set of 4 custom printed coasters",
      image: "/images/products/blank-coasters.png",
      price: 800,
      minOrder: 5,
      capacity: "Set of 4",
    },
    {
      id: 7,
      name: "Thermal Flask",
      description: "1L thermal flask with custom branding",
      image: "/images/products/blank-flask.png",
      price: 2200,
      minOrder: 5,
      capacity: "1L",
    },
    {
      id: 8,
      name: "Wine Glass",
      description: "Elegant wine glass with custom etching",
      image: "/images/products/blank-wineglass.png",
      price: 750,
      minOrder: 12,
      capacity: "350ml",
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
            <h1 className="text-2xl font-bold text-gray-900">Drinkware & Kitchenware</h1>
            <Button className="bg-blue-600 hover:bg-blue-700">Get Quote</Button>
          </div>
        </div>
      </header>

      {/* Products Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Custom Drinkware & Kitchen Items</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Personalized mugs, bottles, and kitchen accessories perfect for corporate gifts, events, and promotions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-0">
                  <Link href={`/design/drinkware-kitchen/${product.id}`}>
                    <div className="relative overflow-hidden rounded-t-lg cursor-pointer">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        width={300}
                        height={250}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <Badge className="absolute top-2 right-2 bg-green-500 hover:bg-green-500">Available</Badge>
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
                      {product.capacity}
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
                          id: `drinkware-${product.id}`,
                          name: product.name,
                          price: product.price,
                          minOrder: product.minOrder,
                          category: "Drinkware & Kitchen",
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
