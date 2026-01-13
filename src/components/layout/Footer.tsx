import Link from "next/link";
import { Twitter, Facebook, Instagram, Linkedin, Github } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-card border-t border-border mt-auto">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary rounded-br-lg rounded-tl-lg flex items-center justify-center text-primary-foreground font-bold text-xl">
                                N
                            </div>
                            <span className="text-2xl font-bold tracking-tighter">NewsAXE</span>
                        </Link>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            Delivering real-time breaking news with speed and accuracy. The future of digital journalism is here.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-bold mb-4 text-foreground">Categories</h3>
                        <ul className="space-y-2">
                            <li><Link href="/category/world" className="text-sm text-muted-foreground hover:text-primary transition-colors">World</Link></li>
                            <li><Link href="/category/tech" className="text-sm text-muted-foreground hover:text-primary transition-colors">Technology</Link></li>
                            <li><Link href="/category/politics" className="text-sm text-muted-foreground hover:text-primary transition-colors">Politics</Link></li>
                            <li><Link href="/category/sports" className="text-sm text-muted-foreground hover:text-primary transition-colors">Sports</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold mb-4 text-foreground">Company</h3>
                        <ul className="space-y-2">
                            <li><Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
                            <li><Link href="/careers" className="text-sm text-muted-foreground hover:text-primary transition-colors">Careers</Link></li>
                            <li><Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold mb-4 text-foreground">Connect</h3>
                        <div className="flex gap-4">
                            <Link href="#" className="p-2 bg-secondary rounded-full text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-all">
                                <Twitter className="w-4 h-4" />
                            </Link>
                            <Link href="#" className="p-2 bg-secondary rounded-full text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-all">
                                <Facebook className="w-4 h-4" />
                            </Link>
                            <Link href="#" className="p-2 bg-secondary rounded-full text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-all">
                                <Instagram className="w-4 h-4" />
                            </Link>
                            <Link href="#" className="p-2 bg-secondary rounded-full text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-all">
                                <Linkedin className="w-4 h-4" />
                            </Link>
                        </div>
                        <div className="mt-6">
                            <p className="text-xs text-muted-foreground">© 2026 NewsAXE Inc. All rights reserved.</p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
