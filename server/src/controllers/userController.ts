import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../config/db';
import { IUserRegister, IUserLogin, IAuthRequest } from '../models/types';

// Registrar un nuevo usuario
export const register = async (req: Request, res: Response) => {
  const { name, email, password }: IUserRegister = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Por favor proporciona todos los campos requeridos' });
  }
  
  try {
    // Verificar si el email ya existe
    const userExists = await db.query('SELECT * FROM Users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }
    
    // Generar hash de la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Guardar el usuario en la base de datos
    const result = await db.query(
      'INSERT INTO Users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, registration_date',
      [name, email, hashedPassword]
    );
    
    // Otorgar la insignia de "Profile Creator"
    await db.query(
      'INSERT INTO UserBadge (user_id, badge_id) VALUES ($1, 1)',
      [result.rows[0].id]
    );
    
    // Generar JWT
    const token = jwt.sign(
      { id: result.rows[0].id, name: result.rows[0].name, email: result.rows[0].email },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );
    
    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      token,
      user: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};

// Iniciar sesión
export const login = async (req: Request, res: Response) => {
  const { email, password }: IUserLogin = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Por favor proporciona email y contraseña' });
  }
  
  try {
    // Buscar usuario por email
    const result = await db.query('SELECT * FROM Users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    const user = result.rows[0];
    
    // Verificar la contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    // Generar JWT
    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );
    
    // No enviar la contraseña
    delete user.password;
    
    res.json({
      message: 'Inicio de sesión exitoso',
      token,
      user
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

// Obtener el perfil del usuario autenticado
export const getProfile = async (req: IAuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'No autorizado' });
    }
    
    const result = await db.query(
      'SELECT id, name, email, profile_picture, registration_date FROM Users WHERE id = $1',
      [req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener el perfil' });
  }
};