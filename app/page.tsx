"use client"

import { useState } from "react"
import { PostsFeed } from "@/components/posts/posts-feed"
import { TechniquesFilter } from "@/components/posts/techniques-filter"
import { NewPostButton } from "@/components/posts/new-post-button"

export default function Home() {
  const [selectedTechnique, setSelectedTechnique] = useState<string | null>(null)

  return (
    <div className="flex flex-col min-h-screen bg-leafy-beige-light">
      <header className="sticky top-0 z-10 bg-white backdrop-blur-sm border-b border-leafy-green-light/20 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between max-w-7xl mx-auto h-12">
          <TechniquesFilter selectedTechnique={selectedTechnique} onSelectTechnique={setSelectedTechnique} />
          <NewPostButton />
        </div>
      </header>

      <main className="flex-1 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Posts feed */}
          <PostsFeed selectedTechnique={selectedTechnique} />
        </div>
      </main>
    </div>
  )
}

