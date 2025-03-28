"use client"

import { useState, useEffect } from "react"
import { PostCard } from "./post-card"
import { PostModal } from "./post-modal"

// Types for our post data
export interface PostUser {
  id: string
  name: string
  avatar: string
}

export interface PostComment {
  id: string
  user: PostUser
  text: string
  createdAt: string
}

export interface Post {
  id: string
  user: PostUser
  images: string[]
  caption: string
  techniques: string[]
  likes: number
  comments: PostComment[]
  createdAt: string
  location?: string
}

// Sample data for posts - modificado para que cada post tenga solo una técnica
const SAMPLE_POSTS: Post[] = [
  {
    id: "1",
    user: {
      id: "u1",
      name: "Plant Paradise",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop",
    },
    images: ["https://images.unsplash.com/photo-1470058869958-2a77ade41c02?w=800"],
    caption: "The perfect morning view 🌿 #PlantLife #Botanical",
    techniques: ["Vertical"],
    likes: 1234,
    comments: [
      {
        id: "c1",
        user: {
          id: "u2",
          name: "Green Thumb",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop",
        },
        text: "This looks amazing! What kind of plants are those?",
        createdAt: "2023-06-15T10:30:00Z",
      },
    ],
    createdAt: "2023-06-15T09:00:00Z",
    location: "Botanical Gardens",
  },
  {
    id: "2",
    user: {
      id: "u2",
      name: "Green Thumb",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop",
    },
    images: ["https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=800"],
    caption: "New addition to my plant family! 🌱 #PlantLover #GreenHome",
    techniques: ["Wall-mounted"],
    likes: 2567,
    comments: [
      {
        id: "c2",
        user: {
          id: "u1",
          name: "Plant Paradise",
          avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop",
        },
        text: "Love the setup! What's the name of this plant?",
        createdAt: "2023-06-15T12:30:00Z",
      },
    ],
    createdAt: "2023-06-15T11:00:00Z",
    location: "Home Garden",
  },
  {
    id: "3",
    user: {
      id: "u3",
      name: "Urban Jungle",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&h=50&fit=crop",
    },
    images: ["https://images.unsplash.com/photo-1446071103084-c257b5f70672?w=800"],
    caption: "Sunday morning coffee with my green friends ☕️🪴 #PlantsCommunity",
    techniques: ["Aquaponics"],
    likes: 3891,
    comments: [
      {
        id: "c3",
        user: {
          id: "u4",
          name: "Botanical Life",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop",
        },
        text: "This setup is goals! How long have you been growing these?",
        createdAt: "2023-06-15T14:30:00Z",
      },
    ],
    createdAt: "2023-06-15T13:00:00Z",
    location: "Urban Jungle Café",
  },
  {
    id: "4",
    user: {
      id: "u4",
      name: "Botanical Life",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop",
    },
    images: ["https://images.unsplash.com/photo-1453904300235-0f2f60b15b5d?w=800"],
    caption: "Morning light and fresh leaves 🌿✨ #PlantLife",
    techniques: ["Hydroponics"],
    likes: 1543,
    comments: [
      {
        id: "c4",
        user: {
          id: "u5",
          name: "Plant Whisperer",
          avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=50&h=50&fit=crop",
        },
        text: "The lighting is perfect! What direction does your window face?",
        createdAt: "2023-06-15T16:30:00Z",
      },
    ],
    createdAt: "2023-06-15T15:00:00Z",
    location: "Botanical Studio",
  },
  {
    id: "5",
    user: {
      id: "u5",
      name: "Plant Whisperer",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=50&h=50&fit=crop",
    },
    images: ["https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=800"],
    caption: "Weekend vibes with my green friends 🌿",
    techniques: ["Recycled Materials"],
    likes: 2156,
    comments: [
      {
        id: "c5",
        user: {
          id: "u6",
          name: "Leaf Lover",
          avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop",
        },
        text: "Such a peaceful corner! What's your watering routine?",
        createdAt: "2023-06-15T18:30:00Z",
      },
    ],
    createdAt: "2023-06-15T17:00:00Z",
    location: "Green Corner",
  },
  {
    id: "6",
    user: {
      id: "u6",
      name: "Leaf Lover",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop",
    },
    images: ["https://images.unsplash.com/photo-1470058869958-2a77ade41c02?w=800"],
    caption: "Morning coffee with a view 🪴",
    techniques: ["Wall-mounted"],
    likes: 1876,
    comments: [
      {
        id: "c6",
        user: {
          id: "u1",
          name: "Plant Paradise",
          avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop",
        },
        text: "This is so beautiful! What kind of soil do you use?",
        createdAt: "2023-06-15T20:30:00Z",
      },
    ],
    createdAt: "2023-06-15T19:00:00Z",
    location: "Home Garden",
  },
]

interface PostsFeedProps {
  selectedTechnique: string | null
}

export function PostsFeed({ selectedTechnique }: PostsFeedProps) {
  const [posts, setPosts] = useState<Post[]>([])
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)

  // Filter posts based on selected technique
  useEffect(() => {
    if (selectedTechnique) {
      setPosts(SAMPLE_POSTS.filter((post) => post.techniques.includes(selectedTechnique)))
    } else {
      setPosts(SAMPLE_POSTS)
    }
  }, [selectedTechnique])

  // Handle like functionality
  const handleLike = (postId: string) => {
    setPosts((prevPosts) => prevPosts.map((post) => (post.id === postId ? { ...post, likes: post.likes + 1 } : post)))
  }

  // Open post modal
  const openPostModal = (post: Post) => {
    setSelectedPost(post)
  }

  // Close post modal
  const closePostModal = () => {
    setSelectedPost(null)
  }

  // Add comment to a post
  const handleAddComment = (postId: string, comment: string) => {
    if (!comment.trim()) return

    const newComment: PostComment = {
      id: `c${Date.now()}`,
      user: {
        id: "current-user",
        name: "Plant Lover",
        avatar: "/placeholder.svg",
      },
      text: comment,
      createdAt: new Date().toISOString(),
    }

    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: [...post.comments, newComment],
            }
          : post,
      ),
    )
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onLike={handleLike}
            onOpenModal={() => openPostModal(post)}
            onAddComment={handleAddComment}
          />
        ))}
      </div>

      {/* Post modal for expanded view */}
      {selectedPost && (
        <PostModal post={selectedPost} onClose={closePostModal} onLike={handleLike} onAddComment={handleAddComment} />
      )}
    </div>
  )
}

