import { Request, Response } from 'express';
import { fetchNews } from '../services/newsService';
import Logger from '../utils/logger';

export const getTopHeadlines = async (req: Request, res: Response) => {
    try {
        const { category, q, country } = req.query;

        // NewsData.io categories: business, crime, domestic, education, entertainment, environment, food, health, lifestyle, politics, science, sports, technology, top, tourism, world, other
        // Our App categories: World, Tech, Politics, Sports, Business

        // Map our category slugs to their API equivalents if needed
        // Map our category slugs to their API equivalents if needed
        let apiCategory = (category as string)?.toLowerCase();

        const categoryMap: Record<string, string> = {
            'tech': 'technology',
            'business': 'business',
            'politics': 'politics',
            'sports': 'sports',
            'world': 'world',
            'science': 'science',
            'health': 'health',
            'entertainment': 'entertainment'
        };

        if (apiCategory && categoryMap[apiCategory]) {
            apiCategory = categoryMap[apiCategory];
        }

        const params: any = {};
        if (q) params.q = q;
        // Only send category if it's a valid API category, otherwise ignore it to avoid 400
        if (apiCategory && Object.values(categoryMap).includes(apiCategory)) {
            params.category = apiCategory;
        }
        // Default to English language if not specified, though service sets it
        params.language = 'en';

        const articles = await fetchNews(params);

        // Transform to match our frontend's expected format
        // Frontend expects: id, slug, title, subtitle (excerpt), content, imageUrl, author, category, createdAt (timeAgo)
        const transformedArticles = articles.map((article: any) => ({
            id: article.article_id,
            slug: article.link, // We don't have a local slug, so use the external link as ID or create a fake one. 
            // Actually, for clicking, we might want to redirect to the external site OR show a preview.
            // simpler to redirect for external news, or store it.
            // Let's use article_id as slug content for internal routing if we fetched content, 
            // but these APIs often don't give full content.
            title: article.title,
            subtitle: article.description,
            // default content if missing
            content: article.content || article.description,
            imageUrl: article.image_url || null,
            author: {
                name: article.source_id || 'Unknown Source',
                role: 'EDITOR'
            },
            category: {
                name: article.category ? article.category[0] : (category || 'General'),
                slug: article.category ? article.category[0] : (category || 'general')
            },
            createdAt: article.pubDate,
            readTime: "3 min", // placeholder
            isExternal: true,
            externalLink: article.link
        }));

        res.json(transformedArticles);
    } catch (error) {
        Logger.error(error);
        res.status(500).json({ error: 'Failed to fetch news' });
    }
};
