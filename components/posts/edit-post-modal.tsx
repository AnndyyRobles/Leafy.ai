"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Upload, X, Loader2 } from "lucide-react"
import { TechniqueBadge } from "@/components/posts/technique-badge"
import { useToast } from "@/components/ui/use-toast"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import type { Post } from "./posts-feed"
import axios from "axios"

interface Technique {
  id: number
  name: string
}

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
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [techniques, setTechniques] = useState<Technique[]>([])

  // Cargar técnicas de cultivo
  useEffect(() => {
    const fetchTechniques = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/techniques`)
        setTechniques(response.data)
      } catch (error) {
        console.error("Error cargando técnicas:", error)
      }
    }

    if (isOpen) {
      fetchTechniques()
    }
  }, [isOpen])

  // Cargar los datos del post cuando se abre el modal
  useEffect(() => {
    if (post && isOpen) {
      setCaption(post.caption || "")
      setSelectedTechnique(post.techniques[0] || null)
      setImagePreview(post.images[0] || null)
    }
  }, [post, isOpen])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImage(null)
    // No eliminamos imagePreview para mantener la imagen original
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!caption.trim()) {
      toast({
        title: "Información incompleta",
        description: "Por favor añade un texto para tu post.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Preparar los datos actualizados
    const updatedPost: Partial<Post> = {
      id: post?.id,
      caption,
      techniques: selectedTechnique ? [selectedTechnique] : [],
    }

    // Si hay una nueva imagen, actualizar el arreglo de imágenes
    if (image) {
      // En un caso real, la imagen se enviaría al servidor
      // y se actualizaría la URL, pero para este ejemplo
      // solo actualizamos el arreglo de imágenes con la URL temporal
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string
        updatedPost.images = [imageUrl]
        onSave(updatedPost)
      }
      reader.readAsDataURL(image)
    } else {
      // Si no hay nueva imagen, usar la URL existente
      onSave(updatedPost)
    }

    setIsSubmitting(false)
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

            <div className="relative">
              <img
                src={imagePreview || "/placeholder.svg"}
                alt="Preview"
                className="w-full rounded-lg object-cover max-h-96"
              />
              <div className="absolute bottom-2 right-2 flex gap-2">
                <input type="file" accept="image/*" id="image-upload" className="hidden" onChange={handleImageUpload} />
                <label 
                  htmlFor="image-upload" 
                  className="bg-black bg-opacity-50 rounded-full p-2 text-white hover:bg-opacity-70 cursor-pointer"
                >
                  <Upload className="h-5 w-5" />
                </label>
                {image && (
                  <button
                    type="button"
                    onClick={removeImage}
                    className="bg-black bg-opacity-50 rounded-full p-2 text-white hover:bg-opacity-70"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
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
              {techniques.map((technique) => (
                <button
                  key={technique.id}
                  type="button"
                  onClick={() => setSelectedTechnique(technique.name === selectedTechnique ? null : technique.name)}
                  className={`relative ${
                    technique.name === selectedTechnique ? "ring-2 ring-leafy-green-medium rounded-full" : ""
                  }`}
                >
                  <TechniqueBadge technique={technique.name} />
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
              disabled={isSubmitting || !caption.trim()}
              className="px-4 py-2 bg-leafy-green-dark hover:bg-leafy-green-forest text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="inline mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}