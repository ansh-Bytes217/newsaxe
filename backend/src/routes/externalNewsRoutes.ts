import { Router } from 'express';
import { getTopHeadlines } from '../controllers/newsController';

const router = Router();

router.get('/', getTopHeadlines);

export default router;
