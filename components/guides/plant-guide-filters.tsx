"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Input } from "@/components/ui/input"
import { Search, Loader2 } from "lucide-react"

interface PlantCategory {
  id: number
  name: string
}

interface PlantGuideFiltersProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  selectedCategories: string[]
  onCategoryChange: (categories: string[]) => void
}

export function PlantGuideFilters({
  searchQuery,
  onSearchChange,
  selectedCategories,
  onCategoryChange,
}: PlantGuideFiltersProps) {
  const [categories, setCategories] = useState<PlantCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/guides/categories`)
        setCategories(response.data)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching plant categories:", err)
        setError("No se pudieron cargar las categorías")
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      onCategoryChange(selectedCategories.filter((c) => c !== category))
    } else {
      onCategoryChange([...selectedCategories, category])
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 text-leafy-green-dark animate-spin" />
        <span>Cargando filtros...</span>
      </div>
    )
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return (
    <div className="flex items-center gap-4 flex-1">
      <div className="flex flex-wrap gap-2">
        <button
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            selectedCategories.length === 0
              ? "bg-leafy-green-forest text-white font-bold shadow-md border-2 border-leafy-green-dark"
              : "bg-leafy-beige-medium text-leafy-green-dark hover:bg-leafy-green-light"
          }`}
          onClick={() => onCategoryChange([])}
        >
          All
        </button>

        {categories.map((category) => (
          <button
            key={category.id}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              selectedCategories.includes(category.name)
                ? "bg-leafy-green-forest text-white font-bold shadow-md border-2 border-leafy-green-dark"
                : "bg-leafy-beige-medium text-leafy-green-dark hover:bg-leafy-green-light"
            }`}
            onClick={() => toggleCategory(category.name)}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <Input
          type="text"
          placeholder="Search plants..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="px-4 py-1.5 pl-10 rounded-full border border-leafy-green-light/30 focus:outline-none focus:ring-2 focus:ring-leafy-green-medium w-full"
        />
      </div>
    </div>
  )
}