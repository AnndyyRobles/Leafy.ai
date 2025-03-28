import { Request, Response } from 'express';
import db from '../config/db';

// Obtener todas las técnicas de cultivo
export const getAllTechniques = async (_req: Request, res: Response) => {
  try {
    const result = await db.query('SELECT * FROM CultivationTechnique ORDER BY name');
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener las técnicas de cultivo:', err);
    res.status(500).json({ error: 'Error al obtener las técnicas de cultivo' });
  }
};

// Obtener una técnica por ID
export const getTechniqueById = async (req: Request, res: Response) => {
  try {
    const result = await db.query('SELECT * FROM CultivationTechnique WHERE id = $1', [req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Técnica no encontrada' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error al obtener la técnica:', err);
    res.status(500).json({ error: 'Error al obtener la técnica' });
  }
};