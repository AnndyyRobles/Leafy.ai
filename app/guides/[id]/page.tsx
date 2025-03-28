"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  Loader2,
  Droplets,
  Sun,
  SproutIcon,
  Leaf,
  Scissors,
  Info,
  ChevronRight,
  Calendar,
  Thermometer,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"

// Mock data - in a real app, this would come from your API
const PLANT_GUIDES = [
  {
    id: 1,
    common_name: "Lettuce",
    scientific_name: "Lactuca sativa",
    photo: "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=500&h=500&fit=crop",
    categories: ["Vegetables"],
    description:
      "Lettuce is a leafy green vegetable that is commonly used in salads, sandwiches, and other dishes. It's known for its crisp texture and refreshing taste. Lettuce is a cool-season crop that grows best in spring and fall in most regions.",
    germination:
      "Lettuce seeds germinate best in cool soil between 55-65°F (13-18°C). Sow seeds 1/8 inch deep. Seeds typically germinate in 7-10 days. For succession planting, sow new seeds every 2 weeks for a continuous harvest.",
    transplanting:
      "Transplant when seedlings have 3-4 true leaves, spacing plants 8-12 inches apart. For head lettuce, space plants 10-12 inches apart in rows 12-18 inches apart. Transplant on a cloudy day or in the evening to reduce transplant shock.",
    harvest:
      "Harvest outer leaves as needed or cut the entire plant at the base when mature. For leaf lettuce, harvest outer leaves when they reach 3-4 inches. For head lettuce, harvest when heads are firm and have reached full size.",
    watering:
      "Keep soil consistently moist but not waterlogged. Water at the base to avoid wet leaves which can lead to disease. Lettuce needs about 1-1.5 inches of water per week.",
    sunlight:
      "Partial sun to full sun depending on variety and climate. In hot climates, afternoon shade is beneficial to prevent bolting.",
    extra_care:
      "Protect from heat to prevent bolting. Provide afternoon shade in hot climates. Mulch around plants to keep soil cool and retain moisture. Watch for aphids and slugs, which are common pests for lettuce.",
    difficulty: "Easy",
    growing_season: "Spring, Fall",
    days_to_harvest: "45-55 days",
    companion_plants: ["Carrots", "Radishes", "Cucumbers"],
  },
  {
    id: 2,
    common_name: "Tomato",
    scientific_name: "Solanum lycopersicum",
    photo: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=500&h=500&fit=crop",
    categories: ["Vegetables", "Fruits"],
    description:
      "Tomatoes are the fruit of the plant Solanum lycopersicum, commonly known for their bright red color when ripe and their use in various cuisines worldwide. They come in many varieties, from small cherry tomatoes to large beefsteak varieties.",
    germination:
      "Start seeds indoors 6-8 weeks before the last frost date. Sow seeds 1/4 inch deep in warm soil (70-80°F). Seeds typically germinate in 5-10 days with proper conditions.",
    transplanting:
      "Transplant outdoors after all danger of frost has passed and soil has warmed. Plant deeply, burying 2/3 of the stem to encourage strong root development. Space plants 18-36 inches apart depending on variety.",
    harvest:
      "Harvest when fruits are fully colored but still firm. Twist gently or cut from the vine. For best flavor, store at room temperature rather than refrigerating.",
    watering:
      "Water deeply and regularly, about 1-2 inches per week. Consistent watering prevents blossom end rot and fruit cracking. Water at the base to keep foliage dry.",
    sunlight: "Full sun, at least 6-8 hours of direct sunlight daily for best production.",
    extra_care:
      "Stake or cage plants for support. Prune suckers for indeterminate varieties to improve air circulation and fruit production. Watch for common pests like hornworms and diseases like early blight.",
    difficulty: "Moderate",
    growing_season: "Summer",
    days_to_harvest: "60-85 days",
    companion_plants: ["Basil", "Marigolds", "Nasturtiums"],
  },
  {
    id: 3,
    common_name: "Spinach",
    scientific_name: "Spinacia oleracea",
    photo: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500&h=500&fit=crop",
    categories: ["Vegetables", "Leafy Greens"],
    description:
      "Spinach is a leafy green vegetable that is rich in nutrients and commonly used in salads, smoothies, and cooked dishes.",
    germination:
      "Spinach seeds germinate best in cool soil between 45-75°F (7-24°C). Sow seeds 1/2 inch deep and 2 inches apart.",
    transplanting:
      "Spinach doesn't transplant well, so direct sowing is recommended. If transplanting, do so carefully to avoid disturbing the roots.",
    harvest:
      "Harvest outer leaves when they reach 3-4 inches in length. For a full harvest, cut the entire plant about 1 inch above the soil.",
    watering: "Keep soil consistently moist. Spinach needs about 1-1.5 inches of water per week.",
    sunlight: "Partial shade to full sun. In hot climates, provide afternoon shade to prevent bolting.",
    extra_care:
      "Mulch to keep soil cool and moist. Watch for leaf miners and aphids. Spinach bolts quickly in hot weather, so plant in early spring or fall.",
    difficulty: "Easy",
    growing_season: "Spring, Fall",
    days_to_harvest: "40-45 days",
    companion_plants: ["Peas", "Strawberries", "Cauliflower"],
  },
  {
    id: 4,
    common_name: "Kale",
    scientific_name: "Brassica oleracea var. sabellica",
    photo: "https://images.unsplash.com/photo-1524179091875-bf99a9a6af57?w=500&h=500&fit=crop",
    categories: ["Vegetables", "Leafy Greens"],
    description:
      "Kale is a hardy leafy green vegetable with curly or flat leaves. It's highly nutritious and can be used in salads, smoothies, or cooked dishes.",
    germination: "Kale seeds germinate in soil temperatures between 45-85°F (7-29°C). Sow seeds 1/4 to 1/2 inch deep.",
    transplanting: "Transplant when seedlings have 4-5 true leaves, spacing plants 18-24 inches apart.",
    harvest: "Harvest outer leaves when they reach 8-10 inches in length. Kale becomes sweeter after light frost.",
    watering: "Water regularly, providing 1-1.5 inches of water per week. Consistent moisture produces tender leaves.",
    sunlight: "Full sun to partial shade. Can tolerate some shade, especially in hot climates.",
    extra_care:
      "Mulch to retain moisture and suppress weeds. Watch for cabbage worms and aphids. Kale is cold-hardy and can survive temperatures down to 20°F (-6°C).",
    difficulty: "Easy",
    growing_season: "Spring, Fall, Winter (in mild climates)",
    days_to_harvest: "50-65 days",
    companion_plants: ["Beets", "Celery", "Herbs"],
  },
  {
    id: 5,
    common_name: "Bell Pepper",
    scientific_name: "Capsicum annuum",
    photo: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=500&h=500&fit=crop",
    categories: ["Vegetables", "Fruits"],
    description:
      "Bell peppers are sweet, crunchy vegetables that come in various colors including green, red, yellow, and orange.",
    germination:
      "Start seeds indoors 8-10 weeks before the last frost date. Seeds germinate best at 70-85°F (21-29°C).",
    transplanting:
      "Transplant after all danger of frost has passed and soil has warmed to at least 65°F (18°C). Space plants 18-24 inches apart.",
    harvest:
      "Harvest when peppers reach full size and desired color. Green peppers will eventually turn red, yellow, or orange if left on the plant.",
    watering: "Water deeply and consistently, about 1-2 inches per week. Avoid overhead watering to prevent disease.",
    sunlight: "Full sun, at least 6-8 hours of direct sunlight daily.",
    extra_care:
      "Stake or cage plants for support as they can become top-heavy. Mulch to retain moisture and suppress weeds. Watch for aphids and pepper weevils.",
    difficulty: "Moderate",
    growing_season: "Summer",
    days_to_harvest: "60-90 days",
    companion_plants: ["Basil", "Onions", "Carrots"],
  },
]

