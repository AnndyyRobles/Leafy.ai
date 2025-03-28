"use client"

import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"

export function NewPostButton() {
  const router = useRouter()

  return (
    <button
      onClick={() => router.push("/new-post")}
      className="fixed top-4 right-4 z-20 flex items-center gap-2 bg-leafy-green-dark hover:bg-leafy-green-forest text-white px-4 py-2 rounded-full transition-colors shadow-md"
    >
      <Plus className="h-5 w-5" />
      <span>New Post</span>
    </button>
  )
}

