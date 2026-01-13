"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { PlusCircle, Video as VideoIcon, Radio, BarChart2 } from "lucide-react";
import api from "@/lib/axios";
import Link from "next/link";

export default function DashboardPage() {
    const { user, isLoggedIn, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const [stats, setStats] = useState<any>(null);
    const [videos, setVideos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !isLoggedIn) {
            router.push("/login");
        }
    }, [isLoggedIn, authLoading, router]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch Stats
                const statsRes = await api.get("/dashboard/stats");
                setStats(statsRes.data.data);

                // Fetch Videos
                const videosRes = await api.get("/dashboard/videos");
                setVideos(videosRes.data.data.docs);

            } catch (error) {
                console.error("Error fetching dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        if (isLoggedIn) {
            fetchDashboardData();
        }
    }, [isLoggedIn]);

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

            {/* Videos List */}
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
                                            <button className="text-gray-400 hover:text-white mr-2">Edit</button>
                                            <button className="text-red-400 hover:text-red-300">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
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
