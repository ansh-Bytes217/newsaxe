import { BreakingNewsBanner } from "@/components/features/BreakingNewsBanner";
import { NewsCard } from "@/components/features/NewsCard";
import { ArrowRight, Flame, TrendingUp } from "lucide-react";
import Link from "next/link";

const FEATURED_NEWS = [
  {
    slug: "quantum-processor-speed-record",
    category: "Technology",
    title: "The Quantum Leap: New Processor Breaks Speed Records",
    excerpt: "Scientists have unveiled a new quantum processor that solves complex problems in seconds, marking a historic milestone in computing history.",
    author: "Sarah Jenks",
    timeAgo: "2 hours ago",
    featured: true,
    imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop",
  },
  {
    slug: "global-climate-accord",
    category: "World",
    title: "Global Summit Reaches Historic Climate Accord",
    excerpt: "Leaders from 150 nations agree to aggressive carbon reduction targets.",
    author: "David Chen",
    timeAgo: "4 hours ago",
    featured: false,
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop",
  },
  {
    slug: "crypto-volatility",
    category: "Finance",
    title: "Crypto Markets see unprecedented Volatility",
    excerpt: "Bitcoin and Ethereum swing wildly as new regulations are proposed.",
    author: "Amanda Roth",
    timeAgo: "30 mins ago",
    featured: false,
    imageUrl: "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?q=80&w=2070&auto=format&fit=crop",
  },
  {
    slug: "election-key-states",
    category: "Politics",
    title: "Election Year: Key States to Watch",
    excerpt: "Analysis of the swing states that could decide the upcoming election.",
    author: "Marcus Johnson",
    timeAgo: "5 hours ago",
    featured: false,
    imageUrl: "https://images.unsplash.com/photo-1540910419868-4756443e5cde?q=80&w=2073&auto=format&fit=crop",
  },
  {
    slug: "mars-colony-foundation",
    category: "Science",
    title: "Mars Colony: First Foundation Laid",
    excerpt: "SpaceX announces the successful deployment of the first habitat module.",
    author: "Elon M.",
    timeAgo: "1 hour ago",
    featured: false,
    imageUrl: "https://images.unsplash.com/photo-1541872703-74c5963631df?q=80&w=2070&auto=format&fit=crop",
  },
];

const FEED_NEWS = [
  {
    category: "Tech",
    title: "Revolutionary AI Model Predicts Weather with 99% Accuracy",
    excerpt: "New deep learning algorithms are changing how we understand climate patterns and plan for extreme weather events.",
    imageUrl: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=2070&auto=format&fit=crop",
    timeAgo: "12 mins ago"
  },
  {
    category: "Health",
    title: "New Vaccine Shows Promise Against Malaria",
    excerpt: "Early trials indicate a 77% efficacy rate, giving hope to millions in affected regions.",
    imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=2030&auto=format&fit=crop",
    timeAgo: "1 hour ago"
  },
  {
    category: "Sports",
    title: "Underdog Team Wins Championship in Stunning Upset",
    excerpt: "Against all odds, the city celebrates its first major trophy in over 40 years.",
    imageUrl: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=2070&auto=format&fit=crop",
    timeAgo: "3 hours ago"
  },
  {
    category: "Business",
    title: "Merger Talks Between Tech Giants Stall",
    excerpt: "Regulatory concerns have put the multi-billion dollar deal on hold indefinitely.",
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop",
    timeAgo: "5 hours ago"
  },
  {
    category: "Travel",
    title: "Top 10 Hidden Gems to Visit This Summer",
    excerpt: "Escape the crowds and discover these breathtaking destinations off the beaten path.",
    imageUrl: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop",
    timeAgo: "1 day ago"
  }
];

const TRENDING_TOPICS = ["#TechTrends", "#ClimateAction", "#SpaceX", "#CryptoCrash", "#Election2026"];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <BreakingNewsBanner />

      {/* Hero / Featured Section */}
      <section className="py-8 md:py-12 px-4 container mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight flex items-center gap-3">
            <Flame className="w-8 h-8 md:w-10 md:h-10 text-destructive" />
            Top Stories
          </h1>
          <Link href="/latest" className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-1 group">
            View All <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURED_NEWS.map((news, index) => (
            <NewsCard key={index} {...news} />
          ))}
        </div>
      </section>

      {/* Trending Section */}
      <section className="bg-muted/30 py-12 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Trending Topics</h2>
          </div>
          <div className="flex flex-wrap gap-4">
            {TRENDING_TOPICS.map(topic => (
              <Link key={topic} href={`/search?q=${topic}`} className="px-6 py-3 bg-card border border-border rounded-full font-medium shadow-sm hover:shadow-md hover:border-primary/50 transition-all text-sm md:text-base">
                {topic}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Feed Section */}
      <section className="py-12 container mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <h2 className="text-3xl font-bold">Latest News</h2>
          </div>

          {/* Feed List Items (Simpler view) */}
          <div className="space-y-6">
            {FEED_NEWS.map((item, index) => (
              <div key={index} className="flex gap-4 group cursor-pointer">
                <div className="w-32 h-24 bg-muted rounded-lg shrink-0 overflow-hidden relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="flex-1 py-1">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                    <span className="text-primary font-semibold">{item.category}</span>
                    <span>•</span>
                    <span>{item.timeAgo}</span>
                  </div>
                  <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                    {item.excerpt}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full py-4 bg-muted/50 hover:bg-muted text-muted-foreground font-medium rounded-lg transition-colors border border-border border-dashed">
            Load More Stories
          </button>
        </div>

        <aside className="space-y-8">
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-xl mb-4">Newsletter</h3>
            <p className="text-muted-foreground text-sm mb-4">Get the latest breaking news delivered straight to your inbox.</p>
            <div className="space-y-3">
              <input type="email" placeholder="Your email address" className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" />
              <button className="w-full py-2 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-colors">
                Subscribe
              </button>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-xl mb-4">Most Read</h3>
            <ul className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <li key={i} className="flex items-start gap-3 group cursor-pointer">
                  <span className="text-3xl font-black text-muted/50 group-hover:text-primary/50 transition-colors leading-none">0{i}</span>
                  <p className="font-medium text-sm leading-snug group-hover:text-primary transition-colors">
                    Understanding the new global economic policies and their impact.
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </section>
    </div>
  );
}
