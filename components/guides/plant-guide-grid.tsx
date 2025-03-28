"use client"

import { useState, useEffect } from "react"
import { PlantGuideCard } from "./plant-guide-card"
import { Loader2 } from "lucide-react"

// Mock data for plant guides
const PLANT_GUIDES = [
  {
    id: 1,
    common_name: "Lettuce",
    scientific_name: "Lactuca sativa",
    photo: "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=500&h=500&fit=crop",
    categories: ["Vegetables"],
    description: "Lettuce is a leafy green vegetable that is commonly used in salads, sandwiches, and other dishes.",
    germination: "Lettuce seeds germinate best in cool soil between 55-65°F (13-18°C). Sow seeds 1/8 inch deep.",
    transplanting: "Transplant when seedlings have 3-4 true leaves, spacing plants 8-12 inches apart.",
    harvest: "Harvest outer leaves as needed or cut the entire plant at the base when mature.",
    watering: "https://images.unsplash.com/photo-1563299796-17596ed6b017?w=200&h=200&fit=crop",
    sunlight: "https://images.unsplash.com/photo-1620228885847-9eab2a1adddc?w=200&h=200&fit=crop",
    extra_care: "Protect from heat to prevent bolting. Provide afternoon shade in hot climates.",
  },
  {
    id: 2,
    common_name: "Strawberry",
    scientific_name: "Fragaria × ananassa",
    photo: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=500&h=500&fit=crop",
    categories: ["Fruits"],
    description: "Strawberries are sweet, red fruits with seeds on the outside. They're popular in desserts and jams.",
    germination: "Start from bare-root plants or runners rather than seeds for best results.",
    transplanting: "Plant with crown at soil level, spacing 12-18 inches apart in rows 2-3 feet apart.",
    harvest: "Harvest when fully red, picking with the cap and stem attached.",
    watering: "https://images.unsplash.com/photo-1563299796-17596ed6b017?w=200&h=200&fit=crop",
    sunlight: "https://images.unsplash.com/photo-1620228885847-9eab2a1adddc?w=200&h=200&fit=crop",
    extra_care: "Mulch around plants to keep berries clean and prevent rot.",
  },
  {
    id: 3,
    common_name: "Blueberry",
    scientific_name: "Vaccinium corymbosum",
    photo: "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=500&h=500&fit=crop",
    categories: ["Fruits"],
    description: "Blueberries are small, sweet blue fruits that grow on bushes and are rich in antioxidants.",
    germination: "Start from established plants rather than seeds for faster production.",
    transplanting: "Plant in acidic soil (pH 4.5-5.5) with plenty of organic matter.",
    harvest: "Harvest when berries turn completely blue and detach easily from the stem.",
    watering: "https://images.unsplash.com/photo-1563299796-17596ed6b017?w=200&h=200&fit=crop",
    sunlight: "https://images.unsplash.com/photo-1620228885847-9eab2a1adddc?w=200&h=200&fit=crop",
    extra_care: "Protect from birds with netting when fruits begin to ripen.",
  },
  {
    id: 4,
    common_name: "Onion",
    scientific_name: "Allium cepa",
    photo: "https://images.unsplash.com/photo-1508747703725-719777637510?w=500&h=500&fit=crop",
    categories: ["Vegetables", "Bulbs"],
    description: "Onions are bulb vegetables with layers and a pungent flavor used in many cuisines worldwide.",
    germination: "Sow seeds 1/4 inch deep in loose, well-draining soil.",
    transplanting: "Transplant seedlings when they're about the diameter of a pencil, spacing 4-6 inches apart.",
    harvest: "Harvest when tops fall over and begin to dry. Cure in a warm, dry place for storage.",
    watering: "https://images.unsplash.com/photo-1563299796-17596ed6b017?w=200&h=200&fit=crop",
    sunlight: "https://images.unsplash.com/photo-1620228885847-9eab2a1adddc?w=200&h=200&fit=crop",
    extra_care: "Stop watering when bulbs begin to mature to prevent rot.",
  },
  {
    id: 5,
    common_name: "Pepper",
    scientific_name: "Capsicum annuum",
    photo: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=500&h=500&fit=crop",
    categories: ["Vegetables", "Fruits"],
    description: "Peppers are colorful vegetables that can be sweet or spicy, used in many dishes for flavor.",
    germination: "Sow seeds 1/4 inch deep in warm soil (70-80°F). Seeds germinate slowly.",
    transplanting: "Transplant when seedlings have 5-6 true leaves and all danger of frost has passed.",
    harvest: "Harvest when peppers reach desired size and color. Cut rather than pull from plant.",
    watering: "https://images.unsplash.com/photo-1563299796-17596ed6b017?w=200&h=200&fit=crop",
    sunlight: "https://images.unsplash.com/photo-1620228885847-9eab2a1adddc?w=200&h=200&fit=crop",
    extra_care: "Support plants with stakes if needed as peppers can become heavy.",
  },
  {
    id: 6,
    common_name: "Banana",
    scientific_name: "Musa",
    photo: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500&h=500&fit=crop",
    categories: ["Fruits"],
    description: "Bananas are long, curved fruits with a soft, starchy flesh inside a thick peel.",
    germination: "Bananas are typically grown from suckers or rhizomes, not seeds.",
    transplanting: "Plant suckers in well-draining soil rich in organic matter.",
    harvest: "Harvest when fruits are plump but still green. Allow to ripen off the plant.",
    watering: "https://images.unsplash.com/photo-1563299796-17596ed6b017?w=200&h=200&fit=crop",
    sunlight: "https://images.unsplash.com/photo-1620228885847-9eab2a1adddc?w=200&h=200&fit=crop",
    extra_care: "Protect from strong winds which can damage large leaves.",
  },
  {
    id: 7,
    common_name: "Broccoli",
    scientific_name: "Brassica oleracea var. italica",
    photo: "https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?w=500&h=500&fit=crop",
    categories: ["Vegetables"],
    description: "Broccoli is a green vegetable with dense clusters of florets on thick, edible stems.",
    germination: "Sow seeds 1/4 to 1/2 inch deep in cool soil.",
    transplanting: "Transplant when seedlings have 4-5 true leaves, spacing 18 inches apart.",
    harvest: "Harvest the central head when florets are firm and tight, before flowers open.",
    watering: "https://images.unsplash.com/photo-1563299796-17596ed6b017?w=200&h=200&fit=crop",
    sunlight: "https://images.unsplash.com/photo-1620228885847-9eab2a1adddc?w=200&h=200&fit=crop",
    extra_care: "Provide consistent moisture and cool temperatures for best growth.",
  },
  {
    id: 8,
    common_name: "Watermelon",
    scientific_name: "Citrullus lanatus",
    photo: "https://images.unsplash.com/photo-1563114773-84221bd62daa?w=500&h=500&fit=crop",
    categories: ["Fruits"],
    description: "Watermelon is a large, sweet fruit with juicy red flesh and black seeds.",
    germination: "Sow seeds 1 inch deep in warm soil after all danger of frost has passed.",
    transplanting: "Transplant carefully as watermelons don't like root disturbance. Space 3-5 feet apart.",
    harvest: "Harvest when the underside turns yellow and the fruit sounds hollow when tapped.",
    watering: "https://images.unsplash.com/photo-1563299796-17596ed6b017?w=200&h=200&fit=crop",
    sunlight: "https://images.unsplash.com/photo-1620228885847-9eab2a1adddc?w=200&h=200&fit=crop",
    extra_care: "Grow on black plastic to increase soil temperature and keep fruits clean.",
  },
  {
    id: 9,
    common_name: "Pineapple",
    scientific_name: "Ananas comosus",
    photo: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=500&h=500&fit=crop",
    categories: ["Fruits"],
    description: "Pineapple is a tropical fruit with sweet and tangy yellow flesh inside a spiky exterior.",
    germination: "Grow from the crown (top) of a fresh pineapple or from suckers.",
    transplanting: "Plant in well-draining soil rich in organic matter.",
    harvest: "Harvest when the fruit begins to turn yellow at the base and smells sweet.",
    watering: "https://images.unsplash.com/photo-1563299796-17596ed6b017?w=200&h=200&fit=crop",
    sunlight: "https://images.unsplash.com/photo-1620228885847-9eab2a1adddc?w=200&h=200&fit=crop",
    extra_care: "Protect from frost as pineapples are tropical plants.",
  },
  {
    id: 10,
    common_name: "Raspberry",
    scientific_name: "Rubus idaeus",
    photo: "https://images.unsplash.com/photo-1577069861033-55d04cec4ef5?w=500&h=500&fit=crop",
    categories: ["Fruits"],
    description: "Raspberries are small, sweet red berries that grow on thorny canes.",
    germination: "Start from bare-root plants or root cuttings rather than seeds.",
    transplanting: "Plant in early spring, spacing canes 2-3 feet apart in rows 6-8 feet apart.",
    harvest: "Harvest when berries are fully colored and detach easily from the plant.",
    watering: "https://images.unsplash.com/photo-1563299796-17596ed6b017?w=200&h=200&fit=crop",
    sunlight: "https://images.unsplash.com/photo-1620228885847-9eab2a1adddc?w=200&h=200&fit=crop",
    extra_care: "Prune canes after fruiting to encourage new growth for next season.",
  },
]

