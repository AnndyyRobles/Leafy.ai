import { Request, Response } from 'express';
import db from '../config/db';
import { IAuthRequest } from '../models/types';

// Obtener todas las guías de plantas
export const getAllGuides = async (req: Request, res: Response) => {
  const { categoryId, search } = req.query;
  
  try {
    let query = `
      SELECT pg.*, 
             COALESCE(json_agg(DISTINCT pc.name) FILTER (WHERE pc.name IS NOT NULL), '[]') AS categories
      FROM PlantGuide pg
      LEFT JOIN PlantGuideCategory pgc ON pg.id = pgc.plant_guide_id
      LEFT JOIN PlantCategory pc ON pgc.plant_category_id = pc.id
      WHERE 1=1
    `;
    
    const values: any[] = [];
    let valueIndex = 1;
    
    if (categoryId) {
      query += ` AND pgc.plant_category_id = $${valueIndex}`;
      values.push(categoryId);
      valueIndex++;
    }
    
    if (search) {
      query += ` AND (pg.common_name ILIKE $${valueIndex} OR pg.scientific_name ILIKE $${valueIndex})`;
      values.push(`%${search}%`);
      valueIndex++;
    }
    
    query += `
      GROUP BY pg.id
      ORDER BY pg.common_name
    `;
    
    const result = await db.query(query, values);
    
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener las guías de plantas:', err);
    res.status(500).json({ error: 'Error al obtener las guías de plantas' });
  }
};

// Obtener una guía de planta por ID
export const getGuideById = async (req: Request, res: Response) => {
  try {
    const result = await db.query(
      `SELECT pg.*, 
              COALESCE(json_agg(DISTINCT pc.name) FILTER (WHERE pc.name IS NOT NULL), '[]') AS categories
       FROM PlantGuide pg
       LEFT JOIN PlantGuideCategory pgc ON pg.id = pgc.plant_guide_id
       LEFT JOIN PlantCategory pc ON pgc.plant_category_id = pc.id
       WHERE pg.id = $1
       GROUP BY pg.id`,
      [req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Guía no encontrada' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error al obtener la guía de planta:', err);
    res.status(500).json({ error: 'Error al obtener la guía de planta' });
  }
};

// Obtener todas las categorías de plantas
export const getAllCategories = async (_req: Request, res: Response) => {
  try {
    const result = await db.query('SELECT * FROM PlantCategory ORDER BY name');
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener las categorías de plantas:', err);
    res.status(500).json({ error: 'Error al obtener las categorías de plantas' });
  }
};