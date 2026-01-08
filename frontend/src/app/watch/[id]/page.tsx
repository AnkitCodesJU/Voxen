"use client";

import Navbar from "@/components/Navbar";
import CommentSection from "@/components/CommentSection";
import VideoCard from "@/components/VideoCard";
import { ThumbsUp, ThumbsDown, Share2, MoreHorizontal } from "lucide-react";

// Mock recommendations
const recommendations = Array.from({ length: 8 }).map((_, i) => ({
    id: `rec-${i}`,
    title: `Recommended Video Title ${i + 1}`,
    thumbnail: `https://picsum.photos/seed/rec${i}/1280/720`,
    channelName: "Recommended Channel",
    channelAvatar: `https://picsum.photos/seed/avatar_rec${i}/200/200`,
    views: Math.floor(Math.random() * 50000),
    uploadedAt: new Date(),
    duration: "12:45"
}));

export default function WatchPage({ params }: { params: { id: string } }) {
    return (
        <div className="min-h-screen">
            <Navbar />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-0">
                {/* Main Content */}
                <div className="lg:col-span-2">
                    {/* Player */}
                    <div className="aspect-video w-full bg-black rounded-xl overflow-hidden shadow-2xl relative mb-4">
                        <img
                            src="https://images.unsplash.org/photo-1611162617474-5b21e879e113?q=80&w=1974&auto=format&fit=crop"
                            alt="Video Placeholder"
                            className="w-full h-full object-cover"
                        />
                        {/* Fake Play Button Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/40 cursor-pointer">
                            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center pl-1 shadow-lg">
                                <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[20px] border-l-white border-b-[10px] border-b-transparent"></div>
                            </div>
                        </div>
                    </div>

                    {/* Title & Info */}
                    <h1 className="text-xl font-bold text-white mb-2">Building a Full Stack Clone with Next.js 15 & Express</h1>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-zinc-700 overflow-hidden">
                                <img src="https://picsum.photos/seed/channel_main/200/200" alt="Channel" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white">CodeMaster</h3>
                                <p className="text-xs text-zinc-400">500K Subscribers</p>
                            </div>
                            <button className="bg-white text-black font-bold px-4 py-2 rounded-full hover:bg-zinc-200 transaction">
                                Subscribe
                            </button>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="flex items-center bg-zinc-800 rounded-full">
                                <button className="flex items-center gap-2 hover:bg-zinc-700 px-4 py-2 rounded-l-full border-r border-zinc-700 font-bold text-sm">
                                    <ThumbsUp className="w-4 h-4" /> 15K
                                </button>
                                <button className="hover:bg-zinc-700 px-4 py-2 rounded-r-full">
                                    <ThumbsDown className="w-4 h-4" />
                                </button>
                            </div>
                            <button className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-full font-bold text-sm">
                                <Share2 className="w-4 h-4" /> Share
                            </button>
                            <button className="bg-zinc-800 hover:bg-zinc-700 p-2 rounded-full">
                                <MoreHorizontal className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mt-4 bg-zinc-900/50 p-4 rounded-xl cursor-pointer hover:bg-zinc-900 transition">
                        <div className="flex gap-2 text-sm font-bold text-white mb-2">
                            <span>156K views</span>
                            <span>•</span>
                            <span>14 hours ago</span>
                        </div>
                        <p className="text-sm text-white whitespace-pre-line">
                            In this video, we will build a complete clone using the latest technologies.
                            We will cover Backend, Frontend, Live Streaming, and much more!

                            Timestamps:
                            0:00 Intro
                            2:30 Backend Setup
                            ...more
                        </p>
                    </div>

                    {/* Comments */}
                    <CommentSection videoId={params.id} />
                </div>

                {/* Recommendations Sidebar */}
                <div className="lg:col-span-1 space-y-4">
                    {recommendations.map((rec) => (
                        <VideoCard key={rec.id} {...rec} />
                    ))}
                </div>
            </div>
        </div>
    );
}
