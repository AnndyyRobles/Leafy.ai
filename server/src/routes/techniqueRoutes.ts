import express from 'express';
import { getAllTechniques, getTechniqueById } from '../controllers/techniqueController';

const router = express.Router();

router.get('/', getAllTechniques);
router.get('/:id', getTechniqueById);

export default router;