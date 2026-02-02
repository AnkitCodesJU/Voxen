"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Upload, X, Image as ImageIcon, FileVideo, FileText, Radio, Lock, Globe } from "lucide-react";
import api from "@/lib/axios";
import { cn } from "@/lib/utils";

type Tab = "video" | "post" | "live";

export default function UploadPage() {
    const { user } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialTab = (searchParams.get("tab") as Tab) || "video";
    const [activeTab, setActiveTab] = useState<Tab>(initialTab);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");

    // Video State
    const [videoTitle, setVideoTitle] = useState("");
    const [videoDesc, setVideoDesc] = useState("");
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [videoThumb, setVideoThumb] = useState<File | null>(null);
    const [isMovie, setIsMovie] = useState(false);
    const [videoPublic, setVideoPublic] = useState(true);

    // Post State
    const [postContent, setPostContent] = useState("");
    const [postImage, setPostImage] = useState<File | null>(null);
    const [postPublic, setPostPublic] = useState(true);

    // Live State
    const [liveTitle, setLiveTitle] = useState("");
    const [liveDesc, setLiveDesc] = useState("");
    const [liveTime, setLiveTime] = useState("");
    const [liveThumb, setLiveThumb] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "video" | "thumb" | "postImage" | "liveThumb") => {
        const file = e.target.files?.[0];
        if (file) {
            if (type === "video") setVideoFile(file);
            else if (type === "thumb") setVideoThumb(file);
            else if (type === "postImage") setPostImage(file);
            else if (type === "liveThumb") setLiveThumb(file);
        }
    };

    const handleVideoUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (!videoTitle.trim() || !videoDesc.trim() || !videoFile || !videoThumb) {
            setError("All video fields are required");
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append("title", videoTitle);
        formData.append("description", videoDesc);
        formData.append("videoFile", videoFile);
        formData.append("thumbnail", videoThumb);
        formData.append("isMovie", String(isMovie));
        formData.append("isPublished", String(videoPublic));

        try {
            await api.post("/videos", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            router.push("/dashboard");
        } catch (err: any) {
            setError(err.response?.data?.message || "Video upload failed");
        } finally {
            setUploading(false);
        }
    };

    const handlePostCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (!postContent.trim()) {
            setError("Post content is required");
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append("content", postContent);
        if (postImage) formData.append("image", postImage);
        formData.append("isPublished", String(postPublic));

        try {
            await api.post("/tweets", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            router.push("/dashboard"); // Or wherever posts are shown
        } catch (err: any) {
            setError(err.response?.data?.message || "Post creation failed");
        } finally {
            setUploading(false);
        }
    };

    const handleLiveCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (!liveTitle.trim() || !liveTime) {
            setError("Title and Start Time are required");
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append("title", liveTitle);
        formData.append("description", liveDesc);
        formData.append("startTime", liveTime);
        if (liveThumb) formData.append("thumbnail", liveThumb);

        try {
            await api.post("/live-classes/create", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            router.push("/dashboard");
        } catch (err: any) {
            setError(err.response?.data?.message || "Live class scheduling failed");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-4 md:p-8 flex justify-center">
            <div className="w-full max-w-3xl bg-zinc-900 rounded-xl border border-zinc-800 shadow-xl overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Create Content</h1>
                    <button onClick={() => router.back()} className="p-2 hover:bg-zinc-800 rounded-full transition">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-zinc-800">
                    <button
                        onClick={() => setActiveTab("video")}
                        className={cn(
                            "flex-1 py-4 text-sm font-medium transition flex items-center justify-center gap-2",
                            activeTab === "video" ? "bg-zinc-800 text-white border-b-2 border-red-600" : "text-zinc-400 hover:text-white"
                        )}
                    >
                        <FileVideo className="w-4 h-4" /> Video / Movie
                    </button>
                    <button
                        onClick={() => setActiveTab("post")}
                        className={cn(
                            "flex-1 py-4 text-sm font-medium transition flex items-center justify-center gap-2",
                            activeTab === "post" ? "bg-zinc-800 text-white border-b-2 border-red-600" : "text-zinc-400 hover:text-white"
                        )}
                    >
                        <FileText className="w-4 h-4" /> Post
                    </button>
                    <button
                        onClick={() => setActiveTab("live")}
                        className={cn(
                            "flex-1 py-4 text-sm font-medium transition flex items-center justify-center gap-2",
                            activeTab === "live" ? "bg-zinc-800 text-white border-b-2 border-red-600" : "text-zinc-400 hover:text-white"
                        )}
                    >
                        <Radio className="w-4 h-4" /> Go Live
                    </button>
                </div>

                <div className="p-8">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded mb-6 text-sm">
                            {error}
                        </div>
                    )}

                    {/* VIDEO FORM */}
                    {activeTab === "video" && (
                        <form onSubmit={handleVideoUpload} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-300">Video File</label>
                                    <div className={cn(
                                        "border-2 border-dashed border-zinc-700 rounded-lg p-6 text-center transition hover:border-red-500 hover:bg-zinc-800/50 cursor-pointer",
                                        videoFile && "border-green-500 bg-green-500/5"
                                    )}>
                                        <input type="file" accept="video/*" onChange={(e) => handleFileChange(e, "video")} className="hidden" id="video-upload" />
                                        <label htmlFor="video-upload" className="cursor-pointer flex flex-col items-center">
                                            {videoFile ? <p className="text-green-400 truncate w-full">{videoFile.name}</p> : <><Upload className="w-8 h-8 mb-2 text-zinc-500" /><span className="text-xs text-zinc-500">Select Video</span></>}
                                        </label>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-300">Thumbnail</label>
                                    <div className={cn(
                                        "border-2 border-dashed border-zinc-700 rounded-lg p-6 text-center transition hover:border-red-500 hover:bg-zinc-800/50 cursor-pointer",
                                        videoThumb && "border-green-500 bg-green-500/5"
                                    )}>
                                        <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "thumb")} className="hidden" id="thumb-upload" />
                                        <label htmlFor="thumb-upload" className="cursor-pointer flex flex-col items-center">
                                            {videoThumb ? <p className="text-green-400 truncate w-full">{videoThumb.name}</p> : <><ImageIcon className="w-8 h-8 mb-2 text-zinc-500" /><span className="text-xs text-zinc-500">Select Thumbnail</span></>}
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <input type="text" value={videoTitle} onChange={(e) => setVideoTitle(e.target.value)} placeholder="Title" className="w-full bg-zinc-800 border-none rounded p-3 text-white focus:ring-2 focus:ring-red-600" />
                            <textarea value={videoDesc} onChange={(e) => setVideoDesc(e.target.value)} placeholder="Description" rows={3} className="w-full bg-zinc-800 border-none rounded p-3 text-white focus:ring-2 focus:ring-red-600 resize-none" />

                            <div className="flex flex-col sm:flex-row gap-6 p-4 bg-zinc-800/50 rounded-lg">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={isMovie} onChange={(e) => setIsMovie(e.target.checked)} className="w-5 h-5 rounded border-zinc-600 text-red-600 focus:ring-red-600 bg-zinc-700" />
                                    <span>This is a Movie</span>
                                </label>
                                <div className="flex items-center gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer text-sm">
                                        <input type="radio" checked={videoPublic} onChange={() => setVideoPublic(true)} className="text-red-600 focus:ring-red-600 bg-zinc-700" />
                                        <Globe className="w-4 h-4" /> Public
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer text-sm">
                                        <input type="radio" checked={!videoPublic} onChange={() => setVideoPublic(false)} className="text-red-600 focus:ring-red-600 bg-zinc-700" />
                                        <Lock className="w-4 h-4" /> Private
                                    </label>
                                </div>
                            </div>

                            <button disabled={uploading} className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition disabled:opacity-50">
                                {uploading ? "Uploading..." : "Upload Video"}
                            </button>
                        </form>
                    )}

                    {/* POST FORM */}
                    {activeTab === "post" && (
                        <form onSubmit={handlePostCreate} className="space-y-6">
                            <textarea value={postContent} onChange={(e) => setPostContent(e.target.value)} placeholder="What's on your mind?" rows={5} className="w-full bg-zinc-800 border-none rounded p-4 text-white focus:ring-2 focus:ring-red-600 resize-none text-lg" />

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-300">Add Image (Optional)</label>
                                <div className={cn(
                                    "border-2 border-dashed border-zinc-700 rounded-lg p-6 text-center transition hover:border-red-500 hover:bg-zinc-800/50 cursor-pointer",
                                    postImage && "border-green-500 bg-green-500/5"
                                )}>
                                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "postImage")} className="hidden" id="post-image" />
                                    <label htmlFor="post-image" className="cursor-pointer flex flex-col items-center">
                                        {postImage ? <p className="text-green-400 truncate w-full">{postImage.name}</p> : <><ImageIcon className="w-8 h-8 mb-2 text-zinc-500" /><span className="text-xs text-zinc-500">Pick an image</span></>}
                                    </label>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-4 bg-zinc-800/50 rounded-lg">
                                <span className="text-sm font-medium text-gray-400">Visibility:</span>
                                <label className="flex items-center gap-2 cursor-pointer text-sm">
                                    <input type="radio" checked={postPublic} onChange={() => setPostPublic(true)} className="text-red-600 focus:ring-red-600 bg-zinc-700" />
                                    <Globe className="w-4 h-4" /> Public
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer text-sm">
                                    <input type="radio" checked={!postPublic} onChange={() => setPostPublic(false)} className="text-red-600 focus:ring-red-600 bg-zinc-700" />
                                    <Lock className="w-4 h-4" /> Private
                                </label>
                            </div>

                            <button disabled={uploading} className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition disabled:opacity-50">
                                {uploading ? "Posting..." : "Create Post"}
                            </button>
                        </form>
                    )}

                    {/* LIVE FORM */}
                    {activeTab === "live" && (
                        <form onSubmit={handleLiveCreate} className="space-y-6">
                            <div className="p-4 bg-blue-900/20 border border-blue-900 rounded-lg text-sm text-blue-200">
                                Info: When you end the live class, it will be automatically recorded and saved as a video.
                            </div>
                            <input type="text" value={liveTitle} onChange={(e) => setLiveTitle(e.target.value)} placeholder="Live Class Title" className="w-full bg-zinc-800 border-none rounded p-3 text-white focus:ring-2 focus:ring-red-600" />
                            <textarea value={liveDesc} onChange={(e) => setLiveDesc(e.target.value)} placeholder="Description" rows={3} className="w-full bg-zinc-800 border-none rounded p-3 text-white focus:ring-2 focus:ring-red-600 resize-none" />

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-300">Thumbnail (Optional)</label>
                                <div className={cn(
                                    "border-2 border-dashed border-zinc-700 rounded-lg p-6 text-center transition hover:border-red-500 hover:bg-zinc-800/50 cursor-pointer",
                                    liveThumb && "border-green-500 bg-green-500/5"
                                )}>
                                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "liveThumb")} className="hidden" id="live-thumb" />
                                    <label htmlFor="live-thumb" className="cursor-pointer flex flex-col items-center">
                                        {liveThumb ? <p className="text-green-400 truncate w-full">{liveThumb.name}</p> : <><ImageIcon className="w-8 h-8 mb-2 text-zinc-500" /><span className="text-xs text-zinc-500">Select Thumbnail</span></>}
                                    </label>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-300">Start Time</label>
                                <input
                                    type="datetime-local"
                                    value={liveTime}
                                    onChange={(e) => setLiveTime(e.target.value)}
                                    className="w-full bg-zinc-800 border-none rounded p-3 text-white focus:ring-2 focus:ring-red-600 [&::-webkit-calendar-picker-indicator]:invert"
                                />
                            </div>

                            <button disabled={uploading} className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition disabled:opacity-50">
                                {uploading ? "Scheduling..." : "Schedule Live Class"}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
