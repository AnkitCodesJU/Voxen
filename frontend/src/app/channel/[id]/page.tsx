"use client";

import Navbar from "@/components/Navbar";
import VideoCard from "@/components/VideoCard";

const channelVideos = Array.from({ length: 8 }).map((_, i) => ({
    id: `chan-vid-${i}`,
    title: `Channel Video Content ${i + 1}`,
    thumbnail: `https://picsum.photos/seed/chan${i}/1280/720`,
    channelName: "CodeMaster",
    channelAvatar: "https://picsum.photos/seed/channel_main/200/200",
    views: Math.floor(Math.random() * 20000),
    uploadedAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)),
    duration: "15:00"
}));

export default function ChannelPage({ params }: { params: { username: string } }) {
    return (
        <div className="min-h-screen">
            <Navbar />

            {/* Banner */}
            <div className="h-40 md:h-60 w-full bg-gradient-to-r from-red-900 to-black relative">
                <img
                    src="https://images.unsplash.org/photo-1550751827-4bd374c3f58b?q=80&w=2670&auto=format&fit=crop"
                    alt="Cover"
                    className="w-full h-full object-cover opacity-50"
                />
            </div>

            {/* Info */}
            <div className="px-4 md:px-12 py-8 container mx-auto">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8 border-b border-zinc-800 pb-8">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-black -mt-16 md:-mt-0 relative z-10 bg-zinc-800">
                        <img src="https://picsum.photos/seed/channel_main/200/200" alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                    <div className="text-center md:text-left flex-1 space-y-2">
                        <h1 className="text-3xl font-bold text-white">CodeMaster</h1>
                        <div className="text-zinc-400 text-sm flex flex-col md:flex-row gap-1 md:gap-4 justify-center md:justify-start">
                            <span>@codemaster</span>
                            <span>•</span>
                            <span>500K subscribers</span>
                            <span>•</span>
                            <span>245 videos</span>
                        </div>
                        <p className="text-zinc-300 max-w-2xl">
                            Teaching you everything about Full Stack Development. Next.js, React, Node.js, and more!
                            New videos every week.
                        </p>
                        <button className="bg-white text-black font-bold px-8 py-2 rounded-full mt-4 hover:bg-zinc-200">
                            Subscribe
                        </button>
                    </div>
                </div>

                {/* Videos Grid */}
                <section>
                    <h2 className="text-xl font-bold text-white mb-6">Latest Videos</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
                        {channelVideos.map((video) => (
                            <VideoCard key={video.id} {...video} />
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
