"use client"

import type React from "react"
import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { Leaf, MessageCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import type { Post } from "./posts-feed"
import { TechniqueBadge } from "./technique-badge"

interface PostCardProps {
  post: Post
  onLike: (postId: string) => void
  onOpenModal: () => void
  onAddComment: (postId: string, comment: string) => void
}

export function PostCard({ post, onLike, onOpenModal, onAddComment }: PostCardProps) {
  const [comment, setComment] = useState("")
  const [isLiked, setIsLiked] = useState(false)
  const router = useRouter()

  const handleLike = () => {
    if (!isLiked) {
      onLike(post.id)
      setIsLiked(true)
    }
  }

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault()
    onAddComment(post.id, comment)
    setComment("")
  }

  const navigateToUserProfile = () => {
    router.push(`/user/${post.user.id}`)
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-leafy-green-light/20">
      {/* Post header with user info */}
      <div className="p-4 flex items-center">
        <div className="flex items-center space-x-3">
          <img
            src={post.user.avatar || "/placeholder.svg"}
            alt={post.user.name}
            className="w-10 h-10 rounded-full object-cover border border-leafy-green-light cursor-pointer"
            onClick={navigateToUserProfile}
          />
          <div>
            <h3
              className="font-semibold text-leafy-green-dark cursor-pointer hover:underline"
              onClick={navigateToUserProfile}
            >
              {post.user.name}
            </h3>
            {post.location && <p className="text-sm text-gray-500">{post.location}</p>}
          </div>
        </div>
      </div>

      {/* Post image */}
      <div className="relative">
        <img
          src={post.images[0] || "/placeholder.svg"}
          alt="Post content"
          className="w-full aspect-square object-cover cursor-pointer"
          onClick={onOpenModal}
        />

        {/* Technique badge - solo una técnica */}
        <div className="absolute top-2 sm:top-4 left-2 sm:left-4">
          {post.techniques.length > 0 && <TechniqueBadge technique={post.techniques[0]} />}
        </div>
      </div>

      {/* Post actions and content */}
      <div className="p-4">
        <div className="flex items-center mb-4">
          <button
            className={`transition-colors ${isLiked ? "text-leafy-green-dark" : "hover:text-leafy-green-medium"}`}
            onClick={handleLike}
          >
            <Leaf className="h-6 w-6" fill={isLiked ? "#2D6A4F" : "none"} />
          </button>
          <button className="hover:text-leafy-green-medium transition-colors ml-4" onClick={onOpenModal}>
            <MessageCircle className="h-6 w-6" />
          </button>
        </div>

        <p className="font-semibold mb-1">{post.likes.toLocaleString()} likes</p>
        <p className="mb-2">
          <span className="font-semibold cursor-pointer hover:underline" onClick={navigateToUserProfile}>
            {post.user.name}
          </span>{" "}
          {post.caption}
        </p>

        {/* Comments preview */}
        {post.comments.length > 0 && (
          <button className="text-gray-500 text-sm mb-2" onClick={onOpenModal}>
            View all {post.comments.length} comments
          </button>
        )}

        {/* Most recent comment preview */}
        {post.comments.length > 0 && (
          <p className="text-sm mb-2">
            <span className="font-semibold">{post.comments[post.comments.length - 1].user.name}</span>{" "}
            {post.comments[post.comments.length - 1].text.length > 50
              ? post.comments[post.comments.length - 1].text.substring(0, 50) + "..."
              : post.comments[post.comments.length - 1].text}
          </p>
        )}

        {/* Post time */}
        <p className="text-xs text-gray-400 mt-2">
          {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
        </p>

        {/* Add comment form */}
        <form onSubmit={handleSubmitComment} className="mt-3 flex items-center border-t pt-3">
          <input
            type="text"
            placeholder="Add a comment..."
            className="flex-1 bg-transparent text-sm outline-none"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            type="submit"
            className={`text-leafy-green-medium font-semibold text-sm ${!comment.trim() ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={!comment.trim()}
          >
            Post
          </button>
        </form>
      </div>
    </div>
  )
}

