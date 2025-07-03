// components/cart-sidebar.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useCart } from "@/lib/cart-context"
import { ShoppingCart, X, Plus, Minus, Trash2 } from "lucide-react"
import Image from "next/image"

export function CartSidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const { items, removeItem, updateQuantity, getTotalPrice, getDesignCost, getTotalWithDesign, clearCart } = useCart()

  return (
    <>
      {/* Cart Toggle Button */}
      <div className="fixed top-1/2 right-0 transform -translate-y-1/2 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-blue-600 hover:bg-blue-700 rounded-l-lg rounded-r-none px-3 py-6 shadow-lg"
        >
          <ShoppingCart className="h-5 w-5 mr-2" />
          My Cart ({items.length})
        </Button>
      </div>

      {/* Cart Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-96 bg-white shadow-2xl transform transition-transform duration-300 z-40 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-bold text-gray-900">My Cart</h2>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Your cart is empty</p>
                <p className="text-sm text-gray-400 mt-2">Add products to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <Card key={item.id} className="p-3">
                    <div className="flex items-start space-x-3">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        width={60}
                        height={60}
                        className="rounded-md object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm text-gray-900 truncate">{item.name}</h3>
                        <Badge variant="secondary" className="text-xs mt-1">
                          {item.category}
                        </Badge>
                        <p className="text-sm font-semibold text-blue-600 mt-1">
                          KSh {item.price.toLocaleString()} each
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-2 mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= item.minOrder}
                            className="h-6 w-6 p-0"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, Number.parseInt(e.target.value) || item.minOrder)}
                            className="w-16 h-6 text-xs text-center"
                            min={item.minOrder}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="h-6 w-6 p-0"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>

                        <p className="text-xs text-gray-500 mt-1">Min. order: {item.minOrder} pcs</p>
                        <p className="text-sm font-semibold text-gray-900 mt-1">
                          Subtotal: KSh {(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Cart Summary */}
          {items.length > 0 && (
            <div className="border-t p-4 space-y-4">
              <Card className="p-4 bg-gray-50">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Products Total:</span>
                    <span>KSh {getTotalPrice().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Design Cost:</span>
                    <span>KSh {getDesignCost().toLocaleString()}</span>
                  </div>
                  <div className="text-xs text-gray-500">(KSh 500 per unique design)</div>
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>Total:</span>
                    <span className="text-blue-600">KSh {getTotalWithDesign().toLocaleString()}</span>
                  </div>
                </div>
              </Card>

              <div className="space-y-2">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">Request Quote</Button>
                <Button variant="outline" className="w-full" onClick={clearCart}>
                  Clear Cart
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-30" onClick={() => setIsOpen(false)} />}
    </>
  )
}
