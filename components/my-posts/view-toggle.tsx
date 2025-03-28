"use client"

import { Grid2X2, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { ViewMode } from "./types"

interface ViewToggleProps {
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
}

export function ViewToggle({ viewMode, onViewModeChange }: ViewToggleProps) {
  return (
    <div className="flex rounded-md overflow-hidden">
      <Button
        variant="ghost"
        size="sm"
        className={`px-4 py-2 rounded-none ${
          viewMode === "grid"
            ? "bg-navy-700 text-white"
            : "bg-navy-800 text-gray-400 hover:bg-navy-700 hover:text-white"
        }`}
        onClick={() => onViewModeChange("grid")}
      >
        <Grid2X2 className="h-4 w-4 mr-2" />
        Grid
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={`px-4 py-2 rounded-none ${
          viewMode === "list"
            ? "bg-navy-700 text-white"
            : "bg-navy-800 text-gray-400 hover:bg-navy-700 hover:text-white"
        }`}
        onClick={() => onViewModeChange("list")}
      >
        <List className="h-4 w-4 mr-2" />
        List
      </Button>
    </div>
  )
}

