"use client";

import { Play, Info } from "lucide-react";
import { motion } from "framer-motion";

export default function HeroSection() {
    return (
        <div className="relative h-[80vh] w-full overflow-hidden">
            {/* Background Image/Video */}
            <div className="absolute inset-0">
                <img
                    src="https://images.unsplash.org/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop"
                    alt="Hero Background"
                    className="h-full w-full object-cover"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />
            </div>

            {/* Content */}
            <div className="relative z-10 flex h-full flex-col justify-center px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-xl space-y-4"
                >
                    <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl drop-shadow-lg">
                        Stranger Things
                    </h1>
                    <p className="text-lg text-gray-200 drop-shadow-md line-clamp-3">
                        When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces, and one strange little girl.
                    </p>

                    <div className="flex items-center gap-4 pt-4">
                        <button className="flex items-center gap-2 rounded bg-white px-6 py-2.5 text-base font-bold text-black hover:bg-white/90 transition active:scale-95">
                            <Play className="w-5 h-5 fill-black" /> Play
                        </button>
                        <button className="flex items-center gap-2 rounded bg-gray-500/70 px-6 py-2.5 text-base font-bold text-white hover:bg-gray-500/50 transition active:scale-95 backdrop-blur-sm">
                            <Info className="w-5 h-5" /> More Info
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
