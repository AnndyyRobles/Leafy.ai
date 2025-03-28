import express from 'express';
import { getAllGuides, getGuideById, getAllCategories } from '../controllers/guideController';

const router = express.Router();

router.get('/', getAllGuides);
router.get('/categories', getAllCategories);
router.get('/:id', getGuideById);

export default router;