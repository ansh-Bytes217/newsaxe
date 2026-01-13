"use client";

import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";

export function BreakingNewsBanner() {
    return (
        <div className="bg-destructive text-destructive-foreground overflow-hidden py-2 relative">
            <div className="container mx-auto px-4 flex items-center gap-4">
                <div className="flex items-center gap-2 font-bold whitespace-nowrap z-10 bg-destructive pr-4 shadow-[10px_0_10px_-5px_hsl(var(--destructive))]">
                    <AlertCircle className="w-4 h-4 animate-pulse" />
                    BREAKING
                </div>
                <div className="flex-1 overflow-hidden relative">
                    <motion.div
                        className="whitespace-nowrap inline-block"
                        animate={{ x: ["100%", "-100%"] }}
                        transition={{
                            repeat: Infinity,
                            duration: 20,
                            ease: "linear",
                        }}
                    >
                        <span className="mr-8">Global Markets Rally to All-Time Highs as Tech Sector Surges</span>
                        <span className="mr-8">•</span>
                        <span className="mr-8">Major Climate Accord Signed by 150 Nations in Historic Summit</span>
                        <span className="mr-8">•</span>
                        <span className="mr-8">New Space Station Module Successfully Docked After 12-Hour Journey</span>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
