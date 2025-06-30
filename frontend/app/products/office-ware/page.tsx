"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ShoppingCart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/lib/cart-context"

export default function OfficeWarePage() {
  const products = [
    {
      id: 1,
      name: "Desk Name Plate",
      description: "Professional acrylic name plate",
      image: "/images/products/blank-nameplate.png",
      price: 850,
      minOrder: 2,
      material: "Acrylic",
    },
    {
      id: 2,
      name: "Mouse Pad",
      description: "Custom printed mouse pad",
      image: "/images/products/blank-mousepad.png",
      price: 350,
      minOrder: 10,
      material: "Rubber base",
    },
    {
      id: 3,
      name: "Desk Organizer",
      description: "Wooden desk organizer with logo",
      image: "/images/products/blank-organizer.png",
      price: 1800,
      minOrder: 5,
      material: "Wood",
    },
    {
      id: 4,
      name: "File Folder",
      description: "Custom branded file folders",
      image: "/images/products/blank-folder.png",
      price: 120,
      minOrder: 25,
      material: "Cardboard",
    },
    {
      id: 5,
      name: "Pen Holder",
      description: "Personalized pen/pencil holder",
      image: "/images/products/blank-penholder.png",
      price: 650,
      minOrder: 10,
      material: "Plastic/Wood",
    },
    {
      id: 6,
      name: "Wall Planner",
      description: "Large wall planner with custom header",
      image: "/images/products/blank-planner.png",
      price: 1200,
      minOrder: 3,
      material: "Laminated",
    },
    {
      id: 7,
      name: "ID Badge Holder",
      description: "Custom ID badge holder with lanyard",
      image: "/images/products/blank-idbadge.png",
      price: 180,
      minOrder: 20,
      material: "Plastic",
    },
    {
      id: 8,
      name: "Clipboard",
      description: "Custom branded clipboard",
      image: "/images/products/blank-clipboard.png",
      price: 450,
      minOrder: 10,
      material: "Hardboard",
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
            <h1 className="text-2xl font-bold text-gray-900">Office Ware</h1>
            <Button className="bg-blue-600 hover:bg-blue-700">Get Quote</Button>
          </div>
        </div>
      </header>

      {/* Products Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Custom Office Supplies & Accessories</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Professional office items to enhance productivity and showcase your brand in the workplace.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-0">
                  <Link href={`/design/office-ware/${product.id}`}>
                    <div className="relative overflow-hidden rounded-t-lg cursor-pointer">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        width={300}
                        height={250}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <Badge className="absolute top-2 right-2 bg-purple-500 hover:bg-purple-500">Professional</Badge>
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
                          id: `office-${product.id}`,
                          name: product.name,
                          price: product.price,
                          minOrder: product.minOrder,
                          category: "Office Ware",
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
