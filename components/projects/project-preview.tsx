"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, Save, RefreshCw, Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import axios from "axios"

interface ProjectFormData {
  name: string
  width: string
  length: string
  height: string
  location: string
  city: string
  description: string
  technique_id: number
}

interface ProjectPreviewProps {
  formData: ProjectFormData
  projectId: number | null
}

// Cultivation techniques mapping
const TECHNIQUES = {
  1: "Vertical",
  2: "Wall-mounted",
  3: "Hydroponics",
  4: "Recycled Materials",
  5: "Aquaponics",
}

export function ProjectPreview({ formData, projectId }: ProjectPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isModelGenerated, setIsModelGenerated] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [modelUrl, setModelUrl] = useState<string | null>(null)
  const [modelBlob, setModelBlob] = useState<Blob | null>(null)

  // Generate 3D model
  const generateModel = async () => {
    if (!projectId) {
      toast({
        title: "Save project first",
        description: "Please save your project before generating a 3D model.",
        variant: "destructive",
      })
      return
    }

    if (!formData.name || !formData.width || !formData.length || !formData.height || !formData.technique_id) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields to generate the 3D model.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    try {
      // Get token from localStorage
      const token = localStorage.getItem("token")

      if (!token) {
        toast({
          title: "Authentication Error",
          description: "Please log in to generate a model",
          variant: "destructive",
        })
        return
      }

      // Call the model generation API
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/projects/${projectId}/generate-model`,
        {
          width: formData.width,
          length: formData.length,
          height: formData.height,
          technique_id: formData.technique_id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob", // Important for receiving binary data
        },
      )

      // Create a URL for the blob
      const url = URL.createObjectURL(response.data)
      setModelUrl(url)
      setModelBlob(response.data)
      setIsModelGenerated(true)

      toast({
        title: "3D model generated",
        description: "Your 3D model has been successfully generated.",
      })
    } catch (error) {
      console.error("Error generating model:", error)
      toast({
        title: "Error generating model",
        description: "There was an error generating your 3D model. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  // Reset the model but keep form data
  const resetModel = () => {
    if (modelUrl) {
      URL.revokeObjectURL(modelUrl)
    }
    setIsModelGenerated(false)
    setModelUrl(null)
    setModelBlob(null)
  }

  // Save the project with the model
  const saveProject = async () => {
    if (!projectId || !modelBlob) {
      toast({
        title: "Generate model first",
        description: "Please generate a 3D model before saving the project.",
        variant: "destructive",
      })
      return
    }

    try {
      // Get token from localStorage
      const token = localStorage.getItem("token")

      if (!token) {
        toast({
          title: "Authentication Error",
          description: "Please log in to save your project",
          variant: "destructive",
        })
        return
      }

      // Create form data for file upload
      const formData = new FormData()
      formData.append("model", modelBlob, `${projectId}-model.glb`)

      // Upload the model
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/${projectId}/model`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })

      toast({
        title: "Project saved",
        description: "Your project and 3D model have been successfully saved.",
      })
    } catch (error) {
      console.error("Error saving project:", error)
      toast({
        title: "Error saving project",
        description: "There was an error saving your project. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Download the model
  const downloadModel = () => {
    if (!modelUrl || !modelBlob) return

    const link = document.createElement("a")
    link.href = modelUrl
    link.download = `${formData.name.replace(/\s+/g, "-").toLowerCase()}-3d-model.glb`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Download started",
      description: "Your 3D model download has started.",
    })
  }

  // Simple 3D preview using canvas
  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (!isModelGenerated && !isGenerating) {
      // Show placeholder when no model is generated
      ctx.fillStyle = "#f5f3e8" // Leafy beige light background
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.font = "16px Arial"
      ctx.fillStyle = "#2D6A4F" // Leafy green forest text
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText("Click 'Generate 3D Model' to preview", canvas.width / 2, canvas.height / 2)
      return
    }

    if (isGenerating) {
      // Show loading state
      ctx.fillStyle = "#f5f3e8" // Leafy beige light background
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.font = "16px Arial"
      ctx.fillStyle = "#2D6A4F" // Leafy green forest text
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText("Generating 3D model...", canvas.width / 2, canvas.height / 2)
      return
    }

    // Set dimensions based on form data
    const width = Number(formData.width) || 100
    const length = Number(formData.length) || 100
    const height = Number(formData.height) || 200

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

    // Adjust colors based on selected technique
    switch (formData.technique_id) {
      case 1: // Vertical
        colors = { top: "#8BC34A", left: "#689F38", right: "#558B2F" }
        break
      case 2: // Wall-mounted
        colors = { top: "#4CAF50", left: "#388E3C", right: "#2E7D32" }
        break
      case 3: // Hydroponics
        colors = { top: "#03A9F4", left: "#0288D1", right: "#0277BD" }
        break
      case 4: // Recycled Materials
        colors = { top: "#9C27B0", left: "#7B1FA2", right: "#6A1B9A" }
        break
      case 5: // Aquaponics
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
    ctx.fillStyle = "#fff" // White text for better visibility on dark background
    ctx.textAlign = "center"
    ctx.textBaseline = "top"
    ctx.fillText(
      TECHNIQUES[formData.technique_id as keyof typeof TECHNIQUES] || "No technique selected",
      0,
      (height * scale) / 2 + (length * scale) / 2 + 10,
    )

    ctx.restore()
  }, [formData, isModelGenerated, isGenerating, projectId])

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-xl font-semibold text-leafy-green-forest mb-4">3D Model Preview</h2>

      <div className="bg-leafy-beige-light/50 rounded-lg flex-1 flex flex-col p-4">
        {/* Canvas for 3D preview */}
        <div className="flex-1 flex items-center justify-center mb-4">
          <canvas
            ref={canvasRef}
            width={500}
            height={400}
            className="w-full h-full max-h-[400px] bg-white rounded border border-leafy-green-light/30"
          />
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {!isModelGenerated ? (
            <Button
              onClick={generateModel}
              disabled={isGenerating || !projectId}
              className="col-span-1 sm:col-span-3 bg-leafy-green-forest hover:bg-leafy-green-dark text-white"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating 3D Model...
                </>
              ) : (
                "Generate 3D Model"
              )}
            </Button>
          ) : (
            <>
              <Button onClick={downloadModel} className="bg-leafy-green-forest hover:bg-leafy-green-dark text-white">
                <Download className="mr-2 h-4 w-4" />
                Download Model
              </Button>

              <Button onClick={saveProject} className="bg-leafy-green-forest hover:bg-leafy-green-dark text-white">
                <Save className="mr-2 h-4 w-4" />
                Save Project
              </Button>

              <Button
                onClick={resetModel}
                variant="outline"
                className="border-leafy-green-light text-leafy-green-forest hover:bg-leafy-beige-green-light/30"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset Model
              </Button>
            </>
          )}
        </div>
      </div>

      <p className="text-sm text-leafy-green-dark/70 mt-2 text-center">
        {isModelGenerated
          ? "Your 3D model has been generated. You can download it or save your project."
          : projectId
            ? "Click 'Generate 3D Model' to preview your project."
            : "Save your project first, then generate a 3D model."}
      </p>
    </div>
  )
}

