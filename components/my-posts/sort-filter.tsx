"use client"

import { Check, ChevronDown } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { SortOption } from "./types"

interface SortFilterProps {
  selectedSort: SortOption
  onSortChange: (sort: SortOption) => void
}

export function SortFilter({ selectedSort, onSortChange }: SortFilterProps) {
  const [open, setOpen] = useState(false)

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "most-liked", label: "Most Liked" },
    { value: "most-commented", label: "Most Commented" },
  ]

  const selectedLabel = sortOptions.find((option) => option.value === selectedSort)?.label || "Newest First"

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button className="flex items-center justify-between w-40 bg-leafy-green-dark hover:bg-leafy-green-forest text-white rounded-full shadow-md transition-colors">
          <span>{selectedLabel}</span>
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40 bg-leafy-green-dark border-leafy-green-forest text-white rounded-lg overflow-hidden">
        {sortOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            className={`flex items-center justify-between cursor-pointer hover:bg-leafy-green-forest transition-colors ${
              selectedSort === option.value ? "text-white font-medium" : "text-gray-100"
            }`}
            onClick={() => {
              onSortChange(option.value as SortOption)
              setOpen(false)
            }}
          >
            <span>{option.label}</span>
            {selectedSort === option.value && <Check className="h-4 w-4 text-white" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

