import express from 'express';
import { 
  createPost, 
  getAllPosts, 
  getPostById, 
  likePost, 
  addComment,
  getMyPosts,
  updatePost,
  deletePost
} from '../controllers/postController';
import auth from '../middleware/auth';
import { uploadPost } from '../middleware/upload';

const router = express.Router();

// Rutas públicas
router.get('/', getAllPosts);
router.get('/:id', getPostById);

// Rutas protegidas
router.get('/user/me', auth, getMyPosts);
router.post('/', auth, uploadPost.single('post_picture'), createPost);
router.put('/:id', auth, uploadPost.single('post_picture'), updatePost);
router.delete('/:id', auth, deletePost);
router.post('/:id/like', auth, likePost);
router.post('/:id/comments', auth, addComment);

export default router;