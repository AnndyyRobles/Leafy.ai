"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { DeletePostDialog } from "./delete-post-dialog"
import { PostCard } from "../posts/post-card"
import { PostActions } from "./post-actions"
import { EditPostModal } from "../posts/edit-post-modal"
import { useAuth } from "@/components/auth/auth-provider"
import { Loader2 } from "lucide-react"

interface User {
  id: string
  name: string
  avatar: string
}

interface Comment {
  id: string
  user: User
  text: string
  createdAt: string
}

interface Post {
  id: string
  user: User
  images: string[]
  caption: string
  techniques: string[]
  likes: number
  comments: Comment[]
  createdAt: string
  location?: string
  status: "published" | "draft" // published = is_published: true, draft = is_published: false
}

export function MyPostsGrid() {
  const [posts, setPosts] = useState<Post[]>([])
  const [status, setStatus] = useState<"all" | "published" | "draft">("all")
  const [sort, setSort] = useState<"newest" | "oldest" | "most-liked" | "most-commented">("newest")
  const [postToDelete, setPostToDelete] = useState<Post | null>(null)
  const [postToEdit, setPostToEdit] = useState<Post | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  // Redireccionar si no está autenticado
  useEffect(() => {
    if (!isAuthenticated && !loading) {
      router.push("/login")
      toast({
        title: "Acceso denegado",
        description: "Debes iniciar sesión para ver tus posts",
        variant: "destructive",
      })
    }
  }, [isAuthenticated, loading, router, toast])

  // Cargar los posts del usuario
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) return
        
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/user/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        
        // Transformar los datos
        const transformedPosts: Post[] = response.data.map((post: any) => ({
          id: post.id.toString(),
          user: {
            id: post.user_id.toString(),
            name: "You", // Como son mis posts, usamos "You" como nombre
            avatar: "/placeholder.svg" // Podríamos usar la imagen de perfil del usuario autenticado
          },
          images: [post.post_picture ? `${process.env.NEXT_PUBLIC_API_URL}/${post.post_picture}` : "/placeholder.svg"],
          caption: post.description,
          techniques: post.techniques || [],
          likes: post.likes,
          comments: (post.comments || []).map((comment: any) => ({
            id: comment.id.toString(),
            user: {
              id: comment.user.id.toString(),
              name: comment.user.name,
              avatar: comment.user.avatar ? `${process.env.NEXT_PUBLIC_API_URL}/${comment.user.avatar}` : "/placeholder.svg",
            },
            text: comment.text,
            createdAt: comment.createdAt,
          })),
          createdAt: post.post_date,
          status: post.is_published ? "published" : "draft"
        }))
        
        setPosts(transformedPosts)
        setLoading(false)
      } catch (err) {
        console.error("Error al cargar los posts:", err)
        setError("No se pudieron cargar tus posts")
        setLoading(false)
      }
    }
    
    if (isAuthenticated) {
      fetchPosts()
    }
  }, [isAuthenticated])

  // Filter posts based on selected status and search query
  const filteredPosts = posts.filter((post) => {
    const matchesStatus = status === "all" ? true : post.status === status
    const matchesSearch =
      searchQuery === ""
        ? true
        : post.caption.toLowerCase().includes(searchQuery.toLowerCase())
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

  const handleEdit = (postId: string) => {
    const post = posts.find((p) => p.id === postId)
    if (post) {
      setPostToEdit(post)
    }
  }

  const handleDelete = async () => {
    if (!postToDelete) return

    try {
      const token = localStorage.getItem("token")
      if (!token) return
      
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/${postToDelete.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      
      setPosts(posts.filter((p) => p.id !== postToDelete.id))
      setPostToDelete(null)
      
      toast({
        title: "Post eliminado",
        description: "Tu post ha sido eliminado exitosamente",
      })
    } catch (err) {
      console.error("Error al eliminar post:", err)
      toast({
        title: "Error",
        description: "No se pudo eliminar el post",
        variant: "destructive",
      })
    }
  }

  const handleStatusChange = async (postId: string, newStatus: "published" | "draft") => {
    try {
      const token = localStorage.getItem("token")
      if (!token) return
      
      const is_published = newStatus === "published"
      
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${postId}`,
        { is_published },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      
      // Actualizar el estado local
      setPosts(posts.map((post) => (
        post.id === postId ? { ...post, status: newStatus } : post
      )))
      
      toast({
        title: is_published ? "Post publicado" : "Post archivado",
        description: is_published 
          ? "Tu post ahora es visible para la comunidad" 
          : "Tu post ha sido archivado y no es visible para la comunidad",
      })
    } catch (err) {
      console.error("Error al cambiar estado:", err)
      toast({
        title: "Error",
        description: "No se pudo cambiar el estado del post",
        variant: "destructive",
      })
    }
  }

  const handleSaveEdit = async (updatedPost: Partial<Post>) => {
    try {
      if (!postToEdit || !updatedPost.id) return
      
      const token = localStorage.getItem("token")
      if (!token) return
      
      // Crear FormData para la actualización
      const formData = new FormData()
      
      if (updatedPost.caption) {
        formData.append("description", updatedPost.caption)
      }
      
      if (updatedPost.status !== undefined) {
        formData.append("is_published", String(updatedPost.status === "published"))
      }
      
      // Si hay técnicas, actualizarlas
      if (updatedPost.techniques) {
        // Aquí necesitaríamos los IDs de las técnicas, no los nombres
        // Esto es una simplificación, en un caso real necesitaríamos mapear nombres a IDs
        const techniqueIds = [1] // ejemplo simplificado
        formData.append("techniques", JSON.stringify(techniqueIds))
      }
      
      // Actualizar el post
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${updatedPost.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      )
      
      // Actualizar el estado local
      setPosts(posts.map((post) => (
        post.id === updatedPost.id 
          ? { ...post, ...updatedPost } 
          : post
      )))
      
      setPostToEdit(null)
      
      toast({
        title: "Post actualizado",
        description: "Tu post ha sido actualizado exitosamente",
      })
    } catch (err) {
      console.error("Error al actualizar post:", err)
      toast({
        title: "Error",
        description: "No se pudo actualizar el post",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-leafy-beige-light items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-leafy-green-dark mb-4" />
        <p className="text-leafy-green-dark">Cargando tus posts...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-leafy-beige-light items-center justify-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-leafy-green-dark text-white px-4 py-2 rounded-md hover:bg-leafy-green-forest"
        >
          Intentar de nuevo
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-leafy-beige-light">
      {/* Header con filtros */}
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
                  onClick={() => setSort(option.value as any)}
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

      {/* Contenido principal */}
      <main className="flex-1 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {sortedPosts.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-leafy-green-dark mb-4">No tienes posts</h3>
              <p className="text-gray-600 mb-6">Parece que aún no has creado ningún post.</p>
              <button 
                onClick={() => router.push("/new-post")}
                className="bg-leafy-green-dark hover:bg-leafy-green-forest text-white px-4 py-2 rounded-md"
              >
                Crear mi primer post
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedPosts.map((post) => (
                <div key={post.id} className="relative group">
                  {/* Regular post card */}
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
          )}
        </div>
      </main>

      {/* Delete confirmation dialog */}
      <DeletePostDialog
        isOpen={!!postToDelete}
        onClose={() => setPostToDelete(null)}
        onConfirm={handleDelete}
        postTitle={postToDelete?.caption || ""}
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