interface PlantGuideGridProps {
  searchQuery: string
  selectedCategories: string[]
}

export function PlantGuideGrid({ searchQuery, selectedCategories }: PlantGuideGridProps) {
  const [loading, setLoading] = useState(true)
  const [filteredGuides, setFilteredGuides] = useState(PLANT_GUIDES)

  // Filter guides based on search query and selected categories
  useEffect(() => {
    setLoading(true)

    // Simulate API call delay
    const timer = setTimeout(() => {
      const filtered = PLANT_GUIDES.filter((guide) => {
        // Filter by search query
        const matchesSearch =
          searchQuery === "" ||
          guide.common_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          guide.scientific_name.toLowerCase().includes(searchQuery.toLowerCase())

        // Filter by categories
        const matchesCategory =
          selectedCategories.length === 0 || guide.categories.some((category) => selectedCategories.includes(category))

        return matchesSearch && matchesCategory
      })

      setFilteredGuides(filtered)
      setLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery, selectedCategories])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 text-leafy-green-dark animate-spin" />
      </div>
    )
  }

  if (filteredGuides.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-leafy-green-dark mb-2">No plant guides found</h3>
        <p className="text-gray-600">Try adjusting your search or filters</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
      {filteredGuides.map((guide) => (
        <PlantGuideCard key={guide.id} guide={guide} />
      ))}
    </div>
  )
}

