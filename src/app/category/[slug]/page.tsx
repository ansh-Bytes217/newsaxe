import { NewsCard } from "@/components/features/NewsCard";
import { formatDistanceToNow } from "date-fns";
import { ArrowLeft, Hash } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Article {
    id: string;
    slug: string;
    title: string;
    subtitle?: string;
    content: string;
    imageUrl?: string;
    createdAt: string;
    author: {
        name: string;
    };
    category: {
        name: string;
        slug: string;
    };
    isExternal?: boolean;
    externalLink?: string;
}

async function getCategoryArticles(slug: string): Promise<Article[]> {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    try {
        // Fetch from our local DB
        const localRes = await fetch(`${API_URL}/api/articles?category=${slug}`, {
            next: { revalidate: 60 },
        });
        const localArticles = localRes.ok ? await localRes.json() : [];

        // Fetch from External API
        const externalRes = await fetch(`${API_URL}/api/external-news?category=${slug}`, {
            next: { revalidate: 300 }, // 5 mins for external
        });
        const externalArticles = externalRes.ok ? await externalRes.json() : [];

        // Combine them (External first for freshness, then local)
        // or interleave them
        return [...externalArticles, ...localArticles];
    } catch (error) {
        console.error("Failed to fetch articles", error);
        return [];
    }
}

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: PageProps) {
    const { slug } = await params;
    const articles = await getCategoryArticles(slug);
    const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1);

    if (!articles) {
        return notFound();
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header Section */}
            <div className="bg-muted/30 border-b border-border">
                <div className="container mx-auto px-4 py-12 md:py-16">
                    <div className="flex flex-col gap-4">
                        <Link
                            href="/"
                            className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 text-sm w-fit"
                        >
                            <ArrowLeft className="w-4 h-4" /> Back to Home
                        </Link>

                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-primary/10 rounded-xl text-primary">
                                <Hash className="w-8 h-8 md:w-10 md:h-10" />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight capitalize">
                                {categoryName}
                            </h1>
                        </div>

                        <p className="text-muted-foreground text-lg max-w-2xl">
                            The latest breaking news, in-depth analysis, and updates from the world of {categoryName}.
                        </p>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="container mx-auto px-4 py-12">
                {articles.length === 0 ? (
                    <div className="text-center py-20 bg-muted/20 rounded-xl border border-dashed border-border">
                        <h3 className="text-xl font-semibold mb-2">No articles found</h3>
                        <p className="text-muted-foreground">
                            We couldn't find any articles in this category. Check back later!
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {articles.map((article, index) => (
                            <NewsCard
                                key={article.id}
                                slug={article.slug}
                                category={article.category.name}
                                title={article.title}
                                excerpt={article.subtitle || article.title}
                                author={article.author.name || "Unknown"}
                                timeAgo={formatDistanceToNow(new Date(article.createdAt), { addSuffix: true })}
                                imageUrl={article.imageUrl}
                                featured={index === 0} // First item is featured
                                isExternal={article.isExternal}
                                externalLink={article.externalLink}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
