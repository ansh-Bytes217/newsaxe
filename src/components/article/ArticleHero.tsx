import { Calendar, Clock, Share2, Facebook, Twitter, Linkedin, Link as LinkIcon } from "lucide-react";
import Image from "next/image"; // In real usage
import { cn } from "@/lib/utils";

interface ArticleHeroProps {
    category: string;
    title: string;
    subtitle: string;
    author: {
        name: string;
        role: string;
        image?: string;
    };
    publishedAt: string;
    readTime: string;
    imageUrl?: string;
}

export function ArticleHero({ category, title, subtitle, author, publishedAt, readTime, imageUrl }: ArticleHeroProps) {
    return (
        <div className="relative w-full">
            {/* Hero Content Overlay for Immersive Feel */}
            <div className="container mx-auto px-4 pt-12 pb-8 md:pt-20 md:pb-12 relative z-10">
                <div className="max-w-4xl">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="px-3 py-1 bg-primary text-primary-foreground text-sm font-bold uppercase tracking-widest rounded-sm">
                            {category}
                        </span>
                        <span className="text-muted-foreground flex items-center gap-1 text-sm font-medium">
                            <Clock className="w-4 h-4" /> {readTime} read
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6 text-foreground">
                        {title}
                    </h1>

                    <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-8 max-w-3xl border-l-4 border-primary pl-6">
                        {subtitle}
                    </p>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-t border-border pt-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-muted rounded-full overflow-hidden border-2 border-background shadow-sm">
                                {/* Placeholder for Author Image */}
                                <div className="w-full h-full bg-slate-300 flex items-center justify-center text-slate-600 font-bold">
                                    {author.name.charAt(0)}
                                </div>
                            </div>
                            <div>
                                <p className="font-bold text-foreground">{author.name}</p>
                                <p className="text-sm text-primary font-medium">{author.role}</p>
                            </div>
                            <div className="h-8 w-px bg-border mx-2 hidden md:block" />
                            <div className="text-sm text-muted-foreground hidden md:block">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    {publishedAt}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold mr-2 md:hidden">Share:</span>
                            <button className="p-2 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-all">
                                <Facebook className="w-4 h-4" />
                            </button>
                            <button className="p-2 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-all">
                                <Twitter className="w-4 h-4" />
                            </button>
                            <button className="p-2 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-all">
                                <Linkedin className="w-4 h-4" />
                            </button>
                            <button className="p-2 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-all">
                                <LinkIcon className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hero Image */}
            <div className="w-full h-[50vh] md:h-[70vh] relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
                <div
                    className="w-full h-full bg-cover bg-center bg-fixed transform group-hover:scale-105 transition-transform duration-1000 ease-out"
                    style={{ backgroundImage: `url(${imageUrl || '/hero-placeholder.jpg'})` }}
                />
                <div className="absolute bottom-4 right-4 z-20 text-xs text-white/70 bg-black/50 px-2 py-1 rounded">
                    Photo: Reuters / Stringer
                </div>
            </div>
        </div>
    );
}
