"use client";

import { motion } from "framer-motion";
import { Clock, MessageCircle, Share2, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface NewsCardProps {
    slug: string;
    category: string;
    title: string;
    excerpt: string;
    author: string;
    timeAgo: string;
    imageUrl?: string;
    featured?: boolean;
    isExternal?: boolean;
    externalLink?: string;
}

export function NewsCard({ slug, category, title, excerpt, author, timeAgo, imageUrl, featured = false, isExternal, externalLink }: NewsCardProps) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
                "group relative overflow-hidden rounded-xl bg-card border border-border shadow-sm hover:shadow-md transition-all",
                featured ? "md:col-span-2 md:row-span-2 min-h-[400px]" : "min-h-[300px]"
            )}
        >
            {isExternal && externalLink ? (
                <a href={externalLink} target="_blank" rel="noopener noreferrer" className="absolute inset-0 z-10">
                    <span className="sr-only">Read more about {title}</span>
                </a>
            ) : (
                <Link href={`/article/${slug}`} className="absolute inset-0 z-10">
                    <span className="sr-only">Read more about {title}</span>
                </Link>
            )}

            {/* Image Background or Gradient */}
            <div className="absolute inset-0 bg-muted">
                {imageUrl ? (
                    // In a real app, use next/image here
                    <div
                        className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                        style={{ backgroundImage: `url(${imageUrl})` }}
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary transition-transform duration-700 group-hover:scale-105" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            </div>

            <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary text-primary-foreground uppercase tracking-wider">
                            {category}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-slate-300 font-medium">
                            <Clock className="w-3 h-3" /> {timeAgo}
                        </span>
                    </div>

                    <h3 className={cn(
                        "font-bold text-white leading-tight group-hover:text-primary transition-colors",
                        featured ? "text-3xl md:text-4xl" : "text-xl"
                    )}>
                        {title}
                    </h3>

                    {featured && (
                        <p className="text-slate-300 line-clamp-2 md:line-clamp-3 text-sm md:text-base">
                            {excerpt}
                        </p>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold text-white">
                                {author.charAt(0)}
                            </div>
                            <span className="text-xs font-medium text-slate-300">by {author}</span>
                        </div>

                        <div className="flex items-center gap-3 z-20">
                            <button className="text-slate-300 hover:text-white transition-colors">
                                <Share2 className="w-4 h-4" />
                            </button>
                            <button className="text-slate-300 hover:text-white transition-colors">
                                <MessageCircle className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-4 group-hover:translate-x-0">
                <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20">
                    <ArrowUpRight className="w-5 h-5" />
                </div>
            </div>
        </motion.div>
    );
}
