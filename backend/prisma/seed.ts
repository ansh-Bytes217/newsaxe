
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const CATEGORIES = [
    { name: 'World', slug: 'world' },
    { name: 'Tech', slug: 'tech' },
    { name: 'Politics', slug: 'politics' },
    { name: 'Sports', slug: 'sports' },
    { name: 'Business', slug: 'business' }
];

const SAMPLE_ARTICLES = [
    // TECH
    {
        title: "AI Breakthrough: Models Now Self-Correcting",
        slug: "ai-breakthrough-self-correcting",
        subtitle: "New architecture allows LLMs to fact-check themselves in real-time.",
        content: "Researchers have developed a new method for...",
        imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop",
        categorySlug: "tech",
        published: true,
    },
    {
        title: "The Future of Quantum Internet",
        slug: "future-quantum-internet",
        subtitle: "Scientists achieve stable long-distance qubit transmission.",
        content: "Quantum entanglement has been scaled up to...",
        imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070&auto=format&fit=crop",
        categorySlug: "tech",
        published: true,
    },

    // WORLD
    {
        title: "Global Water Summit 2026 Concludes",
        slug: "global-water-summit-2026",
        subtitle: "Nations sign historic treaty to protect freshwater resources.",
        content: "After weeks of negotiation, the Global Water Summit...",
        imageUrl: "https://images.unsplash.com/photo-1519817914152-22d216bb9170?q=80&w=2072&auto=format&fit=crop",
        categorySlug: "world",
        published: true,
    },
    {
        title: "Urban Farming Revolution in Europe",
        slug: "urban-farming-europe",
        subtitle: "How major cities are turning rooftops into farms.",
        content: "Paris and Berlin are leading the way in...",
        imageUrl: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cdaa?q=80&w=2070&auto=format&fit=crop",
        categorySlug: "world",
        published: true,
    },

    // POLITICS
    {
        title: "New Education Bill Passes Senate",
        slug: "new-education-bill-passes",
        subtitle: "Sweeping reforms promised for higher education finding.",
        content: "The bill aims to reduce student debt by...",
        imageUrl: "https://images.unsplash.com/photo-1541872703-74c5963631df?q=80&w=2070&auto=format&fit=crop",
        categorySlug: "politics",
        published: true,
    },
    {
        title: "Diplomatic Relations Restored",
        slug: "diplomatic-relations-restored",
        subtitle: "Two historic rivals maintain peace talks for third month.",
        content: "In a surprising turn of events, the two nations...",
        imageUrl: "https://images.unsplash.com/photo-1575320181282-9afab399332c?q=80&w=2070&auto=format&fit=crop",
        categorySlug: "politics",
        published: true,
    },

    // SPORTS
    {
        title: "Underdog Wins Marathon Gold",
        slug: "underdog-marathon-gold",
        subtitle: "First-time olympian shatters world record.",
        content: "The 22-year-old runner from...",
        imageUrl: "https://images.unsplash.com/photo-1552674605-46d536d2e681?q=80&w=2073&auto=format&fit=crop",
        categorySlug: "sports",
        published: true,
    },
    {
        title: "Next Gen Tennis Star Rises",
        slug: "next-gen-tennis-star",
        subtitle: "18-year-old phenom defeats current world number one.",
        content: "In a stunning match that lasted 5 hours...",
        imageUrl: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=2080&auto=format&fit=crop",
        categorySlug: "sports",
        published: true,
    },

    // BUSINESS
    {
        title: "EV Market Surpasses Predictions",
        slug: "ev-market-growth",
        subtitle: "Electric vehicle sales double in Q4 2025.",
        content: "Analysts are revising their forecasts as...",
        imageUrl: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=2072&auto=format&fit=crop",
        categorySlug: "business",
        published: true,
    },
    {
        title: "Startups Focusing on Sustainable Packaging",
        slug: "sustainable-packaging-startups",
        subtitle: "Venture capital flows into eco-friendly material science.",
        content: "Plastic alternatives are the hottest trend in...",
        imageUrl: "https://images.unsplash.com/photo-1605600659908-0ef719419d41?q=80&w=2076&auto=format&fit=crop",
        categorySlug: "business",
        published: true,
    }
];

async function main() {
    console.log('Start seeding ...');

    // 1. Create User
    const user = await prisma.user.upsert({
        where: { email: 'admin@newsaxe.com' },
        update: {},
        create: {
            email: 'admin@newsaxe.com',
            name: 'Admin User',
            password: 'hashed_password_placeholder', // In real app use bcrypt
            role: 'ADMIN',
        },
    });

    console.log(`Created user: ${user.name}`);

    // 2. Create Categories & Articles
    for (const catData of CATEGORIES) {
        const category = await prisma.category.upsert({
            where: { slug: catData.slug },
            update: {},
            create: {
                name: catData.name,
                slug: catData.slug,
            },
        });
        console.log(`Created category: ${category.name}`);

        // Create articles for this category
        const articles = SAMPLE_ARTICLES.filter(a => a.categorySlug === catData.slug);

        for (const articleData of articles) {
            const article = await prisma.article.upsert({
                where: { slug: articleData.slug },
                update: {
                    imageUrl: articleData.imageUrl // Update image if exists
                },
                create: {
                    title: articleData.title,
                    slug: articleData.slug,
                    subtitle: articleData.subtitle,
                    content: articleData.content,
                    imageUrl: articleData.imageUrl,
                    published: articleData.published,
                    authorId: user.id,
                    categoryId: category.id,
                    readTime: "5 min",
                }
            });
            console.log(`Created article: ${article.title}`);
        }
    }

    console.log('Seeding finished.');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
