"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { Trash2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DeleteProjectDialog } from "./delete-project-dialog"
import { TechniqueBadge } from "@/components/posts/technique-badge" // Add this import

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

interface ProjectCardProps {
  project: Project
  onDelete: () => void
  onSelect: () => void
}

export function ProjectCard({ project, onDelete, onSelect }: ProjectCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleDelete = () => {
    setShowDeleteDialog(false)
    onDelete()
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-leafy-green-light/20 transition-transform hover:shadow-lg hover:-translate-y-1 relative group">
        {/* Preview Image */}
        <div className="relative h-48 bg-leafy-beige-light">
          <img
            src={project.previewImage || "/placeholder.svg"}
            alt={project.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 left-2">
            <TechniqueBadge technique={project.technique} />
          </div>

          {/* Overlay con botones que aparece al hacer hover */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              <div className="flex gap-2">
                {/* View button - Green background */}
                <Button
                  size="sm"
                  onClick={onSelect}
                  className="bg-leafy-green-dark hover:bg-leafy-green-forest text-white"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Button>

                {/* Delete button - Dark red background (identical to my-posts) */}
                <Button
                  size="sm"
                  onClick={() => setShowDeleteDialog(true)}
                  className="bg-red-900/90 hover:bg-red-900 text-white"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-2">
          <div className="flex justify-between items-start">
            <h3
              className="text-lg font-semibold text-leafy-green-dark truncate cursor-pointer hover:text-leafy-green-forest"
              onClick={onSelect}
            >
              {project.name}
            </h3>
          </div>

          <p className="text-sm text-gray-600 line-clamp-2 h-10">
            {project.description.length > 80 ? `${project.description.substring(0, 80)}...` : project.description}
          </p>

          <div className="flex justify-between items-center pt-1">
            <div className="flex items-center gap-1">
              <span className="text-xs px-2 py-0.5 bg-leafy-beige-light rounded-full text-leafy-green-dark">
                {project.location}
              </span>
              <span className="text-xs px-2 py-0.5 bg-leafy-beige-light rounded-full text-leafy-green-dark">
                {project.city}
              </span>
            </div>
            <p className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteProjectDialog
        isOpen={showDeleteDialog}
        projectName={project.name}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
      />
    </>
  )
}

