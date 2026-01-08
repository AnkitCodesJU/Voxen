"use client";

import { useParameters } from "next/navigation";
import Navbar from "@/components/Navbar";
import LiveChat from "@/components/LiveChat";
import { ThumbsUp, Share2, Disc } from "lucide-react";

export default function LiveRoomPage({ params }: { params: { id: string } }) {
    // Use params directly or unwrap if needed in newer nextjs versions
    // For standard usage in page components, params is passed as prop

    return (
        <div className="min-h-screen">
            <Navbar />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content: Video Player */}
                <div className="lg:col-span-2 space-y-4">
                    {/* Player Wrapper */}
                    <div className="aspect-video w-full bg-black rounded-xl overflow-hidden shadow-2xl relative group">
                        {/* Simulated Player */}
                        <img
                            src="https://images.unsplash.org/photo-1536240478700-b869060f5c79?q=80&w=2000&auto=format&fit=crop"
                            alt="Stream Placeholder"
                            className="w-full h-full object-cover opacity-60"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 animate-pulse">
                                <Disc className="animate-spin" /> LIVE SESSIONS
                            </div>
                        </div>

                        {/* Controls Overlay (Fake) */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="h-1 bg-zinc-600 rounded-full mb-4">
                                <div className="h-full w-[95%] bg-red-600 rounded-full relative">
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-red-600 rounded-full shadow"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Video Info */}
                    <div className="space-y-4 px-1">
                        <h1 className="text-2xl font-bold text-white">Advanced Backend Engineering with Node.js - System Design Patterns</h1>

                        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-600 overflow-hidden">
                                    <img src="https://picsum.photos/200/200" alt="Channel" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">FullStack Academy</h3>
                                    <p className="text-xs text-zinc-400">1.2M Subscribers</p>
                                </div>
                                <button className="ml-4 bg-white text-black px-4 py-1.5 rounded-full font-bold text-sm hover:bg-zinc-200">
                                    Subscribe
                                </button>
                            </div>

                            <div className="flex items-center gap-4">
                                <button className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-full text-sm font-bold text-white">
                                    <ThumbsUp className="w-4 h-4" /> 12K
                                </button>
                                <button className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-full text-sm font-bold text-white">
                                    <Share2 className="w-4 h-4" /> Share
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar: Chat */}
                <div className="lg:col-span-1">
                    <LiveChat roomId={"test-room"} />
                </div>
            </div>
        </div>
    );
}
