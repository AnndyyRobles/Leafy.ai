import { Request, Response } from 'express';
import fs from 'fs';
import db from '../config/db';
import { IAuthRequest } from '../models/types';

// Crear un nuevo post
export const createPost = async (req: IAuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  const { description } = req.body;
  let techniques: number[] = [];
  
  // Verificar que se haya cargado un archivo
  if (!req.file) {
    return res.status(400).json({ error: 'Debes subir una imagen' });
  }

  // Parsear las técnicas si se proporcionaron
  if (req.body.techniques) {
    try {
      techniques = JSON.parse(req.body.techniques);
    } catch (err) {
      return res.status(400).json({ error: 'Formato inválido de técnicas' });
    }
  }
  
  try {
    // Iniciar transacción
    await db.query('BEGIN');
    
    // Insertar post
    const postResult = await db.query(
      'INSERT INTO Post (user_id, description, post_picture) VALUES ($1, $2, $3) RETURNING *',
      [req.user.id, description, req.file.path]
    );
    
    const postId = postResult.rows[0].id;
    
    // Asociar técnicas al post
    if (techniques.length > 0) {
      const values = techniques.map((techniqueId) => {
        return `(${postId}, ${techniqueId})`;
      }).join(', ');
      
      await db.query(`INSERT INTO PostTechnique (post_id, technique_id) VALUES ${values}`);
    }
    
    // Completar transacción
    await db.query('COMMIT');
    
    // Obtener el post completo con sus técnicas
    const result = await db.query(
      `SELECT p.*, json_agg(DISTINCT t.name) AS techniques
       FROM Post p
       LEFT JOIN PostTechnique pt ON p.id = pt.post_id
       LEFT JOIN CultivationTechnique t ON pt.technique_id = t.id
       WHERE p.id = $1
       GROUP BY p.id`,
      [postId]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    // Revertir cambios en caso de error
    await db.query('ROLLBACK');
    console.error('Error al crear el post:', err);
    
    // Eliminar el archivo subido si existe
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error al eliminar el archivo:', err);
      });
    }
    
    res.status(500).json({ error: 'Error al crear el post' });
  }
};

// Obtener todos los posts (con filtros opcionales)
export const getAllPosts = async (req: Request, res: Response) => {
  const { techniqueId, userId } = req.query;
  
  try {
    let query = `
      SELECT p.*, u.name as user_name, u.profile_picture as user_avatar, u.id as user_id,
             COALESCE(json_agg(DISTINCT t.name) FILTER (WHERE t.name IS NOT NULL), '[]') AS techniques,
             COALESCE((
               SELECT json_agg(json_build_object(
                 'id', c.id,
                 'text', c.content,
                 'createdAt', c.comment_date,
                 'user', json_build_object(
                   'id', cu.id,
                   'name', cu.name,
                   'avatar', cu.profile_picture
                 )
               )) FILTER (WHERE c.id IS NOT NULL)
               FROM Comment c
               LEFT JOIN Users cu ON c.user_id = cu.id
               WHERE c.post_id = p.id
             ), '[]') AS comments
      FROM Post p
      JOIN Users u ON p.user_id = u.id
      LEFT JOIN PostTechnique pt ON p.id = pt.post_id
      LEFT JOIN CultivationTechnique t ON pt.technique_id = t.id
      WHERE p.is_published = true 
    `;
    
    const values: any[] = [];
    let valueIndex = 1;
    
    if (techniqueId) {
      query += ` AND pt.technique_id = $${valueIndex}`;
      values.push(techniqueId);
      valueIndex++;
    }
    
    if (userId) {
      query += ` AND p.user_id = $${valueIndex}`;
      values.push(userId);
      valueIndex++;
    }
    
    query += `
      GROUP BY p.id, u.id
      ORDER BY p.post_date DESC
    `;
    
    const result = await db.query(query, values);
    
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener los posts:', err);
    res.status(500).json({ error: 'Error al obtener los posts' });
  }
};

