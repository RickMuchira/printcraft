"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ShoppingCart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/lib/cart-context"

export default function KidsBabiesPage() {
  const products = [
    {
      id: 1,
      name: "Baby Onesie",
      description: "Soft cotton onesie with cute custom design",
      image: "/images/products/blank-onesie.png",
      price: 650,
      minOrder: 10,
      sizes: ["0-3M", "3-6M", "6-12M", "12-18M"],
    },
    {
      id: 2,
      name: "Kids T-Shirt",
      description: "Comfortable kids t-shirt with fun prints",
      image: "/images/products/blank-kidstshirt.png",
      price: 750,
      minOrder: 10,
      sizes: ["2T", "3T", "4T", "5T", "6T"],
    },
    {
      id: 3,
      name: "Baby Bib",
      description: "Waterproof bib with custom design",
      image: "/images/products/blank-bib.png",
      price: 350,
      minOrder: 15,
      sizes: ["One Size"],
    },
    {
      id: 4,
      name: "Kids Hoodie",
      description: "Warm hoodie for children with custom print",
      image: "/images/products/blank-kidshoodie.png",
      price: 1800,
      minOrder: 8,
      sizes: ["2T", "3T", "4T", "5T", "6T"],
    },
    {
      id: 5,
      name: "Baby Blanket",
      description: "Soft fleece blanket with personalization",
      image: "/images/products/blank-babyblanket.png",
      price: 2200,
      minOrder: 5,
      sizes: ["75x100cm"],
    },
    {
      id: 6,
      name: "Kids Backpack",
      description: "Small backpack perfect for school",
      image: "/images/products/blank-kidsbackpack.png",
      price: 1500,
      minOrder: 8,
      sizes: ["Small"],
    },
    {
      id: 7,
      name: "Stuffed Toy",
      description: "Custom printed stuffed animal",
      image: "/images/products/blank-toy.png",
      price: 1200,
      minOrder: 10,
      sizes: ["Medium"],
    },
    {
      id: 8,
      name: "Kids Cap",
      description: "Adjustable cap for children",
      image: "/images/products/blank-kidscap.png",
      price: 550,
      minOrder: 12,
      sizes: ["Kids Size"],
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
            <h1 className="text-2xl font-bold text-gray-900">Kids & Babies</h1>
            <Button className="bg-blue-600 hover:bg-blue-700">Get Quote</Button>
          </div>
        </div>
      </header>

      {/* Products Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Custom Items for Kids & Babies</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Safe, comfortable, and adorable custom items for children and babies. Perfect for gifts, family events,
              and special occasions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-0">
                  <Link href={`/design/kids-babies/${product.id}`}>
                    <div className="relative overflow-hidden rounded-t-lg cursor-pointer">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        width={300}
                        height={250}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <Badge className="absolute top-2 right-2 bg-pink-500 hover:bg-pink-500">Kid Safe</Badge>
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
                          id: `kids-${product.id}`,
                          name: product.name,
                          price: product.price,
                          minOrder: product.minOrder,
                          category: "Kids & Babies",
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
