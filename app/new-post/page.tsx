"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Upload, X } from "lucide-react"
import { TechniqueBadge } from "@/components/posts/technique-badge"
import { useToast } from "@/components/ui/use-toast"

// Definir las técnicas de cultivo disponibles
const CULTIVATION_TECHNIQUES = ["Vertical", "Wall-mounted", "Hydroponics", "Recycled Materials", "Aquaponics"]

export default function NewPostPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [caption, setCaption] = useState("")
  const [selectedTechnique, setSelectedTechnique] = useState<string | null>(null)
  const [image, setImage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImage(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!caption.trim() || !image) {
      toast({
        title: "Missing information",
        description: "Please add both a caption and an image to share your post.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast({
      title: "Post shared!",
      description: "Your post has been shared successfully.",
    })

    setIsSubmitting(false)
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-leafy-beige-light">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="text-leafy-green-dark hover:text-leafy-green-forest transition-colors"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-semibold text-center text-leafy-green-dark">New Post</h1>
          <div className="w-6"></div> {/* Spacer for alignment */}
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image upload section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h2 className="text-lg font-medium mb-4 text-leafy-green-dark">Upload Image</h2>

            {!image ? (
              <div className="border-2 border-dashed border-leafy-green-light rounded-lg p-8 text-center">
                <input type="file" accept="image/*" id="image-upload" className="hidden" onChange={handleImageUpload} />
                <label htmlFor="image-upload" className="flex flex-col items-center justify-center cursor-pointer">
                  <Upload className="h-12 w-12 text-leafy-green-medium mb-2" />
                  <p className="text-sm text-leafy-green-dark mb-1">Click to upload an image</p>
                  <p className="text-xs text-leafy-green-medium">JPG, PNG, GIF up to 10MB</p>
                </label>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={image || "/placeholder.svg"}
                  alt="Preview"
                  className="w-full rounded-lg object-cover max-h-96"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1 text-white hover:bg-opacity-70"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>

          {/* Caption section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h2 className="text-lg font-medium mb-4 text-leafy-green-dark">Caption</h2>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write a caption..."
              className="w-full border border-leafy-green-light rounded-lg p-3 text-sm min-h-[100px] focus:outline-none focus:ring-2 focus:ring-leafy-green-medium"
            />
          </div>

          {/* Techniques section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h2 className="text-lg font-medium mb-4 text-leafy-green-dark">Cultivation Technique</h2>
            <div className="flex flex-wrap gap-2">
              {CULTIVATION_TECHNIQUES.map((technique) => (
                <button
                  key={technique}
                  type="button"
                  onClick={() => setSelectedTechnique(technique === selectedTechnique ? null : technique)}
                  className={`relative ${
                    technique === selectedTechnique ? "ring-2 ring-leafy-green-medium rounded-full" : ""
                  }`}
                >
                  <TechniqueBadge technique={technique} />
                </button>
              ))}
            </div>
          </div>

          {/* Submit button */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isSubmitting || !caption.trim() || !image || !selectedTechnique}
              className="w-full max-w-md bg-leafy-green-dark hover:bg-leafy-green-forest text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? "Sharing..." : "Share Post"}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}

