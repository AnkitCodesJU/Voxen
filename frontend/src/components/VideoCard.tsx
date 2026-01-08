"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/context/AuthContext";

interface VideoCardProps {
    id?: string;
    _id?: string; // Backend uses _id
    title: string;
    thumbnail: string;
    channelName?: string; // Optional as backend might not populate this deeply yet
    channelAvatar?: string;
    views?: number;
    uploadedAt?: Date; // Backend usage
    createdAt?: string; // Backend usage
    duration?: string;
    isLive?: boolean;
    description?: string;
    instructor?: any; // To handle populated instructor
}

export default function VideoCard({
    id,
    _id,
    title,
    thumbnail,
    channelName,
    channelAvatar,
    views = 0,
    uploadedAt,
    createdAt,
    duration,
    isLive = false,
    instructor
}: VideoCardProps) {
    const { isLoggedIn } = useAuth();

    // Normalize props
    const videoId = _id || id || "";
    const displayChannelName = channelName || instructor?.fullName || "Instructor";
    const displayAvatar = channelAvatar || instructor?.avatar || "https://picsum.photos/seed/avatar1/200/200";
    const date = uploadedAt || (createdAt ? new Date(createdAt) : new Date());

    // Determine target URL:
    // If Live and NOT logged in -> Login page with redirect
    // Else -> Direct link
    const targetUrl = isLive && !isLoggedIn
        ? `/login?redirect_url=/live/${videoId}`
        : (isLive ? `/live/${videoId}` : `/watch/${videoId}`);

    return (
        <div className="flex flex-col gap-3 group cursor-pointer w-full">
            {/* Thumbnail Wrapper */}
            <Link href={targetUrl} className="relative aspect-video overflow-hidden rounded-xl bg-zinc-800">
                <img
                    src={thumbnail}
                    alt={title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {duration && !isLive && (
                    <div className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-xs font-bold text-white">
                        {duration}
                    </div>
                )}
                {isLive && (
                    <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded bg-red-600 px-1.5 py-0.5 text-xs font-bold text-white animate-pulse">
                        <span>LIVE</span>
                    </div>
                )}
            </Link>

            {/* Info Section */}
            <div className="flex gap-3 items-start">
                {/* Avatar */}
                <Link href={`/channel/codemaster`} className="flex-shrink-0">
                    <img
                        src={channelAvatar}
                        alt={channelName}
                        className="h-9 w-9 rounded-full object-cover border border-zinc-700"
                    />
                </Link>

                {/* Meta */}
                <div className="flex flex-col">
                    <Link href={targetUrl}>
                        <h3 className="text-sm font-bold text-white line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                            {title}
                        </h3>
                    </Link>
                    <Link href={`/channel/codemaster`} className="text-xs text-zinc-400 mt-1 hover:text-white transition-colors">
                        {channelName}
                    </Link>
                    <div className="text-xs text-zinc-400">
                        {views.toLocaleString()} views • {formatDistanceToNow(date, { addSuffix: true })}
                    </div>
                </div>
            </div>
        </div>
    );
}
