"use client"

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

// Plant categories from the database
const PLANT_CATEGORIES = [
  { id: 1, name: "Bulbs" },
  { id: 2, name: "Herbs" },
  { id: 3, name: "Vegetables" },
  { id: 4, name: "Fruits" },
]

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
  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      onCategoryChange(selectedCategories.filter((c) => c !== category))
    } else {
      onCategoryChange([...selectedCategories, category])
    }
  }

  const clearFilters = () => {
    onSearchChange("")
    onCategoryChange([])
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

        {PLANT_CATEGORIES.map((category) => (
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

