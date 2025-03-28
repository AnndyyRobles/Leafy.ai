"use client"

import { useState } from "react"
import { DeletePostDialog } from "./delete-post-dialog"
import type { Post, PostStatus, SortOption } from "./types"
import { PostCard } from "../posts/post-card"
import { PostActions } from "./post-actions"
// Añadir el import del nuevo componente de edición
import { EditPostModal } from "../posts/edit-post-modal"

interface MyPostsGridProps {
  initialPosts: Post[]
}

export function MyPostsGrid({ initialPosts }: MyPostsGridProps) {
  // State management
  const [posts, setPosts] = useState(initialPosts)
  const [status, setStatus] = useState<"all" | PostStatus>("all")
  const [sort, setSort] = useState<SortOption>("newest")
  const [postToDelete, setPostToDelete] = useState<Post | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  // Añadir un nuevo estado para el post que se está editando
  const [postToEdit, setPostToEdit] = useState<Post | null>(null)

  // Status options
  const statusOptions = [
    { label: "All", value: "all" },
    { label: "Published", value: "published" },
    { label: "Drafts", value: "draft" },
  ]

  // Sort options
  const sortOptions = [
    { label: "Newest", value: "newest" },
    { label: "Oldest", value: "oldest" },
    { label: "Most Liked", value: "most-liked" },
    { label: "Most Commented", value: "most-commented" },
  ]

  // Filter posts based on selected status and search query
  const filteredPosts = posts.filter((post) => {
    const matchesStatus = status === "all" ? true : post.status === status
    const matchesSearch =
      searchQuery === ""
        ? true
        : post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  // Sort posts based on selected option
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sort) {
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      case "most-liked":
        return b.likes - a.likes
      case "most-commented":
        return b.comments.length - a.comments.length
      default: // newest
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
  })

  // Modificar el handler de edición para abrir el modal
  const handleEdit = (postId: string) => {
    const post = posts.find((p) => p.id === postId)
    if (post) {
      setPostToEdit(post)
    }
  }

  const handleDelete = async () => {
    if (postToDelete) {
      // TODO: Implement delete functionality
      console.log("Delete post:", postToDelete.id)
      setPosts(posts.filter((p) => p.id !== postToDelete.id))
      setPostToDelete(null)
    }
  }

  const handleStatusChange = (postId: string, newStatus: PostStatus) => {
    // Update post status
    setPosts(posts.map((post) => (post.id === postId ? { ...post, status: newStatus } : post)))
  }

  // Añadir un handler para guardar los cambios
  const handleSaveEdit = (updatedPost: Partial<Post>) => {
    setPosts(posts.map((post) => (post.id === updatedPost.id ? { ...post, ...updatedPost } : post)))
    setPostToEdit(null)
  }

  return (
    <div className="flex flex-col min-h-screen bg-leafy-beige-light">
      {/* Header con filtros - similar a la vista principal */}
      <header className="sticky top-0 z-10 bg-white backdrop-blur-sm border-b border-leafy-green-light/20 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between max-w-7xl mx-auto h-12">
          {/* Filter options */}
          <div className="flex items-center gap-4 flex-1">
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    status === option.value
                      ? "bg-leafy-green-forest text-white font-bold shadow-md border-2 border-leafy-green-dark"
                      : "bg-leafy-beige-medium text-leafy-green-dark hover:bg-leafy-green-light"
                  }`}
                  onClick={() => setStatus(option.value as any)}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    sort === option.value
                      ? "bg-leafy-green-forest text-white font-bold shadow-md border-2 border-leafy-green-dark"
                      : "bg-leafy-beige-medium text-leafy-green-dark hover:bg-leafy-green-light"
                  }`}
                  onClick={() => setSort(option.value as SortOption)}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-1.5 rounded-full border border-leafy-green-light/30 focus:outline-none focus:ring-2 focus:ring-leafy-green-medium w-full"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Contenido principal - similar a la vista principal */}
      <main className="flex-1 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Posts grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedPosts.map((post) => (
              <div key={post.id} className="relative group">
                {/* Regular post card from home view */}
                <PostCard post={post} onLike={() => {}} onOpenModal={() => {}} onAddComment={() => {}} />

                {/* Action buttons overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                  <PostActions
                    postId={post.id}
                    status={post.status}
                    onEdit={handleEdit}
                    onDelete={() => setPostToDelete(post)}
                    onStatusChange={handleStatusChange}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Delete confirmation dialog */}
      <DeletePostDialog
        isOpen={!!postToDelete}
        onClose={() => setPostToDelete(null)}
        onConfirm={handleDelete}
        postTitle={postToDelete?.title || ""}
      />

      {/* Edit post modal */}
      <EditPostModal
        post={postToEdit}
        isOpen={!!postToEdit}
        onClose={() => setPostToEdit(null)}
        onSave={handleSaveEdit}
      />
    </div>
  )
}

