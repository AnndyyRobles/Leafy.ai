"use client"

// Corregir la sintaxis de las claves con guiones poniéndolas entre comillas
const TECHNIQUE_COLORS: Record<string, string> = {
  Vertical: "border-l-[#827efc]",
  "Wall-mounted": "border-l-[#615ced]",
  Hydroponics: "border-l-[#918eed]",
  "Recycled Materials": "border-l-[#4c4cc9]",
  Aquaponics: "border-l-[#767bfc]",
}

interface TechniqueBadgeProps {
  technique: string
}

export function TechniqueBadge({ technique }: TechniqueBadgeProps) {
  const colorClasses = TECHNIQUE_COLORS[technique] || "border-l-gray-400"

  return (
    <span
      className={`px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-medium bg-white border border-gray-200 border-l-4 rounded-full flex-shrink-0 whitespace-nowrap ${colorClasses}`}
    >
      {technique}
    </span>
  )
}

