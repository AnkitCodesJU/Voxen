"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/axios";
import VideoCard from "@/components/VideoCard";

export default function WatchLaterPage() {
    const { isLoggedIn } = useAuth();
    const [watchLater, setWatchLater] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isLoggedIn) {
            fetchWatchLater();
        } else {
            setLoading(false);
        }
    }, [isLoggedIn]);

    const fetchWatchLater = async () => {
        try {
            const res = await api.get("/users/watch-later");
            setWatchLater(res.data.data);
        } catch (error) {
            console.error("Error fetching watch later list", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="min-h-screen bg-black text-white p-8">Loading Watch Later...</div>;

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <h1 className="text-3xl font-bold mb-6">Watch Later</h1>
            {isLoggedIn ? (
                watchLater.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {watchLater.map((video) => (
                            <VideoCard
                                key={video._id}
                                _id={video._id}
                                title={video.title}
                                thumbnail={video.thumbnail}
                                channelName={video.owner?.fullName || "Unknown"}
                                channelAvatar={video.owner?.avatar}
                                channelId={video.owner?._id}
                                views={video.views}
                                createdAt={video.createdAt}
                                duration={formatDuration(video.duration)}
                                videoFile={video.videoFile}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-zinc-400">No videos in Watch Later.</p>
                )
            ) : (
                <p className="text-zinc-400">Please sign in to view your Watch Later list.</p>
            )}
        </div>
    );
}

function formatDuration(seconds: number) {
    if (!seconds) return "00:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' + sec : sec}`;
}
