"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/axios";
import { MoreVertical, Clock, Download } from "lucide-react";

interface VideoCardProps {
    id?: string;
    _id?: string; // Backend uses _id
    title: string;
    thumbnail: string;
    channelName?: string;
    channelAvatar?: string;
    channelId?: string; // New prop for dynamic link
    views?: number;
    uploadedAt?: Date;
    createdAt?: string;
    duration?: string | number;
    isLive?: boolean;
    description?: string;
    instructor?: any;
    owner?: any; // Added to support video owner object
    videoFile?: string; // Added for download support
}

function formatDuration(duration: string | number | undefined): string {
    if (typeof duration === 'undefined') return '';

    // If it's already a formatted string (e.g. "10:05"), return it
    if (typeof duration === 'string' && duration.includes(':')) return duration;

    // Convert seconds to MM:SS
    const totalSeconds = typeof duration === 'string' ? parseFloat(duration) : duration;
    if (isNaN(totalSeconds)) return '';

    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);

    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export default function VideoCard({
    id,
    _id,
    title,
    thumbnail,
    channelName,
    channelAvatar,
    channelId,
    views = 0,
    uploadedAt,
    createdAt,
    duration,
    isLive = false,
    instructor,
    owner,
    videoFile
}: VideoCardProps) {
    const { isLoggedIn } = useAuth();

    // Normalize props
    const videoId = _id || id || "";
    // Priority: Explicit props -> Owner object -> Instructor object -> Fallback
    const displayChannelName = channelName || owner?.fullName || instructor?.fullName || "Instructor";
    const displayAvatar = channelAvatar || owner?.avatar || instructor?.avatar || "https://picsum.photos/seed/avatar1/200/200";
    const displayChannelId = channelId || owner?._id || instructor?._id || "";

    const date = uploadedAt || (createdAt ? new Date(createdAt) : new Date());

    // Determine target URL:
    const targetUrl = isLive && !isLoggedIn
        ? `/login?redirect_url=/live/${videoId}`
        : (isLive ? `/live/${videoId}` : `/watch/${videoId}`);

    const channelUrl = displayChannelId ? `/channel/${displayChannelId}` : "#";

    const [showMenu, setShowMenu] = useState(false);

    const handleWatchLater = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isLoggedIn) {
            alert("Please login to add to Watch Later");
            return;
        }

        try {
            await api.post(`/users/watch-later/${videoId}`);
            alert("Added/Removed from Watch Later"); // Ideally use a toast
            setShowMenu(false);
        } catch (error) {
            console.error("Error toggling watch later", error);
            alert("Failed to update Watch Later");
        }
    };

    const handleDownload = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        // Since we don't always have the raw video file URL passed as a prop in all usages yet, we might need it.
        // Assuming videoFile prop is added or we alert.
        if (videoFile) {
            window.open(videoFile, '_blank');
        } else {
            alert("Download unavailable for this video.");
        }
        setShowMenu(false);
    };


    return (
        <div className="flex flex-col gap-3 group cursor-pointer w-full relative">
            {/* Thumbnail Wrapper */}
            <Link href={targetUrl} className="relative aspect-video overflow-hidden rounded-xl bg-zinc-800">
                <img
                    src={thumbnail}
                    alt={title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {duration && !isLive && (
                    <div className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-xs font-bold text-white">
                        {formatDuration(duration)}
                    </div>
                )}
                {isLive && (
                    <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded bg-red-600 px-1.5 py-0.5 text-xs font-bold text-white animate-pulse">
                        <span>LIVE</span>
                    </div>
                )}
            </Link>

            {/* Info Section */}
            <div className="flex gap-3 items-start pr-2">
                {/* Avatar */}
                <Link href={channelUrl} className="flex-shrink-0">
                    <img
                        src={displayAvatar}
                        alt={displayChannelName}
                        className="h-9 w-9 rounded-full object-cover border border-zinc-700"
                    />
                </Link>

                {/* Meta */}
                <div className="flex flex-col flex-1 min-w-0">
                    <Link href={targetUrl}>
                        <h3 className="text-sm font-bold text-white line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                            {title}
                        </h3>
                    </Link>
                    <Link href={channelUrl} className="text-xs text-zinc-400 mt-1 hover:text-white transition-colors truncate block">
                        {displayChannelName}
                    </Link>
                    <div className="text-xs text-zinc-400">
                        {views.toLocaleString()} views • {formatDistanceToNow(date, { addSuffix: true })}
                    </div>
                </div>

                {/* Three Dots Menu */}
                <div className="relative flex-shrink-0">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setShowMenu(!showMenu);
                        }}
                        className="p-1 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors"
                        title="More options"
                    >
                        <MoreVertical className="w-5 h-5" />
                    </button>

                    {showMenu && (
                        <div className="absolute right-0 top-full mt-1 w-40 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl overflow-hidden z-30"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={handleWatchLater}
                                className="w-full text-left px-4 py-3 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white flex items-center gap-2"
                            >
                                <Clock className="w-4 h-4" /> Watch Later
                            </button>
                            <button
                                onClick={handleDownload}
                                className="w-full text-left px-4 py-3 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white flex items-center gap-2 border-t border-zinc-800"
                            >
                                <Download className="w-4 h-4" /> Download
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Overlay to close menu when clicking elsewhere - scoped to card but fixed covers screen */}
            {showMenu && (
                <div
                    className="fixed inset-0 z-10 cursor-default"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowMenu(false);
                    }}
                ></div>
            )}
        </div>
    );
}
