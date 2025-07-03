import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { CartProvider, CartPanel } from "@/lib/cart-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PrintCraft - Custom Printing Services",
  description: "Professional custom printing services for all your needs. Premium quality printing on clothing, accessories, home decor, and more.",
  keywords: "custom printing, t-shirt printing, promotional products, business cards, branded merchandise, print services, personalized gifts",
  authors: [{ name: "PrintCraft Team" }],
  creator: "PrintCraft",
  publisher: "PrintCraft",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://printcraft.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://printcraft.com',
    title: 'PrintCraft - Custom Printing Services',
    description: 'Professional custom printing services for all your needs. Premium quality printing on clothing, accessories, home decor, and more.',
    siteName: 'PrintCraft',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'PrintCraft - Custom Printing Services',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PrintCraft - Custom Printing Services',
    description: 'Professional custom printing services for all your needs.',
    images: ['/images/twitter-image.jpg'],
    creator: '@printcraft',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        <CartProvider>
          {children}
          <CartPanel />
        </CartProvider>
      </body>
    </html>
  )
}