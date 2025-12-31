
import express from 'express';
import { saveSearchQuery, searchGigsSemantic, getRecommendations } from '../controllers/semanticSearchController';

const router = express.Router();

router.post('/save', saveSearchQuery);
router.get('/recommendations/:userId', getRecommendations);
router.get('/search', searchGigsSemantic);

export default router;
