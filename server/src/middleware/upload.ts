import multer from 'multer';
import path from 'path';
import { Request } from 'express';
import { IAuthRequest } from '../models/types';

// Configuración para imágenes de posts
const postStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(__dirname, '../../uploads/posts'));
  },
  filename: (req: Request, file, cb) => {
    const authReq = req as IAuthRequest;
    const userId = authReq.user?.id || 'unknown';
    cb(null, `post-${userId}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

// Filtro para archivos
const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos de imagen'));
  }
};

export const uploadPost = multer({
  storage: postStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter
});