"use client"

import { useEffect, useRef } from "react"
import { format } from "date-fns"
import { X, Download, Calendar, MapPin, Ruler } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
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

interface ProjectDetailProps {
  project: Project
  onClose: () => void
}

export function ProjectDetail({ project, onClose }: ProjectDetailProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [onClose])

  // Handle ESC key to close
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    window.addEventListener("keydown", handleEsc)
    return () => {
      window.removeEventListener("keydown", handleEsc)
    }
  }, [onClose])

  // Simple 3D preview using canvas
  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set dimensions based on project data
    const width = project.dimensions.width
    const length = project.dimensions.length
    const height = project.dimensions.height

    // Scale to fit canvas
    const scale = Math.min(canvas.width / (width + length), canvas.height / (height + length)) * 0.7

    // Center in canvas
    const offsetX = canvas.width / 2
    const offsetY = canvas.height / 2

    // Draw a simple isometric box
    ctx.save()
    ctx.translate(offsetX, offsetY)

    // Colors based on technique
    let colors = {
      top: "#8BC34A",
      left: "#689F38",
      right: "#558B2F",
    }

    // Adjust colors based on technique
    switch (project.technique) {
      case "Vertical":
        colors = { top: "#8BC34A", left: "#689F38", right: "#558B2F" }
        break
      case "Wall-mounted":
        colors = { top: "#4CAF50", left: "#388E3C", right: "#2E7D32" }
        break
      case "Hydroponics":
        colors = { top: "#03A9F4", left: "#0288D1", right: "#0277BD" }
        break
      case "Recycled Materials":
        colors = { top: "#9C27B0", left: "#7B1FA2", right: "#6A1B9A" }
        break
      case "Aquaponics":
        colors = { top: "#FF9800", left: "#F57C00", right: "#EF6C00" }
        break
    }

    // Draw isometric box
    // Top face
    ctx.beginPath()
    ctx.moveTo(0, (-height * scale) / 2)
    ctx.lineTo((width * scale) / 2, (-height * scale) / 2 + (length * scale) / 4)
    ctx.lineTo(0, (-height * scale) / 2 + (length * scale) / 2)
    ctx.lineTo((-width * scale) / 2, (-height * scale) / 2 + (length * scale) / 4)
    ctx.closePath()
    ctx.fillStyle = colors.top
    ctx.fill()
    ctx.strokeStyle = "#333"
    ctx.stroke()

    // Left face
    ctx.beginPath()
    ctx.moveTo((-width * scale) / 2, (-height * scale) / 2 + (length * scale) / 4)
    ctx.lineTo(0, (-height * scale) / 2 + (length * scale) / 2)
    ctx.lineTo(0, (height * scale) / 2 + (length * scale) / 2)
    ctx.lineTo((-width * scale) / 2, (height * scale) / 2 + (length * scale) / 4)
    ctx.closePath()
    ctx.fillStyle = colors.left
    ctx.fill()
    ctx.strokeStyle = "#333"
    ctx.stroke()

    // Right face
    ctx.beginPath()
    ctx.moveTo(0, (-height * scale) / 2 + (length * scale) / 2)
    ctx.lineTo((width * scale) / 2, (-height * scale) / 2 + (length * scale) / 4)
    ctx.lineTo((width * scale) / 2, (height * scale) / 2 + (length * scale) / 4)
    ctx.lineTo(0, (height * scale) / 2 + (length * scale) / 2)
    ctx.closePath()
    ctx.fillStyle = colors.right
    ctx.fill()
    ctx.strokeStyle = "#333"
    ctx.stroke()

    // Add technique label
    ctx.font = "14px Arial"
    ctx.fillStyle = "#333"
    ctx.textAlign = "center"
    ctx.textBaseline = "top"
    ctx.fillText(project.technique, 0, (height * scale) / 2 + (length * scale) / 2 + 10)

    ctx.restore()
  }, [project])

  // Download the model
  const downloadModel = () => {
    // In a real app, this would trigger a download of the .glb file
    const link = document.createElement("a")
    link.href = project.modelUrl
    link.download = `${project.name.replace(/\s+/g, "-").toLowerCase()}-3d-model.glb`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Download started",
      description: "Your 3D model download has started.",
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl overflow-hidden max-w-6xl w-full max-h-[95vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-2xl font-semibold text-leafy-green-dark">{project.name}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 rounded-full p-1 hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 3D Model */}
            <div className="bg-gray-100 rounded-lg p-4 flex flex-col">
              <div className="flex-1 flex items-center justify-center mb-6">
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={500}
                  className="w-full h-full max-h-[400px] bg-white rounded border border-gray-200"
                />
              </div>

              <Button onClick={downloadModel} className="bg-leafy-green-dark hover:bg-leafy-green-forest text-white">
                <Download className="mr-2 h-4 w-4" />
                Download 3D Model
              </Button>
            </div>

            {/* Project Details */}
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-leafy-green-dark mb-3">Description</h3>
                <p className="text-gray-700">{project.description}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center text-gray-700">
                  <Calendar className="h-4 w-4 mr-2 text-leafy-green-dark" />
                  <span>Created {format(new Date(project.createdAt), "PPP")}</span>
                </div>

                <div className="flex items-center text-gray-700">
                  <MapPin className="h-4 w-4 mr-2 text-leafy-green-dark" />
                  <span>
                    {project.location} - {project.city}
                  </span>
                </div>

                <div className="flex items-center text-gray-700">
                  <Ruler className="h-4 w-4 mr-2 text-leafy-green-dark" />
                  <span>
                    {project.dimensions.width} × {project.dimensions.length} × {project.dimensions.height} cm
                  </span>
                </div>
              </div>

              <div className="pt-4">
                <h3 className="text-xl font-semibold text-leafy-green-dark mb-3">Cultivation Technique</h3>
                <TechniqueBadge technique={project.technique} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

