import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function ArticleSidebar() {
    return (
        <aside className="sticky top-24 space-y-8">
            {/* Table of Contents */}
            <div className="bg-muted/30 rounded-xl p-6 border border-border">
                <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-4">In this article</h4>
                <ul className="space-y-3">
                    {["The Planetary Pact", "Economic Protocols", "Global Reaction", "What Happens Next?"].map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                            <span className="text-primary font-mono text-xs pt-1">0{i + 1}</span>
                            <Link href="#" className="text-sm font-medium hover:text-primary transition-colors text-foreground/80">
                                {item}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Related Stories */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold">Related Stories</h4>
                </div>
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <Link key={i} href="#" className="group block">
                            <div className="flex gap-3">
                                <div className="w-20 h-20 bg-muted rounded-lg shrink-0 overflow-hidden">
                                    <div className="w-full h-full bg-slate-200 group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold text-primary uppercase">Politics</span>
                                    <h5 className="text-sm font-bold leading-tight mt-1 group-hover:text-primary transition-colors">
                                        Senate votes on the new infrastructure bill today
                                    </h5>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Ad Placeholder */}
            <div className="w-full aspect-[3/4] bg-muted relative flex flex-col items-center justify-center text-muted-foreground text-xs rounded-xl border border-dashed border-border">
                <span>Advertisement</span>
            </div>
        </aside>
    );
}
