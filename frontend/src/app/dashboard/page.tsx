"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { PlusCircle, Video as VideoIcon, Radio, BarChart2, FileText, Image as ImageIcon, Trash2, Edit } from "lucide-react";
import api from "@/lib/axios";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Tab = "videos" | "posts";

export default function DashboardPage() {
    const { user, isLoggedIn, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const [stats, setStats] = useState<any>(null);
    const [videos, setVideos] = useState<any[]>([]);
    const [tweets, setTweets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<Tab>("videos");

    useEffect(() => {
        if (!authLoading && !isLoggedIn) {
            router.push("/login");
        }
    }, [isLoggedIn, authLoading, router]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!user?._id) return;

            try {
                // Fetch Stats
                const statsRes = await api.get("/dashboard/stats");
                setStats(statsRes.data.data);

                // Fetch Videos
                const videosRes = await api.get("/dashboard/videos");
                setVideos(videosRes.data.data.docs);

                // Fetch Tweets
                const tweetsRes = await api.get(`/tweets/user/${user._id}`);
                setTweets(tweetsRes.data.data);

            } catch (error) {
                console.error("Error fetching dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        if (isLoggedIn && user) {
            fetchDashboardData();
        }
    }, [isLoggedIn, user]);

    const handleDeleteTweet = async (tweetId: string) => {
        if (!confirm("Are you sure you want to delete this post?")) return;
        try {
            await api.delete(`/tweets/${tweetId}`);
            setTweets(tweets.filter(t => t._id !== tweetId));
        } catch (error) {
            console.error("Failed to delete tweet", error);
            alert("Failed to delete post");
        }
    };

    if (authLoading || loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-black text-white p-8 space-y-8">
            <h1 className="text-3xl font-bold">Creator Dashboard</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Views"
                    value={stats?.totalViews || 0}
                    icon={<BarChart2 className="text-blue-500" />}
                />
                <StatCard
                    title="Subscribers"
                    value={stats?.totalSubscribers || 0}
                    icon={<VideoIcon className="text-green-500" />}
                />
                <StatCard
                    title="Total Videos"
                    value={stats?.totalVideos || 0}
                    icon={<VideoIcon className="text-purple-500" />}
                />
                <StatCard
                    title="Total Likes"
                    value={stats?.totalLikes || 0}
                    icon={<PlusCircle className="text-pink-500" />}
                />
            </div>

            {/* Actions */}
            <div className="flex gap-4">
                <Link
                    href="/dashboard/upload"
                    className="flex items-center gap-2 bg-blue-600 px-6 py-3 rounded-md hover:bg-blue-700 transition"
                >
                    <PlusCircle className="w-5 h-5" />
                    Upload Video
                </Link>
                <Link
                    href="/live"
                    className="flex items-center gap-2 bg-red-600 px-6 py-3 rounded-md hover:bg-red-700 transition"
                >
                    <Radio className="w-5 h-5" />
                    Go Live
                </Link>
            </div>

            {/* Content Tabs */}
            <div className="flex border-b border-zinc-800">
                <button
                    onClick={() => setActiveTab("videos")}
                    className={cn(
                        "px-6 py-3 font-medium transition flex items-center gap-2",
                        activeTab === "videos" ? "border-b-2 border-red-600 text-white" : "text-zinc-400 hover:text-white"
                    )}
                >
                    <VideoIcon className="w-4 h-4" /> Videos
                </button>
                <button
                    onClick={() => setActiveTab("posts")}
                    className={cn(
                        "px-6 py-3 font-medium transition flex items-center gap-2",
                        activeTab === "posts" ? "border-b-2 border-red-600 text-white" : "text-zinc-400 hover:text-white"
                    )}
                >
                    <FileText className="w-4 h-4" /> Posts
                </button>
            </div>

            {/* Videos List */}
            {activeTab === "videos" && (
                <div className="bg-zinc-900 rounded-lg p-6">
                    <h2 className="text-xl font-bold mb-6">Your Videos</h2>
                    {videos.length === 0 ? (
                        <p className="text-gray-400">No videos uploaded yet.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-zinc-800 text-gray-400">
                                        <th className="pb-4">Video</th>
                                        <th className="pb-4">Status</th>
                                        <th className="pb-4">Date Uploaded</th>
                                        <th className="pb-4">Views</th>
                                        <th className="pb-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {videos.map((video) => (
                                        <tr key={video._id} className="border-b border-zinc-800 last:border-0 hover:bg-zinc-800/50 transition">
                                            <td className="py-4 flex gap-4 items-center">
                                                <img src={video.thumbnail} alt={video.title} className="w-16 h-9 object-cover rounded" />
                                                <span className="font-medium truncate max-w-[200px]">{video.title}</span>
                                            </td>
                                            <td className="py-4">
                                                <span className={`px-2 py-1 rounded text-xs ${video.isPublished ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                                    {video.isPublished ? 'Published' : 'Draft'}
                                                </span>
                                            </td>
                                            <td className="py-4 text-gray-400 text-sm">
                                                {new Date(video.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="py-4 text-gray-400 text-sm">
                                                {video.views}
                                            </td>
                                            <td className="py-4">
                                                <button className="text-gray-400 hover:text-white mr-2" title="Edit"><Edit className="w-4 h-4" /></button>
                                                <button className="text-red-400 hover:text-red-300" title="Delete"><Trash2 className="w-4 h-4" /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* Posts List */}
            {activeTab === "posts" && (
                <div className="bg-zinc-900 rounded-lg p-6">
                    <h2 className="text-xl font-bold mb-6">Your Posts</h2>
                    {tweets.length === 0 ? (
                        <p className="text-gray-400">No posts created yet.</p>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {tweets.map((tweet) => (
                                <div key={tweet._id} className="border border-zinc-800 rounded-lg p-4 bg-zinc-950/50 hover:bg-zinc-900 transition flex gap-4">
                                    <Link href={`/posts/${tweet._id}`} className="flex gap-4 flex-grow group">
                                        {tweet.image && (
                                            <div className="flex-shrink-0">
                                                <img src={tweet.image} alt="Post content" className="w-24 h-24 object-cover rounded-md group-hover:opacity-80 transition" />
                                            </div>
                                        )}
                                        <div className="flex-grow">
                                            <p className="text-gray-200 mb-2 line-clamp-3 group-hover:text-white transition">{tweet.content}</p>
                                            <div className="flex items-center gap-4 text-sm text-gray-400">
                                                <span>{new Date(tweet.createdAt).toLocaleDateString()}</span>
                                                <span className={`px-2 py-0.5 rounded text-xs ${tweet.isPublished ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                                    {tweet.isPublished ? 'Published' : 'Draft'}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                    <div className="flex flex-col gap-2">
                                        <button className="text-gray-400 hover:text-white p-2" title="Edit"><Edit className="w-4 h-4" /></button>
                                        <button onClick={() => handleDeleteTweet(tweet._id)} className="text-red-400 hover:text-red-300 p-2" title="Delete"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function StatCard({ title, value, icon }: { title: string, value: number, icon: React.ReactNode }) {
    return (
        <div className="bg-zinc-900 p-6 rounded-lg flex items-center justify-between border border-zinc-800 hover:border-zinc-700 transition">
            <div>
                <p className="text-gray-400 text-sm">{title}</p>
                <p className="text-2xl font-bold mt-1">{value}</p>
            </div>
            <div className="p-3 bg-zinc-800 rounded-full">
                {icon}
            </div>
        </div>
    );
}
