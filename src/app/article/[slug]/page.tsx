import { ArticleHero } from "@/components/article/ArticleHero";
import { ArticleContent } from "@/components/article/ArticleContent";
import { ArticleSidebar } from "@/components/article/ArticleSidebar";
import { ReadingProgress } from "@/components/article/ReadingProgress";
import { MessageSquare, AlertTriangle } from "lucide-react";
import { notFound } from "next/navigation";

// Define strict types matching our backend response
type Article = {
    id: string;
    title: string;
    subtitle: string | null;
    content: string;
    imageUrl: string | null;
    readTime: string | null;
    createdAt: string;
    author: {
        name: string | null;
        role: "READER" | "EDITOR" | "ADMIN";
    };
    category: {
        name: string;
        slug: string;
    };
};

async function getArticle(slug: string): Promise<Article | null> {
    try {
        const res = await fetch(`http://localhost:4000/api/articles/${slug}`, {
            cache: 'no-store', // Ensure fresh data for now
            next: { revalidate: 60 } // Incremental Static Regeneration (ISR)
        });

        if (!res.ok) {
            if (res.status === 404) return null;
            throw new Error(`Failed to fetch article: ${res.status}`);
        }

        return res.json();
    } catch (error) {
        console.error("Error fetching article:", error);
        return null; // Handle error gracefully in UI
    }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const article = await getArticle(slug);

    if (!article) {
        // In a real app, you might want to show a custom 404 or a "Loading" state if client-side
        // But since this is a server component, we need to handle it.
        // If offline/error, we show a fallback or notFound() if 404.
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
                <AlertTriangle className="w-12 h-12 text-destructive mb-4" />
                <h1 className="text-2xl font-bold mb-2">Article Not Found</h1>
                <p className="text-muted-foreground">The article you are looking for does not exist or the server is unreachable.</p>
            </div>
        );
        // or notFound(); if strict 404
    }

    // Format data for components
    const heroData = {
        category: article.category.name,
        title: article.title,
        subtitle: article.subtitle || "",
        author: {
            name: article.author.name || "NewsAXE Editor",
            role: article.author.role === "ADMIN" ? "Senior Editor" : "Staff Writer",
        },
        publishedAt: new Date(article.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        readTime: article.readTime || "5 min",
        imageUrl: article.imageUrl || undefined
    };

    return (
        <>
            <ReadingProgress />
            <div className="min-h-screen pb-20">
                <ArticleHero {...heroData} />

                <div className="container mx-auto px-4 mt-8 md:mt-16">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                        {/* Main Content Column */}
                        <div className="lg:col-span-8 lg:col-start-2">
                            {/* Pass content to renderer */}
                            {/* Note: For now we still use static ArticleContent for layout demo, 
                   but in real app we would pass {article.content} to it */}
                            <ArticleContent />

                            <div className="mt-12 pt-8 border-t border-border flex items-center justify-between">
                                <div className="flex gap-2">
                                    {/* Tags would come from article.tags */}
                                    {["News", article.category.name].map(tag => (
                                        <span key={tag} className="px-3 py-1 bg-muted text-xs font-medium rounded-full cursor-pointer hover:bg-muted/80">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-16 bg-muted/20 rounded-2xl p-8 text-center">
                                <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-xl font-bold mb-2">Join the Conversation</h3>
                                <p className="text-muted-foreground mb-6">Sign in to post comments and discuss this story with our community.</p>
                                <button className="px-8 py-3 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-colors">
                                    Log In to Comment
                                </button>
                            </div>
                        </div>

                        {/* Sidebar Column */}
                        <div className="hidden lg:block lg:col-span-3">
                            <ArticleSidebar />
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}
