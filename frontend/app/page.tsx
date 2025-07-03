//app/page.tsx
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Palette,
  Truck,
  Shield,
  Star,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function HomePage() {
  const productCategories = [
    {
      title: "Clothing & Apparel",
      description: "Custom t-shirts, hoodies, uniforms, and more",
      image: "/images/clothing-apparel.png",
      items: ["T-Shirts", "Hoodies", "Uniforms", "Polo Shirts"],
    },
    {
      title: "Drinkware & Kitchenware",
      description: "Mugs, water bottles, and kitchen accessories",
      image: "/images/drinkware-kitchen.png",
      items: ["Coffee Mugs", "Water Bottles", "Tumblers", "Coasters"],
    },
    {
      title: "Home Decor",
      description: "Wall art, cushions, and decorative items",
      image: "/images/home-decor.png",
      items: ["Canvas Prints", "Cushions", "Wall Decals", "Photo Frames"],
    },
    {
      title: "Stationery",
      description: "Business cards, notebooks, and office supplies",
      image: "/images/stationery.png",
      items: ["Business Cards", "Notebooks", "Calendars", "Bookmarks"],
    },
    {
      title: "Office Ware",
      description: "Professional items for your workplace",
      image: "/images/office-ware.png",
      items: ["Desk Accessories", "Folders", "Name Plates", "Planners"],
    },
    {
      title: "Phone Cases",
      description: "Custom cases for all phone models",
      image: "/images/phone-cases.png",
      items: ["iPhone Cases", "Samsung Cases", "Custom Designs", "Pop Sockets"],
    },
    {
      title: "Accessories",
      description: "Bags, keychains, and personal items",
      image: "/images/accessories.png",
      items: ["Tote Bags", "Keychains", "Badges", "Lanyards"],
    },
    {
      title: "Sportswear",
      description: "Athletic wear and sports equipment",
      image: "/images/sportswear.png",
      items: ["Sports Jerseys", "Gym Bags", "Water Bottles", "Towels"],
    },
    {
      title: "Kids & Babies",
      description: "Safe, fun items for little ones",
      image: "/images/kids-babies.png",
      items: ["Baby Onesies", "Kids T-Shirts", "Bibs", "Toys"],
    },
  ]

  const features = [
    {
      icon: <Palette className="h-8 w-8" />,
      title: "Custom Design",
      description: "Professional design services or upload your own artwork",
    },
    {
      icon: <Truck className="h-8 w-8" />,
      title: "Fast Delivery",
      description: "Quick turnaround times with reliable shipping options",
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Quality Guarantee",
      description: "Premium materials and printing techniques for lasting results",
    },
    {
      icon: <Star className="h-8 w-8" />,
      title: "Expert Support",
      description: "Dedicated customer service team to help with your projects",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Palette className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">PrintCraft</span>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="#products" className="text-gray-600 hover:text-blue-600 transition-colors">
                Products
              </Link>
              <Link href="#services" className="text-gray-600 hover:text-blue-600 transition-colors">
                Services
              </Link>
              <Link href="#about" className="text-gray-600 hover:text-blue-600 transition-colors">
                About
              </Link>
              <Link href="#contact" className="text-gray-600 hover:text-blue-600 transition-colors">
                Contact
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Button variant="outline" className="bg-white text-gray-900 border-gray-300">
                Get Quote
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">Start Design</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-100">Professional Printing Services</Badge>
              <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Bring Your Ideas to Life with Custom Printing
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                From clothing and accessories to home decor and office supplies, we print on everything you need.
                High-quality materials, fast turnaround, and exceptional service guaranteed.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  Start Your Project
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" className="bg-white text-gray-900 border-gray-300">
                  View Portfolio
                </Button>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/images/hero-showcase.png"
                alt="Custom printing showcase"
                width={600}
                height={500}
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section id="products" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What We Print On</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our wide range of products available for custom printing. From everyday essentials to special
              occasion items, we've got you covered.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {productCategories.map((category, index) => {
              const categoryRoutes = [
                "/products/clothing-apparel",
                "/products/drinkware-kitchen",
                "/products/home-decor",
                "/products/stationery",
                "/products/office-ware",
                "/products/phone-cases",
                "/products/accessories",
                "/products/sportswear",
                "/products/kids-babies",
              ]

              return (
                <Link key={index} href={categoryRoutes[index]} className="block">
                  <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg cursor-pointer">
                    <CardContent className="p-0">
                      <div className="relative overflow-hidden rounded-t-lg">
                        <Image
                          src={category.image || "/placeholder.svg"}
                          alt={category.title}
                          width={400}
                          height={300}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.title}</h3>
                        <p className="text-gray-600 mb-4">{category.description}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {category.items.map((item, itemIndex) => (
                            <Badge key={itemIndex} variant="secondary" className="text-xs">
                              {item}
                            </Badge>
                          ))}
                        </div>
                        <Button
                          variant="outline"
                          className="w-full bg-white text-gray-900 border-gray-300 group-hover:bg-blue-50 group-hover:border-blue-300"
                        >
                          Explore {category.title}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="services" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose PrintCraft?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We combine cutting-edge printing technology with exceptional customer service to deliver results that
              exceed your expectations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Getting your custom printed items is easy with our streamlined process
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Choose & Design</h3>
              <p className="text-gray-600">Select your product and upload your design or work with our design team</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Review & Approve</h3>
              <p className="text-gray-600">We'll send you a proof for approval before we start printing</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Print & Deliver</h3>
              <p className="text-gray-600">We print your items with care and deliver them right to your door</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Don't just take our word for it - see what our satisfied customers have to say about our printing services
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <Image
                  src="/images/quality-guarantee.png"
                  alt="Customer testimonial"
                  width={60}
                  height={60}
                  className="rounded-full mr-4"
                />
                <div>
                  <h4 className="font-semibold">Sarah Johnson</h4>
                  <p className="text-gray-600 text-sm">Small Business Owner</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                "PrintCraft delivered exactly what we needed for our company uniforms. The quality is outstanding and
                the turnaround time was impressive!"
              </p>
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center mb-4">
                <Image
                  src="/images/printing-process.png"
                  alt="Customer testimonial"
                  width={60}
                  height={60}
                  className="rounded-full mr-4"
                />
                <div>
                  <h4 className="font-semibold">Mike Chen</h4>
                  <p className="text-gray-600 text-sm">Event Organizer</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                "We've used PrintCraft for multiple events. Their custom merchandise always gets compliments and their
                service is top-notch."
              </p>
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center mb-4">
                <Image
                  src="/images/hero-showcase.png"
                  alt="Customer testimonial"
                  width={60}
                  height={60}
                  className="rounded-full mr-4"
                />
                <div>
                  <h4 className="font-semibold">Emily Rodriguez</h4>
                  <p className="text-gray-600 text-sm">Marketing Director</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                "The design team at PrintCraft helped bring our vision to life. Professional, creative, and delivered on
                time every time."
              </p>
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Start Your Project?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Get a free quote today and see how we can bring your ideas to life with professional printing
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Input placeholder="Enter your email" className="bg-white border-0 text-gray-900" />
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Get Free Quote
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Palette className="h-8 w-8 text-blue-400" />
                <span className="text-2xl font-bold">PrintCraft</span>
              </div>
              <p className="text-gray-400 mb-4">
                Your trusted partner for all custom printing needs. Quality, speed, and service you can count on.
              </p>
              <div className="flex space-x-4">
                <Facebook className="h-5 w-5 text-gray-400 hover:text-blue-400 cursor-pointer" />
                <Twitter className="h-5 w-5 text-gray-400 hover:text-blue-400 cursor-pointer" />
                <Instagram className="h-5 w-5 text-gray-400 hover:text-blue-400 cursor-pointer" />
                <Linkedin className="h-5 w-5 text-gray-400 hover:text-blue-400 cursor-pointer" />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Products</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white">
                    Clothing & Apparel
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Drinkware
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Home Decor
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Office Supplies
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white">
                    Custom Design
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Bulk Orders
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Rush Printing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Design Consultation
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
              <div className="space-y-3 text-gray-400">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>(555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>hello@printcraft.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>123 Print Street, Design City</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} PrintCraft. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
