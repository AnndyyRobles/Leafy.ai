"use client"

import { Pencil, Trash2, Rocket, Archive } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { PostStatus } from "./types"

interface PostActionsProps {
  postId: string
  status: PostStatus
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onStatusChange: (id: string, status: PostStatus) => void
}

export function PostActions({ postId, status, onEdit, onDelete, onStatusChange }: PostActionsProps) {
  return (
    <div className="absolute top-4 right-4 flex flex-col gap-2">
      <div className="flex gap-2">
        {/* Edit button - Navy blue background */}
        <Button size="sm" onClick={() => onEdit(postId)} className="bg-navy-700 hover:bg-navy-600 text-white">
          <Pencil className="h-4 w-4 mr-2" />
          Edit
        </Button>

        {/* Delete button - Dark red background */}
        <Button size="sm" onClick={() => onDelete(postId)} className="bg-red-900/90 hover:bg-red-900 text-white">
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </div>

      {/* Publish/Unpublish button */}
      <Button
        size="sm"
        onClick={() => onStatusChange(postId, status === "published" ? "draft" : "published")}
        className={
          status === "published"
            ? "bg-cyan-800/90 hover:bg-cyan-800 text-white w-full justify-center"
            : "bg-amber-600/90 hover:bg-amber-600 text-white w-full justify-center"
        }
      >
        {status === "published" ? (
          <>
            <Archive className="h-4 w-4 mr-2" />
            Unpublish
          </>
        ) : (
          <>
            <Rocket className="h-4 w-4 mr-2" />
            Publish
          </>
        )}
      </Button>
    </div>
  )
}

