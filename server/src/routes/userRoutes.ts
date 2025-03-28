import express, { Request, Response } from 'express';
import { register, login, getProfile } from '../controllers/userController';
import auth from '../middleware/auth';

const router = express.Router();

// Rutas públicas
router.post('/register', (req: Request, res: Response) => register(req, res));
router.post('/login', (req: Request, res: Response) => login(req, res));

// Rutas protegidas
router.get('/me', auth, (req: Request, res: Response) => getProfile(req, res));

export default router;