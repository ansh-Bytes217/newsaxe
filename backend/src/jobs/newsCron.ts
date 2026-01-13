import cron from 'node-cron';
import { fetchNews } from '../services/newsService';
import prisma from '../utils/prisma';
import Logger from '../utils/logger';

// Categories to rotate through to avoid rate limits while keeping all updated
const CATEGORIES = ['technology', 'business', 'science', 'health', 'sports', 'entertainment'];

export const startNewsCron = () => {
    // Run every 30 minutes (0, 30 * * * *)
    cron.schedule('*/30 * * * *', async () => {
        Logger.info('Running Scheduled News Update...');

        try {
            // Fetch top global headlines first (no category)
            const headlines = await fetchNews({ language: 'en' });
            await saveArticles(headlines, 'General');

            // Fetch specific categories
            for (const category of CATEGORIES) {
                // Add a small delay if needed, but for now just fetch
                const news = await fetchNews({ category, language: 'en' });
                await saveArticles(news, category);
            }

            Logger.info('Scheduled News Update Completed.');
        } catch (error) {
            Logger.error('Scheduled News Update Failed:', error);
        }
    });

    Logger.info('News Cron Scheduler started: Running every 30 minutes.');
};

async function saveArticles(articles: any[], categoryName: string) {
    if (!articles || articles.length === 0) return;

    // Ensure category exists locally
    // Map API category to our DB category if needed.
    // Our DB uses Title Case usually? Le'ts normalize.
    // If categoryName is 'technology', we map to 'Tech' or create 'Technology'?
    // My seed used 'Tech', 'World', etc.
    let dbCategoryName = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
    if (categoryName === 'technology') dbCategoryName = 'Tech';

    const category = await prisma.category.upsert({
        where: { slug: categoryName.toLowerCase() },
        update: {},
        create: {
            name: dbCategoryName,
            slug: categoryName.toLowerCase(),
        }
    });

    let count = 0;
    for (const article of articles) {
        // Validation
        if (!article.title || !article.article_id) continue;

        try {
            // Check existence by explicit slug or unique constraint if strictly needed
            // Here just using upsert on slug might be risky if slug isn't unique enough.
            // Let's use article_id from provider as the unique reference if possible? 
            // My schema has 'slug' as unique.
            // External APIs don't guarantee unique slugs. 
            // I'll create a slug from title + date to be safe.
            const slug = (article.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now()).slice(0, 100);

            // Check if link exists to deduplicate?
            // Actually, let's just create. If I want true sync, I need a 'sourceId' field.
            // For now, let's just 'create' and ignore unique constraint errors on duplicate content?
            // BETTER: Check if title exists.
            const exists = await prisma.article.findFirst({
                where: { title: article.title }
            });

            if (!exists) {
                await prisma.article.create({
                    data: {
                        title: article.title,
                        subtitle: article.description?.slice(0, 255), // truncate
                        content: article.content || article.description || 'Read more at source.',
                        slug: slug,
                        imageUrl: article.image_url,
                        published: true,
                        // Connect to a system user 'Admin' or 'Bot'?
                        // I'll connect to the first admin user I find, or seed one.
                        // For safety, I'll try to find any user.
                        author: {
                            connect: {
                                // You might need a specific ID here. 
                                // I'll search for one.
                                email: 'admin@newsaxe.com' // Ensure this user exists from seed
                            }
                        },
                        category: { connect: { id: category.id } },
                        createdAt: new Date(article.pubDate) || new Date(),
                    }
                });
                count++;
            }
        } catch (e) {
            // Logger.warn(`Failed to save article "${article.title}": ${e}`);
            // Continue 
        }
    }
    if (count > 0) Logger.info(`Saved ${count} new articles for ${dbCategoryName}`);
}
