"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Upload } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

// Plant categories from the database
const PLANT_CATEGORIES = [
  { id: 1, name: "Bulbs" },
  { id: 2, name: "Herbs" },
  { id: 3, name: "Vegetables" },
  { id: 4, name: "Fruits" },
]

interface ContributeGuideDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function ContributeGuideDialog({ isOpen, onClose }: ContributeGuideDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    common_name: "",
    scientific_name: "",
    category_id: "",
    description: "",
    germination: "",
    transplanting: "",
    harvest: "",
    extra_care: "",
    photo: null as File | null,
    watering_photo: null as File | null,
    sunlight_photo: null as File | null,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, [fieldName]: e.target.files?.[0] || null }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Guide submitted successfully",
        description: "Thank you for your contribution! Your guide will be reviewed by our team.",
      })

      onClose()
      // Reset form
      setFormData({
        common_name: "",
        scientific_name: "",
        category_id: "",
        description: "",
        germination: "",
        transplanting: "",
        harvest: "",
        extra_care: "",
        photo: null,
        watering_photo: null,
        sunlight_photo: null,
      })
    } catch (error) {
      toast({
        title: "Error submitting guide",
        description: "There was an error submitting your guide. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Contribute a Plant Guide</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Common Name */}
            <div className="space-y-2">
              <Label htmlFor="common_name" className="text-leafy-green-dark">
                Common Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="common_name"
                name="common_name"
                value={formData.common_name}
                onChange={handleChange}
                required
                className="border-leafy-green-light/30 focus:ring-leafy-green-light"
              />
            </div>

            {/* Scientific Name */}
            <div className="space-y-2">
              <Label htmlFor="scientific_name" className="text-leafy-green-dark">
                Scientific Name
              </Label>
              <Input
                id="scientific_name"
                name="scientific_name"
                value={formData.scientific_name}
                onChange={handleChange}
                className="border-leafy-green-light/30 focus:ring-leafy-green-light"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category_id" className="text-leafy-green-dark">
                Category <span className="text-red-500">*</span>
              </Label>
              <Select value={formData.category_id} onValueChange={(value) => handleSelectChange("category_id", value)}>
                <SelectTrigger id="category_id" className="border-leafy-green-light/30 focus:ring-leafy-green-light">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {PLANT_CATEGORIES.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Plant Photo */}
            <div className="space-y-2">
              <Label htmlFor="photo" className="text-leafy-green-dark">
                Plant Photo <span className="text-red-500">*</span>
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "photo")}
                  required
                  className="flex-1 border-leafy-green-light/30 focus:ring-leafy-green-light"
                />
                {formData.photo && (
                  <div className="h-10 w-10 rounded-md overflow-hidden bg-leafy-beige-light border border-leafy-green-light/30">
                    <img
                      src={URL.createObjectURL(formData.photo) || "/placeholder.svg"}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-leafy-green-dark">
              Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              required
              className="border-leafy-green-light/30 focus:ring-leafy-green-light"
            />
          </div>

          {/* Germination */}
          <div className="space-y-2">
            <Label htmlFor="germination" className="text-leafy-green-dark">
              Germination <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="germination"
              name="germination"
              value={formData.germination}
              onChange={handleChange}
              rows={3}
              required
              className="border-leafy-green-light/30 focus:ring-leafy-green-light"
            />
          </div>

          {/* Transplanting */}
          <div className="space-y-2">
            <Label htmlFor="transplanting" className="text-leafy-green-dark">
              Transplanting <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="transplanting"
              name="transplanting"
              value={formData.transplanting}
              onChange={handleChange}
              rows={3}
              required
              className="border-leafy-green-light/30 focus:ring-leafy-green-light"
            />
          </div>

          {/* Harvest */}
          <div className="space-y-2">
            <Label htmlFor="harvest" className="text-leafy-green-dark">
              Harvesting <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="harvest"
              name="harvest"
              value={formData.harvest}
              onChange={handleChange}
              rows={3}
              required
              className="border-leafy-green-light/30 focus:ring-leafy-green-light"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Watering Photo */}
            <div className="space-y-2">
              <Label htmlFor="watering_photo" className="text-leafy-green-dark">
                Watering Instructions Photo <span className="text-red-500">*</span>
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="watering_photo"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "watering_photo")}
                  required
                  className="flex-1 border-leafy-green-light/30 focus:ring-leafy-green-light"
                />
                {formData.watering_photo && (
                  <div className="h-10 w-10 rounded-md overflow-hidden bg-leafy-beige-light border border-leafy-green-light/30">
                    <img
                      src={URL.createObjectURL(formData.watering_photo) || "/placeholder.svg"}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Sunlight Photo */}
            <div className="space-y-2">
              <Label htmlFor="sunlight_photo" className="text-leafy-green-dark">
                Sunlight Requirements Photo <span className="text-red-500">*</span>
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="sunlight_photo"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "sunlight_photo")}
                  required
                  className="flex-1 border-leafy-green-light/30 focus:ring-leafy-green-light"
                />
                {formData.sunlight_photo && (
                  <div className="h-10 w-10 rounded-md overflow-hidden bg-leafy-beige-light border border-leafy-green-light/30">
                    <img
                      src={URL.createObjectURL(formData.sunlight_photo) || "/placeholder.svg"}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Extra Care */}
          <div className="space-y-2">
            <Label htmlFor="extra_care" className="text-leafy-green-dark">
              Extra Care <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="extra_care"
              name="extra_care"
              value={formData.extra_care}
              onChange={handleChange}
              rows={3}
              required
              className="border-leafy-green-light/30 focus:ring-leafy-green-light"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="border-leafy-green-dark text-leafy-green-dark hover:bg-leafy-green-light/20"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-leafy-green-dark hover:bg-leafy-green-forest text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Submit Guide
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

