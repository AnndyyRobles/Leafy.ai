"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Save } from "lucide-react"
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

interface NewProjectFormProps {
  formData: ProjectFormData
  onChange: (data: Partial<ProjectFormData>) => void
  onProjectCreated: (projectId: number) => void
}

export function NewProjectForm({ formData, onChange, onProjectCreated }: NewProjectFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [techniques, setTechniques] = useState<{ id: number; name: string; description: string }[]>([])

  // Fetch cultivation techniques from API
  useEffect(() => {
    const fetchTechniques = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/techniques`)
        setTechniques(response.data)
      } catch (error) {
        console.error("Error fetching techniques:", error)
        toast({
          title: "Error",
          description: "Failed to load cultivation techniques",
          variant: "destructive",
        })
      }
    }

    fetchTechniques()
  }, [])

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Project name is required"
    }

    if (!formData.width.trim()) {
      newErrors.width = "Width is required"
    } else if (isNaN(Number(formData.width))) {
      newErrors.width = "Width must be a number"
    }

    if (!formData.length.trim()) {
      newErrors.length = "Length is required"
    } else if (isNaN(Number(formData.length))) {
      newErrors.length = "Length must be a number"
    }

    if (!formData.height.trim()) {
      newErrors.height = "Height is required"
    } else if (isNaN(Number(formData.height))) {
      newErrors.height = "Height must be a number"
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    }

    if (!formData.technique_id) {
      newErrors.technique_id = "Please select a cultivation technique"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Get token from localStorage
      const token = localStorage.getItem("token")

      if (!token) {
        toast({
          title: "Authentication Error",
          description: "Please log in to create a project",
          variant: "destructive",
        })
        return
      }

      // Send project data to API
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/projects`, formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      toast({
        title: "Project created successfully!",
        description: "Your project has been saved. Now you can generate a 3D model.",
      })

      // Call the callback with the new project ID
      onProjectCreated(response.data.id)
    } catch (error) {
      console.error("Error creating project:", error)
      toast({
        title: "Error creating project",
        description: "There was an error creating your project. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Form fields remain the same */}

      {/* Cultivation Technique - Now populated from API */}
      <div className="space-y-2">
        <Label htmlFor="technique" className="text-leafy-green-dark">
          Cultivation Technique <span className="text-red-400">*</span>
        </Label>
        <Select
          value={formData.technique_id ? String(formData.technique_id) : ""}
          onValueChange={(value) => onChange({ technique_id: Number(value) })}
        >
          <SelectTrigger
            id="technique"
            className={`bg-leafy-beige-light/50 border-leafy-green-light/30 text-leafy-green-dark ${errors.technique_id ? "border-red-500" : ""}`}
          >
            <SelectValue placeholder="Select a technique" />
          </SelectTrigger>
          <SelectContent className="bg-white border-leafy-green-light/30 text-leafy-green-dark">
            {techniques.map((technique) => (
              <SelectItem key={technique.id} value={String(technique.id)}>
                {technique.name} - {technique.description}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.technique_id && <p className="text-sm text-red-400">{errors.technique_id}</p>}
      </div>

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-leafy-green-forest to-leafy-green-dark hover:from-leafy-green-dark hover:to-leafy-green-forest text-white"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating Project...
          </>
        ) : (
          <>
            <Save className="mr-2 h-4 w-4" />
            Create Project
          </>
        )}
      </Button>
    </form>
  )
}

