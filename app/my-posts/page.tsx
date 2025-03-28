import { MyPostsGrid } from "@/components/my-posts/my-posts-grid"

// Sample data - In a real app, this would come from your API
const SAMPLE_POSTS = [
  {
    id: "1",
    title: "Growing Vertical Gardens: A Complete Guide",
    excerpt: "Learn everything about vertical gardening, from choosing the right plants to maintenance tips.",
    category: "gardening",
    images: ["https://images.unsplash.com/photo-1470058869958-2a77ade41c02?w=800"],
    user: {
      id: "u1",
      name: "John Doe",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop",
    },
    techniques: ["Vertical", "Hidroponía"],
    likes: 245,
    comments: [],
    createdAt: "2024-03-10T09:00:00Z",
    location: "Home Garden",
    status: "published",
  },
  // Add more sample posts...
]

export default function MyPostsPage() {
  return <MyPostsGrid initialPosts={SAMPLE_POSTS} />
}

