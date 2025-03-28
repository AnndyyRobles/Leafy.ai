import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { IAuthRequest } from '../models/types';

dotenv.config();

const authMiddleware = (req: IAuthRequest, res: Response, next: NextFunction) => {
  try {
    // Obtener el token de los headers
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No hay token, autorización denegada' });
    }

    const token = authHeader.split(' ')[1];
    
    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as any;
    
    // Añadir el usuario al objeto de petición
    req.user = {
      id: decoded.id,
      name: decoded.name,
      email: decoded.email
    };
    
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token inválido' });
  }
};

export default authMiddleware;