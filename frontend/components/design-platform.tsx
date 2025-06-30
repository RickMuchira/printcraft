"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Type,
  Square,
  Circle,
  ImageIcon,
  Palette,
  Download,
  Save,
  Undo,
  Redo,
  Trash2,
  Move,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface DesignPlatformProps {
  category: string
  productId: string
}

interface DesignElement {
  id: string
  type: "text" | "shape" | "image"
  x: number
  y: number
  width: number
  height: number
  content?: string
  color?: string
  fontSize?: number
  rotation?: number
}

export function DesignPlatform({ category, productId }: DesignPlatformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedTool, setSelectedTool] = useState<string>("select")
  const [elements, setElements] = useState<DesignElement[]>([])
  const [selectedElement, setSelectedElement] = useState<string | null>(null)
  const [productSize, setProductSize] = useState("M")
  const [mockupMode, setMockupMode] = useState<"realistic" | "bright">("realistic")
  const [mockupBackground, setMockupBackground] = useState<"white" | "custom">("white")
  const [customBackground, setCustomBackground] = useState<string>("")

  // Product data based on category and productId
  const getProductData = () => {
    const products = {
      "clothing-apparel": {
        "1": {
          name: "Custom T-Shirt",
          image: "/images/products/blank-tshirt.png",
          mockupFront: "/images/mockups/tshirt-front.png",
          mockupBack: "/images/mockups/tshirt-back.png",
          sizes: ["XS", "S", "M", "L", "XL", "XXL"],
        },
        "2": {
          name: "Polo Shirt",
          image: "/images/products/blank-polo.png",
          mockupFront: "/images/mockups/polo-front.png",
          mockupBack: "/images/mockups/polo-back.png",
          sizes: ["S", "M", "L", "XL", "XXL"],
        },
      },
      "drinkware-kitchen": {
        "1": {
          name: "Ceramic Coffee Mug",
          image: "/images/products/blank-mug.png",
          mockupFront: "/images/mockups/mug-front.png",
          mockupBack: "/images/mockups/mug-back.png",
          sizes: ["11oz", "15oz"],
        },
      },
    }

    return (
      products[category as keyof typeof products]?.[productId] || {
        name: "Custom Product",
        image: "/placeholder.svg",
        mockupFront: "/placeholder.svg",
        mockupBack: "/placeholder.svg",
        sizes: ["S", "M", "L"],
      }
    )
  }

  const product = getProductData()

  // Update these functions to position elements within the design area:

  const addTextElement = () => {
    // Get design area bounds based on product type
    const designBounds = getDesignAreaBounds()

    const newElement: DesignElement = {
      id: Date.now().toString(),
      type: "text",
      x: designBounds.x + 20,
      y: designBounds.y + 20,
      width: Math.min(200, designBounds.width - 40),
      height: 50,
      content: "Your Text Here",
      color: "#000000",
      fontSize: 24,
      rotation: 0,
    }
    setElements([...elements, newElement])
    setSelectedElement(newElement.id)
  }

  const addShapeElement = (shapeType: "rectangle" | "circle") => {
    const designBounds = getDesignAreaBounds()

    const newElement: DesignElement = {
      id: Date.now().toString(),
      type: "shape",
      x: designBounds.x + 30,
      y: designBounds.y + 30,
      width: Math.min(100, designBounds.width - 60),
      height: Math.min(100, designBounds.height - 60),
      color: "#ff0000",
      content: shapeType,
      rotation: 0,
    }
    setElements([...elements, newElement])
    setSelectedElement(newElement.id)
  }

  // Add this helper function to get design area bounds for each product type:
  const getDesignAreaBounds = () => {
    switch (category) {
      case "clothing-apparel":
        return { x: 0, y: 0, width: 100, height: 120 }
      case "drinkware-kitchen":
        return { x: 0, y: 0, width: 80, height: 100 }
      case "phone-cases":
        return { x: 0, y: 0, width: 100, height: 160 }
      case "accessories":
        return { x: 0, y: 0, width: 120, height: 120 }
      case "home-decor":
        return { x: 0, y: 0, width: 240, height: 160 }
      case "stationery":
        return { x: 0, y: 0, width: 270, height: 70 }
      case "office-ware":
        return { x: 0, y: 0, width: 200, height: 100 }
      case "sportswear":
        return { x: 0, y: 0, width: 120, height: 150 }
      case "kids-babies":
        return { x: 0, y: 0, width: 80, height: 80 }
      default:
        return { x: 0, y: 0, width: 200, height: 100 }
    }
  }

  const deleteElement = (id: string) => {
    setElements(elements.filter((el) => el.id !== id))
    setSelectedElement(null)
  }

  const updateElement = (id: string, updates: Partial<DesignElement>) => {
    setElements(elements.map((el) => (el.id === id ? { ...el, ...updates } : el)))
  }

  const downloadMockup = () => {
    // Create a temporary canvas for the mockup
    const canvas = document.createElement("canvas")
    canvas.width = 800
    canvas.height = 600
    const ctx = canvas.getContext("2d")

    if (ctx) {
      // Draw white background
      ctx.fillStyle = mockupBackground === "white" ? "#ffffff" : customBackground
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Add mockup content here
      ctx.fillStyle = "#333"
      ctx.font = "20px Arial"
      ctx.fillText("Mockup Preview", 50, 50)

      // Download the canvas as image
      const link = document.createElement("a")
      link.download = `${product.name}-mockup.png`
      link.href = canvas.toDataURL()
      link.click()
    }
  }

  const saveDesign = () => {
    const designData = {
      product: product.name,
      elements,
      size: productSize,
      mockupMode,
      background: mockupBackground,
    }
    localStorage.setItem("saved-design", JSON.stringify(designData))
    alert("Design saved successfully!")
  }

  const renderProductCanvas = () => {
    const baseScale = product.sizes.indexOf(productSize) * 0.1 + 0.8 // Scale based on size

    // T-Shirt and Clothing Canvas
    if (category === "clothing-apparel") {
      return (
        <div className="relative">
          <svg
            width={300 * baseScale}
            height={350 * baseScale}
            viewBox="0 0 300 350"
            className="border-2 border-dashed border-gray-300"
          >
            {/* T-shirt shape */}
            <path
              d="M75 50 L75 30 Q75 20 85 20 L215 20 Q225 20 225 30 L225 50 L275 80 L275 120 L225 100 L225 330 Q225 340 215 340 L85 340 Q75 340 75 330 L75 100 L25 120 L25 80 Z"
              fill="white"
              stroke="#e5e7eb"
              strokeWidth="2"
            />
            {/* Design area indicator */}
            <rect
              x="100"
              y="80"
              width="100"
              height="120"
              fill="rgba(59, 130, 246, 0.1)"
              stroke="rgba(59, 130, 246, 0.3)"
              strokeDasharray="5,5"
            />
            <text x="150" y="145" textAnchor="middle" className="text-xs fill-gray-400">
              Design Area
            </text>
          </svg>

          {/* Render design elements within t-shirt bounds */}
          {elements.map((element) => (
            <div
              key={element.id}
              className={`absolute cursor-pointer border-2 ${
                selectedElement === element.id ? "border-blue-500" : "border-transparent"
              }`}
              style={{
                left: (100 + element.x) * baseScale,
                top: (80 + element.y) * baseScale,
                width: element.width * baseScale,
                height: element.height * baseScale,
                transform: `rotate(${element.rotation || 0}deg)`,
              }}
              onClick={() => setSelectedElement(element.id)}
            >
              {renderElement(element, baseScale)}
            </div>
          ))}
        </div>
      )
    }

    // Mug Canvas
    if (category === "drinkware-kitchen") {
      return (
        <div className="relative">
          <svg
            width={250 * baseScale}
            height={300 * baseScale}
            viewBox="0 0 250 300"
            className="border-2 border-dashed border-gray-300"
          >
            {/* Mug shape */}
            <path
              d="M50 80 Q50 70 60 70 L160 70 Q170 70 170 80 L170 250 Q170 270 150 270 L80 270 Q60 270 60 250 Z"
              fill="white"
              stroke="#e5e7eb"
              strokeWidth="2"
            />
            {/* Mug handle */}
            <path
              d="M170 120 Q200 120 200 150 L200 180 Q200 210 170 210"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="8"
            />
            {/* Design area */}
            <rect
              x="70"
              y="100"
              width="80"
              height="100"
              fill="rgba(59, 130, 246, 0.1)"
              stroke="rgba(59, 130, 246, 0.3)"
              strokeDasharray="5,5"
            />
            <text x="110" y="155" textAnchor="middle" className="text-xs fill-gray-400">
              Design Area
            </text>
          </svg>

          {elements.map((element) => (
            <div
              key={element.id}
              className={`absolute cursor-pointer border-2 ${
                selectedElement === element.id ? "border-blue-500" : "border-transparent"
              }`}
              style={{
                left: (70 + element.x) * baseScale,
                top: (100 + element.y) * baseScale,
                width: element.width * baseScale,
                height: element.height * baseScale,
                transform: `rotate(${element.rotation || 0}deg)`,
              }}
              onClick={() => setSelectedElement(element.id)}
            >
              {renderElement(element, baseScale)}
            </div>
          ))}
        </div>
      )
    }

    // Phone Case Canvas
    if (category === "phone-cases") {
      return (
        <div className="relative">
          <svg
            width={180 * baseScale}
            height={320 * baseScale}
            viewBox="0 0 180 320"
            className="border-2 border-dashed border-gray-300"
          >
            {/* Phone case shape */}
            <rect
              x="20"
              y="20"
              width="140"
              height="280"
              rx="25"
              ry="25"
              fill="white"
              stroke="#e5e7eb"
              strokeWidth="2"
            />
            {/* Camera cutout */}
            <rect x="30" y="30" width="40" height="25" rx="8" ry="8" fill="#f3f4f6" stroke="#d1d5db" />
            {/* Design area */}
            <rect
              x="40"
              y="80"
              width="100"
              height="160"
              fill="rgba(59, 130, 246, 0.1)"
              stroke="rgba(59, 130, 246, 0.3)"
              strokeDasharray="5,5"
            />
            <text x="90" y="165" textAnchor="middle" className="text-xs fill-gray-400">
              Design Area
            </text>
          </svg>

          {elements.map((element) => (
            <div
              key={element.id}
              className={`absolute cursor-pointer border-2 ${
                selectedElement === element.id ? "border-blue-500" : "border-transparent"
              }`}
              style={{
                left: (40 + element.x) * baseScale,
                top: (80 + element.y) * baseScale,
                width: element.width * baseScale,
                height: element.height * baseScale,
                transform: `rotate(${element.rotation || 0}deg)`,
              }}
              onClick={() => setSelectedElement(element.id)}
            >
              {renderElement(element, baseScale)}
            </div>
          ))}
        </div>
      )
    }

    // Tote Bag Canvas
    if (category === "accessories") {
      return (
        <div className="relative">
          <svg
            width={280 * baseScale}
            height={320 * baseScale}
            viewBox="0 0 280 320"
            className="border-2 border-dashed border-gray-300"
          >
            {/* Bag shape */}
            <path
              d="M40 80 L240 80 L220 300 Q220 310 210 310 L70 310 Q60 310 60 300 Z"
              fill="white"
              stroke="#e5e7eb"
              strokeWidth="2"
            />
            {/* Bag handles */}
            <path d="M80 80 Q80 40 100 40 L120 40 Q140 40 140 80" fill="none" stroke="#e5e7eb" strokeWidth="8" />
            <path d="M140 80 Q140 40 160 40 L180 40 Q200 40 200 80" fill="none" stroke="#e5e7eb" strokeWidth="8" />
            {/* Design area */}
            <rect
              x="80"
              y="120"
              width="120"
              height="120"
              fill="rgba(59, 130, 246, 0.1)"
              stroke="rgba(59, 130, 246, 0.3)"
              strokeDasharray="5,5"
            />
            <text x="140" y="185" textAnchor="middle" className="text-xs fill-gray-400">
              Design Area
            </text>
          </svg>

          {elements.map((element) => (
            <div
              key={element.id}
              className={`absolute cursor-pointer border-2 ${
                selectedElement === element.id ? "border-blue-500" : "border-transparent"
              }`}
              style={{
                left: (80 + element.x) * baseScale,
                top: (120 + element.y) * baseScale,
                width: element.width * baseScale,
                height: element.height * baseScale,
                transform: `rotate(${element.rotation || 0}deg)`,
              }}
              onClick={() => setSelectedElement(element.id)}
            >
              {renderElement(element, baseScale)}
            </div>
          ))}
        </div>
      )
    }

    // Home Decor Canvas (Canvas Print)
    if (category === "home-decor") {
      return (
        <div className="relative">
          <svg
            width={320 * baseScale}
            height={240 * baseScale}
            viewBox="0 0 320 240"
            className="border-2 border-dashed border-gray-300"
          >
            {/* Canvas frame */}
            <rect x="20" y="20" width="280" height="200" fill="white" stroke="#8b5cf6" strokeWidth="4" />
            {/* Inner canvas area */}
            <rect
              x="40"
              y="40"
              width="240"
              height="160"
              fill="rgba(139, 92, 246, 0.1)"
              stroke="rgba(139, 92, 246, 0.3)"
              strokeDasharray="5,5"
            />
            <text x="160" y="125" textAnchor="middle" className="text-xs fill-gray-400">
              Design Area
            </text>
          </svg>

          {elements.map((element) => (
            <div
              key={element.id}
              className={`absolute cursor-pointer border-2 ${
                selectedElement === element.id ? "border-blue-500" : "border-transparent"
              }`}
              style={{
                left: (40 + element.x) * baseScale,
                top: (40 + element.y) * baseScale,
                width: element.width * baseScale,
                height: element.height * baseScale,
                transform: `rotate(${element.rotation || 0}deg)`,
              }}
              onClick={() => setSelectedElement(element.id)}
            >
              {renderElement(element, baseScale)}
            </div>
          ))}
        </div>
      )
    }

    // Stationery Canvas (Business Card)
    if (category === "stationery") {
      return (
        <div className="relative">
          <svg
            width={350 * baseScale}
            height={200 * baseScale}
            viewBox="0 0 350 200"
            className="border-2 border-dashed border-gray-300"
          >
            {/* Business card shape */}
            <rect x="25" y="50" width="300" height="100" rx="8" ry="8" fill="white" stroke="#3b82f6" strokeWidth="2" />
            {/* Design area */}
            <rect
              x="40"
              y="65"
              width="270"
              height="70"
              fill="rgba(59, 130, 246, 0.1)"
              stroke="rgba(59, 130, 246, 0.3)"
              strokeDasharray="5,5"
            />
            <text x="175" y="105" textAnchor="middle" className="text-xs fill-gray-400">
              Design Area
            </text>
          </svg>

          {elements.map((element) => (
            <div
              key={element.id}
              className={`absolute cursor-pointer border-2 ${
                selectedElement === element.id ? "border-blue-500" : "border-transparent"
              }`}
              style={{
                left: (40 + element.x) * baseScale,
                top: (65 + element.y) * baseScale,
                width: element.width * baseScale,
                height: element.height * baseScale,
                transform: `rotate(${element.rotation || 0}deg)`,
              }}
              onClick={() => setSelectedElement(element.id)}
            >
              {renderElement(element, baseScale)}
            </div>
          ))}
        </div>
      )
    }

    // Office Ware Canvas (Mouse Pad)
    if (category === "office-ware") {
      return (
        <div className="relative">
          <svg
            width={300 * baseScale}
            height={220 * baseScale}
            viewBox="0 0 300 220"
            className="border-2 border-dashed border-gray-300"
          >
            {/* Mouse pad shape */}
            <rect
              x="30"
              y="40"
              width="240"
              height="140"
              rx="20"
              ry="20"
              fill="white"
              stroke="#7c3aed"
              strokeWidth="2"
            />
            {/* Design area */}
            <rect
              x="50"
              y="60"
              width="200"
              height="100"
              fill="rgba(124, 58, 237, 0.1)"
              stroke="rgba(124, 58, 237, 0.3)"
              strokeDasharray="5,5"
            />
            <text x="150" y="115" textAnchor="middle" className="text-xs fill-gray-400">
              Design Area
            </text>
          </svg>

          {elements.map((element) => (
            <div
              key={element.id}
              className={`absolute cursor-pointer border-2 ${
                selectedElement === element.id ? "border-blue-500" : "border-transparent"
              }`}
              style={{
                left: (50 + element.x) * baseScale,
                top: (60 + element.y) * baseScale,
                width: element.width * baseScale,
                height: element.height * baseScale,
                transform: `rotate(${element.rotation || 0}deg)`,
              }}
              onClick={() => setSelectedElement(element.id)}
            >
              {renderElement(element, baseScale)}
            </div>
          ))}
        </div>
      )
    }

    // Sportswear Canvas (Jersey)
    if (category === "sportswear") {
      return (
        <div className="relative">
          <svg
            width={280 * baseScale}
            height={320 * baseScale}
            viewBox="0 0 280 320"
            className="border-2 border-dashed border-gray-300"
          >
            {/* Jersey shape */}
            <path
              d="M70 40 L70 25 Q70 15 80 15 L200 15 Q210 15 210 25 L210 40 L250 70 L250 110 L210 90 L210 300 Q210 310 200 310 L80 310 Q70 310 70 300 L70 90 L30 110 L30 70 Z"
              fill="white"
              stroke="#16a34a"
              strokeWidth="2"
            />
            {/* Jersey number area */}
            <circle
              cx="140"
              cy="120"
              r="30"
              fill="rgba(22, 163, 74, 0.1)"
              stroke="rgba(22, 163, 74, 0.3)"
              strokeDasharray="5,5"
            />
            {/* Name area */}
            <rect
              x="90"
              y="180"
              width="100"
              height="30"
              fill="rgba(22, 163, 74, 0.1)"
              stroke="rgba(22, 163, 74, 0.3)"
              strokeDasharray="5,5"
            />
            <text x="140" y="125" textAnchor="middle" className="text-xs fill-gray-400">
              Number
            </text>
            <text x="140" y="200" textAnchor="middle" className="text-xs fill-gray-400">
              Name
            </text>
          </svg>

          {elements.map((element) => (
            <div
              key={element.id}
              className={`absolute cursor-pointer border-2 ${
                selectedElement === element.id ? "border-blue-500" : "border-transparent"
              }`}
              style={{
                left: (90 + element.x) * baseScale,
                top: (90 + element.y) * baseScale,
                width: element.width * baseScale,
                height: element.height * baseScale,
                transform: `rotate(${element.rotation || 0}deg)`,
              }}
              onClick={() => setSelectedElement(element.id)}
            >
              {renderElement(element, baseScale)}
            </div>
          ))}
        </div>
      )
    }

    // Kids & Babies Canvas (Baby Onesie)
    if (category === "kids-babies") {
      return (
        <div className="relative">
          <svg
            width={240 * baseScale}
            height={280 * baseScale}
            viewBox="0 0 240 280"
            className="border-2 border-dashed border-gray-300"
          >
            {/* Baby onesie shape */}
            <path
              d="M60 40 L60 25 Q60 15 70 15 L170 15 Q180 15 180 25 L180 40 L210 60 L210 90 L180 80 L180 200 L200 220 L200 260 Q200 270 190 270 L50 270 Q40 270 40 260 L40 220 L60 200 L60 80 L30 90 L30 60 Z"
              fill="white"
              stroke="#ec4899"
              strokeWidth="2"
            />
            {/* Design area */}
            <rect
              x="80"
              y="70"
              width="80"
              height="80"
              fill="rgba(236, 72, 153, 0.1)"
              stroke="rgba(236, 72, 153, 0.3)"
              strokeDasharray="5,5"
            />
            <text x="120" y="115" textAnchor="middle" className="text-xs fill-gray-400">
              Design Area
            </text>
          </svg>

          {elements.map((element) => (
            <div
              key={element.id}
              className={`absolute cursor-pointer border-2 ${
                selectedElement === element.id ? "border-blue-500" : "border-transparent"
              }`}
              style={{
                left: (80 + element.x) * baseScale,
                top: (70 + element.y) * baseScale,
                width: element.width * baseScale,
                height: element.height * baseScale,
                transform: `rotate(${element.rotation || 0}deg)`,
              }}
              onClick={() => setSelectedElement(element.id)}
            >
              {renderElement(element, baseScale)}
            </div>
          ))}
        </div>
      )
    }

    // Default rectangular canvas for other products
    return (
      <div className="relative">
        <svg
          width={300 * baseScale}
          height={200 * baseScale}
          viewBox="0 0 300 200"
          className="border-2 border-dashed border-gray-300"
        >
          <rect x="0" y="0" width="300" height="200" fill="white" stroke="#e5e7eb" strokeWidth="2" />
          <rect
            x="50"
            y="50"
            width="200"
            height="100"
            fill="rgba(59, 130, 246, 0.1)"
            stroke="rgba(59, 130, 246, 0.3)"
            strokeDasharray="5,5"
          />
          <text x="150" y="105" textAnchor="middle" className="text-xs fill-gray-400">
            Design Area
          </text>
        </svg>

        {elements.map((element) => (
          <div
            key={element.id}
            className={`absolute cursor-pointer border-2 ${
              selectedElement === element.id ? "border-blue-500" : "border-transparent"
            }`}
            style={{
              left: (50 + element.x) * baseScale,
              top: (50 + element.y) * baseScale,
              width: element.width * baseScale,
              height: element.height * baseScale,
              transform: `rotate(${element.rotation || 0}deg)`,
            }}
            onClick={() => setSelectedElement(element.id)}
          >
            {renderElement(element, baseScale)}
          </div>
        ))}
      </div>
    )
  }

  const renderElement = (element: DesignElement, scale: number) => {
    if (element.type === "text") {
      return (
        <div
          style={{
            color: element.color,
            fontSize: (element.fontSize || 24) * scale,
            fontFamily: "Arial, sans-serif",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {element.content}
        </div>
      )
    }

    if (element.type === "shape" && element.content === "rectangle") {
      return (
        <div
          style={{
            backgroundColor: element.color,
            width: "100%",
            height: "100%",
          }}
        />
      )
    }

    if (element.type === "shape" && element.content === "circle") {
      return (
        <div
          style={{
            backgroundColor: element.color,
            width: "100%",
            height: "100%",
            borderRadius: "50%",
          }}
        />
      )
    }

    return null
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href={`/products/${category}`}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Products</span>
            </Link>
            <h1 className="text-xl font-semibold">Design: {product.name}</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={saveDesign}>
              <Save className="h-4 w-4 mr-2" />
              Save Design
            </Button>
            <Button onClick={downloadMockup}>
              <Download className="h-4 w-4 mr-2" />
              Download Mockup
            </Button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Toolbar */}
        <div className="w-64 bg-white border-r p-4 overflow-y-auto">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-3">Tools</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={selectedTool === "select" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTool("select")}
                >
                  <Move className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={addTextElement}>
                  <Type className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => addShapeElement("rectangle")}>
                  <Square className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => addShapeElement("circle")}>
                  <Circle className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <ImageIcon className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Palette className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Actions</h3>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Undo className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Redo className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => selectedElement && deleteElement(selectedElement)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {selectedElement && (
              <div>
                <h3 className="font-semibold mb-3">Element Properties</h3>
                <div className="space-y-3">
                  {elements.find((el) => el.id === selectedElement)?.type === "text" && (
                    <>
                      <div>
                        <Label>Text Content</Label>
                        <Input
                          value={elements.find((el) => el.id === selectedElement)?.content || ""}
                          onChange={(e) => updateElement(selectedElement, { content: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Font Size</Label>
                        <Slider
                          value={[elements.find((el) => el.id === selectedElement)?.fontSize || 24]}
                          onValueChange={([value]) => updateElement(selectedElement, { fontSize: value })}
                          min={12}
                          max={72}
                          step={1}
                        />
                      </div>
                    </>
                  )}
                  <div>
                    <Label>Color</Label>
                    <Input
                      type="color"
                      value={elements.find((el) => el.id === selectedElement)?.color || "#000000"}
                      onChange={(e) => updateElement(selectedElement, { color: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Rotation</Label>
                    <Slider
                      value={[elements.find((el) => el.id === selectedElement)?.rotation || 0]}
                      onValueChange={([value]) => updateElement(selectedElement, { rotation: value })}
                      min={0}
                      max={360}
                      step={1}
                    />
                  </div>
                </div>
              </div>
            )}

            <div>
              <h3 className="font-semibold mb-3">Layers</h3>
              <div className="space-y-2">
                {elements.map((element) => (
                  <div
                    key={element.id}
                    className={`p-2 border rounded cursor-pointer ${
                      selectedElement === element.id ? "border-blue-500 bg-blue-50" : "border-gray-200"
                    }`}
                    onClick={() => setSelectedElement(element.id)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{element.type === "text" ? element.content : element.type}</span>
                      <Button variant="ghost" size="sm" onClick={() => deleteElement(element.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 p-6">
          <Card className="h-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Design Canvas</h3>
              <div className="flex items-center space-x-4">
                <Label>Product Size:</Label>
                <Select value={productSize} onValueChange={setProductSize}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {product.sizes.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-center" style={{ height: "500px" }}>
              {/* Product-specific canvas shapes */}
              {renderProductCanvas()}
            </div>
          </Card>
        </div>

        {/* Preview Section */}
        <div className="w-80 bg-white border-l p-4 overflow-y-auto">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Preview</h3>

            {/* Size Control */}
            <div>
              <Label>Size: {productSize}</Label>
              <Slider
                value={[product.sizes.indexOf(productSize)]}
                onValueChange={([value]) => setProductSize(product.sizes[value])}
                min={0}
                max={product.sizes.length - 1}
                step={1}
                className="mt-2"
              />
            </div>

            {/* Mockup Mode */}
            <div>
              <Label>Mockup Mode</Label>
              <Select value={mockupMode} onValueChange={(value: "realistic" | "bright") => setMockupMode(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="realistic">Realistic</SelectItem>
                  <SelectItem value="bright">Bright/Colorful</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Background */}
            <div>
              <Label>Background</Label>
              <Tabs value={mockupBackground} onValueChange={(value: "white" | "custom") => setMockupBackground(value)}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="white">White</TabsTrigger>
                  <TabsTrigger value="custom">Custom</TabsTrigger>
                </TabsList>
                <TabsContent value="custom" className="mt-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        const reader = new FileReader()
                        reader.onload = (e) => setCustomBackground(e.target?.result as string)
                        reader.readAsDataURL(file)
                      }
                    }}
                  />
                </TabsContent>
              </Tabs>
            </div>

            {/* Mockup Views */}
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Front View</h4>
                <div
                  className={`relative rounded-lg overflow-hidden ${
                    mockupMode === "realistic" ? "filter-none" : "saturate-150 contrast-110"
                  }`}
                  style={{
                    backgroundColor: mockupBackground === "white" ? "#ffffff" : "transparent",
                    backgroundImage: mockupBackground === "custom" ? `url(${customBackground})` : "none",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <Image
                    src={product.mockupFront || "/placeholder.svg"}
                    alt="Front mockup"
                    width={300}
                    height={300}
                    className="w-full h-auto"
                  />
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Back View</h4>
                <div
                  className={`relative rounded-lg overflow-hidden ${
                    mockupMode === "realistic" ? "filter-none" : "saturate-150 contrast-110"
                  }`}
                  style={{
                    backgroundColor: mockupBackground === "white" ? "#ffffff" : "transparent",
                    backgroundImage: mockupBackground === "custom" ? `url(${customBackground})` : "none",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <Image
                    src={product.mockupBack || "/placeholder.svg"}
                    alt="Back mockup"
                    width={300}
                    height={300}
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-4 border-t">
              <Button className="w-full" onClick={saveDesign}>
                <Save className="h-4 w-4 mr-2" />
                Save Product Image
              </Button>
              <Button variant="outline" className="w-full bg-transparent" onClick={downloadMockup}>
                <Download className="h-4 w-4 mr-2" />
                Download Mockup Image
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
