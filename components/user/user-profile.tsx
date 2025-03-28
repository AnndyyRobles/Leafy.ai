"use client"

import { UserCircle, Edit, UserPlus, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

interface UserProfileProps {
  user: {
    id: string
    name: string
    profile_picture: string
    description: string
    registration_date: string
  }
  isCurrentUser: boolean
  isFriend: boolean
  onAddFriend: () => void
  onEditProfile: () => void
}

export function UserProfile({ user, isCurrentUser, isFriend, onAddFriend, onEditProfile }: UserProfileProps) {
  // Formatear la fecha de registro
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-leafy-green-light/20">
      {/* Cabecera con fondo decorativo */}
      <div className="h-32 bg-gradient-to-r from-leafy-green-light to-leafy-green-forest"></div>

      <div className="px-6 py-4 relative">
        {/* Foto de perfil */}
        <div className="absolute -top-16 left-6 rounded-full border-4 border-white overflow-hidden shadow-lg">
          {user.profile_picture ? (
            <img src={user.profile_picture || "/placeholder.svg"} alt={user.name} className="w-32 h-32 object-cover" />
          ) : (
            <div className="w-32 h-32 bg-leafy-beige-light flex items-center justify-center">
              <UserCircle className="w-24 h-24 text-leafy-green-dark" />
            </div>
          )}
        </div>

        {/* Acciones (botones) */}
        <div className="flex justify-end mb-12">
          {isCurrentUser ? (
            <Button onClick={onEditProfile} className="bg-leafy-green-dark hover:bg-leafy-green-forest text-white">
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          ) : (
            <Button
              onClick={onAddFriend}
              disabled={isFriend}
              className={
                isFriend
                  ? "bg-leafy-green-light text-leafy-green-dark cursor-not-allowed"
                  : "bg-leafy-green-dark hover:bg-leafy-green-forest text-white"
              }
            >
              {isFriend ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Friends
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Friend
                </>
              )}
            </Button>
          )}
        </div>

        {/* Información del usuario */}
        <div>
          <h1 className="text-2xl font-bold text-leafy-green-dark">{user.name}</h1>
          <p className="text-sm text-gray-500 mb-4">Member since {formatDate(user.registration_date)}</p>

          <div className="bg-leafy-beige-light/50 p-4 rounded-lg border border-leafy-green-light/10">
            <h2 className="text-lg font-semibold text-leafy-green-dark mb-2">About</h2>
            <p className="text-gray-700">{user.description || "No description provided."}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

