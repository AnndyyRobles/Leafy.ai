"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { UserProfile } from "@/components/user/user-profile"
import { UserBadges } from "@/components/user/user-badges"
import { FriendsList } from "@/components/user/friends-list"
import { EditProfileModal } from "@/components/user/edit-profile-modal"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PostsFeed } from "@/components/posts/posts-feed"

// Datos de ejemplo para el usuario actual (simulando usuario logueado)
const CURRENT_USER_ID = "1"

// Datos de ejemplo para usuarios
const USERS = [
  {
    id: "1",
    name: "Plant Lover",
    profile_picture: "/placeholder.svg",
    description: "Passionate about urban gardening and sustainable living. Growing my own food in a small apartment.",
    email: "plantlover@example.com",
    registration_date: "2023-01-15T10:30:00Z",
  },
  {
    id: "2",
    name: "Green Thumb",
    profile_picture: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    description: "Horticulture enthusiast with 5 years of experience in vertical gardening.",
    email: "greenthumb@example.com",
    registration_date: "2023-02-20T14:45:00Z",
  },
  {
    id: "3",
    name: "Urban Jungle",
    profile_picture: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop",
    description: "Creating green spaces in urban environments. Specializing in balcony gardens.",
    email: "urbanjungle@example.com",
    registration_date: "2023-03-10T09:15:00Z",
  },
]

// Datos de ejemplo para amigos
const FRIENDS = {
  "1": ["2", "3"], // El usuario 1 es amigo de los usuarios 2 y 3
  "2": ["1"], // El usuario 2 es amigo del usuario 1
  "3": ["1"], // El usuario 3 es amigo del usuario 1
}

// Datos de ejemplo para insignias
const BADGES = [
  { id: 1, name: "Profile Creator", description: "Awarded for creating a profile", icon: "🏆" },
  { id: 2, name: "Popular Post", description: "Post with 100+ likes", icon: "🌟" },
  { id: 3, name: "Engagement Master", description: "Post with 50+ comments", icon: "💬" },
  { id: 4, name: "Super Influencer", description: "Created 50+ posts", icon: "📱" },
  { id: 5, name: "Contributing Gardener", description: "Write a new guide", icon: "🌱" },
]

// Datos de ejemplo para insignias de usuarios
const USER_BADGES = {
  "1": [1, 2, 5], // El usuario 1 tiene las insignias 1, 2 y 5
  "2": [1, 3], // El usuario 2 tiene las insignias 1 y 3
  "3": [1, 4, 5], // El usuario 3 tiene las insignias 1, 4 y 5
}

export default function UserProfilePage() {
  const params = useParams()
  const userId = params.id as string

  const [user, setUser] = useState<any>(null)
  const [isCurrentUser, setIsCurrentUser] = useState(false)
  const [isFriend, setIsFriend] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("posts")

  // Simular carga de datos del usuario
  useEffect(() => {
    // Encontrar el usuario por ID
    const foundUser = USERS.find((u) => u.id === userId)
    setUser(foundUser || null)

    // Verificar si es el usuario actual
    setIsCurrentUser(userId === CURRENT_USER_ID)

    // Verificar si es amigo del usuario actual
    const currentUserFriends = FRIENDS[CURRENT_USER_ID] || []
    setIsFriend(currentUserFriends.includes(userId))
  }, [userId])

  // Obtener las insignias del usuario
  const getUserBadges = () => {
    const badgeIds = USER_BADGES[userId] || []
    return BADGES.filter((badge) => badgeIds.includes(badge.id))
  }

  // Obtener los amigos del usuario
  const getUserFriends = () => {
    const friendIds = FRIENDS[userId] || []
    return USERS.filter((user) => friendIds.includes(user.id))
  }

  // Manejar la adición de un amigo
  const handleAddFriend = () => {
    // En una aplicación real, esto enviaría una solicitud al backend
    setIsFriend(true)

    // Actualizar la lista de amigos (simulado)
    FRIENDS[CURRENT_USER_ID] = [...(FRIENDS[CURRENT_USER_ID] || []), userId]
    FRIENDS[userId] = [...(FRIENDS[userId] || []), CURRENT_USER_ID]
  }

  // Manejar la actualización del perfil
  const handleUpdateProfile = (updatedData: any) => {
    // En una aplicación real, esto enviaría una solicitud al backend
    setUser({ ...user, ...updatedData })
    setIsEditModalOpen(false)
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-leafy-beige-light">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-leafy-green-dark mx-auto mb-4"></div>
          <p className="text-leafy-green-dark">Loading user profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-leafy-beige-light">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Perfil del usuario */}
        <UserProfile
          user={user}
          isCurrentUser={isCurrentUser}
          isFriend={isFriend}
          onAddFriend={handleAddFriend}
          onEditProfile={() => setIsEditModalOpen(true)}
        />

        {/* Pestañas para navegar entre secciones */}
        <div className="mt-8">
          <Tabs defaultValue="posts" onValueChange={setActiveTab} value={activeTab}>
            <TabsList className="bg-white border border-leafy-green-light/20 rounded-full">
              <TabsTrigger value="posts" className="rounded-full">
                Posts
              </TabsTrigger>
              <TabsTrigger value="badges" className="rounded-full">
                Badges
              </TabsTrigger>
              {isCurrentUser && (
                <TabsTrigger value="friends" className="rounded-full">
                  Friends
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="posts" className="mt-6">
              <PostsFeed selectedTechnique={null} />
            </TabsContent>

            <TabsContent value="badges" className="mt-6">
              <UserBadges badges={getUserBadges()} />
            </TabsContent>

            {isCurrentUser && (
              <TabsContent value="friends" className="mt-6">
                <FriendsList friends={getUserFriends()} />
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>

      {/* Modal para editar perfil */}
      {isEditModalOpen && (
        <EditProfileModal
          user={user}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleUpdateProfile}
        />
      )}
    </div>
  )
}

