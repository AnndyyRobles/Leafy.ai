"use client"

import { ProjectCard } from "./project-card"

interface Project {
  id: string
  name: string
  description: string
  previewImage: string
  modelUrl: string
  technique: string
  dimensions: { width: number; length: number; height: number }
  location: string
  city: string
  createdAt: string
}

interface ProjectGridProps {
  projects: Project[]
  onDelete: (projectId: string) => void
  onSelect: (project: Project) => void
}

export function ProjectGrid({ projects, onDelete, onSelect }: ProjectGridProps) {
  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="bg-leafy-beige-green-light/30 rounded-full p-6 mb-4">
          <span className="text-4xl">🌱</span>
        </div>
        <h2 className="text-xl font-semibold text-leafy-green-dark mb-2">No projects yet</h2>
        <p className="text-gray-600 max-w-md mb-6">
          You haven't created any projects yet. Start by creating a new project to see it here.
        </p>
        <a
          href="/new-project"
          className="px-4 py-2 bg-leafy-green-dark hover:bg-leafy-green-forest text-white rounded-md transition-colors"
        >
          Create New Project
        </a>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onDelete={() => onDelete(project.id)}
          onSelect={() => onSelect(project)}
        />
      ))}
    </div>
  )
}

