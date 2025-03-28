"use client"

import { UserCircle, UserX } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Friend {
  id: string
  name: string
  profile_picture: string
}

interface FriendsListProps {
  friends: Friend[]
}

export function FriendsList({ friends }: FriendsListProps) {
  // En una aplicación real, esta función enviaría una solicitud al backend
  const handleRemoveFriend = (friendId: string) => {
    console.log(`Removing friend with ID: ${friendId}`)
    // Aquí iría la lógica para eliminar un amigo
  }

  if (friends.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 border border-leafy-green-light/20 text-center">
        <div className="text-6xl mb-4">👋</div>
        <h2 className="text-xl font-semibold text-leafy-green-dark mb-2">No Friends Yet</h2>
        <p className="text-gray-600">Connect with other plant enthusiasts by adding them as friends!</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-leafy-green-light/20">
      <h2 className="text-xl font-semibold text-leafy-green-dark mb-6">Your Friends ({friends.length})</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {friends.map((friend) => (
          <div
            key={friend.id}
            className="flex items-center justify-between p-4 rounded-lg border border-leafy-green-light/10 bg-leafy-beige-light/30 hover:bg-leafy-beige-light/50 transition-colors"
          >
            <div className="flex items-center">
              {friend.profile_picture ? (
                <img
                  src={friend.profile_picture || "/placeholder.svg"}
                  alt={friend.name}
                  className="w-12 h-12 rounded-full object-cover border border-leafy-green-light/20"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-leafy-beige-light flex items-center justify-center border border-leafy-green-light/20">
                  <UserCircle className="w-8 h-8 text-leafy-green-dark" />
                </div>
              )}

              <div className="ml-3">
                <h3 className="font-medium text-leafy-green-dark">{friend.name}</h3>
                <a href={`/user/${friend.id}`} className="text-xs text-leafy-green-medium hover:underline">
                  View Profile
                </a>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRemoveFriend(friend.id)}
              className="text-gray-500 hover:text-red-500 hover:bg-red-50"
            >
              <UserX className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

