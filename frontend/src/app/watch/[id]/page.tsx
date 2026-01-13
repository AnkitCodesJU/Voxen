"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import CommentSection from "@/components/CommentSection";
import VideoCard from "@/components/VideoCard";
import { ThumbsUp, ThumbsDown, Share2, MoreHorizontal } from "lucide-react";
import api from "@/lib/axios";
import { formatDistanceToNow } from "date-fns";

export default function WatchPage() {
    const params = useParams();
    const videoId = params?.id as string;

    const [video, setVideo] = useState<any>(null);
    const [recommendations, setRecommendations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [subscribersCount, setSubscribersCount] = useState(0);
    const [likesCount, setLikesCount] = useState(0);
    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!videoId) return;
            setLoading(true);
            try {
                // Fetch Video Details
                const videoRes = await api.get(`/videos/${videoId}`);
                const videoData = videoRes.data.data;
                setVideo(videoData);

                // Set states from video data
                setLikesCount(videoData.likesCount || 0);
                setIsLiked(videoData.isLiked || false);
                setIsSubscribed(videoData.owner?.isSubscribed || false);
                setSubscribersCount(videoData.owner?.subscribersCount || 0);

                // Recommendations
                const recsRes = await api.get("/videos");
                const allVideos = recsRes.data.data.docs || [];
                setRecommendations(allVideos.filter((v: any) => v._id !== videoId));

                // Add to watch history
                await api.post(`/users/history/${videoId}`);

            } catch (err) {
                console.error("Error fetching video data", err);
                setError("Failed to load video");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [videoId]);

    const handleSubscribe = async () => {
        if (!video?.owner?._id) return;
        try {
            const res = await api.post(`/subscriptions/c/${video.owner._id}`);
            setIsSubscribed(res.data.data.subscribed);
            setSubscribersCount(prev => res.data.data.subscribed ? prev + 1 : prev - 1);
        } catch (error) {
            console.error("Error toggling subscription", error);
        }
    };

    const handleLike = async () => {
        try {
            const res = await api.post(`/likes/toggle/v/${videoId}`);
            const newIsLiked = res.data.data.isLiked;
            setIsLiked(newIsLiked);
            setLikesCount(prev => newIsLiked ? prev + 1 : prev - 1);
        } catch (error) {
            console.error("Error toggling like", error);
        }
    };

    if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>;
    if (error || !video) return <div className="min-h-screen bg-black flex items-center justify-center text-red-500">{error || "Video not found"}</div>;

    return (
        <div className="min-h-screen bg-black p-4 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2">
                    {/* Player */}
                    <div className="aspect-video w-full bg-black rounded-xl overflow-hidden shadow-2xl relative mb-4">
                        <video
                            src={video.videoFile}
                            poster={video.thumbnail}
                            controls
                            autoPlay
                            className="w-full h-full object-contain"
                        >
                            Your browser does not support the video tag.
                        </video>
                    </div>

                    {/* Title & Info */}
                    <h1 className="text-xl font-bold text-white mb-2">{video.title}</h1>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-zinc-700 overflow-hidden">
                                <img
                                    src={video.owner?.avatar || "https://picsum.photos/200/200"}
                                    alt={video.owner?.fullName}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div>
                                <h3 className="font-bold text-white">{video.owner?.fullName || "Unknown Channel"}</h3>
                                <p className="text-xs text-zinc-400">{subscribersCount} Subscribers</p>
                            </div>
                            <button
                                onClick={handleSubscribe}
                                className={`px-4 py-2 rounded-full font-bold transition ${isSubscribed ? 'bg-zinc-800 text-white hover:bg-zinc-700' : 'bg-white text-black hover:bg-zinc-200'}`}
                            >
                                {isSubscribed ? 'Subscribed' : 'Subscribe'}
                            </button>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="flex items-center bg-zinc-800 rounded-full">
                                <button
                                    onClick={handleLike}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-l-full border-r border-zinc-700 font-bold text-sm ${isLiked ? 'text-blue-500' : 'text-white hover:bg-zinc-700'}`}
                                >
                                    <ThumbsUp className="w-4 h-4" fill={isLiked ? "currentColor" : "none"} /> {likesCount > 0 ? likesCount : "Like"}
                                </button>
                                <button className="hover:bg-zinc-700 px-4 py-2 rounded-r-full text-white">
                                    <ThumbsDown className="w-4 h-4" />
                                </button>
                            </div>
                            <button className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-full font-bold text-sm text-white">
                                <Share2 className="w-4 h-4" /> Share
                            </button>
                            <button className="bg-zinc-800 hover:bg-zinc-700 p-2 rounded-full text-white">
                                <MoreHorizontal className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mt-4 bg-zinc-900/50 p-4 rounded-xl cursor-pointer hover:bg-zinc-900 transition">
                        <div className="flex gap-2 text-sm font-bold text-white mb-2">
                            <span>{video.views} views</span>
                            <span>•</span>
                            <span>{video.createdAt ? formatDistanceToNow(new Date(video.createdAt), { addSuffix: true }) : ''}</span>
                        </div>
                        <p className="text-sm text-white whitespace-pre-line">
                            {video.description}
                        </p>
                    </div>

                    {/* Comments */}
                    <CommentSection videoId={videoId as string} />
                </div>

                {/* Recommendations Sidebar */}
                <div className="lg:col-span-1 space-y-4">
                    {recommendations.map((rec) => (
                        <VideoCard
                            key={rec._id}
                            _id={rec._id}
                            title={rec.title}
                            thumbnail={rec.thumbnail}
                            channelName={rec.owner?.fullName}
                            channelAvatar={rec.owner?.avatar}
                            channelId={rec.owner?._id}
                            views={rec.views}
                            createdAt={rec.createdAt}
                            duration={formatDuration(rec.duration)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

// Helper to format duration (if stored as seconds in number, which it is in video.controller)
function formatDuration(seconds: number) {
    if (!seconds) return "00:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' + sec : sec}`;
}
