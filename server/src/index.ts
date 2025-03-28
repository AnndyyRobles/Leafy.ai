import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';
import techniqueRoutes from './routes/techniqueRoutes';
import postRoutes from './routes/postRoutes';
import guideRoutes from './routes/guideRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Rutas
app.use('/api/users', userRoutes);
app.use('/api/techniques', techniqueRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/guides', guideRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'Bienvenido a la API de Leafy.ai' });
});

// Manejador de errores
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Ha ocurrido un error en el servidor',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});