export default function PlantGuidePage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [guide, setGuide] = useState<any>(null)
  const [activeSection, setActiveSection] = useState("overview")

  useEffect(() => {
    // Simulate API call to fetch plant guide by ID
    const timer = setTimeout(() => {
      const foundGuide = PLANT_GUIDES.find((g) => g.id.toString() === params.id)
      setGuide(foundGuide || null)
      setLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [params.id])

  const handleBack = () => {
    router.push("/guides")
  }

  // Get related plants (same categories as current plant)
  const getRelatedPlants = () => {
    if (!guide) return []

    return PLANT_GUIDES.filter(
      (p) => p.id !== guide.id && p.categories.some((cat) => guide.categories.includes(cat)),
    ).slice(0, 3)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-[#e6f5e6] to-[#f0f7f0]">
        <Loader2 className="h-8 w-8 text-leafy-green-dark animate-spin" />
      </div>
    )
  }

  if (!guide) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#e6f5e6] to-[#f0f7f0]">
        <h1 className="text-2xl font-bold text-leafy-green-dark mb-4">Plant guide not found</h1>
        <Button onClick={handleBack} className="bg-leafy-green-dark hover:bg-leafy-green-forest text-white">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Guides
        </Button>
      </div>
    )
  }

  const relatedPlants = getRelatedPlants()

  return (
    <>
      {/* No font import needed - using system fonts */}
      <div className="min-h-screen bg-gradient-to-b from-[#daf2d9] to-[#f0f9e2] relative overflow-hidden">
        {/* Elementos decorativos de fondo */}
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-gradient-to-br from-green-100/30 to-green-300/20 blur-3xl -z-10"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-gradient-to-tr from-yellow-100/20 to-green-200/30 blur-3xl -z-10"></div>
        <div className="absolute top-1/3 right-1/4 w-40 h-40 rounded-full bg-gradient-to-br from-emerald-100/20 to-teal-200/20 blur-2xl -z-10"></div>
        {/* Header with back button */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-leafy-green-light/90 to-leafy-green-forest/80 backdrop-blur-sm px-4 py-3 flex items-center shadow-sm">
          <Button onClick={handleBack} variant="ghost" size="sm" className="mr-2 text-white hover:bg-white/20">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold text-white">Plant Guide</h1>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-6">
          {/* Hero section with curved edges */}
          <div className="relative mb-8 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/90 to-green-700/90 rounded-3xl"></div>
            <div
              className="relative h-64 md:h-80 rounded-3xl overflow-hidden bg-cover bg-center"
              style={{ backgroundImage: `url(${guide.photo})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">{guide.common_name}</h1>
                <p className="text-lg italic text-white/80">{guide.scientific_name}</p>
              </div>
            </div>

            {/* Decorative leaf shapes */}
            <div className="absolute top-4 right-4 w-16 h-16 rounded-full bg-white/10 blur-md"></div>
            <div className="absolute bottom-8 right-12 w-24 h-24 rounded-full bg-white/10 blur-md"></div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left column - Content */}
            <div className="lg:w-2/3 order-2 lg:order-1">
              {/* Navigation tabs */}
              <div className="bg-white/90 backdrop-blur-sm rounded-full shadow-md mb-6 overflow-hidden border border-green-100">
                <div className="flex overflow-x-auto scrollbar-hide">
                  {["overview", "growing", "care", "harvesting", "similar"].map((section) => (
                    <button
                      key={section}
                      className={`px-6 py-3 text-sm font-medium whitespace-nowrap transition-all ${
                        activeSection === section
                          ? "bg-gradient-to-r from-emerald-500/20 to-green-500/30 text-emerald-800 font-semibold"
                          : "text-gray-600 hover:text-emerald-700 hover:bg-emerald-50"
                      }`}
                      onClick={() => setActiveSection(section)}
                    >
                      {section.charAt(0).toUpperCase() + section.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content sections */}

              <div className="bg-white backdrop-blur-sm rounded-3xl shadow-lg p-8 border border-gray-200 relative overflow-hidden">
                {/* Elementos decorativos del pizarrón */}
                <div className="absolute inset-0 bg-white"></div>
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDYwIEwgNjAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2UyZThlYiIgc3Ryb2tlLXdpZHRoPSIwLjUiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')]"></div>
                <div className="absolute top-0 left-0 w-full h-1 bg-leafy-green-light/20"></div>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-leafy-green-light/20"></div>
                <div className="absolute left-0 top-0 w-1 h-full bg-leafy-green-light/20"></div>
                <div className="absolute right-0 top-0 w-1 h-full bg-leafy-green-light/20"></div>

                {/* Elementos de decoración de pizarrón */}
                <div className="absolute top-2 left-2 w-4 h-4 rounded-full bg-leafy-green-light/30"></div>
                <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-leafy-green-light/30"></div>
                <div className="absolute bottom-2 left-2 w-4 h-4 rounded-full bg-leafy-green-light/30"></div>
                <div className="absolute bottom-2 right-2 w-4 h-4 rounded-full bg-leafy-green-light/30"></div>

                {/* Contenido relativo para que aparezca por encima de los elementos decorativos */}
                <div className="relative z-10">
                  {/* Overview Section */}
                  {activeSection === "overview" && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                      <h2 className="text-2xl font-bold text-leafy-green-forest mb-6 relative before:content-[''] before:absolute before:-bottom-2 before:left-0 before:w-24 before:h-1 before:bg-leafy-green-light/50">
                        Overview
                      </h2>
                      <p className="text-gray-700 leading-relaxed mb-8">{guide.description}</p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                        <div className="bg-leafy-beige-light/30 rounded-3xl p-6 shadow-sm border border-leafy-green-light/20 hover:border-leafy-green-light/40 transition-all">
                          <div className="flex items-center mb-4">
                            <div className="bg-leafy-green-light rounded-full p-3 mr-4 shadow-sm">
                              <SproutIcon className="h-6 w-6 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-leafy-green-forest">Easy to Grow</h3>
                          </div>
                          <p className="text-sm text-gray-600">Perfect for beginners with simple care requirements.</p>
                        </div>

                        <div className="bg-leafy-beige-light/30 rounded-3xl p-6 shadow-sm border border-leafy-green-light/20 hover:border-leafy-green-light/40 transition-all">
                          <div className="flex items-center mb-4">
                            <div className="bg-leafy-green-light rounded-full p-3 mr-4 shadow-sm">
                              <Calendar className="h-6 w-6 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-leafy-green-forest">Quick Harvest</h3>
                          </div>
                          <p className="text-sm text-gray-600">From seed to harvest in {guide.days_to_harvest}.</p>
                        </div>

                        <div className="bg-leafy-beige-light/30 rounded-3xl p-6 shadow-sm border border-leafy-green-light/20 hover:border-leafy-green-light/40 transition-all">
                          <div className="flex items-center mb-4">
                            <div className="bg-leafy-green-light rounded-full p-3 mr-4 shadow-sm">
                              <Leaf className="h-6 w-6 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-leafy-green-forest">Nutritious</h3>
                          </div>
                          <p className="text-sm text-gray-600">Rich in vitamins and minerals for a healthy diet.</p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Growing Section */}
                  {activeSection === "growing" && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                      <h2 className="text-2xl font-bold text-leafy-green-forest mb-6 relative before:content-[''] before:absolute before:-bottom-2 before:left-0 before:w-24 before:h-1 before:bg-leafy-green-light/50">
                        Growing Guide
                      </h2>

                      <div className="space-y-8">
                        <div className="flex">
                          <div className="flex-shrink-0 mr-6">
                            <div className="bg-leafy-green-light/50 rounded-full p-3 shadow-sm">
                              <SproutIcon className="h-6 w-6 text-leafy-green-forest" />
                            </div>
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-leafy-green-forest mb-3">Germination</h3>
                            <p className="text-gray-700 leading-relaxed">{guide.germination}</p>
                          </div>
                        </div>

                        <div className="flex">
                          <div className="flex-shrink-0 mr-6">
                            <div className="bg-leafy-green-light/50 rounded-full p-3 shadow-sm">
                              <Leaf className="h-6 w-6 text-leafy-green-forest" />
                            </div>
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-leafy-green-forest mb-3">Transplanting</h3>
                            <p className="text-gray-700 leading-relaxed">{guide.transplanting}</p>
                          </div>
                        </div>

                        <div className="bg-leafy-beige-light/30 rounded-3xl p-6 mt-8 border border-leafy-green-light/20">
                          <h3 className="text-lg font-semibold text-leafy-green-forest mb-3">Pro Tips</h3>
                          <ul className="list-disc pl-5 space-y-2 text-gray-700">
                            <li>Start seeds indoors for a head start on the growing season</li>
                            <li>Use a seed-starting mix for better germination rates</li>
                            <li>Harden off seedlings before transplanting outdoors</li>
                            <li>Plant in succession for continuous harvests</li>
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Care Section */}
                  {activeSection === "care" && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                      <h2 className="text-2xl font-bold text-leafy-green-forest mb-6 relative before:content-[''] before:absolute before:-bottom-2 before:left-0 before:w-24 before:h-1 before:bg-leafy-green-light/50">
                        Care Guide
                      </h2>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div className="bg-leafy-beige-light/30 rounded-3xl p-6 border border-leafy-green-light/20">
                          <div className="flex items-center mb-4">
                            <div className="bg-leafy-green-light rounded-full p-3 mr-4 shadow-sm">
                              <Droplets className="h-6 w-6 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-leafy-green-forest">Watering</h3>
                          </div>
                          <p className="text-gray-700">{guide.watering}</p>
                        </div>

                        <div className="bg-leafy-beige-light/30 rounded-3xl p-6 border border-leafy-green-light/20">
                          <div className="flex items-center mb-4">
                            <div className="bg-leafy-green-light rounded-full p-3 mr-4 shadow-sm">
                              <Sun className="h-6 w-6 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-leafy-green-forest">Sunlight</h3>
                          </div>
                          <p className="text-gray-700">{guide.sunlight}</p>
                        </div>
                      </div>

                      <div className="flex">
                        <div className="flex-shrink-0 mr-6">
                          <div className="bg-leafy-green-light/50 rounded-full p-3 shadow-sm">
                            <Info className="h-6 w-6 text-leafy-green-forest" />
                          </div>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-leafy-green-forest mb-3">Extra Care Tips</h3>
                          <p className="text-gray-700 leading-relaxed">{guide.extra_care}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Harvesting Section */}
                  {activeSection === "harvesting" && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                      <h2 className="text-2xl font-bold text-leafy-green-forest mb-6 relative before:content-[''] before:absolute before:-bottom-2 before:left-0 before:w-24 before:h-1 before:bg-leafy-green-light/50">
                        Harvesting
                      </h2>

                      <div className="flex mb-8">
                        <div className="flex-shrink-0 mr-6">
                          <div className="bg-leafy-green-light/50 rounded-full p-3 shadow-sm">
                            <Scissors className="h-6 w-6 text-leafy-green-forest" />
                          </div>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-leafy-green-forest mb-3">
                            When and How to Harvest
                          </h3>
                          <p className="text-gray-700 leading-relaxed">{guide.harvest}</p>
                        </div>
                      </div>

                      <div className="bg-leafy-beige-light/30 rounded-3xl p-6 border border-leafy-green-light/20">
                        <h3 className="text-lg font-semibold text-leafy-green-forest mb-3">Harvesting Timeline</h3>
                        <div className="relative pt-1">
                          <div className="flex mb-2 items-center justify-between">
                            <div>
                              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-leafy-green-forest bg-white">
                                Planting
                              </span>
                            </div>
                            <div>
                              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-leafy-green-forest bg-white">
                                Harvest Ready
                              </span>
                            </div>
                          </div>
                          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-white">
                            <div
                              style={{ width: "100%" }}
                              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-leafy-green-light to-leafy-green-forest rounded-full"
                            ></div>
                          </div>
                          <div className="flex justify-between text-xs text-gray-600">
                            <span>Day 0</span>
                            <span>Day {guide.days_to_harvest.split("-")[0]}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Similar Plants Section */}
                  {activeSection === "similar" && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                      <h2 className="text-2xl font-bold text-leafy-green-forest mb-6 relative before:content-[''] before:absolute before:-bottom-2 before:left-0 before:w-24 before:h-1 before:bg-leafy-green-light/50">
                        Similar Plants
                      </h2>

                      {relatedPlants.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {relatedPlants.map((plant) => (
                            <div
                              key={plant.id}
                              className="bg-leafy-beige-light/30 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer group border border-leafy-green-light/20"
                              onClick={() => router.push(`/guides/${plant.id}`)}
                            >
                              <div className="h-48 overflow-hidden">
                                <img
                                  src={plant.photo || "/placeholder.svg"}
                                  alt={plant.common_name}
                                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                              </div>
                              <div className="p-4">
                                <div className="flex flex-wrap gap-1 mb-2">
                                  {plant.categories.map((category: string) => (
                                    <Badge key={category} className="bg-white text-leafy-green-forest text-xs">
                                      {category}
                                    </Badge>
                                  ))}
                                </div>
                                <h3 className="font-semibold text-leafy-green-forest">{plant.common_name}</h3>
                                <p className="text-sm text-gray-500 italic">{plant.scientific_name}</p>
                                <div className="flex items-center mt-2 text-xs text-gray-600">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  <span>{plant.days_to_harvest}</span>
                                  <span className="mx-2">•</span>
                                  <Sun className="h-3 w-3 mr-1" />
                                  <span>{plant.difficulty}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="bg-leafy-beige-light/30 rounded-3xl p-6 text-center border border-leafy-green-light/20">
                          <p className="text-gray-600">No similar plants found in our database.</p>
                        </div>
                      )}

                      <div className="mt-8 p-6 bg-leafy-beige-light/30 rounded-3xl border border-leafy-green-light/20">
                        <h3 className="text-lg font-semibold text-leafy-green-forest mb-3">Why Grow Similar Plants?</h3>
                        <p className="text-gray-700 mb-4">
                          Growing similar plants together can help with companion planting, crop rotation, and creating
                          a diverse garden ecosystem. Plants in the same family often have similar care requirements and
                          can be grown together efficiently.
                        </p>
                        <Button
                          onClick={() => router.push("/guides")}
                          className="bg-white text-leafy-green-forest hover:bg-gray-50 rounded-full"
                        >
                          Explore All Plants
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>

            {/* Right column - Quick facts */}
            <div className="lg:w-1/3 order-1 lg:order-2">
              <div className="sticky top-20">
                <div className="bg-white backdrop-blur-sm rounded-lg shadow-md overflow-hidden mb-6 border-r border-b border-leafy-green-light/30 relative">
                  {/* Espiral de libreta */}
                  <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-leafy-green-forest to-leafy-green-dark flex flex-col items-center justify-around py-4">
                    {[...Array(12)].map((_, i) => (
                      <div
                        key={i}
                        className="w-4 h-4 rounded-full bg-white shadow-inner border border-leafy-green-olive"
                      ></div>
                    ))}
                  </div>
                  {/* Título de la libreta */}
                  <div className="bg-leafy-green-light/30 border-b border-leafy-green-light/50 pl-10 pr-4 py-3 flex justify-between items-center">
                    <h3 className="text-lg text-leafy-green-forest font-semibold">Plant Care Notes</h3>
                    <span className="text-xs text-leafy-green-forest font-medium px-2 py-1 bg-white rounded-full border border-leafy-green-light">
                      Important
                    </span>
                  </div>
                  <div className="p-6 pl-10 bg-white">
                    <div className="space-y-6 relative">
                      {/* Cinta adhesiva decorativa */}
                      <div className="absolute -right-2 -top-2 w-20 h-6 bg-leafy-green-light/30 rotate-12 shadow-sm"></div>
                      <div className="flex items-center justify-between pb-3 border-b border-dashed border-leafy-green-light">
                        <div className="flex items-center">
                          <div className="p-2 rounded-full bg-leafy-green-light/20 mr-2">
                            <Calendar className="h-5 w-5 text-leafy-green-forest" />
                          </div>
                          <span className="text-base font-medium text-gray-700">Growing Season:</span>
                        </div>
                        <span className="text-base font-bold text-leafy-green-forest">{guide.growing_season}</span>
                      </div>

                      <div className="flex items-center justify-between pb-3 border-b border-dashed border-leafy-green-light">
                        <div className="flex items-center">
                          <div className="p-2 rounded-full bg-leafy-green-light/20 mr-2">
                            <Scissors className="h-5 w-5 text-leafy-green-forest" />
                          </div>
                          <span className="text-base font-medium text-gray-700">Days to Harvest:</span>
                        </div>
                        <span className="text-base font-bold text-leafy-green-forest">{guide.days_to_harvest}</span>
                      </div>

                      <div className="flex items-center justify-between pb-3 border-b border-dashed border-leafy-green-light">
                        <div className="flex items-center">
                          <div className="p-2 rounded-full bg-leafy-green-light/20 mr-2">
                            <Thermometer className="h-5 w-5 text-leafy-green-forest" />
                          </div>
                          <span className="text-base font-medium text-gray-700">Difficulty:</span>
                        </div>
                        <span className="text-base font-bold text-leafy-green-forest">{guide.difficulty}</span>
                      </div>

                      <div className="flex items-center justify-between pb-3 border-b border-dashed border-leafy-green-light">
                        <div className="flex items-center">
                          <div className="p-2 rounded-full bg-leafy-green-light/20 mr-2">
                            <Droplets className="h-5 w-5 text-leafy-green-forest" />
                          </div>
                          <span className="text-base font-medium text-gray-700">Water Needs:</span>
                        </div>
                        <span className="text-base font-bold text-leafy-green-forest">Regular</span>
                      </div>

                      <div className="flex items-center justify-between pb-3 border-b border-dashed border-leafy-green-light">
                        <div className="flex items-center">
                          <div className="p-2 rounded-full bg-leafy-green-light/20 mr-2">
                            <Sun className="h-5 w-5 text-leafy-green-forest" />
                          </div>
                          <span className="text-base font-medium text-gray-700">Sunlight:</span>
                        </div>
                        <span className="text-base font-bold text-leafy-green-forest">Partial to Full</span>
                      </div>
                      {/* Nota adhesiva */}
                      <div className="mt-6 bg-leafy-beige-light p-3 rotate-1 shadow-sm border border-leafy-green-light/30 relative">
                        <p className="text-sm text-gray-700">
                          Remember to check local climate conditions before planting!
                        </p>
                        <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-leafy-beige-very-light rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  {/* Esquina doblada */}
                  <div className="absolute bottom-0 right-0 w-0 h-0 border-b-[20px] border-r-[20px] border-b-leafy-green-light/30 border-r-leafy-beige-light/50"></div>
                </div>

                {/* Decorative element */}
                <div className="hidden lg:block relative h-40 overflow-hidden rounded-3xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-green-600 opacity-90 rounded-3xl"></div>
                  <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-yellow-300/30"></div>
                  <div className="absolute top-4 left-4 w-20 h-20 rounded-full bg-white/20"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                    <SproutIcon className="h-12 w-12 mx-auto mb-2 text-white drop-shadow-md" />
                    <p className="text-sm font-bold text-white drop-shadow-md">Cultivate Sustainably</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

