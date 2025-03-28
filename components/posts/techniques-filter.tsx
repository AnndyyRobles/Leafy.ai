"use client"

// List of cultivation techniques
const TECHNIQUES = ["Vertical", "En pared", "Hidroponía", "Reciclados", "Acuaponía"]

interface TechniquesFilterProps {
  selectedTechnique: string | null
  onSelectTechnique: (technique: string | null) => void
}

export function TechniquesFilter({ selectedTechnique, onSelectTechnique }: TechniquesFilterProps) {
  return (
    <div className="flex items-center gap-4 flex-1">
      <div className="flex flex-wrap gap-2">
        <button
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            selectedTechnique === null
              ? "bg-leafy-green-forest text-white font-bold shadow-md border-2 border-leafy-green-dark"
              : "bg-leafy-beige-medium text-leafy-green-dark hover:bg-leafy-green-light"
          }`}
          onClick={() => onSelectTechnique(null)}
        >
          All
        </button>

        {TECHNIQUES.map((technique) => (
          <button
            key={technique}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              selectedTechnique === technique
                ? "bg-leafy-green-forest text-white font-bold shadow-md border-2 border-leafy-green-dark"
                : "bg-leafy-beige-medium text-leafy-green-dark hover:bg-leafy-green-light"
            }`}
            onClick={() => onSelectTechnique(technique)}
          >
            {technique}
          </button>
        ))}
      </div>

      <div className="relative flex-1">
        <input
          type="text"
          placeholder="Search posts..."
          className="px-4 py-1.5 rounded-full border border-leafy-green-light/30 focus:outline-none focus:ring-2 focus:ring-leafy-green-medium w-full"
        />
      </div>
    </div>
  )
}

