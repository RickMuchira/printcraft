"use client"

import { useParams } from "next/navigation"
import { DesignPlatform } from "@/components/design-platform"

export default function DesignPage() {
  const params = useParams()
  const category = params.category as string
  const productId = params.productId as string

  return <DesignPlatform category={category} productId={productId} />
}
