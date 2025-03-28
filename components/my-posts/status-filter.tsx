"use client"

import { Check, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { PostStatus } from "./types"

interface StatusFilterProps {
  selectedStatus: "all" | PostStatus
  onStatusChange: (status: "all" | PostStatus) => void
}

export function StatusFilter({ selectedStatus, onStatusChange }: StatusFilterProps) {
  // Status options for filtering posts
  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "published", label: "Published" },
    { value: "draft", label: "Drafts" },
  ] as const

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 bg-leafy-green-dark hover:bg-leafy-green-forest text-white px-4 py-2 rounded-full transition-colors shadow-md"
        >
          {statusOptions.find((opt) => opt.value === selectedStatus)?.label}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[150px] bg-leafy-green-dark border-leafy-green-forest shadow-lg">
        {statusOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onStatusChange(option.value)}
            className={`text-white hover:bg-leafy-green-forest transition-colors ${
              selectedStatus === option.value ? "font-medium" : ""
            }`}
          >
            <Check className={`mr-2 h-4 w-4 ${selectedStatus === option.value ? "opacity-100" : "opacity-0"}`} />
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

