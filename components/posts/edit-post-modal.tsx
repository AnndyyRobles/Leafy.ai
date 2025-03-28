"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Upload, X } from "lucide-react"
import { TechniqueBadge } from "@/components/posts/technique-badge"
import { useToast } from "@/components/ui/use-toast"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import type { Post } from "./posts-feed"

// Definir las técnicas de cultivo disponibles
const CULTIVATION_TECHNIQUES = ["Vertical", "Wall-mounted", "Hydroponics", "Recycled Materials", "Aquaponics"]

interface EditPostModalProps {
  post: Post | null
  isOpen: boolean
  onClose: () => void
  onSave: (updatedPost: Partial<Post>) => void
}

export function EditPostModal({ post, isOpen, onClose, onSave }: EditPostModalProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [caption, setCaption] = useState("")
  const [selectedTechnique, setSelectedTechnique] = useState<string | null>(null)
  const [image, setImage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Cargar los datos del post cuando se abre el modal
  useEffect(() => {
    if (post && isOpen) {
      setCaption(post.caption || "")
      setSelectedTechnique(post.techniques[0] || null)
      setImage(post.images[0] || null)
    }
  }, [post, isOpen])

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
        description: "Please add both a caption and an image to update your post.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Preparar los datos actualizados
    const updatedPost = {
      ...post,
      caption,
      techniques: selectedTechnique ? [selectedTechnique] : [],
      images: [image],
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    onSave(updatedPost)
    setIsSubmitting(false)
    onClose()

    toast({
      title: "Post updated!",
      description: "Your post has been updated successfully.",
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-white p-0 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
          <div className="px-4 py-3 flex items-center justify-between">
            <h1 className="text-xl font-semibold text-center text-leafy-green-dark">Edit Post</h1>
            <button onClick={onClose} className="text-leafy-green-dark hover:text-leafy-green-forest transition-colors">
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          {/* Image upload section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h2 className="text-lg font-medium mb-4 text-leafy-green-dark">Image</h2>

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
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !caption.trim() || !image || !selectedTechnique}
              className="px-4 py-2 bg-leafy-green-dark hover:bg-leafy-green-forest text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