// Obtener un post por ID
export const getPostById = async (req: Request, res: Response) => {
  try {
    const result = await db.query(
      `SELECT p.*, u.name as user_name, u.profile_picture as user_avatar, u.id as user_id,
              COALESCE(json_agg(DISTINCT t.name) FILTER (WHERE t.name IS NOT NULL), '[]') AS techniques,
              COALESCE((
                SELECT json_agg(json_build_object(
                  'id', c.id,
                  'text', c.content,
                  'createdAt', c.comment_date,
                  'user', json_build_object(
                    'id', cu.id,
                    'name', cu.name,
                    'avatar', cu.profile_picture
                  )
                )) FILTER (WHERE c.id IS NOT NULL)
                FROM Comment c
                LEFT JOIN Users cu ON c.user_id = cu.id
                WHERE c.post_id = p.id
              ), '[]') AS comments
       FROM Post p
       JOIN Users u ON p.user_id = u.id
       LEFT JOIN PostTechnique pt ON p.id = pt.post_id
       LEFT JOIN CultivationTechnique t ON pt.technique_id = t.id
       WHERE p.id = $1
       GROUP BY p.id, u.id`,
      [req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Post no encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error al obtener el post:', err);
    res.status(500).json({ error: 'Error al obtener el post' });
  }
};

// Dar me gusta a un post
export const likePost = async (req: IAuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  const postId = req.params.id;
  
  try {
    // Verificar si el post existe
    const postCheck = await db.query('SELECT * FROM Post WHERE id = $1', [postId]);
    if (postCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Post no encontrado' });
    }
    
    // Actualizar el conteo de me gusta
    const result = await db.query(
      'UPDATE Post SET likes = likes + 1 WHERE id = $1 RETURNING likes',
      [postId]
    );
    
    res.json({ likes: result.rows[0].likes });
  } catch (err) {
    console.error('Error al dar me gusta al post:', err);
    res.status(500).json({ error: 'Error al dar me gusta al post' });
  }
};

// Añadir un comentario a un post
export const addComment = async (req: IAuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  const { content } = req.body;
  const postId = req.params.id;
  
  if (!content) {
    return res.status(400).json({ error: 'El contenido del comentario es requerido' });
  }
  
  try {
    // Verificar si el post existe
    const postCheck = await db.query('SELECT * FROM Post WHERE id = $1', [postId]);
    if (postCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Post no encontrado' });
    }
    
    // Insertar el comentario
    const commentResult = await db.query(
      'INSERT INTO Comment (post_id, user_id, content) VALUES ($1, $2, $3) RETURNING id, content, comment_date',
      [postId, req.user.id, content]
    );
    
    // Obtener información del usuario para incluirla en la respuesta
    const userResult = await db.query(
      'SELECT id, name, profile_picture FROM Users WHERE id = $1',
      [req.user.id]
    );
    
    const comment = {
      ...commentResult.rows[0],
      user: userResult.rows[0]
    };
    
    res.status(201).json(comment);
  } catch (err) {
    console.error('Error al añadir comentario:', err);
    res.status(500).json({ error: 'Error al añadir comentario' });
  }
};

// Obtener los posts del usuario autenticado
export const getMyPosts = async (req: IAuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  try {
    const result = await db.query(
      `SELECT p.*, 
              COALESCE(json_agg(DISTINCT t.name) FILTER (WHERE t.name IS NOT NULL), '[]') AS techniques,
              COALESCE((
                SELECT json_agg(json_build_object(
                  'id', c.id,
                  'text', c.content,
                  'createdAt', c.comment_date,
                  'user', json_build_object(
                    'id', cu.id,
                    'name', cu.name,
                    'avatar', cu.profile_picture
                  )
                )) FILTER (WHERE c.id IS NOT NULL)
                FROM Comment c
                LEFT JOIN Users cu ON c.user_id = cu.id
                WHERE c.post_id = p.id
              ), '[]') AS comments
       FROM Post p
       LEFT JOIN PostTechnique pt ON p.id = pt.post_id
       LEFT JOIN CultivationTechnique t ON pt.technique_id = t.id
       WHERE p.user_id = $1
       GROUP BY p.id
       ORDER BY p.post_date DESC`,
      [req.user.id]
    );
    
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener tus posts:', err);
    res.status(500).json({ error: 'Error al obtener tus posts' });
  }
};

// Actualizar un post
export const updatePost = async (req: IAuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  const { description, is_published } = req.body;
  let techniques: number[] | null = null;
  
  if (req.body.techniques) {
    try {
      techniques = JSON.parse(req.body.techniques);
    } catch (err) {
      return res.status(400).json({ error: 'Formato inválido de técnicas' });
    }
  }
  
  try {
    // Verificar que el post pertenece al usuario
    const postCheck = await db.query(
      'SELECT * FROM Post WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );
    
    if (postCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Post no encontrado o no autorizado' });
    }
    
    // Iniciar transacción
    await db.query('BEGIN');
    
    // Actualizar el post
    let query = 'UPDATE Post SET';
    const values: any[] = [];
    let setClauses = [];
    let valueIndex = 1;
    
    if (description !== undefined) {
      setClauses.push(` description = $${valueIndex}`);
      values.push(description);
      valueIndex++;
    }
    
    if (is_published !== undefined) {
      setClauses.push(` is_published = $${valueIndex}`);
      values.push(is_published);
      valueIndex++;
    }
    
    if (req.file) {
      setClauses.push(` post_picture = $${valueIndex}`);
      values.push(req.file.path);
      valueIndex++;
      
      // Eliminar la imagen anterior si existe
      if (postCheck.rows[0].post_picture) {
        try {
          fs.unlinkSync(postCheck.rows[0].post_picture);
        } catch (e) {
          console.error("Error al eliminar la imagen anterior:", e);
        }
      }
    }
    
    // Si no hay nada que actualizar y no hay técnicas que actualizar
    if (setClauses.length === 0 && techniques === null) {
      await db.query('ROLLBACK');
      return res.status(400).json({ error: 'No hay datos para actualizar' });
    }
    
    // Construir y ejecutar la consulta de actualización
    if (setClauses.length > 0) {
      query += setClauses.join(',');
      query += ` WHERE id = $${valueIndex} RETURNING *`;
      values.push(req.params.id);
      
      await db.query(query, values);
    }
    
    // Actualizar técnicas si se proporcionaron
    if (techniques !== null) {
      // Eliminar asociaciones actuales
      await db.query('DELETE FROM PostTechnique WHERE post_id = $1', [req.params.id]);
      
      // Agregar nuevas asociaciones
      if (techniques.length > 0) {
        const techValues = techniques.map((techniqueId) => {
          return `(${req.params.id}, ${techniqueId})`;
        }).join(', ');
        
        await db.query(`INSERT INTO PostTechnique (post_id, technique_id) VALUES ${techValues}`);
      }
    }
    
    // Completar transacción
    await db.query('COMMIT');
    
    // Obtener el post actualizado con sus técnicas
    const result = await db.query(
      `SELECT p.*, 
              COALESCE(json_agg(DISTINCT t.name) FILTER (WHERE t.name IS NOT NULL), '[]') AS techniques
       FROM Post p
       LEFT JOIN PostTechnique pt ON p.id = pt.post_id
       LEFT JOIN CultivationTechnique t ON pt.technique_id = t.id
       WHERE p.id = $1
       GROUP BY p.id`,
      [req.params.id]
    );
    
    res.json(result.rows[0]);
  } catch (err) {
    // Revertir cambios en caso de error
    await db.query('ROLLBACK');
    console.error('Error al actualizar el post:', err);
    res.status(500).json({ error: 'Error al actualizar el post' });
  }
};

// Eliminar un post
export const deletePost = async (req: IAuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  try {
    // Verificar que el post pertenece al usuario
    const postCheck = await db.query(
      'SELECT * FROM Post WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );
    
    if (postCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Post no encontrado o no autorizado' });
    }
    
    // Eliminar el post (las restricciones de clave foránea ON DELETE CASCADE se encargarán de las relaciones)
    await db.query('DELETE FROM Post WHERE id = $1', [req.params.id]);
    
    // Eliminar la imagen si existe
    if (postCheck.rows[0].post_picture) {
      try {
        fs.unlinkSync(postCheck.rows[0].post_picture);
      } catch (e) {
        console.error("Error al eliminar la imagen:", e);
      }
    }
    
    res.json({ message: 'Post eliminado exitosamente' });
  } catch (err) {
    console.error('Error al eliminar el post:', err);
    res.status(500).json({ error: 'Error al eliminar el post' });
  }
};