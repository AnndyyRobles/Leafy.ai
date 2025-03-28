"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { PlantGuideCard } from "./plant-guide-card"
import { Loader2 } from "lucide-react"

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
  difficulty: string
  growing_season: string
  days_to_harvest: string
}

interface PlantGuideGridProps {
  searchQuery: string
  selectedCategories: string[]
}

export function PlantGuideGrid({ searchQuery, selectedCategories }: PlantGuideGridProps) {
  const [loading, setLoading] = useState(true)
  const [guides, setGuides] = useState<PlantGuide[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchGuides = async () => {
      setLoading(true)
      try {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/api/guides`
        
        // Añadir parámetros de búsqueda si los hay
        if (searchQuery) {
          url += `?search=${encodeURIComponent(searchQuery)}`
        }
        
        const response = await axios.get(url)
        
        // Transformar datos para que coincidan con la interfaz
        const transformedGuides: PlantGuide[] = response.data.map((guide: any) => ({
          id: guide.id,
          common_name: guide.common_name,
          scientific_name: guide.scientific_name,
          photo: guide.guide_picture ? `${process.env.NEXT_PUBLIC_API_URL}/${guide.guide_picture}` : "/placeholder.svg",
          categories: guide.categories || [],
          description: guide.description,
          germination: guide.germination,
          transplanting: guide.transplanting,
          harvest: guide.harvest,
          watering: guide.watering,
          sunlight: guide.sunlight,
          extra_care: guide.extra_care,
          difficulty: guide.difficulty,
          growing_season: guide.growing_season,
          days_to_harvest: guide.days_to_harvest
        }))
        
        // Filtrar por categorías si es necesario
        const filteredGuides = selectedCategories.length === 0
          ? transformedGuides
          : transformedGuides.filter(guide => 
              guide.categories.some(category => selectedCategories.includes(category))
            )
        
        setGuides(filteredGuides)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching plant guides:", err)
        setError("No se pudieron cargar las guías de plantas")
        setLoading(false)
      }
    }

    fetchGuides()
  }, [searchQuery, selectedCategories])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 text-leafy-green-dark animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-red-500 mb-2">{error}</h3>
        <p className="text-gray-600">Intenta refrescar la página</p>
      </div>
    )
  }

  if (guides.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-leafy-green-dark mb-2">No se encontraron guías</h3>
        <p className="text-gray-600">Intenta ajustar tu búsqueda o filtros</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
      {guides.map((guide) => (
        <PlantGuideCard key={guide.id} guide={guide} />
      ))}
    </div>
  )
}