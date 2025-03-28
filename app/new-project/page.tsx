"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { NewProjectForm } from "@/components/projects/new-project-form"
import { ProjectPreview } from "@/components/projects/project-preview"
import { ChevronDown, Leaf, Sparkles, Sprout, Flower2, Droplets } from "lucide-react"

// Project types with descriptions - now just for display, not selection
const PROJECT_TYPES = [
  {
    id: 1,
    name: "Vertical Garden",
    description: "Transform your walls into living ecosystems",
    modelUrl: "/models/vertical-garden.glb",
    icon: Leaf,
    color: "bg-gradient-to-br from-emerald-500 to-green-700",
    borderColor: "border-emerald-400",
  },
  {
    id: 2,
    name: "Hydroponic System",
    description: "Grow plants without soil using water-based nutrients",
    modelUrl: "/models/hydroponic.glb",
    icon: Droplets,
    color: "bg-gradient-to-br from-sky-500 to-blue-700",
    borderColor: "border-sky-400",
  },
  {
    id: 3,
    name: "Recycled Containers",
    description: "Sustainable gardening using repurposed materials",
    modelUrl: "/models/recycled.glb",
    icon: Sprout,
    color: "bg-gradient-to-br from-amber-500 to-orange-700",
    borderColor: "border-amber-400",
  },
  {
    id: 4,
    name: "Wall-mounted Planters",
    description: "Space-efficient solutions for urban gardeners",
    modelUrl: "/models/wall-planter.glb",
    icon: Flower2,
    color: "bg-gradient-to-br from-teal-500 to-cyan-700",
    borderColor: "border-teal-400",
  },
  {
    id: 5,
    name: "Aquaponic Setup",
    description: "Combine fish farming with plant cultivation",
    modelUrl: "/models/aquaponic.glb",
    icon: Sparkles,
    color: "bg-gradient-to-br from-purple-500 to-indigo-700",
    borderColor: "border-purple-400",
  },
]

// For demo purposes, we'll use placeholder models
// In a real app, you would use actual .glb files
const PLACEHOLDER_MODELS = [
  "/placeholder.svg?height=200&width=200",
  "/placeholder.svg?height=200&width=200",
  "/placeholder.svg?height=200&width=200",
  "/placeholder.svg?height=200&width=200",
  "/placeholder.svg?height=200&width=200",
]

export default function NewProjectPage() {
  const [showForm, setShowForm] = useState(false)
  const formRef = useRef(null)
  const [formData, setFormData] = useState({
    name: "",
    width: "",
    length: "",
    height: "",
    location: "Indoor",
    city: "",
    description: "",
    technique_id: 0,
  })

  const handleFormChange = (updatedData: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...updatedData }))
  }

  const scrollToForm = () => {
    setShowForm(true)
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth" })
    }, 100)
  }

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      {/* Welcome Section - Completely redesigned */}
      <section className="min-h-screen relative flex flex-col items-center justify-center px-4 py-16">
        {/* Creative background with leafy colors */}
        <div className="absolute inset-0 bg-leafy-beige-light z-0">
          {/* Abstract pattern overlay */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%232D6A4F' fillOpacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4H-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
            }}
          ></div>
        </div>

        {/* Leafy gradient overlays */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-leafy-green-forest/30 rounded-full filter blur-[100px] transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-leafy-green-light/30 rounded-full filter blur-[120px] transform translate-x-1/4 translate-y-1/4"></div>
          <div className="absolute top-1/2 right-1/4 w-1/4 h-1/4 bg-leafy-green-olive/30 rounded-full filter blur-[80px]"></div>
          <div className="absolute bottom-1/4 left-1/3 w-1/3 h-1/3 bg-leafy-beige-green-light/40 rounded-full filter blur-[100px]"></div>
        </div>

        {/* Content */}
        <div className="z-10 text-center mb-16 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="inline-flex items-center justify-center px-4 py-1 mb-6 bg-leafy-green-forest/80 backdrop-blur-sm rounded-full text-white text-sm font-medium">
              <Sparkles className="h-4 w-4 mr-2" />
              <span>DESIGN • GROW • FLOURISH</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-leafy-green-forest mb-6 tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-leafy-green-forest via-leafy-green-dark to-leafy-green-olive">
                Garden Visionary
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-leafy-green-dark max-w-3xl mx-auto">
              Transform your ideas into living ecosystems with our botanical project creator
            </p>
          </motion.div>
        </div>

        {/* Static Project Type Display - Horizontal Grid (just for display, not selection) */}
        <div className="w-full max-w-7xl mx-auto z-10 px-4 mb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {PROJECT_TYPES.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`rounded-xl overflow-hidden shadow-xl border-2 ${project.borderColor} transition-all duration-300`}
              >
                <div className={`h-full ${project.color}`}>
                  <div className="p-4 flex flex-col h-full">
                    {/* Project Icon */}
                    <div className="mb-2 text-white">
                      <project.icon className="h-8 w-8" />
                    </div>

                    {/* Project Name */}
                    <h3 className="font-bold text-xl text-white mb-2">{project.name}</h3>

                    {/* Project Description */}
                    <p className="text-white/90 text-sm mb-4">{project.description}</p>

                    {/* Project Image */}
                    <div className="mt-auto mx-auto">
                      <img
                        src={PLACEHOLDER_MODELS[index] || "/placeholder.svg"}
                        alt={project.name}
                        className="w-full h-auto object-contain"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Start Button - More creative */}
        <motion.button
          onClick={scrollToForm}
          className="z-10 relative overflow-hidden group bg-leafy-green-forest/80 backdrop-blur-md hover:bg-leafy-green-forest text-white px-12 py-5 rounded-full font-bold text-xl shadow-xl flex items-center gap-3 transition-all border border-leafy-green-light/30"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <span className="relative z-10">Start Creating</span>
          <ChevronDown className="h-6 w-6 animate-bounce relative z-10" />
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-leafy-green-dark to-leafy-green-forest opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></div>
        </motion.button>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-leafy-green-forest"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <p className="text-sm mb-2">Scroll down to begin</p>
          <ChevronDown className="h-5 w-5 animate-bounce" />
        </motion.div>
      </section>

      {/* Form Section */}
      <AnimatePresence>
        {showForm && (
          <motion.section
            ref={formRef}
            className="min-h-screen py-16 px-6 bg-gradient-to-b from-leafy-beige-light to-leafy-beige-green-light"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <header className="max-w-7xl mx-auto mb-12">
              <div className="inline-block px-4 py-1 bg-leafy-green-forest/80 text-white rounded-full text-sm font-medium mb-4">
                Create Your Project
              </div>
              <h2 className="text-4xl font-bold text-leafy-green-forest mb-4">Customize Your Vision</h2>
              <p className="text-leafy-green-dark max-w-2xl text-lg">
                Define every detail of your project and our system will generate a 3D model based on your
                specifications.
              </p>
            </header>

            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Form Section */}
                <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-2xl p-8 border border-leafy-green-light/30">
                  <NewProjectForm formData={formData} onChange={handleFormChange} />
                </div>

                {/* Preview Section - Keeping the original functionality */}
                <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-2xl p-8 border border-leafy-green-light/30">
                  <ProjectPreview formData={formData} />
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  )
}

