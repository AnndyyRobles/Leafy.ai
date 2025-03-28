"use client"

import { useState, useEffect } from "react"
import axios from "axios"
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

interface PostsFeedProps {
  selectedTechnique: string | null
}

export function PostsFeed({ selectedTechnique }: PostsFeedProps) {
  const [posts, setPosts] = useState<Post[]>([])
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch posts from API with technique filter
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/api/posts`;
        
        // Add technique filter if selected
        if (selectedTechnique) {
          // You would need an endpoint that can filter by technique name
          url += `?techniqueName=${encodeURIComponent(selectedTechnique)}`;
        }
        
        const response = await axios.get(url);
        
        // Transform API data to match the Post interface
        const transformedPosts = response.data.map((post: any) => ({
          id: post.id.toString(),
          user: {
            id: post.user_id.toString(),
            name: post.user_name,
            avatar: post.user_avatar ? `${process.env.NEXT_PUBLIC_API_URL}/${post.user_avatar}` : "/placeholder.svg",
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
          location: post.location,
        }));
        
        setPosts(transformedPosts);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("No se pudieron cargar los posts");
        setLoading(false);
      }
    };

    fetchPosts();
  }, [selectedTechnique]);

  // Handle like functionality
  // Handle like functionality
const handleLike = async (postId: string) => {
  try {
    // Verificar si el usuario está autenticado
    const token = localStorage.getItem('token');
    if (!token) {
      toast({
        title: "Necesitas iniciar sesión",
        description: "Debes iniciar sesión para dar 'me gusta' a los posts",
        variant: "destructive",
      });
      return;
    }
    
    // Realizar la solicitud para dar me gusta
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${postId}/like`, 
      {}, 
      {
        headers: { 
          Authorization: `Bearer ${token}` 
        }
      }
    );
    
    // Actualizar la UI con el nuevo número de me gusta
    setPosts((prevPosts) => prevPosts.map((post) => 
      post.id === postId ? { ...post, likes: response.data.likes } : post
    ));
    
    // Si hay un post seleccionado, actualizarlo también
    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost({
        ...selectedPost,
        likes: response.data.likes
      });
    }
  } catch (err) {
    console.error("Error giving like:", err);
    toast({
      title: "Error",
      description: "No se pudo dar 'me gusta' al post",
      variant: "destructive",
    });
  }
};

  // Open post modal
  const openPostModal = (post: Post) => {
    setSelectedPost(post);
  };

  // Close post modal
  const closePostModal = () => {
    setSelectedPost(null);
  };

  // Add comment to a post
  // Add comment to a post
const handleAddComment = async (postId: string, comment: string) => {
  if (!comment.trim()) return;

  try {
    // Verificar si el usuario está autenticado
    const token = localStorage.getItem('token');
    if (!token) {
      toast({
        title: "Necesitas iniciar sesión",
        description: "Debes iniciar sesión para comentar en los posts",
        variant: "destructive",
      });
      return;
    }
    
    // Realizar la solicitud para añadir un comentario
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${postId}/comments`, 
      { content: comment },
      { 
        headers: { 
          Authorization: `Bearer ${token}` 
        } 
      }
    );
    
    // Transformar la respuesta para que coincida con la interfaz PostComment
    const newComment: PostComment = {
      id: response.data.id.toString(),
      user: {
        id: response.data.user.id.toString(),
        name: response.data.user.name,
        avatar: response.data.user.profile_picture 
          ? `${process.env.NEXT_PUBLIC_API_URL}/${response.data.user.profile_picture}` 
          : "/placeholder.svg",
      },
      text: response.data.content,
      createdAt: response.data.comment_date,
    };

    // Actualizar los posts con el nuevo comentario
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: [...post.comments, newComment],
            }
          : post,
      ),
    );
    
    // Si hay un post seleccionado, actualizarlo también
    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost({
        ...selectedPost,
        comments: [...selectedPost.comments, newComment],
      });
    }
  } catch (err) {
    console.error("Error adding comment:", err);
    toast({
      title: "Error",
      description: "No se pudo añadir el comentario",
      variant: "destructive",
    });
  }
};

  if (loading) {
    return <div className="py-8 text-center">Cargando posts...</div>;
  }

  if (error) {
    return <div className="py-8 text-center text-red-500">{error}</div>;
  }

  if (posts.length === 0) {
    return <div className="py-8 text-center">No hay posts disponibles</div>;
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
        <PostModal 
          post={selectedPost} 
          onClose={closePostModal} 
          onLike={handleLike} 
          onAddComment={handleAddComment} 
        />
      )}
    </div>
  );
}