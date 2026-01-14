"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/axios";
import VideoCard from "@/components/VideoCard";

export default function LikedVideosPage() {
    const { isLoggedIn } = useAuth();
    const [videos, setVideos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isLoggedIn) {
            fetchLikedVideos();
        } else {
            setLoading(false);
        }
    }, [isLoggedIn]);

    const fetchLikedVideos = async () => {
        try {
            const res = await api.get("/likes/videos");
            // The structure from like controller: data is array of objects { _id, video: {...}, ... }
            // We need to map it to just video objects for VideoCard, or adjust VideoCard usage.
            // Let's inspect what controller returns: "Liked videos fetched successfully" -> array of like documents populated with 'video'.
            // So we need to map v.video
            const likes = res.data.data;
            const videoList = likes.map((like: any) => like.video).filter((v: any) => v); // filter nulls
            setVideos(videoList);
        } catch (error) {
            console.error("Error fetching liked videos", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="min-h-screen bg-black text-white p-8">Loading...</div>;

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <h1 className="text-3xl font-bold mb-6">Liked Videos</h1>
            {isLoggedIn ? (
                videos.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {videos.map((video) => (
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
                                videoFile={video.videoFile} // Pass video file for download
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-zinc-400">No liked videos found.</p>
                )
            ) : (
                <p className="text-zinc-400">Please sign in to view your liked videos.</p>
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
