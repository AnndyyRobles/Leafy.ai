"use client"

import { useState } from "react"
import { ProjectGrid } from "@/components/projects/project-grid"
import { ProjectDetail } from "@/components/projects/project-detail"

// Sample data for projects
const SAMPLE_PROJECTS = [
  {
    id: "1",
    name: "Vertical Garden",
    description: "A vertical garden setup for my apartment balcony with herbs and small vegetables.",
    previewImage: "/placeholder.svg?height=300&width=400",
    modelUrl: "/sample-model.glb",
    technique: "Vertical",
    dimensions: { width: 100, length: 50, height: 200 },
    location: "Indoor",
    city: "Barcelona",
    createdAt: "2024-03-15T10:30:00Z",
  },
  {
    id: "2",
    name: "Hydroponic System",
    description: "Hydroponic setup for growing leafy greens in my kitchen.",
    previewImage: "/placeholder.svg?height=300&width=400",
    modelUrl: "/sample-model.glb",
    technique: "Hydroponics",
    dimensions: { width: 80, length: 40, height: 120 },
    location: "Indoor",
    city: "Madrid",
    createdAt: "2024-02-28T14:45:00Z",
  },
  {
    id: "3",
    name: "Recycled Container Garden",
    description: "Garden made from recycled containers for my rooftop.",
    previewImage: "/placeholder.svg?height=300&width=400",
    modelUrl: "/sample-model.glb",
    technique: "Recycled Materials",
    dimensions: { width: 150, length: 150, height: 50 },
    location: "Outdoor",
    city: "Valencia",
    createdAt: "2024-01-20T09:15:00Z",
  },
  {
    id: "4",
    name: "Wall-mounted Herb Garden",
    description: "Wall-mounted herb garden for my kitchen wall.",
    previewImage: "/placeholder.svg?height=300&width=400",
    modelUrl: "/sample-model.glb",
    technique: "Wall-mounted",
    dimensions: { width: 120, length: 20, height: 80 },
    location: "Indoor",
    city: "Seville",
    createdAt: "2024-03-05T16:20:00Z",
  },
  {
    id: "5",
    name: "Aquaponic System",
    description: "Combined fish and plant growing system for my backyard.",
    previewImage: "/placeholder.svg?height=300&width=400",
    modelUrl: "/sample-model.glb",
    technique: "Aquaponics",
    dimensions: { width: 200, length: 100, height: 150 },
    location: "Outdoor",
    city: "Malaga",
    createdAt: "2024-02-10T11:30:00Z",
  },
  {
    id: "6",
    name: "Small Balcony Garden",
    description: "Compact vertical garden for my small apartment balcony.",
    previewImage: "/placeholder.svg?height=300&width=400",
    modelUrl: "/sample-model.glb",
    technique: "Vertical",
    dimensions: { width: 60, length: 30, height: 150 },
    location: "Outdoor",
    city: "Bilbao",
    createdAt: "2024-03-18T13:45:00Z",
  },
]

export default function MyProjectsPage() {
  const [projects, setProjects] = useState(SAMPLE_PROJECTS)
  const [selectedProject, setSelectedProject] = useState<(typeof SAMPLE_PROJECTS)[0] | null>(null)

  // Handle project deletion
  const handleDeleteProject = (projectId: string) => {
    setProjects(projects.filter((project) => project.id !== projectId))

    // If the deleted project is currently selected, close the detail view
    if (selectedProject && selectedProject.id === projectId) {
      setSelectedProject(null)
    }
  }

  // Handle project selection for detail view
  const handleSelectProject = (project: (typeof SAMPLE_PROJECTS)[0]) => {
    setSelectedProject(project)
  }

  // Close detail view
  const handleCloseDetail = () => {
    setSelectedProject(null)
  }

  return (
    <div className="flex flex-col min-h-screen bg-leafy-beige-light">
      <header className="sticky top-0 z-10 bg-white backdrop-blur-sm border-b border-leafy-green-light/20 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between max-w-7xl mx-auto h-12">
          <h1 className="text-2xl font-bold text-leafy-green-forest">My Projects</h1>
        </div>
      </header>

      <main className="flex-1 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <ProjectGrid projects={projects} onDelete={handleDeleteProject} onSelect={handleSelectProject} />
        </div>
      </main>

      {/* Project Detail Modal */}
      {selectedProject && <ProjectDetail project={selectedProject} onClose={handleCloseDetail} />}
    </div>
  )
}

