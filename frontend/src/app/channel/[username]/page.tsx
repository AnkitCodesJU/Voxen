"use client";

import React, { useEffect, useState } from "react";
import VideoCard from "@/components/VideoCard";
import api from "@/lib/axios";
import { useParams } from "next/navigation";

interface ChannelProfile {
    _id: string;
    fullName: string;
    username: string;
    avatar: string;
    coverImage: string;
    subscribersCount: number;
    channelsSubscribedToCount: number;
    isSubscribed: boolean;
    email: string;
}

export default function ChannelPage() {
    const params = useParams();
    const username = params?.username as string;

    const [profile, setProfile] = useState<ChannelProfile | null>(null);
    const [videos, setVideos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!username) return;

        const fetchChannelData = async () => {
            try {
                setLoading(true);

                // Fetch Profile and Videos in parallel to reduce loading time
                const [profileRes, videosRes] = await Promise.all([
                    api.get(`/users/c/${username}`),
                    api.get(`/videos?username=${username}`)
                ]);

                if (profileRes.data.success) {
                    setProfile(profileRes.data.data);
                }

                if (videosRes.data.success) {
                    setVideos(videosRes.data.data.docs);
                }

            } catch (err: any) {
                console.error("Error fetching channel data:", err);
                setError(err.response?.data?.message || "Failed to load channel");
            } finally {
                setLoading(false);
            }
        };

        fetchChannelData();
    }, [username]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4">
                <h1 className="text-2xl font-bold">Channel Not Found</h1>
                <p className="text-zinc-400">{error || "The channel you are looking for does not exist."}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen">

            {/* Banner */}
            <div className="h-40 md:h-60 w-full bg-gradient-to-r from-zinc-900 to-black relative overflow-hidden">
                {profile.coverImage ? (
                    <img
                        src={profile.coverImage}
                        alt="Cover"
                        className="w-full h-full object-cover opacity-80"
                    />
                ) : (
                    <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-zinc-600">
                        No Cover Image
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="px-4 md:px-12 py-8 container mx-auto">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8 border-b border-zinc-800 pb-8">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-black -mt-16 md:-mt-0 relative z-10 bg-zinc-800">
                        <img
                            src={profile.avatar || "https://picsum.photos/seed/default/200/200"}
                            alt={profile.fullName}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="text-center md:text-left flex-1 space-y-2">
                        <h1 className="text-3xl font-bold text-white">{profile.fullName}</h1>
                        <div className="text-zinc-400 text-sm flex flex-col md:flex-row gap-1 md:gap-4 justify-center md:justify-start">
                            <span>@{profile.username}</span>
                            <span>•</span>
                            <span>{profile.subscribersCount} subscribers</span>
                            <span>•</span>
                            <span>{videos.length} videos</span>
                        </div>
                        <button className="bg-white text-black font-bold px-8 py-2 rounded-full mt-4 hover:bg-zinc-200 transition-colors">
                            {profile.isSubscribed ? "Subscribed" : "Subscribe"}
                        </button>
                    </div>
                </div>

                {/* Videos Grid */}
                <section>
                    <h2 className="text-xl font-bold text-white mb-6">Latest Videos</h2>
                    {videos.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
                            {videos.map((video) => (
                                <VideoCard key={video._id} {...video} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-zinc-500">No videos uploaded yet.</p>
                    )}
                </section>
            </div>
        </div>
    );
}
