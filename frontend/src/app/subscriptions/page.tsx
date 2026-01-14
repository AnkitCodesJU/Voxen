"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/axios";
import Link from "next/link";
import { User } from "lucide-react";

interface SubscribedChannel {
    _id: string; // Subscription ID
    channel: string; // Channel ID (but we might get populated data)
    subscriber: string;
    subscribedChannel: {
        _id: string;
        username: string;
        fullName: string;
        avatar: string;
    };
}

export default function SubscriptionsPage() {
    const { user, isLoggedIn } = useAuth();
    const [channels, setChannels] = useState<SubscribedChannel[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isLoggedIn && user) {
            fetchSubscribedChannels();
        } else {
            setLoading(false);
        }
    }, [isLoggedIn, user]);

    const fetchSubscribedChannels = async () => {
        if (!user) return;
        try {
            // Correct endpoint: /subscriptions/u/:subscriberId
            const res = await api.get(`/subscriptions/u/${user._id}`);
            setChannels(res.data.data);
        } catch (error) {
            console.error("Error fetching subscriptions", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-white flex justify-center items-center h-[50vh]">Loading...</div>;

    return (
        <div className="text-white">
            <h1 className="text-3xl font-bold mb-6">Subscriptions</h1>
            {isLoggedIn ? (
                channels.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {channels.map((sub) => (
                            <Link
                                href={`/channel/${sub.subscribedChannel.username}`}
                                key={sub._id}
                                className="group flex flex-col items-center bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:bg-zinc-800 transition-colors"
                            >
                                <div className="relative mb-4">
                                    {sub.subscribedChannel.avatar ? (
                                        <img
                                            src={sub.subscribedChannel.avatar}
                                            alt={sub.subscribedChannel.fullName}
                                            className="w-24 h-24 rounded-full object-cover border-4 border-zinc-800 group-hover:border-zinc-700 transition-colors"
                                        />
                                    ) : (
                                        <div className="w-24 h-24 rounded-full bg-zinc-700 flex items-center justify-center border-4 border-zinc-800 group-hover:border-zinc-700 transition-colors">
                                            <User className="w-12 h-12 text-zinc-400" />
                                        </div>
                                    )}
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-red-500 transition-colors">
                                    {sub.subscribedChannel.fullName}
                                </h3>
                                <p className="text-sm text-zinc-400">@{sub.subscribedChannel.username}</p>
                                <button className="mt-4 px-4 py-2 bg-zinc-800 rounded-lg text-sm font-medium hover:bg-zinc-700 transition-colors">
                                    View Channel
                                </button>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-4">
                            <User className="w-8 h-8 text-zinc-500" />
                        </div>
                        <h2 className="text-xl font-semibold mb-2">No subscriptions yet</h2>
                        <p className="text-zinc-400 max-w-sm">Tired of missing out? Subscribe to channels to see them here!</p>
                    </div>
                )
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <p className="text-zinc-400 text-lg mb-4">Please sign in to view your subscriptions.</p>
                    <Link href="/login" className="px-6 py-2 bg-red-600 rounded-lg text-white font-medium hover:bg-red-700">
                        Sign In
                    </Link>
                </div>
            )}
        </div>
    );
}
