"use client"

import type React from "react"

import { useState } from "react"
import { X, Upload, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface EditProfileModalProps {
  user: {
    id: string
    name: string
    profile_picture: string
    description: string
  }
  isOpen: boolean
  onClose: () => void
  onSave: (updatedData: any) => void
}

export function EditProfileModal({ user, isOpen, onClose, onSave }: EditProfileModalProps) {
  const [name, setName] = useState(user.name)
  const [description, setDescription] = useState(user.description || "")
  const [profilePicture, setProfilePicture] = useState<string | null>(user.profile_picture || null)
  const [newProfilePicture, setNewProfilePicture] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Manejar la carga de una nueva imagen de perfil
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // En una aplicación real, aquí se cargaría la imagen a un servidor
      // Para este ejemplo, simplemente creamos una URL temporal
      const imageUrl = URL.createObjectURL(file)
      setProfilePicture(imageUrl)
      setNewProfilePicture(file)
    }
  }

  // Manejar el guardado del perfil
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simular una demora en la carga
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // En una aplicación real, aquí se enviarían los datos al servidor
    onSave({
      name,
      description,
      profile_picture: profilePicture,
    })

    setIsSubmitting(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl shadow-xl overflow-hidden max-w-md w-full">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-leafy-green-dark">Edit Profile</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 rounded-full p-1 hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-4">
          {/* Imagen de perfil */}
          <div className="mb-6 text-center">
            <div className="relative inline-block">
              {profilePicture ? (
                <img
                  src={profilePicture || "/placeholder.svg"}
                  alt={name}
                  className="w-24 h-24 rounded-full object-cover border-2 border-leafy-green-light mx-auto"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-leafy-beige-light flex items-center justify-center border-2 border-leafy-green-light mx-auto">
                  <span className="text-4xl">👤</span>
                </div>
              )}

              <label
                htmlFor="profile-picture"
                className="absolute bottom-0 right-0 bg-leafy-green-dark text-white rounded-full p-1.5 cursor-pointer hover:bg-leafy-green-forest"
              >
                <Upload className="h-4 w-4" />
                <input
                  type="file"
                  id="profile-picture"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-2">Click the icon to upload a new profile picture</p>
          </div>

          {/* Nombre */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="border-leafy-green-light/30 focus:border-leafy-green-medium focus:ring-leafy-green-light"
            />
          </div>

          {/* Descripción */}
          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              About
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="border-leafy-green-light/30 focus:border-leafy-green-medium focus:ring-leafy-green-light"
            />
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-leafy-green-dark hover:bg-leafy-green-forest text-white"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

