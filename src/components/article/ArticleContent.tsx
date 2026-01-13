"use client";

import { cn } from "@/lib/utils";
import { Quote, BarChart2, Play } from "lucide-react";

export function ArticleContent() {
    return (
        <article className="prose prose-lg md:prose-xl dark:prose-invert max-w-none text-foreground leading-loose">
            <p className="lead text-2xl font-medium text-foreground/80 mb-8 first-letter:text-7xl first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-[-10px] first-letter:text-primary">
                The agreement marks a watershed moment in international diplomacy, as 150 nations came together in Geneva to sign what is being called the "Planetary Pact."
                Observers say this level of consensus hasn't been seen since the Paris Agreement.
            </p>

            <p>
                In a hall filled with anticipation, the final gavel drop was met with a thunderous standing ovation.
                Diplomats, scientists, and activists — many of whom have spent decades advocating for these measures — were visibly moved.
                The pact outlines aggressive strategies for carbon reduction, aiming for net-zero global emissions by 2040, a full decade ahead of previous targets.
            </p>

            {/* Interactive/Rich Element: Pull Quote */}
            <div className="my-12 relative p-8 md:p-12 bg-secondary/30 rounded-2xl border-l-4 border-primary">
                <Quote className="absolute top-8 left-8 w-12 h-12 text-primary/20" />
                <blockquote className="relative z-10 text-2xl md:text-3xl font-serif italic text-foreground text-center">
                    "We are not just signing a document today; we are signing a new covenant with the future. This is the turning point humanity has been waiting for."
                </blockquote>
                <div className="mt-6 text-center font-bold text-primary">— Secretary General Elena Vlasov</div>
            </div>

            <h2 className="text-3xl font-bold mt-12 mb-6 flex items-center gap-3">
                <span className="w-2 h-8 bg-destructive rounded-full" />
                The Economic Protocols
            </h2>

            <p>
                Perhaps the most controversial aspect of the agreement is the "Carbon Dividend" framework.
                Under this new economic model, heavy industries will face a progressive tax on emissions, the proceeds of which will be directly redistributed to renewable energy infrastructure projects in developing nations.
            </p>

            <div className="grid md:grid-cols-2 gap-8 my-10">
                <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-4 text-primary font-bold">
                        <BarChart2 className="w-5 h-5" />
                        <span>Projected Emission Drops</span>
                    </div>
                    {/* Mock Chart Visualization */}
                    <div className="h-48 flex items-end justify-between gap-2 px-2">
                        {[40, 60, 45, 80, 55, 90, 30, 20].map((h, i) => (
                            <div key={i} className="w-full bg-primary/20 hover:bg-primary transition-colors rounded-t-sm relative group" style={{ height: `${h}%` }}>
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                    {h}%
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-muted-foreground uppercase">
                        <span>2026</span>
                        <span>2035</span>
                    </div>
                </div>

                <div className="relative rounded-xl overflow-hidden bg-black aspect-video flex items-center justify-center group cursor-pointer">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center opacity-70 group-hover:opacity-50 transition-opacity" />
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/40 group-hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 text-white ml-1" />
                    </div>
                    <p className="absolute bottom-4 left-4 text-white font-bold text-sm">Watch: Keynote Address Highlights</p>
                </div>
            </div>

            <p>
                Critics argue that the timeline is too aggressive and could destabilize emerging markets.
                "It's ambitious, yes, but is it feasible?" asked Dr. Aris Thorne, a senior economist at the Global Policy Institute.
                "The supply chains for green hydrogen simply do not exist at this scale yet."
            </p>
        </article>
    );
}
