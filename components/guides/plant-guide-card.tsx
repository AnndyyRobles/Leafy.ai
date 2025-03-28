"use client"
import { useRouter } from "next/navigation"

interface PlantGuide {
  id: number
  common_name: string
  scientific_name: string
  photo: string
  categories: string[]
  description: string
  germination: string
  transplanting: string
  harvest: string
  watering: string
  sunlight: string
  extra_care: string
}

interface PlantGuideCardProps {
  guide: PlantGuide
}

export function PlantGuideCard({ guide }: PlantGuideCardProps) {
  const router = useRouter()

  const handleClick = () => {
    router.push(`/guides/${guide.id}`)
  }

  return (
    <div
      className="overflow-hidden rounded-lg shadow-md transition-transform hover:shadow-lg hover:-translate-y-1 cursor-pointer"
      onClick={handleClick}
    >
      <div className="relative aspect-square">
        <img src={guide.photo || "/placeholder.svg"} alt={guide.common_name} className="w-full h-full object-cover" />
      </div>
      <div className="bg-leafy-green-dark text-white p-2 text-center">
        <h3 className="font-medium truncate">{guide.common_name}</h3>
      </div>
    </div>
  )
}

