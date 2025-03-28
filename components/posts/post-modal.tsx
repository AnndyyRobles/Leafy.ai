"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { formatDistanceToNow } from "date-fns"
import { X, Leaf, MessageCircle } from "lucide-react"
import type { Post } from "./posts-feed"
import { TechniqueBadge } from "./technique-badge"

interface PostModalProps {
  post: Post
  onClose: () => void
  onLike: (postId: string) => void
  onAddComment: (postId: string, comment: string) => void
}

export function PostModal({ post, onClose, onLike, onAddComment }: PostModalProps) {
  const [comment, setComment] = useState("")
  const [isLiked, setIsLiked] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)
  const commentInputRef = useRef<HTMLInputElement>(null)

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [onClose])

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    window.addEventListener("keydown", handleEsc)
    return () => {
      window.removeEventListener("keydown", handleEsc)
    }
  }, [onClose])

  // Focus comment input when modal opens
  useEffect(() => {
    if (commentInputRef.current) {
      commentInputRef.current.focus()
    }
  }, [])

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl overflow-hidden max-w-5xl w-full max-h-[90vh] flex flex-col md:flex-row"
      >
        {/* Close button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-white z-10 hover:bg-black/20 p-1 rounded-full">
          <X className="h-6 w-6" />
        </button>

        {/* Image section */}
        <div className="w-full md:w-[600px] h-[400px] md:h-[500px] bg-black flex items-center justify-center">
          <img
            src={post.images[0] || "/placeholder.svg"}
            alt="Post"
            className="h-full w-full object-contain object-center"
          />
        </div>

        {/* Comments and info section */}
        <div className="w-full md:w-2/5 flex flex-col max-h-[90vh] md:max-h-[80vh]">
          {/* Post header */}
          <div className="p-4 flex items-center border-b">
            <img
              src={post.user.avatar || "/placeholder.svg"}
              alt={post.user.name}
              className="w-8 h-8 rounded-full object-cover border border-leafy-green-light mr-3"
            />
            <div>
              <h3 className="font-semibold text-leafy-green-dark">{post.user.name}</h3>
              {post.location && <p className="text-xs text-gray-500">{post.location}</p>}
            </div>
          </div>

          {/* Comments section */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* Post caption */}
            <div className="flex mb-4">
              <img
                src={post.user.avatar || "/placeholder.svg"}
                alt={post.user.name}
                className="w-8 h-8 rounded-full object-cover border border-leafy-green-light mr-3 flex-shrink-0"
              />
              <div>
                <p>
                  <span className="font-semibold">{post.user.name}</span> {post.caption}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>

            {/* Technique badge - solo una técnica */}
            <div className="mb-4">
              {post.techniques.length > 0 && <TechniqueBadge technique={post.techniques[0]} />}
            </div>

            {/* Comments */}
            {post.comments.map((comment) => (
              <div key={comment.id} className="flex mb-4">
                <img
                  src={comment.user.avatar || "/placeholder.svg"}
                  alt={comment.user.name}
                  className="w-8 h-8 rounded-full object-cover border border-leafy-green-light mr-3 flex-shrink-0"
                />
                <div>
                  <p>
                    <span className="font-semibold">{comment.user.name}</span> {comment.text}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Post actions */}
          <div className="p-4 border-t">
            <div className="flex items-center mb-4">
              <button
                className={`transition-colors ${isLiked ? "text-leafy-green-dark" : "hover:text-leafy-green-medium"}`}
                onClick={handleLike}
              >
                <Leaf className="h-6 w-6" fill={isLiked ? "#2D6A4F" : "none"} />
              </button>
              <button className="hover:text-leafy-green-medium transition-colors ml-4">
                <MessageCircle className="h-6 w-6" />
              </button>
            </div>

            <p className="font-semibold mb-2">{post.likes.toLocaleString()} likes</p>
            <p className="text-xs text-gray-400 mb-4">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </p>

            {/* Add comment form */}
            <form onSubmit={handleSubmitComment} className="flex items-center">
              <input
                ref={commentInputRef}
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
      </div>
    </div>
  )
}

