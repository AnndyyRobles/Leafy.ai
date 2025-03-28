// Types for the My Posts view
export type PostStatus = "published" | "draft"
export type SortOption = "newest" | "oldest" | "most-liked" | "most-commented"
export type ViewMode = "grid" | "list"

// We extend the Post type from posts-feed.tsx to add status
import type { Post as BasePost } from "../posts/posts-feed"

export interface Post extends BasePost {
  status: PostStatus
}

