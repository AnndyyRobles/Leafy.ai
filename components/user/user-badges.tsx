"use client"

interface Badge {
  id: number
  name: string
  description: string
  icon: string
}

interface UserBadgesProps {
  badges: Badge[]
}

export function UserBadges({ badges }: UserBadgesProps) {
  // Colores para las insignias
  const badgeColors = [
    "bg-gradient-to-br from-amber-400 to-amber-600",
    "bg-gradient-to-br from-purple-400 to-purple-600",
    "bg-gradient-to-br from-blue-400 to-blue-600",
    "bg-gradient-to-br from-green-400 to-green-600",
    "bg-gradient-to-br from-red-400 to-red-600",
  ]

  if (badges.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 border border-leafy-green-light/20 text-center">
        <div className="text-6xl mb-4">🏅</div>
        <h2 className="text-xl font-semibold text-leafy-green-dark mb-2">No Badges Yet</h2>
        <p className="text-gray-600">
          Badges are awarded for achievements in the community. Keep participating to earn badges!
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-leafy-green-light/20">
      <h2 className="text-xl font-semibold text-leafy-green-dark mb-6">Earned Badges</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {badges.map((badge, index) => (
          <div
            key={badge.id}
            className="rounded-lg overflow-hidden shadow-md border border-leafy-green-light/10 hover:shadow-lg transition-shadow"
          >
            <div className={`${badgeColors[index % badgeColors.length]} p-4 text-white`}>
              <div className="flex items-center justify-between">
                <span className="text-3xl">{badge.icon}</span>
                <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Badge #{badge.id}</span>
              </div>
              <h3 className="text-lg font-semibold mt-2">{badge.name}</h3>
            </div>
            <div className="p-4 bg-leafy-beige-light/30">
              <p className="text-sm text-gray-700">{badge.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

