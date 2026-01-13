import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../utils/prisma';
import Logger from '../utils/logger';

const articleSchema = z.object({
    title: z.string().min(5),
    subtitle: z.string().optional(),
    content: z.string().min(20),
    categoryId: z.string(),
    imageUrl: z.string().url().optional(),
    tags: z.array(z.string()).optional(),
    published: z.boolean().optional(),
});

export const getArticles = async (req: Request, res: Response): Promise<void> => {
    try {
        const articles = await prisma.article.findMany({
            where: {
                published: true,
                ...(req.query.category ? { category: { slug: String(req.query.category) } } : {})
            },
            include: {
                author: { select: { name: true, role: true } },
                category: { select: { name: true, slug: true } },
                tags: true,
            },
            orderBy: { createdAt: 'desc' },
            take: 20,
        });
        res.json(articles);
    } catch (error) {
        Logger.error(error);
        res.status(500).json({ error: 'Failed to fetch articles' });
    }
};

export const getArticleBySlug = async (req: Request, res: Response): Promise<void> => {
    try {
        const { slug } = req.params as { slug: string };
        const article = await prisma.article.findUnique({
            where: { slug },
            include: {
                author: { select: { name: true, role: true } },
                category: { select: { name: true, slug: true } },
                tags: true,
            },
        });

        if (!article) {
            res.status(404).json({ error: 'Article not found' });
            return;
        }

        res.json(article);
    } catch (error) {
        Logger.error(error);
        res.status(500).json({ error: 'Failed to fetch article' });
    }
};

export const createArticle = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = articleSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({ error: result.error.flatten() });
            return;
        }

        const { title, subtitle, content, categoryId, imageUrl, tags, published } = result.data;

        // Generate dummy slug for now (in real app, robust slugify)
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();

        // Assume user is attached to req by auth middleware
        const userId = (req as any).user?.userId; // Force cast for now, strictly should use AuthRequest type

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const article = await prisma.article.create({
            data: {
                title,
                subtitle,
                slug,
                content,
                imageUrl,
                published: published || false,
                author: { connect: { id: userId } },
                category: { connect: { id: categoryId } },
                tags: tags ? {
                    connectOrCreate: tags.map(tag => ({
                        where: { name: tag },
                        create: { name: tag }
                    }))
                } : undefined
            }
        });

        Logger.info(`Article created: ${article.title} (${article.id})`);
        res.status(201).json(article);

    } catch (error) {
        Logger.error(error);
        res.status(500).json({ error: 'Failed to create article' });
    }
};
