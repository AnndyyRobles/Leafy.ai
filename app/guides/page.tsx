"use client"

import { useState } from "react"
import { PlantGuideGrid } from "@/components/guides/plant-guide-grid"
import { PlantGuideFilters } from "@/components/guides/plant-guide-filters"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { ContributeGuideDialog } from "@/components/guides/contribute-guide-dialog"
import { useAuth } from "@/components/auth/auth-provider"

export default function GuidesPage() {
  const [isContributeDialogOpen, setIsContributeDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const { isAuthenticated } = useAuth()

  return (
    <div className="flex flex-col min-h-screen bg-leafy-beige-light">
      <header className="sticky top-0 z-10 bg-white backdrop-blur-sm border-b border-leafy-green-light/20 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between max-w-7xl mx-auto h-12">
          <h1 className="text-2xl font-bold text-leafy-green-forest">Plant Guides</h1>

          {isAuthenticated && (
            <Button
              onClick={() => setIsContributeDialogOpen(true)}
              className="bg-leafy-green-dark hover:bg-leafy-green-forest text-white flex items-center gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              Contribute Guide
            </Button>
          )}
        </div>
      </header>

      <main className="flex-1 px-6 py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Filters */}
          <PlantGuideFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategories={selectedCategories}
            onCategoryChange={setSelectedCategories}
          />

          {/* Plant Guides Grid */}
          <PlantGuideGrid searchQuery={searchQuery} selectedCategories={selectedCategories} />
        </div>
      </main>

      {/* Contribute Dialog */}
      <ContributeGuideDialog isOpen={isContributeDialogOpen} onClose={() => setIsContributeDialogOpen(false)} />
    </div>
  )
}