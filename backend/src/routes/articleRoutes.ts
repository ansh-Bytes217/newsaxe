import { Router } from 'express';
import { getArticles, getArticleBySlug, createArticle } from '../controllers/articleController';
import { authenticate, requireRole } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getArticles);
router.get('/:slug', getArticleBySlug);
router.post('/', authenticate, requireRole(['EDITOR', 'ADMIN']), createArticle);

export default router;
